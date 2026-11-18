# 11 — SmartCharts (@deriv-com/smartcharts-champion) capability map

Checked: 2026-10-27. Repo: worktree `options-chart-competitive-analysis-ea8259` @ `e8243d9c` (master).
Engine: `chart_app/pubspec.yaml` pins `deriv-com/flutter-chart` at `645c87e5`; the local fork `/Users/behnam/Desktop/flutter-chart-fork` is at `0735c609`, one commit ahead (PSAR crash fix). Engine paths below are relative to `flutter-chart-fork/lib/src/`.
Citations are `file:line` relative to the SmartCharts repo root unless prefixed `engine:`. All were read directly; anything not verified is marked "unverified".

Architecture in one line: React/MobX shell (toolbar, dialogs, symbol picker, barriers as DOM overlays, FastMarker DOM overlays) + a Flutter-web app (`chart_app/`, dart2wasm/skwasm with dart2js/canvaskit fallback, `src/types/props.types.ts:25-45`) that renders the canvas via the engine's `DerivChart` widget (`chart_app/lib/deriv_chart_wrapper.dart:268-396`). JS -> Dart via `window.flutterChart.{app,crosshair,feed,config,indicators,drawingTool}` (`chart_app/lib/src/interop/dart_interop.dart:168-189`); Dart -> JS via `window.jsInterop` (`src/store/ChartAdapterStore.ts:108-159`). SmartCharts never fetches data itself; host supplies `getQuotes`/`subscribeQuotes`.

---

## 1. Inventory table

Status: full / partial / engine-only (engine has it, SmartCharts does not expose) / missing. Owning layer: Flutter engine / SmartCharts / both / host.

