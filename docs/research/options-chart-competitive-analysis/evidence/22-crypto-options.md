# 22 — Crypto options venues & short-dated up/down products (chart + chart-integrated trading)

Checked: 2026-10-27 for every source below. Research only: public docs, help centres, learn articles, app-store pages, news, third-party reviews. No sign-up, no login, no wallet connection. Nothing was inspected inside a logged-in trading UI, so live-UI facts come from vendor documentation.

**Evidence labels**
- **verified**: I fetched and read the official page (or the named third-party page) myself.
- **claimed**: the fact comes from a search-engine excerpt of the page (usually because the fetch was blocked with 403, 429 or a timeout), from a third-party review, or from news coverage.

Short quotes are under 15 words.

## Sources (referenced as [Sn])

| ID | Source | Status |
|---|---|---|
| S1 | Deribit Support, "Position Builder": https://support.deribit.com/hc/en-us/articles/31238900906781-Position-Builder | claimed (official page; fetch returned 403; content from search excerpt) |
| S2 | Deribit Insights, "Position Builder – Primer on basic option strategies": https://insights.deribit.com/market-research/deribit-position-builder-primer-on-basic-option-strategies/ | verified (old article, about 5 years) |
| S3 | Deribit Insights, "Placing an options trade on Deribit": https://insights.deribit.com/education/placing-an-options-trade-on-deribit/ | verified |
| S4 | Deribit Insights, "Deribit Option Discovery Tool" (7 Dec 2020): https://insights.deribit.com/education/deribit-option-discovery-tool/ | verified |
| S5 | Deribit Insights, "Expected Move Calculations and Visual" (13 Dec 2023): https://insights.deribit.com/education/expected-move-calculations-and-visual/ | verified |
| S6 | Deribit iOS App Store page (v3.18.0, 22 Dec 2025): https://apps.apple.com/in/app/deribit/id1293674041 | verified |
| S7 | Deribit options metrics page: https://www.deribit.com/statistics/BTC/metrics/options | claimed (fetch returned only the page title; section list from search excerpt) |
| S8 | Deribit Insights, "Introduction to Deribit Metrics Page": https://insights.deribit.com/education/introduction-to-deribit-metrics-page/ | claimed (search excerpt) |
| S9 | Deribit Insights, "DVOL – Deribit Implied Volatility Index": https://insights.deribit.com/exchange-updates/dvol-deribit-implied-volatility-index/ | claimed (search excerpt) |
| S10 | Deribit Insights, "Deribit Price Ladder": https://insights.deribit.com/education/deribit-price-ladder/ | claimed (search excerpt) |
| S11 | Deribit on X, preview of the new UI (about 2019): https://twitter.com/deribitexchange/status/1121357284578332672 | claimed |
| S12 | Trustpilot, Deribit reviews (old reviews): https://au.trustpilot.com/review/deribit.com | claimed |
| S13 | btcsprint, "Deribit Review 2026": https://btcsprint.com/deribit-review-2026-the-best-crypto-options-exchange-for-pros | claimed (third party) |
| S14 | Bybit Help, "How to Get Started with Options Trading on Bybit" (last updated 2026-09-12): https://www.bybitglobal.com/en/help-center/article/How-to-Get-Started-with-Options-Trading-on-Bybit (mirror of the bybit.com article, whose fetch timed out) | verified |
| S15 | Bybit Help, "How to Get Started with Easy Options" (last updated 2026-09-13): https://www.bybitglobal.com/en/help-center/article/How-to-Get-Started-With-Easy-Options | verified |
| S16 | Bybit Help, "Option Greeks" and "FAQ — Bybit Options": https://www.bybit.com/en/help-center/article/Option-Greeks, https://www.bybit.com/en/help-center/article/FAQ-Options-Trading | claimed (search excerpt) |
| S17 | Bybit Help, "Introduction to the Trading Chart" and the "Trading on Bybit from TradingView" guide: https://www.bybit.com/en/help-center/article/Bybit-Trading-Chart-FAQ, https://www.bybit.com/en/help-center/article/How-to-Get-Started-With-Trading-on-Bybit-From-TradingView | claimed (search excerpt) |
| S18 | Yahoo Finance, "Bybit adds customized in-app alerts" (about 6 years old): https://finance.yahoo.com/news/bybit-exchange-adds-customized-app-100000301.html | claimed |
| S19 | OKX Help, "Get started with OKX Options": https://www.okx.com/en-us/help/get-started-with-okx-options | verified |
| S20 | OKX Help, "How do I trade options?": https://www.okx.com/en-us/help/option-contracts-app-web | verified |
| S21 | OKX Options Trading User Agreement (updated about 5 days before the check): https://www.okx.com/en-us/help/okx-options-trading-user-agreement | verified |
| S22 | OKX API v5 docs, `greeksType` (PA vs BS): https://www.okx.com/docs-v5/en/ | claimed (search excerpt) |
| S23 | dicloak, AI summary of an "OKX Simple Options Trading Tutorial" video (2025-08-07): https://dicloak.com/video-insights-detail/okx-simple-options-trading-tutorial-trade-okx-options | verified (third-party summary; on-screen visuals not described) |
| S24 | OKX Help, "How do I use the chart trading layout?": https://www.okx.com/en-us/help/how-do-i-use-the-chart-trading-layout | claimed (search excerpt; not options-specific) |
| S25 | Binance FAQ, "How to Trade Binance Options?" (about 4 years old): https://www.binance.com/en/support/faq/how-to-trade-binance-options-6b0dc23370ee4153a6581355e92555c1 | claimed (search excerpt) |
| S26 | Binance FAQ, "Options PnL Calculator" (published 2022-11-14, updated 2026-01-02): https://www.binance.com/en/support/faq/options-pnl-calculator-faq-20fd69a9873a47f3bc86caee702f1dd1 | verified |
| S27 | Binance FAQ, "What Are Binance Event Contracts and How to Use It?": https://www.binance.com/en/support/faq/what-are-binance-event-contracts-and-how-to-use-it-172247f1c4b8401ab106fb63900f3825 | verified |
| S28 | News on Binance gold/silver options (Jul 2026) and stock options (Sep–Oct 2026): https://news.bitcoin.com/featured/binance-adds-gold-and-silver-options-bringing-commodity-markets-to-crypto-traders/, https://tradersunion.com/news/brokers-news/show/3848192-binance-adds-new-options-trading/ | claimed |
| S29 | Polymarket, "BTC Up or Down 15m" event page: https://polymarket.com/event/btc-updown-15m-1790492400 | verified (resolved market; the chart is not described in the fetched text) |
| S30 | updowncharts.com, Bitcoin Up/Down statistics: https://www.updowncharts.com/markets/bitcoin | claimed (third party) |
| S31 | Kalshi Pro Help, "15-minute markets": https://kalshi.com/pro/help/fifteen-minute-markets | claimed (fetch returned 429; content from search excerpts incl. the screenshot caption and the Sep 28, 2026 update note) |
| S32 | Kalshi Pro Help, "Charts on Kalshi Pro": https://kalshi.com/pro/help/charts | claimed (search excerpt) |
| S33 | maxycharts, "How to Read Kalshi 15-Minute Crypto Markets": https://maxycharts.com/guide | claimed (third party) |
| S34 | DeFi Rate, Kalshi vs Polymarket live odds: https://defirate.com/odds/crypto/ | claimed (third party) |
| S35 | Derive Insights, "Your Options Strategy Looks Right." (18 Apr 2026): https://insights.derive.xyz/your-options-strategy-looks-right/ | verified |
| S36 | Aevo Docs, "PERPS+ — Options made easy": https://www.aevo.xyz/docs/aevo-products/aevo-perps+/options-made-easy | verified |
| S37 | CryptoDaily, "Aevo extends PERPS+ to mobile" (Jul 2026): https://cryptodaily.co.uk/2026/07/aevo-extends-perps-to-mobile-completing-full-platform-parity | claimed |
| S38 | Datawallet, Binance review (Binance Wallet + Predict.fun event markets, Apr 2026): https://www.datawallet.com/crypto/binance-review | claimed |
| S39 | James Bachini, "Deribit Review": https://jamesbachini.com/deribit-review/ | claimed (third party) |

