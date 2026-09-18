import 'dart:async';

import 'package:chart_app/src/interop/js_interop.dart';
import 'package:chart_app/src/models/chart_feed.dart';
import 'package:deriv_chart/core_chart.dart';
import 'package:flutter/material.dart';

/// Builds the Accumulators barrier band from the payload JS pushes through
/// `config.updateAccumulatorBarriers`.
///
/// This is the web counterpart of `AccumulatorAnnotationBuilder` +
/// `TradeChart._scheduleBarrierUpdate` in deriv_trader: the same annotations,
/// the same state machine and the same tick-anchored delay, so both platforms
/// render Accumulators identically.
///
/// The host sends raw contract fields rather than an explicit status; the state
/// is inferred here:
///
///  * `exitSpot` + `exitEpoch` → [AccumulatorsRecentlyClosedIndicator]
///  * `isSold`, no exit data yet → [AccumulatorIndicator] without P/L (settling)
///  * `profit` present → [AccumulatorIndicator] with the P/L overlay
///  * otherwise → [AccumulatorIndicator] alone (pre-trade proposal)
class AccumulatorBarriersModel extends ChangeNotifier {
  /// Initialize.
  AccumulatorBarriersModel(this._feedModel) {
    _feedModel.addListener(_onFeedChanged);
  }

  final ChartFeedModel _feedModel;

  /// How long a barrier update is held back when the host doesn't say.
  ///
  /// Barriers and the tick they belong to arrive on separate messages; applying
  /// them the moment they land makes the band jump ahead of the spot. Delaying
  /// to just after the tick renders keeps the two in step.
  static const int _defaultBarrierDelayMs = 500;

  /// Hides the spot label, its line and the blinking dot, leaving only the
  /// band. Mirrors `AccumulatorAnnotationBuilder._hiddenSpotStyle` — minus its
  /// `hasBlinkingDot: false`, which is already the default.
  static const HorizontalBarrierStyle _hiddenSpotStyle = HorizontalBarrierStyle(
    labelShape: LabelShape.pentagon,
    hasLine: false,
    color: Colors.transparent,
    lineColor: Colors.transparent,
    labelShapeBackgroundColor: Colors.transparent,
    textStyle: TextStyle(color: Colors.transparent),
  );

  ChartAnnotation<ChartObject>? _annotation;

  /// The annotation currently on the chart, or null when there is no
  /// accumulator band to draw.
  ChartAnnotation<ChartObject>? get annotation => _annotation;

  Timer? _delayTimer;

  /// When the most recent tick reached us. The delay is measured from here, not
  /// from when the barriers arrived, so a barrier update that is already late
  /// is applied straight away.
  DateTime? _lastTickReceiveTime;
  int? _lastTickEpoch;

  void _onFeedChanged() {
    final int? epoch =
        _feedModel.ticks.isEmpty ? null : _feedModel.ticks.last.epoch;

    if (epoch != _lastTickEpoch) {
      _lastTickEpoch = epoch;
      _lastTickReceiveTime = DateTime.now();
    }
  }

  /// Applies a new barrier payload. A null [payload] clears the band.
  void updateBarriers(JSAccumulatorBarriers? payload) {
    if (payload == null) {
      _reset();
      return;
    }

    final _BarrierSnapshot? snapshot = _BarrierSnapshot.fromPayload(payload);
    if (snapshot == null) {
      _schedule(null, payload.barrierDelayMs);
      return;
    }

    final double? exitSpot = payload.exitSpot;
    final int? exitEpoch = payload.exitEpoch;

    // Closed: the band spans the tick before the exit to the exit itself, so
    // it stops at the knockout instead of trailing the spot to the right edge.
    if (exitSpot != null && exitEpoch != null) {
      _schedule(
        _buildClosed(snapshot, exitSpot, exitEpoch * 1000),
        payload.barrierDelayMs,
      );
      return;
    }

    // Settling: sold, but the exit tick hasn't come back yet. The contract's
    // POC keeps streaming for up to ~105s with a profit that no longer moves,
    // so the band stays and the P/L overlay goes — deriv_trader lands in the
    // same place by falling back to its proposal band for this window.
    final bool isSettling = payload.isSold ?? false;

    // A proposal update carries recalculated barriers and would cancel a
    // pending timer before the red barrier-hit state ever rendered, so apply
    // that one immediately.
    final bool barrierHit = snapshot.profit == null && snapshot.isBarrierHit;

    _schedule(
      _buildRunning(snapshot, showProfit: !isSettling),
      payload.barrierDelayMs,
      immediate: barrierHit,
    );
  }

  AccumulatorIndicator _buildRunning(
    _BarrierSnapshot snapshot, {
    required bool showProfit,
  }) =>
      AccumulatorIndicator(
        Tick(epoch: snapshot.spotEpochMs, quote: snapshot.spot),
        highBarrier: snapshot.highBarrier,
        lowBarrier: snapshot.lowBarrier,
        highBarrierDisplay: snapshot.highBarrierDisplay,
        lowBarrierDisplay: snapshot.lowBarrierDisplay,
        barrierSpotDistance: snapshot.barrierSpotDistance,
        barrierEpoch: snapshot.barrierEpochMs,
        style: _hiddenSpotStyle,
        activeContract: showProfit ? snapshot.activeContract : null,
      );