| Feature | Taxonomy row | Status | Owning layer | Evidence (file:line) | Notes |
|---|---|---|---|---|---|
| Chart types: Area(line), Candle, Hollow, OHLC | 1.1 | partial | both | `src/Constant.tsx:1935-1940`; `chart_app/lib/src/helpers/series.dart:7-32`; engine `models/chart_style.dart:2-14` | 4 types. No Heikin-Ashi, Renko, baseline, step, bar-colored line in engine or SmartCharts. Candle types disabled on tick interval (`src/store/ChartTypeStore.ts:101-122`). README lists 14 legacy ChartIQ types (`README.md:159`) — stale. |
| Area style picker (colour, 3 thicknesses, gradient on/off) | 1.1 / 11.4 | full | both | `src/components/AreaStylePicker.tsx`; `src/constants/areaStyle.ts:14-73`; `src/store/AreaStyleStore.ts:22`; `chart_app/lib/src/models/chart_config.dart:142-191` | Persisted globally in `sc-area-style`. |
| Granularities: 1 tick, 1/2/3/5/10/15/30 m, 1/2/4/8 h, 1 d | 1.2 | partial | SmartCharts (+host data) | `src/Constant.tsx:1952-1994` | 13 options. No sub-minute candles (1s/5s/15s/30s). Bridge treats `<60000ms` as tick and only builds candle series at `>=60000ms` (`chart_app/lib/src/helpers/series.dart:11`, `deriv_chart_wrapper.dart:240`). Host can restrict via `allowedGranularities` (`props.types.ts:310`). |
| Lazy history on scroll-back | 1.3 | full | both | `chart_app/lib/deriv_chart_wrapper.dart:330-335` (loadHistory(1000)); `src/store/ChartAdapterStore.ts:402-417`; `src/feed/Feed.ts:387-446` | 1000-bar pages via host `getQuotes`. `PaginationLoader` overlay (`src/components/Chart.tsx:175-177`). |
| Animated tick transitions / smooth scroll | 1.4 | full | Flutter engine | `deriv_chart_wrapper.dart:152-171, 254-258, 373-378, 393-395`; `src/types/props.types.ts:182-183` | Smooth chart always on (deprecated setting). Durations drop to 30ms with >=2 indicators or >15 min visible. Blinking current-tick dot (`deriv_chart_wrapper.dart:301-306`). |
| Pip precision / last-digit emphasis | 1.5 | full | both | `ChartAdapterStore.ts:365,368`; `props.types.ts:274-282`; `deriv_chart_wrapper.dart:290-293` | `pipSize` from active symbol; `shouldEmphasizeLastDigit` for digit contracts. |
| Indicators: 21 offered in 5 categories | 2.1 | full | both | `src/Constant.tsx:168-421` | List in §2.4. Max 5 active desktop / 2 mobile (`src/store/StudyLegendStore.ts:118-120`). "Prediction" indicators blocked on tick (`src/components/IndicatorsDialog.tsx:161`; `Constant.tsx:2143-2146`). Edit via settings dialog, double-click on chart (`ChartAdapterStore.ts:307-312`), on-chart labels with Quill icons (`deriv_chart_wrapper.dart:363`), tooltip values (`props.types.ts:683`). |
| Gator Oscillator | 2.1 | engine-only | Flutter engine | `src/Constant.tsx:193-202` (commented out), config still wired at `Constant.tsx:1911`; engine `add_ons/indicators_ui/gator/`, `chart_series/indicators_series/gator_series.dart` | Cheapest win: uncomment tree entry + icon (`Constant.tsx:37`). |
| Indicator templates / saved studies | 2.2 | partial | SmartCharts | `src/components/Views.tsx:109-241`; `src/store/ViewStore.ts:18,82,108-173` | "Templates" save studies + chartType + granularity + msPerPx to `chart-views`. `Views` is exported but NOT in default toolbar (`src/components/ChartControls.tsx:18-30`); sample app adds it (`app/index.tsx:542-548`). |
| Drawing tools: Horizontal line, Vertical line, Trend line | 2.3 | partial | both | `src/Constant.tsx:68-80`; `chart_app/lib/src/models/drawing_tool.dart:178-199`; `deriv_chart_wrapper.dart:350-367` (`useDrawingToolsV2: true`) | 3 tools. Floating menu (`props.types.ts:372`), confirmation toast + deletion snackbar with undo (`Chart.tsx:217-218`). Persisted per symbol in Flutter SharedPreferences (`drawing_tool.dart:84-86`). Hidden on replay charts (`deriv_chart_wrapper.dart:355-357`). |
| Ray, Continuous, Trend(channel), Channel, Fib fan, Rectangle | 2.3 | engine-only (V1 only) | Flutter engine | commented: `src/Constant.tsx:69-79`, `drawing_tool.dart:186-199`; engine `add_ons/drawing_tools_ui/{channel,continuous,fibfan,ray,rectangle,trend}/`, `deriv_chart/chart/data_visualization/drawing_tools/*` | Only exist in the V1 drawing system; V2 interactive layer has only 3 `InteractableDrawing`s (engine `deriv_chart/interactive_layer/interactable_drawings/{horizontal_line,trend_line,vertical_line}`). Not cheap. |
| Magnet / snapping | 2.4 | missing | — | grep of engine `interactive_layer/` finds no snap/magnet logic | — |
| Entry/exit spot, start/exit time, tick markers | 3.1 | full (host-driven) | both | `props.types.ts:344` (`contracts_array`); `src/components/Chart.tsx:130-132`; `ChartAdapterStore.ts:540-556`; `chart_app/lib/src/models/chart_config.dart:200-262`; engine `markers/chart_marker.dart:9-148` | Host passes marker groups; Flutter paints with `TickMarkerIconPainter` or `DigitMarkerIconPainter` (`chart_app/lib/src/helpers/marker_painter.dart:10-18`). Missing quotes are interpolated by epoch (`ChartAdapterStore.ts:544-548, 572-627`). |
| Barrier lines (high/low, relative/absolute, title, inline TP/SL label, offscreen arrows) | 3.2 | full | SmartCharts (DOM) | `props.types.ts:219-241`; `src/store/BarrierStore.ts:19-35,134-199`; `src/components/Barrier.tsx:50-88`; `README.md:213-251` | Rendered as React/DOM overlays positioned with `getYFromQuote`, not engine `HorizontalBarrier`. Multiple barriers via array (`Chart.tsx:163-170`). |
| Payout / win-lose zone shading | 3.3 | full | SmartCharts | `BarrierStore.ts:19-35, 280-386` | Shade modes: NONE_SINGLE, NONE_DOUBLE, ABOVE, BELOW, BETWEEN, OUTSIDE with configurable colour. |
| Live P/L on chart | 3.4 | partial | both | `chart_config.dart:257` (`profitAndLossText`); engine `markers/marker_icon_painters/tick_marker_icon_painter.dart:521-534,564-590`; Accumulators P/L in band `props.types.ts:396-401` | Host must compute and pass text; colour from `props.isProfit`. |
| Expiry countdown / time-to-expiry | 3.5 | partial | both | contract-marker progress arc: engine `tick_marker_icon_painter.dart:637-703` fed by `currentEpoch` (`chart_config.dart:256`); exit-time vertical line via `MarkerType.exitTime` (engine `chart_marker.dart:78`) | No explicit expiry clock on the time axis. The "interval duration" setting is a candle-close countdown, not contract expiry (`src/store/TimeperiodStore.ts:152-162`; `chart_app/lib/src/series/time_interval_indicator.dart`). |
| Contract outcome animation (win/lose) | 3.6 | missing (unverified) | — | No win/lose animation found in bridge; engine only has `AnimatedActiveMarker` (selection transition) `markers/animated_active_marker.dart:13` | — |
| Multiple open contracts | 3.7 | full (host-driven) | both | `contracts_array` is a list of marker groups (`chart_config.dart:203-260`) | All groups share one painter picked by the last group's `type` (`chart_config.dart:206`, `marker_painter.dart:11`) — mixing digit and non-digit contracts paints all with one painter. |
| Accumulator ranges (live, closed, tap-to-adjust growth rate, tap hint, P/L) | 3.8 | full | both | `props.types.ts:345-368, 383-516`; `Chart.tsx:134-136`; `ChartAdapterStore.ts:330-344,566-570`; `chart_app/lib/src/models/accumulator_barriers.dart:26-36,201-218` | Native engine annotations `AccumulatorIndicator` / `AccumulatorsRecentlyClosedIndicator` (engine `annotations/barriers/accumulators_barriers/`). |
| Turbo / knock-out ranges | 3.8 | partial | SmartCharts | generic `barriers` with `isSingleBarrier` + shade (`README.md:246`) | No turbo-specific visual; host composes from barriers (unverified how deriv-app does it). |
| Drag barrier to change strike | 4.1 | full | SmartCharts | `src/store/PriceLineStore.ts:116-128`; `onChange` callback `props.types.ts:225`, `BarrierStore.ts:188-189` | `draggable` default true. Engine barriers have no drag. |
| Click-to-place contract / one-click trade | 4.2 / 4.3 | missing | — | no handler found | Accumulators band tap only reports to host (`props.types.ts:353-368`). |
| Set expiry on time axis | 4.4 | missing | — | — | — |
| Payout preview while dragging | 4.5 | partial | host | `onChange` fires during drag (`PriceLineStore.ts:164-169`) | Chart has no payout UI; host must render. Accumulators `previewGrowthRate` moves band ahead of proposal (`props.types.ts:488-495`). |
| Options analytics (payoff, probability, cones, IV, Greeks, chain) | 5.1-5.8 | missing | — | none in SmartCharts or engine | — |
| Market open/closed handling | 6.3 | partial | both | closed styling `Chart.tsx:162`, `ChartStore.ts:441-444`, `chart_config.dart:309-312` (dims spot); open-time countdown `src/components/MarketOpeningTimeCounter.tsx`, `SymbolSelectButton.tsx:108`; notifications `src/store/Notifier.ts:32-58` | Engine collapses x-axis time gaps automatically (engine `x_axis/gaps/gap_manager.dart`, `x_axis/x_axis_model.dart:323`). No session shading. |
| Last-digit stats (last 1000 ticks) | 6.5 (digits) | full | SmartCharts | `src/components/BottomWidget.tsx:14-17`; `src/components/LastDigitStats.tsx:35`; `src/store/LastDigitStatsStore.ts:48` | Bottom widget, enabled by `showLastDigitStats`. |
| Highest / lowest spot marker | 6.5 | full | SmartCharts | `Chart.tsx:171-173`; `src/components/ChartSetting.tsx:160-170` | Line charts only. |
| Contract replay (static) | 7.1 | partial | both | `startWithDataFitMode`, `isLive=false`, `allTicks`, `shouldDrawTicksFromContractInfo` (`props.types.ts:268,317-318,369-370`; `ChartState.ts:333-334`); data-fit button `NavigationWidget.tsx:29-49` | Static review chart, not an animated replay. |
| Historical-date mode | 7.1 | partial | both | `ChartSetting.tsx:151-155`; sample `app/ChartHistory.tsx` | Date picker lives in the host app. |
| Screenshot (PNG) / CSV download | 7.4 | full | SmartCharts | `src/store/ShareStore.ts:27-29,59-114`; lazy `ChartControls.tsx:14` | html2canvas screenshot. No social share link. |
| Price / indicator alerts | 8.1 | missing | — | — | — |
| Multiple charts / sync | 9.1 / 9.2 | missing | — | single global `window.flutterChart` (`props.types.ts:19-56`); crosshair callbacks not wired (see §5) | One Flutter engine instance per page. |
| Saved layouts / templates | 9.3 | partial | SmartCharts | `ViewStore.ts`; per-chart `chart-layout-{id}` `src/store/ChartState.ts:582-614` | Persisted layout only holds `studyItems` + `msPerPx` (LZ-compressed). |
| Compare symbols | 9.4 | missing | — | — | — |
| Keyboard shortcuts | 9.5 | missing | — | only Esc on toasts (`DeletionSnackbar.tsx:56-68`, `DrawingConfirmationToast.tsx:65-79`) | `src/flutter-chart/index.ts:96-106` only filters malformed key events. |
| Mobile layout | 10.1 | partial | both | `isMobile` prop `props.types.ts:261`; `ChartControls.tsx:20,28`; `deriv_chart_wrapper.dart:263-266,369-371` | See §6. |
| Gestures (pinch/pan/long-press crosshair) | 10.2 | full | Flutter engine (+bridge scroll forwarding) | `ChartAdapterStore.ts:206-301`; `CrosshairVariant.smallScreen` `deriv_chart_wrapper.dart:369-371` | Vertical page scroll forwarded when `isVerticalScrollEnabled=false`. |
| Haptics | 10.3 | missing | — | web only | — |
| Low-end performance | 10.4 / 11.1 | partial | both | `deriv_chart_wrapper.dart:80-92,152-171`; WASM build `props.types.ts:27-45` | See §6. |
| Accessibility | 11.2 | partial (weak) | SmartCharts | 38 `aria-`/`role` uses in `src/components` (e.g. `NavigationWidget.tsx:43-62`, `CrosshairToggle.tsx:30`) | Flutter canvas has no semantics enabled (no `ensureSemantics` in `chart_app/lib`). |
| Localization (23 languages) | 11.3 | full (LTR) / partial (RTL) | SmartCharts | `src/Constant.tsx:1996-2111`; `CLAUDE.md` translation section | Arabic offered, but RTL only via `/*! rtl:ignore */` hints and one `[dir='rtl']` rule (`sass/styles/main.scss:396`); no RTL toolchain in repo (unverified host-side). |
| Theming | 11.4 | partial | both | `ChartSetting.tsx:97-114`; `chart_app/lib/src/misc/web_chart_themes.dart:42-47` | Light/dark only + area style. Engine `ChartTheme` has ~111 getters (`engine theme/chart_theme.dart`) not exposed. |
| Onboarding overlays | 11.5 | partial | both | Accumulators tap guide (`props.types.ts:497-511`); indicator "Guide" (`IndicatorsDialog.tsx:351`) | — |
| Crosshair toggle (persisted) | — | full | both | `src/components/CrosshairToggle.tsx:14-31`; `src/store/CrosshairStore.ts:5,25,54`; `crosshairEnabled` prop `props.types.ts:373` | Hidden in mobile toolbar but present in NavigationWidget. |
| Zoom buttons / scale-to-fit / scroll-to-recent | — | full | SmartCharts | `ChartSize.tsx:16-24`; `NavigationWidget.tsx:29-66`; `ScrollToRecent.tsx:13-28` | Wheel zoom `ChartAdapterStore.ts:272-301`. |
| Full screen, help link, network status, server time | — | full | SmartCharts | `src/components/ChartFooter.tsx:31-47` | Footer on by default (`Chart.tsx:109`). |
| Symbol picker / chart title (search, favourites, live price, open countdown) | — | full | SmartCharts | `ChartTitle.tsx:57-90`; `SymbolSelectButton.tsx:84,108`; `src/store/FavoriteStore.ts:6,88` | Host can order markets (`getMarketsOrder`). |
| Notifications | — | full (host renders) | SmartCharts | `onMessage` `props.types.ts:270`; `Notifier.ts:23-58` | Market open/closed/delayed/licence messages. |

