# 21 — Retail listed-options brokers: chart and chart-integrated options features

> **Correction (final verification pass, 2026-10-27):** CDNA Strike Options alert at 3 minutes and again at 30 seconds before expiry (the last 30 s is the "Low Liquidity Zone"), not "in the final 3 min 30 s" as written below. Source re-fetched: https://help.crypto.com/en/articles/8462828-about-strike-options

Segment: thinkorswim (Schwab), tastytrade, Interactive Brokers (TWS, IBKR Desktop, ForecastTrader), Robinhood (app + Legend), Webull, moomoo, Power E*TRADE. Added: TradeStation OptionStation Pro, Crypto.com | Derivatives North America (ex-Nadex) Strike Options.
All checks: **checked 2026-10-27**. Research only; nothing was signed up for or logged into, so no hands-on verification.

Evidence labels:
- **V** = official doc/help/newsroom page fetched and read.
- **V\*** = official page, content read via search-result excerpt only (page not fetched or fetch failed).
- **C** = claimed: third-party review, marketing aggregator, press release, forum/community post.

Taxonomy row IDs follow `00-taxonomy.md`. New rows added here: **3.9** near-expiry settlement messaging, **5.9** probability of profit (POP) on ticket, **5.10** user-defined forecast distribution, **5.11** what-if sliders (price/date/IV), **5.12** unusual options activity / flow.

## Scope decisions

- **Kept, with a caveat on IBKR Desktop "OptionTrader":** OptionTrader is a TWS tool. The closest IBKR Desktop equivalent is the Option Chain's **Lattice View** plus Strategy Builder (I3, I4, I11).
- **Kept ForecastTrader:** $0/$1 event contracts whose price reads as probability, the closest IBKR analogue to Deriv digital contracts (I9, I10).
- **Added TradeStation OptionStation Pro:** the clearest documented "probability cone overlaid on payoff graph" plus Prob ITM/OTM/BE columns (TS1–TS4).
- **Added Crypto.com | Derivatives North America (CDNA) Strike Options, the Nadex successor:** 5-minute to weekly Yes/No binaries priced $0–$1. This is the closest US-regulated product to Deriv Rise/Fall and Higher/Lower. Nadex retail stopped binary trading on 20 Dec 2025 (N3, C).
- **Dropped Fidelity (Active Trader Pro/Trader+), Public, and Firstrade.** Within the time box I found no distinctive chart-integrated options feature that peers do not already cover.
- **Dropped OptionStrat / OptionCharts.io:** not brokers. They are mentioned only as payoff and expected-move UI benchmarks (C).
- **Out of scope here:** Kalshi and Polymarket event contracts (prediction markets, not listed options).

---

## Profiles

### 1. thinkorswim (Schwab)

**Analyze tab** (S1, V)
- Subtabs: Add Simulated Trades, Risk Profile, Probability Analysis, Economic Data, thinkBack, Fundamentals, Earnings.
- **Risk Profile** (5.1): x-axis is underlying price, y-axis is P/L.
  - A blue curve shows expiration P/L and a purple curve shows P/L at the selected date (current/theoretical).
  - It calculates probability of profit.
- **Price Slices** (5.11): hypothetical price targets set as percent, dollars, sigma, or an estimated range. They are drawn on the graph with their expiration probability.
- **Probability Analysis** (5.3): projected price range over future days, default 68.27% (1 SD), adjustable via "Prob range."
- A third-party summary of an official video says the Risk Profile shades the 1-SD expected range between now and the probability date (S1b glasp summary, C).

**Probability of touching** (5.2)
- The option chain can add Probability ITM, Probability OTM and Probability of Touching columns (S7, V\*).
- **Product Depth** in Options mode plots, per expiration series across strikes: IV, Greeks, and probability of expiring ITM, OTM or **touching** (S6, V\*).
- This is the only broker in the segment with a documented probability-of-touch display. It is a chain/column and grid view, not drawn on the price chart.

**Probability cone on price chart** (5.3)
- The built-in study `ProbabilityOfExpiringCone` draws upper/lower bounds at future expirations. Default prob range is 68%; it can be set to 95% or 99% (S2, V\*).
- **Limitation:** daily, weekly or monthly charts only, so no intraday cone (S2, V\*).
- The community writes intraday expected-move cone scripts in thinkScript (S13, C).

**Chart-integrated trading** (4.2, 4.3, 4.1)
- **Active Trader** puts a chart beside a price ladder. Hovering over the Bid/Ask size columns shows an order bubble that encodes direction, quantity and type; clicking sets the price (S3, V\*).
- When you adjust the price on the chart, the ladder shading moves with it (S5, V\*).
- The ladder can show chart-study values and an Orders column (S4, V\*).
- thinkorswim web added drag-and-drop order editing on charts in 2022 (S11, C, press release).

**Charts**
- 300+ studies (Schwab via search, V\*) and 20+ drawing tools (S8, V\*).
- Chart types include candle, OHLC, line, area, Heikin-Ashi, Renko, Range, Monkey Bars, P&F and tick charts (S9, C).

**Mobile**
- Multi-touch charts with "hundreds of studies," drawings synced across platforms, an "analyze feature" for what-if questions, and paperMoney (S10, V\*).

