# 20 — Short-term / binary / fixed-time option platforms: chart & chart-integrated trading UX

Checked: 2026-10-27 (all claims below). Research only: no sign-up, login, deposit or personal data. The only hands-on inspection was the **ExpertOption no-registration demo** (virtual $10,000; one $50 demo trade placed through the coach-mark tutorial; cookie/notification prompts declined).

Evidence labels:
- **V (verified)**: I read the official help centre/blog/notice page myself, or inspected the public demo.
- **C (claimed)**: third-party review/affiliate site, marketing copy, app-store snippet, or an official page seen only through a search snippet (marked "official, snippet").

Source IDs (e.g. `[S6]`) are listed in the "Sources" section at the end. Taxonomy row IDs come from `00-taxonomy.md`. New rows added here: **3.9** purchase-deadline marker, **6.6** live "online users" counter, **8.3** built-in risk controls, **11.6** gamification, **11.7** retail regulatory status.

## Segment roster (final)

| Included | Why |
|---|---|
| IQ Option, Pocket Option, Olymp Trade, Quotex, Binomo, ExpertOption | The core offshore fixed-time / binary set named in the brief; all operating in Oct 2026. |
| **Crypto.com \| Derivatives North America (CDNA, ex-Nadex)** | Still a CFTC DCM, but the Nadex.com platform is **retired**; products now live only in the Crypto.com app (US-only). |
| **Kalshi** (added) | The most important new peer in short-duration fixed-payout contracts: 15-minute crypto up/down and hourly strike ladders, CFTC-regulated, distributed via Robinhood and Coinbase. |
| Raceoption (brief, not in matrix) | Still operating but small, unregulated, mostly withdrawal complaints; little chart documentation. |
| Exnova (note only) | IQ Option look-alike UI, offshore; not separately profiled. |
| **Dropped: Spectre.ai** | Out of business: Forex Peace Army lists "Spectre ai Binary" as out of business (page updated Sep 2026), Traders Union says it was blacklisted in 2024 [X1, X2] (C). The currently active "Spectre AI" (spectreai.io) is an unrelated market-intelligence project. |

---

## 1. IQ Option (iqoption.com / iqbroker.com; EU entity CySEC 247/14, binaries via offshore entity)

**Chart fundamentals**
- Chart types: Line, Candles, Bars, Heikin-Ashi; each has its own colour settings and a "full-width current price line" option [S1] (V), [S3] (C).
- Candle periods 5 s, 10 s, 15 s, 30 s, 1–30 min, 1–12 h, 1 d/1 w/1 M; a separate "timeframe" control sets visible history (e.g. 2 min to 30 days on a Blitz chart) [S2] (C). No tick chart found.
- Keyboard shortcuts Alt+1..Alt+4 switch chart type; interface scale 80–120% [S3] (C).

**Analysis tools**
- Chart Analysis menu with tabs Indicators, Templates, Widgets, Scripts; pencil (drawing) button; "NEW" signals button [S3] (C).
- Indicator count: "over 100" (C, third party); one review says the indicator menu scrolls painfully slowly [S13] (C).
- 2025 added **chart script indicators** ("The Overtake Formula", "Pole Position Strategy", "The Winning Line") that plot signals directly on the chart; promo codes also unlock "exclusive script indicators" [S4] (V).
- Widgets: Traders' Sentiment (buy/sell % bar on the left of the chart, IQ Option clients only), Volume, High/Low, **News on the chart** [S8] (V), [S9] (C).

**Contract visualisation and trade-from-chart**
- Two vertical lines on the time axis: **white dotted line = purchase deadline**, **solid red line = expiry**; before purchase both lines move right as you change expiry; the expiry line carries a countdown [S6] (V), [S7] (C).
- **Digital options: strike levels appear as white boxes on the right edge of the chart; hovering shows how expected profit % changes** (further strike = higher payout, up to 900% advertised); manual strike pick or "auto-select nearest strike" [S6] (V). This is the closest thing in the segment to an on-chart strike ladder with payout preview.
- "Expected profit" and "profit after sale" (green/red) shown while a trade runs; early close via Sell / "Show positions" [S6] (V), [S7] (C).
- Multiple concurrent trades allowed [S6] (V).
- Expiries: **Blitz 30 s+ (5 s for VIP)**, up to 95% payout, 150+ assets; Binary 1 min to 1 month incl. end-of-day/week/month; Digital 1/5/15 min [S4] [S5] (V), [S7] (C).

**Layout, alerts, mobile**
- Chart grids 1/2/3/4 plus "more grids", up to 9 charts [S3] [S15] (C).
- Price alerts from the chart ("+" then "Create Alert") or Alerts tab, synced to mobile [S10] (C, official snippet).
- Progressive Web App traderoom for phones (no download) with 250+ assets, charts and alerts [S4] (V).

**Education / gamification**
- On-platform and YouTube video explainers; multilingual video tutorials in the traderoom [S4] [S8] (V).
- **Performance Dashboard**: win rate vs a 55% benchmark, trading-time heatmap, best/worst assets, leaderboard, **badges** [S4] (V).
- Tournaments (themed/regional, paid and free), racing-sponsorship tournaments, deposit and no-deposit promo codes [S4] (V); entry fees from about $2 [S14] (C).

**Praise**: easy platform, responsive charts, useful indicators, good demo; Trustpilot (iqbroker.com profile) 3.8/5 from 2,505 reviews [S11] (V).
**Complaints**: withdrawals delayed/blocked, account restrictions after wins, slow support; one FPA review alleges a winning trade was reversed seconds after settlement [S11] (V), [S12] (C). The old iqoption.com Trustpilot profile shows "website closed" and a guideline-breach notice [S11b] (V).
**Regulation**: CySEC-licensed EU entity sells CFDs only; binaries via an offshore entity (SVG/Antigua "Sky Ladder LLC"); not available to US, Canada, Australia, UK new clients, EU retail for options; on Singapore/Malaysia warning lists [S12] (C).

