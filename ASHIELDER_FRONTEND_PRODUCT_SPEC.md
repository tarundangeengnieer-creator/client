# ASHIELDER — Frontend Product Specification
## AI-Powered Email Threat Detection, GeoLocation & Forensic Intelligence Platform
**Smart India Hackathon 2026 | Problem Statement: PS 26106**  
**Document Class:** Client-Side Product Experience & Forensic Workstation Architecture  
**Author:** Senior Product Designer, UX Architect & Cybersecurity SOC UX Specialist  
**Status:** Authoritative Specification | Target Release: Production v1.0  

---

# Executive Summary

### 1.1 Problem Statement & Operational Reality (SIH 2026 PS 26106)
Modern email threats have evolved beyond crude phishing templates into multi-stage, infrastructure-backed cyber operations. Security Operations Center (SOC) analysts, incident responders, and digital forensics examiners confront thousands of inbound alerts daily, including:
- Business Email Compromise (BEC) and executive impersonation utilizing deceptive display names and lookalike domains.
- Sophisticated multi-hop relay spoofing, DKIM replay attacks, and SPF alignment bypasses.
- Weaponized attachments featuring obfuscated macros, polyglot files, and zero-day payloads.
- Evasive redirect chains, homograph attacks, punycode manipulation, and conditional geofencing.

The bottleneck in contemporary security operations is no longer raw detection capability; it is **cognitive bandwidth and investigative velocity**. Analysts are overwhelmed by disjointed tools, fragmented logs, ambiguous risk scores, and AI solutions that hallucinate explanations without verifiable provenance.

### 1.2 Product Vision: The ASHIELDER Workstation
**ASHIELDER** is an integrated, client-side cybersecurity investigation workstation purpose-built for high-pressure security teams. It bridges the gap between high-throughput automated triage and court-admissible forensic scrutiny.

ASHIELDER is conceived as:
$$\text{Professional SOC Platform} + \text{Digital Forensics Workstation} + \text{Modern Enterprise Dashboard} + \text{Grounded AI Copilot}$$

It delivers a unified cockpit where:
1. An analyst can comprehend an email alert's full operational picture within **5 seconds**.
2. An investigator can drill down into byte-level RFC 5322 header traces, DNS provenance, and sandbox artifacts within **1 click**.
3. An incident response lead can generate a cryptographically verifiable, audit-ready forensic report within **30 seconds**.
4. An AI assistant acts strictly as an evidentiary co-pilot, citing immutable Evidence IDs for every conclusion while **never** having write access to verdicts or scores.

### 1.3 Target User Spectrum
- **Tier-1 SOC Analysts:** Focused on queue velocity, rapid triage, false-positive elimination, and SLA adherence (< 90 seconds per alert).
- **Tier-2 / Tier-3 Cybersecurity Analysts & Incident Responders:** Focused on deep artifact pivoting, blast radius assessment, root-cause correlation, and enterprise containment.
- **Digital Forensic Investigators & Law Enforcement / CERT Teams:** Focused on strict chain of custody, uncorrupted header forensics, network transit reconstruction, and legally admissible reports.
- **Enterprise CISOs & SOC Managers:** Focused on fleet threat posture, recurring campaign attribution, and team operational efficacy.

### 1.4 Architecture Stance: Client-Side Forensic Workstation
In accordance with system boundaries:
- The backend services (parsing pipelines, ML classification engines, geo-IP lookup databases, sandboxes, vector stores) are developed independently.
- This specification dictates the **entire client-side product experience**, UI state machines, design systems, forensic workflows, accessibility rules, and cognitive load optimizations.
- The client acts as a contract-driven, reactive presentation and analysis layer that treats backend outputs with cryptographic integrity, verifying hashes and rendering evidence without mutation.

---

# User Personas

| Dimension | Persona 1: SOC Analyst L1 (Triage) | Persona 2: Incident Responder L2/L3 | Persona 3: Digital Forensics Examiner | Persona 4: SOC Manager / CISO |
| :--- | :--- | :--- | :--- | :--- |
| **Representative Archetype** | "Priya" — Junior SOC Triage Specialist | "Arjun" — Senior Incident Response Engineer | "Dr. Mehta" — Digital Forensics & Legal Expert | "Vikram" — Head of Cyber Defense |
| **Primary Objective** | Clear inbox queues rapidly without missing true positives; avoid false alerts. | Identify threat actor infrastructure, isolate affected accounts, stop lateral spread. | Establish legal admissibility, verify RFC 5322 raw signatures, maintain chain of custody. | Monitor threat trends, evaluate team response times, approve enterprise containment actions. |
| **Time Spent Per Case** | 30 to 120 seconds. | 15 minutes to 4 hours. | Hours to days. | 3 to 5 minutes (Executive reviews). |
| **Key UX Need** | Instant verdict clarity, low visual noise, keyboard triage shortcuts, one-click escalation. | Deep cross-correlation, defanged sandbox artifacts, visual IP hops, similarity search. | Raw byte inspection, cryptographic hash verification, chronological hop latency validation. | High-level risk distribution, campaign impact, one-click court/executive report generation. |
| **Frustrations** | Ambiguous risk scores; hidden context; tools that take 30 seconds to render data. | AI tools that hallucinate reasons without showing underlying headers or URLs. | Reports that cannot be exported to court-compliant PDF; missing raw RFC 822 logs. | Flawed metrics; confusing severity scales where "low confidence" is disguised as "safe". |
| **Critical Workstation Requirement** | High-contrast visual hierarchy, predictable status badges, rapid case filtering. | Split-screen evidence inspection, interactive GeoIP transit maps, defanged URL redirects. | Hex/Text viewer, RFC 5322 hop tree, cryptographic report signing hashes, immutable evidence IDs. | Executive summary tab, campaign clustering, exportable formal documentation. |

---

# Design Principles

The ASHIELDER user interface strictly adheres to ten non-negotiable architectural axioms:

```
+-----------------------------------------------------------------------------------------------+
|                                  ASHIELDER CORE DESIGN AXIOMS                                 |
+------------------------------------+----------------------------------------------------------+
| 1. EVIDENCE FIRST                  | Every claim must directly link to an immutable artifact. |
| 2. SUMMARY BEFORE DETAIL           | Reveal state in tiers: HUD -> Summary -> Deep Forensics. |
| 3. CURRENT CASE ≠ HISTORICAL       | Historical data informs context; it never replaces facts.|
| 4. SYSTEM FINDING ≠ AI EXPLANATION | Deterministic signatures and generative AI never merge.  |
| 5. RISK ≠ CONFIDENCE               | Risk is impact/threat; Confidence is evidence fidelity.  |
| 6. MISSING EVIDENCE ≠ SAFE         | Degraded signals must show caution, never false safety.  |
| 7. AI IS ASSISTANT, NOT AUTHORITY  | The machine proposes, contextualizes; analyst decides.   |
| 8. EXPLAINABLE INVESTIGATION       | Every pipeline transformation must be step-auditable.    |
| 9. TRACEABLE EVIDENCE IDENTIFIERS | All telemetry receives immutable keys ([EVD-HDR-001]).   |
| 10. DRILL-DOWN PROVENANCE          | 1 click from explanation to exact raw source bytes.      |
+------------------------------------+----------------------------------------------------------+
```

### 1. Evidence First
Hypotheses and suggestions are meaningless without tangible artifacts. The UI always renders the raw proof (email headers, DNS records, decoded URLs, file hashes) alongside any synthesized conclusions.

### 2. Summary Before Detail
To prevent cognitive overload, information is layered into three distinct horizons:
- **Horizon 1 (0–3 seconds):** Visual HUD (Verdict, Risk, Confidence, Sender, Threat Type, Primary Action).
- **Horizon 2 (3–30 seconds):** Key Findings Panel, Authentication Matrix, Hop Route, Critical URL/Attachment cards.
- **Horizon 3 (Deep Analysis):** Raw Header Hex/Text inspector, Redirect chain hop logs, Passive DNS tables, Execution sandbox graphs.

### 3. Current Case ≠ Historical Context
Past attacks from a similar domain or IP provide heuristic intelligence, but they **must never** be conflated with the evidentiary facts of the current active message. Historical intel is isolated visually with distinct border treatments, subtle background patterns, and explicit "HISTORICAL CORRELATION" labeling.

### 4. System Finding ≠ AI Explanation
Deterministic findings (e.g., `DKIM signature validation failed: body hash mismatch [RFC 6376]`) are generated by deterministic code. Generative AI summaries are probabilistic language syntheses. 
- **System Findings** are rendered with solid, high-contrast, structured metadata badges and technical monospace codes.
- **AI Explanations** are rendered in dedicated containers with a subtle AI insignia, conversational yet disciplined typography, and mandatory evidentiary footnotes.

### 5. Risk ≠ Confidence (The 2D Risk-Confidence Grid)
A message can have **100% Risk** with **99% Confidence** (e.g., known ransomware hash matched against multiple threat feeds). Conversely, a message can have **80% Risk** with **20% Confidence** (e.g., brand-new domain registered 10 minutes ago sending an urgent invoice, but external sandbox timed out). Combining these into a single scalar destroys tactical fidelity. ASHIELDER displays Risk and Confidence as distinct orthogonal metrics.

### 6. Missing Evidence ≠ Safe
If an attachment sandbox times out, or a WHOIS server throttles rate limits, the system does **not** assume the artifact is benign. The UI highlights missing or failed pipeline nodes in distinct amber/neutral warning states, lowering the system's **Confidence Score** while keeping the analyst vigilant.

### 7. AI is Assistant, not Authority
The AI Copilot does **not** possess controls to alter case verdicts, modify risk scores, or trigger irreversible escalations. It assists solely by correlating data, explaining technical RFC nuances, highlighting anomalies, and drafting investigative summaries.

### 8. Explainable Investigation Journey
Every analysis pipeline step (Ingestion $\rightarrow$ MIME Unpacking $\rightarrow$ Header Parsing $\rightarrow$ DNS Resolution $\rightarrow$ Sandbox Detonation $\rightarrow$ Threat Scoring) is visualized in an interactive, chronological **Investigation Journey**. If a tool fails or produces degraded output, the analyst sees exactly where and why.

### 9. Traceable Forensic Evidence
Every parsed forensic artifact is assigned a globally unique, immutable Evidence ID (e.g., `EVD-HDR-001`, `EVD-NET-014`, `EVD-URL-003`, `EVD-ATT-002`). These identifiers are hyperlinked across all reports, AI responses, and timeline entries.

### 10. Single-Click Source Inspection
Whenever an analyst reads a conclusion or copilot answer, clicking an Evidence Chip immediately opens the **Evidence Explorer** or **Header Inspector**, scrolling precisely to the raw line or byte range and highlighting the verified source string.

---

# Information Architecture

The ASHIELDER client information architecture enforces strict separation of concerns while offering seamless pivot paths across entities (Cases, Indicators, Assets, Artifacts).