**Standout:** the deepest probability toolkit: PoP, ITM/OTM/**touch** probabilities, cone study, price slices in sigma, and a Product Depth probability-by-strike grid.

**Praise:**
- "Great charting" and depth; also the reference platform others are compared to (S14, C; R10, C).

**Complaints:**
- Dense and steep learning curve (S10 reviews, C).
- "Too complex, especially on a smaller screen" for options (S12, C).
- Outage reports after the TD-to-Schwab migration ("spinning wheel," Nov 2023, S12, C).
- Some users chart on TradingView and only execute on thinkorswim (S14, C).

### 2. tastytrade

**Expected move on the trade page** (5.4)
- Third-party guides state the expected move is a shaded region/cone on the trade-page price chart that updates live with IV (T3, C; T4, C, which says it is sourced from the help centre).
- The chain marks the expected move per expiration with a "±" value (T3, C).
- Formula reported: 0.6×ATM straddle + 0.3×1st OTM strangle + 0.1×2nd OTM strangle (T3, C).

**Curve mode** (5.1)
- The mobile chain toggles between a Table view and a **Curve** view that visualises strategy probability (T1, C).
- Order tickets show POP, net Greeks and buying-power effect before submission (T1, C; 5.9).
- **Analysis mode:** hovering along the x-axis of the risk profile shows Delta, Theta, Gamma, Vega and Rho (T5, V\*).
- Portfolio Risk Analysis applies % moves and time/volatility scenarios to all positions and queued orders (T6, C press 2022).

**Charts**
- Desktop is reported at 308 indicators and 31 drawing tools, snap-to-penny drawings, custom intervals and saved chart profiles (T1, C).
- **Mobile charts have zero indicators** (T1, C).
- Since Dec 2024 tastytrade accounts can connect to TradingView for charting and trading (T7, C, press release; the fetch returned 403).

**Not found:** an official help article on placing or dragging option orders on the chart. Status is "?".

**Standout:** probability-first UX. POP and expected move appear everywhere: chain, ticket, and price chart.

**Praise:**
- "#1 broker for options trading in 2026" and "best-in-class data visualization tools" (T1, C).
- Fast execution (S14, C).

**Complaints:**
- Steep learning curve, no paper trading (T1, C).
- Mobile app glitches after updates (T9, C).
- "Lacks some tools"; users go to TradingView for charting (S14, C).

### 3. Interactive Brokers (TWS, IBKR Desktop, ForecastTrader)

**Probability Lab** (TWS and IBKR Desktop Strategy Builder; 5.10, 5.2, 5.1)
- A histogram of the market-implied probability distribution (blue) for a chosen last trading day (I1, V).
- The user **drags red bars** up or down per price interval to express their own forecast. Probabilities stay normalised to 1.00.
- **Build Strategy** returns three strategies, each with Expected Profit, Sharpe, debit/credit, % likelihood of profit, max P/L and margin.
- The Strategy Performance Detail graph shows P/L plus the probability at each price. A dropdown switches the view to Delta, Gamma, Vega, Theta or Rho (I1, V).
- Unique in the segment.

**IBKR Desktop Option Lattice View** (5.7, 5.8, 3.2)
- A 30-day underlying price line with surrounding **strikes drawn as horizontal lines** on the right axis.
- Expirations run along the x-axis (labelled dates); each strike×expiry point is a bubble sized by Volume, OI, Last or IV.
- Calls are green and puts purple. Hovering shows detail, and an order or Strategy Builder session can be launched from the bubble (I3, V\*).
- **This is the only true option-chain-on-chart overlay found.**

**Other TWS tools**
- OptionTrader: chain with Greeks (I4, V\*).
- Implied Volatility Viewer: IV by strike per expiry plus a 3D surface (I5, V\*).
- Option Analytics: interactive value curves vs vol, time and price (I6, V\*).
- Charts can plot Option Implied Volatility, Historical Volatility, Option Volume and Option OI (I7, V\*).
- Trading from charts uses a ChartTrader panel and custom layouts that combine Chart, Option chain and Rapid Order Entry widgets (I8, V\*).

**ForecastTrader / IBKR Prediction Markets**
- $0/$1 event contracts where the price reflects "the collective probability" (I9, V).
- Selecting an outcome shows its price-history chart, effectively a **probability-over-time chart** (I10, V\*).

**Standout:** user-editable probability distribution feeding a strategy scanner, plus the Lattice strike-and-expiry bubble chart.

**Praise:** analytical depth. IBKR Desktop was launched to answer requests for a "user-friendly" interface (I12, C).

**Complaints:** TWS "complexity can be intimidating for new users" (I12, C).

### 4. Robinhood (app and Legend)

**Simulated Returns** (5.11, 5.1)
- Pre-trade on mobile; post-trade on app and web (R2, V).
- P/L chart with a **price slider/dial** and a **time slider**. Press-and-hold switches the x-axis between price and time; scrubbing a finger along the chart shows returns at each point.
- A $/% toggle switches the returns display.
- Model: Bjerksund-Stensland for equity options, Black-Scholes for index options. IV and rate are frozen when the tool opens (R2, V).

**P/L chart and Strategy Builder** (5.1, 11.5)
- Expiration P/L with a dotted breakeven line (R3, V\*).
- The Strategy Builder lists strategies, **each with its own explanatory mini-chart** (R4, V\*).

**Legend (desktop web)**
- Up to 8 charts; candle, line and Heikin-Ashi; intervals down to tick (R9, V\*).
- 90+ indicators (R6, V). A third party says 50+ (R10, C).
- Options charts since May 2025, described as letting you "trade options faster, directly from the chart" (R7, V\*).
- Chart trading: a "+" icon or right-click places orders above or below price, and **draggable order pills** modify orders (R5, V\*).
- Ladder widget with one-click trades and P&L (R6, V).
- June 2026: options chain, chart and ladder in one layout with auto-send and hotkeys (R8, V\*).
- Widget linking and drawing sync (R12, V\*; R6, V).
- Cortex AI custom indicators (R6, V).

**Legend charts on mobile** (June 2025)
- Indicators went from 7 to 80+.
- **Intervals from 5 minutes down to two ticks.**
- Trade from chart with auto-send, plus pinch-to-zoom (R1, V).

**Standout:** the friendliest what-if UX (sliders plus scrubbable chart) and two-tick mobile charts. The tick intervals map directly to Deriv's tick durations.

**Praise:** customisable layouts and one-click trading (R11, C).

**Complaints:** still trails thinkorswim on depth; no paper trading (R10, C).

### 5. Webull

**Probability displays** (5.2, 5.9)
- Probability of Profit is defined at expiry using a log-normal model with IV. The help page publishes the formula and a disclaimer; it applies to same-expiry strategies only (W1, V\*).
- The chain shows probabilities of ITM, OTM and Break Even (W2 search excerpt, V\*).

**Analysis tools and chain**
- Tools: Probability Analysis, P/L Diagrams, Volatility Analysis, Options Calculator, Screener, and TurboTrader one-tap presets (W2, V).
- 13 predefined strategies and live Greeks (W7, V).
- Multi-leg strategies are built in the chain and sent to the Order Entry widget (W8, V\*).

**Chart trading** (4.2, 4.1, 7.2)
- Desktop: right-click → Create New Order; positions and orders can be shown on the chart (W3, V\*; W5, V\*).
- Mobile: open orders and positions appear at their price levels. **Tap-and-drag** modifies an order, and **long-press** on the chart pre-fills an order at that price (W4, V\*).
- Tablet: "Active Option Trader" and "Chart Trader" (W6, V\*).

**Standout:** chart-trading gestures on mobile (long-press to place, drag to modify).

**Praise:** charting "outstanding" (W9, C); desktop responsive at peak (W12, C).

**Complaints:**
- The multi-leg options interface is "restrictive" (W9, C).
- No true drag-and-drop strategy builder (W12, C).
- App freezes and crashes; trend lines "move on their own" (W10, C).
- Polarised App Store ratings (W11, C).

### 6. moomoo

**P/L Curve** (5.1, 4.1, 4.5, 5.4, 5.11)
- Expiration P/L by default. Legend toggles add Current P/L, Breakeven, Greeks, **Expected Move (EM)** and **Price Probability** (M2, V).
- Date and IV sliders, with IV source selectable: expiration IV, underlying IV or HV.
- **Drag the strike selector** left or right to change strike, and up or down to flip direction; the curve updates live.
- Right-click edits expiry, strike, call/put, side and quantity. An Add button adds legs; hover reads off P/L.
- Strategy finder: enter a target price and budget, and it opens the projected P/L curve (M2, V).
- Expected Move is shown directly in the chain (M3, V\*). The P/L chart shades the "Expected Range" (M3/M4 excerpt, V\*/C).

