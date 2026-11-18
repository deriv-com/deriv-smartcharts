# 12 — Deriv Trader (derivatives-trader) chart usage — checked 2026-10-27

Repo: `/Users/behnam/Desktop/derivatives-trader`. All paths below are relative to that repo root unless prefixed `smartcharts:` (= `/Users/behnam/Desktop/deriv-smartcharts`) or `flutter-chart:` (= `~/.pub-cache/git/flutter-chart-645c87e5761d6fe941203d5d0cf005a0bfb6efb8`, the commit pinned in `smartcharts:chart_app/pubspec.yaml:13-16`).

Important structural fact: there is **no separate desktop trade page any more**. `packages/trader/src/AppV2` is the trader for desktop *and* mobile; `trade.tsx` branches to `TradeDesktop` / `TradeMobile` / `TradeLandscape` (`packages/trader/src/AppV2/Containers/Trade/trade.tsx:68-74`). Both render the same `TradeChart` (`packages/trader/src/AppV2/Containers/Chart/trade-chart.tsx`). Only Contract Details still splits: desktop gets legacy V1 `Modules/Contract`, phones get `AppV2/Containers/ContractDetails`; both use the same `ReplayChart` (`packages/trader/src/AppV2/Routes/ContractDetailsSwitch.tsx:6-19`).

SmartCharts version actually pinned: `@deriv-com/smartcharts-champion` **2.1.0** (`packages/trader/package.json:87`, `package.json:108`). `docs/tech.md:43` still says 1.13.0 (stale doc).

---

## Product intent summary