---

## 2. Exact lists

### 2.1 Exports from `src/index.ts` (named, `src/index.ts:25-45`; default object `:47-68`)
`Barrier`, `ChartSetting`, `ChartSize`, `ChartTitle`, `ChartMode`, `createObjectFromLocalStorage`, `CrosshairToggle`, `DrawTools`, `Marker` (= `FastMarker`, `:23`), `PendingPromise`, `setSmartChartsPublicPath`, `Share`, `SmartChart`, `StudyLegend`, `Views`, `ToolbarWidget`, `logEvent`, `LogCategories`, `LogActions`. Default export additionally has `FastMarker`. Not exported though documented: Raw Marker API (`README.md:495`).

`SmartChart` ref handle: `hasPredictionIndicators()`, `triggerPopup(cancelCallback)` (`src/components/Chart.tsx:47-65`).

### 2.2 `SmartChart` props (`TChartProps`, `src/types/props.types.ts:243-374`)
Data/callbacks: `getQuotes` (`:245`, sig `:130-137`), `subscribeQuotes` (`:246`, returns unsubscribe `:138-141`), `unsubscribeQuotes` (`:244`, required), `getMarketsOrder` (`:248`), `getIndicatorHeightRatio` (`:249`), `onSettingsChange` (`:262`), `stateChangeListener` (`:263`; 27 STATE events `src/Constant.tsx:2113-2141`), `onMessage` (`:270`), `chartStatusListener` (`:334`), `refreshActiveSymbols` (`:333`), `onGranularityChange` (`:340`), `onChartTypeChange` (`:341`), `onAccumulatorBarrierTap` (`:358`), `onAccumulatorBarrierPress` (`:368`), `clearChart` (`:295`).
Chart state: `id`, `symbol`, `granularity`, `chartType`, `startEpoch`, `endEpoch`, `scrollToEpoch`, `zoom`, `maxTick`, `isLive`, `startWithDataFitMode`, `historical`, `isStaticChart`, `anchorChartToLeft`, `feedCall`, `chartData` (`masterData`, `tradingTimes`, `activeSymbols`, `:213-217`), `shouldFetchTradingTimes`, `shouldGetQuotes`, `isConnectionOpened`, `networkStatus`.
Contract viz: `barriers` (`:265`, shape `:219-241`), `contracts_array` (`:344`), `accumulatorBarriers` (`:351`), `contractInfo`, `shouldDrawTicksFromContractInfo`, `allTicks`, `showLastDigitStats`, `shouldEmphasizeLastDigit`.
Restriction: `allowTickChartTypeOnly`, `allowedChartTypes`, `allowedGranularities`, `restrictionMessage` (`:298-316`).
Layout/UI: `chartControlsWidgets`, `topWidgets`, `bottomWidgets`, `toolbarWidget`, `enabledChartFooter`, `enabledNavigationWidget`, `isMobile`, `settings` (`TSettings :172-187`: countdown, historical, lang/language, minimumLeftBars, position, enabledNavigationWidget, isAutoScale, isHighestLowestMarkerEnabled, isSmoothChartEnabled(deprecated), theme, activeLanguages, whitespace), `translationsCdnUrl`, `enableRouting`, `drawingToolFloatingMenuPosition`, `crosshairEnabled`, `children`.
Scale/margins: `yAxisMargin`, `verticalPaddingFraction`, `should_zoom_out_on_yaxis`, `margin`, `leftMargin`, `isVerticalScrollEnabled`, `enableScroll`, `enableZoom`, `isAnimationEnabled`.
Probably no-op: `isAnimationEnabled`, `enableScroll`, `enableZoom` are stored (`src/store/ChartState.ts:314, 464-470`) but no consumer found by grep (unverified no-op).
No `onCrosshairChange` prop exists. README documents `onExportLayout`, `importedLayout` (`README.md:181-182`) and `crosshair` (`:189`) which are not in `TChartProps` (stale docs).

