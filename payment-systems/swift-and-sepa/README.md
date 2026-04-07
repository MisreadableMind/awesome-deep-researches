# SWIFT and SEPA Payment Systems: Complete Technical Deep Dive

---

# PART ONE: SWIFT (Society for Worldwide Interbank Financial Telecommunication)

---

## 1. History and Overview

### Founding

SWIFT was founded on 3 May 1973 in Brussels, Belgium. It was created by 239 banks from 15 countries as a cooperative society under Belgian law. The founding was driven by the need to replace the Telex system, which was slow, error-prone, and insecure for transmitting financial instructions between banks.

Key individuals in its creation included:
- **Jan Kraa** (AMRO Bank) and **Francois Dentz** (Banque de l'Union Parisienne), who championed the concept
- **Carl Reuterskiold**, the first Chairman
- **Bessel Kok**, the first CEO

The choice of Brussels as the headquarters was a deliberate political compromise to avoid the rivalry between London and New York, both of which wanted to host the organization. Belgium was seen as a neutral European location.

Fundamental operating procedures and rules for liability were established in 1975. The first SWIFT message was ceremonially sent on **9 May 1977** by Prince Albert of Belgium. By that point, the system connected 518 institutions across 22 countries.

### Headquarters

SWIFT's headquarters is located in **La Hulpe**, a municipality south of Brussels, Belgium. In 1989, SWIFT completed a monumental new head office building designed by architect Ricardo Bofill. SWIFT also operates data centers in the Netherlands, the United States, and Switzerland.

### Governance Structure

SWIFT is structured as a **cooperative society** (societe cooperative) under Belgian law. It is owned by its member financial institutions. Key governance elements:

- **Board of Directors**: 25 Directors elected by shareholders. The Board governs the company and oversees management.
- **Shareholder Representation**: Governance is designed to reflect usage of SWIFT messaging services, ensuring global relevance.
- **Oversight**: The National Bank of Belgium (NBB) acts as the lead overseer. Cooperative oversight involves central banks of the G10 countries and the European Central Bank (ECB).
- **Neutrality**: SWIFT's governance is designed to uphold strict neutrality -- it is not controlled by any single country or group of countries.

### Scale Today

As of 2025-2026, SWIFT connects over **11,000 financial institutions** across more than **200 countries and territories**. It transmits approximately **44-46 million messages per day**.

---

## 2. What SWIFT Actually Is (and Is Not)

This is the single most important conceptual point about SWIFT:

**SWIFT is a secure messaging network. It is NOT a payment system. It does not move money, hold assets, process settlements, or clear transactions.**

SWIFT acts as a **carrier of messages** containing payment instructions between financial institutions involved in a transaction. Think of SWIFT as the postal service for banks -- it delivers the letter (the instruction), but it does not deliver the package (the money).

When Bank A in Germany wants to send EUR 50,000 to Bank B in Japan, SWIFT carries the **message** telling Bank B what to do. The actual movement of money happens separately through:
- **Correspondent banking relationships** (nostro/vostro accounts)
- **Clearing systems** (like Fedwire, CHIPS, TARGET2/T2)
- **Central bank settlement systems**

This distinction is critical. When people say "I sent money via SWIFT," what they really mean is: "My bank sent a SWIFT message instructing another bank to credit funds to a specific account, and the actual settlement happened through separate infrastructure."

---

## 3. SWIFT Message Types (MT Messages)

### Structure of an MT Message Identifier

All SWIFT messages include the literal "MT" (Message Type) followed by a **three-digit number**:

- **First digit**: The **category** (what area of financial activity)
- **Second digit**: The **group** (what phase of the transaction lifecycle)
- **Third digit**: The **type** (the specific message)

### Complete Category List

| Category | Code Range | Description |
|----------|-----------|-------------|
| 1 | MT1xx | **Customer Payments and Cheques** -- Instructions for payments initiated by or for customers |
| 2 | MT2xx | **Financial Institution Transfers** -- Bank-to-bank fund transfers |
| 3 | MT3xx | **Treasury Markets -- Foreign Exchange, Money Markets, Derivatives** |
| 4 | MT4xx | **Collections and Cash Letters** |
| 5 | MT5xx | **Securities Markets** |
| 6 | MT6xx | **Precious Metals and Syndications** |
| 7 | MT7xx | **Documentary Credits and Guarantees** (Letters of Credit) |
| 8 | MT8xx | **Travellers Cheques** |
| 9 | MT9xx | **Cash Management and Customer Status** |
| 0 | MT0xx | **System Messages** (used by SWIFT itself) |

### Key Message Types in Detail

#### MT103 -- Single Customer Credit Transfer

This is the **most commonly used SWIFT message** in the world. It is the standard message for instructing a cross-border customer payment (wire transfer).

**Purpose**: When a corporation or individual initiates an international wire transfer, the originating bank creates an MT103 message containing:
- Ordering customer details (name, account, address)
- Beneficiary details (name, account number, bank)
- Amount and currency
- Value date
- Charges instruction (OUR, BEN, SHA)
- Remittance information

**Charges codes explained**:
- **OUR**: Sender pays all fees (including correspondent bank fees)
- **BEN**: Beneficiary pays all fees (deducted from the transferred amount)
- **SHA** (Shared): Sender pays their bank's fees; beneficiary pays their bank's fees; correspondent fees are often deducted from the amount

**Key fields in an MT103**:
- Field 20: Transaction Reference Number
- Field 23B: Bank Operation Code
- Field 32A: Value Date, Currency Code, Amount
- Field 33B: Currency/Instructed Amount
- Field 50K: Ordering Customer
- Field 52A: Ordering Institution
- Field 53A: Sender's Correspondent
- Field 54A: Receiver's Correspondent
- Field 56A: Intermediary Institution
- Field 57A: Account With Institution (beneficiary's bank)
- Field 59: Beneficiary Customer
- Field 70: Remittance Information
- Field 71A: Details of Charges
- Field 71F: Sender's Charges
- Field 72: Sender to Receiver Information

#### MT202 -- General Financial Institution Transfer

**Purpose**: Strictly for **bank-to-bank transactions**. Unlike MT103 (which involves an end customer), MT202 is used to transfer funds between financial institutions for interbank obligations, such as:
- Covering payments (funding correspondent bank accounts)
- Settling foreign exchange deals
- Moving liquidity between a bank's own accounts at different locations

A variant, **MT202 COV** (Cover payment), is used when a separate MT103 customer payment requires a corresponding bank-to-bank cover payment through the correspondent banking chain.

#### MT199 -- Free Format Message (Category 1)

A **free-text message** used by banks to communicate about customer payment matters when no other structured message type is applicable. Common uses:
- Requesting additional information about a transaction
- Confirming beneficiary identity
- Sending pre-advice that a more formal SWIFT message is being prepared
- Sharing tracking numbers or operational details

**Critical limitation**: MT199 carries **no binding payment obligation**. It is informational only -- not a payment instruction, not a guarantee, and not a binding commitment.

#### MT299 -- Free Format Message (Category 2)

The equivalent of MT199 but for category 2 (financial institution transfers). Used for free-form bank-to-bank communication when no structured message type fits.

#### Other Important Message Types

- **MT101**: Request for Transfer -- allows a corporate to instruct debits from multiple accounts
- **MT104**: Direct Debit and Request for Debit Transfer Message
- **MT192/MT292**: Request for Cancellation (categories 1 and 2 respectively)
- **MT195/MT295**: Queries about previous messages
- **MT196/MT296**: Answers to queries
- **MT300**: Foreign Exchange Confirmation
- **MT502**: Order to Buy or Sell
- **MT535**: Statement of Holdings
- **MT700**: Issue of a Documentary Credit (Letter of Credit)
- **MT760**: Guarantee / Standby Letter of Credit
- **MT799**: Free Format Message for Documentary Credits
- **MT900**: Confirmation of Debit
- **MT910**: Confirmation of Credit
- **MT940**: Customer Statement Message (end-of-day account statement)
- **MT942**: Interim Transaction Report (intraday statement)
- **MT950**: Statement Message (for financial institutions)

### MT Message Physical Structure -- Five Blocks

Every FIN MT message consists of **five blocks** of data:

```
{1: Basic Header Block}{2: Application Header Block}{3: User Header Block}{4: Text Block}{5: Trailer Block}
```

There is no carriage return or line feed between blocks. Block 3 is optional.

**Block 1 -- Basic Header Block** (fixed-length, continuous):
- Application ID (F = FIN, A = GPA, L = GPA)
- Service ID (01 = FIN/GPA, 21 = ACK/NAK)
- Logical Terminal Address (the sender's BIC plus terminal code)
- Session Number
- Sequence Number

Example: `{1:F01BANKUS33AXXX0000000000}`

**Block 2 -- Application Header Block**:
Contains information about the message type and destination. Differs for input (I) vs. output (O) messages.
- Message type (e.g., 103)
- Destination BIC
- Priority (U = Urgent, N = Normal, S = System)
- Delivery monitoring

Example: `{2:I103BANKDEFFXXXXN}`

**Block 3 -- User Header Block** (optional):
Contains special processing instructions, such as:
- Field 108: Message User Reference (MUR)
- Field 113: Banking Priority
- Field 119: Validation Flag (STP for straight-through processing)
- Field 121: UETR (Unique End-to-End Transaction Reference for gpi)

**Block 4 -- Text Block (Body)**:
The actual message content with field tags. Variable length, uses CRLF as field delimiter. This is where all the payment details live (sender, receiver, amount, etc.).

**Block 5 -- Trailer Block**:
Contains both user information and system information:
- **CHK**: Checksum
- **MAC**: Message Authentication Code
- **PDE**: Possible Duplicate Emission
- **DLM**: Delayed Message
- **MRF**: Message Reference

---

## 4. SWIFT gpi (Global Payments Innovation)

### The Problem gpi Solves

Before gpi, SWIFT payments had three major problems:
1. **No transparency**: Once a payment was sent, neither the sender nor the receiver knew where it was in the correspondent banking chain
2. **Unpredictable speed**: Payments could take 1-5 business days with no visibility into why
3. **Hidden fee deductions**: Correspondent banks could deduct fees from the payment amount without advance notice

### What gpi Is

SWIFT gpi (Global Payments Innovation) went live in **2017** as an upgrade to the SWIFT network. It is a set of rules, standards, and tools that dramatically improve cross-border payment tracking, speed, and transparency.

### Key Components

#### UETR (Unique End-to-End Transaction Reference)

The UETR is a **36-character alphanumeric string** (UUID format) assigned to every payment. It functions like a courier tracking number, allowing all parties to trace the exact location and status of funds throughout the payment journey.

Format example: `eb6305c9-1f7f-49de-aed0-16487c27b42d`

The UETR is embedded in **Block 3, Field 121** of the MT message. As of November 2018, UETR became **mandatory** for all SWIFT customer payment messages (MT103), not just gpi transactions.

#### gpi Tracker

A centralized cloud-based database maintained by SWIFT where all gpi-member banks must update the status of every payment as it passes through them. This gives end-to-end visibility across the entire correspondent chain.

Banks must confirm:
- When they received the payment instruction
- When they forwarded it
- When they credited the beneficiary
- What fees they deducted
- What FX rate they applied

#### gpi Rules (SLA Obligations)

Banks that join gpi commit to:
- **Same-day use of funds**: Credit the beneficiary account on the day the payment is received (where possible)
- **Transparency of fees**: Report all fees deducted
- **End-to-end tracking**: Update the gpi Tracker at each step
- **Unaltered remittance information**: Pass through remittance data without modification

### Performance

- Over **4,000 financial institutions** have adopted gpi
- Covers transactions in **150+ currencies** across **2,000+ country corridors**
- **Median processing time**: Under 2 hours on gpi routes
- A significant share of payments are credited **within minutes**
- Nearly all gpi payments are completed **within 24 hours**

### gpi for Corporates (g4C)

An extension that allows corporates to directly track their payments through the gpi Tracker via their bank's portal or APIs, rather than having to call their bank for status updates.

---

## 5. The Correspondent Banking Model

### Why Correspondent Banking Exists

There are over 11,000 banks connected to SWIFT, but it is logistically and economically impossible for every bank to maintain a direct relationship and hold accounts with every other bank worldwide. Correspondent banking solves this problem.

### How It Works

**Correspondent banking** is a relationship where one bank (the **correspondent bank**) provides services to another bank (the **respondent bank**) to facilitate cross-border transactions. The correspondent bank holds an account on behalf of the respondent bank.

### Nostro and Vostro Accounts

These are two views of the **same account**, seen from different perspectives:

#### Nostro Account ("Our money held by you")

- An account that **Bank A holds at Bank B** in Bank B's country, denominated in Bank B's local currency
- From Bank A's perspective, this is a **nostro** account
- Appears as an **asset** on Bank A's balance sheet (it represents funds Bank A controls)
- Example: Deutsche Bank holds a USD account at JPMorgan in New York. Deutsche Bank calls this their "nostro" account.

#### Vostro Account ("Your money held by us")

- The **same account** viewed from Bank B's perspective
- From Bank B's perspective (JPMorgan), this is a **vostro** account -- "your money that we're holding for you"
- Appears as a **liability** on Bank B's balance sheet (the funds belong to Bank A, and Bank B has an obligation to process transactions and return funds on demand)

#### Loro Account ("Their money held by you")

A third-party reference. When Bank C refers to the account that Bank A holds at Bank B, Bank C calls it a **loro** account -- "their account."

### Settlement Through Nostro/Vostro

The entire settlement of cross-border payments happens through **ledger entries** in correspondent bank accounts. No physical currency moves. The process is:

1. Bank A debits the sender's account
2. Bank A instructs Bank B (the correspondent) via SWIFT to credit the beneficiary
3. Bank B debits Bank A's nostro account (reducing Bank A's balance)
4. Bank B credits the beneficiary's account

### Multi-Hop Correspondent Chains

When Bank A and Bank B have no direct relationship (no nostro/vostro accounts), the payment must pass through one or more **intermediary banks** that serve as bridges:

```
Bank A (Sender's Bank)
  --> Correspondent Bank 1 (has nostro/vostro with both A and C)
    --> Correspondent Bank 2 (optional, if needed)
      --> Bank B (Receiver's Bank)
```

Each hop adds:
- Time (processing and compliance checks)
- Cost (each intermediary charges a fee)
- Risk (of errors, delays, or fee deductions)

### De-risking and Declining Correspondent Relationships

Since 2012, the number of correspondent banking relationships has been **declining** globally. Banks are "de-risking" -- terminating relationships in jurisdictions where compliance costs (AML/KYC) outweigh revenues. This has particularly affected:
- Developing countries
- Small island nations
- Countries under sanctions scrutiny

---

## 6. How a SWIFT Transfer Actually Flows -- Step by Step

### Scenario
Maria in Madrid (Spain) wants to send USD 10,000 to Kenji in Tokyo (Japan). Maria's bank is Banco Santander. Kenji's bank is MUFG Bank.

### Step 1: Payment Initiation

Maria instructs her bank (Santander) to send USD 10,000 to Kenji's account at MUFG Bank. She provides:
- Kenji's full name
- Kenji's account number at MUFG
- MUFG's SWIFT/BIC code (BOTKJPJTXXX)
- Purpose of payment / remittance information

Santander debits Maria's account for the equivalent amount (converting from EUR to USD at their exchange rate, plus fees).

### Step 2: SWIFT Message Creation

Santander creates an **MT103** (Single Customer Credit Transfer) message containing all payment details. The message is formatted according to SWIFT standards and includes a **UETR** for tracking.

### Step 3: Routing Decision

Santander checks: "Do we have a direct correspondent relationship with MUFG in Japan?"

**If YES** (direct relationship exists): Santander sends the MT103 directly to MUFG via SWIFTNet.

**If NO** (no direct relationship -- more common scenario): Santander must route through correspondent banks. Santander may have a USD nostro account at JPMorgan Chase in New York. MUFG also has a USD nostro account at JPMorgan (or at another US bank). The payment flows through the correspondent chain.

### Step 4: Correspondent Banking Chain (Indirect Route)

```
1. Santander creates MT103 --> sends to MUFG (beneficiary bank info)
2. Santander creates MT202 COV --> sends to JPMorgan (cover payment)
   "Please debit our nostro account for USD 10,000 and credit MUFG's account"
3. JPMorgan receives both messages
4. JPMorgan debits Santander's nostro account (-USD 10,000)
5. JPMorgan credits MUFG's nostro account (+USD 10,000)
   (This settlement may happen via Fedwire or CHIPS domestically in the US)
6. JPMorgan sends confirmation to both banks
7. MUFG, having received the MT103 with beneficiary details,
   credits Kenji's account with the USD equivalent in JPY (or USD if he has a USD account)
```

### Step 5: Settlement

The actual money movement happens between the nostro/vostro accounts at the correspondent bank. For USD transactions, final settlement occurs through **Fedwire** (the Federal Reserve's Real-Time Gross Settlement system) or **CHIPS** (Clearing House Interbank Payments System).

Fedwire directly adjusts Federal Reserve balances:
- Debits the sending bank's Federal Reserve balance
- Credits the receiving bank's Federal Reserve balance

### Step 6: Beneficiary Credited

MUFG credits Kenji's account. Kenji sees the funds. Both banks update the gpi Tracker to reflect "Completed."

### Step 7: Confirmation

Both sending and receiving banks update their records. Maria and Kenji may receive notifications from their respective banks.

### Timeline

- **Same day**: If all banks are in the same time zone and have direct relationships
- **1-2 days**: Typical for major currency corridors with established correspondent paths
- **3-5 days**: When multiple intermediaries are involved, or across exotic currency pairs, or when compliance holds occur

---

## 7. SWIFT Network Architecture

### SWIFTNet

**SWIFTNet** is the IP-based network infrastructure over which all SWIFT messaging services operate. It replaced the older X.25-based network. SWIFTNet provides the secure, reliable transport layer.

Key characteristics:
- IP-based (internet protocol family, but on a **private, dedicated network**, not the public internet)
- PKI-based security (Public Key Infrastructure with digital certificates)
- Operates through SWIFT's own data centers
- Redundant architecture with multiple operating centers

### Three Messaging Services

SWIFT operates three distinct messaging services over SWIFTNet:

#### FIN (1977 -- Present, being phased out)

- SWIFT's **original** and most widely known messaging service
- Carries **MT format** messages (based on ISO 15022)
- **Store-and-forward** architecture: Messages are stored by SWIFT until the receiver is ready
- Supports **individual message transmission** only (not batch)
- Features built-in message validation, acknowledgment (ACK/NAK), and delivery confirmation
- Being replaced by InterAct as part of the ISO 20022 migration

#### InterAct (Modern replacement for FIN)

- Carries **MX format** messages (based on ISO 20022, XML-based)
- Supports **real-time messaging** and **query-and-response** interactions
- Store-and-forward capability for correspondents not online at transmission time
- Much richer data capacity than FIN (structured XML can carry far more information than the text-based MT format)
- Supports both **real-time** and **store-and-forward** modes
- Required for gpi, instant payments, and modern use cases

#### FileAct (Bulk transfer service)

- Designed for **secure, reliable transfer of files** (not individual messages)
- **Format-agnostic**: Can handle MT files, MX files, CSV, PDF, spreadsheets, or any proprietary format
- Typical use cases:
  - Bulk/batch payments (salary runs, pension payments)
  - Regulatory reporting
  - Securities value-added information
  - Large reports and reference data
- Supports both real-time and store-and-forward delivery

### Alliance Interfaces

To connect to SWIFTNet, institutions use **Alliance** software packages:

- **Alliance Lite2**: Cloud-based, for smaller institutions with lower volumes
- **Alliance Access**: On-premise messaging interface (being replaced)
- **Alliance Gateway**: Communication gateway for connecting to SWIFTNet
- **Alliance Messaging Hub (AMH)**: Modern centralized messaging platform

---

## 8. BIC/SWIFT Codes

### What They Are

A **BIC** (Business Identifier Code), commonly called a "SWIFT code," is a standardized identifier for financial institutions, defined by **ISO 9362**. Every institution connected to SWIFT is assigned a unique BIC.

### Structure

A BIC is either **8 or 11 characters** long:

```
AAAA BB CC DDD
```

| Position | Characters | Name | Description |
|----------|-----------|------|-------------|
| 1-4 | AAAA | **Bank/Institution Code** | 4 letters identifying the bank. Usually a shortened version of the bank name. Example: DEUT = Deutsche Bank, CITI = Citibank |
| 5-6 | BB | **Country Code** | 2 letters, ISO 3166-1 alpha-2 country code. Example: DE = Germany, US = United States |
| 7-8 | CC | **Location Code** | 2 characters (letters or digits) indicating the head office location/city. Example: FF = Frankfurt, 33 = New York |
| 9-11 | DDD | **Branch Code** (optional) | 3 characters identifying a specific branch. If absent or "XXX", it refers to the head office |

### Examples

- **DEUTDEFFXXX**: Deutsche Bank, Germany (DE), Frankfurt (FF), Head Office (XXX)
- **CITIUS33XXX**: Citibank, United States (US), New York (33), Head Office
- **BSCHESMM**: Banco Santander, Spain (ES), Madrid (MM)

### BIC-8 vs BIC-11

- **BIC-8**: Identifies the institution at the country/city level
- **BIC-11**: Identifies a specific branch of the institution
- When only a BIC-8 is provided, the message is routed to the institution's head office or primary processing center

### Non-SWIFT BICs

Not all BICs indicate SWIFT connectivity. Some BICs are issued purely for identification purposes (e.g., for use in IBANs) without the institution being a SWIFT member. These are called "non-connected BICs" or "BIC-only" registrations.

---

## 9. SWIFT ISO 20022 Migration (MT to MX)

### What Is ISO 20022?

ISO 20022 is a **universal financial messaging standard** that uses XML syntax. It provides a common language and model for financial messages globally, allowing richer, more structured data than the legacy MT format.

### Why Migrate?

| Aspect | MT (Legacy) | MX (ISO 20022) |
|--------|------------|-----------------|
| Format | Proprietary text-based | XML (eXtensible Markup Language) |
| Data capacity | Limited character fields | Rich, structured data elements |
| Character set | Limited (mostly Latin) | Unicode (supports all languages) |
| Address format | Free text | Structured (street, city, postal code, country) |
| Remittance info | 4 x 35 characters | 9,000+ characters of structured data |
| Identifiers | Basic | LEI, structured party IDs |
| Interoperability | SWIFT-only | Used by SWIFT, SEPA, Fedwire, CHIPS, T2, and more |

### Migration Timeline

#### March 2023 -- Coexistence Begins
- SWIFT introduced the capability for banks to send cross-border payments in either MT or MX format
- Banks could continue using MT messages, which SWIFT would translate to MX for recipients that had migrated

#### November 22, 2025 -- End of Coexistence
- **All payment instructions must be sent in ISO 20022 MX format**
- MT messages sent after this date are **automatically converted** by SWIFT to MX format (In-Flow Translation)
- However, from **January 1, 2026**, additional charges are applied for:
  - Banks still sending in MT format (contingency processing fees)
  - Use of the In-Flow Translation service

#### November 2026 -- Key Deadlines
- **Structured addresses mandatory**: Unstructured address formats will be **rejected** (NAKed) starting November 15, 2026
- **Investigation and Enquiry messages**: Starting November 14, 2026, all financial institutions must be able to receive enquiry and investigation messages in MX format (camt.110, camt.111)

### Key MX Message Equivalents

| Legacy MT | ISO 20022 MX Equivalent | Description |
|-----------|------------------------|-------------|
| MT103 | pacs.008 | Customer Credit Transfer |
| MT202 | pacs.009 | Financial Institution Credit Transfer |
| MT202 COV | pacs.009 (cover) | Cover Payment |
| MT900 | camt.054 | Debit Notification |
| MT910 | camt.054 | Credit Notification |
| MT940 | camt.053 | End-of-Day Statement |
| MT942 | camt.052 | Intraday Statement |
| MT192/MT292 | camt.056 | Cancellation Request |

### CBPR+ (Cross-Border Payments and Reporting Plus)

CBPR+ is the usage guidelines developed by SWIFT for ISO 20022 messages in cross-border payments. It defines how the ISO 20022 standard should be used specifically in the SWIFT network context, ensuring interoperability between all participants.

---

## 10. Costs and Fees

### Why SWIFT Transfers Are Expensive

SWIFT transfers involve multiple layers of fees, making them significantly more expensive than domestic transfers:

#### 1. SWIFT Network Fees
- SWIFT charges member institutions for **every message** sent over the network
- Banks pay **annual membership fees** and recurring connectivity costs
- These costs are passed on to customers

#### 2. Sending Bank Fees
- The originating bank charges a fee for initiating the wire transfer
- Typically USD 15-50 for outgoing international wires

#### 3. Correspondent/Intermediary Bank Fees
- Each intermediary bank in the chain charges a handling fee
- Typically USD 15-50 per intermediary
- If a payment passes through 2 intermediaries, that is USD 30-100 in additional fees
- These fees may be **deducted from the payment amount** (unless the sender chooses "OUR" charging)

#### 4. Receiving Bank Fees
- The beneficiary's bank often charges an incoming wire fee
- Typically USD 10-30

#### 5. Foreign Exchange Markup
- Banks apply a margin (typically **2-4%**) over the mid-market exchange rate
- On a USD 100,000 payment, a 2% FX markup costs **USD 2,000** -- far exceeding the wire fees
- This is often the largest hidden cost

#### 6. Lifting Fees
- Some banks charge "lifting fees" -- a percentage of the transferred amount

#### 7. Regulatory and Compliance Costs
- AML/KYC screening costs are indirectly passed to customers
- Enhanced due diligence for certain jurisdictions adds cost

#### 8. Other Fees
- **Amendment fees**: If payment details need correction
- **Investigation/tracing fees**: If a payment is delayed and needs tracking
- **Cancellation fees**: If a payment needs to be recalled
- **Express/priority processing**: Same-day processing may cost USD 50-100 extra

### Total Cost Example

A typical international wire transfer might cost:

| Fee Component | Amount |
|--------------|--------|
| Sending bank fee | $30 |
| Correspondent bank 1 | $20 |
| Correspondent bank 2 | $15 |
| Receiving bank fee | $15 |
| FX markup (on $10,000) | $200-400 |
| **Total** | **$280-480** |

### The Core Problem: Opacity

Each bank in the correspondent chain operates independently. No single entity has end-to-end visibility into the total fees that will be charged. This is why:
- Fees accumulate unpredictably
- Beneficiaries often receive less than the stated amount
- SWIFT gpi was created largely to solve this transparency problem

---

## 11. Settlement: How Actual Money Moves

### The Fundamental Distinction

**SWIFT handles messaging. Settlement systems handle money movement.**

These are completely separate systems:

| Function | System |
|----------|--------|
| Messaging (instructions) | SWIFT (FIN, InterAct, FileAct) |
| USD Settlement | Fedwire (RTGS), CHIPS (netting) |
| EUR Settlement | TARGET2/T2 (RTGS), EURO1 (netting) |
| GBP Settlement | CHAPS (RTGS) |
| JPY Settlement | BOJ-NET (RTGS) |
| Multi-currency | CLS (for FX settlement) |

### How Settlement Works

#### Clearing vs. Settlement

- **Clearing**: The process of transmitting, reconciling, and confirming payment obligations between banks. Determines **who owes what to whom**.
- **Settlement**: The actual **final transfer of funds** between banks' accounts, achieving **finality** (irrevocability).

#### Real-Time Gross Settlement (RTGS)

In RTGS systems (like Fedwire, T2), each payment is settled **individually and immediately** in central bank money:
1. The sending bank has an account at the central bank
2. The central bank debits the sender's account
3. The central bank credits the receiver's account
4. Settlement is **final and irrevocable**

Advantage: No credit risk (settlement in central bank money is risk-free)
Disadvantage: Requires large liquidity buffers

#### Net Settlement

In netting systems (like CHIPS, EURO1), payments are accumulated and **netted** against each other:
1. During the day, banks send and receive many payments
2. At end of day (or at intervals), the system calculates the **net position** for each bank
3. Only the net amounts are settled through the RTGS system
4. A bank that sent $1 billion and received $900 million only settles the net $100 million

Advantage: Much less liquidity needed
Disadvantage: Settlement risk until netting is completed

### Settlement for USD (United States)

- **Fedwire Funds Service**: RTGS operated by the Federal Reserve. Settles in real-time, payment by payment, in central bank money (Fed balances). Operating hours approximately 21 hours per business day.
- **CHIPS** (Clearing House Interbank Payments System): Privately operated by The Clearing House. Processes approximately 95% of US cross-border payments. Uses **continuous bilateral netting** with periodic settlement through Fedwire.

### Settlement for EUR (Eurozone)

- **T2** (formerly TARGET2): RTGS operated by the Eurosystem (ECB + national central banks). Settles in central bank money. Replaced TARGET2 in March 2023.
- **EURO1**: Operated by EBA Clearing. Large-value payment system using multilateral netting with end-of-day settlement through T2.

---

## 12. Security

### SWIFT's Security Architecture

SWIFT employs multiple layers of security:

#### Network Security
- **Private network**: SWIFTNet operates on a dedicated, private network infrastructure -- not the public internet
- **PKI (Public Key Infrastructure)**: All communications use digital certificates for authentication and encryption
- **HSM (Hardware Security Modules)**: Cryptographic operations are performed in tamper-resistant hardware
- **Two-factor authentication**: Required for all operator access

#### Message Security
- **Message Authentication Code (MAC)**: Every FIN message includes a MAC in the trailer block, calculated using bilateral keys shared between sender and receiver. This ensures message integrity and authenticity.
- **End-to-end encryption**: Messages are encrypted in transit
- **Non-repudiation**: SWIFT provides evidence that a message was sent and received, which neither party can deny

### The Bangladesh Bank Heist (February 2016)

#### What Happened
In February 2016, hackers (later attributed to North Korea's Lazarus Group) infiltrated the Bangladesh Bank's systems and sent **35 fraudulent SWIFT messages** to the Federal Reserve Bank of New York, instructing it to transfer nearly **USD 1 billion** from Bangladesh Bank's account to various accounts in the Philippines and Sri Lanka.

#### How It Worked
1. Hackers spent nearly a year inside Bangladesh Bank's network, studying operations
2. They installed malware that could interact with SWIFT's Alliance Access software
3. They generated fraudulent MT103 payment instructions
4. They manipulated the local SWIFT software to delete traces of the fraudulent messages
5. They timed the attack for a weekend (Friday in New York = Saturday in Bangladesh) to maximize the window before detection

#### Outcome
- **USD 81 million** was successfully stolen (transferred to accounts in the Philippines, then laundered through casinos)
- **USD 20 million** to Sri Lanka was blocked (a typo -- "fandation" instead of "foundation" -- triggered a manual review)
- The remaining **USD 850 million** in fraudulent requests was blocked by the Fed due to routing concerns

#### Critical Point
**SWIFT itself was not hacked.** The attackers compromised Bangladesh Bank's local systems and their interface to SWIFT. SWIFT's core network remained secure. However, the incident exposed that the security of the overall system is only as strong as its **weakest participant**.

### Customer Security Programme (CSP)

In direct response to the Bangladesh Bank heist, SWIFT launched the **Customer Security Programme (CSP)** in May 2016.

#### Customer Security Controls Framework (CSCF)

The CSCF defines a set of **mandatory and advisory security controls** that all SWIFT users must implement:

**Mandatory Controls** (must comply):
1. Restrict internet access from the SWIFT-related environment
2. Segregate SWIFT environment from general IT
3. Reduce attack surface and vulnerabilities
4. Physically secure the SWIFT environment
5. Prevent compromise of credentials
6. Manage identities and separate privileges
7. Detect anomalous activity in SWIFT systems or transaction records
8. Plan for incident response and information sharing

**Advisory Controls** (strongly recommended):
- Additional intrusion detection
- Multi-factor authentication for all SWIFT-related functions
- Personnel vetting
- Cyber security training
- Independent security assessments

#### Attestation and Compliance
- All SWIFT users must **annually self-attest** their compliance with mandatory controls
- Starting in 2021, **independent assessments** (external audit) became mandatory
- Non-compliant institutions are reported to their local regulators and counterparts
- Counterparts can see each other's compliance status in the SWIFT KYC Registry

#### Impact
The amount of funds subject to attack has been **reduced by a factor of three** since the inception of CSP.

---

## 13. Geopolitical Aspects: SWIFT as a Sanctions Tool

### SWIFT's Position

SWIFT maintains that it is a **neutral, global utility** and does not make sanctions decisions on its own. However, as a Belgian cooperative, it is subject to **EU law**, and it complies with EU regulations requiring disconnection of sanctioned entities.

### Iran Disconnections

#### 2012: First Disconnection
- Under pressure from EU sanctions (linked to Iran's nuclear program), SWIFT disconnected **Iranian banks** including the Central Bank of Iran
- US legislation authorized the president to impose sanctions on entities providing financial messaging services to designated Iranian institutions
- Impact: Iran lost access to the global financial messaging system, severely impacting its ability to receive payment for oil exports and conduct international trade
- Widely considered one of the most powerful non-military sanctions ever imposed

#### 2015-2016: Partial Reconnection
- Following the JCPOA (Iran nuclear deal), some Iranian banks were reconnected to SWIFT
- However, the Central Bank of Iran and several major banks remained under US sanctions

#### 2018: Re-disconnection
- When the US withdrew from the JCPOA under the Trump administration, SWIFT again disconnected Iranian banks to comply with re-imposed sanctions

### Russia Disconnection (2022)

#### What Happened
Following Russia's invasion of Ukraine in February 2022, the EU (with coordinated support from the US, UK, and allies) mandated the disconnection of **seven major Russian banks** from SWIFT:
- Bank Otkritie
- Novikombank
- Promsvyazbank
- Bank Rossiya
- Sovcombank
- VEB (Vnesheconombank)
- VTB Bank

Notably, **Sberbank** (Russia's largest bank) and **Gazprombank** were initially excluded to allow continued payment for energy imports.

#### Impact
- The disconnected banks accounted for approximately **1-1.5% of SWIFT's daily traffic** and approximately **USD 700-800 billion in annual cross-border flows**
- The Russian ruble plunged **over 30%** in the weeks following the announcement
- Capital flight and market volatility drew comparisons to the 2014 Crimea annexation aftermath

#### Long-term Consequences
The weaponization of SWIFT has had significant strategic implications:
- It demonstrated that **financial infrastructure can be weaponized** as effectively as military assets
- It accelerated the development of **alternative systems** (CIPS, SPFS)
- It raised concerns about the **fragmentation of the global financial system** into competing blocs
- Some countries began actively reducing their dependence on SWIFT and the US dollar

---

## 14. Alternatives to SWIFT

### CIPS (Cross-Border Interbank Payment System) -- China

**Launched**: October 2015
**Operator**: People's Bank of China (PBOC)
**Purpose**: Support clearing and settlement of cross-border RMB transactions

**Key Details**:
- As of late 2025: **190 direct participants** and **1,567 indirect participants** across **124 countries**
- 2024 volume: RMB 175.49 trillion (~USD 24.45 trillion), up 43% year-over-year
- 2025 volume: RMB 180.2 trillion (~USD 26.4 trillion)
- Provides cross-border services to over 5,000 banking institutions across 190 countries
- Supports RMB-versus-foreign-currency payment-versus-payment services (as of February 2026 rule changes)

**Important nuance**: CIPS is not purely an alternative to SWIFT -- it actually **uses SWIFT messaging** for some of its communications. CIPS is more accurately a **payment and settlement system** (like Fedwire or CHIPS) rather than a messaging network. However, it also has its own messaging capability that can bypass SWIFT.

### SPFS (System for Transfer of Financial Messages) -- Russia

**Development started**: 2014 (in response to threats of SWIFT disconnection after Crimea)
**Operator**: Central Bank of Russia
**Purpose**: Domestic alternative to SWIFT for financial messaging

**Key Details**:
- Operates **24/7/365**
- As of late 2023: **556 participants**, of which 159 are non-residents from 20 countries
- By 2025: Expanded to **177 participants across 24 countries** (international reach)
- Supports SWIFT MT formats, proprietary formats, and ISO 20022 messages
- Expanded rapidly after 2022 Russian bank disconnections from SWIFT

**Limitations**:
- Far smaller network than SWIFT
- International adoption limited by **sanctions risk**: OFAC (US Treasury) warned in November 2024 that institutions joining SPFS will be subject to "aggressive targeting"
- In February 2025, the EU's 16th sanctions package designated three foreign banks (in Armenia and Kazakhstan) for facilitating transactions via SPFS

### Ripple / RippleNet

**Type**: Blockchain-based cross-border payment network
**Token**: XRP (used as a bridge currency for liquidity)

**Key Characteristics**:
- Transaction finality: **3-5 seconds** (vs. 1-5 days for traditional SWIFT)
- Cost: **Fractions of a cent** per transaction
- Throughput: 1,500 transactions per second on XRP Ledger
- Uses XRP as an optional bridge asset to provide liquidity without requiring nostro/vostro accounts

**Status**: Some financial institutions use RippleNet for specific corridors, but it has not replaced SWIFT for mainstream interbank payments. The future likely involves **coexistence**: SWIFT messaging for compliance verification and RippleNet for settlement.

### Other Alternatives

- **Fedwire**: US domestic RTGS (not a SWIFT alternative per se, but handles USD settlement)
- **BACS**: UK domestic payment system
- **BECS**: Australia's Bulk Electronic Clearing System
- **EFT**: Canada's Electronic Funds Transfer system
- **Stablecoins**: Emerging alternative for B2B cross-border settlement, growing in 2025-2026

---
---

# PART TWO: SEPA (Single Euro Payments Area)

---

## 1. History and Overview

### Background and Motivation

The concept of SEPA emerged from the broader European project of economic integration. When the euro was introduced as a currency (1999 for electronic transactions, 2002 for banknotes and coins), cross-border payments within the eurozone remained fragmented -- each country still had its own domestic payment schemes, formats, and clearing systems. A German paying a French supplier still faced higher costs, longer processing times, and more complexity than paying a German supplier.

The EU authorities wanted to create a **single market for payments** -- where electronic euro payments across borders would be as easy, fast, and cheap as domestic payments.

### Timeline of SEPA Development

| Year | Event |
|------|-------|
| 1999 | Euro introduced for electronic transactions |
| 2001 | EU Regulation 2560/2001: Cross-border euro payments must be priced the same as domestic |
| 2002 | **European Payments Council (EPC) created** by the European banking industry |
| 2006 | Payment Services Directive (PSD1) adopted |
| 2008 | **SEPA Credit Transfer (SCT) launched** (January 28) |
| 2009 | **SEPA Direct Debit (SDD) launched** (November) |
| 2012 | SEPA end-date regulation: All eurozone countries must migrate to SEPA by February 2014 |
| 2014 | **SEPA migration deadline** (February 1) -- all euro credit transfers and direct debits must use SEPA formats |
| 2016 | "IBAN-only" rule takes effect (BIC no longer required for cross-border SEPA payments) |
| 2017 | **SEPA Instant Credit Transfer (SCT Inst) launched** (November) |
| 2018 | PSD2 comes into effect |
| 2025 | SCT Inst rulebook updated; maximum amount raised to EUR 999,999,999.99; processing timeline reduced to 5-7-9 seconds |

### The European Payments Council (EPC)

The **EPC** is an international not-for-profit association representing European payment service providers. Key facts:

- Created in **2002** by the European banking industry
- Develops and maintains the **SEPA payment schemes** (SCT, SDD, SCT Inst)
- Publishes **rulebooks** that define how each scheme operates
- The EPC is **not part of the EU institutional framework** -- it does not adopt EU laws or manage the overall SEPA regulatory process
- It is a **self-regulatory body** of the payments industry

### Geographic Scope

SEPA encompasses **41 countries** (as of 2025-2026):

**EU Member States (27)**:
Austria, Belgium, Bulgaria, Croatia, Cyprus, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Ireland, Italy, Latvia, Lithuania, Luxembourg, Malta, Netherlands, Poland, Portugal, Romania, Slovakia, Slovenia, Spain, Sweden

**EFTA Member States (4)**:
Iceland, Liechtenstein, Norway, Switzerland

**United Kingdom** (post-Brexit, remains in SEPA)

**Microstates and Territories (5)**:
Andorra, Monaco, San Marino, Vatican City, plus associated territories

**Additional**: Several EU candidate countries also participate (e.g., North Macedonia)

**Note**: SEPA covers these countries but only handles payments in **EUR**. Non-eurozone SEPA countries (like Sweden, Hungary, UK) can use SEPA for EUR-denominated payments even though their domestic currency is different.

---

## 2. SEPA Schemes

### 2.1 SEPA Credit Transfer (SCT)

#### What It Is
A **push payment** scheme: the payer (debtor) instructs their bank to send money to the payee (creditor). The payer initiates the payment.

#### How It Works
1. Payer submits a payment instruction to their PSP (Payment Service Provider / bank)
2. The instruction contains: IBAN of beneficiary, amount, remittance information
3. Payer's bank validates the instruction and checks funds availability
4. Payer's bank sends the payment through a **Clearing and Settlement Mechanism (CSM)**
5. CSM routes the payment to the beneficiary's bank
6. Beneficiary's bank credits the payee's account

#### Key Characteristics

| Feature | Detail |
|---------|--------|
| Currency | EUR only |
| Maximum amount | EUR 999,999,999.99 (theoretical; banks set practical limits) |
| Minimum amount | No minimum |
| Execution time | Maximum **1 business day** (D+1) from the point of receipt |
| Credit time | Beneficiary receives funds by end of **next business day** |
| Charges | **SHARE** principle only (each party pays their own bank's fees) |
| Fee deduction | **Prohibited** -- the full amount must be credited to the beneficiary |
| Recall | Possible within 10 business days for duplicate/technical errors |
| Refund request | Possible within 13 months for suspected fraud |
| Identification | IBAN only (BIC not required since 2016) |
| Message format | ISO 20022 XML |

#### Cut-off Times
Each PSP sets its own cut-off time (typically 14:00-16:00 CET). Payments submitted before the cut-off are processed same-day and credited next business day. Payments after the cut-off are processed the next business day.

### 2.2 SEPA Instant Credit Transfer (SCT Inst)

#### What It Is
A **real-time** version of SCT. Funds are transferred and made available to the beneficiary within seconds, 24 hours a day, 365 days a year (including weekends and holidays).

#### The Processing Timeline

The original "10-second rule" has been refined. As of the 2025 rulebook update:

**5-7-9 Second Timeline**:
1. **T+0 seconds**: Payer's PSP receives the payment instruction (marks "time of receipt")
2. **Within 5 seconds**: Payer's PSP must process and forward to the CSM
3. **Within 7 seconds**: CSM must clear and forward to payee's PSP
4. **Within 9 seconds**: Payee's PSP must credit the beneficiary's account and send confirmation back through the chain

The total end-to-end processing must complete within **a maximum of 9 seconds** (reduced from the original 10 seconds, and previously proposed 20-25 seconds).

#### Key Characteristics

| Feature | Detail |
|---------|--------|
| Availability | **24/7/365** (no business day restrictions) |
| Currency | EUR only |
| Maximum amount | EUR 999,999,999.99 (raised from EUR 100,000 in the 2025 rulebook update under the Instant Payments Regulation) |
| Processing time | Maximum **9 seconds** end-to-end |
| Settlement | In central bank money (via TIPS or RT1) |
| Irrevocability | Payment is irrevocable once confirmed -- no recall mechanism (unlike SCT) |
| Message format | ISO 20022 XML (pacs.008 for initiation, pacs.002 for status) |

#### Instant Payments Regulation (IPR) -- 2025

The EU's **Instant Payments Regulation** (in force from 2025) mandates:
- All PSPs offering SCT must also offer SCT Inst (phased rollout)
- SCT Inst fees must be **no higher** than SCT fees
- Verification of Payee (VoP) must be offered to prevent fraud
- Amount limit raised to match SCT (effectively unlimited, EUR 999,999,999.99)

### 2.3 SEPA Direct Debit (SDD)

#### What It Is
A **pull payment** scheme: the creditor (payee) instructs their bank to collect funds from the debtor's (payer's) account. The payee initiates the payment. This is the opposite of a credit transfer.

Common uses: recurring payments like subscriptions, utility bills, insurance premiums, loan repayments, gym memberships.

#### The Mandate

Before any direct debit can be collected, the debtor must sign a **mandate** authorizing the creditor to collect payments. The mandate contains:
- Unique Mandate Reference (UMR)
- Creditor Identifier (CI)
- Debtor's IBAN
- Type: **one-off** or **recurrent**
- Date of signing
- Debtor's signature (can be electronic)

The mandate is stored by the **creditor** (not the bank). The creditor is responsible for mandate management.

#### Two Schemes

##### SDD Core (Consumer-focused)

| Feature | Detail |
|---------|--------|
| Payer type | Consumers and businesses |
| Mandate verification | Payer's bank does **not** verify mandate -- accepts mandate-related info with first collection |
| Refund right | Payer can request refund for **authorized** transactions within **8 weeks** |
| Unauthorized refund | Payer can claim refund for **unauthorized** transactions within **13 months** |
| Pre-notification | Creditor must notify debtor at least **14 calendar days** before collection (can be shortened by agreement) |
| Processing time | D-1 (submission 1 business day before due date for recurrent), D-1 for first/one-off since November 2016 |
| Rejection window | Payer's bank has until end of settlement day to reject |

##### SDD B2B (Business-to-Business)

| Feature | Detail |
|---------|--------|
| Payer type | **Businesses only** (no consumers) |
| Mandate verification | Payer's bank **must verify and validate** the mandate before processing each collection |
| Refund right | **No refund right** for authorized transactions |
| Unauthorized refund | 13 months for unauthorized transactions |
| Processing time | D-1 (1 business day before due date) |
| Return window | Payer's bank has **2 TARGET days** to return (vs. 5 for Core) |
| Mandate storage | Must be stored at both creditor AND debtor's bank |

#### Direct Debit Flow (SDD Core)

1. **Mandate signing**: Debtor signs mandate authorizing creditor
2. **Pre-notification**: Creditor notifies debtor of upcoming collection (amount, date)
3. **Collection submission**: Creditor submits collection instruction to their bank (as a pain.008 XML file), typically in batch
4. **Creditor's bank processing**: Validates the instruction, forwards to CSM
5. **CSM clearing**: Routes to debtor's bank
6. **Debtor's bank processing**: Checks debtor's account, debits the amount
7. **Settlement**: Funds settle through the CSM
8. **Creditor credited**: Creditor's bank credits the creditor's account

### 2.4 SEPA Cards Framework (SCF)

#### Purpose

The SCF defines standards so that card payments and ATM withdrawals work uniformly across all SEPA countries -- meaning a card issued in any SEPA country should be accepted in all SEPA countries with the same ease as domestically.

#### Key Principles

1. **Universal acceptance**: Any SEPA card must work everywhere in SEPA
2. **Harmonized pricing**: No price discrimination based on country
3. **EMV security**: All cards must use chip technology (EMV standard); magnetic stripe fallback is deprecated
4. **PIN authentication**: Transactions must be authenticated by PIN entry

#### Technical Foundation
- Based on **EMV chip standards** defined by EMVCo
- The **SEPA Cards Standardisation Volume** (currently version 10.0, published October 2022) defines detailed technical requirements
- Separation of card scheme management from card processing operations
- Interoperability requirements for terminals, cards, and processing systems

---

## 3. How SEPA Payments Flow -- Step by Step

### SEPA Credit Transfer (SCT) Flow

#### Participants
- **Originator (Debtor/Payer)**: Person or company sending money
- **Originator PSP**: Payer's bank
- **CSM**: Clearing and Settlement Mechanism (e.g., STEP2-T, national ACH, TIPS)
- **Beneficiary PSP**: Payee's bank
- **Beneficiary (Creditor/Payee)**: Person or company receiving money

#### Detailed Flow

```
Step 1: INITIATION
Payer submits payment instruction to Originator PSP
(via online banking, ERP system, EBICS, API, or bank branch)
Message format: pain.001 (Customer Credit Transfer Initiation)

Step 2: VALIDATION
Originator PSP validates:
- IBAN format and check digits
- Sufficient funds in payer's account
- Sanctions/AML screening
- Cut-off time compliance
Originator PSP debits payer's account

Step 3: CLEARING
Originator PSP submits the payment to a CSM
Message format: pacs.008 (FI-to-FI Customer Credit Transfer)
The CSM can be:
  - STEP2-T (pan-European ACH by EBA Clearing)
  - A national CSM (e.g., Bundesbank's EMZ for Germany)
  - TIPS (for instant payments)

Step 4: CSM PROCESSING
The CSM:
- Validates the message
- Routes it to the Beneficiary PSP
- Initiates settlement (see next step)
- Returns a status message (pacs.002)

Step 5: SETTLEMENT
The CSM settles the payment:
  For STEP2-T: Continuous Gross Settlement (CGS) in T2
    - Debit Originator PSP's TARGET account
    - Credit Beneficiary PSP's TARGET account
  For national CSMs: Settlement through T2 or national RTGS
Settlement is in central bank money (risk-free)

Step 6: BENEFICIARY PROCESSING
Beneficiary PSP receives the payment instruction
Credits the payee's account with the full amount
(No fee deduction from the payment amount is permitted)

Step 7: CONFIRMATION
- Originator PSP sends status report to payer (pain.002)
- Beneficiary PSP notifies payee of incoming credit
```

#### Timeline
- **Standard SCT**: Credited by end of next business day (D+1)
- **SCT Inst**: Credited within 9 seconds, 24/7/365

### SEPA Direct Debit (SDD) Flow

```
Pre-requisite: Mandate signed by Debtor authorizing Creditor

Step 1: PRE-NOTIFICATION
Creditor notifies Debtor of upcoming collection
(amount, date, mandate reference)
Timeline: At least 14 calendar days before (or as agreed)

Step 2: COLLECTION SUBMISSION
Creditor creates collection file and submits to Creditor's PSP
Message format: pain.008 (Customer Direct Debit Initiation)
Often submitted as a batch file via EBICS or bank portal
Contains: mandate info, amount, due date, debtor IBAN

Step 3: CREDITOR PSP PROCESSING
Creditor's PSP validates the collection instruction
Forwards to CSM on the appropriate date
Message format: pacs.003 (FI-to-FI Customer Direct Debit)

Step 4: CSM CLEARING
CSM routes the collection to the Debtor's PSP
Settlement occurs (funds move from debtor's bank to creditor's bank)

Step 5: DEBTOR PSP PROCESSING
Debtor's PSP receives the collection
Checks: account exists, sufficient funds, no opposition
Debits the debtor's account

Step 6: CREDITOR CREDITED
Creditor's PSP credits the creditor's account
On the due date (D)

Step 7: POTENTIAL R-TRANSACTIONS
Various exception scenarios can occur (see Section 9)
```

---

## 4. IBAN Structure

### What Is an IBAN?

The **International Bank Account Number (IBAN)** is a standardized alphanumeric code that uniquely identifies a bank account for international transactions. Defined by **ISO 13616**.

### Structure

An IBAN consists of up to **34 alphanumeric characters**:

```
CC KK BBAN
```

| Component | Length | Description |
|-----------|--------|-------------|
| CC | 2 characters | **Country Code** (ISO 3166-1 alpha-2). Example: DE (Germany), FR (France), ES (Spain) |
| KK | 2 digits | **Check Digits** (calculated using MOD-97 algorithm per ISO 7064). Validates the entire IBAN to detect transcription errors |
| BBAN | Up to 30 characters | **Basic Bank Account Number** -- the domestic account identifier, whose format is defined by each country's national authority |

### BBAN Structure (varies by country)

The BBAN contains the **domestic bank routing code** and **account number**. Its structure is country-specific:

| Country | IBAN Length | BBAN Structure | Example IBAN |
|---------|------------|----------------|-------------|
| Germany (DE) | 22 | 8-digit bank sort code (Bankleitzahl) + 10-digit account number | DE89 3704 0044 0532 0130 00 |
| France (FR) | 27 | 5-digit bank code + 5-digit branch code + 11-char account number + 2-digit national check | FR76 3000 6000 0112 3456 7890 189 |
| Spain (ES) | 24 | 4-digit bank code + 4-digit branch code + 2-digit check + 10-digit account number | ES91 2100 0418 4502 0005 1332 |
| Netherlands (NL) | 18 | 4-letter bank code + 10-digit account number | NL91 ABNA 0417 1643 00 |
| UK (GB) | 22 | 4-letter bank code + 6-digit sort code + 8-digit account number | GB29 NWBK 6016 1331 9268 19 |

### How IBAN Routing Works in SEPA

Since the **"IBAN-only" rule** (February 2016), the IBAN is **sufficient** to route a SEPA payment. No BIC/SWIFT code is needed.

The routing process:
1. The **country code** (first 2 characters) identifies the country
2. The **bank code** embedded in the BBAN identifies the specific bank/PSP
3. Each country maintains a **routing table** that maps bank codes to institutions
4. The CSM uses these routing tables to direct the payment to the correct beneficiary PSP

### Check Digit Validation (MOD-97)

The 2-digit check number provides error detection:
1. Move the first 4 characters (country code + check digits) to the end
2. Replace letters with numbers (A=10, B=11, ..., Z=35)
3. Calculate the remainder when dividing by 97
4. A valid IBAN produces a remainder of **1**

This check is **guaranteed to detect**:
- Any single character substitution
- Any single character omission or duplication
- Any transposition of two adjacent characters

### Global Adoption

As of December 2024, **89 countries** use the IBAN numbering system. However, some major economies (notably the United States, Canada, Australia) do not use IBAN domestically.

---

## 5. Clearing and Settlement Mechanisms

### Overview

SEPA payments are cleared and settled through various **Clearing and Settlement Mechanisms (CSMs)**. These operate at three levels:

1. **Pan-European ACHs (PE-ACH)**: Offer reach across all SEPA countries
2. **National CSMs**: Connect PSPs within a single country
3. **Bilateral arrangements**: Direct connections between PSPs

### EBA Clearing Systems

**EBA Clearing** is a company owned by major European banks. It operates three key systems:

#### EURO1 (Large-Value Payments)

- **Purpose**: Processing large-value and urgent euro payments between banks
- **Type**: **Multilateral netting** system with end-of-day settlement
- **Settlement**: Through ECB (T2) in central bank money
- **Participants**: Major European and international banks
- **Status**: Designated as a **Systemically Important Payment System (SIPS)** by the ECB
- **How it works**: EURO1 continuously adjusts the accounts of participant banks throughout the day. At end of day, multilateral net positions are calculated and settled through T2.

#### STEP2-T (Pan-European ACH for Retail Payments)

- **Purpose**: Processing mass/bulk euro payments (SEPA credit transfers and direct debits)
- **Type**: Pan-European Automated Clearing House
- **Settlement model**: **Continuous Gross Settlement (CGS)** since 2020
  - Each individual bilateral payment is settled in real time
  - Settlement occurs in central bank money via the ECB's TARGET Technical Account
  - Participants maintain a funds balance funded from their T2 RTGS account
- **Previous model**: Cycle-based settlement (daily settlement cycles) -- fully migrated to CGS by July 2022
- **Reachability**: Connects PSPs across all SEPA countries
- **Status**: Designated as a SIPS by the ECB

#### RT1 (Real-Time/Instant Payments)

- **Purpose**: Processing SEPA Instant Credit Transfers (SCT Inst)
- **Availability**: 24/7/365
- **Settlement**: In central bank money via TIPS
- **Processing time**: Under 10 seconds end-to-end

### TARGET2 / T2 (Real-Time Gross Settlement)

#### History
- **TARGET** (Trans-European Automated Real-time Gross settlement Express Transfer): Launched 1999
- **TARGET2**: Replaced TARGET in 2007-2008 with a single shared platform (SSP)
- **T2**: Replaced TARGET2 on **20 March 2023** as part of the T2-T2S Consolidation project

#### What T2 Is

T2 is the **Eurosystem's Real-Time Gross Settlement (RTGS) system** for euro payments. Operated by the ECB and national central banks.

It settles payments:
- **In real time** (immediately, one by one)
- **Gross** (full amount, no netting)
- **In central bank money** (the safest possible settlement asset)

#### T2 Architecture (Post-Consolidation)

The 2023 consolidation introduced a modern, multi-service architecture:

```
T2 Platform
  |
  +-- CLM (Central Liquidity Management)
  |     Main Cash Account (MCA)
  |     Manages and monitors overall liquidity
  |
  +-- RTGS (Real-Time Gross Settlement)
  |     Dedicated Cash Account (DCA)
  |     Settles individual large-value payments
  |
  +-- TIPS (TARGET Instant Payment Settlement)
  |     Dedicated Cash Account (DCA)
  |     Settles instant payments 24/7/365
  |
  +-- T2S (TARGET2-Securities)
        Dedicated Cash Account (DCA)
        Settles the cash leg of securities transactions
```

**Central Liquidity Management (CLM)**: The major innovation. Participants have a single **Main Cash Account (MCA)** from which they can allocate liquidity to the various settlement services (RTGS, TIPS, T2S) via **Dedicated Cash Accounts (DCAs)**.

**Connectivity**: All access is through **ESMIG** (Eurosystem Single Market Infrastructure Gateway), the single access point to Eurosystem market infrastructures.

**Messaging**: T2 uses **ISO 20022** format (like T2S and TIPS).

### TIPS (TARGET Instant Payment Settlement)

#### Overview
Launched by the Eurosystem in **November 2018**. A market infrastructure service that settles SCT Inst payments in central bank money, 24/7/365.

#### How TIPS Works -- Technical Flow

```
1. Originator PSP sends SCT Inst payment to TIPS
   (or via a connected CSM like RT1)
2. TIPS validates the incoming message
3. TIPS checks if the payee's PSP is reachable
4. TIPS reserves the amount from the originator's DCA
5. TIPS forwards the payment to the beneficiary PSP for acceptance
6. Beneficiary PSP sends positive reply (or rejection)
7. TIPS performs settlement:
   - Debits originator PSP's DCA in TIPS
   - Credits beneficiary PSP's DCA in TIPS
8. TIPS confirms settlement to both parties
```

#### Technical Characteristics
- End-to-end processing: **Under 10 seconds** (target: under 5 seconds)
- Designed for **very high volumes** and scalability
- **No maintenance windows** -- zero downtime
- Settlement in **central bank money** (risk-free)
- Liquidity transfers between TIPS DCA and T2 RTGS only during T2 operating hours

### National CSMs

Many countries maintain their own national clearing systems that connect to the pan-European infrastructure:

| Country | National CSM |
|---------|-------------|
| Germany | EMZ (operated by Bundesbank) |
| France | CORE (operated by STET) |
| Italy | BI-COMP (operated by Banca d'Italia) |
| Spain | SNCE (operated by Iberpay) |
| Netherlands | Equens (now part of Worldline) |

These national CSMs typically settle through **T2** (RTGS) for final settlement in central bank money.

---

## 6. The Role of the ECB

### Statutory Mandate

The Eurosystem's mandate to "promote the smooth operation of payment systems" is enshrined in:
- **Article 127(2)** of the Treaty on the Functioning of the EU (TFEU)
- **Article 3.1** of the Statute of the ESCB (European System of Central Banks)

### ECB's Roles in SEPA

#### 1. Catalyst and Promoter
The ECB was instrumental in pushing the creation of SEPA, setting expectations for the banking industry, and monitoring the migration process.

#### 2. Overseer of Payment Systems
The ECB oversees payment systems to ensure they are **safe and efficient**:
- Direct oversight of **SIPSs** (Systemically Important Payment Systems): T2, EURO1, STEP2-T, CLS
- Oversight of pan-European payment schemes (SCT, SDD, SCT Inst)
- Cooperative oversight with national central banks for systems with national anchors

#### 3. Operator of Market Infrastructure
The Eurosystem directly operates:
- **T2** (RTGS system)
- **TIPS** (instant payment settlement)
- **T2S** (securities settlement)

#### 4. Regulator
Through ECB regulations:
- **SIPS Regulation** (ECB/2017/32): Sets requirements for systemically important payment systems
- **Oversight Framework for Retail Payment Systems**: Standards for euro retail payment systems

#### 5. Standard Setter
The ECB actively promotes:
- ISO 20022 adoption
- Migration to instant payments
- Harmonization of European payment standards

### Shared Oversight Model

- For systems with a **national anchor**: The national central bank (NCB) of the country where the system is incorporated is the primary overseer
- For systems with **no national anchor** (pan-European): The ECB is the lead overseer
- **Joint oversight** is conducted when both ECB and NCBs have oversight interests

---

## 7. PSD2 and Its Impact on SEPA

### What Is PSD2?

The **Payment Services Directive 2** (Directive 2015/2366) is EU legislation that came into effect in **January 2018**. It replaced the original PSD (2007), which had created the legal foundation for SEPA.

### Key Elements

#### Open Banking -- Third-Party Access

PSD2's most transformative provision: banks must **open their payment account APIs** to regulated third-party providers (with customer consent).

Two new types of licensed providers:

1. **PISP (Payment Initiation Service Provider)**:
   - Can initiate payments **directly from a customer's bank account** on behalf of the customer
   - Bypasses the need for card networks
   - Example: An e-commerce checkout that initiates a SEPA Credit Transfer directly from the buyer's bank account

2. **AISP (Account Information Service Provider)**:
   - Can access customer **account data** (balances, transactions) from multiple banks
   - Provides aggregated views across different bank accounts
   - Example: Personal finance management apps, credit scoring services

#### Strong Customer Authentication (SCA)

PSD2 mandates **multi-factor authentication** for electronic payments:
- Must use at least **2 of 3 factors**: Knowledge (password/PIN), Possession (phone/card), Inherence (fingerprint/face)
- Applies to online payments, account access, and payment initiation
- Exemptions exist for low-value transactions, recurring payments, and trusted beneficiaries

### Impact on SEPA

1. **Open Banking + SCT Inst = Account-to-Account payments**: PISPs can now initiate instant SEPA transfers as an alternative to card payments at point of sale and in e-commerce
2. **Competition**: Non-bank providers can now offer payment services, reducing bank monopoly
3. **Innovation**: Fintech companies build on SEPA rails using open APIs
4. **Speed**: PISPs recognize that SCT Inst is an instant payment, enabling real-time processing

### Technical Challenge: API Standardization

One significant problem: PSD2 mandated that banks provide APIs, but **did not specify a single API standard**. This led to fragmentation:
- Different banks implemented different API specifications
- Multiple competing standards emerged: Berlin Group's NextGenPSD2, UK's Open Banking Standard, STET's PSD2 API
- This fragmentation increases costs and complexity for third-party providers

### PSD3 / PSR (In Progress as of 2026)

The EU is working on **PSD3** and the **Payment Services Regulation (PSR)**, which will:
- Convert the directive into a directly applicable regulation (no national transposition needed)
- Strengthen open banking requirements
- Improve API standardization
- Enhance fraud prevention
- Extend access to payment systems for non-bank PSPs

---

## 8. Costs and Regulation

### The Pricing Principle

The fundamental SEPA pricing rule, established by **EU Regulation 924/2009** (updated by Regulation 2021/1230):

> **Cross-border euro electronic payments must be priced identically to equivalent domestic euro electronic payments.**

This means a German bank cannot charge more for a SEPA transfer to France than for a SEPA transfer within Germany. This regulation single-handedly made cross-border euro payments cheap.

### Practical Pricing

| Payment Type | Typical Cost | Reason |
|-------------|-------------|--------|
| SEPA Credit Transfer (SCT) | **EUR 0 - EUR 1** | Same as domestic. Many banks offer free for consumers. |
| SEPA Instant (SCT Inst) | **EUR 0 - EUR 2** | Under IPR, must be no more than SCT fee. Many banks now free. |
| SEPA Direct Debit (Core) | **EUR 0 - EUR 0.50** per collection | Often bundled into business account pricing |
| SEPA Direct Debit (B2B) | **EUR 0.10 - EUR 1.00** per collection | Slightly higher due to mandate verification |

### Why SEPA Is Cheap

1. **Regulatory mandate**: EU law prohibits price discrimination between domestic and cross-border
2. **Standardization**: ISO 20022 XML format enables straight-through processing (STP) with minimal manual intervention
3. **No intermediaries**: Unlike SWIFT, SEPA payments go directly from payer's bank to CSM to payee's bank -- no correspondent banks needed
4. **Central bank settlement**: Settlement in T2/TIPS in central bank money -- no settlement risk costs
5. **Competition**: Open banking (PSD2) creates competitive pressure on pricing
6. **Economies of scale**: Billions of SEPA transactions per year amortize infrastructure costs

### Fee Rules

- **SHA (Shared) charging is mandatory**: Each party pays their own bank's fees
- **No deduction from amount**: The full payment amount must reach the beneficiary. Banks cannot deduct fees from the payment.
- Banks can charge their own customers a fee for processing, but this fee must be the same whether the counterparty is domestic or in another SEPA country

---

## 9. R-Transactions

### What Are R-Transactions?

R-transactions are **exceptions** to the normal processing of SEPA payments -- situations where a payment cannot be completed as intended, or where it needs to be reversed. They are called "R-transactions" because all their names start with "R."

### The Six R-Types

#### 1. Reject

**What**: A payment that cannot be processed due to a technical or validation error detected **before settlement**.

**Who initiates**: Any party in the chain (originator PSP, CSM, or beneficiary PSP).

**Timing**: Before interbank settlement.

**Common reasons**:
- Invalid IBAN
- Invalid BIC
- Format errors in the payment message
- Account closed
- Regulatory screening match

**XML message**: pacs.002 (Payment Status Report)

**Reason code examples**: AC01 (Incorrect Account Number), AC04 (Closed Account), AG01 (Transaction Forbidden)

#### 2. Return

**What**: A payment that is diverted from normal execution **after interbank settlement** and sent back.

**Who initiates**: Beneficiary PSP (debtor's bank for direct debits).

**Timing**:
- SCT: Within **3 business days** after settlement date
- SDD Core: Within **5 TARGET days** after settlement
- SDD B2B: Within **2 TARGET days** after settlement

**Common reasons**:
- Insufficient funds (for direct debits)
- Account does not exist (discovered post-settlement)
- Deceased account holder
- Blocked account

**XML message**: pacs.004 (Payment Return)

**Reason code examples**: AM04 (Insufficient Funds), AC04 (Closed Account), MD01 (No Mandate)

#### 3. Refund

**What**: A request from the **debtor** (payer) for reimbursement of a SEPA Direct Debit collection that has already been settled.

**Who initiates**: Debtor (through their bank).

**Timing**:
- SDD Core (authorized): Within **8 weeks** of debit date (no questions asked -- the debtor has an unconditional right)
- SDD Core (unauthorized): Within **13 months** of debit date
- SDD B2B: **No refund right** for authorized transactions; 13 months for unauthorized

**XML message**: pacs.004 (Payment Return, used for refund processing)

#### 4. Reversal

**What**: The **creditor** (payee) initiates a reversal because they realize a collection should not have been processed (e.g., wrong amount, duplicate collection).

**Who initiates**: Creditor (through their bank).

**Timing**: After settlement. The creditor voluntarily reimburses the debtor.

**XML message**: pacs.007 (Payment Reversal)

#### 5. Revocation

**What**: A request from the **creditor or creditor's bank** to recall/cancel a payment instruction **before settlement**.

**Who initiates**: Creditor or creditor's bank.

**Timing**: Before settlement (before the CSM has processed the payment).

**XML message**: camt.056 (FI-to-FI Payment Cancellation Request)

#### 6. Refusal

**What**: The **debtor** (payer) instructs their bank to refuse a specific direct debit collection **before settlement**.

**Who initiates**: Debtor (through their bank).

**Timing**: Before settlement date.

**Common reasons**: Debtor disputes the collection, wants to block a specific payment.

**XML message**: Handled via pacs.002 (Payment Status Report with refusal reason)

### R-Transaction Summary Table

| R-Type | Initiator | Timing | Applies To | XML Message |
|--------|-----------|--------|-----------|-------------|
| Reject | Any PSP/CSM | Before settlement | SCT, SDD | pacs.002 |
| Return | Beneficiary/Debtor PSP | After settlement (3-5 days) | SCT, SDD | pacs.004 |
| Refund | Debtor | After settlement (8 wks / 13 mo) | SDD Core only | pacs.004 |
| Reversal | Creditor | After settlement | SDD | pacs.007 |
| Revocation | Creditor/Creditor PSP | Before settlement | SDD | camt.056 |
| Refusal | Debtor | Before settlement | SDD | pacs.002 |

---

## 10. XML Message Format (ISO 20022)

### Overview

All SEPA payment messages use the **ISO 20022** standard with **XML** (eXtensible Markup Language) syntax. ISO 20022 provides a universal financial messaging framework used not only by SEPA but also by SWIFT (MX messages), Fedwire, CHIPS, T2, and many other systems worldwide.

### Message Naming Convention

ISO 20022 messages follow a structured naming pattern:

```
xxxx.nnn.nnn.nn
```

- **xxxx**: Business area (4 letters)
- **nnn**: Message type number
- **nnn**: Variant/flavor
- **nn**: Version number

Example: `pain.001.001.09` = Payment Initiation, type 001, variant 001, version 09

### Key Business Areas

| Code | Full Name | Domain |
|------|-----------|--------|
| pain | **Payments Initiation** | Customer-to-bank messages |
| pacs | **Payments Clearing and Settlement** | Bank-to-bank / CSM messages |
| camt | **Cash Management** | Account statements, notifications |
| acmt | **Account Management** | Account opening, maintenance |

### Key SEPA Messages

#### Customer-to-Bank (pain messages)

| Message | Name | Purpose |
|---------|------|---------|
| **pain.001** | Customer Credit Transfer Initiation | Customer instructs bank to make one or more credit transfers |
| **pain.002** | Customer Payment Status Report | Bank reports status of submitted payment instructions back to customer |
| **pain.007** | Customer Payment Reversal | Customer requests reversal of a previous credit transfer |
| **pain.008** | Customer Direct Debit Initiation | Creditor instructs bank to collect one or more direct debits |

#### Bank-to-Bank / Interbank (pacs messages)

| Message | Name | Purpose |
|---------|------|---------|
| **pacs.002** | FI-to-FI Payment Status Report | Status information between banks (accept, reject, return reasons) |
| **pacs.003** | FI-to-FI Customer Direct Debit | Direct debit instruction between banks |
| **pacs.004** | Payment Return | Returning a payment that has already been settled |
| **pacs.007** | FI-to-FI Payment Reversal | Reversing a settled payment |
| **pacs.008** | FI-to-FI Customer Credit Transfer | Credit transfer instruction between banks |
| **pacs.009** | FI-to-FI Financial Institution Credit Transfer | Bank-to-bank own-account transfer (ISO 20022 equivalent of MT202) |
| **pacs.028** | FI-to-FI Payment Status Request | Requesting status of a previous payment |

#### Cash Management (camt messages)

| Message | Name | Purpose |
|---------|------|---------|
| **camt.052** | Bank-to-Customer Account Report | Intraday account information (replaces MT942) |
| **camt.053** | Bank-to-Customer Statement | End-of-day account statement (replaces MT940) |
| **camt.054** | Bank-to-Customer Debit/Credit Notification | Individual debit or credit notification (replaces MT900/MT910) |
| **camt.056** | FI-to-FI Payment Cancellation Request | Request to cancel a payment instruction |

### XML Structure Example (Simplified pain.001)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.09">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>MSG-2026-04-06-001</MsgId>
      <CreDtTm>2026-04-06T10:30:00</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <CtrlSum>1500.00</CtrlSum>
      <InitgPty>
        <Nm>Sender Company Name</Nm>
      </InitgPty>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>PMT-001</PmtInfId>
      <PmtMtd>TRF</PmtMtd>
      <NbOfTxs>1</NbOfTxs>
      <CtrlSum>1500.00</CtrlSum>
      <PmtTpInf>
        <SvcLvl>
          <Cd>SEPA</Cd>
        </SvcLvl>
      </PmtTpInf>
      <ReqdExctnDt>
        <Dt>2026-04-07</Dt>
      </ReqdExctnDt>
      <Dbtr>
        <Nm>Debtor Name</Nm>
        <PstlAdr>
          <StrtNm>Calle Gran Via</StrtNm>
          <BldgNb>28</BldgNb>
          <PstCd>28013</PstCd>
          <TwnNm>Madrid</TwnNm>
          <Ctry>ES</Ctry>
        </PstlAdr>
      </Dbtr>
      <DbtrAcct>
        <Id>
          <IBAN>ES9121000418450200051332</IBAN>
        </Id>
      </DbtrAcct>
      <DbtrAgt>
        <FinInstnId>
          <BICFI>CAIXESBBXXX</BICFI>
        </FinInstnId>
      </DbtrAgt>
      <CdtTrfTxInf>
        <PmtId>
          <InstrId>INSTR-001</InstrId>
          <EndToEndId>E2E-2026-04-06-001</EndToEndId>
        </PmtId>
        <Amt>
          <InstdAmt Ccy="EUR">1500.00</InstdAmt>
        </Amt>
        <CdtrAgt>
          <FinInstnId>
            <BICFI>DEUTDEFFXXX</BICFI>
          </FinInstnId>
        </CdtrAgt>
        <Cdtr>
          <Nm>Creditor Name</Nm>
          <PstlAdr>
            <StrtNm>Friedrichstrasse</StrtNm>
            <BldgNb>100</BldgNb>
            <PstCd>10117</PstCd>
            <TwnNm>Berlin</TwnNm>
            <Ctry>DE</Ctry>
          </PstlAdr>
        </Cdtr>
        <CdtrAcct>
          <Id>
            <IBAN>DE89370400440532013000</IBAN>
          </Id>
        </CdtrAcct>
        <RmtInf>
          <Ustrd>Invoice 2026-04-001</Ustrd>
        </RmtInf>
      </CdtTrfTxInf>
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>
```

### Key XML Elements Explained

| Element | Path | Meaning |
|---------|------|---------|
| GrpHdr | Group Header | Contains message ID, creation timestamp, number of transactions, control sum |
| MsgId | Message ID | Unique identifier for the entire message |
| NbOfTxs | Number of Transactions | Count of individual payment instructions in the message |
| CtrlSum | Control Sum | Total amount of all transactions (for validation) |
| PmtInf | Payment Information | Contains debtor info and one or more credit transfer instructions |
| PmtMtd | Payment Method | TRF = Transfer, DD = Direct Debit |
| SvcLvl/Cd | Service Level Code | SEPA for SEPA scheme payments |
| ReqdExctnDt | Requested Execution Date | When the bank should execute the payment |
| Dbtr | Debtor | Payer information (name, address) |
| DbtrAcct/IBAN | Debtor Account | Payer's IBAN |
| DbtrAgt | Debtor Agent | Payer's bank (BIC) |
| CdtTrfTxInf | Credit Transfer Transaction Information | Individual payment details |
| EndToEndId | End-to-End ID | Unique reference that travels with the payment end-to-end |
| InstdAmt | Instructed Amount | Payment amount with currency attribute |
| Cdtr | Creditor | Payee information |
| CdtrAcct/IBAN | Creditor Account | Payee's IBAN |
| RmtInf | Remittance Information | Payment reference / invoice details |

### Version Migration

The current SEPA implementation uses the **2019 version** of ISO 20022 messages (e.g., pain.001.001.09). Key changes in newer versions:
- **Structured addresses** are mandatory (no more free-text addresses)
- **Legal Entity Identifier (LEI)** fields supported
- Enhanced regulatory reporting fields
- SupplementaryData elements
- Alignment with SWIFT CBPR+ requirements

**November 2026 deadline**: Unstructured-only addresses will be **rejected** by the SWIFT network for cross-border payments.

---

## 11. SEPA vs. SWIFT: When to Use Each

### Decision Matrix

| Criterion | Use SEPA | Use SWIFT |
|-----------|---------|-----------|
| **Currency** | EUR only | Any currency (180+) |
| **Geography** | Within SEPA zone (41 countries) | Global (200+ countries) |
| **EUR within Europe** | **Always** prefer SEPA | Avoid -- use SEPA instead |
| **Non-EUR within Europe** | Not applicable | Use SWIFT (or local system) |
| **Outside Europe** | Not applicable | Use SWIFT |
| **Speed** | D+1 (SCT) or instant (SCT Inst) | 1-5 business days |
| **Cost** | EUR 0-2 | USD 25-50+ per transaction |
| **Beneficiary receives** | Full amount (no deductions) | May receive less (fee deductions) |
| **Transparency** | Full visibility on fees | Fees may be unpredictable |
| **Identification** | IBAN only | BIC/SWIFT code + account number |
| **Message format** | ISO 20022 XML | MT (legacy) or MX (ISO 20022) |
| **Direct debits** | Supported (SDD) | Not directly supported |
| **Batch/bulk payments** | Well supported (pain.001 with multiple transactions) | Possible but less standardized |

### Practical Guidelines

1. **EUR payment from Spain to Germany**: Use SEPA (SCT or SCT Inst). Never use SWIFT for this.
2. **EUR payment from Spain to Japan**: Cannot use SEPA (Japan is outside SEPA zone). Use SWIFT.
3. **USD payment from Germany to the US**: Cannot use SEPA (wrong currency). Use SWIFT.
4. **EUR payment from UK to France**: Use SEPA (UK remains in SEPA zone).
5. **GBP payment from UK to France**: Cannot use SEPA (wrong currency). Use SWIFT (or Faster Payments + correspondent).
6. **Recurring subscription collection in EUR across Europe**: Use SEPA Direct Debit (SDD). Much cheaper and more standardized than SWIFT alternatives.

### Can SEPA and SWIFT Overlap?

Yes. Some SEPA payments may technically travel over SWIFTNet infrastructure (some banks use SWIFT InterAct to exchange SEPA messages). However, they are still **SEPA transactions** governed by SEPA scheme rules, pricing, and timelines. The SWIFT network is just the transport layer in this case.

---

## 12. Technical Standards and Communication Protocols

### Message Standards

| Standard | Usage | Format |
|----------|-------|--------|
| ISO 20022 (UNIFI) | SEPA messages, SWIFT MX, T2, TIPS | XML |
| ISO 15022 | Legacy SWIFT MT messages | Text/proprietary |
| ISO 13616 | IBAN structure | Alphanumeric |
| ISO 9362 | BIC/SWIFT code structure | Alphanumeric |
| ISO 4217 | Currency codes (EUR, USD, etc.) | 3-letter codes |

### Communication Protocols Between Banks and CSMs

#### EBICS (Electronic Banking Internet Communication Standard)

The primary protocol for bank-to-bank and corporate-to-bank communication in SEPA, particularly dominant in Germany, France, Austria, and Switzerland.

**Technical Details**:
- Transport: **HTTPS** (HTTP over TLS)
- Data encoding: **XML** for routing and control data
- Security: **PKI** with X.509 certificates (replaced older RSA keys)
- Authentication: Digital signatures using private keys
- Encryption: Mandatory since EBICS v3.0
- Operations: Upload (sending payment files), Download (receiving statements)

**Workflow**:
1. Corporate/bank generates a payment file (e.g., pain.001 XML)
2. File is signed with the sender's private key
3. File is encrypted
4. File is transmitted over HTTPS to the bank's EBICS server
5. Bank verifies certificate, validates signature, decrypts file
6. Bank processes the payment instructions
7. Confirmation or statement file is returned via EBICS

**EBICS versions**:
- EBICS 2.x: Widely deployed, separate signing and encryption
- EBICS 3.0: Current standard, mandatory signing and encryption, enhanced security

#### SWIFTNet (InterAct, FileAct, FIN)

Some banks, particularly those with international operations, use SWIFTNet to exchange SEPA messages:
- **InterAct**: For individual ISO 20022 messages (real-time)
- **FileAct**: For bulk/batch SEPA payment files
- **FIN**: Legacy MT format (being phased out)

#### Direct Connections / APIs

Increasingly, banks offer:
- **REST APIs** for real-time payment initiation (aligned with PSD2)
- **WebSocket** connections for real-time notifications
- **SFTP** for batch file exchange (though this is being replaced by EBICS and APIs)

### Batch Processing vs. Real-Time

#### Traditional Model (Batch)

SEPA was originally designed around batch processing:
1. Corporate creates a **pain.001** file containing multiple payment instructions
2. File is submitted to bank (via EBICS or FileAct)
3. Bank processes the file in a **batch cycle** (often twice or thrice daily)
4. Payments are sent to CSM in the next clearing cycle
5. Settlement occurs at defined intervals

This model works well for bulk payments (salaries, pensions, supplier payments) where real-time processing is not needed.

#### Modern Model (Real-Time)

With SCT Inst and open banking:
1. Individual payment instructions are submitted via API
2. Processed in **real-time** (no batch cycle)
3. Settled instantly through TIPS or RT1
4. Confirmation returned within seconds

The industry is in transition: core banking systems historically designed for batch processing are being upgraded to support real-time instant payments alongside traditional batch cycles.

### Straight-Through Processing (STP)

A fundamental goal of SEPA is maximum **STP** -- payments that are processed automatically from initiation to settlement without any manual intervention.

STP is achieved through:
- Standardized message formats (ISO 20022 XML)
- Standardized identifiers (IBAN, BIC)
- Automated validation (check digits, format rules)
- Consistent scheme rules across all countries
- Machine-readable structured data (no free-text interpretation needed)

STP rates in SEPA are very high (often **95%+**), which is a key reason why SEPA payments are so cheap -- manual processing is expensive, automated processing is not.

---
---

# APPENDIX: Complete Architecture Diagrams

## SWIFT Payment Architecture

```
SENDER                    SWIFT NETWORK                 RECEIVER
(Customer)                                              (Customer)
    |                                                       |
    v                                                       ^
+----------+    MT103     +----------+     MT103    +----------+
| Sender's |  -------->  |  SWIFT   |  --------->  |Receiver's|
|   Bank   |             | Network  |              |   Bank   |
+----------+             |(SWIFTNet)|              +----------+
    |                    +----------+                   ^
    |                         |                         |
    v          MT202 COV      v                         |
+----------+  <-------  +----------+  --------->  +----------+
|  Nostro  |            |Correspond|              |  Nostro  |
| Account  |            |ent Bank  |              | Account  |
| (Sender) |            |(e.g. JPM)|              |(Receiver)|
+----------+            +----------+              +----------+
                              |
                              v
                    +-------------------+
                    | Settlement System |
                    | (Fedwire / CHIPS  |
                    |  / T2 / CHAPS)   |
                    +-------------------+
```

## SEPA Payment Architecture

```
PAYER                    CLEARING LAYER                  PAYEE
(Debtor)                                               (Creditor)
    |                                                       ^
    | pain.001                                              |
    v                                                       |
+----------+   pacs.008   +-----------+   pacs.008  +----------+
| Payer's  |  --------->  |    CSM    |  -------->  | Payee's  |
|   PSP    |              |(STEP2-T / |             |   PSP    |
|          |              | National  |             |          |
+----------+              | ACH/TIPS) |             +----------+
                          +-----------+
                               |
                               | Settlement
                               v
                    +-------------------+
                    |    T2 / TIPS      |
                    | (Central Bank $)  |
                    |  ECB Accounts     |
                    +-------------------+
```

## ISO 20022 Message Flow in SEPA

```
CUSTOMER DOMAIN          INTERBANK DOMAIN          CUSTOMER DOMAIN

  Payer/                  Bank-to-Bank               Payee/
  Debtor                  Communication              Creditor

pain.001 -----> pacs.008 -----> CSM -----> pacs.008 -----> Statement
(initiation)   (clearing)              (clearing)        (camt.053/054)

pain.002 <----- pacs.002 <-------------- pacs.002
(status)       (status)                  (status)

pain.008 -----> pacs.003 -----> CSM -----> pacs.003
(DD init)      (DD clearing)            (DD clearing)
```

---

# KEY TAKEAWAYS

1. **SWIFT is messaging; it is not money movement.** SWIFT tells banks what to do. Separate clearing and settlement systems actually move the money.

2. **SEPA is a scheme (set of rules) plus infrastructure.** It standardizes how EUR payments work across 41 countries, making cross-border payments identical to domestic ones.

3. **Correspondent banking is the glue** that enables SWIFT payments. Nostro/vostro accounts at correspondent banks are where the actual ledger entries happen.

4. **SEPA eliminated correspondent banking for EUR payments in Europe.** Payments go directly through a CSM (STEP2-T, TIPS, or national ACH) and settle in central bank money via T2.

5. **ISO 20022 is unifying everything.** Both SWIFT and SEPA are converging on the same XML-based messaging standard, making them increasingly interoperable.

6. **Cost difference is structural.** SWIFT is expensive because of multiple intermediaries, each taking a fee. SEPA is cheap because of standardization, direct routing, and regulatory mandates.

7. **Speed difference is architectural.** SWIFT relies on correspondent chains (days). SEPA settles in central bank infrastructure (seconds for instant, D+1 for standard).

8. **SWIFT's geopolitical power** derives from its near-monopoly on cross-border financial messaging. This monopoly is being challenged by CIPS, SPFS, and blockchain alternatives, but SWIFT remains dominant.

9. **The future is instant.** Both SWIFT (gpi, instant cross-border) and SEPA (SCT Inst, TIPS) are moving toward real-time, 24/7 payment processing.

10. **Security is only as strong as the weakest participant.** The Bangladesh Bank heist proved that even the most secure network can be compromised through endpoint vulnerabilities.