**Unusual Options Activity** (5.12, 8.1)
- Tracks trades of 1,000+ contracts for a single stock or the whole market.
- Tapping a trade shows details and simulated performance; a bell icon sets alerts by criteria (M1, V).
- Community and learn posts mention sentiment, single/multi-leg, side and sweep filters plus one-click "follow trade" (M5/M4, C).
- moomoo notes the data cannot tell opening from closing trades.

**Standout:** the best interactive payoff chart in the segment, with direct manipulation of strike on the payoff chart and EM/probability overlays.

**Praise:** community posts single out EM in the chain and the P/L analysis (M5, C).

**Complaints:** no reliable sources found ("?").

### 7. Power E*TRADE (Morgan Stanley)

**StrategySEEK** (5.10, 5.1)
- Inputs: outlook (bullish, bearish, volatile, neutral), amount, target price, expected volatility and target date.
- Returns strategies ranked by max gain or loss and estimated P/L, each with a P/L graph and price-movement probabilities. Trades can be placed directly (E1, V\*).

**Snapshot Analysis and TradeLab** (5.2, 5.9, 5.11)
- Snapshot Analysis is a tab inside the order ticket. It shows max P/L and risk/reward probabilities, and you can **slide across the risk graph** to see P/L at other prices. Probabilities use the average ATM IV of the legs (E1, V\*).
- TradeLab adds live Greeks (E1, V\*).

**Release notes v52** (4.1, 4.5)
- **Click-drag-drop option legs** to build trades, with Max Profit, Max Loss and Delta updating as each leg drops (E3, V\*).
- The same notes contain a "Chart trading" section whose content was not retrieved; the page timed out.

**Charts and chain**
- 145+ studies and drawing tools, auto support/resistance and pattern recognition, saved setups, trade from chart (E2, V\*).
- Pro: enable chart trading with the double-arrow button (E4, V\*).
- Chain POP column, IV "Constellation," Earnings Move Analyzer (E5/E6, C).

**Standout:** goal-first strategy search and drag-drop legs with live max P/L.

**Praise:** praised for drag-drop legs and auto-patterns (C, reviews).

**Complaints:** none sourced ("?").

### 8. TradeStation OptionStation Pro (added)

**2D risk/sensitivity graph** (5.1, 5.3, 5.5, 5.11)
- Theo P&L, Delta, Theta, Gamma, Vega and Rho vs underlying price and time.
- The position profile is **compared against a Probability Cone** of the underlying price distribution (TS1, V\*).
- Up to 4 plots; a 3D graph adds a time or IV axis (TS4, V\*).
- The Analysis tab tracks simulated positions across time, price and volatility (TS2, V\*).

**Probability columns and calculator** (5.2)
- Columns: Prob BE, Prob ITM and Prob OTM. Expected Value is integrated over ±3 SD (TS1/TS4, V\*).
- The Probability Calculator shades the area between two user targets green and gives the probability of finishing below, between or above them (TS3, V\*).
- This shading is a direct analogue of Deriv "Ends Between/Outside" and "Stays Between."

**Standout:** probability-between-targets shading.

**Praise and complaints:** not researched (time box).

### 9. Crypto.com | Derivatives North America Strike Options (added; Nadex successor)