### 2.3 Chart types / intervals
Chart types (`src/Constant.tsx:1935-1940`): `line` (labelled "Area"), `candles`, `hollow`, `ohlc`.
Intervals (`src/Constant.tsx:1952-1994`): tick 0; minutes 60,120,180,300,600,900,1800; hours 3600,7200,14400,28800; day 86400. Total 13. No 1s/5s/15s/30s.

### 2.4 Indicators offered (21) — `src/Constant.tsx:168-421`
Momentum (8): Awesome Oscillator, Detrended Price Oscillator, MACD, Price ROC, RSI, Stochastic Oscillator, Stochastic Momentum Index, Williams %R.
Trend (6): Aroon, ADX/DMS, CCI, Ichimoku Clouds, Parabolic SAR, Zig Zag.
Volatility (2): Bollinger Bands, Donchian Channel.
Moving averages (3): Moving Average, MA Envelope, Rainbow MA.
Others (2): Alligator, Fractal Chaos Band.
MA type options (11): simple, exponential, weighted, hull, zeroLag, timeSeries, wellesWilder, variable, triangular, doubleExponential, tripleExponential (`Constant.tsx:524-536`). Price field options (8) `:513-522`.
Engine-only: Gator (config present `Constant.tsx:1911`, tree entry commented `:193-202`). Engine has 22 indicator UIs in `add_ons/indicators_ui/` (21 + gator).