  AccumulatorsRecentlyClosedIndicator _buildClosed(
    _BarrierSnapshot snapshot,
    double exitSpot,
    int exitEpochMs,
  ) =>
      AccumulatorsRecentlyClosedIndicator(
        Tick(epoch: exitEpochMs, quote: exitSpot),
        highBarrier: snapshot.highBarrier,
        lowBarrier: snapshot.lowBarrier,
        highBarrierDisplay: snapshot.highBarrierDisplay,
        lowBarrierDisplay: snapshot.lowBarrierDisplay,
        barrierSpotDistance: _formatDistance(
          snapshot.highBarrier - exitSpot,
          snapshot.highBarrierDisplay,
        ),
        barrierEpoch: _priorTickEpochMs(exitEpochMs) ?? exitEpochMs,
        barrierEndEpoch: exitEpochMs,
        activeContract: snapshot.activeContract,
      );

  /// Epoch (ms) of the last tick before [exitEpochMs] — the tick the exit
  /// barriers were measured against, and where the closed band starts.
  int? _priorTickEpochMs(int exitEpochMs) {
    for (int i = _feedModel.ticks.length - 1; i >= 0; i--) {
      final int epoch = _feedModel.ticks[i].epoch;
      if (epoch < exitEpochMs) {
        return epoch;
      }
    }
    return null;
  }

  /// Applies [next] after the remaining delay, or straight away when the tick
  /// it belongs to has already rendered.
  void _schedule(
    ChartAnnotation<ChartObject>? next,
    int? barrierDelayMs, {
    bool immediate = false,
  }) {
    if (next == null && _annotation == null) {
      return;
    }

    _cancelPending();

    if (immediate) {
      _setAnnotation(next);
      return;
    }

    final DateTime? tickTime = _lastTickReceiveTime;
    if (tickTime != null) {
      final Duration delay =
          Duration(milliseconds: barrierDelayMs ?? _defaultBarrierDelayMs);
      final Duration remaining = delay - DateTime.now().difference(tickTime);

      if (!remaining.isNegative) {
        _delayTimer = Timer(remaining, () => _setAnnotation(next));
        return;
      }
    }

    _setAnnotation(next);
  }

  void _setAnnotation(ChartAnnotation<ChartObject>? next) {
    if (identical(_annotation, next)) {
      return;
    }
    _annotation = next;
    notifyListeners();
  }

  void _cancelPending() {
    _delayTimer?.cancel();
    _delayTimer = null;
  }

  void _reset() {
    _cancelPending();
    _setAnnotation(null);
  }

  /// Clears the band, e.g. on a symbol switch.
  void newChart() => _reset();

  @override
  void dispose() {
    _cancelPending();
    _feedModel.removeListener(_onFeedChanged);
    super.dispose();
  }
}

/// The parsed, validated form of a [JSAccumulatorBarriers] payload.
class _BarrierSnapshot {
  const _BarrierSnapshot({
    required this.highBarrier,
    required this.lowBarrier,
    required this.highBarrierDisplay,
    required this.lowBarrierDisplay,
    required this.barrierSpotDistance,
    required this.barrierEpochMs,
    required this.spot,
    required this.spotEpochMs,
    required this.profit,
    required this.currency,
    required this.fractionalDigits,
  });

  /// Returns null when the payload lacks anything needed to draw a band.
  static _BarrierSnapshot? fromPayload(JSAccumulatorBarriers payload) {
    final String? highBarrierDisplay = payload.highBarrier;
    final String? lowBarrierDisplay = payload.lowBarrier;
    final int? barrierEpoch = payload.barrierEpoch;
    final double? spot = payload.spot;
    final int? spotEpoch = payload.spotEpoch;

    if (highBarrierDisplay == null ||
        lowBarrierDisplay == null ||
        barrierEpoch == null ||
        spot == null ||
        spotEpoch == null) {
      return null;
    }

    final double? highBarrier = double.tryParse(highBarrierDisplay);
    final double? lowBarrier = double.tryParse(lowBarrierDisplay);

    if (highBarrier == null || lowBarrier == null) {
      return null;
    }

    return _BarrierSnapshot(
      highBarrier: highBarrier,
      lowBarrier: lowBarrier,
      highBarrierDisplay: highBarrierDisplay,
      lowBarrierDisplay: lowBarrierDisplay,
      barrierSpotDistance: payload.barrierSpotDistance ??
          _formatDistance(highBarrier - spot, highBarrierDisplay),
      barrierEpochMs: barrierEpoch * 1000,
      spot: spot,
      spotEpochMs: spotEpoch * 1000,
      profit: payload.profit,
      currency: payload.currency ?? '',
      fractionalDigits: payload.fractionalDigits ?? 2,
    );
  }

  final double highBarrier;
  final double lowBarrier;
  final String highBarrierDisplay;
  final String lowBarrierDisplay;
  final String barrierSpotDistance;
  final int barrierEpochMs;
  final double spot;
  final int spotEpochMs;
  final double? profit;
  final String currency;
  final int fractionalDigits;

  /// Whether the spot has left the band — what turns the barriers red.
  bool get isBarrierHit => spot > highBarrier || spot < lowBarrier;

  /// The P/L overlay, or null for a pre-trade proposal.
  AccumulatorsActiveContract? get activeContract => profit == null
      ? null
      : AccumulatorsActiveContract(
          profit: profit,
          profitUnit: currency,
          fractionalDigits: fractionalDigits,
        );
}

/// Rounds [distance] to the decimals [barrierDisplay] is quoted with.
String _formatDistance(double distance, String barrierDisplay) {
  final int dot = barrierDisplay.indexOf('.');
  final int precision = dot >= 0 ? barrierDisplay.length - dot - 1 : 0;
  return distance.abs().toStringAsFixed(precision);
}