**Product** (N1, V; N2, V\*)
- Yes/No contracts on whether the price is above the strike at expiry.
- Crypto durations: **5 min, 20 min, 2 h, daily and weekly**. FX: 5 min and 2 h.

**Price and probability**
- Contract price is $0–$1. The in-app "**Probability**" is derived from the bid/ask midpoint, and the price is the payout probability.
- Max payout is shown as a multiplier of investment (N1, V).

**Flow**
- Pick asset → duration → strike → Yes/No → quantity → review "You Pay" → place (IOC market order with slippage tolerance).
- Positions can be closed early.

**Near expiry** (3.9)
- **Alerts appear in the final 3 min 30 s**, and a **"Likely Payout" replaces unrealised P&L** when no close price exists (N1, V).

**Chart:** not described in the help page ("?").

**Standout:** probability-as-price for ultra-short binaries, plus explicit end-of-life state messaging.

---

## Feature matrix

Legend: ✅ full · ◐ partial · ❌ none found · ? unknown/not verified. Source refs map to the Sources list. TOS = thinkorswim, tasty = tastytrade, RH = Robinhood, WB = Webull, MOO = moomoo, ET = Power E*TRADE, TS = TradeStation, CDNA = Crypto.com Strike Options.

| ID | Feature | TOS | tasty | IBKR | RH | WB | MOO | ET | TS | CDNA |
|---|---|---|---|---|---|---|---|---|---|---|
| 1.1 | Chart types | ✅ candle/OHLC/line/HA/Renko/range/P&F/tick (S9 C) | ◐ desktop; TradingView link (T1,T7 C) | ? | ◐ candle/line/HA (R9 V\*) | ? | ? | ? | ? | ? |
| 1.2 | Tick / sub-minute granularity | ✅ tick charts (S9 C) | ◐ custom intervals (T1 C) | ? | ✅ down to tick (R9 V\*); 2 ticks on mobile (R1 V) | ? | ? | ? | ? | ? |
| 2.1 | Indicator count | ✅ 300+ (Schwab V\*) | ◐ 308 desktop, 0 mobile (T1 C) | ? | ✅ 90+ (R6 V); mobile 80+ (R1 V) | ? | ? | ✅ 145+ studies+drawings (E2 V\*) | ? | ❌ none found |
| 2.3 | Drawing tools | ✅ 20+ (S8 V\*) | ✅ 31 (T1 C) | ? | ◐ lines/Fib, sync (R9 V\*, R6 V) | ◐ drawing bugs reported (W10 C) | ? | ◐ incl. auto S/R (E2 V\*) | ? | ? |
| 3.2 | Strike / position lines on underlying chart | ◐ orders on chart+ladder (S5 V\*) | ? | ✅ strikes as horizontal lines in Lattice (I3 V\*) | ◐ order pills (R5 V\*) | ◐ positions/orders on chart (W3,W4 V\*) | ◐ strike selector on payoff chart (M2 V) | ? | ? | ? |
| 3.3 | Shaded win/expected zones | ◐ 1-SD shading on risk profile (S1b C) | ◐ EM shaded on chart (T3,T4 C) | ◐ distribution bars (I1 V) | ❌ | ? | ◐ Expected Range on P/L chart (M3 V\*/M4 C) | ? | ✅ green between-targets area (TS3 V\*) | ? |
| 3.4 | Live P/L on chart | ? | ? | ? | ◐ ladder P&L (R6 V) | ◐ positions on chart (W3 V\*) | ◐ Current P/L curve (M2 V) | ? | ? | ◐ unrealised P&L (N1 V) |
| 3.5 | Expiry on time axis | ◐ cone at expirations (S2 V\*) | ? | ◐ Lattice x-axis = expiries (I3 V\*) | ◐ time slider (R2 V) | ? | ◐ date slider (M2 V) | ? | ◐ time axis on 3D (TS4 V\*) | ◐ final-3m30s alerts (N1 V) |
| 3.9 (new) | Near-expiry settlement messaging | ? | ? | ? | ? | ? | ? | ? | ? | ✅ "Likely Payout" (N1 V) |
| 4.1 | Drag strike/order on chart | ◐ drag orders (S5 V\*, S11 C) | ? | ◐ drag probability bars (I1 V) | ◐ drag order pills (R5 V\*) | ◐ drag order (W4 V\*) | ✅ drag strike on payoff (M2 V) | ✅ drag-drop legs (E3 V\*) | ? | ❌ |
| 4.2 | Click-to-place on chart | ✅ Active Trader (S3,S5 V\*) | ? | ◐ ChartTrader/layouts (I7,I8 V\*) | ✅ "+"/right-click (R5 V\*) | ✅ right-click / long-press (W3,W4 V\*) | ? | ✅ (E2,E4 V\*) | ? | ❌ |
| 4.3 | One-click trading | ✅ ladder (S3 V\*) | ? | ? | ✅ ladder + auto-send + hotkeys (R6 V, R8 V\*) | ✅ TurboTrader (W2 V) | ◐ "follow trade" (M5 C) | ? | ? | ❌ review step (N1 V) |
| 4.5 | Payout preview while dragging | ? | ? | ◐ scanner after Build (I1 V) | ◐ sliders (R2 V) | ◐ claimed real-time diagram (W2 V\*) | ✅ curve updates live (M2 V) | ✅ max P/L, Δ update per leg (E3 V\*) | ? | ❌ |
| 5.1 | Payoff / P&L diagram | ✅ (S1 V) | ✅ curve (T1 C) | ✅ (I1 V) | ✅ (R2 V, R3 V\*) | ✅ (W2 V) | ✅ (M2 V) | ✅ (E1 V\*) | ✅ (TS1 V\*) | ◐ max payout only (N1 V) |
| 5.2 | Prob ITM / touch | ✅ ITM, OTM and **touch** (S6,S7 V\*) | ◐ POP (T1 C) | ✅ market-implied PD (I1 V) | ? | ✅ ITM/OTM/BE (W1 V\*, W2 V\*) | ◐ price probability (M2 V) | ✅ (E1 V\*) | ✅ ITM/OTM/BE (TS1 V\*) | ✅ price = probability (N1 V) |
| 5.3 | Probability cone | ✅ chart study, daily+ only (S2 V\*) | ◐ EM cone on chart (T4 C) | ◐ histogram (I1 V) | ❌ | ? | ◐ (M2 V) | ? | ✅ cone vs payoff (TS1 V\*) | ❌ |
| 5.4 | Expected move / IV bands | ◐ Probability Analysis (S1 V) | ✅ chart + chain (T3,T4 C) | ◐ IV on chart (I7 V\*) | ? | ? | ✅ chain + P/L curve (M2 V, M3 V\*) | ◐ Earnings Move Analyzer (E6 C) | ? | ❌ |
| 5.5 | Greeks | ✅ (S1, S6 V\*) | ✅ hover analysis (T5 V\*) | ✅ (I1 V, I4 V\*) | ◐ chain metrics (R6 V) | ✅ (W7 V) | ✅ (M2 V) | ✅ (E1 V\*) | ✅ (TS4 V\*) | ❌ |
| 5.6 | Vol surface / smile | ◐ Product Depth IV (S6 V\*) | ◐ (T8 C) | ✅ 3D IV Viewer (I5 V\*) | ? | ◐ Volatility Analysis (W2 V) | ◐ IV rank (M5 C) | ◐ IV Constellation (E6 C) | ◐ 3D with IV axis (TS4 V\*) | ❌ |
| 5.7 | Strike ladder | ◐ chain (S7 V\*) | ◐ chain | ✅ Lattice (I3 V\*) | ◐ chain | ◐ chain | ◐ chain | ◐ chain | ◐ chain | ◐ strike picker (N1 V) |
| 5.8 | Option chain overlay on chart | ◐ chart + ladder side by side (S5 V\*) | ? | ✅ Lattice (I3 V\*) | ◐ chain+chart+ladder layout (R8 V\*) | ? | ❌ | ? | ? | ❌ |
| 5.9 (new) | POP on ticket | ✅ (S1 V) | ✅ (T1 C) | ✅ (I1 V) | ? | ✅ (W1 V\*) | ◐ (M4 C) | ✅ (E1 V\*) | ◐ Prob BE (TS1 V\*) | ✅ (N1 V) |
| 5.10 (new) | User-defined forecast | ◐ price slices (S1 V) | ❌ | ✅ drag distribution (I1 V) | ❌ | ❌ | ◐ target+budget finder (M2 V) | ✅ StrategySEEK (E1 V\*) | ◐ targets (TS3 V\*) | ❌ |
| 5.11 (new) | What-if sliders | ✅ (S1 V) | ◐ risk analysis (T6 C) | ✅ Option Analytics (I6 V\*) | ✅ price/time sliders (R2 V) | ? | ✅ date/IV sliders (M2 V) | ✅ slide graph (E1 V\*) | ✅ (TS2 V\*) | ❌ |
| 5.12 (new) | Unusual activity / flow | ? | ? | ◐ volume/OI graphs (I13 V\*) | ? | ? | ✅ (M1 V) | ? | ? | ❌ |
| 6.4 | Earnings / economic on chart | ◐ Analyze subtabs (S1 V) | ◐ earnings marked (T4 C) | ? | ? | ? | ? | ◐ Earnings tool (E1 V\*) | ? | ? |
| 8.1 | Alerts | ? | ✅ stock alerts (T1 C) | ? | ? | ◐ alert bugs (W10 C) | ✅ UOA alerts (M1 V) | ? | ? | ◐ expiry alerts (N1 V) |
| 9.1 | Multi-chart | ? | ? | ◐ custom layouts (I8 V\*) | ✅ up to 8 (R9 V\*) | ? | ? | ? | ? | ? |
| 9.2 | Sync | ◐ chart↔ladder (S5 V\*) | ? | ? | ✅ widget linking, drawing sync (R12 V\*, R6 V) | ? | ? | ? | ? | ? |
| 9.3 | Saved layouts | ? | ✅ chart profiles (T1 C) | ✅ layout library (I8 V\*) | ✅ (R12 V\*) | ? | ? | ✅ (E2 V\*) | ? | ? |
| 9.5 | Keyboard shortcuts | ? | ? | ? | ✅ hotkeys (R8 V\*) | ✅ hotkeys (W5 V\*) | ? | ? | ? | ? |
| 10.2 | Gestures | ✅ multi-touch (S10 V\*) | ? | ? | ✅ pinch, scrub, press-hold axis (R1,R2 V) | ✅ long-press place, drag modify (W4 V\*) | ? | ? | ? | ? |
| 10.5 | Mobile chart–trade integration | ◐ (S10 V\*) | ◐ curve toggle; no mobile indicators (T1 C) | ? | ✅ trade from chart, auto-send (R1 V) | ✅ (W4 V\*) | ✅ strategy → P/L curve (M3 V\*) | ? | ? | ✅ simple Yes/No (N1 V) |
| 11.1 | Performance | ◐ outage reports (S12 C) | ◐ glitches after updates (T9 C) | ? | ? | ◐ freezes (W10 C); responsive (W12 C) | ? | ? | ? | ? |
| 11.2 | Accessibility | ? | ? | ? | ? | ? | ? | ? | ? | ? |
| 11.5 | Onboarding / education | ✅ thinkManual/Learning Center (S1 V) | ✅ tastylive (T1 C) | ✅ Campus video lessons (I2 V\*) | ✅ per-strategy explainer charts (R4 V\*) | ◐ Learn (W4 V\*) | ✅ Learn tutorials (M2 V) | ◐ (E1 V\*) | ◐ PDFs (TS docs) | ◐ help centre (N1 V) |