---

## Venue profiles

### 1. Deribit (Deribit by Coinbase): BTC/ETH options benchmark venue

- **Chart engine.** The web platform embeds a TradingView chart. Deribit's own 2019 UI preview says "Full screen on all tables, including Tradingview chart" [S11, claimed]. A long-time user on Trustpilot also praises the "Tradingview charts" [S12, claimed]. The engine used in the mobile app is not documented.
- **Option chain / strike ladder.** One row per strike, with the strike in the centre, calls on the left and puts on the right, and bid/ask columns on each side. You can show all expiries at once or a single one. Clicking left of the strike opens the call order form; clicking right opens the put [S3, verified].
- **Order form.** The price can be entered in BTC, with a USD equivalent and an IV equivalent shown. There is an orderbook, plus "Recent Trades" and "Chart" tabs, so each option has its own price chart inside the order form [S3, verified].
- **Expected move on the chain.** A toggle shades the expected-move range either side of the Strike column, with a separate range per expiry. A horizontal line marks where the underlying sits between two strikes. Each expiry header shows the ATM IV and the size of the move up and down. The model is lognormal: up = S·e^(IV√T) − S, down = S/e^(IV√T) − S [S5, verified]. The redesigned mobile chain also has an "expected price move indicator" [S6, verified].
- **Mobile charts.** The app store page says "Instrument charts show your positions and open orders, and you can cancel orders from the chart". The trade view has a chart drawer with multiple timeframes [S6, verified].
- **Position Builder** (pb.deribit.com). Builds hypothetical multi-leg portfolios of options and futures and draws the combined P&L curve. A dropdown switches the y-axis between PNL, Equity, Margin Balance, IM, MM and the Greeks. The simulated portfolio's net Greeks are listed under the chart. There is a domestic-rate shift scenario [S1, claimed]. A time-to-expiry bar can be dragged to "Expiry", and P&L can be shown in USD [S2, verified]. Bachini describes it as for planning, not execution, with a days-to-expiry slider for watching time decay [S39, claimed].
- **Option Discovery Tool** (2020, beginner-oriented). Inputs are currency, an up or down arrow, an expiry, and an "advanced" toggle for selling. It outputs three suggested options, each with relative cost, probability and return indicators, a breakeven, the % move needed, max P/L, and an expiry P&L chart with a dotted strike line. A CONTINUE button goes to the chain [S4, verified]. Whether the tool is still live today was not checked.
- **Vol analytics.** DVOL is a VIX-style 30-day implied-vol index built from the smile [S9, claimed]. The metrics page lists "Implied Volatility Curves", "Probability of Expiring Above Strike", Term Structure, open interest by strike and by expiry, and HV vs DVOL [S7, claimed; S8, claimed].
- **Price ladder.** Orders are moved by click-and-drag in the ladder's Buys/Sells columns. This is a DOM ladder, not drag on the chart [S10, claimed].
- **Standout.** The expected-move shading overlaid on the strike ladder, and a scenario-driven payoff builder whose y-axis can be switched between metrics.
- **Praise.** Reviewers say it is the best venue for option execution; users like the customisable layouts, TradingView charts and subaccounts [S12, claimed].
- **Complaints.** "position builder could use a little more TLC". Android app freezes. The GUI freezes on high-volume days. Users can't see basic P/L with a trade open [S12, claimed; these reviews are old]. A Reddit user quoted in a review calls the interface "overwhelming for anyone without prior options experience" [S13, claimed].