```
ASHIELDER SHELL
│
├── 1. AUTHENTICATION & ACCESS (SSO / MFA / Hardware Token / Session Guard)
│
├── 2. CASE INBOX (Global Triage Dashboard)
│   ├── Filter & Query Bar (Severity, Status, Target, Protocol, Time Range)
│   ├── Triage Grid / Forensic Table (Multi-density modes)
│   └── Quick-Peek Slideout Drawer (Sub-second triage)
│
├── 3. CASE WORKSPACE (/case/:id)
│   ├── Case Header HUD (Sticky: Case ID, Status, Verdict, Risk, Confidence, Metadata)
│   ├── Primary Tabbed Investigation Canvas:
│   │   ├── [Tab 1] Overview & Journey (Executive summary, Diagnostic Timeline, Key Findings)
│   │   ├── [Tab 2] Header Forensics (RFC 5322 Parser, Received Hop Visualizer, Auth Matrix)
│   │   ├── [Tab 3] URL & Domain Intelligence (Link extractor, Redirect chain, Homographs)
│   │   ├── [Tab 4] Infrastructure & Geo (Origin ASN, BGP routes, Interactive World Map)
│   │   ├── [Tab 5] Attachments & Sandboxing (Static hashes, MIME checks, Dynamic behavior)
│   │   ├── [Tab 6] Historical Intelligence (Vector cluster matches, Prior campaigns)
│   │   ├── [Tab 7] Evidence Explorer (Universal filterable repository of all EVD items)
│   │   └── [Tab 8] Forensic Report (Interactive live report + PDF export engine)
│   └── Right-Side Collapsible Drawer:
│       ├── ASHIELDER AI Copilot (Context-aware evidentiary dialogue)
│       └── Active Evidence Scratchpad & Investigation Notes
│
├── 4. SEARCH & THREAT HUNTING (/hunting)
│   └── Cross-Case Indicator Pivot Search (Query IPs, Domains, Hashes, Mailboxes)
│
├── 5. SYSTEM ADMINISTRATION & AUDIT (/admin)
│   ├── RBAC Matrix & Role Delegation
│   ├── Integration & Tool Health Status (DNS, Threat Feeds, Sandboxes)
│   └── Immutable User Action Audit Log
```

---

# Navigation

### 5.1 Global Navigation Rail (Persistent Left Rail)
- **Compact State:** 64px width (icon-only with tooltip labels and status pings).
- **Expanded State:** 240px width (icon, label, count badges, and current active case indicator).
- **Items:**
  1. **Case Inbox** (Hotkey: `G` then `I`): Badge shows pending unassigned alerts.
  2. **Active Case** (Hotkey: `G` then `W`): Direct jump to currently open case.
  3. **Threat Hunting** (Hotkey: `G` then `H`): IOC and historical indicator search.
  4. **Investigation Reports** (Hotkey: `G` then `R`): Repository of exported and draft reports.
  5. **Copilot / Intelligence** (Hotkey: `G` then `A`): Persistent AI assistant queries.
  6. **System & Tool Health** (Hotkey: `G` then `S`): Pipeline connectivity and external feed health.
  7. **Admin / RBAC** (Accessible only to Lead Forensics / SecOps Admin roles).

### 5.2 Contextual Header Bar & Case Breadcrumb
When inside a case:
`Inbox > Incident #ASH-2026-8841 > [SUSPICIOUS] Wire Transfer Authorization > Header Forensics`
- Quick Switcher dropdown next to Case ID allowing instantaneous jump to adjacent cases in the active triage queue without returning to the inbox.
- Real-time connection status indicator (WebSocket ping to forensic pipeline).

### 5.3 Command Palette (`Cmd + K` / `Ctrl + K`)
A unified search and action modal enabling power analysts to:
- Jump to any Case ID (e.g., `#ASH-8841`).
- Search any Indicator (e.g., `185.220.101.5`, `evil-update.com`, `SHA256:...`).
- Execute instant workflow actions: `Escalate Case`, `Export Report to PDF`, `Re-investigate Case`, `Toggle Raw Headers`, `Open AI Copilot`.

### 5.4 State Preservation & Deep Linking
Every tab, filter, inspector panel, and evidence drawer state is serialized into the URL query parameters:
`https://ashielder.internal/case/ASH-2026-8841?tab=headers&hop=2&evidenceId=EVD-HDR-004&copilot=open`
This guarantees that when an analyst shares a link with an incident responder or legal officer, they land on the exact byte and hop view being inspected.

---

# Case Inbox

The Case Inbox is the mission-critical entry point for operational triage. It must provide maximum situational awareness with minimal sensory fatigue.

```
+---------------------------------------------------------------------------------------------------------+
| ASHIELDER INBOX   [ All Cases (2,418) ]  [ Mine (14) ]  [ Unassigned (89) ]  [ Escalated (6) ] [ 🔍 Filter] |
+---------------------------------------------------------------------------------------------------------+
| Filters: [Verdict: All ▾] [Risk > 70 ▾] [Has Attachments ▾] [Auth Failed ▾] [Target: VIPs ▾]  [Density: ≡ ☷]|
+---+---------------+------------+------+------+--------------------+--------------------+-----------+---+
| ! | CASE ID       | VERDICT    | RISK | CONF | SENDER             | SUBJECT            | RECV TIME | A |
+---+---------------+------------+------+------+--------------------+--------------------+-----------+---+
| 🔴| ASH-2026-9012 | MALICIOUS  |  98% |  96% | ceo@micro-soft.top | URGENT: Wire Auth  | 2 min ago | … |
| 🟡| ASH-2026-9011 | SUSPICIOUS |  74% |  62% | invoice@paypaI.com | Invoice #99812     | 8 min ago | … |
| ⚪| ASH-2026-9010 | INCONCLUS. |  50% |  18% | alert@unknown.org  | System Maintenance | 14 min ago| … |
| 🟢| ASH-2026-9009 | BENIGN     |  04% |  99% | billing@aws.amazon | Monthly Invoice    | 22 min ago| … |
+---+---------------+------------+------+------+--------------------+--------------------+-----------+---+
```

### 6.1 Filter & Query Matrix
- **Verdict Filter:** Multi-select chips: `Malicious`, `Suspicious`, `Inconclusive`, `Benign`, `Pending Analysis`.
- **Bivariate Risk/Confidence Sliders:** Independent sliders for Risk ($0-100\%$) and Confidence ($0-100\%$).
- **Authentication Status:** Quick-filter toggle buttons: `SPF Fail`, `DKIM Fail`, `DMARC Reject`, `Alignment Mismatch`.
- **Artifact Presence:** `Has Attachments`, `Has External URLs`, `Has Password-Protected Zip`, `Has Homograph Domain`.
- **Target Context:** `VIP / Executive Mailbox`, `Finance Dept`, `Legal Dept`, `General Fleet`.

### 6.2 Table Density Controls
1. **Compact Mode (SOC Triage Velocity):** Single-line rows, 32px height, essential indicators, ideal for clearing 50+ cases/hour.
2. **Standard Mode (Default):** Two-line rows, 48px height, displays Sender display name + raw email, Subject line, and top 2 threat chips.
3. **Forensic Preview Mode:** 72px rows, includes thumbnail of redirect path, authentication badge cluster (S/D/D), and origin country flag.

### 6.3 Quick-Peek Drawer (Sub-Second Evaluation)
Pressing `Spacebar` while highlighting any row opens a right-hand slideout panel without navigating away from the inbox:
- Renders Executive Verdict, Risk/Confidence gauges, top 3 Key Findings, and Sender/Recipient envelope.
- Action hotkeys available in Quick-Peek: `E` (Escalate), `C` (Close as False Positive), `O` (Open Full Case Workspace), `J`/`K` (Next/Previous Case).

---

# Case Workspace

The Case Workspace is the primary forensic investigation environment. It provides a cohesive, multi-panel layout designed to maximize context while keeping the analyst grounded.

```
+---------------------------------------------------------------------------------------------------------+
| CASE HUD: #ASH-2026-9012  |  STATUS: Under Investigation  |  ANALYST: P. Sharma  |  SLA: 14m remaining  |
| VERDICT: [ MALICIOUS ]    |  RISK: [■■■■■■■■■□] 92/100    |  CONFIDENCE: [■■■■■■■■□□] 84/100            |
| FROM: "Satya Nadella" <ceo@micro-soft.top>  |  TO: cfo@targetcorp.in  |  DATE: 2026-09-05 18:14:02 UTC  |
| ACTIONS: [ 📄 View Report ]  [ 🤖 Ask Assistant ]  [ 🔄 Re-investigate ]  [ ⚡ Escalate Case ]          |
+---------------------------------------------------------------------------------------------------------+
| TABS: [1. Overview & Journey] [2. Headers] [3. URLs] [4. Infra & Geo] [5. Attachments] [6. History] ... |
+-----------------------------------------------------------------------------------+---------------------+
| MAIN INVESTIGATION CANVAS                                                         | SIDEBAR DOCK        |
|                                                                                   | [ 🤖 AI Copilot ]   |
| 1. KEY FINDINGS SUMMARY                                                           | [ 📌 Pinned Evidence|
|    • [EVD-HDR-001] Domain 'micro-soft.top' registered 4 hours ago.                |                     |
|    • [EVD-AUT-002] DMARC Failed: Envelope domain != Header From domain.           | Context: Case 9012  |
|    • [EVD-URL-004] URL redirects through 3 hops to credential harvesting page.   |                     |
|                                                                                   | "The sender domain  |
| 2. CURRENT CASE INFRASTRUCTURE HIGHLIGHTS                                         |  micro-soft.top is  |
|    Origin IP: 185.220.101.5 (AS208323, RU) | Tor Exit Node: Verified             |  a punycode typo-   |
|                                                                                   |  squat mimicking    |
| 3. INVESTIGATION JOURNEY STEPPER                                                  |  microsoft.com..."  |
|    [✓ Ingest] ──> [✓ Headers] ──> [✓ Sandbox] ──> [⚠ DNS (Degraded)] ──> [✓ Complete]                    |
+-----------------------------------------------------------------------------------+---------------------+
```

### 7.1 Persistent Case HUD (Heads-Up Display)
The HUD remains pinned to the top of the viewport during vertical scrolling, guaranteeing that essential identifiers never leave the analyst's sight:
- **Case ID & Status:** `#ASH-2026-9012` | Tags: `In Progress`, `P1 - Critical`, `Assigned to: You`.
- **Verdict Indicator:** Bold, accessible badge: `MALICIOUS` (Crimson), `SUSPICIOUS` (Amber), `INCONCLUSIVE` (Slate Blue), `BENIGN` (Emerald).
- **Risk Score Display:** Radial gauge or segmented bar: $0-100$ with severity label (`Critical: 92`).
- **Confidence Meter Display:** Segmented fidelity bar: $0-100$ (`High: 84%`), displaying evidence completeness tooltip.
- **Envelope Headers:** Display Name, Raw Envelope From, Return-Path, Envelope-To, Exact UTC Timestamp, and Subject.
- **Action Toolbar:**
  - `View Report`: Transitions immediately to the formal report view.
  - `Ask Assistant`: Opens/focuses the AI Copilot side-dock with active case context pre-loaded.
  - `Re-investigate`: Triggers cache bypass or parameter adjustments.
  - `Escalate`: Triggers automated CIRT notification and containment workflow.

### 7.2 Primary Investigation Canvas
Organized as a top-level tabbed navigation interface with zero layout shift. Tabs display numerical artifact counters:
- `Overview & Journey`
- `Header Forensics (14)`
- `URL & Domain (3)`
- `Infrastructure & Geo (2 IPs)`
- `Attachments (1)`
- `Historical Intelligence (4 matches)`
- `Evidence Explorer (28 items)`
- `Forensic Report`

---

# Investigation View

The Investigation View acts as the dynamic runtime diagnostic log of the automated detection pipeline. It answers the fundamental question: **"How did the system arrive at this finding, and can every step be audited?"**

