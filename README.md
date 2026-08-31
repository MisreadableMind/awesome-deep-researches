# 🧠 awesome-deep-researches

> **Stop spending compute on something someone already researched.**

The deep-dive documents we wish existed before we started building. Each one goes from founding history to wire-level protocols, 50-100K+ tokens of *"how does this actually work?"*

📖 **Markdown** for reading on GitHub · 🌐 **Interactive HTML** with dark mode, search & zoomable diagrams · 📊 **Mermaid source files** for every architecture and flow

---

## 📚 What's Inside

### 💳 [`payment-systems/`](payment-systems/) — How money moves

| Topic | 📊 Diagrams | Status |
|-------|:-----------:|--------|
| [SWIFT & SEPA](payment-systems/swift-and-sepa/) | 12 | ✅ Done |
| [Visa & Mastercard](payment-systems/visa-and-mastercard/) | 13 | ✅ Done |
| [ACH / Fedwire / CHIPS: US domestic rails](payment-systems/ach-fedwire-chips/) | 16 | ✅ Done |
| [Real-Time Payments: FedNow, UPI, Pix, Faster Payments](payment-systems/real-time-payments/) | 20 | ✅ Done |
| [Mobile Wallets: Apple Pay, Google Pay internals](payment-systems/mobile-wallets/) | 13 | ✅ Done |
| [Buy Now Pay Later: Klarna, Affirm underwriting](payment-systems/buy-now-pay-later/) | 13 | ✅ Done |
| [Cross-border Remittance: Wise, Western Union](payment-systems/cross-border-remittance/) | 16 | ✅ Done |

### 🏦 [`banking-infrastructure/`](banking-infrastructure/) — How banks work internally

| Topic | 📊 | Status |
|-------|:-:|--------|
| [Commercial Banks: fractional reserve, balance sheets, lending](banking-infrastructure/commercial-banks/) | 20 | ✅ Done |
| [Central Banking & Monetary Policy: Fed, ECB, rate mechanics](banking-infrastructure/central-banking/) | 16 | ✅ Done |
| [Core Banking Systems: Temenos, FIS, Mambu ledger architecture](banking-infrastructure/core-banking-systems/) | 16 | ✅ Done |
| [KYC / AML Systems: identity verification, transaction monitoring](banking-infrastructure/kyc-aml-systems/) | 14 | ✅ Done |
| [Credit Scoring: FICO, credit bureaus, scoring models](banking-infrastructure/credit-scoring/) | 16 | ✅ Done |
| [Deposit Insurance: FDIC, DGS](banking-infrastructure/deposit-insurance/) | 16 | ✅ Done |

### 📈 [`capital-markets/`](capital-markets/) — How securities are traded, cleared, settled

| Topic | 📊 | Status |
|-------|:-:|--------|
| [Stock Exchanges: NYSE, NASDAQ order matching & order books](capital-markets/stock-exchanges/) | 16 | ✅ Done |
| [FIX Protocol & Trading Infrastructure](capital-markets/fix-protocol/) | 16 | ✅ Done |
| [Clearing & Settlement: DTCC, CCP, T+1](capital-markets/clearing-and-settlement/) | 19 | ✅ Done |
| [Bond Markets: government, corporate, yield curves](capital-markets/bond-markets/) | 14 | ✅ Done |
| [Options & Derivatives: pricing, Greeks, exchange mechanics](capital-markets/options-and-derivatives/) | 21 | ✅ Done |
| [High-Frequency Trading: co-location, market making, latency](capital-markets/high-frequency-trading/) | 16 | ✅ Done |
| [Index Funds & ETFs: creation/redemption, tracking](capital-markets/index-funds-and-etfs/) | 16 | ✅ Done |

### ⛓️ [`crypto-and-blockchain/`](crypto-and-blockchain/) — How decentralized systems work