Rows 1.3–1.5, 2.2, 2.4, 3.1, 3.6–3.8, 4.4, 6.1–6.3, 6.5, 7.x, 8.2, 9.4, 10.1, 10.3, 10.4, 11.3 and 11.4 are "?" for all brokers. The time box found no specific evidence for them, and they are mostly generic charting rows better covered by other lanes.

- **Note on 4.4** (set expiry on time axis): no broker lets you set expiry by dragging on the time axis (❌ found).
- The nearest equivalents are the IBKR Lattice, where expiries are columns of clickable bubbles, and the Robinhood and moomoo date sliders.

---

## Transferable ideas for Deriv's short-term contracts

Ordered by fit × feasibility. "Best at it" names the competitor whose UI is the model.

### 1. Probability-of-touch label on the barrier (Touch/No Touch, One Touch, Stays Between)
- **Best at it:** thinkorswim, the only broker with "Probability of Touching" as a chain column and as a Product Depth plot across strikes (S6, S7).
- **Deriv UI:** while the user drags a Touch barrier, render a pill on the barrier line: "≈ 34% touch chance in 10 ticks." Add a faint second line where touch probability is 50%.
- Synthetic indices have a published constant volatility, so the touch probability under a reflection-principle model is computable client-side and stable.
- Label it "model estimate," following Webull's disclaimer pattern (W1).

