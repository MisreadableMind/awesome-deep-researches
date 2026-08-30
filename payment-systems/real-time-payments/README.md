# Real-Time Payments: FedNow, UPI, Pix, and Faster Payments - Complete Technical Deep Dive

---

## Table of Contents

1. [History and Overview](#1-history-and-overview)
2. [What an Instant Payment Actually Is (and Is Not)](#2-what-an-instant-payment-actually-is-and-is-not)
3. [Key Participants and Roles](#3-key-participants-and-roles)
4. [The Anatomy of an Instant Payment](#4-the-anatomy-of-an-instant-payment)
5. [UPI - India's Layer Above the Banks](#5-upi---indias-layer-above-the-banks)
6. [Pix - The Central Bank as Product Manager](#6-pix---the-central-bank-as-product-manager)
7. [FedNow and RTP - Two Networks, One Country](#7-fednow-and-rtp---two-networks-one-country)
8. [Faster Payments - The UK Original](#8-faster-payments---the-uk-original)
9. [Technical Architecture and Message Formats](#9-technical-architecture-and-message-formats)
10. [Liquidity and the 24x7 Problem](#10-liquidity-and-the-24x7-problem)
11. [Money Flow and Economics](#11-money-flow-and-economics)
12. [Security, Fraud, and Risk](#12-security-fraud-and-risk)
13. [Regulation and Legal Framework](#13-regulation-and-legal-framework)
14. [Comparisons - Why Some Schemes Take Over and Others Crawl](#14-comparisons---why-some-schemes-take-over-and-others-crawl)
15. [Modern Developments](#15-modern-developments)
16. [Appendix](#16-appendix)
17. [Key Takeaways](#17-key-takeaways)

---

## 1. History and Overview

Instant payment schemes are the only piece of financial infrastructure that has been built from scratch, in parallel, by roughly seventy countries within two decades. They all do the same thing: move money between two bank accounts in seconds, at any hour, irrevocably. They differ in who built them, who was forced to join, and who pays.

Those three differences explain everything. Brazil built one that displaced cards in a year. The United States built two that still cannot reach every bank. The technology was never the variable.

![Evolution of instant payment schemes](diagrams/evolution-timeline.svg)

### 1.1 Japan Gets There First, in 1973

The first system that credited a payee the same day it debited the payer was Japanese, and almost nobody outside Japan noticed.

The Zengin Data Telecommunication System went live in 1973, built by the Japanese Bankers Association to replace paper transfer slips carried between banks. It ran on dedicated leased lines between member banks and a central switch, processed transfers during business hours, and credited the receiving account on the same banking day. By the standards of 1973, when an American check took three to five days to clear, this was startling.

Zengin established the design that every later scheme rediscovered: a central switch that validates and routes messages in real time, and a separate settlement process that squares up between banks afterwards. The customer sees the money move. The banks settle later. Those two events do not have to happen together, and pulling them apart is what makes instant payments affordable.

Switzerland went the other direction in 1987 with SIC, the first fully electronic real-time gross settlement system, where every payment settled individually in central bank money as it arrived. That is the safest possible design and the most expensive in liquidity. It stayed a wholesale system for two decades before retail volumes moved onto it.

### 1.2 The United Kingdom Is Forced, in 2008

The UK built the first modern retail instant scheme, and it did so because a regulator ordered it.

In 2000, the Cruickshank Report on competition in UK banking concluded that the payment schemes were run as a cartel by the largest banks, that entry was blocked, and that the three-day clearing cycle for electronic transfers existed because it earned the banks float income rather than because it was technically necessary. The Office of Fair Trading set up a Payment Systems Task Force. The banks were given an ultimatum: build a same-day service or have one imposed.

The Faster Payments Service launched on 27 May 2008, built by VocaLink on infrastructure the same firm ran for Bacs and the ATM network. Initial limit: 10,000 GBP. Initial participants: 13. Initial coverage: partial, because a payment could only be instant if both banks had joined.

The design choice that made it affordable was deferred net settlement. A Faster Payment reaches the customer's account in seconds, but the banks square up between themselves three times a day at the Bank of England. Between clearing and settlement, the receiving bank holds a claim on the sending bank. In 2016 that exposure was collateralised: participants now prefund their maximum net debit position at the Bank of England, so a failure between cycles costs the survivors nothing.

Faster Payments processed 5.55 billion transactions worth 4.84 trillion GBP in 2025. Direct participation has grown from 26 firms in 2018 to 47 in 2026, after a deliberate campaign to open access to non-banks.

### 1.3 India Builds a Layer, Not a Rail, in 2016

India already had instant payments before UPI. What it lacked was a way for an ordinary person to use them.

The National Payments Corporation of India, a not-for-profit company owned by a consortium of banks and set up under Reserve Bank of India guidance in 2008, launched IMPS in 2010: 24x7 interbank transfers, mobile-first, settled on a deferred net basis. IMPS worked. Its problem was addressing. To send money you needed the recipient's account number and IFSC code, entered without error, inside your own bank's app.

The Unified Payments Interface, launched on 11 April 2016 with 21 banks, changed the addressing and the front end and left the rails alone. Three things were new:

- **A virtual payment address.** `ramesh@okhdfcbank` replaced a 16-digit account number and an 11-character branch code. The mapping lives at NPCI, not in the user's memory.
- **Separation of app from bank.** Any licensed entity could build a payment app on top of a sponsoring bank's UPI handle. The app holds no money and no accounts. It rents regulatory access.
- **Standardised two-factor authentication.** Device binding plus a UPI PIN, with the PIN captured by an NPCI-supplied library that the app itself cannot read.

Demonetisation in November 2016, which voided 86 percent of India's currency by value overnight, arrived seven months after launch and functioned as a forced trial. Adoption never reverted.

In May 2026 UPI processed 23.2 billion payments worth 29.9 trillion rupees, roughly 340 billion US dollars, in a single month. The average payment was about 1,290 rupees, near 15 dollars. UPI accounts for roughly 85 percent of India's retail digital payments and, by transaction count, close to half of global real-time payment volume.

### 1.4 Brazil Ships a Product, in 2020

Pix is the only major instant payment scheme designed, built, operated, and marketed by a central bank, and it produced the fastest adoption curve in the history of retail payments.

The Banco Central do Brasil started work in 2018 with an explicit diagnosis: Brazilian retail payments were expensive because they were concentrated. Five banks held most accounts. Card acceptance cost merchants two to four percent. The alternative for the unbanked, the boleto bancário, was a printed slip that took days to clear. Cash was still king, and cash is expensive to move around a country the size of Brazil.

The central bank did not convene a working group and wait. It wrote the rulebook, built the settlement engine and the directory itself, and made participation mandatory for any institution with more than 500,000 active customer accounts. It also set the brand, the user experience rules, and the QR code standard, then required every participating bank to put Pix in its app.

Pix launched in full on 16 November 2020. It passed card transaction volume within about a year. In 2025 it processed 79.8 billion transactions worth 35.36 trillion reais, averaging roughly 219 million payments a day with peaks above 300 million. The average payment is about 443 reais, near 80 dollars.

### 1.5 The United States Builds Two, and Neither Is Universal

The United States has two instant payment networks, launched six years apart, that do not interoperate.

The Clearing House, owned by roughly twenty of the largest US banks, launched the RTP network in November 2017: the first new payment rail in the United States in more than forty years. RTP settles from a prefunded joint account held at the Federal Reserve Bank of New York, reaches around 70 percent of US demand deposit accounts through roughly a thousand participating institutions, and carries more than 98 percent of US instant bank-to-bank volume. On 1 May 2026 it set records of 2.27 million payments and 8.62 billion dollars in a single day.

The Federal Reserve announced FedNow in 2019 and launched it on 20 July 2023. The stated reason was reach: a bank-owned network has no obligation to serve the banks that compete with its owners, and thousands of community banks and credit unions were not being onboarded. FedNow settles directly on Federal Reserve master accounts, has signed up roughly 1,600 institutions, and processed 2.73 million payments worth 271 billion dollars in the first quarter of 2026.

The average FedNow payment in that quarter was near 99,000 dollars. This is not a consumer service in practice. It is a high-value business rail with a low-value name.

### 1.6 Scale Today

The single most revealing statistic across schemes is average payment size, because it exposes what each one is actually used for.

| Scheme | Country | Launched | Recent volume | Recent value | Average payment |
|--------|---------|----------|---------------|--------------|-----------------|
| **UPI** | India | Apr 2016 | 23.2 bn payments (May 2026, one month) | 29.9 trn INR | ~1,290 INR (~15 USD) |
| **Pix** | Brazil | Nov 2020 | 79.8 bn payments (2025) | 35.36 trn BRL | ~443 BRL (~80 USD) |
| **Faster Payments** | UK | May 2008 | 5.55 bn payments (2025) | 4.84 trn GBP | ~872 GBP |
| **RTP** | US | Nov 2017 | ~1.5 m payments on a typical day | 8.62 bn USD on record day | ~3,800 USD |
| **FedNow** | US | Jul 2023 | 2.73 m payments (Q1 2026) | 271 bn USD (Q1 2026) | ~99,000 USD |

UPI moves more payments in a month than FedNow has moved in its entire existence. FedNow moves more dollars per payment than UPI moves in six thousand. Same technology, opposite jobs.

The reason is not culture. It is that UPI and Pix replaced cash for a chai stall and a street vendor, while FedNow replaced a wire transfer for an insurance settlement. A scheme becomes a small-payment rail only when it is free at the point of use and universally reachable. Neither is true in the United States.

---

## 2. What an Instant Payment Actually Is (and Is Not)

### 2.1 The Four Properties

A payment is instant when four things are simultaneously true. Remove any one and the product stops working.

![What makes a payment instant](diagrams/instant-payment-anatomy.svg)

**Irrevocable funds availability.** The payee can spend the money within seconds, and the sending bank cannot unilaterally take it back. This is the only property end users notice. Everything else in this document exists to make it safe.

**Always on.** Twenty-four hours, seven days, three hundred and sixty-five days. No cut-off, no bank holiday, no batch window. This is the hardest property to retrofit, because a core banking system built in the 1980s assumes a nightly window in which the ledger is closed, interest is accrued, and the day is rolled. Running instant payments means either eliminating that window or building a shadow ledger that keeps accepting payments while the real one is closed, then reconciling. Most banks did the second thing, and most instant payment outages trace back to it.

**Deterministic confirmation.** The payer receives a definitive yes or no in seconds. Not a pending state that resolves tomorrow. This sounds trivial and is the source of most of the engineering complexity, because networks time out and a timeout is not an answer. Every scheme therefore defines exactly what a silence means, who is allowed to resolve it, and how long they have.

**Credit push only.** The payer's bank initiates. Nobody reaches into an account and pulls. This eliminates the unauthorised direct debit as a category of fraud, and creates a new category in its place, in which the victim is persuaded to push the money themselves.

### 2.2 Instant Is Not the Same as Settled

The most common technical confusion is between the moment the payee can spend the money and the moment the two banks square their accounts.

In a real-time gross settlement design, such as FedNow, Pix, or TIPS, these happen together: the central bank moves value between accounts as part of processing the payment. In a deferred net design, such as UK Faster Payments or UPI, the payee is credited immediately by their own bank, and the banks settle net positions later, in scheduled cycles.

Deferred net settlement is not sloppy. It is dramatically cheaper in liquidity, because a bank sending a billion and receiving a billion needs to fund only the difference. What it creates is an interbank exposure between clearing and settlement, and every serious deferred net scheme has since collateralised that exposure. The UK made participants prefund their maximum net debit position at the Bank of England in 2016. India enforces limits at the NPCI switch and settles into current accounts at the Reserve Bank.

The customer cannot tell the difference. The risk officer can.

### 2.3 What These Systems Are Not

**Not card networks.** There is no issuer, no acquirer, no interchange, and no chargeback. A card payment is a promise to pay that is later settled and can be reversed by the issuer for up to 120 days. An instant payment is the money itself, and it is gone. Merchants love the first half of that sentence. Consumers eventually discover the second.

**Not messaging networks.** Swift carries instructions and settles nothing. FedNow, Pix, and RTP carry an instruction and move the value. The message and the settlement are the same event, which is why a scheme cannot simply be bolted onto an existing messaging network.

**Not wires, despite the resemblance.** A wire on Fedwire or CHAPS is real-time gross settlement in central bank money, which sounds identical to FedNow. The differences are hours, cost, and audience: wires run on banking days during banking hours, cost the customer 15 to 50 dollars, and are sold to businesses. Instant schemes run continuously, cost the bank a few cents, and are designed for retail volume.

**Not free to build.** Every scheme in this document required a bank to rewrite how its ledger handles time. The public cost of Pix and FedNow is visible. The private cost, borne inside several thousand banks, is much larger and never published.

**Not a settlement guarantee for the payee's counterparty risk.** An instant payment tells the payee the money is theirs. It says nothing about whether the payer was entitled to send it, whether the goods will arrive, or whether the payer was being coerced on the phone at the time.

### 2.4 The Fundamental Trade

Every design decision in this document trades between three things: speed, liquidity, and finality. No scheme gets all three for free.

Real-time gross settlement gives immediate finality and demands that every participant hold enough central bank money to cover every outgoing payment, at all times, including 3am on a Sunday. Deferred net settlement gives cheap liquidity and demands either interbank credit exposure or prefunded collateral. Prefunded gross settlement, which is what RTP and Pix use, gives finality and cheap risk management and demands that participants leave cash idle in an account that earns nothing.

Brazil chose idle cash. The United Kingdom chose collateralised net exposure. India chose netting with hard limits at the switch. All three work. The choice determines who bears the cost of instant, and that in turn determines how enthusiastically banks sell it.

---

## 3. Key Participants and Roles

![Participants in an instant payment scheme](diagrams/participants.svg)

### 3.1 The Actors

| Role | What it does | Examples | Holds money? |
|------|--------------|----------|--------------|
| **Payer / payee** | Initiates or receives | Consumers, merchants, businesses, governments | Yes, at their bank |
| **Front-end app** | User interface and authentication | PhonePe, Google Pay, Cash App, bank apps | No |
| **Sending institution** | Debits the payer, screens, owns the send-side fraud decision | Any participating bank or licensed PSP | Yes |
| **Receiving institution** | Credits the payee, must be reachable at all times | Any participating bank or licensed PSP | Yes |
| **Sponsor bank** | Lends its licence and settlement account to a non-bank | Cross River, ClearBank, most Indian PSP banks | Yes |
| **Central switch** | Routes, validates, enforces scheme rules | NPCI, SPI, TCH, Vocalink, FedNow | No |
| **Proxy directory** | Maps an alias to an account | UPI mapper, DICT, PayNow directory | No |
| **Scheme owner** | Writes the rulebook, sets liability and timeouts | Nacha equivalent bodies, Pay.UK, BCB, NPCI | No |
| **Settlement agent** | Holds the settlement asset | Central bank, in every case that matters | Yes |
| **Technical service provider** | Connects small banks to the network | Fiserv, FIS, Jack Henry, Alacriti, Volante | No |

### 3.2 The Two Roles That Determine Whether a Scheme Works

**The receiving institution is the bottleneck.** A payment network is only as useful as its reachability, and reachability is decided entirely on the receive side. A bank that sends instant payments but cannot receive them contributes nothing to the network's value. This is why every successful scheme either mandates receiving (Brazil above 500,000 accounts, the European Union from January 2025) or was built in a market where the regulator could compel it (the UK in 2008). The United States mandates nothing, which is precisely why its coverage is partial after nine years.

**The technical service provider is the hidden gatekeeper.** Roughly 4,000 US banks and credit unions do not run their own core banking software. They rent it from Fiserv, FIS, or Jack Henry. Whether a 200-million-dollar community bank can offer instant payments is decided not by that bank but by whether its core provider has built, priced, and scheduled the module. For several years after FedNow launched, the answer for many institutions was "it is on the roadmap." Concentration in core banking is the single largest practical constraint on US instant payment reach, and it does not appear in any scheme diagram.

### 3.3 The Third-Party App, and Why India Is Different

In most schemes the bank owns the customer interface. India deliberately broke that.

A UPI third-party application provider, such as PhonePe or Google Pay, is not a bank. It holds no accounts and touches no money. It partners with a sponsor bank, uses that bank's UPI handle, and provides the front end. The customer's money never leaves their own bank account; the app is a remote control.

The consequence was competitive rather than technical. Because the app layer was contestable, non-banks with better product instincts entered, and they competed on interface rather than on rates. PhonePe and Google Pay together hold more than 80 percent of UPI volume, which is why NPCI has been trying, and repeatedly failing, to enforce a 30 percent market share cap since 2020. The deadline has been extended multiple times, most recently to the end of 2026.

The lesson generalises. Separating the interface layer from the settlement layer produces fast adoption and rapid concentration in the interface layer. Both effects are reliable.

---

## 4. The Anatomy of an Instant Payment

Every scheme in this document runs the same eight-step sequence. The names change; the sequence does not.

![Generic instant payment flow](diagrams/primary-flow.svg)

### 4.1 The Sequence

**Step 1: address resolution.** The payer supplies an alias, not an account number. The sending bank asks the directory who that alias belongs to and gets back an account, an institution identifier, and the registered account holder's name.

**Step 2: name confirmation.** The payer is shown the name on the destination account before confirming. This is Confirmation of Payee in the UK, Verification of Payee under EU regulation, and the default behaviour of the DICT lookup in Brazil. It is the single most effective anti-fraud control in the stack, because it converts a silent misdirection into a visible mismatch.

**Step 3: authentication.** PIN, biometric, or device-bound credential. India standardises this at the scheme level and forbids the app from seeing the PIN. Most other schemes leave it to the bank.

**Step 4: the send-side decision.** In roughly 200 milliseconds the sending bank must check the balance, place a hold, screen both parties against sanctions lists, score the payment for fraud, and decide. This is the tightest budget in the entire flow, and it is where banks with older cores fail. Sanctions screening in particular was designed for a world in which a human could look at a hit.

**Step 5: transmission.** A signed message goes to the switch, typically ISO 20022 `pacs.008`, carrying a unique end-to-end identifier that will follow the payment for the rest of its life.

**Step 6: the receive-side decision.** The receiving bank has a hard deadline, usually between 4 and 20 seconds depending on the scheme, to say whether it will accept. It checks that the account exists, is open, is of a type that can receive, and is not blocked. Silence is treated as rejection, not as maybe.

**Step 7: settlement.** Value moves between settlement accounts. In gross schemes this happens now, between acceptance and confirmation. In net schemes it happens later, and this step is a bookkeeping entry against a position.

**Step 8: confirmation.** Both banks are told the payment is final. The payee's funds are available. The payer gets a receipt with a reference that can be used to trace the payment for years.

### 4.2 The Hard Part Is Not the Happy Path

An instant payment that works is a straightforward request and response. An instant payment that half-works is where the design lives.

**The timeout problem.** The sending bank has debited its customer and sent the message. The switch has not replied. Three states are possible: the payment settled and the confirmation was lost, the payment failed, or the payment is still in flight. The customer's money is gone from their balance in all three.

Every scheme solves this with the same three mechanisms. A status enquiry message (`pacs.028`, or `ReqChkTxn` in UPI) lets the sender ask what happened. A deterministic scheme timeout, after which the payment is defined to have failed regardless of what any party believes, prevents indefinite ambiguity. And a mandatory reversal window obliges the sending bank to re-credit the customer within a fixed period if the payment did not complete, with penalties for missing it. India enforces this aggressively, because at 750 million payments a day even a small failure rate is millions of stuck customers.

**The partial-completion problem.** In UPI's flow the debit and the credit are separate calls to two different bank cores. If the debit succeeds and the credit fails, someone is holding money that belongs to nobody. The scheme requires an automatic reversal, and NPCI publishes bank-level technical decline rates specifically to make the laggards visible.

**The duplicate problem.** A retried message must not become a second payment. Every scheme mandates a unique transaction identifier and requires the switch to reject duplicates. Pix uses an end-to-end identifier built from the sending institution's ISPB code, a timestamp, and a suffix. FedNow and RTP use the ISO 20022 transaction identification. Idempotency is not an implementation detail here; it is a rulebook obligation.

### 4.3 What Happens When It Goes Wrong on Purpose

There is no chargeback. This is the structural fact that shapes every consumer protection debate in this document.

A card payment can be reversed by the issuer against the merchant, because the card network sits in the middle and holds the merchant's money. An instant payment has no such intermediary. Once settled, recovering funds requires either the receiver's voluntary cooperation, or a scheme-specific mechanism that reaches into the receiving account.

Three approaches exist. The recall request (`camt.056` in ISO 20022, used by FedNow and RTP) politely asks the receiving bank to send it back, and the receiving bank may decline. The scheme fraud return (Brazil's MED, using `pacs.004` with a fraud reason code) compels the receiving institution to analyse and, where funds remain, return them. And the liability rule (the UK's mandatory reimbursement regime) does not recover the money at all; it decides who eats the loss.

Only the third one reliably changes bank behaviour, because it is the only one that prices the failure.

---

## 5. UPI - India's Layer Above the Banks

UPI is not a payment rail. It is an interoperable interface layer sitting on top of rails that already existed, and understanding that distinction explains both its speed of adoption and its economics.

![UPI architecture](diagrams/upi-architecture.svg)

### 5.1 The Layered Design

Four layers, each contestable independently.

**The rail layer** is IMPS, live since 2010: 24x7 interbank transfers with deferred net settlement into current accounts at the Reserve Bank of India. UPI did not replace it.

**The switch layer** is NPCI. Every UPI request passes through it. It resolves addresses, enforces per-user and per-app velocity limits, routes to the remitter and beneficiary bank cores, logs everything, and computes net settlement positions.

**The PSP layer** is banks. Only a bank can issue a UPI handle, hold the customer's money, and take the debit decision. An app's handle suffix tells you which bank stands behind it: `@ybl` is Yes Bank, `@okaxis` is Axis, `@paytm` is Paytm Payments Bank.

**The application layer** is open. Any entity that partners with a PSP bank can build an app. This is where the competition happened.

The virtual payment address is the piece users see. `ramesh@okhdfcbank` is resolved by NPCI's mapper into an account number and an institution identifier. The user never learns the account number, and the merchant never learns the payer's. Both properties matter: the first for usability, the second for privacy.

### 5.2 The Payment Flow

![UPI payment flow](diagrams/upi-flow.svg)

Onboarding is a one-time ritual that establishes the first factor of authentication. The app sends an SMS from the SIM tied to the customer's registered mobile number, which binds the device to the account and proves possession. NPCI then fetches the customer's linked accounts through `ReqListAccount`. The customer sets a UPI PIN by proving knowledge of their debit card details.

Payment is roughly five seconds. The app resolves the payee's address, displays the registered name, and takes the amount. Then the interesting part happens.

**The Common Library.** The UPI PIN is captured by an NPCI-supplied library embedded inside every UPI app, not by the app's own code. The library fetches NPCI's RSA public key, builds a checksum by concatenating the amount, transaction reference, payer, payee, application identifier, mobile number, and device identifier, hashes it, and encrypts the PIN together with that binding under NPCI's key.

Two properties follow. PhonePe cannot read the PIN its own user typed. And a captured credential block is useless for a different amount, a different payee, or a different device, because those values are inside the hash.

This is a stronger authentication design than most Western schemes use, and it was mandated at the scheme level rather than left to each bank. That was the right call. It is also why UPI is not ISO 20022 and does not interoperate with anything: the security model is welded to the message format.

**The API surface.** UPI is XML over HTTPS with mutual authentication, not ISO 20022. The core calls are `ReqPay` and `RespPay` for payments, `ReqValAdd` for address validation, `ReqListAccount` for account discovery, `ReqSetCre` for credential setting, `ReqChkTxn` for status enquiry, `ReqMandate` for recurring authorisations, and `ReqHbt` as a heartbeat. Designed for phone apps, not for bank-to-bank messaging, and it shows in both the strengths and the isolation.

### 5.3 Four Products on One Authorisation Model

![UPI payment types and mandates](diagrams/upi-mandate.svg)

**Direct pay** is the default and roughly the large majority of volume. The payer initiates, enters the PIN, money leaves.

**Collect** inverts the request: the payee sends a request to the payer's address, and the payer approves with a PIN. It was heavily abused. Scammers sent collect requests captioned as refunds, and victims entered a PIN believing they were receiving money when they were authorising a debit. NPCI throttled collect for most merchant categories in response. The general lesson is that any flow where approving looks like receiving will be weaponised.

**AutoPay** creates a mandate: a standing permission naming the payee, a maximum amount, a frequency, and a validity window. Subsequent debits execute without a PIN, up to the cap, with a pre-debit notification 24 hours ahead and cancellation available at any time. This is what makes subscriptions, insurance premiums, and systematic investment plans work on a credit-push rail.

**Credit on the rail** is the most consequential recent change. RuPay credit cards were linked to UPI in 2022, and the Reserve Bank permitted pre-sanctioned credit lines on UPI in 2023. A customer scans the same QR code and pays with borrowed money. The rail did not change; the funding source did. This turns a debit network into a distribution channel for credit at a merchant discount rate of zero, which is either an elegant piece of financial inclusion or an unfunded liability depending on which side of the MDR debate you occupy.

**UPI Lite and 123Pay** solve volume and access respectively. UPI Lite is an on-device wallet for small payments that settles locally without a PIN or a call to the bank core, built because the switch was drowning in sub-200-rupee transactions that cost as much to process as large ones. UPI 123Pay serves feature phones through IVR and missed calls, with no data connection required.

### 5.4 Limits and Settlement

Per-transaction limits are generally 100,000 rupees, with higher ceilings for specific categories such as capital markets, insurance, education, and hospital payments. NPCI has progressively raised merchant payment limits as the rail matured. UPI Lite operates at a much smaller scale, with a per-payment cap in the low thousands of rupees and a wallet balance in the low tens of thousands.

Settlement is deferred net. NPCI computes each bank's net position across multiple cycles a day and settles through current accounts at the Reserve Bank. The customer's funds moved instantly on their bank's own books; the interbank position is squared afterwards. Exposure between cycles is controlled by limits enforced at the switch rather than by prefunding, which is a lighter approach than the UK's and depends more heavily on the regulator's willingness to act.

### 5.5 What UPI Got Right, and What It Did Not Solve

Right: addressing, an open app layer, scheme-level authentication, and building on an existing rail rather than a new one. Also right, and rarely credited, is the decision to make the reference implementation (BHIM) mediocre. NPCI proved the rail worked without competing seriously with the firms it needed to attract.

Not solved: the money. Zero merchant discount rate since January 2020 means the rail generates no revenue from the parties who benefit most. Banks and apps carry the cost. Government incentive payments were meant to cover part of it and have been cut sharply. Every year the industry argues for reintroducing a small MDR on large merchants, and every year the political answer is no, because a free payment system is popular and an expensive one is not.

The result is the central irony of UPI. It is the most successful payment system ever built by adoption, and nobody who runs it makes money from it.

---

## 6. Pix - The Central Bank as Product Manager

Pix is what happens when the regulator stops writing standards and starts shipping software.

![Pix architecture](diagrams/pix-architecture.svg)

### 6.1 Two Systems, Both Run by the Central Bank

The Banco Central do Brasil built and operates two things.

**SPI**, the Sistema de Pagamentos Instantâneos, is the settlement engine. It receives ISO 20022 messages, verifies them, moves value, and confirms. Settlement is real-time gross, in central bank money, on dedicated accounts.

**DICT**, the Diretório de Identificadores de Contas Transacionais, is the key directory. It maps a Pix key to an account. A key can be a CPF (the individual taxpayer number), a CNPJ (the company number), a phone number, an email address, or a random UUID generated for the purpose. The random key exists so that a person can receive money without revealing any personal identifier, which is a privacy decision most schemes did not make.

Participants hold PI accounts at the central bank, prefunded and separate from their ordinary reserve accounts. A Pix payment cannot execute if the sending participant's PI account lacks the balance. This is prefunded real-time gross settlement: the safest arrangement available, paid for with idle cash.

Connectivity is deliberately closed. Participants reach SPI and DICT only through the RSFN, the National Financial System Network, a private network. There is no public internet path, no REST API, and no webhook. Every message is XML, signed with an ICP-Brasil certificate, validated for format and signature on arrival. Integrating with SPI is implementing a financial messaging protocol, not calling an API, and firms that budget for the latter discover the difference expensively.

### 6.2 The Payment Flow

![Pix payment flow](diagrams/pix-flow.svg)

The central bank's service level target is ten seconds end to end. Typical performance is under five.

The QR code standard is worth attention because it drove merchant adoption. Brazil uses the EMV merchant-presented QR specification, locally called BR Code, in two forms. A static QR encodes only the payee's key and can be printed on a sticker and left on a counter forever, which is what put Pix into street commerce. A dynamic QR encodes a URL that the payer's bank fetches to retrieve the amount, an expiry, and a transaction identifier, which is what made it work for e-commerce and reconciliation.

Every payment carries an end-to-end identifier built from the sending institution's ISPB code, a timestamp, and a suffix. It appears on the customer's receipt, and it is the anchor for every later query, dispute, or trace.

Directory lookups are logged and rate limited. Bulk enumeration of DICT is a reportable offence, because a complete map of every Brazilian's phone number to their bank account is exactly the asset a fraud operation wants. Brazil has had incidents in which participants' credentials were used to scrape key data, and the central bank's response was to tighten limits and publish the breaches.

### 6.3 The Product Roadmap

The central bank runs Pix like a product, with a published evolution agenda and a standing forum of participants. This is the part other regulators find hardest to copy.

| Feature | Live | What it does |
|---------|------|--------------|
| **Pix Saque / Pix Troco** | 2021 | Cash withdrawal at merchants and change given as Pix, extending cash access without ATMs |
| **Pix Cobrança** | 2021 | Structured billing with due dates, interest, and discounts, replacing the boleto |
| **Pix por aproximação** | Feb 2025 | NFC tap-to-pay through the phone's wallet, competing directly with contactless cards |
| **Pix Automático** | Jun 2025 | Recurring debits with a pre-authorised mandate; mandatory for participants from Oct 2025 |
| **Pix parcelado** | Bank product | Instalments funded by the payer's bank; the rail sees one ordinary payment |
| **Pix Garantido / em garantia** | In development | Scheduled and credit-backed payments using the receivable as collateral |

Pix por aproximação initially carried a fixed 500 real cap per transaction. The central bank removed the fixed limit in 2026 and moved to customer-configurable limits, on the reasoning that a hard cap set centrally is both too low for some users and too high for a compromised phone.

Pix Automático matters more than the others combined. Recurring collection is the last thing a credit-push rail cannot do natively, and it is the volume that keeps utilities, schools, gyms, and subscription businesses on direct debit and cards. Making it mandatory rather than optional followed the same logic as mandatory participation in 2020, and worked for the same reason.

### 6.4 Fraud and the Special Return Mechanism

![Pix MED fraud return flow](diagrams/pix-med.svg)

Pix's fraud problem arrived quickly and took a distinctly Brazilian form: violent street crime, where a victim is forced to unlock their phone and send money. The central bank's countermeasures were correspondingly specific.

**Night-time limits.** Between 20:00 and 06:00, a default limit of 1,000 reais applies unless the customer has explicitly requested otherwise. A mugging at 2am now nets a thousand reais rather than an account balance.

**MED, the Mecanismo Especial de Devolução.** A victim reports to their own bank within 80 days. The receiving institution has up to seven days to analyse and must return whatever funds remain in the account. MED 2.0 made this mandatory for all participants, added precautionary blocking of suspicious inbound funds for up to 72 hours before any claim exists, and extended tracing across up to five successive accounts rather than stopping at the first hop.

**The shared fraud register.** Accounts flagged for fraud are recorded centrally and visible to every participant, so a mule account burned at one institution is degraded everywhere. The central bank also publishes per-institution fraud and return statistics, which turns out to be an effective control: no bank wants to be visibly the easiest place to open a mule account.

The structural point stands regardless of how good MED gets. On an irrevocable rail, recovery is a partial remedy at best, because the money is usually gone within minutes. The controls that work are the ones that operate before the payer presses send.

---

## 7. FedNow and RTP - Two Networks, One Country

The United States is the only large economy with two competing instant payment networks that cannot reach each other. This is not an accident of history. It is the predictable outcome of building payment infrastructure through voluntary participation.

![RTP and FedNow compared](diagrams/us-instant-rails.svg)

### 7.1 RTP, the Bank-Owned Network

The Clearing House launched RTP in November 2017 after roughly four years of design work, making it the first new payment rail in the United States since ACH in the 1970s. The Clearing House is owned by around twenty of the largest US banks, which is both why RTP was built quickly and why the Federal Reserve decided to build a competitor.

The settlement design is prefunded and elegant. All participants jointly fund a single account at the Federal Reserve Bank of New York, held by The Clearing House on their behalf. Each participant has a position inside that account. A payment moves value from one position to another in real time, and a participant whose position is exhausted simply cannot send. No participant can go negative, so no participant carries credit exposure to another, and the system carries none to anybody.

RTP reaches roughly 70 percent of US demand deposit accounts through about a thousand institutions and carries more than 98 percent of US instant bank-to-bank volume. The transaction limit was raised from 1 million to 10 million dollars in February 2025. On a typical day it processes more than 1.5 million payments; its record day, 1 May 2026, saw 2.27 million payments worth 8.62 billion dollars.

### 7.2 FedNow, the Public Alternative

The Federal Reserve announced FedNow in August 2019 and launched it on 20 July 2023, four years later, having taken public comment on whether a central bank should compete with a private network it also regulates.

The argument that won was reach. A network owned by the largest banks has no obligation to onboard the 9,000 community banks and credit unions that compete with its owners, and by 2019 it was clear that onboarding was slow. The Federal Reserve had built and operated FedACH alongside the private EPN for decades on the same reasoning: a public option guarantees that access does not depend on a competitor's goodwill.

FedNow settles directly on Federal Reserve master accounts. There is no joint account and no prefunding beyond the balance a bank already holds. Value moves between master accounts as part of processing, which makes it real-time gross settlement in central bank money, in the same sense as Fedwire but continuously.

![FedNow payment flow](diagrams/fednow-flow.svg)

Adoption has been steady rather than explosive. Roughly 1,600 institutions participate, weighted towards community banks and credit unions, with about 500 added over the previous year. First-quarter 2026 volume was 2.73 million payments worth 271 billion dollars, up 10.6 percent in volume and 7.7 percent in value on the prior quarter.

The transaction limit history is instructive. FedNow launched with a default institution-level limit of 100,000 dollars and a network maximum of 500,000. That maximum went to 1 million in mid-2025 and then to 10 million effective 12 November 2025, matching RTP. The default per-institution limit stayed at 100,000 dollars, which each participant may raise. Those two numbers describe the market accurately: the network is engineered for high-value business payments, and individual banks remain cautious about consumer exposure.

### 7.3 Why There Is No Interoperability

The two networks do not exchange payments. A bank that participates in only one cannot receive from a bank that participates only in the other, which means every sending institution must first determine which network can reach a given routing number, and many large banks simply join both.

There is no technical obstacle. Both use ISO 20022, both are credit push, both settle in central bank money at the same institution. The obstacles are commercial and governance: two rulebooks, two liability regimes, two fee schedules, two sets of operating hours for support, and no party with authority to compel a link. The Federal Reserve is a competitor to The Clearing House here, not a supervisor of it in the sense that would let it mandate interoperability.

Directory services partially paper over the gap. Reachability files, published by both networks and consumed by service providers, let a sending bank check before it sends. That is a workaround, not a solution, and it fails at exactly the moment consumers notice: when a payment that worked last week does not work this week because the recipient changed banks.

### 7.4 What the United States Uses Instant Payments For

The average FedNow payment is near 99,000 dollars. The average RTP payment on its record day was about 3,800. Neither number describes a consumer paying a friend.

The actual use cases that generate volume are payroll for gig and hourly workers, where instant pay is a recruitment tool; insurance claim disbursements, where speed is the product; account-to-account funding for brokerages and wallets; digital wallet cash-outs; title and escrow payments in real estate; and business-to-business supplier payments where a wire would cost 25 dollars and take a banking day.

Consumer person-to-person payments largely did not move to these rails. They went to Zelle, Venmo, and Cash App, which built the user experience first and settle over whatever is underneath. Zelle in particular is often mistaken for an instant payment network; it is a directory and a user experience layer run by Early Warning Services, and it settles across several rails including RTP. The United States solved the consumer interface problem privately and the settlement problem publicly, in that order, which is the reverse of India and Brazil.

The other structural reason consumer volume did not move is rewards. A US consumer paying by credit card earns one to two percent back, funded by interchange. An instant payment earns nothing. No amount of rail efficiency overcomes a two percent subsidy pointed the other way.

---

## 8. Faster Payments - The UK Original

The United Kingdom built the first modern instant retail scheme, spent fifteen years failing to replace it, and in the process produced the most interesting regulatory experiment in the field.

![UK Faster Payments architecture](diagrams/fps-architecture.svg)

### 8.1 The System

Faster Payments went live on 27 May 2008, operated today by Pay.UK and running on central infrastructure built and maintained by Vocalink, which Mastercard acquired in 2017.

Three payment types run over it. Single Immediate Payments are the ordinary push payment a consumer makes from a banking app. Forward Dated Payments and Standing Orders are scheduled instructions. Direct Corporate Access lets a business submit a file of payments directly, which is how many payroll and disbursement flows arrive.

The central infrastructure limit is 1 million GBP, raised from 250,000 in 2022. Individual banks set far lower limits for their own customers, typically between 25,000 and 100,000 GBP a day, and those limits, not the scheme limit, are what a customer actually encounters.

Settlement is deferred net across three cycles a day into the Bank of England's RTGS system. Since 2016 each participant prefunds its maximum net debit position, so the interbank exposure that existed for the first eight years is now fully collateralised.

### 8.2 The Access Campaign

The most quietly consequential UK policy was opening direct participation.

Until 2018, joining Faster Payments directly required being a bank with a Bank of England settlement account, which meant everyone else rode on a sponsor bank and paid for the privilege. The Bank of England opened settlement accounts to non-bank payment service providers, and Pay.UK reworked onboarding. Direct participants rose from 26 to 47 by 2026, including firms like ClearBank, Modulr, and Wise that are not banks in the traditional sense.

The binding constraint on that expansion was collateral. A participant must prefund its maximum net debit position, and for a firm with spiky volumes that number is large relative to its balance sheet. In July 2026 Pay.UK introduced a flexible liquidity framework for Net Sender Caps, reducing the prefunding required and cutting the cost of direct access. This is unglamorous plumbing and it does more for competition than most consumer-facing initiatives.

### 8.3 Confirmation of Payee

Confirmation of Payee, live from 2020 and effectively universal after a second rollout phase in 2022 and 2023, checks the payee's name against the destination account before the payment is sent and reports match, close match, no match, or unavailable.

It works well against one specific attack: invoice redirection, where a criminal alters bank details on a genuine invoice. The payer sees a name that does not match the supplier and stops.

It works poorly against persuasion. If a criminal has convinced a victim that their money must be moved to a "safe account," a name mismatch is easily explained away, and criminals coach victims to expect it. Confirmation of Payee removed the easiest category of fraud and left the hardest.

### 8.4 Mandatory Reimbursement

On 7 October 2024 the Payment Systems Regulator made reimbursement of authorised push payment scam victims mandatory for Faster Payments and CHAPS. The design has four notable features.

**A cap of 85,000 GBP per claim**, reduced from an initially proposed 415,000. The lower figure was contested loudly by consumer groups and welcomed by industry, and it aligns with the deposit protection limit.

**A fifty-fifty split between the sending and receiving firm.** This is the mechanism that matters. Before the rule, the sending bank bore any voluntary reimbursement and the receiving bank, whose account was hosting the mule, bore nothing. Splitting the loss gives the receiving institution a direct financial reason to care who it opens accounts for.

**A five-business-day decision window**, with an optional 100 GBP excess and an exclusion for gross negligence by the customer.

**Applies to all payment service providers**, not just large banks.

An independent evaluation published on 1 July 2026 found net benefits in the first year, with APP fraud losses over Faster Payments falling by around 21 percent. The regulator is now consulting on transaction-level Confirmation of Payee data sharing and reviewing both the 85,000 cap and the consumer caution standard.

The finding worth carrying to other jurisdictions is narrow and strong. Fraud fell not because banks acquired new detection technology but because the loss was moved onto the two parties who could prevent it. Liability allocation is a fraud control.

### 8.5 The New Payments Architecture, and Why It Stalled

The UK has been trying to replace Faster Payments' underlying infrastructure since 2017. The New Payments Architecture was to be a modern, ISO 20022, competitively procured platform separating clearing from overlay services.

It has not been delivered. Procurement was contested, scope grew, timelines slipped repeatedly, and the Payment Systems Regulator progressively cut the programme back. The government's National Payments Vision in November 2024 concluded that the programme was not sufficiently agile and established a Payments Vision Delivery Committee to determine what upgrades the existing Faster Payments System actually needs, alongside longer-term questions of funding and governance.

The current direction is incremental modernisation of a seventeen-year-old system rather than wholesale replacement. That is an unremarkable outcome for a large public infrastructure programme and a useful data point for anyone estimating how long a national payments rebuild takes. Brazil built Pix from nothing in about two years. The UK has spent nine trying to replace a system that already works.

---

## 9. Technical Architecture and Message Formats

### 9.1 ISO 20022, and the Four Messages That Matter

Every major instant scheme except UPI and the current UK system speaks ISO 20022, an XML message standard with a defined data dictionary. Four messages carry almost all the traffic.

![ISO 20022 messages in instant payments](diagrams/iso20022-messages.svg)

**`pacs.008`**, FI to FI Customer Credit Transfer, is the payment. It carries the amount and currency, the debtor and creditor with their accounts and agents, remittance information, and identifiers.

**`pacs.002`**, Payment Status Report, is the answer. Accepted or rejected, with a structured reason code. This message is what converts "fast" into "instant": without a deterministic status within seconds, the payer is left guessing, and guessing is what batch systems do.

**`pacs.004`**, Payment Return, sends money back. It is a new payment in the opposite direction with a reason code attached, not a reversal of the original. This distinction is legally important: the original payment remains valid and final, and the return is a separate obligation.

**`pacs.028`**, Payment Status Request, asks what happened after a timeout.

Around these sit the request-to-pay pair (`pain.013` and `pain.014`), the recall pair (`camt.056` and `camt.029`), and the account reporting messages (`camt.052` and `camt.054`) through which a receiving customer learns about the credit.

### 9.2 The Fields That Do Real Work

Four elements inside a `pacs.008` deserve specific attention because they determine whether the payment is usable downstream.

**End-to-end identification** is the payer's own reference, and the scheme requires it to survive unmodified to the payee. It is what lets a business match a received payment to an invoice without human intervention.

**Transaction identification** is the scheme's own identifier, assigned by the sending institution and used as the anchor for every subsequent status request, return, or investigation.

**Remittance information**, structured or unstructured, is the field corporates actually care about. A card payment arrives as an amount and a merchant reference; an ISO 20022 payment can carry the invoice number, the date, the discount taken, and the tax breakdown. Automated reconciliation is the largest quantified business benefit of instant payments, and it comes from this field rather than from speed.

**Purpose code and category purpose** classify the payment as salary, tax, supplier payment, or one of several hundred other categories. Screening engines, statistical reporting, and increasingly fraud models all consume it.

### 9.3 Where the Standard Does Not Deliver

A common standard is necessary for interlinking and insufficient by itself.

Schemes differ in which optional fields they make mandatory, which code lists they permit, how they populate identifiers, and what character sets they allow. A `pacs.008` that is valid in Europe may be rejected in Brazil for a missing element that Brazil requires and the EU does not. This is the same problem that afflicted Swift MT messages, reproduced in a newer syntax.

UPI is the clear outlier: an NPCI-defined XML API, not ISO 20022, with its authentication model welded into the message structure. This was a reasonable choice in 2016, when the goal was a phone-friendly interface rather than bank-to-bank messaging, and it is now the main technical obstacle to connecting UPI to anything else. Bilateral links like UPI to PayNow required purpose-built translation.

The UK sits between the two. Faster Payments carries ISO 8583 heritage from its card-network origins, and full ISO 20022 migration is tied to the architecture programme that keeps slipping.

### 9.4 Connectivity and Security

The transport layer varies more than the message layer, and it is consistently more closed than outsiders expect.

| Scheme | Network | Authentication | Message security |
|--------|---------|----------------|------------------|
| **Pix** | RSFN, private network only | ICP-Brasil certificates | Signed XML per message, format and signature validated on arrival |
| **FedNow** | FedLine Solution, private circuits | Fed-issued credentials, hardware tokens | Message-level integrity plus channel encryption |
| **RTP** | TCH network or via a service provider | Mutual TLS, participant certificates | Signed messages |
| **UPI** | HTTPS over the internet, restricted peering | Mutual TLS between PSP and NPCI | Credential blocks encrypted under NPCI's key by the Common Library |
| **Faster Payments** | Vocalink connectivity | Participant certificates, HSM-backed | Scheme-defined |

The pattern: retail-facing schemes with millions of app endpoints (UPI) push cryptography down to the device and accept the internet as transport, while bank-to-bank schemes (Pix, FedNow, RTP) refuse the public internet entirely. Both are correct for their threat model.

### 9.5 Proxy Directories

The alias directory is the most under-appreciated component in an instant scheme, and the most sensitive.

It maps something a human can remember to something a bank can route to. UPI's mapper resolves virtual payment addresses. Brazil's DICT resolves CPFs, CNPJs, phone numbers, emails, and random UUIDs. Singapore's PayNow resolves phone numbers and national identity numbers. The UK does not have one, which is why UK customers still type sort codes.

Three design decisions determine whether a directory is safe.

**Whether it returns a name.** Returning the registered account holder's name enables Confirmation of Payee, which is the highest-value fraud control available. It also leaks the name to anyone who can query.

**Whether lookups are rate limited and logged.** A directory mapping every citizen's phone number to their bank account is a target. Brazil rate limits and logs every DICT query and treats bulk enumeration as a reportable offence, having already had incidents where participant credentials were misused to scrape key data.

**Whether the alias can be random.** Brazil's random UUID key lets a person receive money without disclosing a phone number, an email, or a taxpayer identifier. This is a genuine privacy improvement and cost nothing to implement.

---

## 10. Liquidity and the 24x7 Problem

The engineering problem that instant payments created and did not solve is that money now moves at 3am on a Sunday, while the markets that let a bank refill its position do not.

![24x7 liquidity models](diagrams/liquidity-24x7.svg)

### 10.1 Why This Is Hard

In a business-hours system, a bank that runs short of central bank money borrows it. The interbank market, the central bank's standing facilities, and repo desks all exist for exactly that purpose, and they are open when the payment system is open.

An instant scheme runs continuously. A bank whose customers receive their pay on Friday and spend it over the weekend will drain its settlement position at a time when nobody is answering the phone at any counterparty. Payments then fail, and they fail for retail customers at the worst possible moment.

Three architectures respond to this differently.

### 10.2 The Three Models

**Prefunded joint account, used by RTP.** Participants collectively fund one account at the Federal Reserve Bank of New York. Each has a position inside it. A payment cannot be sent from an exhausted position, full stop. Refilling happens during Fedwire hours, or out of hours through a FedNow Liquidity Management Transfer, which can move funds between master accounts specifically to top up an instant payment position, including the RTP joint account. Systemic risk: none. Cost: cash sitting idle across the entire weekend.

**Direct settlement on central bank accounts, used by FedNow, Pix, and TIPS.** Value moves between accounts at the central bank itself, with no intermediary balance. Pix uses dedicated PI accounts, which participants top up during the operating hours of Brazil's classic RTGS system; FedNow uses ordinary master accounts. This is the cleanest design and requires the central bank to run a genuinely 24x7 ledger, which is a substantial operational commitment.

**Deferred net with prefunded caps, used by UK Faster Payments and, in a lighter form, UPI.** The customer is credited instantly; the banks settle net later. The exposure between clearing and settlement is collateralised in the UK by requiring each participant to prefund its maximum net debit position at the Bank of England, and controlled in India by limits enforced at the NPCI switch. Cheapest in liquidity, and the only one of the three where a participant failure between cycles is a question rather than a non-event.

### 10.3 What Banks Actually Do About It

Treasury practice around instant payments has converged on a small set of techniques.

Weekend and holiday buffers are sized from historical peak net outflow, typically at a high percentile of observed weekends, plus a margin. Automated top-up rules move funds when a position crosses a threshold. Net sender caps and velocity throttles at the scheme level prevent one participant's runaway from becoming everyone's problem. And treasury teams that previously worked banking hours now carry weekend coverage, which is a real and rarely mentioned operating cost of instant payments.

The UK's 2026 Net Sender Cap reform is aimed squarely at this. By making caps flexible rather than fixed, Pay.UK reduced the collateral a participant must post, which lowers the cost of direct access for smaller firms. Liquidity requirements are an entry barrier, and relaxing them safely is a competition policy tool disguised as plumbing.

### 10.4 The Underlying Constraint

None of this is a technology problem. The constraint is that a bank must hold central bank money, which earns little or nothing, against the possibility that its customers will pay each other on a Sunday night.

That cost scales with volume and with volatility, not with value. It is why instant payments are more expensive to operate than their per-message cost suggests, and it is part of why banks in markets without a mandate have been slow to promote them.

---

## 11. Money Flow and Economics

Instant payments destroy the interchange pool that funded consumer payments for sixty years and replace it with nothing. Who fills that gap determines whether banks promote the rail or merely tolerate it.

![Economics across four schemes](diagrams/money-flow.svg)

### 11.1 The Card Comparison

A card payment generates two to four percent of the transaction value in fees, of which the largest share is interchange paid by the merchant's acquirer to the cardholder's issuer. That flow funds rewards programmes, fraud losses, issuer profit, and the sales effort that puts cards in wallets.

An instant payment generates a few cents, paid by the sending bank to the network, and nothing at all to the receiving bank. The value it creates is real and lands mostly on the merchant, in lower fees and immediate availability of funds, and on the payer, in convenience. Neither of those parties historically paid for payment infrastructure.

The consequence is uniform across every market in this document: instant payments are cheaper for the economy and worse business for a bank than the product they replace. Every scheme's adoption story is the story of how that problem was handled.

### 11.2 India: Nobody Pays

The Finance Act 2019 and the associated tax code provision required prescribed digital payment modes, including UPI and RuPay debit, to be offered without any merchant discount rate from 1 January 2020. Zero MDR is not a market outcome; it is statute.

Consumers pay nothing. Merchants pay nothing. Banks and third-party apps carry the full cost of a system processing more than 750 million payments a day. A government incentive scheme was intended to compensate acquiring banks for part of the cost, and its budget has been cut sharply, from around 2,000 crore rupees in one fiscal year to a few hundred in the next.

The recurring proposal is a small MDR on large merchants only, exempting small ones. It has been raised repeatedly by banks and payment firms and rejected each time on the grounds that a free payment rail is a public good. Both positions are defensible. The unresolved question is who funds the next decade of capacity, security, and fraud control at that scale.

### 11.3 Brazil: Free for People, Priced for Business

Brazil drew the line differently and more sustainably.

Person-to-person Pix is free by rule, and a bank may not charge a consumer for sending or receiving. Merchants pay their payment service provider a fee that has settled at roughly 0.2 to 0.4 percent, against two to four percent on cards. The central bank charges participants a small per-transaction fee, on the order of a fraction of a centavo per payment, sized to cover the cost of running SPI rather than to generate revenue.

Banks lost card interchange and gained something they value: deposits that stay. When a customer's salary, rent, groceries, and transfers all run through one account instantly, that account becomes the primary relationship. Pix also gave banks a cheap channel for the products that actually make money, which is credit.

The result is the one combination nobody else has achieved: card volume displaced, consumers charged nothing, and the economics still working for the institutions that operate it.

### 11.4 The United States: Priced Like a Utility

Both US networks price per message at a level that is close to cost.

Sending institutions pay on the order of four and a half cents per payment. Receiving is generally free on RTP; FedNow charges a small fee for request-for-payment messages. Banks resell to businesses at something between 25 cents and a dollar per payment, and typically charge consumers nothing, because there is no consumer product to charge for.

Compared to a wire at 15 to 50 dollars, this is a bargain, and it is why the volume that has moved is business volume. Compared to ACH at a fraction of a cent, it is expensive, and it is why bulk payroll and recurring billing have not moved. Instant payments in the United States occupy the gap between ACH and wires, and that gap, while real, is much narrower than the retail market that UPI and Pix captured.

### 11.5 The United Kingdom: A Cost Centre with a New Line Item

Faster Payments is free to consumers, charged to participants as scheme and infrastructure fees amounting to a fraction of a penny per item, and billed to corporates by their banks per payment or per file.

Since October 2024 there is a new and growing cost: mandatory APP scam reimbursement, split evenly between sending and receiving firms. This is the first time a scheme has explicitly priced fraud into the cost of participation, and it changed behaviour precisely because it appears on a profit and loss statement.

### 11.6 Where the Value Actually Lands

| Party | Gains | Loses |
|-------|-------|-------|
| **Consumer** | Instant availability, no fees, simple addressing | Chargeback protection, card rewards |
| **Merchant** | Fee drops from 2-4% to near zero, funds available immediately, no card fraud liability | Recourse when a payment is disputed, card-based instalment offers |
| **Sending bank** | Deposit stickiness, a channel for credit products | Interchange income, float, fraud liability where mandated |
| **Receiving bank** | Deposits, transaction data | Fraud liability where the receiving side is on the hook |
| **Card networks** | Nothing directly | Volume, particularly debit volume in markets with a strong scheme |
| **Central bank** | A policy lever, better data, reduced cash handling cost | Direct operating cost and 24x7 operational responsibility |

The largest single beneficiary in every market is the merchant, and the largest identifiable loser is debit card interchange. In Brazil the effect is visible in card issuers' revenue lines. In the United States, where debit interchange is already capped by the Durbin Amendment for large issuers, the loss is smaller, which is one more reason US banks feel less threatened and push less hard.

---

## 12. Security, Fraud, and Risk

### 12.1 The Threat Model Inverted

Card fraud is mostly unauthorised: someone else used your card. Instant payment fraud is mostly authorised: you sent the money yourself, having been deceived.

This inversion breaks every control built for the previous era. Authentication does not help, because the genuine customer authenticated. Device fingerprinting does not help, because it is the genuine device. Behavioural biometrics detect hesitation, which is the closest thing to a signal, and criminals coach victims through it. And there is no chargeback, because the transaction was authorised and final.

![Anatomy and defence of APP scams](diagrams/app-fraud.svg)

### 12.2 The Attack Categories

**Authorised push payment scams.** A victim is persuaded to send money. The persuasion varies: an impersonated bank fraud team telling the victim to move funds to a "safe account," a fake investment platform, a romance built over months, a purchase of goods that do not exist, an altered invoice from a genuine supplier. The technical system performs correctly throughout.

**Account takeover.** Credentials are stolen through phishing, SIM swap, or malware, and the criminal sends payments as the customer. Instant rails make this worse than it was, because the window between compromise and irrecoverable loss collapses from days to seconds.

**Mule networks.** Every scam needs somewhere for the money to land. Recruited or coerced individuals open accounts and forward funds within minutes, often through several hops and out to crypto or across a border. The mule layer is where interdiction is most feasible and least attempted, because until recently the receiving institution had no financial stake.

**Malware and remote access.** In India, applications that request accessibility permissions to read one-time passwords and drive the payment interface are a persistent problem. In Brazil, malicious apps that overlay a legitimate banking interface and substitute a Pix key.

**Coerced payments.** Physical robbery in which the victim is forced to unlock a phone and transfer money. This is why Brazil's night-time limits exist, and why an instant payment scheme in a high-street-crime market needs controls that would look paranoid elsewhere.

**Directory abuse.** Bulk enumeration of the proxy directory to build a map of identifiers to accounts, used for targeting rather than for direct theft.

### 12.3 What Actually Works

**Name checking before sending.** Confirmation of Payee in the UK, Verification of Payee under EU regulation, DICT name display in Brazil, and UPI's registered name display. This eliminates misdirection fraud, including the large and expensive category of altered supplier invoices. It does not stop a victim who has been persuaded, and criminals routinely pre-explain the mismatch.

**Friction in the right places.** Cooling-off periods on first payment to a new payee, lower limits for new relationships, night-time caps, and warnings written for a specific scam type rather than generic caution. Generic warnings are ignored; a warning that says "banks never ask you to move money to a safe account" is read.

**Receiving-side detection.** The receiving institution sees the pattern that matters: a three-week-old account suddenly receiving payments from six unconnected people. Whether it acts depends on whether it bears any of the loss, which is the entire argument for split liability.

**Shared intelligence.** Brazil's central fraud register makes a burned mule account worthless across all participants. The UK is extending Confirmation of Payee data sharing at transaction level. Fraud signals are worth far more pooled than held.

**Liability allocation.** The UK's 50/50 mandatory reimbursement produced a roughly 21 percent fall in APP losses over Faster Payments in its first year, according to the independent evaluation published in July 2026. No detection technology deployed in the same period achieved a comparable result. Moving the loss onto the parties who can prevent it is the most effective single control in the field.

### 12.4 Systemic and Operational Risk

**Concentration.** Every scheme in this document is a single point of failure for a national economy. Pix processes a quarter of a billion payments on an ordinary day, and when it is unavailable, Brazilian commerce degrades measurably within minutes. The operational resilience requirements on these systems now approach those applied to RTGS.

**The 24x7 maintenance problem.** There is no window. Upgrades happen on a live system serving real customers, which means blue-green deployment, staged rollout, and the ability to reverse quickly. Several national outages across various schemes have traced to changes deployed during what used to be a quiet period and is now merely a slightly less busy one.

**Settlement risk in net schemes.** Between clearing and settlement, someone is exposed. Prefunding at the Bank of England and limits at the NPCI switch address this, but the exposure is managed rather than eliminated, and it is the one systemic risk that gross settlement schemes do not carry.

**Sanctions screening at instant speed.** A real-time screen must produce a decision in tens of milliseconds against lists containing hundreds of thousands of entries with transliteration variants. Tuning for low false positives risks missing a true match; tuning the other way blocks legitimate payments and generates a queue no human can clear at 3am. The EU's Instant Payments Regulation responded by moving the emphasis from screening every transaction to screening customers daily against the sanctions list, which is a more tractable problem and a genuine regulatory innovation.

---

## 13. Regulation and Legal Framework

### 13.1 Who Regulates What

| Jurisdiction | Scheme | Operator | Regulator | Legal basis |
|--------------|--------|----------|-----------|-------------|
| **India** | UPI | NPCI | Reserve Bank of India | Payment and Settlement Systems Act 2007 |
| **Brazil** | Pix | Banco Central do Brasil | Banco Central do Brasil | BCB resolutions; the operator and the regulator are the same institution |
| **United States** | FedNow | Federal Reserve | Federal Reserve | Regulation J, Subpart C; Federal Reserve Act |
| **United States** | RTP | The Clearing House | Federal Reserve as supervisor of a designated FMU | Dodd-Frank Title VIII; RTP Operating Rules |
| **United Kingdom** | Faster Payments | Pay.UK | Payment Systems Regulator, Bank of England, FCA | Financial Services (Banking Reform) Act 2013 |
| **Euro area** | SCT Inst, TIPS | EPC scheme, ECB operates TIPS | ECB, European Commission | Instant Payments Regulation (EU) 2024/886 |

The pattern worth noting is that Brazil collapsed three roles into one institution. The central bank writes the rules, operates the system, and supervises the participants. This is efficient and produced the best outcome in the sample. It also removes the check that exists when the operator and the supervisor are different bodies, which is a trade regulators elsewhere have been unwilling to make.

### 13.2 The EU Instant Payments Regulation

Regulation (EU) 2024/886 is the most aggressive piece of instant payment legislation anywhere, and it exists because Europe had instant payments for seven years and nobody used them.

SCT Inst launched in November 2017 and TIPS in November 2018. Both worked. Adoption stayed low because participation was optional and because banks priced an instant transfer above a normal one, which is a rational way to protect an existing product and a guaranteed way to prevent adoption.

The regulation removed both obstacles:

- **Receiving instant euro payments became mandatory in January 2025** for payment service providers in euro area member states. Sending became mandatory in October 2025.
- **Instant payments may not cost more than an equivalent non-instant transfer.** This single clause did more for European adoption than seven years of scheme promotion.
- **Verification of Payee became mandatory from 9 October 2025** in the euro area, free to the payer, returning match, close match, no match, or a null result. Providers outside the euro area have until 9 July 2027.
- **Sanctions screening shifted** from transaction-by-transaction checking to daily screening of the provider's own customer base against EU sanctions lists, removing a real-time bottleneck.

The design lesson is that a working scheme plus voluntary participation produces a working scheme nobody uses. Europe spent seven years demonstrating it.

### 13.3 Consumer Protection Compared

| Jurisdiction | Unauthorised payment | Authorised push payment scam | Cap |
|--------------|---------------------|------------------------------|-----|
| **UK** | Refund unless gross negligence | Mandatory reimbursement since Oct 2024, split 50/50 between PSPs | 85,000 GBP |
| **Brazil** | Bank liability under consumer law | MED: mandatory analysis and return of remaining funds, plus precautionary blocking | Whatever remains |
| **India** | Limited liability under RBI circulars, time-bound reporting | No general reimbursement mandate; case by case | None defined |
| **EU** | Refund under PSD2 | No general mandate; PSD3 and the Payment Services Regulation propose limited liability for impersonation fraud | Under negotiation |
| **US** | Regulation E for consumer electronic transfers | No mandate. Bank discretion. | None |

The United States is the outlier and knows it. Regulation E covers unauthorised electronic fund transfers for consumers, and a scam payment the customer authorised is generally not unauthorised. Congressional and regulatory pressure has focused on Zelle rather than on the underlying rails, and no reimbursement mandate exists.

The comparison is uncomfortable for the US position. The UK imposed one and fraud fell about 21 percent in a year. That is a fact rather than a proof, since other controls tightened at the same time, but it is the only controlled-ish experiment the field has.

### 13.4 Access and Competition

Who may join a payment system is a competition question dressed as a technical one.

The UK opened Bank of England settlement accounts to non-bank payment service providers, took direct Faster Payments participation from 26 firms to 47, and in 2026 reduced the prefunding needed to join. India made the app layer open to non-banks while restricting the settlement layer to banks, and now struggles with concentration at the layer it opened. Brazil made participation mandatory for large institutions and open to licensed payment institutions, producing more than 800 participants. The United States requires a Federal Reserve master account for FedNow, and the criteria for obtaining one have themselves been a live policy fight involving fintechs and crypto-adjacent banks.

Every design here trades openness against risk, and the trades were made differently. The one consistent finding is that opening the interface layer produces adoption and concentration together, and opening the settlement layer produces competition slowly and safely.

---

## 14. Comparisons - Why Some Schemes Take Over and Others Crawl

![Why adoption differs](diagrams/adoption-curves.svg)

### 14.1 The Comparison Table

| Dimension | UPI (India) | Pix (Brazil) | FPS (UK) | RTP + FedNow (US) | SCT Inst / TIPS (EU) |
|-----------|-------------|--------------|----------|-------------------|----------------------|
| **Built by** | Bank consortium under central bank direction | Central bank | Industry, under regulatory ultimatum | Bank consortium; central bank | Industry scheme; central bank |
| **Participation** | Effectively universal | Mandatory above 500,000 accounts | Effectively universal via mandate | Voluntary | Mandatory since 2025 |
| **Settlement** | Deferred net at RBI | Prefunded RTGS at BCB | Deferred net, prefunded at BoE | Prefunded joint account; direct on master accounts | RTGS on TIPS |
| **Addressing** | Virtual payment address | CPF, phone, email, random key | Sort code and account number | Routing and account number | IBAN |
| **Name check** | Yes, at resolution | Yes, at DICT lookup | Confirmation of Payee | Partial | Verification of Payee, mandatory |
| **Consumer cost** | Zero | Zero | Zero | Zero, but little consumer use | Capped at the price of a normal transfer |
| **Merchant cost** | Zero by statute | ~0.2-0.4% | Bank-set | 25 cents to 1 USD | Bank-set |
| **Recurring** | AutoPay mandates | Pix Automático | Standing orders | Request for Payment | SEPA Request to Pay |
| **Message standard** | NPCI XML | ISO 20022 | ISO 8583 heritage | ISO 20022 | ISO 20022 |
| **Average payment** | ~15 USD | ~80 USD | ~1,100 USD | 3,800 to 99,000 USD | Varies |

### 14.2 The Five Conditions for Take-Off

Comparing the schemes that took over their markets against those that did not produces a consistent list.

**Mandatory participation.** Brazil compelled institutions above 500,000 accounts. The UK compelled the industry in 2008. The EU compelled receiving in January 2025 and sending in October 2025. The United States compelled nothing, and after nine years RTP reaches about 70 percent of accounts while FedNow reaches a different, partly overlapping set. A network whose value depends on universal reachability cannot be built out of individually rational participation decisions.

**A usable address.** A phone number, a taxpayer identifier, an email, a virtual address. UK Faster Payments still requires a sort code and an eight-digit account number, and UK person-to-person volume reflects that friction. Addressing is not a cosmetic layer; it determines whether the median user can complete a payment without a phone call.

**Free at the point of use for consumers, and cheap enough for merchants to prefer.** Pix at 0.3 percent against cards at 3 percent is a decision a merchant makes once. The US instant networks are cheaper than wires and dearer than ACH, which is a narrower proposition.

**A weak incumbent.** Brazil had expensive cards and a slow paper alternative. India had cash. The United States has credit cards that pay the customer to use them, funded by interchange the instant rail cannot match. This is the single largest reason US retail adoption lags, and no amount of infrastructure improvement addresses it.

**Default distribution.** Pix appeared inside every bank app on launch day because the rulebook required it. UPI appeared inside apps people already used. FedNow appears inside a bank's app when that bank's core provider ships the module and the bank turns it on.

### 14.3 When to Use Which Rail

For anyone choosing a rail rather than studying one, the decision is usually straightforward.

**Use an instant rail** when the payee needs certainty now and the payer accepts irrevocability: gig payroll, insurance disbursement, account funding, wallet cash-out, urgent supplier payment, real estate closing in markets where the limit allows it, and any consumer purchase in a market where the scheme is universal.

**Use ACH or its local equivalent** for bulk recurring payments where a day of delay costs nothing and per-item cost dominates: salary runs for salaried staff, subscription billing, government benefit disbursement at scale.

**Use a wire** where the value exceeds instant scheme limits, where a foreign currency is involved, or where the counterparty's rail coverage is unknown.

**Use a card** where the payer wants recourse, where credit is the point, or where the merchant relationship is untrusted. This is the honest answer to why cards persist in markets with excellent instant rails: the chargeback is a product feature, not an inefficiency.

---

## 15. Modern Developments

### 15.1 Request to Pay, the Missing Half of the Product

A credit-push rail cannot natively do what a direct debit does, which is let a biller collect on a schedule. Request to Pay is every scheme's answer, and it inverts the ask without inverting the money movement.

![Request to Pay across schemes](diagrams/request-to-pay.svg)

The biller sends a request. The payer's bank shows it as a notification. The payer approves, declines, or part-pays, and if they approve, an ordinary credit push carries the payment with the original request's reference attached. Reconciliation is exact, because the invoice identifier travels with the money.

The names differ and the mechanism does not: Request for Payment on RTP and FedNow, collect requests and AutoPay mandates on UPI, Pix Cobrança and Pix Automático in Brazil, SEPA Request to Pay in Europe.

Adoption has been slower than the elegance suggests. Two reasons recur. Billers must rebuild their dunning and collections processes around a payer who can simply say no, which is a larger change than the payment mechanics. And the flow is a natural home for fraud, as India learned when scammers sent collect requests dressed as refunds, prompting NPCI to throttle the feature for most merchant categories.

Brazil's response was to make the recurring variant mandatory rather than optional. Pix Automático became compulsory for participants in October 2025, and salary accounts become usable for it from October 2026. Making the useful thing mandatory is Brazil's answer to most adoption questions, and it keeps working.

### 15.2 Credit on Instant Rails

The most consequential product change is that instant rails, built to move existing balances, are becoming distribution channels for credit.

India moved first. RuPay credit cards were linked to UPI in 2022, and the Reserve Bank permitted pre-sanctioned credit lines on UPI in 2023. The customer scans the same QR code; the funding source behind it is borrowed money. Brazil is developing Pix parcelado as a bank product and Pix Garantido as a scheme feature, where a scheduled payment is backed by a receivable.

The economics are strange and unresolved. Credit costs money to provide, and in India it is being distributed at a merchant discount rate of zero. Someone is paying for the credit risk, the capital, and the collection, and it is not the merchant. Expect this to be where the MDR debate finally breaks, in one direction or the other.

### 15.3 Cross-Border Interlinking

Domestic instant payments are a solved problem. Cross-border remittance still costs around six percent globally and takes days, which is the largest remaining gap in retail payments.

![Cross-border interlinking and Nexus](diagrams/cross-border-nexus.svg)

**Bilateral links** came first and work. UPI connected to Singapore's PayNow in 2023; Thailand's PromptPay connected to PayNow in 2021. Each link required its own contract, foreign exchange arrangement, rulebook reconciliation, and message translation. The approach does not scale, because n countries need n-squared links.

**Nexus** is the attempt at a hub. Originating as a Bank for International Settlements Innovation Hub blueprint, it was incorporated as Nexus Global Payments in 2025 by the central banks of India, Malaysia, the Philippines, Singapore, and Thailand, with Indonesia working towards participation. The model is that each domestic scheme connects once, to Nexus, rather than to every other scheme. Nexus standardises addressing, ISO 20022 mapping, foreign exchange provider selection, and the rulebook, and competing FX providers quote into the hub. The target is under 60 seconds end to end for retail-sized payments, across a first wave covering roughly 1.7 billion people. The programme is now producing rulebooks, technical implementation guides, and ISO 20022 specifications, and has tendered for a platform operator.

What remains genuinely hard is not the message plumbing. It is sanctions screening in seconds against different lists in different alphabets, deciding whose consumer protection rules apply when a scam crosses a border, who carries foreign exchange risk in the seconds between the two domestic legs, data residency law governing the directory lookup, and holding destination-currency liquidity at 3am local time.

Other threads run in parallel: Pix internacional, wholesale central bank digital currency corridors such as mBridge, stablecoin settlement between regulated institutions, and Swift's own work on interlinking instant schemes. None has yet displaced correspondent banking for retail remittance.

### 15.4 What Changed in the Last Three Years

- **July 2023**: FedNow launches, giving the United States a public instant rail.
- **February 2025**: RTP raises its transaction limit from 1 million to 10 million dollars. Pix por aproximação brings NFC tap-to-pay.
- **January 2025**: EU providers in the euro area must receive instant euro payments.
- **June 2025**: Pix Automático launches, adding recurring debits to Brazil's rail.
- **October 2025**: EU sending obligation and mandatory Verification of Payee take effect. Pix Automático becomes compulsory for Brazilian participants.
- **November 2025**: FedNow raises its network limit to 10 million dollars, matching RTP.
- **2025**: Nexus Global Payments incorporates, moving cross-border interlinking from blueprint to implementation.
- **July 2026**: Pay.UK introduces flexible Net Sender Caps, cutting the prefunding barrier to direct Faster Payments participation. The PSR's independent evaluation reports APP losses over Faster Payments down about 21 percent.
- **May 2026**: UPI passes 23.2 billion payments in a single month.

### 15.5 Where This Is Heading

Four directions are visible and reasonably safe to state.

**Mandates spread.** Every market that made participation voluntary has watched adoption stall, and every market that mandated it has watched adoption succeed. The EU has already switched. Pressure on the United States to do something similar will grow as the gap becomes more visible, though the political route to a US mandate is unclear.

**Liability follows the fraud.** The UK's reimbursement regime worked, and regulators copy things that work. Australia, Singapore, and the EU are all at various stages of shifting scam liability onto payment service providers. Expect the receiving institution's share to be the contested variable everywhere.

**Instant becomes the default rather than a product.** Once receiving is mandatory and pricing is capped at the level of a normal transfer, "instant" stops being a premium feature and becomes what a transfer is. Europe crossed that line in October 2025. Batch rails will persist for bulk, low-urgency, cost-sensitive flows, which is a large and permanent category rather than a legacy one.

**The revenue question stays open.** No market has found a durable answer to who funds instant payment infrastructure at scale once interchange is gone. Brazil's small merchant fee comes closest. India's zero-MDR model is the most successful by adoption and the least resolved financially. This is the question the next decade of payments policy will actually be about.

---

## 16. Appendix

### 16.1 Key Terminology

| Term | Meaning |
|------|---------|
| **APP fraud** | Authorised Push Payment fraud. The victim authorises the payment, having been deceived. No chargeback applies. |
| **BR Code** | Brazil's implementation of the EMV merchant-presented QR specification, used for Pix. |
| **Confirmation of Payee** | UK service that checks a payee name against the destination account before sending. |
| **Credit push** | The payer's institution initiates and sends. The opposite of a direct debit. |
| **DICT** | Diretório de Identificadores de Contas Transacionais. Brazil's Pix key directory, operated by the central bank. |
| **Deferred net settlement** | Customers are credited immediately; banks settle net positions later in scheduled cycles. |
| **End-to-end identification** | The payer's reference, required to reach the payee unmodified. |
| **IMPS** | Immediate Payment Service. India's 24x7 interbank rail, live since 2010, underneath UPI. |
| **ISPB** | The identifier code for a Brazilian financial institution, used in Pix end-to-end identifiers. |
| **LMT** | Liquidity Management Transfer. A FedNow message type for moving funds between master accounts out of hours. |
| **MED** | Mecanismo Especial de Devolução. Brazil's mandatory fraud return mechanism. |
| **MDR** | Merchant Discount Rate. The fee a merchant pays to accept a payment. Zero for UPI by Indian statute. |
| **NPCI** | National Payments Corporation of India. Operates UPI, IMPS, RuPay, and other national schemes. |
| **Net Sender Cap** | The maximum net debit position a Faster Payments participant may run, backed by prefunded collateral. |
| **`pacs.008`** | The ISO 20022 interbank customer credit transfer. The payment message. |
| **`pacs.002`** | The ISO 20022 payment status report. Accepted or rejected, with a reason code. |
| **PI account** | Conta Pagamentos Instantâneos. A Pix participant's prefunded settlement account at the Brazilian central bank. |
| **Proxy / alias** | A human-friendly identifier that resolves to an account: a phone number, email, VPA, or Pix key. |
| **Request to Pay** | A message asking the payer to make a payment. The payer still decides. |
| **RSFN** | Rede do Sistema Financeiro Nacional. Brazil's private interbank network. The only path to SPI. |
| **RTGS** | Real-Time Gross Settlement. Each payment settles individually and immediately in central bank money. |
| **SPI** | Sistema de Pagamentos Instantâneos. Brazil's Pix settlement engine, operated by the central bank. |
| **TIPS** | TARGET Instant Payment Settlement. The ECB's instant settlement service. |
| **UETR** | Unique End-to-end Transaction Reference. A UUID used for tracking across schemes. |
| **VPA** | Virtual Payment Address. A UPI alias in the form `name@handle`. |
| **Verification of Payee** | The EU's mandatory payee name-check, required in the euro area from 9 October 2025. |

### 16.2 Architecture Diagrams

| Diagram | Source | Description |
|---------|--------|-------------|
| Evolution Timeline | [`diagrams/evolution-timeline.mmd`](diagrams/evolution-timeline.mmd) | Instant payments from Japan's Zengin in 1973 to interlinking in 2026 |
| Participants | [`diagrams/participants.mmd`](diagrams/participants.mmd) | Actors in an instant payment scheme and how they relate |
| Instant Payment Anatomy | [`diagrams/instant-payment-anatomy.mmd`](diagrams/instant-payment-anatomy.mmd) | The four properties that define instant, and what these systems are not |
| Primary Flow | [`diagrams/primary-flow.mmd`](diagrams/primary-flow.mmd) | The generic eight-step flow with its failure paths |
| UPI Architecture | [`diagrams/upi-architecture.mmd`](diagrams/upi-architecture.mmd) | NPCI's four-layer design and the stack it was built on |
| UPI Flow | [`diagrams/upi-flow.mmd`](diagrams/upi-flow.mmd) | Device binding, the Common Library, and a QR payment end to end |
| UPI Mandates | [`diagrams/upi-mandate.mmd`](diagrams/upi-mandate.mmd) | Direct pay, collect, AutoPay, credit on the rail, and UPI Lite |
| Pix Architecture | [`diagrams/pix-architecture.mmd`](diagrams/pix-architecture.mmd) | SPI, DICT, PI accounts, and the RSFN network |
| Pix Flow | [`diagrams/pix-flow.mmd`](diagrams/pix-flow.mmd) | A dynamic QR payment from scan to irrevocable credit |
| Pix MED | [`diagrams/pix-med.mmd`](diagrams/pix-med.mmd) | The special return mechanism and the prevention layer around it |
| US Instant Rails | [`diagrams/us-instant-rails.mmd`](diagrams/us-instant-rails.mmd) | RTP and FedNow compared, and why they do not interoperate |
| FedNow Flow | [`diagrams/fednow-flow.mmd`](diagrams/fednow-flow.mmd) | Settlement on Federal Reserve master accounts, with recall paths |
| Faster Payments Architecture | [`diagrams/fps-architecture.mmd`](diagrams/fps-architecture.mmd) | Access, central infrastructure, fraud controls, and prefunded settlement |
| 24x7 Liquidity | [`diagrams/liquidity-24x7.mmd`](diagrams/liquidity-24x7.mmd) | Three settlement models and the funding problem they each solve |
| ISO 20022 Messages | [`diagrams/iso20022-messages.mmd`](diagrams/iso20022-messages.mmd) | The message set, the fields that matter, and who actually uses it |
| Request to Pay | [`diagrams/request-to-pay.mmd`](diagrams/request-to-pay.mmd) | Inverting the ask without inverting the money movement |
| APP Fraud | [`diagrams/app-fraud.mmd`](diagrams/app-fraud.mmd) | Scam anatomy, why instant rails are targeted, and what defends against it |
| Money Flow | [`diagrams/money-flow.mmd`](diagrams/money-flow.mmd) | Who pays whom in India, Brazil, the US, and the UK |
| Adoption Curves | [`diagrams/adoption-curves.mmd`](diagrams/adoption-curves.mmd) | The five conditions for take-off and what held the slow schemes back |
| Cross-border Nexus | [`diagrams/cross-border-nexus.mmd`](diagrams/cross-border-nexus.mmd) | Bilateral links, the Nexus hub model, and the unsolved problems |

### 16.3 Scheme Reference Table

| Scheme | Country | Live | Limit | Settlement | Standard | Proxy |
|--------|---------|------|-------|------------|----------|-------|
| **UPI** | India | 2016 | 100,000 INR general, higher by category | Deferred net at RBI | NPCI XML | VPA |
| **Pix** | Brazil | 2020 | Set by participant; night-time default 1,000 BRL | Prefunded RTGS at BCB | ISO 20022 | CPF, CNPJ, phone, email, UUID |
| **Faster Payments** | UK | 2008 | 1,000,000 GBP central; banks set lower | Deferred net, prefunded at BoE | ISO 8583 heritage | None |
| **RTP** | US | 2017 | 10,000,000 USD | Prefunded joint account at NY Fed | ISO 20022 | None native |
| **FedNow** | US | 2023 | 10,000,000 USD network; 100,000 USD default | RTGS on Fed master accounts | ISO 20022 | None native |
| **SCT Inst** | Euro area | 2017 | 100,000 EUR scheme default, raised by agreement | RTGS via TIPS or CSM | ISO 20022 | None; IBAN with VoP |
| **PayNow** | Singapore | 2017 | Bank-set | Deferred net | ISO 20022 | Phone, NRIC, UEN |
| **PromptPay** | Thailand | 2016 | Bank-set | Deferred net | ISO 20022 | Phone, national ID |
| **Zengin** | Japan | 1973 | Bank-set | Net, with RTGS for large value | Zengin format | None |

### 16.4 Common ISO 20022 Rejection Reasons

| Code | Meaning | Typical cause |
|------|---------|---------------|
| `AC01` | Incorrect account number | Alias resolved to a stale account |
| `AC04` | Closed account | Payee closed the account after the directory entry was written |
| `AC06` | Blocked account | Regulatory or internal block on the destination |
| `AG01` | Transaction forbidden | Account type may not receive this payment type |
| `AM04` | Insufficient funds | Sender's balance or settlement position exhausted |
| `AM02` | Amount exceeds limit | Above the scheme, institution, or customer limit |
| `BE05` | Unrecognised initiating party | Sender not a recognised participant |
| `FF08` | Invalid end-to-end identification | Malformed or duplicate reference |
| `RR04` | Regulatory reason | Sanctions or compliance hold |
| `TM01` | Cut-off time | Applies to schemes with windows; rare on true 24x7 rails |

---

## 17. Key Takeaways

**1. The technology was never the variable.** Every scheme in this document settles a payment in under ten seconds. What separates Pix, which displaced cards in a year, from FedNow, which is still building reach after three, is whether banks were allowed to say no.

**2. Mandatory participation is the single strongest predictor of adoption.** Brazil compelled institutions above 500,000 accounts. The UK compelled the industry in 2008. The EU compelled receiving in January 2025 and sending in October 2025. The United States compelled nothing and has partial coverage across two networks that cannot reach each other.

**3. Addressing determines whether ordinary people use it.** A phone number, a taxpayer number, or a virtual address turns a payment into a two-tap action. A sort code and an eight-digit account number does not. The UK built the first modern instant scheme and still has no proxy directory, which shows in its person-to-person volume.

**4. Instant plus irrevocable equals a new fraud model.** Card fraud is unauthorised. Instant payment fraud is authorised, which defeats authentication, device fingerprinting, and every control built for the previous era. There is no chargeback, and there never will be.

**5. Liability allocation is the most effective fraud control discovered so far.** The UK's mandatory 50/50 reimbursement between sending and receiving firms cut APP losses over Faster Payments by around 21 percent in its first year. No detection technology deployed in that period came close. Moving the loss onto the parties who can prevent it works because it appears on a profit and loss statement.

**6. Instant payments destroy interchange and replace it with nothing.** A card payment generates two to four percent of value in fees. An instant payment generates a few cents. Every market has had to decide who funds the rail instead, and that decision, more than any technical one, determines whether banks promote instant payments or merely comply.

**7. India optimised for adoption and left the economics unresolved.** Zero merchant discount rate by statute since 2020 produced 23.2 billion payments in a single month and a system whose operators earn nothing from it. It is simultaneously the most successful payment scheme ever built and the least commercially settled.

**8. Brazil found the only sustainable middle.** Free for consumers by rule, roughly 0.3 percent for merchants against 3 percent on cards, and a fraction of a centavo per payment to the central bank. Card volume displaced, consumers charged nothing, and the institutions that operate it still make money.

**9. 24x7 is an operational problem, not a software one.** Payments settle at 3am on a Sunday, when the funding markets that refill a bank's position are closed. Prefunded joint accounts, direct central bank accounts, and collateralised net caps are three answers to the same question, and all three cost real money in idle balances.

**10. Cross-border is the remaining gap, and message standards are not enough to close it.** ISO 20022 is necessary and insufficient: schemes differ in mandatory fields, code lists, and identifier conventions. Nexus is the serious attempt at a hub rather than a mesh, and the hard parts left are sanctions screening in seconds, cross-border scam liability, and destination-currency liquidity at 3am.

**11. "Instant" is becoming the definition of a transfer rather than a product.** Once receiving is mandatory and pricing is capped at the level of an ordinary transfer, there is nothing left to sell. Europe crossed that line in October 2025. Batch rails persist for bulk and cost-sensitive flows, which is a permanent category rather than a legacy one.

---

*Figures in this document are drawn from operator and central bank publications and reflect data available as of August 2026. Volume and value statistics for high-growth schemes move quickly; orders of magnitude are stable, individual months are not.*
