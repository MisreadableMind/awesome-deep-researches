# ACH, Fedwire, and CHIPS: US Domestic Payment Rails - Complete Technical Deep Dive

---

## Table of Contents

1. [History and Overview](#1-history-and-overview)
2. [What the Three Rails Actually Are (and Are Not)](#2-what-the-three-rails-actually-are-and-are-not)
3. [Key Participants and Roles](#3-key-participants-and-roles)
4. [ACH - How It Works Step by Step](#4-ach---how-it-works-step-by-step)
5. [Inside the Nacha File Format](#5-inside-the-nacha-file-format)
6. [Fedwire - How It Works](#6-fedwire---how-it-works)
7. [CHIPS - How It Works](#7-chips---how-it-works)
8. [Technical Architecture and Connectivity](#8-technical-architecture-and-connectivity)
9. [Money Flow and Economics](#9-money-flow-and-economics)
10. [Security, Fraud, and Risk](#10-security-fraud-and-risk)
11. [Regulation and Legal Framework](#11-regulation-and-legal-framework)
12. [Comparisons - Choosing a Rail](#12-comparisons---choosing-a-rail)
13. [Modern Developments](#13-modern-developments)
14. [Appendix](#14-appendix)
15. [Key Takeaways](#15-key-takeaways)

---

## 1. History and Overview

The United States runs its domestic money movement on three wholesale rails built in three different centuries of banking thought, and none of them has ever been retired. ACH moves the volume, Fedwire moves the value, CHIPS moves the dollars that cross borders. Every payroll deposit, mortgage draft, house closing, bond settlement, and interbank funding trade in the country lands on one of them.

The reason there are three is historical, not architectural. Each rail was built to solve a specific transport problem of its era: telegraph settlement between Reserve Banks in 1918, paper check exhaustion in the 1960s, and messenger congestion in lower Manhattan in 1970. The problems were solved. The rails stayed.

![Evolution of US payment rails](diagrams/evolution-timeline.svg)

### 1.1 Fedwire and the Telegraph (1918)

Fedwire is the oldest electronic payment system still operating in the United States, and it began as a way to stop moving gold.

Before 1918, a bank in Chicago that owed money to a bank in New York settled by shipping currency or gold certificates by rail, insured, under guard. Settlement took days and cost real money in transport and insurance. The Federal Reserve System, created in 1913, already held reserve balances for member banks at twelve Reserve Banks, which meant the balances that needed to move were sitting in the Fed's own books.

In 1918 the Federal Reserve built a private, dedicated telegraph network connecting the twelve Reserve Banks, the Federal Reserve Board, and the Treasury. A transfer was a Morse code message, encrypted with a shared codebook, instructing one Reserve Bank to debit a member's reserve account and another to credit a different member's. The Reserve Banks settled between themselves through the Interdistrict Settlement Fund, a pool of gold certificates in Washington whose ownership shares were adjusted rather than physically moved.

That basic design has never changed. Fedwire still works by debiting one reserve account and crediting another on the Federal Reserve's own balance sheet. Only the transport layer has been replaced: Morse code gave way to teletype in the 1930s, to leased-line computer links in the 1970s, to the proprietary FedLine network in the 1990s, and to IP-based FedLine Direct and FedLine Advantage today.

The critical property was present from the first message and remains the reason Fedwire exists. A Fedwire payment is settled in central bank money, immediately, one payment at a time, and it is final. There is no clearing period, no netting, and no way to claw it back.

### 1.2 The Check Crisis and the Birth of ACH (1968-1974)

ACH exists because the United States nearly drowned in paper.

Check volume in the 1960s was growing roughly 7 to 8 percent a year, and every check was a physical object that had to be captured, encoded, sorted, trucked or flown to the paying bank, and returned. Banks were hiring proof operators faster than they could train them. Federal Reserve studies at the time projected that if the trend held, check processing would consume an implausible share of the American clerical workforce by the 1980s.

In 1968 a group of California bankers formed SCOPE, the Special Committee on Paperless Entry, to design an electronic substitute for the recurring, predictable payments that made up a large share of check volume: payroll, insurance premiums, mortgage payments, utility bills. These payments were ideal candidates because they were scheduled in advance, repeated monthly, and did not need to settle in seconds.

SCOPE's insight was to keep the economics of batch processing rather than fight them. Instead of transmitting each payment as it arose, an originator would accumulate payments into a file, transmit the file once, and let the operator sort the entries by destination bank and deliver each bank its share. The cost per payment falls toward the cost of a line in a file, which is fractions of a cent. The tradeoff, accepted deliberately, was time: money would move on the next business day, not now.

The timeline moved quickly once the format was settled:

- **1972**: the first automated clearing house association goes live in California, with the Federal Reserve Bank of San Francisco acting as operator.
- **1974**: regional ACH associations form NACHA, the National Automated Clearing House Association, to write a single national rulebook. NACHA is now styled Nacha.
- **1975**: the Social Security Administration begins direct deposit of benefit payments, the single largest driver of early ACH adoption. Government payments taught tens of millions of Americans to trust an electronic deposit.
- **1978**: the Electronic Fund Transfer Act creates consumer protections for electronic debits and credits, later implemented as Regulation E.
- **1980s-1990s**: direct deposit of payroll becomes standard at large employers; direct debit spreads to insurance, utilities, and mortgages.
- **2001-2007**: check conversion codes (ARC, BOC, POP) let billers turn paper checks into ACH debits, accelerating the collapse of check volume.
- **2016-2018**: Same Day ACH is phased in, adding intraday settlement windows to a rail designed around overnight batches.

Today ACH carries the overwhelming majority of American payment count by any measure that excludes card transactions. Nacha reported 33.6 billion payments worth 86.2 trillion USD moving across the network in 2024, with volume growing roughly 6 to 7 percent annually. Direct deposit reaches over 90 percent of American workers.

### 1.3 CHIPS and the Messenger Problem (1970)

CHIPS was built because lower Manhattan could not physically carry its own payment volume.

Through the 1960s, large-value dollar payments between New York banks, especially those tied to foreign exchange and international trade, were settled with paper instruments carried by hand. A bank owing another bank would issue an official check and send a messenger. As eurodollar markets and foreign exchange volumes exploded, the messenger traffic became a constraint in itself, and the settlement risk of paper in transit became unacceptable.

The New York Clearing House Association, an institution founded in 1853, built the Clearing House Interbank Payments System and launched it in 1970. CHIPS replaced the messengers with an electronic message network among a closed set of large banks, and replaced individual settlement with end-of-day multilateral netting. Instead of settling several thousand payments, participants settled one net position each.

The original design carried a serious flaw: nothing was final until the end of the day. Payments were released against bilateral credit limits during the day, and if a participant failed before settlement, CHIPS would have to unwind the day's payments and recalculate everyone's position. The system had a loss-sharing rule for exactly this scenario. Regulators, especially after the Herstatt Bank failure of 1974 demonstrated how settlement risk propagates, considered unwind an unacceptable systemic threat.

CHIPS rebuilt itself in stages:

- **1981**: same-day settlement replaces next-day settlement.
- **1990**: settlement finality rules tighten and loss-sharing collateral is required.
- **January 2001**: CHIPS converts to a prefunded, continuously netting design. Participants deposit an opening position balance each morning, an algorithm nets and releases payments against those balances all day, and each released payment is final and irrevocable the moment it is released. Unwind risk disappears.

CHIPS today settles roughly 1.8 trillion USD a day across about 500,000 payments among roughly 40 direct participants, and The Clearing House states it handles about 95 percent of cross-border dollar payments. It is the only privately owned large-value payment system in the United States.

### 1.4 Scale Today

The three rails serve wildly different purposes, which shows up in a single statistic: average payment size.

| Rail | Annual volume | Annual value | Average payment | Settlement |
|------|---------------|--------------|-----------------|------------|
| **ACH** | ~33.6 billion payments (2024) | ~86.2 trillion USD | ~2,600 USD | Deferred net, same day or next day |
| **Fedwire Funds** | ~200 million transfers | ~1.1 quadrillion USD | ~5.5 million USD | Real-time gross, immediate |
| **CHIPS** | ~125 million payments | ~450 trillion USD | ~3.6 million USD | Prefunded continuous net, intraday final |

Fedwire and CHIPS together move more dollars in two days than ACH moves in a year. ACH moves more payments in a week than Fedwire moves in a decade. Figures for Fedwire and CHIPS are approximate annualizations of published daily averages and shift year to year; the orders of magnitude are stable.

The comparison that makes the design intent obvious: an ACH payment costs the originating bank a fraction of a cent at the operator and settles overnight. A Fedwire payment costs well under a dollar at the operator, settles in seconds, and cannot be reversed. One rail is optimized for cost per payment, the other for certainty per dollar.

---

## 2. What the Three Rails Actually Are (and Are Not)

### 2.1 The Three Design Axes

Every payment system in the world makes three choices. The US rails happen to occupy three different corners of that space, which is why all three survive.

**Axis 1: gross or net.** A gross system settles each payment individually and in full. A net system accumulates obligations and settles the difference. Gross settlement eliminates the risk that one failure unwinds many payments, but it demands that each participant hold enough liquidity to cover every outgoing payment as it happens. Net settlement is dramatically cheaper in liquidity and dramatically more complicated in risk.

**Axis 2: real time or batch.** A real-time system processes each instruction on arrival. A batch system accumulates instructions and processes them at scheduled times. Batch is cheaper per item by orders of magnitude. Real time is the only option when the counterparty needs certainty now.

**Axis 3: credit push or debit pull.** In a credit push, the payer instructs their bank to send money. In a debit pull, the payee instructs their bank to collect money from the payer's account, on the strength of an authorization the payee holds. Debit pull enables recurring billing without the payer doing anything each month, and it creates an entirely different fraud surface because the party initiating the transaction is not the party losing the money.

![Settlement models compared](diagrams/settlement-models.svg)

| System | Gross or net | Timing | Direction | Settlement asset |
|--------|--------------|--------|-----------|------------------|
| **Fedwire Funds** | Gross | Real time | Credit push only | Central bank money |
| **CHIPS** | Net, continuous, prefunded | Real time release, intraday final | Credit push only | Prefunded central bank money |
| **ACH** | Net | Batch, scheduled windows | Both push and pull | Central bank money at settlement |
| **RTP / FedNow** | Gross | Real time, 24x7 | Credit push (plus request for pay) | Prefunded / central bank money |

### 2.2 What Fedwire Is Not

**Fedwire is not a messaging network.** This is the most common confusion, usually with SWIFT. SWIFT carries instructions between banks and settles nothing; the money still has to move on some rail. Fedwire is the ledger. When a Fedwire message is processed, a reserve account at a Federal Reserve Bank is debited and another is credited in the same instant. The message and the settlement are the same event.

**Fedwire is not reversible.** Once a Fedwire payment is accepted and settled, the sending bank has no unilateral right to recall it. It can send a request for return, and the receiving bank can choose to cooperate, but nothing in the system compels the money back. This is a feature: it is what makes a wire acceptable for a house closing. It is also why business email compromise fraud targets wires specifically.

**Fedwire is not for consumers, structurally.** Consumers use it through their bank, and it carries no Regulation E protection for most business use. A consumer wire is a consumer electronic fund transfer only in narrow circumstances; a business wire has no consumer protection at all.

### 2.3 What ACH Is Not

**ACH is not a real-time payment system, even Same Day ACH.** Same Day ACH shortens the interval from next business day to a few hours, and the receiving bank must make funds available by 5:00 p.m. local time on the settlement day. That is faster batch, not real time. Files are still cut, still transmitted at window deadlines, still processed as batches.

**ACH is not final on delivery.** An ACH entry can be returned. Most returns arrive within two banking days, but an unauthorized consumer debit can be returned for 60 calendar days from the settlement date. A merchant that ships goods against an ACH debit is extending credit for two months whether it intends to or not.

**ACH is not a guarantee of funds.** Nothing in the network checks that an account has a balance before an entry settles. The receiving bank decides at posting time whether to pay or return for insufficient funds. This is the opposite of a card authorization, which locks funds before the transaction completes.

**ACH does not carry rich data by default.** A standard entry detail record has one 15-character field for the originator to describe the payment and a 22-character field for the receiver's name. Structured remittance data requires the CTX format, which wraps an ANSI X12 820 or ISO 20022 remittance document across up to 9,999 addenda records, and support for it among receiving banks is uneven.

### 2.4 What CHIPS Is Not

**CHIPS is not a Federal Reserve system.** It is owned and operated by The Clearing House Payments Company, which is owned by a group of large commercial banks. It settles in central bank money via Fedwire, but the system itself is private.

**CHIPS is not end-of-day netting anymore.** The pre-2001 description, still repeated in textbooks, is wrong. Payments are netted and released continuously through the day against prefunded balances, and each released payment is final at release, not at 5:00 p.m.

**CHIPS is not a competitor to Fedwire in the ordinary sense.** The two overlap, and a bank sending a large domestic payment can choose either. But CHIPS is optimized for the high-volume, correspondent-heavy, cross-border dollar flows where netting efficiency matters most, and Fedwire is the default for domestic time-critical payments and the ultimate settlement layer for CHIPS itself.

### 2.5 The Simplest Accurate Mental Model

Think of the three rails as three ways to answer one question: how much liquidity is a participant willing to hold in order to remove how much risk?

Fedwire says: hold enough money to fund every payment at the moment you send it, and you carry no settlement risk at all. CHIPS says: hold a small prefunded balance, let an algorithm find offsetting payments so that most of the value never needs funding, and accept that your payment waits in a queue until an offset appears. ACH says: hold nothing during the day, settle net once or a few times a day, and accept that a payment can be returned for weeks afterward.

Liquidity, speed, and finality trade against each other. No rail gets all three.

---

## 3. Key Participants and Roles

### 3.1 The Ecosystem

![Key participants across the three rails](diagrams/participants.svg)

| Participant | Role | Examples |
|-------------|------|----------|
| **Originator** | The party that initiates a payment: an employer, biller, merchant, or individual | Payroll departments, insurers, utilities, brokerages |
| **ODFI (Originating Depository Financial Institution)** | The bank that puts ACH entries into the network and warrants them to everyone downstream | Any bank or credit union with an ACH agreement |
| **RDFI (Receiving Depository Financial Institution)** | The bank that posts entries to the receiver's account and decides whether to pay or return | Any US depository institution; participation is effectively mandatory |
| **Receiver** | The account holder credited or debited | Employees, policyholders, customers |
| **ACH Operator** | Sorts, edits, and distributes entries between banks and computes settlement | FedACH (Federal Reserve), EPN (The Clearing House) |
| **Third-Party Sender (TPS)** | An intermediary that originates entries on behalf of its own customers under a bank's ODFI relationship | Payroll processors, fintech platforms, PayFacs |
| **Third-Party Service Provider (TPSP)** | Performs ACH functions for a bank or originator without being in the payment chain as an originator | Core processors, file transmitters |
| **Fedwire participant** | Any institution holding a Federal Reserve master account and subscribing to the service | ~4,500 banks, credit unions, Federal Home Loan Banks, some designated FMUs |
| **CHIPS participant** | A direct member of CHIPS holding a prefunded position | ~40 large US banks and US branches of foreign banks |
| **Federal Reserve Banks** | Operate Fedwire and FedACH, hold master accounts, provide intraday credit, supervise | 12 Reserve Banks, operationally consolidated |
| **The Clearing House (TCH)** | Operates EPN, CHIPS, and RTP | Owned by ~20 large commercial banks |
| **Nacha** | Writes and enforces the ACH Operating Rules; does not operate the network | Rules, warranties, enforcement, risk thresholds |
| **Correspondent bank** | Provides rail access to institutions without direct connections | Large money-center banks serving community banks and foreign banks |
| **Corporate treasury / ERP** | Generates payment instructions and consumes returns and acknowledgements | SAP, Oracle, NetSuite, treasury workstations |

### 3.2 The ODFI Is the Load-Bearing Role

The single most important thing to understand about ACH is that the originating bank warrants every entry it puts into the network. Under the Nacha Operating Rules, the ODFI warrants that the entry is authorized by the receiver, that the entry is accurate and timely, and that it complies with the rules. If any of that is false, the ODFI is liable, not the operator and not the receiving bank.

That single allocation of liability explains most of the ACH industry's structure. It explains why banks underwrite ACH originators like they underwrite credit: an originator that collects debits and then fails leaves the ODFI holding the returns. It explains why exposure limits and file-level dollar caps exist. It explains why fintechs that want to originate must either become a bank, find a sponsor bank, or operate as a Third-Party Sender inside a sponsor's warranty.

The RDFI, by contrast, has a much narrower set of obligations: post the entry to the correct account, make credits available by the required time, and return unauthorized or unpostable entries within the applicable deadline. RDFIs are not paid meaningfully for this work, which is a persistent source of tension in the network's economics.

### 3.3 Two ACH Operators, One Network

The US has two ACH operators, and they are interoperable by rule. FedACH, run by the Federal Reserve, carries the majority of interbank volume, with EPN, run by The Clearing House, carrying a substantial minority. Each bank chooses an operator. When an entry originates at a bank on one operator and is destined for a bank on the other, the operators exchange the entry between themselves and settle the resulting positions.

Volume that never touches an operator is called **on-us**: when the ODFI and RDFI are the same institution, the bank simply posts both sides internally. On-us entries are a large share of total ACH activity at the biggest banks and never appear in interbank statistics.

### 3.4 Who Can Reach the Rails Directly

Direct access requires a Federal Reserve master account, and the answer to who gets one has become a live policy question. Traditional banks and credit unions get one as a matter of course. Federal Home Loan Banks, designated financial market utilities, and certain government entities also hold accounts. Fintechs, payment companies, and crypto institutions generally do not, which is why almost every non-bank payment company in the United States rents access from a sponsor bank.

The Federal Reserve published Account Access Guidelines in 2022 setting a tiered review for master account requests, and litigation over denials has followed. The practical effect is that the sponsor bank model, with its warranty chain and its concentration risk, remains the way nearly all innovation reaches the rails.

---

## 4. ACH - How It Works Step by Step

This section follows one concrete payment end to end: an employer with 4,000 employees runs a semi-monthly payroll and pays Maria 2,847.50 USD.

![ACH payment lifecycle](diagrams/ach-lifecycle.svg)

### 4.1 Step 1: Authorization

Nothing enters the ACH network without an authorization from the receiver, and the form of that authorization is dictated by the Standard Entry Class code the originator intends to use.

For a payroll credit under the PPD code, the employee's direct deposit enrollment form is the authorization. For a consumer debit initiated over a website under the WEB code, the authorization must be in writing or similarly authenticated, and the originator must retain proof for two years after termination. For a telephone-authorized debit under TEL, the originator must either record the call or send written notice before settlement.

The asymmetry matters. Credits require far less ceremony than debits, because a credit gives money to the receiver and a debit takes it away. Nearly the entire ACH rulebook on authorization, retention, and return rights exists to police debits.

### 4.2 Step 2: File Creation

The employer's payroll system generates a Nacha-format file. For this payroll it contains:

- One **File Header** record identifying the sender and the receiving bank, with a file creation date and time.
- One **Batch Header** record per batch, carrying the company name, the company identification number, the SEC code (PPD), the entry description that will appear on the employee's statement ("PAYROLL"), and, critically, the **effective entry date**: the date the originator wants the money to land.
- One **Entry Detail** record per employee, carrying the transaction code, the RDFI routing number, the account number, the amount, the receiver's name, and a trace number.
- **Batch Control** and **File Control** records with hash totals and counts.

Maria's entry detail record carries transaction code 22 (credit to a checking account), her bank's routing number, her account number, and the amount 000000284750, in cents, with no decimal point.

An important asymmetry appears here. A payroll credit file is balanced with an offsetting debit to the employer's own account, either as an entry in the file (an offset entry) or by arrangement with the bank. The employer's account funds the credits; the credits do not create money.

### 4.3 Step 3: Transmission and ODFI Edits

The employer transmits the file to its bank, typically over SFTP with PGP encryption, or through a bank portal, or via an API that generates the file server-side. Transmission usually happens one to two business days before the effective entry date.

The ODFI runs three distinct checks:

1. **Format validation**: record counts, hash totals, field formats, valid routing numbers with correct check digits.
2. **Exposure control**: does the file exceed the originator's approved daily or per-file limit? This is a credit decision. A payroll file of 12 million USD from a customer with a 5 million USD limit gets held for a human.
3. **Compliance screening**: OFAC screening of names and, for IAT entries, of all parties in the payment chain.

Files failing edits are rejected back to the originator, often with hours of usable time lost, which is why originators submit early.

### 4.4 Step 4: Operator Processing and Windows

The ODFI forwards entries to its ACH operator by a deadline tied to the settlement window it wants.

![ACH processing windows](diagrams/ach-processing-windows.svg)

| Window | Submission deadline (ET) | Settlement (ET) | Typical use |
|--------|--------------------------|-----------------|-------------|
| Same Day window 1 | 10:30 a.m. | 1:00 p.m. | Urgent payroll corrections, disbursements |
| Same Day window 2 | 2:45 p.m. | 5:00 p.m. | Same-day bill payment, account funding |
| Same Day window 3 | 4:45 p.m. | 6:00 p.m. | Late-day disbursement, wallet funding |
| Next day (future-dated) | 2:15 a.m. | 8:30 a.m. | Standard payroll, recurring billing |
| Next day (second window) | 12:00 p.m. and later | 1:00 p.m. and later | Standard commercial payments |

The operator sorts every entry by destination routing number, groups entries by receiving bank, and creates an output file for each RDFI. It also computes each participant's net settlement position: the sum of credits sent minus credits received minus debits sent plus debits received, netted to a single number per institution per settlement window.

Same Day ACH carries a per-payment dollar limit of 1,000,000 USD, raised from 100,000 USD in March 2022. International entries (IAT) and entries above the limit are not eligible.

### 4.5 Step 5: Settlement

Settlement is where central bank money actually moves, and it is worth being precise about what happens.

For FedACH, the Federal Reserve posts the net settlement amount directly to each participant's master account at the scheduled settlement time. For EPN, the net positions are settled through the Federal Reserve's **National Settlement Service (NSS)**, where the operator submits a settlement file and the Fed debits and credits master accounts simultaneously.

Two properties follow. First, settlement is net, so a bank that originated 400 million USD of credits and received 380 million USD of credits moves only 20 million USD. Second, settlement is a separate event from posting. The RDFI often posts entries to customer accounts before it has been settled with, and it does so on the strength of the network's rules rather than on the strength of having the money.

### 4.6 Step 6: Posting and Funds Availability

The RDFI receives its file, applies its own edits, and posts entries to customer accounts. Nacha rules require that credits in a Same Day ACH file be made available to the receiver by 5:00 p.m. in the RDFI's local time on the settlement date, and that credits in standard next-day files be available by 9:00 a.m. local time on the settlement date.

At this point the RDFI makes the decision that no earlier participant could make: does the account exist, is it open, and for a debit, does it have the money? If any answer is no, the entry becomes a return.

Maria sees 2,847.50 USD in her account, described as "ACME CORP PAYROLL", at some point before 9:00 a.m. on payday. Many banks post overnight and show the credit at midnight; some show it a day early, funding the customer from their own balance sheet as a retention feature, which is the mechanism behind "get your paycheck two days early" marketing.

### 4.7 Step 7: Returns, Notifications, and Corrections

![ACH returns and notification of change](diagrams/ach-returns.svg)

An entry that cannot be posted comes back through the same network in the opposite direction, as a return entry carrying a three-character reason code.

| Code | Meaning | Return window |
|------|---------|---------------|
| **R01** | Insufficient funds | 2 banking days |
| **R02** | Account closed | 2 banking days |
| **R03** | No account or unable to locate account | 2 banking days |
| **R04** | Invalid account number structure | 2 banking days |
| **R05** | Unauthorized consumer debit using a corporate SEC code | 60 calendar days |
| **R07** | Authorization revoked by customer | 60 calendar days |
| **R08** | Payment stopped | 2 banking days |
| **R10** | Customer advises originator is not known or entry is not authorized | 60 calendar days |
| **R11** | Customer advises entry not in accordance with the terms of the authorization | 60 calendar days |
| **R16** | Account frozen or funds subject to legal action | 2 banking days |
| **R20** | Non-transaction account | 2 banking days |
| **R29** | Corporate customer advises not authorized | 2 banking days |

The 60-day window for consumer unauthorized returns is the single most consequential number in ACH risk. It means an originator collecting consumer debits carries a two-month tail of potential reversals, and the ODFI carries it behind them.

A **Notification of Change (NOC)**, sent as a COR entry, is different from a return. It says the entry posted correctly but some detail was wrong: the account was renumbered, the routing number changed after a merger, the transaction code was wrong. The originator must apply the correction within six banking days or before the next entry, whichever is later. Ignoring NOCs is a rules violation and eventually produces returns.

### 4.8 Debit Pull in Practice

The payroll example is a credit push. The other half of ACH is the debit pull, and the flow differs in one important way: the originator initiating the transaction is the party receiving the money.

A gym billing 49.99 USD monthly submits a PPD debit against the member's account. The member's bank posts the debit, and money flows from the member to the gym. The member never touches the transaction. If the member disputes it as unauthorized within 60 days, the bank must re-credit the member and return the entry, and the gym's bank takes it back out of the gym.

This creates the ACH network's central risk asymmetry: the party that can cause a debit is not the party that bears the loss when it is wrong. Nacha manages that asymmetry with return rate thresholds enforced against originators:

- **Unauthorized return rate**: 0.5 percent, measured on R05, R07, R10, R11, R29, R51
- **Administrative return rate**: 3 percent, measured on R02, R03, R04
- **Overall return rate**: 15 percent

Exceeding the unauthorized threshold triggers a mandatory inquiry and can force the originator off the network. The administrative rate is a proxy for bad data quality; the overall rate is a proxy for collecting from customers who cannot pay.

---

## 5. Inside the Nacha File Format

The ACH file format is a fixed-width, 94-character-per-record structure designed for 1970s tape and card processing, and it has not changed structurally in 50 years. Understanding it is understanding ACH, because every constraint in the rail traces back to a field in this file.

![Nacha file record structure](diagrams/ach-file-structure.svg)

### 5.1 Record Hierarchy

```
1  File Header Record             (one per file)
   5  Batch Header Record         (one per batch)
      6  Entry Detail Record      (one per payment)
         7  Addenda Record        (optional, 0 to 9,999 per entry)
      6  Entry Detail Record
         7  Addenda Record
   8  Batch Control Record        (one per batch)
   5  Batch Header Record         (next batch)
      ...
   8  Batch Control Record
9  File Control Record            (one per file)
9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
   (padding records of all 9s, to fill the block to a multiple of 10 records)
```

Every record is exactly 94 characters. The first character is the record type code. Blocking factor is 10, meaning the file must contain a multiple of 10 records, padded with all-nines records. This exists because the format was designed for fixed-block magnetic tape.

### 5.2 The Entry Detail Record, Field by Field

The Entry Detail Record is where a payment lives. For a PPD credit:

| Position | Length | Field | Example | Notes |
|----------|--------|-------|---------|-------|
| 01 | 1 | Record Type Code | `6` | Always 6 for entry detail |
| 02-03 | 2 | Transaction Code | `22` | 22 checking credit, 27 checking debit, 32 savings credit, 37 savings debit |
| 04-11 | 8 | Receiving DFI Identification | `02100002` | First 8 digits of the RDFI routing number |
| 12 | 1 | Check Digit | `5` | Ninth digit of the routing number, modulus 10 |
| 13-29 | 17 | DFI Account Number | `1234567890       ` | Left justified, space filled |
| 30-39 | 10 | Amount | `0000284750` | In cents, zero filled, no decimal |
| 40-54 | 15 | Individual Identification Number | `EMP0004821     ` | Originator's own reference for the receiver |
| 55-76 | 22 | Individual Name | `MARIA GONZALEZ        ` | Receiver name, not validated by anyone |
| 77-78 | 2 | Discretionary Data | `  ` | Originator use |
| 79 | 1 | Addenda Record Indicator | `0` | 1 if an addenda follows |
| 80-94 | 15 | Trace Number | `021000020000123` | ODFI routing prefix (8) + sequence (7) |

Three things in this table drive real-world behavior.

**The amount is 10 digits in cents**, capping any single ACH entry at 99,999,999.99 USD. Same Day ACH imposes a far lower limit of 1,000,000 USD by rule.

**The name field is 22 characters and nobody checks it.** Historically, ACH posting is done on account number alone. The name is informational. This is why a typo in an account number sends money to a stranger and why confirmation-of-payee schemes, standard in the UK, have no direct equivalent in US ACH.

**The trace number is the payment's identity** for its entire life, including returns. A return entry carries the original trace number in its addenda, which is how an originator matches a return to the entry that caused it.

### 5.3 Standard Entry Class Codes

The SEC code sits in the Batch Header and determines the rules that apply to every entry in the batch: what authorization is required, what return rights the receiver has, and what data must accompany the entry.

| Code | Name | Use | Authorization |
|------|------|-----|---------------|
| **PPD** | Prearranged Payment and Deposit | Consumer credits and debits: payroll, recurring bills | Written or similarly authenticated for debits |
| **CCD** | Corporate Credit or Debit | Business to business, cash concentration | Agreement between businesses |
| **CTX** | Corporate Trade Exchange | B2B with structured remittance data | Agreement, plus X12 820 or ISO 20022 payload |
| **WEB** | Internet-Initiated Entry | Consumer debits authorized online, plus P2P credits | Authenticated online authorization, account validation required |
| **TEL** | Telephone-Initiated Entry | Consumer debits authorized by phone | Recorded call or written notice |
| **ARC** | Accounts Receivable Conversion | Mailed check converted to ACH debit | Notice on the invoice |
| **BOC** | Back Office Conversion | In-person check converted after the fact | Posted notice |
| **POP** | Point of Purchase | Check converted at the register, voided and returned | Signed receipt |
| **RCK** | Re-presented Check | Bounced paper check collected via ACH | Notice |
| **IAT** | International ACH Transaction | Any entry where the funds originate or terminate outside the US | Full OFAC-screenable data on every party |
| **COR** | Notification of Change | Correction of account details | Not a payment |
| **ADV** | Automated Accounting Advice | Operator-generated accounting record | Not a payment |

The IAT code deserves emphasis. It exists because OFAC needed to see the full payment chain on cross-border activity. An IAT entry carries seven mandatory addenda records containing originator name and address, beneficiary name and address, and the originating and receiving financial institutions in each country. Sending a cross-border payment as PPD to avoid the extra data is a rules violation and a sanctions exposure.

### 5.4 Addenda Records and the Remittance Problem

The addenda record, type 7, carries 80 characters of payment-related information. Most SEC codes permit exactly one addenda per entry. CTX permits up to 9,999.

This is the mechanism behind the most persistent complaint in US corporate payments: an ACH credit arrives at an accounts receivable department with almost no information about what it pays. A 480,000 USD payment from a customer settling 43 invoices arrives with one 80-character line, or none. The receiving company then spends staff time matching cash to invoices.

CTX solves this technically by embedding a full ANSI X12 820 remittance advice across many addenda, but adoption requires both banks and both ERP systems to support it. In practice much remittance data still travels by email, entirely outside the payment network. This gap is the strongest argument for ISO 20022 based rails such as RTP and FedNow, which carry structured remittance data natively.

### 5.5 A Complete Miniature File

```
101 021000021 12345678902508290930A094101JPMORGAN CHASE         ACME CORP
5220ACME CORP           PAYROLL     1234567890PPDPAYROLL 250829250830   1021000020000001
6220210000251234567890        0000284750EMP0004821     MARIA GONZALEZ         0021000020000001
6220210000259876543210        0000312000EMP0004822     JAMES OKONKWO          0021000020000002
822000000200042000005000000000000000000059670001234567890                         021000020000001
9000001000001000000020004200000500000000000000000005967
9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999
```

Reading it: a file created 2025-08-29 at 09:30 by ACME CORP through JPMorgan Chase; one PPD payroll batch with an effective entry date of 2025-08-30; two credits totaling 5,967.50 USD; batch and file control records carrying the entry count, the routing number hash, and the credit total. The final record is padding to reach a multiple of ten.

The batch control record's entry hash, 0000042000005 in the example above, is the sum of the 8-digit receiving DFI identification fields, truncated to 10 digits. It is a checksum from an era when a tape could drop a record, and it is still validated on every file today.

---

## 6. Fedwire - How It Works

Fedwire is the closest thing in the United States to moving money itself rather than a claim on money. A Fedwire transfer is a bookkeeping entry on the Federal Reserve's balance sheet, executed on receipt, final on execution.

![Fedwire real-time gross settlement flow](diagrams/fedwire-flow.svg)

### 6.1 The Core Mechanism

Every Fedwire participant holds a **master account** at a Federal Reserve Bank. The balance in that account is central bank money: the most final form of money that exists in the dollar system, and the settlement asset for every other rail described in this document.

A Fedwire funds transfer does exactly two things:

1. Debits the sending participant's master account by the transfer amount.
2. Credits the receiving participant's master account by the same amount.

Both happen in the same transaction, in the Fed's books, in real time. There is no clearing period, no netting, no queue in the ordinary case, and no counterparty exposure between the two banks, because the Federal Reserve stands between them and has already moved the money.

This is what "real-time gross settlement" means, and it is worth separating the two halves. **Gross** means each payment settles on its own for its full amount, with no offsetting. **Real time** means it settles when it is processed, not at a scheduled time.

### 6.2 Step by Step: A 4.2 Million USD Wire

A corporate treasurer wires 4,200,000 USD to close a real estate purchase.

**Step 1: Instruction.** The treasurer submits the wire through the bank's cash management portal, providing the beneficiary bank routing number, beneficiary account number, beneficiary name, and amount. The bank applies its own controls: dual authorization, callback verification, and a beneficiary allowlist for large amounts at well-run institutions.

**Step 2: Bank-side validation and screening.** The originating bank verifies the customer has the funds or an approved intraday line, screens the parties against OFAC lists, and applies fraud rules. This is the last moment at which the payment can be stopped without the cooperation of another institution.

**Step 3: Message construction and submission.** The bank formats an ISO 20022 `pacs.008` customer credit transfer and submits it over FedLine. The Fed validates the message structure, the sender's authority, and the receiver's routing number.

**Step 4: Settlement.** The Fed checks the sender's master account. If the balance covers the transfer, or if the sender has daylight overdraft capacity, the Fed debits the sender and credits the receiver immediately, and stamps the message with output accountability data. If the account lacks funds and the sender has exhausted its net debit cap, the message is rejected or queued, depending on the sender's configuration.

**Step 5: Delivery and finality.** The Fed delivers the message to the receiving bank. At this point the payment is final and irrevocable under Regulation J and UCC Article 4A. The receiving bank now holds central bank money and owes the beneficiary the funds.

**Step 6: Beneficiary credit.** The receiving bank posts to the beneficiary's account. Reg J requires it to make the funds available to the beneficiary by the close of the funds transfer business day, and in practice large-value wires post within minutes.

Elapsed time from submission to settlement is typically under a minute. The bank-side controls in step 2, particularly callback verification, are usually the slowest part of the process by a wide margin, and deliberately so.

### 6.3 Operating Hours

The Fedwire Funds Service runs a 22-hour operating day:

| Event | Time (ET) |
|-------|-----------|
| Opening | 9:00 p.m. on the preceding calendar day |
| Cutoff for third-party (customer) transfers | 6:00 p.m. |
| Cutoff for bank-to-bank (settlement) transfers | 6:30 p.m. |
| Closing | 7:00 p.m. |

The half hour between the customer cutoff and the interbank cutoff exists so that banks can square their own positions after customer activity stops. The long overnight opening at 9:00 p.m. accommodates Asian market hours and the funding of CHIPS positions before the US business day.

The service operates on business days only. It is closed on weekends and Federal Reserve holidays, which is exactly the gap that FedNow and RTP were built to fill.

### 6.4 Message Structure

![Fedwire message structure](diagrams/fedwire-message-structure.svg)

Fedwire completed a single-day cutover from its proprietary tag-based format to ISO 20022 on July 14, 2025. Both formats are worth knowing, because the legacy tags still appear in bank systems, documentation, and every core banking integration written before 2025.

**Legacy Fedwire tag format**, as defined in the Fedwire Application Interface Manual:

```
{1500}30                            Sender supplied information
{1510}1000                          Type code 10 (funds transfer), subtype 00 (basic value)
{1520}20250829B1QGC07C000123        IMAD: input accountability data
{2000}000000420000000               Amount, in cents, 12 digits, zero filled
{3100}021000021JPMORGAN CHASE       Sender DI: routing number and short name
{3320}FT250829000451                Sender reference number
{3400}026009593BANK OF AMERICA      Receiver DI
{3600}CTR                           Business function code: customer transfer
{4200}D/1234567890                  Beneficiary: identifier and name/address
NORTHSIDE TITLE COMPANY LLC
{5000}D/9876543210                  Originator
HARBOR PROPERTIES INC
{6000}CLOSING FILE 2025-4471        Originator to beneficiary information
```

**Key legacy tags:**

| Tag | Field | Purpose |
|-----|-------|---------|
| `{1510}` | Type and subtype code | Distinguishes value transfers, reversals, drawdown requests, and service messages |
| `{1520}` | IMAD | Input Message Accountability Data: date, source identifier, sequence. The unique key for the message |
| `{1120}` | OMAD | Output Message Accountability Data: assigned by the Fed on delivery |
| `{2000}` | Amount | 12 digits, in cents. Maximum 9,999,999,999.99 USD |
| `{3100}` | Sender DI | Originating bank routing number |
| `{3400}` | Receiver DI | Receiving bank routing number |
| `{3600}` | Business function code | `CTR` customer transfer, `CTP` customer transfer plus, `BTR` bank transfer, `DRW` drawdown payment, `DRB` drawdown request |
| `{4200}` | Beneficiary | The party being paid |
| `{5000}` | Originator | The party paying |
| `{6000}` | Originator to beneficiary info | Free text, four lines of 35 characters |

**ISO 20022 equivalents**, post-migration:

| ISO message | Purpose | Legacy equivalent |
|-------------|---------|-------------------|
| `pacs.008` | Customer credit transfer | CTR, CTP |
| `pacs.009` | Financial institution credit transfer | BTR |
| `pacs.004` | Payment return | Reversal subtypes |
| `camt.056` | Request for cancellation | Request for reversal |
| `camt.029` | Resolution of investigation | Response to request |
| `pacs.002` | Payment status report | Acknowledgement and rejection |

The migration matters for more than format aesthetics. ISO 20022 carries structured party data with distinct fields for name, street, town, postal code, and country, instead of four lines of free text. That structure improves sanctions screening precision, reduces false positives, and makes straight-through processing on the receiving side achievable. It also aligns Fedwire with CHIPS, which migrated in April 2024, and with the global cross-border migration on SWIFT.

### 6.5 Daylight Overdrafts and Intraday Liquidity

Real-time gross settlement has one structural cost: a bank must have the money at the instant it sends. Across a whole banking system, the payments a bank expects to receive during the day are what fund the payments it sends, and those arrivals do not line up neatly in time.

The Federal Reserve solves this by lending intraday. A bank whose master account goes negative during the day is in **daylight overdraft**, and the Fed's Payment System Risk policy governs it:

- Each institution has a **net debit cap**, expressed as a multiple of its risk-based capital, set by cap category: exempt, de minimis, average, above average, or high. The higher categories require board-approved self-assessment.
- **Collateralized daylight overdrafts carry no fee.** Since March 2011, an institution that pledges collateral to the Fed borrows intraday for free.
- **Uncollateralized daylight overdrafts are charged at an annual rate of 50 basis points**, applied to the average daily overdraft and prorated over the 22-hour operating day, with a fee waiver applied per two-week reserve maintenance period.
- Institutions in weak financial condition can be placed on a zero cap and required to prefund.

This policy is the single most important control on Fedwire's systemic risk. It caps how much unsecured intraday credit the central bank extends and prices what remains, while keeping the payment system liquid enough to clear roughly 4 trillion USD a day.

![Daylight overdraft and intraday liquidity](diagrams/daylight-overdraft.svg)

### 6.6 Fedwire Securities Service

Fedwire Funds has a sibling that is often confused with it. The **Fedwire Securities Service** is the book-entry system for US Treasury securities, agency securities, and certain mortgage-backed securities. It holds the definitive record of ownership and moves securities between participants.

Its defining feature is **delivery versus payment**: the securities leg and the cash leg settle simultaneously, so neither party can be delivered against without payment. The cash leg settles across the same master accounts as Fedwire Funds. Every Treasury auction settlement, every repo unwind, and every primary dealer position change lands here.

---

## 7. CHIPS - How It Works

CHIPS solves the liquidity problem that real-time gross settlement creates, and it does so with an algorithm rather than with credit.

### 7.1 The Central Idea

On a typical day, the payments flowing between large banks substantially offset each other. Bank A sends Bank B 40 billion USD; Bank B sends Bank A 39 billion USD. Under gross settlement, both banks need to fund 40 billion and 39 billion respectively. Under netting, one billion changes hands.

CHIPS extracts that offsetting continuously rather than once at the end of the day, and it makes each payment final at the moment it is released. The result is a system that settles well over a trillion dollars a day against prefunded balances measured in single-digit billions.

![CHIPS balanced release algorithm](diagrams/chips-netting-algorithm.svg)

### 7.2 The Daily Cycle

![CHIPS daily settlement cycle](diagrams/chips-daily-cycle.svg)

**Prefunding.** Each morning, every participant transfers its **opening position requirement** to the CHIPS account at the Federal Reserve Bank of New York via Fedwire. The requirement is set by CHIPS based on the participant's recent payment activity, and it must arrive by the start of the processing day. That balance is the participant's working liquidity for the entire day.

**Submission and queuing.** Participants submit payment orders throughout the day. A payment does not settle on arrival. It enters a central queue, ordered by submission time but not strictly first in first out, where the release algorithm evaluates it.

**Release.** The balanced release algorithm runs continuously and looks for three kinds of opportunity:

1. **Single release.** The sender's current position covers the payment. Release it, decrement the sender's balance, increment the receiver's.
2. **Bilateral offset.** Two payments sit in the queue in opposite directions between the same pair of participants. Release both together; only the difference touches either balance.
3. **Multilateral offset.** A cycle of payments exists among three or more participants such that releasing all of them together leaves every participant's balance non-negative. Release the whole set as one atomic operation.

The algorithm's power comes from the third case. A chain of payments among six banks, none of which could be released on its own, can settle simultaneously because the money flows in a loop. No participant needs to fund the gross amount, only its net exposure at that instant.

**Finality at release.** The moment a payment is released, it is final and irrevocable. The receiving participant can rely on it immediately. There is no end-of-day condition, no unwind, and no provisional period. This is the single most important difference between CHIPS today and CHIPS before 2001.

**Supplemental funding.** A participant with a large outbound queue can send additional funds to its CHIPS balance during the day via Fedwire, which unblocks queued payments.

**Closing.** Late in the afternoon CHIPS stops accepting new payments and runs a final multilateral netting of everything still in the queue. Participants with a net obligation fund it by Fedwire; the remaining payments are then released; and each participant's residual balance is returned to it by Fedwire. Every participant ends the day with a zero balance at CHIPS, which is why the system carries no overnight credit exposure at all.

### 7.3 Why the Algorithm Matters

The liquidity efficiency is the point. Settling roughly 1.8 trillion USD a day against a few billion dollars of prefunding is a turnover ratio in the hundreds. Each prefunded dollar is reused hundreds of times as it circulates through offsetting payments.

The comparison to Fedwire makes the tradeoff visible. On Fedwire, a payment settles the instant the sender has funds, but the sender must have the funds. On CHIPS, a payment may sit in the queue for minutes or longer waiting for an offset, but the sender may never need to fund it in gross at all.

The cost is time and control. A CHIPS payment settles when the algorithm can settle it, not when the sender wants. Banks that need a payment out immediately send it by Fedwire and pay the liquidity cost.

### 7.4 CHIPS Identifiers and Message Format

CHIPS uses its own identifier scheme in addition to routing numbers:

- **CHIPS Participant Number**: a four-digit identifier for each direct participant.
- **CHIPS UID (Universal Identifier)**: a six-digit identifier assigned to a specific account at a participant, used to address customer accounts precisely. A payment carrying a valid UID can be posted straight through with no manual repair, which is why correspondent banking operations care about them.

CHIPS migrated to ISO 20022 in April 2024, adopting `pacs.008` and `pacs.009` in line with Fedwire's later migration and the global SWIFT cross-border migration. Before that it used a proprietary structured format with its own field tags.

### 7.5 CHIPS Membership and Regulation

CHIPS participation is limited to large banks and US branches and agencies of foreign banks that meet capital, supervision, and operational requirements. Participation has consolidated sharply, from roughly 140 participants in the early 1990s to about 40 today, following bank mergers and the retreat of some foreign banks from direct US clearing.

Institutions that are not participants reach CHIPS through a participant acting as correspondent. This is the structural reason that a small number of large US banks sit at the center of global dollar clearing, and why losing a correspondent relationship can effectively cut an institution out of the dollar system.

CHIPS is a **designated financial market utility** under Title VIII of the Dodd-Frank Act, which subjects it to Federal Reserve supervision, heightened risk-management standards under Regulation HH, and access to Federal Reserve accounts and services. The designation reflects a simple judgment: a CHIPS failure would be a systemic event.

---

## 8. Technical Architecture and Connectivity

![US payment rails architecture](diagrams/architecture.svg)

### 8.1 The Master Account Is the Foundation

Everything in this document ultimately settles in one place: master accounts at the Federal Reserve. ACH net positions post there. Fedwire debits and credits happen there. CHIPS prefunding arrives there and returns from there. RTP prefunds a joint account there. FedNow settles there.

That single fact explains the structure of the US payments industry. Access to a master account is access to the settlement layer, and everything else is a claim on someone who has one.

### 8.2 FedLine: How Banks Connect to the Fed

The Federal Reserve's access channels are collectively branded FedLine, and the tier a bank chooses determines what it can do and how fast.

| Channel | Type | Typical user | Capability |
|---------|------|--------------|------------|
| **FedLine Direct** | Computer-to-computer over dedicated circuits | Large banks, high volume | Unattended straight-through processing, real-time and batch, highest throughput |
| **FedLine Command** | Computer-to-computer, file-based | Mid-size institutions | Automated file exchange without full Direct infrastructure |
| **FedLine Advantage** | Web-based over VPN | Community banks, credit unions | Manual and semi-automated wire and ACH operations |
| **FedLine Web** | Web-based | Small institutions | Inquiry, reporting, low-volume operations |
| **FedMail** | Email | Any | Reports and advices only, no payment origination |

Access control uses hardware credentials and certificate-based authentication, with role separation enforced by a designated End User Authorization Contact at each institution. The security model assumes the endpoint at the bank is the weak point, because historically it has been.

### 8.3 The National Settlement Service

The National Settlement Service is the quiet piece of infrastructure that lets private clearing arrangements settle in central bank money. An operator of a clearing arrangement, such as EPN for ACH or a check clearinghouse, computes net positions among its members and submits a settlement file to the Fed. The Fed then debits and credits all the member master accounts simultaneously.

NSS serves dozens of arrangements: ACH, check clearinghouses, card networks settling interbank positions, and others. Its property of settling all legs at once, or none, is what keeps a failed member from leaving a partially settled batch.

### 8.4 Resilience and Operational Design

The Federal Reserve operates its payment services from multiple geographically separated data centers with synchronous replication, and the industry maintains a formal expectation of two-hour recovery for critical payment infrastructure following the post-9/11 interagency resilience guidance.

The record is strong but not perfect. On February 24, 2021, an operational error during automated maintenance took several Federal Reserve services offline for several hours, including Fedwire Funds and FedACH. Wires simply could not be sent for part of a business day, which caused settlement backlogs across the industry and demonstrated how few fallbacks exist when the primary rail is unavailable. The Fed published a post-incident review and changed its change-management controls.

The deeper lesson is structural. There is exactly one Fedwire. CHIPS is an alternative only for institutions that participate in it and only for payments to other participants. For most banks, a Fedwire outage has no substitute.

### 8.5 Processing Characteristics

The three rails have very different computational shapes.

**ACH** is a batch sort. The dominant operation is grouping millions of fixed-width records by destination routing number and computing sums. It is embarrassingly parallel, cheap per item, and latency-tolerant. Files of hundreds of thousands of entries are routine.

**Fedwire** is a serialized ledger update. Each payment must check and update a master account balance, which means transactions against the same account cannot be reordered freely. Correctness demands strict serialization on account state, which caps how much the workload can be parallelized.

**CHIPS** is an optimization problem. The release algorithm must repeatedly search a queue for sets of payments that can settle together without driving any participant negative. This is graph search over a changing structure, run continuously under a latency budget, and it is by a wide margin the most computationally interesting of the three.

---

## 9. Money Flow and Economics

### 9.1 The Federal Reserve Prices at Cost

The Monetary Control Act of 1980 requires the Federal Reserve to charge for its priced services and to recover, over the long run, all direct and indirect costs plus a private sector adjustment factor representing the taxes and return on capital a private provider would face. The Fed is not allowed to run Fedwire or FedACH as a subsidized public good, and it is not allowed to profit from them either.

That single statutory constraint sets the price level of the entire US payment system. It is why wholesale ACH costs fractions of a cent and a wire costs less than a dollar at the operator, and it is why the enormous spread between those numbers and what a customer pays is bank margin rather than infrastructure cost.

### 9.2 Wholesale Costs

| Service | Approximate operator cost | Structure |
|---------|---------------------------|-----------|
| **FedACH forward item** | Fractions of a cent per entry | Tiered by monthly volume, plus monthly participation fees |
| **FedACH receipt** | Fractions of a cent per entry | Tiered |
| **Same Day ACH surcharge** | A few cents per entry | Charged to the originating bank on top of the base fee |
| **Same Day Entry Fee (Nacha rule)** | About 5 cents per same-day forward entry | Paid by the ODFI to the RDFI, the only interbank compensation in ACH |
| **Fedwire origination** | Well under 1 USD, tiered | Both the sender and the receiver pay a per-transfer fee |
| **Fedwire participation** | Roughly 100 USD per month per routing number | Flat monthly fee |
| **CHIPS** | Per-payment fee set by The Clearing House | Volume-tiered, participant-funded |

Exact per-item fees change every January when the Fed publishes its annual fee schedule, and the tiers reward volume steeply. The orders of magnitude are what matter: ACH is priced in hundredths of a cent to a cent, wires in tens of cents, and both are trivially small compared to what the payment is worth.

The Same Day Entry Fee is worth a second look because it is an anomaly. ACH generally has no interchange: the RDFI receives entries, posts them, handles returns, and is paid nothing for it. Nacha created the Same Day Entry Fee specifically to compensate receiving banks for the operational cost of supporting intraday windows, because without it RDFIs had no economic reason to build the capability. It is the closest thing ACH has to card interchange, and it is roughly one one-thousandth the size.

### 9.3 What End Users Pay

![Money flow and fees across rails](diagrams/money-flow.svg)

| Payment method | Typical cost to the payer | Who bears it |
|----------------|---------------------------|--------------|
| Consumer ACH credit or debit | 0 USD | Bank absorbs, funded by deposit spread |
| Business ACH origination | 0.20 to 1.50 USD per item, often bundled | Originator |
| Same Day ACH | Add 0.10 to 1.00 USD per item | Originator |
| Outgoing domestic wire | 25 to 35 USD | Sender |
| Incoming domestic wire | 0 to 15 USD | Receiver |
| Outgoing international wire | 35 to 50 USD plus FX spread | Sender |
| Card acceptance | 1.5 to 3.5 percent plus a fixed fee | Merchant |
| Paper check | 2 to 4 USD fully loaded | Issuer |

The arithmetic on a single transaction explains most corporate payment behavior. On a 50,000 USD supplier payment:

- Card: roughly 1,250 USD in interchange and fees
- Wire: roughly 30 USD
- ACH: under 1 USD, often near zero
- Check: roughly 3 USD in materials, postage, and handling, plus reconciliation labor

This is why B2B payments in the United States moved to ACH and not to cards, and why the remaining check volume is sustained by remittance data and process inertia rather than economics.

### 9.4 Where Banks Actually Make Money

Banks earn very little from the per-item fees. The revenue sits elsewhere:

**Deposit spread.** The largest economic benefit of operating payments is the deposit balances that payments create and hold. A bank that runs a corporate customer's payroll holds the funding balance until the effective entry date.

**Wire fees.** A 30 USD outbound wire fee against a wholesale cost measured in cents is among the highest-margin retail banking products that exists. Wire fee revenue is a meaningful line item at large retail banks.

**Treasury management.** ACH origination is usually sold inside a treasury management package with positive pay, account reconciliation, lockbox, and reporting. The payment itself is a loss leader for the relationship.

**Float and timing, now largely gone.** Historically banks earned on the gap between debiting a payer and crediting a payee. Regulation CC availability requirements, same-day settlement, and low rates for much of the last two decades compressed this to near irrelevance for domestic payments, though it persists in cross-border.

### 9.5 The Cost of Risk

The unglamorous truth of payment economics is that risk costs more than processing. For an ODFI, the cost stack on ACH origination includes underwriting each originator's credit, monitoring return rates against Nacha thresholds, funding returns when an originator fails, and staffing exception handling. A single failed originator collecting consumer debits can generate more loss than years of per-item fee revenue from that customer.

For wires, the equivalent cost is fraud. Business email compromise losses, and the operational apparatus built to prevent them, dwarf the processing cost of the wire itself. Callback verification, dual control, beneficiary allowlists, and out-of-band confirmation exist because the payment is irrevocable and the loss is real.

---

## 10. Security, Fraud, and Risk

![Fraud vectors across US payment rails](diagrams/fraud-vectors.svg)

### 10.1 The Risk Profile Follows the Finality Rules

Each rail's fraud pattern is a direct consequence of its finality and reversal rules, which makes the threat model unusually predictable.

**Fedwire is irrevocable, so attackers target the instruction.** If a criminal can cause a legitimate bank to send a legitimate wire to the wrong beneficiary, the money is gone and no system-level mechanism brings it back. Every dollar of attack effort goes into deception rather than into breaking cryptography.

**ACH debits are reversible for 60 days, so attackers target the pull.** An unauthorized debit is easy to initiate and easy to reverse, so the fraud economics favor volume and speed: collect many small debits, extract the funds, and disappear before the returns arrive.

**ACH credits are hard to reverse, so attackers target payroll and vendor files.** Changing an employee's direct deposit account or a vendor's payment instructions redirects a legitimate, expected payment. Reversals of erroneous ACH credits are permitted only in narrow circumstances and require the receiving bank's cooperation.

### 10.2 Business Email Compromise

Business email compromise is the dominant fraud loss against wires in the United States. The FBI's Internet Crime Complaint Center reported roughly 2.8 billion USD in BEC losses in 2024 alone, and reported losses substantially understate the total because many incidents are never reported.

The mechanism does not require breaking anything technical:

1. The attacker compromises or spoofs an email account, typically at a title company, law firm, vendor, or executive.
2. The attacker monitors correspondence to learn the timing, amount, and language of a pending payment.
3. At the right moment, the attacker sends updated wire instructions to the payer, in context, in the expected voice, referencing the correct transaction.
4. The payer wires funds to the attacker's account.
5. The funds are moved out within hours, often through money mules, sometimes converted to crypto or wired abroad.

The defenses are procedural rather than technical: verified callbacks to a known phone number not taken from the email, dual authorization for large payments, beneficiary allowlists that require an out-of-band change process, and delay windows on newly added beneficiaries. The FBI's Financial Fraud Kill Chain can freeze funds if a victim reports quickly enough and the wire meets threshold criteria, but recovery rates fall sharply after the first day.

### 10.3 ACH-Specific Risks

**Unauthorized debits.** An originator with valid routing and account numbers can initiate a debit without the account holder's involvement. The account holder's protection is the 60-day return right under Reg E and the Nacha rules, which shifts the loss to the originator and, if the originator cannot pay, to the ODFI.

**Corporate account takeover.** An attacker compromising a business's online banking credentials can originate a fraudulent ACH file. Businesses do not have Reg E protection, so the loss is generally theirs unless the bank's security procedures were commercially unreasonable under UCC 4A. This distinction has been litigated repeatedly, and the outcomes hinge on whether the bank's authentication was adequate relative to the customer's risk profile.

**Payroll diversion.** An attacker with access to an employee self-service portal changes the direct deposit account. The next payroll credit lands in the attacker's account. The employer is usually still obligated to pay the employee, so the employer eats the loss.

**Return abuse.** A consumer who genuinely authorized a debit disputes it as unauthorized within 60 days. The RDFI must generally honor the claim on the customer's written statement. This is "friendly fraud" with a two-month tail and no chargeback representment process comparable to card networks.

### 10.4 Controls That Work

| Control | Rail | What it stops |
|---------|------|---------------|
| **ACH debit block** | ACH | All debits to an account. Used on accounts that should only ever receive credits |
| **ACH debit filter** | ACH | Debits from any originator not on an approved list, with amount caps |
| **ACH positive pay** | ACH | Presents exception debits for customer decision before posting |
| **Callback verification** | Wire | BEC. The single most effective control that exists |
| **Dual authorization** | All | Single-actor fraud, internal and external |
| **Beneficiary allowlist** | Wire | New-beneficiary fraud, by forcing an out-of-band change process |
| **Account validation** | ACH WEB debits | Debits against nonexistent or invalid accounts. Required by Nacha rule since March 2021 |
| **Exposure limits** | ACH | Originator failure exceeding what the ODFI can absorb |
| **OFAC screening** | All | Sanctioned parties, at origination and receipt |

### 10.5 The Bangladesh Bank Heist

The 2016 Bangladesh Bank incident is the clearest case study in how large-value payment fraud actually works, and it is instructive precisely because the payment systems performed exactly as designed.

Attackers compromised systems at Bangladesh Bank and used legitimate SWIFT credentials to send payment instructions to the Federal Reserve Bank of New York, where Bangladesh Bank held its dollar reserves. The instructions requested transfers totaling roughly 951 million USD. Most were stopped, largely by chance: a typo in a beneficiary name triggered manual review, and a beneficiary address containing the word "Jupiter" matched a sanctions-related keyword. Roughly 101 million USD moved, and about 81 million USD reached casinos in the Philippines, where most of it disappeared.

The attackers also deployed malware to suppress printed confirmations at Bangladesh Bank, delaying detection across a weekend that spanned different national holidays in Bangladesh, the United States, and the Philippines.

No cryptography was broken. No payment system was compromised. The attackers obtained the ability to issue valid instructions and then exploited the fact that valid instructions to a real-time gross settlement system are final. Every subsequent industry control, including SWIFT's Customer Security Programme and stricter endpoint requirements at central banks, addresses that lesson: in a final settlement system, the endpoint is the attack surface.

### 10.6 Systemic and Operational Risk

Beyond fraud, the rails carry structural risks that regulators watch continuously.

**Settlement risk.** Fedwire eliminates it by settling in central bank money in real time. CHIPS eliminated it in 2001 by prefunding and finality at release. ACH retains a residual form: the RDFI often makes funds available before interbank settlement, and a failing ODFI between posting and settlement would leave receiving banks exposed. In practice, Federal Reserve settlement and the short interval make this a small exposure, but it is not zero.

**Liquidity risk.** In an RTGS system, a large participant that stops sending payments while continuing to receive them can drain liquidity from the system. Payment gridlock is a documented phenomenon in RTGS systems worldwide, and daylight credit exists in large part to prevent it.

**Concentration risk.** A small number of large banks provide correspondent access to most of the system. That concentration is efficient and fragile in the same breath.

**Operational risk.** The February 2021 Federal Reserve outage demonstrated that a single operational error can stop the country's wire traffic for hours, and that there is no general substitute.

---

## 11. Regulation and Legal Framework

The legal treatment of a US payment depends almost entirely on which rail carries it and whether the payer is a consumer. The same 5,000 USD moved three different ways lands under three different legal regimes with materially different outcomes when something goes wrong.

### 11.1 The Legal Map

| Framework | Covers | Key effect |
|-----------|--------|------------|
| **UCC Article 4A** | Wholesale credit transfers: wires, and ACH credits to non-consumer accounts | Allocates loss between banks and customers; permits reliance on account number over name |
| **Regulation E (EFTA)** | Consumer electronic fund transfers, including ACH | Error resolution rights, liability caps, stop payment rights on preauthorized debits |
| **Regulation J, Subpart B** | Fedwire funds transfers | Incorporates 4A as the operating law of Fedwire; establishes finality |
| **Regulation CC** | Funds availability | Requires next-business-day availability for electronic payments received |
| **Nacha Operating Rules** | ACH | Contractual rulebook binding all participants; warranties, return rights, enforcement |
| **Regulation HH** | Designated financial market utilities | Risk-management standards for CHIPS and other DFMUs |
| **Federal Reserve PSR Policy** | Intraday credit | Net debit caps, daylight overdraft pricing, collateral treatment |
| **BSA / OFAC** | All payments | Recordkeeping, travel rule, sanctions screening and blocking |

### 11.2 The Consumer and Business Divide

The most consequential legal fact in US payments is that **Regulation E does not cover wire transfers**, and it does not cover business accounts at all.

For a consumer ACH debit, Reg E provides a defined error resolution process, caps liability for unauthorized transfers, requires provisional credit within ten business days in most cases, and gives the consumer the right to stop a preauthorized debit by notifying the bank at least three business days before the scheduled date.

For a business wire, none of that applies. UCC 4A governs, and its core rule is that if the bank and the customer agreed on a commercially reasonable security procedure and the bank followed it in good faith, the payment order is effective even if it was not actually authorized by the customer. The loss falls on the business.

That asymmetry is why a consumer who is defrauded through ACH often recovers and a business defrauded through wire often does not, and why treasury departments invest heavily in controls that consumers never see.

### 11.3 The Name and Number Rule

UCC 4A-207 contains a provision that surprises almost everyone who encounters it. If a payment order identifies the beneficiary by both name and account number and the two do not match, the receiving bank may rely on the account number alone, provided it does not have actual knowledge of the mismatch.

This is why US payments post on account number, why a transposed digit sends money to a stranger, and why the United States has no direct equivalent of the UK's Confirmation of Payee scheme, which checks name against account before the payer commits. The legal default permits the bank to ignore the name, so systems were built to ignore it.

### 11.4 The Nacha Rulebook as Private Law

ACH is governed primarily by a private contract, not a statute. Every participating financial institution agrees to the Nacha Operating Rules, and those rules bind originators through their agreements with ODFIs.

The rules carry real enforcement. Nacha's National System of Fines allows escalating penalties for rules violations, from modest amounts for a first Class 1 violation to substantial monthly fines for persistent Class 3 violations, and Nacha can require an ODFI to terminate an originator. Return rate thresholds, authorization requirements, retention periods, and data security standards all live here.

The rulebook changes annually, and originators that treat it as static accumulate violations. Recent amendment cycles have concentrated on fraud: account validation for WEB debits, standardized entry descriptions so that receiving banks can identify payroll and purchase transactions, and, phased through 2026, explicit obligations on both originating and receiving institutions to monitor for credit-push fraud.

### 11.5 Sanctions and BSA Obligations

Every institution touching these rails screens against OFAC lists. A wire to a sanctioned party must be blocked, meaning the funds are frozen in a blocked account and reported to OFAC, or rejected, depending on the program. Screening applies at origination and at receipt, and false positives are a substantial operational cost.

The **BSA travel rule** requires that funds transfers of 3,000 USD or more carry specified information about the originator and the beneficiary through the payment chain, and that institutions retain records. This is the reason IAT entries in ACH carry mandatory addenda with full party detail: the network had no way to convey travel rule data until the IAT format was created.

The **Dodd-Frank remittance transfer rule**, implemented in Regulation E subpart B, adds disclosure, error resolution, and cancellation rights for consumer transfers sent abroad, including international wires above 15 USD, which is one of the few places consumer protection reaches into the wire system.

### 11.6 Regulation CC and Availability

Regulation CC is usually discussed as a check rule, but its electronic payment provision matters here: funds received electronically must generally be made available for withdrawal no later than the business day after the banking day on which they are received. Nacha layers tighter requirements on top, requiring Same Day ACH credits to be available by 5:00 p.m. local time on the settlement day.

---

## 12. Comparisons - Choosing a Rail

### 12.1 The Full US Landscape

![Choosing a payment rail](diagrams/rail-selection.svg)

| Rail | Speed | Finality | Reversibility | Cost | Limit | Hours | Typical use |
|------|-------|----------|---------------|------|-------|-------|-------------|
| **ACH standard** | 1 to 2 business days | At settlement, subject to returns | Returns up to 60 days for consumer unauthorized | Near zero | 99,999,999.99 USD per entry | Business days | Payroll, recurring billing, B2B |
| **Same Day ACH** | Hours, three windows | At settlement, subject to returns | Same as standard | Cents | 1,000,000 USD | Business days | Urgent payroll, disbursements |
| **Fedwire** | Seconds | Immediate and final | None | Tens of cents wholesale, 25 to 35 USD retail | Effectively unlimited | 22 hours, business days | Real estate, securities, treasury, large B2B |
| **CHIPS** | Minutes, queued | Final at release | None | Per-payment fee | Effectively unlimited | Business days | Cross-border dollar clearing, correspondent banking |
| **RTP** | Seconds | Immediate and final | None | Cents | 10,000,000 USD | 24x7x365 | Instant payouts, bill pay, gig economy |
| **FedNow** | Seconds | Immediate and final | None | Cents | Configurable, raised over time | 24x7x365 | Instant payouts, especially at smaller institutions |
| **Card** | Authorization instant, settlement 1 to 3 days | Provisional | Chargebacks up to 120 days or more | 1.5 to 3.5 percent | Card limits | 24x7 | Consumer retail, small B2B |
| **Check** | Days | On collection | Return items, forgery claims | 2 to 4 USD loaded | Unlimited | Business days | Legacy B2B, remittance-heavy payments |

### 12.2 The Decision in Practice

The choice collapses to four questions.

**Does the recipient need certainty right now?** If yes, the answer is a wire, RTP, or FedNow. Nothing else provides irrevocable settlement in seconds. A house closing does not happen on ACH.

**Is the amount large enough that the fee is irrelevant?** Above roughly 100,000 USD, the 30 USD wire fee is a rounding error and the certainty is worth it. Below roughly 10,000 USD, the fee starts to matter and ACH usually wins.

**Is the payment recurring and predictable?** Then ACH, because it was designed for exactly that and costs nothing.

**Does the payer need to pull rather than push?** Then ACH, because it is the only rail here that supports debit pull. RTP and FedNow support a Request for Payment, which is a message asking the payer to push, not a pull. That distinction is the main reason ACH debit volume has not migrated to instant rails.

### 12.3 Fedwire Versus CHIPS

For a bank that participates in both, the choice is a liquidity calculation.

Fedwire settles the payment immediately and costs the full amount of liquidity at that instant. CHIPS may settle in a minute or in an hour, but it may cost almost no liquidity because an offsetting payment arrives. A bank managing its intraday position sends time-critical payments over Fedwire and routes the rest through CHIPS to conserve reserves.

The rule of thumb across the industry: Fedwire for domestic time-critical and for anything where the counterparty is not a CHIPS participant; CHIPS for cross-border dollar payments, correspondent flows, and high-volume interbank activity where netting efficiency compounds.

### 12.4 The United States Versus Everyone Else

The US payment landscape is unusual in having many rails where most countries have consolidated to few.

| Country | Batch / low value | Large value | Instant |
|---------|-------------------|-------------|---------|
| **United States** | ACH (two operators) | Fedwire, CHIPS | RTP, FedNow |
| **Eurozone** | SEPA Credit Transfer, SEPA Direct Debit | TARGET2 / T2 | SEPA Instant (SCT Inst) |
| **United Kingdom** | Bacs | CHAPS | Faster Payments |
| **India** | NACH | RTGS | UPI, IMPS |
| **Brazil** | TED / boleto legacy | STR | PIX |
| **Japan** | Zengin | BOJ-NET | Zengin, extended hours |

Two structural differences stand out.

**Instant payment adoption.** Brazil's PIX and India's UPI reached near-universal adoption within a few years, because both were mandated or heavily promoted by the central bank, both are free or near-free to consumers, and both were built with a single national addressing scheme. US instant payment adoption is slower because it is voluntary, fragmented between two networks, and competing against a card system with entrenched rewards economics.

**Direct debit.** SEPA Direct Debit carries a mandate framework with an 8-week no-questions refund right for authorized transactions and 13 months for unauthorized. ACH's 60-day consumer window is shorter but its authorization requirements are lighter. The two systems make opposite tradeoffs between friction at setup and protection after the fact.

**Address verification.** The UK and the EU have moved to name-checking before payment: Confirmation of Payee in the UK, and Verification of Payee mandated across the EU under the Instant Payments Regulation. The United States, constrained by UCC 4A-207's number-over-name rule and the absence of a central account directory, has no equivalent mandate.

---

## 13. Modern Developments

### 13.1 ISO 20022 Everywhere

The largest technical change to US payments in decades finished in 2025. CHIPS migrated to ISO 20022 in April 2024. The Fedwire Funds Service completed a single-day cutover on July 14, 2025, after the Federal Reserve moved the date from an earlier March 2025 target to give the industry more preparation time.

The practical gains are structural data. Party information moves from free-text lines to defined fields for name, street, building number, postal code, town, and country. Remittance information can be structured or can reference a remittance document. Purpose codes describe why a payment is being made.

The downstream effects take longer than the migration. Sanctions screening improves when a country field is a country field rather than the third line of an address block. Straight-through processing rates rise when a receiving bank can parse a beneficiary rather than pattern-match it. Reconciliation improves when remittance data survives the trip. None of that happens automatically; it requires every bank and every corporate system in the chain to actually use the new fields rather than stuffing legacy strings into them.

ACH is the outlier. The Nacha file format remains 94-character fixed-width records, and there is no announced plan to replace it. The format's inertia is a function of its installed base: every payroll system, ERP, core banking platform, and bank integration in the country reads and writes it.

### 13.2 Instant Payments Arrive, Slowly

The United States now has two instant payment networks running in parallel.

**RTP**, launched by The Clearing House in November 2017, was the first new US payment rail in over 40 years. It settles in seconds, operates 24x7x365, and prefunds through a joint account at the Federal Reserve. Its per-payment limit was raised to 10 million USD in February 2025, a change aimed squarely at commercial and real-estate use cases that previously required a wire.

**FedNow**, launched by the Federal Reserve on July 20, 2023, provides the same capability with the Fed as operator, settling directly across master accounts. Its reach among small and mid-size institutions has grown quickly because those institutions already have a Fed relationship and FedLine connectivity.

Both networks support **Request for Payment**, a message that asks a payer to send funds. This is the industry's answer to the fact that instant rails are credit push only, and it is a genuinely different model from ACH debit: the payer approves each payment rather than granting a standing authorization. It removes the unauthorized-debit fraud surface and adds friction to recurring billing, which is why bill payers have adopted it slowly.

Adoption is real but incomplete. Volumes on both networks are growing at high rates from a small base, and their combined volume remains a small fraction of ACH. The binding constraint is not technology. It is that credit push instant payments are irrevocable, which makes them attractive to fraudsters and makes banks cautious about opening them widely to consumers.

### 13.3 Same Day ACH Keeps Growing

Same Day ACH has been the quiet success of the last decade. From its 2016 launch it has grown to well over a billion payments a year and trillions of dollars in value, with the March 2022 increase of the per-payment limit to 1,000,000 USD unlocking commercial use cases that had been capped out.

The economics explain the adoption. Same Day ACH costs a few cents more than standard ACH and provides same-day settlement. A wire costs 30 USD. For a payment that needs to arrive today but does not need to arrive in the next 60 seconds, Same Day ACH is roughly 1,000 times cheaper than the alternative.

### 13.4 Fraud Rules Catch Up to Credit Push

Nacha's rules historically focused on unauthorized debits, because that was where the losses were. The rise of business email compromise and payroll diversion shifted losses to credit push, where the existing rulebook had little to say.

Nacha approved a set of risk management amendments that phase in through 2026, establishing a base obligation on originators, third-party senders, and originating institutions to monitor their credit-push activity for fraud, and a parallel obligation on receiving institutions to monitor incoming credits for suspicious characteristics. The rules also standardize entry descriptions such as "PAYROLL" and "PURCHASE" so receiving banks can identify payment types they should be watching.

The rules also give receiving institutions clearer footing to delay or return suspicious credits, and expand the framework for returning funds when fraud is identified after the fact. This is the first substantial change in years to how the ACH network handles a payment that was authorized by the sender but induced by a criminal.

### 13.5 Expanded Operating Hours

The Federal Reserve has sought public comment on expanding the operating days of the Fedwire Funds Service and the National Settlement Service to include weekends and holidays, potentially moving to a 22-hour day every day of the year.

The motivation is alignment. FedNow and RTP already run 24x7x365. Every hour that Fedwire and NSS are closed is an hour in which instant payment networks accumulate positions that cannot be settled in central bank money, forcing participants to hold prefunded balances across weekends. Expanding the settlement layer's hours reduces that burden. The obstacle is that a 24x7 settlement layer requires 24x7 staffing, liquidity management, and reconciliation at every participating institution.

### 13.6 Stablecoins and Tokenized Deposits

Dollar stablecoins now settle meaningful value on public blockchains, and the enactment of a federal payment stablecoin framework in 2025 gave the category a supervised legal foundation in the United States for the first time.

The relevant question for this document is not whether stablecoins compete with ACH on consumer payments, where they mostly do not, but whether they compete with correspondent banking on cross-border dollar movement, where they credibly might. A stablecoin transfer settles in minutes, on weekends, without a correspondent chain, and at a fee unrelated to the amount. That is a direct attack on the economics that sustain CHIPS-based correspondent clearing for smaller-value cross-border payments.

The counterargument is equally concrete. Stablecoin settlement is not settlement in central bank money, and the reserve backing, redemption rights, and issuer credit risk are exactly the questions the Federal Reserve's existence answers for the traditional rails. Banks are responding with tokenized deposit systems that aim to provide programmable, always-on transfer while keeping the settlement asset a commercial bank deposit backed by the existing framework.

### 13.7 The Slow Death of the Check

Check volume in the United States peaked around 1995 at roughly 50 billion checks a year and has fallen by more than 80 percent since. What remains is concentrated in B2B payments, where remittance data and process inertia sustain it, and in a long tail of consumer and government uses.

Check fraud, meanwhile, has risen sharply, with suspicious activity reports related to check fraud reaching record levels in recent years. The combination of falling volume and rising fraud makes the remaining check base progressively more expensive per item, which accelerates the migration to ACH and, increasingly, to instant rails with structured remittance data.

---

## 14. Appendix

### 14.1 Key Terminology

| Term | Definition |
|------|------------|
| **ACH** | Automated Clearing House. The US batch payment network for credits and debits |
| **CHIPS** | Clearing House Interbank Payments System. Privately operated large-value netting system |
| **DFMU** | Designated Financial Market Utility. Systemically important, supervised under Dodd-Frank Title VIII |
| **Daylight overdraft** | An intraday negative balance in a Federal Reserve master account |
| **Effective entry date** | The date an ACH originator intends an entry to settle |
| **Entry hash** | Checksum of receiving routing numbers in an ACH batch or file |
| **Fedwire** | The Federal Reserve's real-time gross settlement funds transfer system |
| **Finality** | The point at which a payment cannot be revoked or unwound |
| **IAT** | International ACH Transaction. SEC code for entries touching a foreign party |
| **IMAD / OMAD** | Input and Output Message Accountability Data. Fedwire message identifiers |
| **Master account** | An institution's account at a Federal Reserve Bank; the settlement asset |
| **Net debit cap** | The maximum daylight overdraft an institution may incur |
| **NOC** | Notification of Change. A COR entry correcting details of a posted ACH entry |
| **NSS** | National Settlement Service. Settles net positions of private clearing arrangements |
| **ODFI / RDFI** | Originating and Receiving Depository Financial Institution |
| **Opening position requirement** | The amount a CHIPS participant must prefund each morning |
| **PSR policy** | The Federal Reserve's Payment System Risk policy governing intraday credit |
| **Prenotification** | A zero-dollar ACH entry used to validate account details before live entries |
| **RTGS** | Real-Time Gross Settlement |
| **SEC code** | Standard Entry Class code. Determines the rules applying to an ACH batch |
| **Same Day Entry Fee** | The per-item fee an ODFI pays an RDFI on same-day entries |
| **Third-Party Sender** | An intermediary originating entries for its own customers under a bank's ODFI relationship |
| **Trace number** | The 15-character unique identifier of an ACH entry |
| **Travel rule** | BSA requirement that funds transfers of 3,000 USD or more carry originator and beneficiary data |
| **UCC 4A** | Uniform Commercial Code Article 4A, governing wholesale credit transfers |
| **Unwind** | Reversing a day's payments when a net settlement participant fails. Eliminated at CHIPS in 2001 |

### 14.2 Architecture Diagrams

| Diagram | Source | Description |
|---------|--------|-------------|
| Evolution Timeline | [`diagrams/evolution-timeline.mmd`](diagrams/evolution-timeline.mmd) | US payment rails from the 1918 Fed telegraph to instant payments |
| Participants | [`diagrams/participants.mmd`](diagrams/participants.mmd) | Actors across ACH, Fedwire, and CHIPS and how they relate |
| Settlement Models | [`diagrams/settlement-models.mmd`](diagrams/settlement-models.mmd) | Gross, net, and prefunded continuous netting compared |
| ACH Lifecycle | [`diagrams/ach-lifecycle.mmd`](diagrams/ach-lifecycle.mmd) | End-to-end ACH credit from authorization to posting |
| ACH File Structure | [`diagrams/ach-file-structure.mmd`](diagrams/ach-file-structure.mmd) | Nacha 94-character record hierarchy |
| ACH Processing Windows | [`diagrams/ach-processing-windows.mmd`](diagrams/ach-processing-windows.mmd) | Same Day and next-day deadlines and settlement times |
| ACH Returns | [`diagrams/ach-returns.mmd`](diagrams/ach-returns.mmd) | Return and notification-of-change flows with timeframes |
| Fedwire Flow | [`diagrams/fedwire-flow.mmd`](diagrams/fedwire-flow.mmd) | Real-time gross settlement across master accounts |
| Fedwire Message Structure | [`diagrams/fedwire-message-structure.mmd`](diagrams/fedwire-message-structure.mmd) | Legacy tag format mapped to ISO 20022 |
| Daylight Overdraft | [`diagrams/daylight-overdraft.mmd`](diagrams/daylight-overdraft.mmd) | Intraday liquidity, net debit caps, and overdraft pricing |
| CHIPS Netting Algorithm | [`diagrams/chips-netting-algorithm.mmd`](diagrams/chips-netting-algorithm.mmd) | Single, bilateral, and multilateral release logic |
| CHIPS Daily Cycle | [`diagrams/chips-daily-cycle.mmd`](diagrams/chips-daily-cycle.mmd) | Prefunding, continuous release, and closing procedures |
| Architecture | [`diagrams/architecture.mmd`](diagrams/architecture.mmd) | Master accounts, FedLine, operators, and settlement layers |
| Money Flow | [`diagrams/money-flow.mmd`](diagrams/money-flow.mmd) | Who pays whom across the three rails |
| Fraud Vectors | [`diagrams/fraud-vectors.mmd`](diagrams/fraud-vectors.mmd) | Attack surfaces mapped to each rail's finality rules |
| Rail Selection | [`diagrams/rail-selection.mmd`](diagrams/rail-selection.mmd) | Decision tree for choosing a rail |

### 14.3 ACH Transaction Codes

| Code | Account type | Direction | Purpose |
|------|--------------|-----------|---------|
| 22 | Checking | Credit | Live credit entry |
| 23 | Checking | Credit | Prenotification |
| 27 | Checking | Debit | Live debit entry |
| 28 | Checking | Debit | Prenotification |
| 32 | Savings | Credit | Live credit entry |
| 33 | Savings | Credit | Prenotification |
| 37 | Savings | Debit | Live debit entry |
| 38 | Savings | Debit | Prenotification |
| 52 | Loan | Credit | Loan payment credit |
| 55 | Loan | Debit | Loan account debit |

### 14.4 Fedwire Business Function Codes

| Code | Meaning |
|------|---------|
| `CTR` | Customer transfer: originator or beneficiary is not a bank |
| `CTP` | Customer transfer plus: extended remittance and party data |
| `BTR` | Bank transfer: both parties are financial institutions |
| `DRB` | Drawdown request from a bank |
| `DRC` | Customer drawdown request |
| `DRW` | Drawdown payment honoring a request |
| `FFR` | Fed funds returned |
| `SVC` | Service message, non-value |

### 14.5 The Routing Number Check Digit

Every ABA routing number's ninth digit is a checksum over the first eight, which is why an ACH file with a mistyped routing number fails validation before it reaches the network.

For routing number `d1 d2 d3 d4 d5 d6 d7 d8 d9`:

```
3*(d1 + d4 + d7) + 7*(d2 + d5 + d8) + 1*(d3 + d6 + d9)  must be a multiple of 10
```

The first two digits also encode geography and institution type: 00 for the federal government, 01 through 12 for the Federal Reserve districts of the institution's primary office, 21 through 32 for thrift institutions, 61 through 72 for electronic transaction identifiers.

### 14.6 Reference Numbers at a Glance

| Metric | Value |
|--------|-------|
| ACH annual volume (2024) | ~33.6 billion payments |
| ACH annual value (2024) | ~86.2 trillion USD |
| ACH average payment | ~2,600 USD |
| Same Day ACH per-payment limit | 1,000,000 USD |
| ACH entry amount field maximum | 99,999,999.99 USD |
| Consumer unauthorized return window | 60 calendar days |
| Standard return window | 2 banking days |
| Unauthorized return rate threshold | 0.5 percent |
| Administrative return rate threshold | 3 percent |
| Overall return rate threshold | 15 percent |
| Fedwire daily value | ~4 trillion USD |
| Fedwire daily volume | ~800,000 transfers |
| Fedwire operating day | 22 hours, 9:00 p.m. to 7:00 p.m. ET |
| Fedwire third-party cutoff | 6:00 p.m. ET |
| CHIPS daily value | ~1.8 trillion USD |
| CHIPS daily volume | ~500,000 payments |
| CHIPS participants | ~40 |
| Uncollateralized daylight overdraft rate | 50 basis points, annual |
| BSA travel rule threshold | 3,000 USD |
| Nacha record length | 94 characters |
| Nacha blocking factor | 10 records |

---

## 15. Key Takeaways

1. **The three rails are three answers to one tradeoff: liquidity, speed, and finality.** Fedwire buys certainty with liquidity, settling every payment in full in central bank money the instant it is sent. CHIPS buys liquidity efficiency with time, queuing payments until an algorithm finds offsets. ACH buys cost with both, settling net on a schedule and accepting reversibility. No rail gets all three, and that is why all three still exist.

2. **Finality is the property that defines everything else.** A Fedwire payment cannot be recalled, which is why it is used for house closings and why business email compromise targets it. An ACH consumer debit can be returned for 60 days, which is why merchants extend two months of unintended credit and why originator underwriting exists. Every fraud pattern, every control, and every legal outcome traces back to when the payment becomes irreversible.

3. **The ODFI warranty is the load-bearing structure of ACH.** The originating bank warrants every entry it introduces to the network. That single rule creates originator underwriting, exposure limits, return rate thresholds, the sponsor bank model, and the entire compliance apparatus around ACH origination.

4. **US payments post on account number, not name, and this is deliberate law.** UCC 4A-207 lets a receiving bank rely on the account number when the name does not match. The United States therefore has no Confirmation of Payee equivalent, and misdirected payments are a structural feature rather than a bug to be patched.

5. **Consumers and businesses live under different law on the same rails.** Regulation E protects consumer ACH transfers and does not cover wires or business accounts at all. A defrauded consumer usually recovers; a defrauded business usually does not. Treasury controls exist to compensate for the absence of legal protection.

6. **CHIPS solved unwind risk in 2001 and most descriptions of it are still out of date.** It is not end-of-day netting. It is continuous netting against prefunded balances, with each payment final at release, which is how it settles roughly 1.8 trillion USD a day on single-digit billions of prefunding.

7. **The Federal Reserve master account is the foundation under everything.** ACH net positions, Fedwire transfers, CHIPS prefunding, RTP's joint account, and FedNow all settle there. Access to a master account is access to the settlement layer, and every non-bank in US payments is renting that access from someone who has one.

8. **Batch is not obsolete, it is optimal for its workload.** A 50-year-old fixed-width file format still carries 33 billion payments a year at a cost per item measured in hundredths of a cent. Same Day ACH added intraday windows without abandoning the batch model, and the economics remain roughly 1,000 times better than a wire for payments that need to arrive today rather than this second.

9. **ISO 20022 is a data migration, not a speed improvement.** CHIPS moved in 2024 and Fedwire in July 2025. Payments do not settle faster. What changes is that party and remittance information becomes structured, which improves sanctions screening precision, straight-through processing rates, and reconciliation. Realizing those gains depends on every system in the chain using the fields rather than stuffing legacy strings into them.

10. **Instant payments face an adoption problem, not a technology problem.** RTP and FedNow both settle in seconds, 24x7x365, at a few cents. Their constraint is that credit-push finality is attractive to fraudsters, that they cannot pull, and that they compete with an entrenched card economy. Request for Payment is the industry's attempt to reach the recurring billing use cases that keep ACH debit volume where it is.

11. **The endpoint is the attack surface in a final settlement system.** The Bangladesh Bank heist broke no cryptography and compromised no payment system. It obtained the ability to issue valid instructions. Against a rail designed to execute valid instructions irrevocably, that is sufficient, and it is why controls have shifted to callbacks, dual authorization, and beneficiary allowlists rather than to network security.

12. **Nothing in this system is ever retired.** The 1918 telegraph settlement model, the 1974 batch file format, and the 1970 netting system all still run, alongside two instant networks launched in the last decade. Each new rail is added to the stack rather than replacing what is there, because the installed base of every payroll system, ERP, and core banking platform in the country votes against migration.