## 2. Pocket Option (offshore; MISA Comoros licence T2023322)

- Chart types: Candles, Bars, Line (optional area fill), Heikin-Ashi; timeframes 5 s to 1 month [P1] (V). Tick-based line chart; per-candle countdown via "Enable timer" setting [P3] (C).
- Indicators 30+ (oscillators, bands, Alligator, AO, OBV, MFI, Ichimoku); drawing tools incl. trend lines, Fibonacci, rectangles, channels; **chart templates** [P1] (V); about 9 drawing tools incl. Andrew's pitchfork [P3] (C).
- **Multi-chart: 2 or 4 charts** via button next to the logo [P1] (V).
- Open trades: a vertical "time until expiration" line with a timer on the chart; for digital trades a half-minute "corridor" between a purchase-deadline line and the expiry line [P4] (C). Expiry as clock time (snaps to candle close) or duration, adjustable to the second; Quick Trading 30 s–5 min typical, up to 24 h [P2] (V), [P8] (C).
- Sentiment (% up vs down) panel; **pending trades by price or time** [P5] (C).
- Signals ("Analytics and signals" algorithm) presented as a starting point, not orders [P2] (V).
- Social/copy trading (copy master traders by stats and achievements, $0.5/copy) [P6] [P7] (C).
- Gamification: tournaments (free/paid), **achievements**, "Gems" lottery, Express Trades (3+ legs, multiplier-like payout), loyalty tiers that unlock features and +2% payout at $1,000+ [P6] (C).
- Demo: $50,000 virtual, but **only after registration**; the public "demo-quick-high-low" URL now redirects to the login page [P2] [P12] (V).
- Mobile: Android app (Google Play 4.4, about 74K reviews, 5M+ installs; AppBrain 9.8M installs) and PWA [P2] (V), [P11] (C).

**Praise**: feature-rich, fast crypto withdrawals for some users [P13] (C).
**Complaints**: claims that price moves against the trade after clicking, duplicated/mis-sized executions, balance resets under T&C section 10.3, blocked withdrawals [P13] (C, unverified individual reviews). **Trustpilot has removed the pocketoption.com profile for breaching its guidelines** [P10] (V).
**Regulation**: no top-tier licence; FCA warning (updated Feb 2026), CFTC RED list, CONSOB, RBI alert list, Malaysia SC; does not serve EEA, US, Israel, UK, Japan [P9] (C).

## 3. Olymp Trade (Olymptrade; VFSC offshore + FinaCom member)

- Chart types: Area, Japanese candlestick, Heikin-Ashi, Bars; timeframes from 5 s ("short 5 s–30 m", medium 1–4 h, long 1 d/7 d/1 M) [O1] (V).
- Official tool counts: **15 indicators + 17 oscillators**, drawing tools (Fibonacci levels and fan, horizontal/vertical lines, trend lines, rays), **45 trading strategies**; more strategies/indicators unlock by status tier (Basic/Smart/Pro/Elite) [O2] (V).
- **Smart RSI AI assistant** suggests short-term entry points; trading signals with market alerts [O2] (V).
- **"Traders' Choice" sentiment**: red = share of Down trades, green = Up [O2] (V); shown on the left of the chart [O5] (C).
- **Strike price menu: a table with strikes in the middle column, Down-trade profitability on the left, Up-trade profitability on the right** [O3] (V). A clean strike-ladder pattern.
- Fixed Time durations typically 1–60 min (5 s on composite indices), max 23 h; "Clock" mode sets an exact close time; **pending orders by price level or time** via "Enable Orders" [O3] (V), [O4] (C, official snippet).
- Built-in protections: **Risk-Free Trades** (loss refunded) and **Flat Market Protection** (stake refunded if open and close differ by one point; toggleable) [O3] (V).
- Multi-chart and price alerts listed as available [O6] (C).
- Demo / platform requires login (redirect observed) [O9] (V).
- Mobile: Google Play 4.1 stars, about 1M reviews, 100M+ downloads; AppBrain 140M installs, updated 1 Oct 2026 [O8] (C).

**Praise**: long-time users call it reliable with smooth withdrawals; strong platform/tools score (DayTrading 4.3) [O8] [O10] (C).
**Complaints**: AI-chatbot-only support, deposits not credited, surprise "verification payment" before withdrawal [O8] (C).
**Regulation**: VFSC (tier 3) and FinaCom only; CySEC warning (2024), Malaysia alert list, banned in Russia, investigated in India; not available in US, UK, EU/EEA, Canada, Australia, Japan, etc. [O7] (C).

## 4. Quotex (qxbroker.com / quotex.com; On Spot LLC, St Kitts & Nevis)

- Chart types: area/line, candles, bars, Heikin-Ashi; timeframes 5 s to 1 d; trades expire 5 s to 4 h, settable to the second [Q2] [Q5] [Q9] (C).
- Indicators: counts vary 20–30+ by source; drawing tools trend lines, Fibonacci, pitchfork, triangles, rectangles; Pro tier unlocks more tools; no custom indicators or backtesting [Q2] [Q5] [Q7] (C).
- **Sentiment scale left of the chart**; 2026 "Pair Information" shows trader sentiment and price change over 5 min / 60 min / 1 day [Q1] [Q5] (C).
- Signals list (direction, asset, timeframe; refreshes every 10–15 min; accuracy mixed) [Q1] (C).
- **Pending trades** by price or execution time [Q3] (V); "Double up" duplicates an open position (C, official Telegram, older post via snippet).
- **Daily loss limit risk-management tool that pauses trading until the next day** [Q6] (C).
- Mobile: Android app; **iOS via PWA only** [Q3] (V).
- Gamification: weekly "Free Friday" tournament ($1,000 pool), "Crazy Wednesday" ($10 entry, $10,000 pool), **Risk-Free promo codes for the 100 most active traders of the week** [Q3] (V); 30% deposit bonus with withdrawal restrictions; Pro/VIP payout tiers [Q1] (C).
- Demo requires sign-in (redirect observed) [Q8] (V).