- Repo intent docs are manifests only: `OBJECTIVE.md` → `docs/objectives.md`, which states objectives are **"not yet authored"** and no OKRs/success measures exist (`docs/objectives.md:3-7`); delivery is tracked via openspec specs/changes instead (`docs/objectives.md:9-13`).
- Positioning is also **not authored**; the shipped product is "DTrader at dtrader.deriv.com" (`docs/positioning.md:3-9`).
- Spec process: openspec living specs in `openspec/specs/`, changes shipped through spec-to-pr (`SPEC.md:12-31`). Chart-relevant living specs: `contract-details-chart`, `trade-chart-interval`, `chart-quote-subscriptions`, `accumulator-stats-media`, `trade-type-availability`.
- Product = single-page browser front end for Deriv options/derivatives trading; 8-package monorepo; trader = "Trading terminal (desktop + mobile AppV2 variant)" (`docs/tech.md:14-26`).
- Charting is delegated to SmartCharts Champion, "a Flutter Web canvas build, themed only through its settings.theme prop" (`docs/tech.md:43-44`); the trader wraps it with an adapter that maps Deriv WS API to SmartCharts' getQuotes/subscribe interface (`docs/charts/smartcharts-champion-adapter-comprehensive-guide.md:15-34`).
- Trade-type availability is server-driven: a trade type is shown only if the server returns ≥1 tradeable symbol for it (EU accounts may get only Multipliers) (`openspec/specs/trade-type-availability/spec.md` "Trade-type availability is determined by symbol count").
- Digits and Accumulators are tick-chart-only by design; disabled intervals must be inert (`openspec/specs/trade-chart-interval/spec.md` "Disabled time intervals are inert").
- In-flight design direction: an immersive phone-landscape quick-trade surface for **Accumulators only** (auto-hiding chrome, chart fills viewport, drag-gesture param chips) (`openspec/changes/landscape-view-implementation/proposal.md:1-16`).
- Monetisation/engagement features visible in code rather than docs: server-side **automated trading strategies** (Martingale, D'Alembert) on a panel tab, disabled for EU (`packages/trader/src/AppV2/Components/AutomationPanel/automation-config.ts:125-139`, `packages/trader/src/AppV2/Hooks/useIsAutomationEnabled.ts:10-14`), multi-tab trading via `MarketTabs` (`packages/shared/src/utils/analytics/redesign-analytics.ts:27-41`).

---

## Contract types

Source of truth: `getContractTypesConfig` (`packages/shared/src/utils/constants/contract.ts:58-151`), categories (`contract.ts:155-171`), unsupported list (`contract.ts:175-187`), AppV2 list filter (`packages/trader/src/AppV2/Utils/trade-types-utils.tsx:222-241` — hides VANILLA.PUT, TURBOS.SHORT, RISE_FALL_EQUAL as separate list entries because they are tabs/toggles of their parent). Availability per account is further filtered by server symbol counts (spec above).

Durations: units come from the server (`contracts_for`) via `ContractType.getDurationUnitsList` (`packages/trader/src/Stores/Modules/Trading/Helpers/contract-type.ts:264`); the UI unit map is ticks/seconds/minutes/hours/days (`packages/shared/src/utils/helpers/details.ts:43-51`); end-time expiry is supported (`packages/trader/src/AppV2/Components/TradeParameters/Duration/duration-end-time-desktop.tsx`). Multipliers & Accumulators hide duration (`contract.ts:105,119`). Per-contract allowed units/markets are server-driven — exact per-type combos below are **unverified** from code (marked "server").

Markets: Forex, Derived/synthetic (volatility, daily reset, step, range break, jump, crash/boom), stock indices (OTC), commodities, baskets, cryptocurrencies (crypto is multiplier-only) (`packages/trader/src/AppV2/Utils/symbol-categories-utils.ts:10-77`; chart market order puts synthetic first `packages/trader/src/Modules/SmartChart/Utils/chart-utils.ts:10-25`).

| Contract | Enabled? | Durations | Markets | On-chart visuals | Evidence |
|---|---|---|---|---|---|
| Rise/Fall (CALL/PUT; CALLE/PUTE via "Allow equals") | Yes | t/s/m/h/d (server) | server | Pre-trade: invisible relative barrier store (high=0 "follow the price", not draggable, price lines hidden). Contract: entry-spot dot (directional arrow colour), start line (`startTime`/`startTimeCollapsed`), end line (`exitTimeCollapsed`), contract marker, tick counter "n/N" on tick chart, latest-tick + connector to barrier, exit spot + P/L label when finished. No shading. | `contract.ts:59-72`; `trade-store.ts:2267-2283`; `packages/shared/src/utils/helpers/chart-barrier-store.ts:86-96`; `packages/core/src/Stores/Helpers/chart-markers.js:326-560` |
| Higher/Lower | Yes | server | server | Pre-trade **draggable** blue dashed barrier (relative offset) → drag re-prices; contract: solid black/grey barrier line + markers as above; marker quote = barrier price | `contract.ts:73-79`; `trade-store.ts:2274-2279,3273-3275`; `packages/core/src/Stores/contract-store.js:282-317`; `chart-markers.js:363-369` |
| Touch/No Touch | Yes | server | server | Same as Higher/Lower (draggable barrier); marker label "T"/"NT" | `contract.ts:80-85`; `chart-markers.js:580-584` |
| Matches/Differs | Yes | ticks (server) | synthetics (server, unverified) | No barrier line (`main_barrier_flattened` null for digit types); tick-chart only; no entry-spot dot (first tick drawn as middle spot); marker label = predicted digit; last digit emphasised in spot label; last-digit % stats in param picker | `trade-store.ts:2258-2261,2841-2843`; `trade-chart.tsx:121,334-338,353-355`; `chart-markers.js:441-446,120-127` |
| Even/Odd | Yes | ticks | synthetics (unverified) | As digits; label "E"/"O" | `contract.ts:92-97`; `chart-markers.js:589-591` |
| Over/Under | Yes | ticks | synthetics (unverified) | As digits; label = barrier digit | `contract.ts:98-103` |
| Accumulators | Yes | none (open-ended, TP) | synthetics (unverified) | Native **band annotation** (`accumulatorBarriers`): live band (pre-trade proposal or running contract with P/L), frozen closed band held 8 s with exit glow dot + Won/Loss callout drawn by chart; start-time + entry-spot markers; Area + 1-tick only (restriction message); tall y-axis (`verticalPaddingFraction` 0.05); band tappable to open growth-rate picker in phone landscape | `contract.ts:104-111`; `packages/core/src/Stores/contract-trade-store.js:490-640`; `chart-markers.js:642-668`; `trade-chart.tsx:125-141,195-212,330-332,374-376`; `chart-utils.ts:84` |
| Multipliers (up/down) | Yes (only type for some EU accounts) | none | all incl. crypto | Desktop-only hover on Buy shows TP (green), SL (red), Stop-out (orange) inline-label lines with off-screen arrows; contract details draws them while contract open; markers keyed to entry spot; deal cancellation/expiration params symbol-dependent | `contract.ts:112-122`; `packages/shared/src/utils/helpers/limit-orders.ts:57-125`; `trade-store.ts:2228-2244`; `packages/trader/src/AppV2/Components/PurchaseButton/purchase-button.tsx:350-357`; `contract-store.js:266-277` |
| Turbos (long/short tabs) | Yes | server | server | Barrier at `barrier_spot_distance`, **not draggable**; payout-per-point and TP in panel | `contract.ts:123-136`; `trade-store.ts:2278,3153-3160` |
| Vanillas (Call/Put tabs) | Yes | server | server | Strike barrier, not draggable; strike chosen from server list in panel | `contract.ts:137-150`; `trade-store.ts:2278` |
| Lookbacks (LB call/put/high-low), Reset, Asian, High/Low ticks, Only Ups/Downs, Ends/Stays (range), Call/Put spread | **Hidden / unsupported** (listed as TODO) | — | — | Legacy marker/barrier code still exists for viewing old contracts (reset barrier & reset line, SmartTrader blue barrier, CONTRACT_SHADES for ASIAN/RESET/RANGE) | `contract.ts:175-187,420-431`; `packages/shared/src/utils/constants/barriers.ts:2-29`; `contract-store.js:318-340`; `packages/trader/src/Modules/Contract/Containers/replay-chart.tsx:207-209` |

---

## SmartChart props passed

### Trade chart (desktop + mobile + landscape) — `packages/trader/src/AppV2/Containers/Chart/trade-chart.tsx:320-384`
`key='trade-chart'`, `drawingToolFloatingMenuPosition` (mobile {100,100} / desktop {400,200}), `ref` (used for `hasPredictionIndicators()`/`triggerPopup()` when switching to Digits/Accu, `:226-231`), `barriers` (main + portfolio limit-order barriers, `:234-237`), `contracts_array={markers_array}`, `accumulatorBarriers`, `onAccumulatorBarrierTap`, `onAccumulatorBarrierPress`, `bottomWidgets={BottomWidgetsMobile}` (renders null; only harvests `digits` + `tick` into the store, `:28-48`), `showLastDigitStats` (always), `shouldEmphasizeLastDigit={show_digits_stats}`, `chartControlsWidgets={null}`, `chartStatusListener`, `chartType`, `chartData`, `getQuotes`/`subscribeQuotes`/`unsubscribeQuotes` (adapter), `enabledNavigationWidget={!is_phone_viewport}`, `enabledChartFooter={false}`, `id='trade'`, `isMobile`, `isVerticalScrollEnabled={!is_phone_viewport}`, `maxTick` (phone: 8 ticks / 24 candles), `granularity` (forced 0 for digits/accu), `settings` (`:168-184`: `countdown:false`, `isHighestLowestMarkerEnabled:false`, language, `position:'bottom'`, theme, accumulator `whitespace:190` + `minimumLeftBars:3` on phone, barrier types `whitespace:110`), `allowTickChartTypeOnly`, `allowedChartTypes`/`allowedGranularities`/`restrictionMessage` (accumulators), `stateChangeListener={chartStateChange}`, `symbol`, `topWidgets={() => <div/>}` (native market selector replaced by MarketTabs), `isConnectionOpened`, `clearChart={false}`, `toolbarWidget`, `importedLayout`/`onExportLayout`, `shouldFetchTradingTimes={false}`, `hasAlternativeSource` (multiplier hover), `getMarketsOrder`, `verticalPaddingFraction` (accu 0.05), `yAxisMargin` (top 76 phone / 106 desktop), `isLive`, `leftMargin` (328 with desktop drawer open, else 80).

Toolbar (`packages/trader/src/Modules/SmartChart/Components/toolbar-widgets.tsx:21-29`): `ChartMode` (type+interval) and `DrawTools` everywhere; `StudyLegend` (indicators) and `Share` (download) **only on a real desktop OS and non-mobile width** (tablets excluded).

### Replay chart (contract details; desktop V1 and phone V2) — `packages/trader/src/Modules/Contract/Containers/replay-chart.tsx:146-210`
`id='replay'`, `barriers={barriers_array}`, `bottomWidgets` (desktop digit contracts only → Digits/LastDigitPrediction widget), `shouldEmphasizeLastDigit`, `chartControlsWidgets={null}`, `chartType`/`granularity` (from contract duration: ≤1h → line/ticks else candles with 2m..4h granularity; candles fallback if tick history doesn't reach start), `endEpoch`, `startEpoch`, `scrollToEpoch`, `margin`, `isMobile`, `enabledNavigationWidget={!isMobile}`, `enabledChartFooter={false}`, `crosshairEnabled={isMobile}`, `maxTick` (8 mobile), `settings` (countdown false, `assetInformation:false`, highest/lowest marker false; forced light theme when arriving from DBot), `stateChangeListener`, `symbol`, `allTicks`, `topWidgets` (desktop: ChartTitle disabled), `isConnectionOpened`, `isStaticChart`, `shouldFetchTradingTimes={false}`, `verticalPaddingFraction`, `yAxisMargin`, `anchorChartToLeft={isMobile}`, `shouldFetchTickHistory`, `contractInfo`, `accumulatorBarriers`, `isLive={!has_ended}`, `isVerticalScrollEnabled`, `startWithDataFitMode`; children = DOM `FastMarker`s from `createChartMarkers` + reset-contract elements.

### Callbacks
- `chartStateChange` → market closed re-prepare, SET_CHART_MODE persists granularity/type, analytics (`packages/trader/src/Stores/Modules/Trading/trade-store.ts:3512-3538`).
- `chartStatusListener` → debounced loading flag (`trade-store.ts:3436-3443`).
- `onExportLayout`/`importedLayout` → in-memory layout reuse (`trade-store.ts:3487-3510`).
- Barrier `onChange` → `onChartBarrierChange` → `processNewValuesAsync({barrier_1, barrier_2})` (`trade-store.ts:3273-3275`, `chart-barrier-store.ts:128-131`).
- `ToolbarWidgets.onGranularity` guarded by `shouldIgnoreGranularityChange` (`trade-chart.tsx:156-162`, `chart-utils.ts:40-41`); `onChartType` → `updateChartType` (URL param, `contract-trade-store.js:300-318`).
- `onAccumulatorBarrierTap/Press` → growth-rate picker (`packages/trader/src/AppV2/Hooks/useAccumulatorGrowthRatePicker.ts:46,195`).
- Replay `chartStateChange` → `chart_state` used to allow scrollToEpoch (`replay-chart.tsx:41,62`; `packages/core/src/Stores/contract-replay-store.js:166-167`).
- Data adapter: `useSmartChartsAdapter` (`packages/trader/src/Modules/SmartChart/Hooks/useSmartChartsAdapter.ts`), gated on socket open (spec `contract-details-chart`), keyed unsubscribe (spec `chart-quote-subscriptions` CQS-001..003).

---

## Contract lifecycle on the chart

- **Proposal / pre-trade:** main barrier from proposal echo (`trade-store.ts:2267-2283,3153-3165`); accumulator live band from proposal (`contract-trade-store.js:565-581`); multiplier TP/SL/stop-out lines only while mouse hovers Buy on desktop (`purchase-button.tsx:350-357`, `limit-orders.ts:57-125`). Hover shading exists in code (`updateBarrierShade`, `trade-store.ts:2230-2234`) but every supported contract's shade is `NONE_SINGLE`/`NONE_DOUBLE`, so no win zone appears (`barriers.ts:2-29`).
- **Purchase/open (trade chart, Flutter `contracts_array`):** `calculateMarker` builds per-contract group: `startTimeCollapsed` (+ tick counter text "n/N" when tick contract on tick chart), `startTime` for last contract, `entrySpot`, `contractMarker` (direction arrow; label T/NT/E/O/digit/growth%), `exitTimeCollapsed` at expiry for time contracts, `latestTick` + `latestTickBarrier` connector; `isProfit` colours the group (`chart-markers.js:326-560`; P/L label painter colours `flutter-chart:lib/src/deriv_chart/chart/data_visualization/markers/marker_icon_painters/tick_marker_icon_painter.dart:553-590`). All applicable contracts for the current symbol+trade type are drawn (`contract-trade-store.js:628-650`).
- **Sold/expired:** `entrySpot`, start/end collapsed lines, `exitSpot`, `profitAndLossLabel` (e.g. "+1.23 USD") offset ±24 px (`chart-markers.js:399-459`); accumulators: closed band with exit dot + Won/Loss callout, retained 8 s (`contract-trade-store.js:582-626`, `ACCUMULATOR_CLOSED_BAND_RETENTION=8000` at `:38`). Closed positions are auto-removed from the trade chart after 8 s (`trade-chart.tsx:246-275`, `chart-utils.ts:57`).
- **Replay chart (DOM markers):** `createChartMarkers` → SPOT_ENTRY / SPOT_MIDDLE (every tick with value labels, aligned top/bottom) / SPOT_EXIT, LINE_START / LINE_END / LINE_PURCHASE / LINE_RESET (`chart-markers.js:28-150`; `packages/core/src/Stores/Constants/markers.js:11-69`); barrier lines black/grey solid, accumulators band via `accumulatorBarriers` (`contract-store.js:282-317,401+`); multiplier TP/SL/stop-out lines while open (`contract-store.js:266-277`).
- Tick-contract on candle chart (desktop): info notification "This chart display is not ideal for tick contracts" (`contract-trade-store.js:688-690`; `packages/shared/src/utils/helpers/chart-notifications.tsx:5-10`).

---

## Inventory table

| Feature | Taxonomy row | Status | Owning layer | Evidence (file:line) | Notes |
|---|---|---|---|---|---|
| Chart types Area/Candle/Hollow/OHLC | 1.1 | ◐ | SmartCharts | `toolbar-widgets.tsx:23`; `smartcharts:src/Constant.tsx:1935-1940` | No Heikin-Ashi/Renko; Accu & Digits forced to Area (`trade-chart.tsx:121,129-141`) |
| Intervals 1 tick, 1–30 m, 1–8 h, 1 d | 1.2 | ◐ | SmartCharts | `smartcharts:src/Constant.tsx:1952-1992`; `contract-trade-store.js:305-318` | No sub-minute candles; interval synced to URL + localStorage (spec trade-chart-interval) |
| History / scroll-back loading | 1.3 | ? | SmartCharts + trader adapter | `useSmartChartsAdapter.ts` (getQuotes) | Not configured by trader; behaviour in SmartCharts — unverified here |
| Live ticks | 1.4 | ✅ | Flutter | `trade-chart.tsx:378` (`isLive`) | `isAnimationEnabled` left default |
| Pip precision | 1.5 | ✅ | SmartCharts | `packages/trader/src/AppV2/Components/CurrentSpot/current-spot.tsx:79-81` | Last digit emphasised for digits |
| Indicators | 2.1 | ◐ | SmartCharts | `toolbar-widgets.tsx:25-27` | Desktop OS only; hidden on phone/tablet; prediction-indicator popup when switching to Digits/Accu (`trade-chart.tsx:226-231`) |
| Indicator templates | 2.2 | ❌ | — | — | Only whole-layout export/import in memory (`trade-store.ts:3487-3510`) |
| Drawing tools | 2.3 | ✅ | SmartCharts | `toolbar-widgets.tsx:24` | All devices |
| Magnet/snapping | 2.4 | ? | SmartCharts | — | unverified |
| Entry/exit spot markers | 3.1 | ✅ | trader builds / Flutter paints | `chart-markers.js:400-512` | Digits omit entry dot |
| Barrier/strike lines | 3.2 | ✅ | trader + SmartCharts | `trade-store.ts:2267-2283`; `contract-store.js:282-317` | |
| Shaded win/lose zones | 3.3 | ◐ | trader config | `barriers.ts:2-29`; `trade-store.ts:2228-2234` | All active types NONE shade; only accumulator band is a shaded range |
| Live P/L on chart | 3.4 | ◐ | trader + Flutter | `contract-trade-store.js:537-551` (accu band profit); `packages/trader/src/AppV2/Components/ChartProfitLoss/chart-profit-loss.tsx:43-61` | Accu band P/L; phone P/L pill overlay over chart (non-accu); finished P/L label; running non-accu contracts get colour only, no on-chart P/L number (`chart-markers.js:394-397` uses counter text only for tick contracts) |
| Expiry marker / countdown | 3.5 | ◐ | trader + Flutter | `chart-markers.js:508-515` (exitTimeCollapsed); `trade-chart.tsx:170` (`countdown:false`) | End-time vertical marker + tick counter n/N; countdown text only in panels (`ContractCard/contract-card-status-timer.tsx:58`, `DealCancellationRemainingTime`) |
| Outcome animation | 3.6 | ◐ | Flutter + trader | `chart-markers.js:446-459`; `packages/core/src/Stores/portfolio-store.js:446-476` | P/L label, accu Won/Loss callout; phone banner notification Profit/Loss; no celebratory animation found |
| Multiple open contracts | 3.7 | ✅ | trader | `contract-trade-store.js:628-650`; `packages/trader/src/AppV2/Utils/positions-utils.ts` | Filtered to current symbol+trade type; accu one at a time |
| Accumulator / turbo ranges | 3.8 | ✅ | trader payload / Flutter annotation | `contract-trade-store.js:490-626`; `trade-store.ts:3153-3160` | Turbo shown as single barrier, no knock-out zone shading |
| Drag barrier | 4.1 | ◐ | SmartCharts + trader bridge | `chart-barrier-store.ts:95`; `trade-store.ts:2278`; `packages/trader/src/Modules/SmartChart/Hooks/useBarrierTouchDrag.ts:1-87` | Higher/Lower & Touch only; touch support is a trader-side mouse-event shim |
| Click-to-place on chart | 4.2 | ❌ | — | no onClick prop passed (`trade-chart.tsx:320-384`) | |
| One-click trading | 4.3 | ◐ | trader | `purchase-button.tsx:358-` | Single Buy tap in panel; Spain risk disclosure gate (`packages/trader/src/AppV2/Utils/risk-disclosure-constants.ts:1`) |
| Set duration on time axis | 4.4 | ❌ | — | — | Duration only in panel |
| Payout preview while dragging | 4.5 | ◐ | trader | `trade-store.ts:3273-3275` | Drag re-prices; payout shown in Buy button, not on chart |
| **4.6 (new) Tap accumulator band to change growth rate** | 4.6 | ◐ | trader + Flutter | `useAccumulatorGrowthRatePicker.ts:37-46`; `trade-chart.tsx:195-212,331-332`; `packages/trader/src/AppV2/Components/ChartGrowthRate` | Phone landscape only |
| Payoff diagram / ITM prob / cones / IV / Greeks / vol surface / option-chain | 5.1–5.6, 5.8 | ❌ | — | grep found none | Payout-per-point text for Turbos/Vanillas in panel only |
| Strike ladder | 5.7 | ◐ | trader panel | `packages/trader/src/AppV2/Components/TradeParameters/Strike` | Vanilla strike list in panel, not on chart |
| Sentiment / social | 6.1–6.2 | ❌ | — | — | |
| Market hours | 6.3 | ◐ | trader | `chartStateChange` MARKET_STATE_CHANGE `trade-store.ts:3513-3519`; `ClosedMarketMessage` | Closed-market message/countdown banner; no session shading |
| News/econ markers | 6.4 | ❌ | — | — | |
| Synthetic volatility info | 6.5 | ◐ | trader | `packages/trader/src/AppV2/Utils/market-descriptions.ts:67-71` | Text descriptions only |
| Last-digit statistics | 6.6 (new) | ✅ | SmartCharts computes / trader renders | `trade-chart.tsx:28-48,334`; `packages/trader/src/AppV2/Components/TradeParameters/LastDigitPrediction/digit.tsx:16-41` | % over last 1000 ticks with min/max highlight under each digit button |
| Accumulator "Stats" (ticks-stayed-in history) | 6.7 (new) | ✅ | trader | `packages/trader/src/AppV2/Components/AccumulatorStats/accumulator-stats.tsx:105` | Explainer video (spec accumulator-stats-media) |
| Contract replay | 7.1 | ✅ | trader + SmartCharts | `replay-chart.tsx:146-210`; `logic.js:5-27` | Static/live replay of one contract with per-tick labels |
| Trade-history markers | 7.2 | ◐ | trader | `trade-chart.tsx:246-275` | Only running / just-closed (8 s); no past trades on chart |
| Journal | 7.3 | ❌ | — | — | |
| Screenshot/share | 7.4 | ◐ | SmartCharts | `toolbar-widgets.tsx:28` | Desktop OS only |
| Price alerts | 8.1 | ❌ | — | — | |
| Bot / strategy | 8.2 | ◐ | trader + server | `AutomationPanel/automation-config.ts:115-139`; `useIsAutomationEnabled.ts:10-14` | Martingale/D'Alembert server strategies; no chart overlay; off for EU |
| Multiple charts | 9.1 | ❌ | — | — | Multi-*tab* trading (`MarketTabs`) swaps one chart |
| Chart sync | 9.2 | ❌ | — | — | |
| Saved layouts | 9.3 | ◐ | SmartCharts | `trade-chart.tsx:348` (`id='trade'`) | localStorage per id + in-memory export/import |
| Compare symbols | 9.4 | ❌ | — | — | |
| Keyboard shortcuts | 9.5 | ❌ | — | grep found none in trader | SmartCharts-side unverified |
| Portrait-first | 10.1 | ✅ | trader | `trade-mobile.tsx:120-145`; `layout-utils.tsx:50-89` | Landscape only for Accu (`trade.tsx:68-73`) |
| Gestures | 10.2 | ◐ | Flutter + trader | `trade-chart.tsx:350,352`; `useBarrierTouchDrag.ts` | Pinch/pan engine; vertical page scroll on phone; maxTick 8; barrier touch shim; tap-to-maximize in landscape |
| Haptics | 10.3 | ❌ | — | no `vibrate` usage | |
| Low-end perf | 10.4 | ? | — | — | unverified (memoised props noted `trade-chart.tsx:167-184`) |
| Chart–trade panel integration | 10.5 | ✅ | trader | `getChartHeight` `layout-utils.tsx:50-89`; `ChartMaximizeButton`; `ChartProfitLoss` | |
| Localization & RTL | 11.3 | ✅ | both | `trade-chart.tsx:172` | Language passed to chart |
| Theming | 11.4 | ✅ | both | `trade-chart.tsx:174`; `replay-chart.tsx:52-56` | Light/dark; replay forced light from DBot |
| Onboarding/education | 11.5 | ✅ | trader | `trade-mobile.tsx:150`; `AppV2/Components/Guide`, `LandscapeOnboarding` | Guide videos per trade type |
| Analytics on chart interactions | (meta) | ✅ | trader | `packages/trader/src/Stores/Modules/Trading/Helpers/chart.ts:12-17,327-364`; `redesign-analytics.ts:72-80` | ce_chart_types_form_v2, ce_indicators_types_form_v2, ce_drawing_tools_form_v2, ce_market_types_form_v2, ce_crosshair_v2; P/L pill clicks |

---

## Unused SmartCharts / engine capabilities

Exports re-exported by trader (`packages/trader/src/Modules/SmartChart/index.js:8-18`) but not used on the trade page: `Views`, `ChartTitle` (only replay desktop, title disabled), `StudyLegend`/`Share` on phones/tablets. Not imported at all: `CrosshairToggle`, `ChartSize`, `ChartSetting`, `Barrier` component (`smartcharts:src/index.ts:25-45`).

Props/settings available but left unset or turned off (`smartcharts:src/types/props.types.ts:243-373`, `smartcharts:README.md:147-205`):
- `settings.countdown` (time-to-next-bar countdown) — explicitly `false` (`trade-chart.tsx:170`, `replay-chart.tsx:58`).
- `isHighestLowestMarkerEnabled` — `false`, "TODO: Pending UI" (`trade-chart.tsx:171`).
- `enabledChartFooter` — `false`; `chartControlsWidgets` — `null`; native market selector (`topWidgets`) suppressed.
- `enabledNavigationWidget` — off on phones.
- Barrier shading (`ABOVE/BELOW/BETWEEN/OUTSIDE`, `shadeColor`) — supported but every live contract type maps to NONE (`barriers.ts:2-29`).
- `onMessage`, `onSettingsChange`, `onGranularityChange`, `onChartTypeChange`, `zoom`, `enableZoom`, `enableScroll`, `isAnimationEnabled`, `getIndicatorHeightRatio`, `shouldDrawTicksFromContractInfo`, `historical`, `networkStatus`, `refreshActiveSymbols`, `enableRouting`, `feedCall`, `translationsCdnUrl`, `crosshair`/`crosshairEnabled` on trade chart — not passed.
- `onAccumulatorBarrierTap/Press` only active in phone landscape (`useAccumulatorGrowthRatePicker.ts:46`).
- `profitAndLossLabel` running variant: engine has `profitAndLossLabelFixed` marker type (`tick_marker_icon_painter.dart:534`) that trader never emits; code comment notes P/L label historically disabled for an iOS crash (`chart-markers.js:445-447`).
- Chart types limited to 4 in engine; trader further restricts Accu/Digits.

## Desktop vs mobile

| Aspect | Desktop | Phone portrait | Phone landscape | Evidence |
|---|---|---|---|---|
| Layout | Chart fills grid cell (`height:100%`), trade params side panel, positions drawer shifts chart `leftMargin` 328 | Chart height = viewport − header − market strip − param sheet − bottom nav (− stats/digit info/tabs); maximize button reclaims strip+nav | Accumulators only; chart fills `100dvh`, auto-hiding chrome (4 s), floating pill | `trade-desktop.tsx:138-151`; `trade-mobile.tsx:120-145`; `layout-utils.tsx:50-89`; `trade-landscape.tsx:54-106`; `trade-chart.tsx:379-383` |
| Toolbar | ChartMode, DrawTools, Indicators, Download (real desktop OS only) | ChartMode + DrawTools behind ellipsis at bottom | same as phone | `toolbar-widgets.tsx:21-29` |
| Navigation widget / vertical scroll | on / chart scrolls | off / page scrolls | off | `trade-chart.tsx:346,350` |
| Visible ticks | uncapped | maxTick 8 (ticks) / 24 (candles) | 8 | `trade-chart.tsx:240-241,352`; `chart-utils.ts:53-54` |
| Y margin top | 106 | 76 | 76 | `chart-utils.ts:68-69` |
| Barrier drag | mouse | touch shim | touch shim | `useBarrierTouchDrag.ts` |
| Multiplier TP/SL preview | hover on Buy | none (guarded `isMobile`) | none | `purchase-button.tsx:350-357` |
| P/L over chart | none (positions drawer) | P/L pill + open-positions sheet | — | `chart-profit-loss.tsx:43` |
| Current spot header (digits) | no | yes (`CurrentSpot`) | — | `trade-mobile.tsx:122` |
| Accu growth-rate tap on band | no | no | yes | `useAccumulatorGrowthRatePicker.ts:37-46` |
| Settled-contract banner | no (desktop shows tick-chart hint instead) | yes Profit/Loss banner | yes | `portfolio-store.js:446-476`; `contract-trade-store.js:688` |
| Contract details | V1 page overlay + ContractDrawer audit, top ChartTitle, digit bottom widget, crosshair default | V2 ContractCard + replay chart (no top widgets, crosshair on, anchored left, vertical scroll off) + entry/exit, TP/SL, history cards | V2 | `ContractDetailsSwitch.tsx:10-19`; `replay-chart.tsx:91-107,158-188`; `packages/trader/src/AppV2/Containers/ContractDetails/contract-details.tsx:91-112` |

## Feature flags / experiments / responsible trading
- No chart feature flags found; only remote-config flags for analytics providers (`packages/core/src/types/feature-flags.ts:5-11`); PostHog flag evaluation disabled (`packages/core/src/Utils/Analytics/index.ts:82-83`). Automation gated by EU status, not a flag (`useIsAutomationEnabled.ts:10-14`).
- Responsible-trading UX: Spain-only risk disclosure before purchase (`risk-disclosure-constants.ts:1`, `useRiskDisclosure.tsx:28`), balance-aware stake warnings (specs `balance-aware-stake-warning`, `balance-aware-buy-gate`), multiplier stop-out info. Nothing chart-side.