| Topic | 📊 | Status |
|-------|:-:|--------|
| [Bitcoin Protocol: UTXO, mining, consensus, mempool](crypto-and-blockchain/bitcoin-protocol/) | 16 | ✅ Done |
| [Ethereum & EVM: accounts, gas, smart contracts](crypto-and-blockchain/ethereum-and-evm/) | 16 | ✅ Done |
| [Layer 2 Solutions: Lightning Network, rollups, state channels](crypto-and-blockchain/layer-2-solutions/) | 16 | ✅ Done |
| [Stablecoins: USDC, USDT reserve mechanics, minting/burning](crypto-and-blockchain/stablecoins/) | 16 | ✅ Done |
| [DeFi Protocols: AMMs, lending pools, liquidation engines](crypto-and-blockchain/defi-protocols/) | 16 | ✅ Done |
| [Bridges & Cross-chain: how assets move between chains](crypto-and-blockchain/bridges-and-cross-chain/) | 16 | ✅ Done |

### 🛡️ [`insurance/`](insurance/) — How risk is pooled, priced, transferred

| Topic | 📊 | Status |
|-------|:-:|--------|
| [Insurance Underwriting: risk pools, premium pricing](insurance/underwriting/) | 14 | ✅ Done |
| [Reinsurance: Lloyd's, treaty vs facultative](insurance/reinsurance/) | 16 | ✅ Done |
| [Claims Processing: FNOL, adjustment, subrogation](insurance/claims-processing/) | 17 | ✅ Done |

### ☁️ [`cloud-and-infrastructure/`](cloud-and-infrastructure/) — How cloud platforms operate

| Topic | 📊 | Status |
|-------|:-:|--------|
| [AWS / GCP / Azure Architecture: regions, AZs, control planes](cloud-and-infrastructure/cloud-provider-architecture/) | 16 | ✅ Done |
| [CDNs: Cloudflare, Akamai caching, edge routing, Anycast](cloud-and-infrastructure/cdns/) | 13 | ✅ Done |
| [DNS: resolution chain, registrars, root servers](cloud-and-infrastructure/dns/) | 17 | ✅ Done |
| [Container Orchestration: Kubernetes scheduler, etcd, kubelet](cloud-and-infrastructure/container-orchestration/) | 15 | ✅ Done |
| Load Balancing: L4 vs L7, health checks, algorithms | | 🗓️ Planned |

### 🗄️ [`databases-and-storage/`](databases-and-storage/) — How data is stored, queried, replicated

| Topic | 📊 | Status |
|-------|:-:|--------|
| [PostgreSQL Internals: MVCC, WAL, query planner, vacuum](databases-and-storage/postgresql-internals/) | 19 | ✅ Done |
| [Redis Internals: data structures, persistence, clustering](databases-and-storage/redis-internals/) | 21 | ✅ Done |
| [Distributed Databases: Spanner, CockroachDB, Cassandra consensus](databases-and-storage/distributed-databases/) | 16 | ✅ Done |
| [Message Queues: Kafka, RabbitMQ partitioning, delivery guarantees](databases-and-storage/message-queues/) | 16 | ✅ Done |
| [Object Storage: S3 internals, eventual consistency, erasure coding](databases-and-storage/object-storage/) | 16 | ✅ Done |

### 🌐 [`networking-and-protocols/`](networking-and-protocols/) — How data moves across networks

| Topic | 📊 | Status |
|-------|:-:|--------|
| [TCP/IP Deep Dive: handshake, congestion control, windowing](networking-and-protocols/tcp-ip/) | 16 | ✅ Done |
| [TLS/SSL: certificate chain, handshake, cipher negotiation](networking-and-protocols/tls-and-ssl/) | 16 | ✅ Done |
| [HTTP/2 & HTTP/3 / QUIC: multiplexing, 0-RTT, UDP transport](networking-and-protocols/http2-and-http3/) | 16 | ✅ Done |
| [BGP Routing: AS paths, peering, route hijacking](networking-and-protocols/bgp-routing/) | 16 | ✅ Done |
| [WebSockets & Real-time: upgrade handshake, framing, heartbeat](networking-and-protocols/websockets-and-realtime/) | 17 | ✅ Done |

### 🔐 [`auth-and-identity/`](auth-and-identity/) — How auth and identity work

| Topic | 📊 | Status |
|-------|:-:|--------|
| [OAuth 2.0 / OpenID Connect: grant flows, tokens, PKCE](auth-and-identity/oauth2-and-openid-connect/) | 14 | ✅ Done |
| [PKI & Certificates: CA hierarchy, X.509, certificate transparency](auth-and-identity/pki-and-certificates/) | 16 | ✅ Done |
| [SAML & SSO: federation, assertions, service providers](auth-and-identity/saml-and-sso/) | 17 | ✅ Done |
| [Passkeys / WebAuthn / FIDO2: challenge-response, attestation](auth-and-identity/passkeys-and-webauthn/) | 21 | ✅ Done |

### 🔍 [`search-and-data/`](search-and-data/) — How search and analytics engines work

| Topic | 📊 | Status |
|-------|:-:|--------|
| Elasticsearch / Lucene: inverted index, scoring, sharding | | 🗓️ Planned |
| [Recommendation Systems: collaborative filtering, embeddings](search-and-data/recommendation-systems/) | 14 | ✅ Done |
| [Data Warehouses: columnar storage, MPP, Snowflake/BigQuery](search-and-data/data-warehouses/) | 15 | ✅ Done |

---

## 🗳️ What should we research next?

Got a system you wish had a deep dive? **[Open an issue](../../issues/new)** and tell us!

> 💡 *"I just mass-burned 5 hours of LLM token limits on a deep research... only to wonder if someone already did the exact same thing."*
> — You, probably. That's exactly why this repo exists.

Before you burn tokens and hit rate limits, check here first — and if your topic isn't covered yet, request it so nobody else has to duplicate the effort.

Vote on existing requests with 👍 — we research the most requested topics first.

---

## 🏗️ How Each Research Is Built

Every topic is a self-contained folder:

```
topic-name/
├── README.md          📖 Main research (renders on GitHub)
├── index.html         🌐 Interactive HTML (dark/light, TOC, search, print)
└── diagrams/
    ├── flow-name.mmd  📊 Mermaid source (editable, version-controlled)
    └── flow-name.svg  🖼️ Pre-rendered SVG
```

### 📖 Document Structure

Every research follows the same 12-section template:

| # | Section | What it covers |
|:-:|---------|----------------|
| 1 | 🏛️ **History & Overview** | Founding, key people, timeline, current scale |
| 2 | 💡 **Core Concept** | What it IS and ISN'T, the fundamental mental model |
| 3 | 👥 **Key Participants & Roles** | Who are the actors, what roles do they play |
| 4 | ⚙️ **How It Works — Step by Step** | The primary flow, end-to-end with real examples |
| 5 | 🔧 **Technical Architecture** | Protocols, message formats, infrastructure |
| 6 | 💰 **Money Flow / Economics** | Revenue model, fees, costs, who pays whom |
| 7 | 🔒 **Security & Risk** | Fraud prevention, attack vectors, safeguards |
| 8 | ⚖️ **Regulation & Compliance** | Legal framework, regulatory bodies, key laws |
| 9 | 🔀 **Comparisons & Alternatives** | How it differs from competitors |
| 10 | 🚀 **Modern Developments** | Recent changes, future direction |
| 11 | 📎 **Appendix** | Diagrams, terminology, reference tables |
| 12 | 🎯 **Key Takeaways** | The 5-10 things you'll remember a month later |

### 🌐 Interactive HTML Features

Open any `index.html` in a browser and get:

- 🌗 Dark / light mode (persisted across visits)
- 📑 Sticky table of contents with scroll tracking
- 🔍 In-document search with match navigation (Ctrl+F)
- 🔎 Click any diagram to zoom fullscreen
- 📂 Collapsible sections (expand/collapse all)
- 🖨️ Print-ready CSS with proper page breaks (A4)
- 📱 Responsive mobile layout

### 🔄 Regenerate HTML

```bash
npm install
node scripts/generate-html.mjs payment-systems/swift-and-sepa
```

---

## 🤝 Contributing

**Want to add a research?** Fork, pick a topic, and follow our template. PRs welcome!

Each research should be:

- 📦 **Self-contained**: one folder with markdown, HTML, and diagrams
- 🔬 **Deep**: 50-100K+ tokens, history through implementation details
- ✅ **Accurate**: cite real specs, RFCs, and official documentation
- 📊 **Visual**: Mermaid diagrams for every major flow and architecture
- 💡 **Opinionated about clarity**: explain what something IS and ISN'T, correct misconceptions

---

## 📊 Progress

```
Done:      49 researches (789 diagrams)
Planned:   2 researches
Categories: 10
```

## ⭐ Star this repo

If your coding agent used this as context, or it saved you compute and $ on deep research — star the repo so others can find it too.

## 📄 License

MIT — use it, share it, learn from it.
