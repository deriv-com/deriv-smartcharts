# 10 — Flutter chart engine (`deriv_chart`) capability map — checked 2026-10-27

Repo: `/Users/behnam/Desktop/flutter-chart-fork` (package `deriv_chart` 0.5.0, `pubspec.yaml:3`), HEAD `0735c609`.
All `file:line` paths are relative to that repo root and were verified by reading/grepping the file. The React wrapper (`@deriv-com/smartcharts-champion`) was NOT analysed here; "engine-only" means "exists in the engine; whether the wrapper exposes it is for the wrapper analyst to check".
Status legend used in the table: **full** (engine implements it end-to-end), **partial**, **engine-only** (implemented but looks unused/experimental/flag-gated), **missing**.

Key architectural fact: the engine picks web vs mobile code paths with `kIsWeb`, not screen size — `Chart` state (`lib/src/deriv_chart/chart/chart.dart:349`), interactive-layer behaviour (`lib/src/deriv_chart/deriv_chart.dart:250`). Since SmartCharts ships a Flutter **web** build, a web host always gets `_ChartStateWeb` + `InteractiveLayerDesktopBehaviour` unless the host injects `interactiveLayerBehaviour`; the mobile-specific panel UI (`chart_state_mobile.dart`) is unreachable from web.

---

## 1. Inventory table