### 2. Bybit Options (USDT-settled, European) incl. Easy / Discover / Pro modes

- **Three app modes:** Easy, Discover and Pro [S14, verified; S15, verified].
- **Easy mode.** Pick a coin, then toggle "Profit if it rises" / "Profit if it drops" (call or put), filter by expiry, and pick a strike range from a dropdown. Each contract card shows the contract name, price, expiry and **profit probability**. Tapping a card opens the Buy page, which shows order cost, expiry, profit conditions, profit probability, leverage and a **P&L Analysis chart**. That chart shows the current price, PnL simulated on the mark price, the breakeven point, and the best P&L scenarios under simulation [S15, verified]. The help text does not say how profit probability is calculated.
- **Discover mode.** Curated lists: Expiring Soon (about 12–36 h), Top Picks (24h volume), Today's Winners (24h % gain), Top Holdings (open interest), and Large Trades [S15, verified].
- **Pro mode.** Option chain with calls left, puts right and strikes in the centre. Columns are configurable: Last Traded Price, Greeks, Strike Distance, APR Bid/Ask. You can filter to All, Call or Put. The chart icon opens **Mark Price and Index Price charts**. A "**P&L Trend**" sits below the order zone. Orders can be entered by price or by IV % via a switch. IV, Delta, Gamma and other Greeks are shown in the order page. TP/SL can be set on positions [S14, verified].
- **Chart engine.** Not documented for options. Bybit's TradingView integration is listed for spot and perpetuals only, not options [S17, claimed].
- **Alerts.** In-app price, trend-shift, pivot and market-heat alerts exist, but no source says they cover options contracts [S18, claimed, old].
- **Standout.** Outcome-first language ("Profit if it rises"), a probability shown on every contract card, and a simulated P&L chart before purchase. This is the closest to Deriv's Rise/Fall mental model of any options venue reviewed.
- **Praise and complaints.** No options-specific user reviews were found. General reviews praise the "User-friendly UI & app" and mention slippage and logouts (Coin360 and TradingView broker reviews, found via search, claimed).

### 3. OKX Options (crypto- and USD-margined, European)