### 2. Implied chance = price, for Rise/Fall, Higher/Lower and digits
- **Best at it:** CDNA Strike Options ("Probability" derived from mid-price) and IBKR ForecastTrader (price = collective probability, with a price-history chart) (N1, I9, I10).
- **Deriv UI:** show "Implied chance 48%" next to the payout, computed as stake ÷ payout. Be transparent that it includes Deriv's margin.
- For a held contract, plot this implied chance over the contract's life as a thin sub-chart. It is the equivalent of ForecastTrader's outcome price chart.

### 3. Tick-native probability cone from entry spot to expiry tick
- **Best at it:** the TradeStation cone vs payoff graph (TS1) and tastytrade's EM shading on the trade-page chart (T3, T4).
- The thinkorswim cone is daily-only (S2), which leaves an open gap for intraday and tick charts.
- **Deriv UI:** a 1σ/2σ fan starting at the current spot and ending at the expiry tick or time, drawn ahead of price in the right-side whitespace. Barrier lines and the shaded payout zone (3.3) overlap the fan, so users see at a glance whether a Higher/Lower barrier sits at 0.5σ or 2σ.
- Update the fan per tick. This maps to rows 5.3, 5.4 and 3.5.

### 4. Interactive payoff diagram for Vanillas and Turbos, with a draggable strike
- **Best at it:** the moomoo P/L Curve (M2).
  - Expiration P/L line plus a current-value curve.
  - Legend toggles: Breakeven, Greeks, Expected Move, Price Probability.
  - Date and IV sliders.
  - A strike handle you drag horizontally to change strike, with the curve updating live.
- **Deriv UI:** a collapsible payoff panel under the chart for Vanillas (strike handle, breakeven marker, max-loss = stake floor) and Turbos (knock-out barrier as a vertical red wall at which P/L drops to −stake).
- Link the strike handle and the chart's horizontal barrier line bidirectionally.
- Add Robinhood-style **scrubbing**: drag across the payoff chart to read P/L at any spot, with a $/% toggle (R2).

### 5. Live stats while dragging (payout preview)
- **Best at it:** Power E*TRADE drag-drop legs, with Max Profit, Max Loss and Delta updating per drop (E3); moomoo live curve (M2).
- **Deriv UI (row 4.5):** while dragging a barrier, show a floating card with payout, implied chance and break-even distance in pips/σ. It updates continuously without a server round-trip, and the proposal request is debounced on release.

### 6. "Simulated returns" slider for Multipliers and Accumulators
- **Best at it:** Robinhood Simulated Returns (R2), with price and time sliders, a press-hold to switch axis, and a $/% toggle.
- **Deriv UI:** for Multipliers, a slider of spot move ±x% showing P/L, with the stop-out and take-profit levels marked.
- For Accumulators, a tick-count slider showing accumulated payout vs the knock-out probability per tick (row 3.8).

### 7. Strike/barrier lattice on the chart
- **Best at it:** IBKR Option Lattice (I3), with strikes as horizontal lines on the price chart, expiries along the x-axis, and bubbles sized by a metric.
- **Deriv UI:** for Vanillas and Turbos, render the available strike/barrier choices as tappable rows on the price axis showing payout-per-point or the multiplier on each row.
- On mobile, combine with a CDNA-style simple list picker (5.7, 5.8).

### 8. Forecast-first contract picker (education plus conversion)
- **Best at it:** IBKR Probability Lab, where you drag your own distribution and the scanner suggests strategies (I1). Also E*TRADE StrategySEEK (outlook + target + date) and the moomoo target-price finder.
- **Deriv UI:** "Where do you think price will be in 5 minutes?" The user drags a target or range on the chart, and the app suggests Higher/Lower, Ends Between/Outside or Touch with payouts.
- This complements Robinhood's per-strategy mini explainer charts in the contract-type picker (R4).

### 9. End-of-contract state messaging
- **Best at it:** CDNA, which raises alerts in the final 3:30 and swaps P&L for "Likely Payout" (N1).
- **Deriv UI (rows 3.5, 3.6, new 3.9):** in the last N ticks or seconds, switch the on-chart P/L chip to "Likely win / Likely loss" with the remaining tick count. Haptic pulse on mobile.