| Feature | Taxonomy row | Status | Evidence (file:line) | Notes |
|---|---|---|---|---|
| Line (tick) chart | 1.1 | full | `lib/src/deriv_chart/chart/data_visualization/chart_series/line_series/line_series.dart:16`; painter `.../line_series/line_painter.dart:13` | `DataSeries<Tick>` |
| Area fill under line | 1.1 | full | `lib/src/theme/painting_styles/line_style.dart:39` (`hasArea`), gradient in `line_painter.dart:38-42`; default themes set `hasArea: true` (`lib/src/theme/chart_default_dark_theme.dart:106`, `chart_default_light_theme.dart:106`) | Area is a LineStyle flag, not a separate series; gradient start/end colours configurable (`line_style.dart:19-22`) |
| Candlestick | 1.1 | full | `.../ohlc_series/candle/candle_series.dart:16`, painter `candle_painter.dart:11` | |
| OHLC bars | 1.1 | full | `.../ohlc_series/ohlc_candle/ohlc_candle_series.dart:16` | |
| Hollow candles | 1.1 | full | `.../ohlc_series/hollow_candle/hollow_candle_series.dart:16` | |
| Heikin-Ashi / Renko / Kagi / P&F / baseline / volume | 1.1 | missing | grep for `heikin|renko|kagi|volume` in `lib/` returns nothing; `Candle` has no volume (`lib/src/models/candle.dart:38-42` high/low only + OHLC) | No volume data model at all |
| `ChartStyle` enum (line/candles/hollow/ohlc) | 1.1 | engine-only | `lib/src/models/chart_style.dart:2` | Exported but not referenced by the engine itself (no `ChartStyle.` usage in `lib/`) — host-side switcher helper |
| Scatter / bar / channel-fill painters | 1.1 | engine-only (internal) | `.../data_painters/scatter_painter.dart:11`, `bar_painter.dart:22`, `line_series/channel_fill_painter.dart:18` | Used only by indicators (PSAR scatter `parabolic_sar_series.dart:35`; MACD/AO/Gator bars; MA-Env fill `ma_env_series.dart:121`) — no public bar/scatter main series |
| Worm chart (lightweight tick sparkline) | 1.1 (other) | engine-only | `lib/src/deriv_chart/chart/worm_chart/worm_chart.dart:16`, exported `lib/deriv_chart.dart:111` | Separate widget: last N ticks, `zoomFactor`, slide animation, area gradient (`worm_chart_painter.dart:138`) |
| Tick vs candle handling | 1.2 | full | `mainSeries: DataSeries<Tick>` + `granularity` int ms (`deriv_chart.dart:100`, `chart.dart:235`); `Candle extends Tick` (`models/candle.dart:7`) | Same pipeline; granularity is "candle ms" or "avg ms between ticks" |
| Sub-minute granularities | 1.2 | full (engine-agnostic) | granularity is arbitrary ms; time grid steps down to 1 s (`lib/src/deriv_chart/chart/x_axis/grid/calc_time_grid.dart:64-71`) | No enum of allowed granularities; host decides |
| Zoom limits tied to granularity | 1.2 | full | `x_axis/x_axis_model.dart:237-241` (`_minMsPerPx = granularity/maxIntervalWidth`, `_maxMsPerPx = granularity/minIntervalWidth`) | Host-configurable `minIntervalWidth`/`maxIntervalWidth`/`msPerPx` (`deriv_chart.dart:138-147`) |
| History lazy loading | 1.3 | partial (host-driven) | `VisibleAreaChangedCallback(leftEpoch,rightEpoch)` `lib/src/misc/callbacks.dart:9`, wired `chart.dart:714`; prepend detection `x_axis_model.dart:337-364`; loading shimmer left of first point `main_chart.dart:659` (`LoadingAnimationArea`) | Engine only reports visible range and detects prepended history (keeps scroll position, extends gaps); fetching is host's job |
| Market-closed time gaps collapsed on x-axis | 1.3 / 6.3 | full | `x_axis_model.dart:346-354` (gap if consecutive entries differ by > max(granularity, 1 min)); `x_axis/gaps/gap_manager.dart` | Gaps removed, not shaded; no session/market-hours shading |
| Animated tick transition | 1.4 | full | `basic_chart.dart:258` `playNewTickAnimation`; `DataSeries.prevLastEntry` `data_series.dart:70`; duration param `deriv_chart.dart:155` | Last point/candle lerps from previous value; guarded against re-entrancy (`basic_chart.dart:150`) |
| Animated y-axis bounds | 1.4 | full | `basic_chart.dart:110-123` (top/bottom bound AnimationControllers), `quoteBoundsAnimationDuration` `deriv_chart.dart:158` | |
| Current-tick blinking dot | 1.4 | full | `main_chart.dart:337-341`, `523-535`; flag `showCurrentTickBlinkAnimation` `deriv_chart.dart:161`; `HorizontalBarrierStyle.hasBlinkingDot` `theme/painting_styles/barrier_style.dart:83` | |
| Smooth continuous scroll vs jump | 1.4 | full | `ChartAxisConfig.smoothScrolling` `lib/src/models/chart_axis_config.dart:73`; `false` swaps to `XAxisWeb` `x_axis/x_axis_wrapper.dart:90-91` | |
| Scroll-to-last-tick button, data-fit button | 1.4 | full | `main_chart.dart:752`, `main_chart.dart:819`; `XAxisModel.enableDataFit` `x_axis_model.dart:428` | |
| Price formatting / pip size | 1.5 | partial | `pipSize` `deriv_chart.dart:96`; `quote.toStringAsFixed(pipSize)` `y_axis/y_grid_label_painter.dart:60`, barrier labels `horizontal_barrier_painter.dart:128` | Fixed-decimals only: no thousands separator, no locale decimal separator, no per-instrument tick size |
| Indicators | 2.1 | full (22 in UI) | registry `lib/src/add_ons/indicators_ui/indicator_config.dart:52-94`; dialog lists 22 (`indicators_ui/indicators_dialog.dart:57-141`) | List in §2; MA has 11 types (`ma_series.dart:105`) |
| Extra TA math not wired to UI | 2.1 | engine-only (dependency) | `deriv_technical_analysis` 1.1.3 (`pubspec.yaml:18`), not vendored; contains ATR, CMO, Bollinger %B & band-width, StdDev, Variance, LSMA, TRIMA, etc. (files under pub-cache `deriv_technical_analysis-1.1.3/lib`) | No ATR/CMO/%B/StdDev indicator configs exist in `lib/src/add_ons/indicators_ui` |
| Indicator persistence (per symbol) | 2.2 | partial | `AddOnsRepository` key `addOns_<Type>_<symbol>` `lib/src/add_ons/add_ons_repository.dart:53`, SharedPreferences load `deriv_chart.dart` `loadSavedIndicatorsAndDrawingTools` | Persistence per symbol, but no named templates / saved study sets |
| Panel sizes persistence | 2.2 / 9.3 | full | `lib/src/deriv_chart/chart/panel_size/panel_size_repository.dart:22` (not symbol-scoped); resizable dividers `resizable_chart_divider.dart:30`, used `chart_state_web.dart:178`, `chart_state_mobile.dart:140` | |
| Drawing tools (legacy) | 2.3 | full (9 tools) | registry `lib/src/add_ons/drawing_tools_ui/drawing_tool_config.dart:32-50`; dialog `drawing_tools_dialog.dart:56-90`; painting via `DrawingToolChart` `main_chart.dart:586-587` | Used when `useDrawingToolsV2 == false` (default `deriv_chart.dart:81`) |
| Drawing tools V2 (interactive layer) | 2.3 | partial (3 tools) | flag branch `main_chart.dart:584`; only `horizontal_drawing_tool_config.dart:103`, `line_drawing_tool_config.dart:121` (→ `TrendLineInteractableDrawing`), `vertical_drawing_tool_config.dart:102` override `getInteractableDrawing`; base throws `drawing_tool_config.dart:76-81` | Others (channel, fibfan, ray, rect, continuous, trend) throw `UnimplementedError` in V2 |
| Magnet / OHLC snapping | 2.4 | missing | no `magnet` anywhere in drawing code; only crosshair snaps to nearest data point (`interactive_layer/crosshair/crosshair_controller.dart:328-339`) and candle-bucket epoch snap (`chart/helpers/functions/snap_epoch.dart:7`, used `x_axis_model.dart:503`) | Legacy `TrendDrawing` uses data-series min/max in range (`drawing_tools/trend/trend_drawing.dart:106-107`), not a magnet |
| Drawing edit: drag handles, select, hover, delete, colour, thickness | 2.3 | full (V2) / partial (legacy) | states `interactive_layer/enums/drawing_tool_state.dart:6` (normal, selected, hovered, adding, dragging, animating, longPressed); floating menu with drag handle + delete `interactive_layer/widgets/selected_drawing_floating_menu.dart:171-205`; legacy `DraggableEdgePoint` `drawing_tools/data_model/draggable_edge_point.dart` | No undo/redo, no lock, no clone (grep `undo` = 0) |
| Drawing persistence | 2.3 | full (per symbol) | same `AddOnsRepository` (`add_ons_repository.dart:53`), JSON via `*.g.dart` | |
| Entry / exit spot markers | 3.1 | full | `MarkerType.entry/entrySpot/exitSpot/exit` `chart/data_visualization/markers/chart_marker.dart:35-71`; drawn `marker_icon_painters/tick_marker_icon_painter.dart:456-466`, `_drawEntrySpot` `:908`; `EntryTickAnnotation` `annotations/barriers/entry_tick_annotation.dart:15` | |
| Barrier / strike lines | 3.2 | full | `HorizontalBarrier` `annotations/barriers/horizontal_barrier/horizontal_barrier.dart:10`; `VerticalBarrier` `vertical_barrier/vertical_barrier.dart:11`; `CombinedBarrier` (h+v) `combined_barrier.dart:16`; `MarkerType.highBarrier/lowBarrier/latestTickBarrier` `chart_marker.dart:96-108` | Out-of-range label pinned with up/down arrow (`horizontal_barrier.dart:51-65`, `horizontal_barrier_painter.dart:199`); value lerp-animated (`horizontal_barrier_painter.dart:88`) |
| Shaded payout/profit zones | 3.3 | partial | Only accumulator band shading (`marker_icon_painters/accumulator_marker_icon_painter.dart:154-188`, 8% opacity) and accumulator indicator band; no generic "shade above/below barrier" annotation (grep `shade` hits only accumulator) | Rise/Fall, Higher/Lower, Touch win-zones not shaded by engine |
| Live P/L on chart | 3.4 | partial | Accumulators: animated profit text `accumulators_barriers/accumulators_indicator_painter.dart:173-235` (`AccumulatorsActiveContract.profit` `accumulators_active_contract.dart:11`); others: only end-of-contract pill `MarkerType.profitAndLossLabel(Fixed)` `chart_marker.dart:115-122`, painter `tick_marker_icon_painter.dart:553` | P/L string supplied by host (`MarkerGroup.profitAndLossText` `markers/marker_group.dart:86`) |
| Expiry / time-to-expiry visual | 3.5 | partial | contract marker with remaining-duration progress ring `tick_marker_icon_painter.dart:716-790`; `MarkerType.exitTime` vertical line + flag `chart_marker.dart:78`; candle close countdown `CandleIndicator(showTimer)` `horizontal_barrier/tick_indicator.dart:35-90`, painter `candle_indicator_painter.dart:61`; annotations extend x-range into the future (`main_chart.dart:74-78`, `305-308`) | No countdown label on time axis; no "drag to set expiry" |
| Contract outcome animation | 3.6 | missing | grep `confetti|celebrat|win|lose` = none; outcome is static green/red pill (`tick_marker_icon_painter.dart:563-574`, `MarkerProps.isProfit` `markers/marker_props.dart:46`) | |
| Multiple open contracts | 3.7 | full | `MarkerGroupSeries(markerGroupList, activeMarkerGroup)` `markers/marker_group_series.dart:21,49,52`; per-group tap `markers/marker_area.dart:82-96` | |
| Accumulator range | 3.8 | full | `AccumulatorIndicator` `accumulators_barriers/accumulators_indicator.dart:7`; closed/recently-closed `accumulators_closed_indicator.dart:7`, `accumulators_recently_closed_indicator.dart:7`; entry spot `accumulators_entry_spot_barrier.dart:49` | Turbo/knock-out/multiplier: only generic barriers + Multipliers icon painter (`marker_icon_painters/multipliers_marker_icon_painter.dart:8`) |
| Accumulator band tap + growth-rate preview | 3.8 / 4.5 | full (engine) | `AccumulatorBarrierController` `accumulators_barriers/accumulator_barrier_controller.dart:23` (`onTap`, `onPressStart`, `previewGrowthRate` `:179`, tap-guide hint `accumulator_barrier_tap_guide.dart`), gesture `accumulator_barrier_gesture_recognizer.dart:11`, overlay mounted `main_chart.dart:588-591`; preview/emphasis/pulse animations `main_chart.dart:203-219`, `models/animation_info.dart:24-42` | Doc at `accumulators_indicator.dart:55-60` says "draggable" but recognizer is tap-only (stale doc); band animates to previewed rate |
| Drag barrier / strike to set it | 4.1 | missing (for contracts) | No drag on `HorizontalBarrier` (grep `drag` in annotations only hits accumulator files). V2 horizontal-line drawing is draggable (`interactive_layer/interactable_drawings/horizontal_line/horizontal_line_interactable_drawing.dart`) | Could be repurposed by a host but has no barrier/contract semantics |
| Click-to-place / one-click trade | 4.2 / 4.3 | missing | only marker tap callbacks (`Marker.onTap`, `ActiveMarker.onTapOutside` `markers/active_marker.dart:26`) | |
| Set duration on time axis | 4.4 | missing | — | |
| Payoff / probability / cones / IV / greeks / vol / ladder / chain | 5.1–5.8 | missing | grep `payout|probab|payoff|greek|implied|volatil|strike` in `lib/src` = 0 | |
| Session shading / news markers | 6.3 / 6.4 | missing | only gap collapsing; `VerticalBarrier`/markers could carry events host-side | |
| Market selector widget (with CLOSED tag) | 6.x (other) | engine-only | `lib/src/widgets/market_selector/market_selector.dart:24`, `closed_tag.dart:21` (hard-coded "CLOSED") | |
| Trade history markers | 7.2 | full (host-fed) | marker groups persist after close; `startTimeCollapsed/exitTimeCollapsed` compact mode `chart_marker.dart:84-90` | Replay (7.1) missing |
| Screenshot / share | 7.4 | missing | no `toImage`/`RenderRepaintBoundary` capture in `lib/src` | |
| Alerts | 8.1 | missing | — | |
| Multiple charts / sync / compare | 9.1/9.2/9.4 | missing (single series) | one `mainSeries` per `Chart`; compare overlay absent | Hosts can instantiate several charts; no built-in sync |
| Keyboard shortcuts | 9.5 | missing | no `KeyboardListener`/`Shortcuts`/`LogicalKeyboardKey` in chart code | |
| Pinch zoom, pan, fling | 10.2 | full | `chart/gestures/custom_gesture_detector.dart:136` (scale), `x_axis_model.dart:512-548` (scale/pan), momentum `x_axis_model.dart:608-614` (`ClampingScrollSimulation`) | |
| Long-press crosshair (500 ms) w/ edge auto-pan | 10.2 | full | `custom_gesture_detector.dart:9,14` (500 ms, 5 px slop); `crosshair_controller.dart:178,197,217`; edge auto-pan `crosshair_controller.dart:363-372` | Chart zooms out slightly while small-screen crosshair is up (`main_chart.dart:318-327`) |
| Desktop hover crosshair, mouse cursors | 10.2 | full | `interactive_layer/interactive_layer.dart:784-785` `MouseRegion`, `crosshair_controller.dart:239,253`; cursors `interactive_layer.dart:1120-1137` | |
| Mouse-wheel zoom/scroll | 10.2 | missing / unverified | no `PointerScrollEvent`/`onPointerSignal` in `lib/` | Trackpad pinch may reach `ScaleGestureRecognizer` via Flutter framework (unverified) |
| Y-axis drag-to-scale | 10.2 / 1.x | full | drag in 70 px label strip `basic_chart.dart:70,553-586`, clamp 0.05–0.49 (`basic_chart.dart:95,99`); programmatic `verticalPaddingFraction` `deriv_chart.dart:174` | |
| Haptics | 10.3 | missing | no `HapticFeedback` in `lib/` | |
| Mobile indicator panel UX (reorder, hide, expand labels) | 10.1 | full on native / unreachable on web | `chart_state_mobile.dart:98` (hide/unhide), title bars `:125-133`; web uses expand only `chart_state_web.dart:191-202` | Selection by `kIsWeb` |
| Crosshair on bottom (indicator) panels | 7.x/2.1 | missing | `bottom_chart.dart:200` commented TODO; crosshair widget only in main interactive layer `interactive_layer.dart:910` | |
| Performance features | 11.1 | partial | binary-search visible window `data_series.dart:95-108`; incremental `MinMaxCalculator` `data_visualization/functions/min_max_calculator.dart`; `CachedIndicator` `indicators_series/abstract_single_indicator_series.dart:77`; 11 `RepaintBoundary`s, 42 `shouldRepaint` overrides | No FPS/perf tooling; `kChartDiagnosticsEnabled` is debug logging only (`lib/src/misc/chart_diagnostics.dart:8`) |
| Accessibility | 11.2 | missing | no `Semantics`/`semanticsBuilder`; all painters `shouldRebuildSemantics => false` (e.g. `custom_painters/chart_painter.dart:61`) | Canvas is invisible to screen readers |
| Localization | 11.3 | partial (EN only) | `lib/l10n/intl_en.arb` 46 strings; `lib/l10n/intl_es.arb` empty (only `@@locale`); `crowdin.yml` | Most on-canvas text is host-supplied; dates `DateFormat` without locale (`chart/helpers/chart_date_utils.dart:42,71,105`) |
| RTL | 11.3 | missing | no `TextDirection.rtl`/`Directionality` handling in `lib/src` | Behaviour under RTL unverified |
| Time zone | 11.3 / 1.x | missing (UTC only) | `x_axis/grid/calc_time_grid.dart:13,36,41,48` `isUtc: true`; `chart_date_utils.dart` `isUtc = true` defaults | |
| Theming | 11.4 | full | `abstract class ChartTheme` (106 getters) `lib/src/theme/chart_theme.dart:12`; `ChartDefaultDarkTheme` / `ChartDefaultLightTheme`; auto-pick by `Theme.of(context).brightness` `chart.dart:420-425`; design tokens `lib/src/theme/design_tokens/*.dart` (~23 k lines generated from `tokens.json`) | Per-series styles: `LineStyle`, `CandleStyle`, `BarrierStyle`, `MarkerStyle`, `GridStyle`, `OverlayStyle`, `ScatterStyle` |
| Onboarding overlays | 11.5 | partial | accumulator one-time tap guide (`accumulator_barrier_tap_guide.dart`, `AccumulatorBarrierController.showTapGuide`, label host-supplied `accumulator_barrier_controller.dart:43`) | Only for accumulators |
| Digit contract support | 3.x (add 3.9 "Digit contracts") | full | `DigitMarkerIconPainter(pipSize)` `marker_icon_painters/digit_marker_icon_painter.dart:38` (last-digit tick markers `:190`); `HorizontalBarrierStyle.lastDigitTextStyle` emphasises last digit of spot `barrier_style.dart:113-124` | No digit-stats widget |
| Multi-stage (Double Rise/Fall) checkpoints | add 3.10 | full | `MarkerType.checkpointLine/checkpointLineCollapsed/checkpointSpot` `chart_marker.dart:130-148`; `paint_checkpoint_line.dart` | |
| Tick counter text ("2/10") on markers | add 3.11 | full | `MarkerTextType.counter` `chart_marker.dart:152-161`; `MarkerStyle.markerCounterPrimaryTextStyle` `theme/painting_styles/marker_style.dart:119` | |