### 8.1 Chronological Pipeline Stepper
Visualizes each pipeline stage sequentially:
1. **MIME Ingestion & EML Unpacking:** Verification of file boundary integrity, hashing of raw EML (`SHA-256: 8f4c...`).
2. **RFC 5322 Header Parser:** Extraction of Received lines, Message-ID validity check, date skew analysis.
3. **Cryptographic Identity Verification:** SPF check via DNS, DKIM public key lookup, DMARC policy enforcement, ARC chain validation.
4. **URL & Domain Extraction:** Defanging, normalization, WHOIS age query, unshortening redirect paths.
5. **Infrastructure & Geo-IP Enrichment:** Origin IP BGP lookup, ASN reputation scoring, Geo-IP coordinate mapping.
6. **Attachment Static & Dynamic Detonation:** Antivirus signatures, heuristic macro analysis, sandbox execution telemetry.
7. **ML & Heuristic Correlation:** Feature extraction, rule triggering, threat score calculation.
8. **Forensic Dossier Assembled:** Immutable Evidence ID assignment, dossier ready for analyst review.

### 8.2 Step Diagnostic Cards
Clicking any step in the journey expands an inline diagnostic drawer showing:
- **Execution Timestamp:** e.g., `2026-09-05T18:14:02.124Z (Duration: 342ms)`.
- **Module Version:** e.g., `ashielder-header-engine v2.4.1`.
- **Input Artifact ID:** e.g., `EVD-RAW-001`.
- **Output Signals Produced:** List of generated Evidence IDs.
- **Execution Health:** `Success`, `Degraded`, or `Failed` with full diagnostic error code if applicable.

---

# Evidence Explorer

The Evidence Explorer is the central, universal repository of all factual forensic artifacts discovered in the case.

```
+---------------------------------------------------------------------------------------------------------+
| EVIDENCE EXPLORER (Total Artifacts: 24)                     [ 🔍 Search artifacts... ]  [ Export All CSV]|
| Filter by Modality: [All (24)] [Headers (8)] [Network/DNS (6)] [URLs (4)] [Attachments (2)] [Behavioral]|
+---------------+----------------+--------------------------------------+--------------+-----------+------+
| EVIDENCE ID   | MODALITY       | SUMMARY ARTIFACT                     | SEVERITY     | CORROBOR. | PIN  |
+---------------+----------------+--------------------------------------+--------------+-----------+------+
| EVD-HDR-001   | Header/Domain  | Punycode match 'micro-soft.top'      | Critical     | 3 rules   | [📌] |
| EVD-AUT-002   | Authentication | SPF Fail: IP 185.220.101.5 not auth  | High         | RFC 7208  | [📌] |
| EVD-NET-003   | Network/IP     | IP 185.220.101.5 flagged Tor Exit    | Critical     | 2 feeds   | [📌] |
| EVD-URL-004   | URL Redirect   | http://login.micro-soft.top/auth     | Critical     | Blacklist | [📌] |
| EVD-ATT-001   | Attachment     | Invoice_8812.iso (SHA256: e3b0c4...) | Medium       | Static AV | [📌] |
+---------------+----------------+--------------------------------------+--------------+-----------+------+
```

### 9.1 Evidence Registry Taxonomy
All artifacts follow an immutable identifier schema:
- `EVD-RAW-***`: Raw email file, raw headers, original message body.
- `EVD-HDR-***`: Individual header fields, Received hops, Message-ID, Date values.
- `EVD-AUT-***`: SPF, DKIM, DMARC, ARC cryptographic authentication results.
- `EVD-NET-***`: IP addresses, ASNs, BGP routes, reverse DNS pointers.
- `EVD-GEO-***`: Country, city, latitude/longitude, ISP jurisdiction.
- `EVD-URL-***`: Extracted URLs, unshortened links, redirect chains, domain ages.
- `EVD-ATT-***`: Files, hashes, MIME mismatches, extracted macros, sandbox logs.
- `EVD-BEH-***`: Heuristic behavior (urgency language, payment redirection requests).

### 9.2 Evidence Detail Inspector Drawer
Selecting any row opens a deep inspection drawer containing:
- **Raw Value Display:** Exact substring extracted from message (with hex preview if binary).
- **Hash Proof:** SHA-256 of the artifact to ensure chain of custody.
- **Verification Method:** Name of parser or microservice that generated the artifact.
- **RFC Standard Reference:** Direct citation (e.g., *RFC 7489 Section 6.6.2 - DMARC Identifier Alignment*).
- **Corroboration Count:** Indicates how many independent heuristics or threat intelligence feeds verified this artifact.
- **Pin to Report Action:** Toggle button to mark this artifact as a mandatory highlight in the executive forensic report.

---

# Header Forensics

The Header Forensics view provides forensic examiners with an exhaustive, RFC-compliant workspace to dissect mail transmission headers.

```
+---------------------------------------------------------------------------------------------------------+
| RFC 5322 HEADER FORENSICS                               [ View Raw Headers ]  [ Copy Raw ]  [ Hex View ]|
+---------------------------------------------------------------------------------------------------------+
| AUTHENTICATION VALIDATION MATRIX                                                                        |
| +--------------------+--------------------+--------------------+--------------------+-----------------+ |
| | SPF: FAIL [🔴]     | DKIM: PASS [🟢]    | DMARC: FAIL [🔴]   | ARC: NONE [⚪]     | BIMI: NONE [⚪] | |
| | IP: 185.220.101.5  | Domain: sendgrid   | Policy: Reject     | No forwarder seal  | No verified SVG | |
| | Alignment: NONE    | Selector: s1       | Align: Disparate   |                    |                 | |
| +--------------------+--------------------+--------------------+--------------------+-----------------+ |
+---------------------------------------------------------------------------------------------------------+
| RECEIVED HOP ROUTE CHAIN (Chronological Transit: 3 Hops Detected)                                       |
| [Hop 1: Client -> Relay 1]  =======>  [Hop 2: Relay 1 -> Gateway]  =======>  [Hop 3: Gateway -> Inbound]   |
| 185.220.101.5 (RU)                    198.51.100.24 (NL)                     172.16.0.40 (Internal)    |
| Delay: +0s (Origin)                   Delay: +1.4s                           Delay: +0.2s              |
| Reverse DNS: tor-exit.anonym.net      Reverse DNS: relay.mailcluster.eu      Reverse DNS: internal.mx  |
+---------------------------------------------------------------------------------------------------------+
| PARSED HEADERS TABLE (Highlighted Anomalies Filter Active)                                              |
| Field Name        | Field Value                                              | Anomaly Diagnostic       |
| ----------------- | -------------------------------------------------------- | ------------------------ |
| From              | "Satya Nadella" <ceo@micro-soft.top>                     | Disparate from ReturnPath|
| Return-Path       | <bounce-8812@mail-sender-relay.com>                      | Mismatched domain (SPF)  |
| Reply-To          | <attacker-drop@protonmail.com>                           | Untrusted drop address   |
| Message-ID        | <20260905181402.1A2B3C@micro-soft.top>                   | Syntax anomaly RFC 5322  |
| X-Mailer          | PHPMailer 6.1.4 (Custom Script)                          | Known bulk tool usage    |
+---------------------------------------------------------------------------------------------------------+
```

### 10.1 Authentication Validation Matrix
Structured grid of authentication badges:
- **SPF (Sender Policy Framework):** Status (`PASS`, `FAIL`, `SOFTFAIL`, `NEUTRAL`, `PERMERROR`, `NONE`), evaluated IP, evaluated sender domain, mechanism matched (e.g., `-all`).
- **DKIM (DomainKeys Identified Mail):** Status (`PASS`, `FAIL`, `PERMERROR`), Signing Domain (`d=`), Selector (`s=`), Canonicalization algorithm, Body Hash verification status (`bh`).
- **DMARC:** Status (`PASS`, `FAIL`), Published Policy (`reject`, `quarantine`, `none`), Alignment status (SPF Identifier Alignment and DKIM Identifier Alignment).
- **ARC (Authenticated Received Chain):** Evaluates whether an intermediary forwarder preserved validation integrity.
- **BIMI (Brand Indicators for Message Identification):** Displays whether official VMC (Verified Mark Certificate) and logo were authenticated.

### 10.2 Received Hop Visualizer
- **Visual Hop Route:** Horizontal interactive node diagram showing each transmission leg from origin to corporate perimeter.
- **Hop Latency Calculator:** Computes delta time between sequential `Date:` headers on `Received:` lines. Anomalous delays (> 300 seconds) highlight potential relay injection or store-and-forward tampering.
- **Relay Reputation Scoring:** Each hop displays reverse DNS status, Geo-IP country, and ASN.

### 10.3 Header Anomaly Detection Engine
Automatic visual callouts for:
- **Date Skew:** Timestamp variance of $> 24$ hours between local server time and message origination time.
- **Subject Encoding Tricks:** Base64 or Quoted-Printable strings hiding homoglyphs or excessive invisible zero-width spaces (`U+200B`).
- **Header Injection:** Multiple `Subject:`, `To:`, or `From:` lines present within a single RFC 5322 header block.

---

# URL Analysis

Phishing and credential harvesting heavily leverage dynamic, obfuscated URLs. The URL Analysis interface enables safe, defanged examination.

```
+---------------------------------------------------------------------------------------------------------+
| EXTRACTED URLS & LINK FORENSICS (3 URLs Detected)                     [ 🛡 All URLs Auto-Defanged ]     |
+---------------------------------------------------------------------------------------------------------+
| URL 1: hxxps[://]login[.]micro-soft[.]top/auth/verify?session=9912a                                     |
| Anchor Text: "Click Here to Review Urgent Document" (DECEPTIVE MISMATCH)                                |
| Category: [ Credential Harvester ] | Threat Feed: [ Flagged in 8/12 Feeds ] | Domain Age: [ 4 Hours ]   |
|                                                                                                         |
| REDIRECT CHAIN INSPECTION:                                                                              |
| Hop 0 (Initial):  hxxp[://]bit[.]ly/3x881a             [301 Permanent Redirect ->]                      |
| Hop 1 (Traffic):  hxxps[://]traffic-rotator[.]xyz/gate  [302 Found ->]                                  |
| Hop 2 (Landing):  hxxps[://]login[.]micro-soft[.]top/auth/verify (HTTP 200 OK | Final Destination)     |
|                                                                                                         |
| DOMAIN REPUTATION & HOMOGRAPH AUDIT:                                                                    |
| Displayed ASCII: micro-soft.top | Punycode: xn--micr-soft-6za.top                                       |
| Target Brand Impersonated: Microsoft Corporation (Likeness Score: 98.4%)                                |
| Registrar: NameCheap, Inc. | Nameservers: ns1.bulletproof-dns.is                                        |
+---------------------------------------------------------------------------------------------------------+
```

### 11.1 Security-First Defanging Default
All links are displayed **defanged** (`hxxp://`, `[.]`, `[:]`) by default to prevent accidental clicks or browser-triggered pre-fetching. An explicit copy button allows copying either defanged or raw format (with a safety prompt).

### 11.2 Anchor vs Target Mismatch Indicator
The UI compares the visual link text displayed to the human recipient against the actual `href` destination. If the text reads `https://legitimate-bank.com` while the link points to `http://evil-tracker.com`, a prominent **Deceptive Anchor Mismatch** warning is triggered.

### 11.3 Interactive Redirect Chain Explorer
Visualizes each redirection step (HTTP 301, 302, 307, meta-refresh, or JavaScript `window.location`). Displays:
- Response HTTP headers for each hop.
- Cloaking & Evasion detection: Highlights if redirect targets change based on client user-agent or geographic IP.