### 10. Mobile chart-trade gestures
- **Best at it:** Webull, where long-press on the chart pre-fills an order at that price and tap-and-drag modifies it (W4). Robinhood mobile has two-tick intervals and trade from chart (R1).
- **Deriv UI:** long-press on the chart sets the barrier at the pressed price, then the trade sheet opens pre-filled.

**Low transfer:** unusual options activity (moomoo, M1) needs real order flow, so it does not apply to synthetic indices. A "trader sentiment" proxy belongs to row 6.1/6.2 instead.

---

## Limitations

- **No hands-on access:** no accounts, logins or screenshots. Feature presence is from docs and reviews only; UI behaviour (e.g., whether thinkorswim mobile Analyze has full sliders) is unverified.
- **Fetch failures:** several official pages could not be fetched. Power E*TRADE trading-tools and release-notes pages timed out; the Schwab Learn page returned an authorisation error; the tastytrade/TradingView press release returned 403. Those claims rely on search-engine excerpts (V\*).
- **No official tastytrade help-centre page found:** chart-specific features (EM shading on the chart, curve view) rest on third-party reviews (C).
- **User sentiment is thin:** Reddit threads were not returned by the search tool, even with `site:reddit.com`. Praise and complaints come from Glassdoor community, Blind, ComplaintsBoard, NerdWallet and StockBrokers.com summaries.
- **Conflicting counts:**
  - Robinhood indicators: 90+ (official) vs 50+ (review).
  - thinkorswim studies: 300+ (Schwab) vs 400+ (review).
  - CDNA contract price range: $0–1 vs $0–10 within the same help page.
- **Not assessed:** accessibility, localisation, theming and measured performance, for every broker.
- **Not covered:** TradeStation charting beyond OptionStation Pro, and Fidelity (dropped).
- **Product status:** Nadex retail shutdown details come from third-party sources only (C).

---

## Sources (all checked 2026-10-27)

**thinkorswim / Schwab**
- S1 https://toslc.thinkorswim.com/center/howToTos/thinkManual/Analyze — V
- S1b https://glasp.co/youtube/dEAZJWT89ZU (summary of Schwab Risk Profile video) — C
- S2 https://www.schwab.com/learn/story/5-thinkorswim-charting-tools-tips ; https://tickertape.tdameritrade.com/trading/stock-market-probability-analysis-thinkorswim-15003 — V\* (excerpt; fetch returned auth error)
- S3 https://toslc.thinkorswim.com/center/howToTos/thinkManual/Trade/Active-Trader/AT-Entering-Orders — V\*
- S4 https://toslc.thinkorswim.com/center/howToTos/thinkManual/Trade/Active-Trader/AT-Ladder — V\*
- S5 https://www.schwab.com/learn/story/thinkorswim-trading-tools-faqs-new-traders — V\*
- S6 https://toslc.thinkorswim.com/center/howToTos/thinkManual/charts/Useful-Tools/Product-Depth — V\*
- S7 https://www.schwabassetmanagement.com/story/set-up-thinkorswim-desktop-options-trading — V\*
- S8 https://www.schwab.com/learn/story/7-basic-thinkorswim-desktop-chart-drawing-tools ; https://international.schwab.com/story/getting-started-with-thinkorswim-charts — V\*
- S9 https://tradingtoolshub.com/review/thinkorswim/ — C
- S10 https://www.schwab.com/trading/thinkorswim/mobile-app ; https://apps.apple.com/us/app/-/id299366785 — V\*
- S11 https://www.businesswire.com/news/home/20220714005053/en/TD-Ameritrade-Makes-Further-Enhancements-to-thinkorswim%C2%AE — C (press)
- S12 https://www.teamblind.com/search/thinkorswim — C
- S13 https://usethinkscript.com/threads/expected-move-probability-cone-for-thinkorswim.10891/ — C
- S14 https://www.glassdoor.com/Community/option-traders-investing/curiouswhats-your-go-to-platform-for-trading-options-ive-bounced-between-thinkorswim-tastytrade-and-webull-and-each — C

**tastytrade**
- T1 https://www.stockbrokers.com/review/tastytrade — C (fetched)
- T2 https://tastytrade.com/desktop-platform/ — V (marketing; generic)
- T3 https://traderc.com/how-to-find-expected-move-before-earnings/ — C
- T4 https://www.dombey.capital/blog/best-options-analysis-tools-for-earnings — C
- T5 https://tastytrade.com/learn/trading-products/options/analyzing-options-greeks/ — V\*
- T6 https://www.businesswire.com/news/home/20220629005370/en/tastyworks-Adds-Risk-Analysis-Tool-to-Help-Traders-Better-Manage-Risks-in-Their-Positions — C (press)
- T7 https://www.businesswire.com/news/home/20241219624238/en/Leading-online-retail-brokerage-tastytrade-offers-integration-with-TradingView — C (press; 403 on fetch)
- T8 https://curvedtrading.com/articles/en/brokers/tastytrade/ — C
- T9 https://www.fool.com/money/buying-stocks/tastytrade-review — C