### 2.5 Drawing tools
Offered (3): Horizontal line, Vertical line, Trend line (`src/Constant.tsx:73-75`). Engine V1-only (6): channel, continuous, fibfan, ray, rectangle, trend.

### 2.6 Persistence keys (localStorage)
`chart-layout-{id}` (LZ-compressed studyItems + msPerPx; `ChartState.ts:582-614`) — note CLAUDE.md/README say `layout-{id}` (stale). `chart-views` (templates, `ViewStore.ts:18,82`), `cq-favorites` (`FavoriteStore.ts:6,88`), `sc-area-style` (`AreaStyleStore.ts:22`), `is_crosshair_enabled` (`CrosshairStore.ts:5`), `current_chart_lang` (`ChartSettingStore.ts:181-182`), `predictionIndicators` (`StudyLegendStore.ts:394-395`). Drawings + bottom-panel heights in Flutter SharedPreferences (`drawing_tool.dart:84-86`; engine `deriv_chart/deriv_chart.dart:322`). Host app persists `smartchart-setting` (`app/index.tsx:69,352,499`); the sample app still reads a legacy `layout-${chartId}` key (`app/index.tsx:349`).

---

## 3. The bridge (what is wired)

JS -> Dart surface (`dart_interop.dart:19-165`; TS type `props.types.ts:670-730`):
- `app`: getXAxisHeight, getYAxisWidth, getCurrentTickWidth, newChart, getTooltipContent, getIndicatorHoverIndex, getXFromEpoch/getYFromQuote/getEpochFromX/getQuoteFromY, scale, scroll, scrollToLastTick, toggleXScrollBlock, toggleDataFitMode, addOrUpdateIndicator.
- `config`: updateAccumulatorBarriers, updateTheme, newChart, updateChartStyle, updateAreaStyle, setRemainingTime, updateContracts, updateLiveStatus, updateLastDigitEmphasis, updateVerticalPaddingFraction, updateCrosshairVisibility, updateLeftMargin, updateRightPadding, toggleTimeIntervalVisibility, setSymbolClosed.
- `feed`: onTickHistory, onNewTick, onNewCandle. `indicators`: removeIndicator, clearIndicators. `drawingTool`: updateFloatingMenuPosition, startAddingNewTool, cancelAddingNewTool, removeDrawingTool, clearDrawingToolSelect, clearDrawingTool, getDrawingToolsRepoItems. `crosshair`: coordinate converters only.
Dart -> JS (`ChartAdapterStore.ts:108-153`): onChartLoad, onMainSeriesPaint, onVisibleAreaChanged, onQuoteAreaChanged, onAccumulatorBarrierTap/Press, loadHistory, indicators.onRemove/onEdit/onSwap, drawingTool.onUpdate/onLoad/onToolAdded/onRemove/onStateChanged.