- **Three channels.** Simple options ("Buy options only", for beginners), the options chain (for professionals), and RFQ / Liquid Marketplace (minimum 10,000 USD per RFQ, "not available in App") [S19, verified].
- **Simple options** is app-only. Choose the exercise date, then Call, then a strike from a dropdown, then view the "profit and loss and other related data", then Confirm and enter a quantity [S20, verified]. The user agreement says Simple Options are traded by request for quote and that "Prices on the option chain are indicative only". It also says "Greeks, breakeven, PnL charts and similar figures are estimates only". That sentence confirms PnL charts, breakeven figures and Greeks exist in the options UI [S21, verified]. A third-party video summary walks through call and put examples using breakeven values [S23, verified third party].
- **Advanced options.** Choose Call/Put and an expiry, then scroll the strikes. Orders are limit orders with cross or isolated margin. Positions show average entry, size, IM and PnL [S20, verified].
- **Greeks display.** The API lets an account show Greeks either in coins (PA) or as Black-Scholes values in dollars (BS) [S22, claimed].
- **Chart engine.** OKX's general chart trading layout offers full-screen charts, trading from the chart and drawing tools [S24, claimed]. No source documents whether the options page uses TradingView, nor whether its charts show strikes or positions.
- **Standout.** A three-tier product ladder (Simple, Chain, RFQ) with the beginner flow limited to buying. Regulatory-style disclaimers on Greeks and PnL charts suggest these visuals are prominent.
- **Praise and complaints.** None specific to options were found.

### 4. Binance Options (European, USDT-settled) and Binance Event Contracts

- **Options UI.** Web path: Futures → Options. A market list plus an orderbook. A candlestick symbol switches to the trading interface. Optional list columns include Gamma, Vega and Theta. The account tab shows Greeks [S25, claimed; the FAQ is about 4 years old].
- **Options PnL Calculator.** Enter a **predicted price** (and, in the app, an up/down direction). The **options list then shows Possible Profit and Max Loss columns** for every call and put at expiry. Call profit = predicted − strike − ask. The box can be dragged by its "=" handle. Access is limited to a restricted set of users, and no graphical payoff chart is described [S26, verified].
- **2026 product expansion.** Gold and silver options (1-day and 1-week, buy-only) and physically settled US stock options, with covered calls and cash-secured puts added on 15 Oct 2026 [S28, claimed]. None of these sources describes a UI change.
- **Binance Event Contracts** (app). A direct competitor to Rise/Fall. Choose BTCUSDT or ETHUSDT, then an expiry of **10 min, 30 min, 1 h or 1 day**. Stake at least 5 USDT. The app shows the payout before confirming. Choose **"Higher"/"Lower"** relative to the entry level. After submitting, the user can "monitor the candlestick chart" [S27, verified]. Positions show open time, open price and expiry time; since 2026-01-28 the open time is the next second after placement. Closed trades show open and close price, payout ratio and PnL. Trades **can't be closed early**, and a tie refunds the premium. Responsible-trading controls: a 10,000 USDT daily cap, a user-set daily loss limit, an open-position limit, optional cooling-off periods, and a system-imposed **7-day cooling-off** after specified settled losses [S27, verified]. The FAQ does not describe any strike line or countdown drawn on the chart.
- **Binance Wallet event markets.** Yes/No shares on Predict.fun (Apr 2026), where Binance supplies only the interface [S38, claimed]. **Dropped from the matrix**: on-chain event shares, with no evidence of a chart-centric UI.
- **Standout.** The PnL Calculator's "predicted price → per-strike profit column". Event Contracts are the closest Binance analogue to Deriv's Rise/Fall, including tick-free minute expiries and enforced loss limits.
- **Praise and complaints.** No Event-Contract-specific reviews were found. General Binance Trustpilot complaints concern account freezes and verification (Datawallet review, claimed).

### 5. Short-dated up/down prediction markets (direct Rise/Fall competitors)

**Polymarket "BTC Up or Down" (5m / 15m / 1h / 4h)**
- **Mechanics.** The market resolves Up if the end price is greater than or equal to the start price. Resolution uses the Chainlink BTC/USD TWAP 60s stream [S29, verified]. The page shows the window's "Price to Beat" in its FAQ text, Buy Up / Buy Down, an order book, tabs (Comments with 25k+, Top Holders, Positions, Activity), and a row of links to adjacent windows. It also warns "Live data may be delayed by a few seconds" [S29, verified].
- **Not verified.** Whether the chart plots price or probability: the fetched market was resolved and its text did not describe a chart [S29].
- **Third-party add-on.** updowncharts.com shows each window's price to beat and historical base rates, e.g. Up in 50% of 8,638 15-minute windows over 90 days [S30, claimed].
- **Complaints.** Thin order book and lagging prices relative to Kalshi; bot-dominated order flow [S34, claimed].

