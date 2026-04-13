# Bond Markets: Complete Technical Deep Dive

---

## Table of Contents

1. [History & Overview](#1-history--overview)
2. [What a Bond Actually Is (and Is Not)](#2-what-a-bond-actually-is-and-is-not)
3. [Key Participants & Roles](#3-key-participants--roles)
4. [How It Works - Step by Step](#4-how-it-works---step-by-step)
5. [Technical Architecture](#5-technical-architecture)
6. [Money Flow / Economics](#6-money-flow--economics)
7. [Security & Risk](#7-security--risk)
8. [Regulation & Compliance](#8-regulation--compliance)
9. [Comparisons & Alternatives](#9-comparisons--alternatives)
10. [Modern Developments](#10-modern-developments)
11. [Appendix](#11-appendix)
12. [Key Takeaways](#12-key-takeaways)

---

## 1. History & Overview

### The Oldest Financial Instrument

Bonds predate stocks by centuries. The concept of a fixed-income debt obligation is arguably the oldest financial instrument in human history, older than equity markets, insurance contracts, or paper currency.

**Ancient origins.** Mesopotamian clay tablets from 2400 BCE record debt contracts with fixed repayment terms and interest. Roman publicani issued bonds to finance public works. But the modern bond market traces directly to the Italian city-states of the 12th century, where Venice, Genoa, and Florence issued "prestiti" (forced loans) to finance wars. Venice's Monte Vecchio (1262) is often cited as the first government bond - citizens lent money to the republic and received transferable interest-bearing certificates.

**Sovereign debt takes shape.** The Dutch Republic refined the model in the 1600s with long-dated annuities and perpetual bonds. The Bank of England, founded in 1694, immediately issued government bonds to fund King William III's war with France - creating the British "gilt" market that still exists today. The term "gilt-edged" literally meant the certificates had gilded edges, signifying their safety.

**The US Treasury market.** Alexander Hamilton's consolidation of Revolutionary War debts in 1790 created the first US Treasury bonds and, with them, the foundation of American capital markets. Treasury securities have since become the most important benchmark in global finance - the risk-free rate against which virtually every other asset is priced.

### Timeline

| Year | Event |
|------|-------|
| 1262 | Venice issues Monte Vecchio - first transferable government bonds |
| 1694 | Bank of England founded, issues gilts to fund war |
| 1790 | Hamilton consolidates US war debts into Treasury bonds |
| 1843 | First US corporate bond (Baltimore & Ohio Railroad) |
| 1909 | Moody's publishes first bond ratings |
| 1927 | S&P begins systematic bond ratings |
| 1944 | Bretton Woods establishes USD as reserve currency, boosting Treasury demand |
| 1970 | GNMA issues first mortgage-backed security |
| 1971 | Nixon ends gold convertibility - floating rates transform bond markets |
| 1975 | SEC mandates credit ratings for capital requirements (NRSRO designation) |
| 1981 | First interest rate swap (IBM-World Bank) |
| 1986 | London Big Bang deregulates UK bond markets |
| 1997 | US Treasury launches TreasuryDirect for retail investors |
| 2000 | Electronic trading platforms emerge (TradeWeb, MarketAxess) |
| 2007-08 | Structured credit crisis - CDO/MBS meltdown triggers global financial crisis |
| 2012 | ECB's Draghi: "whatever it takes" - central bank bond buying era begins |
| 2014 | European government bonds trade at negative yields for first time |
| 2020 | COVID response: Fed buys $4.5T in Treasuries and MBS |
| 2022 | Fastest rate hiking cycle in 40 years causes historic bond losses |
| 2023 | US T+1 settlement begins for bonds |
| 2025 | Global bond market exceeds $140 trillion |

### Scale Today

The global bond market is **larger than the global stock market**. This surprises most people, but it makes sense - every government, every corporation, every municipality, and every securitization vehicle can issue debt.

**Global fixed-income market: ~$140 trillion outstanding** (2025)

| Segment | Outstanding | Share |
|---------|------------|-------|
| Government bonds (sovereign) | ~$65T | ~46% |
| Corporate bonds (investment grade) | ~$25T | ~18% |
| Mortgage-backed / asset-backed | ~$15T | ~11% |
| Corporate bonds (high yield) | ~$4T | ~3% |
| Municipal bonds (US) | ~$4T | ~3% |
| Supranational / agency | ~$10T | ~7% |
| Other (EM local currency, inflation-linked) | ~$17T | ~12% |

**US Treasury market alone: ~$27 trillion** - the single largest and most liquid securities market on Earth. Average daily trading volume exceeds $800 billion.

For context: the entire global stock market is roughly $110 trillion. The bond market is about 25% larger.

---

## 2. What a Bond Actually Is (and Is Not)

### The One-Sentence Definition

A bond is a securitized loan - the issuer borrows money from investors and promises to pay periodic interest (coupons) and return the principal (face value) at a specific future date (maturity).

That's it. Everything else in bond markets - yield curves, duration, convexity, credit spreads, callable features - is just math and risk management built on top of this simple promise.

### The Mental Model

Think of a bond as an IOU that you can sell to someone else.

When you buy a newly issued 10-year Treasury bond with a 4% coupon and $1,000 face value, the US government promises you:
- $20 every six months (4% annual coupon, paid semi-annually) for 10 years
- $1,000 back at the end of 10 years

You get 20 coupon payments of $20 each ($400 total) plus your $1,000 back. Total cash received: $1,400 over 10 years.

But here is the critical insight - you do not have to hold the bond for 10 years. You can sell it to someone else tomorrow. And the price you get depends on what has happened to interest rates since you bought it.

### What a Bond Is NOT

**A bond is not equity.** Buying a bond does not give you ownership in the issuer. You are a creditor, not an owner. You have no voting rights, no claim on profits beyond your coupon, and no upside if the company triples in value. But you get paid before equity holders if things go wrong - bonds are senior to stock in bankruptcy.

**A bond is not risk-free** (usually). Only government bonds denominated in the issuer's own currency approach "risk-free" status, because the government can (theoretically) print money to pay you back. Corporate bonds carry credit risk. Even government bonds carry interest rate risk, inflation risk, and (for foreign-currency bonds) currency risk.

**Bond prices and yields move in opposite directions.** This is the single most important relationship in fixed income, and it confuses many newcomers. If you hold a bond paying 4% and new bonds start paying 5%, nobody will pay you full price for your 4% bond - its market price drops. Conversely, if new rates drop to 3%, your 4% bond becomes more valuable, and its price rises.

### The Price-Yield Inverse Relationship

Why do prices and yields move inversely? Because a bond's price is the present value of its future cash flows, discounted at the prevailing market interest rate:

```
Bond Price = Sum of [ Coupon / (1 + r)^t ] + [ Face Value / (1 + r)^n ]
```

Where:
- `r` = market yield (discount rate)
- `t` = period number for each coupon
- `n` = total number of periods

When `r` goes up, the denominators get larger, and the present value (price) goes down. When `r` goes down, the denominators get smaller, and the price goes up.

**Concrete example.** A 10-year bond with a 4% coupon and $1,000 face value:

| Market Yield | Bond Price | Gain/Loss |
|:------------:|:----------:|:---------:|
| 3% | $1,085.30 | +8.5% |
| 3.5% | $1,041.58 | +4.2% |
| 4% | $1,000.00 | par |
| 4.5% | $960.44 | -4.0% |
| 5% | $922.78 | -7.7% |

Notice the asymmetry: a 1% rate decline produces a bigger gain (+8.5%) than a 1% rate increase produces a loss (-7.7%). This asymmetry is called **convexity**, and it matters a lot for bond portfolio management.

![Price-yield inverse relationship](diagrams/price-yield-relationship.svg)

---

## 3. Key Participants & Roles

### The Bond Market Ecosystem

| Participant | Role | Examples |
|-------------|------|----------|
| **Sovereign issuers** | Borrow to fund government spending and deficits | US Treasury, UK DMO, German Finanzagentur, Japan MoF |
| **Corporate issuers** | Borrow for operations, acquisitions, capital expenditure | Apple, JPMorgan, Toyota, any company with investment-grade or high-yield debt |
| **Municipal issuers** | Borrow for infrastructure, schools, hospitals (US-specific tax advantages) | City of New York, State of California, Port Authority |
| **Supranational issuers** | Borrow for development and policy programs | World Bank, EIB, Asian Development Bank |
| **Primary dealers** | Underwrite new issues, make markets, bid at government auctions | Goldman Sachs, JPMorgan, Barclays, Citigroup (24 US primary dealers) |
| **Institutional investors** | Buy and hold bonds for income and liability matching | Pension funds, insurance companies, sovereign wealth funds |
| **Asset managers** | Build and manage bond portfolios for clients | PIMCO, BlackRock, Vanguard |
| **Central banks** | Buy/sell government bonds for monetary policy (open market operations) | Federal Reserve, ECB, Bank of Japan, Bank of England |
| **Rating agencies** | Assess credit quality and assign ratings | Moody's, S&P Global, Fitch |
| **Trading platforms** | Provide electronic venues for bond trading | Bloomberg, Tradeweb, MarketAxess, BrokerTec |
| **Clearinghouses** | Guarantee and settle bond trades | DTCC/FICC (US), Euroclear, Clearstream |
| **Custodians** | Hold securities on behalf of investors, process coupon payments | BNY Mellon, State Street, Northern Trust |
| **Index providers** | Construct bond benchmarks for portfolio tracking | Bloomberg (Barclays Agg), ICE BofA, FTSE Russell |
| **Retail investors** | Buy bonds directly (TreasuryDirect) or through funds | Individual savers, retail brokerage customers |

### Why Primary Dealers Matter

In the US Treasury market, **primary dealers** are the backbone of market functioning. These 24 firms (as of 2025) have a legal obligation to:

1. **Bid at every Treasury auction** - they must participate, ensuring the government can always sell its debt
2. **Make markets** - they quote two-way prices (bid and ask) to other market participants
3. **Act as counterparties to the Fed** - when the Federal Reserve conducts open market operations, it trades exclusively with primary dealers

This creates a privileged but burdensome position. Primary dealers profit from the bid-ask spread and from their informational advantage (they see order flow), but they must absorb inventory risk when markets move against them.

![Bond market participants and relationships](diagrams/participants.svg)

---

## 4. How It Works - Step by Step

### Part A: Primary Market (New Issuance)

When a government or corporation needs to borrow money, it issues new bonds in the **primary market**. The process differs significantly between government and corporate bonds.

#### Government Bond Auction (US Treasury Example)

**Step 1: Announcement.** The Treasury announces an upcoming auction. For a new 10-year note, the announcement comes roughly one week before the auction. It specifies the maturity date, coupon rate, and auction date. The Treasury follows a regular, predictable calendar - auctions happen on fixed schedules (e.g., 10-year notes are auctioned monthly).

**Step 2: When-Issued Trading.** Between announcement and auction, the bond trades on a "when-issued" (WI) basis. Dealers and investors trade forward contracts on the bond that has not yet been issued. This WI trading helps establish price discovery and gives the market a sense of where the auction will clear.

**Step 3: Auction Day.** The Treasury conducts a **single-price (Dutch) auction**:

- **Competitive bids** come from primary dealers and large institutions. Each bid specifies a yield (or price) and an amount. "I'll buy $500M at 4.25%."
- **Non-competitive bids** come from smaller participants (including retail via TreasuryDirect). They accept whatever yield the auction determines. "I'll buy $10,000 at whatever the clearing yield is."

**Step 4: Determining the Stop.** The Treasury accepts bids from lowest yield (highest price) upward until the full offering amount is filled. The highest accepted yield is called the "stop" or "high yield." All winning bidders pay the same price (the price corresponding to the stop yield). This is the Dutch auction mechanism.

**Example:**

```
10-Year Note Auction - $42 billion offering

Competitive bids received:
  $12B at 4.20%  <- accepted
  $15B at 4.22%  <- accepted
  $10B at 4.24%  <- accepted
  $8B  at 4.25%  <- partially accepted ($5B fills the remaining)
  $6B  at 4.27%  <- rejected

Non-competitive bids: $3B  <- all accepted at clearing yield

Stop yield: 4.25%
All winners pay the price corresponding to 4.25%
Bid-to-cover ratio: 51/42 = 1.21x (healthy demand)
```

**Step 5: Settlement.** The bonds settle T+1 (since 2023). The Treasury delivers securities to winning bidders via Fedwire Securities, and cash moves from buyers to the Treasury's account at the Federal Reserve.

![Primary market issuance process](diagrams/primary-market.svg)

#### Corporate Bond Issuance

Corporate bond issuance works differently - it resembles an IPO more than an auction.

**Step 1: Mandate.** The company selects lead underwriters (investment banks) who will manage the deal.

**Step 2: Roadshow (optional).** For large or debut issues, the company presents to institutional investors. The underwriters gauge demand and price sensitivity.

**Step 3: Book Building.** The underwriters announce indicative pricing ("initial price talk") as a spread over the benchmark Treasury. For example, "10-year at T+150" means 150 basis points above the 10-year Treasury yield. Investors submit indications of interest ("IOIs") - "We'll take $50M at T+150 or tighter."

**Step 4: Pricing.** Based on the order book, underwriters set the final spread and allocate bonds. Strong demand means the spread tightens (lower cost for the issuer). Weak demand means it widens.

**Step 5: Allocation & Settlement.** Underwriters allocate bonds to investors (large, long-term holders typically get priority). The deal settles T+2 for corporate bonds.

### Part B: Secondary Market (Trading)

Once issued, bonds trade in the **secondary market** - this is where the vast majority of bond market activity occurs.

#### How Secondary Trading Works

Unlike stocks, most bonds do **not** trade on centralized exchanges. The bond market is primarily an **over-the-counter (OTC) dealer market**. This means:

1. **An investor wants to sell.** They contact one or more dealers (often via Bloomberg chat, phone, or electronic platform) and request a quote.

2. **Dealer quotes a price.** The dealer provides a bid price (what they'll pay to buy the bond). The dealer may also quote an offer/ask price (what they'll sell the bond for). The difference is the **bid-ask spread** - the dealer's compensation.

3. **Trade execution.** If the investor accepts, the trade executes. The dealer takes the bond onto their own balance sheet (inventory).

4. **Dealer finds the other side.** The dealer may hold the bond briefly or immediately look for a buyer. They might execute a "riskless principal" trade where they already have a buyer lined up.

5. **Trade reporting.** In the US, corporate and municipal bond trades must be reported to TRACE (Trade Reporting and Compliance Engine) within 15 minutes. Treasury trades are reported to FINRA.

6. **Clearing and settlement.** The trade is submitted to the clearinghouse (FICC for Treasuries, NSCC for corporates). Settlement occurs on T+1 for Treasuries, T+2 for corporates.

#### The Shift to Electronic Trading

The bond market has been migrating from phone-based trading to electronic platforms, but slowly:

| Market | Electronic Share (2025) | Trend |
|--------|:----------------------:|-------|
| US Treasuries (on-the-run) | ~70% | High and rising |
| US Treasuries (off-the-run) | ~40% | Growing |
| Investment-grade corporate | ~45% | Growing fast |
| High-yield corporate | ~30% | Growing |
| Municipal bonds | ~20% | Slow growth |
| Emerging market bonds | ~15% | Early stage |

**On-the-run** means the most recently issued bond of a given maturity - these are the most liquid. **Off-the-run** are older issues - less liquid, wider spreads.

Electronic trading protocols include:
- **Request for Quote (RFQ):** Investor sends a request to multiple dealers simultaneously. Dealers respond with prices. Most common for corporate bonds.
- **Central Limit Order Book (CLOB):** Continuous matching of bids and offers, like a stock exchange. Used for on-the-run Treasuries (BrokerTec, Nasdaq Fixed Income).
- **All-to-All:** Any participant can trade with any other participant, not just dealer-to-client. MarketAxess's Open Trading pioneered this.
- **Portfolio Trading:** Trade an entire basket of bonds in one transaction. Growing rapidly since 2020.

![Secondary market trading flow](diagrams/secondary-market.svg)

### Part C: Bond Lifecycle

![Complete bond lifecycle from issuance to maturity](diagrams/bond-lifecycle.svg)

---

## 5. Technical Architecture

### Trading Infrastructure

The bond market's technical infrastructure is fragmented compared to equity markets, reflecting its OTC heritage.

#### Key Trading Platforms

| Platform | Primary Use | Protocol | Daily Volume |
|----------|------------|----------|:------------:|
| Bloomberg Terminal | Price discovery, RFQ, chat-based trading | FIX + proprietary | N/A (dominant) |
| Tradeweb | US Treasuries, corporates, munis, derivatives | FIX 4.2/4.4 | $1.5T+ |
| MarketAxess | US corporate bonds, EM, Eurobonds | FIX + REST API | $30B+ |
| BrokerTec (CME) | US Treasury interdealer (CLOB) | FIX/Binary | $200B+ |
| Nasdaq Fixed Income | US Treasury interdealer | Binary/FIX | $100B+ |
| ICE Bonds | US corporate, municipal | FIX | Growing |

#### Message Protocols

**FIX Protocol (Financial Information eXchange)** is the lingua franca of bond trading. A typical RFQ message flow:

```
1. Investor -> Platform: QuoteRequest (MsgType=R)
   - SecurityID (CUSIP/ISIN)
   - Side (Buy/Sell)
   - OrderQty (face amount)
   - QuoteReqID

2. Platform -> Dealers: QuoteRequest broadcast to selected dealers

3. Dealer -> Platform: Quote (MsgType=S)
   - BidPx or OfferPx (clean price)
   - BidYield or OfferYield
   - ValidUntilTime (quote expiry, often 30-60 seconds)
   - SettlDate

4. Investor -> Platform: NewOrderSingle (MsgType=D)
   - Selects winning quote
   - OrderQty, Price, Side

5. Platform -> Both: ExecutionReport (MsgType=8)
   - Confirms trade execution
   - ExecType=Fill
```

#### Security Identifiers

Bonds use multiple identification systems:

| Identifier | Format | Usage |
|------------|--------|-------|
| CUSIP | 9 characters (e.g., 912828ZT0) | US and Canada |
| ISIN | 12 characters (e.g., US912828ZT09) | Global (wraps CUSIP) |
| SEDOL | 7 characters | UK and Ireland |
| FIGI | 12 characters (e.g., BBG000BVPV84) | Bloomberg global ID |
| Ticker | Variable (e.g., T 4.25 11/15/34) | Bloomberg shorthand |

A single bond can have all of these. The CUSIP (Committee on Uniform Securities Identification Procedures) is the primary identifier in US markets. ISINs wrap CUSIPs by prepending a country code and appending a check digit.

#### Settlement Infrastructure

**US Treasury Settlement - Fedwire Securities Service:**
- Operated by the Federal Reserve Banks
- Real-time gross settlement (RTGS) - each transaction settles individually
- Delivery versus payment (DVP) - securities and cash move simultaneously
- Operates 8:30 AM to 3:30 PM ET
- Handles ~$4 trillion in daily transfers

**Corporate Bond Settlement - DTC (Depository Trust Company):**
- Part of DTCC
- Book-entry (dematerialized) - no physical certificates
- Net settlement - positions are netted at end of day
- CNS (Continuous Net Settlement) reduces the number of actual deliveries

**European Settlement:**
- Euroclear (Brussels) and Clearstream (Luxembourg) are the two ICSDs (International Central Securities Depositories)
- TARGET2-Securities (T2S) is the ECB's platform for settling euro-denominated securities

![Bond market technical architecture](diagrams/architecture.svg)

### Data Model

A bond in any trading system has these core attributes:

```
Bond {
  // Identity
  cusip: "912828ZT0"
  isin: "US912828ZT09"
  issuer: "United States Treasury"

  // Terms
  coupon_rate: 4.250%          // annual coupon rate
  coupon_frequency: semi-annual // 2x per year
  maturity_date: 2034-11-15
  issue_date: 2024-11-15
  face_value: 1000             // par amount
  day_count_convention: "ACT/ACT"  // for Treasuries

  // Features
  callable: false
  puttable: false
  convertible: false
  sinking_fund: false

  // Classification
  sector: "Government"
  credit_rating: "Aaa/AA+"     // Moody's/S&P
  currency: "USD"
  country: "US"

  // Market Data (changes in real-time)
  bid_price: 98.25             // clean price (% of par)
  ask_price: 98.28125
  bid_yield: 4.415%
  ask_yield: 4.412%
  last_trade_price: 98.265625
  accrued_interest: 1.73       // since last coupon
  dirty_price: 99.995625       // clean + accrued
}
```

**Clean price vs. dirty price:** The quoted price of a bond (the "clean price") does not include accrued interest. But the actual amount a buyer pays is the "dirty price" (clean price + accrued interest since the last coupon date). This convention prevents the bond's quoted price from jumping on coupon payment dates.

---

## 6. Money Flow / Economics

### The Complete Cash Flow Picture

#### Primary Market Economics

When a corporation issues bonds, money flows like this:

```
Investors pay $1 billion to buy the bonds
  - Underwriting fee (spread):     -$6M    (0.6% for IG, 1-2% for HY)
  - Legal/rating agency fees:      -$1M
  - SEC registration:              -$0.2M
  = Issuer receives:               ~$993M   (net proceeds)
```

The underwriting spread is how investment banks earn money on new issues. For a typical investment-grade corporate bond, the "gross spread" is 50-75 basis points (0.50-0.75%). High-yield bonds cost more - 1.0-2.0%. Government bonds are cheaper because they auction directly.

#### Secondary Market Economics

In secondary trading, the **bid-ask spread** is the primary cost:

| Bond Type | Typical Bid-Ask Spread | What This Means |
|-----------|:---------------------:|-----------------|
| On-the-run US Treasury | 0.5-1 bp (~$0.005 per $100) | Extremely liquid |
| Off-the-run US Treasury | 1-3 bp | Still very liquid |
| Investment-grade corporate | 5-15 bp | Moderate cost |
| High-yield corporate | 25-75 bp | Significant cost |
| Municipal bonds | 25-100 bp | Illiquid, high cost |
| Emerging market | 20-100 bp | Variable |

A basis point (bp) is 0.01%. On $1 million face value of Treasuries, a 1 bp spread means $100 round-trip cost. On high-yield bonds, a 50 bp spread means $5,000 per million.

#### Coupon Payment Mechanics

Most bonds pay coupons **semi-annually** (every 6 months). The mechanics:

1. **Record date** - 15 days before the payment date. Whoever owns the bond on this date receives the coupon.
2. **Payment date** - the actual cash payment. For Treasuries, the paying agent is the Federal Reserve.
3. **Ex-coupon date** - typically 1 business day before record date. If you buy on or after this date, you do not get the upcoming coupon.

**Day count conventions** determine how accrued interest is calculated between coupon dates:

| Convention | Used By | Calculation |
|------------|---------|-------------|
| ACT/ACT | US Treasuries | Actual days / actual days in period |
| 30/360 | US Corporate, Municipal | Assumes 30-day months, 360-day year |
| ACT/360 | Eurobonds, money market | Actual days / 360 |
| ACT/365 | UK Gilts, some EM | Actual days / 365 |

This matters more than you might think. The difference between ACT/ACT and 30/360 on a $10 million position over 3 months can be thousands of dollars.

#### Yield Calculations

There are multiple ways to measure a bond's return:

**Current Yield** - simplest, ignores time value:
```
Current Yield = Annual Coupon / Clean Price
Example: $40 coupon / $950 price = 4.21%
```

**Yield to Maturity (YTM)** - the internal rate of return assuming you hold to maturity and reinvest coupons at the same rate. This is the standard yield measure:
```
Price = Sum[ C / (1+y/2)^t ] + FV / (1+y/2)^n

Where:
  C = semi-annual coupon ($20 for a 4% coupon)
  y = annual YTM (solve for this)
  FV = face value ($1,000)
  n = number of semi-annual periods
```

YTM cannot be solved algebraically - it requires iterative numerical methods (Newton-Raphson, bisection).

**Yield to Call (YTC)** - for callable bonds, the yield assuming the issuer calls (redeems early) at the first call date.

**Yield to Worst (YTW)** - the lowest of YTM, YTC for all call dates. This is the conservative measure institutional investors use.

**Spread Measures:**
- **G-spread (Government spread):** Yield minus interpolated Treasury yield at same maturity
- **Z-spread (Zero-volatility spread):** Constant spread added to the entire Treasury spot curve to match the bond's price
- **OAS (Option-Adjusted Spread):** Z-spread minus the value of embedded options (call, put). The "true" credit spread for bonds with options.

![Money flow between bond market participants](diagrams/money-flow.svg)

---

## 7. Security & Risk

### The Six Risks of Bond Investing

#### 1. Interest Rate Risk (Market Risk)

The dominant risk for most bonds. When market yields rise, bond prices fall.

**Duration** quantifies this risk: it measures the approximate percentage price change for a 1% change in yield.

```
Modified Duration = Macaulay Duration / (1 + y/n)

Approximate price change = -Duration x Change in yield x 100

Example:
  Duration = 7 years
  Yield rises 1%
  Price change = -7 x 0.01 x 100 = -7%
```

A bond with 7-year duration loses about 7% of its value when yields rise 1%. This is why 2022 was catastrophic for bondholders - the Bloomberg US Aggregate Index lost 13%, its worst year ever, as the Fed raised rates from near zero to over 4%.

**Duration depends on:**
- **Maturity:** longer maturity = higher duration
- **Coupon:** lower coupon = higher duration (you get less cash early, more weight on final payment)
- **Yield:** lower yield = higher duration

A 30-year zero-coupon bond has a duration of 30 years. A 30-year bond with a 6% coupon has a duration of about 15 years. The coupon payments effectively shorten the bond's interest rate sensitivity.

**Convexity** is the second-order effect - duration is a linear approximation, but the price-yield curve is actually curved. Positive convexity means the bond gains more when rates fall than it loses when rates rise (by the same amount). This is desirable, and investors pay a premium for it.

![Duration and convexity explained](diagrams/duration-convexity.svg)

#### 2. Credit Risk (Default Risk)

The risk that the issuer cannot pay coupons or return principal. Rating agencies provide standardized credit assessments:

| Moody's | S&P / Fitch | Grade | Meaning | Historical 10yr Default Rate |
|---------|-------------|-------|---------|:---:|
| Aaa | AAA | Investment Grade | Highest quality | 0.0% |
| Aa1-Aa3 | AA+/AA/AA- | Investment Grade | High quality | 0.1% |
| A1-A3 | A+/A/A- | Investment Grade | Upper medium | 0.3% |
| Baa1-Baa3 | BBB+/BBB/BBB- | Investment Grade | Medium (lowest IG) | 1.5% |
| Ba1-Ba3 | BB+/BB/BB- | High Yield | Speculative | 8% |
| B1-B3 | B+/B/B- | High Yield | Highly speculative | 20% |
| Caa-C | CCC-D | High Yield / Distressed | Substantial risk/default | 45%+ |

The **BBB/Ba boundary** (the line between investment grade and high yield) is enormously significant. Many institutional investors (pension funds, insurance companies) are prohibited from holding sub-investment-grade bonds. When a bond is downgraded from BBB- to BB+ (a "fallen angel"), forced selling by these institutions causes its price to plunge - often well beyond what the actual credit deterioration warrants.

**Credit spreads** are the additional yield investors demand above Treasuries to compensate for credit risk:

| Rating | Typical Spread (2025) |
|--------|:--------------------:|
| AAA | 30-50 bp |
| AA | 50-80 bp |
| A | 80-130 bp |
| BBB | 130-200 bp |
| BB | 200-350 bp |
| B | 350-550 bp |
| CCC | 600-1200 bp |

![Credit rating scales comparison](diagrams/credit-ratings.svg)

#### 3. Liquidity Risk

The risk that you cannot sell a bond quickly at a fair price. The bond market is far less liquid than equities:

- There are over **70,000 distinct corporate bond CUSIPs** in the US market, versus ~4,000 listed stocks
- Most corporate bonds trade fewer than once per day
- A single issuer (like Apple) may have 50+ different bond issues outstanding
- During stress events, liquidity evaporates - dealers reduce inventory, bid-ask spreads blow out

**Post-2008 regulation** (Volcker Rule, Basel III leverage ratio) reduced dealer inventory capacity by approximately 75%. Dealers hold far less bond inventory than they did before the crisis, which has structural implications for liquidity during stress.

#### 4. Inflation Risk

The risk that inflation erodes the real value of fixed coupon payments. A 4% coupon is worth less in real terms if inflation runs at 6%.

**Treasury Inflation-Protected Securities (TIPS)** address this: their principal adjusts with CPI, so both coupons and final repayment grow with inflation. The yield difference between a nominal Treasury and a TIPS of the same maturity is called the **breakeven inflation rate** - the market's implied inflation expectation.

#### 5. Reinvestment Risk

The risk that when you receive coupon payments, you cannot reinvest them at the same yield. YTM assumes reinvestment at the YTM rate, which is rarely possible in practice. This risk is highest for high-coupon bonds in a falling-rate environment.

#### 6. Call Risk (Prepayment Risk)

For callable bonds, the issuer can redeem early - typically when rates have fallen, which is exactly when you least want your high-coupon bond called away. You get your principal back but must reinvest at lower prevailing rates.

Mortgage-backed securities have extreme call risk because homeowners can refinance at any time.

---

## 8. Regulation & Compliance

### US Regulatory Framework

| Regulator | Jurisdiction | Key Rules |
|-----------|-------------|-----------|
| **SEC** | Securities and Exchange Commission | Securities Act of 1933 (new issues), Securities Exchange Act of 1934 (secondary trading) |
| **FINRA** | Self-regulatory organization for broker-dealers | TRACE reporting, markup rules, suitability |
| **MSRB** | Municipal Securities Rulemaking Board | Rule G-30 (fair pricing), Rule G-37 (pay-to-play), EMMA disclosure |
| **Federal Reserve** | Central bank | Monetary policy, bank supervision, Fedwire |
| **OCC** | Office of the Comptroller of the Currency | Bank bond portfolio supervision |
| **Treasury Dept** | Auction rules, TreasuryDirect | Uniform Offering Circular |

### Key Regulations

**TRACE (Trade Reporting and Compliance Engine).** Since 2002, FINRA has required reporting of all OTC corporate and agency bond trades. Initially within 75 minutes, now within 15 minutes, with most reported within 10 seconds. TRACE brought revolutionary transparency to a previously opaque market. Before TRACE, investors had no way to know the last traded price of a corporate bond.

**Regulation SHO.** Short-selling rules for bonds. Less impactful than for equities because bond short-selling is typically done via repo (repurchase agreements) rather than traditional short sales.

**Volcker Rule (2014).** Prohibits banks from proprietary trading in most securities, including bonds. Banks can still market-make (hold inventory to facilitate client trades), but the line between market-making and prop trading is fuzzy. The practical effect: banks hold much less bond inventory, reducing market liquidity.

**Basel III / IV Capital Requirements.** Banks that hold bonds on their balance sheet must maintain capital reserves. Government bonds typically get 0% risk weight (treated as risk-free for capital purposes), while corporate bonds receive risk weights based on credit rating. This creates a structural incentive for banks to hold government bonds over corporate bonds.

### European Regulatory Framework

| Regulation | Scope | Key Requirements |
|------------|-------|-----------------|
| **MiFID II / MiFIR** | EU-wide securities regulation | Pre- and post-trade transparency, best execution, systematic internalizer regime |
| **CSDR** | Central Securities Depositories Regulation | Settlement discipline (penalties for fails), T+2 settlement |
| **CRR/CRD** | Capital Requirements Regulation | Basel III implementation in EU, credit risk weights |
| **EMIR** | Derivatives (affects bond futures, swaps) | Central clearing mandates, trade reporting |
| **PRIIPs** | Retail investor protection | Key Information Documents for packaged investments |

**MiFID II's impact on bonds** has been significant. Since 2018, it requires:
- Post-trade transparency for virtually all bond trades (with deferrals for large/illiquid trades)
- Best execution obligations - firms must prove they got clients the best available price
- Research unbundling - asset managers must pay separately for research, not bundle it with trading commissions

### Municipal Bond Regulation (US-Specific)

Municipal bonds have their own regulatory ecosystem because of their tax-exempt status:

- **Tax Reform Act of 1986** - established rules for tax-exempt issuance, private activity bonds, and arbitrage rebate requirements
- **EMMA (Electronic Municipal Market Access)** - MSRB's free disclosure platform where all muni bond documents, trades, and financials are published
- **SEC Rule 15c2-12** - requires issuers to provide continuing disclosure (annual financial statements, event notices)
- **Rule G-37** - prohibits "pay-to-play" where dealers who make political contributions are banned from underwriting that issuer's bonds

---

## 9. Comparisons & Alternatives

### Government vs. Corporate vs. Municipal Bonds

| Feature | Government | Corporate (IG) | Corporate (HY) | Municipal |
|---------|-----------|----------------|-----------------|-----------|
| Credit risk | Minimal (own currency) | Low to moderate | Moderate to high | Low (but varies) |
| Yield (2025 range) | 3.5-4.5% | 4.5-6.0% | 6.5-9.0% | 3.0-4.5% (tax-equiv: 4.5-7.0%) |
| Liquidity | Excellent | Moderate | Lower | Low |
| Tax treatment | State tax exempt (US Treasuries) | Fully taxable | Fully taxable | Federal tax exempt, often state too |
| Typical maturity | 1 month - 30 years | 1 - 30 years | 3 - 10 years | 1 - 40 years |
| Minimum investment | $100 (TreasuryDirect) | $1,000 - $5,000 | $1,000 - $5,000 | $5,000 |
| Call features | Generally non-callable | Often callable after 5-10 years | Usually callable | Typically callable after 10 years |
| Recovery in default | N/A (own currency) | ~40-50% for senior unsecured | ~30-40% | ~60-70% (revenue bonds) |
| Who buys | Everyone (benchmark asset) | Insurance, pensions, mutual funds | Hedge funds, HY mutual funds | US tax-sensitive investors |

### Fixed Rate vs. Floating Rate

| Feature | Fixed Rate | Floating Rate |
|---------|-----------|---------------|
| Coupon | Constant (e.g., 5%) | Resets periodically (e.g., SOFR + 150bp) |
| Interest rate risk | High (long duration) | Minimal (~0 duration between resets) |
| Price volatility | High | Low |
| Who benefits when rates rise | Issuer (borrowed cheap) | Investor (coupon rises) |
| Typical maturity | Any | Usually shorter (2-7 years) |
| Common issuers | Governments, IG corporates | Banks, leveraged loans, ABS |
| Benchmark | Treasury curve | SOFR (was LIBOR pre-2023) |

### Bonds vs. Other Fixed-Income Instruments

| Instrument | How It Differs From Bonds |
|------------|--------------------------|
| **Bank loans** | Private, not securities. Floating rate. Senior secured. Traded in loan market, not bond market. |
| **Money market instruments** | Short-term (under 1 year). T-bills, commercial paper, repos. Quoted on discount yield basis. |
| **Preferred stock** | Equity, not debt. Dividends not legally obligated. Perpetual (no maturity). Junior to bonds in bankruptcy. |
| **CDs (Certificates of Deposit)** | Bank deposits, not securities. FDIC insured up to $250K. Less liquid. |
| **Bond futures** | Derivatives, not bonds. Standardized contracts. Cash or physical settlement. Used for hedging and speculation. |
| **Interest rate swaps** | Derivatives. Exchange fixed for floating payments. No principal exchange. Notional market ~$400T. |
| **Credit default swaps (CDS)** | Insurance-like derivative. Buyer pays spread, receives par in event of default. Can trade credit risk without owning the bond. |

![Bond types comparison](diagrams/bond-types-comparison.svg)

---

## 10. Modern Developments

### The Yield Curve: The Market's Crystal Ball

The **yield curve** plots yields across maturities for bonds of the same credit quality (typically Treasuries). Its shape tells you what the market expects about future interest rates and economic conditions.

#### Normal Yield Curve
Upward sloping - longer maturities yield more. This is the "normal" shape because investors demand more compensation for locking up money for longer periods (term premium).

```
5yr: 4.0%  |  10yr: 4.3%  |  30yr: 4.6%
```

#### Flat Yield Curve
Short and long rates are roughly equal. Often occurs during transitions between economic expansion and contraction.

```
5yr: 4.3%  |  10yr: 4.3%  |  30yr: 4.3%
```

#### Inverted Yield Curve
Short-term rates exceed long-term rates. Historically, a reliable recession predictor (every US recession since 1970 was preceded by an inversion of the 2yr/10yr spread). The curve was inverted from July 2022 through late 2024 - the longest sustained inversion in modern history.

```
2yr: 4.8%  |  5yr: 4.4%  |  10yr: 4.2%  |  30yr: 4.3%
```

**Why inversion predicts recession:** When the Fed raises short-term rates to fight inflation, the market prices in future rate cuts (expecting the economy to slow). Long rates drop below short rates because investors expect rates to be lower in the future.

![Yield curve shapes and interpretations](diagrams/yield-curve.svg)

### Central Bank Bond Buying (QE/QT)

The most transformative development in bond markets since 2008 has been **quantitative easing (QE)** - central banks buying massive amounts of government (and sometimes corporate) bonds to push down long-term interest rates.

**How QE works mechanically:**

1. The Fed creates bank reserves (digital money) by crediting a primary dealer's reserve account
2. The dealer delivers Treasury bonds to the Fed
3. The dealer uses the cash to buy more bonds (or other assets) from other investors
4. Those investors receive cash and redeploy it into riskier assets (corporate bonds, stocks, real estate)
5. This "portfolio rebalancing" pushes down yields across the entire risk spectrum

**The numbers are staggering:**

| Central Bank | Peak Bond Holdings | % of Government Debt |
|-------------|:-----------------:|:-------------------:|
| Federal Reserve | $8.5T (2022) | ~30% of Treasuries |
| ECB | EUR 5.0T (2022) | ~35% of eurozone gov bonds |
| Bank of Japan | JPY 590T (2024) | ~50% of JGBs |
| Bank of England | GBP 875B (2022) | ~35% of gilts |

**Quantitative tightening (QT)** is the reverse - the central bank lets bonds mature without reinvesting, shrinking its balance sheet. The Fed has been running QT since mid-2022, reducing holdings by ~$2 trillion through 2025.

![Central bank QE/QT mechanism](diagrams/central-bank-impact.svg)

### Electronic Trading Revolution

Bond markets have traditionally lagged equities in electronic adoption, but the gap is closing fast:

**Key trends (2020-2025):**

- **Portfolio trading** has exploded. Instead of trading bonds one at a time, asset managers can trade entire baskets of 200+ bonds in a single transaction. ETF market makers pioneered this.
- **All-to-all trading** breaks the dealer-centric model. On platforms like MarketAxess Open Trading, a pension fund can trade directly with an insurance company, with no dealer intermediating.
- **Algo trading** in Treasuries now accounts for ~60% of central order book volume. High-frequency firms (Citadel Securities, Jane Street, Jump Trading) are major liquidity providers.
- **Data as a product.** TRACE data, evaluated pricing services (Bloomberg BVAL, ICE, MarketAxess), and alternative data (satellite imagery for muni credit analysis) are reshaping how bonds are valued.

### Green, Social, and Sustainability Bonds

The ESG bond market has grown from near zero to over **$4 trillion cumulative issuance** by 2025.

**Green bonds** fund environmentally beneficial projects (renewable energy, clean transport, green buildings). The issuer commits to using proceeds only for eligible green projects, verified by a third-party reviewer.

**Key frameworks:**
- ICMA Green Bond Principles (voluntary guidelines)
- EU Green Bond Standard (mandatory taxonomy alignment for EU Green Bond label)
- Climate Bonds Initiative certification

**The "greenium":** Green bonds often trade 2-5 basis points tighter (lower yield) than equivalent conventional bonds from the same issuer. Investors accept slightly lower returns for the green label, though the greenium has compressed as supply has grown.

![Green bond framework](diagrams/green-bonds.svg)

### Tokenized Bonds and DLT

Blockchain-based bond issuance is moving from experiment to early production:

- **World Bank** issued the first blockchain bond ("bond-i") in 2018 on Ethereum
- **EIB** has issued multiple digital bonds on Ethereum and other platforms
- **HSBC** launched Orion, a tokenized bond platform
- **JP Morgan's Onyx** facilitates intraday repo on permissioned blockchain

Benefits of tokenized bonds: T+0 settlement, fractional ownership, 24/7 trading, automated coupon payments via smart contracts, reduced intermediaries.

Current reality: volumes are tiny (under $10 billion total issued), regulatory clarity is incomplete, and institutional adoption is gradual. But the direction of travel is clear.

---

## 11. Appendix

### Key Terminology

| Term | Definition |
|------|-----------|
| **Accrued interest** | Interest earned since the last coupon payment but not yet paid |
| **Basis point (bp)** | 0.01% - one hundredth of a percentage point |
| **Bearer bond** | Bond where physical possession equals ownership (largely obsolete, banned in US since 1982) |
| **Benchmark** | The reference Treasury bond for a given maturity (on-the-run issue) |
| **Book-entry** | Bonds held electronically, no physical certificates |
| **Callable** | Issuer can redeem before maturity at a specified price |
| **Carry** | The return from holding a bond (coupon income minus financing cost) |
| **Convexity** | Measure of how duration changes as yields change (curvature of price-yield relationship) |
| **Coupon** | Periodic interest payment on a bond |
| **Credit spread** | Yield difference between a bond and a risk-free benchmark of same maturity |
| **CUSIP** | 9-character alphanumeric identifier for US/Canadian securities |
| **Dirty price** | Clean price plus accrued interest (the actual settlement amount) |
| **Duration** | Measure of a bond's sensitivity to interest rate changes (approximate % price change per 1% yield change) |
| **Fallen angel** | Bond downgraded from investment grade to high yield |
| **FICC** | Fixed Income Clearing Corporation - clears US government securities |
| **Gilt** | UK government bond |
| **High yield** | Bonds rated below BBB-/Baa3 (also called "junk bonds") |
| **ISIN** | International Securities Identification Number (12-character global ID) |
| **JGB** | Japanese Government Bond |
| **Maturity** | Date when the bond's principal (face value) is repaid |
| **OAS** | Option-Adjusted Spread - spread over Treasury curve after removing embedded option value |
| **On-the-run** | Most recently issued Treasury bond of a given maturity |
| **Off-the-run** | Previously issued Treasury bonds (less liquid, slightly cheaper) |
| **Par** | Face value, typically $1,000. A bond trading "at par" has a price of 100 |
| **Puttable** | Investor can force early redemption at a specified price |
| **Repo** | Repurchase agreement - short-term collateralized borrowing using bonds |
| **Rising star** | Bond upgraded from high yield to investment grade |
| **Roll down** | Price appreciation as a bond ages and moves down the yield curve |
| **SOFR** | Secured Overnight Financing Rate - the primary USD floating rate benchmark (replaced LIBOR) |
| **Strip** | Zero-coupon bond created by separating a bond's coupon and principal payments |
| **TIPS** | Treasury Inflation-Protected Securities - principal adjusts with CPI |
| **TRACE** | Trade Reporting and Compliance Engine - FINRA system for reporting OTC bond trades |
| **YTM** | Yield to Maturity - the internal rate of return if held to maturity |
| **YTW** | Yield to Worst - the lowest yield across all possible call dates and maturity |
| **Zero-coupon** | Bond that pays no coupons, sold at a discount and redeemed at par |

### Bond Math Quick Reference

**Price of a bond (semi-annual coupons):**
```
P = Sigma(t=1 to n) [ C/2 / (1 + y/2)^t ] + FV / (1 + y/2)^n

Where:
  P   = price
  C   = annual coupon ($)
  y   = yield to maturity (decimal)
  FV  = face value
  n   = number of semi-annual periods
  t   = period number
```

**Macaulay Duration:**
```
D = (1/P) * Sigma(t=1 to n) [ t * CF_t / (1 + y/2)^t ]

Where:
  CF_t = cash flow at time t (coupon or coupon + principal at maturity)
```

**Modified Duration:**
```
D_mod = D_mac / (1 + y/n)

Where n = number of coupon periods per year
```

**Convexity:**
```
C = (1/P) * Sigma(t=1 to n) [ t*(t+1) * CF_t / (1+y/2)^(t+2) ]
```

**Price change approximation using duration and convexity:**
```
dP/P = -D_mod * dy + (1/2) * Convexity * (dy)^2
```

**Current Yield:**
```
CY = Annual Coupon / Clean Price
```

**Discount (T-bill pricing):**
```
Price = Face Value * (1 - discount_rate * days_to_maturity / 360)
```

### Architecture Diagrams

| Diagram | Source | Description |
|---------|--------|-------------|
| Participants | [`diagrams/participants.mmd`](diagrams/participants.mmd) | Bond market ecosystem and actor relationships |
| Bond Lifecycle | [`diagrams/bond-lifecycle.mmd`](diagrams/bond-lifecycle.mmd) | Complete lifecycle from issuance to maturity |
| Primary Market | [`diagrams/primary-market.mmd`](diagrams/primary-market.mmd) | New issuance process (auction and book building) |
| Secondary Market | [`diagrams/secondary-market.mmd`](diagrams/secondary-market.mmd) | Trading flow in OTC and electronic venues |
| Architecture | [`diagrams/architecture.mmd`](diagrams/architecture.mmd) | Trading infrastructure and system components |
| Yield Curve | [`diagrams/yield-curve.mmd`](diagrams/yield-curve.mmd) | Yield curve shapes and interpretations |
| Money Flow | [`diagrams/money-flow.mmd`](diagrams/money-flow.mmd) | Fee and payment relationships between participants |
| Price-Yield Relationship | [`diagrams/price-yield-relationship.mmd`](diagrams/price-yield-relationship.mmd) | Inverse relationship between price and yield |
| Credit Ratings | [`diagrams/credit-ratings.mmd`](diagrams/credit-ratings.mmd) | Rating agency scales and comparison |
| Duration & Convexity | [`diagrams/duration-convexity.mmd`](diagrams/duration-convexity.mmd) | Interest rate sensitivity visualization |
| Bond Types Comparison | [`diagrams/bond-types-comparison.mmd`](diagrams/bond-types-comparison.mmd) | Government vs corporate vs municipal |
| Settlement Flow | [`diagrams/settlement-flow.mmd`](diagrams/settlement-flow.mmd) | T+1 settlement process through FICC/DTC |
| Central Bank Impact | [`diagrams/central-bank-impact.mmd`](diagrams/central-bank-impact.mmd) | QE/QT mechanism and market effects |
| Green Bonds | [`diagrams/green-bonds.mmd`](diagrams/green-bonds.mmd) | ESG bond framework and verification process |

---

## 12. Key Takeaways

1. **The bond market is bigger than the stock market.** At ~$140 trillion globally, fixed income dwarfs equities. US Treasuries alone trade $800B+ daily. If you only understand equities, you are missing the larger half of capital markets.

2. **Price and yield move inversely - always.** This is the fundamental law of fixed income. When rates rise, bond prices fall. Duration tells you how much. Convexity tells you how the sensitivity itself changes. Master these two concepts and you understand 80% of bond risk management.

3. **Bonds mostly trade OTC, not on exchanges.** Unlike stocks, most bonds trade dealer-to-client in a decentralized market. There are 70,000+ distinct corporate bond CUSIPs, and most trade less than once per day. Liquidity is the defining challenge of bond markets.

4. **The yield curve is the market's most important signal.** Its shape tells you what markets expect about future rates, inflation, and economic growth. An inverted curve has preceded every US recession since 1970. Central banks manipulate the short end; the market determines the long end.

5. **Credit ratings create structural cliffs.** The BBB/BB boundary (investment grade / high yield) is not just a letter difference - it triggers forced selling by pension funds and insurance companies, creating discontinuous price behavior at the rating boundary.

6. **Central banks became the dominant bond buyer.** Post-2008 QE programs saw the Fed, ECB, and BoJ collectively buy trillions in government bonds, compressing yields to historically low (even negative) levels. The unwinding of these positions (QT) is reshaping markets through 2025 and beyond.

7. **Settlement infrastructure is the plumbing that matters.** Fedwire for Treasuries, DTC for corporates, Euroclear/Clearstream for international bonds. T+1 settlement is now standard in the US. DVP (delivery versus payment) eliminates settlement risk. Most people never think about plumbing until it breaks.

8. **Electronic trading is transforming the market, but slowly.** On-the-run Treasuries are ~70% electronic, but municipal bonds are still mostly phone-traded. Portfolio trading, all-to-all protocols, and algorithmic market-making are the key trends pushing electronic adoption.

9. **Day count conventions and accrued interest are not trivial details.** ACT/ACT vs. 30/360 creates real dollar differences. Clean vs. dirty price matters for settlement. Bond math is precise, and mistakes compound.

10. **Green bonds are a structural shift, not a fad.** $4T+ cumulative issuance, growing regulatory mandates (EU Green Bond Standard), and investor demand are making ESG bonds a permanent part of the fixed-income landscape. The greenium may shrink, but the market will not.