Engine features wired into `DerivChart` (`deriv_chart_wrapper.dart:268-396`): main series (Line/Candle/Hollow/OHLC; custom `CustomLineSeries`, `CandlePainter`), annotations (`CurrentTickIndicator`, `BlinkingTickIndicator`, custom `TimeIntervalIndicator`, accumulator bands), `MarkerGroupSeries` (Tick/Digit painters), indicatorsRepo (+ quill label icons), drawingToolsRepo V2 + InteractiveLayer mobile/desktop behaviour, crosshair (show/hide, variant), data-fit, msPerPx, axis config, vertical padding. Disabled engine chrome: data-fit button, scroll-to-last button, blink animation, loading animation (`:390-393`) — replaced by React equivalents.

---

## 4. Engine capabilities not exposed by SmartCharts (candidate cheap wins first)

| # | Engine capability | Engine path | What exposure would take | Cost |
|---|---|---|---|---|
| E1 | Gator Oscillator indicator | `add_ons/indicators_ui/gator/`, `.../indicators_series/gator_series.dart` | Uncomment `src/Constant.tsx:193-202` and icon import `:37`; config + tooltip mapping already exist (`Constant.tsx:1911`, `chart_app/lib/src/models/indicators.dart:143-157`). | very low |
| E2 | Crosshair callbacks `onCrosshairAppeared/Disappeared/Hover` (with epoch/quote converters) | `deriv_chart/deriv_chart.dart:44-46,103-109`; `misc/callbacks.dart:44-50` | Pass them in `deriv_chart_wrapper.dart:268`, add `JsInterop.onCrosshair*` externs, add `onCrosshairChange` prop. Enables chart sync (9.2), external OHLC legend, "price at cursor" payout preview. | low |
| E3 | Tappable markers / active contract marker (`MarkerGroup.onTap`, `ActiveMarkerGroup` + `onTapOutside`, `MarkerGroupSeries.activeMarkerGroup`) | `markers/marker_group.dart:50,89`; `markers/active_marker_group.dart:9-40`; `markers/marker_group_series.dart:31,52`; `markers/animated_active_marker_group.dart` | Set `onTap` when building `MarkerGroup` in `chart_config.dart:236-259`, call back to JS with group id; optional `activeMarkerGroup` for highlight. Gives "tap a contract on chart -> open details/close". | low-medium |
| E4 | Native barrier annotations `HorizontalBarrier`, `VerticalBarrier`, `CombinedBarrier` | `annotations/barriers/horizontal_barrier/horizontal_barrier.dart:10`, `vertical_barrier/vertical_barrier.dart:11`, `horizontal_barrier/combined_barrier.dart:16` | Add `config.updateBarriers` and append to `annotations` (`deriv_chart_wrapper.dart:280-325`). Canvas-synced (no DOM jitter) and Y-range aware; `VerticalBarrier` gives an expiry/time-axis line (3.5). Engine barriers are not draggable, so dragging would stay in DOM or need engine work. | medium |
| E5 | `EntryTickAnnotation`, `IconTickIndicator` (icon on current tick), `CandleIndicator` (price + remaining time) | `annotations/barriers/entry_tick_annotation.dart:15`; `horizontal_barrier/tick_indicator.dart:35,105` | Add to annotations list; `CandleIndicator` could replace custom `TimeIntervalIndicator`. | low |
| E6 | Unused marker painters `OptionsMarkerIconPainter`, `MultipliersMarkerIconPainter`, `AccumulatorsMarkerIconPainter` (legacy `MarkerIconPainter`), `AccumulatorMarkerIconPainter` | `markers/marker_icon_painters/*.dart` | Bridge only switches Tick/Digit (`chart_app/lib/src/helpers/marker_painter.dart:10-18`) and picks one painter for all groups (`chart_config.dart:206`). Per-group painter selection needed for mixed contracts. | low-medium |
| E7 | Full `ChartTheme` token set (~111 getters: grid, axis, candle colours, crosshair, barrier styles) | `theme/chart_theme.dart`, `theme/chart_default_{light,dark}_theme.dart` | Accept a theme-overrides object in `newChart`/`updateTheme` and subclass `WebChartLightTheme` (`chart_app/lib/src/misc/web_chart_themes.dart:42-47`). Enables brand/custom themes, candle colour choice. | medium |
| E8 | `WormChart` lightweight sparkline | `deriv_chart/chart/worm_chart/worm_chart.dart` | Separate Flutter entry or React port; for mini-charts in trade panel/positions. Not a SmartCharts feature today. | medium |
| E9 | V1 drawing tools (channel, continuous, fibfan, ray, rectangle, trend) | `add_ons/drawing_tools_ui/*`, `data_visualization/drawing_tools/*` | V2 (`useDrawingToolsV2: true`, `deriv_chart_wrapper.dart:365`) only supports 3; need new `InteractableDrawing` subclasses in `interactive_layer/interactable_drawings/`. | high |
| E10 | `DerivChartLite` (no dialog deps, smaller bundle) | `deriv_chart/deriv_chart_lite.dart:30-34` | Swap widget in wrapper; SmartCharts already supplies its own repos. Bundle/perf win (unverified size). | low-medium |
| E11 | Resizable bottom indicator panels (persisted fractions) | `deriv_chart/chart/panel_size/panel_size_repository.dart`; `deriv_chart.dart:239,448` | Already active implicitly via DerivChart's internal repo; not surfaced/configurable from JS and interacts with `getIndicatorHeightRatio` (unverified UX). | n/a |
| E12 | Flutter market selector & indicators/drawing dialogs | `widgets/market_selector/`, `add_ons/indicators_ui/indicators_dialog.dart` | Not needed (React equivalents). | — |