**Kalshi 15-minute crypto (also distributed via Robinhood and Coinbase)**
- **Page layout.** One screen per series. The screenshot caption describes "target, current price, and countdown across the top". It also shows the price chart "with a position and a resting order drawn on it", the order book, and the order panel. When a window closes, the next one loads in place: the chart interval and indicators carry over, drawings reset, and a cross-window blotter has a **Settled** tab with the resolution and realized P&L [S31, claimed].
- **Trading from the chart** (Sep 28, 2026 update). Place, move and cancel limit orders on the Price chart, and close a position from its line. Hover the price axis and click "+" to place an order [S31, claimed].
- **Two charts** [S32, claimed]:
  - A standard step-line price chart with a volume histogram and ranges LIVE / 1H / 3H / 6H / 1D / 1W / 1M / ALL.
  - A **knockout chart** for short-duration crypto. It tracks the underlying against the target line in real time, "updates several times a second", and labels the target with the direction you need. You can toggle between this chart and the contract-price chart.
- **Third-party chart.** Draws a dashed, fixed target line, a big countdown, and a green/red "VS TARGET" distance figure [S33, claimed].
- **Standout.** The knockout chart and auto-rollover. This is essentially a Rise/Fall chart done well.

### 6. Derive (formerly Lyra) and Aevo (on-chain options venues)

- **Derive.** Has a Strategy Builder with an outlook selector (e.g. "Bearish"), a Payoff tab (expiry P&L, e.g. profit below $44.48), and a Greeks tab next to it. The article warns that the payoff chart only shows expiry [S35, verified]. No time slider is described.
- **Aevo PERPS+.** Three one-action "enhancers" attach options to a perp position: Limit My Loss (protective put), Get Paid to Hold (covered call) and Lock My Range (collar). A **risk-% slider** has a range that depends on the duration (1 week / 2 weeks / 1 month / 2 months) [S36, verified]. Mobile parity followed in July 2026 [S37, claimed]. The docs page fetched does not describe a payoff visual.
- **Coverage.** Both venues are included only as idea sources. Neither competes with Deriv's tick or short-duration products, so they have no matrix column beyond a combined note.

---

## Matrix

Legend: ✅ full, ◐ partial, ❌ none (documented absence), ? unknown (no public evidence). Cells cite [Sn].

Column notes:
- **Bybit** covers Easy, Discover and Pro modes.
- **Binance Opt** is Binance Options; **Binance EC** is Binance Event Contracts.
- **Poly 15m** is Polymarket's Up or Down markets.
- **Derive / Aevo** is a combined note column.

