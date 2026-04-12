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
| ACH / Fedwire / CHIPS: US domestic rails | | 🗓️ Planned |
| Real-Time Payments: FedNow, UPI, PIX, Faster Payments | | 🗓️ Planned |
| [Mobile Wallets: Apple Pay, Google Pay internals](payment-systems/mobile-wallets/) | 13 | ✅ Done |
| [Buy Now Pay Later: Klarna, Affirm underwriting](payment-systems/buy-now-pay-later/) | 13 | ✅ Done |
| Cross-border Remittance: Wise, Western Union | | 🗓️ Planned |

### 🏦 [`banking-infrastructure/`](banking-infrastructure/) — How banks work internally

| Topic | 📊 | Status |
|-------|:-:|--------|
| Commercial Banks: fractional reserve, balance sheets, lending | | 🗓️ Planned |
| Central Banking & Monetary Policy: Fed, ECB, rate mechanics | | 🗓️ Planned |
| Core Banking Systems: Temenos, FIS, Mambu ledger architecture | | 🗓️ Planned |
| KYC / AML Systems: identity verification, transaction monitoring | | 🗓️ Planned |
| Credit Scoring: FICO, credit bureaus, scoring models | | 🗓️ Planned |
| Deposit Insurance: FDIC, DGS | | 🗓️ Planned |

### 📈 [`capital-markets/`](capital-markets/) — How securities are traded, cleared, settled

| Topic | 📊 | Status |
|-------|:-:|--------|
| Stock Exchanges: NYSE, NASDAQ order matching & order books | | 🗓️ Planned |
| FIX Protocol & Trading Infrastructure | | 🗓️ Planned |
| Clearing & Settlement: DTCC, CCP, T+1 | | 🗓️ Planned |
| Bond Markets: government, corporate, yield curves | | 🗓️ Planned |
| Options & Derivatives: pricing, Greeks, exchange mechanics | | 🗓️ Planned |
| High-Frequency Trading: co-location, market making, latency | | 🗓️ Planned |
| Index Funds & ETFs: creation/redemption, tracking | | 🗓️ Planned |

### ⛓️ [`crypto-and-blockchain/`](crypto-and-blockchain/) — How decentralized systems work

| Topic | 📊 | Status |
|-------|:-:|--------|
| Bitcoin Protocol: UTXO, mining, consensus, mempool | | 🗓️ Planned |
| Ethereum & EVM: accounts, gas, smart contracts | | 🗓️ Planned |
| Layer 2 Solutions: Lightning Network, rollups, state channels | | 🗓️ Planned |
| Stablecoins: USDC, USDT reserve mechanics, minting/burning | | 🗓️ Planned |
| DeFi Protocols: AMMs, lending pools, liquidation engines | | 🗓️ Planned |
| Bridges & Cross-chain: how assets move between chains | | 🗓️ Planned |

### 🛡️ [`insurance/`](insurance/) — How risk is pooled, priced, transferred

| Topic | 📊 | Status |
|-------|:-:|--------|
| [Insurance Underwriting: risk pools, premium pricing](insurance/underwriting/) | 14 | ✅ Done |
| Reinsurance: Lloyd's, treaty vs facultative | | 🗓️ Planned |
| Claims Processing: FNOL, adjustment, subrogation | | 🗓️ Planned |

### ☁️ [`cloud-and-infrastructure/`](cloud-and-infrastructure/) — How cloud platforms operate

| Topic | 📊 | Status |
|-------|:-:|--------|
| AWS / GCP / Azure Architecture: regions, AZs, control planes | | 🗓️ Planned |
| [CDNs: Cloudflare, Akamai caching, edge routing, Anycast](cloud-and-infrastructure/cdns/) | 13 | ✅ Done |
| DNS: resolution chain, registrars, root servers | | 🗓️ Planned |
| Container Orchestration: Kubernetes scheduler, etcd, kubelet | | 🗓️ Planned |
| Load Balancing: L4 vs L7, health checks, algorithms | | 🗓️ Planned |

### 🗄️ [`databases-and-storage/`](databases-and-storage/) — How data is stored, queried, replicated

| Topic | 📊 | Status |
|-------|:-:|--------|
| PostgreSQL Internals: MVCC, WAL, query planner, vacuum | | 🗓️ Planned |
| Redis Internals: data structures, persistence, clustering | | 🗓️ Planned |
| Distributed Databases: Spanner, CockroachDB, Cassandra consensus | | 🗓️ Planned |
| Message Queues: Kafka, RabbitMQ partitioning, delivery guarantees | | 🗓️ Planned |
| Object Storage: S3 internals, eventual consistency, erasure coding | | 🗓️ Planned |

### 🌐 [`networking-and-protocols/`](networking-and-protocols/) — How data moves across networks

| Topic | 📊 | Status |
|-------|:-:|--------|
| TCP/IP Deep Dive: handshake, congestion control, windowing | | 🗓️ Planned |
| TLS/SSL: certificate chain, handshake, cipher negotiation | | 🗓️ Planned |
| HTTP/2 & HTTP/3 / QUIC: multiplexing, 0-RTT, UDP transport | | 🗓️ Planned |
| BGP Routing: AS paths, peering, route hijacking | | 🗓️ Planned |
| WebSockets & Real-time: upgrade handshake, framing, heartbeat | | 🗓️ Planned |

### 🔐 [`auth-and-identity/`](auth-and-identity/) — How auth and identity work

| Topic | 📊 | Status |
|-------|:-:|--------|
| [OAuth 2.0 / OpenID Connect: grant flows, tokens, PKCE](auth-and-identity/oauth2-and-openid-connect/) | 14 | ✅ Done |
| PKI & Certificates: CA hierarchy, X.509, certificate transparency | | 🗓️ Planned |
| SAML & SSO: federation, assertions, service providers | | 🗓️ Planned |
| Passkeys / WebAuthn / FIDO2: challenge-response, attestation | | 🗓️ Planned |

### 🔍 [`search-and-data/`](search-and-data/) — How search and analytics engines work

| Topic | 📊 | Status |
|-------|:-:|--------|
| Elasticsearch / Lucene: inverted index, scoring, sharding | | 🗓️ Planned |
| Recommendation Systems: collaborative filtering, embeddings | | 🗓️ Planned |
| Data Warehouses: columnar storage, MPP, Snowflake/BigQuery | | 🗓️ Planned |

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
Done:       7 researches (92 diagrams)
Planned:   44 researches
Categories: 10
```

## ⭐ Star this repo

If your coding agent used this as context, or it saved you compute and $ on deep research — star the repo so others can find it too.

## 📄 License

MIT — use it, share it, learn from it.