Not in engine either (true gaps): Heikin-Ashi, Renko, sub-minute candles, magnet snapping, alerts, compare overlays, options analytics.

---

## 5. Persistence, mobile vs desktop, localisation, theming, a11y, performance

- Persistence: see §2.6. Symbol/chartType/granularity are not in `chart-layout-{id}`; the host owns them (`app/index.tsx:349-389`).
- Mobile (`isMobile`): toolbar hides CrosshairToggle and ChartSize (`ChartControls.tsx:20,28`); controls forced to bottom (`Chart.tsx:117`); max 2 indicators vs 5 (`StudyLegendStore.ts:118-120`); `InteractiveLayerMobileBehaviour` + small-screen crosshair (`deriv_chart_wrapper.dart:263-266,369-371`); different current-tick offsets (`:118-150`); vertical-scroll forwarding to page (`ChartAdapterStore.ts:206-270`); nested symbol list in sample (`app/index.tsx:531`).
- Localisation: 23 languages (`Constant.tsx:1996-2111`): en, bn, de, ar, fr, mn, ru, si, sw, th, id, vi, it, km, ko, pt, tr, uz, zh_cn, pl, zh_tw, es, ta. Catalogues from CDN (`props.types.ts:325-331`). RTL partial/unverified. Engine canvas labels use engine l10n (`flutter-chart-fork/lib/l10n`, unverified coverage).
- Theming: light/dark (`ChartSetting.tsx:97-114`), area style; initial theme seeded via `window.flutterChartTheme` (`chart_config.dart:19-28`).
- Accessibility: some aria labels on React controls; chart canvas has no accessible representation (no Flutter semantics).
- Performance: WASM/skwasm build with JS fallback (`props.types.ts:25-45`); lazy html2canvas/Share/LZString (`ShareStore.ts:63`, `ChartControls.tsx:14`, `ChartState.ts:586`); animation duration throttling (`deriv_chart_wrapper.dart:152-171`); "low animation" UA heuristic (`:80-92`, flags UAs without Android/iPhone/iPad/Mac/Windows); history pages of 1000 (`:334`). No fps/tps benchmarks in repo (unverified).