| ID | Feature | Deribit | Bybit | OKX | Binance Opt | Binance EC | Poly 15m | Kalshi 15m | Derive / Aevo |
|---|---|---|---|---|---|---|---|---|---|
| 1.1 | Chart types | ◐ TradingView (web) [S11,S12]; per-option price chart in the order form [S3] | ◐ Mark/Index price charts [S14] | ? | ◐ candlestick [S25] | ◐ candlestick [S27] | ? | ◐ step-line price, knockout chart [S32] | ? |
| 1.2 | Tick / sub-minute granularity | ? | ? | ? | ? | ? | ? | ◐ LIVE trade-by-trade view; knockout chart updates several times a second [S32] | ? |
| 1.4 | Real-time smoothness | ? | ? | ? | ? | ? | ◐ "may be delayed by a few seconds" [S29] | ✅ several updates per second [S32] | ? |
| 2.1 | Indicators | ◐ via TradingView [S11] | ? | ◐ general chart layout [S24] | ? | ? | ? | ◐ indicators carry over on rollover [S31] | ? |
| 2.3 | Drawing tools | ◐ via TradingView [S11] | ? | ◐ [S24] | ? | ? | ? | ◐ drawings reset per window [S31] | ? |
| 3.1 | Entry/exit markers | ? | ? | ? | ? | ◐ open/close price listed, not on chart [S27] | ? | ◐ position drawn on chart [S31] | ? |
| 3.2 | Barrier / strike line | ◐ underlying line on the chain; dotted strike on the discovery P&L chart [S4,S5] | ? | ? | ? | ❌ not described [S27] | ◐ price to beat shown as a value [S29] | ✅ target line with direction label [S32] | ? |
| 3.4 | Live P/L on chart | ? (complaint: no P/L visible [S12]) | ◐ P&L Trend panel [S14] | ◐ PnL shown in the position list [S20] | ? | ❌ only after close [S27] | ? | ◐ position line on chart [S31] | ? |
| 3.5 | Expiry countdown | ? | ? | ? | ? | ◐ expiry time listed [S27] | ? | ✅ countdown across the top [S31] | ? |
| 3.7 | Multiple open contracts | ✅ positions table [S3] | ✅ [S14] | ✅ [S20] | ? | ◐ capped at an open-position limit [S27] | ? | ✅ blotter [S31] | ? |
| 4.1 | Drag barrier/strike or order | ◐ drag orders in the price ladder, not the chart [S10] | ? | ? | ◐ calculator box is draggable, not a price [S26] | ❌ | ? | ✅ move limit orders on the chart [S31] | ◐ Aevo risk-% slider [S36] |
| 4.2 | Click-to-place on chart | ◐ mobile: cancel orders from the chart [S6] | ? | ◐ general chart trading layout [S24] | ? | ❌ | ? | ✅ "+" on the price axis places a limit order [S31] | ? |
| 4.3 | One-click / simplified trade | ◐ discovery tool → chain [S4] | ✅ Easy: card → Buy [S15] | ✅ Simple options [S19,S20] | ? | ✅ Higher/Lower [S27] | ✅ Buy Up / Buy Down [S29] | ✅ order panel [S31] | ✅ Aevo enhancers in one action [S36] |
| 4.4 | Expiry chosen on time axis | ◐ time-to-expiry slider in Position Builder (scenario only) [S2] | ❌ dropdown/filter [S15] | ❌ dropdown [S20] | ? | ❌ preset list [S27] | ❌ fixed windows [S29] | ❌ fixed windows [S31] | ❌ preset durations [S36] |
| 4.5 | Payout preview before trade | ✅ max P/L, breakeven [S4] | ✅ P&L Analysis chart [S15] | ✅ PnL data [S20,S21] | ✅ predicted-price columns [S26] | ✅ payout shown [S27] | ◐ price = implied payout [S29] | ◐ price = implied payout [S33] | ✅ payoff tab [S35] |
| 5.1 | Payoff / P&L diagram | ✅ Position Builder with metric switch and time slider [S1,S2]; discovery P&L chart [S4] | ✅ P&L Analysis (Easy) and P&L Trend (Pro) [S14,S15] | ◐ "PnL charts" exist per the agreement [S21] | ◐ tabular profit and max loss, no chart described [S26] | ❌ | ❌ | ❌ | ✅ Derive payoff tab [S35]; Aevo ? |
| 5.2 | Probability of expiry/ITM | ◐ relative probability meter [S4]; "Probability of Expiring Above Strike" metric [S7] | ✅ profit probability on each card and on the Buy page [S15] | ? | ? | ❌ | ✅ market price as probability [S29,S34] | ✅ price as probability [S33] | ? |
| 5.3 | Probability cones | ❌ none found | ? | ? | ? | ❌ | ❌ | ❌ | ? |
| 5.4 | Expected move / IV bands | ✅ expected-move shading on the chain, web and mobile [S5,S6] | ? | ? | ? | ❌ | ❌ | ❌ | ? |
| 5.5 | Greeks | ✅ position Greeks in the builder [S1] | ✅ in the order zone and chain columns [S14,S16] | ✅ PA/BS display modes [S21,S22] | ◐ list columns and account tab [S25] | n/a | n/a | n/a | ✅ Derive Greeks tab [S35] |
| 5.6 | Vol smile / surface | ◐ IV curves and term structure on the metrics page, DVOL index [S7,S9] | ◐ order by IV [S14] | ? | ? | n/a | n/a | n/a | ? |
| 5.7 | Strike ladder / chain | ✅ [S3] | ✅ Pro chain; Easy strike dropdown [S14,S15] | ✅ [S19,S20] | ✅ market list [S25] | n/a | n/a | n/a | ? |
| 5.8 | Chain overlay on chart | ❌ none found | ❌ none found | ? | ? | n/a | n/a | n/a | ? |
| 6.1 | Sentiment % | ◐ OI/put-call ratio on the metrics page [S7] | ◐ Discover lists [S15] | ? | ? | ? | ✅ price = crowd odds [S29] | ✅ [S33] | ? |
| 6.2 | Social feed | ❌ | ◐ Discover "Large Trades" [S15] | ? | ? | ? | ✅ comments, top holders, activity [S29] | ? | ? |
| 6.5 | Volatility index | ✅ DVOL [S9] | ? | ? | ? | ? | ? | ? | ? |
| 7.2 | Trade-history markers / settled review | ? | ◐ history icon [S14] | ? | ◐ PnL analysis [S26] | ◐ closed-trade list [S27] | ◐ window navigation [S29]; base rates via third party [S30] | ✅ Settled tab across windows [S31] | ? |
| 8.1 | Alerts | ❌ none in the UI found (API only) | ◐ general app alerts, options coverage unknown [S18] | ? | ? | ? | ? | ◐ settlement notification [S33] | ? |
| 9.3 | Saved layouts | ✅ modular layouts [S11] | ? | ◐ chart layout [S24] | ? | ? | ? | ◐ Canvas tiles [S32] | ? |
| 10.1 | Mobile portrait app | ✅ redesigned iOS app with chart drawer [S6] | ✅ three modes in the app [S14] | ✅ Simple options are app-only [S20] | ✅ [S25] | ✅ app-only [S27] | ✅ [S29] | ✅ via the Robinhood/Coinbase distribution [S33] | ✅ Aevo mobile parity [S37] |
| 10.5 | Chart–trade panel integration | ◐ chart drawer in the trade view [S6] | ◐ chart behind an icon [S14] | ? | ◐ toggle [S25] | ◐ chart watched after the trade [S27] | ? | ✅ one screen [S31] | ? |
| 11.5 | Onboarding / education | ✅ discovery tool, Insights articles [S4] | ✅ Easy/Discover modes [S15] | ✅ Simple tier [S19] | ◐ calculator [S26] | ◐ FAQ [S27] | ◐ rules FAQ [S29] | ◐ help centre [S31] | ✅ outlook selector [S35]; enhancers need no options knowledge [S36] |
| 3.9 (new) | Responsible-trading limits visible | ? | ? | ? | ? | ✅ daily cap, loss limit, cooling-off [S27] | ? | ? | ? |
| 3.10 (new) | Auto-rollover to the next window | n/a | n/a | n/a | n/a | ❌ | ◐ links to adjacent windows [S29] | ✅ auto-loads the next window [S31] | n/a |
| 5.9 (new) | Outlook-first contract finder (up/down → suggested contracts) | ✅ discovery tool [S4] | ✅ "Profit if it rises/drops" [S15] | ◐ Call/Put first [S20] | ◐ predicted price → per-strike profit [S26] | ✅ Higher/Lower [S27] | ✅ | ✅ | ✅ Derive outlook [S35] |