### 11.4 Homograph & Punycode Dissector
Detects internationalized domain names (IDN) using Cyrillic, Greek, or lookalike glyphs (e.g., Latin 'a' substituted with Cyrillic 'а' `U+0430`). The UI highlights the exact manipulated character in bright warning yellow with the corresponding unicode codepoint.

---

# Infrastructure Intelligence

Infrastructure intelligence maps the adversary's network footprint, correlating origin systems, transit relays, and domain name infrastructure.

```
+---------------------------------------------------------------------------------------------------------+
| INFRASTRUCTURE & NETWORK INTELLIGENCE                                                                   |
+---------------------------------------------------------------------------------------------------------+
| ORIGIN IP ADDRESS: 185.220.101.5                                                                        |
| Hostname / rDNS : tor-exit-node-5.theonionrouter.net                                                    |
| Autonomous System: AS208323 (Anonymous Proxy Network)                                                  |
| BGP Prefix       : 185.220.101.0/24                                                                     |
| Routing Path     : Multihomed European Tier-2 Transit                                                   |
| Threat Class     : Known Tor Exit Relay (Active for 41 days)                                            |
| Passive DNS      : 42 domains resolved to this IP in the past 14 days                                   |
+---------------------------------------------------------------------------------------------------------+
| MAIL EXCHANGER (MX) & DNS FORENSICS                                                                     |
| Target Domain    : micro-soft.top                                                                       |
| MX Records       : 10 mail.bulletproof-hosting.ru (Priority 10)                                         |
| SPF Record       : "v=spf1 ip4:185.220.101.5 ~all"                                                     |
| DMARC Record     : "v=DMARC1; p=none; rua=mailto:dmarc-drop@micro-soft.top"                            |
| TXT Anomalies    : Suspicious verification tokens detected for unrelated cloud providers                |
+---------------------------------------------------------------------------------------------------------+
```

### 12.1 Autonomous System (ASN) & BGP Context
- Visualizes ASN reputation: differentiates trusted enterprise infrastructure (e.g., Microsoft Office 365 ASN 8075, Google ASN 15169) from known bulletproof hosters, residential proxy farms, or Tor exit infrastructure.
- Displays BGP prefix and routing stability indicators.

### 12.2 Passive DNS (pDNS) Timeline
Displays a chronological histogram of domain names historically associated with the origin and relay IPs, enabling analysts to detect fast-flux DNS techniques or repeated campaign reuse.

---

# Geolocation

The Geolocation panel visualizes physical and sovereign jurisdiction intelligence derived from mail hops, infrastructure IPs, and sender timestamps.

```
+---------------------------------------------------------------------------------------------------------+
| GEOGRAPHIC TRANSIT & SOVEREIGN JURISDICTION MAP                                                         |
+---------------------------------------------------------------------------------------------------------+
| [ INTERACTIVE WORLD MAP VIEW: High-Contrast Dark Canvas ]                                               |
|                                                                                                         |
|   (Origin: St. Petersburg, RU) --------[Hop 1]-------> (Relay: Amsterdam, NL) -------[Hop 2]-------->    |
|   185.220.101.5                                        198.51.100.24                                    |
|                                                                                                         |
|   ---------------------------------------------------> [Corporate Perimeter: Mumbai, IN]                |
|                                                        172.16.0.40                                      |
+---------------------------------------------------------------------------------------------------------+
| SOVEREIGN JURISDICTION & TIME-ZONE DISCREPANCY AUDIT                                                    |
| Node               | Country / City          | ISP / Jurisdiction          | Timezone Skew vs Client   |
| ------------------ | ----------------------- | --------------------------- | ------------------------- |
| Origin (Hop 0)     | Russian Federation / SPb| Tor Network / High-Risk     | +3 hrs (Claimed: -5 hrs)  |
| Transit (Hop 1)    | Netherlands / Amsterdam | Datacenter Hosting B.V.     | +1 hr                     |
| Destination (In)   | India / Mumbai          | Enterprise Gateway          | Local Reference (IST)     |
+---------------------------------------------------------------------------------------------------------+
```

### 13.1 Sovereign Flight Path (Hop Route Mapping)
- Renders an interactive, vector-based world map connecting origin, intermediate relays, and destination nodes using directed geodesic arcs.
- Color-coded hops: High-risk sovereign jurisdictions or untrusted transit nodes are highlighted in amber/red.

### 13.2 Claimed vs Actual Geolocation Discrepancy
Compares the timezone asserted in the client's `Date:` header (e.g., `-0500 EST` representing New York) against the physical network timezone of the first authenticated `Received:` IP address. A severe timezone mismatch ($\Delta > 4$ hours) is flagged as an evasive masquerade indicator.

### 13.3 Jurisdiction & Legal Mutual Assistance (MLAT) Indicators
Provides context on whether the originating IP resides within jurisdictions that cooperate with international cybercrime subpoenas (MLAT frameworks), assisting forensic investigators in assessing legal pursuit viability.

---

# Attachments

Attachment analysis combines static file property inspection, cryptographic provenance, and isolated sandbox behavioral telemetry.

```
+---------------------------------------------------------------------------------------------------------+
| ATTACHMENT FORENSIC LAB (1 File Detected)                             [ Safe Sandbox Detonation Logs ]  |
+---------------------------------------------------------------------------------------------------------+
| FILE METADATA & HASHES                                                                                  |
| Filename: Urgent_Wire_Invoice.pdf.exe  (DOUBLE EXTENSION DETECTED)                                      |
| Display MIME: application/pdf | Real File Type: Windows PE32 Executable (GUI)                           |
| File Size   : 1.42 MB (1,488,912 bytes) | Entropy Score: 7.92 / 8.0 (HEAVILY PACKED / ENCRYPTED)        |
| Hashes:                                                                                                 |
| • MD5    : c157a79031e1c40f85931829bc5fc552                                        [📋 Copy]           |
| • SHA-1  : 4916d63697240c80441416bdcb91b971a80a04cd                                [📋 Copy]           |
| • SHA-256: 2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae        [📋 Copy]           |
| • SSDEEP : 24576:7x5z8...                                                          [📋 Copy]           |
+---------------------------------------------------------------------------------------------------------+
| SANDBOX BEHAVIORAL EXECUTION TELEMETRY                                                                  |
| Execution Status: Completed (30s Detonation in Windows 11 Sandbox)                                      |
| Process Tree: Urgent_Wire_Invoice.pdf.exe -> powershell.exe -> cmd.exe                                  |
| Mitre ATT&CK: T1059.001 (PowerShell), T1547.001 (Registry Run Keys), T1071.001 (Web C2 Protocols)       |
| Dropped Files: C:\Users\Admin\AppData\Local\Temp\payload.dll (SHA256: d41d8c...)                        |
| Network C2   : Outbound connection established to 91.215.85.17:443 (RU)                                 |
+---------------------------------------------------------------------------------------------------------+
```

### 14.1 MIME-Type Discrepancy & Double Extension Warning
If an attachment uses double extensions (e.g., `.pdf.exe`, `.docx.iso`) or presents an HTTP/MIME header claiming `application/pdf` while the magic bytes read `4D 5A` (Windows MZ header), the UI renders an unmissable critical visual alert.

### 14.2 High Entropy & Obfuscation Visualizer
Visual indicator of Shannon Entropy ($0.0-8.0$). Values $> 7.2$ indicate encryption, compression, or custom packing commonly used by malware droppers.

### 14.3 One-Click Threat Intelligence Pivots
Next to every hash (MD5, SHA-256, SSDEEP), the analyst can click direct one-touch external pivot links (VirusTotal, AlienVault OTX, HybridAnalysis, MalwareBazaar) without manual copying.

---

# Historical Intelligence

Historical intelligence contextualizes the current case against the enterprise's wider threat telemetry, without conflating historical findings with the current case's facts.

```
+---------------------------------------------------------------------------------------------------------+
| HISTORICAL CAMPAIGN INTELLIGENCE (Contextual Only — Not Current Evidence)                              |
+---------------------------------------------------------------------------------------------------------+
| ⚠️ VISUAL ISOLATION NOTICE: Historical correlations represent past alerts and campaign clusters.        |
|    They must not be considered direct physical evidence of the current message under review.           |
+---------------------------------------------------------------------------------------------------------+
| CLUSTERING RADAR & SIMILARITY MATCHES (3 Related Incidents Discovered)                                 |
|                                                                                                         |
| Incident ID     | Target Recipient     | Match Reason                     | Previous Verdict | Date     |
| --------------- | -------------------- | -------------------------------- | ---------------- | -------- |
| #ASH-2026-8104  | accounts@targetcorp  | Identical Origin IP 185.220...   | MALICIOUS        | 3 wks ago|
| #ASH-2026-7491  | hr@targetcorp.in     | Same Subject Pattern ("Wire...") | SUSPICIOUS       | 1 mo ago |
| #ASH-2026-6210  | cfo@targetcorp.in     | Matching SSL Cert Hash on URL    | MALICIOUS        | 2 mos ago|
+---------------------------------------------------------------------------------------------------------+
| KNOWN THREAT ACTOR CAMPAIGN AFFILIATION (Heuristic Match)                                               |
| Campaign Tag : [ UNC-2814 / PhishStorm ]                                                                |
| Confidence   : 74% Heuristic Cluster Match                                                              |
| Common TTPs  : Free top-level domains (.top, .xyz), Tor Exit relays, impersonation of executive C-suite |
+---------------------------------------------------------------------------------------------------------+
```

### 15.1 Strict Boundary Rule (Current vs Historical)
Historical elements are framed with a distinct dotted boundary, a subtle pattern fill, and explicit contextual warning banners. An analyst can never confuse a past malicious verdict with the current case's pending analysis.

### 15.2 Cross-Mailbox Blast Radius Indicator
Shows whether other mailboxes within the organization have received emails with:
- The same sender envelope.
- The same attachment hash.
- URLs resolving to the same landing domain.
- Similar visual body layouts (via fuzzy perceptual hashing).

---

# Re-investigation

Threat intelligence is dynamic. Newly discovered indicators of compromise (IOCs), updated sandbox definitions, or newly published threat feeds may alter a case's assessment.

```
+---------------------------------------------------------------------------------------------------------+
| RE-INVESTIGATION COMPARATIVE DIFF WORKSPACE                           [ Run New Investigation ]         |
+---------------------------------------------------------------------------------------------------------+
| RE-INVESTIGATION AUDIT LOG:                                                                             |
| Snapshot 1: Initial Ingestion (2026-09-05 18:14:02) — Verdict: SUSPICIOUS (Risk: 68/100, Conf: 45/100) |
| Snapshot 2: Manual Re-run     (2026-09-05 18:45:10) — Verdict: MALICIOUS  (Risk: 94/100, Conf: 91/100) |
+---------------------------------------------------------------------------------------------------------+
| SIDE-BY-SIDE ARTIFACT COMPARISON (What Changed?)                                                        |
| Diagnostic Dimension   | Snapshot 1 (Initial)              | Snapshot 2 (Re-evaluated)                  |
| ---------------------- | --------------------------------- | ------------------------------------------ |
| Domain Age             | Cached: "Unknown" (WHOIS Timeout) | Resolved: "Registered 4 Hours Ago" (NEW)   |
| Sandbox Detonation     | Status: "In Queue"                | Status: "Trojan Dropper Detected" [EVD-04] |
| Threat Intelligence    | 0/12 Blacklists Flagged           | 6/12 Feeds Flagged IP as Tor Relay         |
| Resulting Risk Delta   | 68/100                            | +26 ──> 94/100 (CRITICAL)                  |
+---------------------------------------------------------------------------------------------------------+
```