**Praise**: uncluttered UI for beginners, sub-second execution, charts load in under 2 s [Q1] [Q7] (C).
**Complaints**: payouts fluctuating 82% to 68% on the same asset; limited alerts/history analytics; withdrawals blocked, deposits not credited [Q1] (C), [Q4] (V). **Trustpilot withholds the TrustScore for a guideline breach and has removed fake reviews** [Q4] (V).
**Regulation**: IFMRRC registration expired 2021; CNMV and NSSMC warnings; no negative balance protection [Q1] (C).

## 5. Binomo (FinaCom member only)

- Chart types: line, candle, bar, area/"mountain", Heikin-Ashi; timeframes 5 s to 30 days; **dual-chart mode** [B1] (C).
- **5ST (5-second trades)** only on EUR IDX / Crypto IDX and **only on a 1-second timeframe**; FTT 1–60 min; "non-stop mode" keeps several positions open [B2] [B7] (C).
- 15–25 indicators plus preset setups (Pathfinder = BB+RSI+SMA; Quantum Rise = RSI+MACD); drawing tools incl. Fibonacci, channels, pitchfork, up to 20 drawings per chart; iOS app limited to MA, Alligator, Bollinger [B1] [B2] [B7] (C).
- **"Majority opinion" sentiment bar**; signals button; economic calendar [B1] (C).
- Order summary lives in a separate tab rather than next to the chart (reviewer complaint) [B2] (C).
- Tiers Standard/Gold/VIP/Prestige with deposit bonuses up to 300% and 5% monthly cashback on losing trades; tournaments free and paid; copy trading with leaderboard [B2] (C).
- Trading page redirects to auth (no public demo) [B6] (V).

**Praise**: fast deposits/withdrawals in some 5-star reviews [B3] (V).
**Complaints**: 51% one-star on Trustpilot; frozen accounts, deposits not credited, VIP callbacks not honoured; **Trustpilot TrustScore withheld for guideline breach, fake reviews removed** [B3] (V).
**Regulation**: CySEC warning (2019), Indonesian domain blocks, FCA warning on related entity; SEBI advisory and RBI alert list in India [B4] [B5] (C).

## 6. ExpertOption (offshore; claims VFSC/SVG, Financial Commission member) — demo inspected

Observed in the no-registration demo at `expertoption.com/?demo=true` → `app.expertoption.com` [E1] (V):
- Entire traderoom is **canvas-rendered** with an accessibility overlay. Overlay labels are developer IDs and partly swapped: the SELL control is labelled `at_buy_button` and BUY `at_sell_button`.
- Default chart: **tick-level area line** on EUR/USD (OTC), 6-decimal prices, live price tag on the price axis. **The price tag carries the payout for both directions ($92.00 green above, $92.00 red below for a $50 stake at 84%)**.
- Toolbar: Strike Rate, Graph Style, Indicators, Pencil, Lines, Crosshair, Social, Grid, zoom in/out.
- Graph style: **Area, Line, Candles, Bars** (no Heikin-Ashi).
- Indicators (34 listed): Alligator, Awesome Osc., Bollinger, Fractal, MACD, MA, Parabolic SAR, RSI, Stochastic, ATR, Stoch RSI, Momentum, ADX, ROC, CCI, Aroon, Williams, CMO, Linear Regression (+slope), NATR, ADXR, APO, Aroon Osc., Average Price, Balance of Power, plus **candlestick-pattern markers** (Doji, Two Crows, Three Black Crows, Three Inside/Outside, Three Stars in the South, Three White Soldiers, Abandoned Baby).
- Drawing: Lines (horizontal, vertical, ray) and a **freehand Pencil** mode with undo/redo/eraser/move.
- **Strike rates list: 9 strikes around spot with the payout for Down and Up at each strike, plus a "Closest to current rate" checkbox**. At-the-money $92/$92; further OTM up to $96.
- Expiry: "auto close" duration stepper defaulting to **00:00:05** (5-second trades), arrows or manual entry.
- **Other traders' deals appear on the chart as avatar bubbles with stake amounts** (e.g. $50, $1,000, $10,000) even before you trade; a header shows a live "**2,9xx online**" counter.
- Right panel: Deals / Trends / Social / Start Tips. Left nav: Trade, Apps, Education, Trade history, Withdrawal, Help, **Battles**, **Invite and Earn**, **Leagues**.
- Onboarding: modal "Start quick tutorial", **6-step coach marks** (chart, asset, amount, auto-close time, Buy, Sell) ending with "Trade Now"; after the first deal a "Congratulations! You've opened your first deal" toast, then a notification-permission prompt pitching "exclusive offers", then a "2 bonuses" button in the header.
- Mobile: Google Play 4.6 stars, 285K reviews, 50M+ installs [E5] (C).

**Praise**: usability stronger than trust; VerifyMyTrade execution audit [E2] [E3] (C).
**Complaints**: withdrawal delays/rejections, account blocks, verification up to 30 days [E3] [E6] (C). **Trustpilot profile removed for breaching guidelines** [E4] (V).
**Regulation**: conflicting VFSC/SVG claims; Quebec AMF warning; not available in US, Canada, EEA, UK, Australia, Japan and others [E2] [E3] (C).

## 7. Crypto.com | Derivatives North America (CDNA, formerly Nadex)