---

## 2. Exact lists

### 2.1 Series / chart types (`lib/src/deriv_chart/chart/data_visualization/chart_series/`)
Main-series capable:
1. `LineSeries` — `line_series/line_series.dart:16` (+ area via `LineStyle.hasArea`)
2. `CandleSeries` — `ohlc_series/candle/candle_series.dart:16`
3. `OhlcCandleSeries` — `ohlc_series/ohlc_candle/ohlc_candle_series.dart:16`
4. `HollowCandleSeries` — `ohlc_series/hollow_candle/hollow_candle_series.dart:16`
(all OHLC share `OHLCTypeSeries` `ohlc_series/ohlc_type_series.dart:11`)
Internal/indicator-only: `OscillatorLineSeries` (`line_series/oscillator_line_series.dart:10`), `BarPainter`, `ScatterPainter`, `ChannelFillPainter`; `SampleMultiSeries` (`indicators_series/sample_multi_series.dart:29`, sample/demo code).
Separate widget: `WormChart` (`worm_chart/worm_chart.dart:16`).
Crosshair highlight painter per type: line `crosshair_line_highlight_painter.dart`, candle `crosshair_candle_highlight_painter.dart`, OHLC `crosshair_ohlc_highlight_painter.dart`, hollow `crosshair_hollow_candle_highlight_painter.dart` (wired e.g. `candle_series.dart:80`).

