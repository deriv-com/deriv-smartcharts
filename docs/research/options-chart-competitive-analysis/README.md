# Options-trading charts: competitive analysis of Deriv's chart stack

Research date: **2026-10-27**. Scope: the Deriv chart stack (Flutter engine `flutter-chart-fork`, React wrapper `@deriv-com/smartcharts-champion`, options platform `derivatives-trader`) against 38 competitor products in five segments. Research only; no code was changed in any repository.

Files in this folder:

| File | What it holds |
|---|---|
| `README.md` | This report |
| `deriv-capability-inventory.csv` | 56 Deriv capabilities with status, owning layer and `file:line` evidence (IDs `D01`–`D56`) |
| `comparison-matrix.csv` | 64 taxonomy rows × Deriv + 38 competitors, each cell with a status and source keys |
| `recommendations.csv` | 25 recommendations with layers, files, impact, effort, RICE score, phase, dependencies and risks |
| `evidence/` | The raw research notes from each lane (Deriv layers, live-app observation, five competitor segments), with full detail and per-claim evidence labels |

Citation conventions:

- **Deriv code:** `flutter-chart-fork:` = `/Users/behnam/Desktop/flutter-chart-fork`, `smartcharts:` = this repository, `derivatives-trader:` (or `trader:`) = `/Users/behnam/Desktop/derivatives-trader`. `D##` refers to a row of `deriv-capability-inventory.csv`.
- **Competitors:** keys such as `BIN-S6` resolve in [Sources](#11-sources). Lanes are `BIN` (binary/fixed-time), `BRK` (listed-options brokers), `CRY` (crypto options and up/down markets), `ANA` (options analytics tools) and `GEN` (general charting).
- **Evidence labels** on competitor sources: **V** / verified = official docs, help centre, a public demo, or pages inspected directly; **C** / claimed = marketing, third-party reviews, or an official page seen only through a search excerpt.

---

## 1. Executive summary

**Where Deriv stands.** Deriv's chart is strong at what is unique to Deriv:

- **Tick-level contracts.** The chart handles tick durations natively.
- **Accumulators.** A live, shaded range band shows profit, can be tapped to change the growth rate, and has a one-time tap guide. No competitor reviewed draws an accumulator-style range on the chart.
- **Digit contracts.** The spot's last digit is emphasised, and last-digit statistics are shown.
- **Contract markers.** A rich marker system covers entry and exit spots, start and end lines, tick counters and P/L pills.
- **One trader for all devices.** A single portrait-first trader serves desktop and mobile.

It is behind in three ways:

- **Chart basics** that both binary and general-charting competitors treat as table stakes:
  - 4 chart types, with no Heikin-Ashi.
  - No candles between 1 tick and 1 minute.
  - 21 indicators, against 30–400+ elsewhere.
  - 3 drawing tools.
- **Contract readability on the chart:**
  - No win/lose shading, although the code supports it.
  - No expiry line or countdown before purchase.
  - No live P/L for most open contracts.
- **Options analytics:** Deriv has none of payoff, probability, expected move or Greeks.

**The biggest opportunity.** Deriv's volatility indices have a published, constant volatility (10%–250%, ticks every 1 s or 2 s: [deriv.com/markets/synthetic](https://deriv.com/markets/synthetic/), checked 2026-10-27, verified). That means barrier-touch probability, expected-move cones and payoff "now" curves can be computed exactly on the client, without an option chain or implied volatility. No competitor has a tick-native probability layer:

- thinkorswim's probability cone works on daily charts only (`BRK-S2`).
- ChartIQ's volatility cone is historical or implied (`GEN-CQ10`).

This is Deriv's clearest route to a differentiated chart. It must pass compliance review, because a model probability next to a payout exposes the house margin and can read as advice.

**Top 10 recommendations** (RICE-ranked; full table in [section 8](#8-prioritised-recommendations-and-roadmap)):

| # | ID | Recommendation | Why | Phase |
|---|---|---|---|---|
| 1 | R02 | **Live P/L chip on every open contract** | Engine already paints P/L pills; the trader only emits them after settlement (`trader:packages/core/src/Stores/Helpers/chart-markers.js:441-459`) | Quick win |
| 2 | R01 | **Switch on outcome-zone shading** for barrier contracts | SmartCharts supports ABOVE/BELOW/BETWEEN/OUTSIDE shading; the trader maps every live type to "none" (`trader:packages/shared/src/utils/constants/barriers.ts:2-29`) | Quick win |
| 3 | R03 | **Tap a contract on the chart** to open details or sell | Engine `MarkerGroup.onTap` exists but is not wired (expose-only) | Quick win |
| 4 | R04 | **Volatility context chip** per synthetic index (σ and ±1σ move over the chosen duration) | Factual, cheap, and the data foundation for the probability layer | Quick win |
| 5 | R05 | **Payout preview at the barrier while dragging** | MT5 shows P/L in currency and pips while dragging (`GEN-MT2`); Deriv re-prices only in the Buy button | Quick win |
| 6 | R08 | **Expiry and purchase-deadline markers with a countdown** on the time axis | IQ Option, Pocket Option and Kalshi all show it (`BIN-S6`, `BIN-P4`, `CRY-S31`); the engine's `VerticalBarrier` is unused | Medium |
| 7 | R09 | **First-render and frame-rate budget** | The chart canvas stayed blank for about 5–10 s per load on the live site (one observation) | Medium |
| 8 | R10 | **Persistent, draggable Multiplier TP/SL lines** with a P/L tooltip | TP/SL lines appear only while hovering Buy on desktop; Multipliers are the only product for some EU accounts | Medium |
| 9 | R11 | **Responsible-trading meter** in the trade flow (session P/L, limits, cooling-off) | Binance Event Contracts put loss caps and cooling-off in the product (`CRY-S27`); Deriv shows a Spain-only disclosure | Medium |
| 10 | R17 | **Probability chip on barriers** (touch / finish-beyond, labelled as a model estimate) | thinkorswim, Bybit, Kalshi and CDNA all show probability; for volatility indices Deriv can compute it exactly | Big bet (compliance-gated) |

**Strategic big bet:** a "probability layer" built in order: R04 data, then R17 chip, then R18 expected-move cone, then R19 win-probability strip. Its RICE scores are modest only because of effort and compliance uncertainty; it is the one area where Deriv can lead rather than catch up.

**Decisions only you can make** are listed at the end of [section 10](#10-limitations) and in the chat summary: whether showing probabilities is acceptable per jurisdiction, API availability of σ, and how far to go on trade-from-chart.

---

## 2. Methodology

1. **Deriv capability mapping (Phase 1).** Three parallel code-reading lanes, one per repository, cited `file:line` for each claim (`evidence/10-flutter-engine.md`, `evidence/11-smartcharts.md`, `evidence/12-trader.md`).
   - Engine at `flutter-chart-fork` HEAD `0735c609`.
   - SmartCharts at `e8243d9c`; it pins the engine at `645c87e5`, one commit behind the fork.
   - derivatives-trader pins SmartCharts 2.1.0 (`trader:packages/trader/package.json:87`).
2. **Running the product.** The SmartCharts sample app (`npm start`) did **not compile** in this worktree: `app/index.tsx:38` imports `@deriv-com/quill-ui/dist/assets/quill-ui.css`, which the installed quill-ui 1.24.9 does not export. Fixing it would have meant changing code, so I used the **live public DTrader** at `dtrader.deriv.com` instead, logged out and without signing in. I looked at desktop and a 375×812 mobile viewport, and at Rise/Fall, Touch/No Touch, Higher/Lower, Accumulators and Matches/Differs (`evidence/13-live-ux-observations.md`).
3. **Competitor research (Phase 2).** Five parallel web-research lanes, one per segment, all checked 2026-10-27:
   - binary/fixed-time platforms
   - listed-options brokers
   - crypto options and up/down markets
   - options analytics tools
   - general charting platforms and libraries

   No sign-ups, logins, deposits or personal data. One public no-registration demo (ExpertOption) was inspected hands-on. Each claim carries a source key and a V/C label.
4. **One taxonomy (Phase 3).** The 11 areas from the brief, extended with new rows found during research:
   - 3.9 purchase-deadline / near-expiry state
   - 3.10 digit-contract support
   - 4.6 brackets from the chart
   - 5.9 what-if sliders
   - 5.10 outlook-first contract finder
   - 8.3 visible responsible-trading controls
   - 11.6 gamification
   - 11.7 retail regulation
5. **Gap analysis and recommendations (Phase 4).** Recommendations are scored with RICE: Reach (1–10, share of chart sessions affected) × Impact (H=3, M=2, L=1) × Confidence (0–1) ÷ Effort (person-weeks: S=1.5, M=5, L=10, XL=20). Effort is a rough estimate from code reading, not team estimation.
6. **Verification pass.**
   - **Internal claims:** I re-read 22 `file:line` claims across the three repositories (10 SmartCharts, 8 trader, 9 engine checks). All held. One line number in my own inventory was off by one (`useRiskDisclosure.tsx:28` → `:27`) and was fixed. I also spot-checked 12 cited paths in the recommendations; all exist.
   - **Competitor claims:** I re-fetched 14 claims from their source pages (MT5, Bybit, Robinhood, IBKR, ChartIQ, Binance, Crypto.com, moomoo, deriv.com, cTrader, TradingView, Deribit, IQ Option, Olymp Trade). All held except two, which were corrected:
     - Crypto.com Strike Options alerts at **3 minutes and again at 30 seconds** before expiry, not "in the final 3½ minutes".
     - The ChartIQ 10.0.0 headline list is restricted to what the changelog shows: callouts and legacy component removal.

---

## 3. Deriv capability inventory

Full table with evidence: `deriv-capability-inventory.csv` (56 rows). Condensed view:

| Area | What Deriv has | Status | Owning layer | Key evidence |
|---|---|---|---|---|
| Chart types | Area, Candle, Hollow, OHLC | partial | engine + SmartCharts | `smartcharts:src/Constant.tsx:1935-1940` |
| Granularity | 1 tick; 1, 2, 3, 5, 10, 15, 30 min; 1, 2, 4, 8 h; 1 d. No 1–30 s candles | partial | SmartCharts bridge + trader adapter | `smartcharts:chart_app/lib/src/helpers/series.dart:11`; `trader:packages/trader/src/Modules/SmartChart/Hooks/useSmartChartsAdapter.ts:132-134` |
| Real-time | Animated tick transitions, animated y-bounds, blinking current tick | full | engine | `flutter-chart-fork:lib/src/deriv_chart/chart/basic_chart.dart:258` |
| Indicators | 21 in 5 categories; max 5 active on desktop, 2 on mobile; desktop OS only in the trader | partial | engine + SmartCharts | `smartcharts:src/Constant.tsx:168-421`; `smartcharts:src/store/StudyLegendStore.ts:118-120` |
| Drawing tools | Horizontal, vertical, trend line; no magnet | partial | engine + SmartCharts | `smartcharts:src/Constant.tsx:66-80` |
| Contract markers | 21 marker types: entry/exit, start/end lines, tick counter "n/N", checkpoints, P/L pill; multiple contracts | full | engine paints, trader builds | `flutter-chart-fork:lib/src/deriv_chart/chart/data_visualization/markers/chart_marker.dart:9-148`; `trader:packages/core/src/Stores/Helpers/chart-markers.js:326-560` |
| Barriers | DOM overlay lines, high/low, offscreen arrows, inline TP/SL labels; draggable (Higher/Lower, Touch) | full / partial | SmartCharts + trader | `smartcharts:src/store/BarrierStore.ts:19-35`; `smartcharts:src/store/PriceLineStore.ts:116-128` |
| Win/lose shading | Supported, but switched off for every live contract type except the Accumulator band | partial | trader config | `trader:packages/shared/src/utils/constants/barriers.ts:2-29` |
| Accumulators | Live band with P/L, closed band held 8 s, tap to change growth rate (phone landscape), preview, tap guide | full | engine + SmartCharts + trader | `flutter-chart-fork:lib/src/deriv_chart/chart/data_visualization/annotations/barriers/accumulators_barriers/accumulator_barrier_controller.dart:23`; `trader:packages/core/src/Stores/contract-trade-store.js:38` |
| Digits | Last-digit emphasis on the spot label; digit markers; last-digit % stats (in the trade panel) | full | all three | `flutter-chart-fork:lib/src/theme/painting_styles/barrier_style.dart:113-124`; `smartcharts:src/store/LastDigitStatsStore.ts:48` |
| Time to expiry | Progress ring on the contract marker; exit-time line. No pre-purchase expiry line; countdown setting turned off | partial | engine + trader | `trader:packages/trader/src/AppV2/Containers/Chart/trade-chart.tsx:170` |
| Trade from chart | Drag barrier (Higher/Lower, Touch; touch support via a trader shim); no click-to-place, no expiry on the axis | partial | SmartCharts + trader | `trader:packages/trader/src/Modules/SmartChart/Hooks/useBarrierTouchDrag.ts:1-87` |
| Options analytics | None (no payoff, probability, cones, IV, Greeks) | missing | — | grep across all three repositories |
| Replay | Static per-contract review chart (desktop and phone) | partial | trader + SmartCharts | `trader:packages/trader/src/Modules/Contract/Containers/replay-chart.tsx:146-210` |
| Layout | Single chart; saved studies and zoom per chart id; no compare, sync or shortcuts | partial / missing | SmartCharts | `smartcharts:src/store/ChartState.ts:582-614` |
| Mobile | Portrait-first, chart height computed around the trade sheet, pinch/pan/long-press crosshair; no haptics | full / missing | trader + engine | `trader:packages/trader/src/AppV2/Utils/layout-utils.tsx:50-89` |
| Quality | 23 UI languages (engine canvas strings English only; UTC axis; RTL unverified); light/dark only; no canvas accessibility | partial / missing | SmartCharts + engine | `smartcharts:src/Constant.tsx:1996-2111`; `flutter-chart-fork:lib/l10n/intl_es.arb` (empty) |

**Contract types confirmed in the trader** (`trader:packages/shared/src/utils/constants/contract.ts:58-187`, and the live trade-type menu):

- **Offered:**
  - Directional: Rise/Fall (with "Allow equals"), Higher/Lower, Touch/No Touch.
  - Growth: Accumulators, Multipliers, Turbos (long/short), Vanillas (call/put).
  - Digits: Matches/Differs, Over/Under, Even/Odd.
- **Hidden** (unsupported list): Call/Put spread, High/Low ticks, Reset, Asian, Ends/Stays Between, Lookbacks.
- **Durations** come from the server: ticks, seconds, minutes, hours, days or an end time.
- **Availability** is server-driven per account; for example, some EU accounts see only Multipliers.

### Capabilities SmartCharts or the trader leave unused (cheap wins)

| Capability | Where it lives | What exposing it takes |
|---|---|---|
| Gator oscillator | `smartcharts:src/Constant.tsx:193-202` (commented out) | Uncomment the entry |
| Crosshair callbacks (`onCrosshairHover`, appeared/disappeared) | engine `lib/src/misc/callbacks.dart:44-50` | Pass them through `smartcharts:chart_app/lib/deriv_chart_wrapper.dart:268`; add a prop |
| Tappable contract markers (`MarkerGroup.onTap`, `ActiveMarkerGroup`) | engine `markers/marker_group.dart`, `markers/active_marker_group.dart` | Set `onTap` in `smartcharts:chart_app/lib/src/models/chart_config.dart:236-259` and call back to JS |
| Native canvas barriers (`HorizontalBarrier`, `VerticalBarrier`, `CombinedBarrier`), `CandleIndicator` close countdown | engine `annotations/barriers/` | Add a bridge call and append to the annotations list |
| Running P/L label type (`profitAndLossLabelFixed`) | engine `markers/chart_marker.dart:115-122` | Emit from `trader:packages/core/src/Stores/Helpers/chart-markers.js` (an iOS crash note at `:445` needs investigating) |
| Win/lose shading | `smartcharts:src/store/BarrierStore.ts:280-386` | Change the trader's `CONTRACT_SHADES` map |
| Highest/lowest spot marker, candle countdown, chart footer | SmartCharts settings | The trader turns them off (`trade-chart.tsx:170-171`) |
| Full theme tokens (`ChartTheme`, ~106 getters) | engine `lib/src/theme/chart_theme.dart:12` | Accept overrides in `updateTheme` |
| `WormChart` sparkline | engine `worm_chart/worm_chart.dart:16` | Mini-charts in the positions list or trade panel |
| ATR, CMO, Bollinger %B/width, StdDev maths | engine dependency `deriv_technical_analysis` 1.1.3 | Indicator configs |

**Side findings (not acted on):**

- The SmartCharts `README.md` documents props that no longer exist: `onExportLayout`, `importedLayout`, `crosshair`, the Raw Marker API, and 14 old ChartIQ chart types.
- `CLAUDE.md` names the layout key `layout-{id}`; the code uses `chart-layout-{id}` (`smartcharts:src/store/ChartState.ts:595`).
- `isAnimationEnabled`, `enableScroll` and `enableZoom` appear to be no-ops.
- The sample app no longer compiles against the installed quill-ui.

---

## 4. Competitor profiles

Detailed profiles with every claim and source are in `evidence/20`–`24`. Summary by segment:

### 4.1 Short-term, binary and fixed-time platforms (Deriv's closest competitors)

| Product | Standout chart/trade features | Praise | Complaints / risk |
|---|---|---|---|
| **IQ Option** | Dotted purchase-deadline line plus red expiry line with countdown; digital strikes as boxes on the chart edge, with payout % on hover (`BIN-S6`, verified); 5–30 s candles; 100+ indicators, script indicators; sentiment and news widgets; up to 9 charts | Easy, responsive charts, good demo (`BIN-S11`) | Withdrawal complaints; binaries via an offshore entity; tournaments and badges |
| **Pocket Option** | 5 s candles and a tick line; expiry line with timer; 2/4-chart grid; pending trades by price or time; copy trading | Feature-rich | No top-tier licence; Trustpilot profile removed (`BIN-P10`); heavy gamification |
| **Olymp Trade** | Strike menu laid out as down payout \| strike \| up payout (`BIN-O3`, verified); "Traders' Choice" sentiment; Flat Market Protection | Reliable for long-time users | Offshore; "risk-free trades" reward volume |
| **Quotex** | 5 s candles; sentiment scale; pending trades; reported daily-loss-limit tool (claimed) | Clean UI | Shifting payouts; activity-based rewards; Trustpilot score withheld |
| **Binomo** | 1 s timeframe for 5-second trades; dual chart; majority-opinion bar | — | 51% one-star reviews; regulatory warnings |
| **ExpertOption** (demo inspected) | Tick line by default; payout for both directions printed on the live price tag; 9-strike payout list; 6-step coach marks without sign-up | Usability | Other traders' stakes drawn as bubbles on the chart and a "2,9xx online" counter (dark patterns); Buy/Sell screen-reader labels swapped |
| **Crypto.com Strike Options (ex-Nadex, CDNA)** | "Probability" next to max payout; alerts at 3 min and 30 s before expiry; "Likely Payout" replaces P&L when no close price exists (`BIN-N3`, verified); 11–13 strike ladders | CFTC-regulated | US only; Auto-Roll re-enters after wins |
| **Kalshi 15-min crypto** (added) | Knockout chart: price against a fixed target with direction label, countdown, auto-rollover, "+" on the price axis to place, settled-window blotter (`CRY-S31`/`S32`, claimed) | CFTC-regulated; the closest thing to "Rise/Fall done well" | Help pages rate-limited; sources conflict on chart scope (see Limitations) |
| Dropped | **Spectre.ai** (out of business, `BIN-X1`); **Raceoption** (no chart documentation); Exnova (an IQ Option look-alike) | | |

**Regulatory backdrop:**

- ESMA banned the sale of binary options to EU retail clients from July 2018; national measures followed.
- The FCA's UK ban has been permanent since April 2019.
- ASIC's ban runs to 2031 (`BIN-R1`–`R4`, official pages seen as excerpts).
- All six offshore brokers above lack top-tier licences.

### 4.2 Retail listed-options brokers

| Product | Standout |
|---|---|
| **thinkorswim** | Deepest probability toolkit: probability ITM/OTM/**touch** columns and Product Depth (`BRK-S6`/`S7`), probability-of-expiring cone (daily+ charts only, `BRK-S2`), Risk Profile, Active Trader ladder. Complaint: complexity |
| **tastytrade** | Probability-first: POP on tickets, expected move shaded on the chart (third-party claim); 0 indicators on mobile |
| **Interactive Brokers** | Probability Lab: drag your own distribution and get strategy suggestions (`BRK-I1`, verified); Option Lattice, the only true option-chain overlay on a price chart (`BRK-I3`) |
| **Robinhood (app + Legend)** | Simulated Returns with price and time sliders and scrubbing (`BRK-R2`); mobile charts **down to two ticks**, 80+ indicators, trade from chart (`BRK-R1`, re-verified) |
| **Webull** | Mobile chart gestures: long-press to pre-fill an order, drag to modify (`BRK-W4`) |
| **moomoo** | Best interactive payoff chart: drag the strike on the curve, toggle expected move and probability, date and IV sliders (`BRK-M2`, re-verified) |
| **Power E*TRADE** | Drag-and-drop legs with live max P/L and delta; StrategySEEK outlook-first search |
| **TradeStation OptionStation Pro** (added) | Probability cone on the payoff graph; shading of the probability between two targets (`BRK-TS3`), a direct analogue of Ends/Stays Between |
| Dropped | Fidelity, Public, Firstrade: no distinctive chart-integrated options feature found |

### 4.3 Crypto options venues and up/down markets

| Product | Standout |
|---|---|
| **Deribit** | Expected-move shading on the option chain (`CRY-S5`, re-verified); Position Builder payoff with time slider; DVOL volatility index; TradingView charts. Complaint: overwhelming for newcomers |
| **Bybit Options** | Easy mode: "Profit if it rises / drops", **profit probability on every contract card**, P&L analysis chart before buying (`CRY-S15`, re-verified). Closest to Deriv's mental model |
| **OKX Options** | Buy-only Simple tier in the app; PnL charts, breakeven and Greeks labelled as estimates (`CRY-S21`) |
| **Binance Options / Event Contracts** | Event Contracts are a direct Rise/Fall competitor with 10 min–1 day expiries, no early close, a 10,000 USDT daily cap, a user loss limit and cooling-off periods (`CRY-S27`, re-verified) |
| **Polymarket Up/Down** (added) | "Price to beat", price shown as probability, social tabs |
| Kept as idea sources | Derive (outlook-first builder), Aevo ("Limit my loss" slider). Dropped: Binance Wallet / Predict.fun (no chart UI) |

### 4.4 Options analytics tools

| Product | Standout visual |
|---|---|
| **OptionStrat** | Price × date P/L heatmap table; date slider overlays dated curves; Optimizer with a "Max Return ↔ Max Chance" slider (`ANA-S1`, `ANA-S3`, inspected) |
| **Market Chameleon** | Implied vs actual move chart with a "Within range?" history (`ANA-S11`); IV rank with a word label |
| **Option Alpha** | POP, probability of max profit and loss on every position; 0DTE tool deliberately uses backtests rather than model probability (`ANA-S15`) |
| **SpotGamma** | TRACE time × price heatmap with contour lines and a minute-by-minute replay slider; alerts drawn as vertical lines (`ANA-S19`, `ANA-S20`, official guides) |
| **Unusual Whales** | Strike × expiry exposure heatmap with plain-language regime label ("Dampening") |
| **Barchart / OptionCharts.io** (added) | Expected-move cones stepping to each expiry; probability between two prices (`ANA-S27`, `ANA-S29`, `ANA-S30`, inspected) |
| Dropped | Quiver (no options tooling), Tradytics (overlaps Unusual Whales). Dealer-positioning and flow visuals need an exchange option tape, which synthetic indices do not have |

### 4.5 General charting platforms and libraries

| Product | Standout |
|---|---|
| **TradingView** | 21 chart types, 400+ indicators, 110+ drawing tools, 16-chart layouts, Bar Replay at 9 speeds (`GEN-TV1`, re-verified); TP/SL pulled out of the position line (`GEN-TV3`); Options Strategy Builder with a hover probability split (`ANA-S32`) |
| **TradingView Advanced Charts / Trading Platform** | Order and position line API (drag, modify, cancel, close, reverse), only in Trading Platform since v29; WCAG 2.2 work; RTL in toolbars, not the canvas |
| **Lightweight Charts** | Tiny and open source; no built-in indicators; "Expiring price alerts" and "Options chart" plugins/modes |
| **MetaTrader 5** | **P/L in deposit currency and pips shown while dragging SL/TP** (`GEN-MT2`, re-verified); only 3 chart types, 38 indicators |
| **cTrader** | Up to 5 take-profits dragged on the chart; Reverse / Double / Close on hover (`GEN-CT1`, re-verified) |
| **NinjaTrader** | Unrealised P&L on the position line with switchable units; 1000× playback |
| **ChartIQ** (S&P Global since Jan 2023; 10.0.0 released 2025-10-20, re-verified) | 124 studies, 46 drawing classes, magnet, Trade From Chart (brackets, straddles, spreads), volatility cone, term structure, table view and screen-reader support |
| **SciChart** | Raw throughput claims (1M points at 60 FPS, vendor claim); only an experimental Flutter wrapper |

### 4.6 What SmartCharts lost from ChartIQ (checked against SmartCharts code)

| ChartIQ capability (`GEN-CQ*`) | SmartCharts today | Evidence |
|---|---|---|
| 124 studies; studies on studies and on comparisons | 21 indicators; no study-on-study | `smartcharts:src/Constant.tsx:168-421` |
| 46 drawing classes, magnet | 3 tools, no magnet | `smartcharts:src/Constant.tsx:66-80` |
| Heikin-Ashi, Kagi, Renko, Range, Line Break, P&F, Baseline, Step | 4 types | `smartcharts:src/Constant.tsx:1935-1940` |
| Comparison series | None | — |
| Trade From Chart (drag orders, brackets, straddles, OCO) | Barrier drag only | `smartcharts:src/store/PriceLineStore.ts:116-128` |
| Volatility cone, option sentiment by strike, term structure | None | — |
| Event markers / time-span events | None (markers only for contracts) | — |
| Extended-hours / session shading | Gaps collapsed instead | `flutter-chart-fork:lib/src/deriv_chart/chart/x_axis/x_axis_model.dart:346-354` |
| Table view, screen reader, Chart2Music, colour-vision themes | None on the canvas | `flutter-chart-fork:lib/src/deriv_chart/chart/custom_painters/chart_painter.dart:61` |
| Keyboard shortcuts and legend | Esc on toasts only | `smartcharts:src/components/DeletionSnackbar.tsx:56-68` |
| Multi-chart | None | `smartcharts:src/types/props.types.ts:19-56` |
| Chart sharing | PNG/CSV download only | `smartcharts:src/store/ShareStore.ts:27-29` |
| Study templates / saved views | `Views` exists but is not in the default toolbar | `smartcharts:src/components/Views.tsx:109-241` |

---

## 5. Comparison matrix

The full matrix (64 rows × Deriv + 38 competitors) is in `comparison-matrix.csv`. Each cell gives the status and the source keys behind it.

**Reading the matrix:**

- **Status values:** ✅ full · ◐ partial · ❌ none · ? unknown (not found in public material, which is not proof of absence) · n/a not applicable.
- **Unknowns are common:** about 60% of competitor cells are `?`, because most chart behaviour sits behind logins. Read `?` as "unverified", not "absent".

Condensed view, with Deriv first and the strongest reference per segment:

| ID | Feature | Deriv | IQ Option | ExpertOption | Kalshi 15-min crypto | Crypto.com Strike Options | thinkorswim | moomoo | Robinhood | Deribit | Bybit Options | TradingView | MetaTrader 5 | ChartIQ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1.1 | Chart types | ◐ D01 | ✅ BIN-S1 | ◐ BIN-E1 | ◐ CRY-S32 | ? | ✅ BRK-S9 | ? | ◐ BRK-R9 | ◐ CRY-S11,CRY-S12 | ◐ CRY-S14 | ✅ GEN-TV1 | ◐ GEN-MT3 | ✅ GEN-CQ8 |
| 1.2 | Tick & sub-minute granularity | ◐ D03,D56 | ✅ BIN-S2 | ✅ BIN-E1 | ◐ CRY-S32 | ? | ✅ BRK-S9 | ? | ✅ BRK-R1 | ? | ? | ✅ GEN-TV2,GEN-TV5 | ◐ GEN-MT4,GEN-MT1 | ✅ GEN-CQ13 |
| 1.3 | History depth / lazy loading | ✅ D04 | ◐ BIN-S2 | ? | ? | ? | ? | ? | ? | ? | ? | ✅ GEN-TV2 | ? | ✅ GEN-CQ3 |
| 1.4 | Real-time smoothness | ✅ D06 | ? | ✅ BIN-E1 | ✅ CRY-S32 | ? | ? | ? | ? | ? | ? | ? | ? | ◐ GEN-CQ6 |
| 1.5 | Price formatting / precision | ✅ D07 | ? | ✅ BIN-E1 | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? |
| 2.1 | Indicators (count/quality) | ◐ D08 | ✅ BIN-S4,BIN-S13 | ✅ BIN-E1 | ◐ CRY-S31 | ? | ✅ BRK-S8 | ? | ✅ BRK-R6 | ◐ CRY-S11 | ? | ✅ GEN-TV1 | ◐ GEN-MT1 | ✅ GEN-CQ4 |
| 2.2 | Indicator templates | ◐ D11 | ✅ BIN-S3 | ? | ? | ? | ? | ? | ? | ? | ? | ? | ✅ GEN-MT5 | ? |
| 2.3 | Drawing tools | ◐ D12 | ✅ BIN-S3 | ◐ BIN-E1 | ◐ CRY-S31 | ? | ✅ BRK-S8 | ? | ◐ BRK-R9 | ◐ CRY-S11 | ? | ✅ GEN-TV1 | ◐ GEN-MT1 | ✅ GEN-CQ5 |
| 2.4 | Magnet / snapping | ❌ D14 | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? | ✅ GEN-CQ9 |
| 3.1 | Entry & exit spot markers | ✅ D15 | ◐ BIN-S7 | ✅ BIN-E1 | ◐ CRY-S31 | ? | ? | ? | ? | ? | ? | ? | ✅ GEN-MT5 | ? |
| 3.2 | Barrier / strike lines | ✅ D16 | ✅ BIN-S6 | ◐ BIN-E1 | ✅ CRY-S32 | ◐ BIN-N3 | ◐ BRK-S5 | ◐ BRK-M2 | ◐ BRK-R5 | ◐ CRY-S4,CRY-S5 | ? | ? | ? | ? |
| 3.3 | Payout / profit zones (shading) | ◐ D18 | ? | ◐ BIN-E1 | ? | ? | ◐ BRK-S1b | ◐ BRK-M3 | ❌ | ? | ? | ? | ❌ | ✅ GEN-CQ5 |
| 3.4 | Live P/L on chart | ◐ D19 | ✅ BIN-S6 | ? | ◐ CRY-S31 | ✅ BIN-N3 | ? | ◐ BRK-M2 | ◐ BRK-R6 | ? | ◐ CRY-S14 | ✅ GEN-TV1 | ◐ GEN-MT2 | ◐ GEN-CQ7 |
| 3.5 | Expiry countdown / time-to-expiry marker | ◐ D20 | ✅ BIN-S6 | ◐ BIN-E1 | ✅ CRY-S31 | ◐ BIN-N3 | ◐ BRK-S2 | ◐ BRK-M2 | ◐ BRK-R2 | ? | ? | ◐ GEN-TV1 | ? | ◐ GEN-CQ6 |
| 3.6 | Contract outcome animation | ◐ D21 | ? | ◐ BIN-E1 | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? |
| 3.7 | Multiple open contracts | ✅ D22 | ✅ BIN-S6 | ✅ BIN-E1 | ✅ CRY-S31 | ✅ BIN-N5 | ? | ? | ? | ✅ CRY-S3 | ✅ CRY-S14 | ? | ? | ? |
| 3.8 | Accumulator / turbo / knock-out ranges | ✅ D23,D24 | ❌ | ❌ | ❌ | ◐ BIN-N5 | ? | ? | ? | ? | ? | ? | ? | ? |
| 3.9 | Purchase-deadline / near-expiry state (new) | ❌ D20 | ✅ BIN-S6 | ? | ? | ✅ BIN-N3 | ? | ? | ? | ? | ? | ? | ? | ? |
| 3.10 | Digit-contract support (new) | ✅ D25 | ❌ | ❌ | ❌ | ❌ | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| 4.1 | Drag barrier / strike / order | ◐ D26 | ❌ BIN-S6 | ❌ BIN-E1 | ✅ CRY-S31 | ❌ | ◐ BRK-S5,BRK-S11 | ✅ BRK-M2 | ◐ BRK-R5 | ◐ CRY-S10 | ? | ✅ GEN-TV1,GEN-TV3 | ✅ GEN-MT2,GEN-MT4 | ✅ GEN-CQ7 |
| 4.2 | Click-to-place on chart | ❌ D27 | ◐ BIN-S6 | ❌ BIN-E1 | ✅ CRY-S31 | ❌ | ✅ BRK-S3 | ? | ✅ BRK-R5 | ◐ CRY-S6 | ? | ? | ✅ GEN-MT2 | ✅ GEN-CQ7 |
| 4.3 | One-click / simplified trade | ◐ D28 | ✅ BIN-S5 | ✅ BIN-E1 | ✅ CRY-S31 | ◐ BIN-N6 | ✅ BRK-S3 | ? | ✅ BRK-R6 | ◐ CRY-S4 | ✅ CRY-S15 | ? | ✅ GEN-MT2 | ✅ GEN-CQ7 |
| 4.4 | Set duration on time axis | ❌ D29 | ◐ BIN-S6 | ❌ BIN-E1 | ❌ CRY-S31 | ❌ | ❌ | ❌ | ❌ | ◐ CRY-S2 | ❌ CRY-S15 | ❌ | ? | ? |
| 4.5 | Payout / outcome preview while adjusting | ◐ D30 | ✅ BIN-S6 | ✅ BIN-E1 | ◐ CRY-S33 | ✅ BIN-N3 | ? | ✅ BRK-M2 | ◐ BRK-R2 | ✅ CRY-S4 | ✅ CRY-S15 | ? | ✅ GEN-MT2 | ? |
| 4.6 | Brackets / TP-SL from chart (new) | ◐ D24 | ? | ? | ? | ? | ? | ? | ? | ? | ? | ✅ GEN-TV3 | ? | ✅ GEN-CQ7 |
| 5.1 | Payoff / P&L diagram | ❌ D31 | ? | ❌ BIN-E1 | ❌ | ◐ BRK-N1 | ✅ BRK-S1 | ✅ BRK-M2 | ✅ BRK-R2 | ✅ CRY-S1,CRY-S2 | ✅ CRY-S14,CRY-S15 | ✅ GEN-TV6,ANA-S32 | ❌ | ? |
| 5.2 | Probability of ITM / touch / win | ❌ D31 | ◐ BIN-S6 | ❌ BIN-E1 | ✅ BIN-K3 | ✅ BIN-N3 | ✅ BRK-S6,BRK-S7 | ◐ BRK-M2 | ? | ◐ CRY-S4,CRY-S7 | ✅ CRY-S15 | ✅ ANA-S32 | ❌ | ❌ |
| 5.3 | Probability cones | ❌ D31 | ❌ | ❌ | ❌ | ❌ | ✅ BRK-S2 | ◐ BRK-M2 | ❌ | ❌ | ? | ❌ GEN-TV7 | ❌ | ✅ GEN-CQ10 |
| 5.4 | Expected move / IV bands | ❌ D31 | ❌ | ❌ | ❌ | ❌ | ◐ BRK-S1 | ✅ BRK-M2,BRK-M3 | ? | ✅ CRY-S5,CRY-S6 | ? | ? | ? | ? |
| 5.5 | Greeks | ❌ D31 | ❌ | ❌ | ? | ❌ | ✅ BRK-S6 | ✅ BRK-M2 | ◐ BRK-R6 | ✅ CRY-S1 | ✅ CRY-S14,CRY-S16 | ✅ GEN-TV1,GEN-TV6 | ❌ | ✅ GEN-CQ10 |
| 5.6 | Vol surface / smile / term structure | ❌ D31 | ❌ | ❌ | ? | ❌ | ◐ BRK-S6 | ◐ BRK-M5 | ? | ◐ CRY-S7,CRY-S9 | ◐ CRY-S14 | ✅ GEN-TV1 | ? | ✅ GEN-CQ11 |
| 5.7 | Strike ladder | ◐ D31 | ✅ BIN-S6 | ✅ BIN-E1 | ✅ BIN-K2 | ✅ BIN-N7 | ◐ BRK-S7 | ? | ? | ✅ CRY-S3 | ✅ CRY-S14 | ? | ? | ? |
| 5.8 | Option-chain overlay on chart | ❌ D31 | ◐ BIN-S6 | ❌ BIN-E1 | ? | ? | ◐ BRK-S5 | ❌ | ? | ❌ | ❌ | ◐ GEN-TV6 | ? | ◐ GEN-CQ4 |
| 5.9 | What-if sliders (price/time/IV) (new) | ❌ D31 | ? | ? | ? | ? | ✅ BRK-S1 | ✅ BRK-M2 | ✅ BRK-R2 | ✅ CRY-S2 | ? | ✅ ANA-S34 | ? | ? |
| 5.10 | Outlook-first contract finder (new) | ❌ | ? | ? | ? | ? | ◐ BRK-S1 | ◐ BRK-M2 | ◐ BRK-R4 | ✅ CRY-S4 | ✅ CRY-S15 | ✅ ANA-S32 | ? | ? |
| 6.1 | Trader sentiment % | ❌ D32 | ✅ BIN-S8 | ◐ BIN-E1 | ✅ CRY-S33 | ◐ BIN-N3 | ? | ? | ? | ◐ CRY-S7 | ◐ CRY-S15 | ? | ? | ? |
| 6.2 | Others-trading / social feed | ❌ D32 | ◐ BIN-S14 | ✅ BIN-E1 | ? | ❌ | ? | ? | ? | ❌ | ◐ CRY-S15 | ? | ? | ? |
| 6.3 | Market hours / session shading | ◐ D33 | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? | ✅ GEN-CQ6 |
| 6.4 | News / economic markers | ❌ D34 | ✅ BIN-S8 | ? | ? | ? | ◐ BRK-S1 | ? | ? | ? | ? | ? | ◐ GEN-MT6 | ✅ GEN-CQ6 |
| 6.5 | Volatility context / regime | ◐ D35,D36 | ❌ | ❌ | ? | ? | ? | ? | ? | ✅ CRY-S9 | ? | ? | ? | ? |
| 7.1 | Replay (contract or market) | ◐ D37 | ? | ? | ? | ? | ? | ? | ? | ? | ? | ✅ GEN-TV1 | ✅ GEN-MT5 | ❌ |
| 7.2 | Trade-history markers / settled review | ◐ D38 | ? | ◐ BIN-E1 | ✅ CRY-S31 | ? | ? | ? | ? | ? | ◐ CRY-S14 | ? | ? | ? |
| 7.3 | Journal / performance analytics | ❌ D39 | ✅ BIN-S4 | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? |
| 7.4 | Screenshot / share | ◐ D40 | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? | ✅ GEN-CQ6 |
| 8.1 | Price / indicator alerts | ❌ D41 | ✅ BIN-S10 | ? | ◐ CRY-S33 | ◐ BIN-N3 | ? | ✅ BRK-M1 | ? | ❌ | ◐ CRY-S18 | ✅ GEN-TV1 | ? | ◐ GEN-CQ6 |
| 8.2 | Bots / signals / strategy overlays | ◐ D42 | ✅ BIN-S4 | ? | ? | ? | ? | ? | ? | ? | ? | ? | ✅ GEN-MT5 | ? |
| 8.3 | Responsible-trading / risk controls visible (new) | ◐ D55 | ◐ BIN-S4 | ? | ✅ BIN-K1 | ✅ BIN-N5 | ? | ? | ? | ? | ? | ? | ? | ? |
| 9.1 | Multiple charts / grid | ❌ D43 | ✅ BIN-S3 | ? | ❌ | ? | ? | ? | ✅ BRK-R9 | ? | ? | ✅ GEN-TV1 | ✅ GEN-MT3 | ✅ GEN-CQ6 |
| 9.2 | Chart sync | ❌ D43 | ? | ? | ? | ? | ◐ BRK-S5 | ? | ✅ BRK-R12 | ? | ? | ✅ GEN-TV1 | ? | ✅ GEN-CQ6 |
| 9.3 | Saved layouts / templates | ◐ D44 | ◐ BIN-S3 | ? | ◐ CRY-S32 | ? | ? | ? | ✅ BRK-R12 | ✅ CRY-S11 | ? | ? | ? | ? |
| 9.4 | Compare symbols | ❌ D43 | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? | ✅ GEN-CQ12 |
| 9.5 | Keyboard shortcuts | ❌ D45 | ✅ BIN-S3 | ? | ? | ? | ? | ? | ✅ BRK-R8 | ? | ? | ✅ GEN-TV8 | ? | ✅ GEN-CQ6 |
| 10.1 | Mobile / portrait-first | ✅ D46 | ◐ BIN-S4 | ✅ BIN-E5 | ✅ BIN-K4 | ✅ BIN-N1 | ? | ? | ? | ✅ CRY-S6 | ✅ CRY-S14 | ✅ GEN-TV1 | ✅ GEN-MT7 | ◐ GEN-CQ3 |
| 10.2 | Gesture quality | ✅ D47 | ? | ? | ? | ? | ✅ BRK-S10 | ? | ✅ BRK-R1 | ? | ? | ? | ? | ? |
| 10.3 | Haptics | ❌ D48 | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? |
| 10.4 | Low-end device performance | ◐ D49 | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? |
| 10.5 | Chart–trade panel integration | ✅ D50 | ◐ BIN-S3 | ✅ BIN-E1 | ✅ CRY-S31 | ✅ BRK-N1 | ◐ BRK-S10 | ✅ BRK-M3 | ✅ BRK-R1 | ◐ CRY-S6 | ◐ CRY-S14 | ? | ? | ? |
| 11.1 | Performance | ◐ D49 | ◐ BIN-S13 | ? | ? | ? | ◐ BRK-S12 | ? | ? | ◐ CRY-S12 | ? | ? | ? | ? |
| 11.2 | Accessibility | ❌ D51 | ? | ◐ BIN-E1 | ? | ? | ? | ? | ? | ? | ? | ? | ? | ✅ GEN-CQ3,GEN-CQ14 |
| 11.3 | Localization & RTL | ◐ D52 | ✅ BIN-S8 | ✅ BIN-E1 | ? | ? | ? | ? | ? | ? | ? | ? | ◐ GEN-MT8 | ✅ GEN-CQ6 |
| 11.4 | Theming | ◐ D53 | ◐ BIN-S1 | ? | ? | ? | ? | ? | ? | ? | ? | ? | ✅ GEN-MT6 | ✅ GEN-CQ6 |
| 11.5 | Onboarding / education | ◐ D54 | ✅ BIN-S4 | ✅ BIN-E1 | ◐ CRY-S31 | ◐ BIN-N3 | ✅ BRK-S1 | ✅ BRK-M2 | ✅ BRK-R4 | ✅ CRY-S4 | ✅ CRY-S15 | ✅ ANA-S32 | ? | ? |
| 11.6 | Gamification (more = higher over-trading risk) (new) | ❌ | ✅ BIN-S4 | ✅ BIN-E1 | ❌ | ◐ BIN-N4 | ? | ? | ? | ? | ? | ? | ? | ? |
| 11.7 | Regulated for retail in a major jurisdiction (new) | ? | ❌ BIN-S12 | ❌ BIN-E3 | ✅ BIN-K4 | ✅ BIN-N3 | n/a | n/a | n/a | ? | ? | ? | ? | ? |

---

## 6. Gap analysis

Each gap shows who does it, how, why it matters for Deriv's contracts, and a user story.

### 6.1 Chart fundamentals

| Gap | Who has it, how | Why it matters for Deriv | User story |
|---|---|---|---|
| **Sub-minute candles** (1–30 s) | IQ Option 5–30 s (`BIN-S2`), Olymp Trade/Quotex from 5 s, Binomo 1 s for 5-second trades (`BIN-B7`), TradingView seconds and tick bars, Robinhood two-tick bars (`BRK-R1`) | Deriv sells second- and tick-level durations, but a candle view jumps from ticks to 1-minute bars. The candle size should match the contract duration (Quotex's own guidance, `BIN-Q1`) | As a Rise/Fall trader on 30-second contracts, I want 5-second candles so I can see momentum at the scale I trade |
| **Heikin-Ashi** (and later Renko) | Every binary competitor and every general platform reviewed | Table stakes for chart users who come from those platforms | As a Multipliers trader, I want Heikin-Ashi candles to smooth noise when I judge trend |
| **Time to first render** | Quotex claims charts load in under 2 s (`BIN-Q7`, claimed) | The live chart stayed blank for about 5–10 s per load. For 5-tick contracts that is the whole contract | As a mobile user, I want the chart to show prices immediately when I switch market or contract |

### 6.2 Analysis tools

| Gap | Who has it | Why it matters | User story |
|---|---|---|---|
| Indicator breadth (21 vs 30–400+) and templates | IQ Option 100+, ExpertOption 34, TradingView 400+, ChartIQ 124 | Medium for short contracts, higher for Multipliers/Vanillas. The cap of 2 indicators on mobile is tight | As a Multipliers trader, I want ATR on synthetic indices to size TP/SL to volatility |
| Drawing tools (3) and magnet | IQ/PO/Quotex Fibonacci, channels, pitchfork; TradingView 110+ | Low for tick contracts; matters for retention of chart-heavy users | As a trader, I want to draw a channel that snaps to candle highs and lows |

### 6.3 Contract and position visualisation (highest value)

| Gap | Who has it, how | Why it matters for Deriv | User story |
|---|---|---|---|
| **Win/lose shading** | ExpertOption payout tags above/below price (`BIN-E1`); TradingView Long/Short tool; TradeStation shading between targets (`BRK-TS3`) | Higher/Lower and Rise/Fall outcomes depend only on which side of a line the price ends. Shading makes "am I winning?" readable at a glance. Deriv already has the code | As a Higher/Lower trader, I want the winning side of my barrier tinted so I can read my position without parsing numbers |
| **Live P/L on the contract** | IQ Option "expected profit" (`BIN-S6`), NinjaTrader unrealised P&L on the position line (`GEN-NT2`), CDNA "Likely Payout" (`BIN-N3`) | Deriv shows live P/L only for Accumulators and as a phone pill. Most contracts have a sell-back value worth seeing | As a Vanillas trader, I want to see my contract's current value next to it on the chart so I can decide whether to sell early |
| **Expiry line and countdown before purchase** | IQ Option deadline and expiry lines (`BIN-S6`), Pocket Option timer line (`BIN-P4`), Kalshi countdown (`CRY-S31`) | Time-based contracts are hard to judge without seeing where expiry falls; tick contracts need tick rungs | As a Rise/Fall trader choosing 2 minutes, I want a line on the time axis showing when my contract would end |
| **Near-expiry state** | CDNA alerts at 3 min and 30 s with "Likely Payout" (`BIN-N3`) | Short contracts often become unsellable near expiry; users should see why | As a Touch trader, I want to see when sell-back is no longer available |
| Turbo knock-out zone | Not seen on chart elsewhere either; CDNA UpDown has target/stop levels (`BIN-N5`) | Turbos lose everything at the barrier; a shaded knock-out zone communicates the risk | As a Turbos trader, I want the knock-out area tinted so I see how close I am |

### 6.4 Trade from chart

| Gap | Who has it, how | Why it matters | User story |
|---|---|---|---|
| **Payout preview while dragging** | MT5 P/L in currency and pips (`GEN-MT2`); moomoo live curve (`BRK-M2`); E*TRADE live max P/L (`BRK-E3`) | Deriv already lets users drag Higher/Lower and Touch barriers, but the result appears elsewhere (Buy button) | As a Touch trader, I want the payout to appear next to the barrier while I drag it |
| Draggable TP/SL for open Multipliers | TradingView pull-out brackets (`GEN-TV3`), cTrader multi-TP (`GEN-CT1`), NinjaTrader | Multipliers are the only product for some EU accounts. TP/SL lines are visible only on desktop Buy hover today | As a Multipliers trader, I want to drag my stop-loss line on the chart and see the resulting loss before confirming |
| Click/long-press to place | Webull long-press (`BRK-W4`), Kalshi "+" on axis (`CRY-S31`), Robinhood "+" (`BRK-R5`) | Faster barrier choice on mobile. Must never buy in one gesture | As a mobile trader, I want to long-press a price level to start a Higher/Lower ticket at that barrier |
| Duration on the time axis | **Nobody** found does this (`BRK` matrix note on 4.4) | Possible differentiator, but low evidence of demand | As a trader, I want to drag the expiry line to change duration |

### 6.5 Options-specific analytics

| Gap | Who has it, how | Why it matters for Deriv | User story |
|---|---|---|---|
| **Probability of touch / finish** | thinkorswim touch probability (`BRK-S6`), Bybit profit probability on cards (`CRY-S15`), CDNA "Probability" (`BIN-N3`), Kalshi price = % (`BIN-K3`), TradingView hover split (`ANA-S32`) | Touch/No Touch and Higher/Lower are bets on probabilities. With constant σ on volatility indices Deriv can compute these exactly. Compliance-sensitive | As a Touch trader, I want to see roughly how likely the price is to touch my barrier within 10 ticks |
| **Expected-move / probability cone** | Barchart and OptionCharts cones to expiry (`ANA-S27`, `ANA-S29`); thinkorswim daily cone (`BRK-S2`); ChartIQ volatility cone (`GEN-CQ10`); Deribit chain shading (`CRY-S5`) | No one offers a tick-native cone. It turns barrier choice from guesswork into "inside or outside 1σ" | As a Higher/Lower trader, I want a shaded band showing where the price is likely to be at expiry |
| **Payoff diagram** | moomoo, Robinhood, OptionStrat, Bybit, Deribit, TradingView | Vanillas, Turbos and Multipliers have non-binary payoffs that users misjudge | As a Vanillas trader, I want a payoff curve showing what I gain or lose at each expiry price, with my strike draggable |
| Outlook-first finder | Bybit "Profit if it rises/drops" (`CRY-S15`), OptionStrat Optimizer (`ANA-S3`), TradingView gallery (`ANA-S32`) | Deriv's 10 contract types are confusing for newcomers | As a new user, I want to say "I think it will rise" and see which contracts fit |
| Greeks, vol surface, chain overlay | Brokers, Deribit, ChartIQ | **Low fit**: Deriv's contracts are priced per contract with no chain; Greeks mean little to a 5-tick contract | — |

### 6.6 Market context

| Gap | Who has it | Why it matters | Note |
|---|---|---|---|
| Volatility context | Deribit DVOL (`CRY-S9`), Market Chameleon IV-rank label (`ANA-S10`), Unusual Whales regime label (`ANA-S23`) | Synthetic indices are defined by volatility; showing σ as a price move is factual and educational | Recommended (R04) |
| Trader sentiment, social feed | All binary brokers; ExpertOption draws others' stakes on the chart | **Not recommended as-is:** herding and social pressure. If used, label it "Deriv clients only" and show it as context | Avoid on-chart stake bubbles |
| News / calendar markers | IQ Option news widget, ChartIQ event markers | Relevant only for forex, commodity and stock-index contracts, not synthetics | Later |

### 6.7 History and review; 6.8 alerts; 6.9 layout; 6.10 mobile; 6.11 quality

| Area | Gap | Who has it | Fit for Deriv |
|---|---|---|---|
| Review | Animated contract replay; past trades on the chart | TradingView Bar Replay, NinjaTrader playback, Kalshi settled tab | Medium: helps learning and trust ("was the chart fair?") |
| Review | Performance journal | IQ Option dashboard with 55% break-even benchmark (`BIN-S4`) | Medium, if framed as risk awareness rather than gamification |
| Alerts | Price alerts from the chart | TradingView, cTrader, IQ Option | Low for tick contracts; medium for Multipliers |
| Layout | Multi-chart, sync, compare, shortcuts | TradingView, ChartIQ, IQ Option, Pocket Option | Low for this audience; costly (single Flutter instance) |
| Mobile | Haptics | No competitor documented it | Low-cost polish once web vibration is confirmed acceptable |
| Quality | Accessibility | ChartIQ, TradingView libraries | Canvas is invisible to screen readers; legal exposure not researched |
| Quality | Localisation / RTL | TradingView libs mirror the UI but not the canvas | Engine strings English only; UTC only |

---

## 7. What matters most for options trading

Deriv's customers mostly make short, repeated, fixed-payout decisions on synthetic indices. Their decision loop is: choose direction, choose barrier/duration, read payout, buy, watch, settle.

Three behavioural facts follow:

1. **Confidence comes from reading the outcome, not from analysis.** A 5-tick Rise/Fall trader does not use 100 indicators. They need to see, instantly and without doubt, where they win, where they lose, and how long is left. Every regulated short-duration product reviewed puts this front and centre:
   - Kalshi: target line, direction label and countdown.
   - CDNA: probability, "Likely Payout" and near-expiry alerts.
   - Binance Event Contracts: payout before confirming.
2. **Conversion depends on understanding the trade before buying.** Competitors that sell options to retail users lead with outcome language and a pre-trade picture: Bybit's "Profit if it rises" with a P&L chart, Robinhood's simulated returns, OptionStrat's mini payoff cards. Deriv's 10 contract types make this more important, not less.
3. **Retention depends on trust and on not burning users out.** The offshore binary brokers win attention with tournaments, social pressure and activity rewards, and lose trust (removed Trustpilot profiles, regulatory warnings). Regulated venues instead build in loss caps and cooling-off periods (Binance Event Contracts). Deriv's chart has no gamification today, which is an asset to protect.

**Table stakes** (missing them costs conversion and credibility):

- Clear win/lose zones and live P/L on open contracts (R01, R02).
- An expiry marker and countdown, and tick rungs for tick contracts (R08).
- Payout feedback when adjusting a barrier (R05).
- Fast first render (R09).
- Heikin-Ashi and sub-minute candles for chart users coming from IQ Option or TradingView (R07, R12).

**Differentiators** (where Deriv can lead):

- **Exact probability analytics on volatility indices.** Touch and finish probability, an expected-move cone and a win-probability strip (R17–R19). No competitor can be exact here, because their prices are real markets or opaque OTC feeds.
- **Accumulator visualisation.** It is already unique; extend it with a survival curve and a payout-growth popover (part of R19).
- **Digit-contract tooling.** Unique; keep it.
- **Responsible-trading-by-design chart.** Visible limits (R11), no social-pressure widgets, and calm settlement states. This is also a regulatory asset.

**Low value for Deriv:** Greeks, volatility surfaces, option-chain overlays, dealer-positioning and flow tools, multi-chart grids. They serve listed-options traders managing multi-leg books, not Deriv's single-contract, short-duration flow.

---

## 8. Prioritised recommendations and roadmap

Full detail, including files, dependencies and risks: `recommendations.csv`. RICE = Reach × Impact × Confidence ÷ Effort (person-weeks).

| ID | Recommendation | Contract types | Layers | Engine support today | Reach | Impact | Conf. | Effort | RICE | Phase |
|---|---|---|---|---|---|---|---|---|---|---|
| R01 | Switch on outcome-zone shading for barrier contracts | Higher/Lower, Rise/Fall (after entry), Touch/No Touch (touch side) | trader (+ SmartCharts colours) | Supported already (SmartCharts shade modes ABOVE/BELOW/BETWEEN/OUTSIDE); config-only quick win | 6 | H | 0.9 | S | 10.8 | Quick win |
| R02 | Live P/L chip on every open contract | All (Rise/Fall, Higher/Lower, Touch, digits, Multipliers, Turbos, Vanillas; Accumulators already have it) | trader + engine | Engine paints P/L pills (profitAndLossLabelFixed) and accumulator live P/L; trader never emits a running label | 9 | H | 0.7 | S | 12.6 | Quick win |
| R03 | Tap a contract on the chart to open details or sell | All open contracts | engine (exists) + SmartCharts bridge + trader | Yes: MarkerGroup.onTap and ActiveMarkerGroup exist but are not wired (expose-only) | 7 | M | 0.8 | S | 7.47 | Quick win |
| R04 | Volatility context chip per synthetic index | All, on volatility indices first (realised volatility for Crash/Boom, Jump, Step) | trader (+ SmartCharts top widget) | n/a (UI chip) | 7 | M | 0.7 | S | 6.53 | Quick win |
| R05 | Payout preview at the barrier while dragging | Higher/Lower, Touch/No Touch | SmartCharts + trader | Drag is a SmartCharts DOM overlay; needs a secondary label slot | 4 | M | 0.8 | S | 4.27 | Quick win |
| R06 | Expose cheap engine extras: Gator, ATR, StdDev and %B indicators; crosshair callbacks | Chart-analysis users on any contract; ATR/StdDev aid volatility reading on synthetics | SmartCharts (+ small engine configs) | Gator: expose-only. ATR/StdDev/%B: maths in deriv_technical_analysis, needs configs. Crosshair callbacks: expose-only | 2 | L | 0.9 | S | 1.2 | Quick win |
| R07 | Heikin-Ashi chart type | Candle users (Multipliers, Vanillas, Turbos, longer Rise/Fall) | engine + SmartCharts | No; new series derived from OHLC (small) | 2 | L | 0.9 | S | 1.2 | Quick win |
| R08 | Expiry and purchase-deadline markers with countdown on the time axis | All time-based contracts; tick contracts get tick rungs ('3/5') on the axis | engine (VerticalBarrier exists) + SmartCharts bridge + trader | Partly: VerticalBarrier and exitTime markers exist; pre-purchase preview and countdown label are new | 8 | H | 0.8 | M | 3.84 | Medium bet |
| R09 | First-render and frame-rate performance budget | All | SmartCharts + engine + trader | n/a (measurement first) | 10 | H | 0.5 | M | 3.0 | Medium bet |
| R10 | Multipliers: persistent, draggable TP/SL lines with P/L tooltip | Multipliers (the only type for some EU accounts) | trader + SmartCharts | Barrier drag exists in SmartCharts; lines exist but only on Buy hover | 5 | H | 0.7 | M | 2.1 | Medium bet |
| R11 | Responsible-trading meter in the trade flow | All, especially tick-duration contracts | trader | n/a | 8 | M | 0.6 | M | 1.92 | Medium bet |
| R12 | Sub-minute candles (1 s, 5 s, 15 s, 30 s) built from ticks | Rise/Fall, Higher/Lower and Touch with second-level durations; Multipliers scalping | SmartCharts (+ trader adapter) | Yes: engine granularity is arbitrary ms and the time grid reaches 1 s; bridge and data are the blockers | 4 | M | 0.6 | M | 0.96 | Medium bet |
| R13 | Contract replay playback and 'my recent trades' markers | All | trader + SmartCharts | Static replay exists; playback controls and history overlay are new | 5 | M | 0.7 | M | 1.4 | Medium bet |
| R14 | Trade-from-chart gesture: long-press or price-axis '+' sets the barrier | Higher/Lower, Touch/No Touch (later Turbos, Vanillas) | engine gesture + SmartCharts props + trader | No; long-press is bound to the crosshair today, so it needs a mode or the axis '+' instead | 5 | M | 0.6 | M | 1.2 | Medium bet |
| R15 | Outlook-first contract picker with mini payoff cards | All (onboarding and discovery) | trader | n/a | 6 | M | 0.5 | M | 1.2 | Medium bet |
| R16 | Engine localisation, RTL and local time zone | All | engine + SmartCharts | No: 46 English strings, empty Spanish file, UTC-only axis | 4 | M | 0.7 | M | 1.12 | Medium bet |
| R17 | Probability chip on barriers (touch / finish-beyond), model estimate | Higher/Lower, Touch/No Touch, Turbos (knock-out), Multipliers (TP vs SL first) | SmartCharts + trader (maths) | n/a (label on existing barrier); maths client-side | 6 | H | 0.5 | M | 1.8 | Big bet |
| R18 | Expected-move / probability cone to expiry | Rise/Fall, Higher/Lower, Touch/No Touch, Vanillas, Turbos on volatility indices | engine (new annotation) + SmartCharts + trader | No; new painter (channel-fill pattern can be reused) | 6 | H | 0.5 | L | 0.9 | Big bet |
| R19 | Live win-probability strip for open contracts | Binary outcomes (Rise/Fall, Higher/Lower, Touch), Turbos survival, Accumulators survival | SmartCharts bottom widget + trader | n/a (DOM widget) or engine bottom panel | 6 | M | 0.4 | M | 0.96 | Big bet |
| R20 | Payoff panel for Vanillas, Turbos and Multipliers | Vanillas, Turbos, Multipliers | trader (+ SmartCharts barrier sync) | n/a | 3 | M | 0.7 | L | 0.42 | Big bet |
| R21 | Strike / barrier ladder on the price axis with payout per rung | Vanillas, Turbos, Higher/Lower | SmartCharts (DOM overlay) + trader | n/a (DOM overlay like barriers) | 3 | M | 0.6 | L | 0.36 | Big bet |
| R22 | Drawing-tool breadth and magnet snapping | Chart-analysis users | engine + SmartCharts | Partly: 6 legacy tools need porting to the V2 interactive layer; magnet is new | 2 | L | 0.8 | L | 0.16 | Big bet |
| R23 | Accessibility layer: chart semantics, data table, keyboard | All | engine + SmartCharts | No semantics today | 2 | M | 0.7 | L | 0.28 | Big bet |
| R24 | Price alerts from the chart | Multipliers, Vanillas, longer contracts | SmartCharts + trader (+ backend for push) | No | 3 | L | 0.7 | M | 0.42 | Big bet |
| R25 | Multiple charts and compare overlay | Power users | SmartCharts + engine | No: one global window.flutterChart instance per page | 1 | L | 0.6 | XL | 0.03 | Deprioritised |

Ranked by RICE: R02 (12.6), R01 (10.8), R03 (7.47), R04 (6.53), R05 (4.27), R08 (3.84), R09 (3.0), R10 (2.1), R11 (1.92), R17 (1.8), R13 (1.4), R06 (1.2), R07 (1.2), R14 (1.2), R15 (1.2), R16 (1.12), R12 (0.96), R19 (0.96), R18 (0.9), R20 (0.42), R24 (0.42), R21 (0.36), R23 (0.28), R22 (0.16), R25 (0.03)

### 8.1 Roadmap (ordered by dependency)

**Quick wins (under 2 weeks each).** Mostly configuration or expose-only work:

1. **R01** outcome shading: a trader config change, using shading SmartCharts already supports.
2. **R02** live P/L chip: the engine supports it; investigate the iOS crash note first.
3. **R03** tap a contract marker: the engine `onTap` exists; needs a bridge and prop.
4. **R05** payout preview at the drag label: SmartCharts label plus the existing re-pricing.
5. **R04** volatility chip: needs a σ table; it is also the data foundation for R17–R19.
6. **R06** Gator, ATR/StdDev indicators and crosshair callbacks; **R07** Heikin-Ashi.

**Medium bets (one quarter):**

1. **R09** performance budget: measure first, since it may re-order everything else.
2. **R08** expiry and purchase-deadline markers with countdown and tick rungs: uses the engine `VerticalBarrier`.
3. **R10** draggable Multiplier TP/SL with P/L tooltip: uses `contract_update`.
4. **R11** responsible-trading meter.
5. **R12** sub-minute candles from ticks.
6. **R13** replay playback and recent-trade markers.
7. **R14** long-press / axis "+" to place: after R05.
8. **R15** outlook-first picker; **R16** engine localisation, RTL and time zone.

**Big bets (more than a quarter; compliance-gated where marked):**

1. **Probability layer**, in order: R04 → **R17** probability chip* → **R18** expected-move cone* (needs R08) → **R19** win-probability strip*.
2. **R20** payoff panel for Vanillas, Turbos and Multipliers. The expiry curve needs no model.
3. **R21** strike/barrier ladder on the price axis.
4. **R22** drawing tools and magnet; **R23** accessibility; **R24** price alerts.
5. **Deprioritised:** **R25** multi-chart and compare.

\* Requires the probability-display decision and quant sign-off on the model (zero drift, calendar annualisation, discrete-tick correction).

Dependency graph:

```
R04 σ data ──► R17 probability chip ──► R18 cone ──► (R19 win-probability strip)
                    ▲                     ▲
R05 drag payout ────┘      R08 expiry on time axis
R05 ──► R14 long-press to place
R02 live P/L ──► R19 (shares the per-tick contract-value plumbing)
R09 perf budget ──► gates any new per-tick painter (R18, R19)
```

### 8.2 Risks to manage across the plan

- **Over-trading:**
  - Live P/L, countdowns and win probability can raise emotional sell-backs and re-entries.
  - Ship them with neutral colours, no animation on loss, and A/B metrics on trades per session and on deposits after a loss, not only conversion.
- **Do not copy the dark patterns** found in the binary segment:
  - Others' stakes or "online now" counters on the chart.
  - Activity-based rewards, double-up and auto-roll buttons.
  - Celebratory toasts followed by bonus prompts.
- **Regulation:**
  - Binary options are banned for retail clients in the EU, UK and Australia.
  - Probability displays and trade-from-chart gestures may be read as advice or as encouraging trading.
  - Gate per jurisdiction. The trader already filters contract types per account.
- **Model risk:** probabilities are exact only for the volatility indices, under Deriv's own generation model. They do not apply to Crash/Boom, Jump, Step, Range Break or real-market symbols.

---

## 9. Deriv strengths to protect

1. **Accumulators on the chart.** A live shaded band with P/L, a closed band with a Won/Loss callout, tap to change the growth rate with a preview, and a one-time tap guide (`flutter-chart-fork:…/accumulators_barriers/accumulator_barrier_controller.dart:23`; `trader:packages/core/src/Stores/contract-trade-store.js:490-640`). No competitor reviewed shows a range product like this on a chart.
2. **Digit contracts.** Last-digit emphasis on the spot label (`flutter-chart-fork:lib/src/theme/painting_styles/barrier_style.dart:113-124`), digit markers, and last-digit frequency stats with best and worst highlighted. No competitor offers digit contracts.
3. **Tick-native charting.** Animated per-tick transitions and a tick counter on contract markers (`chart_marker.dart:152-161`). Brokers mostly start at seconds or minutes; Robinhood's two-tick bars (`BRK-R1`) are the nearest.
4. **A marker system for many contracts at once.** 21 marker types, checkpoints, collapsed start/end lines and a progress ring (`flutter-chart-fork:lib/src/deriv_chart/chart/data_visualization/markers/chart_marker.dart:9-148`).
5. **A per-contract review chart** in contract details on desktop and phone (`trader:packages/trader/src/Modules/Contract/Containers/replay-chart.tsx:146-210`). Binary competitors offer a trade list at most.
6. **No gamification on the chart.** Unlike every offshore binary broker reviewed, this protects users and regulatory standing.
7. **Synthetic indices with published constant volatility.** This makes exact, honest probability analytics possible, which no competitor can match.
8. **A portrait-first single trader** for desktop, phone and landscape, with the chart height computed around the trade sheet (`trader:packages/trader/src/AppV2/Utils/layout-utils.tsx:50-89`), and 23 UI languages (`smartcharts:src/Constant.tsx:1996-2111`).

---

## 10. Limitations

- **No hands-on access to competitor chart UIs.**
  - Only the ExpertOption public demo was inspected hands-on.
  - Pocket Option, Quotex, Olymp Trade and Binomo now send demo links to a login page.
  - Brokers and crypto venues need accounts.
  - On-chart trade rendering for most competitors comes from documentation or third-party guides, and many matrix cells are `?`.
- **Blocked fetches:**
  - Deribit support (403), Kalshi (429), spglobal.com and scichart.com (403), E*TRADE (timeouts), Schwab Learn (authorisation error).
  - Those claims rest on search excerpts and are labelled claimed.
  - **Kalshi:** the binary lane (third-party sources) describes Kalshi charts as probability histories without indicators, while the crypto lane (official help excerpts dated September 2026) describes a knockout price chart with on-chart orders. Both are claimed; I used the newer official excerpt.
- **User sentiment is thin.** No Reddit threads could be retrieved. Praise and complaints come from Trustpilot, app stores and review sites, several of them affiliates or competitors.
- **Deriv runtime:**
  - The SmartCharts sample app did not compile (quill-ui export path), so the live DTrader site was used.
  - The ~5–10 s blank-canvas observation is a single logged-out sample on one network.
  - My automated drag of a Touch barrier did not change the value. The code shows dragging is supported, so this is likely a limitation of synthetic drag events, not a product bug.
  - No logged-in flows were run: purchase, open-contract rendering and replay come from code reading.
- **Effort estimates** are from code reading, not from the teams.
- **Deriv API facts:**
  - The candle granularity whitelist, `contract_update` and `barrier_choices` were confirmed in trader code.
  - Whether σ per symbol or account limits are available in the API was **not verified**.
- **Regulatory detail:**
  - Deriv's own licences and per-jurisdiction product rules were not researched.
  - Competitors' regulatory statuses come from third-party and official-excerpt sources.

**Open questions for you:**

1. **Probability display:** may Deriv show model probabilities (touch or finish) next to payouts, and in which jurisdictions? This gates R17–R19.
2. **σ data:** is per-symbol volatility (and the generation model's drift and annualisation conventions) available through the API, or should the client hard-code the published levels?
3. **Trade-from-chart appetite:** is long-press or "+" to pre-fill a ticket acceptable from a responsible-trading view? Should dragging an open Multiplier's SL away from price need confirmation?
4. **Business priority:** which contract families matter most for growth (Accumulators, Multipliers, digits, Vanillas/Turbos)? That would re-weight Reach in the RICE scores.
5. **Performance:** do you have field telemetry on time-to-first-tick and frame drops on low-end Android? R09 should be confirmed or dropped with real data.
6. **Responsible-trading data:** can the trader read the account's self-exclusion and loss limits to show them (R11)?

---

## 11. Sources

**Deriv code:** cited inline as `file:line`; full lists in `deriv-capability-inventory.csv` and `evidence/10`–`12`. The live product was observed at https://dtrader.deriv.com (checked 2026-10-27; `evidence/13-live-ux-observations.md`).

**Deriv public page:** https://deriv.com/markets/synthetic/ — constant volatility 10%–250%, ticks every 2 s or 1 s (checked 2026-10-27, verified).

**Re-verified in the final pass** (fetched again on 2026-10-27):

- `GEN-MT2`, `GEN-TV1`, `GEN-CT1`, `GEN-CQ2` (10.0.0 release date)
- `CRY-S15`, `CRY-S27`, `CRY-S5`
- `BRK-R1`, `BRK-I1`, `BRK-M2`, `BRK-N1` / `BIN-N3`
- `BIN-S6`, `BIN-O3`
- `ANA-S35` (deriv.com)

**Competitor sources by lane** (key, URL, label as recorded by the lane):

### Binary / fixed-time platforms (`BIN-`), all checked 2026-10-27

- `BIN-S1` https://blog.iqoption.com/en/choosing-the-best-chart-type-for-you/ — V
- `BIN-S2` https://iqoptionwiki.com/time-frames-on-iq-option/ — C
- `BIN-S3` https://iqoptionwiki.com/interface-guide-iq-option/ — C (screenshots dated 2026-10-05)
- `BIN-S4` https://blog.iqoption.com/en/iq-option-12th-anniversary-updates/ — V
- `BIN-S5` https://blog.iqoption.com/en/iq-option-introduces-blitz-options-up-to-95-profit-from-5-seconds/ — V
- `BIN-S6` https://blog.iqoption.com/en/how-to-trade-digital-options-an-advanced-version-of-binary-options/ — V
- `BIN-S7` https://iqoptionwiki.com/what-is-options-trading/ — C
- `BIN-S8` https://blog.iqoption.com/en/iq-option-traderoom-top-features-you-need-to-know/ — V
- `BIN-S9` https://medium.com/@iqoptionwiki123/guide-to-using-the-iq-option-traders-sentiment-widget-9f7673f12e28 — C
- `BIN-S10` https://blog.iqoption.com/en/use-the-platform-to-the-fullest-how-to-customize-it-according-to-your-strategy/ — C (official, snippet)
- `BIN-S11` https://www.trustpilot.com/review/iqbroker.com — V; [S11b] https://www.trustpilot.com/review/iqoption.com — V
- `BIN-S12` https://www.fxleaders.com/forex-brokers/forex-brokers-review/iq-option-review/ ; https://en.wikipedia.org/wiki/IQ_Option ; https://spindepth.com/news/is-iq-option-legal-country-by-country-2026 — C
- `BIN-S13` https://www.binaryoptions.net/iq-option — C
- `BIN-S14` https://tradingfinder.com/option/iq-option/dashboard/ — C
- `BIN-S15` https://medium.com/@iqoptionwiki/multi-charts-on-iq-option-platform-6cafd1044cf7 — C
- `BIN-P1` https://pocketoption.com/blog/en/knowledge-base/trading/how-to-read-pocket-option-charts/ — V
- `BIN-P2` https://pocketoption.com/blog/en/knowledge-base/learning/how-to-use-pocket-option-for-beginners/ — V
- `BIN-P3` https://tradingfinder.com/option/pocket-option/trading-platform/ — C
- `BIN-P4` https://pocketoptionblog.com/how-to-trade-at-pocket-option-for-beginners-100159 — C
- `BIN-P5` https://tradingfinder.com/option/pocket-option/dashboard/ — C
- `BIN-P6` https://www.daytrading.com/pocket-option ; https://tradingfinder.com/option/pocket-option/social-trading/ — C
- `BIN-P7` https://m.pocketoption.com/en/land/social-trading/ — C (official, snippet)
- `BIN-P8` https://tradersunion.com/brokers/binary/view/pocketoption/quick-trading/ — C
- `BIN-P9` https://investingintheweb.com/reviews/pocket-option-review/ ; https://www.wikifx.com/en/newsdetail/202607068774484456.html — C
- `BIN-P10` https://www.trustpilot.com/review/pocketoption.com — V (profile removed)
- `BIN-P11` https://play.google.com/store/apps/details?id=com.pocketoption.broker&hl=en_US ; https://www.appbrain.com/app/pocket-option/com.pocketoption.broker — C
- `BIN-P12` https://pocketoption.com/en/cabinet/demo-quick-high-low/ — V (redirects to login)
- `BIN-P13` https://se.trustpilot.com/review/pocketoptions.com — C
- `BIN-O1` https://plus.olymptrade.com/en/help/category/how-to-start-trading/chart-types-and-timeframes — V
- `BIN-O2` https://olymptrade.com/pages/trading/technical-analysis-tools/ — V
- `BIN-O3` https://faq.olymptrade-support.com/en/articles/569859-how-fixed-time-trades-work-on-olymptrade — V
- `BIN-O4` https://plus.olymptrade.com/en/help/category/trade-guide/choice-of-trade-conditions ; https://plus.olymptrade.com/en/help/category/how-to-start-trading/fixed-time-mode — C (official, snippet)
- `BIN-O5` https://www.olymptradewiki.com/sentiment-indicator-on-olymp-trade/ — C
- `BIN-O6` https://tradingfinder.com/option/olymp-trade/dashboard/ ; https://pippenguin.net/reviews/olymp-trade-review/ — C
- `BIN-O7` https://tradingcritique.com/broker-review/olymp-trade/ ; https://brokerchecker.org/reviews/olymp-trade-review/ — C
- `BIN-O8` https://play.google.com/store/apps/details?id=com.ticno.olymptrade ; https://www.appbrain.com/app/olymptrade-trading-online/com.ticno.olymptrade — C
- `BIN-O9` https://olymptrade.com/platform — V (redirects to login)
- `BIN-O10` https://www.daytrading.com/olymp-trade — C
- `BIN-Q1` https://www.binaryoptions.net/quotex-io — C (updated 2026-08-11)
- `BIN-Q2` https://tradingfinder.com/option/quotex/trading-platform/ — C
- `BIN-Q3` https://t.me/s/quotex_official — V (official channel)
- `BIN-Q4` https://www.trustpilot.com/review/quotex.io — V
- `BIN-Q5` https://www.daytrading.com/quotex — C
- `BIN-Q6` https://iamforextrader.com/en/broker/quotex/ — C
- `BIN-Q7` https://www.fxknows.com/en/news/quotex-review-2026-is-quotex-safe-regulation-payouts-fees/ — C
- `BIN-Q8` https://quotex.io/en/demo-trade — V (redirects to sign-in)
- `BIN-Q9` https://tradersunion.com/brokers/binary/view/quotex/how-buy-sell/ — C
- `BIN-B1` https://tradingfinder.com/option/binomo/trading-platform/ — C
- `BIN-B2` https://www.binaryoptions.net/binomo — C (updated 2026-06-10)
- `BIN-B3` https://www.trustpilot.com/review/binomo.com — V
- `BIN-B4` https://zemmytrade.global/binomo-vs-expert-option/ — C
- `BIN-B5` https://www.binaryoptiontrading.in/binomo-india-review/ — C
- `BIN-B6` https://binomo.com/trading — V (redirects to auth)
- `BIN-B7` https://tradingfinder.com/option/binomo/ — C
- `BIN-E1` https://expertoption.com/?demo=true → https://app.expertoption.com/ — V (demo inspected 2026-10-27)
- `BIN-E2` https://coinbureau.com/review/expert-option — C
- `BIN-E3` https://binaryoptionsvision.com/brokers/expertoption — C
- `BIN-E4` https://www.trustpilot.com/review/expertoption.com — V (profile removed)
- `BIN-E5` https://play.google.com/store/apps/details?id=com.expertoption — C
- `BIN-E6` https://tradersunion.com/brokers/binary/view/expertoption/ — C
- `BIN-N1` https://www.nadex.com/notices/cdna-transitions-to-crypto-com-app/ — V
- `BIN-N2` https://financefeeds.com/nadex-retires-legacy-platform-as-services-transition-to-crypto-coms-cdna-infrastructure/ — C
- `BIN-N3` https://help.crypto.com/en/articles/8462828-about-strike-options — V
- `BIN-N4` https://help.crypto.com/en/articles/8694357-about-rolling-strike-options — V
- `BIN-N5` https://help.crypto.com/en/articles/6983814-about-updown-options — V
- `BIN-N6` https://crypto.com/en-it/university/strike-option-trading — C (official, snippet)
- `BIN-N7` https://www.cftc.gov/sites/default/files/filings/ptc/26/04/ptc0409261043.pdf ; https://www.cftc.gov/filings/ptc/ptc0409261035.pdf ; https://www.cftc.gov/sites/default/files/filings/ptc/26/04/ptc0409261031.pdf — C (official, snippet)
- `BIN-N8` https://crypto.news/crypto-com-registers-nadex-for-u-s-stock-futures/ — C
- `BIN-N9` https://www.binaryoptions.net/crypto-com — C
- `BIN-K1` https://kalshibacktest.com/resources/kalshi-btc-15-minute-markets — C
- `BIN-K2` https://predictionmarketspicks.com/articles/kalshi-bitcoin-markets-by-frequency — C
- `BIN-K3` https://kalshi.com/category/crypto/frequency/fifteen_min — C (official, snippet; direct fetch returned 429)
- `BIN-K4` https://defirate.com/prediction-markets/crypto/ — C
- `BIN-X1` https://www.forexpeacearmy.com/forex-reviews/15017/spectre-ai-review — C
- `BIN-X2` https://tradersunion.com/brokers/forex/view/spectre.ai/ — C
- `BIN-X3` https://www.daytrading.com/raceoption — C
- `BIN-X4` https://www.binaryoptions.net/raceoption — C
- `BIN-R1` https://www.esma.europa.eu/press-news/esma-news/esma-agrees-prohibit-binary-options-and-restrict-cfds-protect-retail-investors — C (official, snippet)
- `BIN-R2` https://www.esma.europa.eu/node/88538 — C (official, snippet)
- `BIN-R3` https://www.fca.org.uk/news/statements/fca-confirms-permanent-ban-sale-binary-options-retail-consumers — C (official, snippet)
- `BIN-R4` https://www.asic.gov.au/about-asic/news-centre/find-a-media-release/2022-releases/22-243mr-asic-s-binary-options-ban-extended-until-2031 — C (official, snippet)

### Retail listed-options brokers (`BRK-`), all checked 2026-10-27

- `BRK-S1` https://toslc.thinkorswim.com/center/howToTos/thinkManual/Analyze — V
- `BRK-S1b` https://glasp.co/youtube/dEAZJWT89ZU (summary of Schwab Risk Profile video) — C
- `BRK-S2` https://www.schwab.com/learn/story/5-thinkorswim-charting-tools-tips ; https://tickertape.tdameritrade.com/trading/stock-market-probability-analysis-thinkorswim-15003 — V\* (excerpt; fetch returned auth error)
- `BRK-S3` https://toslc.thinkorswim.com/center/howToTos/thinkManual/Trade/Active-Trader/AT-Entering-Orders — V\*
- `BRK-S4` https://toslc.thinkorswim.com/center/howToTos/thinkManual/Trade/Active-Trader/AT-Ladder — V\*
- `BRK-S5` https://www.schwab.com/learn/story/thinkorswim-trading-tools-faqs-new-traders — V\*
- `BRK-S6` https://toslc.thinkorswim.com/center/howToTos/thinkManual/charts/Useful-Tools/Product-Depth — V\*
- `BRK-S7` https://www.schwabassetmanagement.com/story/set-up-thinkorswim-desktop-options-trading — V\*
- `BRK-S8` https://www.schwab.com/learn/story/7-basic-thinkorswim-desktop-chart-drawing-tools ; https://international.schwab.com/story/getting-started-with-thinkorswim-charts — V\*
- `BRK-S9` https://tradingtoolshub.com/review/thinkorswim/ — C
- `BRK-S10` https://www.schwab.com/trading/thinkorswim/mobile-app ; https://apps.apple.com/us/app/-/id299366785 — V\*
- `BRK-S11` https://www.businesswire.com/news/home/20220714005053/en/TD-Ameritrade-Makes-Further-Enhancements-to-thinkorswim%C2%AE — C (press)
- `BRK-S12` https://www.teamblind.com/search/thinkorswim — C
- `BRK-S13` https://usethinkscript.com/threads/expected-move-probability-cone-for-thinkorswim.10891/ — C
- `BRK-S14` https://www.glassdoor.com/Community/option-traders-investing/curiouswhats-your-go-to-platform-for-trading-options-ive-bounced-between-thinkorswim-tastytrade-and-webull-and-each — C
- `BRK-T1` https://www.stockbrokers.com/review/tastytrade — C (fetched)
- `BRK-T2` https://tastytrade.com/desktop-platform/ — V (marketing; generic)
- `BRK-T3` https://traderc.com/how-to-find-expected-move-before-earnings/ — C
- `BRK-T4` https://www.dombey.capital/blog/best-options-analysis-tools-for-earnings — C
- `BRK-T5` https://tastytrade.com/learn/trading-products/options/analyzing-options-greeks/ — V\*
- `BRK-T6` https://www.businesswire.com/news/home/20220629005370/en/tastyworks-Adds-Risk-Analysis-Tool-to-Help-Traders-Better-Manage-Risks-in-Their-Positions — C (press)
- `BRK-T7` https://www.businesswire.com/news/home/20241219624238/en/Leading-online-retail-brokerage-tastytrade-offers-integration-with-TradingView — C (press; 403 on fetch)
- `BRK-T8` https://curvedtrading.com/articles/en/brokers/tastytrade/ — C
- `BRK-T9` https://www.fool.com/money/buying-stocks/tastytrade-review — C
- `BRK-I1` https://ibkrguides.com/traderworkstation/probability-labsm.htm — V
- `BRK-I2` https://www.interactivebrokers.com/campus/trading-lessons/ibkr-probability-lab/ — V\*
- `BRK-I3` https://www.interactivebrokers.com/campus/trading-lessons/ibkr-desktop-option-lattice-view/ — V\*
- `BRK-I4` https://www.ibkrguides.com/traderworkstation/optiontrader.htm — V\*
- `BRK-I5` https://ibkrguides.com/traderworkstation/implied-volatility-viewer.htm — V\*
- `BRK-I6` https://www.interactivebrokers.com/en/trading/option-analytics.php — V\*
- `BRK-I7` https://www.ibkrguides.com/traderworkstation/chart-parameters.htm — V\*
- `BRK-I8` https://www.interactivebrokers.com/campus/trading-lessons/tws-chart-layout/ ; https://www.interactivebrokers.com/campus/trading-lessons/using-the-tws-option-layout-library/ — V\*
- `BRK-I9` https://www.ibkrguides.com/ibkrdesktop/forecasttrader.htm — V
- `BRK-I10` https://www.interactivebrokers.com/campus/trading-lessons/prediction-markets-at-interactive-brokers/ — V\*
- `BRK-I11` https://www.interactivebrokers.com/campus/trading-lessons/ibkr-desktop-strategy-builder/ — V\*
- `BRK-I12` https://quantlabs.substack.com/p/ibkr-desktop-a-new-look-for-interactive — C
- `BRK-I13` https://www.ibkrguides.com/ibkrdesktop/option-volume-open-interest.htm — V\*
- `BRK-R1` https://robinhood.com/newsroom/introducing-robinhood-legend-charts-on-mobile/ — V
- `BRK-R2` https://robinhood.com/us/en/support/articles/simulated-returns/ — V
- `BRK-R3` https://robinhood.com/us/en/support/articles/profit-loss-chart — V\*
- `BRK-R4` https://robinhood.com/us/en/support/articles/about-the-options-strategy-builder — V\*
- `BRK-R5` https://robinhood.com/us/en/support/articles/trading-with-robinhood-legend — V\*
- `BRK-R6` https://robinhood.com/newsroom/hood-summit-2025-news/ — V
- `BRK-R7` https://x.com/RobinhoodApp/status/1918339376624378334 — V\* (official account)
- `BRK-R8` https://x.com/RobinhoodApp/status/2069118259081748489 — V\* (official account)
- `BRK-R9` https://robinhood.com/us/en/newsroom/the-legend-awakens — V\*
- `BRK-R10` https://beginnerbull.com/robinhood-legend-review/ — C
- `BRK-R11` https://www.benzinga.com/money/robinhood-legend-review — C
- `BRK-R12` https://robinhood.com/gb/en/support/articles/widget-linking-on-legend — V\*
- `BRK-W1` https://www.webull.com/help/faq/11047-Probability-of-Profit — V\*
- `BRK-W2` https://www.webull.com/trading-investing/options — V (fetched; ITM/OTM/BE claim from search excerpt)
- `BRK-W3` https://www.webull.com/help/faq/10908-How-can-I-show-positions-and-open-orders-on-my-chart — V\*
- `BRK-W4` https://www.webullapp.com/learn/MnOumk/SvfXUX/Learn-to-Trade-on-Charts — V\*
- `BRK-W5` https://www.webull.com/trading-platforms/desktop-app — V\*
- `BRK-W6` https://apps.apple.com/app/id6449725458 — V\*
- `BRK-W7` https://www.webull.com.sg/blog/15-US-Options-Trading-in-Singapore-The-Complete-Webull-Platform-Guide — V (partial page)
- `BRK-W8` https://www.webull.com/help/faq/972-Editing-and-Placing-Multi-Leg-Strategies — V\*
- `BRK-W9` https://www.stockbrokers.com/review/webull — C
- `BRK-W10` https://www.complaintsboard.com/webull-b149600 ; https://www.tradingview.com/broker/Webull/reviews/ — C
- `BRK-W11` https://www.nerdwallet.com/reviews/investing/brokers/webull — C
- `BRK-W12` https://purepowerpicks.com/webull-review/ ; https://myinvestacademy.com/stocks/best-stock-broker/webull-review/ — C
- `BRK-M1` https://www.moomoo.com/us/manual/topic-14-65 — V
- `BRK-M2` https://www.moomoo.com/us/learn/detail-options-p-l-curve-tutorial-simulate-your-options-trade-to-visualize-potential-profit-and-loss-117884-250876070 — V
- `BRK-M3` https://www.moomoo.com/my/learn/detail-calculate-stock-price-option-strategies-118036-250808010 — V\*
- `BRK-M4` https://www.moomoo.com/community/feed/how-i-pick-my-sell-put-using-moomoo-s-p-117452604375046 ; https://www.moomoo.com/community/feed/110427981021190 — C
- `BRK-M5` https://www.moomoo.com/community/feed/options-hunter-most-loved-options-feature-options-chain-expected-move-116565184479238 ; https://www.moomoo.com/us/learn/detail-options-unusual-activity-how-to-monitor-the-moves-of-large-institutions-potentially-107906-230701074 — C / V\*
- `BRK-E1` https://us.etrade.com/knowledge/library/options/trading-tools — V\* (fetch timed out)
- `BRK-E2` https://us.etrade.com/platforms/power-etrade — V\*
- `BRK-E3` https://us.etrade.com/platforms/power-etrade/release-notes — V\* (fetch timed out)
- `BRK-E4` https://us.etrade.com/platforms/power-etrade/pro/how-to/placing-trades ; https://us.etrade.com/platforms/power-etrade/pro/how-to/tools — V\*
- `BRK-E5` https://www.brokerage-review.com/online-trading/platforms/power-etrade-review.aspx — C
- `BRK-E6` https://www.tradealgo.com/trading-guides/options/options-trading-on-etrade — C
- `BRK-TS1` https://help.tradestation.com/09_01/tsoptionpro/topics/twod_graph.htm — V\*
- `BRK-TS2` https://help.tradestation.com/10_00/eng/tsoptionpro/topics/analysis.htm — V\*
- `BRK-TS3` https://help.tradestation.com/09_01/tradestationhelp/os_general/ts_probability_calculator.htm — V\*
- `BRK-TS4` https://help.tradestation.com/09_05/eng/tsoptionpro/topics/graph_types.htm ; https://institutional.tradestation.com/technology/optionstation-pro/ — V\*
- `BRK-N1` https://help.crypto.com/en/articles/8462828-about-strike-options — V
- `BRK-N2` https://crypto.com/en/product-news/5minstrikes ; https://crypto.com/us/university/strike-option-trading — V\*
- `BRK-N3` https://www.daytrading.com/nadex ; https://www.binaryoptions.net/nadex-vs-crypto-com ; https://en.wikipedia.org/wiki/Nadex — C

### Crypto options venues and up/down markets (`CRY-`), all checked 2026-10-27

- `CRY-S1` Deribit Support, "Position Builder": https://support.deribit.com/hc/en-us/articles/31238900906781-Position-Builder — claimed (official page; fetch returned 403; content from search excerpt)
- `CRY-S2` Deribit Insights, "Position Builder – Primer on basic option strategies": https://insights.deribit.com/market-research/deribit-position-builder-primer-on-basic-option-strategies/ — verified (old article, about 5 years)
- `CRY-S3` Deribit Insights, "Placing an options trade on Deribit": https://insights.deribit.com/education/placing-an-options-trade-on-deribit/ — verified
- `CRY-S4` Deribit Insights, "Deribit Option Discovery Tool" (7 Dec 2020): https://insights.deribit.com/education/deribit-option-discovery-tool/ — verified
- `CRY-S5` Deribit Insights, "Expected Move Calculations and Visual" (13 Dec 2023): https://insights.deribit.com/education/expected-move-calculations-and-visual/ — verified
- `CRY-S6` Deribit iOS App Store page (v3.18.0, 22 Dec 2025): https://apps.apple.com/in/app/deribit/id1293674041 — verified
- `CRY-S7` Deribit options metrics page: https://www.deribit.com/statistics/BTC/metrics/options — claimed (fetch returned only the page title; section list from search excerpt)
- `CRY-S8` Deribit Insights, "Introduction to Deribit Metrics Page": https://insights.deribit.com/education/introduction-to-deribit-metrics-page/ — claimed (search excerpt)
- `CRY-S9` Deribit Insights, "DVOL – Deribit Implied Volatility Index": https://insights.deribit.com/exchange-updates/dvol-deribit-implied-volatility-index/ — claimed (search excerpt)
- `CRY-S10` Deribit Insights, "Deribit Price Ladder": https://insights.deribit.com/education/deribit-price-ladder/ — claimed (search excerpt)
- `CRY-S11` Deribit on X, preview of the new UI (about 2019): https://twitter.com/deribitexchange/status/1121357284578332672 — claimed
- `CRY-S12` Trustpilot, Deribit reviews (old reviews): https://au.trustpilot.com/review/deribit.com — claimed
- `CRY-S13` btcsprint, "Deribit Review 2026": https://btcsprint.com/deribit-review-2026-the-best-crypto-options-exchange-for-pros — claimed (third party)
- `CRY-S14` Bybit Help, "How to Get Started with Options Trading on Bybit" (last updated 2026-09-12): https://www.bybitglobal.com/en/help-center/article/How-to-Get-Started-with-Options-Trading-on-Bybit (mirror of the bybit.com article, whose fetch timed out) — verified
- `CRY-S15` Bybit Help, "How to Get Started with Easy Options" (last updated 2026-09-13): https://www.bybitglobal.com/en/help-center/article/How-to-Get-Started-With-Easy-Options — verified
- `CRY-S16` Bybit Help, "Option Greeks" and "FAQ — Bybit Options": https://www.bybit.com/en/help-center/article/Option-Greeks, https://www.bybit.com/en/help-center/article/FAQ-Options-Trading — claimed (search excerpt)
- `CRY-S17` Bybit Help, "Introduction to the Trading Chart" and the "Trading on Bybit from TradingView" guide: https://www.bybit.com/en/help-center/article/Bybit-Trading-Chart-FAQ, https://www.bybit.com/en/help-center/article/How-to-Get-Started-With-Trading-on-Bybit-From-TradingView — claimed (search excerpt)
- `CRY-S18` Yahoo Finance, "Bybit adds customized in-app alerts" (about 6 years old): https://finance.yahoo.com/news/bybit-exchange-adds-customized-app-100000301.html — claimed
- `CRY-S19` OKX Help, "Get started with OKX Options": https://www.okx.com/en-us/help/get-started-with-okx-options — verified
- `CRY-S20` OKX Help, "How do I trade options?": https://www.okx.com/en-us/help/option-contracts-app-web — verified
- `CRY-S21` OKX Options Trading User Agreement (updated about 5 days before the check): https://www.okx.com/en-us/help/okx-options-trading-user-agreement — verified
- `CRY-S22` OKX API v5 docs, `greeksType` (PA vs BS): https://www.okx.com/docs-v5/en/ — claimed (search excerpt)
- `CRY-S23` dicloak, AI summary of an "OKX Simple Options Trading Tutorial" video (2025-08-07): https://dicloak.com/video-insights-detail/okx-simple-options-trading-tutorial-trade-okx-options — verified (third-party summary; on-screen visuals not described)
- `CRY-S24` OKX Help, "How do I use the chart trading layout?": https://www.okx.com/en-us/help/how-do-i-use-the-chart-trading-layout — claimed (search excerpt; not options-specific)
- `CRY-S25` Binance FAQ, "How to Trade Binance Options?" (about 4 years old): https://www.binance.com/en/support/faq/how-to-trade-binance-options-6b0dc23370ee4153a6581355e92555c1 — claimed (search excerpt)
- `CRY-S26` Binance FAQ, "Options PnL Calculator" (published 2022-11-14, updated 2026-01-02): https://www.binance.com/en/support/faq/options-pnl-calculator-faq-20fd69a9873a47f3bc86caee702f1dd1 — verified
- `CRY-S27` Binance FAQ, "What Are Binance Event Contracts and How to Use It?": https://www.binance.com/en/support/faq/what-are-binance-event-contracts-and-how-to-use-it-172247f1c4b8401ab106fb63900f3825 — verified
- `CRY-S28` News on Binance gold/silver options (Jul 2026) and stock options (Sep–Oct 2026): https://news.bitcoin.com/featured/binance-adds-gold-and-silver-options-bringing-commodity-markets-to-crypto-traders/, https://tradersunion.com/news/brokers-news/show/3848192-binance-adds-new-options-trading/ — claimed
- `CRY-S29` Polymarket, "BTC Up or Down 15m" event page: https://polymarket.com/event/btc-updown-15m-1790492400 — verified (resolved market; the chart is not described in the fetched text)
- `CRY-S30` updowncharts.com, Bitcoin Up/Down statistics: https://www.updowncharts.com/markets/bitcoin — claimed (third party)
- `CRY-S31` Kalshi Pro Help, "15-minute markets": https://kalshi.com/pro/help/fifteen-minute-markets — claimed (fetch returned 429; content from search excerpts incl. the screenshot caption and the Sep 28, 2026 update note)
- `CRY-S32` Kalshi Pro Help, "Charts on Kalshi Pro": https://kalshi.com/pro/help/charts — claimed (search excerpt)
- `CRY-S33` maxycharts, "How to Read Kalshi 15-Minute Crypto Markets": https://maxycharts.com/guide — claimed (third party)
- `CRY-S34` DeFi Rate, Kalshi vs Polymarket live odds: https://defirate.com/odds/crypto/ — claimed (third party)
- `CRY-S35` Derive Insights, "Your Options Strategy Looks Right." (18 Apr 2026): https://insights.derive.xyz/your-options-strategy-looks-right/ — verified
- `CRY-S36` Aevo Docs, "PERPS+ — Options made easy": https://www.aevo.xyz/docs/aevo-products/aevo-perps+/options-made-easy — verified
- `CRY-S37` CryptoDaily, "Aevo extends PERPS+ to mobile" (Jul 2026): https://cryptodaily.co.uk/2026/07/aevo-extends-perps-to-mobile-completing-full-platform-parity — claimed
- `CRY-S38` Datawallet, Binance review (Binance Wallet + Predict.fun event markets, Apr 2026): https://www.datawallet.com/crypto/binance-review — claimed
- `CRY-S39` James Bachini, "Deribit Review": https://jamesbachini.com/deribit-review/ — claimed (third party)

### Options analytics tools (`ANA-`), all checked 2026-10-27

- `ANA-S1` https://optionstrat.com/build/long-call/SPY (redirected to `/build/long-call/SPY/.SPY261127C765`) — Live public builder. Screenshots of Table and Graph views; date slider moved. **verified**
- `ANA-S2` https://optionstrat.com/flow — Live public Flow Summary page (15-min delayed). **verified**
- `ANA-S3` https://optionstrat.com/optimize — Live public Optimizer. **verified**
- `ANA-S4` https://optionstrat.com/tutorials/options-builder — Official tutorial. WebFetch got HTTP 403, so the content comes from a search snippet. **claimed**
- `ANA-S5` https://optionstradingiq.com/optionstrat-review/ — Third-party review (about 4 years old). **claimed**
- `ANA-S6` https://agenttrading.ai/blog/optionstrat-review — Third-party review (Oct 2026). **claimed**
- `ANA-S7` https://apps.apple.com/us/app/optionstrat-options-toolkit/id1541714905 — Official App Store listing: 4.8 from 1.9K ratings, plus user reviews. Listing **verified**; review content is user **claimed**
- `ANA-S8` https://aistockpickerapp.com/reviews/optionstrat/deep-dive — Third-party review (Sep 2026) that cites Reddit. **claimed**
- `ANA-S9` https://marketchameleon.com/Overview/SPY/ — Live public page (ticker summary, intraday IV chart, trade-idea cards). **verified**
- `ANA-S10` https://marketchameleon.com/Overview/SPY/IV/ — Live public page (IV vs HV, IV percentile rank). **verified**
- `ANA-S11` https://marketchameleon.com/Overview/SPY/ImpliedPriceChange/ — Live public "Implied Moves" page (implied vs actual move chart). **verified**
- `ANA-S12` https://marketchameleon.com/Overview/AAPL/Earnings/Earnings-Charts/ — Shows "Sign in to view this page". Description from search snippet only. **claimed**
- `ANA-S13` https://tradersunion.com/interesting-articles/market-chameleon-review/ , https://tradingtoolshub.com/review/market-chameleon/ , https://daytradingz.com/market-chameleon-review/ — Third-party reviews. **claimed**
- `ANA-S14` https://optionalpha.com/tools/payoff-diagrams — Official product page with screenshot. **verified**
- `ANA-S15` https://optionalpha.com/tools/0dte-oracle — Official product page. **verified**
- `ANA-S16` https://optionalpha.com/changelog/2024-10-28 — Official changelog (0DTE backtester, Touch exit). **verified**
- `ANA-S17` https://docs.optionalpha.com/option-alpha-intro — Official docs (automations, logs). **verified**
- `ANA-S18` https://ca.trustpilot.com/review/optionalpha.com , https://www.strike.money/reviews/option-alpha — Reviews (10 Trustpilot reviews, a tiny sample). **claimed**
- `ANA-S19` https://spotgamma.com/wp-content/uploads/2026/03/TRACE-User-Guide_30-March-2026.pdf — Official TRACE user guide, dated 30 Mar 2026. I extracted the text locally. **verified**
- `ANA-S20` https://spotgamma.com/wp-content/uploads/2025/10/SpotGamma-HIRO-User-Guide.pdf — Official HIRO user guide, dated 25 Jun 2026. Text extracted. **verified**
- `ANA-S21` https://support.spotgamma.com/hc/en-us/articles/31209900542867-SpotGamma-SPX-Key-Levels-Statistics , https://support.spotgamma.com/hc/en-us/articles/15297391724179-Call-Wall-What-It-Is-and-How-SpotGamma-Uses-It , https://trendspider.com/blog/spotgamma-levels-indicator-added-to-trendspider/ — Official help and partner pages, via search snippets. **claimed**
- `ANA-S22` https://bullishbears.com/spotgamma-review/ , https://flashalpha.com/articles/options-analytics-comparison-flashalpha-spotgamma-unusual-whales , https://tradeecho.com/best-gex-tools — Reviews. FlashAlpha and TradeEcho are competitors, so they may be biased. **claimed**
- `ANA-S23` https://unusualwhales.com/stock/SPY/greek-exposure — Live public page (GEX heatmap, data 2 days old for non-subscribers). **verified**
- `ANA-S24` https://unusualwhales.com/periscope/gex , https://unusualwhales.com/periscope/market-exposures-table — Official pages, via search snippet. **claimed**
- `ANA-S25` https://unusualwhales.com/information/an-overview-of-gamma-exposure-and-gex-tools , https://unusualwhales.substack.com/p/spot-gamma-heatmap-a-breakdown — Official explainer articles, via snippet. **claimed**
- `ANA-S26` https://traderhq.com/unusual-whales-review-options-trading-platform/ , https://unusualwhales.com/lp/unusual-whales-reddit-reviews , https://justuseapp.com/en/app/1514447510/unusual-whales/reviews , https://tradersagency.com/blog/unusual-whales-review — Reviews; the "Reddit" page is the vendor's own summary. **claimed**
- `ANA-S27` https://www.barchart.com/stocks/quotes/AAPL/expected-move — Live public page (expected-move chart). **verified**
- `ANA-S28` https://barchart.com/education/the-barchart-profit-loss-chart , https://www.barchart.com/story/news/32652315/how-to-visualize-options-trades-with-barcharts-p-l-chart-tool — Official education pages, via snippet. **claimed**
- `ANA-S29` https://optioncharts.io/options/SPY/expected-move — Live public page (expected-move cone). **verified**
- `ANA-S30` https://optioncharts.io/options/SPY/probability-distribution — Live public page (lognormal PDF with σ lines). **verified**
- `ANA-S31` https://optioncharts.io/docs/ , https://optioncharts.io/docs/max-pain , https://www.findmymoat.com/tools/optioncharts — Docs and review, via snippet. **claimed**
- `ANA-S32` https://www.tradingview.com/options/strategies/handbook/ — Live public Options Strategy Builder (gallery and Long Call). **verified**
- `ANA-S33` https://www.tradingview.com/support/solutions/43000707214-options-strategy-builder-design-your-trades-with-precision/ — Official help. **verified**
- `ANA-S34` https://www.tradingview.com/blog/en/what-if-scenarios-in-options-strategy-builder-54290/ — Official blog. **verified**
- `ANA-S35` https://deriv.com/markets/synthetic/ — Official Deriv page: constant volatilities from 10% to 250%; ticks every 2 s, or every 1 s for the (1s) indices. **verified** (page text)
- `ANA-S36` https://www2.deriv.me/markets/synthetic/ — Official Deriv mirror listing exact volatility levels (10/15/25/30/50/75/90/100/150/250) and tick rates. Via snippet. **claimed**
- `ANA-S37` https://daytradereview.com/tradytics-review/ , https://www.findmymoat.com/vs/quiver-quantitative-vs-unusual-whales — Reviews used for the drop decisions. **claimed**
- `ANA-S38` https://usethinkscript.com/threads/expected-move-probability-cone-for-thinkorswim.10891/ , https://theoptionsbench.com/probability-calculator/ — Community and calculator pages (thinkorswim cone; touch ≈ 2× finish). **claimed**

### General charting platforms and libraries (`GEN-`), all checked 2026-10-27

- `GEN-TV1` https://www.tradingview.com/features/ — V
- `GEN-TV2` https://www.tradingview.com/pricing/ — V (some table cells lost in extraction; mapping partly inferred)
- `GEN-TV3` https://www.tradingview.com/support/solutions/43000659802-i-want-to-use-brackets-on-the-chart/ — V
- `GEN-TV4` https://www.tradingview.com/blog/en/brackets-from-the-chart-28634 ; https://www.tradingview.com/blog/en/brackets-available-in-replay-trading-41828 — O
- `GEN-TV5` https://www.tradingview.com/support/solutions/43000709225-what-are-tick-based-intervals/ ; https://www.tradingview.com/blog/en/expanded-tick-chart-support-52342 — O
- `GEN-TV6` https://www.tradingview.com/support/solutions/43000707214-options-strategy-builder-design-your-trades-with-precision/ ; https://www.tradingview.com/support/solutions/43000762951-chart/ — O
- `GEN-TV7` https://www.tradingview.com/news/financemagnates:19c9cfdde094b:0-tradingview-unveils-options-strategy-builder-supporting-contracts-from-major-exchanges/ ; https://www.financialtechwiz.com/post/tradingview-options/ — C
- `GEN-TV8` https://www.tradingview.com/charting-library-docs/latest/getting_started/Shortcuts/ — O
- `GEN-TV9` https://au.trustpilot.com/review/tradingview.com — C
- `GEN-TVL1` https://www.tradingview.com/charting-library-docs/latest/trading_terminal/ — V
- `GEN-TVL2` https://www.tradingview.com/free-charting-libraries/ — V (table partially lost in extraction)
- `GEN-TVL3` https://www.tradingview.com/charting-library-docs/latest/trading_terminal/Trading-Primitives/ ; .../api/interfaces/Charting_Library.IOrderLineAdapter/ ; .../releases/release-notes/ — O
- `GEN-TVL4` https://www.tradingview.com/charting-library-docs/latest/getting_started/accessibility/ — O
- `GEN-TVL5` https://www.tradingview.com/charting-library-docs/latest/configuration/Localization/ — O
- `GEN-TVL6` https://www.tradingview.com/charting-library-docs/latest/getting_started/product-comparison — V
- `GEN-LWC1` https://github.com/tradingview/lightweight-charts — V
- `GEN-LWC2` https://tradingview.github.io/lightweight-charts/docs/release-notes — V
- `GEN-LWC3` https://tradingview.github.io/lightweight-charts/docs/chart-types — V
- `GEN-LWC4` https://tradingview.github.io/lightweight-charts/plugin-examples/ — V
- `GEN-LWC5` https://github.com/tradingview/lightweight-charts/issues/362 — O
- `GEN-MT1` https://www.metatrader5.com/en/trading-platform/technical-analysis — V
- `GEN-MT2` https://www.metatrader5.com/en/terminal/help/trading/one_click_trading — V
- `GEN-MT3` https://www.metatrader5.com/en/terminal/help/charts_analysis/charts — V
- `GEN-MT4` https://www.metatrader5.com/en/terminal/help/trading/depth_of_market — V
- `GEN-MT5` https://www.metatrader5.com/en/terminal/help/algotrading/visualization — V
- `GEN-MT6` https://www.metatrader5.com/en/releasenotes — V
- `GEN-MT7` https://www.metatrader5.com/en/mobile-trading — V
- `GEN-MT8` https://cfi.trade/en/platforms/mt5 ; https://www.getapp.co.uk/software/2050192/metatrader-5 — C
- `GEN-MT9` https://blog.opofinance.com/en/ctrader-vs-mt5/ ; https://fxnx.com/en/blog/mt5-vs-tradingview-vs-ctrader-2026-showdown — C
- `GEN-CT1` https://help.ctrader.com/ctrader/trading/chart-trading/ — V
- `GEN-CT2` https://help.ctrader.com/knowledge-base/chart-types/ ; https://help.ctrader.com/ctrader-mobile-android/charting/charts/ — O
- `GEN-CT3` https://help.ctrader.com/ctrader/charts/chart-modes/ ; https://help.ctrader.com/knowledge-base/glossary/charting/ — O
- `GEN-CT4` https://help.ctrader.com/ctrader-web/miscellaneous/hotkeys/ ; https://help.ctrader.com/ctrader-web/interface/settings/ ; https://help.ctrader.com/ctrader/interface/settings/ — O
- `GEN-CT5` https://myfundedcapital.com/complete-ctrader-guide/ ; https://forexforstarters.com/platforms/ctrader/charting/ — C
- `GEN-CT6` https://apps.apple.com/us/app/spotware-ctrader/id767428811 — C
- `GEN-NT1` https://static.ninjatrader.com/support/helpGuides/nt8/bar_types.htm — V
- `GEN-NT2` https://static.ninjatrader.com/support/helpGuides/nt8/order__position_display.htm — V
- `GEN-NT3` https://ninjatrader.com/support/helpguides/nt8/properties3.htm — O
- `GEN-NT4` https://static.ninjatrader.com/support/helpGuides/nt8/working_with_indicators.htm — O
- `GEN-NT5` https://static.ninjatrader.com/support/helpGuides/nt8/playback.htm ; https://ninjatrader.com/futures/blogs/market-replay-practice-practice-practice-with-playback-connection/ — O
- `GEN-NT6` https://wayofthetrader.com/education/tools/ninjatrader-8-drawing-tools-alerts ; https://grizzlyparrottrading.com/platforms-tutorials/ninjatrader-8-charttrader-basics.html — C
- `GEN-NT7` https://discourse.ninjatrader.com/t/freezes-and-crashes-every-single-day-and-im-sick-of-it/7436 ; https://www.quantvps.com/blog/ninjatrader-review ; https://brokerlistings.com/reviews/ninjatrader — C
- `GEN-CQ1` https://documentation.chartiq.com/ (footer "Copyright © 2026 S&P Global") — V
- `GEN-CQ2` https://documentation.chartiq.com/tutorial-Changelog_10.0.0.html (10.0.0, 2025-10-20) — V
- `GEN-CQ3` https://documentation.chartiq.com/tutorial-Changelog_9.4.0.html (9.4.0, 2024-06-24) — V
- `GEN-CQ4` https://documentation.chartiq.com/tutorial-Using%20and%20Customizing%20Studies%20-%20Definitions.html — V (count from TOC)
- `GEN-CQ5` https://documentation.chartiq.com/CIQ.Drawing.html — V
- `GEN-CQ6` https://documentation.chartiq.com/tutorial-Chart%20Configuration.html — V
- `GEN-CQ7` https://documentation.chartiq.com/tutorial-Trade%20From%20Chart%20Introduction.html — V
- `GEN-CQ8` https://documentation.chartiq.com/tutorial-Chart%20Styles%20and%20Types.html ; https://documentation.chartiq.com/CIQ.MobileBridge.html ; https://legacydocs.chartiq.com/tutorial-Chart%20Styles%20and%20Types.html — O
- `GEN-CQ9` https://documentation.chartiq.com/CIQ.ChartEngine.html ; https://documentation.chartiq.com/tutorial-Using%20and%20Customizing%20Drawing%20Tools.html (magnet) — O
- `GEN-CQ10` https://documentation.chartiq.com/tutorial-Changelog_8.6.0.html ; https://documentation.chartiq.com/tutorial-Changelog_8.8.0.html ; https://documentation.chartiq.com/OptionsAnalysis.html ; https://chartiq.com/chartiq-options-analytics/ — O
- `GEN-CQ11` https://documentation.chartiq.com/tutorial-Term%20Structures%20Introduction.html — O
- `GEN-CQ12` https://documentation.chartiq.com/tutorial-Changelog_9.0.0.html (studies on comparison series; Field input) — O
- `GEN-CQ13` https://documentation.chartiq.com/tutorial-SDK%20API%20Reference.html ; https://documentation.chartiq.com/CIQ.Renderer.MarketDepth.html (Active Trader/market depth) — O
- `GEN-CQ14` https://www.spglobal.com/market-intelligence/en/solutions/products/resources/chartiq-accessibility ; https://www.spglobal.com/market-intelligence/en/news-insights/research/hearing-the-market-chart2music-makes-charts-accessible-for-the-visually-impaired — O (spglobal.com returned 403 to fetch)
- `GEN-CQ15` https://a-teaminsight.com/blog/cosaic-sells-chartiq-to-sp-global-and-spins-off-finsemble/ ; S&P Global FY2022 10-K https://www.sec.gov/Archives/edgar/data/64040/000006404023000058/spgi-20221231.htm — O
- `GEN-CQ16` https://bullishbears.com/chartiq-review/ (100+ studies, 30+ drawing tools) — C
- `GEN-SC1` https://www.scichart.com/why-scichart-for-developers/javascript/ ; https://www.scichart.com/blog/what-javascript-chart-performance-really-means/ — O/C (vendor perf claims; site returned 403 to fetch)
- `GEN-SC2` https://www.scichart.com/demo/javascript/trading-drawing-tools ; https://www.scichart.com/demo/javascript/user-annotated-stock-chart ; https://www.scichart.com/demo/javascript/realtime-ticking-stock-charts ; https://www.scichart.com/demo/javascript/stock-chart-buy-sell-markers — O
- `GEN-SC3` https://www.scichart.com/questions/android/scichart-on-flutter ; https://github.com/ABTSoftware/SciChart.Flutter — O
