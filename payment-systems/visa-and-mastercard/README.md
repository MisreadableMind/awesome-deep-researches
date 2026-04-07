# Visa and Mastercard Payment Networks: Complete Technical Deep Dive

---

## Table of Contents

1. [History and Overview](#1-history-and-overview)
2. [The Four-Party (Five-Party) Model](#2-the-four-party-five-party-model)
3. [How a Card Transaction Works Step by Step](#3-how-a-card-transaction-works-step-by-step)
4. [The Authorization Flow in Extreme Detail](#4-the-authorization-flow-in-extreme-detail)
5. [Interchange Fees](#5-interchange-fees)
6. [Card Numbers (PAN -- Primary Account Number)](#6-card-numbers-pan----primary-account-number)
7. [EMV (Chip) Technology](#7-emv-chip-technology)
8. [Contactless Payments (NFC)](#8-contactless-payments-nfc)
9. [Tokenization](#9-tokenization)
10. [E-commerce / Card-Not-Present (CNP)](#10-e-commerce--card-not-present-cnp)
11. [Chargebacks and Disputes](#11-chargebacks-and-disputes)
12. [Network Processing Infrastructure](#12-network-processing-infrastructure)
13. [Revenue Model](#13-revenue-model)
14. [Debit vs Credit vs Prepaid](#14-debit-vs-credit-vs-prepaid)
15. [Security and Fraud Prevention](#15-security-and-fraud-prevention)
16. [Differences Between Visa and Mastercard](#16-differences-between-visa-and-mastercard)
17. [Modern Developments](#17-modern-developments)

---

## 1. History and Overview

### 1.1 Visa: From BankAmericard to Global Payments Network

**1958 -- The Birth of BankAmericard.** Bank of America (BofA) launched the first consumer credit card program in Fresno, California. The initial "Fresno Drop" mailed 60,000 unsolicited credit cards to residents. The card was called BankAmericard.

**1966 -- Licensing Begins.** In response to the formation of Master Charge (a rival consortium), Bank of America began licensing the BankAmericard program to other financial institutions across the United States and internationally. This created a fragmented system of licensee banks, each operating somewhat independently.

**1968 -- Dee Hock Enters.** Dee Hock, a banker from the Pacific Northwest, was brought on to manage the card's expansion. He quickly identified that the licensee program was in severe disarray -- interchange transaction issues between banks were becoming a very serious problem. Chargebacks were piling up, fraud was rampant, and the network was suffering from a lack of centralized governance.

**1970 -- National BankAmericard Inc. (NBI).** Hock proposed a radical idea: spinning off the credit card business into an independent organization owned by a consortium of member banks. This "chaordic" approach (a portmanteau of chaos and order, coined by Hock) allowed for decentralized control while maintaining a unified system. NBI was formed, with Hock as president and CEO. Bank of America relinquished direct control.

**1974 -- International Expansion.** The International Bankcard Company (IBANCO) was founded to manage the international BankAmericard program, coordinating with international licensees like Barclaycard (UK), Carte Bleue (France), Chargex (Canada), and Sumitomo Card (Japan).

**1976 -- The Visa Rebrand.** Dee Hock chose the name "Visa" because he believed it was instantly recognizable in many languages, denoted universal acceptance, and sounded like something that grants passage. All licensees worldwide -- BankAmericard, Barclaycard, Carte Bleue, Chargex, Sumitomo Card -- united under the Visa name, with the distinctive blue, white, and gold flag logo.

**1973-1976 -- Technology Leap.** The electronic authorization system that would become VisaNet was launched in 1973, quickly followed by the industry's first electronic clearing and settlement system. This was transformative -- moving from paper-based "floor limits" and phone authorizations to electronic real-time processing.

**1984 -- Hock Resigns.** Dee Hock resigned and retired to a ranch in Pescadero, California. He died on July 16, 2022, at age 93.

**2006-2008 -- IPO.** On October 11, 2006, Visa announced that some of its businesses would be merged and become a publicly traded company, Visa Inc. Under the restructuring, Visa Canada, Visa International, and Visa USA were merged into the new public company. The IPO took place on March 18, 2008, when Visa sold 406 million shares at $44 per share (above the expected $37-42 range), raising $17.9 billion -- the largest IPO in U.S. history at that time. Member banks received shares in the new company as compensation for relinquishing their association stakes.

**2016 -- Visa Europe Acquisition.** Visa Inc. acquired Visa Europe (which had remained a separate association) for approximately 21.2 billion euros, reunifying the global Visa network under a single corporate entity.

**Current Structure.** Visa Inc. trades on the NYSE under ticker "V." It is a publicly traded corporation with institutional shareholders (Vanguard, BlackRock, etc.) holding the largest positions. It operates as a technology and payments network company, not a bank.

### 1.2 Mastercard: From Interbank Card Association to Global Network

**1966 -- Formation.** Karl H. Hinke, an executive VP at Marine Midland Bank, gathered representatives from several banks in Buffalo, New York. The result was Interbankard, Inc., which became the Interbank Card Association (ICA). Founding members included United California Bank, Wells Fargo, Crocker National Bank, and the Bank of California. By the end of 1967, ICA had 150 member banks.

**1969 -- Master Charge.** ICA unveiled "Master Charge: The Interbank Card," with the now-iconic overlapping orange and yellow (later red and orange) circles logo.

**Late 1970s -- Mastercard Rebrand.** The ICA renamed itself Mastercard International, changing the card name from Master Charge to Mastercard.

**2002 -- Europay Merger and Corporatization.** Mastercard merged with Europay International and converted from a membership association to a private share corporation. This was done to prepare for an initial public offering.

**2006 -- IPO.** In May 2006, Mastercard completed its IPO on the NYSE under ticker "MA" at $39 per share, raising $2.4 billion. (Note: Visa's IPO was larger because it happened later, in 2008.)

**Current Structure.** Mastercard Incorporated is a publicly traded corporation. Like Visa, it operates as a technology and payments network company, not a bank or lender.

### 1.3 Key Distinction: Networks, Not Banks

Both Visa and Mastercard operate as payment networks (sometimes called "card schemes" or "card brands"). They do not:
- Issue cards to consumers (issuers do that)
- Hold deposits or lend money
- Set interest rates on credit cards
- Take credit risk on cardholder defaults
- Have direct relationships with consumers or merchants

They DO:
- Operate the electronic network (rails) that routes transaction messages
- Set the rules and standards for the network
- Establish interchange fee schedules
- Provide brand recognition and acceptance marks
- Offer value-added services (fraud prevention, data analytics, tokenization)
- Facilitate clearing and settlement between member banks

---

## 2. The Four-Party (Five-Party) Model

The card payment ecosystem is commonly described as the "four-party model" (or "four-corner model"), though it actually involves five distinct entities -- plus payment processors who play a critical supporting role.

### 2.1 The Five Core Parties

**Party 1: Cardholder**
The consumer who holds a Visa or Mastercard branded payment card. The cardholder has a contractual relationship with the issuing bank -- they agreed to the card terms, including credit limits, interest rates (for credit), and fees.

**Party 2: Merchant**
The business that accepts card payments for goods or services. The merchant has a contractual relationship with the acquiring bank (acquirer), including a merchant agreement that specifies fees, acceptable card types, chargeback handling, and compliance requirements.

**Party 3: Issuing Bank (Issuer)**
The financial institution that issued the card to the cardholder. Examples: Chase, Citi, Barclays, Capital One, HSBC. The issuer:
- Underwrites the cardholder's credit risk
- Sets credit limits and interest rates
- Decides whether to approve or decline transactions
- Bears the credit loss if the cardholder defaults
- Receives interchange fees from acquirers
- Manages cardholder disputes and chargebacks
- Issues statements and collects payments

**Party 4: Acquiring Bank (Acquirer)**
The financial institution that processes card transactions on behalf of the merchant. Examples: Worldpay (FIS), First Data (Fiserv), Chase Paymentech, Elavon (US Bank). The acquirer:
- Provides the merchant with a merchant account
- Routes authorization requests through the card network
- Settles funds to the merchant's bank account
- Manages the merchant's compliance with network rules
- Assumes some risk of merchant chargebacks and fraud
- Deducts fees (interchange + assessment + markup) before settling

**Party 5: Card Network (Visa or Mastercard)**
The network that connects issuers and acquirers. The network:
- Operates the electronic switch that routes messages between acquirers and issuers
- Sets interchange fee schedules
- Establishes and enforces network rules and standards
- Provides clearing and settlement services
- Offers brand licensing and acceptance marks
- Provides value-added services (fraud scoring, tokenization, analytics)
- Charges assessment/scheme fees for its services

### 2.2 The Role of Payment Processors

In practice, many banks do not build their own transaction processing infrastructure. They outsource this to payment processors, which creates what is sometimes called the "six-party model."

**Acquirer Processors** handle the merchant and acquirer side of the transaction:
- Provide POS terminals and payment gateways
- Format and route authorization requests
- Manage batch settlement files
- Handle technical integration with the card network
- Examples: Worldpay (Fiserv), Adyen, Stripe, Square (Block), First Data (Fiserv)

**Issuer Processors** handle the cardholder and issuing bank side:
- Manage card accounts and transaction records
- Process authorization decisions on behalf of the issuer
- Handle card issuance and lifecycle management
- Run fraud detection and scoring
- Examples: TSYS (Global Payments), FIS, Marqeta, Galileo (SoFi)

**Key Distinctions:**
- The acquirer and the processor can be the same entity, but often are not.
- Companies like Stripe and Adyen act as "payment facilitators" (PayFacs), meaning they are effectively the acquirer for their sub-merchants, simplifying onboarding.
- Some companies are vertically integrated: Adyen, for example, is a licensed acquirer that also processes transactions, provides POS terminals, and offers fraud prevention -- all in one platform.

### 2.3 Money Flow vs. Data Flow

It is critical to understand that data flow and money flow are separate:

**Data Flow (Authorization):** Happens in real-time (1-3 seconds)
```
POS Terminal -> Acquirer Processor -> Card Network -> Issuer Processor -> Issuer Bank
(and the response flows back the same path in reverse)
```

**Money Flow (Settlement):** Happens in batch, typically T+1 or T+2
```
Cardholder's Bank Account -> Issuer -> Card Network (netting) -> Acquirer -> Merchant's Bank Account
```

The merchant does not receive funds at the moment of the transaction. Funds flow later through the clearing and settlement process.

---

## 3. How a Card Transaction Works Step by Step

A single card purchase involves four distinct phases: Authorization, Authentication, Clearing, and Settlement. Each has different timing, participants, and data flows.

### 3.1 Authorization: The 1-3 Second Real-Time Decision

Authorization is the real-time process of checking whether a transaction should be approved.

**Step-by-step flow:**

1. **Card Data Capture.** The cardholder presents their card at a POS terminal (swipe, insert chip, tap, or enters card data online). The terminal reads the card data -- PAN, expiration date, service code, and (for chip/NFC) generates a cryptogram.

2. **Terminal Constructs Authorization Request.** The POS terminal (or e-commerce payment gateway) constructs an ISO 8583 message with Message Type Indicator (MTI) 0100 (authorization request). This message includes the PAN, transaction amount, merchant category code (MCC), terminal ID, entry mode, and cryptographic data (if EMV).

3. **Transmission to Acquirer Processor.** The terminal sends the authorization request to the acquirer processor over a secure connection (typically TLS-encrypted). This may go through a payment gateway if it is an e-commerce transaction.

4. **Acquirer Processor Routes to Card Network.** The acquirer processor identifies the card network from the BIN (first 6-8 digits of the PAN) -- BINs starting with 4 go to Visa, 51-55 or 2221-2720 go to Mastercard. The processor formats the message according to the specific network's specifications and sends it to the network's switch (VisaNet or Mastercard's Banknet).

5. **Card Network Processes the Message.** The network performs several functions:
   - Validates the message format
   - Identifies the issuer from the BIN
   - Runs fraud scoring (e.g., Visa Advanced Authorization scores the transaction in ~1 millisecond)
   - Appends the fraud risk score to the message
   - Routes the message to the issuer (or issuer processor)

6. **Issuer Decision.** The issuer (or issuer processor acting on behalf of the issuer) evaluates the transaction:
   - Checks account status (active, frozen, closed)
   - Verifies available credit limit or account balance (debit)
   - Runs internal fraud models
   - Checks velocity limits (e.g., max transactions per day)
   - Verifies CVV/CVC (for CNP transactions)
   - Validates cryptogram (for EMV chip transactions)
   - Makes approve/decline decision

7. **Authorization Response.** The issuer generates an ISO 8583 response message (MTI 0110) containing:
   - Response code (e.g., "00" = approved, "05" = do not honor, "51" = insufficient funds)
   - Authorization code (a 6-character alphanumeric code if approved)
   - The response travels back: Issuer -> Card Network -> Acquirer Processor -> POS Terminal

8. **Terminal Displays Result.** The POS terminal displays "Approved" or "Declined" to the cardholder and prints/displays a receipt.

**Total elapsed time: typically 1-3 seconds end-to-end.**

### 3.2 Authentication: Proving the Cardholder is Legitimate

Authentication is the process of verifying that the person presenting the card is the legitimate cardholder. This happens in parallel with or before authorization, depending on the channel.

**Card-Present Authentication Methods:**
- **EMV Chip Verification:** The chip generates a unique cryptogram (ARQC) for each transaction, proving the physical card is present and not cloned. The issuer validates this cryptogram.
- **PIN Entry:** The cardholder enters a 4-6 digit PIN at the terminal. The PIN may be verified online (sent encrypted to the issuer) or offline (verified by the chip on the card itself).
- **Signature:** The cardholder signs a receipt (increasingly deprecated; Visa and Mastercard eliminated signature requirements for EMV chip transactions in the US in April 2018).
- **No CVM (Cardholder Verification Method):** For low-value contactless transactions below the CVM limit, no verification is required.

**Card-Not-Present Authentication Methods:**
- **3D Secure (3DS):** See Section 10 for full details on 3DS 1.0 vs 2.0.
- **CVV2/CVC2:** The 3-digit code on the back of the card (4 digits on Amex front) is entered during online checkout.
- **Address Verification Service (AVS):** The cardholder's billing address is matched against the issuer's records.

### 3.3 Clearing: Exchanging Transaction Details

Clearing is the process of exchanging detailed financial transaction information between acquirers and issuers through the card network. It happens after authorization, typically in overnight batch processing.

**How Clearing Works:**

1. **Batch Submission.** At the end of each business day (or multiple times per day), the merchant closes their batch -- a collection of all authorized transactions. The terminal or POS system sends this batch to the acquirer processor.

2. **Clearing File Generation.** The acquirer processor compiles clearing records (one for each transaction) and submits them to the card network. Each clearing record contains:
   - Full transaction details (amount, date, time, MCC)
   - Authorization code from the original approval
   - Merchant identification
   - Acquirer and issuer BIN information
   - Transaction category (card-present, card-not-present, etc.)

3. **Network Processing.** The card network:
   - Receives clearing files from all acquirers
   - Sorts transactions by issuer
   - Calculates applicable interchange fees for each transaction based on its rules (card type, entry mode, merchant category, etc.)
   - Calculates its own scheme/assessment fees
   - Generates clearing files for each issuer, containing all transactions made by that issuer's cardholders
   - Computes net settlement positions for all participants

4. **Issuer Receives Clearing Files.** The issuer processes the clearing records to:
   - Post transactions to cardholders' accounts
   - Generate cardholder statements
   - Initiate the funding for settlement

### 3.4 Settlement: How Money Actually Moves

Settlement is the actual transfer of funds between banks through the card network.

**How Settlement Works:**

1. **Net Position Calculation.** The card network calculates the net settlement position for every participant. Instead of moving money for every individual transaction, the network nets all credits and debits:
   - If Bank A's cardholders spent $10 million at Bank B's merchants, and Bank B's cardholders spent $8 million at Bank A's merchants, the net settlement is only $2 million flowing from Bank A to Bank B (minus interchange and fees).

2. **Settlement Through Settlement Banks.** Settlement occurs through the card network's designated settlement bank(s) or through central bank RTGS (Real-Time Gross Settlement) systems:
   - **Visa** uses settlement banks in various countries (e.g., JPMorgan Chase in the US, typically using central bank systems for major currencies)
   - **Mastercard** similarly uses designated settlement banks
   - Issuers and acquirers maintain settlement accounts with these banks

3. **Fund Movement.**
   - Issuers with net debit positions (their cardholders spent more than was spent at their merchants) transfer funds to the settlement account
   - The network then distributes funds to acquirers with net credit positions
   - Acquirers credit their merchants' accounts (minus the merchant discount rate)

4. **Settlement Timing.**
   - **Domestic transactions:** Typically T+1 (next business day) for USD and EUR
   - **International transactions:** May be T+2 or longer due to currency conversion and cross-border complexities
   - Visa and Mastercard run multiple settlement cycles per day for different currencies and regions

### 3.5 Authorization vs. Settlement: The Critical Distinction

| Aspect | Authorization | Settlement |
|--------|--------------|------------|
| **Timing** | Real-time (1-3 seconds) | Batch (T+1 or T+2) |
| **What happens** | "Can this transaction proceed?" | "Move the money" |
| **Money moves?** | No -- only a hold is placed | Yes -- actual fund transfer |
| **Reversible?** | Yes (void/reversal) | Requires chargeback/refund |
| **Message format** | ISO 8583 MTI 0100/0110 | Clearing files / batch |
| **Who decides** | Issuer (approve/decline) | Network (netting/settlement) |
| **Frequency** | Per transaction | Daily batch |

A common real-world example: when you check into a hotel, they authorize $500 on your card (a "hold"). No money moves yet. When you check out and the final charge is $350, the clearing amount is $350, and only $350 actually settles. The $500 hold is released.

---

## 4. The Authorization Flow in Extreme Detail

### 4.1 Complete Message Path

```
[Cardholder Card]
    -> [POS Terminal / Payment Gateway]
    -> [Acquirer Processor]
    -> [Card Network Switch (VisaNet / Banknet)]
    -> [Issuer Processor]
    -> [Issuer Bank Core System]
    -> [Decision: Approve / Decline]
    -> [Issuer Processor]
    -> [Card Network Switch]
    -> [Acquirer Processor]
    -> [POS Terminal / Payment Gateway]
    -> [Cardholder sees result]
```

### 4.2 Data in the Authorization Request Message (ISO 8583)

The authorization request (MTI 0100 or 0200) contains numerous data elements (DEs). The most critical ones:

| Data Element | Field | Description |
|-------------|-------|-------------|
| DE 2 | Primary Account Number (PAN) | The full card number (13-19 digits) |
| DE 3 | Processing Code | Type of transaction (purchase, cash advance, refund, etc.) -- 6 digits |
| DE 4 | Transaction Amount | The amount in the transaction currency |
| DE 7 | Transmission Date/Time | When the message was sent (MMDDhhmmss) |
| DE 11 | Systems Trace Audit Number (STAN) | Unique 6-digit number assigned by the terminal for each transaction |
| DE 12 | Local Transaction Time | Time at the terminal (hhmmss) |
| DE 13 | Local Transaction Date | Date at the terminal (MMDD) |
| DE 14 | Expiration Date | Card expiry (YYMM) |
| DE 18 | Merchant Category Code (MCC) | 4-digit code indicating the merchant's business type |
| DE 22 | Point of Service Entry Mode | How the card data was entered (chip, swipe, manual, NFC, e-commerce) |
| DE 23 | Card Sequence Number | For cards with multiple instances on the same account |
| DE 25 | Point of Service Condition Code | Transaction conditions (normal, recurring, MOTO, etc.) |
| DE 26 | PIN Data Length | Length of the PIN data block |
| DE 32 | Acquiring Institution ID | BIN of the acquirer |
| DE 35 | Track 2 Data | Magnetic stripe data (or equivalent for chip) |
| DE 37 | Retrieval Reference Number | 12-character reference for tracking |
| DE 38 | Authorization ID Response | The 6-character approval code (in response) |
| DE 39 | Response Code | 2-digit code indicating approval/decline reason (in response) |
| DE 41 | Card Acceptor Terminal ID | Terminal identifier at the merchant |
| DE 42 | Card Acceptor ID Code | Merchant identifier |
| DE 43 | Card Acceptor Name/Location | Merchant name, city, state, country |
| DE 48 | Additional Data (Private) | Network-specific additional data |
| DE 49 | Transaction Currency Code | ISO 4217 currency code |
| DE 52 | PIN Data | Encrypted PIN block |
| DE 54 | Additional Amounts | Balance info, cashback amounts |
| DE 55 | ICC System-Related Data | EMV chip data (including cryptogram, AID, TVR, etc.) -- this is a complex TLV (Tag-Length-Value) field containing multiple EMV tags |

**Key EMV Tags within DE 55:**
- Tag 9F26: Application Cryptogram (ARQC) -- the core chip authentication value
- Tag 9F27: Cryptogram Information Data -- tells you what type of cryptogram was generated
- Tag 9F10: Issuer Application Data
- Tag 9F36: Application Transaction Counter (ATC)
- Tag 9F1A: Terminal Country Code
- Tag 5F2A: Transaction Currency Code
- Tag 9A: Transaction Date
- Tag 9C: Transaction Type
- Tag 9F37: Unpredictable Number -- random number from the terminal used in cryptogram generation

### 4.3 Stand-in Processing (STIP)

When the issuer's systems are unavailable (due to network outage, system maintenance, or timeout), the card network can step in and make authorization decisions on behalf of the issuer. This is called Stand-In Processing (STIP).

**How STIP Works:**

1. The card network sends the authorization request to the issuer.
2. If the issuer does not respond within a defined timeout window (typically 3-5 seconds), or the connection to the issuer is down, the network activates STIP.
3. The network uses pre-established parameters set by the issuer:
   - Maximum transaction amount
   - Maximum number of transactions per day
   - Maximum cumulative daily amount
   - Velocity checks
   - Country/region restrictions
   - MCC restrictions
4. Based on these parameters, the network approves or declines the transaction.
5. The transaction is flagged as a STIP approval for later reconciliation.

**Visa STIP** processes transactions using parameters uploaded by issuers through the Visa Transaction Controls system. Visa can also use its AI-based fraud scoring (VAA) during STIP to help make decisions.

**Mastercard STIP** similarly uses issuer-defined parameters stored in its network. Response code 91 ("Issuer or switch inoperative and STIP not applicable") indicates that STIP was not available or not applicable for the transaction.

### 4.4 Decline Codes and Their Meanings

When a transaction is declined, the issuer returns a 2-digit response code. These are standardized but issuers may use them somewhat differently.

**Common Decline Codes:**

| Code | Meaning | Type |
|------|---------|------|
| 00 | Approved | Approval |
| 01 | Refer to card issuer | Soft decline |
| 02 | Refer to card issuer, special condition | Soft decline |
| 03 | Invalid merchant | Hard decline |
| 04 | Pick up card | Hard decline |
| 05 | Do not honor | Soft/Hard decline (generic) |
| 12 | Invalid transaction | Hard decline |
| 13 | Invalid amount | Hard decline |
| 14 | Invalid card number | Hard decline |
| 41 | Lost card, pick up | Hard decline |
| 43 | Stolen card, pick up | Hard decline |
| 51 | Insufficient funds / over credit limit | Soft decline |
| 54 | Expired card | Hard decline |
| 55 | Incorrect PIN | Soft decline |
| 57 | Transaction not permitted to cardholder | Hard decline |
| 58 | Transaction not permitted to terminal | Hard decline |
| 61 | Exceeds withdrawal amount limit | Soft decline |
| 62 | Restricted card | Hard decline |
| 65 | Exceeds withdrawal frequency limit | Soft decline |
| 75 | Allowable number of PIN tries exceeded | Hard decline |
| 78 | Blocked, first used | Hard decline |
| 91 | Issuer unavailable (STIP not applicable) | Soft decline |
| 96 | System malfunction | Soft decline |

**Soft Declines** are temporary -- the transaction might succeed if retried later or with different conditions (e.g., after the cardholder adds funds, or when the issuer's system comes back online).

**Hard Declines** indicate a permanent issue -- the card is invalid, stolen, or the transaction type is not allowed. Retrying will not help.

---

## 5. Interchange Fees

### 5.1 What They Are and Who Pays Whom

Interchange fees are the largest component of the cost merchants pay to accept card payments. Despite the name, the fees do not go to the card network (Visa/Mastercard) -- they go to the issuing bank.

**The flow:**
```
Merchant pays MDR (Merchant Discount Rate) to Acquirer
    = Interchange Fee (goes to Issuer)
    + Assessment/Scheme Fee (goes to Card Network)
    + Acquirer Markup (retained by Acquirer/Processor)
```

**Example:** A $100 purchase with a Visa Signature credit card in the US:
- Interchange: ~1.65% + $0.10 = $1.75
- Assessment fee: ~0.14% = $0.14
- Acquirer markup: ~0.30% + $0.10 = $0.40
- **Total merchant cost: ~$2.29 (2.29%)**

**Why interchange fees exist:** They compensate the issuing bank for:
- The cost of providing credit (float period, defaults)
- Fraud losses on the card
- Rewards programs (cashback, miles, points)
- Customer service and dispute handling
- Technology infrastructure
- Guaranteed payment to the merchant (the issuer bears the credit risk, not the merchant)

### 5.2 How Rates Are Set

Visa and Mastercard each publish interchange rate schedules that contain hundreds of different rates. The rate for any specific transaction depends on multiple factors:

**Card-Present vs. Card-Not-Present:**
- Card-present (chip insert, tap) transactions have lower interchange because fraud risk is much lower
- Card-not-present (online, phone) transactions have higher interchange due to elevated fraud risk
- Example: Visa CPS Retail (card-present) = 1.51% + $0.10 vs. Visa EIRF (card-not-present) = 2.30% + $0.10

**Card Type:**
- Basic/Classic cards have the lowest interchange
- Rewards cards (Signature, World Elite) have higher interchange because the issuer needs to fund the rewards
- Corporate/commercial cards have different (often higher) rates
- Prepaid cards may have different rates

**Debit vs. Credit:**
- Debit interchange is generally lower than credit interchange
- In the US, regulated debit (banks with >$10B assets, under Durbin Amendment) is capped at $0.21 + 0.05%
- Unregulated debit (smaller banks) typically has interchange of 0.80% - 1.15%

**Merchant Category:**
- Certain categories (supermarkets, gas stations, utilities) qualify for reduced interchange rates
- Charitable organizations may get preferential rates
- High-risk categories may have higher rates

**Transaction Qualifications:**
- Transactions that include full data (AVS, CVV, etc.) qualify for better rates
- Settled within specific timeframes (e.g., same day or next day) qualify for better rates
- Properly formatted messages with all required fields qualify for better rates

### 5.3 Typical Rates by Region

**United States:**
- Credit card interchange: Average ~1.79% (ranges from 1.15% to 2.70%+)
- Regulated debit (Durbin): Capped at $0.21 + 0.05% (~$0.24 average)
- Unregulated debit: ~0.80% - 1.15%
- The US has among the highest interchange rates in the world

**European Union (under Interchange Fee Regulation EU 2015/751):**
- Consumer credit cards: Capped at 0.30% of transaction value
- Consumer debit cards: Capped at 0.20% of transaction value
- Commercial/corporate cards: No cap (can be 1.5%+)
- These caps apply to intra-EEA transactions

**United Kingdom (post-Brexit):**
- Domestic caps mirror EU: 0.30% credit, 0.20% debit
- Cross-border (UK to EU) interchange is uncapped and typically much higher
- In June 2025, the UK Competition Appeal Tribunal ruled that Visa's and Mastercard's default interchange fee structures breach competition law

**Australia:**
- Average weighted interchange: ~0.50% for credit, ~0.20% for debit
- RBA regulates interchange rates

**Canada:**
- Average credit interchange: ~1.40%
- Voluntary commitments by Visa and Mastercard to reduce rates

### 5.4 Assessment Fees (Network Fees / Scheme Fees)

Assessment fees are what Visa and Mastercard charge for using their network. Unlike interchange (which goes to the issuer), assessment fees go to the card network itself.

**Visa Assessment Fees (approximate):**
- Assessment: 0.14% of transaction volume (credit), 0.13% (debit)
- Fixed Acquirer Network Fee (FANF): Monthly fee based on merchant locations and acceptance method -- ranges from $2/month for small merchants to $40,000+/month for large e-commerce merchants
- NABU (Network Acquirer Brand Usage) Fee: $0.0195 per authorization
- Various other per-transaction and per-item fees for specific services

**Mastercard Assessment Fees (approximate):**
- Assessment: 0.11% on transactions below $1,000; 0.13% on credit volume of $1,000+
- Merchant Location Fee (MLF): $1.25 per active merchant location per month
- Network Access and Brand Usage (NABU): ~$0.0195 per authorization
- Digital Commerce Development Fee: $0.01 per e-commerce transaction
- Cross-border fees: Additional assessments of ~0.60% for cross-border transactions

### 5.5 Acquirer Markup

The acquirer/processor adds its own markup on top of interchange and assessments. This is the acquirer's revenue for providing merchant services.

**Pricing Models:**

1. **Interchange-Plus (IC+):** The most transparent model. The merchant pays actual interchange + assessments + a fixed markup (e.g., interchange + 0.30% + $0.10). This is preferred by sophisticated merchants.

2. **Tiered/Bundled:** The processor groups transactions into tiers (qualified, mid-qualified, non-qualified) with different blended rates. Less transparent.

3. **Flat Rate:** A single rate for all transactions (e.g., Stripe's 2.9% + $0.30 for online, Square's 2.6% + $0.10 for in-person). Simple but often more expensive for large-volume merchants.

4. **Subscription/Membership:** A monthly fee for access, with minimal per-transaction markup (e.g., Payment Depot, Stax).

---

## 6. Card Numbers (PAN -- Primary Account Number)

### 6.1 Structure of a Card Number

A payment card number (PAN) is composed of 8 to 19 digits (most commonly 16), structured according to ISO/IEC 7812:

```
[IIN / BIN: 6-8 digits] [Individual Account Number: 6-9 digits] [Check Digit: 1 digit]
```

**Example breakdown of a 16-digit Visa card:**
```
4 5 3 2   0 1 2 3   4 5 6 7   8 9 0 X
|         |                         |
|         |                         +-- Check digit (Luhn)
|         +-- Individual account identifier
+-- IIN/BIN (first 6-8 digits)
```

### 6.2 BIN/IIN (Bank Identification Number / Issuer Identification Number)

The first 6 to 8 digits of the PAN are the Issuer Identification Number (IIN), historically called the Bank Identification Number (BIN). The industry transitioned from 6-digit to 8-digit BINs starting in April 2022, though both formats remain in use.

**The BIN identifies:**
- The card network (first digit = Major Industry Identifier)
- The specific issuing institution
- The card product type (e.g., Visa Signature, Mastercard World Elite)
- The card's country of issuance

### 6.3 Major Industry Identifier (MII) -- First Digit

| First Digit | Card Network |
|-------------|-------------|
| 1 | Airlines (UATP) |
| 2 | Airlines / Mastercard (2221-2720 range) |
| 3 | Travel/Entertainment (American Express: 34, 37; Diners Club: 36, 38) |
| 4 | Visa |
| 5 | Mastercard (51-55) |
| 6 | Discover (6011, 644-649, 65) |
| 7 | Petroleum |
| 8 | Healthcare, Telecommunications |
| 9 | National assignment |

### 6.4 Card Number Ranges

**Visa:**
- Starts with: 4
- Length: 13, 16, or 19 digits (16 is most common)
- Range: 4000 0000 0000 0000 to 4999 9999 9999 9999

**Mastercard:**
- Starts with: 51-55 (traditional range) and 2221-2720 (newer range, introduced 2017)
- Length: 16 digits
- Range: 5100 0000 0000 0000 to 5599 9999 9999 9999 and 2221 0000 0000 0000 to 2720 9999 9999 9999

### 6.5 The Luhn Algorithm (Mod 10 Check)

The last digit of every card number is a check digit calculated using the Luhn algorithm. This is a simple checksum designed to catch accidental transcription errors (digit transposition, single-digit mistakes). It is NOT a security feature -- it does not prevent fraud.

**Algorithm:**

1. Starting from the rightmost digit (the check digit) and moving left, double every second digit.
2. If doubling results in a number greater than 9, subtract 9 (equivalently, sum the digits of the result).
3. Sum all the digits.
4. If the total modulo 10 equals 0, the number is valid.

**Example with card number 4539 1488 0343 6467:**

```
Original:  4  5  3  9  1  4  8  8  0  3  4  3  6  4  6  7
Double:    8  5  6  9  2  4 16  8  0  3  8  3 12  4 12  7
Subtract9: 8  5  6  9  2  4  7  8  0  3  8  3  3  4  3  7
Sum: 8+5+6+9+2+4+7+8+0+3+8+3+3+4+3+7 = 80
80 mod 10 = 0 --> Valid
```

The Luhn algorithm detects almost any single-digit error and most transpositions of adjacent digits. It is primarily a safeguard against typos, not a security mechanism.

---

## 7. EMV (Chip) Technology

### 7.1 What is EMV?

EMV stands for Europay, Mastercard, and Visa -- the three companies that originally developed the specification in 1994. Now managed by EMVCo (owned equally by Visa, Mastercard, JCB, American Express, China UnionPay, and Discover), EMV is the global standard for chip-based payment cards.

### 7.2 How Chip Cards Work vs. Magnetic Stripe

**Magnetic Stripe (Magstripe):**
- Stores static data on three tracks (Track 1 and Track 2 are used for payments)
- Data never changes -- every swipe sends the same information
- Easily cloned: a skimmer can read the stripe and create a duplicate
- No cryptographic authentication
- The data on the stripe includes: PAN, expiration date, service code, and discretionary data

**EMV Chip:**
- Contains a microprocessor (a small computer) embedded in the card
- Generates a unique cryptographic value (cryptogram) for every transaction
- Cannot be cloned: even if the chip data is intercepted, the cryptogram is one-time-use
- Supports multiple applications (credit, debit, loyalty on one chip)
- Stores keys securely in tamper-resistant hardware

### 7.3 The EMV Transaction Flow

**Step 1: Application Selection**

When a chip card is inserted into a terminal, the terminal and card negotiate which application to use. Each application on the card has an Application Identifier (AID).

- **AID Structure:** 5-16 bytes, combining:
  - Registered Application Provider Identifier (RID): 5 bytes, assigned by ISO
  - Proprietary Application Identifier Extension (PIX): 0-11 bytes, defined by the payment brand

- **Common AIDs:**
  - Visa Credit/Debit: A0000000031010
  - Visa Electron: A0000000032010
  - Mastercard: A0000000041010
  - Mastercard Debit (Maestro): A0000000043060
  - American Express: A000000025010

- The terminal reads the card's list of supported applications and matches them against its own supported applications. If multiple matches exist, the cardholder may be asked to choose (e.g., "Credit or Debit?").

**Step 2: Read Application Data**

The terminal reads the card's application data, including:
- Application Interchange Profile (AIP): What the card supports (SDA, DDA, CDA, cardholder verification, etc.)
- Application File Locator (AFL): Where to find the data files on the chip
- Various data records containing: PAN, expiration date, cardholder name, issuer public key certificates, etc.

**Step 3: Offline Data Authentication (ODA)**

ODA verifies the integrity of the card data using public key cryptography (RSA). There are three types:

**Static Data Authentication (SDA):**
- The card contains a digital signature of its static data, created by the issuer using the issuer's private key
- The terminal verifies this signature using the issuer's public key (contained in a certificate chain: CA -> Issuer -> Card)
- Proves data has not been altered since personalization
- Weakness: Does NOT prevent cloning, because the signature is static
- Largely deprecated

**Dynamic Data Authentication (DDA):**
- The card has its own RSA key pair
- For each transaction, the card signs dynamic data (including a random number from the terminal) using its private key
- The terminal verifies the signature using the card's public key
- Proves both data integrity AND that the physical card is present (not a clone)
- More secure but requires the chip to perform RSA operations (slower)

**Combined DDA / Application Cryptogram Generation (CDA):**
- Combines DDA with the generation of the application cryptogram in a single step
- The card signs both the dynamic data and the cryptogram together
- Highest security level
- Prevents the "wedge attack" where a man-in-the-middle modifies the cryptogram between card and terminal

**Step 4: Cardholder Verification Method (CVM)**

The terminal determines how to verify the cardholder's identity using a CVM list stored on the card. The CVM list is a priority-ordered list of verification methods and the conditions under which each should be used.

**EMV supports four CVMs:**

1. **Online PIN:** The cardholder enters a PIN at the terminal, which is encrypted using a public key (from the card or terminal) and sent to the issuer for verification. The PIN is never stored unencrypted on the terminal.

2. **Offline Plaintext PIN:** The PIN is sent to the chip in plaintext for local verification. The chip compares it against the stored PIN. (Less common, less secure.)

3. **Offline Encrypted PIN:** The PIN is encrypted before being sent to the chip. More secure than plaintext.

4. **Signature:** The cardholder signs a receipt. The merchant compares the signature to the back of the card.

5. **No CVM:** Used for low-value transactions (below the CVM limit) or at unattended terminals.

6. **Consumer Device CVM (CDCVM):** Used with mobile devices -- biometric (fingerprint, face) or device passcode.

**Step 5: Terminal Risk Management**

The terminal performs its own risk assessment:
- Floor limit check (is the amount above the terminal's offline threshold?)
- Random online selection (forces some low-value transactions online for spot-checking)
- Velocity checking (how many offline transactions have been performed since last online)

**Step 6: Terminal Action Analysis**

Based on the Terminal Verification Results (TVR) and the card's Issuer Action Codes (IAC) and Terminal Action Codes (TAC), the terminal determines whether to:
- Approve offline (generate TC -- Transaction Certificate)
- Decline offline (generate AAC -- Application Authentication Cryptogram)
- Go online (request ARQC -- Authorization Request Cryptogram)

**Step 7: Cryptogram Generation**

The card generates one of three cryptograms using a symmetric key (3DES or AES) derived from the card's master key:

- **ARQC (Authorization Request Cryptogram):** "Go online" -- the card wants the issuer to make the decision. The ARQC is a MAC (Message Authentication Code) computed over transaction data (amount, date, unpredictable number, ATC, etc.) using the card's unique key. The issuer can verify this cryptogram because it knows the master key.

- **TC (Transaction Certificate):** "Approved offline" -- the card has decided to approve without going online.

- **AAC (Application Authentication Cryptogram):** "Declined offline" -- the card has decided to decline.

**Step 8: Online Authorization (if ARQC generated)**

If the card generates an ARQC, the terminal sends the authorization request online through the normal authorization flow (terminal -> acquirer -> network -> issuer). The issuer:
- Validates the ARQC using its copy of the card's master key
- Makes the authorization decision
- Generates an ARPC (Authorization Response Cryptogram) to send back to the card
- The card verifies the ARPC to confirm the response came from the legitimate issuer

**Step 9: Issuer Script Processing**

After the transaction, the issuer can send commands (scripts) to the card through the response message. These scripts can:
- Update the card's PIN
- Block the card
- Update internal counters
- Change risk parameters
- This is done securely using encrypted/authenticated script commands

### 7.4 Why EMV Dramatically Reduced Fraud

- **Counterfeit fraud dropped by 76% in the US** within the first few years of EMV adoption (2015-2019)
- Each transaction produces a unique cryptogram that cannot be reused
- The chip's private key never leaves the card
- Cloning a chip card requires breaking the encryption, which is computationally infeasible
- However, EMV shifted fraud to card-not-present (online) channels, which increased significantly

---

## 8. Contactless Payments (NFC)

### 8.1 How Tap-to-Pay Works Technically

Contactless payments use Near Field Communication (NFC), a short-range wireless technology operating at 13.56 MHz. The effective range is 1-4 centimeters (about 1.5 inches).

**Technical Flow:**

1. **Field Activation.** The POS terminal's NFC reader emits a radio field. When a contactless card or mobile device enters range, the field powers the card's antenna (for passive cards) or activates the NFC chip (for phones).

2. **Application Selection.** The terminal and card/device negotiate the payment application via the standard EMV application selection process, using the Proximity Payment System Environment (PPSE). The device returns a list of available payment AIDs.

3. **Data Exchange.** The terminal and card exchange data using the EMV Contactless specifications (not the full contact EMV spec -- a streamlined version optimized for speed):
   - Visa uses **Visa payWave** (now just "Visa Contactless")
   - Mastercard uses **Mastercard Contactless** (formerly PayPass)
   - The exchange typically involves 2-4 APDU (Application Protocol Data Unit) commands, compared to 10+ for contact chip

4. **Cryptogram Generation.** Like contact EMV, the card/device generates a unique cryptogram (ARQC) for each transaction.

5. **Authorization.** The authorization flows through the same path as a contact chip transaction.

**Speed:** A contactless transaction typically completes the card-terminal exchange in under 500 milliseconds (half a second), significantly faster than contact chip (which takes 3-5 seconds for card-terminal exchange).

### 8.2 Apple Pay, Google Pay -- Mobile Wallet Architecture

Mobile wallets (Apple Pay, Google Pay, Samsung Pay) add a layer of tokenization and device-level authentication on top of the contactless payment flow.

**Apple Pay Architecture:**

1. **Token Provisioning.** When a user adds a card to Apple Pay:
   - The card number (FPAN) is sent to Apple, which forwards it to the card network's Token Service Provider (Visa VTS or Mastercard MDES)
   - The TSP requests approval from the issuer
   - Upon approval, a Device Account Number (DAN) -- a token -- is generated
   - The DAN is stored in the iPhone's Secure Element (SE) -- a tamper-resistant hardware chip
   - The real card number (FPAN) is NOT stored on the device

2. **Transaction Flow:**
   - The user holds their iPhone near the POS terminal
   - They authenticate with Face ID, Touch ID, or device passcode
   - The Secure Element generates a transaction-specific dynamic security code (cryptogram) using the DAN and a transaction counter
   - The DAN + cryptogram are transmitted via NFC to the terminal
   - The terminal sends to the acquirer, which routes to the card network
   - The network's TSP recognizes the DAN, validates the cryptogram, and maps the DAN back to the real PAN
   - The authorization request is sent to the issuer with the real PAN
   - The issuer approves or declines

3. **Security Model:**
   - Apple uses a **Secure Element** -- a dedicated hardware chip physically isolated from the main processor
   - The SE stores cryptographic keys and performs operations in a tamper-resistant environment
   - Even if the phone is jailbroken or compromised, the SE remains secure
   - Apple does not have access to the payment credentials in the SE

**Google Pay Architecture:**

1. **Token Provisioning.** Similar to Apple Pay, but with a key architectural difference:
   - Google uses **Host Card Emulation (HCE)** -- a software-based approach
   - Tokens and cryptographic data are stored in a cloud-based secure environment (Google's servers) and on the device's Trusted Execution Environment (TEE)
   - Some Android devices with dedicated SE chips may use hardware storage

2. **Transaction Flow:**
   - Similar to Apple Pay but the cryptogram generation uses cloud-based tokens that are periodically refreshed
   - The user authenticates with device unlock (fingerprint, face, PIN, pattern)
   - Limited-use tokens are downloaded in batches for offline capability

3. **Key Difference from Apple Pay:**
   - Apple: Hardware Secure Element (physical chip isolation)
   - Google: Primarily HCE (software emulation) with TEE/cloud support
   - Both generate unique cryptograms per transaction, so security outcomes are comparable

### 8.3 CVM Limits for Contactless

Contactless payments below certain thresholds do not require cardholder verification (no PIN, no signature, no biometric). This is called the CVM limit or contactless floor limit.

**Key CVM Limits by Region:**

| Country | Visa Limit | Mastercard Limit |
|---------|-----------|-----------------|
| United States | No formal limit (merchant discretion) | No formal limit (merchant discretion) |
| United Kingdom | 100 GBP | 100 GBP |
| EU (varies) | 50 EUR (most countries) | 50 EUR (most countries) |
| Canada | 250 CAD | 250 CAD |
| Australia | 200 AUD | 200 AUD |

**Important:** When paying with a mobile device (Apple Pay, Google Pay), there is typically NO CVM limit because the device provides its own authentication (biometric or passcode). The on-device authentication satisfies the CVM requirement regardless of transaction amount.

**Cumulative Limits:** Some countries/issuers implement cumulative limits -- after a certain number of consecutive no-CVM transactions or a cumulative spend amount, the card will require PIN verification on the next transaction. In the EU, SCA (Strong Customer Authentication) under PSD2 requires PIN entry after 5 consecutive contactless transactions or 150 EUR cumulative contactless spend.

---

## 9. Tokenization

### 9.1 What Tokens Are and Why They Exist

A payment token is a surrogate value that replaces the Primary Account Number (PAN) in the payment ecosystem. The token:
- Looks like a card number (same format, passes Luhn check)
- Is restricted to a specific domain (a particular device, merchant, or channel)
- Cannot be used outside its designated context
- Can be mapped back to the real PAN only by the Token Service Provider (TSP)

**Why tokenization exists:**
- Eliminates the need for merchants to store real card numbers
- Reduces the impact of data breaches (stolen tokens are useless outside their domain)
- Enables secure mobile payments (the real PAN never touches the device)
- Improves authorization rates (tokens are updated automatically when cards are reissued)
- Reduces PCI DSS compliance scope for merchants

### 9.2 Token Service Providers (TSPs)

The card networks operate their own TSPs:
- **Visa Token Service (VTS)**
- **Mastercard Digital Enablement Service (MDES)**

These are the authoritative services that:
- Generate and manage tokens
- Maintain the token-to-PAN mapping (the "token vault")
- Validate cryptograms associated with tokens
- Perform domain restriction enforcement
- Handle token lifecycle management (creation, suspension, deletion, update)

### 9.3 Types of Tokens

**Device Tokens (Payment Tokens):**
- Used by mobile wallets (Apple Pay, Google Pay, Samsung Pay)
- Bound to a specific device's Secure Element or HCE instance
- Called Device Primary Account Number (DPAN) or Device Account Number (DAN)
- Each device gets its own unique token, even for the same underlying card
- If the device is lost/stolen, the device token can be suspended without affecting the physical card or tokens on other devices

**Merchant Tokens (Card-on-File Tokens):**
- Used by e-commerce merchants who store cards for recurring payments or one-click checkout
- Bound to a specific merchant
- The merchant stores the token instead of the real PAN
- If the merchant is breached, the stolen tokens cannot be used at other merchants
- When the underlying card is replaced (expiry, reissue), the token is automatically updated in the token vault -- the merchant does not need to ask the cardholder for new card details (this is called "lifecycle management" and significantly reduces payment failures for recurring billing)

**E-commerce Tokens:**
- Used for online transactions
- May be combined with 3D Secure for authentication
- Restricted to the e-commerce domain

### 9.4 How VTS and MDES Work

**Visa Token Service (VTS) Provisioning Flow:**

1. A Token Requestor (TR) -- such as Apple Pay, Google Pay, or a merchant -- initiates a token request through the VTS API
2. The TR provides the FPAN (real card number), along with identification of who is requesting and for what domain
3. VTS contacts the issuer for approval (via a "Token Activation Request" or through the issuer's token management system)
4. The issuer evaluates the request (using risk signals, cardholder identity verification, etc.) and responds with approve, decline, or "additional authentication required"
5. If additional authentication is required, the cardholder may need to verify via SMS OTP, email, in-app push, or a call to the bank
6. Upon approval, VTS generates a token and stores the token-to-PAN mapping in the token vault
7. VTS returns the token, along with a token expiry date and token cryptographic keys, to the Token Requestor
8. For each subsequent transaction, the TR generates a transaction-specific cryptogram using the token's keys

**Mastercard Digital Enablement Service (MDES) Flow:**
- Architecturally similar to VTS
- MDES is described as a "data interchange platform for generating and managing secure digital payment tokens"
- It supports multiple channels: mobile NFC, in-app, e-commerce, IoT
- MDES integrates with issuer systems via APIs and supports both push provisioning (issuer-initiated) and pull provisioning (consumer-initiated)

**Token Transaction Processing:**

When a tokenized transaction arrives at the card network:
1. The network identifies it as a token (tokens have their own BIN ranges)
2. The TSP looks up the token in the vault and retrieves the real PAN
3. The TSP validates the domain restriction (is this token being used by the correct device/merchant?)
4. The TSP validates the transaction-specific cryptogram
5. If all checks pass, the network detokenizes the message -- replacing the token with the real PAN -- and forwards the authorization request to the issuer
6. The issuer sees the real PAN and processes the transaction normally
7. The response flows back through the network, which re-tokenizes the PAN before sending the response to the acquirer

### 9.5 Token Benefits -- Data

- Visa reports that tokenized transactions see a 2-4% improvement in authorization rates compared to non-tokenized transactions
- Tokenized transactions have fraud rates up to 26% lower than non-tokenized transactions
- When a card is reissued, the token vault is automatically updated -- merchants using tokens do not need to request new credentials, dramatically reducing payment failure for subscriptions and recurring billing

---

## 10. E-commerce / Card-Not-Present (CNP)

### 10.1 How Online Transactions Differ

In a card-not-present transaction, there is no physical card, no chip, and no NFC communication. This fundamentally changes the security model:

- **No chip cryptogram:** The dynamic, hardware-generated authentication that EMV provides is absent
- **Higher fraud risk:** CNP fraud is 2-3x higher than card-present fraud
- **Different data requirements:** Merchants must collect and transmit additional data: billing address, CVV2/CVC2, device fingerprint, IP address
- **Different interchange rates:** CNP transactions generally qualify for higher interchange rates
- **Different liability rules:** Without 3DS authentication, the merchant bears fraud liability

**CNP Transaction Flow:**

1. Cardholder enters card data on merchant website/app (PAN, expiry, CVV2, billing address)
2. Merchant's payment gateway encrypts and sends the data to the acquirer processor
3. Acquirer processor formats and sends an authorization request to the card network
4. The authorization request includes: PAN, expiry, CVV2, AVS data, e-commerce indicator (ECI), MCC, terminal type indicator (set to "e-commerce")
5. Card network routes to issuer
6. Issuer validates CVV2, checks AVS match, runs fraud scoring, and approves/declines
7. Response flows back to merchant

### 10.2 3D Secure (3DS) -- Versions 1.0 vs 2.0

3D Secure is an authentication protocol designed to add a layer of cardholder verification for CNP transactions. "3D" refers to the three domains involved: Issuer Domain, Acquirer Domain, and Interoperability Domain (the card network).

**Brand Names:**
- Visa: "Visa Secure" (formerly "Verified by Visa")
- Mastercard: "Mastercard Identity Check" (formerly "Mastercard SecureCode")

**3D Secure 1.0 (3DS1) -- The Old Way:**

1. Cardholder enters card data on merchant site
2. Merchant sends a Verification Enrollment Request (VEReq) to the Visa/Mastercard directory server
3. Directory server checks if the card is enrolled in 3DS
4. If enrolled, the cardholder is redirected to the issuer's Access Control Server (ACS) via a pop-up or iframe
5. The ACS prompts the cardholder for a static password, OTP, or other credential
6. Upon successful authentication, the ACS returns a Payment Authentication Response (PARes) with an authentication value
7. The authentication value is included in the authorization request

**Problems with 3DS 1.0:**
- Pop-up redirects confused and alarmed consumers
- Static passwords were easily forgotten (leading to abandoned carts)
- Very limited data exchange -- issuer had little context for risk assessment
- No mobile optimization -- the experience was terrible on smartphones
- Cart abandonment rates increased by up to 20% due to the clunky experience
- 3DS 1.0 has been largely phased out (Visa and Mastercard stopped supporting it in October 2022)

**3D Secure 2.0 (3DS2) -- The Modern Approach:**

1. Merchant collects card data AND rich contextual data (130+ data elements), including:
   - Device fingerprint (browser type, screen resolution, timezone, language)
   - Cardholder's account history with the merchant
   - Shipping address
   - Transaction history
   - IP address and geolocation
   - Browser/app metadata

2. This data is sent to the issuer's ACS via the 3DS Server and Directory Server

3. **Risk-Based Authentication (RBA):** The issuer's ACS analyzes all the data and makes a risk decision:
   - **Frictionless Flow:** If the transaction is deemed low-risk, the authentication completes silently in the background. The cardholder sees nothing -- the payment just proceeds. This is the key innovation of 3DS2.
   - **Challenge Flow:** If the transaction is deemed higher-risk, the cardholder is prompted for additional verification (OTP via SMS/email, biometric via banking app, push notification). Crucially, this happens within the merchant's checkout flow (using an embedded iframe or SDK), NOT a redirect to a separate page.

4. The authentication result (success, failure, attempt) is included in the authorization request as an ECI (Electronic Commerce Indicator) value and a CAVV (Cardholder Authentication Verification Value)

**3DS2 Key Metrics:**
- Frictionless authentication rate: 70-95% of transactions (depending on market and issuer)
- Conversion improvement: 5-10% reduction in cart abandonment vs. 3DS1
- Fraud reduction: Issuers report significant fraud reduction due to better risk assessment

### 10.3 Fraud Liability Shift

The liability shift is a key concept in card payments. It determines who bears the financial responsibility when a fraudulent transaction occurs.

**Without 3DS (no authentication):**
- The **merchant** bears full liability for CNP fraud
- If a cardholder disputes a fraudulent online purchase, the merchant loses the chargeback

**With 3DS (successful authentication):**
- The **issuer** bears liability for CNP fraud
- If a cardholder disputes a transaction that was authenticated via 3DS, the issuer absorbs the loss
- This is the "liability shift" -- it shifts fraud risk from merchant to issuer

**Important limitations:**
- The liability shift only applies to fraud-related chargebacks (reason code: unauthorized transaction)
- It does NOT protect against "friendly fraud" (cardholder received goods but disputes anyway) or service-related disputes (item not received, item not as described)
- Friendly fraud accounts for over 80% of chargebacks and continues to rise

---

## 11. Chargebacks and Disputes

### 11.1 The Chargeback Process Step by Step

A chargeback is a forced reversal of a card transaction, initiated by the cardholder through their issuing bank. It is a consumer protection mechanism.

**Step 1: Cardholder Dispute Initiation**
- The cardholder contacts their issuing bank to dispute a transaction
- Common reasons: fraud (unauthorized charge), goods not received, goods not as described, duplicate charge, subscription not canceled
- Time limit: Cardholders typically have 120 days from the transaction date (or expected delivery date) to file a dispute

**Step 2: Issuer Evaluation**
- The issuer evaluates the dispute claim
- May attempt to resolve directly if the details are clearly invalid
- May credit the cardholder's account provisionally (temporary credit while the dispute is investigated)

**Step 3: Chargeback Filed**
- The issuer files a formal chargeback through the card network's dispute system
- A chargeback reason code is assigned
- The disputed funds are debited from the acquirer's settlement account

**Step 4: Acquirer Notification**
- The acquirer receives the chargeback and notifies the merchant
- The merchant's account is debited for the disputed amount plus a chargeback fee ($15-$100+ depending on the acquirer)

**Step 5: Merchant Response (Representment)**
- The merchant has 30 calendar days (acquirers often require responses by day 20-25) to respond
- The merchant can:
  - Accept the chargeback (do nothing or formally accept liability)
  - Fight the chargeback through "representment"

**Step 6: Representment**
- The merchant compiles a "compelling evidence" package:
  - A rebuttal letter summarizing why the chargeback is invalid
  - Transaction records (receipts, order confirmation, authorization logs)
  - Proof of delivery (tracking numbers, delivery confirmation, signed receipts)
  - Communication history with the cardholder
  - IP address and device data for online transactions
  - Terms and conditions the cardholder agreed to
  - AVS/CVV match records
  - 3DS authentication results
- The evidence package is submitted to the acquirer, who forwards it to the issuer through the card network

**Step 7: Issuer Re-evaluation**
- The issuer reviews the merchant's evidence
- If the evidence is compelling, the issuer reverses the chargeback (the merchant wins)
- If the evidence is insufficient, the chargeback stands

**Step 8: Pre-Arbitration (if applicable)**
- If either party disagrees with the outcome, a second cycle may occur (pre-arbitration for Mastercard, pre-compliance for Visa)
- Additional evidence can be submitted

**Step 9: Arbitration (Final Step)**
- If the dispute remains unresolved, either party can escalate to the card network for arbitration
- The card network (Visa or Mastercard) acts as the final arbiter
- An arbitration fee applies: $500 for Visa, $150-$500 for Mastercard (the losing party pays)
- The network reviews all evidence and makes a final, binding decision

### 11.2 Reason Codes

**Visa Chargeback Reason Codes (post-April 2018 Visa Claims Resolution):**

| Category | Code Range | Examples |
|----------|-----------|----------|
| Fraud | 10.x | 10.1: EMV Liability Shift Counterfeit, 10.2: EMV Liability Shift Non-Counterfeit, 10.3: Other Fraud (Card-Present), 10.4: Other Fraud (Card-Not-Present), 10.5: Visa Fraud Monitoring Program |
| Authorization | 11.x | 11.1: Card Recovery Bulletin, 11.2: Declined Authorization, 11.3: No Authorization |
| Processing Errors | 12.x | 12.1: Late Presentment, 12.2: Incorrect Transaction Code, 12.3: Incorrect Currency, 12.4: Incorrect Account Number, 12.5: Incorrect Amount, 12.6: Duplicate Processing, 12.7: Invalid Data |
| Customer Disputes | 13.x | 13.1: Merchandise/Services Not Received, 13.2: Cancelled Recurring Transaction, 13.3: Not as Described, 13.4: Counterfeit Merchandise, 13.5: Misrepresentation, 13.6: Credit Not Processed, 13.7: Cancelled Merchandise/Services, 13.8: Original Credit Transaction Not Accepted, 13.9: Non-Receipt of Cash |

**Mastercard Chargeback Reason Codes (4-digit, beginning with 48):**

| Code | Description |
|------|-------------|
| 4808 | Authorization-Related Chargeback |
| 4831 | Transaction Amount Differs |
| 4834 | Point-of-Interaction Error |
| 4837 | No Cardholder Authorization |
| 4840 | Fraudulent Processing of Transactions |
| 4841 | Cancelled Recurring Transaction |
| 4842 | Late Presentment |
| 4846 | Correct Transaction Currency Code Not Provided |
| 4849 | Questionable Merchant Activity |
| 4853 | Cardholder Dispute (catch-all) |
| 4854 | Cardholder Dispute -- Not Elsewhere Classified |
| 4855 | Goods or Services Not Provided |
| 4859 | Services Not Rendered |
| 4860 | Credit Not Processed |
| 4863 | Cardholder Does Not Recognize -- Potential Fraud |
| 4870 | Chip Liability Shift |
| 4871 | Chip/PIN Liability Shift |

### 11.3 Evidence Requirements for Representment

**Visa:** Maximum evidence package size of 2 MB, in PDF or JPEG format.
**Mastercard:** Maximum evidence package size of 10 MB, in PDF or JPEG format.

### 11.4 Visa Resolve Online (VROL)

VROL is Visa's end-to-end dispute processing platform. All Visa chargeback documentation and communications must pass through VROL.

**Key Capabilities:**
- Retrieves transaction information online
- Exchanges financial information related to disputes
- Allows electronic exchange of documentation
- Automated liability assignment for approximately 80% of disputes
- Dynamic questionnaires to guide issuers through the dispute process
- Accessible via User Interface or APIs
- Available to all issuers, issuer processors, acquirers, and acquirer processors

**Visa also offers complementary dispute prevention tools:**
- **Verifi Order Insight (formerly CDRN -- Cardholder Dispute Resolution Network):** Provides issuers with transaction details (order info, shipping info, digital receipts) before a chargeback is filed, allowing many disputes to be resolved at the inquiry stage
- **Verifi Rapid Dispute Resolution (RDR):** Allows merchants to set rules for automatic refunds on certain dispute types, preventing them from becoming formal chargebacks

### 11.5 Mastercard Mastercom

Mastercom is Mastercard's centralized dispute management platform, available on Mastercard Connect.

**Key Capabilities:**
- End-to-end dispute management throughout the complete lifecycle
- All events for a dispute tracked within a single claim
- Facilitates communication and collaboration between issuers and acquirers
- Streamlines exchange of information and documentation
- Available via UI on Mastercard Connect or via APIs

**Mastercard's Dispute Resolution Initiative (MDRI):**
- Streamlined the chargeback process
- Reduced timeframes (45 days for the full cycle for most reason codes)
- Added automated decisions based on data
- Reduced the number of reason codes
- Introduced Collaboration (allowing issuers and acquirers to communicate before filing chargebacks)

**Mastercard Arbitration Process:**
1. Issuer submits case to Mastercard's Dispute Resolution Management (DRM) team with all evidence
2. Acquirer may: Accept financial liability, reject with rebuttal (within 15 days), or take no action
3. If no action in 10 calendar days, Mastercard proceeds to ruling
4. Mastercard examines evidence and makes a final, binding decision
5. Losing party pays the arbitration filing fee

---

## 12. Network Processing Infrastructure

### 12.1 VisaNet -- Visa's Network

VisaNet is one of the world's largest and most sophisticated electronic payment networks.

**Architecture:**
- Seven independent data centers worldwide (primary locations in Ashburn, Virginia; Denver, Colorado; London, UK; Singapore)
- Full redundancy across all data centers -- any single data center can handle the entire global transaction load
- 99.9999% uptime (also expressed as "six nines") -- this translates to less than 31.5 seconds of downtime per year

**Processing Capacity:**
- Can process up to 83,000 transaction messages per second
- Processes 322+ billion transactions annually
- Enables more than $16 trillion in payments volume per year
- Average authorization response time: ~130-200 milliseconds end-to-end

**Physical Security (Ashburn Data Center):**
- 18-inch thick concrete walls rated to withstand 170 mph winds
- 24-inch thick roof spanning 8.5 acres, designed to support 20+ feet of snow
- Only 75 of Visa's employees worldwide are cleared to enter the secure data halls
- Biometric access controls, 24/7 security monitoring

**Technology Stack:**
- Migrated from traditional mainframe-based processing to an IP-based network
- Uses a combination of custom hardware and commodity servers
- Advanced caching, load balancing, and message queuing
- Real-time fraud scoring (AI/ML) integrated directly into the authorization path

### 12.2 Mastercard's Banknet

Mastercard's global network is called Banknet.

**Key Facts:**
- Primary data center in O'Fallon, Missouri ($160 million campus)
- Disaster recovery site approximately 300 miles from the primary center
- Peak processing capacity: ~20,000 transactions per second
- Processes 400+ million transactions per day
- Average network response time: ~130 milliseconds

**Infrastructure Details:**
- Two IBM mainframes (historically; likely modernized since)
- 200+ Cisco switches and routers
- ~150 servers (mix of platforms)
- 13 EMC storage systems with 200+ TB capacity (historical figures; significantly expanded)
- SONET rings and multiple OC-12 links for network redundancy
- AT&T as primary carrier, operating a global VPN with approximately 20 full-time AT&T employees dedicated to Mastercard
- Data mirroring for Tier-1 applications via Oracle database software and EMC storage

**Disaster Recovery:**
- Mastercard maintains its own disaster recovery site (not outsourced)
- Continuous data mirroring for critical card-processing applications
- Post-9/11, DR site location was chosen to be at least 300 miles from the primary center

### 12.3 ISO 8583 Message Format

ISO 8583 is the international standard for financial transaction card-originated messages. It is the lingua franca of card payments -- virtually all card transactions use ISO 8583 at some point in the communication chain.

**Message Structure:**

Every ISO 8583 message consists of three components:

**1. Message Type Indicator (MTI) -- 4 digits:**

Each digit has a specific meaning:
- **Position 1 (Version):** 0 = ISO 8583:1987, 1 = ISO 8583:1993, 2 = ISO 8583:2003
- **Position 2 (Message Class):** 1 = Authorization, 2 = Financial, 3 = File Actions, 4 = Reversal, 5 = Reconciliation, 6 = Administrative, 8 = Network Management
- **Position 3 (Message Function):** 0 = Request, 1 = Response, 2 = Advice, 3 = Advice Response
- **Position 4 (Message Origin):** 0 = Acquirer, 1 = Acquirer Repeat, 2 = Issuer, 3 = Issuer Repeat, 4 = Other, 5 = Other Repeat

**Common MTIs:**
| MTI | Description |
|-----|-------------|
| 0100 | Authorization Request |
| 0110 | Authorization Response |
| 0200 | Financial Transaction Request |
| 0210 | Financial Transaction Response |
| 0220 | Financial Transaction Advice |
| 0230 | Financial Transaction Advice Response |
| 0400 | Reversal Request |
| 0410 | Reversal Response |
| 0420 | Reversal Advice |
| 0430 | Reversal Advice Response |
| 0800 | Network Management Request |
| 0810 | Network Management Response |

**2. Bitmap -- 8 or 16 bytes (64 or 128 bits):**

The bitmap acts like a table of contents, indicating which data elements are present in the message. Each bit corresponds to a data element:
- Bit 1: Secondary bitmap present (if set, another 64 bits follow for elements 65-128)
- Bit 2: Primary Account Number (PAN) present
- Bit 3: Processing Code present
- Bit 4: Transaction Amount present
- ...and so on

This design saves bandwidth -- only the fields that are relevant for a particular transaction need to be included.

**3. Data Elements -- Variable:**

Up to 128 data elements in the original standard (192 in later versions). Elements can be:
- **Fixed length:** Always the same size (e.g., Processing Code is always 6 digits)
- **Variable length:** Prefixed with a length indicator
  - LLVAR: 2-digit length prefix (max 99 characters)
  - LLLVAR: 3-digit length prefix (max 999 characters)

**Visa and Mastercard Customization:**
Both Visa and Mastercard use ISO 8583 as a base but have their own proprietary extensions:
- **Visa:** Uses Visa's Base I / Base II specifications
- **Mastercard:** Uses Mastercard's authorization and clearing specifications
These extensions define additional private-use data elements (DE 48, DE 60-63 are commonly used for private data) and specific formatting requirements.

**Modern Developments:**
ISO 20022 is an emerging standard that uses XML/JSON instead of the binary format of ISO 8583. While ISO 20022 is being adopted for other payment types (wire transfers, real-time payments), ISO 8583 remains the dominant standard for card transactions due to its efficiency and massive installed base.

---

## 13. Revenue Model

### 13.1 How Visa and Mastercard Make Money (They Are NOT Banks)

This is one of the most commonly misunderstood aspects of the payment industry. Visa and Mastercard:
- Do NOT lend money
- Do NOT issue cards
- Do NOT take deposits
- Do NOT bear credit risk (if a cardholder defaults, the issuing bank absorbs the loss)
- Do NOT set interest rates
- Do NOT receive interchange fees (those go to issuers)

They operate as technology companies that run the payment network (the "rails") and charge fees for access to and use of that network.

### 13.2 Revenue Streams

**Visa Revenue Breakdown (FY 2025 -- $40.0 billion total net revenue):**

| Revenue Stream | Amount | % of Total | Description |
|---------------|--------|-----------|-------------|
| Data Processing | $20.0B | 35.9% | Per-transaction fees for authorization, clearing, and settlement processing |
| Service Revenue | $17.5B | 31.4% | Fees based on total payment volume flowing through the network |
| International Transaction | $14.2B | 25.5% | Cross-border transaction fees and currency conversion |
| Other Revenue (Value-Added Services) | $4.1B | 7.3% | Fraud prevention, tokenization, analytics, consulting, identity verification |
| Less: Client Incentives | ~$15.7B | N/A | Rebates to issuers and acquirers (deducted from gross revenue) |

**Mastercard Revenue Breakdown (FY 2025 -- $32.8 billion total net revenue):**

Similar structure to Visa:
- Payment network fees (domestic assessments, cross-border, transaction processing)
- Value-added services and solutions (growing rapidly -- includes cyber/intelligence, data/analytics, consulting, loyalty)
- Client incentives deducted from gross revenue

### 13.3 How the Fee Structure Works

**Per-Transaction Fees (Data Processing Revenue):**
- Visa charges ~$0.07 + 0.11% per transaction for authorization processing
- Additional fees for clearing and settlement processing
- Fees vary by region, transaction type, and volume tier

**Volume-Based Fees (Service Revenue):**
- Assessment fees based on total payment volume: ~0.11-0.14% of volume
- Higher rates for international and premium card transactions

**Cross-Border Fees (International Transaction Revenue):**
- Applied when the issuer and acquirer are in different countries
- Typically ~0.60-1.00% of the transaction value
- Higher than domestic fees due to currency conversion complexity, cross-border risk, and regulatory compliance
- This is a high-margin revenue stream for both networks

**Value-Added Services (Other Revenue -- Fastest Growing):**
- Fraud prevention tools (Visa Advanced Authorization, Mastercard Decision Intelligence)
- Tokenization services (VTS, MDES)
- Data analytics and insights
- Consulting and advisory services
- Identity verification and authentication
- Loyalty and rewards platform services

### 13.4 Client Incentives

Both networks pay significant "client incentives" -- essentially rebates -- to large issuers and acquirers to encourage them to:
- Issue more Visa/Mastercard branded cards
- Route more volume through the network
- Adopt value-added services

These incentives are deducted from gross revenue to arrive at net revenue. Visa's client incentives in FY 2025 were approximately $15.7 billion (roughly 28% of gross revenue). This highlights the competitive dynamics between Visa and Mastercard -- they compete aggressively for issuer relationships.

### 13.5 The Brilliant Business Model

The Visa/Mastercard model is often described as one of the best business models in the world because:
- **No credit risk:** They do not lend money, so they have no loan losses
- **Network effects:** More cardholders attract more merchants, and more merchants attract more cardholders (virtuous cycle)
- **Operating leverage:** The marginal cost of processing an additional transaction is near zero
- **Pricing power:** They set the fee schedules that govern the entire ecosystem
- **Recession resilience:** Even in downturns, people still need to buy things -- spending shifts from discretionary to essential, but the network still processes transactions
- **Secular tailwind:** The ongoing shift from cash to digital payments provides organic volume growth
- **High margins:** Visa has operating margins of ~65%, among the highest of any public company

---

## 14. Debit vs Credit vs Prepaid

### 14.1 Fundamental Differences

| Aspect | Credit Card | Debit Card | Prepaid Card |
|--------|------------|------------|-------------|
| Funding Source | Line of credit from issuer | Cardholder's bank account (checking/savings) | Pre-loaded funds |
| Credit Risk | Issuer bears risk of default | Minimal (direct debit from account) | None (funds already loaded) |
| Interest | Charged on unpaid balances | None (spending own money) | None |
| Interchange | Highest (1.5-2.5%+ in US) | Lower (regulated: $0.21+0.05%) | Varies by program |
| Consumer Protection | Strong (Fair Credit Billing Act) | Moderate (Electronic Fund Transfer Act) | Varies |
| Rewards | Common (funded by interchange) | Less common | Rare |

### 14.2 Dual-Message vs. Single-Message Processing

This is a critical technical distinction in how debit transactions are processed:

**Dual-Message (Signature Debit / "Offline Debit"):**
- Two separate messages: first an authorization message, then later a clearing/settlement message
- The authorization places a hold on funds; settlement moves the money (typically next day)
- Cardholder does NOT enter a PIN -- they may sign (or no CVM for small amounts)
- Routed through Visa or Mastercard's main network (same rails as credit cards)
- Interchange is percentage-based (similar structure to credit, though rates may differ)
- "Offline" does NOT mean the terminal is offline -- it means the PIN network is not used

**Single-Message (PIN Debit / "Online Debit"):**
- A single message handles both authorization AND clearing/settlement simultaneously
- Funds are immediately debited from the cardholder's account (real-time)
- Cardholder enters a PIN at the terminal
- Routed through PIN debit networks (not the main credit card rails)
- Interchange often has a higher fixed fee but lower percentage (e.g., $0.21 + 0.05% for regulated)
- "Online" means the transaction goes through the debit network for real-time authorization and settlement

### 14.3 Debit Networks

**Visa Debit Networks:**
- **Visa Debit (signature):** Processed over VisaNet like credit transactions (dual-message)
- **Visa Interlink:** Visa's PIN debit network (single-message)

**Mastercard Debit Networks:**
- **Mastercard Debit (signature):** Processed over Banknet like credit transactions (dual-message)
- **Maestro:** Mastercard's PIN debit network (single-message) -- note: Mastercard has been phasing out the Maestro brand, migrating to Mastercard Debit

**Other PIN Debit Networks (US):**
- STAR (Fiserv)
- NYCE (FIS)
- Pulse (Discover)
- Accel (Fiserv)
- Shazam
- AFFN (Armed Forces Financial Network)
- Jeanie
- Culiance

### 14.4 The Durbin Amendment

The Durbin Amendment was added to the Dodd-Frank Wall Street Reform and Consumer Protection Act in 2010 by Senator Dick Durbin of Illinois. It fundamentally changed debit card processing in the United States.

**Key Provisions:**

**1. Interchange Fee Cap (for regulated issuers):**
- Applies to debit cards issued by banks with $10 billion or more in assets ("regulated issuers")
- Cap: $0.21 + 0.05% of the transaction value + $0.01 fraud-prevention adjustment
- Prior to Durbin, the average debit interchange was ~$0.44 per transaction
- The cap roughly halved issuer revenue on regulated debit transactions
- Exempt issuers (banks with < $10B in assets) can charge higher interchange

**2. Network Routing Requirements:**
- Every debit card must support at least two unaffiliated payment networks for routing
- A Visa-branded debit card cannot ONLY have Visa/Interlink -- it must also support at least one unaffiliated network (e.g., STAR, NYCE, Pulse)
- This gives merchants the ability to choose which network to route the transaction through, enabling them to select the lowest-cost option
- In 2022-2023, the Fed clarified that this routing requirement also applies to card-not-present (online) debit transactions

**3. Impact on the Market:**
- Merchants saved an estimated $6-8 billion annually in debit interchange fees
- Issuers lost corresponding revenue
- Issuers responded by eliminating free checking accounts, reducing debit rewards programs, and increasing other fees
- The routing requirement intensified competition among debit networks
- PIN debit networks like STAR, NYCE, and Pulse gained volume as merchants routed to cheaper networks

**Proposed Further Reductions (2024-2025):**
- The Federal Reserve proposed reducing the cap from $0.21 to $0.144 + 0.04% with a $0.013 fraud-prevention adjustment
- If enacted, this would further reduce debit interchange revenue for large issuers

### 14.5 Prepaid Card Processing

- Prepaid cards are processed similarly to debit cards but draw from a pre-funded balance rather than a bank account
- Types: General purpose reloadable (GPR), gift cards, payroll cards, government benefit cards, travel cards
- Currently exempt from the Durbin Amendment's interchange caps
- Interchange rates vary widely depending on program type
- Some prepaid programs use their own BIN ranges, allowing acquirers to identify them and apply specific processing rules

---

## 15. Security and Fraud Prevention

### 15.1 PCI DSS (Payment Card Industry Data Security Standard)

PCI DSS is a set of security standards that ALL organizations handling cardholder data must comply with. It was created by the PCI Security Standards Council (PCI SSC), founded jointly by Visa, Mastercard, American Express, Discover, and JCB.

**Current Version:** PCI DSS v4.0.1 (effective March 2025)

**The 12 Core Requirements (organized into 6 goals):**

**Goal 1: Build and Maintain a Secure Network and Systems**
1. Install and maintain network security controls (firewalls, network segmentation)
2. Apply secure configurations to all system components (change default passwords, disable unnecessary services)

**Goal 2: Protect Account Data**
3. Protect stored account data (encryption, masking, hashing, truncation)
4. Protect cardholder data with strong cryptography during transmission over open, public networks (TLS 1.2+)

**Goal 3: Maintain a Vulnerability Management Program**
5. Protect all systems and networks from malicious software (anti-malware, application whitelisting)
6. Develop and maintain secure systems and software (patch management, secure coding practices)

**Goal 4: Implement Strong Access Control Measures**
7. Restrict access to system components and cardholder data by business need to know
8. Identify users and authenticate access to system components (MFA now mandatory for all CDE access)
9. Restrict physical access to cardholder data (badges, video surveillance, visitor logs)

**Goal 5: Regularly Monitor and Test Networks**
10. Log and monitor all access to system components and cardholder data (audit trails, SIEM)
11. Test security of systems and networks regularly (vulnerability scans, penetration testing)

**Goal 6: Maintain an Information Security Policy**
12. Support information security with organizational policies and programs (security awareness training, incident response plans)

**PCI DSS v4.0 Key Changes:**
- Passwords must be at least 12 characters (up from 7), mixing numbers and letters
- Multi-factor authentication is mandatory for ALL accounts accessing the cardholder data environment (previously only remote access)
- Security awareness programs must be reviewed and updated annually
- More flexible "customized approach" allows organizations to meet security objectives using alternative methods, as long as they can demonstrate equivalent protection

**Compliance Levels for Merchants:**
| Level | Annual Transactions | Requirements |
|-------|-------------------|--------------|
| Level 1 | >6 million | Annual on-site assessment by Qualified Security Assessor (QSA), quarterly network scans |
| Level 2 | 1-6 million | Annual Self-Assessment Questionnaire (SAQ), quarterly network scans |
| Level 3 | 20,000-1 million (e-commerce) | Annual SAQ, quarterly network scans |
| Level 4 | <20,000 (e-commerce) or <1 million (other) | Annual SAQ, quarterly scans recommended |

### 15.2 Point-to-Point Encryption (P2PE)

P2PE is a PCI-validated solution that cryptographically protects cardholder data from the point of interaction (POS terminal) to the secure decryption environment (processor's secure facility).

**How P2PE Works:**
1. The POS terminal encrypts card data immediately upon capture (before the data leaves the terminal)
2. The encrypted data traverses the merchant's network, the internet, and the processor's network in encrypted form
3. Decryption occurs only in the processor's Hardware Security Module (HSM) within a PCI-validated secure environment
4. The merchant never has access to unencrypted card data

**Benefits:**
- Dramatically reduces PCI DSS scope for the merchant (encrypted data is out of scope)
- Even if the merchant's network is compromised, the attacker gets only encrypted data that is useless without the decryption keys
- Merchants using PCI-listed P2PE solutions can use the simplified SAQ P2PE (only 33 questions vs. 300+ for a full SAQ D)

### 15.3 CVV/CVC -- Card Verification Values

The CVV/CVC is a security feature designed to prove that the cardholder has physical possession of the card during card-not-present transactions.

**Terminology:**
- **CVV1 / CVC1:** Encoded on the magnetic stripe (Track 2). Used to verify the physical card during card-present swipe transactions. Not visible to the cardholder.
- **CVV2 / CVC2:** Printed (not embossed) on the card. Visa calls it CVV2 (3 digits, back of card). Mastercard calls it CVC2 (3 digits, back of card). American Express calls it CID (4 digits, front of card).
- **iCVV:** A variant of CVV1 encoded on EMV chip cards (different from the magstripe CVV) to prevent cloning of chip data to magstripe.
- **dCVV (Dynamic CVV):** A CVV that changes periodically, used on some digital cards or displayed on an e-paper display on the physical card.

**How CVV2/CVC2 is Generated:**

The CVV2 is generated cryptographically by the issuer using:
1. The Primary Account Number (PAN)
2. The card's expiration date (4 digits)
3. A service code (3 digits)
4. A pair of secret DES encryption keys known only to the issuer

The algorithm:
1. Concatenate PAN + Expiry + Service Code, pad with zeroes to 32 hex characters
2. Split into two 16-character blocks
3. Encrypt the first block using DES with Key A
4. XOR the result with the second block
5. Encrypt the XOR result using DES with Key A
6. Decrypt using DES with Key B (Triple DES operation)
7. Encrypt using DES with Key A again
8. Extract only the numeric digits from the result
9. Take the first 3 digits as CVV2 (or if fewer than 3 numeric digits, extract from the non-numeric characters by mapping)

**Security Rules:**
- PCI DSS Requirement 3.2 prohibits storage of CVV2/CVC2 after authorization -- even in encrypted form
- Merchants must NOT store CVV2 under any circumstances
- This means even if a merchant's database is breached, CVV2 data should not be present
- The issuer is the only entity that can validate CVV2 (since it holds the secret keys)

### 15.4 Visa Advanced Authorization (VAA)

VAA is Visa's real-time fraud scoring system integrated directly into the VisaNet authorization path.

**How it Works:**
- Analyzes 100% of transactions on VisaNet in real time
- Generates a risk score for each transaction in approximately 1 millisecond
- Evaluates more than 500 risk attributes per transaction
- Uses machine learning models trained on billions of historical transactions
- The risk score is appended to the authorization message and sent to the issuer
- The issuer uses the score as one input in its own authorization decision

**Scale and Impact:**
- Used by 8,000+ issuers in 129 countries
- Prevents an estimated $40+ billion in fraud annually (as of recent reporting)
- Keeps global fraud rates below 0.1% of total volume
- Notably, client banks can use Visa's AI engine to mitigate fraud on ALL their card payments, including competing networks like Mastercard

### 15.5 Mastercard Decision Intelligence

Mastercard's AI-powered fraud and authorization decision platform.

**Architecture:**
- Powered by a proprietary recurrent neural network built in-house
- Multi-layered neural network architecture that extracts increasingly abstract signals from raw transaction data
- Trained on data from ~125 billion transactions annually
- Instead of static rules, identifies non-linear relationships across hundreds of variables

**Key Innovation:**
- Uses the concept of "merchant relationships" -- understanding the history of a cardholder's merchant visits as context
- Generates pathways through Mastercard's network to predict whether a business is a place the customer would likely go
- All processing happens in approximately 50 milliseconds

**Performance:**
- Enhances fraud detection rates by an average of 20%, with some cases achieving up to 300% improvement
- Reduces false positives tenfold (fewer legitimate transactions incorrectly declined)

**Decision Intelligence Pro (Generative AI, launched 2024):**
- Upgraded version using generative AI and graph technology
- Doubled detection rate for compromised cards before they can be used fraudulently
- Uses graph analysis to map relationships between entities (cards, merchants, devices) and detect compromise patterns

---

## 16. Differences Between Visa and Mastercard

### 16.1 Market Share

| Metric | Visa | Mastercard |
|--------|------|------------|
| Global market share (purchase transactions) | ~61% | ~25% |
| US card transactions | ~60% | ~30% |
| Global payment volume (FY 2025) | $14T+ | $9.2T+ |
| Cards in circulation | ~4.5B | ~3.0B |
| Annual transactions | 258B+ | 150B+ |
| Net revenue (FY 2025) | $40.0B | $32.8B |

### 16.2 Geographic Strengths

**Visa:**
- Dominant in the United States (historically the BankAmericard home market)
- Strong in Latin America, Asia-Pacific
- Acquired Visa Europe in 2016, strengthening European position

**Mastercard:**
- Stronger relative position in Europe (partly due to historic Europay relationship)
- Growing rapidly in Africa and Middle East
- Strong position in India (RuPay notwithstanding)
- Merged with Europay International in 2002, gaining deep European roots

### 16.3 Processing Architecture Differences

**Visa:**
- VisaNet operates as a centralized switch -- all transactions between issuers and acquirers must flow through VisaNet
- Seven data centers with full redundancy
- Capacity: 83,000+ TPS
- All clearing and settlement processed centrally by Visa

**Mastercard:**
- Banknet operates similarly but has historically been more decentralized
- Allows some regional processing and intra-member settling in certain markets
- Peak capacity: ~20,000 TPS
- Processing center in O'Fallon, Missouri with DR site

### 16.4 Fee Structure Differences

While both have similar fee categories, the specific rates differ:

| Fee Type | Visa | Mastercard |
|----------|------|------------|
| Base assessment | 0.14% (credit) | 0.11% (<$1K), 0.13% (>$1K credit) |
| Per-transaction fee | NABU: $0.0195 | NABU: ~$0.0195 |
| Monthly merchant fee | FANF (varies widely) | MLF: $1.25/location |
| Cross-border fee | ~0.80-1.00% | ~0.60-1.00% |
| E-commerce fee | Included in FANF | Digital Commerce Dev: $0.01/txn |

Note: These are approximations and change frequently. Actual rates depend on region, volume, and negotiated agreements.

### 16.5 Product Tiers

**Visa Card Tiers (ascending order):**

| Tier | Target Segment | Key Benefits |
|------|---------------|-------------|
| Visa Classic/Traditional | Basic, entry-level | Lost/stolen card reporting, auto rental collision damage waiver |
| Visa Gold | Mid-tier | Higher limits, enhanced insurance |
| Visa Platinum | Upper-mid | Emergency assistance, roadside dispatch, extended warranty |
| Visa Signature | Premium | Travel insurance, concierge, year-end summaries, premium offers |
| Visa Infinite | Ultra-premium | Airport lounge access (LoungeKey), highest insurance levels, luxury hotel program, dedicated concierge |

**Mastercard Card Tiers (ascending order):**

| Tier | Target Segment | Key Benefits |
|------|---------------|-------------|
| Mastercard Standard | Basic | Zero fraud liability, ID theft protection, emergency card replacement |
| Mastercard Titanium | Entry-premium (some markets) | Enhanced fraud protection |
| Mastercard Platinum | Mid-premium | Trip planning, travel upgrades |
| Mastercard World | Premium | Concierge service, promotions, discounts |
| Mastercard World Elite | Ultra-premium | Airport lounge access, comprehensive travel insurance, luxury hotel/resort programs, premium concierge |

**Note:** The benefits listed above are provided by the card network. Individual issuers (Chase, Citi, Barclays, etc.) layer their own benefits on top, which are typically much more significant to the cardholder (e.g., points multipliers, annual travel credits, specific airline/hotel status).

### 16.6 Key Strategic Differences

**Visa:**
- Larger scale, benefiting from stronger network effects
- Historically more focused on payment processing as core business
- Acquired Visa Europe ($21.2B) to consolidate global operations
- Invested heavily in Plaid (attempted $5.3B acquisition, blocked by DOJ antitrust)
- Focused on Visa Direct for push payments

**Mastercard:**
- More aggressive in diversifying into value-added services
- Acquired Vocalink (UK's real-time payment infrastructure) for $920M -- strategic move into non-card payment rails
- Acquired Finicity (open banking data) for $825M
- Acquired Ekata (identity verification), Aiia (open banking), Baffin Bay Networks (cybersecurity)
- Investing heavily in multi-rail strategy (cards + real-time payments + open banking)

---

## 17. Modern Developments

### 17.1 Real-Time Payments and Push Payments

Traditional card payments are "pull" payments -- the merchant (via acquirer) pulls money from the cardholder's account. Push payments reverse this: the sender pushes money directly to the recipient.

**Visa Direct:**
- Enables near-real-time fund transfers directly to a recipient's debit card, bank account, or mobile wallet
- Money typically reaches the recipient in under 30 minutes (often within minutes)
- Available in 190+ markets
- Use cases: gig economy payouts (Uber/Lyft paying drivers), insurance claims, marketplace seller payouts, P2P transfers, loan disbursements, refunds
- Processes billions of transactions annually
- Built on Visa's existing VisaNet infrastructure with extended capabilities

**Mastercard Send:**
- Mastercard's equivalent push payment platform
- Real-time push payments using existing card and banking infrastructure
- Leverages Mastercard's security protocols including 3D Secure
- Supports domestic and cross-border transfers
- Integrated with Mastercard's network of issuers and acquirers

**Vocalink (Mastercard):**
- Mastercard's acquisition of Vocalink gave it ownership of the UK's Faster Payments system
- Processes real-time account-to-account payments
- Also operates BACS (UK direct debit) and LINK (UK ATM network)
- Represents Mastercard's strategy to become a multi-rail payment company beyond cards

### 17.2 Open Banking Impact

Open banking regulations (PSD2 in Europe, similar initiatives globally) require banks to share customer account data with authorized third parties via APIs. This creates both threats and opportunities for card networks.

**Threats to Card Networks:**
- Account-to-account (A2A) payments bypass the card networks entirely
- If a consumer pays a merchant directly from their bank account (via bank redirect or open banking API), Visa/Mastercard earn zero fees
- PSD2 specifically enables Payment Initiation Services (PIS), which allow third parties to initiate payments directly from bank accounts
- If A2A payments become mainstream for e-commerce, card networks could lose significant volume

**Card Network Responses:**
- **Mastercard:** Acquired Vocalink (real-time A2A payments in UK), Finicity (open banking data platform in US), and Aiia (European open banking platform). Mastercard is positioning itself as a multi-rail payment provider that can facilitate both card AND A2A payments.
- **Visa:** Invested in Plaid (attempted $5.3B acquisition blocked by DOJ), developed Visa Open Banking APIs, launched Visa A2A (account-to-account) payment capability in select markets.
- Both networks are hedging -- if A2A payments grow, they want to be the infrastructure provider for those too.

**Current Reality (2025-2026):**
- A2A payments have gained traction in some markets (India's UPI, Brazil's Pix, UK's Faster Payments) but have not displaced cards in most developed markets
- Card payments continue to grow, driven by the shift from cash to digital
- The card value proposition (consumer protection, rewards, universal acceptance) remains strong
- PSD2/SCA helped reduce payment fraud in the EEA but did not dramatically shift payment method preferences
- PSD3/PSR legislation is progressing slowly in the EU

### 17.3 Cryptocurrency and Stablecoin Initiatives

Both Visa and Mastercard have made significant moves into crypto and stablecoins.

**Visa Crypto Strategy:**

- **Stablecoin Settlement (December 2025):** Visa launched USDC settlement in the United States. For the first time, U.S. issuer and acquirer partners can settle with Visa in Circle's USDC stablecoin. Initial banking participants include Cross River Bank and Lead Bank, settling over the Solana blockchain. Visa reports $3.5B+ in annualized stablecoin settlement volume.

- **Multi-Stablecoin, Multi-Chain Support:** Visa supports USDC (Circle), EURC (Circle), PYUSD (PayPal), and USDG across Ethereum, Solana, Stellar, and Avalanche blockchains.

- **Arc Blockchain Partnership:** Visa is a design partner for Arc, a new Layer 1 blockchain developed by Circle, purpose-built for commercial payment activity on-chain.

- **Crypto Card Programs:** Visa has partnered with crypto companies (Coinbase, Crypto.com, BlockFi) to issue crypto-linked debit cards. These cards allow users to spend crypto holdings at any Visa-accepting merchant -- the crypto is converted to fiat at the point of sale.

**Mastercard Crypto Strategy:**

- **Stablecoin Partnerships (June 2025):** Mastercard announced partnerships with Circle, Paxos, Fiserv, and PayPal to support multiple stablecoins across the network. Enables acquiring institutions to settle with merchants using stablecoins, with pilots in Eastern Europe, Middle East, and Africa.

- **MoonPay Partnership:** Mastercard partnered with MoonPay to let users link a stablecoin-funded digital wallet to their Mastercard, enabling stablecoin spending at any Mastercard-accepting merchant.

- **CBDC Initiatives:** Both networks have engaged with central banks exploring CBDCs. Mastercard has launched CBDC testing platforms in partnership with multiple central banks.

**Market Scale (2025):**
- Monthly crypto card spend rose from ~$100M (early 2023) to ~$1.5B (late 2025) -- approximately 15x growth
- Fiat-backed stablecoins reached record levels of $219B+ in circulation
- Both networks view stablecoins as an opportunity rather than a threat -- they can serve as another settlement layer within the existing network

### 17.4 Buy Now Pay Later (BNPL) Integration

BNPL has grown 400% since 2018 and is projected to grow 17% annually through 2028. Both card networks are actively integrating BNPL into their infrastructure.

**Visa BNPL Approach:**

- **Visa Installment Credential (VIC):** Allows issuers to embed BNPL functionality directly into a Visa credential. The cardholder can choose to pay in installments at the point of sale without requiring merchant integration. The installment option is built into the card itself.

- **VIC in the Box:** A turnkey solution for financial institutions to quickly deploy BNPL credentials.

- **Visa Flexible Credential:** A network capability that lets a single physical card surface multiple funding sources (credit, debit, BNPL). Klarna's new card is built on this technology.

- **Visa Ready for BNPL:** A certification program with 20+ live partners that fast-tracks BNPL provider integration with Visa's network.

**Mastercard BNPL Approach:**

- **Network-Level Integration:** Mastercard has built APIs, rule frameworks, and security protocols that enable partners to embed installment payments into the network.

- **Beyond Retail:** Mastercard is expanding BNPL into healthcare, professional services, and B2B transactions -- large-ticket items like hospital bills or small business expenses.

- **Mastercard Installments:** Program that allows issuers and BNPL providers to offer installment options through Mastercard's network at any accepting merchant.

**Strategic Significance:**
- BNPL threatened to disintermediate card networks by creating direct merchant-to-consumer lending relationships
- By integrating BNPL into the card network, Visa and Mastercard ensure they remain in the transaction flow and continue to earn network fees
- The card networks' advantage: universal merchant acceptance. A BNPL provider integrated with Visa/Mastercard can offer installments at any of the 100M+ acceptance locations worldwide, without needing direct merchant integrations

---

## Appendix: Key Terminology Quick Reference

| Term | Definition |
|------|-----------|
| **PAN** | Primary Account Number -- the full card number |
| **BIN/IIN** | Bank Identification Number / Issuer Identification Number -- first 6-8 digits |
| **EMV** | Europay, Mastercard, Visa -- chip card standard |
| **NFC** | Near Field Communication -- contactless technology |
| **ARQC** | Authorization Request Cryptogram -- chip-generated authentication |
| **AID** | Application Identifier -- identifies payment app on chip |
| **CVM** | Cardholder Verification Method -- how the cardholder proves identity |
| **CNP** | Card-Not-Present -- online/phone transactions |
| **MCC** | Merchant Category Code -- 4-digit code identifying business type |
| **MDR** | Merchant Discount Rate -- total fee merchants pay |
| **STIP** | Stand-In Processing -- network authorization on behalf of issuer |
| **3DS** | 3D Secure -- authentication protocol for online transactions |
| **P2PE** | Point-to-Point Encryption -- encrypted from terminal to processor |
| **TSP** | Token Service Provider -- generates and manages tokens |
| **VTS** | Visa Token Service |
| **MDES** | Mastercard Digital Enablement Service |
| **DPAN/DAN** | Device Primary Account Number / Device Account Number -- device token |
| **FPAN** | Funding Primary Account Number -- the real card number |
| **AVS** | Address Verification Service |
| **MTI** | Message Type Indicator -- first 4 digits of ISO 8583 message |
| **VROL** | Visa Resolve Online -- dispute management platform |
| **VAA** | Visa Advanced Authorization -- AI fraud scoring |
| **FANF** | Fixed Acquirer Network Fee -- Visa's monthly merchant fee |
| **SCA** | Strong Customer Authentication -- PSD2 requirement in EU |
| **BNPL** | Buy Now Pay Later |
| **A2A** | Account-to-Account payments |
| **HCE** | Host Card Emulation -- software-based NFC on Android |
| **SE** | Secure Element -- hardware chip for secure storage |
| **HSM** | Hardware Security Module -- secure cryptographic processing |
| **QSA** | Qualified Security Assessor -- PCI audit professional |
| **SAQ** | Self-Assessment Questionnaire -- PCI compliance form |

---

## Sources

- [Visa Inc. -- Wikipedia](https://en.wikipedia.org/wiki/Visa_Inc.)
- [Mastercard -- Wikipedia](https://en.wikipedia.org/wiki/Mastercard)
- [Visa, Inc. | History, BankAmericard, IPO | Britannica Money](https://www.britannica.com/money/Visa-Inc)
- [Mastercard Inc. | History, Master Charge, IPO | Britannica Money](https://www.britannica.com/money/Mastercard-Inc)
- [The four-party card model: How Visa and Mastercard work](https://paymentexpert.com/2026/03/19/four-party-card-model-explained/)
- [Payments Ecosystem: The Four Party Model | Marqeta](https://www.marqeta.com/uk/demystifying-cards-guide/card-payments-ecosystem)
- [Card Network Economics: How Visa and Mastercard Actually Make Money | Spark](https://www.spark.money/research/card-network-economics-visa-mastercard)
- [ISO 8583 -- Wikipedia](https://en.wikipedia.org/wiki/ISO_8583)
- [A Guide to ISO 8583 | IR](https://www.ir.com/guides/introduction-to-iso-8583)
- [ISO 8583: The Technical Foundation of Modern Payment Systems | Medium](https://isaaclanre.medium.com/iso-8583-the-technical-foundation-of-modern-payment-systems-33af3fbaee68)
- [ISO 8583 | The Secret Language of Card Payments -- Zeta](https://www.zeta.tech/us/resources/blog/iso-8583-simplified-how-card-payments-work/)
- [Interchange Fees Explained | Stripe](https://stripe.com/resources/more/interchange-fees-101-what-they-are-how-they-work-and-how-to-cut-costs)
- [Interchange fee -- Wikipedia](https://en.wikipedia.org/wiki/Interchange_fee)
- [Mastercard Interchange Fees and Rates Explained](https://www.mastercard.com/europe/en/business/support/merchant-interchange-rates.html)
- [EU Interchange Fee Regulation Study](https://www.hostmerchantservices.com/2025/10/eu-interchange-fee-regulation/)
- [EMV -- Wikipedia](https://en.wikipedia.org/wiki/EMV)
- [SDA vs DDA vs CDA in EMV Certification | EazyPay Tech](https://eazypaytech.com/sda-vs-dda-vs-cda-in-emv-certification/)
- [Payment card number -- Wikipedia](https://en.wikipedia.org/wiki/Payment_card_number)
- [Credit Card Data Formats and the Luhn Algorithm | Ground Labs](https://groundlabs.com/blog/anatomy-of-a-credit-card)
- [Card security code -- Wikipedia](https://en.wikipedia.org/wiki/Card_security_code)
- [How Tap to Pay Works | The Retail Exec](https://theretailexec.com/payment-processing/how-tap-to-pay-works/)
- [How Mobile Wallets Work | FintekCafe](https://fintekcafe.com/how-mobile-wallets-work-apple-pay-google-pay-and-the-tech-behind-tap-to-pay/)
- [How NFC Payments Work | NFC Clone](https://www.nfcclone.com/blog/how-nfc-payments-work)
- [Card Tokenization: Understanding MDES and VTS | Medium](https://medium.com/@sudha.rajamanickam.a/card-tokenization-understanding-mdes-and-vts-6ff602bd1576)
- [Visa Token Service | Visa](https://usa.visa.com/products/visa-token-service.html)
- [3D Secure -- Wikipedia](https://en.wikipedia.org/wiki/3-D_Secure)
- [What is 3D Secure? The Evolution from 1.0 to 2.0 | PayPro Global](https://payproglobal.com/answers/what-is-3d-secure/)
- [3D Secure 2.0 Explained | Checkout.com](https://www.checkout.com/blog/3-d-secure-2-0-explained)
- [Chargeback Reason Codes: Ultimate Guide | Chargebacks911](https://chargebacks911.com/chargeback-reason-codes/)
- [Visa Resolve Online | Visa](https://usa.visa.com/solutions/post-purchase-solutions/visa-resolve-online.html)
- [Visa Resolve Online (VROL) | Visa Developer](https://developer.visa.com/capabilities/visa-resolve-online)
- [Dispute Resolution Cycle | Mastercom | Mastercard Developers](https://developer.mastercard.com/mastercom/documentation/getting-started/)
- [Mastercard Chargeback Arbitration | Chargebacks911](https://chargebacks911.com/mastercard-chargeback-arbitration-process/)
- [Inside Visa's Engine of Global Commerce | Visa](https://corporate.visa.com/en/sites/visa-perspectives/security-trust/inside-visa-global-commerce-engine.html.html)
- [Reflections on Visa's High-Availability Payment Network](https://www.abhishek-tiwari.com/reflections-on-visa-s-high-availability-payment-processing-infrastructure/)
- [How MasterCard Processes 74B Transactions a Year](https://blog.unibulmerchantservices.com/how-mastercard-processes-74b-transactions-a-year/)
- [Visa Revenue Breakdown | Bullfincher](https://bullfincher.io/companies/visa/revenue-by-segment)
- [Visa and Mastercard: The Global Payment Duopoly | Quartr](https://quartr.com/insights/edge/visa-and-mastercard-the-global-payment-duopoly)
- [Visa Prevents Approximately $25 Billion in Fraud Using AI | Visa](https://usa.visa.com/about-visa/newsroom/press-releases.releaseId.16421.html)
- [Decision Intelligence | Mastercard](https://b2b.mastercard.com/ai-and-security-solutions/fraud-and-decisioning/decision-intelligence/)
- [Mastercard Accelerates Card Fraud Detection with Gen AI | Mastercard](https://www.mastercard.com/us/en/news-and-trends/press/2024/may/mastercard-accelerates-card-fraud-detection-with-generative-ai-technology.html)
- [Durbin Amendment -- Wikipedia](https://en.wikipedia.org/wiki/Durbin_amendment)
- [Visa Direct vs. Mastercard Send | Lightspark](https://www.lightspark.com/knowledge/visa-direct-vs-mastercard-send)
- [Visa Launches Stablecoin Settlement in the US | Visa](https://usa.visa.com/about-visa/newsroom/press-releases.releaseId.21951.html)
- [Stablecoins at Checkout in 2025 | MountainWolf](https://www.mountainwolf.com/insights/industry/stablecoins-at-checkout-in-2025-what-visa-mastercard-are-rolling-out/)
- [Buy Now Pay Later Solutions | Visa](https://corporate.visa.com/en/solutions/buy-now-pay-later.html)
- [PCI DSS v4.0 Requirements | Checkout.com](https://www.checkout.com/blog/pci-dss-4-what-do-merchants-need-to-know)
- [PCI DSS Compliance: 12 Requirements | CrowdStrike](https://www.crowdstrike.com/en-us/cybersecurity-101/data-protection/pci-dss-requirements/)
- [What is P2PE? | Checkout.com](https://www.checkout.com/blog/what-is-p2pe)
- [Contactless Limits by Country 2026 | Merchant Machine](https://merchantmachine.co.uk/contactless-card-limits-2023/)
- [Visa vs Mastercard 2025 | Swipesum](https://www.swipesum.com/insights/the-difference-between-visa-and-mastercard)
- [Comparing Visa Signature and World Elite Mastercard | The Points Guy](https://thepointsguy.com/credit-cards/visa-signature-vs-world-elite-mastercard-benefits/)
- [Visa and Mastercard Network Fees Guide | Astra](https://astrafi.com/blog/understanding-visa-and-mastercard-network-fees/)
- [Network Fees 101 | Finix](https://finix.com/resources/blogs/dues-and-assessments-networkfees-101)
- [Payment Processor vs Merchant Acquirer | Stripe](https://stripe.com/resources/more/payment-processor-vs-merchant-acquirer)
- [Dee Hock -- Wikipedia](https://en.wikipedia.org/wiki/Dee_Hock)
- [The Evolution of Visa: From BankAmericard to Global Payments Leader | Seat11a](https://seat11a.com/blog-the-evolution-of-visa-from-bankamericard-to-global-payments-leader/)
- [Clearing and Settlement Processes -- Mastercard Transaction Processing](https://oboe.com/learn/mastercard-transaction-processing-explained-1wl4ae7/clearing-and-settlement-processes-mastercard-transaction-processing-explained-2)
- [Settlement Processing for Card Programs | Lithic](https://www.lithic.com/blog/what-is-settlement-processing)