---

## 6. Sample app (`app/`)

`app/index.tsx` connects to Deriv WS (`red.derivws.com`, `:76-79`), fetches active symbols + trading times, and renders `SmartChart` with: custom top widgets (ChartTitle with nested list on mobile, historical date picker `ChartHistory`, Notification) (`:529-536`), ChartSetting as `chartControlsWidgets` (`:537`), floating ToolbarWidget with ChartMode, StudyLegend, Views, DrawTools, Share (`:542-548`), network monitor/reconnect (`:490-495`), settings persistence + language-via-URL reload (`:497-516`), custom `getIndicatorHeightRatio` (`:628-639`), a historical `Marker` (`:642-648`), and an Accumulators demo with growth-rate stepper and tap guide (`:419-488, 571-596`). It does NOT demo `barriers`, `contracts_array` markers, digit stats or replay mode.

---

## 7. Gaps vs a modern options chart

1. No options analytics at all (5.1-5.8): no payoff diagram, probability of touch/ITM, cones, expected-move bands — engine has no primitives either; would be new engine annotations (e.g. a shaded probability band could reuse `channel_fill_painter.dart` patterns).
2. Trade-from-chart is limited to dragging barriers (4.1); no click-to-place, no expiry-on-time-axis selection, no in-chart payout preview.
3. Contract visualisation is host-assembled: markers/P&L text/progress arc exist but host must compute and push them; no win/lose outcome animation, no explicit expiry countdown on the time axis; barriers are DOM overlays (possible lag vs canvas during animation, unverified).
4. Only 4 chart types and 13 intervals; no sub-minute candles, no Heikin-Ashi/Renko.
5. Only 3 drawing tools; no magnet; 21 indicators with a hard cap of 5 (2 on mobile).
6. No alerts, no compare, no multi-chart/sync (single global Flutter instance), no keyboard shortcuts.
7. Market context absent: no sentiment, social feed, news/calendar markers, session shading.
8. Weak accessibility (canvas), RTL unverified, theming limited to light/dark.
9. Docs drift: README chart-type list, `onExportLayout`/`importedLayout`/`crosshair`, Raw Marker API and the `layout-{id}` key are stale; `isAnimationEnabled`/`enableScroll`/`enableZoom` appear to be no-ops.