### 2.2 Indicators — 22 (registry `indicators_ui/indicator_config.dart:52-94`, all 22 in `indicators_dialog.dart:57-141`)
Overlay (default `isOverlay: true`, `indicator_config.dart:38`): Moving Average (`ma_indicator`, 11 MA types: simple, exponential, weighted, hull, zeroLag, timeSeries, wellesWilder, variable, triangular, doubleExponential, tripleExponential — `ma_series.dart:105`), MA Envelope (`ma_env_indicator`), Bollinger Bands (`bollinger_bands`), Donchian Channel (`donchian_channel`), Alligator (+fractals option) (`alligator`), MA Rainbow (`rainbow_indicator`), ZigZag (`zigzag_indicator`), Ichimoku Cloud (`ichimoku_clouds`), Parabolic SAR (`parabolic_sar`), Fractal Chaos Bands (`fcb_indicator`) — 10.
Bottom panel (`isOverlay: false`): RSI (`rsi/rsi_indicator_config.dart:37`), CCI (`commodity_channel_index`), Stochastic Oscillator, ADX (with shading/histogram, `adx_series.dart:140`), DPO, SMI, Williams %R, Awesome Oscillator, MACD, Aroon, ROC, Gator — 12.
Overbought/oversold lines: `indicators_ui/oscillator_lines/oscillator_lines_config.dart`.
Source fields: close/high/low/open/HL2/HLC3/HLCC4/OHLC4 (`indicator_config.dart:123-137`).

