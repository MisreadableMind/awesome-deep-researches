# CDNs: Cloudflare, Akamai, Caching, Edge Routing, and Anycast - Complete Technical Deep Dive

---

## Table of Contents

1. [History and Overview](#1-history-and-overview)
2. [What a CDN Actually Is (and Is Not)](#2-what-a-cdn-actually-is-and-is-not)
3. [Key Participants and Roles](#3-key-participants-and-roles)
4. [Anycast Networking - The Foundation](#4-anycast-networking---the-foundation)
5. [How CDN Caching Works - Step by Step](#5-how-cdn-caching-works---step-by-step)
6. [Edge Routing and Request Flow](#6-edge-routing-and-request-flow)
7. [Cloudflare Architecture](#7-cloudflare-architecture)
8. [Akamai Architecture](#8-akamai-architecture)
9. [Technical Architecture - Protocols and Infrastructure](#9-technical-architecture---protocols-and-infrastructure)
10. [Economics and Business Models](#10-economics-and-business-models)
11. [Security at the Edge](#11-security-at-the-edge)
12. [Comparisons: Cloudflare vs Akamai vs AWS CloudFront vs Fastly](#12-comparisons-cloudflare-vs-akamai-vs-aws-cloudfront-vs-fastly)
13. [Modern Developments and Edge Computing](#13-modern-developments-and-edge-computing)
14. [Regulation and Compliance](#14-regulation-and-compliance)
15. [Appendix](#15-appendix)
16. [Key Takeaways](#16-key-takeaways)

---

## 1. History and Overview

### 1.1 The Problem That Created CDNs

In 1995, the World Wide Web was experiencing its first growing pains. A phenomenon called the "Flash Crowd" problem (named after Larry Niven's 1973 short story) was crippling popular websites. When a site suddenly attracted massive traffic - a news event, a product launch, a viral link - the origin server would buckle under the load. The server had finite bandwidth, finite CPU, and finite memory. Every user connected to the same physical machine in the same data center.

The math was simple and brutal. A single origin server with 100 Mbps of bandwidth could serve roughly 1,000 simultaneous users downloading a 100 KB page. If 100,000 users arrived in a minute (common for a front-page Slashdot link, later known as the "Slashdot effect"), the server would either crash, respond with errors, or slow to a crawl. The problem was fundamentally geometric: one server, many users, and the speed of light imposing minimum latency for users far from the server.

**The key insight**: if you could copy the content to servers closer to users, you would solve two problems simultaneously:
1. **Bandwidth**: distribute the load across many servers instead of one
2. **Latency**: serve content from a server geographically closer to the user, reducing round-trip time

This insight gave birth to the Content Delivery Network.

### 1.2 Akamai - The First Major CDN (1998)

**Founding.** In 1995, Tim Berners-Lee, the inventor of the World Wide Web, posed a challenge to the MIT community: solve the "hot spot" problem on the internet. Two people at MIT took this challenge seriously.

**Tom Leighton** was a professor of Applied Mathematics at MIT, specializing in algorithms for distributed networks and parallel computing. He had deep expertise in consistent hashing and network optimization algorithms.

**Daniel Lewin** was a graduate student working under Leighton. Born in the United States, raised in Israel, Lewin had served in the Israel Defense Forces' elite Sayeret Matkal unit. At MIT, he co-developed algorithms for efficiently distributing content across a network of distributed servers. His master's thesis, "Consistent Hashing and Random Trees: Distributed Caching Protocols for Relieving Hot Spots on the World Wide Web" (1998), became the mathematical foundation of Akamai.

Together, Leighton and Lewin co-founded Akamai Technologies in August 1998. The name "Akamai" comes from Hawaiian, meaning "intelligent" or "clever." The company's initial technology was built on two core algorithmic innovations:

1. **Consistent hashing**: A method for distributing objects across a changing set of servers so that adding or removing a server only requires remapping a small fraction of keys. This allowed Akamai to dynamically route requests to the optimal server without disrupting the entire cache.

2. **Algorithmic mapping**: Akamai developed algorithms that could, in real time, determine the best server to handle a specific request based on network conditions, server load, geographic proximity, and content availability.

**The Tragedy of Daniel Lewin.** On September 11, 2001, Daniel Lewin was a passenger on American Airlines Flight 11, the first plane to hit the World Trade Center. Multiple reports and the 9/11 Commission suggest Lewin attempted to stop the hijackers. He was 31 years old. Akamai's headquarters building at 145 Broadway, Cambridge, MA was later named the Daniel M. Lewin Building in his honor.

**Akamai's IPO and Growth.** Akamai went public on October 29, 1999, at $26 per share. The stock surged to $345 on the first day of trading during the dot-com bubble. After the crash, the stock fell to $0.56 in October 2002. The company survived by focusing on enterprise customers who needed reliable content delivery: media companies, software distributors, and e-commerce platforms.

**Key milestones:**

| Year | Event |
|------|-------|
| 1998 | Akamai founded by Leighton and Lewin |
| 1999 | IPO; handles delivery for the Star Wars Episode I trailer (the first viral video event - 1.8M downloads in a single day crashed most hosting providers, but Akamai's CDN held) |
| 2001 | Daniel Lewin killed on 9/11; Akamai survives dot-com crash |
| 2003 | Launches EdgePlatform for dynamic content acceleration |
| 2005 | Acquires Speedera Networks for $2.16B (its largest competitor at the time) |
| 2007 | Handles CNN.com traffic during Obama inauguration (7.7M simultaneous streams) |
| 2012 | Launches Prolexic DDoS mitigation platform (acquired for $370M) |
| 2014 | Delivers 30%+ of all internet traffic |
| 2019 | Launches Edge Workers (serverless compute at edge) |
| 2022 | Acquires Linode for $900M (cloud computing entry) |
| 2023 | Acquires Neosec (API security) |
| 2024 | Acquires Noname Security; operates 4,200+ PoPs in 130+ countries |

### 1.3 Cloudflare - The Disruptor (2009)

**Founding.** Cloudflare was co-founded in July 2009 by three people:

**Matthew Prince** was a law school graduate and Harvard MBA who had previously co-created Project Honey Pot, an open-source project that tracked email spammers and other online fraud. While running Project Honey Pot, Prince observed that small websites were being taken offline by DDoS attacks and had no affordable way to protect themselves.

**Lee Holloway** was a brilliant but unconventional engineer who had worked with Prince on Project Honey Pot. Holloway wrote much of Cloudflare's early codebase, including the core reverse proxy and traffic routing logic. He was diagnosed with frontotemporal dementia in his early 30s, a devastating condition that progressively impaired his cognitive abilities. His story was chronicled in a 2020 Wired article that became one of the most-read tech pieces of that year.

**Michelle Zatlyn** met Prince at Harvard Business School. She brought the business and operations expertise to complement Prince's product vision and Holloway's engineering.

The founding thesis was radical at the time: **CDN and security should be free for basic use, and accessible to everyone, not just enterprises with six-figure contracts.** Akamai served the Fortune 500. Cloudflare wanted to serve the entire internet.

**Launch.** Cloudflare launched publicly at TechCrunch Disrupt on September 27, 2010. The product was a reverse proxy that sat between a website and its visitors, providing CDN, DDoS protection, and security - all configurable through a simple dashboard. Crucially, the basic tier was free.

**The "Everyone" Strategy.** Cloudflare's genius was recognizing that every website on their network, including free-tier sites, contributed threat intelligence data. The more sites they protected, the better their security became for all customers. A DDoS attack targeting a small blog would teach Cloudflare's systems about new attack patterns, which would protect enterprise customers. This created a powerful network effect.

**Key milestones:**

| Year | Event |
|------|-------|
| 2009 | Founded by Prince, Holloway, Zatlyn |
| 2010 | Launched at TechCrunch Disrupt |
| 2011 | Handled Anonymous/LulzSec DDoS attacks across customer base |
| 2014 | Launched Universal SSL (free HTTPS for all customers, even free tier) |
| 2015 | Launched Virtual DNS (now Cloudflare DNS) |
| 2017 | Launched Cloudflare Workers (serverless compute at edge) |
| 2018 | Launched 1.1.1.1 (privacy-focused DNS resolver) |
| 2019 | IPO on NYSE (ticker NET) at $15/share |
| 2020 | Launched Cloudflare Pages (Jamstack hosting); Workers KV GA |
| 2021 | Launched R2 (S3-compatible object storage with zero egress fees) |
| 2022 | Launched D1 (SQLite at edge); Cloudflare Tunnel replaces Argo Tunnel |
| 2023 | Launched Workers AI (inference at edge); Constellation AI |
| 2024 | Revenue surpasses $1.6B annually; 330+ cities in 120+ countries |
| 2025 | Announced container support for Workers; expanded AI Gateway |

### 1.4 Other Major CDN Players

| CDN | Founded | Parent | Specialty | Scale |
|-----|---------|--------|-----------|-------|
| **AWS CloudFront** | 2008 | Amazon | Deep AWS integration, Lambda@Edge | 600+ PoPs in 50+ countries |
| **Fastly** | 2011 | Independent | Real-time purging (<150ms), VCL/Compute@Edge | 90+ PoPs, powers TikTok, GitHub, NYTimes |
| **Google Cloud CDN** | 2015 | Google | Leverages Google's private backbone (B4) | Uses Google's 187+ PoPs |
| **Azure CDN** | 2015 | Microsoft | Azure ecosystem integration | Partners with Verizon (Edgecast), Akamai |
| **Bunny CDN** | 2015 | Independent | Budget CDN, simple pricing | 123+ PoPs, popular with indie developers |
| **KeyCDN** | 2012 | proinity GmbH | Pay-as-you-go, HTTP/2 push | 60+ PoPs |

### 1.5 Scale Today (2025-2026)

| Metric | Cloudflare | Akamai | AWS CloudFront |
|--------|-----------|--------|----------------|
| Points of Presence (PoPs) | 330+ cities, 120+ countries | 4,200+ locations, 130+ countries | 600+ PoPs, 50+ countries |
| Network capacity | 296+ Tbps | 250+ Tbps | Not publicly disclosed |
| % of internet traffic | ~20% of all web traffic | ~15-30% (varies by metric) | ~5-10% |
| Daily requests handled | 57M+ HTTP requests/second peak | Serves 30%+ of global web traffic daily | Billions daily |
| Domains/websites | 30M+ websites | 8,000+ enterprise customers | Millions (via AWS) |
| Revenue (2024) | ~$1.66B | ~$3.9B | Part of AWS ($105B+) |
| Employees | ~4,000 | ~10,000+ | Part of Amazon |

---

## 2. What a CDN Actually Is (and Is Not)

### 2.1 The Precise Definition

**A Content Delivery Network (CDN) is a geographically distributed network of proxy servers and data centers that caches and serves content from locations physically closer to end users, reducing latency, absorbing traffic spikes, and offloading the origin server.**

The three critical functions of a CDN are:

1. **Caching**: Storing copies of static (and sometimes dynamic) content at edge locations so the origin server does not need to serve every request
2. **Routing**: Directing each user's request to the optimal edge server based on proximity, load, health, and network conditions
3. **Acceleration**: Optimizing content delivery through techniques like connection pooling, protocol optimization (HTTP/2, HTTP/3), TLS termination at edge, and image optimization

### 2.2 What a CDN Is NOT

| Misconception | Reality |
|---------------|---------|
| "A CDN is a hosting provider" | A CDN does not replace your origin server. It sits in front of it as a reverse proxy. If the CDN's cache is empty (cache miss), it fetches from your origin. You still need an origin server. |
| "A CDN only caches static files" | Modern CDNs cache dynamic content (HTML pages, API responses) with appropriate cache keys, and can run compute logic at the edge (Cloudflare Workers, Akamai EdgeWorkers). |
| "A CDN is only for large websites" | Cloudflare's free tier serves millions of small websites. Even a personal blog benefits from CDN caching and DDoS protection. |
| "CDN = faster website" | A CDN reduces latency for cacheable content. If your site is slow due to database queries, server-side computation, or poor frontend code, a CDN will not magically fix it. It helps with the "last mile" and bandwidth, not with origin computation. |
| "All CDNs are the same" | Architectures differ fundamentally. Cloudflare uses Anycast with every server running every service. Akamai uses a tiered architecture with specialized server roles. Fastly emphasizes instant purging. CloudFront is tightly coupled to AWS. |
| "CDNs just serve images and CSS" | Modern CDNs handle DDoS mitigation, WAF (Web Application Firewall), bot management, API protection, load balancing, DNS, serverless compute, video streaming, and zero-trust networking. |

### 2.3 The Mental Model

Think of a CDN like a franchise network for your website's content.

Your origin server is the **headquarters** - it has the master copy of everything. CDN edge servers are **local branches** scattered around the world. When a customer (user) walks into a local branch (edge PoP), the branch checks if it has the requested item (cache hit). If yes, it serves it immediately. If not (cache miss), it calls headquarters (origin) to get it, serves the customer, and keeps a copy for the next customer.

```
Without CDN:
  User (Tokyo) -------- 200ms RTT --------> Origin (Virginia)
  User (London) ------- 150ms RTT --------> Origin (Virginia)
  User (Sydney) ------- 280ms RTT --------> Origin (Virginia)

With CDN:
  User (Tokyo) ---- 5ms ---> Edge (Tokyo) ---- cache hit ----> done
  User (London) --- 3ms ---> Edge (London) --- cache hit ----> done
  User (Sydney) --- 8ms ---> Edge (Sydney) --- cache miss ---> Origin (Virginia)
                                              (fetches, caches, serves)
```

The key insight: **the first user from Sydney pays the full round-trip cost, but every subsequent user in that region gets near-instant response**. With popular content, cache hit ratios of 90-99% are common, meaning the origin server only handles 1-10% of actual traffic.

---

## 3. Key Participants and Roles

### 3.1 The CDN Ecosystem

| Participant | Role | Examples |
|-------------|------|----------|
| **Content Publisher (Origin)** | Owns the website/app/API; runs origin servers; configures CDN cache rules | Netflix, Shopify, any website owner |
| **CDN Provider** | Operates the distributed edge network; caches and serves content | Cloudflare, Akamai, CloudFront, Fastly |
| **End User** | Requests content via browser or app | Anyone visiting a website |
| **ISP / Transit Provider** | Carries traffic between CDN edge and user's device | Comcast, Deutsche Telekom, NTT |
| **IXP (Internet Exchange Point)** | Physical location where networks peer and exchange traffic directly | DE-CIX (Frankfurt), LINX (London), AMS-IX (Amsterdam) |
| **DNS Provider** | Resolves domain names; CDNs often provide or integrate with DNS | Cloudflare DNS, Route 53, NS1 |
| **Certificate Authority** | Issues TLS certificates for HTTPS | Let's Encrypt, DigiCert, Cloudflare (issues its own) |
| **Origin Shield / Mid-Tier** | Intermediate cache layer between edge and origin, reduces origin load | CloudFront Origin Shield, Cloudflare Tiered Cache |

### 3.2 How They Interact

```
+------------------+     DNS query      +------------------+
|   END USER       | -----------------> |   DNS RESOLVER   |
|   (browser/app)  |                    |   (1.1.1.1 etc)  |
+--------+---------+                    +--------+---------+
         |                                       |
         | HTTP request                          | Returns edge IP
         v                                       | (Anycast or geo-DNS)
+------------------+                             |
|   CDN EDGE PoP   | <--------------------------+
|   (closest to    |
|    user)          |
+--------+---------+
         |
         | Cache HIT? --> Serve immediately
         | Cache MISS?
         v
+------------------+
|   CDN MID-TIER   |  (Origin Shield / Regional cache)
|   (reduces       |
|    origin load)  |
+--------+---------+
         |
         | Cache HIT? --> Serve to edge, edge caches and serves user
         | Cache MISS?
         v
+------------------+
|   ORIGIN SERVER  |
|   (publisher's   |
|    infrastructure)|
+------------------+
```

### 3.3 Peering and Interconnection

CDN performance depends heavily on network peering. Major CDN providers maintain extensive peering relationships:

**Cloudflare** peers at 310+ internet exchanges globally and has 13,000+ direct peering interconnections. They operate AS13335.

**Akamai** has one of the most connected networks on the internet, with presence in over 1,300 networks worldwide. They deploy servers directly inside ISP networks (a strategy called "deep embedding").

**Why peering matters**: When a CDN edge server and an ISP are connected at the same Internet Exchange Point (IXP), traffic flows directly between them without traversing multiple intermediate networks (transit). This reduces both latency and cost. A direct peer connection at an IXP might add 0.5ms of latency. Routing through two transit providers might add 20-50ms.

| Peering Type | Description | Latency Impact |
|-------------|-------------|----------------|
| **On-net / Embedded** | CDN server sits inside the ISP's network | <1ms to ISP's subscribers |
| **IXP Peering** | CDN and ISP meet at an exchange point | 1-5ms typically |
| **Private Network Interconnect (PNI)** | Dedicated fiber between CDN and ISP | 1-3ms typically |
| **Transit** | Traffic routed through intermediate networks | 10-50ms+ variable |

Akamai pioneered the "embedded" model, placing servers directly inside ISP data centers. Cloudflare relies more on IXP peering and its own global backbone, but has increasingly deployed equipment inside ISP networks as well.

---

## 4. Anycast Networking - The Foundation

### 4.1 IP Address Routing: Unicast, Multicast, Broadcast, Anycast

To understand how CDNs route traffic, you first need to understand the four types of IP addressing:

| Type | Definition | How It Works | CDN Use |
|------|-----------|-------------|---------|
| **Unicast** | One sender, one specific receiver | Each IP address belongs to exactly one device on the internet | Traditional hosting: one server, one IP |
| **Broadcast** | One sender, all receivers on a network | Packet sent to all devices on a network segment | Not used on the public internet (LAN only) |
| **Multicast** | One sender, a group of receivers | Routers replicate packets to multiple interested receivers | Video streaming (IPTV), not widely used for web CDN |
| **Anycast** | One sender, the "nearest" receiver in a group | Multiple servers share the same IP address; BGP routes each request to the topologically nearest one | **Core CDN routing mechanism** |

### 4.2 How Anycast Works

Anycast is deceptively simple in concept but profound in its implications:

**Step 1: Same IP, Multiple Locations.** A CDN assigns the same IP address (e.g., 1.1.1.1 for Cloudflare's DNS resolver) to servers in hundreds of data centers worldwide. Every single one of these servers is configured with the IP address 1.1.1.1.

**Step 2: BGP Announcements.** Each data center announces the same IP prefix (e.g., 1.1.1.0/24) via BGP (Border Gateway Protocol) to its local peers and transit providers. BGP is the routing protocol that holds the internet together - it tells routers how to reach every IP address on the internet.

**Step 3: BGP Path Selection.** When a user in Tokyo sends a packet to 1.1.1.1, their ISP's router looks at its BGP routing table. It will have multiple routes to reach 1.1.1.0/24, each announced by a different Cloudflare data center. The router selects the "best" path based on BGP's decision algorithm:

1. **Highest local preference** (configured by the ISP)
2. **Shortest AS path** (fewest networks to traverse)
3. **Lowest origin type** (IGP > EGP > incomplete)
4. **Lowest MED** (Multi-Exit Discriminator, a hint from the neighboring AS)
5. **eBGP over iBGP** (prefer externally learned routes)
6. **Lowest IGP metric to next hop** (closest exit point)
7. **Oldest route** (most stable)
8. **Lowest router ID** (tiebreaker)

In practice, for Anycast CDN routing, the dominant factors are AS path length and local preference. A user in Tokyo will typically be routed to the Cloudflare data center in Tokyo because it has the shortest AS path (often direct peering with zero transit hops).

**Step 4: Automatic Failover.** If the Tokyo data center goes offline, it stops announcing the BGP prefix. Within seconds to minutes (depending on BGP convergence time), routers automatically withdraw the route and redirect traffic to the next-closest data center (e.g., Osaka, Seoul, or Hong Kong). The user experiences a brief disruption during BGP convergence but no configuration change is needed.

### 4.3 Anycast for TCP vs UDP

There is a critical nuance that CDN engineers must understand:

**UDP and Anycast work perfectly together.** Each UDP packet is independent (connectionless). If a packet goes to Tokyo and the next one goes to Osaka due to a routing change, both are valid. This is why DNS (which primarily uses UDP) was the first widespread use of Anycast. Cloudflare's 1.1.1.1 and Google's 8.8.8.8 are both Anycast addresses.

**TCP and Anycast are trickier.** TCP is connection-oriented - a three-way handshake (SYN, SYN-ACK, ACK) establishes a connection with a specific server, and all subsequent packets in that connection must reach the same server. If a BGP route change occurs mid-connection and packets start going to a different data center, that server will not have the TCP session state and will reset the connection.

**How CDNs solve this:**

| Strategy | How It Works | Used By |
|----------|-------------|---------|
| **BGP stability** | Keep routes stable so flaps are rare; most TCP connections complete before any route change | All Anycast CDNs |
| **ECMP flow pinning** | Routers use hash of (src IP, dst IP, src port, dst port) to consistently route a flow to the same next hop | Most ISP routers |
| **TCP session migration** | If a connection arrives at the wrong PoP, forward it internally to the correct one | Cloudflare (Unimog) |
| **QUIC (HTTP/3)** | Connection ID is independent of IP 4-tuple, allowing seamless migration between servers | Cloudflare, Google, Fastly |
| **Connection ID tracking** | Track which connections belong to which PoP in a distributed data store | Various |

Cloudflare developed a system called **Unimog** (their layer 4 load balancer) that can handle packets arriving at the "wrong" data center. If a BGP route change sends a TCP packet to the wrong PoP, Unimog tunnels it internally to the correct PoP using the Cloudflare backbone.

### 4.4 Anycast in Practice: Cloudflare 1.1.1.1

Cloudflare's 1.1.1.1 DNS resolver is the textbook example of Anycast:

```
$ dig +short 1.1.1.1
  (1.1.1.1 is itself the IP - it's an Anycast address)

$ traceroute 1.1.1.1
  (from New York)
  1  router.local (192.168.1.1)  1.2ms
  2  isp-gw.comcast.net         3.5ms
  3  peer.cloudflare.com        4.1ms
  4  1.1.1.1                    4.3ms   <-- reached NYC PoP

$ traceroute 1.1.1.1
  (from Tokyo)
  1  router.local (192.168.1.1)  0.8ms
  2  isp-gw.ntt.co.jp           2.1ms
  3  peer.cloudflare.com        2.8ms
  4  1.1.1.1                    3.0ms   <-- reached Tokyo PoP
```

Both users connect to 1.1.1.1 but reach physically different servers. The user has no idea (and does not need to know) which data center they reached. From their perspective, 1.1.1.1 is a single server that responds quickly everywhere in the world.

### 4.5 Anycast vs DNS-Based Routing (GeoDNS)

Before Anycast became widespread for CDNs, the primary routing mechanism was **DNS-based routing** (also called GeoDNS):

| Feature | DNS-Based Routing | Anycast |
|---------|------------------|---------|
| **How it works** | DNS resolver returns different IP addresses based on the user's location | Same IP is announced from multiple locations; BGP selects the nearest |
| **Resolution** | Per-DNS-resolver (not per-user, since many users share the same resolver) | Per-BGP-path (closer to per-user, since ISP routers make the decision) |
| **TTL dependency** | Must respect DNS TTL; stale caches send users to wrong location | Independent of DNS; works at the network layer |
| **Failover speed** | Depends on DNS TTL (can be 30s to 300s) | Depends on BGP convergence (typically 30s-3min) |
| **Granularity** | City or country level (based on resolver IP geolocation) | Network topology level (based on BGP path) |
| **DDoS resilience** | Attackers can target individual IPs directly | Attack traffic is automatically distributed across all PoPs |
| **Used by** | Akamai (primarily), AWS CloudFront | Cloudflare (primarily), many modern CDNs |

**Akamai uses DNS-based routing as its primary mechanism.** When a browser resolves a domain using Akamai's CDN, Akamai's authoritative DNS servers return an IP address for the edge server deemed optimal for that user. Akamai's DNS is itself served via Anycast, but the content-serving IPs are unicast addresses.

**Cloudflare uses Anycast as its primary mechanism.** Every Cloudflare IP address is Anycast. When a browser connects to a Cloudflare-proxied site, BGP routing automatically directs the connection to the nearest Cloudflare PoP.

Most modern CDNs use a **hybrid approach**: Anycast for their DNS infrastructure and either Anycast or GeoDNS for content delivery.

### 4.6 BGP Communities and Traffic Engineering

CDN operators use BGP communities to fine-tune Anycast routing. A BGP community is a tag attached to a route advertisement that signals routing preferences to peers.

Examples of how CDNs use BGP communities:

```
Route: 104.16.0.0/12 (Cloudflare IP range)
  Community: 13335:10  -> "learned from peer at IXP"
  Community: 13335:20  -> "prefer this path in US East"
  Community: 13335:100 -> "blackhole this prefix" (DDoS mitigation)
```

**Blackhole routing** is a critical DDoS mitigation technique. If a specific IP is under massive DDoS attack, the CDN can advertise a /32 route with a blackhole community. Upstream providers will drop all traffic to that IP at their routers, preventing the attack traffic from consuming CDN bandwidth. The legitimate service is sacrificed, but the rest of the network is protected.

---

## 5. How CDN Caching Works - Step by Step

### 5.1 The Cache Lifecycle

Every cached object in a CDN goes through a predictable lifecycle:

```
Origin Server                  CDN Edge Cache                 User
     |                              |                          |
     |                              |  <--- Request ---------- |  (1) User requests asset
     |                              |                          |
     |                              |  [Cache MISS]            |  (2) Edge has no copy
     |  <--- Fetch from origin ---- |                          |  (3) Edge fetches from origin
     |  --- Response + headers ---> |                          |  (4) Origin responds with Cache-Control
     |                              |  [STORES in cache]       |  (5) Edge caches the response
     |                              |  --- Serve to user ----> |  (6) Edge serves user
     |                              |                          |
     |                              |  <--- Request ---------- |  (7) Another user requests same asset
     |                              |  [Cache HIT]             |  (8) Edge has a valid copy
     |                              |  --- Serve from cache -> |  (9) Served instantly, no origin contact
     |                              |                          |
     |                              |  [TTL expires]           | (10) Cache entry becomes stale
     |  <--- Conditional request -- |                          | (11) Edge revalidates with origin
     |  --- 304 Not Modified -----> |                          | (12) Origin confirms content unchanged
     |                              |  [REFRESH TTL]           | (13) Cache entry renewed
     |                              |  --- Serve from cache -> | (14) Served from cache again
```

### 5.2 Cache-Control Headers - The Full Specification

The `Cache-Control` HTTP header is the primary mechanism for controlling CDN caching behavior. It is defined in RFC 9111 (HTTP Caching, which superseded RFC 7234).

#### Request Directives (sent by browser/client)

| Directive | Purpose | Example |
|-----------|---------|---------|
| `no-cache` | Force revalidation with origin before using cached copy | Browser hard refresh |
| `no-store` | Do not cache the response at all | Sensitive data |
| `max-age=N` | Accept cached response only if age < N seconds | `max-age=0` forces revalidation |
| `max-stale=N` | Accept cached response that has been stale for up to N seconds | Offline-tolerant apps |
| `min-fresh=N` | Require response to be fresh for at least N more seconds | Time-sensitive content |
| `only-if-cached` | Only serve from cache; return 504 if not cached | Offline mode |

#### Response Directives (sent by origin server, interpreted by CDN)

| Directive | Purpose | CDN Impact |
|-----------|---------|------------|
| `public` | Response may be cached by any cache (CDN, browser) | Explicit permission for CDN to cache |
| `private` | Response may only be cached by the browser, NOT by CDN | User-specific content (account pages) |
| `no-cache` | Cache may store the response but MUST revalidate before each use | Forces conditional request on every access |
| `no-store` | Cache must not store any part of the response | PII, sensitive data, financial info |
| `max-age=N` | Response is fresh for N seconds from time of generation | `max-age=3600` = 1 hour |
| `s-maxage=N` | Like max-age but applies ONLY to shared caches (CDNs) | `s-maxage=86400` overrides max-age for CDN |
| `must-revalidate` | When stale, cache MUST revalidate; cannot serve stale | Strict freshness enforcement |
| `proxy-revalidate` | Like must-revalidate but only for shared caches (CDNs) | CDN must revalidate when stale |
| `stale-while-revalidate=N` | Serve stale content while revalidating in background for up to N seconds | `swr=60` allows 60s of stale serving |
| `stale-if-error=N` | Serve stale content if origin returns 5xx error, for up to N seconds | `sie=86400` = serve stale for up to 1 day on error |
| `no-transform` | CDN must not modify content (no image optimization, compression, etc.) | Prevents CDN from altering responses |
| `immutable` | Content will never change; browser should never revalidate | Hashed static assets: `app.a1b2c3.js` |

#### The Critical Distinction: max-age vs s-maxage

```
Cache-Control: max-age=60, s-maxage=86400

Browser interpretation: "Cache for 60 seconds, then revalidate"
CDN interpretation:     "Cache for 86400 seconds (24 hours)"
```

This is the most important header combination for CDN users. You want the CDN to cache aggressively (reducing origin load) while the browser refreshes frequently (ensuring users see fresh content). The CDN serves from cache; if the content changes, you purge the CDN cache.

### 5.3 Conditional Requests and Revalidation

When a cached response becomes stale (TTL expired), the CDN does not necessarily re-download the full response. Instead, it sends a **conditional request** to the origin:

**Using ETags:**
```
CDN -> Origin:
  GET /image.png HTTP/1.1
  If-None-Match: "a1b2c3d4e5"    <-- ETag from the cached response

Origin -> CDN (if unchanged):
  HTTP/1.1 304 Not Modified       <-- No body sent, saves bandwidth
  ETag: "a1b2c3d4e5"

Origin -> CDN (if changed):
  HTTP/1.1 200 OK
  ETag: "f6g7h8i9j0"             <-- New ETag
  Content-Length: 45832
  [new content body]
```

**Using Last-Modified:**
```
CDN -> Origin:
  GET /page.html HTTP/1.1
  If-Modified-Since: Wed, 01 Jan 2025 12:00:00 GMT

Origin -> CDN (if unchanged):
  HTTP/1.1 304 Not Modified

Origin -> CDN (if changed):
  HTTP/1.1 200 OK
  Last-Modified: Thu, 15 Mar 2025 08:30:00 GMT
  [new content body]
```

**304 responses save significant bandwidth.** If a 5 MB image has not changed, the 304 response is only ~200 bytes instead of 5 MB. For CDNs revalidating millions of objects, this saves terabytes of origin bandwidth.

### 5.4 Cache Keys and Vary

A **cache key** is the unique identifier the CDN uses to store and look up cached content. By default, the cache key is typically the URL:

```
Cache key: https://example.com/api/products?page=2&sort=name
```

But the same URL can return different content based on request headers. The `Vary` header tells the CDN which request headers affect the response:

```
Vary: Accept-Encoding

This tells the CDN:
  Cache key for: GET /page.html (Accept-Encoding: gzip) -> compressed version
  Cache key for: GET /page.html (Accept-Encoding: br)   -> brotli version
  Cache key for: GET /page.html (no encoding)            -> uncompressed version
```

**Common Vary headers and their implications:**

| Vary Header | Use Case | Cache Impact |
|-------------|----------|-------------|
| `Accept-Encoding` | Serve gzip vs brotli vs uncompressed | 2-3 variants per URL (acceptable) |
| `Accept-Language` | Serve localized content | One variant per language (manageable) |
| `User-Agent` | Serve mobile vs desktop content | **Destroys cache hit ratio** - thousands of unique user agents |
| `Cookie` | Serve personalized content | **Effectively uncacheable** - every user has different cookies |
| `Accept` | Content negotiation (HTML vs JSON) | 2-3 variants (acceptable) |

**Rule of thumb**: Never use `Vary: User-Agent` or `Vary: Cookie` unless you absolutely must. These headers create so many cache key variants that the CDN essentially cannot cache the content. Instead, use `Vary: Accept-Encoding` (nearly universal) and handle other variations through separate URLs or edge compute logic.

### 5.5 Cache Hierarchy: Edge, Mid-Tier, Origin Shield

Modern CDNs use a multi-tier caching architecture to balance performance with cache efficiency:

**Tier 1: Edge (L1)** - The server closest to the user. Smallest cache, highest miss rate for long-tail content, but the lowest latency for cache hits. Each edge PoP maintains its own independent cache.

**Tier 2: Mid-Tier / Regional (L2)** - A larger regional cache that aggregates requests from multiple edge PoPs. When an edge cache misses, it queries the mid-tier before going to the origin. This collapses multiple edge-to-origin requests into a single mid-tier-to-origin request.

**Tier 3: Origin Shield** - A single (or small number of) designated cache layer that sits in front of the origin. ALL cache misses from all tiers funnel through the origin shield. This means the origin server only ever sees requests from the shield, dramatically reducing origin load.

```
                    User A (Tokyo)        User B (Osaka)
                         |                      |
                    Edge Tokyo           Edge Osaka
                    (L1 cache)           (L1 cache)
                         \                    /
                          \                  /
                        Mid-Tier Asia (L2)
                        (Regional cache)
                               |
                               |  (Only on regional miss)
                               |
                        Origin Shield
                        (Single PoP, e.g., US-East)
                               |
                               |  (Only on shield miss)
                               |
                        Origin Server
```

**Request collapsing (coalescing):** When multiple users request the same uncached asset simultaneously, the CDN does not send multiple requests to the origin. Instead, the first request goes to origin, and all subsequent requests for the same asset wait for the first response. This is critical during cache stampedes (e.g., after a cache purge or TTL expiration on popular content).

**Cloudflare calls this "Tiered Cache"** and offers it as a paid feature (included in Enterprise). They designate certain "upper tier" data centers as regional hubs.

**Akamai calls this "Tiered Distribution"** and it has been part of their architecture since the early days. Their tiered model is more granular, with multiple levels of parent-child cache relationships.

**CloudFront calls this "Origin Shield"** - you select a specific AWS region as the shield, and all cache misses from all edge locations go through that shield before reaching your origin.

### 5.6 Cache Invalidation (Purging)

Phil Karlton's famous quote: *"There are only two hard things in Computer Science: cache invalidation and naming things."*

CDNs offer several purge mechanisms:

| Purge Type | How It Works | Speed | Use Case |
|-----------|-------------|-------|----------|
| **Purge by URL** | Invalidate a single cached object by its exact URL | <500ms (Fastly: <150ms) | Single page content update |
| **Purge by cache tag** | Invalidate all objects tagged with a specific label | <2s typically | "Purge all product images" |
| **Purge all (global)** | Invalidate the entire cache | <30s typically | Major site redesign |
| **Soft purge** | Mark content as stale (not deleted); CDN serves stale while revalidating | Immediate | Non-critical updates |
| **Purge by prefix** | Invalidate all URLs matching a path prefix | <5s | Purge /api/v2/* after API update |
| **Surrogate keys** | Like cache tags but standardized (Fastly popularized) | <150ms (Fastly) | Fine-grained content relationships |

**How cache tags work (example):**

```
Origin response headers:
  Cache-Tag: product-123, category-electronics, homepage-featured
  Cache-Control: s-maxage=86400

Later, when product-123 is updated:
  API call: POST /purge
  Body: { "tags": ["product-123"] }

CDN purges all cached objects tagged with "product-123"
  (could be the product page, listing page, API response, etc.)
```

Fastly's purge speed (<150ms globally) is a major differentiator. For publishers like the New York Times, the ability to instantly purge a breaking news story correction across all edge caches worldwide is critical.

### 5.7 Cache Hit Ratios - What Good Looks Like

| Content Type | Target Hit Ratio | Typical TTL | Notes |
|-------------|-----------------|-------------|-------|
| Static assets (JS, CSS, images) | 95-99% | 1 year (with hash versioning) | Use `immutable` + content hashing |
| HTML pages (static site) | 80-95% | 5 min to 1 hour | Purge on publish |
| API responses (public) | 60-90% | 30s to 5 min | Depends on data freshness requirements |
| API responses (personalized) | 0-20% | Usually not cached | Requires edge compute or `Vary` gymnastics |
| Video segments (HLS/DASH) | 95-99% | 1 hour to 1 day | Large files, high bandwidth savings |
| Live event streaming | 80-95% | 2-6 seconds | Short TTL but massive concurrent viewers |

**Diagnosing poor cache hit ratios:**

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Hit ratio < 50% for static assets | `Cache-Control: no-cache` or `no-store` on origin | Fix origin headers |
| Hit ratio varies wildly between PoPs | Long-tail content with small audience per region | Enable tiered cache / origin shield |
| Hit ratio drops to 0 periodically | Origin sends `Vary: *` or `Set-Cookie` on every response | Remove `Vary: *`; separate cookie logic |
| Hit ratio high but origin still hammered | Cache stampede after TTL expiry | Use `stale-while-revalidate` and request coalescing |

---

## 6. Edge Routing and Request Flow

### 6.1 The Complete Request Flow

When a user visits `https://www.example.com/images/hero.jpg` and example.com uses Cloudflare as its CDN, the following sequence occurs:

**Step 1: DNS Resolution**

```
User's browser -> Local DNS resolver (e.g., ISP's or 8.8.8.8)
  "What is the IP address of www.example.com?"

Resolver -> Root nameserver -> .com TLD -> example.com authoritative NS

example.com's NS records point to Cloudflare:
  ns1.cloudflare.com
  ns2.cloudflare.com

Resolver -> Cloudflare authoritative DNS:
  "What is the A record for www.example.com?"

Cloudflare DNS returns: 104.16.132.229 (an Anycast IP)
  TTL: 300 seconds
```

**Step 2: TCP + TLS Connection**

```
User's browser -> 104.16.132.229 (routed by Anycast to nearest Cloudflare PoP)

TCP three-way handshake:
  Client -> SYN
  Server <- SYN-ACK
  Client -> ACK

TLS 1.3 handshake (1-RTT):
  Client -> ClientHello (with supported ciphers, key share)
  Server <- ServerHello + Certificate + Finished
  Client -> Finished
  [Application data can now flow]
```

With TLS 1.3, the handshake completes in a single round trip (1-RTT). With 0-RTT resumption, returning visitors can send application data in the very first packet.

**Step 3: HTTP Request**

```
GET /images/hero.jpg HTTP/2
Host: www.example.com
Accept: image/avif,image/webp,image/png,*/*
Accept-Encoding: br, gzip
```

**Step 4: CDN Edge Processing**

The Cloudflare edge server receives the request and processes it through several layers:

1. **DDoS mitigation**: Is this request part of a volumetric attack? Check rate limits, IP reputation, challenge status.
2. **WAF (Web Application Firewall)**: Does this request match any malicious patterns? SQL injection, XSS, path traversal.
3. **Bot management**: Is this a legitimate browser, a known bot (Googlebot), or a malicious scraper?
4. **Page Rules / Transform Rules**: Any URL rewrites, header modifications, or redirects configured?
5. **Cache lookup**: Is this request in the edge cache?

**Step 5: Cache Decision**

```
Cache lookup:
  Key: https://www.example.com/images/hero.jpg + Accept-Encoding: br
  Result: HIT (age: 3600s, max-age: 86400s, still fresh)

Response served from edge cache:
  HTTP/2 200
  Content-Type: image/jpeg
  Content-Length: 245782
  Cache-Control: public, max-age=86400
  CF-Cache-Status: HIT
  CF-Ray: 8a1b2c3d4e5f-EWR
  Age: 3600
  [image bytes]
```

If it were a **cache miss**, the edge would:
1. Check Tiered Cache (mid-tier) if configured
2. If mid-tier miss, fetch from origin
3. Cache the response at edge (and mid-tier)
4. Serve to user

### 6.2 DNS-Based Routing (Akamai's Approach)

Akamai's routing is more complex because it uses DNS to direct users to specific unicast edge servers:

**Step 1: CNAME Chain**

```
www.example.com -> www.example.com.edgesuite.net    (customer's CNAME)
  -> a1234.dscb.akamai.net                          (Akamai's DNS)
  -> a1234.dscb.akamai.net resolved to 23.45.67.89  (specific edge server IP)
```

**Step 2: Akamai's DNS Decision Engine**

When Akamai's DNS server resolves the final step, it makes a complex routing decision based on:

- **Resolver IP geolocation**: Where is the DNS resolver located? (Proxy for user location)
- **EDNS Client Subnet (ECS)**: If the resolver supports RFC 7871, it sends the user's subnet, giving Akamai more precise location data
- **Server load**: Current load on candidate edge servers
- **Server health**: Are all candidate servers passing health checks?
- **Network conditions**: Real-time data from Akamai's mapping system about network congestion, packet loss, and latency on various paths
- **Content availability**: Which edge servers have the requested content cached?

Akamai's mapping system is one of its most sophisticated components. It continuously probes network paths between edge servers and user populations, building a real-time model of internet performance. This system ingests data from:
- Active probes (billions of measurements per day)
- Real User Monitoring (RUM) data from the Akamai JavaScript beacon
- BGP routing data
- Server health checks
- Historical performance data

### 6.3 Cloudflare's Anycast + Argo Smart Routing

While Anycast handles the initial routing to the nearest PoP, Cloudflare's **Argo Smart Routing** optimizes the path from edge to origin:

```
Without Argo:
  Edge (Singapore) ----[public internet, multiple hops]----> Origin (Virginia)
  Latency: 250ms, packet loss: 0.5%

With Argo:
  Edge (Singapore) --[Cloudflare backbone]--> Edge (Los Angeles) --[Cloudflare backbone]--> Edge (Virginia) --> Origin
  Latency: 180ms, packet loss: 0.01%
```

Argo maintains a real-time map of internet performance between all Cloudflare data centers and uses this to route cache-miss traffic through the fastest path across Cloudflare's private backbone rather than the public internet. Cloudflare claims Argo reduces latency by an average of 30% and reduces connection errors by 27%.

The Cloudflare backbone consists of private fiber and leased wavelengths connecting their data centers. Traffic traversing this backbone avoids the congestion, routing inefficiencies, and packet loss common on the public internet.

### 6.4 Connection Reuse and Keep-Alive

One of the most impactful CDN optimizations is **connection reuse** between the CDN edge and the origin:

```
Without CDN (1000 users):
  Each user opens a new TCP + TLS connection to origin
  = 1000 TCP handshakes + 1000 TLS handshakes
  = enormous overhead on origin

With CDN (1000 users):
  1000 users connect to CDN edge (connections terminate at edge)
  CDN maintains ~5-10 persistent connections to origin
  All 1000 user requests are multiplexed over these few connections
  = 5-10 TCP handshakes + 5-10 TLS handshakes on origin
```

This is particularly valuable for origins running behind load balancers or in environments where TLS handshake cost is significant (e.g., with certificate chain validation, OCSP stapling).

### 6.5 Real User Monitoring (RUM) for Routing

Both Akamai and Cloudflare use RUM data to improve routing decisions:

**Akamai's RUM beacon**: Akamai injects a small JavaScript snippet into web pages (with the customer's consent). This beacon measures actual end-user performance: page load time, DNS resolution time, TCP connection time, TLS negotiation time, time to first byte (TTFB), and content download time. This data feeds back into Akamai's mapping system to improve DNS-based routing decisions.

**Cloudflare's approach**: Cloudflare collects performance data from its edge servers (since all traffic flows through them) and from browser APIs (Navigation Timing, Resource Timing) when available. They use this to optimize Argo Smart Routing paths and to detect network anomalies.

---

## 7. Cloudflare Architecture

### 7.1 Design Philosophy: Every Server Runs Everything

Cloudflare's architecture is fundamentally different from traditional CDNs. The core design principle is:

**Every server in every data center runs every service.**

In a traditional CDN (like Akamai), different servers have different roles: some handle caching, some handle WAF, some handle DDoS mitigation, some handle DNS. This means traffic must be routed to the right type of server.

In Cloudflare's model, every single server is identical. Each server runs the full stack: HTTP proxy, cache, WAF, DDoS mitigation, DNS resolver, Workers runtime, and every other Cloudflare product. This has several implications:

1. **No single point of failure within a PoP**: If one server fails, any other server in the same PoP can handle the request
2. **No internal routing complexity**: Incoming traffic hits any server via Anycast + ECMP; that server handles everything
3. **Simpler operations**: Deploy the same software to every machine worldwide
4. **Better resource utilization**: Idle capacity on one service (e.g., cache) can be used by another (e.g., Workers compute)

### 7.2 The Server Stack

Each Cloudflare server runs a software stack built primarily on:

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **fl** (front line) | Custom Rust/C | Layer 4 packet processing, DDoS mitigation |
| **Unimog** | Custom (eBPF + XDP) | Layer 4 load balancer, connection tracking, cross-PoP forwarding |
| **NGINX (modified)** | C, heavily modified | HTTP/1.1 and HTTP/2 handling (being replaced) |
| **Pingora** | Rust | HTTP proxy framework, replacing NGINX. Open-sourced in 2024 |
| **Quicksilver** | Custom distributed KV | Global configuration propagation (sub-5-second worldwide) |
| **Workers Runtime** | V8 isolates | Serverless edge compute (JavaScript, WASM) |
| **Cache** | Disk + RAM | Content caching with custom eviction logic |
| **Argo Tunnel / Cloudflare Tunnel** | Custom | Secure origin connection without exposing origin IP |

### 7.3 Pingora: Replacing NGINX

In 2022, Cloudflare announced that they were replacing NGINX with **Pingora**, a custom HTTP proxy framework written in Rust. They open-sourced Pingora in February 2024. The motivations:

1. **Architecture mismatch**: NGINX uses a multi-process, single-threaded-per-process architecture. This meant each worker process had its own connection pool to origins, leading to poor connection reuse. With 1,000 NGINX workers across a PoP, you might have 1,000 connections to the same origin instead of sharing a pool.

2. **Memory safety**: C code in NGINX led to periodic memory safety issues. Rust's ownership model eliminates entire categories of bugs.

3. **Performance**: Pingora reduced new HTTP connection time by 5ms at the median and 80ms at the 99th percentile. It also reduced connection reuse errors by 70%.

4. **Customization**: Modifying NGINX's internals was difficult. Pingora was designed from the ground up for Cloudflare's specific needs.

### 7.4 Quicksilver: Global Configuration at Scale

When a Cloudflare customer changes a setting (e.g., adds a WAF rule), that change must propagate to every server in every data center worldwide within seconds. Cloudflare built **Quicksilver** for this:

- Distributed key-value store built on top of LMDB (Lightning Memory-mapped Database)
- Handles 200+ million configuration changes per day
- Propagates changes to every machine in the global network in under 5 seconds
- Uses a Raft-based consensus protocol for the control plane
- Edge nodes subscribe to relevant key ranges and receive push updates

### 7.5 Workers: Serverless at the Edge

Cloudflare Workers run JavaScript (and WASM) directly on Cloudflare's edge servers, in all 330+ cities. Key technical details:

**Isolation model**: Workers use **V8 isolates**, not containers or VMs. A V8 isolate is a lightweight execution context within the V8 JavaScript engine. Each Worker runs in its own isolate with:
- Separate heap memory (up to 128 MB by default)
- Separate global scope
- No shared memory with other Workers
- Sub-millisecond startup time (vs. 50-500ms for containers, 1-30s for VMs)

**Execution limits** (as of 2025):
| Plan | CPU Time | Memory | Subrequests | Script Size |
|------|----------|--------|-------------|-------------|
| Free | 10ms CPU / request | 128 MB | 50 / request | 1 MB |
| Paid ($5/mo) | 30s CPU / request | 128 MB | 1,000 / request | 10 MB |
| Enterprise | Configurable | Configurable | Configurable | Configurable |

**Storage products available to Workers:**

| Product | Type | Capacity | Use Case |
|---------|------|----------|----------|
| Workers KV | Key-value (eventually consistent) | Unlimited | Configuration, feature flags, A/B testing |
| R2 | Object storage (S3-compatible) | Unlimited | Files, images, backups (zero egress fees) |
| D1 | SQLite database (distributed) | 10 GB per database | Relational data at edge |
| Durable Objects | Single-instance stateful objects | 128 KB per object (+ storage) | Counters, rate limiters, WebSocket coordination |
| Hyperdrive | Connection pooler for external databases | N/A (proxy) | Connect Workers to PostgreSQL, MySQL |
| Queues | Message queue | Millions of messages | Async processing, event-driven architectures |
| Vectorize | Vector database | Millions of vectors | AI/ML embedding search |

### 7.6 Cloudflare's Product Portfolio

Cloudflare has expanded far beyond CDN:

| Category | Products | Description |
|----------|----------|-------------|
| **Performance** | CDN, Argo Smart Routing, Image Resizing, Polish, Mirage, Railgun (deprecated), Early Hints | Content delivery and optimization |
| **Security** | DDoS Protection, WAF, Bot Management, API Shield, Page Shield, Turnstile (CAPTCHA replacement) | Application security |
| **Zero Trust** | Access, Gateway, Tunnel, WARP, Browser Isolation | Replace VPN with zero-trust network access |
| **Developer Platform** | Workers, Pages, R2, D1, KV, Durable Objects, Queues, Vectorize, AI Gateway, Workers AI | Edge compute and storage |
| **Network Services** | Magic Transit, Magic WAN, Spectrum, Argo Tunnel | Network-level protection and acceleration |
| **DNS** | Authoritative DNS, 1.1.1.1 Resolver, DNS Firewall | DNS infrastructure |
| **Email** | Email Routing, Email Security | Email forwarding and phishing protection |
| **Registrar** | Cloudflare Registrar | At-cost domain registration (no markup) |

### 7.7 1.1.1.1: The Privacy-First DNS Resolver

Launched on April 1, 2018 (not a joke), Cloudflare's 1.1.1.1 is a free public DNS resolver with a focus on privacy and speed:

- **Anycast addresses**: 1.1.1.1 and 1.0.0.1 (IPv4), 2606:4700:4700::1111 and 2606:4700:4700::1001 (IPv6)
- **Privacy commitment**: Cloudflare committed to never writing querying IP addresses to disk, purging all logs within 24 hours, and engaging KPMG to audit their privacy practices annually
- **Performance**: Consistently ranks as one of the fastest public DNS resolvers globally (often the fastest), with typical response times of 10-15ms
- **Supports**: DNS-over-HTTPS (DoH), DNS-over-TLS (DoT), DNS-over-QUIC
- **WARP**: Cloudflare built a consumer VPN product (1.1.1.1 + WARP) on top of the resolver, routing all device traffic through Cloudflare's network using WireGuard

---

## 8. Akamai Architecture

### 8.1 Design Philosophy: Specialized, Deeply Embedded

Akamai's architecture reflects its origins as an algorithmically-driven CDN optimized for the enterprise internet:

**Embedded servers inside ISP networks.** Akamai deploys servers directly inside ISP and carrier data centers worldwide. Rather than building their own data centers (like Cloudflare), Akamai places commodity servers as close to end users as possible, literally inside the last-mile networks. This "deep embedding" strategy means an Akamai server might be in the same facility as a user's ISP router, reducing latency to sub-millisecond levels.

**Scale**: Akamai operates approximately 365,000+ servers across 4,200+ locations in 130+ countries. They are present in over 1,300 networks globally.

### 8.2 The Akamai Intelligent Platform

Akamai's platform consists of several interconnected systems:

**Edge Servers (Ghost)**: The caching and delivery servers at the edge. Codenamed "Ghost" internally, these servers handle HTTP request processing, caching, content assembly, and security functions.

**Mapping System**: The brain of Akamai's CDN. The mapping system:
- Continuously measures internet conditions (latency, packet loss, throughput) between edge servers and user populations
- Processes billions of measurements per day
- Makes real-time DNS routing decisions to direct users to the optimal edge server
- Uses machine learning to predict network conditions
- Can adapt routing within seconds to network outages or congestion

**NetStorage**: Akamai's distributed origin storage system. For customers who want to host content directly within Akamai's network rather than maintaining their own origin servers.

**SureRoute**: Akamai's equivalent of Cloudflare's Argo Smart Routing. When a cache miss occurs and the edge server must fetch from origin, SureRoute determines the fastest path through Akamai's network. It may route through one or more intermediate Akamai servers (a "virtual midpoint") that have better connectivity to the origin than a direct path.

### 8.3 Akamai's Tiered Distribution

```
User -> Edge Server (ISP-embedded, closest to user)
          |
          | Cache MISS
          v
        Parent Server (regional data center)
          |
          | Cache MISS
          v
        Peer Servers (check nearby caches before going to origin)
          |
          | Cache MISS (all tiers)
          v
        Origin Server (via SureRoute optimized path)
```

Akamai's parent-child cache hierarchy is more dynamic than other CDNs. Edge servers form parent relationships based on the mapping system's real-time optimization, and these relationships can change as network conditions evolve.

### 8.4 Akamai's Product Evolution

Akamai has evolved from a pure CDN into a cloud security and computing company:

| Category | Products | Description |
|----------|----------|-------------|
| **Delivery** | Ion (web), Media Delivery (video), Download Delivery (software), API Acceleration | Content delivery optimized by content type |
| **Security** | App & API Protector (WAF), Prolexic (DDoS), Bot Manager, Account Protector, API Security | Enterprise-grade security |
| **Edge Compute** | EdgeWorkers, EdgeKV, Property Manager | Serverless compute at edge |
| **Cloud Computing** | Linode (acquired 2022), Gecko (distributed compute) | Full cloud platform |
| **Zero Trust** | Enterprise Application Access, Guardicore (microsegmentation) | Enterprise security |
| **Network** | Global Traffic Management, Edge DNS | DNS and traffic management |

### 8.5 Akamai vs Cloudflare: Architectural Comparison

| Aspect | Cloudflare | Akamai |
|--------|-----------|--------|
| **Routing** | Anycast (BGP-level) | DNS-based (application-level) |
| **Server deployment** | Own data centers in IXPs and carrier-neutral facilities | Embedded inside ISP networks |
| **Server specialization** | Every server runs every service | Specialized server types for different functions |
| **PoP count** | 330+ cities | 4,200+ locations |
| **Server count** | Not publicly disclosed (estimated tens of thousands) | 365,000+ servers |
| **Target market** | Everyone (free tier to enterprise) | Enterprise-focused |
| **Caching model** | Anycast distributes across PoP; tiered cache for hierarchy | Parent-child cache hierarchy with dynamic relationships |
| **Edge compute** | Workers (V8 isolates, sub-ms startup) | EdgeWorkers (JavaScript, slightly higher startup) |
| **Software stack** | Pingora (Rust), custom stack | Ghost (proprietary C/C++) |
| **DDoS approach** | Absorb at every PoP (Anycast distributes attack traffic) | Prolexic scrubbing centers + edge mitigation |

---

## 9. Technical Architecture - Protocols and Infrastructure

### 9.1 HTTP/2 and HTTP/3 at the Edge

CDN edge servers are typically the first adopters of new HTTP protocols because they terminate user connections:

**HTTP/2** (RFC 7540, 2015):
- **Multiplexing**: Multiple requests/responses over a single TCP connection
- **Header compression**: HPACK compression reduces header overhead by 60-90%
- **Server push**: Server can proactively send resources (e.g., push CSS when HTML is requested). Note: Chrome deprecated support for HTTP/2 push in 2022 due to low real-world benefit
- **Stream prioritization**: Browser can indicate which resources are most important

**HTTP/3** (RFC 9114, 2022):
- **QUIC transport**: Replaces TCP with QUIC (a UDP-based transport developed by Google)
- **0-RTT connection establishment**: Returning users can send data in the first packet (vs. 1-RTT for TLS 1.3 over TCP)
- **No head-of-line blocking**: Packet loss on one stream does not block other streams (unlike HTTP/2 over TCP)
- **Connection migration**: Connections survive IP address changes (e.g., switching from Wi-Fi to cellular), enabled by connection IDs rather than IP-port tuples

CDNs play a critical role in HTTP/3 adoption because:
1. The CDN edge terminates the user's connection and can speak HTTP/3 to the browser
2. The CDN edge connects to the origin using HTTP/1.1 or HTTP/2 (origin does not need to support HTTP/3)
3. This allows origins to benefit from HTTP/3 without changing anything

| CDN | HTTP/3 Support | Notes |
|-----|---------------|-------|
| Cloudflare | Yes (since 2019 beta, 2022 GA) | Enabled by default for all plans |
| Akamai | Yes (2023) | Gradual rollout to enterprise customers |
| CloudFront | Yes (2022) | Opt-in per distribution |
| Fastly | Yes (2023) | H3 via QUIC |
| Google Cloud CDN | Yes (2022) | Leverages Google's QUIC implementation |

### 9.2 TLS Termination at the Edge

CDN edge servers terminate TLS connections from users. This means:

1. The browser establishes a TLS connection with the CDN edge server, not the origin
2. The CDN edge decrypts the traffic, processes it (cache lookup, WAF, etc.)
3. If the request must go to origin, the CDN establishes a separate TLS connection to the origin

**TLS termination modes:**

| Mode | Description | Security | Performance |
|------|------------|----------|-------------|
| **Full (Strict)** | CDN validates origin's TLS certificate; must be a valid CA-signed cert | Best | Slightly slower (cert validation) |
| **Full** | CDN connects to origin via TLS but does not validate the certificate | Medium | Faster |
| **Flexible** | CDN terminates user's HTTPS, connects to origin via HTTP (unencrypted) | Lowest | Fastest |
| **End-to-End with mTLS** | Mutual TLS between CDN and origin using client certificates | Highest | Additional overhead |

**TLS performance optimizations at CDN edge:**

| Optimization | Description | Impact |
|-------------|-------------|--------|
| **OCSP Stapling** | CDN staples OCSP response to TLS handshake | Eliminates client's OCSP lookup (100-300ms savings) |
| **TLS Session Resumption** | Reuse session parameters from previous connections | Skip full handshake (1-RTT vs. 2-RTT) |
| **TLS 1.3** | Faster handshake (1-RTT, 0-RTT resumption) | Significant latency improvement |
| **Certificate compression** | Compress certificate chain in TLS handshake (RFC 8879) | Reduce handshake data by 50-90% |
| **Early Hints (103)** | CDN sends 103 status with preload hints before full response | Browser starts loading assets earlier |

### 9.3 Edge Computing: Workers vs EdgeWorkers vs Lambda@Edge

The "edge compute" paradigm allows running custom code at CDN edge locations:

| Feature | Cloudflare Workers | Akamai EdgeWorkers | AWS Lambda@Edge | Fastly Compute |
|---------|-------------------|-------------------|----------------|----------------|
| **Runtime** | V8 isolates | V8 isolates (subset) | Node.js, Python (containers) | Wasm (Wasmtime) |
| **Languages** | JS, TS, Rust (via Wasm), Python, C/C++ (via Wasm) | JS (limited API surface) | Node.js, Python | Rust, Go, JS (via Wasm), any Wasm-targeting language |
| **Cold start** | <1ms (isolates are pre-warmed) | ~5ms | 50-500ms (container startup) | <1ms (Wasm instantiation) |
| **Locations** | 330+ cities | 4,200+ locations | 400+ CloudFront PoPs | 90+ PoPs |
| **CPU limit** | 10ms (free), 30s (paid) | 4ms (init) + 4ms (per event) | 5s (viewer events), 30s (origin events) | 60s total |
| **Memory** | 128 MB | 512 KB | 128 MB | 128 MB |
| **Storage** | KV, R2, D1, Durable Objects, Queues | EdgeKV | DynamoDB (origin-region), S3 | KV Store, Object Store |

**Use cases for edge compute:**

| Use Case | How It Works | Benefit |
|----------|-------------|---------|
| A/B testing | Edge Worker selects variant based on cookie/header | No origin involvement; instant variant selection |
| Geolocation-based content | Edge Worker reads user's country/city from request metadata | Serve localized content without origin logic |
| Authentication | Edge Worker validates JWT/session token | Reject unauthorized requests before they reach origin |
| URL rewriting | Edge Worker transforms request URL | Clean URL routing without origin configuration |
| Image optimization | Edge Worker calls image transformation service or API | Serve WebP/AVIF based on Accept header |
| Rate limiting | Edge Worker tracks request rates in Durable Objects or KV | Block abuse at the edge |
| Custom caching logic | Edge Worker sets cache keys, TTLs, and purge logic programmatically | Fine-grained cache control beyond what headers allow |

### 9.4 Protocol Optimization: Origin to Edge

CDN edges optimize the connection between edge and origin through several techniques:

**Connection pooling**: The edge maintains a pool of persistent TCP/TLS connections to the origin. Thousands of user requests are multiplexed over a handful of origin connections.

**TCP optimizations**:
- **Increased initial congestion window (initcwnd)**: CDN edge servers typically use an initcwnd of 10 (instead of the default 1-3), allowing more data in the first round trip
- **BBR congestion control**: Modern CDNs use Google's BBR algorithm instead of CUBIC or Reno, providing better throughput on lossy networks
- **TCP Fast Open**: Allows data in the SYN packet (RFC 7413)

**Compression**:
- **Brotli**: CDN edges can compress responses with Brotli (better compression ratio than gzip, especially for text content). Cloudflare compresses at level 4 (balance of speed and ratio) for dynamic content and pre-compresses popular static assets at level 11 (maximum compression)
- **Zstandard (zstd)**: Emerging compression algorithm offering better speed-ratio tradeoff than Brotli

### 9.5 IPv4 and IPv6 at the Edge

CDN edge servers typically serve as IPv4/IPv6 gateways:

```
User (IPv6-only) -> CDN Edge (IPv6) -> [CDN translates] -> Origin (IPv4-only)
User (IPv4) -> CDN Edge (IPv4) -> Origin (IPv4)
```

This is particularly valuable because many origin servers only support IPv4, but a growing number of end users (especially mobile) are on IPv6-only networks. The CDN edge handles the protocol translation transparently.

---

## 10. Economics and Business Models

### 10.1 CDN Pricing Models

| Model | How It Works | Used By |
|-------|-------------|---------|
| **Bandwidth-based** | Pay per GB of data delivered from edge to user | CloudFront, Akamai, most traditional CDNs |
| **Request-based** | Pay per HTTP request | CloudFront (in addition to bandwidth) |
| **Flat rate / committed use** | Fixed monthly price for committed bandwidth | Akamai enterprise contracts |
| **Free tier + paid features** | Basic CDN and security free; charge for advanced features | Cloudflare |
| **Pay-as-you-go** | No commitment; pay only for what you use | Bunny CDN, KeyCDN |

### 10.2 Cloudflare's Pricing Model

Cloudflare's pricing is unusual in the CDN industry because **bandwidth is unmetered on all plans**, including the free tier:

| Plan | Price | Key Features |
|------|-------|-------------|
| **Free** | $0/month | CDN, DDoS protection, SSL, basic WAF, DNS, 10ms Workers CPU |
| **Pro** | $20/month | Enhanced WAF, image optimization, mobile optimization, Argo ($5/mo add-on) |
| **Business** | $200/month | Advanced WAF rules, 100% SLA, custom SSL certificates |
| **Enterprise** | Custom (typically $5,000+/month) | 24/7 support, custom solutions, SLAs, dedicated account team |

**How Cloudflare can offer free CDN:**

1. **Economies of scale**: The marginal cost of serving one more website on existing infrastructure is near zero
2. **Threat intelligence**: Free customers contribute security data (attack patterns, bot signatures)
3. **Upsell funnel**: Free users convert to paid plans as they grow (reported ~5% conversion rate)
4. **Hardware efficiency**: Every server runs every service, so unused capacity on one service is available for others
5. **Bandwidth costs**: Cloudflare owns its backbone and peers extensively at IXPs, keeping transit costs very low (estimated $0.01-0.02 per GB vs. industry average of $0.02-0.08)

### 10.3 Akamai's Pricing Model

Akamai's pricing is enterprise-focused and opaque:

- **Custom contracts**: Minimum commitments typically start at $2,000-5,000/month
- **Bandwidth tiers**: Price per GB decreases with volume (e.g., $0.05/GB for first 10 TB, $0.03/GB for next 50 TB, etc.)
- **Feature-based add-ons**: Security features (WAF, Bot Manager, Prolexic) are priced separately
- **Typical enterprise contract**: $50,000-$500,000+ per year, with 1-3 year terms

### 10.4 AWS CloudFront Pricing

CloudFront uses transparent per-GB and per-request pricing that varies by geographic region:

| Region | Per GB (first 10 TB) | Per 10,000 HTTPS Requests |
|--------|---------------------|--------------------------|
| US, Canada, Europe | $0.085 | $0.010 |
| Asia Pacific | $0.120 | $0.012 |
| South America | $0.110 | $0.022 |
| India | $0.109 | $0.009 |

CloudFront also offers **CloudFront Security Savings Bundle** (up to 30% savings with commitment) and **free tier** (1 TB data transfer + 10M requests/month, first 12 months).

### 10.5 Cost Comparison: Serving 100 TB/month

| Provider | Estimated Monthly Cost | Notes |
|----------|----------------------|-------|
| Cloudflare (Pro) | $20 | Unmetered bandwidth |
| Cloudflare (Enterprise) | $5,000+ | Unmetered + premium features |
| Bunny CDN | $1,000 | $0.01/GB average |
| AWS CloudFront | $7,500+ | $0.085/GB (US), decreasing with volume |
| Akamai | $8,000-15,000+ | Custom pricing, depends on contract |
| Fastly | $8,000+ | $0.08/GB (US) |

Cloudflare's unmetered bandwidth model is a significant competitive advantage. For bandwidth-heavy workloads, the cost difference is enormous.

### 10.6 Egress Fees and the Bandwidth Alliance

One of the most controversial aspects of cloud/CDN pricing is **egress fees** (charges for data leaving a provider's network). AWS charges $0.09/GB for data egressing from S3 to the internet. If you use S3 as your origin and serve 100 TB/month through CloudFront, your S3 egress costs alone are $7,200/month (CloudFront-to-S3 egress is free, but only for CloudFront).

Cloudflare's **R2 storage** has zero egress fees by design, specifically targeting this AWS pain point. Cloudflare also co-founded the **Bandwidth Alliance** with partners like Microsoft Azure, Google Cloud, IBM Cloud, and others, where alliance members waive or reduce egress fees for traffic exchanged with Cloudflare.

---

## 11. Security at the Edge

### 11.1 DDoS Mitigation

DDoS (Distributed Denial of Service) attacks attempt to overwhelm a target with traffic. CDNs are uniquely positioned to mitigate DDoS because they operate at massive scale and can absorb attack traffic across their distributed network.

**Attack types and CDN defenses:**

| Attack Type | Layer | Description | CDN Defense |
|------------|-------|------------|-------------|
| **Volumetric** | L3/L4 | Flood bandwidth (UDP flood, ICMP flood, DNS amplification) | Anycast distributes across PoPs; BGP blackholing; traffic scrubbing |
| **Protocol** | L4 | Exhaust server resources (SYN flood, fragmented packets) | SYN cookies, stateless SYN-ACK, connection limiting |
| **Application** | L7 | Overwhelm application logic (HTTP flood, slowloris, API abuse) | Rate limiting, JavaScript challenges, CAPTCHA, behavioral analysis |

**Scale of attacks:**

| Year | Largest Recorded Attack | Target | CDN That Mitigated |
|------|----------------------|--------|-------------------|
| 2020 | 2.3 Tbps (UDP reflection) | AWS customer | AWS Shield |
| 2021 | 3.47 Tbps (UDP flood) | Azure customer | Azure DDoS Protection |
| 2022 | 26 million RPS (HTTP/2) | Cloudflare customer | Cloudflare |
| 2023 | 71 million RPS (HTTP/2 Rapid Reset) | Cloudflare customer | Cloudflare |
| 2024 | 5.6 Tbps (Mirai botnet, UDP) | ISP in East Asia | Cloudflare |

**Cloudflare's DDoS Architecture:**

Cloudflare's DDoS mitigation is "always on" and runs on every server. The system has multiple layers:

1. **Network-level filtering** (XDP/eBPF): Packet-level rules that drop malicious traffic before it reaches the TCP stack. Runs in the kernel using eXpress Data Path (XDP), which processes packets before the kernel's network stack, allowing line-rate filtering.

2. **dosd (denial of service daemon)**: Cloudflare's proprietary DDoS detection system that runs on every server. It samples incoming traffic, detects attack patterns (volumetric, protocol, application layer), and dynamically generates mitigation rules. These rules are deployed in XDP for maximum performance.

3. **Gatebot**: A global DDoS detection system that aggregates signals across all Cloudflare data centers. While dosd detects localized attacks, Gatebot detects distributed attacks that span multiple PoPs.

4. **flowtrackd**: A flow-tracking daemon for stateful TCP protection (SYN flood mitigation, out-of-state packet detection).

**Akamai's DDoS Architecture:**

Akamai uses **Prolexic**, a dedicated DDoS mitigation platform acquired in 2014:

- **Scrubbing centers**: Prolexic operates dedicated scrubbing centers with 20+ Tbps of capacity
- **BGP re-routing**: Under attack, Akamai advertises the target's IP prefixes through Prolexic's network, attracting all traffic (including attack traffic) to the scrubbing centers
- **Scrubbing**: Attack traffic is filtered; clean traffic is tunneled back to the customer's origin
- **Always-on or on-demand**: Customers can choose always-on (traffic always routed through Prolexic) or on-demand (activated only during attacks)

### 11.2 Web Application Firewall (WAF)

CDN-based WAFs inspect HTTP requests at the edge before they reach the origin:

**How a CDN WAF works:**

```
User Request -> CDN Edge -> WAF Engine -> Cache / Origin

WAF Engine checks:
  1. Managed rulesets (OWASP Core Rule Set, vendor rules)
  2. Custom rules (customer-defined)
  3. Rate limiting rules
  4. IP reputation (known attackers, Tor exit nodes)
  5. Bot score (automated vs human)

Decision:
  - Allow: Pass request to cache/origin
  - Block: Return 403 or custom error page
  - Challenge: Present JavaScript challenge or CAPTCHA
  - Log: Allow but log for investigation
```

**Cloudflare WAF specifics:**
- Uses the OWASP Core Rule Set (CRS) plus proprietary rules
- Processes WAF rules in the Rust-based filtering engine
- Managed rules are updated automatically (customer does not need to configure)
- Custom rules use a domain-specific language called Wirefilter
- Runs on every server in the network (no dedicated WAF appliances)

**Akamai WAF specifics:**
- **App & API Protector** (successor to Kona Site Defender)
- Uses adaptive security engine that auto-tunes rules based on traffic patterns
- API protection includes schema validation and behavior analysis
- Runs on edge servers with dedicated processing resources

### 11.3 Bot Management

Modern CDN bot management goes beyond simple CAPTCHA:

| Signal | What It Detects | How |
|--------|----------------|-----|
| **TLS fingerprint (JA3/JA4)** | Bot libraries vs real browsers | Analyze TLS ClientHello parameters (cipher suites, extensions, curves) |
| **HTTP/2 fingerprint** | Automated tools vs browsers | Analyze HTTP/2 settings, frame ordering, priority trees |
| **JavaScript execution** | Headless browsers, automation | Inject JS challenges that require actual browser execution |
| **Mouse/touch patterns** | Human vs automated interaction | Analyze mouse movement entropy, click patterns, scroll behavior |
| **IP reputation** | Known bot infrastructure | Check against databases of data center IPs, proxy services, Tor exit nodes |
| **Request patterns** | Scraping, credential stuffing | Analyze request rates, URL patterns, session behavior |

**Cloudflare's Turnstile** (CAPTCHA replacement) uses invisible challenges that analyze browser behavior without requiring user interaction. It replaced traditional CAPTCHA in 2022 and is available for free.

### 11.4 TLS at Scale

CDN providers manage TLS certificates at massive scale:

**Cloudflare** manages millions of TLS certificates:
- **Universal SSL**: Free certificates for all customers (issued via Let's Encrypt or DigiCert, managed automatically)
- **Advanced Certificate Manager**: Custom certificates with specific SANs, certificate pinning
- **Keyless SSL**: Allows customers to keep their private key on their own hardware. During TLS handshake, the CDN edge sends the parts requiring the private key to the customer's key server for signing, then completes the handshake. This was developed for financial institutions that cannot export private keys.

**Certificate issuance and rotation** at Cloudflare scale:
- Cloudflare is one of the largest consumers of Let's Encrypt certificates
- Certificates are automatically renewed 30 days before expiration
- New certificates propagate globally within seconds via Quicksilver

---

## 12. Comparisons: Cloudflare vs Akamai vs AWS CloudFront vs Fastly

### 12.1 Feature Comparison

| Feature | Cloudflare | Akamai | CloudFront | Fastly |
|---------|-----------|--------|------------|--------|
| **Free tier** | Yes (generous) | No | Yes (limited, 12 months) | No |
| **Anycast** | Yes (primary) | DNS only | No (DNS-based) | Yes |
| **PoPs** | 330+ cities | 4,200+ locations | 600+ PoPs | 90+ PoPs |
| **Edge compute** | Workers (V8, <1ms cold start) | EdgeWorkers (JS) | Lambda@Edge (50-500ms cold start) | Compute (Wasm, <1ms) |
| **Purge speed** | ~5-30s global | ~5s | Varies (minutes) | <150ms global |
| **HTTP/3** | Yes (default) | Yes | Yes (opt-in) | Yes |
| **DDoS** | Unlimited, unmetered, included | Prolexic (paid add-on) | AWS Shield Standard (included), Advanced (paid) | Included |
| **WAF** | Included (all plans) | Paid add-on | Paid add-on (AWS WAF) | Paid add-on |
| **DNS** | Included (fast, Anycast) | Paid (Edge DNS) | Route 53 (separate service) | Not offered |
| **Object storage** | R2 (zero egress) | NetStorage | S3 (origin integration) | Not offered |
| **SSL/TLS** | Free for all plans | Included with delivery products | Free via ACM | Included |
| **Image optimization** | Polish, Image Resizing | Image & Video Manager | Not built-in | Image Optimizer (IO) |
| **Video** | Stream (paid) | Media Delivery (enterprise) | MediaLive + MediaPackage | Limited |

### 12.2 When to Choose Which

| Scenario | Best Choice | Why |
|----------|------------|-----|
| **Small website, budget-conscious** | Cloudflare Free | CDN, DDoS, SSL, DNS all free with unmetered bandwidth |
| **Large enterprise, media/video** | Akamai | Deepest network embedding, proven at massive scale for media delivery |
| **AWS-native infrastructure** | CloudFront | Tight S3/EC2/Lambda integration, free origin-fetch from S3, consistent AWS billing |
| **Real-time purging critical** | Fastly | <150ms global purge, VCL/Compute for fine-grained cache control |
| **Edge compute-heavy workload** | Cloudflare Workers or Fastly Compute | Sub-ms cold starts, extensive edge storage options |
| **Need full cloud platform at edge** | Cloudflare (Workers + R2 + D1) | Most complete edge computing platform |
| **Regulated industry, compliance-focused** | Akamai | Longest compliance track record, FedRAMP, PCI DSS Level 1 |
| **Multi-CDN strategy** | Cloudflare + Akamai/CloudFront | Use Cloudflare as primary (free DDoS/WAF) with secondary CDN for redundancy |

### 12.3 Performance Benchmarks

Performance varies significantly by geography and content type. General trends from third-party benchmarks (Cedexis/Citrix, ThousandEyes, Catchpoint):

| Metric | Cloudflare | Akamai | CloudFront | Fastly |
|--------|-----------|--------|------------|--------|
| **Global median TTFB** | 25-40ms | 20-35ms | 30-50ms | 25-40ms |
| **North America TTFB** | 15-25ms | 15-20ms | 20-35ms | 15-25ms |
| **Asia TTFB** | 30-60ms | 25-40ms | 40-70ms | 40-70ms |
| **Cache hit ratio (typical)** | 85-95% | 90-98% | 80-90% | 85-95% |
| **DNS resolution time** | 10-15ms (1.1.1.1) | 15-25ms | 20-30ms (Route 53) | N/A |
| **Purge propagation** | 5-30s | 5-10s | 60-120s | <150ms |

Akamai tends to perform best in regions where it has deep ISP embedding (Asia, Europe). Cloudflare performs best in well-connected urban areas where its Anycast PoPs are located. CloudFront benefits from strong AWS backbone in regions with major AWS presence. Fastly sacrifices geographic coverage for speed of purging and edge compute.

---

## 13. Modern Developments and Edge Computing

### 13.1 The Edge Computing Revolution

The CDN industry is undergoing a fundamental transformation from "content delivery" to "edge computing." The idea is simple: instead of just caching static content at the edge, run application logic there.

**Why edge compute matters:**

```
Traditional (compute at origin):
  User -> CDN Edge [cache check] -> Origin [compute + data] -> CDN Edge -> User
  Round trip: 100-300ms for compute

Edge compute:
  User -> CDN Edge [compute + cache] -> User
  Round trip: 5-30ms
```

For latency-sensitive applications (personalization, A/B testing, authentication, API gateways), the difference between 30ms and 300ms is significant - especially when multiple sequential API calls are involved.

### 13.2 CDN + Security Convergence (SASE/SSE)

Secure Access Service Edge (SASE) and Security Service Edge (SSE) represent the convergence of networking and security:

**Traditional model:**
```
Remote user -> VPN -> Corporate firewall -> Application
```

**SASE model (Cloudflare Zero Trust, Akamai EAA):**
```
Remote user -> CDN edge [identity check + WAF + DLP + CASB] -> Application
```

Both Cloudflare and Akamai are positioning themselves as SASE providers:

| Feature | Cloudflare Zero Trust | Akamai Enterprise Security |
|---------|---------------------|---------------------------|
| **Identity-aware proxy** | Cloudflare Access | Enterprise Application Access (EAA) |
| **Secure web gateway** | Cloudflare Gateway | Secure Internet Access Enterprise (SIA) |
| **DNS filtering** | 1.1.1.1 for Families / Gateway DNS | SIA DNS |
| **Browser isolation** | Cloudflare Browser Isolation | Akamai Browser Isolation |
| **Microsegmentation** | Not offered | Guardicore (acquired 2021) |
| **CASB** | Cloudflare CASB | Via partnerships |
| **VPN replacement** | WARP + Access | EAA |

### 13.3 HTTP/3 and QUIC Adoption

QUIC and HTTP/3 are increasingly important for CDN performance:

**Current adoption** (2025-2026):
- ~30% of web traffic uses HTTP/3 (mostly via Cloudflare and Google)
- All major browsers support HTTP/3 (Chrome, Firefox, Safari, Edge)
- Most CDN providers support HTTP/3 on the edge
- Few origin servers support HTTP/3 (not needed when CDN terminates the connection)

**QUIC benefits specific to CDNs:**
1. **0-RTT**: Returning visitors can send request data immediately, saving one round trip (critical for mobile users with high latency)
2. **Connection migration**: Users switching networks (Wi-Fi to cellular) do not drop connections, which helps with Anycast + mobile users
3. **No head-of-line blocking**: Lost packet in one stream does not stall others (big improvement for pages with many assets)
4. **Faster loss recovery**: QUIC has improved congestion control and loss recovery compared to TCP

### 13.4 Image Optimization at the Edge

CDN-based image optimization is a major growth area:

| Feature | Cloudflare | Akamai | CloudFront |
|---------|-----------|--------|------------|
| **Format conversion** | WebP, AVIF auto-conversion | WebP, AVIF via Image Manager | Requires Lambda@Edge |
| **Responsive sizing** | Image Resizing (Workers-based) | Image Manager | Requires custom solution |
| **Compression** | Automatic quality optimization | Perceptual quality tuning | Not built-in |
| **Lazy loading** | Mirage (defers off-screen images) | Adaptive Image Compression | Not built-in |

Cloudflare's Image Resizing service runs at the edge and can transform images on the fly:
```
https://example.com/cdn-cgi/image/width=300,format=auto/images/hero.jpg
```

This single URL serves:
- A 300px-wide WebP to Chrome users
- A 300px-wide AVIF to supported browsers
- A 300px-wide JPEG to Safari users (if WebP/AVIF not supported)

### 13.5 Early Hints (103)

HTTP 103 Early Hints (RFC 8297) allows the CDN to send preload hints to the browser before the full response is ready:

```
Browser -> CDN Edge: GET /page.html

CDN Edge -> Browser:
  HTTP/1.1 103 Early Hints
  Link: </styles.css>; rel=preload; as=style
  Link: </app.js>; rel=preload; as=script

  (CDN fetches from origin or cache...)

CDN Edge -> Browser:
  HTTP/1.1 200 OK
  Content-Type: text/html
  [HTML body]
```

The browser starts downloading `styles.css` and `app.js` while waiting for the HTML response. Cloudflare was the first major CDN to support Early Hints at scale (2022) and reports up to 30% improvement in Largest Contentful Paint (LCP) for participating sites.

### 13.6 AI and CDNs

Emerging intersection of AI/ML and CDNs:

**AI at the edge:**
- **Cloudflare Workers AI**: Run inference (LLMs, image classification, embeddings) at Cloudflare edge locations using NVIDIA GPUs
- **Cloudflare AI Gateway**: Proxy and cache AI API calls (OpenAI, Anthropic, etc.) at the edge, reducing costs and latency
- **Cloudflare Vectorize**: Vector database at the edge for similarity search

**AI for CDN optimization:**
- Akamai uses ML for predictive content prefetching (predict what a user will request next and pre-cache it)
- Cloudflare uses ML for bot detection (analyzing behavioral patterns)
- All major CDNs use ML for DDoS detection (anomaly detection on traffic patterns)

### 13.7 WebSocket and Real-Time at the Edge

Modern CDNs support WebSocket connections through the edge:

```
Browser <-- WebSocket --> CDN Edge <-- WebSocket --> Origin

CDN edge handles:
  - TLS termination
  - Connection multiplexing (many client connections, fewer origin connections)
  - DDoS protection on WebSocket connections
  - Rate limiting per connection
```

Cloudflare's **Durable Objects** take this further by allowing stateful WebSocket handling at the edge. A chat room, for example, can be implemented entirely at the edge without an origin server:

```
Browser A -> CDN Edge -> Durable Object "room-123" -> broadcasts to all connected browsers
Browser B -> CDN Edge -> Durable Object "room-123" -> (same instance coordinates all connections)
```

---

## 14. Regulation and Compliance

### 14.1 Regulatory Landscape

CDN providers operate in a complex regulatory environment because they handle and cache content from millions of websites across jurisdictions:

| Regulation | Impact on CDNs | Key Requirements |
|-----------|---------------|-----------------|
| **GDPR (EU)** | CDN processes EU residents' data (IP addresses, cookies) | Data processing agreement required; data residency options; right to erasure may require cache purge |
| **CCPA/CPRA (California)** | Similar to GDPR for California residents | Disclosure of data collection; opt-out of sale |
| **PCI DSS** | CDNs handling payment card data | WAF must be PCI compliant; TLS requirements; logging and monitoring |
| **HIPAA (US Healthcare)** | CDNs caching health-related content | BAA required; encryption at rest and in transit |
| **FedRAMP (US Government)** | CDNs serving US government sites | FedRAMP authorization required; specific security controls |
| **SOC 2** | General security and availability | Annual audit of security controls, availability, processing integrity |

### 14.2 Data Residency and Sovereignty

Some regulations require data to stay within specific geographic boundaries:

**Cloudflare's solutions:**
- **Regional Services**: Restrict where traffic is decrypted (e.g., EU-only decryption)
- **Data Localization Suite**: Ensures metadata and logs stay within specific regions
- **Geo Key Manager**: TLS private keys held only in specified regions

**Akamai's solutions:**
- **Compliance offerings**: FedRAMP Authorized, PCI DSS Level 1, SOC 2 Type II, ISO 27001
- **Regional deployment**: Can restrict content delivery to specific geographic regions
- **GDPR-compliant data processing**: Detailed DPA (Data Processing Agreement) available

### 14.3 Content Moderation and Legal Liability

CDN providers face unique legal challenges:

- **Section 230 (US)**: CDNs generally benefit from Section 230 protections as intermediaries
- **NetzDG (Germany)**: May require removal of illegal content within 24 hours
- **DSA (EU Digital Services Act)**: Imposes transparency and reporting obligations on intermediary services
- **Copyright (DMCA)**: CDN providers must respond to valid DMCA takedown requests for cached content

Cloudflare has faced public controversies over providing services to sites hosting hate speech, terrorism content, and piracy. Their position has evolved from "neutral infrastructure provider" to making content-based decisions in extreme cases (e.g., terminating service to 8chan after the El Paso shooting in 2019, terminating Kiwi Farms in 2022).

---

## 15. Appendix

### 15.1 Key Terminology

| Term | Definition |
|------|-----------|
| **PoP (Point of Presence)** | A physical location where a CDN has servers |
| **Edge server** | A CDN server at the edge of the network, close to users |
| **Origin server** | The customer's server that holds the authoritative content |
| **Cache hit** | Request served from CDN cache without contacting origin |
| **Cache miss** | Request not in CDN cache; must be fetched from origin |
| **TTL (Time to Live)** | How long a cached object is considered fresh |
| **Anycast** | IP routing technique where the same IP is announced from multiple locations |
| **BGP (Border Gateway Protocol)** | The routing protocol that directs traffic between autonomous systems on the internet |
| **AS (Autonomous System)** | A network under a single administrative entity (e.g., Cloudflare is AS13335) |
| **IXP (Internet Exchange Point)** | A physical location where networks peer directly |
| **Peering** | Direct network interconnection between two networks, typically at an IXP |
| **Transit** | Paid connectivity through an intermediate network |
| **ECMP (Equal-Cost Multi-Path)** | Load balancing technique that distributes traffic across multiple equal-cost paths |
| **PoP** | Point of Presence - a physical data center location |
| **TTFB (Time to First Byte)** | Time from request sent to first byte of response received |
| **RTT (Round-Trip Time)** | Time for a packet to go from client to server and back |
| **Purge** | Invalidate cached content, forcing re-fetch from origin |
| **Stale content** | Cached content past its TTL but not yet evicted |
| **Origin shield** | A mid-tier cache that consolidates origin requests |
| **Cache stampede** | Many simultaneous requests for the same uncached content |
| **Request coalescing** | Combining multiple identical pending requests into one origin fetch |
| **JA3/JA4** | TLS fingerprinting methods that create a hash of TLS ClientHello parameters |
| **XDP (eXpress Data Path)** | Linux kernel technology for high-performance packet processing |
| **eBPF** | Extended Berkeley Packet Filter - a technology for running sandboxed programs in the Linux kernel |

### 15.2 Architecture Diagrams

| Diagram | Source | Description |
|---------|--------|-------------|
| CDN Ecosystem | [`diagrams/cdn-ecosystem.mmd`](diagrams/cdn-ecosystem.mmd) | Key participants and relationships |
| Anycast Routing | [`diagrams/anycast-routing.mmd`](diagrams/anycast-routing.mmd) | How Anycast directs traffic to nearest PoP |
| Cache Hierarchy | [`diagrams/cache-hierarchy.mmd`](diagrams/cache-hierarchy.mmd) | Edge, mid-tier, origin shield cache layers |
| HTTP Request Flow | [`diagrams/http-request-flow.mmd`](diagrams/http-request-flow.mmd) | Complete request flow through CDN edge |
| Cache Lifecycle | [`diagrams/cache-lifecycle.mmd`](diagrams/cache-lifecycle.mmd) | Cache hit, miss, revalidation, and purge |
| Cloudflare Architecture | [`diagrams/cloudflare-architecture.mmd`](diagrams/cloudflare-architecture.mmd) | Cloudflare's server stack and services |
| Akamai Architecture | [`diagrams/akamai-architecture.mmd`](diagrams/akamai-architecture.mmd) | Akamai's tiered distribution model |
| DDoS Mitigation | [`diagrams/ddos-mitigation.mmd`](diagrams/ddos-mitigation.mmd) | How CDN absorbs and filters DDoS attacks |
| Edge Compute Comparison | [`diagrams/edge-compute-comparison.mmd`](diagrams/edge-compute-comparison.mmd) | Workers vs EdgeWorkers vs Lambda@Edge |
| DNS vs Anycast Routing | [`diagrams/dns-vs-anycast.mmd`](diagrams/dns-vs-anycast.mmd) | Comparison of CDN routing approaches |
| TLS Termination | [`diagrams/tls-termination.mmd`](diagrams/tls-termination.mmd) | TLS modes at CDN edge |
| CDN Economics | [`diagrams/cdn-economics.mmd`](diagrams/cdn-economics.mmd) | Revenue models and cost flow |
| SASE Architecture | [`diagrams/sase-architecture.mmd`](diagrams/sase-architecture.mmd) | CDN + security convergence |

### 15.3 HTTP Caching Headers Quick Reference

```
# Cache for 1 hour at CDN, 5 minutes at browser
Cache-Control: public, s-maxage=3600, max-age=300

# Cache forever at CDN and browser (use with hashed filenames)
Cache-Control: public, max-age=31536000, immutable

# Cache for 1 day, serve stale for 60s while revalidating, serve stale for 1 day on error
Cache-Control: public, s-maxage=86400, stale-while-revalidate=60, stale-if-error=86400

# Do not cache anywhere (sensitive data)
Cache-Control: no-store

# Cache but always revalidate (dynamic content)
Cache-Control: no-cache

# CDN cache for 1 hour, browser does not cache
Cache-Control: s-maxage=3600, max-age=0, must-revalidate

# Private (browser only, not CDN)
Cache-Control: private, max-age=600
```

### 15.4 CDN Configuration Examples

**Cloudflare Workers - Custom Cache Logic:**
```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Custom cache key (ignore query string for images)
    if (url.pathname.startsWith('/images/')) {
      const cacheKey = new Request(url.origin + url.pathname, request);
      const cache = caches.default;

      let response = await cache.match(cacheKey);
      if (!response) {
        response = await fetch(request);
        response = new Response(response.body, response);
        response.headers.set('Cache-Control', 'public, s-maxage=86400');
        await cache.put(cacheKey, response.clone());
      }
      return response;
    }

    return fetch(request);
  }
};
```

**Akamai Property Manager - Cache Configuration (JSON):**
```json
{
  "name": "Static Assets Cache Rule",
  "behaviors": [
    {
      "name": "caching",
      "options": {
        "behavior": "MAX_AGE",
        "mustRevalidate": false,
        "ttl": "7d"
      }
    },
    {
      "name": "tieredDistribution",
      "options": {
        "enabled": true,
        "tieredDistributionMap": "CH2"
      }
    }
  ],
  "criteria": [
    {
      "name": "fileExtension",
      "options": {
        "matchOperator": "IS_ONE_OF",
        "values": ["css", "js", "jpg", "png", "gif", "svg", "woff2"]
      }
    }
  ]
}
```

**CloudFront Cache Policy (Terraform):**
```hcl
resource "aws_cloudfront_cache_policy" "static_assets" {
  name    = "static-assets-cache-policy"
  comment = "Cache static assets for 7 days"

  default_ttl = 604800   # 7 days
  max_ttl     = 31536000 # 365 days
  min_ttl     = 1

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "whitelist"
      headers {
        items = ["Accept-Encoding"]
      }
    }
    query_strings_config {
      query_string_behavior = "none"
    }
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true
  }
}
```

---

## 16. Key Takeaways

1. **A CDN is a caching reverse proxy network, not a host.** It sits between users and your origin, caching content at edge locations worldwide. Your origin still exists; the CDN just dramatically reduces how often it is accessed.

2. **Anycast is the backbone of modern CDN routing.** The same IP address is announced from hundreds of locations via BGP. The internet's routing infrastructure automatically directs each user to the nearest server. No DNS tricks needed.

3. **Cache-Control headers are the language of CDN caching.** Master `s-maxage`, `stale-while-revalidate`, and `stale-if-error` to control CDN behavior independently from browser caching. Use `immutable` with content-hashed filenames for static assets.

4. **Cloudflare and Akamai have fundamentally different architectures.** Cloudflare uses Anycast with every server running every service. Akamai uses DNS-based routing with servers embedded deep inside ISP networks. Both approaches work; they optimize for different tradeoffs (simplicity vs. proximity).

5. **CDNs are no longer just about caching.** Modern CDNs are platforms: DDoS mitigation, WAF, bot management, edge compute, serverless, object storage, DNS, zero-trust networking. The "CDN" label understates what these companies do.

6. **Edge compute is the biggest shift in CDN architecture since Anycast.** Cloudflare Workers, Akamai EdgeWorkers, and Fastly Compute allow running application logic at the edge with sub-millisecond cold starts, fundamentally changing where computation happens.

7. **Cloudflare's free tier changed the industry.** By offering CDN, DDoS protection, and WAF for free with unmetered bandwidth, Cloudflare made enterprise-grade infrastructure accessible to everyone and forced competitors to respond.

8. **Cache invalidation is still hard.** Purge strategies (by URL, by tag, soft purge) and `stale-while-revalidate` are your best tools. Fastly's <150ms global purge is best-in-class if instant invalidation is critical.

9. **The CDN edge is the new TLS termination point.** Users connect to the CDN, not your origin. This means the CDN handles certificate management, protocol negotiation (HTTP/3, TLS 1.3), and connection optimization. Your origin can be simpler.

10. **Multi-CDN is a real strategy.** Large organizations use multiple CDNs (e.g., Cloudflare + Akamai) for redundancy, performance optimization, and vendor leverage. DNS-based failover between CDNs is straightforward to implement.
