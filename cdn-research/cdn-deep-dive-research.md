# CDN (Content Delivery Network) - Deep Dive Technical Research

## Table of Contents

1. [Cloudflare - History, Scale, and Architecture](#1-cloudflare)
2. [Akamai - History, Scale, and Architecture](#2-akamai)
3. [Anycast Networking](#3-anycast-networking)
4. [CDN Caching](#4-cdn-caching)
5. [Edge Routing](#5-edge-routing)
6. [Economics](#6-economics)
7. [Security](#7-security)
8. [Modern Developments](#8-modern-developments)

---

## 1. Cloudflare

### 1.1 History and Founding

Cloudflare was founded on July 26, 2009, by **Matthew Prince**, **Lee Holloway**, and **Michelle Zatlyn**. The origins of the company trace back to 2004, when Matthew Prince and Lee Holloway built **Project Honey Pot**, a system that allowed website owners to track how spammers harvested email addresses. The project aimed to answer a simple question: "Where does email spam come from?"

In 2009, Prince took a sabbatical to pursue his MBA at Harvard Business School, where he met Michelle Zatlyn (now Cloudflare's COO and President). The first business plan was titled "Project Web Wall," but a friend suggested that since they were creating a "firewall in the cloud," it should be called **Cloudflare**. The name stuck immediately.

In **April 2009**, Cloudflare won the prestigious Harvard Business School Business Plan Competition. In **November 2009**, the company closed its Series A financing with Ray Rothrock from Venrock and Carl Ledbetter from Pelion Venture Partners.

On **September 27, 2010**, Cloudflare officially launched at TechCrunch Disrupt, which had been the plan from the very first discussions at Harvard.

### 1.2 Key Milestones

| Date | Milestone |
|------|-----------|
| July 2009 | Company founded |
| April 2009 | Won Harvard Business School Business Plan Competition |
| November 2009 | Series A financing closed (Venrock, Pelion Venture Partners) |
| September 2010 | Launched at TechCrunch Disrupt |
| September 2014 | Launched **Universal SSL** - the industry's first free SSL for all customers |
| June 2014 | Launched **Project Galileo** - free protection for human rights organizations and civil society groups |
| 2017 | Launched the **Athenian Project** - free protection for election-related domains for state and local governments |
| April 1, 2018 | Launched **1.1.1.1** public DNS resolver in partnership with APNIC |
| September 13, 2019 | **IPO on NYSE** under ticker NET at $15 per share, implied valuation of $3.81B |
| 2020 | Launched Cloudflare Workers KV, Durable Objects |
| 2022 | Launched R2 object storage (zero egress fees) |
| 2022 | Launched D1 SQLite database at the edge |
| 2024 | Launched Cloudflare One (unified SASE platform) |
| Q4 2025 | Mitigated record-breaking 31.4 Tbps DDoS attack |

**At IPO (September 2019):**
- Revenue for H1 2019: $129.2M (up 48% YoY)
- CY 2018 revenue: $192.7M (up 43% YoY)
- 74,873 paying customers (up 33% YoY)

### 1.3 Current Scale (2025-2026)

| Metric | Value |
|--------|-------|
| Data centers | 330+ cities |
| Countries | 125+ |
| Network capacity | 449 Tbps |
| Internet traffic served | 20%+ of all global HTTP request traffic |
| Websites protected | 41+ million |
| Top 1M sites using Cloudflare | 48.7% |
| DNS queries per day | 4.3 trillion |
| Latency to 95% of Internet users | Under 50 milliseconds |
| Paying customers (June 2025) | 265,929 (up 27% YoY) |
| Fortune 1000 companies using Cloudflare | ~17% |
| Largest DDoS attack mitigated | 31.4 Tbps (Q4 2025) |
| Network capacity vs. largest DDoS | 23x larger than biggest attack ever recorded |
| Investment in network expansion (2025-2026) | $3 billion |

### 1.4 Architecture and Products

#### Cloudflare Workers

Cloudflare Workers is a serverless compute platform that runs JavaScript, TypeScript, and WebAssembly at the edge. It is built on **V8 isolates** rather than containers or virtual machines.

**V8 Isolate Architecture:**
- A V8 isolate is a self-contained instance of the V8 JavaScript engine with its own heap, garbage collector, and compilation pipeline
- Multiple isolates coexist within a single OS process, sharing the compiled V8 engine binary (text segment) but maintaining strict separation of JavaScript state
- A single runtime instance can run hundreds or thousands of isolates, seamlessly switching between them
- Each isolate uses approximately **5 MB** of memory, compared to 50-500 MB per container
- Cold start time: under **5 milliseconds** (roughly 100x faster than the 200ms-1,000ms+ cold starts on AWS Lambda)

**Compilation Pipeline:**
- First 10-50 requests to a fresh isolate run on Ignition bytecode (slower, ~8-10ms)
- After TurboFan optimization kicks in, function execution drops to ~2ms
- Cloudflare maintains a fleet-wide cache of compiled worker code, so compiled bytecode can be fetched from cache rather than recompiled from source on new edge nodes

**Resource Limits:**

| Limit | Free Plan | Paid Plan ($5/month) |
|-------|-----------|---------------------|
| Requests | 100,000 per day | 10 million per month included |
| CPU time (default) | 10 ms | 30 seconds (configurable up to 5 minutes / 300,000 ms) |
| Memory | 128 MB per isolate | 128 MB per isolate |
| Script size | 1 MB | 10 MB |
| Environment variables | 64 | 128 |
| Subrequests | 50 per request | 1,000 per request |

**Billing model:** On the paid plan, you are billed per millisecond of actual CPU time, not wall-clock time. If a Worker spends 200ms waiting for a database response but only 5ms processing data, you are billed for 5ms.

#### Cloudflare R2 (Object Storage)

R2 is a distributed, S3-compatible object storage solution with **zero egress fees**.

**Key Technical Specs:**
- S3-compatible API (works with existing S3 tools, libraries, and extensions)
- Durability: 11 nines (99.999999999%)
- Natively integrates with Cloudflare Workers

**Pricing:**

| Component | Standard | Infrequent Access |
|-----------|----------|-------------------|
| Storage | $0.015/GB/month | $0.01/GB/month |
| Class A ops (writes) | $4.50/million | $9.00/million |
| Class B ops (reads) | $0.36/million | $0.90/million |
| Egress | **$0 (free)** | **$0 (free)** |
| Data retrieval | N/A | $0.01/GB |

**Free tier:** 10 GB storage, 1 million Class A operations, 10 million Class B operations per month (Standard storage only).

#### Cloudflare D1 (Edge Database)

D1 is a managed, serverless database built on the SQLite engine with a 3-layer architecture:

1. **Binding API layer** - runs in the customer's Worker
2. **Stateless Worker layer** - routes requests based on database ID
3. **Durable Objects layer** - handles actual SQL operations

**Architecture Details:**
- Each D1 database is a single Durable Object in a single location
- All writes route to that location (strong consistency via single-actor model)
- Queries execute sequentially, not in parallel
- A database processing 10ms queries can handle roughly 100 queries/second
- SQLite runs in WAL (Write-Ahead Log) mode
- Designed for horizontal scale-out across multiple smaller databases (max 10 GB each), such as per-user or per-tenant databases
- **Time Travel**: point-in-time recovery to any minute within the last 30 days
- No distributed consensus needed since all operations serialize through one actor

#### Argo Smart Routing

Argo Smart Routing detects real-time network issues and routes traffic over the fastest available paths through Cloudflare's network.

**How It Works:**
1. Sends millions of synthetic probes from every Cloudflare data center to every customer origin
2. Monitors latency, packet loss, and throughput every **60 seconds**
3. Builds a real-time map of the fastest routes across the network
4. Dynamically routes traffic to avoid congestion, unlike standard BGP which only considers hop count

**Performance Results:**
- Average **30% faster** web application performance
- **35% decrease** in latency
- **27% decrease** in connection errors
- **60% decrease** in cache misses (via Tiered Cache)
- Up to **40% reduction** in end-user round-trip times (last-mile)
- Up to **17% latency improvement** for UDP-based applications (gaming, video calls)

**Argo for Packets** extends this to Layer 4, optimizing paths for Magic Transit, Magic WAN, and Cloudflare for Offices. It examines every path from every Cloudflare data center to the origin and compares Layer 4 traffic and network analytics across all unique paths.

#### Spectrum (TCP/UDP Proxy)

Spectrum is a Layer 4 reverse proxy that extends DDoS protection to non-HTTP protocols.

**Technical Details:**
- Supports TCP and UDP protocols (MQTT, email, file transfer, version control, gaming, etc.)
- Provides DDoS protection at Layers 3-4 of the OSI model
- Uses SYN cookie challenges via the Linux networking stack against SYN floods
- Conceals origin IP from attackers
- Proxy Protocol support for TCP to preserve client IP information
- Custom Simple Proxy Protocol for UDP client IP preservation
- Unmetered DDoS protection included
- Drops packets targeting non-specified ports automatically

#### Magic Transit

Magic Transit is a BGP-based DDoS protection and traffic acceleration service for entire IP networks.

**How It Works:**
1. Customer brings their IP prefix (minimum /24) to Cloudflare
2. Cloudflare advertises the prefix via BGP from all data centers worldwide (IP Anycast)
3. Customer stops announcing the prefix to their own ISPs
4. All internet traffic destined for the customer's prefix is now routed to the nearest Cloudflare data center
5. Traffic is scrubbed in-line at every data center using automated DDoS mitigation
6. Clean traffic is delivered back via GRE tunnels, IPsec tunnels, or Cloudflare Network Interconnect (CNI)

**Key capability:** Network-layer DDoS protection for entire IP ranges, not just individual domains.

#### 1.1.1.1 DNS Resolver

Launched **April 1, 2018** in partnership with **APNIC** (Asia-Pacific Network Information Centre).

**Technical Details:**
- IPv4 addresses: 1.1.1.1 and 1.0.0.1 (provided by APNIC)
- IPv6 addresses: 2606:4700:4700::1111 and 2606:4700:4700::1001
- Served via Cloudflare's global Anycast network (ASN AS13335)
- Supports DNS-over-TLS (DoT) and DNS-over-HTTPS (DoH)
- All logs deleted within 24 hours
- No client IP addresses stored
- No data sold or shared with third parties (except anonymized query data shared with APNIC for DNS research)
- Independently audited privacy practices

### 1.5 Anycast Implementation

Cloudflare operates a global Anycast network under **ASN AS13335**.

**Technical Implementation:**
- Every server in every data center is configured to receive traffic from any of Cloudflare's public IP addresses
- Routes are announced via BGP from the servers themselves using **Bird** (BGP routing daemon)
- All servers announce a route across the LAN for all IPs, but each server assigns its own weight to each IP's route
- The router is configured to prefer the route with the lowest weight

**Failover Mechanism:**
- If a server crashes, Bird stops announcing the BGP route to the router
- The router sends traffic to the server with the next-lowest weighted route
- If a switch fails, all BGP routes to servers behind that switch are automatically withdrawn
- Routers drop the IPs out of the WAN Anycast pool, and traffic fails over to the next closest data center
- No manual intervention required

### 1.6 Free Tier Business Model

Cloudflare's free tier is a strategic business decision, not charity.

**How it works economically:**

1. **Idle Capacity Utilization**: Cloudflare uses idle capacity across its network to serve free customers, so the marginal cost is near zero
2. **ISP Partnerships**: The scale generated by free customers makes Cloudflare attractive to ISPs globally, who host Cloudflare servers in their facilities, reducing colocation and bandwidth costs
3. **Threat Intelligence**: More free users means more traffic data, which improves WAF rules, bot detection, and smart routing for enterprise customers
4. **Conversion Funnel**: Free users (developers, startups, hobbyists) grow and eventually need paid features (WAF, Bot Management, Workers, Zero Trust)
5. **Brand and Talent**: Free customers serve as efficient brand marketing and help attract developers, customers, and employees

**Paid Plan Tiers:**
- Free: $0 (unlimited bandwidth, basic CDN, basic DDoS protection)
- Pro: $20/month (enhanced features, WAF rules)
- Business: $200/month (advanced security, SLA)
- Enterprise: Custom pricing (dedicated support, advanced features)

**Usage-Based Revenue:** Workers, R2, Stream, D1, and Zero Trust services are priced based on consumption, generating revenue as customers scale.

---

## 2. Akamai

### 2.1 History and Founding

Akamai was incorporated on **August 20, 1998**, by **Dr. Tom Leighton** (MIT mathematics professor) and **Daniel Lewin** (MIT graduate student), along with co-founders Jonathan Seelig and Randall Kaplan.

**The Problem:**
In the mid-1990s, the internet suffered from what was known as the **"World Wide Wait"** - web congestion that made accessing popular content painfully slow. The problem was especially acute during traffic spikes, known as the "hot-spot" problem, where popular content on a single server would overwhelm its capacity.

**The Algorithm:**
While at MIT, Lewin and his advisor Leighton developed **consistent hashing**, an algorithm for distributing content across a network of servers to optimize Internet traffic. Lewin's master's thesis contained the fundamental algorithms that became the core of Akamai's services. The key insight was that applied mathematics could solve web congestion by intelligently replicating and delivering content over a large network of distributed servers.

By 1998, they had patented these algorithms and founded Akamai (a Hawaiian word meaning "intelligent" or "clever").

**Daniel Lewin held 25 U.S. patents**, including methods for content delivery using edge-of-network servers. In 2017, Leighton and Lewin were inducted into the **National Inventors Hall of Fame** for "inventing the methods needed to intelligently replicate and deliver content over a large network of distributed servers."

**September 11, 2001:**
Daniel Lewin was a passenger on American Airlines Flight 11 and is identified as the **first victim of the September 11 attacks**, reportedly stabbed during the hijacking. The irony of his legacy: because of Akamai's technology, almost every major news website remained up and running on September 11, 2001, handling unprecedented traffic spikes - proving everything Danny Lewin had promised to be possible.

### 2.2 Current Scale (2025-2026)

| Metric | Value |
|--------|-------|
| Servers | 300,000+ (some sources cite 365,000+) |
| Locations | 4,100+ globally |
| Networks | 1,300+ |
| Countries | 134-136 |
| Network capacity | 300+ Tbps |
| Peak traffic record | 140 Tbps (February 2026) |
| Daily peak traffic | 50+ Tbps regularly |
| IPv6 traffic record | 21 Tbps |

### 2.3 Key Acquisitions

| Year | Company | Price | Purpose |
|------|---------|-------|---------|
| 2021 | **Guardicore** | ~$600 million | Micro-segmentation for Zero Trust, ransomware defense |
| 2022 | **Linode** | ~$900 million | Developer-friendly cloud computing (compute, storage, networking) |

**Guardicore Acquisition:**
- Completed in Q4 2021
- Added micro-segmentation capabilities to Akamai's Zero Trust portfolio
- Enables enterprises to prevent lateral movement of malware and ransomware within networks

**Linode Acquisition:**
- Completed on February 15, 2022
- Expected to add ~$100M in revenue for fiscal year 2022
- Strategic move to build a comprehensive cloud computing service with compute capacity at the edge
- Enables use cases like immersive retail, spatial computing, and IoT

### 2.4 Intelligent Edge Platform

Akamai's Intelligent Edge Platform is the core infrastructure powering all their services.

**Architecture:**
- 4,100+ locations in 134+ countries
- 300,000-365,000+ servers deployed at the edge of the Internet
- Servers placed inside ISP networks, close to end users
- Real-time monitoring and traffic analysis across the entire network
- Algorithms that continuously measure performance between all network segments

**Key Capabilities:**
- Dynamic content acceleration
- Application-layer (L7) security
- Media delivery at scale
- Edge compute (EdgeWorkers)
- API security and acceleration

### 2.5 SureRoute Routing Optimization

SureRoute is Akamai's proprietary routing algorithm that overcomes the limitations of standard BGP routing.

**How It Works:**
1. After serving content to an end-user for non-cacheable requests, SureRoute initiates a **"race"**
2. Three simultaneous requests are sent from the edge server to the origin:
   - **Route 1:** Edge server to a nearby Akamai edge server (via Akamai high-speed protocols), then to origin
   - **Route 2:** Edge server to a different nearby Akamai edge server (via Akamai high-speed protocols), then to origin
   - **Route 3:** "Classic" route - edge server directly to origin over standard BGP/TCP/IP
3. The routes race to retrieve a special **SureRoute Test Object (SRTO)** hosted at the origin
4. The fastest route wins, and subsequent traffic uses that route
5. Races are performed periodically to adapt to changing network conditions

**Why It Outperforms BGP:**
- Standard BGP routing looks for the shortest number of hops between endpoints
- BGP gives no consideration to actual performance - it often sends data through heavily congested routes
- SureRoute constantly measures actual throughput on network segments and identifies faster alternate paths
- The SRTO should be lightweight (no database calls or backend processing) to accurately measure network performance

### 2.6 Prolexic DDoS Protection

**Infrastructure:**
- 32 anycast global scrubbing centers
- 20+ Tbps of dedicated DDoS defense capacity (doubled with 6th-generation platform in 2023)
- Fully software-defined, scalable infrastructure
- 225+ frontline responders across 6 global locations
- 24/7 Security Operations Control Center (SOCC)

**Operation:**
- Incoming traffic is routed to the nearest scrubbing center
- Anti-DDoS appliances identify and remove malicious traffic
- Clean traffic is forwarded to the origin
- Proactive mitigation controls tailored to each customer's traffic profile
- **100% uptime SLA**

**Deployment options:**
- Cloud-based (Prolexic Routed)
- On-premises (Prolexic On-Prem, powered by Corero)
- Hybrid (combines both for extremely large attacks that could overwhelm local links)

---

## 3. Anycast Networking

### 3.1 Addressing Types Comparison

| Type | Communication Pattern | Description |
|------|----------------------|-------------|
| **Unicast** | One-to-one | Data from one sender to one specific receiver. Used in HTTP, FTP, SMTP. Dedicated point-to-point communication. |
| **Multicast** | One-to-many (group) | Data from one sender to a specific group of receivers. Only devices subscribed to the multicast group receive data. Used in IPTV, video conferencing. |
| **Anycast** | One-to-nearest | Data from one sender to the topologically nearest receiver among multiple sharing the same address. Used in DNS, CDN. |
| **Broadcast** | One-to-all | Data from one sender to all devices on a network segment. Used in ARP, DHCP. |

### 3.2 How Anycast Works at the BGP Level

**Core Concept:**
Multiple servers in different geographic locations are assigned the **same IP address**. Each location announces this IP prefix to its upstream providers and Internet Exchange Points (IXPs) via BGP.

**Step-by-Step Process:**

1. **IP Assignment:** The same IP prefix (e.g., 1.1.1.0/24) is configured on routers at multiple Points of Presence (PoPs) worldwide
2. **BGP Announcement:** Each PoP advertises the same prefix to its BGP peers (upstream ISPs, IXPs)
3. **Route Propagation:** BGP propagates these route announcements across the Internet's routing tables
4. **Path Selection:** When a router receives multiple announcements for the same prefix from different paths, BGP's path selection algorithm chooses the "best" route based on:
   - Shortest AS-path length (fewest autonomous systems to traverse)
   - Local preference
   - Multi-Exit Discriminator (MED)
   - IGP metric to the BGP next-hop
   - Router ID as final tiebreaker
5. **Packet Routing:** User packets are routed to the topologically "nearest" server (in terms of network hops, not physical distance)

**Important distinction:** "Nearest" in Anycast means the shortest BGP path, which is based on AS-hop count and routing policy, not necessarily the lowest latency or physical proximity. A single hop with high latency may be "closer" in BGP terms than multiple shorter hops.

### 3.3 Automatic Failover

Anycast provides built-in automatic failover without additional complexity:

1. **Health Monitoring:** Each PoP monitors the health of its local services
2. **Route Withdrawal:** If a service at a PoP fails, the BGP route for that prefix is withdrawn from that location
3. **Re-convergence:** BGP routers across the Internet update their routing tables, removing the failed path
4. **Traffic Redirection:** Packets that were going to the failed PoP are automatically routed to the next-nearest PoP that is still announcing the prefix
5. **Convergence Time:** BGP re-convergence typically takes seconds to a few minutes, depending on the network topology

**Key benefit:** No DNS-based failover (which depends on TTL expiry), no load balancer configuration - failover is handled at the network routing layer itself.

### 3.4 Anycast in DNS Resolvers

**Cloudflare 1.1.1.1:**
- IP 1.1.1.1 is announced from 330+ cities across 125+ countries via Cloudflare's Anycast network (AS13335)
- User queries automatically reach the nearest Cloudflare data center
- If a data center fails, BGP re-routes queries to the next-nearest location

**Google 8.8.8.8:**
- Google Public DNS uses Anycast from multiple data centers globally
- Same failover mechanism applies

**Root DNS Servers:**
- Most of the 13 root DNS server letters use Anycast
- For example, the "K" root server (RIPE NCC) has instances in 70+ locations worldwide, all sharing the same IP

### 3.5 Technical Considerations

**BGP Announcement from Multiple PoPs:**
- Each PoP uses eBGP to announce the same prefix to its transit providers and peers
- Within a PoP, iBGP distributes the prefix across internal routers
- Communities and local-preference can be used to influence traffic engineering (e.g., preferring traffic at certain PoPs)
- Prepending AS-path can de-prefer certain locations to influence global traffic distribution

**Challenges:**
- TCP connections can break if BGP re-routes traffic mid-session to a different PoP (known as "Anycast affinity" problem)
- For stateless protocols (DNS over UDP), this is not an issue
- For TCP-based services, CDNs use additional mechanisms (ECMP hashing, connection tracking) to maintain session affinity
- IPv6 natively supports Anycast addressing, while IPv4 Anycast is implemented as a routing configuration (not in the addressing itself)

---

## 4. CDN Caching

### 4.1 Cache Hierarchy

Modern CDNs use a tiered caching architecture to maximize cache hit ratios while minimizing origin load.

**Three-Tier Model:**

```
User Request
    |
    v
[L1 - Edge PoP (Lower-Tier)]
    |  (cache miss)
    v
[L2 - Regional/Shield PoP (Upper-Tier)]
    |  (cache miss)
    v
[L3 - Origin Server]
```

**L1 - Edge Cache (Lower-Tier):**
- Located at the PoP closest to the end user
- Small, fast cache optimized for low latency
- High volume, lower cache hit ratio per individual PoP
- Handles the majority of requests from nearby users

**L2 - Regional/Shield Cache (Upper-Tier):**
- Aggregates cache misses from multiple L1 edge PoPs
- Larger cache capacity
- Significantly reduces origin load by serving as a shared cache for a region
- Only L2 caches communicate with the origin on cache misses

**L3 - Origin Server:**
- The authoritative source of content
- Only receives requests that miss both L1 and L2 caches

**Cloudflare Tiered Cache Implementation:**
- Divides data centers into lower-tiers and upper-tiers
- If content is not cached at the lower-tier, it asks the upper-tier
- Only the upper-tier can ask the origin for content
- **Smart Tiered Cache** dynamically selects the single closest upper-tier data center to each customer's origin server using latency data
- No configuration required - Cloudflare uses real-time latency data to automatically choose the best upper-tier

**AWS CloudFront Origin Shield:**
- An additional caching layer between edge locations and the origin
- If the shield also lacks the asset, only one request proceeds to the origin
- Content is cached in the shield and shared with all edge locations

### 4.2 Cache-Control Headers

The `Cache-Control` HTTP header is the primary mechanism for controlling caching behavior.

**Freshness Directives:**

| Directive | Scope | Description |
|-----------|-------|-------------|
| `max-age=N` | Browser + CDN | Cache the response for N seconds from the time of the request |
| `s-maxage=N` | CDN/Proxy only | Overrides `max-age` for shared caches (CDNs, proxies). Browsers ignore this. |
| `stale-while-revalidate=N` | Browser + CDN | After freshness expires, serve stale content for up to N seconds while revalidating in the background |
| `stale-if-error=N` | Browser + CDN | If the origin returns an error (5xx), serve stale content for up to N seconds |

**Restriction Directives:**

| Directive | Description |
|-----------|-------------|
| `no-cache` | Must revalidate with the origin before serving (does NOT mean "do not cache" - content CAN be stored) |
| `no-store` | Do not cache the response at all. No storage in any cache. |
| `private` | Only the user's browser may cache this. CDNs and proxies must not cache. |
| `public` | Any cache (browser, CDN, proxy) may store the response. |
| `must-revalidate` | Once stale, must revalidate before serving. Cannot serve stale content. |
| `proxy-revalidate` | Same as `must-revalidate` but only for shared caches (CDNs). |
| `no-transform` | Caches must not modify the response body (e.g., no image compression). |
| `immutable` | The response body will never change. Browsers should not revalidate even on user-initiated reloads. |

**CDN-Specific Headers:**

Cloudflare introduced `CDN-Cache-Control` as a way for origins to specify caching behavior specifically for CDN layers without affecting browser caching. This allows different TTLs for the CDN edge vs. the browser.

**Example combining headers:**
```
Cache-Control: public, max-age=60, s-maxage=86400, stale-while-revalidate=3600, stale-if-error=86400
```
This means: browsers cache for 60 seconds, CDN caches for 24 hours, CDN serves stale for up to 1 hour while revalidating, and serves stale for up to 24 hours if origin is down.

### 4.3 Conditional Requests

Conditional requests allow caches to validate whether their stored copy is still fresh without downloading the entire resource again.

**ETag-Based Validation (If-None-Match):**

1. Origin responds with `ETag: "abc123"` header
2. When cache needs to revalidate, it sends: `If-None-Match: "abc123"`
3. If the resource has not changed, the origin returns **304 Not Modified** (no body)
4. If the resource has changed, the origin returns **200 OK** with the new body and a new ETag

**Strong vs. Weak ETags:**
- **Strong ETag** (e.g., `"abc123"`): Must change whenever the resource changes in any way, byte-for-byte
- **Weak ETag** (e.g., `W/"abc123"`): Indicates semantic equivalence - two versions with the same weak ETag are "equivalent" even if not byte-identical (e.g., differing only in a timestamp in a footer)

**Date-Based Validation (If-Modified-Since):**

1. Origin responds with `Last-Modified: Thu, 01 Jan 2026 00:00:00 GMT`
2. Cache sends: `If-Modified-Since: Thu, 01 Jan 2026 00:00:00 GMT`
3. If the resource has not been modified since that date, origin returns **304 Not Modified**
4. Otherwise, origin returns **200 OK** with the updated resource

**304 Response Headers:**
When returning 304, the server includes: `Cache-Control`, `Content-Location`, `Date`, `ETag`, `Expires`, and `Vary`.

**Best Practice:** Use ETags when possible (more precise), and combine with `Last-Modified` for broader compatibility.

### 4.4 Cache Invalidation Strategies

**1. Hard Purge:**
- Immediately removes content from the cache
- The next request for that content must go to the origin
- Most aggressive form of invalidation
- May cause a thundering herd effect if many edge servers simultaneously request the same content from the origin

**2. Soft Purge:**
- Marks content as stale rather than removing it
- The first user after a soft purge receives the stale response while the CDN fetches a fresh copy in the background
- Avoids the thundering herd problem
- Provides better user experience (no cold cache miss)

**3. Tag-Based Purge (Surrogate Keys):**
- Content is labeled with one or more surrogate keys (cache tags) via response headers
- One key can appear on multiple objects, and one object can have multiple keys
- Purging by tag removes all content with that tag across the entire CDN
- Example: tag all product images with `product-123`, then purge that tag when the product updates

Example header: `Surrogate-Key: product-123 category-electronics homepage-featured`

Purging `product-123` invalidates that specific product's resources globally. Purging `category-electronics` invalidates all electronics category resources.

**4. URL-Based Purge:**
- Purge a specific URL or URL pattern
- Most granular form of invalidation

**5. Purge Everything:**
- Clears the entire cache
- Should be used sparingly as it causes massive origin load

**Cloudflare Instant Purge:**
Cloudflare claims to purge cached content globally in under **150 milliseconds**.

### 4.5 Cache Hit Ratios

**What "good" looks like:**
- **95-99%** cache hit ratio is considered excellent
- Below **90%** indicates optimization opportunities
- Formula: `(Cache Hits / (Cache Hits + Cache Misses)) * 100`

**Common Causes of Low Hit Ratios:**
- Short TTL values forcing frequent revalidation
- Cache-Control headers set to `no-cache`, `no-store`, `max-age=0`, or `private`
- High content diversity with low repeat access (long-tail content)
- Query string variations creating unique cache keys for the same content
- Cookie-based cache key variation
- Missing `Vary` header configuration

**Strategies to Improve:**
- Use longer TTLs with cache-busting file names (content hashing)
- Implement cache warming (pre-populating cache with popular content)
- Normalize query strings and cookie handling
- Use tiered caching (shield) to consolidate cache misses
- Implement `stale-while-revalidate` to serve stale content while refreshing

### 4.6 TTL Strategies by Content Type

| Content Type | Recommended TTL | Notes |
|-------------|----------------|-------|
| **Versioned static assets** (CSS, JS with hash) | 1 year (31536000s) | Use content hash in filename for safe long-term caching |
| **Images** | 1 day to 1 year | Depends on whether images change; use versioned URLs if possible |
| **Fonts** | 1 year (31536000s) | Rarely change; safe to cache long-term |
| **HTML pages** (homepage, landing) | 1-5 minutes (60-300s) | Needs freshness; use `stale-while-revalidate` |
| **Search results / dynamic pages** | 0-60 seconds | Or use `no-cache` with ETag validation |
| **API responses (public data)** | 1-24 hours | Depends on data freshness requirements |
| **API responses (private/user data)** | `private, no-store` | Never cache in CDN |
| **User dashboards** | `private, no-cache` | Must not be cached in shared caches |
| **Checkout / auth pages** | `no-store` | Sensitive data - never cache |
| **Video/media files** | 1-7 days | Large files benefit greatly from caching |
| **Vendor libraries** (jQuery, Bootstrap) | 1 year | Version pinned, never change |

**Best Practice for Static Assets:**
Include a content hash in the filename (e.g., `style.a1b2c3d4.css`). This allows caching for 1 year with `immutable`. When the content changes, the filename changes, so browsers fetch the new version automatically.

---

## 5. Edge Routing

### 5.1 DNS-Based Routing vs. Anycast Routing

**DNS-Based Routing:**
- CDN operates authoritative DNS for the customer's domain
- When a user resolves the domain, the CDN's DNS server returns the IP address of the optimal edge server
- The CDN determines the optimal server based on the user's DNS resolver location (EDNS Client Subnet for more precision), server load, and health
- **Used by:** Akamai, Limelight (historically), Fastly
- **Advantage:** Can consider more factors (server load, capacity, content availability) in routing decisions
- **Disadvantage:** Routing is based on DNS resolver location, not the actual user location; TTL of DNS records limits how quickly routing changes propagate

**Anycast Routing:**
- All edge servers share the same IP addresses
- BGP routing directs packets to the nearest PoP based on network topology
- **Used by:** Cloudflare, CacheFly
- **Advantage:** No DNS TTL delay; instant failover at the network layer; works for non-HTTP protocols
- **Disadvantage:** BGP "nearest" may not be lowest latency; less granular control over routing decisions

**Hybrid Approach (Most Modern CDNs):**
- DNS selects the nearest PoP region
- Anycast routes traffic to the best edge node within that region
- Combines the granular control of DNS routing with the resilience of Anycast

### 5.2 Real User Monitoring (RUM) for Routing

CDNs use RUM to make better routing decisions based on actual user experience:

1. **Data Collection:** JavaScript beacons embedded in web pages report actual page load times, DNS resolution times, TCP connection times, and TLS handshake times from real users
2. **Performance Map:** CDN builds a real-time performance map showing which edge servers perform best for users in specific networks and locations
3. **Routing Optimization:** Future requests from similar users/networks are routed to the edge server that has proven to deliver the best performance
4. **Continuous Learning:** The system continuously updates its routing model based on new RUM data

**Akamai mPulse** is a prominent RUM solution that reports end-user resolution times by geographic location and allows administrators to set up dynamic alerts for anomaly detection.

### 5.3 Latency-Based Routing

Beyond simple geographic or hop-count-based routing, modern CDNs measure actual network latency:

- CDN probes measure round-trip time between edge PoPs and user networks
- Routing decisions factor in a scoring function combining latency weight and server load
- This prevents traffic concentration at a single "nearest" PoP that may be overloaded
- Results in better actual user experience compared to pure geographic routing

### 5.4 Tiered Distribution (Shield/Mid-Tier Caching)

Tiered distribution reduces origin load by introducing intermediate caching layers:

```
User -> Edge PoP (L1) -> Shield/Regional PoP (L2) -> Origin
```

**Benefits:**
- Concentrates origin connections to a small number of data centers (not every edge PoP)
- Fewer open connections consuming origin server resources
- Higher cache hit ratio at the shield tier (aggregated traffic from multiple edge PoPs)
- Reduced bandwidth costs between CDN and origin

**Cloudflare Smart Tiered Cache:**
- Dynamically selects the single closest data center to the origin as the upper-tier
- Uses real-time latency data from actual requests
- No manual configuration required
- All lower-tier edge data centers contact this upper-tier on cache misses

### 5.5 Edge Compute Platforms

| Feature | Cloudflare Workers | Akamai EdgeWorkers | AWS Lambda@Edge |
|---------|-------------------|-------------------|-----------------|
| **Runtime** | V8 Isolates (JS, TS, WASM) | JavaScript (V8-based) | Node.js, Python |
| **Cold Start** | <5ms | ~50-100ms | 200-1,000ms+ |
| **Locations** | 330+ cities | 4,100+ locations | 450+ CloudFront PoPs |
| **Memory** | 128 MB | 128 MB | 128-10,240 MB |
| **Max Duration** | 5 min CPU time | ~60s | 5-30s (depending on trigger) |
| **Pricing** | $0.15/million requests (paid) | Enterprise custom pricing | $0.60/million requests |
| **Ecosystem** | R2, D1, KV, Durable Objects, Vectorize, Hyperdrive | Full Akamai platform | Full AWS ecosystem |
| **Developer Experience** | Straightforward CLI (Wrangler), local dev | Complex setup, requires access requests | Integrated with AWS console |

**Key architectural difference:** Cloudflare Workers uses V8 isolates (lightweight, sub-millisecond startup), while Lambda@Edge uses containers (heavier, longer startup). Akamai EdgeWorkers also use V8 but with more enterprise-oriented tooling.

---

## 6. Economics

### 6.1 CDN Pricing Models

**Bandwidth-Based Pricing:**
- Charged per GB of data transferred
- Most traditional model
- Rates vary by region (e.g., Asia-Pacific more expensive than North America)
- Volume discounts for higher usage
- Example: AWS CloudFront charges $0.085/GB for first 10 TB in the US

**Request-Based Pricing:**
- Charged per HTTP/HTTPS request processed
- Accounts for the compute cost of handling requests (TLS termination, header processing, cache lookup)
- Example: AWS CloudFront charges $0.0075 per 10,000 HTTPS requests

**Committed Use / Contract-Based:**
- 12+ month minimum contracts with committed usage levels
- Lower rates in exchange for volume commitments
- Typical for enterprise CDN providers (Akamai)
- Overage charges for exceeding committed levels

### 6.2 Cloudflare's Unique Free Tier Model

Cloudflare is the only major CDN provider offering a fully free CDN with unlimited bandwidth.

**Plan Comparison:**

| Plan | Monthly Cost | Key Features |
|------|-------------|--------------|
| Free | $0 | Unlimited bandwidth, basic CDN, DDoS protection, shared SSL, 3 page rules |
| Pro | $20 | WAF, image optimization (Polish), mobile optimization (Mirage), 20 page rules |
| Business | $200 | Custom SSL certificates, 100% uptime SLA, 50 page rules |
| Enterprise | Custom (typically $5,000+) | Dedicated support, advanced DDoS, Bot Management, custom configurations |

**Why it works:** The free tier drives scale (41M+ websites), which drives ISP partnerships (reducing Cloudflare's costs), which drives threat intelligence (improving paid security products), which drives enterprise revenue (the real money).

### 6.3 Akamai's Enterprise Pricing

- Base rates: **$0.035-$0.049 per GB**, varying by volume and geography
- Custom pricing based on traffic volume, regions, and specific services
- 12-month minimum contracts typical
- Estimated monthly costs for moderate traffic: $200-500+
- High-volume customers negotiate lower per-GB rates
- Additional charges for advanced features: WAF, Bot Manager, Image Management, API Acceleration

### 6.4 How CDNs Save Origin Costs

**Bandwidth Reduction:**
- A 95% cache hit ratio means 95% less bandwidth consumption at the origin
- For a site serving 100 TB/month, a CDN reduces origin bandwidth to ~5 TB/month
- At typical cloud egress rates ($0.08-0.12/GB), this saves $7,600-$11,400/month

**Server Load Reduction:**
- Fewer requests reaching the origin means fewer application server instances needed
- Reduces compute costs (fewer VMs, containers, or serverless invocations)

**DDoS Cost Avoidance:**
- Without CDN protection, a DDoS attack could require massive over-provisioning of origin infrastructure
- CDNs absorb attack traffic at the edge, keeping origin costs predictable

### 6.5 Bandwidth Alliance

Founded by Cloudflare in **2018**, the Bandwidth Alliance is a coalition of cloud and networking providers who discount or waive data transfer fees for shared customers.

**Members include:** Microsoft Azure, Google Cloud Platform, Oracle Cloud, IBM Cloud, DigitalOcean, Alibaba Cloud, Backblaze, Zenlayer, Cherry Servers, and 20+ total partners.

**How it works:**
- When transferring data between Bandwidth Alliance members, egress fees are reduced or eliminated
- Example: DigitalOcean waives egress fees for data transferred to Cloudflare
- Backblaze B2 + Cloudflare combination provides effectively free egress for stored content

**Strategic impact:** Reduces vendor lock-in by eliminating the cost barrier of moving data between providers.

---

## 7. Security

### 7.1 DDoS Mitigation at CDN Edge

**Scale of Modern Attacks (2025):**
- DDoS attacks surged by **121%** in 2025
- Cloudflare mitigated an average of **5,376 attacks per hour** automatically
- Record-breaking **31.4 Tbps** volumetric attack mitigated by Cloudflare (Q4 2025)
- HTTP-level attacks exceeded **200 million requests per second** (Aisuru-Kimwolf botnet)
- Akamai Prolexic provides 20+ Tbps of dedicated scrubbing capacity across 32 global centers

**CDN DDoS Mitigation Architecture:**
1. **Always-on detection:** Traffic analysis at every edge PoP in real-time
2. **Dynamic fingerprinting:** Attack traffic identified by packet header field patterns
3. **Inline scrubbing:** Malicious traffic dropped at the edge, closest to the attack source
4. **Anycast absorption:** Attack traffic is distributed across the entire global network, preventing any single point from being overwhelmed
5. **Automated mitigation:** No manual intervention needed for most attacks - rules trigger in milliseconds

**Cloudflare's Approach:**
- Runs DDoS mitigation on every server in every data center (not centralized scrubbing)
- 449 Tbps of network capacity absorbs even the largest attacks
- L3/L4 mitigation via Network-layer DDoS Attack Protection managed ruleset (enabled by default)
- L7 mitigation via HTTP DDoS Attack Protection and Rate Limiting

**Akamai's Approach:**
- Prolexic uses dedicated scrubbing centers (32 globally)
- 225+ frontline responders in 24/7 SOCC
- 100% uptime SLA
- Proactive mitigation controls tailored per customer
- On-prem + cloud hybrid deployment option

### 7.2 WAF at Edge

Web Application Firewalls at the CDN edge inspect HTTP/HTTPS traffic before it reaches the origin.

**Protections include:**
- SQL injection (SQLi)
- Cross-site scripting (XSS)
- Remote code execution (RCE)
- Local/remote file inclusion (LFI/RFI)
- Cross-site request forgery (CSRF)
- OWASP Top 10 vulnerabilities
- Zero-day vulnerability virtual patching

**CDN WAF Advantage:**
- Rules execute at the edge, blocking attacks before they consume origin resources
- Threat intelligence from massive traffic volumes (Cloudflare sees 20%+ of web traffic) improves rule accuracy
- Managed rulesets (auto-updated) reduce operational burden

### 7.3 Bot Management

**Bot Classification:**
- Each request is scored on the likelihood of being a bot vs. human
- Machine learning models trained on behavioral signals (mouse movement, click patterns, request timing)
- JavaScript challenges, CAPTCHA, and proof-of-work challenges for suspicious requests
- Known-bot databases (search engines, monitoring tools) receive controlled access

**Threats Mitigated:**
- Credential stuffing
- Content scraping
- Inventory hoarding
- Account takeover
- API abuse

### 7.4 SSL/TLS Termination at Edge

**How it works:**
- The CDN terminates the TLS connection at the edge PoP closest to the user
- A separate TLS connection (or plaintext, depending on configuration) connects the edge to the origin
- This is known as "full" (encrypted to origin) vs. "flexible" (plaintext to origin) SSL modes

**Benefits:**
- Reduced latency: TLS handshake happens with the nearby edge, not the distant origin
- TLS exhaustion attack mitigation: Computational cost of TLS is borne by the CDN's distributed infrastructure
- Certificate management: CDN can auto-provision and renew certificates (e.g., Cloudflare Universal SSL)
- Modern protocol support: CDN handles TLS 1.3, HTTP/2, HTTP/3 regardless of origin capabilities

**Cloudflare Universal SSL (since 2014):**
- Free SSL certificate for every domain, including on the free plan
- Automatically provisioned and renewed
- Was the industry's first free SSL offering

### 7.5 Zero Trust Networking

The convergence of CDN and security has produced Zero Trust platforms:

**Cloudflare One (SASE Platform):**
- Zero Trust Network Access (ZTNA) - replaces VPNs
- Secure Web Gateway (SWG)
- Cloud Access Security Broker (CASB)
- Network-as-a-Service (NaaS)
- Firewall-as-a-Service (FWaaS)
- Data Loss Prevention (DLP)
- Runs on the same 330+ city network as the CDN

**Akamai Enterprise Secure Access:**
- Leverages global CDN infrastructure for Zero Trust access
- Guardicore micro-segmentation for lateral movement prevention
- Identity-aware application access

**Market Context (2025):**
- Global SASE market valued at **$9.27 billion** in 2025
- Growing at **17.44% CAGR** to reach $39.4 billion by 2034
- Forrester Wave (Q3 2025) named 8 leaders: Cato Networks, Cloudflare, Fortinet, Netskope, Palo Alto Networks, SonicWall, Versa Networks, Zscaler
- Trend: standalone SSE market has largely disappeared, with most vendors now offering full SASE (SSE + SD-WAN)

---

## 8. Modern Developments

### 8.1 Edge Computing Trend

The evolution of CDNs from simple caching to full compute platforms represents one of the most significant shifts in web architecture.

**Market Growth (2020-2025):**
- CDN market CAGR: **14.1%**
- Serverless market CAGR: **22.7%**
- Edge computing market CAGR: **34.1%**

**What Edge Compute Enables:**
- Personalization without origin round-trips (A/B testing, geo-based content)
- Authentication and authorization at the edge
- API gateway functionality (rate limiting, request transformation, routing)
- Server-side rendering at the edge (reduced TTFB)
- Real-time data processing (IoT telemetry, analytics)
- AI inference at the edge (Cloudflare Workers AI)

### 8.2 Serverless at Edge

**Key platforms:**

| Platform | Technology | Notable Feature |
|----------|-----------|-----------------|
| Cloudflare Workers | V8 Isolates | <5ms cold start, 128MB memory |
| Deno Deploy | V8 Isolates | TypeScript-first, Web Standards API |
| Fastly Compute | WebAssembly | Language-agnostic (Rust, Go, JS) |
| AWS Lambda@Edge | Containers | Deep AWS integration |
| Vercel Edge Functions | V8 Isolates | Next.js integration |
| Akamai EdgeWorkers | V8-based | Enterprise-grade, 4,100+ locations |

**Architectural shift:** Traditional serverless (Lambda, Cloud Functions) runs in centralized cloud regions. Edge serverless distributes compute to 100s or 1,000s of locations worldwide, dramatically reducing latency for end users.

### 8.3 CDN + Security Convergence (SASE)

SASE (Secure Access Service Edge) represents the merger of networking and security services:

**Before SASE:**
- CDN for content delivery
- Separate DDoS protection service
- Separate WAF appliance
- Separate VPN for remote access
- Separate SWG for web filtering
- Multiple vendors, multiple control planes

**After SASE (converged):**
- Single network edge handles CDN, DDoS, WAF, ZTNA, SWG, CASB, FWaaS
- Single control plane for policy management
- Single data plane for traffic processing
- Reduced latency (one hop instead of multiple security appliances in series)

### 8.4 HTTP/3 and QUIC

**Protocol Overview:**
- HTTP/3 is built on **QUIC** transport protocol (instead of TCP)
- QUIC provides: multiplexed streams without head-of-line blocking, 0-RTT connection establishment, built-in TLS 1.3, connection migration (survives IP changes)

**Adoption (2025):**
- Global HTTP/3 adoption: **~35%** (Cloudflare data)
- ~31% of websites globally serve HTTP/3
- **85% of all HTTP/3 traffic** is served through CDNs
- CDNs are the primary driver of HTTP/3 adoption

**Performance Impact:**
- Response times: HTTP/1.1 (~3s) to HTTP/2 (~1.5s) to HTTP/3 (~0.8s) - roughly **47% improvement** over HTTP/2
- Greatest benefit on lossy networks (mobile, congested WiFi) where TCP head-of-line blocking causes stalls

**CDN Support:**
- Cloudflare: HTTP/3 enabled by default for all plans
- Fastly: HTTP/3 supported
- Akamai: HTTP/3 supported
- AWS CloudFront: HTTP/3 supported
- CDNs handle protocol negotiation (Alt-Svc header) and graceful fallback to HTTP/2

### 8.5 WebSocket Support at CDN Level

**Challenge:** Traditional CDNs are optimized for request-response patterns. WebSockets maintain persistent, full-duplex connections.

**Current Support:**
- Cloudflare has supported WebSocket proxying since **2014**
- Since 2022, Cloudflare supports origin-less WebSocket applications via Workers (Durable Objects)
- Fastly excels with WebSocket support and streaming capabilities
- Most major CDNs now support WebSocket proxying

**Technical Implementation:**
- Client sends HTTP Upgrade request to the CDN edge
- CDN establishes a WebSocket connection to the origin (or handles it at the edge)
- CDN proxies frames bidirectionally
- DDoS protection still applies to the WebSocket connection
- Challenge: WebSocket connections are long-lived, consuming edge resources

### 8.6 Image Optimization

**Cloudflare Image Optimization:**

**Polish (Automatic Compression):**
- Strips metadata from images
- Lossy mode: average **48% file size reduction**
- Lossless mode: smaller reduction but no quality loss

**Automatic Format Conversion:**
- Converts to WebP when browser supports it (26% smaller than PNG, 17% smaller than JPEG)
- Converts to AVIF when supported (significantly better compression than WebP)
- Falls back intelligently: AVIF preferred, then WebP, then original format
- Will not convert if the conversion would make the file larger or reduce quality disproportionately

**Image Resizing:**
- On-the-fly resizing at the edge
- Responsive images without pre-generating multiple sizes at the origin
- URL-based or Worker-based transformation API

### 8.7 Early Hints (HTTP 103)

**What it is:**
HTTP 103 Early Hints is an informational response sent by the server (or CDN) before the final response is ready, containing `Link` headers that hint at resources the browser should start fetching.

**How Cloudflare Implements It:**
1. Cloudflare parses responses for `Link` headers with `preload` or `preconnect` rel types
2. These headers are cached at the edge
3. On subsequent requests, Cloudflare sends a 103 Early Hints response immediately (from cache) while the origin processes the request
4. The browser begins preloading or preconnecting to the hinted resources
5. When the full response arrives, the browser has already started fetching critical resources

**Performance Impact:**
- Up to **30% improvement** in page load times (Cloudflare data)
- The "think time" while the origin compiles the response is used productively by the browser

**Requirements:**
- Only works over HTTP/2 and HTTP/3
- Supported by Chrome M94+ and other modern browsers
- Enabled in Cloudflare dashboard under Speed > Settings > Content Optimization

**Collaborative Development:**
Cloudflare, Google, and Shopify have been working together on Early Hints implementation and standardization to improve performance across the web.

---

## Key Comparisons

### Cloudflare vs. Akamai at a Glance

| Dimension | Cloudflare | Akamai |
|-----------|-----------|--------|
| **Founded** | 2009 | 1998 |
| **Network Size** | 330+ cities, 125+ countries | 4,100+ locations, 134+ countries |
| **Network Capacity** | 449 Tbps | 300+ Tbps |
| **Server Count** | Not disclosed (every server runs all services) | 300,000-365,000+ |
| **Routing Approach** | Anycast-first | DNS-based with Anycast |
| **Free Tier** | Yes (unlimited bandwidth) | No |
| **Edge Compute** | Workers (V8 Isolates, <5ms cold start) | EdgeWorkers (V8-based, enterprise-focused) |
| **DDoS Approach** | Inline mitigation on every server | Dedicated scrubbing centers (32 globally) |
| **Target Market** | Developers to enterprise | Enterprise-focused |
| **Pricing Model** | Feature-based tiers + usage-based | Custom contracts, bandwidth-based |
| **Object Storage** | R2 (zero egress) | Via Linode (now Akamai Cloud) |
| **Edge Database** | D1 (SQLite) | N/A |
| **DNS** | 1.1.1.1 (public resolver) | Edge DNS |
| **Zero Trust/SASE** | Cloudflare One | Enterprise Application Access + Guardicore |

---

## Sources

- Cloudflare Our Story: https://www.cloudflare.com/our-story/
- Cloudflare Wikipedia: https://en.wikipedia.org/wiki/Cloudflare
- Cloudflare Network: https://www.cloudflare.com/network/
- Cloudflare Radar 2025 Year in Review: https://radar.cloudflare.com/year-in-review/2025
- Cloudflare DDoS Q4 2025 Report: https://blog.cloudflare.com/ddos-threat-report-2025-q4/
- Cloudflare Workers Docs: https://developers.cloudflare.com/workers/reference/how-workers-works/
- Cloudflare R2 Pricing: https://developers.cloudflare.com/r2/pricing/
- Cloudflare D1 Docs: https://developers.cloudflare.com/d1/
- Cloudflare Argo Smart Routing: https://developers.cloudflare.com/argo-smart-routing/
- Cloudflare Tiered Cache: https://developers.cloudflare.com/cache/how-to/tiered-cache/
- Cloudflare Magic Transit Reference Architecture: https://developers.cloudflare.com/reference-architecture/architectures/magic-transit/
- Cloudflare Spectrum Docs: https://developers.cloudflare.com/spectrum/
- Cloudflare 1.1.1.1 Privacy: https://developers.cloudflare.com/1.1.1.1/privacy/public-dns-resolver/
- Cloudflare Early Hints: https://blog.cloudflare.com/early-hints/
- Cloudflare Polish Docs: https://developers.cloudflare.com/images/polish/
- Cloudflare Load Balancing Architecture: https://blog.cloudflare.com/cloudflares-architecture-eliminating-single-p/
- Cloudflare CDN-Cache-Control: https://blog.cloudflare.com/cdn-cache-control/
- Cloudflare Instant Purge: https://blog.cloudflare.com/instant-purge/
- Cloudflare Bandwidth Alliance: https://www.cloudflare.com/bandwidth-alliance/
- Cloudflare SASE: https://www.cloudflare.com/sase/
- Cloudflare Free Commitment: https://blog.cloudflare.com/cloudflares-commitment-to-free/
- Cloudflare Statistics 2026: https://www.demandsage.com/cloudflare-statistics/
- Akamai Company History: https://www.akamai.com/company/company-history
- Akamai Tom Leighton Bio: https://www.akamai.com/company/leadership/executive-team/tom-leighton
- Akamai Prolexic: https://www.akamai.com/products/prolexic-solutions
- Akamai Linode Acquisition: https://www.akamai.com/newsroom/press-release/akamai-completes-acquisition-of-linode
- Akamai Guardicore Acquisition: https://www.akamai.com/newsroom/press-release/akamai-completes-acquisition-of-guardicore-to-extend-its-zero-trust-solutions-to-help-stop-ransomware
- Akamai SureRoute Docs: https://techdocs.akamai.com/property-mgr/docs/sureroute-beh
- Daniel Lewin Wikipedia: https://en.wikipedia.org/wiki/Daniel_Lewin
- Daniel Lewin National Inventors Hall of Fame: https://www.invent.org/inductees/daniel-lewin
- MIT Remembering Danny Lewin: https://news.mit.edu/2011/remembering-danny-lewin
- Consistent Hashing Wikipedia: https://en.wikipedia.org/wiki/Consistent_hashing
- BGP Anycast Best Practices (Noction): https://www.noction.com/blog/bgp-anycast
- Anycast Wikipedia: https://en.wikipedia.org/wiki/Anycast
- MDN Cache-Control: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control
- MDN Conditional Requests: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Conditional_requests
- MDN HTTP 103: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/103
- Akamai Cache Hit Ratio Blog: https://www.akamai.com/blog/edge/the-key-metric-for-happier-users
- Fastly Surrogate Key Purging: https://www.fastly.com/documentation/guides/full-site-delivery/purging/purging-with-surrogate-keys/
- HTTP/3 Adoption Analysis: https://dev.to/linou518/http3-is-at-35-adoption-you-cant-call-quic-a-future-technology-anymore-2ghm
- CDN Architectures (Paessler): https://blog.paessler.com/cdn-architectures
- CDN System Design Handbook: https://www.systemdesignhandbook.com/guides/design-a-cdn-system-design/
- Forrester Wave SASE Q3 2025: https://www.forrester.com/blogs/forrester-wave-secure-access-service-edge-solutions-q3-2025-a-market-transformed/
- Edge Computing Comparison 2025: https://wavesandalgorithms.com/reviews/edge-computing-comparisons-review
