# Buy Now Pay Later: Klarna, Affirm, and Afterpay Underwriting - Complete Technical Deep Dive

---

## Table of Contents

1. [History and Overview](#1-history-and-overview)
2. [Core Concept](#2-core-concept)
3. [Key Participants and Roles](#3-key-participants-and-roles)
4. [How It Works - Step by Step](#4-how-it-works---step-by-step)
5. [Technical Architecture](#5-technical-architecture)
6. [Money Flow / Economics](#6-money-flow--economics)
7. [Security and Risk](#7-security-and-risk)
8. [Regulation and Compliance](#8-regulation-and-compliance)
9. [Comparisons and Alternatives](#9-comparisons-and-alternatives)
10. [Modern Developments](#10-modern-developments)
11. [Appendix](#11-appendix)
12. [Key Takeaways](#12-key-takeaways)

---

## 1. History and Overview

### 1.1 The Predecessors: Installment Credit Is Not New

The concept of splitting a purchase into payments is centuries old. What is new is doing it instantly, at checkout, with no paperwork, and funded by venture capital.

**1800s - Layaway and Installment Plans.** American furniture stores and Singer Sewing Machines popularized installment credit in the 19th century. You could buy a $50 sewing machine with $5 down and $5 per month. The key difference from modern BNPL: you did not receive the product until you had paid in full (layaway), or the merchant carried the credit risk themselves (installment plan).

**1950s - Credit Cards Emerge.** The Diners Club card (1950) and BankAmericard (1958, later Visa) shifted installment credit from individual merchants to a centralized card network. The merchant got paid upfront, and the bank carried the credit risk. This is the model that dominated for 60 years.

**2000s - Bill Me Later.** Founded in 2000 as I4 Commerce, rebranded to Bill Me Later in 2004, and acquired by eBay/PayPal in 2008 for $945 million. Bill Me Later offered a "pay later" option at online checkout, using a soft credit check. It was the direct ancestor of modern BNPL, but it was branded as a credit line (like a credit card) rather than as installments, and it charged deferred interest - meaning if you did not pay within the promotional period, you owed retroactive interest on the entire purchase. PayPal eventually evolved this into PayPal Credit and PayPal Pay in 4.

### 1.2 The Klarna Founding Story

**2005 - Stockholm, Sweden.** Three students at the Stockholm School of Economics - **Sebastian Siemiatkowski**, **Niklas Adalberth**, and **Victor Jacobsson** - entered a business plan competition at the school. Their idea: let consumers buy online and pay after delivery. The concept was rooted in Scandinavian consumer culture, where invoice-based payment (paying 14-30 days after receiving goods) was already common in mail-order retail. They did not win the competition. But they built it anyway.

**2005 - Klarna launches.** The company name combines the Swedish word "klar" (meaning "clear" or "settled") with the suffix "-na." The initial product was simple: the consumer selects "Klarna" at checkout, enters their name and address (no credit card needed), receives the goods, and then receives an invoice with 14-30 days to pay. Klarna takes the credit risk. The merchant gets paid upfront.

**2010-2014 - European expansion.** Klarna expanded across Scandinavia, Germany, Austria, and the Netherlands. Invoice-based payments were already culturally accepted in these markets, which gave Klarna a natural foothold. The company obtained a banking license in Sweden in 2017.

**2015-2019 - US launch and "Pay in 4."** Klarna entered the US market and introduced "Pay in 4" (known as "Slice it" in some markets), splitting a purchase into four equal, interest-free biweekly payments. This was the product format that would define the modern BNPL industry.

### 1.3 The Afterpay Founding Story

**2014 - Sydney, Australia.** **Nick Molnar** was 24 years old and running a jewelry business on eBay. He noticed that younger customers were reluctant to use credit cards and preferred debit cards. **Anthony Eisen**, a former investment banker, partnered with Molnar to build a solution: a platform that would split a purchase into four equal installments, automatically charged every two weeks, with no interest.

**2015 - Afterpay launches in Australia.** The product was deliberately simple: four payments, no interest, no long applications. Late fees were the only consumer cost ($8 per missed payment, capped at 25% of order value). Merchants paid a fee (4-6%) because Afterpay drove higher conversion rates and larger basket sizes.

**2016-2018 - Rapid Australian adoption.** Afterpay became a cultural phenomenon among Australian millennials. By 2018, one in five Australian adults under 35 had used Afterpay. The company listed on the ASX (Australian Securities Exchange) in 2016.

**2018 - US launch.** Afterpay entered the US and grew rapidly, partnering with Urban Outfitters, Forever 21, and other retailers targeting younger consumers.

**January 2022 - Block (Square) acquires Afterpay for $29 billion.** This was the largest-ever acquisition of an Australian company. Block integrated Afterpay into its Cash App and Square merchant ecosystem.

### 1.4 The Affirm Founding Story

**2012 - San Francisco, US.** **Max Levchin**, co-founder of PayPal and a serial entrepreneur, founded Affirm with the explicit mission of building "honest financial products." Levchin's insight: the credit card model was designed to be opaque. Minimum payments, compound interest, deferred interest, penalty APRs - these features maximized revenue for banks but were confusing and harmful to consumers.

Affirm's founding principles:
1. **No hidden fees.** The total cost is shown upfront, before you commit.
2. **No compound interest.** Simple interest only.
3. **No late fees.** Affirm has never charged a late fee (as of 2025). If you miss a payment, your account is paused and you cannot make new purchases until caught up.
4. **No deferred interest.** Unlike Bill Me Later or store credit cards, there is no retroactive interest trap.

**2013-2016 - Longer-term installment loans.** Unlike Klarna and Afterpay, Affirm started with longer-term financing: 3 to 12 months (later extended to 60 months), with APRs from 0% (merchant-subsidized) to 36%. This positioned Affirm as an alternative to credit cards for larger purchases - furniture, electronics, fitness equipment.

**2020 - Pay in 4 launch.** Affirm added a short-term, interest-free "Pay in 4" product to compete directly with Klarna and Afterpay.

**January 2021 - Affirm IPO.** Affirm went public on NASDAQ (ticker: AFRM). The stock opened at $90.90 per share, nearly doubling its $49 IPO price, giving the company a market cap of ~$24 billion.

### 1.5 The BNPL Boom and Correction

**2019-2021 - Explosive growth.** COVID-19 lockdowns accelerated e-commerce adoption, which accelerated BNPL adoption. Global BNPL transaction volume grew from approximately $60 billion (2019) to over $300 billion (2022). New entrants flooded the market: PayPal Pay in 4, Apple Pay Later, Zip, Sezzle, Perpay, and dozens of others.

**Valuation peak:** Klarna raised at a $45.6 billion valuation in June 2021.

**2022-2023 - The correction.** Rising interest rates crushed BNPL economics. The providers fund loans with borrowed capital, and when the cost of borrowing doubled (from near-zero to 5%+), their margins evaporated. Credit losses also rose as inflation squeezed consumers.

- Klarna's valuation dropped to $6.7 billion in July 2022 (an 85% decline from peak). It rebounded to $14.6 billion by 2024.
- Affirm's stock fell from $168 (November 2021) to $8.62 (January 2023), an over 94% decline.
- Apple Pay Later launched in March 2023 and was discontinued in June 2024 - Apple pivoted to partnering with Affirm instead.
- Multiple smaller BNPL providers went bankrupt or were acquired at distressed valuations.

**2024-2025 - Stabilization and profitability focus.** The survivors - Klarna, Affirm, Afterpay/Block - shifted from growth-at-all-costs to unit economics and profitability. Klarna achieved its first annual profit since its hyper-growth phase in 2024. Affirm narrowed its losses. The industry matured.

### 1.6 Scale Today (2025-2026)

| Metric | Klarna | Affirm | Afterpay (Block) |
|--------|--------|--------|-------------------|
| Founded | 2005 (Stockholm) | 2012 (San Francisco) | 2014 (Sydney) |
| Active consumers | 150M+ | 18M+ | 20M+ |
| Active merchants | 500,000+ | 300,000+ | 100,000+ |
| Annual GMV | ~$100B | ~$28B | ~$28B |
| Annual revenue | ~$2.3B | ~$2.3B | Reported within Block |
| Countries | 45 | 2 (US, CA) | 5 (US, AU, UK, NZ, CA) |
| Profitable | Yes (2024, first time) | No (narrowing losses) | Reported within Block |
| Bank license | Yes (EU) | No | No |

**Global BNPL market size (2025):** Estimated at $400-500 billion in annual transaction volume globally. BNPL accounts for approximately 5% of global e-commerce payments and is growing at approximately 15-20% per year.

**Demographic breakdown:** BNPL adoption skews young. Approximately 45% of US BNPL users are millennials (25-40), 30% are Gen Z (18-24), 20% are Gen X (41-56), and 5% are baby boomers (57+).

**Top merchant categories for BNPL (by GMV):**

| Category | Share of BNPL GMV | Why BNPL Works Here |
|----------|-------------------|---------------------|
| Fashion / apparel | ~35% | High AOV uplift, impulse purchases, seasonal |
| Electronics / tech | ~20% | High-ticket items ($500-$2,000), considered purchases |
| Beauty / cosmetics | ~12% | Aspirational purchases, high repeat rate |
| Home / furniture | ~10% | Very high ticket items, long consideration cycle |
| Health / fitness | ~8% | Peloton, gym equipment, elective procedures |
| Travel | ~5% | Flights, hotels (emerging category for BNPL) |
| Other | ~10% | Auto parts, education, pet supplies, etc. |

### 1.7 Other BNPL Players

While Klarna, Affirm, and Afterpay dominate, the BNPL landscape includes several other significant players:

| Provider | Founded | Key Market | Differentiator |
|----------|---------|-----------|----------------|
| **PayPal Pay in 4** | 2020 | US, UK, AU, FR, DE | Leverages PayPal's 400M+ accounts. No separate sign-up needed. |
| **Zip (formerly Quadpay)** | 2013 | US, AU, NZ, UK | "Zip Anywhere" virtual card. Line of credit model. |
| **Sezzle** | 2016 | US, CA | Targets younger consumers. "Sezzle Up" credit-building program. |
| **Tabby** | 2019 | UAE, Saudi Arabia, Egypt | Dominant BNPL in the Middle East. |
| **Atome** | 2019 | Southeast Asia | Leading BNPL in Singapore, Malaysia, Indonesia, Philippines. |
| **Scalapay** | 2019 | Italy, Europe | Southern European focus. Acquired by Klarna in 2024. |
| **Clearpay** | 2018 | UK (Afterpay's UK brand) | Afterpay rebranded for UK market. |

---

## 2. Core Concept

### 2.1 What BNPL Actually Is

**Buy Now Pay Later is short-term, point-of-sale consumer credit.** The consumer receives the product immediately. The merchant receives payment upfront (from the BNPL provider). The BNPL provider extends credit to the consumer and collects repayment over time.

The simplest BNPL product - "Pay in 4" - works like this:

```
Consumer buys $200 sneakers:

  Payment 1:  $50.00  - Charged today (at checkout)
  Payment 2:  $50.00  - Charged in 2 weeks
  Payment 3:  $50.00  - Charged in 4 weeks
  Payment 4:  $50.00  - Charged in 6 weeks
                        -------
  Total cost: $200.00  - 0% interest, $0 fees (if paid on time)
```

The merchant pays a fee (the Merchant Discount Rate, or MDR) of 3-8% of the order value. This is how the BNPL provider makes money. The consumer pays nothing extra if payments are on time.

### 2.2 What BNPL Is NOT

| Misconception | Reality |
|---------------|---------|
| "BNPL is a payment network" | No. BNPL providers do not operate payment rails. They use existing card networks (Visa, Mastercard) and bank transfers (ACH) to move money. |
| "BNPL is free money" | No. The consumer pays the same price. The merchant pays a higher fee (3-8% vs. 2-3% for cards). If the consumer misses payments, late fees apply (varies by provider). |
| "BNPL is a credit card" | No. BNPL is a fixed installment obligation, not a revolving credit line. You cannot carry a balance, make minimum payments, or accumulate compound interest (on Pay in 4 products). |
| "BNPL providers are banks" | Most are not. Klarna has an EU banking license, but Affirm and Afterpay are not banks. They originate loans through bank partners (WebBank, Cross River Bank) for regulatory compliance. |
| "BNPL does not affect your credit score" | It depends. Affirm reports to credit bureaus. Klarna began reporting in 2022. Afterpay generally does not report Pay in 4 activity. Missed payments may be reported. |
| "BNPL is only for people who can't afford things" | Incorrect. Research shows BNPL is used by consumers across income levels. Many users prefer 0% installments even when they could pay in full, as a cash flow management tool. |
| "BNPL and layaway are the same thing" | No. With layaway, you do not receive the product until you have paid in full. With BNPL, you receive the product immediately. BNPL carries credit risk; layaway does not. |

### 2.3 The Mental Model

Think of BNPL as a **merchant-subsidized, short-term installment loan**:

```
Traditional credit card purchase:
  Consumer --[$200 purchase]--> Merchant
  Consumer <--[revolving credit, 20% APR]--> Card Issuer
  Merchant --[2.5% MDR = $5]--> Card Network + Issuer

BNPL "Pay in 4" purchase:
  Consumer --[$200 purchase]--> Merchant
  BNPL Provider --[$188 (after 6% MDR)]--> Merchant      (merchant gets paid NOW)
  Consumer --[$50 x 4 biweekly]--> BNPL Provider          (consumer pays over 6 weeks)
  BNPL Provider <--[funding]--> Warehouse Lenders / ABS   (BNPL borrows to fund loans)

Key insight: The merchant pays MORE (6% vs 2.5%) because BNPL
increases conversion by 20-30% and average order value by 40-50%.
The economics only work because BNPL drives incremental sales.
```

The critical difference from a credit card: the consumer's total cost is known and fixed at checkout. There is no revolving balance, no minimum payment trap, and no compound interest (for Pay in 4 products). The cost is borne by the merchant, not the consumer.

---

## 3. Key Participants and Roles

### 3.1 The Ecosystem

| Participant | Role | Examples |
|-------------|------|----------|
| **Consumer** | The borrower. Selects BNPL at checkout and repays in installments. | Any online or in-store shopper |
| **Merchant** | Integrates BNPL at checkout. Pays MDR to BNPL provider. Receives upfront payment. | Nike, ASOS, Sephora, Walmart |
| **BNPL Provider** | Underwrites the consumer, pays the merchant, and collects installments. | Klarna, Affirm, Afterpay, Zip, PayPal Pay in 4 |
| **Bank Partner (Loan Originator)** | Originates the loan for regulatory compliance (US). The BNPL provider typically purchases the loan immediately. | WebBank (Klarna, Afterpay), Cross River Bank (Affirm) |
| **E-commerce Platform** | Provides the integration layer between merchant and BNPL. | Shopify, BigCommerce, WooCommerce, Magento |
| **Payment Processor** | Processes the settlement from BNPL provider to merchant. | Stripe, Adyen, Checkout.com |
| **Warehouse Lender** | Provides credit facilities to fund BNPL loan originations. | Goldman Sachs, JPMorgan, Barclays |
| **ABS Investors** | Purchase securitized pools of BNPL loans. | Pension funds, hedge funds, insurance companies |
| **Credit Bureaus** | Provide credit data for underwriting. Receive repayment data. | TransUnion, Experian, Equifax |
| **Regulators** | Oversee consumer protection and lending compliance. | CFPB (US), FCA (UK), ASIC (Australia), ECB (EU) |

### 3.2 The Bank Partner Model (US)

In the United States, lending is regulated at the state level. To originate loans across all 50 states without obtaining 50 separate lending licenses, BNPL providers use a **bank partner model** (also called "rent-a-charter"):

1. **WebBank** (Utah) or **Cross River Bank** (New Jersey) is the legal lender of record. These are FDIC-insured banks.
2. The consumer's loan is originated by the bank partner.
3. The BNPL provider immediately purchases the loan from the bank (typically within 1-2 business days).
4. The BNPL provider services the loan (collects payments, handles customer support, manages delinquencies).

This structure allows the BNPL provider to use the bank's lending license and federal preemption of state usury laws. It has been scrutinized by regulators (the FDIC's "valid when made" rule and the OCC's "true lender" rule) but remains the dominant model.

In the EU, Klarna holds its own banking license (granted by Sweden's Finansinspektionen in 2017), so it does not need a bank partner for European loans.

### 3.3 Merchant Integration Patterns

| Integration Type | Complexity | Time to Launch | Examples |
|-----------------|-----------|---------------|----------|
| **Hosted checkout** | Low | Hours | BNPL widget embedded in checkout page via JavaScript SDK |
| **E-commerce plugin** | Low | Hours | Shopify app, WooCommerce plugin, BigCommerce extension |
| **Payment processor integration** | Medium | Days | Stripe Payment Element, Adyen Drop-in, Checkout.com |
| **Direct API** | High | Weeks | Full API integration for custom checkout flows |
| **In-store / POS** | Medium | Days-weeks | Virtual card generated at POS, QR code scanning |
| **Virtual card (anywhere)** | N/A (consumer-side) | N/A | Consumer generates a virtual Visa/MC and uses it at any merchant |

The Shopify partnership has been particularly significant for Affirm. As of 2023, Affirm is the exclusive long-term installment BNPL provider for Shopify's Shop Pay Installments, giving Affirm access to Shopify's millions of merchants.

![BNPL ecosystem participants and relationships](diagrams/bnpl-ecosystem-participants.mmd)

---

## 4. How It Works - Step by Step

### 4.1 The Pay in 4 Flow

This section traces the complete flow when a consumer selects BNPL at checkout.

#### Step 1: Consumer Selects BNPL

The consumer adds items to their cart on an e-commerce site, proceeds to checkout, and selects a BNPL option (e.g., "Pay in 4 with Klarna"). The merchant's checkout page either embeds the BNPL provider's widget (JavaScript SDK) or redirects the consumer to the BNPL provider's hosted page.

#### Step 2: Identity Verification

The BNPL provider collects minimal information:
- Email address
- Phone number (for OTP verification)
- Full name
- Date of birth (sometimes)
- Shipping/billing address

Returning customers are recognized by email/phone and may skip this step.

#### Step 3: Real-Time Underwriting

The BNPL provider's underwriting engine runs in under 2 seconds. It evaluates:

1. **Identity verification.** Is this a real person? Does the email/phone/name/address combination match? Is the device fingerprint associated with fraud?
2. **Soft credit check.** A soft inquiry (no impact on credit score) pulls a limited credit report from one bureau (typically TransUnion or Experian). This provides credit score, existing obligations, and delinquency history.
3. **Internal repayment history.** Has this consumer used the BNPL provider before? What is their repayment track record? Repeat customers with perfect histories may be approved with higher limits.
4. **Fraud scoring.** An ML model evaluates device fingerprint, IP address, email age, behavior patterns, velocity (how many BNPL applications in the last 24 hours), and other signals.
5. **Affordability assessment.** Given the consumer's existing BNPL balances (with this provider), order amount, and credit profile, can they reasonably afford this purchase?
6. **Loan origination.** If approved, the loan is originated through the bank partner (WebBank or Cross River Bank) for regulatory compliance.

Approval rates vary: Klarna approves approximately 70-75%, Affirm approximately 65-70%, and Afterpay approximately 75-80%.

#### Step 4: Consumer Confirms Payment Plan

The consumer sees the payment schedule:
- Payment 1: $50.00 - Today
- Payment 2: $50.00 - April 21
- Payment 3: $50.00 - May 5
- Payment 4: $50.00 - May 19

The consumer selects their payment method (debit card, credit card, or bank account) and confirms.

#### Step 5: Merchant Gets Paid

The BNPL provider pays the merchant the full order amount minus the Merchant Discount Rate (MDR). For a $200 order with a 6% MDR, the merchant receives $188. Settlement typically occurs in 1-3 business days.

#### Step 6: Consumer Repays in Installments

The first installment is charged immediately. Subsequent installments are automatically charged to the consumer's stored payment method every two weeks. If the auto-charge fails (insufficient funds, expired card), the BNPL provider sends reminders and may apply a late fee.

#### Step 7: Lifecycle After Completion

Once all four payments are complete:
- The loan is marked as fully repaid
- The consumer's internal credit score with the BNPL provider improves
- Some providers report the positive repayment to credit bureaus
- The consumer can make new BNPL purchases

![End-to-end BNPL transaction flow](diagrams/bnpl-transaction-flow.mmd)

### 4.2 Concrete Walkthrough: Sarah Buys Sneakers with Klarna

Let us trace every step when Sarah, a 28-year-old software engineer, buys $200 sneakers on Nike.com using Klarna Pay in 4.

**Setup:** Sarah has used Klarna twice before (both paid on time). She has a Chase debit card on file with Klarna. Her credit score is 720.

**1. Nike.com checkout.** Sarah adds Air Max 90 ($200) to her cart and selects "Pay in 4 interest-free payments of $50 with Klarna" at checkout.

**2. Klarna widget opens.** An embedded Klarna widget asks Sarah to verify her identity via a 6-digit SMS code sent to her phone.

**3. Underwriting (1.8 seconds).**
- Soft credit pull: TransUnion score 720 (good)
- Internal history: 2 previous orders, both paid on time
- Fraud signals: known device, US IP, email age > 5 years
- Affordability: $200 order, no existing Klarna balance
- Decision: **Approved**, Tier 1, Pay in 4 at 0% APR

**4. Loan origination.** WebBank originates a $200 loan on Sarah's behalf. Klarna immediately purchases the loan from WebBank under their assignment agreement.

**5. Payment plan presented.**
- Payment 1: $50.00 - April 7 (today)
- Payment 2: $50.00 - April 21
- Payment 3: $50.00 - May 5
- Payment 4: $50.00 - May 19

Sarah confirms. Her Chase debit card is charged $50.00 immediately.

**6. Nike gets paid.** Klarna settles $188.00 to Nike ($200 minus 6% MDR = $12 fee). Nike ships the sneakers.

**7. Auto-payments.** Over the next 6 weeks, Klarna auto-charges $50 to Sarah's Chase debit card on each due date. All payments succeed.

**8. Completion.** Sarah has paid $200 total. Zero interest. Zero fees. Nike paid $12 for the BNPL service. Klarna earned $12 in MDR minus approximately $1.50 in funding costs and $1.50 in operational costs = approximately $9 gross margin.

![Sarah buys sneakers on Nike.com with Klarna](diagrams/sarah-buys-sneakers-klarna.mmd)

---

## 5. Technical Architecture

### 5.1 BNPL Product Types

BNPL is not a single product. It is a family of credit products offered at point of sale:

| Product | Duration | APR | Credit Check | Typical Amount | Example |
|---------|----------|-----|-------------|---------------|---------|
| **Pay in 4** | 6 weeks (4 biweekly) | 0% | Soft pull | $35-$1,500 | Klarna Pay in 4, Afterpay, PayPal Pay in 4 |
| **Pay After Delivery** | 14-30 days | 0% | Soft pull | Order-dependent | Klarna Pay in 30 |
| **Monthly Installments** | 3-60 months | 0-36% | Soft or hard pull | $50-$20,000+ | Affirm Monthly, Klarna Financing |
| **Virtual Card** | Varies | Per underlying product | Soft pull | Per approval | Klarna Ghost Card, Affirm Virtual Card |
| **Merchant-Subsidized 0% APR** | 3-48 months | 0% (merchant pays) | Hard pull (typically) | $100-$20,000+ | Affirm at Peloton, Apple via Affirm |

![BNPL product types and their characteristics](diagrams/bnpl-product-types.mmd)

### 5.2 The Underwriting Engine

The underwriting engine is the technical core of every BNPL provider. It must make a credit decision in under 2 seconds while the consumer waits at checkout.

**Data Inputs:**

| Data Source | Signals | Latency |
|-------------|---------|---------|
| Consumer input | Name, email, phone, DOB, address | Immediate |
| Device fingerprint | Device ID, OS, browser, screen resolution, timezone | Immediate |
| IP geolocation | Country, city, ISP, VPN/proxy detection | < 50ms |
| Email/phone intelligence | Email age, domain, phone carrier, past fraud associations | < 200ms |
| Credit bureau (soft pull) | Credit score, open accounts, delinquencies, total debt | < 500ms |
| Internal history | Past orders, repayment record, previous declines | < 50ms |
| Merchant context | Merchant category, order amount, item types, shipping address | Immediate |

**ML Models:**

BNPL providers typically run 3-5 ML models in parallel:

1. **Fraud model.** Predicts the probability that the transaction is fraudulent (stolen identity, synthetic identity, account takeover). Features include device fingerprint, behavioral biometrics, email/phone graph analysis, and velocity checks.

2. **Credit risk model.** Predicts the probability of default (missed payments or charge-off). Features include credit score, debt-to-income proxies, internal repayment history, and order characteristics.

3. **Affordability model.** Estimates whether the consumer can afford the repayment schedule given their existing obligations. Uses credit bureau data on open accounts and balances.

4. **Identity verification model.** Confirms the consumer is who they claim to be. Cross-references name, address, phone, email, and DOB against credit bureau records and identity databases.

**Decision Logic:**

```
if fraud_score > FRAUD_THRESHOLD:
    return DECLINE(reason="fraud_risk")

if identity_confidence < ID_THRESHOLD:
    return DECLINE(reason="identity_unverified")

if credit_score < MIN_CREDIT_SCORE:
    return DECLINE(reason="credit_risk")

if existing_bnpl_balance + order_amount > MAX_EXPOSURE:
    return DECLINE(reason="overcommitted")

risk_tier = calculate_risk_tier(credit_score, internal_history, order_amount)

if risk_tier == TIER_1:
    return APPROVE(limit=1500, apr=0, product="pay_in_4")
elif risk_tier == TIER_2:
    return APPROVE(limit=500, apr=0, product="pay_in_4")
elif risk_tier == TIER_3:
    return APPROVE(limit=250, apr=0, product="pay_in_4")
    # OR: APPROVE(apr=15, product="monthly_installments")
else:
    return DECLINE(reason="credit_risk")
```

![Underwriting decision engine flow](diagrams/underwriting-decision-engine.mmd)

### 5.3 The Installment Schedule

![Pay in 4 installment schedule and missed payment consequences](diagrams/pay-in-4-installment-schedule.mmd)

### 5.4 Merchant API Integration

A typical BNPL merchant integration follows three steps: create a session (server-side), render the widget (client-side), and capture the order (server-side).

**Step 1: Create Session (Server-Side)**

```http
POST /payments/v1/sessions HTTP/1.1
Host: api.klarna.com
Authorization: Basic base64(merchant_api_key:merchant_api_secret)
Content-Type: application/json

{
  "purchase_country": "US",
  "purchase_currency": "USD",
  "locale": "en-US",
  "order_amount": 20000,
  "order_tax_amount": 0,
  "order_lines": [
    {
      "type": "physical",
      "name": "Nike Air Max 90",
      "quantity": 1,
      "unit_price": 20000,
      "total_amount": 20000
    }
  ]
}
```

Response:

```json
{
  "session_id": "kl-sess-abc123",
  "client_token": "eyJhbGciOiJIUzI1NiJ9...",
  "payment_method_categories": [
    {
      "identifier": "pay_in_4",
      "name": "Pay in 4",
      "asset_urls": {
        "descriptive": "https://x.klarnacdn.net/payment-method/..."
      }
    }
  ]
}
```

**Step 2: Render Widget (Client-Side)**

```javascript
// Load Klarna SDK
Klarna.Payments.init({ client_token: "eyJhbGciOiJIUzI1NiJ9..." });

// Render the payment widget in the checkout page
Klarna.Payments.load({
  container: "#klarna-payments-container",
  payment_method_category: "pay_in_4"
}, function(res) {
  if (res.show_form) {
    // Widget is visible, consumer can interact
  }
});

// When consumer clicks "Place Order"
Klarna.Payments.authorize({
  payment_method_category: "pay_in_4"
}, {}, function(res) {
  if (res.approved) {
    // Send res.authorization_token to your server
    sendToServer(res.authorization_token);
  }
});
```

**Step 3: Capture Order (Server-Side)**

```http
POST /payments/v1/authorizations/{authorization_token}/order HTTP/1.1
Host: api.klarna.com
Authorization: Basic base64(merchant_api_key:merchant_api_secret)
Content-Type: application/json

{
  "order_amount": 20000,
  "order_tax_amount": 0,
  "order_lines": [
    {
      "type": "physical",
      "name": "Nike Air Max 90",
      "quantity": 1,
      "unit_price": 20000,
      "total_amount": 20000
    }
  ],
  "merchant_reference1": "NIKE-ORD-12345"
}
```

Response:

```json
{
  "order_id": "kl-ord-456def",
  "fraud_status": "ACCEPTED",
  "redirect_url": ""
}
```

Affirm's API follows a similar pattern, though with different endpoint names and authentication mechanisms.

![How merchants integrate BNPL at checkout](diagrams/merchant-integration-flow.mmd)

### 5.5 Funding and Capital Structure

BNPL providers do not fund loans from their own equity (that would be unsustainable at scale). They use a layered capital structure:

**Warehouse Credit Facilities.** Revolving lines of credit from large banks (Goldman Sachs, JPMorgan, Barclays). The BNPL provider borrows money from the warehouse, uses it to fund consumer loans, and repays the warehouse as consumers repay. Typical cost: SOFR + 150-300 basis points. Affirm has approximately $8 billion in total funding capacity; Klarna has over $10 billion.

**Asset-Backed Securitization (ABS).** The BNPL provider pools thousands of individual loans, packages them into an asset-backed security, and sells tranches to investors:

- **Senior tranche (AAA/AA):** 70-80% of the pool. Lowest yield, lowest risk. Bought by pension funds and insurance companies.
- **Mezzanine tranche (A/BBB):** 10-15%. Medium yield and risk. Bought by hedge funds and asset managers.
- **Equity/first-loss tranche:** 5-10%. Highest yield, absorbs the first losses. Often retained by the BNPL provider.

ABS is the cheapest source of funding (SOFR + 80-200 bps) because the risk is distributed across many investors and the senior tranche is protected by the subordinate tranches.

**Forward Flow Agreements.** A pre-committed buyer agrees to purchase a fixed volume of loans at agreed terms. This provides funding certainty and predictable pricing.

![How BNPL providers fund their loan portfolios](diagrams/bnpl-funding-model.mmd)

### 5.6 Affirm's API - A Comparison

While Section 5.4 showed Klarna's API, Affirm's integration follows a different pattern. Affirm uses a checkout flow that redirects the consumer to Affirm's hosted page (or embeds a modal):

**Create Checkout (Server-Side):**

```http
POST /api/v2/checkout HTTP/1.1
Host: sandbox.affirm.com
Content-Type: application/json

{
  "merchant": {
    "user_confirmation_url": "https://merchant.com/confirm",
    "user_cancel_url": "https://merchant.com/cancel",
    "name": "Nike"
  },
  "shipping": {
    "name": { "first": "Sarah", "last": "Chen" },
    "address": {
      "line1": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zipcode": "94105",
      "country": "US"
    }
  },
  "items": [
    {
      "display_name": "Air Max 90",
      "sku": "NKE-AM90-BLK-10",
      "unit_price": 20000,
      "qty": 1
    }
  ],
  "currency": "USD",
  "total": 20000,
  "order_id": "NIKE-ORD-12345"
}
```

Affirm returns a `checkout_token`, which the merchant uses to redirect the consumer:

```javascript
affirm.checkout({
  checkout_token: "CHECKOUT_TOKEN_ABC"
});
affirm.checkout.open();
// Consumer completes underwriting on Affirm's hosted page
// On approval, Affirm redirects to user_confirmation_url with a checkout_token
```

**Capture (Server-Side) after consumer confirms:**

```http
POST /api/v2/transactions HTTP/1.1
Host: sandbox.affirm.com
Authorization: Basic base64(public_api_key:private_api_key)
Content-Type: application/json

{
  "checkout_token": "CHECKOUT_TOKEN_ABC",
  "order_id": "NIKE-ORD-12345"
}
```

Response:

```json
{
  "id": "TRXN-123456",
  "created": "2026-04-07T10:30:00Z",
  "currency": "USD",
  "amount": 20000,
  "status": "authorized",
  "events": [
    { "type": "authorize", "created": "2026-04-07T10:30:00Z" }
  ]
}
```

The key architectural difference: Klarna's approach embeds the underwriting widget directly in the merchant's checkout page. Affirm's approach redirects (or opens a modal) to Affirm's hosted environment. Klarna's approach gives the merchant more control over the UX; Affirm's approach gives Affirm more control over the underwriting experience and data collection.

### 5.7 Refund and Return Handling

Refunds in BNPL are more complex than credit card refunds because the payment is split across time:

**Scenario 1: Full refund before all installments are paid.**
- Sarah bought $200 sneakers with Pay in 4, paid 2 of 4 installments ($100 paid)
- Sarah returns the sneakers for a full refund
- Klarna receives the $200 refund notification from Nike
- Klarna refunds the $100 already charged to Sarah's debit card
- Klarna cancels the remaining 2 installments ($100)
- Sarah owes nothing

**Scenario 2: Partial refund.**
- Sarah bought $200 sneakers, returns one pair from a 2-item order
- Nike refunds $100 to Klarna
- Klarna recalculates the remaining installments (now $100 total instead of $200)
- If Sarah already paid $100, no more payments are due
- If Sarah paid $50, one more $50 payment remains

**Scenario 3: Refund after all installments are paid.**
- Sarah returns sneakers after paying all 4 installments
- Klarna refunds $200 to Sarah's debit card directly

**Merchant-side API for refunds:**

```http
POST /ordermanagement/v1/orders/{order_id}/refunds HTTP/1.1
Host: api.klarna.com
Authorization: Basic base64(api_key:api_secret)
Content-Type: application/json

{
  "refunded_amount": 20000,
  "description": "Customer returned item"
}
```

The refund process creates a reconciliation challenge: the merchant has already received $188 (after MDR), but Klarna needs to refund the consumer $200. In practice, Klarna deducts the refund from the merchant's next settlement, or charges the merchant directly if no future settlements are pending.

### 5.8 Webhooks and Order Lifecycle

BNPL providers notify merchants of order lifecycle events via webhooks:

| Event | Trigger | Merchant Action |
|-------|---------|----------------|
| `order.created` | Consumer approved, order placed | Fulfill the order, ship the product |
| `order.captured` | Payment captured by BNPL | Confirm settlement is expected |
| `order.cancelled` | Order cancelled before fulfillment | Stop fulfillment, reverse inventory |
| `order.refunded` | Refund processed | Update order status |
| `fraud_status.changed` | BNPL provider's fraud review result | If "REJECTED", do not ship the product |
| `dispute.created` | Consumer opened a dispute | Provide evidence to BNPL provider |
| `chargeback.received` | Consumer's bank reversed a payment | Respond to chargeback |

**Fraud Review Window.** After a BNPL order is placed, the provider may have a brief fraud review window (typically 0-24 hours) during which the order can be rejected even after initial approval. Merchants should check the `fraud_status` before shipping. This is analogous to the payment capture window in traditional card processing.

---

## 6. Money Flow / Economics

### 6.1 Revenue Streams

BNPL providers make money from multiple sources, but the Merchant Discount Rate is dominant:

**1. Merchant Discount Rate (MDR) - 60-80% of revenue**

The MDR is the fee the merchant pays the BNPL provider for each transaction. It ranges from 3% to 8%, with an industry average of approximately 5-6%. This is 2-3x higher than credit card processing fees (1.5-3.5%).

Why do merchants pay this premium?

| Benefit | Impact | Evidence |
|---------|--------|----------|
| Higher conversion rates | +20-30% | Consumers who might abandon checkout due to price complete the purchase when BNPL is available |
| Higher average order value (AOV) | +40-50% | Consumers spend more when splitting payments (e.g., buying 2 items instead of 1) |
| Lower cart abandonment | -25-35% | "I can afford $50 today" vs. "I cannot afford $200 today" |
| Younger customer acquisition | Significant | BNPL attracts Gen Z/millennial shoppers who avoid credit cards |
| Repeat purchases | +20% | BNPL shopping apps drive return traffic |

**2. Consumer Interest (Installment Loans) - 15-25% of revenue**

For longer-term financing (3-60 months), BNPL providers charge interest. Affirm's average APR on interest-bearing loans is approximately 18%. Klarna charges up to 24.99% APR on financing products. Pay in 4 products carry 0% APR.

**3. Late Fees - 2-8% of revenue**

| Provider | Late Fee Policy |
|----------|----------------|
| Klarna | $7 per missed payment |
| Afterpay | $8 per missed payment (capped at 25% of order value) |
| Affirm | $0 - Affirm has never charged a late fee |

**4. Other Revenue Streams - 5-10%**

- **Lead generation / shopping app.** Klarna's app has 150M+ users who browse and shop through the app. Klarna charges merchants for placement and click-throughs.
- **Virtual card interchange.** When consumers use BNPL-issued virtual Visa/Mastercard numbers at non-integrated merchants, the BNPL provider earns interchange.
- **Advertising / data.** Klarna has launched ad products that monetize shopping intent data.
- **Subscriptions.** Klarna Plus ($7.99/month) offers premium features and cashback.

### 6.2 Unit Economics

For a typical Pay in 4 transaction of $200:

```
Revenue:
  Merchant Discount Rate:  +$12.00  (6% of $200)

Costs:
  Funding cost:            -$1.50   (cost of borrowing $200 for ~6 weeks)
  Credit losses:           -$2.00   (1-2% of originations eventually default)
  Payment processing:      -$0.60   (0.3% per installment charge x 4)
  Customer acquisition:    -$1.00   (marketing, merchant sales)
  Operations / servicing:  -$1.50   (underwriting, support, collections)
  Technology:              -$1.00   (infrastructure, ML models)
                           --------
Gross margin:              +$4.40   (~2.2% of GMV)
```

The unit economics are thin. A 1% increase in credit losses can eliminate profitability. This is why interest rates matter so much - when SOFR rose from 0% to 5%, the funding cost line roughly tripled.

### 6.3 MDR Comparison Across Payment Methods

| Payment Method | Typical MDR | Who Pays |
|---------------|-------------|----------|
| BNPL (Pay in 4) | 3-8% (avg ~5-6%) | Merchant |
| Credit card | 1.5-3.5% (avg ~2.5%) | Merchant |
| Debit card | 0.5-1.5% (avg ~1.0%) | Merchant |
| ACH / bank transfer | $0.25-$1.50 flat | Merchant |
| Cash | $0 | N/A |

### 6.4 Who Pays When Things Go Wrong

Understanding who bears the loss in various scenarios is critical to understanding BNPL economics:

| Scenario | Who Bears the Loss | Why |
|----------|-------------------|-----|
| Consumer defaults on payments | BNPL provider | The BNPL provider has already paid the merchant. The consumer's debt is owed to the BNPL provider. |
| Consumer disputes a charge with their bank | BNPL provider (initially), may pass to merchant | The consumer's bank reverses the payment to the consumer. The BNPL provider loses the installment payment. |
| Consumer returns product | Merchant refunds BNPL provider | The merchant must refund the BNPL provider, who then cancels remaining installments and refunds the consumer. |
| Fraudulent order (stolen identity) | BNPL provider | The BNPL provider approved the transaction. The merchant fulfilled in good faith. The BNPL provider absorbs the fraud loss. |
| Merchant goes bankrupt | BNPL provider | If the merchant closes before fulfilling an order, the BNPL provider must refund the consumer but cannot recover from the merchant. |
| BNPL provider goes bankrupt | Consumer still owes the debt | The consumer's loan obligation is an asset that would be sold to a debt buyer or transferred to another servicer. |

### 6.5 Merchant Economics: Is BNPL Worth 6% MDR?

This is the critical question. Let us model a merchant deciding whether to add BNPL:

```
WITHOUT BNPL:
  1,000 visitors -> 3% conversion = 30 orders
  Average order value (AOV) = $150
  Revenue = 30 x $150 = $4,500
  Card processing cost = $4,500 x 2.5% = $112.50
  Net = $4,387.50

WITH BNPL:
  1,000 visitors -> 3.8% conversion (+27%) = 38 orders
  Average order value (AOV) = $210 (+40%) = $210
  Revenue = 38 x $210 = $7,980
  Card processing (70% of orders) = $5,586 x 2.5% = $139.65
  BNPL processing (30% of orders) = $2,394 x 6% = $143.64
  Net = $7,980 - $139.65 - $143.64 = $7,696.71

Incremental revenue from BNPL: +$3,309.21 (+75%)
```

The higher MDR is offset - and more than offset - by the conversion and AOV uplift. This is why merchants continue to pay the premium even though it is 2-3x the cost of card processing. However, the uplift varies significantly by merchant category. Fashion and beauty see the largest BNPL uplift. Groceries and utilities see minimal benefit.

![Revenue and fee model for BNPL](diagrams/revenue-and-fee-model.mmd)

---

## 7. Security and Risk

### 7.1 Credit Risk

Credit risk - the risk that consumers do not repay - is the dominant risk for BNPL providers.

**Loss Rates by Product:**

| Product Type | Net Loss Rate | Explanation |
|-------------|--------------|-------------|
| Pay in 4 (short-term) | 1-3% | Low per-loan amounts, short duration, but high volume |
| Monthly installments (longer-term) | 3-8% | Higher amounts, longer exposure, more can go wrong |
| Subprime-focused products | 8-15% | Some providers target consumers with poor credit |

**For comparison:**
- US credit card industry net loss rate: 3-4% (2024)
- Subprime credit card net loss rate: 8-12%
- Prime auto loan net loss rate: 0.5-1.5%

**Provider-specific loss rates (2024):**
- Klarna: ~2.1% credit loss rate (improved from 2.6% in 2023)
- Affirm: ~4.5% net charge-off rate (includes longer-term loans)
- Afterpay: ~1.8% net loss rate (Pay in 4 focus, short duration)

![Credit risk waterfall from origination to charge-off](diagrams/credit-risk-waterfall.mmd)

### 7.2 Fraud Risk

BNPL providers face unique fraud vectors:

**Identity Fraud.** Fraudsters use stolen personal information to create BNPL accounts, make purchases, and disappear. The goods are shipped to a drop address or resold. Unlike credit cards, BNPL often requires minimal identity verification (no government ID upload, no hard credit check).

**Synthetic Identity Fraud.** Fraudsters combine real and fake information to create a new identity. They build credit history slowly, then "bust out" with large BNPL purchases. This is harder to detect because the synthetic identity has legitimate-looking credit bureau records.

**Friendly Fraud / First-Party Fraud.** The consumer makes a legitimate purchase, receives the goods, and then disputes the first payment or claims the item was not delivered. Since BNPL providers have already paid the merchant, they bear the loss.

**Return Fraud.** The consumer makes a purchase, receives the product, initiates a return for a refund, but the refund goes to the BNPL provider. The consumer stops paying installments, claiming the order was returned. Timing mismatches between refund processing and installment collection create opportunities for exploitation.

**Account Takeover.** An attacker gains access to a consumer's BNPL account (via phishing, credential stuffing, or SIM swapping) and makes purchases using the consumer's stored payment method and approved credit line.

### 7.3 Over-Indebtedness Risk

The most significant consumer risk with BNPL is debt stacking - taking out multiple BNPL obligations across different providers simultaneously. Because BNPL providers often do not report to credit bureaus (or only recently started), and soft credit pulls do not show other soft pulls, a consumer can accumulate BNPL obligations that are invisible to each individual provider.

**Example scenario:**
- $200 owed to Klarna
- $150 owed to Afterpay
- $500 owed to Affirm
- $100 owed to PayPal Pay in 4
- Total: $950 in BNPL debt, none of which appears on a traditional credit report

Research from the CFPB (2022) found that BNPL users were more likely to be financially fragile: 61% of BNPL users had credit scores below 620 (subprime), and BNPL users were twice as likely to have a delinquency on a traditional credit product.

### 7.4 Merchant Risk

**Refund Processing Risk.** When a consumer returns a product, the merchant issues a refund to the BNPL provider. But the BNPL provider has already settled with the merchant. Timing and communication gaps can lead to disputes.

**Chargebacks.** If a consumer disputes a BNPL-funded transaction with their bank (the card used for installment payments), the chargeback flows back through the BNPL provider to the merchant. The merchant may bear the loss even though the BNPL provider approved the transaction.

**Integration Risk.** Incorrect API integration can lead to double charges, missed captures, or settlement errors.

### 7.5 Known Incidents and Industry Concerns

| Year | Incident | Impact |
|------|----------|--------|
| 2020 | Afterpay breach (Australia) | Unauthorized access to customer data for approximately 8,000 customers. Employee credentials compromised. |
| 2021 | Klarna app glitch (Sweden) | A bug caused some users to see other users' account information after logging in. Klarna took the app offline temporarily. |
| 2022 | CFPB BNPL report | Found that BNPL users were twice as likely to be financially distressed. 61% had subprime credit scores. Report raised debt-stacking concerns. |
| 2022 | Affirm data exposed | Affirm disclosed that a third-party contractor's systems were breached, potentially exposing some customer data. |
| 2023 | UK Citizens Advice study | Found that 1 in 4 BNPL users in the UK had missed a payment. 42% of users said they had used BNPL to buy essentials (food, household items). |
| 2024 | Apple exits BNPL | Apple Pay Later discontinued after 15 months. Highlighted the difficulty of BNPL underwriting. |

**Debt Stacking - The Industry's Biggest Systemic Risk:**

A 2023 study by the Federal Reserve Bank of Philadelphia found that:
- The average BNPL user had 3.3 active BNPL accounts across different providers
- 15% of BNPL users had 5 or more active BNPL obligations
- BNPL users were 20% more likely to have delinquencies on traditional credit products
- Total BNPL debt was often invisible to traditional lenders because most providers did not report to credit bureaus

The industry has begun addressing this. Klarna and Affirm now report to credit bureaus in the US. Some providers have started sharing data through specialty bureaus (like Equifax's BNPL data feed) to give other lenders visibility into BNPL obligations. But the problem is far from solved.

### 7.6 Fraud Prevention Measures

| Measure | How It Works |
|---------|-------------|
| Device fingerprinting | Track device characteristics across sessions to detect new/suspicious devices |
| Behavioral biometrics | Analyze typing patterns, mouse movement, scroll behavior |
| Phone/email intelligence | Cross-reference phone carrier, email age, and associated accounts |
| ML fraud scoring | Real-time model scoring on hundreds of features |
| Velocity checks | Flag consumers making multiple BNPL applications in short windows |
| Address verification | Match shipping address to billing address and known consumer addresses |
| 3DS authentication | Require Strong Customer Authentication on the payment method |
| Network analysis | Graph-based detection of fraud rings sharing devices, addresses, or payment methods |

---

## 8. Regulation and Compliance

### 8.1 The Regulatory Gap

BNPL grew rapidly in part because it fell through regulatory gaps. In most jurisdictions, consumer credit regulations were written for credit cards and traditional loans. Short-term, interest-free installment products like Pay in 4 did not fit neatly into existing frameworks:

- **United States:** The Truth in Lending Act (TILA/Regulation Z) requires disclosures for consumer credit. However, Pay in 4 products with 0% APR and fewer than 4 installments often did not meet the threshold for "credit" under Reg Z. The CFPB has been working since 2022 to close this gap.
- **United Kingdom:** BNPL was explicitly exempt from FCA regulation until 2025-2026. The Woolard Review (2021) identified this gap and recommended bringing BNPL under FCA oversight.
- **Australia:** BNPL was exempt from the National Credit Act because it did not charge interest. The industry self-regulated through the Australian Finance Industry Association (AFIA) Code of Practice.
- **European Union:** The revised Consumer Credit Directive (2023) explicitly includes BNPL as consumer credit, requiring full credit assessments and 14-day withdrawal rights.

### 8.2 United States: CFPB

The Consumer Financial Protection Bureau (CFPB) published a major report on BNPL in September 2022, followed by an interpretive rule in 2024.

Key CFPB findings and actions:
- BNPL should be subject to the same consumer protections as credit cards
- BNPL providers must provide dispute rights (the right to dispute a charge and have it investigated)
- BNPL providers must provide refund protections (right to return and receive credit)
- BNPL providers must provide periodic statements showing outstanding obligations
- Data harvesting practices of BNPL providers raise privacy concerns

The CFPB's approach has faced legal challenges and political headwinds. The regulatory environment remains uncertain as of early 2026.

### 8.3 United Kingdom: FCA

The UK Financial Conduct Authority is implementing BNPL regulation following the Woolard Review:

- BNPL lenders must be authorized by the FCA
- Affordability assessments are required
- Consumers can complain to the Financial Ombudsman Service
- Advertising standards and clear cost disclosures required
- Expected implementation: 2025-2026

### 8.4 European Union: Consumer Credit Directive

The revised EU Consumer Credit Directive (CCD, adopted November 2023) is the most comprehensive BNPL regulation globally:

- BNPL classified as consumer credit regardless of interest rate
- Full creditworthiness assessment required before approval
- 14-day right of withdrawal (consumer can cancel within 14 days without penalty)
- Standard European Consumer Credit Information (SECCI) form required
- All EU member states must transpose into national law

### 8.5 Australia

Australia has the highest BNPL adoption per capita in the world. Regulation has been slow but is progressing:

- BNPL currently exempt from the National Credit Act
- AFIA voluntary code of practice (industry self-regulation)
- Treasury review (2024) recommended bringing BNPL under a modified regulatory framework
- Proposed: affordability tests, hardship provisions, dispute resolution

### 8.6 The "True Lender" Debate

The bank partner model raises a fundamental legal question: who is the "true lender" - the bank that originates the loan, or the BNPL provider that underwrites, funds, and services it?

**Why this matters:** If the bank is the true lender, federal preemption allows the loan to be governed by the bank's home state usury laws (which are typically favorable). If the BNPL provider is the true lender, the loan must comply with the consumer's home state laws, which may have lower interest rate caps, additional disclosure requirements, or licensing requirements.

**OCC "True Lender" Rule (2020).** The Office of the Comptroller of the Currency issued a rule stating that the bank is the "true lender" as long as it is named as the lender in the loan agreement or funds the loan. This rule was designed to protect the bank partner model.

**Congressional Review Act Repeal (2021).** Congress used the Congressional Review Act to repeal the OCC's true lender rule in June 2021, signed by President Biden. This left the legal landscape uncertain - the question of who is the "true lender" is now decided on a case-by-case basis by courts.

**FDIC "Valid When Made" Rule (2020).** The FDIC issued a complementary rule stating that a loan that was valid (non-usurious) when originated by a bank remains valid when transferred or sold to a non-bank entity (like a BNPL provider). This rule was not repealed and provides some protection for the bank partner model.

**Madden v. Midland Funding (2015).** This Second Circuit Court ruling held that when a national bank sells a loan to a non-bank, the non-bank does not inherit the bank's preemption of state usury laws. This ruling (applicable in New York, Connecticut, and Vermont) creates legal risk for the bank partner model in those states. The FDIC's "valid when made" rule was partly designed to counteract Madden, but the legal landscape remains unsettled.

### 8.7 Credit Bureau Reporting

| Provider | Reports to Bureaus | Type | Since |
|----------|-------------------|------|-------|
| Affirm | Yes (TransUnion, Experian) | Positive and negative | 2020 |
| Klarna | Yes (TransUnion - US) | Positive and negative | 2022 |
| Afterpay | No (Pay in 4) | Only reports delinquencies to collections | N/A |
| PayPal Pay in 4 | No | N/A | N/A |
| Zip | Varies by market | Some markets only | Varies |

The lack of universal credit reporting is a significant concern. If BNPL obligations are invisible to credit bureaus, traditional lenders cannot accurately assess a consumer's total debt load.

![Global BNPL regulatory landscape](diagrams/regulatory-landscape.mmd)

---

## 9. Comparisons and Alternatives

### 9.1 BNPL vs. Credit Cards

| Feature | BNPL (Pay in 4) | Credit Card |
|---------|-----------------|-------------|
| **Interest rate** | 0% (Pay in 4) | 0% intro (6-21 months), then 18-30% |
| **Repayment structure** | Fixed 4 payments, auto-debited | Revolving, minimum payment, flexible |
| **Credit check** | Soft pull (no score impact) | Hard pull (impacts score) |
| **Credit limit** | Per-order, $35-$1,500 | Ongoing, $500-$50,000+ |
| **Late fees** | $0-$8 per missed payment | $25-$41 per missed + penalty APR |
| **Rewards** | Generally none | 1-5% cashback, points, miles |
| **Purchase protection** | Limited (varies by provider) | Comprehensive (chargebacks, extended warranty) |
| **Credit building** | Varies (some report, some do not) | Always reported, builds credit history |
| **Merchant cost** | 3-8% MDR | 1.5-3.5% MDR |
| **Risk to consumer** | Fixed, predictable cost | Can spiral (minimum payments, compound interest) |
| **Availability** | No credit history needed (potentially) | Requires credit history and hard pull |

![BNPL vs credit card detailed comparison](diagrams/bnpl-vs-credit-card-comparison.mmd)

### 9.2 BNPL vs. Personal Loans

| Feature | BNPL (Installments) | Personal Loan |
|---------|---------------------|---------------|
| **Approval time** | Seconds | Hours to days |
| **Amount** | $50-$20,000 | $1,000-$100,000 |
| **APR** | 0-36% | 6-36% (bank), 10-36% (fintech) |
| **Duration** | 6 weeks to 60 months | 12 to 84 months |
| **Use case** | Specific purchase at checkout | General purpose, debt consolidation |
| **Relationship** | Merchant-mediated | Direct lender-consumer |
| **Fees** | Late fees only (if any) | Origination fee (0-8%), late fees |

### 9.3 BNPL vs. Layaway

| Feature | BNPL | Layaway |
|---------|------|---------|
| **When you get the product** | Immediately | After final payment |
| **Who bears credit risk** | BNPL provider | Nobody (merchant holds product) |
| **Interest/fees** | 0% interest (Pay in 4), possible late fees | Usually $0 (some charge setup/cancellation fee) |
| **Returns** | Standard return policy | Cancellation fee or full refund |
| **Availability** | Online and in-store | Primarily in-store |
| **Modern examples** | Klarna, Affirm, Afterpay | Walmart Layaway (discontinued 2020) |

### 9.4 BNPL vs. Store Credit Cards

| Feature | BNPL | Store Credit Card |
|---------|------|-------------------|
| **Issuer** | BNPL provider (fintech) | Bank (Synchrony, Comenity, Bread) |
| **APR** | 0% (Pay in 4) or 0-36% (installments) | 25-35% (among the highest APRs) |
| **Deferred interest** | No (BNPL does not use deferred interest) | Yes (common trap: 0% for 12 months, then retroactive interest on full balance) |
| **Usability** | Multiple merchants | Single retailer |
| **Rewards** | Generally none | Store-specific (10-20% off first purchase, points) |
| **Credit reporting** | Varies | Always reported |

### 9.5 Decision Matrix

| Scenario | Best Option |
|----------|-------------|
| Small purchase ($50-$300), want to split payments, no interest | BNPL Pay in 4 |
| Large purchase ($1,000+), want 0% promo financing | BNPL installment (if 0% APR merchant promo) or credit card with 0% intro APR |
| Building credit history | Credit card (always reports to bureaus) |
| Want rewards / cashback | Credit card |
| Cannot qualify for credit card | BNPL (softer approval criteria) |
| Need purchase protection / chargeback rights | Credit card |
| Buying from merchant that only offers BNPL | BNPL |
| Debt consolidation | Personal loan (not BNPL) |
| In-store purchase, no credit card, need flexibility | BNPL virtual card |

![Klarna vs Affirm vs Afterpay comparison](diagrams/klarna-vs-affirm-vs-afterpay.mmd)

---

## 10. Modern Developments

### 10.1 Klarna's AI Transformation

Klarna has aggressively positioned itself as an "AI company" under CEO Sebastian Siemiatkowski:

**AI Customer Service Assistant (2024).** Klarna launched an AI assistant (built on OpenAI's GPT-4) that handles 2/3 of all customer service interactions, replacing approximately 700 full-time equivalent agents. Klarna claims it resolved 2.3 million conversations in its first month, with customer satisfaction scores equivalent to human agents. This reduced Klarna's customer service costs significantly and became a key part of Klarna's profitability story.

**AI Shopping Assistant.** The Klarna app includes an AI shopping assistant that helps users find products, compare prices, and get personalized recommendations.

**Headcount Reduction.** Klarna reduced its workforce from approximately 5,000 employees (peak) to approximately 3,800 (2024), attributing much of the reduction to AI replacing manual work. Siemiatkowski has publicly stated that AI will allow Klarna to operate with a fraction of its former headcount.

### 10.2 Apple Pay Later - Launch and Discontinuation

**March 2023 - Launch.** Apple launched Apple Pay Later, its own BNPL product, built entirely in-house. It offered Pay in 4 (four biweekly payments, 0% interest, no fees) for purchases of $50-$1,000 through Apple Pay. Apple created a subsidiary, Apple Financing LLC, to originate and fund the loans directly - no bank partner needed.

**June 2024 - Discontinued.** Apple killed Apple Pay Later after just 15 months, citing a pivot to a broader installment loan program powered by third-party providers (Affirm and Citi). The likely reasons:

1. **Credit losses were higher than expected.** Running a lending operation was outside Apple's core competency.
2. **Regulatory risk.** Operating as a lender brought compliance obligations Apple did not want.
3. **Partner opportunity.** By integrating Affirm and banks directly into Apple Pay, Apple can offer BNPL without the balance sheet risk.

This was widely seen as validation that BNPL underwriting is harder than it looks, even for a $3 trillion company.

### 10.3 Bank-Owned BNPL

Traditional banks have launched their own BNPL products, recognizing that fintech BNPL was cannibalizing credit card revenue:

| Bank | Product | Details |
|------|---------|---------|
| Chase | My Chase Plan | Convert existing Chase credit card purchases into fixed installments. 0% or low APR. |
| Citi | Citi Flex Pay | Same concept: convert card purchases to installments. |
| American Express | Plan It | Convert Amex purchases to monthly installments. Fixed fee. |
| Capital One | Pay Over Time | Installment option for large purchases. |

These bank products differ from fintech BNPL in a key way: they require the consumer to already have a credit card with the bank. They are a feature added to an existing credit card, not a standalone product. This means they do not reach the underbanked consumers that fintech BNPL targets.

### 10.4 Affirm Card and Debit+

Affirm has launched physical and virtual cards that bring BNPL to every merchant (not just those with Affirm integration):

**Affirm Card (2022).** A physical Visa debit card issued by Evolve Bank & Trust. The consumer makes a purchase with the card, and Affirm offers to split it into installments (Pay in 4 or monthly). If the consumer declines BNPL, the purchase is processed as a standard debit transaction.

**Affirm Debit+ (2023).** A debit card linked to the consumer's bank account. Works like a regular debit card but offers the option to "pay over time" on any purchase.

This is significant because it removes the merchant integration barrier entirely. The consumer can use BNPL at any merchant that accepts Visa, regardless of whether that merchant has an Affirm integration.

### 10.5 Regulatory Tightening

The regulatory landscape is shifting toward treating BNPL like other forms of consumer credit:

- **EU Consumer Credit Directive (2023):** BNPL classified as credit. Full regulation incoming.
- **UK FCA (2025-2026):** BNPL lenders must be FCA-authorized. Affordability checks required.
- **US CFPB:** Interpretive rules treating BNPL like credit cards for consumer protections.
- **Australia:** Moving from self-regulation to government-mandated affordability testing.

The net effect: compliance costs will increase, approval rates may decrease (stricter affordability checks), and smaller BNPL providers may not survive the regulatory burden.

### 10.6 Profitability Pivot

After years of growth-at-all-costs, the BNPL industry is focused on profitability:

- **Klarna:** Achieved first annual profit in 2024 (after 4 years of losses). Reduced credit losses, cut headcount with AI, diversified revenue into ads and subscriptions.
- **Affirm:** Still operating at a loss but narrowing. RLTC (Revenue Less Transaction Costs) margin improving. Focus on high-quality originations over volume.
- **Afterpay/Block:** Integrated deeper into Cash App and Square ecosystem. Block reports Afterpay as contributing positive gross profit.

### 10.7 BNPL in Physical Retail

BNPL originated as an online checkout feature, but providers are aggressively expanding into physical retail:

**Virtual Cards.** Klarna's "Ghost Card" and Affirm's virtual card generate a one-time Visa or Mastercard number linked to an approved BNPL loan. The consumer loads this into Apple Pay or Google Pay and taps to pay at any NFC terminal. The merchant does not need a BNPL integration - they see a standard Visa transaction.

**QR Code Payments.** Some providers offer QR code-based BNPL: the consumer opens the BNPL app, scans a QR code at the register, and the purchase is split into installments.

**Affirm Debit+.** A physical debit card that works everywhere Visa is accepted. After each purchase, the consumer can choose to split it into installments or pay in full. This blurs the line between debit card and BNPL.

**In-Store Integration.** Klarna has partnerships with select brick-and-mortar retailers where BNPL appears as a payment option on the POS terminal, similar to how Apple Pay appears as a tap-to-pay option.

**The Significance.** Physical retail still accounts for approximately 85% of total retail sales. If BNPL can capture even a small fraction of in-store transactions, the TAM (Total Addressable Market) expands dramatically beyond the $400-500 billion online GMV.

### 10.8 BNPL and Gen Z Financial Behavior

BNPL has become embedded in Gen Z's financial behavior in ways that distinguish it from millennial adoption:

**Credit Card Avoidance.** Gen Z is the first generation to grow up hearing "credit card debt is bad" as conventional wisdom. Many actively avoid credit cards. A 2024 Bankrate survey found that 31% of Gen Z adults (18-27) do not have a credit card, compared to 14% of millennials at the same age.

**BNPL as Default.** For many Gen Z consumers, BNPL is not an alternative to credit cards - it is the default way to finance purchases. They encounter BNPL at checkout before they encounter credit card applications.

**Thin Credit Files.** Because BNPL traditionally did not report to credit bureaus, heavy BNPL users may have thin credit files. This creates a paradox: they are actively borrowing but not building credit history. This has implications for future mortgage and auto loan applications.

**Social Commerce Integration.** BNPL is integrated into platforms where Gen Z shops: Instagram Checkout, TikTok Shop, and Shopify-powered storefronts. The friction from product discovery to BNPL-financed purchase is decreasing to just a few taps.

### 10.9 IPO Watch

Klarna filed confidentially for a US IPO in late 2024 and is expected to go public in 2025-2026. The target valuation is reportedly $15-20 billion, a significant recovery from the $6.7 billion low in 2022, but still well below the $45.6 billion peak in 2021.

---

## 11. Appendix

### 11.1 Glossary

| Term | Definition |
|------|-----------|
| **ABS** | Asset-Backed Security. BNPL loans pooled and sold to investors as a security. |
| **Afterpay** | Australian BNPL provider (founded 2014), acquired by Block in 2022. |
| **Affirm** | US BNPL provider (founded 2012) by PayPal co-founder Max Levchin. |
| **AOV** | Average Order Value. BNPL increases AOV by 40-50%. |
| **APR** | Annual Percentage Rate. Pay in 4 products are 0% APR. |
| **BNPL** | Buy Now Pay Later. Short-term, point-of-sale consumer credit. |
| **CFPB** | Consumer Financial Protection Bureau (US regulator). |
| **Charge-off** | When a lender writes off a loan as uncollectable (typically after 120-180 days). |
| **Cross River Bank** | US bank partner for Affirm loan originations. |
| **DPD** | Days Past Due. Measures delinquency (e.g., 30 DPD = 30 days late). |
| **FCA** | Financial Conduct Authority (UK regulator). |
| **Forward Flow** | Agreement where a buyer pre-commits to purchasing a volume of loans. |
| **GMV** | Gross Merchandise Value. Total value of goods sold through BNPL. |
| **Hard Pull** | Credit inquiry that appears on the consumer's credit report and may impact score. |
| **IDaaS** | Identity as a Service. |
| **Klarna** | Swedish BNPL provider (founded 2005), the largest BNPL company globally. |
| **Layaway** | Pre-BNPL installment model where the product is held until fully paid. |
| **MAU** | Monthly Active Users. |
| **MDR** | Merchant Discount Rate. The fee merchants pay to BNPL providers (3-8%). |
| **Net Loss Rate** | Percentage of originations that are ultimately written off as uncollectable. |
| **Pay in 4** | The most common BNPL product: 4 equal biweekly payments, 0% APR. |
| **Rent-a-Charter** | Model where fintechs use a bank partner's charter to originate loans nationwide. |
| **Securitization** | Process of pooling loans and selling them as securities to investors. |
| **Soft Pull** | Credit inquiry that does not appear on the consumer's credit report. |
| **SOFR** | Secured Overnight Financing Rate. Benchmark interest rate (replaced LIBOR). |
| **True Lender** | Legal doctrine determining whether the bank or fintech is the actual lender. |
| **Valid When Made** | FDIC rule stating that a loan's terms remain valid when sold/assigned. |
| **Virtual Card** | One-time-use Visa/MC number generated for BNPL at non-integrated merchants. |
| **Warehouse Line** | Revolving credit facility used by BNPL providers to fund loan originations. |
| **WebBank** | Utah-based bank partner for Klarna and Afterpay loan originations (US). |

### 11.2 All Diagrams

| Diagram | Source | Section | Description |
|---------|--------|---------|-------------|
| Ecosystem Participants | [`diagrams/bnpl-ecosystem-participants.mmd`](diagrams/bnpl-ecosystem-participants.mmd) | 3 | BNPL ecosystem actors and relationships |
| Transaction Flow | [`diagrams/bnpl-transaction-flow.mmd`](diagrams/bnpl-transaction-flow.mmd) | 4 | End-to-end BNPL purchase flow |
| Sarah Buys Sneakers | [`diagrams/sarah-buys-sneakers-klarna.mmd`](diagrams/sarah-buys-sneakers-klarna.mmd) | 4 | Concrete walkthrough with Klarna |
| Underwriting Engine | [`diagrams/underwriting-decision-engine.mmd`](diagrams/underwriting-decision-engine.mmd) | 5 | Real-time credit decision flow |
| Product Types | [`diagrams/bnpl-product-types.mmd`](diagrams/bnpl-product-types.mmd) | 5 | Pay in 4, installments, virtual cards |
| Installment Schedule | [`diagrams/pay-in-4-installment-schedule.mmd`](diagrams/pay-in-4-installment-schedule.mmd) | 5 | Payment timeline and missed payment path |
| Funding Model | [`diagrams/bnpl-funding-model.mmd`](diagrams/bnpl-funding-model.mmd) | 5 | Warehouse lines, ABS, forward flow |
| Merchant Integration | [`diagrams/merchant-integration-flow.mmd`](diagrams/merchant-integration-flow.mmd) | 5 | API integration sequence |
| Revenue and Fee Model | [`diagrams/revenue-and-fee-model.mmd`](diagrams/revenue-and-fee-model.mmd) | 6 | MDR, late fees, unit economics |
| Credit Risk Waterfall | [`diagrams/credit-risk-waterfall.mmd`](diagrams/credit-risk-waterfall.mmd) | 7 | Loss progression from DPD to charge-off |
| BNPL vs Credit Card | [`diagrams/bnpl-vs-credit-card-comparison.mmd`](diagrams/bnpl-vs-credit-card-comparison.mmd) | 9 | Side-by-side comparison |
| Regulatory Landscape | [`diagrams/regulatory-landscape.mmd`](diagrams/regulatory-landscape.mmd) | 8 | Global regulatory approaches |
| Provider Comparison | [`diagrams/klarna-vs-affirm-vs-afterpay.mmd`](diagrams/klarna-vs-affirm-vs-afterpay.mmd) | 9 | Klarna vs Affirm vs Afterpay |

### 11.3 Key Dates and Numbers

| Metric | Value | Source/Note |
|--------|-------|-------------|
| Global BNPL market size (2025) | ~$400-500B annual GMV | Industry estimates |
| BNPL share of global e-commerce | ~5% | Growing at ~15-20% YoY |
| Klarna valuation (peak) | $45.6B (June 2021) | SoftBank-led round |
| Klarna valuation (trough) | $6.7B (July 2022) | 85% decline |
| Affirm IPO price | $49/share (Jan 2021) | Opened at $90.90 |
| Affirm stock low | $8.62 (Jan 2023) | 95% decline from peak |
| Block/Afterpay acquisition | $29B (Jan 2022) | Largest Australian acquisition |
| Average BNPL MDR | 5-6% | vs ~2.5% for credit cards |
| BNPL conversion lift | +20-30% | Merchant-reported |
| BNPL AOV increase | +40-50% | Merchant-reported |
| Klarna AI agent conversations | 2.3M in first month | Replaced ~700 FTE agents |
| Apple Pay Later lifespan | 15 months (Mar 2023 - Jun 2024) | Discontinued |
| US BNPL users (Gen Z + Millennial) | ~75% of BNPL users | CFPB report (2022) |

---

## 12. Key Takeaways

1. **BNPL is merchant-subsidized consumer credit, not free money.** The merchant pays 3-8% MDR because BNPL drives 20-30% higher conversion and 40-50% higher order values. The consumer pays nothing extra if they pay on time. The economics only work because BNPL generates incremental sales.

2. **Underwriting is the moat.** The ability to make a credit decision in under 2 seconds, at checkout, with minimal data, while keeping loss rates below 3% is extremely difficult. Apple tried to build its own BNPL operation and shut it down after 15 months. The underwriting engine (ML models, internal repayment data, fraud detection) is the core competitive advantage.

3. **Funding costs determine profitability.** BNPL providers borrow money (via warehouse lines, ABS, and equity) to fund consumer loans. When interest rates rose from near-zero to 5%+, BNPL margins collapsed. The 2022-2023 valuation crash was primarily a funding-cost story. Profitability returned only after rates stabilized and credit models tightened.

4. **Pay in 4 is deliberately simple, but installment loans are the real lending business.** Pay in 4 (0% APR, 6 weeks) is the consumer-facing brand, but longer-term installment loans (3-60 months, 0-36% APR) generate meaningful interest income. Affirm generates approximately 40% of revenue from interest.

5. **The bank partner model is a regulatory arbitrage.** US BNPL providers originate loans through banks like WebBank and Cross River to leverage the bank's charter and avoid 50-state licensing. This model is legally contested and may not survive future regulatory changes.

6. **Regulation is coming everywhere.** The EU Consumer Credit Directive, UK FCA authorization, US CFPB enforcement, and Australian Treasury review are all moving toward treating BNPL like credit. This will increase compliance costs, require harder affordability checks, and likely reduce approval rates.

7. **Over-indebtedness is the biggest consumer risk.** Because BNPL obligations are often invisible to credit bureaus and to other BNPL providers, consumers can accumulate debt across multiple platforms without any single lender knowing the full picture. This is the core regulatory concern.

8. **The industry has consolidated to three survivors.** Klarna, Affirm, and Afterpay/Block are the dominant players. Apple exited. Dozens of smaller providers went bankrupt or were acquired. The survivors are shifting from growth to profitability, using AI to cut costs, and diversifying revenue beyond MDR.

9. **Virtual cards are removing the merchant integration barrier.** Klarna's Ghost Card and Affirm's virtual card let consumers use BNPL at any merchant that accepts Visa/Mastercard, without the merchant having a BNPL integration. This expands the addressable market dramatically.

10. **BNPL is not replacing credit cards. It is complementing them.** The credit card's advantages (rewards, purchase protection, credit building, high limits, revolving credit) ensure its survival. BNPL serves a specific niche: short-term, interest-free installments for consumers who want predictable, fixed repayment schedules - often consumers who are underserved by or distrustful of traditional credit.
