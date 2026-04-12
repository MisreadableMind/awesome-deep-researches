# KYC/AML Systems: Identity Verification, Transaction Monitoring, and Financial Crime Prevention - Complete Technical Deep Dive

---

## Table of Contents

1. [History and Overview](#1-history-and-overview)
2. [What KYC/AML Actually Is (and Is Not)](#2-what-kycaml-actually-is-and-is-not)
3. [Key Participants and Roles](#3-key-participants-and-roles)
4. [How KYC Works - Step by Step](#4-how-kyc-works---step-by-step)
5. [Transaction Monitoring - The AML Engine](#5-transaction-monitoring---the-aml-engine)
6. [Technical Architecture](#6-technical-architecture)
7. [Money Flow and Economics](#7-money-flow-and-economics)
8. [Sanctions, PEPs, and Screening](#8-sanctions-peps-and-screening)
9. [Regulation and Compliance](#9-regulation-and-compliance)
10. [Comparisons Across Industries and Jurisdictions](#10-comparisons-across-industries-and-jurisdictions)
11. [Modern Developments - AI, RegTech, and Digital Identity](#11-modern-developments---ai-regtech-and-digital-identity)
12. [Appendix](#12-appendix)
13. [Key Takeaways](#13-key-takeaways)

---

## 1. History and Overview

### 1.1 The Problem That Created KYC/AML

Financial crime is as old as money itself. But the modern compliance apparatus that banks, fintechs, and crypto exchanges operate under traces its origin to a specific problem: the realization, starting in the 1970s and accelerating through the 1980s, that the global banking system was being used as a laundering machine for drug money, organized crime, terrorism financing, and corruption on a massive scale.

Money laundering is the process of making illegally-obtained money appear legitimate. The mechanics are straightforward. A drug cartel generates millions in cash from street sales. That cash cannot be deposited directly into a bank without raising questions. So the cartel uses a network of shell companies, cash-intensive businesses (car washes, restaurants, casinos), trade-based schemes, and cross-border wire transfers to layer the money through the financial system until it emerges on the other end as apparently clean funds in a legitimate-looking account.

The scale is staggering. The United Nations Office on Drugs and Crime (UNODC) estimates that money laundering accounts for 2-5% of global GDP annually, which is roughly 800 billion to 2 trillion USD. Only about 1% of illicit financial flows are intercepted and seized.

KYC (Know Your Customer) and AML (Anti-Money Laundering) are the two pillars of the regulatory and technical response to this problem. KYC is the process of verifying who a customer is before and during the relationship. AML is the ongoing monitoring of transactions and behaviors to detect and report suspicious activity. Together, they form a compliance ecosystem that touches every financial institution in the world.

### 1.2 The Bank Secrecy Act and the Birth of Modern AML (1970)

The modern AML framework begins with the **Bank Secrecy Act (BSA)** of 1970, the first US law specifically targeting money laundering through financial institutions.

The BSA was the brainchild of US Treasury officials who observed that organized crime and tax evaders were using cash-intensive businesses and offshore banking to move money undetected. The key insight was that the government could not directly stop criminals from earning illicit money, but it could require banks to keep records and file reports that created a paper trail.

**What the BSA required:**

- **Currency Transaction Reports (CTRs)**: banks must file a CTR for any cash transaction exceeding 10,000 USD. This single threshold remains the foundation of US cash reporting and has not changed since 1970 (if adjusted for inflation, 10,000 USD in 1970 would be approximately 80,000 USD today).
- **Record-keeping**: banks must maintain records of certain transactions and customer identifiers.
- **Foreign bank account reporting**: US persons must disclose foreign financial accounts (now known as FBAR, FinCEN Form 114).

The BSA was initially controversial. Banks objected to the record-keeping burden, and libertarians challenged it as government surveillance. The Supreme Court upheld the BSA in California Bankers Association v. Shultz (1974) and United States v. Miller (1976), holding that bank records are not protected by the Fourth Amendment because customers voluntarily share financial information with their banks.

### 1.3 The War on Drugs and the Money Laundering Control Act (1986)

The 1980s cocaine epidemic in the United States, driven by Colombian cartels and the crack crisis in American cities, created enormous political pressure to attack drug profits. The **Money Laundering Control Act of 1986** was the first US law to make money laundering itself a federal crime, separate from the underlying predicate offense.

**Key provisions:**

- **18 U.S.C. 1956**: criminalizes conducting a financial transaction with proceeds of specified unlawful activity, with intent to promote that activity or conceal the proceeds
- **18 U.S.C. 1957**: criminalizes engaging in monetary transactions in property derived from specified unlawful activity, where the amount exceeds 10,000 USD
- **Structuring (31 U.S.C. 5324)**: criminalizes breaking up transactions into smaller amounts to evade the 10,000 USD CTR reporting threshold (also called "smurfing")

**The Pizza Connection case (1985-1987)** was one of the most dramatic early AML cases. A Sicilian Mafia network used pizza restaurants across the northeastern United States as fronts to distribute heroin imported from Turkey via Sicily. The proceeds, estimated at 1.6 billion USD over several years, were laundered through a complex web of cash pickups, wire transfers through Swiss and Bahamian banks, and shell companies. The trial lasted 17 months and resulted in convictions of 18 defendants. It demonstrated both the scale of laundering through the banking system and the difficulty of tracing funds across jurisdictions.

**BCCI (Bank of Credit and Commerce International)**, a Luxembourg-chartered bank with operations in 78 countries, was shut down by regulators in 1991 after investigators discovered it had been involved in money laundering, bribery, arms trafficking, and terrorism financing on a global scale. BCCI's collapse, which left depositors with billions in losses, was a turning point that convinced regulators that international coordination and stronger banking supervision were essential.

### 1.4 The FATF and International Coordination (1989)

The **Financial Action Task Force (FATF)** was established in 1989 by the G7 at the Paris summit, initially as a temporary body to coordinate the international response to money laundering. It became permanent and is now the global standard-setter for AML/CFT (Countering the Financing of Terrorism).

**The 40 Recommendations** (originally published in 1990, most recently revised in 2012 and updated periodically) are the international standard for AML/CFT. They cover:

- Customer due diligence (CDD) and KYC requirements
- Record-keeping
- Suspicious transaction reporting
- Regulation and supervision of financial institutions
- International cooperation and mutual legal assistance
- Transparency of legal persons and arrangements (beneficial ownership)
- Powers and responsibilities of competent authorities

FATF conducts **mutual evaluations** of member countries, assessing whether they effectively implement the Recommendations. Countries that fail to meet standards can be placed on the **grey list** (jurisdictions under increased monitoring) or the **black list** (high-risk jurisdictions subject to enhanced due diligence). As of 2025, the grey list includes approximately 20 jurisdictions. Being grey-listed has real economic consequences: banks worldwide apply enhanced scrutiny to transactions involving grey-listed countries, making international business more expensive and slower.

FATF members include 39 jurisdictions and 2 regional organizations (the European Commission and the Gulf Cooperation Council). Major FATF-style regional bodies (FSRBs) extend coverage to virtually every country.

### 1.5 September 11 and the USA PATRIOT Act (2001)

The September 11, 2001 terrorist attacks transformed AML by adding **counter-terrorism financing (CTF)** as a co-equal priority alongside money laundering. The **USA PATRIOT Act**, signed into law on October 26, 2001, just 45 days after the attacks, dramatically expanded the BSA framework.

**Title III (International Money Laundering Abatement and Financial Crimes Strategy Act of 2001)** was the section that reshaped financial compliance:

- **Section 311**: gives the Treasury Secretary authority to designate foreign jurisdictions, institutions, or transactions as "primary money laundering concerns" and impose special measures (ranging from enhanced record-keeping to outright prohibition of correspondent banking)
- **Section 312**: requires enhanced due diligence for correspondent accounts with foreign banks and private banking accounts for non-US persons
- **Section 314(a)**: establishes a mechanism for law enforcement to request financial institutions to search their records for accounts held by suspected terrorists or money launderers
- **Section 314(b)**: creates a safe harbor for financial institutions to share information with each other for AML purposes (voluntary, not mandatory)
- **Section 326**: the **Customer Identification Program (CIP)** rule, which for the first time required all US financial institutions to verify the identity of customers opening new accounts. This is the legal foundation of KYC in the United States.

The CIP rule, finalized in 2003, requires financial institutions to:
1. Collect four pieces of identifying information: name, date of birth, address, and identification number (SSN for US persons, passport or similar for non-US persons)
2. Verify the identity using documentary (government-issued ID) or non-documentary (database verification) methods
3. Check the customer's name against government lists of known or suspected terrorists (OFAC SDN list)
4. Maintain records of the identification information and verification methods

### 1.6 The Beneficial Ownership Revolution (2016-2025)

One of the biggest weaknesses in the AML framework has been the ability to hide behind anonymous shell companies. Criminals, kleptocrats, and sanctions evaders routinely used companies with opaque ownership structures to open bank accounts, buy real estate, and move money.

**The Panama Papers (April 2016)** leaked 11.5 million documents from Mossack Fonseca, a Panamanian law firm that specialized in creating offshore shell companies. The leak revealed that politicians, celebrities, and criminals worldwide used anonymous shell companies to evade taxes, launder money, and hide assets.

**The FinCEN Files (September 2020)** leaked over 2,100 suspicious activity reports filed by banks with FinCEN, revealing that major global banks (HSBC, JPMorgan, Deutsche Bank, Standard Chartered, Bank of New York Mellon) had moved trillions of dollars in suspicious transactions even after being fined for compliance failures. The leak demonstrated that filing SARs was not the same as stopping illicit flows.

These scandals accelerated the push for **beneficial ownership transparency**:

- **EU 4th Anti-Money Laundering Directive (4AMLD, 2015/2017)**: required EU member states to create beneficial ownership registers
- **EU 5th AMLD (2018/2020)**: made beneficial ownership registers publicly accessible
- **EU 6th AMLD (2018/2020)**: harmonized predicate offenses and expanded criminal liability
- **US Corporate Transparency Act (CTA, enacted 2021, effective 2024)**: requires most US companies to report their beneficial owners to FinCEN. This was a seismic shift for the US, which had been one of the easiest countries in the world to form anonymous companies (Delaware, Nevada, Wyoming).
- **UK Register of Overseas Entities (2022)**: requires foreign entities owning UK property to disclose beneficial owners

### 1.7 Major Enforcement Actions and Fines

The scale of AML enforcement fines illustrates the seriousness with which regulators treat compliance failures.

| Year | Institution | Fine / Penalty | Violation |
|------|-------------|----------------|-----------|
| 2012 | HSBC | 1.92B USD | Laundering for Mexican drug cartels, sanctions violations (Iran, Sudan) |
| 2014 | BNP Paribas | 8.97B USD | Sanctions violations (Sudan, Cuba, Iran) - largest banking fine in history |
| 2012 | Standard Chartered | 667M USD | Iranian sanctions violations |
| 2015 | Commerzbank | 1.45B USD | Sanctions violations and BSA failures |
| 2017 | Deutsche Bank | 630M USD | Russian mirror trading (10B+ USD laundered) |
| 2018 | Commonwealth Bank (Australia) | 700M AUD | 53,000+ violations of AML reporting (Austrac) |
| 2018 | ING Bank | 775M EUR | Systematic AML failures (Netherlands) |
| 2018 | Danske Bank | Investigation | 200B+ EUR in suspicious flows through Estonian branch |
| 2019 | Westpac (Australia) | 1.3B AUD | 23 million+ AML reporting violations |
| 2020 | Goldman Sachs | 2.9B USD | 1MDB corruption scandal |
| 2022 | Binance | 4.3B USD | BSA violations, sanctions evasion, unlicensed money transmission |
| 2023 | TD Bank | 3.09B USD | BSA/AML failures, "significant, long-standing, and pervasive" compliance breakdowns |
| 2024 | Starling Bank (UK) | 29M GBP | Financial crime controls failures |

These fines represent only the direct financial penalties. The indirect costs include consent orders restricting business activity, loss of correspondent banking relationships, reputational damage, management shakeups, and in some cases criminal charges against individuals.

### 1.8 Timeline

| Year | Event |
|------|-------|
| 1970 | Bank Secrecy Act (BSA) enacted in the US |
| 1986 | Money Laundering Control Act criminalizes money laundering |
| 1989 | FATF established by G7 |
| 1990 | FATF publishes the 40 Recommendations |
| 1991 | EU First Anti-Money Laundering Directive |
| 1991 | BCCI shut down by regulators |
| 1996 | FATF expands scope to include money laundering predicate offenses |
| 2001 | USA PATRIOT Act: CIP rule, enhanced due diligence, information sharing |
| 2001 | FATF adds 8 Special Recommendations on terrorist financing (later 9) |
| 2003 | CIP rule finalized, KYC becomes legally mandatory in the US |
| 2012 | FATF revises 40 Recommendations, merges AML and CFT |
| 2012 | HSBC fined 1.92B USD |
| 2014 | BNP Paribas fined 8.97B USD |
| 2016 | Panama Papers leaked |
| 2016 | EU 4th AMLD requires beneficial ownership registers |
| 2018 | Danske Bank Estonia scandal (200B+ EUR) |
| 2020 | FinCEN Files leaked |
| 2020 | US Anti-Money Laundering Act (AMLA) modernizes BSA |
| 2021 | Corporate Transparency Act enacted in the US |
| 2022 | EU agrees on AMLA package (new AML Authority, single rulebook) |
| 2023 | TD Bank fined 3.09B USD |
| 2024 | US Corporate Transparency Act reporting begins |
| 2024 | EU Anti-Money Laundering Authority (AMLA) established, headquartered in Frankfurt |
| 2025 | FATF publishes updated guidance on virtual assets, DeFi, and AI in AML |

### 1.9 Scale Today

The global compliance industry supporting KYC/AML is estimated at 50-60 billion USD in annual spending by financial institutions, growing at 10-15% per year. A large global bank (JPMorgan, HSBC, Citi) may employ 5,000-15,000 compliance staff dedicated to financial crime prevention. Compliance costs typically represent 5-10% of a bank's total operating expenses.

Despite this spending, the effectiveness of the current system is debated. The UN estimates that only 1% of illicit financial flows are intercepted. Suspicious activity reports (SARs) filed globally exceed 4 million per year in the US alone, and most are never investigated by law enforcement due to resource constraints. The false positive rate in transaction monitoring systems is notoriously high, often exceeding 95%, meaning that for every 100 alerts generated, 95 or more turn out to be legitimate transactions upon investigation.

---

## 2. What KYC/AML Actually Is (and Is Not)

### 2.1 The Precise Definitions

**KYC (Know Your Customer)** is the process by which a financial institution identifies and verifies the identity of its customers, understands the nature and purpose of the customer relationship, and assesses the money laundering and terrorism financing risk that each customer presents.

KYC is not a one-time event. It begins at account opening (onboarding), continues through the life of the relationship (ongoing monitoring and periodic reviews), and extends to the customer's transactions, counterparties, and beneficial owners.

**AML (Anti-Money Laundering)** is the broader set of laws, regulations, procedures, and technology systems designed to prevent, detect, and report money laundering and related financial crimes. AML encompasses KYC as one of its components, but also includes transaction monitoring, suspicious activity reporting, sanctions screening, employee training, independent testing, and BSA/AML officer designation.

**CFT (Countering the Financing of Terrorism)** addresses the specific challenge that terrorism financing is often the mirror image of money laundering: instead of making dirty money look clean, terrorism financing often involves making clean money (donations, legitimate business income, state sponsorship) available for illicit purposes. CFT is now integrated with AML in most regulatory frameworks.

### 2.2 What KYC/AML Is NOT

| Misconception | Reality |
|---------------|---------|
| "KYC is just checking an ID at account opening" | KYC is a continuous lifecycle: onboarding verification, risk assessment, ongoing monitoring, periodic reviews, and enhanced due diligence for high-risk customers. Checking an ID is one step in a multi-step process. |
| "AML catches money laundering" | AML systems primarily detect suspicious patterns and generate reports (SARs). The actual investigation and prosecution is done by law enforcement (FinCEN, FBI, NCA, Europol). Banks detect and report; governments investigate and prosecute. |
| "KYC/AML is a bank-only requirement" | KYC/AML obligations apply to banks, broker-dealers, insurance companies, money service businesses, casinos, real estate professionals (in some jurisdictions), lawyers and accountants (in the EU), crypto exchanges, and increasingly fintechs and neobanks. |
| "AML compliance means you stop all money laundering" | No system catches everything. The regulatory expectation is a reasonably designed and effectively implemented program, not perfection. Banks are penalized for systemic failures, not for individual transactions that slip through a well-functioning system. |
| "More alerts = better compliance" | The opposite is often true. A system that generates 95% false positive alerts overwhelms investigators, leads to alert fatigue, and may cause genuinely suspicious activity to be overlooked. Modern systems aim for fewer, higher-quality alerts. |
| "KYC/AML is just a cost center" | Beyond regulatory compliance, effective KYC/AML protects the institution from fraud losses, reputational damage, and correspondent banking restrictions. Losing correspondent banking relationships can be existential for smaller banks. |
| "Crypto is anonymous and beyond AML" | Major jurisdictions now require crypto exchanges and virtual asset service providers (VASPs) to implement full KYC/AML programs, including the FATF Travel Rule for transfers. Blockchain analytics firms (Chainalysis, Elliptic) trace crypto transactions for compliance and law enforcement. |

### 2.3 The Mental Model - Three Lines of Defense

The standard model for understanding AML compliance within a financial institution is the **three lines of defense**:

```
+--------------------------------------------------------------+
|                    BOARD & SENIOR MANAGEMENT                  |
|            Sets risk appetite, oversees compliance             |
+--------------------------------------------------------------+
         |                    |                    |
+------------------+  +------------------+  +------------------+
| 1st LINE         |  | 2nd LINE         |  | 3rd LINE         |
| Business Units   |  | Compliance/Risk  |  | Internal Audit   |
|                  |  |                  |  |                  |
| - Frontline      |  | - BSA/AML Officer|  | - Independent    |
|   bankers        |  | - AML policies   |  |   testing        |
| - Onboarding     |  | - Transaction    |  | - Program        |
| - Customer-      |  |   monitoring     |  |   assessment     |
|   facing staff   |  | - SAR filing     |  | - Regulatory     |
| - Own the risk   |  | - Sanctions      |  |   exam prep      |
| - Apply CDD      |  | - Training       |  |                  |
+------------------+  +------------------+  +------------------+
     OWNS RISK         OVERSEES RISK         PROVIDES ASSURANCE
```

The first line owns the customer relationship and performs CDD. The second line sets policy, runs monitoring systems, investigates alerts, and files SARs. The third line independently tests the program's effectiveness. This model is explicitly required by regulators and examined during supervisory assessments.

### 2.4 The Five Pillars of a BSA/AML Program

US regulators (FinCEN, OCC, FDIC, Fed, NCUA) require every covered financial institution to maintain a BSA/AML compliance program with five pillars:

1. **A system of internal controls** (policies, procedures, and processes) to ensure ongoing compliance
2. **Independent testing** (internal audit or external review) of the program's effectiveness
3. **A designated BSA/AML compliance officer** responsible for day-to-day program management
4. **Training** for appropriate personnel
5. **A risk-based approach to CDD** including beneficial ownership identification (added by the CDD Rule in 2016/2018)

These five pillars form the backbone of every BSA/AML examination by federal banking regulators. Weakness in any pillar can result in enforcement action.

---

## 3. Key Participants and Roles

### 3.1 The KYC/AML Ecosystem

![Key participants and their relationships](diagrams/participants.svg)

| Participant | Role | Examples |
|-------------|------|----------|
| **Financial Institution (FI)** | Implements KYC/AML programs, files reports, screens transactions | Banks, credit unions, broker-dealers, insurance companies, fintechs |
| **BSA/AML Officer** | Senior executive responsible for the compliance program | Typically reports to Chief Compliance Officer or General Counsel |
| **KYC Analyst** | Performs customer due diligence, verifies identities, assesses risk | Onboarding teams, periodic review teams |
| **AML Investigator** | Reviews transaction monitoring alerts, investigates suspicious activity, drafts SARs | Alert investigation teams, financial intelligence units |
| **Sanctions Analyst** | Reviews sanctions screening hits, determines true vs false matches | Often part of the compliance team |
| **Customer** | Individual or entity opening an account or conducting transactions | Retail customers, corporate clients, correspondent banks |
| **Regulator** | Sets rules, examines compliance programs, brings enforcement actions | FinCEN, OCC, FDIC, Fed, SEC, CFTC, state regulators (US); FCA, PRA (UK); BaFin (DE); ACPR (FR) |
| **Financial Intelligence Unit (FIU)** | Government agency that receives and analyzes SARs and CTRs | FinCEN (US), NCA/UKFIU (UK), TRACFIN (France), FIU Germany, AUSTRAC (Australia) |
| **Law Enforcement** | Investigates and prosecutes financial crime | FBI, IRS-CI, DEA, HSI (US); NCA (UK); Europol, national police |
| **FATF** | Sets international AML/CFT standards | 39 member jurisdictions + 2 regional orgs |
| **RegTech Vendor** | Provides technology for identity verification, screening, monitoring | See Section 6 for detailed vendor landscape |
| **Data Provider** | Supplies identity data, sanctions lists, PEP databases, adverse media | Refinitiv (LSEG), Dow Jones, LexisNexis, Bureau van Dijk (Moody's) |
| **Correspondent Bank** | Provides access to payment systems on behalf of other banks | Large global banks providing USD clearing, SWIFT access |
| **VASP (Virtual Asset Service Provider)** | Crypto exchanges and wallet providers, increasingly subject to AML | Coinbase, Binance, Kraken, local exchanges |
| **DNFBP (Designated Non-Financial Business or Profession)** | Non-bank entities with AML obligations | Real estate agents, lawyers, accountants, dealers in precious metals, casinos |

### 3.2 The BSA/AML Officer

The BSA/AML officer (also called the Money Laundering Reporting Officer or MLRO in the UK) is the single most important compliance role in a financial institution. This person is responsible for:

- Overall design, implementation, and operation of the BSA/AML program
- SAR filing decisions
- Communication with regulators and law enforcement
- Setting risk appetite and policy
- Reporting to the board

The BSA/AML officer has personal liability in many jurisdictions. In the US, willful failure to file SARs can result in criminal charges against individuals. In the UK, the MLRO can be personally fined and banned by the FCA. This personal accountability creates strong incentives for robust compliance.

### 3.3 The Compliance Team Structure

A mid-to-large bank's financial crime compliance team typically includes:

- **BSA/AML Officer** (reports to CCO or General Counsel)
- **KYC/CDD team** (onboarding analysts, enhanced due diligence specialists, periodic review analysts)
- **Transaction monitoring team** (alert investigators, SAR writers, quality assurance)
- **Sanctions team** (screening, OFAC/EU/UN list management, licensing)
- **Financial intelligence unit** (advanced investigations, law enforcement liaison, typology development)
- **AML technology team** (maintains and tunes monitoring systems, model validation)
- **Training and policy team**
- **Governance, risk, and reporting**

At a global bank like HSBC or JPMorgan, the financial crime compliance function may have over 10,000 staff across these roles.

### 3.4 The Correspondent Banking Relationship

Correspondent banking is critical to understanding AML because it is a primary channel for cross-border money movement and a major focus of AML regulation.

A correspondent bank provides banking services (primarily access to payment systems like SWIFT, Fedwire, CHIPS) to another bank (the respondent bank). When a small bank in a developing country wants to process a USD wire transfer, it sends the instruction through its correspondent bank, which has direct access to the US payment system.

AML risk in correspondent banking is high because the correspondent bank is processing transactions on behalf of the respondent bank's customers, whom the correspondent may never directly verify. The correspondent is essentially relying on the respondent's KYC/AML controls. If the respondent bank has weak controls, the correspondent becomes an unwitting conduit for illicit funds.

**De-risking** is the phenomenon where global correspondent banks sever relationships with respondent banks in high-risk jurisdictions (Caribbean, Middle East, parts of Africa and Central Asia) rather than bear the AML compliance cost. De-risking has reduced financial access for entire countries and has been criticized by the World Bank, IMF, and FATF as an unintended consequence of AML regulation.

---

## 4. How KYC Works - Step by Step

The KYC process operates across the full customer lifecycle, from initial onboarding through periodic review and, in some cases, exit. This section walks through each phase using a concrete example: a mid-sized European company opening a corporate bank account.

![KYC lifecycle flow](diagrams/kyc-lifecycle.svg)

### 4.1 Step 1: Customer Identification (CIP)

The first step is collecting identifying information about the customer and verifying that identity.

**For an individual customer**, the minimum CIP requirements in the US are:
- Full legal name
- Date of birth
- Residential address
- Government-issued identification number (SSN for US citizens; passport number, alien identification number, or government-issued ID number for non-US persons)

**For a corporate customer**, the requirements expand to include:
- Legal entity name
- Principal place of business or registered office address
- Incorporation or formation jurisdiction
- Employer Identification Number (EIN) or equivalent
- Articles of incorporation or formation documents
- Beneficial ownership information (all individuals owning 25%+ and one individual with significant management control)

**Verification methods:**

Documentary verification involves examining a physical or digital copy of a government-issued identity document (passport, driver's license, national ID card for individuals; articles of incorporation, certificate of good standing for entities).

Non-documentary verification uses independent data sources to confirm the customer's identity: credit bureau records (Equifax, Experian, TransUnion), public records databases, identity verification services (LexisNexis, Jumio, Onfido, Socure).

Modern digital onboarding typically combines both. The customer uploads a photo of their ID, which is verified using document verification technology (optical character recognition, template matching, liveness detection, NFC chip reading), and then the extracted data is cross-referenced against external databases.

### 4.2 Step 2: Beneficial Ownership Identification

For legal entity customers, the financial institution must identify the **beneficial owners**, the natural persons who ultimately own or control the entity.

The US CDD Rule (effective May 2018) requires identifying:
- Each individual who, directly or indirectly, owns 25% or more of the equity interests of the legal entity
- One individual with significant responsibility to control, manage, or direct the legal entity (a "control prong" individual)

The EU's AML directives use a 25% threshold as well but allow member states to set a lower threshold. The UK uses 25%.

**Why beneficial ownership matters**: shell companies and complex ownership structures are the primary tools for hiding the true owners of accounts. The Panama Papers revealed thousands of cases where the nominal directors and shareholders of a company were nominee services or law firms, with the actual beneficiary hidden behind layers of holding companies.

**Challenges:**

- Multi-layered corporate structures: Company A is owned by Company B, which is owned by Trust C, which is settled by Person D. Tracing to Person D requires understanding each layer.
- Nominee structures: directors and shareholders who hold positions on behalf of undisclosed principals.
- Bearer shares: shares where ownership is determined by physical possession of the certificate, not a registry. Most jurisdictions have abolished or restricted bearer shares, but they still exist in some.
- Trusts and foundations: beneficial ownership concepts apply differently to trusts (look at settlor, trustees, protectors, beneficiaries) versus companies (look at shareholders and directors).

### 4.3 Step 3: Risk Assessment (Customer Risk Rating)

Every customer is assigned a **risk rating** (typically low, medium, high, or a numeric score) based on factors including:

**Customer-related factors:**
- Customer type (individual vs. corporate vs. trust vs. correspondent bank)
- Beneficial ownership transparency
- Industry or occupation (cash-intensive businesses, gambling, cryptocurrency, precious metals are higher risk)
- Source of wealth and source of funds
- PEP status (Politically Exposed Person)
- Adverse media

**Geographic factors:**
- Country of residence or incorporation
- Countries involved in the customer's transactions
- FATF grey or black list status
- Corruption Perceptions Index (Transparency International)
- Sanctions exposure

**Product and channel factors:**
- Account type (simple savings vs. private banking vs. correspondent account)
- Transaction channels (in-person vs. online vs. wire)
- Products used (trade finance, foreign exchange, securities are higher risk)

The risk rating determines the level of due diligence applied:

| Risk Level | Due Diligence | Review Frequency | Examples |
|------------|---------------|------------------|----------|
| Low | Simplified Due Diligence (SDD) | Every 3-5 years | Salaried individual, domestic, simple products |
| Medium | Standard CDD | Every 2-3 years | Small business, some foreign connections |
| High | Enhanced Due Diligence (EDD) | Annually or more | PEPs, correspondent banks, high-risk jurisdictions, complex structures |
| Prohibited | No relationship | N/A | Sanctioned entities, shell banks, entities from FATF black-listed countries |

### 4.4 Step 4: Enhanced Due Diligence (EDD)

For high-risk customers, EDD requires additional measures beyond standard CDD:

- **Source of wealth**: how did the customer accumulate their assets? (Inheritance, business, investments, employment - with supporting documentation)
- **Source of funds**: where specifically is the money for this transaction or relationship coming from?
- **Purpose of account**: what will the account be used for? What transaction patterns are expected?
- **Senior management approval**: a compliance officer or senior manager must approve the relationship
- **Ongoing enhanced monitoring**: lower thresholds for transaction monitoring alerts, more frequent periodic reviews
- **Site visits or face-to-face meetings** for the highest-risk relationships

EDD is where the most judgment and expertise is required. A private banking client who is a senior government official of a developing country (a PEP) requires deep investigation into the source of their wealth. A correspondent banking relationship with a bank in a high-risk jurisdiction requires understanding the respondent bank's own AML controls.

### 4.5 Step 5: Screening

Before and during the relationship, the customer (and their beneficial owners, directors, and authorized signatories) must be screened against:

- **Sanctions lists**: OFAC SDN list (US), EU Consolidated List, UN Security Council Consolidated List, HMT (UK), and others
- **PEP databases**: lists of current and former senior political figures and their family members and close associates
- **Adverse media**: news articles linking the individual or entity to financial crime, corruption, fraud, or other concerns
- **Law enforcement and regulatory lists**: Interpol, FBI Most Wanted, FinCEN 311 special measures

Screening is performed at onboarding, at periodic review, when sanctions lists are updated (which can be daily), and often in real-time against transactions.

### 4.6 Step 6: Ongoing Monitoring

KYC does not end at onboarding. Throughout the customer relationship, the institution must:

- Monitor transactions for unusual patterns (see Section 5)
- Re-screen against updated sanctions and PEP lists
- Perform periodic reviews (refreshing KYC information at intervals based on risk rating)
- Track changes in risk profile (new adverse media, new jurisdictions, changes in transaction patterns)
- Update beneficial ownership information when changes occur

**Trigger events** that require an ad hoc review outside the regular cycle:
- A SAR is filed on the customer
- Adverse media appears
- The customer's industry or jurisdiction is added to a sanctions or high-risk list
- Unusual transaction patterns are detected
- Law enforcement makes an inquiry

### 4.7 Step 7: Exit and Offboarding

If ongoing monitoring or a periodic review determines that the AML risk is unacceptable, or if the customer refuses to provide required information, the institution may decide to **exit** (terminate) the relationship.

Exiting a customer is operationally and legally complex:
- The exit decision must be documented and approved by senior management
- The customer must be given reasonable notice (regulatory requirements vary)
- Outstanding transactions and obligations must be settled
- The institution may be required to file a SAR explaining the exit
- The institution must be careful not to "tip off" the customer about a SAR (tipping off is a criminal offense in many jurisdictions)

### 4.8 The Digital Onboarding Flow

Modern digital KYC onboarding, as used by neobanks, fintechs, and digital-first banks, typically follows this flow:

```
User opens app
    |
    v
Enter personal details
(name, DOB, address, SSN/tax ID)
    |
    v
Upload government ID
(passport, driver's license)
    |
    v
Document verification
(OCR + template matching + security features + NFC chip)
    |
    v
Liveness check
(selfie video, head turn, blink detection)
    |
    v
Biometric matching
(selfie vs. ID photo, facial recognition)
    |
    v
Database verification
(credit bureau, electoral roll, utility records)
    |
    v
Sanctions + PEP screening
(real-time check against lists)
    |
    v
Risk scoring
(rules + ML model assigns risk tier)
    |
    v
Decision
    |
    +-- Approved --> Account opened
    |
    +-- Referred --> Manual review by KYC analyst
    |
    +-- Declined --> Rejection notice
```

Best-in-class digital onboarding completes in under 5 minutes for low-risk customers with a straight-through processing (STP) rate of 70-90%.

---

## 5. Transaction Monitoring - The AML Engine

Transaction monitoring is the core technical system in AML. It analyzes customer transactions to identify patterns that may indicate money laundering, terrorism financing, fraud, or other financial crime. This is where the most technology investment occurs and where the biggest challenges lie.

![Transaction monitoring flow](diagrams/transaction-monitoring.svg)

### 5.1 How Transaction Monitoring Works

At its simplest, transaction monitoring compares each customer's transactions against a set of rules (scenarios) that describe known patterns of suspicious activity. When a transaction or pattern matches a rule, the system generates an **alert**. The alert is reviewed by a human investigator who decides whether the activity is genuinely suspicious.

**The basic flow:**

1. **Data ingestion**: transactions from all channels (wire transfers, ACH, checks, cash, card, internal transfers, trade finance) are loaded into the monitoring system
2. **Customer profile enrichment**: each transaction is linked to the customer's profile, including their risk rating, expected activity, and historical behavior
3. **Scenario execution**: the monitoring system runs hundreds of rules/scenarios against the transaction data
4. **Alert generation**: transactions or patterns that match a scenario create alerts
5. **Alert scoring and prioritization**: ML models or rules rank alerts by likely severity
6. **Investigation**: an AML investigator reviews the alert, pulls additional data, and makes a decision
7. **Disposition**: the alert is closed as "no issue" (false positive), escalated for further review, or recommended for SAR filing
8. **SAR filing**: if warranted, the investigator drafts a Suspicious Activity Report, which is reviewed, approved, and filed with the FIU (FinCEN in the US)

### 5.2 Transaction Monitoring Scenarios

Scenarios are the rules that transaction monitoring systems use to detect suspicious patterns. They are designed based on **typologies**, the known methods criminals use to launder money or finance terrorism.

**Common scenario categories:**

**Structuring / Smurfing:**
- Multiple cash deposits just below the 10,000 USD CTR threshold
- Patterns of round-number deposits across multiple branches or days
- Multiple transactions that individually are below the reporting threshold but collectively exceed it

**Rapid movement of funds:**
- Funds received and immediately transferred out (pass-through activity)
- Large incoming wire followed by immediate outgoing wire to a different beneficiary
- "Funnel accounts" that aggregate deposits from many sources and then send large wires out

**Unusual transaction patterns:**
- Transaction volume or value significantly above the customer's historical baseline or expected activity
- Activity inconsistent with the customer's stated occupation or business type
- Sudden dormancy followed by sudden activity

**High-risk geography:**
- Transactions involving countries on FATF grey/black lists, sanctioned countries, or countries known for specific crime types (drug production, corruption, tax haven)

**Cash-intensive activity:**
- Cash deposits inconsistent with the business type
- Large cash withdrawals followed by deposits at other institutions
- Foreign currency exchange in amounts or patterns inconsistent with stated purpose

**Trade-based laundering:**
- Over-invoicing or under-invoicing of goods (detected through trade finance monitoring)
- Misrepresentation of goods, quantity, or quality
- Multiple shipments to/from free trade zones

**Layering through complex structures:**
- Transfers between related entities without clear business purpose
- Use of multiple intermediary accounts
- Rapid cycling of funds through different account types or currencies

**Terrorism financing:**
- Small, regular transfers to/from high-risk regions
- Crowd-funding patterns (many small donations aggregating to significant amounts)
- Activity patterns matching known terrorism financing typologies

### 5.3 The False Positive Problem

The single biggest operational problem in AML transaction monitoring is the **false positive rate**. Industry estimates consistently show false positive rates of 90-99%, meaning that for every 100 alerts the system generates, only 1-10 represent genuinely suspicious activity.

**Why are false positives so high?**

1. **Rules are designed conservatively**: regulators penalize false negatives (missing suspicious activity) far more severely than false positives. Institutions set low thresholds to avoid missing anything.
2. **Rules are static while behavior is dynamic**: a scenario that flags "wire transfers above 50,000 USD to high-risk countries" will flag thousands of legitimate business transactions.
3. **Limited context**: traditional rule-based systems evaluate individual transactions or simple patterns without understanding the full context of the customer's business, industry norms, or relationship history.
4. **Duplicative alerts**: multiple scenarios may fire on the same underlying activity, creating redundant alerts.
5. **Threshold erosion**: over time, regulators and auditors push institutions to add more scenarios and lower thresholds, increasing the alert volume without improving detection.

**The cost of false positives:**

At a large bank, each alert investigation costs an estimated 20-50 USD in analyst time (15-30 minutes per alert). With hundreds of thousands or millions of alerts per year, the cost is enormous. More importantly, alert fatigue degrades investigator attention, making it more likely that genuinely suspicious activity is missed in the flood of false positives.

### 5.4 Suspicious Activity Reports (SARs)

When an investigation determines that activity is suspicious, the institution files a **Suspicious Activity Report** with the relevant FIU.

In the US, a SAR (FinCEN Form 111) must be filed when the institution "knows, suspects, or has reason to suspect" that a transaction:
- Involves funds derived from illegal activity
- Is designed to evade BSA reporting requirements
- Lacks a lawful purpose or is unusual for the customer
- Involves the use of the institution to facilitate criminal activity

**SAR filing requirements:**

- File within 30 calendar days of initial detection (60 days if no suspect is identified and additional time is needed)
- No dollar threshold for filing (a SAR can be filed on any amount if the activity is suspicious)
- SARs are confidential: the institution cannot tell the customer that a SAR has been filed (the "tipping off" prohibition)
- SARs are filed electronically through FinCEN's BSA E-Filing system

**SAR volume in the US:**

FinCEN received approximately 4.6 million SARs in 2023, up from approximately 2.3 million in 2017. The growth reflects both increased compliance activity and expanding coverage of non-bank institutions (money services businesses, casinos, insurance, crypto).

Law enforcement agencies access SARs through FinCEN's database and use them as intelligence in investigations. SARs have been cited as critical evidence in major cases including terrorism investigations, drug trafficking prosecutions, and public corruption cases. However, the sheer volume means that most SARs are never individually reviewed by law enforcement.

---

## 6. Technical Architecture

The technology stack supporting KYC/AML is complex, spanning identity verification, case management, transaction monitoring, screening, analytics, and reporting. Understanding this stack is essential because technology choices directly affect compliance effectiveness, operational cost, and customer experience.

![KYC/AML technical architecture](diagrams/architecture.svg)

### 6.1 The Core Systems

**Identity Verification Platform (IVP)**

The IVP handles the digital identity verification flow: document capture, OCR, document authenticity checks, biometric matching, liveness detection, and database verification. This is the first system a customer encounters during onboarding.

Leading IVP vendors:

| Vendor | Strengths | Notable Clients |
|--------|-----------|-----------------|
| **Jumio** | Pioneer in AI-powered ID verification; strong global document coverage | Revolut, N26, Uber |
| **Onfido** | AI document verification + biometrics; Atlas AI engine | Revolut, Bitstamp, Zipcar |
| **Socure** | Identity graph approach; strong in US market | Chime, SoFi, Capital One |
| **Mitek** | Mobile capture SDK; strong banking presence | HSBC, TD Bank |
| **Veriff** | Video-based verification with human-in-the-loop; EU-focused | Bolt, Wise |
| **Sumsub** | Full-stack KYC+AML+fraud; fast-growing globally | Binance, OKX, Mercado Libre |
| **Trulioo** | Global business verification; 195 countries; now part of Equifax | Global banks, fintech |
| **Au10tix** | Strong in regulated sectors; BPO heritage | PayPal, Google, Uber |
| **iProov** | Passive liveness; strong in government identity programs | UK Home Office, Eurostar |

**Transaction Monitoring System (TMS)**

The TMS is the core engine that ingests transactions, executes scenarios, generates alerts, and provides case management for investigators.

Leading TMS vendors:

| Vendor | Product | Market Position |
|--------|---------|-----------------|
| **NICE Actimize** | Actimize AML, X-Sight | Dominant in large banks globally |
| **Oracle Financial Services (Mantas)** | OFSAA AML | Major presence in large banks |
| **SAS** | SAS AML | Strong analytics; large bank presence |
| **Verafin (Nasdaq)** | Verafin | Dominant in US community and regional banks |
| **Fiserv** | Financial Crime Risk Management | Integrated with Fiserv core banking |
| **FIS** | FRAML solutions | Integrated with FIS core banking |
| **Featurespace** | ARIC | Adaptive behavioral analytics; UK-based |
| **ThetaRay** | SONAR | AI-native; strong in correspondent banking |
| **ComplyAdvantage** | AML platform | Screening + monitoring for fintechs |
| **Lucinity** | AML platform | Human-AI hybrid; Icelandic |
| **Unit21** | No-code AML | API-first; fintech-focused |

**Screening Platform**

The screening platform checks customers and transactions against sanctions lists, PEP databases, and adverse media. Screening runs at onboarding, periodically, and on every transaction (for sanctions).

Leading screening vendors:

| Vendor | Product | Coverage |
|--------|---------|----------|
| **Refinitiv (LSEG)** | World-Check | 500+ sanctions and watch lists; 3.3M+ profiles |
| **Dow Jones** | Dow Jones Risk & Compliance | Sanctions, PEPs, adverse media; 3M+ profiles |
| **LexisNexis Risk Solutions** | WorldCompliance | Sanctions, PEPs, enforcement |
| **ComplyAdvantage** | Real-time screening | AI-enriched sanctions + PEP + adverse media |
| **Acuris (Moody's)** | RiskScreen | Screening platform used by smaller institutions |
| **Accuity (now LexisNexis)** | Firco (Compliance Link) | Payment screening, sanctions filtering |

**Case Management System (CMS)**

The CMS is the workflow tool where investigators manage alerts, document their analysis, and process SARs. Cases may originate from transaction monitoring alerts, screening hits, referrals from business lines, law enforcement inquiries, or adverse media.

Some TMS vendors include case management (NICE Actimize, Verafin). Others are standalone: **Hyland**, **Appian** (low-code), **Pega** (BPM-based), or custom-built.

### 6.2 Data Architecture

KYC/AML systems require integration of data from many internal and external sources. The data architecture is often the most challenging part of the technology stack.

**Internal data sources:**
- Core banking system (account data, customer master, product data)
- Payment systems (wire transfers, ACH, SWIFT messages, card transactions)
- Trade finance systems
- Wealth management / private banking systems
- Online and mobile banking (login patterns, device data, IP addresses)
- CRM (customer interactions, relationship notes)
- Historical SARs and case data

**External data sources:**
- Sanctions lists (OFAC, EU, UN, HMT)
- PEP databases (Refinitiv, Dow Jones)
- Adverse media feeds
- Corporate registry data (beneficial ownership)
- Credit bureau data
- Government databases (SSA verification, DMV)
- Blockchain analytics (for crypto-related activity)
- Geolocation and IP intelligence
- Device fingerprinting

**Data quality** is a chronic problem. Customer data in legacy core banking systems is often incomplete, inconsistent, or outdated. Names may be transliterated differently across systems. Addresses may be unstructured text. Entity resolution (determining that "John Smith" at "123 Main St" in the core banking system is the same person as "J. Smith" at "123 Main Street" in the wire system) is a non-trivial data engineering challenge.

### 6.3 Rules Engine vs ML-Based Monitoring

Traditional transaction monitoring systems use a **rules engine**: a set of if-then scenarios with configurable parameters (thresholds, time windows, geographic filters).

**Rules-based approach:**

Advantages:
- Easy to understand and explain to regulators
- Deterministic (same input always produces same output)
- Can be directly mapped to specific typologies
- Long regulatory track record

Disadvantages:
- High false positive rates (90-99%)
- Static rules cannot adapt to evolving criminal behavior
- Threshold-based rules are easily evaded by sophisticated launderers
- Adding rules increases complexity and alert volume without proportional improvement

**ML-based approach:**

Modern systems increasingly use machine learning alongside or instead of rules:

- **Supervised models**: trained on historical cases (confirmed SARs, known laundering) to predict which transactions or customers are suspicious
- **Unsupervised models**: clustering and anomaly detection to identify patterns that differ from the norm without labeled training data
- **Network analysis / graph analytics**: analyzing the network of transactions between accounts to identify suspicious structures (layering, funnel accounts, circular flows)
- **Behavioral analytics**: building per-customer behavioral profiles and flagging deviations from expected behavior

**Hybrid approach (most common in practice):**

Most institutions today use a hybrid approach: rules-based monitoring generates alerts, and ML models score and prioritize those alerts. This allows the institution to maintain the regulatory-accepted rules framework while using ML to reduce the false positive burden.

Increasingly, regulators (FinCEN, FCA, MAS, HKMA) have issued guidance encouraging the use of AI/ML in AML, provided that:
- The models are validated and documented
- Outputs are explainable
- Human review remains in the decision loop for SAR filing
- Model performance is monitored for drift and bias

### 6.4 The FRAML Convergence

**FRAML (Fraud + AML)** is the convergence of fraud detection and AML monitoring into a unified platform. Historically, fraud and AML were separate functions with separate systems, separate teams, and separate reporting lines. But they share much of the same data, and criminal activity often involves both fraud and money laundering.

Benefits of FRAML convergence:
- Shared data infrastructure reduces cost
- A holistic view of customer behavior improves detection
- Reduces duplicate alerts across fraud and AML systems
- Faster investigation when fraud and money laundering are connected

Many modern platforms (Featurespace, NICE Actimize, Unit21, Feedzai, SAS) offer combined FRAML capabilities. Organizational convergence (merging fraud and AML teams) is slower because of different regulatory reporting requirements and skill sets.

### 6.5 Cloud and API-First Architecture

Traditional AML systems were deployed on-premises at the bank, often on dedicated hardware. Modern architecture is increasingly cloud-native and API-driven:

- **Cloud deployment**: AWS, Azure, GCP hosting with managed services for compute, storage, and analytics
- **API integration**: identity verification, screening, and monitoring accessed via REST APIs
- **Event-driven architecture**: transactions streamed via Kafka or similar messaging for real-time monitoring
- **Microservices**: individual KYC/AML functions deployed as independent services
- **Data lake/lakehouse**: centralized analytics on Snowflake, Databricks, or similar for investigation and model training

Regulatory concerns about cloud (data residency, third-party risk) have largely been resolved through guidance from major regulators (OCC, FCA, EBA, MAS) that explicitly permit cloud deployment with appropriate controls.

---

## 7. Money Flow and Economics

### 7.1 The Cost of Compliance

KYC/AML compliance is one of the largest cost items in a bank's operating budget after credit losses, technology, and core operations.

**Cost breakdown for a typical mid-size bank:**

| Category | Share of AML Spend | Components |
|----------|--------------------|----|
| Personnel | 50-65% | Investigators, KYC analysts, sanctions analysts, compliance officers, management |
| Technology | 20-30% | TMS, screening, case management, identity verification, data |
| External data | 5-10% | Sanctions lists, PEP databases, adverse media, verification services |
| Training and audit | 3-5% | Annual training, independent testing, external audits |
| Regulatory exam preparation | 2-5% | Responding to examinations, remediation |

**Global spending:**
- Total global AML compliance spending: estimated 50-60B USD annually (LexisNexis Risk Solutions, 2024)
- Average AML compliance cost for a large bank: 500M-1.5B USD per year
- Average cost per SAR: 5,000-15,000 USD (investigation time, filing, QA)
- Average cost per KYC onboarding (corporate): 100-500 USD per customer
- Average cost per KYC onboarding (retail, digital): 5-30 USD per customer

### 7.2 Revenue and Business Model of RegTech

The RegTech industry has grown rapidly as financial institutions seek to reduce compliance costs through technology.

**RegTech business models:**

- **Per-check pricing**: identity verification vendors charge per verification (typically 1-5 USD per ID check for retail, 10-50 USD for business verification)
- **SaaS subscription**: transaction monitoring and screening platforms charge annual licenses based on transaction volume, number of customers, or number of users
- **Data subscription**: sanctions, PEP, and adverse media data providers charge annual subscriptions based on coverage and update frequency
- **Platform + services**: some vendors offer technology plus managed services (outsourced investigation, SAR filing support)
- **Outcome-based pricing**: emerging models that price based on the reduction in false positives or improvement in detection rates

**Market size:** The global RegTech market was estimated at 12-15B USD in 2024 and is projected to grow to 30-40B USD by 2030.

### 7.3 The Cost of Non-Compliance

The economics of AML compliance only make sense in the context of the cost of non-compliance:

- **Direct fines**: can reach billions (see Section 1.7)
- **Consent orders**: restrict business activities, require expensive remediation programs (often 100M+ USD)
- **Loss of correspondent banking**: being cut off from major correspondent banks means losing access to USD clearing and global payments
- **Reputational damage**: customer and investor confidence loss
- **Criminal liability**: individual officers can face prison (rare but increasing)
- **De-chartering**: in extreme cases, the regulator can revoke the bank's charter

The expected cost of non-compliance (probability of detection x magnitude of penalty) now clearly exceeds the cost of compliance for most institutions. This was not always the case; before the HSBC and BNP Paribas fines of 2012-2014, penalties were often seen as a cost of doing business.

### 7.4 Who Pays

Ultimately, the cost of KYC/AML compliance is passed on to customers and the broader economy through:

- Higher banking fees
- Slower onboarding and transaction processing
- Reduced access to banking services (de-risking)
- Higher transaction costs for cross-border payments
- The "compliance premium" in financial product pricing

The World Bank estimates that AML compliance adds 1-5% to the cost of remittances, which disproportionately affects low-income populations who depend on cross-border money transfers.

---

## 8. Sanctions, PEPs, and Screening

Sanctions screening and PEP identification are distinct from transaction monitoring but equally critical. They represent "bright line" prohibitions where the answer is binary: either a customer or transaction is sanctioned (and must be blocked) or it is not.

![Sanctions screening flow](diagrams/sanctions-screening.svg)

### 8.1 Sanctions Regimes

**Sanctions** are restrictions imposed by governments and international organizations on specific countries, entities, individuals, vessels, and activities. The purpose is to change behavior (e.g., nuclear non-proliferation), punish wrongdoing, or protect national security.

**Major sanctions authorities:**

| Authority | List | Scope |
|-----------|------|-------|
| **US OFAC (Office of Foreign Assets Control)** | SDN List (Specially Designated Nationals), Sectoral Sanctions, Non-SDN Lists | Global reach via USD transactions; any institution touching the US financial system is subject to OFAC |
| **EU Council** | EU Consolidated List | All EU member states; implemented through national regulators |
| **UN Security Council** | UN Consolidated List | All UN member states; implemented through national legislation |
| **HM Treasury (UK)** | UK Sanctions List (post-Brexit, separate from EU) | UK financial system |
| **OFSI (UK Office of Financial Sanctions Implementation)** | Implements UK financial sanctions | UK jurisdiction |
| **Swiss SECO** | Swiss sanctions list | Swiss financial system |
| **National authorities** | Various (Canada OSFI, Australia DFAT, Japan MoF) | National jurisdiction |

**Types of sanctions:**

- **Comprehensive sanctions**: broad restrictions on all transactions with a country (e.g., North Korea, Iran under certain programs, Cuba, Syria, Crimea/Russia)
- **Sectoral sanctions**: restrictions on specific sectors of a country's economy (e.g., Russian energy sector, Venezuelan oil sector)
- **Targeted / smart sanctions**: restrictions on specific individuals and entities (e.g., oligarchs, shell companies, terrorist organizations)
- **Secondary sanctions**: US sanctions that apply to non-US entities that transact with sanctioned persons (controversial; Europe has adopted "blocking statutes" to resist secondary sanctions)

### 8.2 OFAC and Extraterritorial Reach

OFAC is unique in its extraterritorial reach. Because the US dollar is the dominant reserve currency and most international USD transactions clear through US correspondent banks, OFAC's jurisdiction extends far beyond US borders. Any financial institution that processes a USD transaction or has any nexus to the US financial system is potentially subject to OFAC enforcement.

This extraterritorial reach is why BNP Paribas (a French bank) was fined 8.97 billion USD by US authorities for processing transactions with Sudan, Cuba, and Iran - transactions that were legal under French and EU law but violated US sanctions.

**OFAC's 50% Rule**: an entity that is owned 50% or more (individually or in aggregate) by one or more sanctioned persons is itself treated as sanctioned, even if the entity is not explicitly listed. This means institutions must trace beneficial ownership of counterparties to determine if they are indirectly sanctioned.

### 8.3 Politically Exposed Persons (PEPs)

A **Politically Exposed Person (PEP)** is an individual who holds or has recently held a prominent public function, along with their family members and close associates.

**PEP categories:**

- **Foreign PEPs**: always high-risk under FATF standards; require EDD
- **Domestic PEPs**: treated differently by jurisdiction (some require EDD, some apply a risk-based approach)
- **International organization PEPs**: senior officials of the UN, World Bank, IMF, etc.
- **Family members and close associates (RCAs)**: spouses, children, parents, and known business associates of PEPs

**Why PEPs matter for AML:**

PEPs have access to public resources, decision-making authority, and networks that can facilitate corruption. The kleptocracy problem (government officials looting state resources and hiding the proceeds in foreign banks and real estate) is one of the most significant AML challenges globally.

High-profile PEP cases include:
- **1MDB (Malaysia)**: former PM Najib Razak and associates diverted 4.5B+ USD from a sovereign wealth fund through a network of shell companies, banks, and luxury purchases
- **Teodorin Obiang (Equatorial Guinea)**: the president's son used corrupt proceeds to buy a 30M USD Malibu mansion, Ferraris, and Michael Jackson memorabilia
- **Petrobras / Lava Jato (Brazil)**: billions in bribes and kickbacks involving Brazilian politicians and Petrobras executives
- **Luanda Leaks (Angola)**: Isabel dos Santos, daughter of the former president, accused of using her father's power to extract hundreds of millions from Angolan state companies

### 8.4 Screening Technology

**Name matching** is the core technical challenge in sanctions and PEP screening. Sanctions lists contain names in various scripts, transliterations, and formats. Customers' names in bank systems may be entered differently. The screening system must identify potential matches despite:

- Spelling variations (Mohammed, Muhammad, Mohamed, Muhammed)
- Transliteration differences (Cyrillic, Arabic, Chinese to Latin script)
- Name order differences (family name first vs. given name first)
- Abbreviations and initials
- Common names generating many false matches
- Aliases and known-as names

**Matching algorithms used:**

- **Exact match**: direct string comparison (catches only identical names)
- **Fuzzy matching**: algorithms like Jaro-Winkler, Levenshtein distance, Soundex, Double Metaphone
- **Token-based matching**: breaking names into tokens and comparing token sets
- **Phonetic matching**: matching based on pronunciation rather than spelling
- **ML-based matching**: trained models that score matches based on multiple features (name, date of birth, nationality, address)

A well-tuned screening system aims for a false positive rate of 5-15% on name screening (much lower than transaction monitoring). The challenge is balancing false positives against the risk of missing a true sanctioned entity.

---

## 9. Regulation and Compliance

### 9.1 The Global Regulatory Framework

KYC/AML regulation operates at three levels: international standards (FATF), regional/supranational implementation (EU Directives, regional bodies), and national law and regulation.

### 9.2 United States

The US regulatory framework is layered and involves multiple agencies:

**FinCEN (Financial Crimes Enforcement Network):** the FIU of the United States, within the Department of the Treasury. FinCEN issues regulations under the BSA, receives and analyzes SARs and CTRs, administers the BSA E-Filing system, and maintains the beneficial ownership database under the CTA.

**Banking regulators (OCC, FDIC, Fed, NCUA):** examine banks for BSA/AML compliance as part of their safety and soundness examination. The **FFIEC BSA/AML Examination Manual** is the bible of AML examination - a comprehensive guide used by examiners and compliance officers.

**OFAC:** administers sanctions programs and brings enforcement actions for sanctions violations.

**SEC and CFTC:** regulate broker-dealers and futures commission merchants for AML compliance.

**State regulators:** state banking departments and money transmitter regulators (e.g., NY DFS) overlay additional requirements.

**Key US AML laws and rules:**

| Law/Rule | Year | Key Provisions |
|----------|------|----------------|
| Bank Secrecy Act (BSA) | 1970 | CTR filing, record-keeping, foreign account reporting |
| Money Laundering Control Act | 1986 | Criminalizes money laundering |
| Annunzio-Wylie Act | 1992 | SAR requirements, penalties for non-compliance |
| Money Laundering Suppression Act | 1994 | Extends BSA to non-bank financial institutions |
| USA PATRIOT Act | 2001 | CIP, EDD, 314 information sharing, Section 311 special measures |
| Intelligence Reform Act | 2004 | Strengthens terrorist financing provisions |
| FinCEN CDD Rule | 2016/2018 | Beneficial ownership identification |
| Anti-Money Laundering Act (AMLA) | 2020 | Modernizes BSA, establishes national AML priorities, whistleblower provisions |
| Corporate Transparency Act (CTA) | 2021/2024 | Beneficial ownership reporting to FinCEN |

### 9.3 European Union

The EU has progressively strengthened its AML framework through a series of Anti-Money Laundering Directives:

- **1AMLD (1991)**: first EU directive on money laundering
- **2AMLD (2001)**: expanded scope to include non-financial businesses
- **3AMLD (2005)**: introduced risk-based approach
- **4AMLD (2015/2017)**: beneficial ownership registers, risk assessments
- **5AMLD (2018/2020)**: public access to beneficial ownership registers, crypto regulation
- **6AMLD (2018/2020)**: harmonized predicate offenses, extended criminal liability

**The 2024 AML Package**: The EU agreed on a transformative AML package that creates:

1. **AMLA (Anti-Money Laundering Authority)**: a new EU-level supervisory authority, headquartered in Frankfurt, that will directly supervise the highest-risk cross-border financial institutions and coordinate national FIUs. This is a significant step toward centralized EU AML supervision.
2. **AMLR (Anti-Money Laundering Regulation)**: a directly applicable regulation (not a directive requiring national transposition) that creates a single EU AML rulebook, including a 10,000 EUR cash payment cap, harmonized CDD requirements, and beneficial ownership rules.
3. **6th AMLD (revised)**: updates the directive for remaining areas requiring national transposition.

### 9.4 United Kingdom

Post-Brexit, the UK maintains its own AML framework:

- **Money Laundering, Terrorist Financing and Transfer of Funds (Information on the Payer) Regulations 2017 (MLR 2017)**: the primary AML regulation, derived from 4AMLD/5AMLD
- **Proceeds of Crime Act 2002 (POCA)**: criminalizes money laundering
- **Terrorism Act 2000**: criminalizes terrorism financing
- **Sanctions and Anti-Money Laundering Act 2018 (SAMLA)**: post-Brexit sanctions framework
- **FCA** supervises financial services firms for AML; **HMRC** supervises certain non-financial businesses

The UK's **National Crime Agency (NCA)** houses the UK Financial Intelligence Unit (UKFIU) and leads financial crime investigations.

### 9.5 Asia-Pacific

- **Singapore (MAS)**: one of the most stringent AML regimes in Asia; MAS Notice 626 for banks
- **Hong Kong (HKMA)**: AML/CFT guidelines aligned with FATF; important gateway to China
- **Japan (FSA/JAFIC)**: strengthening AML after FATF mutual evaluation criticism
- **Australia (AUSTRAC)**: aggressive enforcement; record fines against Commonwealth Bank and Westpac
- **India (RBI, FIU-IND)**: Prevention of Money Laundering Act 2002; rapidly expanding digital KYC (eKYC with Aadhaar)

### 9.6 Crypto and Virtual Assets

FATF's **Recommendation 15 (updated 2019)** and the **Travel Rule** guidance require that Virtual Asset Service Providers (VASPs) implement full KYC/AML programs and transmit originator and beneficiary information with crypto transfers above a threshold (the "Travel Rule").

Implementation varies widely:
- US: FinCEN treats crypto exchanges as money service businesses; BSA applies in full
- EU: Markets in Crypto-Assets Regulation (MiCA, effective 2024) and Transfer of Funds Regulation require KYC and Travel Rule compliance
- Singapore: Payment Services Act covers crypto
- Japan: One of the first to regulate crypto exchanges for AML

**Blockchain analytics** has emerged as a key tool: Chainalysis, Elliptic, TRM Labs, CipherTrace (Mastercard) analyze blockchain transactions to trace flows, identify sanctioned wallets, and cluster addresses to known entities.

### 9.7 Regulatory Examination and Enforcement

How regulators examine AML programs:

1. **Risk assessment review**: does the institution have a documented, current BSA/AML risk assessment?
2. **Program review**: are the five pillars in place and adequately resourced?
3. **CDD/KYC testing**: sample customer files to verify identity verification, risk rating, and beneficial ownership documentation
4. **Transaction monitoring testing**: evaluate scenarios, thresholds, alert volumes, false positive rates, SAR filing decisions
5. **Sanctions screening testing**: verify list coverage, matching algorithms, hit disposition
6. **Training review**: is training current, relevant, and reaching all required personnel?
7. **Independent testing**: has the program been independently tested within the past 12-18 months?
8. **Board reporting**: is the board informed of program status, risks, and issues?

Examination findings range from:
- **No issues**: clean bill of health (rare for large institutions)
- **Matters Requiring Attention (MRA)**: deficiencies that must be corrected
- **Matters Requiring Immediate Attention (MRIA)**: serious deficiencies requiring urgent correction
- **Formal enforcement action**: consent order, cease and desist, civil money penalty

---

## 10. Comparisons Across Industries and Jurisdictions

### 10.1 Banking vs Fintech vs Crypto

| Dimension | Traditional Bank | Fintech / Neobank | Crypto Exchange |
|-----------|------------------|--------------------|----|
| Regulatory status | Chartered, regulated by banking regulators | Often licensed as MSB or e-money institution; may partner with bank | VASP, MSB, or specific crypto license |
| KYC approach | Branch-based and digital; legacy systems | Digital-first; API-based identity verification | Digital-only; varying depth |
| Transaction monitoring | Enterprise TMS (NICE Actimize, SAS) | Cloud-native (Unit21, Sardine, Alloy) | Blockchain analytics + TMS |
| Key challenge | Legacy data, false positives, cost | Scale with lean team, regulatory credibility | Pseudonymous users, cross-chain tracing, DeFi |
| SAR volume | High (thousands to tens of thousands per year) | Growing (hundreds to thousands) | Growing rapidly |
| Typical fine for failures | Hundreds of millions to billions | Tens of millions (growing) | Hundreds of millions to billions (Binance) |

### 10.2 Jurisdictional Comparison

| Dimension | United States | European Union | United Kingdom | Singapore |
|-----------|---------------|----------------|----------------|-----------|
| Primary law | BSA + PATRIOT Act + AMLA | AML Directives + AMLR (2024) | MLR 2017 + POCA | Corruption, Drug Trafficking and Other Serious Crimes Act + MAS Notices |
| FIU | FinCEN | National FIUs (coordinated by AMLA) | NCA/UKFIU | STRO (Suspicious Transaction Reporting Office) |
| Beneficial ownership | CTA (2024) - FinCEN registry | Central registers per member state | Companies House PSC register | ACRA register |
| Cash reporting | 10,000 USD CTR | 10,000 EUR (AMLR cap on cash payments) | 10,000 GBP (proposed) | 20,000 SGD (cash transaction reporting) |
| Crypto regulation | BSA applies to exchanges as MSBs | MiCA + Transfer of Funds Regulation | FCA registration | Payment Services Act |
| Enforcement culture | Aggressive (multi-billion fines) | Growing (ING, Danske Bank) | Strong (FCA, NCA) | Very strict (MAS) |
| Risk-based approach | Yes (FFIEC manual) | Yes (explicit in directives) | Yes (FCA guidance) | Yes (MAS guidance) |

### 10.3 Lines of Defense: In-House vs Outsourced

Many institutions outsource parts of their KYC/AML function:

**Commonly outsourced:**
- KYC onboarding and periodic review (to KYC utilities like IHS Markit KYC, Refinitiv Org ID, Swift KYC Registry, or BPO providers like Accenture, Genpact, WNS)
- Alert investigation (L1 triage outsourced to BPO, L2/L3 investigation kept in-house)
- Screening operations (managed by the screening vendor)
- SAR drafting (occasionally outsourced for volume, though filing decisions remain in-house)

**Rarely outsourced:**
- SAR filing decisions (regulatory responsibility remains with the institution)
- BSA/AML officer role
- Program design and risk appetite setting
- Board reporting

**KYC utilities** deserve special mention. The idea is that instead of every bank performing KYC on the same corporate customer independently, a shared utility collects and maintains the KYC data once and makes it available to all participating banks. Swift's KYC Registry, Refinitiv Org ID, and GLEIF (Global Legal Entity Identifier Foundation) are examples. Adoption has been slow because banks are reluctant to rely on another institution's verification and because regulatory requirements vary.

---

## 11. Modern Developments - AI, RegTech, and Digital Identity

### 11.1 AI and Machine Learning in KYC/AML

AI/ML adoption in KYC/AML is accelerating but uneven. The use cases range from mature and widely deployed to experimental.

**Mature use cases:**

- **Identity document verification**: computer vision models that detect document types, extract fields via OCR, check security features, and detect forgery. Accuracy rates exceed 99% for well-photographed documents from common countries.
- **Biometric matching**: facial recognition comparing a selfie to an ID photo. Liveness detection (distinguishing a real face from a photo, video, or mask) has become standard.
- **Alert prioritization**: ML models scoring transaction monitoring alerts to help investigators focus on the highest-risk alerts first. This is the single highest-ROI AI application in AML, reducing wasted investigation time by 30-60% in published case studies.
- **Name matching**: ML-enhanced screening that reduces false positives while maintaining recall against sanctions lists.

**Growing use cases:**

- **Anomaly detection in transaction monitoring**: unsupervised ML that identifies unusual patterns without predefined rules. Particularly effective for detecting novel typologies that rules do not cover.
- **Network analysis**: graph neural networks and graph analytics that map transaction networks to identify layering, funnel accounts, and suspicious relationship structures.
- **NLP for adverse media screening**: LLMs and NLP models that scan and classify news articles to identify relevant adverse information about customers.
- **Automated SAR narrative generation**: LLMs generating draft SAR narratives from case data, reducing the time investigators spend on documentation.
- **Dynamic risk scoring**: continuously updated customer risk scores based on real-time behavioral data rather than static periodic reviews.

**Emerging use cases:**

- **Synthetic identity detection**: ML models identifying synthetic identities (fabricated identities built from a mix of real and fake information - a growing fraud and AML concern).
- **Generative AI for investigation support**: LLM-based copilots that help investigators query case data, summarize transaction histories, and identify relevant patterns.
- **Perpetual KYC (pKYC)**: replacing periodic reviews with continuous, event-driven monitoring that triggers reviews only when risk indicators change.

### 11.2 Perpetual KYC (pKYC)

Traditional KYC operates on a periodic review cycle (1-3-5 years based on risk). Between reviews, the customer's risk profile is essentially static. Perpetual KYC replaces this with continuous monitoring of external data sources (corporate registries, adverse media, sanctions updates, credit changes, behavioral data) that triggers a review only when a material change is detected.

**Benefits:**
- More timely detection of risk changes
- Reduced periodic review workload (most customers have no material changes between reviews)
- Better resource allocation (focus on customers with actual risk changes)

**Challenges:**
- Requires integration with many external data sources
- Data quality and reliability of triggers
- Regulatory acceptance (some regulators still expect periodic reviews on a fixed schedule)

Vendors supporting pKYC include **Encompass Corporation**, **Fenergo**, **Pega KYC**, **ComplyAdvantage**, and **Actico**.

### 11.3 Digital Identity and Verifiable Credentials

The future of KYC may be fundamentally reshaped by **digital identity** systems that allow individuals to prove their identity once and reuse that proof across institutions.

**Government digital identity programs:**

- **India Aadhaar**: biometric identity for 1.3B+ people; used for eKYC in banking and telecom
- **EU eIDAS 2.0 and the EU Digital Identity Wallet**: EU-wide digital identity framework, expected to enable cross-border KYC
- **UK Digital Identity and Attributes Trust Framework (DIATF)**: standards for digital identity providers
- **Singapore SingPass**: national digital identity used for banking, government, and private sector
- **Estonia e-Residency**: digital identity for non-residents to access Estonian services

**Verifiable credentials** are a W3C standard for cryptographically signed, tamper-proof digital claims (e.g., "this person's name is X and their date of birth is Y, as attested by government Z"). Combined with decentralized identifiers (DIDs) and digital wallets, verifiable credentials could allow a customer to share their KYC data with a new bank without repeating the verification process.

The vision is "verify once, use many times." The reality is that adoption is early, standards are still evolving, and regulatory acceptance varies.

### 11.4 The FATF Travel Rule and Crypto Compliance

The **Travel Rule** (FATF Recommendation 16) requires that when a financial institution sends a wire transfer, it must include the originator's name, account number, and address (or equivalent), and the beneficiary's name and account number. The receiving institution must verify this information.

Applied to crypto (updated 2019), the Travel Rule requires VASPs to collect and transmit originator and beneficiary information for virtual asset transfers above a threshold (1,000 USD/EUR in many jurisdictions, 3,000 USD in the US).

**Technical challenge**: unlike traditional wire transfers that flow through messaging networks (SWIFT), crypto transfers are peer-to-peer on a blockchain with no built-in messaging layer. Travel Rule compliance requires a separate messaging layer between VASPs.

**Travel Rule protocol providers:**

- **TRISA (Travel Rule Information Sharing Architecture)**: open-source protocol
- **TRP (Travel Rule Protocol)**: developed by a consortium of VASPs
- **OpenVASP**: open-source protocol
- **Notabene**: commercial platform for Travel Rule compliance
- **Sygna Bridge** (CoolBitX): Asia-focused Travel Rule solution
- **Shyft Network**: blockchain-based compliance layer

Adoption is growing but fragmented, with different VASPs supporting different protocols.

### 11.5 Generative AI and LLMs in AML

The latest wave of innovation applies generative AI and large language models to AML workflows:

**Established applications:**
- SAR narrative generation from structured case data
- Summarization of investigation files and customer dossiers
- Adverse media screening and classification
- Policy and regulation Q&A for compliance teams

**Emerging applications:**
- Investigation copilots that help analysts query databases and interpret patterns
- Automated risk assessment narratives
- Regulatory change monitoring and impact analysis
- Training content generation

**Risks and limitations:**
- Hallucination is dangerous in a regulatory context where facts must be verifiable
- Explainability requirements are difficult with black-box LLMs
- Data privacy concerns (sending customer data to third-party LLM providers)
- Regulatory uncertainty about LLM use in compliance decisions

Major vendors (NICE Actimize, Verafin, SAS) are integrating generative AI features. Startups like Lucinity, Resistant AI, and Hummingbird are building AI-native AML platforms.

---

## 12. Appendix

### 12.1 Key Terminology

| Term | Definition |
|------|------------|
| **AML** | Anti-Money Laundering: the set of laws, regulations, and procedures to prevent, detect, and report money laundering |
| **BSA** | Bank Secrecy Act: the foundational US AML law (1970) |
| **CDD** | Customer Due Diligence: the process of understanding a customer's identity, activity, and risk profile |
| **CFT** | Countering the Financing of Terrorism |
| **CIP** | Customer Identification Program: the US regulatory requirement to verify customer identity at account opening |
| **CTR** | Currency Transaction Report: filed for cash transactions exceeding 10,000 USD |
| **De-risking** | Terminating banking relationships with entire categories of customers or jurisdictions to reduce AML risk |
| **EDD** | Enhanced Due Diligence: additional KYC measures for high-risk customers |
| **FATF** | Financial Action Task Force: the international standard-setter for AML/CFT |
| **FinCEN** | Financial Crimes Enforcement Network: the US FIU and BSA administrator |
| **FIU** | Financial Intelligence Unit: the government agency that receives and analyzes suspicious transaction reports |
| **FRAML** | Fraud + AML convergence in a unified platform |
| **Grey list** | FATF list of jurisdictions under increased monitoring for AML/CFT deficiencies |
| **KYC** | Know Your Customer: the process of identifying and verifying customer identity and assessing risk |
| **Layering** | The second stage of money laundering: moving funds through complex transactions to distance them from their source |
| **MLRO** | Money Laundering Reporting Officer (UK equivalent of BSA/AML officer) |
| **MRA** | Matters Requiring Attention: regulatory examination finding |
| **OFAC** | Office of Foreign Assets Control: US sanctions administrator |
| **Placement** | The first stage of money laundering: introducing cash or illicit funds into the financial system |
| **PEP** | Politically Exposed Person: individual holding a prominent public function |
| **pKYC** | Perpetual KYC: continuous monitoring replacing periodic reviews |
| **SAR** | Suspicious Activity Report: filed with the FIU when suspicious activity is detected |
| **SDD** | Simplified Due Diligence: reduced KYC measures for low-risk customers |
| **SDN** | Specially Designated Nationals: OFAC's primary sanctions list |
| **Structuring** | Breaking transactions into smaller amounts to evade reporting thresholds (also called "smurfing") |
| **STR** | Suspicious Transaction Report (used in some jurisdictions instead of SAR) |
| **Tipping off** | Illegally informing a customer that a SAR has been filed or an investigation is underway |
| **Travel Rule** | FATF requirement to transmit originator and beneficiary information with wire/crypto transfers |
| **Typology** | A known pattern or method of money laundering or terrorism financing |
| **UBO** | Ultimate Beneficial Owner: the natural person who ultimately owns or controls a legal entity |
| **VASP** | Virtual Asset Service Provider: crypto exchange or wallet provider subject to AML regulation |

### 12.2 Architecture Diagrams

| Diagram | Source | Description |
|---------|--------|-------------|
| Participants | [`diagrams/participants.mmd`](diagrams/participants.mmd) | KYC/AML ecosystem participants and relationships |
| KYC Lifecycle | [`diagrams/kyc-lifecycle.mmd`](diagrams/kyc-lifecycle.mmd) | End-to-end KYC process from onboarding to exit |
| Transaction Monitoring | [`diagrams/transaction-monitoring.mmd`](diagrams/transaction-monitoring.mmd) | Alert generation, investigation, and SAR filing flow |
| Architecture | [`diagrams/architecture.mmd`](diagrams/architecture.mmd) | Core systems: IVP, TMS, screening, case management |
| Sanctions Screening | [`diagrams/sanctions-screening.mmd`](diagrams/sanctions-screening.mmd) | Screening flow with list matching and disposition |
| Money Laundering Stages | [`diagrams/laundering-stages.mmd`](diagrams/laundering-stages.mmd) | Placement, layering, integration |
| Three Lines of Defense | [`diagrams/three-lines-defense.mmd`](diagrams/three-lines-defense.mmd) | Organizational model for AML compliance |
| Risk Rating | [`diagrams/risk-rating.mmd`](diagrams/risk-rating.mmd) | Customer risk assessment factors and outcomes |
| Regulatory Landscape | [`diagrams/regulatory-landscape.mmd`](diagrams/regulatory-landscape.mmd) | US and global regulatory agencies and their roles |
| FATF Framework | [`diagrams/fatf-framework.mmd`](diagrams/fatf-framework.mmd) | FATF standards, mutual evaluation, grey/black lists |
| Digital Onboarding | [`diagrams/digital-onboarding.mmd`](diagrams/digital-onboarding.mmd) | Modern digital KYC flow with document verification and biometrics |
| Correspondent Banking | [`diagrams/correspondent-banking.mmd`](diagrams/correspondent-banking.mmd) | Correspondent-respondent relationship and AML risks |
| FRAML Convergence | [`diagrams/framl-convergence.mmd`](diagrams/framl-convergence.mmd) | Fraud and AML unified detection architecture |
| Travel Rule Crypto | [`diagrams/travel-rule-crypto.mmd`](diagrams/travel-rule-crypto.mmd) | FATF Travel Rule implementation for virtual asset transfers |

### 12.3 Reference Tables

**FATF Grey List (Jurisdictions Under Increased Monitoring) as of early 2025:**

Algeria, Angola, Bulgaria, Burkina Faso, Cameroon, Cote d'Ivoire, Croatia, Democratic Republic of Congo, Haiti, Kenya, Lebanon, Mali, Monaco, Mozambique, Namibia, Nigeria, South Africa, South Sudan, Syria, Tanzania, Venezuela, Vietnam, Yemen

(This list changes at each FATF plenary; check fatf-gafi.org for current status)

**FATF Black List (High-Risk Jurisdictions Subject to a Call for Action):**

North Korea (DPRK), Iran, Myanmar

**Selected OFAC Sanctions Programs:**

| Program | Target |
|---------|--------|
| Cuba | Comprehensive |
| Iran | Comprehensive (with limited humanitarian exceptions) |
| North Korea (DPRK) | Comprehensive |
| Syria | Comprehensive |
| Russia/Ukraine-related | Sectoral + targeted (post-2014 and expanded post-2022) |
| Venezuela | Targeted + sectoral |
| China/Hong Kong-related | Targeted |
| Balkans | Targeted |
| Counter Narcotics | Targeted (Kingpin Act designations) |
| Counter Terrorism | Targeted (FTO, SDGT designations) |
| Cyber-related | Targeted |
| Global Magnitsky | Targeted (human rights, corruption) |

---

## 13. Key Takeaways

1. **KYC/AML is a lifecycle, not a checkbox.** Identity verification at account opening is one step. The real work is ongoing: transaction monitoring, periodic reviews, sanctions screening, and risk reassessment throughout the customer relationship. Institutions that treat KYC as a one-time onboarding exercise will fail regulatory examinations.

2. **The false positive problem is the central technical challenge.** Transaction monitoring systems generate 90-99% false positive alerts, overwhelming investigators and burying genuine suspicious activity. Every major technology innovation in AML, from ML-based alert scoring to network analytics, is ultimately about reducing false positives while maintaining detection rates.

3. **Sanctions screening is a bright line; AML monitoring is a gradient.** Sanctions compliance is binary: a transaction is either sanctioned (and must be blocked) or it is not. AML compliance is probabilistic: no system catches everything, and the standard is a reasonably designed and effectively implemented program. Confusing these two standards leads to either excessive risk-aversion or dangerous complacency.

4. **The cost of non-compliance now clearly exceeds the cost of compliance.** Multi-billion-dollar fines (HSBC, BNP Paribas, Binance, TD Bank), personal criminal liability for officers, and loss of correspondent banking relationships have made the economics of AML compliance unambiguous for any institution doing the math.

5. **Beneficial ownership is the new frontier.** Shell companies and opaque ownership structures have been the primary tool for hiding illicit funds. The US Corporate Transparency Act, EU beneficial ownership registers, and UK Register of Overseas Entities are closing this gap, but implementation and enforcement remain challenging.

6. **De-risking is an unintended consequence with real humanitarian cost.** When global banks sever correspondent relationships with entire jurisdictions to avoid AML risk, the result is reduced financial access for millions of people, especially in developing countries. Regulators and FATF acknowledge this problem but have not solved it.

7. **Crypto is not beyond AML; it is increasingly within it.** Major jurisdictions now apply full KYC/AML requirements to crypto exchanges, and blockchain analytics makes crypto transactions more traceable than cash in many respects. The FATF Travel Rule is being implemented, and MiCA in the EU creates a comprehensive regulatory framework.

8. **AI is augmenting, not replacing, human investigators.** ML improves alert prioritization, document verification, and anomaly detection. LLMs help with SAR drafting and adverse media screening. But SAR filing decisions, EDD judgments, and program design still require human expertise and regulatory accountability. The human-in-the-loop is not going away.

9. **Data quality is the hidden bottleneck.** The most sophisticated AI model cannot compensate for incomplete, inconsistent, or outdated customer data in legacy core banking systems. Entity resolution, address normalization, and data lineage are unsexy but critical foundations.

10. **Perpetual KYC will replace periodic reviews.** The current model of reviewing every customer on a 1-3-5 year cycle regardless of whether anything has changed is wasteful. Event-driven, continuous monitoring that triggers reviews only when risk indicators change is more effective and more efficient. Regulatory acceptance is growing.

11. **International coordination is improving but still fragmented.** FATF sets standards, but implementation varies dramatically across jurisdictions. The EU's new AMLA centralizes supervision within the EU for the first time. Cross-border information sharing (FATF Recommendation 40, Egmont Group) is improving but remains slow compared to the speed of financial crime.

12. **The ultimate measure of AML effectiveness is not the number of SARs filed or the amount spent on compliance. It is the amount of illicit money that is actually prevented from entering or moving through the financial system.** By that measure, with only 1% of illicit flows intercepted, the industry has enormous room for improvement. The question is whether the next generation of technology, regulation, and international cooperation can close that gap.