**New rows.** 3.9 records whether responsible-trading limits are visible in the trade flow. 3.10 records automatic rollover to the next fixed window. 5.9 records an outlook-first contract finder.

---

## Transferable ideas for Deriv

The ideas run from most to least transferable. Section 1 of the taxonomy is mostly unknown for these venues because their options pages are not publicly documented, so the transfer value is in sections 3–5.

1. **Expected-move cone on the chart (5.3/5.4), from Deribit [S5].**
   - Deriv's synthetic indices have a known nominal volatility, so the lognormal ±1σ band (up = S·e^(σ√t) − S, down = S/e^(σ√t) − S) can be exact rather than market-implied.
   - Draw a translucent cone from the current spot to the chosen expiry on the time axis, with ±1σ and ±2σ bands.
   - Put a label at the expiry edge, e.g. "68% range: 1,234.5 – 1,251.2".
   - Show the barrier line inside or outside the cone, so users can see at a glance how far a Higher/Lower or Touch barrier is in σ terms.

2. **Live probability chip on the barrier line (5.2), from Bybit [S15] and Deribit [S7].**
   - Bybit shows "profit probability" on every contract card.
   - Deriv can attach a small pill to each barrier or strike line, e.g. "P(touch) 34%" or "P(above at expiry) 61%", recomputed on every tick from the index volatility.
   - On Rise/Fall, show "P(win) ≈ 50% − house edge" with a sparkline of how it has drifted since entry.

3. **Kalshi-style "knockout" layout for Rise/Fall and tick contracts (3.2, 3.5, 10.5) [S31–S33].**
   - A fixed dashed entry/target line with a direction label ("needs ▲ above 1,234.56").
   - A large countdown, or a tick counter for tick durations.
   - A signed "vs target" distance chip, green when winning and red when losing.
   - A toggle between the underlying view and a contract-value view (the current sell price of the contract).

4. **Auto-rollover for repeated short contracts (new 3.10) [S31].**
   - After a contract settles, keep the chart interval and indicators, clear its drawings, and pre-load a "next contract" ticket with the same parameters.
   - Add a session blotter with a "Settled" tab: a strip of recent outcomes (✔/✘ chips) under the chart, each linking to replay (7.1).

5. **Trade and manage from the chart (4.1/4.2), from Kalshi [S31] and Deribit mobile [S6].**
   - A "+" affordance on the price axis opens a Higher/Lower or Touch ticket with the barrier pre-set to the hovered price.
   - Open contracts are drawn as lines with an inline "Sell" / "Close" button.
   - Pending items (e.g. Multiplier take-profit and stop-loss) can be dragged and cancelled directly on the chart.