**Interactive Brokers**
- I1 https://ibkrguides.com/traderworkstation/probability-labsm.htm — V
- I2 https://www.interactivebrokers.com/campus/trading-lessons/ibkr-probability-lab/ — V\*
- I3 https://www.interactivebrokers.com/campus/trading-lessons/ibkr-desktop-option-lattice-view/ — V\*
- I4 https://www.ibkrguides.com/traderworkstation/optiontrader.htm — V\*
- I5 https://ibkrguides.com/traderworkstation/implied-volatility-viewer.htm — V\*
- I6 https://www.interactivebrokers.com/en/trading/option-analytics.php — V\*
- I7 https://www.ibkrguides.com/traderworkstation/chart-parameters.htm — V\*
- I8 https://www.interactivebrokers.com/campus/trading-lessons/tws-chart-layout/ ; https://www.interactivebrokers.com/campus/trading-lessons/using-the-tws-option-layout-library/ — V\*
- I9 https://www.ibkrguides.com/ibkrdesktop/forecasttrader.htm — V
- I10 https://www.interactivebrokers.com/campus/trading-lessons/prediction-markets-at-interactive-brokers/ — V\*
- I11 https://www.interactivebrokers.com/campus/trading-lessons/ibkr-desktop-strategy-builder/ — V\*
- I12 https://quantlabs.substack.com/p/ibkr-desktop-a-new-look-for-interactive — C
- I13 https://www.ibkrguides.com/ibkrdesktop/option-volume-open-interest.htm — V\*

**Robinhood**
- R1 https://robinhood.com/newsroom/introducing-robinhood-legend-charts-on-mobile/ — V
- R2 https://robinhood.com/us/en/support/articles/simulated-returns/ — V
- R3 https://robinhood.com/us/en/support/articles/profit-loss-chart — V\*
- R4 https://robinhood.com/us/en/support/articles/about-the-options-strategy-builder — V\*
- R5 https://robinhood.com/us/en/support/articles/trading-with-robinhood-legend — V\*
- R6 https://robinhood.com/newsroom/hood-summit-2025-news/ — V
- R7 https://x.com/RobinhoodApp/status/1918339376624378334 — V\* (official account)
- R8 https://x.com/RobinhoodApp/status/2069118259081748489 — V\* (official account)
- R9 https://robinhood.com/us/en/newsroom/the-legend-awakens — V\*
- R10 https://beginnerbull.com/robinhood-legend-review/ — C
- R11 https://www.benzinga.com/money/robinhood-legend-review — C
- R12 https://robinhood.com/gb/en/support/articles/widget-linking-on-legend — V\*

**Webull**
- W1 https://www.webull.com/help/faq/11047-Probability-of-Profit — V\*
- W2 https://www.webull.com/trading-investing/options — V (fetched; ITM/OTM/BE claim from search excerpt)
- W3 https://www.webull.com/help/faq/10908-How-can-I-show-positions-and-open-orders-on-my-chart — V\*
- W4 https://www.webullapp.com/learn/MnOumk/SvfXUX/Learn-to-Trade-on-Charts — V\*
- W5 https://www.webull.com/trading-platforms/desktop-app — V\*
- W6 https://apps.apple.com/app/id6449725458 — V\*
- W7 https://www.webull.com.sg/blog/15-US-Options-Trading-in-Singapore-The-Complete-Webull-Platform-Guide — V (partial page)
- W8 https://www.webull.com/help/faq/972-Editing-and-Placing-Multi-Leg-Strategies — V\*
- W9 https://www.stockbrokers.com/review/webull — C
- W10 https://www.complaintsboard.com/webull-b149600 ; https://www.tradingview.com/broker/Webull/reviews/ — C
- W11 https://www.nerdwallet.com/reviews/investing/brokers/webull — C
- W12 https://purepowerpicks.com/webull-review/ ; https://myinvestacademy.com/stocks/best-stock-broker/webull-review/ — C

**moomoo**
- M1 https://www.moomoo.com/us/manual/topic-14-65 — V
- M2 https://www.moomoo.com/us/learn/detail-options-p-l-curve-tutorial-simulate-your-options-trade-to-visualize-potential-profit-and-loss-117884-250876070 — V
- M3 https://www.moomoo.com/my/learn/detail-calculate-stock-price-option-strategies-118036-250808010 — V\*
- M4 https://www.moomoo.com/community/feed/how-i-pick-my-sell-put-using-moomoo-s-p-117452604375046 ; https://www.moomoo.com/community/feed/110427981021190 — C
- M5 https://www.moomoo.com/community/feed/options-hunter-most-loved-options-feature-options-chain-expected-move-116565184479238 ; https://www.moomoo.com/us/learn/detail-options-unusual-activity-how-to-monitor-the-moves-of-large-institutions-potentially-107906-230701074 — C / V\*

**Power E*TRADE**
- E1 https://us.etrade.com/knowledge/library/options/trading-tools — V\* (fetch timed out)
- E2 https://us.etrade.com/platforms/power-etrade — V\*
- E3 https://us.etrade.com/platforms/power-etrade/release-notes — V\* (fetch timed out)
- E4 https://us.etrade.com/platforms/power-etrade/pro/how-to/placing-trades ; https://us.etrade.com/platforms/power-etrade/pro/how-to/tools — V\*
- E5 https://www.brokerage-review.com/online-trading/platforms/power-etrade-review.aspx — C
- E6 https://www.tradealgo.com/trading-guides/options/options-trading-on-etrade — C

**TradeStation**
- TS1 https://help.tradestation.com/09_01/tsoptionpro/topics/twod_graph.htm — V\*
- TS2 https://help.tradestation.com/10_00/eng/tsoptionpro/topics/analysis.htm — V\*
- TS3 https://help.tradestation.com/09_01/tradestationhelp/os_general/ts_probability_calculator.htm — V\*
- TS4 https://help.tradestation.com/09_05/eng/tsoptionpro/topics/graph_types.htm ; https://institutional.tradestation.com/technology/optionstation-pro/ — V\*

**Crypto.com | Derivatives North America (ex-Nadex)**
- N1 https://help.crypto.com/en/articles/8462828-about-strike-options — V
- N2 https://crypto.com/en/product-news/5minstrikes ; https://crypto.com/us/university/strike-option-trading — V\*
- N3 https://www.daytrading.com/nadex ; https://www.binaryoptions.net/nadex-vs-crypto-com ; https://en.wikipedia.org/wiki/Nadex — C