### 16.1 Side-by-Side Comparative Diff Engine
When a re-investigation is executed:
- The previous snapshot is preserved immutably.
- The UI provides a side-by-side **Diff View** highlighting precisely which external tools updated their telemetry (e.g., DNS timeout resolved, sandbox completed, new threat feed match).
- The Delta in Risk and Confidence is explicitly quantified ($\Delta \text{Risk}$, $\Delta \text{Confidence}$) with clear explanations.

### 16.2 Snapshot Version History
Investigators can toggle between historical analysis snapshots at any time, an essential feature for legal scrutiny where an analyst must demonstrate what was known at the time of initial triage versus post-incident forensics.

---

# Forensic Report

The Forensic Report view provides an executive and court-admissible formal record of the complete investigation.

### 17.1 Report Sections Architecture
1. **Header & Metadata:** Case ID, Target Entity, Date of Incident, Investigating Analyst Name, Clearance Level, Report Generation Timestamp, Cryptographic SHA-256 Dossier Hash.
2. **Executive Summary:** High-level narrative summary of the incident for non-technical leadership and legal counsel.
3. **Verdict & Risk Matrix:** Dual-metric display of final Verdict, Risk Score ($0-100$), and Confidence Score ($0-100$).
4. **Key Evidentiary Findings:** Bulleted, prioritized list with direct Evidence ID citations.
5. **Authentication Analysis:** SPF, DKIM, DMARC, ARC, BIMI results with raw alignment reasons.
6. **Header Analysis & Received Transit:** Full hop route table, transit delays, origin IP verification.
7. **Extracted Link & URL Analysis:** Defanged URLs, redirect hops, domain registration timelines.
8. **Attachment Forensics:** File hashes, MIME integrity, sandbox process execution trees.
9. **Infrastructure & Geolocation:** Autonomous systems, reverse DNS, geographical route map.
10. **Investigation Journey Audit:** Log of all automated pipeline steps executed and tool performance.
11. **Missing Evidence & Failed Tools Disclosure:** Explicit disclosure of any tool timeouts, missing network logs, or encrypted payloads that could not be inspected.
12. **Chain of Custody & Cryptographic Audit Seal:** Digital signature block, hash of the raw `.eml` file, and analyst sign-off.

```
+=========================================================================================================+
|                                    ASHIELDER FORENSIC INVESTIGATION REPORT                              |
| Case ID: #ASH-2026-9012                                            Report Hash: sha256:7f1c4e92...      |
+=========================================================================================================+
| [SYSTEM FINDING - DETERMINISTIC]                                                                        |
| • EVD-HDR-001: Header 'From' domain (micro-soft.top) fails DMARC alignment with Return-Path.             |
| • EVD-AUT-002: SPF validation failed for origin IP 185.220.101.5 under RFC 7208.                         |
| • EVD-URL-004: URL redirects to known credential phishing page verified by 6 threat feeds.               |
+---------------------------------------------------------------------------------------------------------+
| [AI EXPLANATION - HEURISTIC SYNTHESIS]                                                                  |
| ℹ️ Generated by ASHIELDER Copilot | Grounded in Evidence IDs [EVD-HDR-001], [EVD-AUT-002], [EVD-URL-004]  |
| "The email is an executive impersonation attempt targeting corporate accounts payable. The adversary   |
|  employed a newly registered lookalike domain with a deceptive display name, routed through an anonymous |
|  Tor exit relay to conceal true geographic origin, and attempted to redirect the user to a credential   |
|  harvesting portal."                                                                                    |
+=========================================================================================================+
```

### 17.2 System Finding vs AI Explanation Visual Contrast
In both the interactive web view and the exported PDF document:
- **System Findings** are styled inside high-contrast technical tables with slate-dark backgrounds, monospaced keys, and explicit RFC references.
- **AI Explanations** are styled inside distinct callout panels with an AI Copilot indicator, a clear disclaimer (*"Heuristic natural-language synthesis generated from verified evidence"*), and mandatory evidentiary footnotes.

---

# AI Assistant

The ASHIELDER AI Assistant is an evidentiary copilot engineered specifically for cybersecurity investigation.

```
+---------------------------------------------------------------------------------+
| 🤖 ASHIELDER COPILOT                          [ Clear Session ] [ ⚙️ Model Info ] |
+---------------------------------------------------------------------------------+
| Active Case: #ASH-2026-9012 (Grounding: 24 Evidence Artifacts Indexed)          |
|                                                                                 |
| [Analyst]: "Why is this email classified as suspicious rather than clean?"      |
|                                                                                 |
| [Copilot]:                                                                      |
| "The primary grounds for suspicion rest on three corroborated artifacts:        |
|                                                                                 |
|  1. Domain Masquerade: The sender domain 'micro-soft.top' was registered just   |
|     4 hours ago [EVD-HDR-001] and exhibits a 98.4% homoglyph similarity to      |
|     legitimate vendor domains.                                                  |
|                                                                                 |
|  2. Identity Spoofing: SPF authentication failed [EVD-AUT-002], proving the     |
|     originating server is not authorized to transmit on behalf of the domain.   |
|                                                                                 |
|  3. Evasive Infrastructure: The origin IP 185.220.101.5 is a verified Tor exit  |
|     relay [EVD-NET-003], highly anomalous for standard vendor billing notices.  |
|                                                                                 |
|  Would you like me to compare this with historical BEC cases [Tab 6]?"          |
|                                                                                 |
| Suggested Queries:                                                              |
| [ What evidence is strongest? ]  [ What evidence is missing? ]                  |
| [ Why is confidence at 84%? ]    [ What should I investigate next? ]            |
+---------------------------------------------------------------------------------+
| [ 💬 Ask a question about this case... (cites Evidence IDs automatically) ] [⏎] |
+---------------------------------------------------------------------------------+
```

### 18.1 Guardrails & Strict Separation of Powers
1. **Zero Verdict Control:** The AI Copilot has **no visual or programmatic controls** to modify the Verdict badge, adjust Risk/Confidence scores, or close tickets.
2. **Mandatory Citation:** Every factual assertion made by the assistant must contain a hyperlinked Evidence ID (`[EVD-***]`).
3. **Epistemic Humility:** When asked about missing information (e.g., "Is the attachment malicious?"), if the sandbox is pending or incomplete, the assistant states: *"Sandbox execution data is currently missing or inconclusive [EVD-ATT-001]. No definitive malware determination can be made without payload execution."*

### 18.2 Built-in Analyst Query Starters
- *"Why is confidence low on this alert?"*
- *"Which single piece of evidence is most critical?"*
- *"What evidence is currently missing or unverified?"*
- *"Show me historical cases sharing this origin ASN."*
- *"Draft a 3-sentence executive incident notification for the CISO."*

---

# Error States

In high-stakes security operations, silent failures or generic "Something went wrong" messages are unacceptable. ASHIELDER communicates technical failures with precision and actionable recovery paths.

```
+---------------------------------------------------------------------------------------------------------+
| ⚠️ TOOL EXECUTION TIMEOUT: WHOIS & Domain Age Resolution Service                                        |
| Service: external-whois-cluster.internal | Latency: 10,004ms (Threshold: 5,000ms exceeded)             |
| Impact : Domain registration age could not be verified for 'micro-soft.top'.                             |
| Pipeline Consequence: Confidence score degraded from 95% to 78%. Risk score remains elevated.          |
| Recommended Action: [ 🔄 Retry WHOIS Query ]  [ 🌐 Query Backup RDAP Feed ]  [ ⚙️ Manually Mark Known ] |
+---------------------------------------------------------------------------------------------------------+
```

### Error State Matrix
| Failure Scenario | Visual Indicator | System Behavior | Analyst Recovery Option |
| :--- | :--- | :--- | :--- |
| **Malformed EML / Header Syntax Corrupt** | High-contrast Orange Banner at top of Header Inspector | Displays raw unparsed text; highlights offset byte where RFC parsing broke. | "Switch to Raw Hex Mode" / "Attempt Loose RFC Parsing" |
| **Sandbox Execution Timeout** | Amber Alert inside Attachment Tab with clock glyph | Marks attachment status as `Analysis Incomplete`; decrements confidence. | "Re-submit to Secondary Sandbox" / "Extract Hashes Only" |
| **External Threat Feed Rate-Limited** | Neutral Grey Badge with informational tool-tip | Reverts to local offline threat cache; displays cache age (e.g., "Cache: 4h old"). | "Force API Key Refresh" / "Proceed with Offline Data" |
| **Network Gateway Disconnect** | Persistent Top Floating Bar: "Offline - Reconnecting..." | Pauses active queue updates; buffers analyst notes locally in encrypted session. | "Work in Offline Triage Mode" / "Check Local Bridge" |

---

# Loading States

Loading states in ASHIELDER never block user interaction unnecessarily and avoid generic spinners that conceal progress.

### 20.1 Progressive Structural Skeletons
- Standard rectangular pulsating bone skeletons that match the exact visual geometry of the final cards, tables, and gauges.
- Zero layout shift (CLS = 0) when asynchronous data streams into the DOM.

### 20.2 Real-time Diagnostic Pipeline Stepper
During initial case ingestion (which may take 2 to 5 seconds for full sandbox detonation), the workspace displays a live execution stepper:
`[✓ Unpacking EML] ──> [✓ Parsing 14 Headers] ──> [⟳ Detonating Attachment in Sandbox (12s)] ──> [Pending AI Summary]`
The analyst can immediately begin reading parsed headers and URLs while the attachment sandbox finishes in the background.

---

# Empty States

Empty states are designed as educational and productive surfaces, reinforcing operational clarity.

```
+---------------------------------------------------------------------------------------------------------+
| [ 📭 Shield Glyph ]                                                                                     |
| NO ACTIVE CASES MATCHING CURRENT FILTER CRITERIA                                                        |
| All high-priority triage queues for your assigned tier are clear.                                       |
| Active Filters: [ Risk > 70 ] ×  [ Verdict: Malicious ] ×                                               |
| Quick Actions: [ Reset Filters ]  [ View Low-Priority Queue (12) ]  [ Switch to Threat Hunting Mode ]    |
+---------------------------------------------------------------------------------------------------------+
```

- **Zero Alerts in Inbox:** Displays clean status, last queue synchronization timestamp, and direct shortcuts to threat hunting or historical case search.
- **Zero Attachments in Case:** Clear informative panel: *"No file attachments present in MIME payload. Static and dynamic attachment inspection bypassed."*
- **Zero URLs Extracted:** Plaintext email confirmation: *"Zero external HTTP/HTTPS hyperlinks detected in email body or headers."*
- **No Historical Matches:** *"Unique Threat Signature: No correlated campaigns or matching IOCs found in historical database. This may indicate a targeted, novel zero-day operation."*

---

# INCONCLUSIVE State

The `INCONCLUSIVE` verdict represents an intentional, first-class forensic status. It prevents the dangerous fallacy that lack of definitive proof implies safety.

