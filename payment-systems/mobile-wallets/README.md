# Mobile Wallets: Apple Pay, Google Pay, and Samsung Pay -- Complete Technical Deep Dive

---

## Table of Contents

1. [History and Overview](#1-history-and-overview)
2. [What a Mobile Wallet Actually Is (and Is Not)](#2-what-a-mobile-wallet-actually-is-and-is-not)
3. [Key Participants and Roles](#3-key-participants-and-roles)
4. [NFC Technology -- The Physical Layer](#4-nfc-technology----the-physical-layer)
5. [Hardware Security: SE, HCE, and TEE](#5-hardware-security-se-hce-and-tee)
6. [Apple Pay Architecture](#6-apple-pay-architecture)
7. [Google Pay / Google Wallet Architecture](#7-google-pay--google-wallet-architecture)
8. [Samsung Pay and MST Technology](#8-samsung-pay-and-mst-technology)
9. [Token Service Providers and EMVCo](#9-token-service-providers-and-emvco)
10. [Step-by-Step Transaction Flows](#10-step-by-step-transaction-flows)
11. [Economics and Fee Structure](#11-economics-and-fee-structure)
12. [Security and Fraud Prevention](#12-security-and-fraud-prevention)
13. [Regulation and Compliance](#13-regulation-and-compliance)
14. [Comparisons: Apple Pay vs Google Pay vs Samsung Pay](#14-comparisons-apple-pay-vs-google-pay-vs-samsung-pay)
15. [Modern Developments and Future](#15-modern-developments-and-future)

---

## 1. History and Overview

### 1.1 Before the Smartphone: Early Mobile Payment Attempts

The idea of paying with a phone predates the iPhone by over a decade. Understanding the failures is essential to understanding why Apple Pay, Google Pay, and Samsung Pay succeeded where others did not.

**1997 -- Coca-Cola Vending Machines in Finland.** The earliest mobile payment deployment allowed customers to send an SMS to a vending machine to purchase a Coke. The vending machine would dispense the drink and the charge would appear on the customer's phone bill. This was carrier billing, not a wallet.

**2004 -- FeliCa and Osaifu-Keitai in Japan.** NTT DoCoMo partnered with Sony to embed FeliCa (Sony's proprietary contactless IC chip, operating at 13.56 MHz) into mobile phones. The system, branded "Osaifu-Keitai" (meaning "wallet phone"), launched on the Sharp SH901iC handset. By 2006, over 20 million Japanese phones had FeliCa chips. Users could tap to pay at convenience stores, ride trains (via Suica integration), and even use their phones as apartment keys. Japan was a decade ahead of the rest of the world.

**2006 -- Nokia NFC Trials.** Nokia launched NFC-enabled phones (Nokia 6131 NFC) for pilot programs in Europe. Trials in Caen (France) and Oulu (Finland) showed promise but never achieved mass adoption due to fragmented carrier agreements and lack of merchant terminals.

**2010 -- Visa payWave and Mastercard PayPass on Stickers.** Both networks experimented with NFC stickers that could be attached to phones. The stickers contained a Secure Element with a payment credential. Adoption was minimal -- the stickers were ugly, unreliable, and required physical distribution through bank branches.

**2011 -- Google Wallet Launches.** Google launched Google Wallet on the Samsung Nexus S 4G (Sprint). It used a hardware Secure Element (NXP chip) embedded in the phone. The SE stored a virtual Mastercard issued by Citi. The product was technically impressive but commercially limited -- it required carrier cooperation (Verizon, AT&T, and T-Mobile blocked it in favor of their own Isis/Softcard venture), worked on only a handful of handsets, and required a Citi Mastercard.

**2012 -- Isis (later Softcard).** Verizon, AT&T, and T-Mobile formed a joint venture called Isis (later renamed Softcard to avoid association with the terrorist organization). The wallet used SIM-based Secure Elements, giving carriers control over the SE. It launched in Salt Lake City and Austin but was plagued by poor UX, limited handset support, and carrier politics. Google acquired Softcard's technology and team in February 2015.

**2014, September 9 -- Apple Pay Launches.** Tim Cook announced Apple Pay at the iPhone 6 keynote. Apple had spent years laying groundwork: Touch ID (iPhone 5s, 2013), the Secure Enclave (A7 chip, 2013), NFC hardware (iPhone 6, 2014), and quiet negotiations with Visa, Mastercard, American Express, and six major US banks (JPMorgan Chase, Bank of America, Citi, Capital One, Wells Fargo, US Bank). Apple Pay launched on October 20, 2014, with 220,000 accepting merchants on day one. Within 72 hours, over one million credit cards were activated on Apple Pay -- more mobile wallet activations in three days than all previous attempts combined.

**2015, February -- Samsung Pay Announced.** Samsung acquired LoopPay, a Boston-based startup, for approximately $250 million. LoopPay's key technology was Magnetic Secure Transmission (MST), which could emulate the magnetic field of a card swipe. This meant Samsung Pay could work at virtually any terminal with a magnetic stripe reader -- not just NFC terminals. Samsung Pay launched in South Korea on August 20, 2015, and in the US on September 28, 2015.

**2015, September -- Android Pay Replaces Google Wallet.** Google relaunched its mobile payments product as Android Pay, abandoning the hardware SE approach in favor of Host Card Emulation (HCE), which had been added to Android 4.4 KitKat in 2013. HCE allowed the phone's processor to emulate a contactless card without needing a hardware Secure Element, eliminating carrier gatekeeping.

**2018 -- Google Pay Rebrand.** Google consolidated Android Pay and Google Wallet into a single brand: Google Pay (GPay). The Google Wallet name was briefly retired for the payments product (it remained as a peer-to-peer app in some markets).

**2020 -- Google Pay Super-App Attempt.** Google redesigned Google Pay as a social-commerce app (nicknamed "Tez" approach, modeled after its successful India product). The redesign included P2P payments, cashback offers, and merchant discovery. It was poorly received in the US.

**2022 -- Google Wallet Returns.** Google once again rebranded, splitting the product: "Google Wallet" became the container for cards, passes, tickets, and IDs (the tap-to-pay function), while "Google Pay" was retained in some markets for the P2P and financial services layer. In 2024, Google shut down the standalone Google Pay app in the US, consolidating everything back into Google Wallet.

**2021 -- Samsung MST Sunset.** Samsung dropped MST support starting with the Galaxy S21, making Samsung Pay NFC-only, functionally similar to Google Pay.

### 1.2 Scale Today (2025-2026)

| Metric | Apple Pay | Google Pay / Wallet | Samsung Pay |
|--------|-----------|-------------------|-------------|
| Active users (est.) | 535 million+ | 420 million+ | 51 million+ |
| Countries | 78+ | 70+ (varies by feature) | 24 (declining) |
| Supported banks | 4,000+ issuers | 3,000+ issuers | 1,500+ issuers |
| In-store NFC | Yes | Yes | Yes (NFC only post-2021) |
| Web / in-app | Yes | Yes | Limited |
| Transit | 30+ transit systems | 20+ transit systems | Limited |
| Revenue share from interchange | ~0.15% US, ~0.05% EU | $0 (no fee to banks) | $0 (originally; rewards model) |

**Market share of in-store contactless payments (US, 2025):**
- Apple Pay: ~92% of mobile wallet tap-to-pay transactions
- Google Pay: ~6%
- Samsung Pay: ~2%

Apple Pay's dominance in the US is driven by iPhone's ~57% smartphone market share among Americans, combined with a significantly higher activation rate than Google Pay on Android.

### 1.3 Why This Research Matters

Mobile wallets are often misunderstood. Most people think of them as payment apps -- but they are tokenization-and-authentication layers that sit on top of the existing card network rails (Visa, Mastercard, Amex). Understanding how they actually work requires understanding NFC hardware, Secure Elements, Host Card Emulation, token provisioning, cryptogram generation, and the complex economics that convinced banks to pay Apple 15 basis points per transaction.

---

## 2. What a Mobile Wallet Actually Is (and Is Not)

### 2.1 The Single Most Important Concept

**A mobile wallet is NOT a payment network.** It does not move money. It does not compete with Visa or Mastercard. It is a tokenization and authentication layer that sits on top of existing payment network rails.

When you tap your iPhone at a Whole Foods terminal, the transaction still flows through the exact same four-party model as a physical card swipe: Merchant -> Acquirer -> Network (Visa/MC) -> Issuer. The difference is that the mobile wallet:

1. **Replaces the PAN** (your real card number) with a device-specific token (DPAN)
2. **Generates a one-time cryptogram** for each transaction (like a single-use CVV)
3. **Authenticates the cardholder** using biometrics (Face ID, fingerprint) instead of a PIN or signature
4. **Stores credentials** in secure hardware (Secure Element or TEE) instead of on a magnetic stripe or plastic chip

The underlying payment -- authorization, clearing, settlement, interchange -- is identical to a card transaction.

### 2.2 Common Misconceptions

| Misconception | Reality |
|---------------|---------|
| "Apple Pay holds my money" | No. Apple Pay holds a *token* that represents your card. Your money stays in your bank account or credit line with your issuer. |
| "Google Pay is a bank" | No. Google Pay is a wallet app. It stores tokenized credentials. Google has explored banking (Plex, now cancelled), but Google Pay itself does not hold funds (except in Google Pay Balance in some markets). |
| "Samsung Pay replaces Visa" | No. Samsung Pay can only transact because it carries a Visa, Mastercard, or other network token. Without a card network, it cannot process payments. |
| "Mobile wallets charge merchants extra" | No. The merchant fee is the same as a contactless card transaction. The wallet provider's fee (if any) comes from the issuer's share of interchange. |
| "Apple can see what I buy" | Apple states that it does not store or have access to transaction details. The payment data flows between the device, the merchant, and the card network. Apple receives anonymized transaction metadata only. |
| "NFC payments are less secure than chip" | The opposite. NFC mobile wallet payments use device-specific tokens + dynamic cryptograms + biometric authentication. A stolen token is useless without the cryptographic keys bound to the specific device's Secure Element. |

### 2.3 The Mental Model

Think of a mobile wallet as a **secure container** that holds multiple virtual cards. Each virtual card is a token -- a substitute for the real card number. When you pay, the container:

1. Verifies you are the owner (biometrics)
2. Pulls out the correct virtual card (token)
3. Generates a unique, time-limited proof of authenticity (cryptogram)
4. Presents the token + cryptogram to the terminal

The terminal and the rest of the payment chain treat this exactly like a card-present transaction -- because, from the network's perspective, it IS a card-present transaction.

```
Physical Card Payment:
  Card  -->  [PAN + Chip Cryptogram]  -->  Terminal  -->  Acquirer  -->  Network  -->  Issuer

Mobile Wallet Payment:
  Phone -->  [DPAN + Device Cryptogram] -->  Terminal  -->  Acquirer  -->  Network  -->  TSP (detokenize) --> Issuer

                                                                                        ^
                                                                                        |
                                                                                  Token Vault
                                                                              maps DPAN back to PAN
```

The critical difference: the merchant, the terminal, and the acquirer **never see the real PAN**. The network's Token Service Provider (TSP) converts the DPAN back to the real PAN before forwarding to the issuer.

---

## 3. Key Participants and Roles

### 3.1 The Ecosystem Map

The mobile wallet ecosystem extends the traditional four-party card model with several additional participants:

| Participant | Role | Examples |
|-------------|------|----------|
| **Cardholder** | Person who owns the payment card and the mobile device | Consumer |
| **Wallet Provider** | Creates and maintains the wallet app and hardware integration | Apple, Google, Samsung |
| **Device Manufacturer** | Builds the phone with NFC, Secure Element, biometrics | Apple (for Apple Pay), Samsung, Google Pixel |
| **Token Service Provider (TSP)** | Issues and manages tokens on behalf of card networks | Visa Token Service (VTS), Mastercard Digital Enablement Service (MDES) |
| **Issuing Bank (Issuer)** | Issues the underlying payment card, approves tokenization, authorizes transactions | Chase, Citi, Barclays, HDFC |
| **Card Network** | Operates the payment rails, sets rules, provides TSP infrastructure | Visa, Mastercard, Amex |
| **Acquiring Bank (Acquirer)** | Processes card transactions for the merchant | Worldpay, Adyen, Chase Paymentech |
| **Merchant** | Accepts payments via NFC terminal | Whole Foods, Starbucks, TfL |
| **Terminal Manufacturer** | Builds POS terminals with NFC reader support | Verifone, Ingenico, PAX, Square |
| **EMVCo** | Standards body governing token and contactless specs | Owned jointly by Visa, MC, JCB, Amex, UnionPay, Discover |

### 3.2 Relationships Between Participants

```
+-------------------+       +------------------+       +-------------------+
|   CARDHOLDER      |       |  WALLET PROVIDER |       |  DEVICE OEM       |
|   (owns card +    |<----->|  (Apple, Google,  |<----->|  (builds phone,   |
|    mobile device) |       |   Samsung)        |       |   SE, NFC, bio)   |
+--------+----------+       +--------+---------+       +-------------------+
         |                           |
         |  taps phone               |  provisions token
         v                           v
+-------------------+       +------------------+
|   MERCHANT        |       |  TSP             |
|   (NFC terminal)  |       |  (VTS / MDES)    |
+--------+----------+       +--------+---------+
         |                           |
         |  auth request             |  maps token <-> PAN
         v                           v
+-------------------+       +------------------+
|   ACQUIRER        |------>|  CARD NETWORK    |
|   (processes txn) |       |  (Visa / MC)     |
+-------------------+       +--------+---------+
                                     |
                                     v
                            +------------------+
                            |  ISSUER          |
                            |  (approves txn)  |
                            +------------------+
```

### 3.3 Who Controls What

A critical distinction in the mobile wallet ecosystem is **who controls the Secure Element**:

| Platform | SE Controller | Implication |
|----------|--------------|-------------|
| Apple Pay | Apple (Secure Enclave, proprietary) | Apple has full control over which apps can use NFC for payments. Until 2024 (EU DMA), only Apple Pay could tap-to-pay on iPhone. |
| Google Pay (pre-KitKat) | Carrier (SIM-based SE) | Carriers controlled access, leading to the Isis/Softcard debacle and Google Wallet being blocked. |
| Google Pay (post-KitKat) | Google (HCE -- software emulation) | Google bypassed hardware SE entirely with Host Card Emulation, eliminating carrier gatekeeping. |
| Samsung Pay | Samsung (eSE embedded in phone) | Samsung embeds its own SE chip (often from NXP or Samsung Semiconductor), separate from the SIM. |

This control dynamic explains many of the architectural differences between the three wallets, as explored in Sections 6-8.

---

## 4. NFC Technology -- The Physical Layer

### 4.1 What is NFC?

Near Field Communication (NFC) is a set of short-range wireless communication protocols operating at **13.56 MHz** with a typical range of **0-4 cm** (intentionally short for security). NFC is defined by several ISO/IEC standards:

| Standard | Name | Role in Payments |
|----------|------|-----------------|
| ISO/IEC 18092 | NFC Interface and Protocol (NFCIP-1) | Defines the base NFC communication standard |
| ISO/IEC 14443 | Proximity Coupling (Type A and Type B) | The contactless card communication protocol -- this is what payment terminals use |
| ISO/IEC 7816-4 | Identification Cards -- Commands for interchange | Defines APDU (Application Protocol Data Unit) command structure |
| EMVCo Contactless Specs | EMV Contactless Books A-D | Payment-specific extensions (kernel specs for Visa, MC, Amex) |

NFC has three operating modes:

| Mode | Description | Payment Use |
|------|-------------|-------------|
| **Card Emulation** | Device behaves like a contactless card | This is how Apple Pay / Google Pay work at NFC terminals |
| **Reader/Writer** | Device reads NFC tags | Phone-as-terminal (Tap to Pay on iPhone), reading smart posters |
| **Peer-to-Peer** | Two NFC devices exchange data | Android Beam (deprecated); not used for payments |

For mobile payments, only **Card Emulation mode** matters. The phone pretends to be a contactless card, and the terminal thinks it's talking to a standard EMV contactless card.

### 4.2 The NFC Payment Handshake

When a phone is tapped against a payment terminal, the following sequence occurs in under 500 milliseconds:

**Step 1: RF Field Activation.** The POS terminal continuously emits a 13.56 MHz radio frequency field. When a phone (or card) enters this field (within ~4 cm), the NFC controller in the phone detects the field and activates Card Emulation mode.

**Step 2: PPSE Negotiation (Proximity Payment System Environment).** The terminal sends a SELECT command for the PPSE:

```
SELECT command:
  CLA: 00
  INS: A4
  P1:  04  (select by name)
  P2:  00
  Data: 2PAY.SYS.DDF01  (PPSE application name)
```

The phone's NFC controller (or Secure Element) responds with a list of available payment applications (AIDs -- Application Identifiers) supported by the wallet.

**Step 3: Application Selection.** The terminal selects the appropriate payment application using the AID:

| Network | AID | Hex |
|---------|-----|-----|
| Visa | A0000000031010 | Visa Debit/Credit |
| Mastercard | A0000000041010 | Mastercard Credit/Debit |
| Amex | A00000002501 | American Express |
| Discover | A0000003241010 | Discover |
| JCB | A0000000651010 | JCB |

The terminal sends: `SELECT <AID>`

**Step 4: GET PROCESSING OPTIONS (GPO).** The terminal sends a GPO command containing Processing Data Object List (PDOL) data -- typically including terminal country code, transaction currency, transaction amount, and terminal type. The phone's SE responds with:
- **AIP** (Application Interchange Profile) -- capabilities of the card application
- **AFL** (Application File Locator) -- pointers to the data records the terminal should read

**Step 5: READ RECORD(s).** The terminal reads the necessary application data, including the token (DPAN), expiry date, cardholder name (if present), and track-2 equivalent data.

**Step 6: Cryptogram Generation.** The phone's Secure Element generates a dynamic cryptogram using the token cryptographic key. This is the critical security step -- the cryptogram is a one-time value derived from:
- The token (DPAN)
- A transaction-specific counter (ATC -- Application Transaction Counter)
- The transaction amount, currency, and date
- Terminal unpredictable number
- The cryptographic key stored in the SE

**Step 7: Transmission.** The terminal receives the token + cryptogram and proceeds with a standard EMV contactless authorization. The entire NFC interaction typically completes in 300-500 milliseconds.

### 4.3 APDU Command Reference

The NFC payment dialogue uses ISO 7816-4 APDU (Application Protocol Data Unit) commands:

| Command | CLA | INS | Purpose |
|---------|-----|-----|---------|
| SELECT | 00 | A4 | Select PPSE or payment AID |
| GET PROCESSING OPTIONS | 80 | A8 | Initialize transaction, get AIP/AFL |
| READ RECORD | 00 | B2 | Read application data files |
| GENERATE AC | 80 | AE | Generate Application Cryptogram (ARQC) |
| GET DATA | 80 | CA | Retrieve specific data objects |
| COMPUTE CRYPTOGRAPHIC CHECKSUM | 80 | 2A | Generate dynamic CVC3 (Mastercard) |

### 4.4 Contactless vs Contact Chip

Contactless NFC is a streamlined version of contact chip EMV:

| Aspect | Contact Chip (Insert) | Contactless NFC (Tap) |
|--------|----------------------|----------------------|
| Communication | ISO 7816-3 galvanic contact | ISO 14443 RF at 13.56 MHz |
| APDU exchanges | 10-15 round trips | 2-4 round trips |
| Time at terminal | 3-5 seconds (card must remain inserted) | Under 500ms (tap and remove) |
| CVM (under limit) | PIN typically required | No CVM (under contactless limit) |
| CVM (over limit) | PIN | CDCVM (on-device biometric) or PIN |
| Offline auth | SDA, DDA, or CDA | Usually skipped (online-only) |
| Risk management | Full terminal risk management | Streamlined -- relies on online auth |

The speedup comes from eliminating offline data authentication steps (SDA/DDA/CDA) and reducing the number of APDU exchanges. Contactless payments typically go online-only for authorization, relying on the network's fraud scoring rather than offline risk management.

---

## 5. Hardware Security: SE, HCE, and TEE

### 5.1 Secure Element (SE)

A Secure Element is a tamper-resistant hardware chip designed to securely store cryptographic keys and execute cryptographic operations. It is certified to Common Criteria EAL 5+ or higher (the same level used in SIM cards, passports, and banking smartcards).

**Types of Secure Elements:**

| SE Type | Location | Controller | Used By |
|---------|----------|-----------|---------|
| **UICC-based (SIM)** | SIM card | Mobile carrier | Isis/Softcard (defunct); some carrier NFC programs |
| **Embedded SE (eSE)** | Soldered to phone motherboard | Device OEM | Samsung Pay, early Google Wallet |
| **Apple Secure Enclave** | Integrated into Apple SoC (A-series / M-series) | Apple | Apple Pay |
| **Cloud-based SE (virtual)** | In the cloud (TSP servers) | TSP / wallet provider | Google Pay HCE approach (keys in cloud, LUKs on device) |

**What the SE stores for mobile payments:**
- Device-specific token (DPAN)
- Token cryptographic keys (used to generate per-transaction cryptograms)
- Application Transaction Counter (ATC)
- Payment applet (a JavaCard or Global Platform application)

**What the SE does NOT store:**
- The real PAN (that stays in the token vault at the TSP)
- Transaction history (stored by the wallet app and issuer, not the SE)
- Biometric data (stored separately -- in the Secure Enclave for Apple, in the TEE for Android)

### 5.2 Host Card Emulation (HCE)

Host Card Emulation, introduced in Android 4.4 KitKat (October 2013), was Google's breakthrough that eliminated the hardware SE dependency for NFC payments.

**How HCE works:**

Instead of routing NFC APDU commands to a hardware Secure Element, the Android NFC controller routes them to an application running on the phone's main processor (the "host"). The app software emulates a contactless card.

```
Traditional SE approach:
  NFC Controller --> Hardware Secure Element --> [DPAN + Cryptogram]

HCE approach:
  NFC Controller --> Android Host App (Google Pay) --> [LUK Token + Cryptogram]
                                                        ^
                                                        |
                                                  Token + LUK fetched
                                                  from cloud (TSP)
                                                  and cached on device
```

**The security challenge:** If the token and keys are in software (not tamper-resistant hardware), they are more vulnerable to extraction by malware. Google's solution:

1. **Limited-Use Keys (LUKs).** Instead of storing a permanent cryptographic key, Google Pay stores Limited-Use Keys that are valid for a limited number of transactions or a limited time window (typically 6 transactions or 24 hours, whichever comes first).

2. **Cloud replenishment.** When LUKs are exhausted, the device requests fresh LUKs from the TSP's cloud. This requires network connectivity.

3. **Device attestation.** Google's SafetyNet (now Play Integrity API) verifies the device hasn't been rooted or tampered with before replenishing tokens.

4. **TEE for biometrics.** While the payment credential isn't in a hardware SE, the biometric verification still happens in the Trusted Execution Environment (TEE).

### 5.3 Trusted Execution Environment (TEE)

A TEE is a secure area of the main processor that runs in isolation from the regular operating system. It is less secure than a dedicated SE chip (typically EAL 2-4 vs. EAL 5+), but more secure than the main OS.

| Property | Regular OS | TEE | Hardware SE |
|----------|-----------|-----|-------------|
| Runs on | Main CPU | Main CPU (isolated mode) | Dedicated chip |
| Isolation | None (shared memory) | Memory encryption, hardware isolation | Physically separate |
| Common Criteria | N/A | EAL 2-4 | EAL 5+ |
| Tamper resistance | None | Software-enforced | Physical tamper-resistant packaging |
| Used for | Apps, UI | Biometric matching, DRM, key storage | Payment credentials, SIM applets |

**TEE implementations:**
- **ARM TrustZone** -- Used by most Android phones (Samsung, Qualcomm, MediaTek). Divides the processor into a "Normal World" and a "Secure World."
- **Apple Secure Enclave** -- Apple's proprietary implementation. Technically a dedicated co-processor on the SoC, not a TrustZone partition. It has its own boot ROM, AES engine, and runs its own L4 microkernel (sepOS). It is closer to a hardware SE than a TEE.

### 5.4 Apple's Security Architecture: Secure Enclave + SE

Apple's approach is unique because it uses **both** a Secure Enclave (for biometrics and key management) **and** an embedded Secure Element (for payment credentials):

```
+------------------------------- Apple SoC (A-series chip) --------------------------+
|                                                                                     |
|  +------------------+     +-------------------+     +--------------------------+    |
|  | Application       |     | Secure Enclave    |     | Embedded SE (NXP chip)   |    |
|  | Processor (AP)    |     | (sepOS)           |     | (Java Card applet)       |    |
|  |                   |     |                   |     |                          |    |
|  | - Wallet app UI   |     | - Face ID / Touch |     | - DPAN storage           |    |
|  | - Transaction     |     |   ID matching     |     | - Token crypto keys      |    |
|  |   display         |     | - Key management  |     | - Cryptogram generation  |    |
|  | - Card selection   |     | - Auth state      |     | - ATC counter            |    |
|  |                   |     | - Random number   |     | - NFC card emulation     |    |
|  +------------------+     |   generation      |     |   applet                 |    |
|                            +-------------------+     +--------------------------+    |
|                                     |                          |                     |
|                                     | auth signal              | APDU commands       |
|                                     v                          v                     |
|                            +-------------------------------------------+             |
|                            |          NFC Controller                    |             |
|                            +-------------------------------------------+             |
|                                              |                                       |
+----------------------------------------------|--------------------------------------+
                                               |  13.56 MHz
                                               v
                                    +---------------------+
                                    |  POS Terminal       |
                                    +---------------------+
```

The Secure Enclave holds the biometric templates and manages authentication state. When the user authenticates (Face ID or Touch ID), the Secure Enclave sends an authorization signal to the embedded SE, which then enables the payment applet to respond to NFC APDU commands. Without the Secure Enclave's authorization, the SE will not generate a cryptogram.

---

## 6. Apple Pay Architecture

### 6.1 Provisioning: Adding a Card to Apple Pay

When a user adds a credit or debit card to Apple Pay, a complex provisioning flow called **ID&V (Identification & Verification)** takes place. This is not a simple card registration -- the card is tokenized, and the token is provisioned into the device's Secure Element.

**Step-by-step provisioning:**

1. **Card Data Capture.** The user opens the Wallet app and either scans the card with the camera (OCR extracts PAN, name, expiry) or enters the card details manually.

2. **Encryption and Transmission.** Apple encrypts the card data and sends it, along with device information (device ID, device certificate, device type) and Apple Account information, to the Apple Pay servers.

3. **Network Routing.** Apple's servers identify the card network from the BIN and forward the encrypted card data to the appropriate Token Service Provider (TSP):
   - Visa cards -> Visa Token Service (VTS)
   - Mastercard cards -> Mastercard Digital Enablement Service (MDES)
   - Amex cards -> American Express Token Service

4. **Issuer ID&V Decision.** The TSP contacts the card-issuing bank. The issuer decides whether to approve tokenization and what level of additional verification is required. The issuer's decision is based on:
   - Account standing (active, delinquent, frozen)
   - Fraud risk assessment (new device? unusual location?)
   - Card type eligibility
   - Available ID&V methods

   The issuer returns one of three responses:
   - **Green path:** Approved -- no additional verification needed (low risk)
   - **Yellow path:** Requires additional verification (most common)
   - **Red path:** Declined -- card cannot be tokenized

5. **Additional Verification (Yellow Path).** If required, the user must complete one of:
   - SMS or email one-time code
   - Push notification to the issuer's banking app
   - Phone call to the issuer's customer service
   - In-branch verification (rare)

6. **Token Generation.** Once verified, the TSP generates a Device PAN (DPAN) -- a unique token number that is mapped to the real PAN in the Token Vault. The DPAN has the same format as a real card number (13-19 digits, passes Luhn check) but falls in a dedicated token BIN range.

7. **Token Provisioning.** The DPAN, along with token cryptographic keys, is provisioned into the device's embedded Secure Element via a secure channel. The SE generates a unique key pair, and the token keys are bound to the specific SE hardware.

8. **Card Ready.** The card appears in the Wallet app with a virtual card image. The real PAN is never stored on the device, on Apple's servers, or in iCloud.

### 6.2 In-Store Transaction: "Sarah Pays $47.50 at Whole Foods"

**The scenario:** Sarah wants to buy groceries at Whole Foods. She has a Chase Visa card added to Apple Pay on her iPhone 15 Pro.

**Step 1: Initiation (T+0ms).** Sarah double-clicks the side button on her iPhone. The Wallet app opens, showing her default card (Chase Visa). The phone's NFC antenna is not yet active.

**Step 2: Authentication (T+200ms).** Sarah holds the phone up to her face. Face ID captures an infrared dot pattern of her face, and the Secure Enclave compares it against the enrolled template. Match confirmed. The Secure Enclave sends a cryptographic authorization token to the embedded SE, enabling the payment applet.

**Step 3: NFC Activation (T+500ms).** Sarah holds her iPhone near the Whole Foods payment terminal. The phone's NFC controller detects the terminal's 13.56 MHz field and activates Card Emulation mode.

**Step 4: PPSE and AID Selection (T+520ms).** The terminal sends SELECT PPSE. The SE responds with the available AID (Visa: A0000000031010). The terminal selects the Visa applet.

**Step 5: GPO Exchange (T+540ms).** The terminal sends GET PROCESSING OPTIONS with transaction data (amount: $47.50, currency: USD, country: US). The SE processes the request and returns AIP/AFL.

**Step 6: Data Read and Cryptogram Generation (T+560ms).** The terminal reads the necessary records and sends GENERATE AC. The SE computes an ARQC (Authorization Request Cryptogram) using:
- The DPAN
- The token cryptographic key
- The transaction amount ($47.50)
- The ATC (incremented)
- Terminal unpredictable number
- Transaction date and currency

**Step 7: NFC Data Transfer (T+580ms).** The complete payment data -- DPAN + cryptogram + ATC + expiry -- is transmitted to the terminal via NFC. Sarah's real Chase Visa PAN is never transmitted. The NFC interaction is complete. Sarah can pull her phone away.

**Step 8: Authorization Routing (T+600ms - T+2000ms).** The terminal sends the DPAN and cryptogram to the acquirer processor (e.g., Worldpay). The acquirer identifies the token BIN range and routes it to Visa's network (VisaNet).

**Step 9: Detokenization (T+2000ms - T+2200ms).** VisaNet's Token Service (VTS) looks up the DPAN in the Token Vault and:
- Maps the DPAN back to Sarah's real Chase Visa PAN
- Validates the cryptogram using the token key stored in the vault
- Verifies domain restrictions (this token is registered for in-store NFC on Sarah's specific iPhone)
- Replaces the DPAN with the real PAN in the authorization message

**Step 10: Issuer Authorization (T+2200ms - T+2800ms).** Chase receives a standard ISO 8583 authorization request with Sarah's real PAN, the transaction amount, and the validation result from VTS. Chase runs its standard authorization checks:
- Account active? Yes.
- Available credit? $47.50 is within limit.
- Fraud score? Low risk (known merchant, known location, verified cryptogram).
- Chase approves the transaction with response code 00 (approved).

**Step 11: Response Return (T+2800ms - T+3000ms).** The approval flows back: Chase -> VisaNet (re-tokenizes, replacing PAN with DPAN) -> Acquirer -> Terminal. The Whole Foods terminal displays "Approved" and Sarah's iPhone shows a checkmark with the amount. Haptic feedback confirms the payment.

**Total time from tap to approval: approximately 3 seconds.**

### 6.3 Express Transit Mode

Apple Pay supports an "Express Transit" mode that allows contactless payment at supported transit systems **without Face ID or Touch ID authentication**. This is a deliberate security tradeoff for convenience.

**How it works:**
- The user designates a card as their Express Transit card in Wallet settings
- When the phone's NFC controller detects a transit terminal (identified by a specific AID or terminal certificate), the SE generates a cryptogram without requiring biometric authentication
- This works even when the iPhone is locked, out of battery (Power Reserve mode on iPhone XS and later, which keeps the NFC chip powered for up to 5 hours after battery death), or in airplane mode

**Supported transit systems (selected):**
- London (TfL)
- New York (OMNY)
- Tokyo (Suica, PASMO)
- Beijing, Shanghai
- Sydney (Opal)
- Washington DC (SmarTrip)
- Portland (Hop Fastpass)
- Many more (30+ systems globally)

**Security implications:** Express Transit was the target of a notable security research paper in 2021 (discussed in Section 12), which demonstrated that the lack of biometric requirement could be exploited with a relay attack using specific Visa-protocol vulnerabilities.

### 6.4 In-App and Web Payments (Apple Pay JS)

Apple Pay works in Safari and within native iOS/macOS apps:

**In-App Flow:**
1. App presents Apple Pay button (using PassKit framework)
2. User confirms with Face ID / Touch ID
3. Apple Pay generates a payment token containing the DPAN + cryptogram
4. The encrypted token is passed to the app's server
5. The server sends the token to their payment processor (Stripe, Adyen, etc.)
6. The processor submits the token through the card network as a standard authorization

**Web Flow (Safari):**
1. Merchant website calls the Apple Pay JS API
2. Safari presents the Apple Pay payment sheet
3. User authenticates with Face ID / Touch ID (on iPhone or MacBook)
4. A payment token is returned to the merchant's JavaScript callback
5. Merchant's server processes the token via their payment processor

For web payments on a Mac without Touch ID, the user can authenticate using their iPhone or Apple Watch as a proxy (via Handoff/Bluetooth).

---

## 7. Google Pay / Google Wallet Architecture

### 7.1 The HCE Revolution

Google Pay's architecture is fundamentally different from Apple Pay because of Host Card Emulation (HCE). Instead of relying on a hardware Secure Element, Google Pay stores payment credentials in a software-based emulation layer, with keys managed in the cloud.

**Why HCE was necessary:** When Google launched Google Wallet in 2011, it used a hardware SE (NXP chip in the Nexus S). This gave carriers veto power -- AT&T, Verizon, and T-Mobile blocked Google Wallet because the SE was on the SIM or accessed through carrier-controlled interfaces. HCE, added to Android 4.4 KitKat, bypassed this entirely by routing NFC commands to a software application instead of hardware.

### 7.2 Google Pay's Cloud-Based Token Architecture

```
+------------------+        +-------------------+        +------------------+
|  Android Device  |        |  Google Cloud     |        |  TSP (VTS/MDES)  |
|                  |        |                   |        |                  |
|  Google Pay App  |<------>|  Google Pay       |<------>|  Token Vault     |
|  - UI            |  HTTPS |  Backend          |        |  - DPAN <-> PAN  |
|  - Card display  |        |  - Token store    |        |  - Key mgmt      |
|  - LUK cache     |        |  - LUK generation |        |  - Cryptogram    |
|                  |        |  - Device attest  |        |    validation    |
|  HCE Service     |        +-------------------+        +------------------+
|  - NFC emulation |
|  - Cryptogram gen|
|  - LUK usage     |
+--------+---------+
         |
         | NFC (Card Emulation)
         v
+------------------+
|  POS Terminal    |
+------------------+
```

**Token provisioning in Google Pay:**

1. User adds a card in the Google Pay / Google Wallet app
2. Google encrypts and sends the card data to the TSP (VTS or MDES)
3. The TSP contacts the issuer for ID&V (same flow as Apple Pay)
4. After approval, the TSP generates a DPAN and registers it in the Token Vault
5. Unlike Apple Pay, the DPAN and its master key are stored in Google's cloud servers, not on the device
6. Google generates a set of Limited-Use Keys (LUKs) derived from the master key
7. A batch of LUKs is downloaded to the device and cached in the Google Pay app

**During a transaction:**

1. The NFC controller routes APDU commands to Google Pay's HCE service
2. The HCE service uses a cached LUK to generate a transaction cryptogram
3. The DPAN + cryptogram are transmitted to the terminal
4. The terminal sends the auth request through the normal card network flow
5. The TSP validates the cryptogram using the master key in the Token Vault

**LUK replenishment:** When the device runs low on LUKs (or after a configured number of transactions/time window), it contacts Google's servers over HTTPS to fetch a fresh batch. This requires internet connectivity. If the device is offline and all LUKs are exhausted, the user cannot make NFC payments.

### 7.3 Transaction Flow: "Raj Pays INR 1,200 at a Shop in Bengaluru"

**The scenario:** Raj is buying electronics at a shop on MG Road in Bengaluru. He has an HDFC Visa debit card added to Google Pay on his Samsung Galaxy S24 (running Android 14).

**Step 1: Initiation.** Raj unlocks his phone and opens Google Wallet (or, on some devices, just holds the phone near the terminal with the screen on -- Google Pay can be triggered by NFC field detection without opening the app).

**Step 2: Authentication.** Raj's phone verifies his identity using the fingerprint sensor (processed in the TEE via ARM TrustZone). The Google Pay app confirms authentication.

**Step 3: NFC Activation.** Raj taps his phone against the merchant's PAX terminal. The NFC controller detects the terminal's RF field and routes incoming APDU commands to Google Pay's HCE service.

**Step 4: PPSE/AID Selection.** Standard EMV contactless negotiation -- terminal selects the Visa AID.

**Step 5: Cryptogram Generation.** The HCE service retrieves the cached LUK for Raj's HDFC Visa DPAN and generates a transaction cryptogram. The LUK usage counter is decremented.

**Step 6: NFC Transmission.** DPAN + cryptogram sent to terminal. The terminal and acquirer cannot distinguish this from a standard contactless Visa card.

**Step 7: Network Processing.** The acquirer routes the transaction through VisaNet. VTS detokenizes the DPAN to Raj's real HDFC Visa card number and validates the LUK-based cryptogram.

**Step 8: Issuer Authorization.** HDFC Bank receives the authorization request with Raj's real PAN. HDFC checks the debit account balance (INR 1,200 is available), runs fraud checks, and approves.

**Step 9: Response.** Approval flows back to the terminal. The shop's terminal prints a receipt. Raj's phone shows a confirmation notification.

### 7.4 Google Pay in India: UPI Integration

Google Pay in India operates very differently from the NFC wallet described above. In India, Google Pay is primarily a **UPI (Unified Payments Interface)** app, not an NFC wallet.

| Feature | Google Pay (Global) | Google Pay (India) |
|---------|--------------------|--------------------|
| Primary method | NFC tap-to-pay | UPI QR scan / VPA transfer |
| Technology | HCE + card tokens | UPI protocol (NPCI) |
| Network rails | Visa / Mastercard | UPI (bank-to-bank, real-time) |
| Authentication | Biometric + LUK | UPI PIN (set by user) |
| Transaction type | Card payment (deferred settlement) | Bank transfer (instant settlement) |
| Active users (India) | N/A for NFC | ~67 million monthly active |
| Market share | N/A | ~35% of UPI transactions |

India's Google Pay is one of the most successful fintech products in the world, processing billions of UPI transactions monthly. But it is fundamentally a different product from the NFC-based Google Wallet used in the US and Europe.

---

## 8. Samsung Pay and MST Technology

### 8.1 The LoopPay Acquisition

In February 2015, Samsung acquired LoopPay for approximately $250 million. LoopPay, founded by Will Graylin and George Wallner, had developed Magnetic Secure Transmission (MST) technology -- a system that could **inductively generate a magnetic field** that mimicked a card swipe.

This was Samsung's killer feature: while Apple Pay and Google Pay required NFC-enabled terminals (which, in 2015, were rare in the US), Samsung Pay could work at **any terminal with a magnetic stripe reader** -- which was virtually every terminal in the world.

### 8.2 How MST Works

```
Traditional Magnetic Stripe Swipe:
  Physical card  --->  [magnetic stripe drags across read head]  --->  Reader captures data

Samsung Pay MST:
  Phone antenna  --->  [induces magnetic field matching stripe data]  --->  Reader captures data
                       ^
                       |  Same electromagnetic pattern
                       |  as a physical card swipe
```

**Technical details:**

1. The Samsung phone contains a small induction coil (the MST antenna) near the bottom edge
2. When activated, the coil generates a localized magnetic field that replicates the data pattern of a magnetic stripe swipe
3. The terminal's magnetic stripe read head picks up this field and interprets it as a card swipe
4. The data transmitted is a tokenized card number with a dynamic cryptogram -- not the real PAN

**MST data format:** The MST transmission follows ISO/IEC 7813 Track 2 format:
```
;DPAN=EXPIRY1011CRYPTOGRAM?
```

Where:
- DPAN is the Samsung Pay token (device PAN)
- EXPIRY is the token expiry date
- 101 is a service code indicating token
- 1 is a padding digit
- CRYPTOGRAM is the dynamic security code

**Key limitations of MST:**
- Range: ~3 inches (7.5 cm) -- must be held very close to the read head
- One-shot: The MST transmission plays for about 3-5 seconds, then stops (must re-authenticate to retry)
- Tokenized: The data is still tokenized (not the real card data), so replay attacks are not viable
- Terminal-specific: Some terminals had read heads positioned in ways that made MST unreliable (e.g., dip-only terminals, recessed readers)

### 8.3 Samsung Pay Architecture

Samsung Pay used a three-layer security architecture:

| Layer | Component | Function |
|-------|-----------|----------|
| 1. Hardware | Samsung eSE (embedded Secure Element) | Stores tokens and cryptographic keys. Produced by Samsung Semiconductor or NXP. |
| 2. Software | Samsung Knox | Device integrity verification, container isolation, runtime protection. Kernel-level security platform. |
| 3. Biometric | Fingerprint / Iris / PIN | User authentication via TEE-protected biometric sensors |

**Token management:** Samsung Pay used a combined approach:
- For NFC transactions: similar to Apple Pay (token and keys in the eSE)
- For MST transactions: tokens stored in the eSE, with the eSE generating the one-time cryptogram that was transmitted via MST

### 8.4 The MST Sunset

**2021: MST Dropped.** Starting with the Samsung Galaxy S21 (February 2021), Samsung removed MST hardware from its phones. The reasons:

1. **NFC terminal adoption reached critical mass.** By 2020, over 80% of US merchant terminals were NFC-capable, largely driven by the EMV liability shift (October 2015) which prompted terminal upgrades.

2. **Cost and complexity.** The MST antenna added manufacturing cost and occupied valuable space inside increasingly thin phones.

3. **Security concerns.** While Samsung Pay MST was tokenized, the magnetic stripe ecosystem itself was inherently less secure than chip/NFC. Supporting a legacy technology sent mixed signals about security posture.

4. **Declining differentiation.** With NFC ubiquitous, MST was no longer a meaningful competitive advantage.

After the MST sunset, Samsung Pay became functionally similar to Google Pay -- an NFC-only wallet running on Samsung devices with Knox-secured credentials.

### 8.5 Samsung Pay's Current Position

Samsung Pay has struggled to maintain relevance:
- Declining user base (from ~100 million registered users peak to ~51 million active)
- Limited to Samsung devices (unlike Google Pay, which works on all Android phones)
- Samsung Rewards program (earning points for Samsung Pay transactions) was discontinued in some markets
- Some markets have transitioned Samsung Pay to Google Wallet integration

---

## 9. Token Service Providers and EMVCo

### 9.1 What is a Token Service Provider?

A Token Service Provider (TSP) is the entity that generates, manages, and validates payment tokens. In the mobile wallet context, TSPs are operated by the card networks themselves:

| TSP | Operator | Token Type |
|-----|----------|-----------|
| **VTS** (Visa Token Service) | Visa | Visa tokens (DPANs for Visa cards) |
| **MDES** (Mastercard Digital Enablement Service) | Mastercard | Mastercard tokens (DPANs for MC cards) |
| **Amex Token Service** | American Express | Amex tokens |

### 9.2 The Token Vault

The Token Vault is the secure database at the heart of the TSP. It maintains the mapping between:

```
Token (DPAN): 4000 0012 3456 7890  <--->  Real PAN (FPAN): 4532 0156 7890 1234
                                            ^
                                            |
                                         Mapping protected by HSMs
                                         (Hardware Security Modules)
```

**Token Vault contents for each provisioned token:**

| Field | Description |
|-------|-------------|
| Token (DPAN) | The substitute card number |
| FPAN | The real card number (Funding PAN) |
| Token Requestor ID | Identifies who requested the token (e.g., Apple, Google, Samsung) |
| Token Reference ID | Unique reference for the token lifecycle |
| Token Expiry | Expiration date of the token (may differ from card expiry) |
| Token Domain | Where the token is valid (in-store NFC, in-app, e-commerce) |
| Device ID / SE ID | Specific hardware the token is bound to |
| Token Status | Active, Suspended, Deactivated |
| Cryptographic Keys | Keys used to validate transaction cryptograms |

### 9.3 Token Lifecycle

Tokens are not permanent -- they have a full lifecycle:

| Event | What Happens |
|-------|-------------|
| **Provisioning** | Token created, keys generated, stored in SE/HCE, registered in Vault |
| **Activation** | Token becomes usable for transactions (after ID&V) |
| **Suspension** | Temporarily disabled (e.g., phone reported lost -- issuer suspends token) |
| **Resumption** | Re-enabled after suspension is resolved (e.g., phone found) |
| **Deactivation** | Permanently disabled (e.g., card cancelled, device wiped, user removes card from wallet) |
| **Token Update** | Card details change (new expiry, PAN change due to reissue) -- token is updated in vault without needing re-provisioning |

**This is a major advantage over physical cards.** If your physical card is reissued with a new number (e.g., after a fraud event), you must update every subscription and merchant on file. With a token, the TSP can update the FPAN-to-DPAN mapping in the vault, and the DPAN continues working without any change on the device.

### 9.4 Domain Restriction

Tokens are restricted to specific **domains** (also called "presentment modes"):

| Domain | Description | Security |
|--------|-------------|----------|
| **In-Store NFC** | Token valid only for contactless NFC at physical terminals | Bound to specific device SE; cryptogram required |
| **In-App** | Token valid only within specific mobile apps | Bound to Token Requestor app; device attestation required |
| **E-Commerce** | Token valid only for online card-not-present transactions | Merchant-specific tokens (used by Visa Click to Pay, MC SRC) |
| **IoT** | Token valid for IoT devices (wearables, cars) | Bound to specific IoT device hardware |

A token provisioned for Apple Pay NFC cannot be used for an e-commerce transaction. A token provisioned for a merchant's website cannot be used at a physical terminal. This domain restriction is enforced by the TSP during cryptogram validation.

### 9.5 EMVCo's Role

EMVCo (owned jointly by Visa, Mastercard, JCB, American Express, China UnionPay, and Discover) publishes the specifications that govern tokenization:

| Specification | Purpose |
|---------------|---------|
| **EMV Payment Tokenisation Specification** | Defines token format, lifecycle, and vault requirements |
| **EMV Contactless Specifications (Books A-D)** | Defines NFC payment communication protocols |
| **EMV 3-D Secure** | Authentication framework for e-commerce tokens |
| **EMV Secure Remote Commerce (SRC)** | Click-to-pay checkout using tokens |

EMVCo ensures interoperability: a Visa DPAN provisioned by Apple for Apple Pay in Australia will work at a Visa-accepting NFC terminal in Norway, because both follow the same EMVCo-defined token and contactless specifications.

### 9.6 Token BIN Ranges

Tokens use dedicated BIN (Bank Identification Number) ranges that are separate from real card BIN ranges. This allows processors and networks to quickly identify that a number is a token:

| Network | Token BIN Ranges (Examples) |
|---------|----------------------------|
| Visa | 4895 xxxx, 4936 xxxx, 4462 xxxx |
| Mastercard | 5204 xxxx, 5303 xxxx, 2221-2720 (token sub-ranges) |

When a processor sees a BIN in a known token range, it knows to route the transaction through the TSP for detokenization. Real PANs will never fall in these ranges; token BINs will never be assigned to real cards.

---

## 10. Step-by-Step Transaction Flows

### 10.1 In-Store NFC Transaction (Detailed Timing)

This section provides the complete end-to-end flow with timing breakdowns:

```
T+0ms       User authenticates (biometric)
T+200ms     NFC field detected by phone
T+220ms     SELECT PPSE -> response with AIDs
T+240ms     SELECT AID (Visa/MC) -> response
T+260ms     GET PROCESSING OPTIONS -> AIP/AFL
T+280ms     READ RECORD(s) -> application data
T+320ms     GENERATE AC -> cryptogram
T+350ms     NFC transmission complete (phone can be removed)
            ------- NFC PHASE COMPLETE (350ms) -------
T+400ms     Terminal constructs ISO 8583 0100 message
T+450ms     Message sent to acquirer processor
T+500ms     Acquirer identifies token BIN, routes to network
T+700ms     Network (VisaNet/Banknet) receives message
T+750ms     TSP detokenization (DPAN -> FPAN)
T+800ms     Cryptogram validation (HSM-based)
T+850ms     Forward to issuer with real FPAN
T+900ms     Issuer receives authorization request
T+1200ms    Issuer runs fraud scoring, balance check
T+1400ms    Issuer returns response (approve/decline)
T+1500ms    Network re-tokenizes response (FPAN -> DPAN)
T+1600ms    Response routed back to acquirer
T+1700ms    Acquirer forwards to terminal
T+1800ms    Terminal displays result
T+1900ms    Phone displays confirmation (haptic + visual)
            ------- TOTAL: ~2 seconds -------
```

### 10.2 ISO 8583 Message for a Mobile Wallet Transaction

The authorization message for a mobile wallet NFC transaction is nearly identical to a standard contactless card transaction, with a few key differences:

| Field (ISO 8583) | Standard Contactless Card | Mobile Wallet NFC |
|-------------------|--------------------------|-------------------|
| DE 2 -- PAN | Real card PAN | DPAN (token) |
| DE 22 -- POS Entry Mode | 07.1 (contactless chip) | 07.1 (contactless chip) -- same |
| DE 35 -- Track 2 Equivalent | Real card track 2 | Tokenized track 2 with DPAN |
| DE 48 -- Additional Data | -- | Token Requestor ID, token assurance level |
| DE 55 -- ICC Data | Chip cryptogram (ARQC) | Token cryptogram (ARQC from LUK or SE key) |
| DE 61 -- POS Data | Terminal capabilities | Terminal capabilities -- same |

From the acquirer's perspective, the message looks identical to a regular contactless card. The acquirer does not need to know it's a mobile wallet transaction -- the network handles detokenization transparently.

### 10.3 In-App Payment Flow

When a user pays within a mobile app (e.g., ordering via the Starbucks app, Uber, or an e-commerce app):

**Step 1: App Request.** The app calls the wallet SDK:
- iOS: PassKit framework (`PKPaymentAuthorizationViewController`)
- Android: Google Pay API (`PaymentsClient.loadPaymentData()`)

**Step 2: Payment Sheet.** The OS presents a system-level payment sheet showing the card, amount, and merchant name. The user authenticates with biometrics.

**Step 3: Token Generation.** The wallet generates a payment token:
- Apple Pay: The SE generates a cryptogram using the DPAN and in-app domain keys
- Google Pay: The HCE layer generates a cryptogram using a LUK designated for in-app transactions

**Step 4: Token Delivery.** The encrypted payment token is returned to the app via the SDK callback. The token contains:
- DPAN (encrypted)
- Cryptogram
- Transaction amount
- Token expiry

**Step 5: Server Processing.** The app sends the token to its backend server. The server decrypts the token (or passes it to their payment processor -- Stripe, Adyen, Braintree).

**Step 6: Network Authorization.** The payment processor submits the DPAN + cryptogram to the card network. The TSP detokenizes and validates. The issuer authorizes.

**Key difference from NFC:** In-app tokens use a different domain restriction. The token is bound to a specific Token Requestor (the app/merchant) rather than a physical device-terminal interaction.

### 10.4 Web Payment Flow (Safari / Chrome)

For web payments, mobile wallets use browser-based APIs:

| Wallet | Web API | Browser Support |
|--------|---------|-----------------|
| Apple Pay | Apple Pay JS / Payment Request API | Safari only (desktop + mobile) |
| Google Pay | Google Pay API / Payment Request API | Chrome, Safari, Firefox, Edge |

**The flow:**

1. Merchant website includes the wallet's JavaScript SDK
2. User clicks "Pay with Apple Pay" or "Pay with Google Pay" button
3. Browser presents a payment sheet (controlled by the OS, not the website)
4. User selects card and authenticates (Face ID, fingerprint, or device lock)
5. Browser returns an encrypted payment token to the merchant's JavaScript callback
6. Merchant's server sends the token to their payment processor
7. Standard network authorization follows

**Security note:** The payment sheet is rendered by the operating system, not the website. This prevents phishing -- a malicious website cannot create a fake payment sheet to steal credentials. The token is generated only after OS-level authentication and is encrypted so the merchant's JavaScript cannot read the raw card details.

---

## 11. Economics and Fee Structure

### 11.1 How Apple Pay Makes Money

Apple's revenue from Apple Pay comes from a share of the interchange fee paid by the merchant. Apple negotiated this directly with the card networks and major issuers before launch.

**Apple Pay fee structure:**

| Region | Apple's Fee | Source |
|--------|------------|--------|
| United States | 0.15% of credit card transaction value | Deducted from issuer's interchange revenue |
| United States (debit) | Flat $0.005 per transaction | Deducted from issuer's interchange revenue |
| United Kingdom / EU | ~0.05% (estimated) | Lower due to EU interchange caps |
| China | Negotiated separately with UnionPay | Not publicly disclosed |
| Other markets | Generally 0.05% - 0.15% | Varies by issuer negotiation |

**Example calculation for "Sarah's $47.50 at Whole Foods":**

```
Transaction amount:                      $47.50
Interchange fee (Visa credit, grocery):  ~1.45%  = $0.69
  -> of which Apple receives:            0.15%   = $0.07
  -> Issuer (Chase) keeps remainder:     ~1.30%  = $0.62
Network assessment fee (Visa):           ~0.14%  = $0.07
Acquirer markup:                         ~0.30%  = $0.14
                                                   ------
Total merchant fee (MDR):                ~1.89%  = $0.90
Merchant (Whole Foods) receives:                   $46.60
```

Apple earns approximately $0.07 per $47.50 transaction. This sounds tiny, but at scale: with an estimated 9+ billion Apple Pay transactions annually (2025), Apple Pay generates an estimated **$1.5-2 billion** in annual revenue. Apple does not disclose the exact figure; it's included in the "Services" segment of their earnings.

### 11.2 How Google Pay Makes Money: $0 From Interchange

Google does **not** charge banks any fee for Google Pay NFC transactions. Zero. This was a deliberate strategic decision.

**Why does Google give away Google Pay for free?**

1. **Data value.** Transaction data (anonymized and aggregated) helps Google's advertising business. Knowing purchase patterns improves ad targeting. (Google states it does not use Google Pay transaction data for ad targeting, but the infrastructure capability exists.)

2. **Android ecosystem lock-in.** Google Pay is a reason to stay in the Android ecosystem. Users who have set up payment cards, transit passes, boarding passes, and loyalty cards in Google Wallet are less likely to switch to iPhone.

3. **Commerce enablement.** Google Pay on the web drives transactions through Google's properties (Search, Shopping, YouTube). Google earns revenue from merchant advertising, not from payment processing.

4. **Google Pay in India (UPI).** In India, Google Pay generates revenue from merchant payments (Google charges small fees to large merchants for UPI transactions above certain volumes) and financial product referrals.

### 11.3 Samsung Pay Revenue Model

Samsung Pay's monetization evolved over time:

| Phase | Model | Details |
|-------|-------|---------|
| **2015-2019** | Samsung Rewards | Users earned points for every Samsung Pay transaction, redeemable for Samsung products. Samsung subsidized this from marketing budgets. |
| **2019-2021** | Samsung Pay Card (Debit) | Partnership with SoFi to offer a Samsung Pay-branded debit card. Revenue from interchange on the co-branded card. |
| **2021-2023** | Declining focus | Samsung Rewards scaled back. Samsung Money by SoFi discontinued. Samsung Pay increasingly integrated with Google Wallet in some markets. |
| **2024+** | Partnership model | Samsung has partially ceded the wallet experience to Google Wallet on Samsung Galaxy devices in several markets. |

### 11.4 Why Banks Agreed to Pay Apple

When Apple Pay launched in 2014, the question was: why would banks voluntarily give up 15 basis points of their interchange revenue to Apple?

**The issuer's calculation:**

| Factor | Impact |
|--------|--------|
| **Reduced fraud** | Mobile wallet transactions have dramatically lower fraud rates (0.01% vs 0.12% for card-present). Lower fraud = lower losses + fewer chargeback costs. |
| **Increased card usage** | Apple Pay makes it easier to pay, increasing transaction frequency and volume ("top-of-wallet" effect). |
| **Premium cardholder retention** | iPhone users skew affluent. Banks compete fiercely for these customers. Supporting Apple Pay is table stakes. |
| **Operational savings** | Fewer physical card replacements (lost/stolen cards still work as Apple Pay tokens). Reduced call center volume for card inquiries. |
| **Fear of disintermediation** | Banks feared that if they didn't cooperate, Apple might build a payment network that bypassed them entirely (as Apple Card later partially did with Goldman Sachs). |

The consensus among banking executives: the 15 basis points is more than offset by fraud reduction, increased usage, and the competitive risk of not supporting Apple Pay.

---

## 12. Security and Fraud Prevention

### 12.1 Threat Model

Mobile wallet security must defend against multiple attack vectors:

| Threat | Description | Mitigation |
|--------|-------------|-----------|
| **Lost/Stolen Device** | Attacker has physical access to the phone | Biometric lock + Secure Element key binding. Without Face ID / fingerprint, the SE won't generate cryptograms. Remote wipe via Find My iPhone / Find My Device. |
| **Malware on Device** | App-level malware tries to extract payment credentials | SE is hardware-isolated from the OS. Even root-level malware cannot read SE contents. HCE (Android) has more exposure -- mitigated by LUKs and device attestation. |
| **NFC Relay Attack** | Attacker relays NFC signals from victim's phone to a terminal far away | Timing constraints (NFC has ~500ms window), transaction-specific cryptograms, and distance bounding (research stage). |
| **Network Interception** | Attacker captures NFC transmission between phone and terminal | Captured data contains a one-time cryptogram that cannot be replayed. The DPAN without a valid cryptogram is useless. |
| **Token Theft** | Attacker extracts DPAN from a compromised system | DPAN is domain-restricted. A DPAN for NFC won't work online. Cryptogram validation requires keys in the TSP vault. |
| **Social Engineering** | Attacker tricks user into adding their card to attacker's device | ID&V process requires the real cardholder to verify (SMS code, bank app push). Issuer's fraud scoring evaluates provisioning requests. |

### 12.2 Fraud Rate Comparison

Mobile wallet payments have significantly lower fraud rates than other payment methods:

| Payment Method | Fraud Rate (approx., US 2024) |
|----------------|------------------------------|
| Magnetic stripe (swipe) | 12.0 basis points (0.12%) |
| EMV chip (insert) | 3.0 basis points (0.03%) |
| Contactless card (tap) | 2.5 basis points (0.025%) |
| Mobile wallet NFC (Apple Pay / Google Pay) | 1.0 basis point (0.01%) |
| Card-not-present (e-commerce, no 3DS) | 18.0 basis points (0.18%) |
| Card-not-present (e-commerce, with 3DS2) | 6.0 basis points (0.06%) |

**Why mobile wallets have the lowest fraud:** The combination of tokenization (PAN never exposed), dynamic cryptograms (can't replay), biometric authentication (strong cardholder verification), and device binding (token works only on one specific phone) creates a layered defense that is extremely difficult to attack.

### 12.3 The Express Transit Vulnerability (2021)

In September 2021, researchers from the University of Birmingham and University of Surrey published a paper demonstrating a vulnerability in Apple Pay's Express Transit mode when used with Visa cards.

**The attack:**
1. Express Transit mode allows payment without Face ID / Touch ID authentication
2. The attack used a modified Proxmark NFC device to emulate a transit terminal
3. By replaying specific magic bytes that identify a transit terminal to the phone, the researchers could trigger Express Transit mode
4. The phone's SE generated a cryptogram without biometric authentication
5. Using a relay setup, the cryptogram was forwarded to a real payment terminal elsewhere
6. The transaction was authorized because:
   - Visa's network did not verify that the cryptogram was generated in a transit context
   - The terminal type in the authorization message did not match the transit domain
   - The Visa protocol permitted this mismatch

**Impact:** The researchers demonstrated unauthorized payments of up to GBP 1,000 on locked iPhones.

**Responses:**
- **Visa** stated that the attack was impractical at scale and that their fraud detection systems would catch such transactions
- **Apple** stated that this was a Visa network issue, not an Apple Pay issue, because the Visa protocol did not enforce domain restrictions at the network level
- **Mastercard** was not vulnerable because its protocol performs additional cryptographic checks that verify the terminal type matches the token domain
- No known real-world exploitation occurred

**Lessons:** This incident highlighted the tension between convenience (Express Transit) and security, and the importance of end-to-end domain restriction enforcement -- not just at the device level, but throughout the entire network path.

### 12.4 Biometric Authentication Comparison

| Biometric | Used By | FAR (False Accept Rate) | Spoofing Difficulty |
|-----------|---------|------------------------|---------------------|
| Touch ID (Capacitive Fingerprint) | Apple (older), Samsung, most Android | 1 in 50,000 | Moderate -- can be spoofed with high-quality fingerprint molds |
| Face ID (TrueDepth 3D) | Apple (iPhone X+) | 1 in 1,000,000 | Very difficult -- 3D depth mapping defeats photos and most masks |
| Ultrasonic Fingerprint | Samsung Galaxy S series | 1 in 50,000 (estimated) | Difficult -- reads 3D fingerprint ridges under the screen |
| Iris Scan | Samsung (Galaxy S8/S9 era, discontinued) | 1 in 1,000,000+ | Difficult, but Samsung discontinued it in favor of fingerprint |

### 12.5 PCI DSS Implications

The PCI DSS (Payment Card Industry Data Security Standard) has specific implications for mobile wallets:

**For merchants:** Mobile wallet payments reduce PCI scope. The merchant's terminal never receives the real PAN -- only the DPAN. If a merchant's terminal is compromised, the attacker only gets DPANs and one-time cryptograms, both of which are useless for fraud.

**For wallet providers:** Apple, Google, and Samsung must comply with PCI DSS as Token Requestors. They handle cardholder data during provisioning (when the user enters their card number). Their servers, apps, and provisioning APIs are within PCI scope.

**For TSPs:** VTS and MDES operate the Token Vaults, which are PCI DSS Level 1 compliant environments protected by HSMs (Hardware Security Modules), strict access controls, and continuous monitoring.

---

## 13. Regulation and Compliance

### 13.1 EU Digital Markets Act (DMA) -- Apple NFC Opening

The most significant regulatory development affecting mobile wallets is the EU's **Digital Markets Act (DMA)**, which designated Apple as a "gatekeeper" in 2023.

**The issue:** Since Apple Pay's launch, Apple had exclusive control over the iPhone's NFC chip for payment purposes. No third-party wallet (bank app, Google Pay, Samsung Pay) could use NFC tap-to-pay on iPhone. Apple argued this was for security. Regulators and competitors argued it was anti-competitive.

**Timeline:**
- **2020:** European Commission began investigating Apple's NFC restriction
- **2022, July:** EC issued a Statement of Objections, alleging Apple abused its dominant position
- **2023, September:** DMA designated Apple as a gatekeeper for iOS
- **2024, March:** DMA compliance deadline. Apple announced it would open NFC access to third-party apps in the European Economic Area (EEA)
- **2024, August:** Apple released iOS 17.4 with the NFC and SE APIs for third-party developers in the EU
- **2025:** Banks including ING, BNP Paribas, and Deutsche Bank began testing their own NFC payment apps on iPhone in the EU

**What changed:**
- Third-party apps can now access the Secure Element on iPhone for contactless payments
- Banks can build their own wallet apps that tap-to-pay without going through Apple Pay
- Apple charges a small licensing fee for SE access (reportedly ~0.05%), which the EU is monitoring

**Global impact:** The EU precedent is pressuring Apple to open NFC in other jurisdictions. Japan, South Korea, Brazil, and India are considering similar regulations. Australia's ACCC investigated and reached a voluntary agreement with Apple in 2024. The US DOJ's antitrust case against Apple (filed March 2024) also cites NFC restrictions.

### 13.2 PSD2 and Strong Customer Authentication (SCA)

The EU's **Payment Services Directive 2 (PSD2)**, specifically its Strong Customer Authentication (SCA) requirement, mandates that electronic payments use at least two of three authentication factors:

| Factor | Category | Example in Mobile Wallet |
|--------|----------|------------------------|
| Something you **know** | Knowledge | Device PIN / passcode |
| Something you **have** | Possession | The phone itself (with its unique SE and provisioned token) |
| Something you **are** | Inherence | Face ID, fingerprint |

**Mobile wallets are inherently SCA-compliant.** A typical Apple Pay transaction uses:
1. **Possession:** The iPhone with its unique Secure Element
2. **Inherence:** Face ID (biometric authentication)

This is why mobile wallet payments in the EU do not trigger the additional SCA challenge step that e-commerce card transactions (3D Secure) require. The biometric + device combination satisfies PSD2 SCA natively.

### 13.3 US Regulatory Landscape

The United States has no equivalent of PSD2 or the DMA for mobile wallets. Regulation is fragmented:

| Regulator | Jurisdiction | Relevant Rules |
|-----------|-------------|----------------|
| **OCC** (Office of the Comptroller) | National banks | Supervision of bank-issued tokens and wallet partnerships |
| **CFPB** (Consumer Financial Protection Bureau) | Consumer protection | Investigative authority over "larger participant" wallet providers; proposed "digital wallet" supervision rule (2024) |
| **DOJ Antitrust** | Competition | Antitrust case against Apple (March 2024) cites NFC restrictions |
| **FTC** | Consumer protection, competition | Monitors mobile wallet data practices and marketing |
| **State regulators** | State-level money transmission | Some states classify certain wallet features (stored value) as money transmission, requiring licenses |

The CFPB under the Biden administration proposed treating large mobile wallet providers (Apple, Google) as supervisory subjects under larger-participant rules. This would give the CFPB examination authority similar to what it has over large banks. The rule was proposed in November 2024; its status under subsequent administrations remains uncertain.

### 13.4 RBI Tokenization Mandate (India)

In September 2021, the **Reserve Bank of India (RBI)** mandated that no entity in the card transaction chain (merchant, acquirer, payment aggregator) could store actual card data. All stored-on-file card credentials must be tokenized.

**Impact on mobile wallets:**
- Card-on-file tokenization is distinct from mobile wallet tokenization, but both use the same TSP infrastructure (VTS, MDES)
- Google Pay in India (UPI-based) was largely unaffected since UPI does not use card tokens
- Visa and Mastercard had to rapidly scale their TSP capacity for the Indian market (1.5+ billion cards)
- The mandate accelerated India's adoption of network-level tokenization, making it one of the most tokenized markets globally

### 13.5 GDPR and Data Privacy

Mobile wallets process personal data (card numbers, biometric data, transaction metadata) and are subject to GDPR in the EU:

| Data Type | GDPR Classification | Wallet Handling |
|-----------|---------------------|----------------|
| Biometric (Face ID, fingerprint) | Special category data (Art. 9) | Processed entirely on-device (never sent to servers) -- not in scope of server-side GDPR |
| Card PAN | Personal data | Transmitted during provisioning only, then replaced by token |
| Transaction data | Personal data | Apple claims it doesn't store; Google anonymizes and aggregates; Samsung processes per their privacy policy |
| Device identifiers | Personal data | Used for token binding and fraud prevention |

Apple's privacy-centric approach (no server-side transaction storage) is a competitive advantage in GDPR-conscious markets.

---

## 14. Comparisons: Apple Pay vs Google Pay vs Samsung Pay

### 14.1 Architecture Comparison

| Feature | Apple Pay | Google Pay | Samsung Pay |
|---------|-----------|-----------|-------------|
| **NFC Payment** | Yes | Yes | Yes (NFC only since 2021) |
| **MST Payment** | No | No | No (removed 2021; was 2015-2021) |
| **Secure Element** | Apple Secure Enclave + eSE | No (HCE -- software emulation) | Samsung eSE (embedded) |
| **Token Storage** | Device SE (on-device) | Cloud (LUKs cached on device) | Device eSE (on-device) |
| **Offline Payments** | Yes (SE has keys locally) | Limited (needs LUKs; no replenishment offline) | Yes (SE has keys locally) |
| **Biometric Auth** | Face ID / Touch ID | Fingerprint / Face Unlock | Fingerprint / Face / Iris (legacy) |
| **Express Transit** | Yes (no auth at transit gates) | Yes (limited markets) | No |
| **Web Payments** | Safari only (Apple Pay JS) | Chrome + most browsers | Limited |
| **In-App Payments** | iOS / macOS apps | Android + web | Samsung apps |
| **Default Wallet Control** | Apple (cannot change default NFC wallet) | User can change default NFC app | Samsung (pre-installed, default on Samsung phones) |

### 14.2 Device and Platform Support

| Wallet | Devices | OS Requirement |
|--------|---------|---------------|
| Apple Pay | iPhone 6+, Apple Watch, iPad, Mac (Touch ID/T2+) | iOS 8.1+ (originally); iOS 17+ for latest features |
| Google Pay / Wallet | Any Android phone with NFC (Pixel, Samsung, OnePlus, etc.) | Android 5.0+ (Lollipop); Android 9+ for latest features |
| Samsung Pay | Samsung Galaxy phones only (S6+, A series, Note series) | Samsung phones only; Wear OS on Galaxy Watch |

### 14.3 Transit Support Comparison

| Transit System | Apple Pay | Google Pay | Samsung Pay |
|----------------|-----------|-----------|-------------|
| London (TfL) | Express Transit | Yes | No |
| New York (OMNY) | Express Transit | Yes | Limited |
| Tokyo (Suica/PASMO) | Express Transit | Yes (FeliCa phones) | No |
| Singapore (SimplyGo) | Yes | Yes | Yes |
| Sydney (Opal) | Express Transit | Yes | No |
| Moscow Metro | No (suspended 2022) | No (suspended 2022) | No |
| Beijing / Shanghai | Express Transit | Limited | No |

### 14.4 P2P and Beyond-Payments Features

| Feature | Apple Pay | Google Pay | Samsung Pay |
|---------|-----------|-----------|-------------|
| **P2P Transfers** | Apple Pay Cash (US) | Google Pay Send (via UPI in India, P2P in US) | Samsung Pay Cash (limited) |
| **ID / Driver's License** | Yes (select US states) | Yes (select US states) | No |
| **Boarding Passes** | Yes (Wallet) | Yes (Google Wallet) | Yes (Samsung Wallet) |
| **Event Tickets** | Yes (Wallet) | Yes (Google Wallet) | Yes (Samsung Wallet) |
| **Loyalty Cards** | Yes (Wallet) | Yes (Google Wallet) | Yes (Samsung Wallet) |
| **Car Keys** | Yes (BMW, Hyundai, etc.) | Yes (limited) | Yes (limited) |
| **Hotel Keys** | Yes (Hyatt, Hilton) | Yes (limited) | No |
| **Vaccination Records** | Yes (SMART Health Cards) | Yes | Yes |

### 14.5 Market Position Summary

```
+----------------+-------------------+-------------------+-------------------+
|                |   Apple Pay       |   Google Pay      |   Samsung Pay     |
+----------------+-------------------+-------------------+-------------------+
| Strategy       | Premium ecosystem | Open ecosystem    | Device loyalty    |
|                | control + fee     | data value + ads  | MST diff (ended)  |
+----------------+-------------------+-------------------+-------------------+
| Strength       | Best UX, highest  | Cross-device,     | MST legacy,       |
|                | security, brand   | no bank fees,     | Knox security     |
|                | trust             | India dominance   |                   |
+----------------+-------------------+-------------------+-------------------+
| Weakness       | iOS only, closed  | HCE offline limit,| Samsung-only,     |
|                | NFC (easing per   | Android fragmen-  | declining share,  |
|                | DMA)              | tation            | losing to GWallet |
+----------------+-------------------+-------------------+-------------------+
| Revenue        | ~0.15% from banks | $0 from payments  | Rewards (ended),  |
|                | (~$1.5-2B/yr)     | (data/ads value)  | partnerships      |
+----------------+-------------------+-------------------+-------------------+
```

---

## 15. Modern Developments and Future

### 15.1 Tap to Pay on iPhone (Phone-as-Terminal)

In February 2022, Apple announced **Tap to Pay on iPhone**, which turns any iPhone into a payment terminal. Instead of using NFC in Card Emulation mode (pretending to be a card), the iPhone uses NFC in **Reader mode** (pretending to be a terminal).

**How it works:**
1. A merchant using a compatible payment app (Stripe, Square, Adyen, etc.) opens the app on their iPhone
2. The app activates the NFC reader mode
3. The customer taps their card, phone, or watch
4. The iPhone reads the contactless payment data
5. The payment app processes the transaction through the acquirer

**Technical requirements:**
- iPhone XS or later
- iOS 15.4 or later
- Payment app must be certified by Apple and use the ProximityReader framework
- Uses the same EMV contactless specifications as a traditional terminal

**Impact:** This disrupts the traditional POS terminal market (Verifone, Ingenico). Small merchants can now accept contactless payments with no additional hardware -- just their iPhone.

**Google's response:** Google launched **Tap to Pay on Android** (initially for Pixel phones, expanding to other Android devices) in 2023, with similar functionality using the NFC reader mode.

### 15.2 Ultra-Wideband (UWB) Payments

Ultra-Wideband (UWB) is a radio technology that enables precise distance measurement (accuracy within 10-30 cm) and is being explored as a next-generation payment initiation method.

**How UWB could change payments:**
- UWB can determine the exact distance between a phone and a terminal
- This enables "identity payments" -- walk up, be identified, walk away. No tap, no phone interaction.
- BMW already uses UWB for digital car keys on iPhone
- Apple's U1/U2 chips and Samsung's UWB chips support this technology

**Challenges:** Privacy concerns (constant ranging), battery drain, lack of standardized payment protocol, and the "creepy factor" of automatic payments without explicit user action.

### 15.3 Digital Identity Convergence

Mobile wallets are evolving from payment containers to **digital identity platforms**:

| Credential | Apple Wallet | Google Wallet |
|-----------|-------------|---------------|
| Driver's license | Arizona, Maryland, Colorado, Georgia, Ohio, + more | Arizona, Maryland, Colorado, + more |
| State ID | Same states as DL | Same states as DL |
| Student ID | Participating universities | Participating universities |
| Corporate badge | Select companies (Apple, Google campuses) | Select companies |
| Car key | BMW, Hyundai, Kia, Genesis, BYD | BMW, select others |
| Home key (smart locks) | Matter-compatible locks | Matter-compatible locks |
| Insurance card | Select insurers | Select insurers |

**The ISO 18013-5 standard** (mDL -- Mobile Driver's License) defines how a digital driver's license can be presented from a mobile device to a verifier (e.g., TSA agent, police officer, age-restricted retailer) using NFC or Bluetooth. Apple and Google both support this standard.

**Privacy advantage:** Unlike showing a physical ID (which exposes your name, address, date of birth, and photo all at once), mDL supports **selective disclosure** -- you can prove you're over 21 without revealing your exact date of birth or address.

### 15.4 CBDC Integration

Central Bank Digital Currencies (CBDCs) could potentially be distributed through mobile wallets:

**China's e-CNY (Digital Yuan):** Already integrates with WeChat Pay and Alipay. Users can hold e-CNY in their existing wallet apps. This is the most advanced CBDC wallet integration globally.

**EU Digital Euro (in development):** The ECB has stated that the Digital Euro should be accessible through existing banking apps and potentially through third-party wallets. Apple Pay and Google Pay integration has been discussed but not confirmed.

**Potential architecture:**
```
Current mobile wallet flow:
  Wallet -> Token -> Card Network -> Issuer (commercial bank)

Future CBDC wallet flow:
  Wallet -> CBDC Credential -> CBDC Ledger -> Central Bank
```

CBDCs could bypass the card network entirely, which is why Visa and Mastercard are actively positioning themselves as potential CBDC infrastructure providers.

### 15.5 Open-Loop Transit Expansion

Open-loop transit (using a regular contactless card or mobile wallet to ride public transit, instead of a proprietary transit card) is expanding rapidly:

**Key deployments:**
- London (TfL): Pioneer since 2014. Over 50% of Underground trips now use contactless/mobile wallet
- New York (OMNY): Full system rollout completed 2024
- Singapore (SimplyGo): Nationwide since 2023
- Sydney (Opal): Contactless accepted on all modes
- 600+ transit systems worldwide now accept open-loop contactless

**Mobile wallet advantages for transit:**
- Express Transit mode (Apple Pay) eliminates the biometric step at turnstiles -- critical for throughput
- Automatic fare capping (TfL-style daily/weekly caps applied to the DPAN)
- Multi-modal journey aggregation (bus + rail + bike share on one token)

### 15.6 Wallet Interoperability and Super-Apps

The future may see wallets expand into comprehensive digital identity and financial platforms:

- **India's approach:** Google Pay and PhonePe already function as super-apps in India (UPI payments, bill pay, investments, insurance, loans)
- **China's model:** WeChat Pay and Alipay bundle payments, social media, e-commerce, government services, and more
- **Western markets:** Apple and Google are cautiously adding non-payment features (IDs, keys, tickets) while avoiding the super-app model

### 15.7 Biometric Payment Cards

A parallel development: biometric-enabled physical cards that include a fingerprint sensor on the card itself. These combine the security of biometric authentication with the universality of a plastic card. Thales, IDEMIA, and Fingerprint Cards (FPC) are leading vendors. Several banks (BNP Paribas, NatWest) have piloted them. If successful, they could reduce the mobile wallet's security advantage.

---

## Appendix

### A. Terminology Glossary

| Term | Definition |
|------|-----------|
| **AID** | Application Identifier -- hex string identifying a payment application (e.g., A0000000031010 for Visa) |
| **APDU** | Application Protocol Data Unit -- the command/response format for smartcard communication |
| **ARQC** | Authorization Request Cryptogram -- dynamic cryptogram generated by chip/SE for each transaction |
| **ATC** | Application Transaction Counter -- increments with each transaction, prevents replay attacks |
| **CBDC** | Central Bank Digital Currency -- digital fiat currency issued by a central bank |
| **CDCVM** | Consumer Device Cardholder Verification Method -- on-device biometric verification |
| **CVM** | Cardholder Verification Method -- how the payer proves identity (PIN, signature, biometric) |
| **DAN** | Device Account Number -- Apple's term for DPAN |
| **DMA** | Digital Markets Act -- EU regulation targeting gatekeeper platforms |
| **DPAN** | Device Primary Account Number -- the token stored on a device, substituting for the real PAN |
| **EMVCo** | Standards body for chip card and token specifications (owned by Visa, MC, Amex, JCB, UnionPay, Discover) |
| **eSE** | Embedded Secure Element -- SE chip soldered to the phone motherboard |
| **FPAN** | Funding Primary Account Number -- the real card number (as opposed to the token DPAN) |
| **GPO** | GET PROCESSING OPTIONS -- APDU command initiating an EMV transaction |
| **HCE** | Host Card Emulation -- software-based NFC card emulation on Android (no hardware SE required) |
| **HSM** | Hardware Security Module -- tamper-resistant hardware for cryptographic key management |
| **ID&V** | Identification and Verification -- the process by which an issuer approves a card for tokenization |
| **LUK** | Limited-Use Key -- short-lived cryptographic key used by Google Pay HCE for generating cryptograms |
| **MDES** | Mastercard Digital Enablement Service -- Mastercard's Token Service Provider |
| **MST** | Magnetic Secure Transmission -- Samsung's technology for emulating magnetic stripe swipes |
| **NFC** | Near Field Communication -- short-range (0-4 cm) wireless communication at 13.56 MHz |
| **PAN** | Primary Account Number -- the full card number (13-19 digits) |
| **PPSE** | Proximity Payment System Environment -- the application selected first during NFC payment negotiation |
| **SCA** | Strong Customer Authentication -- PSD2 requirement for two-factor authentication on payments |
| **SE** | Secure Element -- tamper-resistant hardware chip for storing cryptographic keys and credentials |
| **TEE** | Trusted Execution Environment -- isolated execution environment on the main processor |
| **TSP** | Token Service Provider -- entity that generates, manages, and validates payment tokens |
| **UICC** | Universal Integrated Circuit Card -- the smartcard in a SIM card |
| **UPI** | Unified Payments Interface -- India's real-time bank-to-bank payment system |
| **UWB** | Ultra-Wideband -- radio technology for precise distance measurement |
| **VTS** | Visa Token Service -- Visa's Token Service Provider |

### B. APDU Command Quick Reference

| Command | CLA | INS | P1 | P2 | Description |
|---------|-----|-----|----|----|-------------|
| SELECT (PPSE) | 00 | A4 | 04 | 00 | Select Proximity Payment System Environment |
| SELECT (AID) | 00 | A4 | 04 | 00 | Select payment application by AID |
| GPO | 80 | A8 | 00 | 00 | Get Processing Options -- initiate transaction |
| READ RECORD | 00 | B2 | rec# | SFI | Read application data record |
| GENERATE AC | 80 | AE | ref | 00 | Generate Application Cryptogram (ARQC/TC/AAC) |
| GET DATA | 80 | CA | tag | tag | Retrieve specific data object |
| COMPUTE CC | 80 | 2A | 8E | 80 | Compute Cryptographic Checksum (MC-specific) |

### C. NFC Payment AID Reference

| AID (Hex) | Network | Application |
|-----------|---------|-------------|
| A0000000031010 | Visa | Visa Credit/Debit (VCPS) |
| A0000000032010 | Visa | Visa Electron |
| A0000000041010 | Mastercard | Mastercard Credit/Debit (M/Chip) |
| A0000000042010 | Mastercard | Mastercard Maestro |
| A00000002501 | American Express | Amex Contactless |
| A0000003241010 | Discover | Discover Contactless |
| A0000000651010 | JCB | JCB Contactless |
| A0000003330101 | UnionPay | UnionPay Debit |
| D3760000002501 | FeliCa | FeliCa (Japan transit/payment) |

### D. Diagrams Index

| Diagram | File | Section |
|---------|------|---------|
| NFC Physical Layer | `diagrams/nfc-physical-layer.mmd` | 4 |
| Secure Element Architecture | `diagrams/secure-element-architecture.mmd` | 5 |
| Apple Pay Provisioning | `diagrams/apple-pay-provisioning.mmd` | 6 |
| Apple Pay Transaction | `diagrams/apple-pay-transaction.mmd` | 6 |
| Google Pay HCE Flow | `diagrams/google-pay-hce-flow.mmd` | 7 |
| Samsung Pay MST Flow | `diagrams/samsung-pay-mst-flow.mmd` | 8 |
| Token Service Provider | `diagrams/token-service-provider.mmd` | 9 |
| In-Store NFC Transaction | `diagrams/in-store-nfc-transaction.mmd` | 10 |
| In-App / Web Payment | `diagrams/in-app-web-payment.mmd` | 10 |
| Wallet Ecosystem Participants | `diagrams/wallet-ecosystem-participants.mmd` | 3 |
| Fee and Revenue Model | `diagrams/fee-and-revenue-model.mmd` | 11 |
| Platform Comparison | `diagrams/platform-comparison.mmd` | 14 |
| Wallet Expansion Beyond Payments | `diagrams/wallet-expansion-beyond-payments.mmd` | 15 |

---

## Sources

- [Apple Pay -- Wikipedia](https://en.wikipedia.org/wiki/Apple_Pay)
- [Google Pay -- Wikipedia](https://en.wikipedia.org/wiki/Google_Pay)
- [Samsung Pay -- Wikipedia](https://en.wikipedia.org/wiki/Samsung_Pay)
- [Apple Pay Security and Privacy Overview -- Apple](https://support.apple.com/en-us/102195)
- [Apple Platform Security Guide -- Apple Pay](https://support.apple.com/guide/security/apple-pay-component-security-sec2561eb017/web)
- [How Mobile Wallets Work -- Apple Pay, Google Pay and the Tech Behind Tap-to-Pay | FintekCafe](https://fintekcafe.com/how-mobile-wallets-work-apple-pay-google-pay-and-the-tech-behind-tap-to-pay/)
- [How NFC Payments Work | NFC Clone](https://www.nfcclone.com/blog/how-nfc-payments-work)
- [How Tap to Pay Works | The Retail Exec](https://theretailexec.com/payment-processing/how-tap-to-pay-works/)
- [Card Tokenization: Understanding MDES and VTS | Medium](https://medium.com/@sudha.rajamanickam.a/card-tokenization-understanding-mdes-and-vts-6ff602bd1576)
- [Visa Token Service | Visa](https://usa.visa.com/products/visa-token-service.html)
- [Mastercard Digital Enablement Service (MDES) | Mastercard Developers](https://developer.mastercard.com/product/mdes-digital-enablement/)
- [EMV Payment Tokenisation Specification | EMVCo](https://www.emvco.com/emv-technologies/payment-tokenisation/)
- [EMV Contactless Specifications | EMVCo](https://www.emvco.com/emv-technologies/contactless/)
- [Host Card Emulation -- Android Developers](https://developer.android.com/reference/android/nfc/cardemulation/HostApduService)
- [NFC Forum -- Near Field Communication Standards](https://nfc-forum.org/)
- [ISO/IEC 14443 -- Contactless Smart Card Standards](https://www.iso.org/standard/73598.html)
- [ISO/IEC 7816-4 -- Smart Card APDU Commands](https://www.iso.org/standard/54550.html)
- [Google Wallet Developer Documentation](https://developers.google.com/wallet)
- [Apple Pay on the Web -- Apple Developer](https://developer.apple.com/apple-pay/web-human-interface-guidelines/)
- [PassKit Framework -- Apple Developer](https://developer.apple.com/documentation/passkit)
- [Practical Relay Attack on Contactless Transactions by Using NFC Mobile Phones -- University of Birmingham (2021)](https://www.usenix.org/conference/usenixsecurity21/presentation/basin)
- [Express Transit Vulnerability -- Apple Pay Visa Relay Attack](https://practical-emv-relay.github.io/)
- [LoopPay Acquisition -- Samsung Newsroom](https://news.samsung.com/global/samsung-electronics-acquires-looppay-inc)
- [Magnetic Secure Transmission -- Samsung](https://www.samsung.com/us/support/answer/ANS00043865/)
- [EU Digital Markets Act -- European Commission](https://digital-markets-act.ec.europa.eu/)
- [Apple to Allow Third-Party NFC Access in EU -- Reuters](https://www.reuters.com/technology/apple-allow-rivals-access-tap-and-go-technology-eu-antitrust-case-2024-07-11/)
- [PSD2 Strong Customer Authentication -- European Banking Authority](https://www.eba.europa.eu/activities/single-rulebook/regulatory-activities/payment-services-and-electronic-money/strong)
- [CFPB Digital Wallet Supervision Proposal](https://www.consumerfinance.gov/about-us/newsroom/cfpb-proposes-new-federal-oversight-of-big-tech-companies-and-other-providers-of-digital-wallets-and-payment-apps/)
- [RBI Tokenization Guidelines -- Reserve Bank of India](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12159&Mode=0)
- [Tap to Pay on iPhone -- Apple](https://developer.apple.com/tap-to-pay/)
- [Google Tap to Pay -- Android Developers](https://developers.google.com/pay/issuers/apis/push-provisioning/android)
- [ISO 18013-5 -- Mobile Driver's License Standard](https://www.iso.org/standard/69084.html)
- [Apple Wallet Digital IDs -- Apple](https://support.apple.com/en-us/119587)
- [Google Wallet Digital ID -- Google](https://wallet.google/id/)
- [e-CNY (Digital Yuan) -- People's Bank of China](http://www.pbc.gov.cn/en/3688006/index.html)
- [Digital Euro -- European Central Bank](https://www.ecb.europa.eu/paym/digital_euro/html/index.en.html)
- [Open Loop Transit Payments -- Mastercard](https://www.mastercard.com/news/perspectives/featured-topics/transit/)
- [TfL Contactless Statistics -- Transport for London](https://tfl.gov.uk/corporate/publications-and-reports/contactless-and-oyster-statistics)
- [Ultra-Wideband (UWB) Technology -- Apple](https://developer.apple.com/nearby-interaction/)
- [Secure Enclave -- Apple Platform Security](https://support.apple.com/guide/security/secure-enclave-sec59b0b31ff/web)
- [ARM TrustZone Technology | ARM](https://www.arm.com/technologies/trustzone-for-cortex-a)
- [NFC Data Exchange Format (NDEF) -- NFC Forum](https://nfc-forum.org/build/specifications)
- [Payments Industry Intelligence -- Nilson Report](https://nilsonreport.com/)
- [Mobile Payment Market Statistics 2025 -- Statista](https://www.statista.com/topics/982/mobile-payments/)
- [US DOJ Antitrust Case Against Apple (2024)](https://www.justice.gov/opa/pr/justice-department-sues-apple-monopolizing-smartphone-markets)
- [Dee Hock and the Birth of Visa -- Fast Company](https://www.fastcompany.com/27333/trillion-dollar-vision-dee-hock)
- [Google Wallet Rebrand Timeline -- The Verge](https://www.theverge.com/2022/5/11/23066893/google-wallet-app-pay-io-2022)

---

## Key Takeaways

1. **Mobile wallets are not payment networks.** They are tokenization and authentication layers sitting on top of existing Visa/Mastercard/Amex rails. When you tap your phone, the transaction still flows through the exact same four-party model as a plastic card. The wallet's job is to make that transaction more secure and more convenient.

2. **Tokenization is the core innovation.** The DPAN (Device PAN) replaces your real card number in every transaction. The merchant, terminal, and acquirer never see your real PAN. The Token Service Provider (VTS/MDES) maps the DPAN back to your real card only at the network level. This single change eliminates entire categories of fraud.

3. **Apple Pay and Google Pay have fundamentally different security architectures.** Apple uses a hardware Secure Element (the real token and keys never leave the chip). Google uses Host Card Emulation with cloud-based keys (Limited-Use Keys cached on device). Apple's approach is more secure offline; Google's approach bypassed carrier gatekeeping and enabled the Android wallet ecosystem to exist.

4. **Samsung Pay's MST was brilliant but temporary.** Magnetic Secure Transmission -- emulating a card swipe electromagnetically -- solved the NFC terminal scarcity problem of 2015. By 2021, NFC terminals were ubiquitous, and MST was retired. Samsung Pay is now a declining product, increasingly replaced by Google Wallet on Samsung devices.

5. **Apple earns ~0.15% per transaction; Google earns $0.** Apple negotiated a revenue share from issuers' interchange. Google provides the wallet for free because the value is in ecosystem lock-in and data. This fundamental difference shapes each company's incentives and product decisions.

6. **Mobile wallet payments have the lowest fraud rate of any payment method** -- approximately 1 basis point (0.01%), compared to 12 basis points for magnetic stripe and 18 basis points for card-not-present e-commerce. The combination of tokenization, dynamic cryptograms, biometric authentication, and device binding creates layered security that is extremely difficult to defeat.

7. **Regulation is reshaping the landscape.** The EU's Digital Markets Act forced Apple to open NFC access to third-party wallets in Europe -- ending Apple Pay's monopoly on iPhone tap-to-pay. PSD2/SCA makes mobile wallets the easiest way to comply with authentication requirements. India's RBI tokenization mandate accelerated token infrastructure globally.

8. **Wallets are becoming identity platforms, not just payment tools.** Driver's licenses, car keys, hotel keys, transit passes, vaccination records, corporate badges -- mobile wallets are converging toward a "digital identity container" model. The payment credential is just the first (and most widely adopted) use case.

9. **The NFC payment handshake completes in under 500 milliseconds.** From PPSE negotiation through cryptogram generation, only 2-4 APDU exchanges are needed. The full end-to-end authorization (including network round-trip to the issuer) takes approximately 2 seconds. This speed is achieved by skipping offline data authentication and relying on online-only authorization.

10. **The future points toward invisible payments.** Tap to Pay on iPhone (phone-as-terminal), UWB proximity payments, and digital identity convergence all point toward a future where the phone in your pocket silently authenticates you and authorizes payments without you ever opening an app. The wallet becomes invisible infrastructure.