### 2.3 Drawing tools
Legacy system (`DrawingToolChart`, default) — 9 tools + 1 mobile variant (`drawing_tool_config.dart:32-50`):
`dt_channel` (3-point parallel channel, `drawing_tools/channel/channel_drawing.dart:26`), `dt_continuous` (continuous line), `dt_fibfan` (Fib fan 38.2/61.8, `fibfan/label.dart:10`, `fibfan_drawing.dart:213-219`), `dt_horizontal`, `dt_line`, `dt_line_mobile` (`line/line_drawing_mobile.dart`), `dt_ray`, `dt_rectangle`, `dt_trend` (data-anchored, `trend/trend_drawing.dart:106`), `dt_vertical`.
V2 interactive layer (`useDrawingToolsV2: true`) — 3 tools: horizontal line, trend line (`dt_line`), vertical line (`interactive_layer/interactable_drawings/{horizontal_line,trend_line,vertical_line}/`), with separate desktop/mobile "adding preview" classes and a start-point pulse animation (`trend_line_adding_preview_desktop.dart:31-112`).
Magnet/snap: none. Undo/redo: none. Persistence: SharedPreferences per symbol.

### 2.4 Marker / annotation types
`MarkerType` (`markers/chart_marker.dart:9-148`) — 21 values: contractMarker, startTime, start, entry, entrySpot, latestTick, previousTick, tick, exitSpot, exit, exitTime, startTimeCollapsed, exitTimeCollapsed, latestTickBarrier, highBarrier, lowBarrier, profitAndLossLabel, profitAndLossLabelFixed, checkpointLine, checkpointLineCollapsed, checkpointSpot.
Marker containers: `Marker` (`markers/marker.dart`), `ChartMarker`, `ActiveMarker` (`active_marker.dart:6`), `MarkerGroup` (`marker_group.dart:25`), `ActiveMarkerGroup` (`active_marker_group.dart:9`), `MarkerSeries` (`marker_series.dart:16`), `MarkerGroupSeries` (`marker_group_series.dart:21`), animated active marker(s) (`animated_active_marker.dart:14`, `animated_active_marker_group.dart:16`), `MarkerProps` (isProfit, isRunning, hasPersistentBorders, markerLabel — `marker_props.dart:41-63`).
Icon painters (`markers/marker_icon_painters/`): `TickMarkerIconPainter` (`:43`, generic contracts incl. barriers between entry/exit `:170`, P&L pill `:553`, progress-ring contract marker `:716`), `DigitMarkerIconPainter` (`:38`), `AccumulatorMarkerIconPainter` (`:31`, shaded barriers `:154`), `AccumulatorsMarkerIconPainter` (`:8`), `MultipliersMarkerIconPainter` (`:8`), `OptionsMarkerIconPainter` (`:8`, legacy single-marker icon).
Annotations (`annotations/barriers/`): `HorizontalBarrier`, `VerticalBarrier`, `CombinedBarrier`, `TickIndicator` (pentagon label, `tick_indicator.dart:16`), `CandleIndicator` (+close countdown, `:35`), `IconTickIndicator` (`:105`), `EntryTickAnnotation`, `AccumulatorIndicator`, `AccumulatorsClosedIndicator`, `AccumulatorsRecentlyClosedIndicator`, `AccumulatorsEntrySpotBarrier`. Last-tick indicator on any series via `DataSeries.lastTickIndicatorStyle` (`data_series.dart:74,153`).
`BarrierStyle` options (`theme/painting_styles/barrier_style.dart`): color, textStyle, isDashed, titleBackgroundColor; Horizontal: labelShape (rectangle|pentagon `:210-215`), labelHeight, labelPadding, hasBlinkingDot, blinkingDotColor, arrowSize, hasArrow, hasLine, secondaryBackgroundColor, labelShapeBackgroundColor, lineColor, lastDigitTextStyle; Vertical: labelPosition auto|right|left (`:219-227`). `HorizontalBarrierVisibility`: normal | keepBarrierLabelVisible | forceToStayOnRange (`horizontal_barrier.dart:51-65`).