```
+=========================================================================================================+
| ⚠️ INVESTIGATION VERDICT: INCONCLUSIVE (EVIDENTIARY SIGNALS AMBIGUOUS OR INCOMPLETE)                   |
| Current Risk Score: 52 / 100 [Moderate Ambiguity]  |  Confidence Score: 24 / 100 [CRITICALLY LOW]        |
+=========================================================================================================+
| WHY IS THIS CASE INCONCLUSIVE?                                                                          |
| 1. Missing Critical Artifact: The email contains an encrypted, password-protected ZIP [EVD-ATT-001].    |
|    Dynamic sandbox inspection was unable to decrypt or detonate the payload.                           |
| 2. Conflicting Identity Signals: SPF passed (legitimate relay) but domain age is 2 days old.             |
| 3. Degraded Tool: WHOIS registrar query timed out [ERR-NET-504].                                       |
+---------------------------------------------------------------------------------------------------------+
| REQUIRED MANUAL TRIAGE PROTOCOL:                                                                        |
| [ 🔑 Input Archive Password ]  [ 🧪 Force Deep Sandbox Detonation ]  [ 📞 Verify with Sender via Out-of-Band ] |
+=========================================================================================================+
```

### 22.1 Visual Semantics of Inconclusive Cases
- **Color Accent:** Neutral Slate-Steel Blue (`#4A5568` / `#64748B`), strictly avoiding Green (safe) or Red (malicious).
- **Epistemic Warning Banner:** Prominently details the **Missing Artifact Checklist** required to achieve conclusive certainty.
- **Confidence Deficit Explanation:** Highlights why confidence is low and presents immediate manual actions (e.g., provide zip password, verify user via telephone, contact origin domain admin).

---

# Authentication UX

Authentication for an enterprise forensic platform must embody zero-trust principles without inducing workflow friction.

### 23.1 Enterprise SSO & Hardware MFA Integration
- Support for SAML 2.0 / OIDC enterprise identity providers (Okta, Microsoft Entra ID, PingFederate).
- **FIDO2 / WebAuthn Hardware Security Key Support (YubiKey):** Physical touch confirmation required for high-privilege actions (e.g., case escalation, permanent fleet-wide mailbox quarantine).

### 23.2 Forensic Session Guard & Non-Destructive Timeout
- To prevent unauthorized workstation access in 24/7 SOC environments, a 15-minute inactivity timer locks the screen with a blurred cryptographic scrim.
- Re-authenticating via biometric (TouchID / Windows Hello) or PIN instantly restores the exact active investigation state, including uncommitted analyst notes, scroll positions, and open inspector drawers.

---

# RBAC-ready UX

The interface adapts dynamically based on the verified role of the active user, gracefully disabling or hiding controls.

```
+---------------------------------------------------------------------------------------------------------+
| ROLE PERMISSION CAPABILITY MATRIX                                                                       |
| Capability                    | Tier 1 Triage | Tier 2/3 Responder | Forensic Lead | Read-Only Auditor  |
| ----------------------------- | :-----------: | :----------------: | :-----------: | :----------------: |
| View Cases & Alerts           |       ✓       |         ✓          |       ✓       |         ✓          |
| Inspect Raw Headers & Hex     |       ✓       |         ✓          |       ✓       |         ✓          |
| Download Unpacked Attachments |       ✕       |         ✓          |       ✓       |         ✕          |
| Trigger Sandbox Detonation    |       ✕       |         ✓          |       ✓       |         ✕          |
| Re-investigate Cases          |       ✓       |         ✓          |       ✓       |         ✕          |
| Escalate to Fleet Quarantine  |       ✕       |         ✓          |       ✓       |         ✕          |
| Sign & Issue Forensic Reports |       ✕       |         ✕          |       ✓       |         ✕          |
| Configure System & API Feeds  |       ✕       |         ✕          |       ✓       |         ✕          |
+---------------------------------------------------------------------------------------------------------+
```

### 24.1 Permission-Aware UI Behavior
- Prohibited actions are never abruptly hidden without explanation; instead, buttons are rendered in an inactive, disabled state with a clear padlock icon and tooltip:  
  *`"Requires Role: Tier 2 Incident Responder or higher to download live malware samples."`*
- PII Redaction Mode: Analysts in lower-clearance roles view recipient email addresses and body text with partial masking (e.g., `c**@targetcorp.in`) to protect executive privacy.

---

# Accessibility

Cybersecurity analysts frequently work 12-hour shifts in varied lighting conditions. The interface adheres strictly to **WCAG 2.1 Level AA** standards.

### 25.1 Color Blindness Safe Semantics (Never Color Alone)
Status, risk, and verification indicators **never** rely exclusively on color hue:
- `Malicious / High Risk`: Solid Red + Octagon Icon + Bold Monospace Label `[MALICIOUS]`.
- `Suspicious / Caution`: Amber + Warning Triangle + Monospace Label `[SUSPICIOUS]`.
- `Safe / Clean`: Emerald Teal + Shield Check Icon + Monospace Label `[BENIGN]`.
- `Inconclusive`: Slate Gray + Hexagon Question Icon + Monospace Label `[INCONCLUSIVE]`.

### 25.2 Full Keyboard Navigation & SOC Hotkey Map
Power analysts can operate the entire workstation without touching a mouse:
- `J` / `K`: Move down / up through Case Inbox rows.
- `Space`: Open Quick-Peek slideout for highlighted alert.
- `Enter`: Open full Case Workspace.
- `1` through `8`: Switch between Workspace investigation tabs.
- `E`: Escalate active case.
- `R`: Open Forensic Report view.
- `A`: Focus AI Copilot input bar.
- `Esc`: Close open modal or inspector drawer.
- `?`: Open keyboard shortcuts cheat sheet.

### 25.3 Contrast Ratios & Typography Standards
- All text elements maintain a minimum contrast ratio of **4.5:1** against their background (and **7:1** for critical telemetry).
- Monospaced code surfaces feature customizable font sizing ($12\text{px}$, $14\text{px}$, $16\text{px}$) with dedicated line height ($1.6$) for sustained legibility.

---

# Responsive Strategy

The ASHIELDER workstation adapts gracefully across modern display environments.

```
+---------------------------------------------------------------------------------------------------------+
| DISPLAY PROFILES & VIEWPORT STRATEGY                                                                    |
+---------------------------------------------------------------------------------------------------------+
| 1. SOC MONITOR WALL / ULTRA-WIDE DUAL (3840 x 2160 / 3440 x 1440)                                       |
|    • Multi-column expanded layout: Inbox, Header Forensics, Map, and AI Copilot simultaneously visible. |
|    • Side-by-side comparative diffs and multi-hop route maps rendered without horizontal scrolling.     |
+---------------------------------------------------------------------------------------------------------+
| 2. STANDARD ENTERPRISE WORKSTATION (1920 x 1080 - 100% DPI Reference)                                   |
|    • Core balanced 3-pane layout: Navigation Rail (64px) -> Canvas (70%) -> AI Dock / Evidence (30%).   |
+---------------------------------------------------------------------------------------------------------+
| 3. ON-CALL INCIDENT LAPTOP (1366 x 768 to 1440 x 900)                                                  |
|    • AI Copilot and Evidence Inspector convert to overlay drawers.                                     |
|    • HUD collapses secondary metrics into an expandable summary badge.                                  |
+---------------------------------------------------------------------------------------------------------+
| 4. MOBILE EMERGENCY TRIAGE (Tablet / Phone - Read-Only On-Call)                                         |
|    • Single-column high-priority queue.                                                                 |
|    • Emergency one-touch case escalation and incident team paging.                                      |
+---------------------------------------------------------------------------------------------------------+
```

---

# Design System

A sober, modern, military-grade cybersecurity aesthetic. **Zero neon glow, zero distracting glassmorphism, zero unnecessary decorative animations.**

### 27.1 Color Token Architecture
```css
/* Core Neutrals - Deep Slate / Obsidian Archetype */
--ash-bg-canvas      : #0A0D14; /* Deepest workspace base */
--ash-bg-surface     : #111622; /* Card and container surface */
--ash-bg-elevated    : #171E2E; /* Modals, dropdowns, headers */
--ash-border-subtle  : #232D42; /* Standard dividers */
--ash-border-strong  : #323F5C; /* Active boundaries */

/* Text Contrast */
--ash-text-primary   : #F1F5F9; /* High readability pure white */
--ash-text-secondary : #94A3B8; /* Muted captions, metadata */
--ash-text-tertiary  : #64748B; /* Inactive labels, disabled hints */

/* Forensic Status Tokens (WCAG AA Compliant) */
--ash-crimson-severe : #E53935; /* Malicious, Critical Threat, Auth Fail */
--ash-amber-warning  : #D97706; /* Suspicious, Incomplete, Degraded */
--ash-slate-neutral  : #64748B; /* Inconclusive, Unassigned */
--ash-teal-safe      : #059669; /* Benign, SPF Pass, Verified */
--ash-blue-accent    : #2563EB; /* Interactive selections, focus rings */
--ash-ai-copilot     : #8B5CF6; /* AI Copilot insignia, generative callout */
```

### 27.2 Typographic Hierarchy
- **Display & Interface UI:** `Inter`, `Plus Jakarta Sans`, or `system-ui` (Clean, highly legible neo-grotesque sans-serif).
- **Evidence & Code Telemetry:** `JetBrains Mono` or `IBM Plex Mono` (Distinguished tabular numerals, unambiguous zero `0` vs `O` glyphs, clear punctuation).
- **Type Scale:**
  - HUD Verdict Title: `20px` / Line-Height `28px` / Weight `700`
  - Section Headings: `16px` / Line-Height `24px` / Weight `600`
  - Body & Table Text: `14px` / Line-Height `20px` / Weight `400`
  - Telemetry Monospace: `13px` / Line-Height `18px` / Weight `500`
  - Micro Footnotes & Tags: `11px` / Line-Height `14px` / Weight `600` / Tracking `+0.5px`

### 27.3 Component Geometries & Spacing
- **Corner Radii:** Strictly bounded between `4px` (inner chips/inputs) and `8px` (outer cards/modals). No playful pill buttons or bubble cards.
- **Spacing Grid:** 4px baseline unit with strict steps: `4px`, `8px`, `12px`, `16px`, `24px`, `32px`.
- **Elevation:** Flat surfaces separated by subtle 1px border lines (`#232D42`). Shadows are reserved exclusively for floating dropdowns and top modals (`0 8px 24px rgba(0,0,0,0.5)`).

---

# Component Inventory

A unified catalog of 32 purpose-built forensic client components:

1. **`CaseHUD`**: Persistent top header displaying case ID, verdict, risk gauge, confidence meter, sender, and action buttons.
2. **`VerdictBadge`**: Accessible high-contrast status badge (`Malicious`, `Suspicious`, `Inconclusive`, `Benign`).
3. **`RiskGauge`**: Segmented radial or horizontal bar illustrating threat severity ($0-100$).
4. **`ConfidenceMeter`**: Segmented evidentiary completeness meter ($0-100$).
5. **`AuthMatrix`**: 5-column cryptographic authentication grid (SPF, DKIM, DMARC, ARC, BIMI).
6. **`HopVisualizer`**: Interactive node-and-connector chain showing mail transmission legs and latency deltas.
7. **`EvidenceChip`**: Clickable pill component displaying Evidence ID (`[EVD-HDR-001]`), severity dot, and trigger link.
8. **`EvidenceDrawer`**: Slideout inspector displaying raw bytes, SHA-256 hash, and provenance metadata.
9. **`DefangedLink`**: Interactive URL component with defanged display, safety copy actions, and redirect inspection trigger.
10. **`RedirectChain`**: Multi-step flow visualizer showing HTTP status codes, unshortened domains, and landing targets.
11. **`HomographDissector`**: Text comparator highlighting punycode and lookalike Cyrillic/Greek characters in domain names.
12. **`GeoFlightMap`**: High-contrast vector world map with curved hop trajectories and jurisdiction flags.
13. **`AttachmentCard`**: File card with magic byte validation, entropy gauge, hash copy triggers, and sandbox status.
14. **`SandboxProcessTree`**: Hierarchical tree visualizer showing spawned processes and network callbacks during payload execution.
15. **`DiffInspector`**: Side-by-side snapshot comparator showing changed evidence, delta risk, and newly resolved feeds.
16. **`CopilotDock`**: Right-hand conversational assistant drawer with grounded evidence citation mechanics.
17. **`EvidenceFootnote`**: Hyperlinked citation tag rendered inside AI explanations.
18. **`TriageTable`**: High-performance virtualized table supporting sorting, filtering, and density toggle modes.
19. **`QuickPeekDrawer`**: Sub-second keyboard-driven preview slideout for rapid alert triage.
20. **`CommandPalette`**: Global `Cmd+K` keyboard modal for fast search, indicator lookup, and workflow actions.
21. **`JourneyTimeline`**: Chronological stepper visualizing the execution health of pipeline detection modules.
22. **`MissingArtifactCard`**: Warning card detailing what data is absent and why confidence is degraded.
23. **`ToolFailureAlert`**: Actionable error card displaying tool latency, failure codes, and retry buttons.
24. **`HistoricalClusterCard`**: Contextually isolated card highlighting past related campaigns and blast radius.
25. **`HexViewer`**: Raw byte and character offset inspector with search and copy capabilities.
26. **`HeaderAnomalyTag`**: Warning tag highlighting date skews, duplicate headers, or suspicious X-mailer scripts.
27. **`ReportPreview`**: Live printable preview of the comprehensive forensic investigation report.
28. **`AuditSeal`**: Cryptographic footer displaying SHA-256 report verification hash and investigator digital signature.
29. **`SkeletonCard`**: Zero-layout-shift placeholder skeleton mimicking final forensic card geometry.
30. **`KeyboardLegend`**: Modal cheat sheet displaying all hotkey bindings across inbox and workspace.
31. **`PiiMaskToggle`**: Privacy toggle allowing authorized investigators to unmask or mask sensitive recipient identifiers.
32. **`SlaIndicator`**: Dynamic countdown timer showing remaining triage time before operational SLA breach.

---

# Page Inventory

| Route | View Name | Purpose | Key Workflows Executed |
| :--- | :--- | :--- | :--- |
| `/login` | **Authentication Gateway** | Secure entry point | Enterprise SSO, FIDO2 hardware token verification, session recovery. |
| `/inbox` | **Case Triage Inbox** | Central queue management | Rapid alert triage, multi-parameter filtering, quick-peek inspection. |
| `/case/:id` | **Case Workspace** | Core investigation hub | Multi-tab deep forensics, header inspection, URL tracing, AI dialogue. |
| `/case/:id/report` | **Formal Forensic Report** | Reporting & export | Full case documentation review, digital signing, PDF/STIX export. |
| `/case/:id/diff` | **Re-investigation Diff** | Comparative analysis | Side-by-side snapshot comparison across pipeline executions. |
| `/hunting` | **Threat Hunting Portal** | Cross-case IOC pivot | Querying across all historical indicators (IPs, Hashes, Domains). |
| `/admin/health` | **Tool & Pipeline Health** | Infrastructure monitoring | Validating DNS latency, sandbox status, and threat feed availability. |
| `/admin/rbac` | **Access Management** | Security administration | Assigning roles, configuring PII redaction rules, inspecting audit logs. |

---

# Backend Contract Architecture & Client Mapping Matrix

The ASHIELDER client workstation is strictly contract-driven. It binds directly to the 26 backend Pydantic models defined in `contracts/`, consuming their types, honoring their cryptographic invariants, and rendering their forensic outputs without mutation.

### 30.1 Authoritative Pydantic Model to Frontend Component Mapping

| Backend Python Contract | Module Path | Client UI Component / Consumer | Tactical Presentation & Invariant Enforcement |
| :--- | :--- | :--- | :--- |
| **`InvestigationResult`** | `contracts/result.py` | `CaseHeaderHUD`, `CaseInboxTable`, `WorkspaceShell` | **Primary API Response Contract.** Drives the HUD, Case Inbox rows, and top-level workspace state. Embeds `status`, `verdict`, `risk_score`, `confidence`, `audit_chain_last_hash`, and budget metrics. |
| **`EvidenceItem`** | `contracts/evidence.py` | `EvidenceExplorerTable`, `EvidenceDetailDrawer`, `EvidenceChip` | **Central Forensic Atom.** Enforces the hard rule: model scores are `type=ML_SIGNAL` and never `type=FACT`. Displays `trust_level` (`VERIFIED`, `REPORTED`, `INFERRED`), `category`, `source_type`, and immutable `evidence_id`. |
| **`RiskAssessment`** | `contracts/risk.py` | `RiskGauge`, `RiskContributionTable` | **Mathematical Transparency.** Renders the $0-100$ score as the exact sum of discrete `RiskContribution` points (`weight`, `contribution`, `reason_code`). Prevents opaque risk scoring. |
| **`ConfidenceAssessment`** | `contracts/risk.py` | `ConfidenceMeter`, `DiagnosticDrawer` | **Fidelity Breakdown.** Renders $0.0-1.0$ confidence factored by `evidence_completeness`, `calibration_quality`, `unresolved_conflicts_penalty`, and `tool_failure_penalty`. |
| **`EvidenceConflict`** | `contracts/risk.py` | `ConflictBanner`, `EvidenceConflictList` | **Explicit Contradiction.** Never averages conflicting findings. Renders open contradictions (`ML_VS_REPUTATION`, `AUTH_VS_CONTENT_SIGNAL`, `CROSS_TOOL_DISAGREEMENT`) with severity tags and resolution actions. |
| **`AuditRecord`** | `contracts/audit.py` | `AuditTimeline`, `AuditSealFooter`, `ReportIntegrityCard` | **Cryptographic Tamper-Evidence.** Renders the SHA-256 hash-chain (`hash_prev` $\rightarrow$ `hash_self`). Displays exact event steps (`TOOL_EXECUTED`, `POLICY_DECISION`, `EVIDENCE_CREATED`, `RISK_UPDATED`, etc.). |
| **`AttackHypothesis`** | `contracts/investigation.py` | `AttackHypothesisCard`, `HypothesisGrid` | **Multi-Label Threat Modeling.** Renders the 13 canonical hypothesis types (`CREDENTIAL_PHISHING`, `BEC`, `EXECUTIVE_IMPERSONATION`, `VENDOR_FRAUD`, etc.) with `SUPPORTED`/`UNCERTAIN`/`REJECTED` status chips and supporting/contradicting evidence links. |
| **`InvestigationState`** | `contracts/investigation.py` | `InvestigationJourneyStepper`, `StateDiagnostics` | **Working Memory.** Renders FSM state (`INITIALIZED` $\rightarrow$ `LEVEL_0` $\dots$ `STOPPED` $\rightarrow$ `COMPLETED`), current level (`L0_TRIAGE`, `L1_TARGETED`, `L2_DEEP`, `L3_GROQ`), and missing evidence list. |
| **`InvestigationBudget` & `ToolCostSpent`** | `contracts/investigation.py` | `BudgetTrackerWidget`, `ResourceMeterHUD` | **4D Resource Envelope.** Real-time tracking of wall-clock latency (`max_latency_ms`), tool calls (`max_tool_calls`), external network requests (`max_external_calls`), and LLM tokens. |
| **`ReasoningResult`** | `contracts/reasoning.py` | `AssistantDrawer`, `CopilotResponseCard` | **Bounded AI Advisory.** Structurally barred from modifying risk, confidence, or verdict. Renders structured summary, hypotheses, `uncertainty` (`low`/`medium`/`high`), `recommended_next_actions`, and mandatory evidence citations. |
| **`ValidatedReasoningArtifact`** | `contracts/reasoning.py` | `ForensicReportAISection` | **Auditable AI Provenance.** Wraps LLM reasoning output with `model`, `prompt_version`, and `snapshot_hash` to guarantee forensic reproducibility in reports. |
| **`ReasoningUnavailable`** | `contracts/reasoning.py` | `CopilotFallbackBanner` | **Graceful AI Degradation.** Explicit failure contract displaying categorized diagnostic status (`PROVIDER_TIMEOUT`, `RATE_LIMITED`, `SCHEMA_VALIDATION_FAILED`) without leaking raw API secrets. |
| **`HeaderSet` & `ReceivedHop`** | `contracts/headers.py` | `ReceivedHopVisualizer`, `RawHeaderViewer` | **RFC 5322 Forensics.** Renders transmission hops, transit latency deltas, and `raw_headers_all` as the unmerged forensic ground truth for repeated headers. |
| **`AuthenticationEvidence`** | `contracts/authentication.py` | `AuthMatrixGrid`, `DmarcAlignmentCard` | **Cryptographic Identity.** Displays `AuthResult` (`pass`, `fail`, `none`, `neutral`, `softfail`, `temperror`, `permerror`, `unknown`) across SPF, DKIM, and DMARC with explicit identifier alignment flags. |
| **`AttachmentRef`** | `contracts/attachment.py` | `AttachmentForensicLab`, `EntropyVisualizer` | **Weaponized Payload Defense.** Flags `extension_mismatch` (e.g. `invoice.pdf.exe`), compares magic-byte `detected_type` against claimed MIME, and displays SHA-256 / SSDEEP hashes. |
| **`URLRecord` & `URLCanonical`** | `contracts/url.py`, `contracts/url_canonical.py` | `URLForensicTable`, `RedirectChainFlow` | **Defanged Link Dissection.** Renders normalized URLs, defanged links, homoglyph indicators, and displays the canonical deduplication ratio (`deduplication_ratio`). |
| **`DomainIntelResult`** | `contracts/domain_intel.py` | `DomainReputationCard`, `WhoisInspectionDrawer` | **Domain Provenance.** Displays `domain_age_days`, highlights `is_newly_registered` (< 30 days) in bright warning yellow, registrar name, nameservers, and MX/TXT records. |
| **`GeoLocationSummary` & `GeoLocationResult`** | `contracts/result.py`, `contracts/geolocation.py` | `GeoTransitWorldMap`, `JurisdictionAuditTable` | **Sovereign Hop Mapping.** Maps each transit hop with provider attribution (`source`), ASN, reverse DNS, and flags private/reserved IP addresses. |
| **`ThreatIntelResult` & `ProviderResult`** | `contracts/threat_intel.py`, `contracts/provider_result.py` | `ThreatFeedBadgeCluster`, `CacheStatusPill` | **Multi-Vendor Correlation.** Displays provider verdicts (`VirusTotal`, `AbuseIPDB`) alongside cache statuses (`HIT`, `MISS`, `STALE`). |
| **`HistoricalMatch` & `CorrelationLink`** | `contracts/historical.py`, `contracts/correlation.py` | `HistoricalIntelligencePanel`, `CampaignClusterGraph` | **Isolated Historical Context.** Renders matches across 8 `MatchType` values and 4 `CorrelationType` values (`CAMPAIGN`, `SHARED_INFRASTRUCTURE`, etc.) inside strictly isolated visual containers. |
| **`ReinvestigationRequest` & `ReinvestigationResult`** | `contracts/reinvestigation.py` | `ReinvestigationModal`, `DiffComparisonView` | **Immutable Case Preservation.** Submits analyst re-evaluation requests, tracks `new_case_id`, and powers side-by-side snapshot delta views. |
| **`ForensicReport`** | `contracts/report.py` | `FormalReportCanvas`, `PDFExportGenerator` | **Court-Admissible Export.** Packages risk assessment, attack hypotheses, evidence IDs, and narrative into a certified exportable document linked to `audit_reference`. |