- **Status**: Nadex stopped new applications (notice ID dated 4 Dec 2025), suspended deposits 6 Dec 2025 and **disabled trading on Nadex.com on 20 Dec 2025**; products continue as "Crypto Derivatives and Prediction Markets" in the Crypto.com app [N1] (V), [N2] (C). (The notice labels both dates "Friday", which fits 2024 rather than 2025; the notice ID and FinanceFeeds' 8 Dec 2025 article confirm 2025.) The exchange remains a CFTC DCM/DCO; a September 2026 SEC Form 1-N adds single-stock futures; ownership reported moved to OG.com [N8] (C).
- **Strike Options**: Yes/No on "above strike at expiry"; durations **5 min / 20 min / 2 h / daily / weekly**; screen shows **"Probability"** (bid/ask midpoint) and **"Max payout" multiplier**; early exit at live bid; **liquidity alert 3 min before expiry and a "Low Liquidity Zone" in the last 30 s**; US only [N3] (V).
- **Rolling Strike Options (Auto-Roll)**: a winning position automatically re-opens with a new strike until it loses or is closed [N4] (V).
- **UpDown Options**: knock-out contracts with Target and Stop levels (a "range"), four contracts per token with effective leverage, 250-position limit, alert near expiry [N5] (V).
- Strike ladders per CFTC self-certifications (April 2026): intraday 2-hour FX event contracts with 11–13 strikes at fixed intervals around an at-the-money strike [N7] (C, official filings via snippet).
- Charting inside the app for these products is not documented in help articles (?); third party lists TradingView support [N9] (C). Nadex's legacy desktop ladder UI is gone and could not be inspected.

## 8. Kalshi (added; CFTC-regulated event exchange)

- 15-minute crypto "Up or Down" markets open every quarter hour on 9 coins plus a "Crypto Leader" market; target = 60-s average of CF Benchmarks index before the window; contracts priced 1–99¢ so **price reads as probability**; cards show target, Up/Down with **payout multiple and %** (e.g. "Up 2.81x 33%") [K1] [K2] [K3] (C).
- Hourly and longer markets use **above/below threshold ladders and band ladders** [K2] (C).
- Same contracts distributed through Robinhood and Coinbase [K4] (C).
- Charts are contract-probability histories, not underlying-asset trading charts (C); no indicators/drawing.

## 9. Raceoption (brief)
Operating in 2026 (reviews to Oct 2026), Makerun Corp (Marshall Islands), unregulated; warnings from CNMV, CMVM, ASC, Finanstilsynet, NSSMC, AMF; dominant complaint is refused withdrawals [X3] [X4] (C). No usable chart documentation found; excluded from the matrix.

---

## Feature matrix

Legend: ✅ full, ◐ partial, ❌ none / product not offered, ? unknown. Cell suffix = source ID; (V)/(C) per the evidence labels above.
Columns: **IQ** IQ Option · **PO** Pocket Option · **OT** Olymp Trade · **QX** Quotex · **BN** Binomo · **EO** ExpertOption · **CD** CDNA (Crypto.com app) · **KS** Kalshi

| ID | Feature | IQ | PO | OT | QX | BN | EO | CD | KS |
|---|---|---|---|---|---|---|---|---|---|
| 1.1 | Chart types | ✅ Line/Candle/Bar/HA S1 V | ✅ Area/Line/Candle/Bar/HA P1 V | ✅ Area/Candle/HA/Bar O1 V | ✅ Area/Candle/Bar/HA Q2 C | ✅ 5 types B1 C | ◐ Area/Line/Candle/Bar, no HA E1 V | ? | ◐ probability-history only K2 C |
| 1.2 | Tick & sub-minute granularity | ✅ 5/10/15/30 s S2 C | ✅ tick line + 5 s P1 V, P3 C | ✅ from 5 s O1 V | ✅ from 5 s Q2 C | ✅ 1 s (5ST) B7 C | ✅ tick line default E1 V | ? | ❌ |
| 1.3 | History depth / lazy load | ◐ up to 30 d window S2 C | ? | ? | ? | ◐ to 30 d B1 C | ? | ? | ? |
| 1.4 | Animated real-time ticks | ? | ? | ? | ? | ? | ✅ live tick line with moving head E1 V | ? | ? |
| 1.5 | Price precision | ? | ? | ? | ? | ? | ✅ 6-dp FX OTC E1 V | ? | ? |
| 2.1 | Indicators | ✅ "100+" + scripts S4 V, S13 C | ✅ 30+ P1 V | ✅ 15 ind + 17 osc (tiered) O2 V | ◐ 20–30 Q2 C | ◐ 15–25, iOS 3 B1 C | ✅ 34 incl. pattern markers E1 V | ❌ (not documented) | ❌ |
| 2.2 | Templates / saved studies | ✅ Templates tab S3 C | ✅ templates P1 V | ◐ 45 preset strategies O2 V | ? | ◐ preset setups B2 C | ? | ❌ | ❌ |
| 2.3 | Drawing tools | ✅ pencil menu S3 C | ✅ ~9 tools P1 V, P3 C | ✅ Fib/lines/rays O2 V | ✅ Fib/pitchfork/shapes Q2 C | ✅ incl. 20 per chart B1 C | ◐ H/V/ray + freehand E1 V | ❌ | ❌ |
| 2.4 | Magnet / snapping | ? | ? | ? | ? | ? | ? | ❌ | ❌ |
| 3.1 | Entry/exit markers | ◐ entry = strike, profit shown S7 C | ◐ P4 C | ? | ◐ entry = strike Q9 C | ? | ✅ deal bubble with stake E1 V | ? | ❌ |
| 3.2 | Barrier / strike lines | ✅ strike boxes on chart (digital) S6 V | ? | ◐ strike table, on-chart ? O3 V | ? | ? | ◐ strike list; payout tag on price axis E1 V | ◐ strike selection N3 V | ◐ target on card K3 C |
| 3.3 | Shaded win/lose zones | ? | ? | ? | ? | ? | ◐ green/red payout tags above/below price E1 V | ? | ❌ |
| 3.4 | Live P/L | ✅ expected profit / profit after sale S6 V | ◐ P4 C | ? | ◐ Q9 C | ? | ? | ✅ live bid / probability N3 V | ✅ live price K1 C |
| 3.5 | Expiry countdown on time axis | ✅ red expiry line + countdown S6 V | ✅ "time until expiration" line + timer P4 C | ? | ? | ? | ◐ vertical expiry line observed E1 V | ◐ 3-min alert + last-30 s zone N3 V | ❌ |
| 3.6 | Win/lose animation | ? | ? | ? | ? | ? | ◐ celebratory toast E1 V | ? | ? |
| 3.7 | Multiple open contracts | ✅ S6 V | ✅ P8 C | ✅ O4 C | ✅ incl. "double up" Q3 C | ✅ non-stop mode B2 C | ✅ deals list E1 V | ✅ up to 250 N5 V | ✅ |
| 3.8 | Knock-out / range products on chart | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ◐ UpDown target/stop, chart ? N5 V | ❌ |
| 3.9 | Purchase-deadline marker (new) | ✅ white dotted line S6 V | ◐ digital "corridor" P4 C | ? | ? | ? | ? | ◐ low-liquidity zone N3 V | ❌ |
| 4.1 | Drag barrier/strike | ❌ (hover/select boxes) S6 V | ? | ? | ? | ? | ❌ (dialog) E1 V | ? | ❌ |
| 4.2 | Click-to-place on chart | ◐ pick strike box on chart S6 V | ? | ? | ? | ? | ❌ E1 V | ? | ❌ |
| 4.3 | One-click trade | ✅ Higher/Lower S5 V | ✅ P2 V | ✅ Up/Down O4 C | ✅ Q9 C | ✅ B1 C | ✅ Buy/Sell E1 V | ◐ review step N6 C | ◐ |
| 4.4 | Set expiry on time axis | ◐ lines track selected expiry S6 V | ◐ clock-time snaps to candle close P8 C | ◐ "Clock" close time O4 C | ? | ? | ❌ stepper only E1 V | ❌ | ❌ |
| 4.5 | Payout preview while choosing | ✅ hover shows % per strike S6 V | ◐ payout % before entry P2 V | ✅ per-strike up/down table O3 V | ? | ? | ✅ per-strike payout + price-tag payout E1 V | ✅ max payout multiplier N3 V | ✅ multiple + % K3 C |
| 5.1 | Payoff diagram | ? | ? | ? | ? | ? | ❌ E1 V | ? | ❌ |
| 5.2 | Probability of win shown | ◐ implicit via payout/strike S6 V | ? | ? | ? | ? | ❌ E1 V | ✅ "Probability" N3 V | ✅ price = % K3 C |
| 5.3–5.6 | Cones / IV bands / Greeks / vol surface | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 5.7 | Strike ladder | ✅ digital strike boxes S6 V | ? | ✅ strike menu table O3 V | ? | ? | ✅ 9-strike list E1 V | ✅ 11–13 strikes N7 C | ✅ threshold/band ladders K2 C |
| 5.8 | Option chain overlay on chart | ◐ strike boxes on chart edge S6 V | ? | ? | ? | ? | ❌ E1 V | ? | ❌ |
| 6.1 | Sentiment % | ✅ widget S8 V, S9 C | ✅ P5 C | ✅ Traders' Choice O2 V | ✅ scale + Pair Info Q1 C | ✅ Majority opinion B1 C | ◐ "Trends" tab present E1 V | ◐ market price N3 V | ✅ % on card K3 C |
| 6.2 | Others-trading / social feed | ◐ community deals, leaderboard S14 C | ✅ copy trading P6 C | ? | ◐ copy tab Q1 C | ◐ copy trading B2 C | ✅ others' deals on chart + Social E1 V | ❌ | ◐ volume K3 C |
| 6.3 | Session shading | ? | ? | ? | ? | ? | ? | ? | ❌ |
| 6.4 | News / calendar on chart | ✅ News widget on chart S8 V | ? | ◐ signals use news O10 C | ? | ◐ econ calendar B1 C | ? | ❌ | ❌ |
| 6.5 | Volatility aid for OTC/synthetic | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | n/a | n/a |
| 6.6 | Live "online users" counter (new) | ? | ? | ? | ? | ? | ✅ "2,9xx online" E1 V | ❌ | ❌ |
| 7.1 | Contract replay | ? | ? | ? | ? | ? | ? | ? | ? |
| 7.2 | Trade-history markers | ? | ? | ◐ trade history O6 C | ◐ limited Q1 C | ? | ◐ Trade history section E1 V | ? | ? |
| 7.3 | Journal / analytics | ✅ Performance Dashboard S4 V | ◐ trading stats P6 C | ? | ◐ real-only stats Q5 C | ? | ? | ❌ | ❌ |
| 7.4 | Screenshot / share | ? | ? | ? | ? | ? | ? | ? | ? |
| 8.1 | Price / indicator alerts | ✅ chart alerts S10 C | ? | ✅ O6 C | ◐ limited Q1 C | ? | ? | ◐ expiry alert N3 V | ? |
| 8.2 | Signals / bot overlays | ✅ script indicators + signals S4 V | ✅ signals P2 V | ✅ Smart RSI AI + signals O2 V | ✅ signals Q1 C | ✅ signals B1 C | ? | ❌ | ❌ |
| 8.3 | Built-in risk controls (new) | ◐ 55% benchmark S4 V | ? | ◐ flat-market protection O3 V | ◐ daily loss limit Q6 C | ? | ? | ✅ fully collateralised N5 V | ✅ max loss = price K1 C |
| 9.1 | Multiple charts | ✅ up to 9 S3 S15 C | ✅ 2 or 4 P1 V | ◐ O6 C | ? | ◐ dual B1 C | ? ("Grid" icon) E1 V | ? | ❌ |
| 9.2 | Chart sync | ? | ? | ? | ? | ? | ? | ? | ❌ |
| 9.3 | Saved layouts | ◐ remembers grid S3 C | ◐ templates P1 V | ? | ? | ? | ? | ? | ❌ |
| 9.4 | Compare symbols | ? | ? | ? | ? | ? | ? | ? | ❌ |
| 9.5 | Keyboard shortcuts | ✅ Alt+1..4 S3 C | ? | ? | ◐ claimed Q2 C | ? | ? | ❌ | ? |
| 10.1 | Mobile / portrait-first | ◐ PWA + app S4 V | ◐ Android + PWA P2 V | ✅ app 100M+ O8 C | ◐ Android, iOS PWA Q3 V | ◐ iOS limited B1 C | ✅ app 50M+ E5 C | ✅ app-only N1 V | ✅ app |
| 10.2–10.4 | Gestures / haptics / low-end | ? | ? | ? | ? | ? | ? | ? | ? |
| 10.5 | Chart–trade panel integration | ◐ right panel S3 C | ◐ right panel P2 V | ◐ right panel O4 C | ◐ Q9 C | ❌ separate tab B2 C | ✅ panel under chart E1 V | ? | ? |
| 11.1 | Performance | ◐ desktop lowest latency, slow menu S13 C | ? | ? | ✅ <2 s load, <1 s exec Q7 C | ? | ? | ? | ? |
| 11.2 | Accessibility | ? | ? | ? | ? | ? | ◐ canvas + mislabelled overlay E1 V | ? | ? |
| 11.3 | Localization | ✅ multilingual tutorials S8 V | ? | ? | ? | ? | ✅ language picker E1 V | ? | ? |
| 11.4 | Theming | ◐ colours, 80–120% scale S1 V, S3 C | ? | ? | ? | ? | ? | ? | ? |
| 11.5 | Onboarding / education | ✅ in-app video lessons S4 V | ◐ demo after signup P2 V | ✅ strategies/education O2 V | ◐ demo after signup Q8 V | ? | ✅ no-signup demo + 6-step coach marks E1 V | ◐ help centre N3 V | ? |
| 11.6 | Gamification (new) | ✅ tournaments, badges, promo codes S4 V | ✅ tournaments, achievements, Gems P6 C | ◐ tiers, risk-free trades O2 O3 V | ✅ tournaments, activity rewards Q3 V | ✅ tournaments, tiers, cashback B2 C | ✅ Battles, Leagues, Invite & Earn, bonuses E1 V | ◐ Auto-Roll N4 V | ❌ |
| 11.7 | Regulated for retail in a major jurisdiction (new) | ❌ binaries offshore only S12 C | ❌ P9 C | ❌ O7 C | ❌ Q1 C | ❌ B4 C | ❌ E3 C | ✅ CFTC, US only N3 V | ✅ CFTC K4 C |

Regulatory backdrop (applies to all offshore brokers): ESMA prohibited marketing/sale of binary options to EU retail from 2 July 2018 and let the EU-wide measure lapse in July 2019 once national authorities had permanent equivalents [R1] [R2] (C, official snippet); FCA permanent UK ban from 2 April 2019, wider than ESMA's [R3] (C, official snippet); ASIC banned OTC binaries to retail from 3 May 2021, extended to 1 Oct 2031 [R4] (C, official snippet).

---

## Ideas Deriv could adopt (short-term contracts)

1. **Purchase-deadline + expiry lines on the time axis with a live countdown** (IQ Option). For tick contracts, render "tick 3 / 5" rungs along the time axis instead of seconds; for minute contracts, show the buy cut-off as a dotted line that slides with the duration picker.
2. **On-chart strike ladder with payout preview** (IQ digital strike boxes; ExpertOption 9-strike list with "closest to current rate"; Olymp Trade's Down | strike | Up table). For Higher/Lower and Touch/No Touch, show rungs on the price axis with payout per rung, and let users drag the barrier with snapping to rungs and a live payout label.
3. **Payout on the live price tag for both directions** (ExpertOption shows "+$92 / $92" green/red at the current price). Deriv could put Rise/Fall payouts directly on the spot label.
4. **Show implied probability next to payout** (CDNA "Probability", Kalshi price = %). Helps users understand that bigger payouts mean lower odds. It informs the decision rather than nudging it.
5. **Near-expiry state communication** (CDNA's 3-minute alert and last-30-second "Low Liquidity Zone"). Deriv could shade the period where sell-back is disabled or the contract is locked.
6. **Pending/conditional entries by price or time** (Pocket Option, Quotex, Olymp Trade "Enable Orders").
7. **Opt-in risk tools**: daily loss limit that pauses trading (Quotex), and a performance view with a break-even benchmark (IQ Option's 55% line maps directly to binary break-even maths).
8. **Candlestick-pattern markers as indicators** (ExpertOption lists Doji, Three Black Crows and others as toggleable markers). Cheap to add, beginner-friendly.
9. **No-signup demo chart with coach marks** (ExpertOption's 6-step tutorial on a virtual balance). The rest of the segment now gates demos behind registration, so this is a differentiator.
10. **Multi-chart grid (2/4, up to 9)** and **news/economic-calendar markers on the chart** (IQ Option).
11. **1-second candles for ultra-short contracts** (Binomo runs 5-second trades only on a 1-s timeframe), keeping chart granularity aligned with contract duration. Quotex's own blog makes the same point about mismatched candle/expiry.
12. **Sentiment widget, clearly labelled as "Deriv clients only"** (IQ Option's widget reflects only its own clients). Present it as context, never as a signal.

## Patterns to avoid (dark patterns / over-trading risk)

- **Social-proof pressure on the chart**: live "2,9xx online" counters and other traders' stake bubbles ($1,000, $10,000) drawn on the price line (ExpertOption).
- **Rewarding activity, not outcomes**: Risk-Free promo codes for the "100 most active traders" (Quotex), loss cashback for VIPs (Binomo), and "risk-free trades" in general (Olymp Trade, Quotex). These encourage volume and loss-chasing.
- **Speed as a status perk**: 5-second Blitz expiries reserved for VIPs (IQ Option); 5-second default expiry with no friction (ExpertOption).
- **One-tap repetition**: "Double up" to duplicate an open position (Quotex) and Auto-Roll that re-enters after every win (CDNA). Both make streaks automatic.
- **Celebration plus immediate re-engagement**: "Congratulations on your first deal" toast, then a notification-permission prompt for "exclusive offers", then a "2 bonuses" header nag (ExpertOption).
- **Paid-entry tournaments, leagues, battles, lotteries ("Gems"), badges** tied to trading volume (IQ Option, Pocket Option, Quotex, ExpertOption).
- **Deposit bonuses with withdrawal locks** (Quotex 30%, Binomo up to 300%).
- **Sentiment and "AI signals" presented near the trade button** without base rates or accuracy disclosure (Quotex's signal accuracy is "mixed"; Olymp Trade's Smart RSI AI suggests entries).
- **Opaque synthetic "OTC" price feeds**, the source of most "rigged chart" complaints; Deriv's synthetic indices should keep their published RNG/auditing disclosures visible from the chart.
- **Shifting payouts** on identical assets (Quotex 82% to 68%) without on-chart explanation.
- **Accessibility shortcuts**: canvas UI with developer-ID labels, some swapped (BUY/SELL) (ExpertOption). Screen-reader users could place the wrong trade.
- Reputation risk: Trustpilot has removed or flagged profiles of Pocket Option, ExpertOption, Quotex and Binomo for guideline breaches or fake reviews.

## Limitations

- **Demos behind login**: Pocket Option, Quotex, Olymp Trade and Binomo redirect to sign-in/registration (observed 2026-10-27), so their on-chart trade rendering (entry lines, zones, outcome animations) is only described from third-party guides or remains "?". IQ Option's traderoom was not attempted (registration required per guides).
- **ExpertOption** was the only hands-on inspection. The canvas UI rendered erratically in the in-app browser pane after a resize, so the live appearance of my own open deal and its expiry handling could not be captured cleanly. The Trends and Social panel contents and the "Grid" function were not inspected.
- **CDNA / Kalshi**: in-app US-only products; no screenshots inspected. Kalshi pages returned HTTP 429, so its UI details are third-party.
- **App stores**: Google Play pages could not be fetched (content truncated); ratings come from search snippets and AppBrain. Apple App Store ratings were not verified.
- **Reviews**: no Reddit threads surfaced in search; Trustpilot profiles for several brokers are removed or flagged; many review sites are affiliates. Treat complaint themes as unverified individual reports.
- Indicator counts differ by source, account tier and device. Third-party counts are marked C.
- Nadex's legacy ladder UI is retired and could not be examined.

---

## Sources (all checked 2026-10-27)

IQ Option
- [S1] https://blog.iqoption.com/en/choosing-the-best-chart-type-for-you/ — V
- [S2] https://iqoptionwiki.com/time-frames-on-iq-option/ — C
- [S3] https://iqoptionwiki.com/interface-guide-iq-option/ — C (screenshots dated 2026-10-05)
- [S4] https://blog.iqoption.com/en/iq-option-12th-anniversary-updates/ — V
- [S5] https://blog.iqoption.com/en/iq-option-introduces-blitz-options-up-to-95-profit-from-5-seconds/ — V
- [S6] https://blog.iqoption.com/en/how-to-trade-digital-options-an-advanced-version-of-binary-options/ — V
- [S7] https://iqoptionwiki.com/what-is-options-trading/ — C
- [S8] https://blog.iqoption.com/en/iq-option-traderoom-top-features-you-need-to-know/ — V
- [S9] https://medium.com/@iqoptionwiki123/guide-to-using-the-iq-option-traders-sentiment-widget-9f7673f12e28 — C
- [S10] https://blog.iqoption.com/en/use-the-platform-to-the-fullest-how-to-customize-it-according-to-your-strategy/ — C (official, snippet)
- [S11] https://www.trustpilot.com/review/iqbroker.com — V; [S11b] https://www.trustpilot.com/review/iqoption.com — V
- [S12] https://www.fxleaders.com/forex-brokers/forex-brokers-review/iq-option-review/ ; https://en.wikipedia.org/wiki/IQ_Option ; https://spindepth.com/news/is-iq-option-legal-country-by-country-2026 — C
- [S13] https://www.binaryoptions.net/iq-option — C
- [S14] https://tradingfinder.com/option/iq-option/dashboard/ — C
- [S15] https://medium.com/@iqoptionwiki/multi-charts-on-iq-option-platform-6cafd1044cf7 — C

Pocket Option
- [P1] https://pocketoption.com/blog/en/knowledge-base/trading/how-to-read-pocket-option-charts/ — V
- [P2] https://pocketoption.com/blog/en/knowledge-base/learning/how-to-use-pocket-option-for-beginners/ — V
- [P3] https://tradingfinder.com/option/pocket-option/trading-platform/ — C
- [P4] https://pocketoptionblog.com/how-to-trade-at-pocket-option-for-beginners-100159 — C
- [P5] https://tradingfinder.com/option/pocket-option/dashboard/ — C
- [P6] https://www.daytrading.com/pocket-option ; https://tradingfinder.com/option/pocket-option/social-trading/ — C
- [P7] https://m.pocketoption.com/en/land/social-trading/ — C (official, snippet)
- [P8] https://tradersunion.com/brokers/binary/view/pocketoption/quick-trading/ — C
- [P9] https://investingintheweb.com/reviews/pocket-option-review/ ; https://www.wikifx.com/en/newsdetail/202607068774484456.html — C
- [P10] https://www.trustpilot.com/review/pocketoption.com — V (profile removed)
- [P11] https://play.google.com/store/apps/details?id=com.pocketoption.broker&hl=en_US ; https://www.appbrain.com/app/pocket-option/com.pocketoption.broker — C
- [P12] https://pocketoption.com/en/cabinet/demo-quick-high-low/ — V (redirects to login)
- [P13] https://se.trustpilot.com/review/pocketoptions.com — C

Olymp Trade
- [O1] https://plus.olymptrade.com/en/help/category/how-to-start-trading/chart-types-and-timeframes — V
- [O2] https://olymptrade.com/pages/trading/technical-analysis-tools/ — V
- [O3] https://faq.olymptrade-support.com/en/articles/569859-how-fixed-time-trades-work-on-olymptrade — V
- [O4] https://plus.olymptrade.com/en/help/category/trade-guide/choice-of-trade-conditions ; https://plus.olymptrade.com/en/help/category/how-to-start-trading/fixed-time-mode — C (official, snippet)
- [O5] https://www.olymptradewiki.com/sentiment-indicator-on-olymp-trade/ — C
- [O6] https://tradingfinder.com/option/olymp-trade/dashboard/ ; https://pippenguin.net/reviews/olymp-trade-review/ — C
- [O7] https://tradingcritique.com/broker-review/olymp-trade/ ; https://brokerchecker.org/reviews/olymp-trade-review/ — C
- [O8] https://play.google.com/store/apps/details?id=com.ticno.olymptrade ; https://www.appbrain.com/app/olymptrade-trading-online/com.ticno.olymptrade — C
- [O9] https://olymptrade.com/platform — V (redirects to login)
- [O10] https://www.daytrading.com/olymp-trade — C

Quotex
- [Q1] https://www.binaryoptions.net/quotex-io — C (updated 2026-08-11)
- [Q2] https://tradingfinder.com/option/quotex/trading-platform/ — C
- [Q3] https://t.me/s/quotex_official — V (official channel)
- [Q4] https://www.trustpilot.com/review/quotex.io — V
- [Q5] https://www.daytrading.com/quotex — C
- [Q6] https://iamforextrader.com/en/broker/quotex/ — C
- [Q7] https://www.fxknows.com/en/news/quotex-review-2026-is-quotex-safe-regulation-payouts-fees/ — C
- [Q8] https://quotex.io/en/demo-trade — V (redirects to sign-in)
- [Q9] https://tradersunion.com/brokers/binary/view/quotex/how-buy-sell/ — C

Binomo
- [B1] https://tradingfinder.com/option/binomo/trading-platform/ — C
- [B2] https://www.binaryoptions.net/binomo — C (updated 2026-06-10)
- [B3] https://www.trustpilot.com/review/binomo.com — V
- [B4] https://zemmytrade.global/binomo-vs-expert-option/ — C
- [B5] https://www.binaryoptiontrading.in/binomo-india-review/ — C
- [B6] https://binomo.com/trading — V (redirects to auth)
- [B7] https://tradingfinder.com/option/binomo/ — C

ExpertOption
- [E1] https://expertoption.com/?demo=true → https://app.expertoption.com/ — V (demo inspected 2026-10-27)
- [E2] https://coinbureau.com/review/expert-option — C
- [E3] https://binaryoptionsvision.com/brokers/expertoption — C
- [E4] https://www.trustpilot.com/review/expertoption.com — V (profile removed)
- [E5] https://play.google.com/store/apps/details?id=com.expertoption — C
- [E6] https://tradersunion.com/brokers/binary/view/expertoption/ — C

CDNA (ex-Nadex)
- [N1] https://www.nadex.com/notices/cdna-transitions-to-crypto-com-app/ — V
- [N2] https://financefeeds.com/nadex-retires-legacy-platform-as-services-transition-to-crypto-coms-cdna-infrastructure/ — C
- [N3] https://help.crypto.com/en/articles/8462828-about-strike-options — V
- [N4] https://help.crypto.com/en/articles/8694357-about-rolling-strike-options — V
- [N5] https://help.crypto.com/en/articles/6983814-about-updown-options — V
- [N6] https://crypto.com/en-it/university/strike-option-trading — C (official, snippet)
- [N7] https://www.cftc.gov/sites/default/files/filings/ptc/26/04/ptc0409261043.pdf ; https://www.cftc.gov/filings/ptc/ptc0409261035.pdf ; https://www.cftc.gov/sites/default/files/filings/ptc/26/04/ptc0409261031.pdf — C (official, snippet)
- [N8] https://crypto.news/crypto-com-registers-nadex-for-u-s-stock-futures/ — C
- [N9] https://www.binaryoptions.net/crypto-com — C

Kalshi
- [K1] https://kalshibacktest.com/resources/kalshi-btc-15-minute-markets — C
- [K2] https://predictionmarketspicks.com/articles/kalshi-bitcoin-markets-by-frequency — C
- [K3] https://kalshi.com/category/crypto/frequency/fifteen_min — C (official, snippet; direct fetch returned 429)
- [K4] https://defirate.com/prediction-markets/crypto/ — C

Other players
- [X1] https://www.forexpeacearmy.com/forex-reviews/15017/spectre-ai-review — C
- [X2] https://tradersunion.com/brokers/forex/view/spectre.ai/ — C
- [X3] https://www.daytrading.com/raceoption — C
- [X4] https://www.binaryoptions.net/raceoption — C
- Exnova: https://www.trade-binaryoptions.com/exnova-broker-review/ — C

Regulation
- [R1] https://www.esma.europa.eu/press-news/esma-news/esma-agrees-prohibit-binary-options-and-restrict-cfds-protect-retail-investors — C (official, snippet)
- [R2] https://www.esma.europa.eu/node/88538 — C (official, snippet)
- [R3] https://www.fca.org.uk/news/statements/fca-confirms-permanent-ban-sale-binary-options-retail-consumers — C (official, snippet)
- [R4] https://www.asic.gov.au/about-asic/news-centre/find-a-media-release/2022-releases/22-243mr-asic-s-binary-options-ban-extended-until-2031 — C (official, snippet)