### 2.5 Crosshair variants (`interactive_layer/crosshair/crosshair_variant.dart`)
`smallScreen` (vertical gradient line + dot + compact box, default `deriv_chart.dart:211`) and `largeScreen` (full dashed H+V lines, axis labels, separate date/time). Info box shows main-series value only (OHLC for candles; `crosshair_details.dart:64`, `ohlc_type_series.dart:26-108`) with glass blur (`crosshair_details.dart:46-50`); indicator values not shown. Host callback `onCrosshairHover` (`callbacks.dart:44`).

---

## 3. Notable engine capabilities a wrapper might not expose
(Each is a concrete API to grep for in SmartCharts' `chart_app` Dart glue / TS bridge.)
1. `useDrawingToolsV2` flag (`deriv_chart.dart:81`) — V2 interactive layer with hover/select/drag states and floating menu; only 3 tools.
2. `CrosshairVariant.largeScreen` vs `smallScreen` (`crosshair_variant.dart`) and `onCrosshairHover` payload.
3. `interactiveLayerBehaviour` injection (`deriv_chart.dart:221`) — lets a web host force mobile behaviour on touch devices (engine otherwise chooses by `kIsWeb`).
4. `verticalPaddingFraction` programmatic vertical zoom (`deriv_chart.dart:174`) and user drag-to-scale on y-labels.
5. `ChartAxisConfig.smoothScrolling`, `defaultTickOffset`, `maxCurrentTickOffset`, `showFrame`, `showQuoteGrid`, `showEpochGrid`, `defaultIntervalWidth` (`models/chart_axis_config.dart:29-73`).
6. `ChartController` hooks: `getXFromEpoch/getYFromQuote/getEpochFromX/getQuoteFromY`, `toggleXScrollBlock`, `toggleDataFitMode`, `onCompleteTickAnimation`, `scale`, `scroll`, `getMsPerPx`, `getSeriesList/getConfigsList` (`misc/chart_controller.dart:45-92`) — enable host HTML overlays aligned to chart coords.
7. `HorizontalBarrierVisibility.forceToStayOnRange` / `keepBarrierLabelVisible`, `LabelShape.pentagon`, `hasBlinkingDot`, `hasArrow`, `VerticalBarrierLabelPosition`.
8. `lastDigitTextStyle` digit emphasis on spot label (`barrier_style.dart:124`).
9. `CandleIndicator(showTimer: true)` candle-close countdown (`tick_indicator.dart:35-90`).
10. `IconTickIndicator` (icon on price line), `CombinedBarrier`, `EntryTickAnnotation`.
11. `MarkerType.checkpointLine/Spot`, `startTimeCollapsed/exitTimeCollapsed`, `profitAndLossLabelFixed`, `MarkerTextType.counter`, `MarkerProps.markerLabel` (text inside contract marker instead of arrow `tick_marker_icon_painter.dart:790-797`).
12. Accumulator interaction: `AccumulatorBarrierController` (`steps`, `enabled`, `onTap`, `onPressStart`, `previewGrowthRate`, `clearPreview`, `showTapGuide`, `tapGuideLabel`, `retireTapGuide`) and `AccumulatorBarrierStyle` (cursor etc., `accumulator_barrier_style.dart:19`).
13. `AccumulatorsActiveContract.profit/profitUnit/fractionalDigits` animated live P/L.
14. `WormChart` widget; `MarketSelector` / `MarketSelectorButton` / `SymbolIcon` widgets; `DerivChart` "lite" variant without dialogs (`deriv_chart_lite.dart:37`).
15. `PanelSizeRepository` + resizable indicator panels; `IndicatorLabelIcons` customisation (`deriv_chart.dart:228`).
16. MA types beyond SMA/EMA (11 types) and indicator source fields (HL2, HLC3, HLCC4, OHLC4).
17. `LineStyle.areaGradientColors`, `markerRadius`; `dataFitEnabled`, `dataFitPadding`, `showDataFitButton`, `showScrollToLastTickButton`, `loadingAnimationColor`, `opacity`.
18. `currentTickAnimationDuration` / `quoteBoundsAnimationDuration` / `showCurrentTickBlinkAnimation` tuning.
19. TA library math available but not surfaced as indicators: ATR, CMO, Bollinger %B and band width, StdDev, Variance, LSMA (dependency `deriv_technical_analysis` 1.1.3).
20. `ChartTheme` full custom implementation (106 getters) and design-token based dark/light defaults.

---

## 4. Gaps (what a modern options / trading chart would expect)
- Chart types: no Heikin-Ashi, Renko, Kagi, P&F, baseline, step-line, volume bars/profile (no volume in data model).
- Analytics: no payoff diagram, ITM/touch probability, probability cones, expected-move/IV bands, greeks, vol surface, strike ladder, option-chain overlay.
- Contract viz: no generic shaded win/lose zones for Rise/Fall, Higher/Lower, Touch/No-Touch, Ends Between/Outside (only accumulator shading); no win/lose outcome animation; live P/L only for accumulators; no time-to-expiry label on the time axis.
- Trade-from-chart: no draggable barrier/strike annotation, no click-to-place, no drag-to-set-expiry, no payout preview while dragging (only the accumulator growth-rate tap + preview).
- Drawing: no magnet/OHLC snap, no undo/redo, no lock/clone; V2 has only 3 tools, so 6 legacy tools would regress if V2 is adopted; no Fib retracement/extension, pitchfork, text/note, arrow, measure/price-range tools.
- Indicators: 22 is mid-pack; no ATR/StdDev/VWAP/volume-based studies wired; no saved templates; crosshair does not show indicator values and is absent on bottom panels (`bottom_chart.dart:200`).
- Interaction: no mouse-wheel zoom handler, no keyboard shortcuts, no double-tap reset, no haptics.
- Market context: no session/market-hours shading (gaps are collapsed instead), no news/economic markers, no sentiment.
- Layout: single series per chart; no compare, multi-chart grid or crosshair sync; no screenshot/share export.
- Quality: no accessibility semantics; localization is effectively English-only (46 EN strings, empty ES ARB; date labels via `DateFormat` without locale; hard-coded "CLOSED"); no RTL handling; UTC-only time axis; no FPS/perf instrumentation.
- Platform split by `kIsWeb` means the web build always uses desktop behaviours and web chart state unless the host overrides `interactiveLayerBehaviour`; mobile panel features (reorder/hide indicator panels) unreachable on web.