### 30.2 Core Backend Invariants Enforced in the Client

1. **Security Invariant: Resource Stop Cannot Be Benign (`RESOURCE_STOP_REASONS`)**
   - In `contracts/result.py`, when an investigation stops due to resource exhaustion (`BUDGET_EXHAUSTED`, `LATENCY_BUDGET_EXHAUSTED`, `EXTERNAL_CALL_BUDGET_EXHAUSTED`, `MAX_ITERATIONS_REACHED`, `NO_CANDIDATE_TOOLS`, or `REPEATED_FAILURES_EXCEEDED`), the backend structurally forbids `Verdict.BENIGN`.
   - **Client Enforcement:** The frontend renders an unmistakable warning: *"Analysis halted early due to budget or latency constraints. Lack of detected threat is not proof of safety."* The verdict badge is locked to `INCONCLUSIVE` or `SUSPICIOUS`, and the Missing Artifact Checklist is immediately promoted.

2. **Forensic Invariant: Model Scores are Never Stored as Fact (`contracts/evidence.py`)**
   - The backend strictly enforces that any key with suffixes `_probability`, `_score`, or `_confidence_score` MUST be classified under `type=ML_SIGNAL` with `source_type=ML_MODEL`.
   - **Client Enforcement:** The Evidence Explorer renders `FACT` items with solid blue badges and verified provenance badges, while `ML_SIGNAL` items are rendered with violet badges, calibrated confidence meters, and model name/version tooltips.

3. **Mathematical Invariant: Exact Risk Contribution Parity (`contracts/risk.py`)**
   - In `RiskAssessment`, `risk_score` MUST equal $\sum \text{RiskContribution.contribution}$ (clipped to $[0, 100]$).
   - **Client Enforcement:** The Risk Breakdown card displays a deterministic waterfall chart where the height of each bar corresponds directly to `RiskContribution.contribution`. No mysterious or unexplained points exist on the client interface.

4. **Auditory Invariant: Cryptographic Hash Chaining (`contracts/audit.py`)**
   - Every `AuditRecord` contains `hash_prev` and computes `hash_self = SHA256(canonical_json(record))`.
   - **Client Enforcement:** The Audit Trail view visually renders links connecting adjacent records. If an investigator expands any step, the client independently computes and validates the hash chain, displaying a green **Chain Verified** seal or a red **Tamper Detected** warning.

5. **AI Safety Invariant: Deliberate LLM Output Restrictions (`contracts/reasoning.py`)**
   - `ReasoningResult` structurally omits `risk_score`, `confidence`, `verdict`, and tool execution commands.
   - **Client Enforcement:** The AI Copilot UI contains zero controls for setting case status. All Copilot responses are rendered in conversational sidebars with explicit *"Advisory Only — Deterministic Verdict Unaltered"* captions and clickable `[EVD-***]` evidence citation pills.

### 30.3 TypeScript Contract Mirror
To ensure 100% compile-time type safety, the client codebase maintains an exact TypeScript contract mirror in `/src/contracts/backend.ts`, defining all 32 enums and 40 interfaces matching the Python Pydantic definitions.

---

# User Journeys

### 31.1 Journey 1: Rapid 60-Second L1 Triage & Clean Resolution
1. **Priya** opens the Case Inbox; uses `J`/`K` keys to navigate to alert `#ASH-2026-9040` (*"Annual Benefits Enrollment Confirmation"*).
2. Taps `Spacebar` to open **Quick-Peek Drawer**:
   - Verdict: `BENIGN`, Risk: `4/100`, Confidence: `98/100`.
   - Authentication Matrix shows: SPF `PASS`, DKIM `PASS`, DMARC `PASS` (Strict Alignment).
   - Domain `benefits.targetcorp.in` is verified corporate internal domain.
3. Presses `C` to confirm benign classification and archive alert. Total elapsed time: **18 seconds**.

### 31.2 Journey 2: L2 Investigation of Sophisticated BEC & Homograph Attack
1. **Arjun** receives escalated alert `#ASH-2026-9012` (*"URGENT: Executive Wire Authorization"*).
2. Lands in **Case Workspace**; the HUD instantly alerts: `MALICIOUS`, Risk `92/100`, Confidence `84/100`.
3. Reviews **Key Findings**:
   - `[EVD-HDR-001]`: Domain `micro-soft.top` registered 4 hours ago.
   - `[EVD-AUT-002]`: DMARC Failed; Return-Path domain does not align with From header.
4. Switches to **Header Forensics Tab**:
   - Reviews **Received Hop Visualizer**: Discovers origin IP `185.220.101.5` routed directly from a Russian Federation Tor exit relay.
5. Switches to **URL & Domain Tab**:
   - Inspects redirect chain: bit.ly shortened link unpacks into a credential harvesting portal imitating corporate Microsoft 365 login.
6. Clicks `Ask Assistant`:
   - Enters: *"What other mailboxes received emails from this origin IP in the past 7 days?"*
   - Copilot checks historical intelligence and identifies 2 additional finance employees targeted 20 minutes prior.
7. Clicks `Escalate Case`:
   - System triggers containment protocol to pull all matching messages from user inboxes. Total elapsed time: **4 minutes**.

### 31.3 Journey 3: Digital Forensics Examiner Compiling Court-Admissible Dossier
1. **Dr. Mehta** is assigned case `#ASH-2026-8841` involving corporate IP theft.
2. Navigates to **Evidence Explorer**:
   - Verifies each of the 32 generated Evidence IDs. Pins critical artifacts (`EVD-HDR-004`, `EVD-ATT-002`) to the formal report.
3. Opens **Attachment Forensics Tab**:
   - Inspects sandbox process tree of the payload; verifies cryptographic hashes against local hardware tokens.
4. Navigates to **Forensic Report Tab**:
   - Enters expert commentary into the dedicated Examiner Statement block.
   - Inspects the **System Finding vs AI Explanation** visual separation to guarantee no probabilistic statements are presented as deterministic facts.
5. Clicks `Sign & Export Formal Dossier`:
   - System applies an immutable SHA-256 hash seal across all artifacts and generates a certified, court-admissible PDF document. Total elapsed time: **12 minutes**.

### 31.4 Journey 4: Handling an INCONCLUSIVE Case with Degraded Telemetry
1. An incoming case `#ASH-2026-9104` arrives with an encrypted payload.
2. The HUD displays `INCONCLUSIVE`, Risk `50/100`, Confidence `22/100` (Critically Low).
3. The analyst clicks the **Missing Artifact Checklist**:
   - Discovers that the attachment is a password-protected RAR file.
4. The analyst contacts the recipient out-of-band, obtains the password, and inputs it into the workspace's **Decrypt & Detonate Sandbox** input.
5. The pipeline re-analyzes the payload; the case updates via Diff Mode to `MALICIOUS` with $96\%$ Confidence.

---

# MVP Scope

The Minimum Viable Product (MVP) for the SIH 2026 PS 26106 evaluation is focused on core triage velocity and forensic depth:
- **Core Triage Inbox:** Virtualized table, multi-parameter filtering, quick-peek slideout drawer.
- **Case Workspace HUD:** Real-time Verdict, Risk gauge, Confidence meter, and Envelope metadata.
- **RFC 5322 Header Forensics:** Complete Received hop visualizer, transit latency delta calculator, and SPF/DKIM/DMARC matrix.
- **URL & Domain Analysis:** Defanged link viewer, unshortened redirect chain flow, and homoglyph punycode detection.
- **Infrastructure & Geolocation:** Origin IP ASN/ISP details and interactive dark-canvas world map route.
- **Attachment Forensics:** Static metadata, double-extension warning, Shannon entropy gauge, and file hash copying.
- **Evidence Explorer:** Filterable repository of all `EVD-***` items with one-click deep inspector drawer.
- **Dedicated Forensic Report View:** In-app report review with explicit visual isolation between System Findings and AI Explanations.
- **Evidentiary AI Assistant:** Side-dock copilot strictly grounded in Evidence IDs with prompt starters.
- **First-Class INCONCLUSIVE State:** Dedicated UI for low-confidence or degraded signal cases.
- **Sober Cybersecurity Design System:** WCAG AA compliant dark palette, zero neon gradients, full keyboard navigation.

---

# Future Scope

The post-hackathon enterprise roadmap addresses enterprise SOC scalability:
- **Automated SOAR Orchestration:** Direct integration with firewall and EDR APIs (CrowdStrike, SentinelOne) for 1-click endpoint isolation.
- **Graph Neural Network (GNN) Visualizer:** 3D interactive node-graph mapping global relationships between disparate threat actor campaigns.
- **Hardware YubiKey Signature Signing:** Cryptographic hardware token signing embedded directly into exported forensic reports.
- **Live Collaborative Workspace:** Real-time multi-analyst cursor presence and shared investigative scratchpads.

---

# UX Risks

| UX Risk Factor | Operational Hazard | Client-Side Architectural Mitigation |
| :--- | :--- | :--- |
| **Automation Bias** | Analysts blindly trusting AI explanations without validating raw evidence. | AI copilot answers are visually isolated, cannot touch verdicts, and must include clickable Evidence IDs linking to raw source bytes. |
| **Alert Fatigue & Cognitive Blur** | Monotonous dark tables leading to overlooked critical indicators during long shifts. | Multi-density views, strict typographic hierarchy, high-contrast WCAG AA status tokens, and keyboard-driven triage. |
| **False Sense of Safety** | Low-confidence or degraded cases mistakenly assumed clean by junior analysts. | Strict **Missing Evidence ≠ Safe** rule; dedicated `INCONCLUSIVE` state with explicit Missing Artifact Checklists. |
| **Context Switching Friction** | Investigators opening 10 browser tabs to check WHOIS, VirusTotal, and GeoIP. | All essential telemetry is enriched and presented natively in unified, defanged tabbed inspectors. |
| **Legal Inadmissibility** | Reports challenged in court due to unclear provenance or modified timestamps. | Immutable Evidence ID taxonomy, raw EML hash verification, and strict visual separation of deterministic facts from probabilistic AI text. |

---

# Final Recommendations

1. **Enforce the 5-Second Comprehension Rule:** Ensure that the Case HUD and Key Findings are rendered above the fold with zero layout shift, so an analyst grasps threat nature, risk, and confidence instantaneously.
2. **Never Merge Risk and Confidence:** Maintain the 2D orthogonal display of Risk (Threat Impact) and Confidence (Data Completeness) across all views.
3. **Keep AI Subservient to Proof:** Treat AI as an evidentiary clerk, not a judge. Never allow AI to generate ungrounded prose or modify case verdicts.
4. **Preserve Forensic Provenance:** Ensure every Evidence ID (`EVD-***`) acts as an immutable anchor linking synthesized insights directly to raw RFC 5322 header bytes and payload hashes.
5. **Maintain Visual Sobriety:** Strictly honor the professional SOC aesthetic—prioritizing dark slate neutrals, precise monospace telemetry, and functional contrast over decorative gradients and animations.

---
*End of Authoritative Frontend Product Specification — ASHIELDER Workstation (SIH 2026 PS 26106)*