6. **"Predicted price" ghost line → payout table (4.5), from the Binance PnL Calculator [S26].**
   - The user drags a hypothetical target-price line on the chart.
   - The trade panel then shows, for each barrier or strike on offer (Vanillas/Turbos), the payout at that target.
   - This is a per-row "possible profit" column, a lightweight alternative to a full payoff diagram.

7. **Mini payoff panel with a time slider for Vanillas/Turbos (5.1), from Deribit Position Builder [S1, S2] and Bybit P&L Analysis/Trend [S14, S15].**
   - A small chart under the trade form: x = underlying at expiry, y = P/L.
   - Curves for "now (T+0)" and "at expiry", with a draggable time-to-expiry slider between them.
   - The breakeven is marked, and the current spot is drawn as a vertical line.
   - A dropdown can switch the y-axis to contract value or delta, as Deribit's metric switch does.

8. **Outlook-first entry (new 5.9), from Bybit Easy [S15], the Deribit discovery tool [S4] and Derive [S35].**
   - Start with "Profit if it rises / drops / stays in range".
   - Suggest about three contract cards, each with relative Cost / Probability / Return meters (Deriv's mapping to contract types is in the box below).
   - Each card shows a mini payoff sparkline.
   - This also serves onboarding (11.5).

   | Outlook | Deriv contract types |
   |---|---|
   | Rises | Rise, Higher, Touch-up, Turbo-long, Vanilla call |
   | Stays in range | Accumulator, No Touch |

9. **Discover lists for synthetics (6.1/6.2), from Bybit Discover [S15].**
   - "Expiring soon", "Most traded today", "Today's biggest wins" (anonymised) and "Large trades" chips above the chart.
   - These give social proof without a full social feed.

10. **Volatility-index overlay (6.5), from DVOL [S9].**
    - Plot rolling realized volatility of the synthetic index against its nominal volatility as a sub-pane indicator.
    - This makes "Vol 75 really behaved like 75 today" visible.
    - It is especially useful for Accumulators, whose knock-out range depends on volatility.

11. **Historical base-rate badge (7.2), from updowncharts [S30].**
    - For the selected duration and contract type, show e.g. "Rise won 49.6% of the last 1,000 5-tick contracts on Vol 100 (1s)".
    - This is honest, data-driven context, and Deriv computes it from its own feed.

12. **Visible responsible-trading guardrails (new 3.9), from Binance Event Contracts [S27].**
    - Show the remaining daily loss limit or stake cap as a thin meter in the trade panel.
    - Show a cooling-off banner when it applies.
    - This is relevant for high-frequency tick products and for regulatory positioning.

13. **One-tap protection slider (Multipliers), from Aevo PERPS+ [S36].**
    - A single "Limit my loss to X%" slider whose allowed range depends on duration.
    - Draw the protection level as a shaded floor band on the chart.
    - This is an analogue of the Multiplier stop-loss and deal-cancellation features.

---

## Limitations

- **Blocked fetches.** Many official pages could not be fetched: Deribit support (403), Kalshi Pro (429), and bybit.com help (timeouts, mitigated by the bybitglobal.com mirror).
  - Those facts rely on search-engine excerpts of the official pages and are marked "claimed".
- **No logged-in UI inspection.** Chart-level details of the options pages are mostly undocumented publicly. This covers the chart engine, chart types, indicators, drawing tools, position or strike lines, and gestures, so many 1.x, 2.x and 10.x cells are "?".
  - "?" means not found, not absent.
- **Visuals not inspected.** YouTube walkthroughs were not watched. The OKX Simple Options evidence is a third-party AI summary of a video [S23], which does not describe the on-screen visuals.
- **Stale sources.** Several sources are old: Binance options FAQ [S25] about 4 years, Deribit primer [S2] about 5 years, discovery tool [S4] from 2020, Trustpilot reviews [S12] about 6.5 years. Their UIs may have changed, and whether the Deribit discovery tool is still live was not checked.
- **Polymarket chart unknown.** The fetched market was already resolved, so whether the page plots price or probability, and how the price to beat is drawn, was not confirmed.
- **No Reddit evidence.** No Reddit threads were found for Bybit, OKX or Binance options UX, or for Binance Event Contracts. Praise and complaints are thin outside Deribit.
- **Regional availability.** Binance Event Contracts, OKX Simple options, Polymarket and Kalshi are restricted by region; e.g. polymarket.com blocks trading in the US. Feature sets differ per region and account type.
- **Probability methods undocumented.** No venue documents how its probabilities are computed. This includes Bybit's "profit probability" and Deribit's relative probability meter.
- **Dropped.** Binance Wallet / Predict.fun on-chain event shares: no chart-centric UI evidence.
- **Brief coverage only.** Aevo and Derive are long-dated venues, kept as idea sources only.
- **Not researched.** Hyperliquid and other perp-first DEXs.
