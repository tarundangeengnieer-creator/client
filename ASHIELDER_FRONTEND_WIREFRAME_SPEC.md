# ASHIELDER — Frontend Wireframe Specification
## Structural Layouts, Component Hierarchies, Interaction Models & Responsive Wireframes
**Smart India Hackathon 2026 | Problem Statement: PS 26106**  
**Document Class:** Frontend Wireframe & UI Structural Architecture Specification  
**Authority Level:** Authoritative Stage 3 Implementation Blueprint  
**Input Grounding:** `ASHIELDER_FRONTEND_PRODUCT_SPEC.md` (UX Authority) & `ASHIELDER_FRONTEND_API_INTEGRATION_SPEC.md` (Backend / Data Authority)  
**Status:** Approved for Direct Implementation | Target Release: Production v1.0  

---

# SECTION 1 — WIREFRAME PHILOSOPHY & CORE PRINCIPLES

ASHIELDER is a dedicated digital forensic and Security Operations Center (SOC) investigation workstation engineered for high-throughput email threat triage, deep RFC 5322 header inspection, weaponized payload dissection, and court-admissible forensic reporting. 

### 1.1 Anti-Patterns & Visual Rejections
The visual and operational language of ASHIELDER explicitly rejects the following industry tropes:
- **No Generic SaaS Dashboard:** No colorful toy widgets, excessive white margins, promotional banners, empty marketing copy, or ungrounded vanity statistics.
- **No ChatGPT / Conversational Clone:** No dominant central chatbox, no conversational prompt-driven navigation, no conversational summaries posing as case findings.
- **No Cyberpunk / Neon Hacker Aesthetic:** No gratuitous neon cyan/magenta gradients, glowing drop shadows, matrix rain animations, faux-terminal scanlines, or distorted decorative fonts.
- **No Marketing / Consumer UI:** No round pill buttons with 32px radii, no decorative illustration placeholders, and no hidden telemetry behind ambiguous "magic" cards.

### 1.2 The Ten Axiomatic Principles
Every wireframe, layout component, and interaction in this specification strictly adheres to ten non-negotiable principles:
1. **Evidence First:** Every visual metric, risk factor, and threat score must resolve to an immutable, traceable Evidence ID (`EVD-***`). Unbacked claims are strictly forbidden.
2. **Summary Before Detail:** The analyst must be able to comprehend the case verdict, risk level, and data confidence within 3 seconds of screen arrival, with progressive disclosure providing full byte-level drill-down on demand.
3. **Current Case $\neq$ Historical Context:** Historical correlation matches, past recipient attacks, and campaign clusters must remain visually quarantined in dedicated containers to prevent past incidents from corrupting the current case's deterministic facts.
4. **System Finding $\neq$ AI Explanation:** Deterministic parser results, cryptographic signatures, and statistical ML signals must be visually and typographically distinct from probabilistic AI/LLM narrative text.
5. **Risk $\neq$ Confidence:** Risk (threat severity on a 0–100 scale) and Confidence (data completeness and tool calibration on a 0.0–1.0 scale) are orthogonal dimensions and must never collapse into a single composite percentage.
6. **Missing Evidence $\neq$ Safe:** When an external tool fails, timeouts occur, or telemetry is absent, the system must never default to `BENIGN`. The absence of proof of malice is not proof of safety.
7. **AI Is Assistant, Not Authority:** The AI Copilot operates solely as an evidence-grounded advisory clerk. It is structurally barred from setting verdicts, altering risk scores, or initiating case disposition.
8. **Explainable Investigation:** The analyst must see exactly which tools ran, what budget was spent, why the pipeline stopped, and how each risk point was accumulated.
9. **Traceable Evidence IDs:** All UI chips, tabular cells, and narrative summaries must embed interactive Evidence ID anchors (`[EVD-HDR-001]`, `[EVD-AUT-002]`) that open the evidence inspector in 1 click.
10. **One-Click Source Inspection:** An analyst looking at an interpreted finding (e.g., "DMARC Failed") must be able to jump to the raw RFC 5322 header byte line in exactly one click.

---

# SECTION 2 — GLOBAL APPLICATION SHELL

The application shell provides the persistent structural framework across all views, ensuring high operational velocity, zero layout shift, and immediate access to global system state.

### 2.1 Visual Architecture Diagram

```
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| TOP APPLICATION HEADER (H: 48px)                                                                                  |
| [LOGO] ASHIELDER  |  CASE #ASH-2026-9012  |  [VERDICT BADGE]  |  [GLOBAL SEARCH / CMD+K]  |  [HEALTH: 200]  | [KEY] |
+───┬───────────────────────────────────────────────────────────────────────────────────────────┬───────────────────+
| N | BREADCRUMB BAR (H: 32px): Ingestion > Case #ASH-2026-9012 > Header Forensics              | [DRAWER TOGGLES]  |
| A +───────────────────────────────────────────────────────────────────────────────────────────┴───────────────────+
| V |                                                                                           | CONTEXT DRAWER    |
|   | MAIN WORKSPACE CANVAS                                                                     | (W: 380px/480px)  |
| R |                                                                                           |                   |
| A | (Houses Page Views: Inbox, Case Workspace HUD, Tabs, Tables, Visualizers, Reports)       | [EVIDENCE DETAIL] |
| I |                                                                                           |        OR         |
| L |                                                                                           | [AI ASSISTANT]    |
|   |                                                                                           |        OR         |
| ( |                                                                                           | [QUICK PEEK]      |
| 5 |                                                                                           |                   |
| 6 |                                                                                           |                   |
| p |                                                                                           |                   |
| x |                                                                                           |                   |
| ) |                                                                                           |                   |
+───┴───────────────────────────────────────────────────────────────────────────────────────────┴───────────────────+
| STATUS / SLA FOOTER (H: 24px)                                                                                     |
| System: HEALTHY | API: 18ms | Session: analyst_priya | Active Case Hash: a8f3b24... | SLA Countdown: 04:12        |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
```

### 2.2 Shell Structural Specification

```
Application Root
├── TopBar (Fixed, Top, Full Width, Height: 48px, z-index: 50)
│   ├── BrandCluster (Left, Width: 220px)
│   │   ├── PlatformLogo (Shield icon + ASHIELDER wordmark)
│   │   └── EnvironmentBadge ("SIH-2026-PROD" / "STAGING")
│   ├── ActiveCaseHUD (Center-Left, Width: 320px)
│   │   ├── CaseIndicator (Active Case ID: `#ASH-2026-9012` or `NO_ACTIVE_CASE`)
│   │   ├── ActiveVerdictPill (`MALICIOUS` / `SUSPICIOUS` / `BENIGN` / `INCONCLUSIVE`)
│   │   └── RiskConfidenceMiniPill (`R: 92` | `C: 84%`)
│   ├── OmnisearchTrigger (Center, Flex: 1, Max-Width: 480px)
│   │   └── SearchInputButton ("Search Cases, IOCs, Evidence IDs... [Ctrl+K]")
│   └── SystemActionCluster (Right, Width: 260px)
│       ├── NetworkHealthPill (Pings `GET /health` every 30s: `200 OK` 14ms)
│       ├── ApiKeyStatusButton (Key configured / missing indicator)
│       ├── NotificationBell (Unread queue alerts)
│       └── SessionProfileAvatar ("AP" / Analyst Priya)
├── BodyContainer (Flex Row, Height: calc(100vh - 72px))
│   ├── NavigationRail (Left, Fixed Width: 56px, z-index: 40)
│   │   ├── TopNavGroup
│   │   │   ├── NavItem: Ingestion / Dropzone (`/ingest`)
│   │   │   ├── NavItem: Case Inbox (`/inbox`)
│   │   │   ├── NavItem: Active Workspace (`/case/:id`)
│   │   │   ├── NavItem: Threat Hunting (`/hunting`)
│   │   │   └── NavItem: Audit & Reports (`/reports`)
│   │   └── BottomNavGroup
│   │       ├── NavItem: System Health (`/admin/health`)
│   │       ├── NavItem: Keyboard Shortcuts Legend (`?`)
│   │       └── NavItem: Workspace Settings (`/settings`)
│   ├── CentralCanvas (Flex: 1, Overflow-Y: Auto, Min-Width: 0)
│   │   ├── BreadcrumbStrip (Height: 32px, Sticky Top: 0, z-index: 30)
│   │   │   ├── PathNodes ("Cases > #ASH-2026-9012 > Header Forensics")
│   │   │   └── UtilityToolbar (Print Report, Raw EML Export, Re-investigate Trigger)
│   │   └── PageContentArea (Padding: 16px, Max-Width: 1600px, Margin: 0 Auto)
│   └── ContextualDrawer (Right, Slide-over / Pinned, Width: 380px or 480px, z-index: 45)
│       ├── DrawerHeader (Title, Mode Indicator, Close Button `Esc`, Pin Toggle)
│       ├── DrawerBody (Scrollable Container for Evidence Inspector, Quick Peek, or Copilot)
│       └── DrawerFooter (Actions, Direct Evidence Reference Copy, Source Jump)
└── GlobalStatusBar (Fixed Bottom, Full Width, Height: 24px, z-index: 50)
    ├── LeftStatusGroup (Backend Connection, Engine Version `v2.4.0`, Active Tenant)
    ├── CenterStatusGroup (Active Case SHA-256 Hash Truncation)
    └── RightStatusGroup (Local Storage Cache Status, Active SLA Timer)
```

### 2.3 Shell Component Detail Specifications

| Component Name | Position | Dimensions | Responsive Behavior | Keyboard Shortcut | Data Dependencies |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TopBar** | Top (Fixed) | Width: 100%, Height: 48px | Stays fixed; on mobile (<768px), hides Omnisearch input and collapses HUD to icon badge. | `Alt+H` (Focus TopBar) | `GET /health`, Session State |
| **NavigationRail** | Left (Fixed) | Width: 56px, Height: calc(100vh - 72px) | On tablet/mobile (<1024px), converts to bottom navigation bar or hidden off-canvas drawer. | `Alt+1` to `Alt+6` | Router Active Path |
| **ActiveCaseHUD** | TopBar (Center-Left) | Width: 320px, Height: 32px | Hidden on mobile; visible on tablet/desktop. Clicking jumps directly to `/case/:id`. | `Alt+C` | `InvestigationResult` |
| **Omnisearch** | TopBar (Center) | Max-Width: 480px, Height: 32px | Collapses to magnifying glass icon button on screens <1200px. | `Ctrl+K` or `/` | Local Case Index, `GET /evidence` |
| **ContextualDrawer**| Right (Pinned/Slide) | Width: 380px (Evidence) or 480px (Copilot) | Desktop: pushes canvas or overlays; Laptop: overlay (backdrop blur); Mobile: full screen (100vw). | `Esc` (Close), `Ctrl+E` (Evidence), `Ctrl+J` (Copilot) | Selected Evidence ID, Report JSON |
| **GlobalStatusBar** | Bottom (Fixed) | Width: 100%, Height: 24px | Hidden on mobile viewports (<768px) to conserve vertical density. | None | Ping latency, Local Storage usage |

---

# SECTION 3 — DESIGN GRID & LAYOUT SYSTEM

To prevent cumulative layout shift (CLS) and ensure technical density, all layouts are locked to a strict typographic and spacing baseline.

### 3.1 Spatial Parameters & Breakpoints

```
BREAKPOINTS:
├── Mobile Emergency Mode: 320px – 767px (Single column, stacked controls, full-screen drawers)
├── Tablet Mode: 768px – 1023px (Rail collapses to 48px, drawers overlay with backdrop)
├── Laptop Standard: 1024px – 1439px (2-pane split: 56px Rail + Flex Canvas + 380px Drawer)
├── Desktop Standard: 1440px – 1919px (3-pane layout: 56px Rail + 1200px Canvas + 480px Drawer)
└── Ultra-Wide: ≥1920px (Max Canvas constraint: 1600px, centered with balanced margins)

SPACING SCALE (4px / 8px Grid):
├── space-1: 4px   (Element micro-padding, badge gap)
├── space-2: 8px   (Button vertical padding, chip spacing, table cell gap)
├── space-3: 12px  (Card inner padding compact, form label gap)
├── space-4: 16px  (Card inner padding standard, canvas container padding)
├── space-5: 20px  (Section separator gap)
├── space-6: 24px  (Major structural region spacing)
└── space-8: 32px  (Page header bottom margin)
```

### 3.2 Typography & Density Matrix

| Text Style Role | Font Family | Size | Weight | Line Height | Tracking | Visual Application |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Header** | Plus Jakarta Sans | 20px | 700 (Bold) | 28px | -0.02em | Case ID, Verdict Announcement |
| **Section Header** | Plus Jakarta Sans | 14px | 600 (Semibold) | 20px | -0.01em | Card titles, Forensic Tab labels |
| **Body Regular** | Plus Jakarta Sans | 13px | 400 (Regular) | 18px | 0.00 | Descriptions, analyst notes, tool summaries |
| **Body Semibold** | Plus Jakarta Sans | 13px | 600 (Semibold) | 18px | 0.00 | Table column headers, field names |
| **Telemetry / Mono** | JetBrains Mono | 12px | 500 (Medium) | 16px | -0.01em | Hashes, IP addresses, Evidence IDs, timestamps |
| **Raw Code / Header**| JetBrains Mono | 11px | 400 (Regular) | 15px | 0.00 | RFC 5322 raw text, MIME boundaries, hex |
| **Micro Badge** | JetBrains Mono | 10px | 700 (Bold) | 12px | +0.04em | Verdict chips, `EVD-***` tags, status indicators |

---

# SECTION 4 — COMPLETE PAGE INVENTORY

Every surface is cataloged with its architectural purpose, data bindings from `ASHIELDER_FRONTEND_API_INTEGRATION_SPEC.md`, UI states, and responsive constraints.

### 4.1 Page Inventory Catalog

| # | Page Surface Name | Primary Route | Purpose & Core Workflow | Data & API Dependency |
| :- | :--- | :--- | :--- | :--- |
| **P-01** | **Authentication / Access** | `/login` | API Key validation, session initialization, local tenant setup. | Client session storage, `POST /analyze` test ping |
| **P-02** | **Ingestion & Dropzone** | `/ingest` | Drag-and-drop RFC 822 `.eml` ingestion; triggers pipeline execution. | `POST /api/v1/investigations/analyze` |
| **P-03** | **Case Triage Inbox** | `/inbox` | Triage queue of analyzed cases, multi-parameter filtering, quick-peek. | Local IndexedDB case repository, `GET /health` |
| **P-04** | **Quick-Peek Drawer** | Contextual Overlay | Non-destructive 10-second inspection drawer without navigating away. | Local Case Cache, `InvestigationResult` |
| **P-05** | **Case Workspace Shell** | `/case/:id` | Master container; renders HUD, navigation tabs, and drawer anchors. | `GET /api/v1/investigations/{id}` |
| **P-06** | **Overview & Journey** | `/case/:id/overview` | Executive triage landing; 2D grid, key findings, journey stepper. | `InvestigationResult`, `GET /{id}/evidence` |
| **P-07** | **Header Forensics** | `/case/:id/headers` | 5-pillar auth matrix, Received hop visualizer, raw RFC 5322 viewer. | `GET /{id}/evidence`, `POST /emails/analyze` |
| **P-08** | **URL & Domain Intel** | `/case/:id/urls` | Defanged links, homoglyphs, LightURLNet scores, redirect chains. | `GET /{id}/evidence` (category `URL`, `HTML`) |
| **P-09** | **Infrastructure & Geo** | `/case/:id/geo` | Origin IP ASN, Tor/VPN classification, interactive world map. | `InvestigationResult.geolocation`, `GET /evidence` |
| **P-10** | **Attachment Forensics** | `/case/:id/attachments`| Static hashes, magic-byte MIME mismatches, entropy gauges. | `GET /{id}/evidence`, `ParsedEmail.attachments` |
| **P-11** | **Historical Context** | `/case/:id/history` | Quarantined past campaign matches, blast radius, recipient recurrence. | `GET /{id}/evidence` (category `HISTORICAL`) |
| **P-12** | **Evidence Explorer** | `/case/:id/evidence` | Searchable datatable of all 42+ typed `EvidenceItem` atoms. | `GET /api/v1/investigations/{id}/evidence` |
| **P-13** | **Forensic Report View** | `/case/:id/report` | Interactive court-admissible report view with print-to-PDF engine. | `GET /api/v1/investigations/{id}/report` |
| **P-14** | **AI Copilot Drawer** | Contextual Drawer | Evidence-grounded advisory Q&A assistant citing loaded Evidence IDs. | Client-side evidence engine, `groq_narrative` |
| **P-15** | **Re-investigation Diff** | `/case/:id/diff` | Side-by-side comparative analysis between original and new case run. | `POST /api/v1/investigations/{id}/reinvestigate` |
| **P-16** | **Threat Hunting Portal** | `/hunting` | Global indicator pivot across locally stored cases (IPs, Hashes, Domains).| Client IndexedDB inverted index |
| **P-17** | **System & Tool Health** | `/admin/health` | Real-time tool execution status, latency monitoring, feed status. | `GET /health`, `InvestigationResult.tools_failed` |
| **P-18** | **Workspace Settings** | `/settings` | API key configuration, PII masking rules, theme contrast toggle. | Local Storage configuration |
| **P-19** | **First-Class Inconclusive**| `/case/:id` (Special) | Dedicated UI for low-confidence or budget-exhausted investigations. | `verdict == 'INCONCLUSIVE'`, `missing_evidence` |
| **P-20** | **Error & Degraded Surfaces**| Global Boundary | Explicit handling for rate limits (429), timeouts, and tool errors. | Structured backend error schemas |
| **P-21** | **Empty States Repository**| Global Sub-views | Standardized zero-data wireframes for clean search, empty queues. | UI State definitions |

---

# SECTION 5 — AUTHENTICATION & ACCESS SCREEN (`/login`)

The authentication surface is strictly grounded in the backend reality documented in `ASHIELDER_FRONTEND_API_INTEGRATION_SPEC.md` Section 2: the backend authenticates requests via the `X-API-Key` secret header. It does **not** provide multi-user SSO, OAuth2, or WebAuthn endpoints in v1.0.

### 5.1 Wireframe Layout (`/login`)

```
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
|                                                                                                                   |
|                                       +───────────────────────────────────+                                       |
|                                       |           [SHIELD LOGO]           |                                       |
|                                       |             ASHIELDER             |                                       |
|                                       |    Email Threat & Forensic SOC    |                                       |
|                                       +───────────────────────────────────+                                       |
|                                       | WORKSTATION ACCESS & CREDENTIALS  |                                       |
|                                       |                                   |                                       |
|                                       | Workstation API Endpoint:         |                                       |
|                                       | [ https://api.ashielder.soc:8000 ]|                                       |
|                                       |                                   |                                       |
|                                       | Analyst Access Key (X-API-Key):   |                                       |
|                                       | [ •••••••••••••••••••••••••• [EYE]|                                       |
|                                       |                                   |                                       |
|                                       | Analyst Identifier (Audit Trail): |                                       |
|                                       | [ analyst_priya                  ]|                                       |
|                                       |                                   |                                       |
|                                       | Session Persistence:              |                                       |
|                                       | [*] Session Storage (Clear on exit|                                       |
|                                       | [ ] Local Device Encrypted Cache  |                                       |
|                                       |                                   |                                       |
|                                       | [ VERIFY & ENTER WORKSTATION -> ] |                                       |
|                                       |                                   |                                       |
|                                       | STATUS: Ready                     |                                       |
|                                       +───────────────────────────────────+                                       |
|                                       | Cryptographic Integrity: Hardware |                                       |
|                                       | Engine v2.4.0  | SIH 2026 PS 26106 |                                       |
|                                       +───────────────────────────────────+                                       |
|                                                                                                                   |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
```

### 5.2 Technical Specification

- **Primary Action:** Clicks `[Verify & Enter Workstation]`.
- **Validation Flow:** Dispatches a test request to `GET /health` with the header `X-API-Key: <INPUT_KEY>`. If 200 OK is returned, commits the key to `sessionStorage` and navigates to `/inbox`.
- **Error States:**
  - `401 Unauthorized`: Displays amber banner: *"Invalid Access Key. Contact SOC Administrator."* Input field shakes with red border.
  - `Network Failure`: Displays red banner: *"Cannot reach backend at https://api.ashielder.soc:8000. Check container status."*
- **Session Recovery:** If an analyst refreshes any page with an active session, the key is read from `sessionStorage`. If missing, the app redirects to `/login?redirect=/case/case_2026...`.

---

# SECTION 6 — CASE INBOX WIREFRAME (`/inbox`)

The Case Inbox provides the primary operational queue for SOC L1/L2 analysts. As identified in Section 15 of the API Integration Spec, the backend currently lacks a global `GET /investigations` list endpoint. Therefore, the inbox is backed by an indexed local storage repository of analyzed cases, augmented with demonstration pre-loads.

### 6.1 Wireframe Layout (`/inbox`)

```
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| CASE TRIAGE INBOX                                                             [ + INGEST NEW .EML ] [ EXPORT CSV ]|
| Active Filter: Verdict: ALL | Risk: > 0 | Queue: Unresolved (14)                                                  |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| QUEUE METRICS:  TOTAL: 42   |  MALICIOUS: 18 (Crimson)  |  SUSPICIOUS: 11 (Amber)  |  INCONCLUSIVE: 4  | BENIGN: 9    |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| [SEARCH ID/SENDER/IOC (Ctrl+F)] | Verdict: [ALL v] | Risk: [>= 70 v] | Conf: [>= 0.60 v] | Density: [COMPACT/STD/PREV]|
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| [ ] | VERDICT      | RISK | CONF | CASE IDENTIFIER        | SENDER / ORIGIN DOMAIN     | SUBJECT LINE / HOPS | TIME |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| [ ] | [MALICIOUS]  |  92  | 0.84 | #ASH-2026-9012 (L2)   | security@bankofamerica...  | URGENT: Verify Acct | 14m  |
|     | Primary IOC: 185.220.101.5 (Tor Exit) | DMARC: FAIL | Intent: PHISHING | Attack: Credential Phishing        |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| [ ] | [SUSPICIOUS] |  58  | 0.72 | #ASH-2026-9015 (L1)   | billing@vendor-portal.in   | Outstanding Inv #42 | 1h   |
|     | Primary IOC: Newly Registered Domain (4 days) | SPF: PASS | DKIM: NONE | Attack: Invoice Fraud              |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| [ ] | [INCONCLUSIVE|  50  | 0.22 | #ASH-2026-9018 (L0)   | info@partner-network.com   | Encrypted Document  | 2h   |
|     | Stop Reason: BUDGET_EXHAUSTED | Missing: Password RAR | Failed Tools: None | Analyst Action Required        |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| [ ] | [BENIGN]     |  04  | 0.98 | #ASH-2026-9022 (L1)   | notifications@github.com   | [GitHub] PR #142    | 4h   |
|     | Authentication: SPF PASS, DKIM PASS, DMARC PASS (Strict Alignment) | Origin: 140.82.112.4 (Clean ASN)      |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| Selected: 1 case  |  [ SPACE: Quick Peek ]  |  [ ENTER: Open Workspace ]  |  [ C: Confirm ]  | Page 1 of 4 [ < > ]|
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
```

### 6.2 Table Density Modes

1. **Compact Density (Single-line row, Height: 36px):**
   - Columns: `Selection Checkbox` (24px), `Verdict Badge` (90px), `Risk Score` (48px), `Confidence Meter` (64px), `Case ID` (140px), `Sender Domain` (180px), `Subject` (Flex), `Timestamp` (80px), `Actions` (60px).
   - Designed for fast keyboard-driven triage (`J`/`K` navigation).
2. **Standard Density (Two-line row, Height: 54px — Default):**
   - Line 1: Case ID, Verdict, Risk, Confidence, Sender, Subject, Time.
   - Line 2: Top attack hypothesis chip, primary IOC (e.g., origin IP), auth result tags.
3. **Forensic Preview Density (Three-line row, Height: 78px):**
   - Line 1 & Line 2 as above.
   - Line 3: Stop reason, tools executed count (`tools_used.length`), missing evidence badges.

---

# SECTION 7 — QUICK-PEEK DRAWER WIREFRAME

The Quick-Peek Drawer is a non-destructive temporary inspection panel that slides in from the right edge of the Case Inbox when an analyst presses `Spacebar` or clicks the preview button on a table row. It eliminates unnecessary full-page navigations for rapid L1 triage.

### 7.1 Wireframe Layout (Quick-Peek Drawer)

```
+──────────────────────────────────────────────────────────────────────+
| QUICK PEEK: #ASH-2026-9012                     [ < PREV ] [ NEXT > ] [X]|
+──────────────────────────────────────────────────────────────────────+
| [ MALICIOUS ]       RISK: 92/100 (High)        CONFIDENCE: 0.84 (High)|
| Stops: CONFIDENCE_TARGET_REACHED               Investigation Level: L2|
+──────────────────────────────────────────────────────────────────────+
| ENVELOPE METADATA:                                                   |
| From:       security@bankofamerica-secure.net                        |
| To:         victim@targetcorp.in                                     |
| Subject:    URGENT: Verify Your Account Access                       |
| Date:       2026-09-05 18:13:58 UTC (14 minutes ago)                 |
+──────────────────────────────────────────────────────────────────────+
| AUTHENTICATION TRIAGE:                                               |
| SPF:  [ FAIL ] (Domain alignment mismatch)                           |
| DKIM: [ FAIL ] (Invalid signature header)                            |
| DMARC:[ FAIL ] (Policy: reject | Action: quarantined)                |
+──────────────────────────────────────────────────────────────────────+
| PRIMARY KEY FINDINGS:                                                |
| • [EVD-HDR-001] Domain registered 4 hours ago via NameCheap           |
| • [EVD-NET-003] Origin IP 185.220.101.5 is a known Tor Exit Node     |
| • [EVD-ML-001]  Content intent classifier: PHISHING (89.2% conf)     |
+──────────────────────────────────────────────────────────────────────+
| ATTACK HYPOTHESES:                                                   |
| [*] Credential Phishing (Score: 0.88) - SUPPORTED                    |
| [*] Executive Impersonation (Score: 0.92) - SUPPORTED                 |
+──────────────────────────────────────────────────────────────────────+
| TELEMETRY & RESOURCES:                                               |
| Tools Run: 10/10  |  Failed: 0  |  Latency: 1,842ms  |  Iterations: 3 |
+──────────────────────────────────────────────────────────────────────+
| [ ENTER: OPEN FULL WORKSPACE ]                 [ ESC: CLOSE DRAWER ] |
| [ C: CONFIRM MALICIOUS ]                       [ Q: QUARANTINE MAIL ]|
+──────────────────────────────────────────────────────────────────────+
```

### 7.2 Interaction Specifications
- **Trigger:** Selected inbox row + `Spacebar` or row click.
- **Drawer Dimensions:** Width: 440px on Desktop; 100vw on screens <768px.
- **Keyboard Trapping:** Pressing `J` or `Down` advances to the next case in the queue, immediately refreshing the Quick-Peek content without closing the drawer. Pressing `K` or `Up` loads the previous case. Pressing `Enter` commits navigation to `/case/:id`. Pressing `Esc` closes the drawer and returns focus to the inbox row.

---

# SECTION 8 — CASE WORKSPACE WIREFRAME (MASTER INVESTIGATION HUB)

The Case Workspace (`/case/:id`) is the primary digital forensics workbench. It is structured into three clear vertical levels: Level 1 (HUD), Level 2 (Tab Navigation & Summary), and Level 3 (Detailed Forensics Canvas).

### 8.1 Wireframe Layout (`/case/:id`)

```
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| CASE HUD (H: 84px):  #ASH-2026-9012  |  Status: COMPLETED (L2 Deep)  |  Iteration: 3/5  |  Stop: CONFIDENCE_TARGET |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| [ VERDICT ]    | RISK SCORE (0-100)        | CONFIDENCE (0.0-1.0)      | ENVELOPE SUMMARY                         |
|                | +───────────────────────+ | +───────────────────────+ | Sender:   security@bankofamerica-sec...  |
|  MALICIOUS     | | 92.5 / 100            | | | 0.842 / 1.0           | | Recipient:victim@targetcorp.in           |
|  (Crimson Red) | | [====================]| | | [==================  ]| | Subject:  URGENT: Verify Your Account... |
|  Shield Alert  | +───────────────────────+ | +───────────────────────+ | Received: 2026-09-05 18:13:58 UTC        |
|                | Contribs: 4 critical    | | Penalties: 0.00         | | Hashes:   SHA-256: 8f4c391... [COPY]     |
+────────────────┴───────────────────────────┴───────────────────────────┴──────────────────────────────────────────+
| TAB NAVIGATION: [Overview] [Headers (3)] [URLs (2)] [Geo/Infra] [Attachments (1)] [History (0)] [Evidence (42)]   |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| PRIMARY FORENSIC CANVAS (Flex: 1)                                             | CONTEXT DRAWER (W: 380px)         |
|                                                                               | [EVIDENCE DETAIL / COPILOT]       |
|                                                                               |                                   |
| (Houses currently active tab content: e.g., Received Hop Diagram,             | Click any [EVD-***] chip to view  |
|  Auth Matrix, URL Inspector, or Full Evidence Datatable)                      | raw provenance, parser offsets,   |
|                                                                               | and cryptographic verifications.  |
|                                                                               |                                   |
+───────────────────────────────────────────────────────────────────────────────┴───────────────────────────────────+
```

### 8.2 The 2D Orthogonal Metric Rule
Risk and Confidence are placed in separate visual cards.
- **Risk Score Card:** Emphasizes threat severity. Uses a dark slate card framed by a 1px border. The numerical score (`92.5`) is rendered in 24px bold display typography, colored according to threshold (`MALICIOUS` = Crimson `#DC2626`, `SUSPICIOUS` = Amber `#D97706`, `BENIGN` = Emerald `#059669`).
- **Confidence Meter Card:** Emphasizes evidentiary completeness and calibration. Numerical value is rendered as a ratio (`0.842 / 1.0` or `84.2%`). A secondary sub-label displays: *"Completeness: 100% | Calibration: 0.84 | Penalties: 0.0"*.
- **Visual Invariant:** The two cards must never share a single combined progress bar or single merged percentage badge.

---

# SECTION 9 — OVERVIEW & INVESTIGATION JOURNEY WIREFRAME

The Overview tab (`/case/:id/overview`) provides the primary landing view for deep analysis. It synthesizes key findings and presents a chronological stepper tracking pipeline execution.

### 9.1 Wireframe Layout (`/case/:id/overview`)

```
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| SECTION 1: KEY FORENSIC FINDINGS (Sorted by Risk Contribution Weight)                                             |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| [EVD-HDR-001] | AUTH_DMARC_FAIL   | Severity: CRITICAL | Weight: +35 pts | DMARC policy rejected origin IP        |
| [EVD-NET-003] | TOR_EXIT_NODE     | Severity: HIGH     | Weight: +30 pts | Origin IP 185.220.101.5 is active Tor  |
| [EVD-ML-001]  | NLP_INTENT_PHISH  | Severity: HIGH     | Weight: +20 pts | Model detected PHISHING (conf: 0.89)   |
| [EVD-URL-002] | HOMOGLYPH_DOMAIN  | Severity: MEDIUM   | Weight: +10 pts | bankofamerica-secure.net mimics target |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| SECTION 2: ADAPTIVE INVESTIGATION JOURNEY (Chronological Pipeline Stepper)                                        |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| [O] LEVEL 0: TRIAGE & STATIC INGESTION (Duration: 342ms | Status: SUCCESS)                                        |
|     • Extracted 12 RFC 5322 header fields, 1 attachment ref, 1 plain URL.                                         |
|     • Tools executed: header_parse, relay_reconstruction, attachment_hasher.                                      |
|     • Evidence generated: EVD-HDR-001 through EVD-HDR-012.                                                        |
|                                                                                                                   |
| [O] LEVEL 1: TARGETED HEURISTICS & LOCAL ML (Duration: 814ms | Status: SUCCESS)                                    |
|     • Evaluated SPF/DKIM/DMARC alignment. Ran DistilBERT NLP classifier and LightURLNet.                         |
|     • Tools executed: spf_dkim_dmarc, nlp_intent_ml, url_canonicalizer, url_ml.                                   |
|     • Evidence generated: EVD-AUT-001, EVD-ML-001, EVD-URL-001.                                                   |
|                                                                                                                   |
| [O] LEVEL 2: DEEP EXTERNAL ENRICHMENT & CORRELATION (Duration: 686ms | Status: SUCCESS)                            |
|     • Enriched Autonomous System routing, GeoIP database, and historical tenant similarity.                      |
|     • Tools executed: ip_classifier, geoip_lookup, sender_history.                                                |
|     • Evidence generated: EVD-NET-001 through EVD-NET-005.                                                        |
|                                                                                                                   |
| [X] LEVEL 3: GROQ LLM REASONING (Status: SKIPPED / DISABLED BY POLICY)                                            |
|     • Stop Reason: CONFIDENCE_TARGET_REACHED (0.842 >= target threshold 0.80). Budget conserved.                |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| SECTION 3: 4D RESOURCE ENVELOPE                                                                                   |
| Latency Budget: [ 1,842ms / 4,000ms ] | Tool Calls: [ 10 / 16 ] | Ext Calls: [ 4 / 6 ] | Tokens: [ 0 / 0 ]    |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
```

### 9.2 Investigation Journey State Rules
Every node in the journey stepper is tagged with one of seven states derived from `InvestigationResult`:
- `SUCCESS` (Green checkmark): Tool finished within budget; evidence added.
- `RUNNING` (Blue pulse): Tool currently executing (during live ingest).
- `DEGRADED` (Amber warning): Tool completed with partial telemetry (e.g., WHOIS timeout).
- `FAILED` (Red cross): Tool crashed or raised uncaught exception (`tools_failed` list).
- `SKIPPED` (Slate slash): Tool not scheduled due to early stop-guard or disabled configuration.
- `PENDING` (Dotted circle): Tool queued for subsequent investigation level.
- `COMPLETE` (Solid emerald): Terminal state of the entire pipeline.

---

# SECTION 10 — HEADER FORENSICS WIREFRAME

The Header Forensics tab (`/case/:id/headers`) provides deep structural validation of RFC 5322 transit metadata, DKIM signatures, and anti-spoofing policies.

### 10.1 Wireframe Layout (`/case/:id/headers`)

```
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| VIEW MODE: [ (•) STRUCTURED FORENSICS ]  [ ( ) RAW RFC 5322 SOURCE ]  [ ( ) SPLIT COMPARISON ]                    |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| 5-PILLAR AUTHENTICATION MATRIX                                                                                    |
+───────────────────┬───────────────────┬───────────────────┬───────────────────┬───────────────────────────────────+
| SPF VERIFICATION  | DKIM SIGNATURE    | DMARC ENFORCEMENT | DMARC ALIGNMENT   | ARC (AUTHENTICATED RECEIVED CHAIN)|
| [ FAIL ]          | [ FAIL ]          | [ FAIL ]          | [ ALIGNMENT FAIL] | [ NONE / NOT PRESENT ]            |
| MailFrom:         | Domain:           | Policy: reject    | Header From:      | Seal: Missing                     |
| evil-server.com   | bankofamerica...  | Subdomain: reject | bankofamerica...  | Chain: Not Evaluated              |
| IP: 185.220.101.5 | Selector: s1      | Disposition:      | Return-Path:      |                                   |
| Not in SPF record | Hash Mismatch     | QUARANTINE        | bounce@evil...    | Status: Clean Relay Absent        |
+───────────────────┴───────────────────┴───────────────────┴───────────────────┴───────────────────────────────────+
| AUTHENTICATION-RESULTS HEADER (RAW SOURCE VERBATIM):                                                              |
| mx.targetcorp.in; dmarc=fail (p=reject dis=quarantine) header.from=bankofamerica-secure.net;                    |
| spf=fail (sender IP is 185.220.101.5) smtp.mailfrom=bounce@evil-server.com; dkim=fail (bad signature)           |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| STRUCTURED HEADER FIELD INSPECTOR                                                    [ FILTER SUSPICIOUS ONLY ]   |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| HEADER FIELD NAME          | OBSERVED VALUE                            | ANOMALY / EVALUATION             | EVD ID|
+────────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────┼───────+
| From                       | "Security Alert" <security@bankofamerica> | Display Name Mismatch            | EVD-01|
| Reply-To                   | billing-dept@freemail-service.ru          | Reply-To Domain Discrepancy      | EVD-02|
| Return-Path                | bounce@evil-server.com                    | Envelope Sender ≠ Header Sender  | EVD-03|
| Message-ID                 | <20260905.99124@evil-server.com>          | Domain matches Return-Path       | EVD-04|
| X-Mailer                   | PHPMailer 6.1.4 (custom script)           | Mass-mailing script detected     | EVD-05|
| Date                       | Sat, 05 Sep 2026 18:13:58 +0000           | Valid RFC 2822 (0s skew)         | EVD-06|
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
```

### 10.2 Raw RFC 5322 Inspector Mode
When the analyst toggles `[ RAW RFC 5322 SOURCE ]`, the structured tables collapse into a full-width, syntax-highlighted code viewport:
- **Font:** JetBrains Mono 11px / 15px line height.
- **Line Numbers:** Explicit 1-indexed line numbers with sticky gutter.
- **Highlighting:**
  - Red background tint on failed authentication header lines (`Authentication-Results: ... dmarc=fail`).
  - Amber background tint on suspicious routing lines (`Received: from evil-server.com ...`).
  - Blue underline on clickable Evidence ID targets (`[View Evidence EVD-HDR-001]`).
- **Interactive Search:** Built-in `Ctrl+F` regex finder across all header lines.

---

# SECTION 11 — RECEIVED HOP VISUALIZER WIREFRAME

The Received Hop Visualizer transforms the reverse-chronological `Received:` headers into an intuitive, left-to-right network transmission graph, computing latency deltas and identifying anonymizing proxies.

### 11.1 Wireframe Layout (`/case/:id/headers` Sub-component)

```
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| RECEIVED TRANSMISSION PATH (Chronological Order: Hop 1 Origin -> Hop 3 Delivery)                                 |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
|  [ HOP 1: ORIGIN ]              [ HOP 2: TRANSIT RELAY ]          [ HOP 3: CORPORATE MX (INGRESS) ]              |
|  IP: 185.220.101.5              IP: 91.198.174.192                IP: 104.244.42.1                                |
|  Host: tor-exit.anonymizer.net  Host: relay.intermediate-node.org Host: mx1.targetcorp.in                         |
|  Location: Saint Petersburg, RU Location: Frankfurt, DE           Location: Mumbai, IN                            |
|  ASN: AS208323 (Tor Network)    ASN: AS16276 (OVH SAS)            ASN: AS13335 (Cloudflare / Internal)            |
|  Time: 18:13:58 UTC             Time: 18:14:00 UTC (+2.1s)        Time: 18:14:02 UTC (+1.8s)                      |
|                                                                                                                   |
|  +──────────────────+           +──────────────────+              +──────────────────+                            |
|  | [!] UNTRUSTED    | --------> | [*] PUBLIC RELAY | -----------> | [V] TRUSTED INGRESS|                          |
|  | TOR EXIT NODE    |  Delta:   | VERIFIED IP      |    Delta:    | CORP MAIL GATEWAY|                            |
|  | Evidence: EVD-01 |   2.1s    | Evidence: EVD-02 |     1.8s     | Evidence: EVD-03 |                            |
|  +──────────────────+           +──────────────────+              +──────────────────+                            |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| SELECTED HOP FORENSIC INSPECTOR: HOP 1 (ORIGINATING CLIENT)                                                       |
| • From Host (Claimed in HELO):   [ mail.bankofamerica.com ] (Forged / Spoofed)                                    |
| • Actual Reverse DNS (rDNS):     [ tor-exit-node-5.anonymizer.net ]                                               |
| • rDNS Validation Result:        [ FAILED: Forward-Confirmed Reverse DNS (FCrDNS) Mismatch ]                       |
| • Transmission Protocol:         [ ESMTP with TLSv1.3 (Cipher: TLS_AES_256_GCM_SHA384) ]                          |
| • Raw Received Line Verbatim:                                                                                     |
|   Received: from mail.bankofamerica.com (tor-exit.anonymizer.net [185.220.101.5])                                 |
|   by relay.intermediate-node.org with ESMTP id k9A120Z; Sat, 05 Sep 2026 18:13:58 +0000                        |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
```

### 11.2 Edge & Anomaly Detection Rules
- **Transit Latency Delta:** Latency $> 60\text{ seconds}$ between hops displays an amber clock tag: `[LATENCY ANOMALY: +3m 12s - Possible Queue Stalling or MITM]`.
- **Private / Reserved IP:** Hops involving RFC 1918 addresses (`10.0.0.0/8`, `192.168.0.0/16`) are rendered with a grey dashed container: `[INTERNAL CORPORATE HOP - Private IP]`.
- **Forged HELO/EHLO:** When claimed HELO domain does not match originating IP PTR record, the edge connects with a jagged crimson warning line.

---

# SECTION 12 — URL & DOMAIN INTELLIGENCE WIREFRAME

The URL & Domain Intelligence tab (`/case/:id/urls`) dissects links extracted from HTML/plain body text, normalizing URLs, calculating homoglyph entropy, and visualizing unshortened redirect flows.

### 12.1 Wireframe Layout (`/case/:id/urls`)

```
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| EXTRACTED URLS SUMMARY: 2 Total  |  1 Malicious  |  1 Clean  |  Deduplication Ratio: 1.0 (2 Canonical URLs)       |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| [!] DEFANGED URL 1 (PRIMARY PHISHING TARGET)                                                                      |
| Defanged Display:  hxxp[://]bankofamerica-secure[.]net/verify[?]id=881294                                         |
| Canonical URL:     http://bankofamerica-secure.net/verify?id=881294                                               |
| Anchor Text:       "Click Here to Verify Your Account Access" (Deceptive Mismatch)                                |
| Extracted From:    HTML Body (`<a href="...">`) at byte offset 2410                                               |
| LightURLNet Score: 0.942 / 1.0 [CRITICAL PHISHING RISK]                                                           |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| REDIRECT CHAIN INSPECTION                                                                                         |
| [1] hxxps[://]bit[.]ly/3x8A91z (Shortener)  ->  [2] hxxp[://]bankofamerica-secure[.]net/verify (Landing Page)     |
| • Status Code: 301 Permanent Redirect       • Status Code: 200 OK (Contains Credential Harvest Form)             |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| STRUCTURAL FORENSIC SIGNALS:                                                                                      |
| • Domain Name:         bankofamerica-secure.net (Lookalike / Combo-squatting targeting Bank of America)           |
| • Punycode / IDN:      None detected (Standard ASCII)                                                             |
| • Shannon Entropy:     3.42 bits (Normal dictionary lexical distribution)                                         |
| • Query Parameters:    id=881294 (Victim Tracking Identifier)                                                     |
| • External Threat Feeds:URLHaus: [FEED DISABLED IN BACKEND] | AbuseIPDB: [CONFIRMED 100% MALICIOUS]               |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| DOMAIN REPUTATION & PROVENANCE (Target: bankofamerica-secure.net)                                                 |
| • Domain Age:          [ 4 hours old ] (Registered: 2026-09-05 14:10:00 UTC) [!] CRITICAL NEW REGISTRATION      |
| • Registrar:           NameCheap, Inc.                                                                            |
| • Registrant Country:  Panama (Privacy Protected by Withheld for Privacy ehf)                                     |
| • Nameservers:         ns1.evil-dns.com, ns2.evil-dns.com                                                         |
| • A Record IP:         185.220.101.5 (Matches Originating Mail Server IP)                                         |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
```

### 12.2 Defanging & OPSEC Rules
- **No Active Hyperlinks:** All URLs in the interface are rendered inside `<span class="font-mono select-all">` elements with automatic defanging (`http` $\rightarrow$ `hxxp`, `.` $\rightarrow$ `[.]`).
- **No Accidental Navigation:** Right-click context menus are overridden to offer: `[Copy Defanged URL]`, `[Copy Raw URL (Warning)]`, and `[Search IOC in Threat Vault]`. Under no circumstances does a click event navigate the analyst's browser to the destination URL.

---

# SECTION 13 — INFRASTRUCTURE & GEOLOCATION WIREFRAME

The Infrastructure & Geolocation tab (`/case/:id/geo`) visualizes sovereign network pathways, Autonomous System details, and provides an interactive dark-canvas world map mapping the transit hops.

### 13.1 Wireframe Layout (`/case/:id/geo`)

```
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| INFRASTRUCTURE & SOVEREIGN ROUTING FORENSICS                                                                      |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| ORIGIN IP AUDIT CARD (Hop 1)                  | AUTONOMOUS SYSTEM (ASN) AUDIT CARD                                |
| IP Address:    185.220.101.5                  | ASN Number:    AS208323                                           |
| Classification:PUBLIC (Tor Exit Node)         | ASN Name:      TOR-EXIT-NET-1                                     |
| Reverse DNS:   tor-exit.anonymizer.net        | Organization:  Zwiebelfreunde e.V.                                |
| Country:       Russian Federation [RU]        | Registered:    Berlin, Germany                                    |
| City / Region: Saint Petersburg / Northwestern| Threat Score:  100 / 100 (Known Anonymizing Gateway)              |
| Coordinates:   59.9343° N, 30.3351° E         | BGP Prefix:    185.220.101.0/24                                   |
| Evidence ID:   [EVD-NET-003]                  | Evidence ID:   [EVD-NET-004]                                      |
+───────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────+
| INTERACTIVE TRANSIT ROUTE WORLD MAP                                                                               |
|                                                                                                                   |
|       [RU: 185.220.101.5] (Origin)                                                                                |
|                \                                                                                                  |
|                 \ Transit Latency: 2.1s                                                                           |
|                  \                                                                                                |
|                   *---> [DE: 91.198.174.192] (Frankfurt Relay)                                                    |
|                                  \                                                                                |
|                                   \ Transit Latency: 1.8s                                                         |
|                                    \                                                                              |
|                                     *---> [IN: 104.244.42.1] (Target Ingress Gateway)                             |
|                                                                                                                   |
| [ Zoom + ] [ Zoom - ] [ Reset Extent ]  |  Projection: Mercator Dark  |  Sovereignty Warnings: 1 (Cross-Border Tor)|
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
```

### 13.2 Sovereign Infrastructure Disclaimer
Every GeoIP visualization must display the persistent technical caveat:  
`"NOTE: Geolocation coordinates represent physical infrastructure registrations of the intermediate BGP routing node, NOT the verified physical location of the human adversary."`

---

# SECTION 14 — ATTACHMENT FORENSICS WIREFRAME

The Attachment Forensics tab (`/case/:id/attachments`) evaluates binary payloads, comparing file extensions against magic-byte headers, calculating Shannon entropy, and displaying cryptographic hashes.

### 14.1 Wireframe Layout (`/case/:id/attachments`)

```
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| DETECTED ATTACHMENTS: 1 Payload File                                                                              |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| [!] ATTACHMENT REF: Invoice_8812.pdf.exe                                                     [ COPY ALL HASHES ]  |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| FILE IDENTITY & EXTENSION MISMATCH WARNING:                                                                       |
| • Claimed Filename:    Invoice_8812.pdf.exe                                                                       |
| • Claimed MIME Type:   application/pdf (Declared in Content-Type header)                                          |
| • Detected Magic Bytes:MZ / PE32 Executable for Windows (0x4D 0x5A)                                               |
| • ANOMALY FLAG:        [!] CRITICAL EXTENSION MISMATCH: Executable disguised as PDF document [EVD-ATT-001]        |
| • File Size:           1,488,912 bytes (1.42 MB)                                                                  |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| CRYPTOGRAPHIC SIGNATURES & HASHES:                                                                                |
| • MD5:                 c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6                                            [COPY MD5]    |
| • SHA-1:               7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b                                    [COPY SHA-1]  |
| • SHA-256:             e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855            [COPY SHA-256]|
| • SSDEEP Fuzzy Hash:   24576:aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567:aBcD567                            [COPY SSDEEP] |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| ENTROPY & HEURISTIC ANALYSIS:                                                                                     |
| • Shannon Entropy:     7.89 / 8.0 bits [HIGH ENTROPY - Strong indication of packing, encryption, or obfuscation]  |
| • Section Headers:     .text (7.2 bits), .rsrc (7.9 bits - packed payload), .reloc (6.1 bits)                     |
| • Static Dissection:   Contains API imports: VirtualAlloc, WriteProcessMemory, CreateRemoteThread (Process Inject)|
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| SANDBOX EXECUTION STATUS:                                                                                         |
| [ DEGRADED TELEMETRY ] Dynamic Sandbox Analysis was SKIPPED / DISABLED in backend configuration.                 |
| Static findings above are sufficient for MALICIOUS verdict. Dynamic detonation requires elevated sandbox cluster.  |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
```

---

# SECTION 15 — HISTORICAL INTELLIGENCE & CORRELATION WIREFRAME

The Historical Intelligence tab (`/case/:id/history`) surfaces previous organizational encounters with the same origin IP, domain, subject line, or attachment hash. It enforces strict visual isolation to prevent past history from contaminating current case facts.

### 15.1 Wireframe Layout (`/case/:id/history`)

```
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| [!] ISOLATED HISTORICAL INTELLIGENCE (Contextual Precedent Only - Distinct from Current Evidence)                  |
| Telemetry Source: Local Incident Vault & Organization Threat Telemetry Cache                                      |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| CORRELATION SUMMARY: 2 Historical Precedents Detected across 3 Mailboxes                                          |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| PRECEDENT MATCH 1: #ASH-2026-8841 ("Executive Payroll Update")                                                    |
| • Encounter Date:      2026-08-28 09:14:12 UTC (8 days ago)                                                       |
| • Final Case Verdict:  [ MALICIOUS ] (Risk: 95/100 | Conf: 0.92)                                                  |
| • Target Mailbox:      finance-exec@targetcorp.in                                                                 |
| • Shared Indicators:   Origin IP: 185.220.101.5 (Exact Match)                                                     |
| • Match Strength:      [ STRONG CORRELATION - Shared Attack Infrastructure ]                                      |
| • Status:              Case Closed / Mailbox Remediated / IOC Blacklisted                                         |
| • Pivot Action:        [ VIEW HISTORICAL DOSSIER -> ]                                                             |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| PRECEDENT MATCH 2: #ASH-2026-8910 ("Vendor Wire Change")                                                          |
| • Encounter Date:      2026-09-01 14:22:00 UTC (4 days ago)                                                       |
| • Final Case Verdict:  [ SUSPICIOUS ] (Risk: 68/100 | Conf: 0.74)                                                 |
| • Target Mailbox:      accounts-payable@targetcorp.in                                                             |
| • Shared Indicators:   Return-Path: bounce@evil-server.com (Exact Match)                                          |
| • Match Strength:      [ MEDIUM CORRELATION - Shared SMTP Relay Identity ]                                        |
| • Pivot Action:        [ VIEW HISTORICAL DOSSIER -> ]                                                             |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| BLAST RADIUS ASSISTANT:                                                                                           |
| 3 employees across Finance and Procurement targeted by this campaign cluster in the past 14 days.                 |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
```

---

# SECTION 16 — EVIDENCE EXPLORER WIREFRAME

The Evidence Explorer (`/case/:id/evidence`) is the central forensic repository. It lists all 42+ typed atomic `EvidenceItem` records collected during pipeline execution, providing complete provenance and one-click drawer inspection.

### 16.1 Wireframe Layout (`/case/:id/evidence`)

```
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| EVIDENCE EXPLORER: 42 Total Items  |  Verified Facts: 22  |  Heuristics: 14  |  ML Signals: 4  |  Threat Feeds: 2   |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| [SEARCH KEY / VALUE / ID (Ctrl+F)] | Type: [ALL v] | Category: [ALL v] | Trust: [ALL v] | Sort: [Weight DESC v]   |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| EVD ID       | TYPE      | CATEGORY       | KEY / OBSERVATION         | VALUE / FINDING          | SOURCE  | TRUST|
+──────────────┼───────────┼────────────────┼───────────────────────────┼──────────────────────────┼─────────┼──────+
| EVD-AUT-001  | FACT      | AUTHENTICATION | auth_dmarc_result         | fail (policy=reject)     | spf_dkim| VERI |
| EVD-NET-003  | FACT      | RELAY / IP     | origin_ip_classification  | tor_exit_node            | ip_class| VERI |
| EVD-ML-001   | ML_SIGNAL | CONTENT        | nlp_intent_phishing_score | 0.892 (DistilBERT)       | nlp_ml  | INFE |
| EVD-URL-002  | HEURISTIC | URL            | homoglyph_lookalike_flag  | true (bankofamerica-sec) | url_can | REPO |
| EVD-HDR-003  | FACT      | HEADER         | return_path_mismatch      | bounce@evil-server.com   | hdr_pars| VERI |
| EVD-ATT-001  | FACT      | ATTACHMENT     | extension_mismatch_flag   | true (pdf vs mz/pe32)    | att_hash| VERI |
| EVD-NET-004  | FACT      | INFRASTRUCTURE | origin_asn_reputation     | AS208323 (Malicious)     | geo_look| VERI |
| EVD-URL-001  | FACT      | URL            | canonical_url_record      | hxxp://bankofamerica...  | url_can | VERI |
+──────────────┴───────────┴────────────────┴───────────────────────────┴──────────────────────────┴─────────┴──────+
| Showing 1-8 of 42 items  |  [ < Prev ]  [ Page 1 of 6 ]  [ Next > ]  |  [ EXPORT EVIDENCE JSON ] [ VERIFY HASHES ]|
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
```

### 16.2 Evidence Detail Drawer (Slide-Over from Right, Width: 420px)

```
+──────────────────────────────────────────────────────────────────────+
| EVIDENCE ATOM INSPECTOR: EVD-AUT-001                             [X] |
+──────────────────────────────────────────────────────────────────────+
| Evidence ID:     EVD-AUT-001                                         |
| Type:            FACT (Deterministic System Observation)             |
| Category:        AUTHENTICATION                                      |
| Trust Level:     VERIFIED (100% Deterministic)                       |
| Timestamp:       2026-09-05T18:14:02.124Z                            |
+──────────────────────────────────────────────────────────────────────+
| KEY & VALUE OBSERVATION:                                             |
| Key:             auth_dmarc_result                                   |
| Value:           "fail"                                              |
| Severity:        CRITICAL                                            |
| Point Weight:    +35 points towards Case Risk Score                  |
+──────────────────────────────────────────────────────────────────────+
| PROVENANCE & FORENSIC AUDIT TRAIL:                                   |
| Producer Module: spf_dkim_dmarc v2.2.0                               |
| Source Type:     PARSER (Deterministic Byte Stream Evaluator)        |
| File Offset:     Byte 1024 to 1210 in raw RFC 5322 payload           |
| RFC Header Ref:  Authentication-Results                              |
+──────────────────────────────────────────────────────────────────────+
| RAW JSON TELEMETRY (CANONICAL BACKEND REPR):                         |
| {                                                                    |
|   "domain": "bankofamerica-secure.net",                              |
|   "policy": "reject",                                                |
|   "alignment": "fail",                                               |
|   "disposition": "quarantine"                                        |
| }                                                                    |
+──────────────────────────────────────────────────────────────────────+
| [ VIEW IN RAW HEADERS ]                     [ COPY CANONICAL JSON ]  |
+──────────────────────────────────────────────────────────────────────+
```

---

# SECTION 17 — FORENSIC REPORT VIEW WIREFRAME

The Forensic Report tab (`/case/:id/report`) generates an interactive, audit-ready formal dossier. It renders the deterministic case findings and features client-side print-to-PDF formatting (`@media print`) as documented in Section 11 of the API Integration Spec.

### 17.1 Wireframe Layout (`/case/:id/report`)

```
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| FORENSIC CASE REPORT REVIEW                                   [ PRINT TO PDF (Ctrl+P) ] [ EXPORT JSON REPORT ]    |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| +───────────────────────────────────────────────────────────────────────────────────────────────────────────────+ |
| | ASHIELDER DIGITAL FORENSICS INVESTIGATION REPORT                                                              | |
| | Problem Statement: SIH 2026 PS 26106 | System Version: v2.4.0 | Report Generated: 2026-09-05 18:15:02 UTC     | |
| +───────────────────────────────────────────────────────────────────────────────────────────────────────────────+ |
| | 1. EXECUTIVE CASE BRIEFING                                                                                    | |
| | • Case Identifier:      #ASH-2026-9012                                                                        | |
| | • Final Case Verdict:   MALICIOUS (Risk: 92.5/100 | Confidence: 0.842)                                        | |
| | • Stop Reason:          CONFIDENCE_TARGET_REACHED (Iteration 3 of 5)                                         | |
| | • Ingested File:        Urgent_Account_Verification.eml (SHA-256: 8f4c391209b124808c1d3298a01f92e4...)      | |
| | • Primary Adversary:    Credential Phishing / Lookalike Infrastructure originating from Russian Federation    | |
| +───────────────────────────────────────────────────────────────────────────────────────────────────────────────+ |
| | 2. DETERMINISTIC SYSTEM FINDINGS (Machine Facts & Signatures - Verified)                                      | |
| | • SPF, DKIM, and DMARC authentication all failed for originating domain bankofamerica-secure.net.             | |
| | • Origin IP 185.220.101.5 is a confirmed Tor Exit Relay belonging to AS208323.                                | |
| | • Attachment 'Invoice_8812.pdf.exe' exhibits extension mismatch: MZ/PE32 executable payload with 7.89 entropy| |
| | • LightURLNet classified extracted destination URL as malicious with 94.2% confidence.                       | |
| +───────────────────────────────────────────────────────────────────────────────────────────────────────────────+ |
| | 3. SYNTHESIZED AI ANALYSIS & HYPOTHESIS INTERPRETATION (Probabilistic Copilot Advisory)                     | |
| | [ AI ADVISORY: The following text is generated by Groq/Llama-3 reasoning. It is non-authoritative. ]          | |
| | "The evaluated email exhibits high-confidence characteristics of a targeted credential harvesting campaign.   | |
| |  The adversary leveraged combo-squatting on bankofamerica-secure.net combined with display-name spoofing to    | |
| |  induce urgent action from the recipient. Recommend immediate domain blocking and host isolation."             | |
| +───────────────────────────────────────────────────────────────────────────────────────────────────────────────+ |
| | 4. AUDIT TRAIL & CRYPTOGRAPHIC INTEGRITY                                                                      | |
| | • Audit Chain Length:   8 Blocks                                                                              | |
| | • Genesis Block Hash:   000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f                     | |
| | • Terminal Block Hash:  a8f3b24c9e81d2f0a1c3e4b5d6f7890123456789abcdef0123456789abcdef01                     | |
| | • Cryptographic Seal:   VERIFIED (Zero block tampering detected across 42 evidence assertions)                | |
| | • Lead Analyst:         Priya Sharma (analyst_priya)  | Signature: [ DIGITALLY SEALED VIA SHA-256 ]           | |
| +───────────────────────────────────────────────────────────────────────────────────────────────────────────────+ |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
```

---

# SECTION 18 — AI COPILOT WIREFRAME (CONTEXTUAL ADVISORY ASSISTANT)

The AI Copilot operates as a persistent slide-out drawer on the right side of the screen. As documented in Section 10 of the API Integration Spec, because the backend currently lacks an interactive `/chat` streaming endpoint, the Copilot functions as a client-side evidentiary assistant querying the loaded `EvidenceItem` dataset directly.

### 18.1 Wireframe Layout (AI Copilot Drawer, Width: 420px)

```
+──────────────────────────────────────────────────────────────────────+
| EVIDENTIARY AI ASSISTANT                                          [X]|
| Context: Case #ASH-2026-9012 | Loaded Evidence: 42 Items             |
+──────────────────────────────────────────────────────────────────────+
| [!] ADVISORY BOUNDARY: AI-generated analysis is probabilistic and    |
|     subservient to deterministic facts. AI cannot alter case verdict.|
+──────────────────────────────────────────────────────────────────────+
| DIALOGUE TIMELINE:                                                   |
|                                                                      |
| [USER]: "Why did this email receive a MALICIOUS verdict?"            |
|                                                                      |
| [COPILOT]:                                                           |
| "The MALICIOUS verdict was triggered primarily by four high-weight   |
|  evidence findings:                                                  |
|                                                                      |
|  1. DMARC Authentication Failed [EVD-AUT-001]: The domain             |
|     bankofamerica-secure.net failed alignment and rejected origin.   |
|                                                                      |
|  2. Tor Exit Relay Detected [EVD-NET-003]: Origin IP 185.220.101.5   |
|     routed transmission through an anonymizing exit gateway.         |
|                                                                      |
|  3. Deceptive Executable Payload [EVD-ATT-001]: The attached file    |
|     'Invoice_8812.pdf.exe' is a PE32 executable disguised as a PDF.  |
|                                                                      |
|  4. Phishing URL Classification [EVD-URL-002]: LightURLNet scored    |
|     the destination link at 0.942 phishing probability."             |
|                                                                      |
+──────────────────────────────────────────────────────────────────────+
| SUGGESTED PROMPTS:                                                   |
| [ "What other mailboxes received this origin IP?" ]                  |
| [ "Explain the DMARC failure details." ]                             |
| [ "Show weaponization indicators for Invoice_8812." ]                |
+──────────────────────────────────────────────────────────────────────+
| [ Ask question regarding loaded case evidence...               [->] ]|
+──────────────────────────────────────────────────────────────────────+
```

---

# SECTION 19 — RE-INVESTIGATION COMPARISON VIEW (`/case/:id/diff`)

When an analyst triggers a re-investigation via `POST /api/v1/investigations/{id}/reinvestigate`, the backend creates a fresh case snapshot linked to `original_case_id`. The diff view highlights evidence mutations without overwriting the historic baseline.

### 19.1 Wireframe Layout (`/case/:id/diff`)

```
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| RE-INVESTIGATION SNAPSHOT COMPARISON                                                                              |
| Original Case: #ASH-2026-9012 (2026-09-05 18:14 UTC)  vs  Re-run Snapshot: #ASH-2026-9104 (2026-09-05 18:42 UTC)|
| Trigger Reason: New external threat intelligence feeds available for origin IP 185.220.101.5                      |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| METRIC COMPARISON                                                                                                 |
| • Verdict:        [ MALICIOUS ]                   ->  [ MALICIOUS ]           (Unchanged)                         |
| • Risk Score:     92.5 / 100                      ->  98.0 / 100              (+5.5 Points INCREASE)              |
| • Confidence:     0.842 (High)                    ->  0.940 (Very High)       (+9.8% INCREASE)                    |
| • Total Evidence: 42 Items                        ->  45 Items                (+3 New Items Discovered)           |
| • Tools Used:     10 Tools                        ->  11 Tools                (+abuseipdb_lookup executed)        |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| EVIDENCE MUTATION DIFF MATRIX                                                                                     |
+──────────────┬──────────────────┬─────────────────────────────────┬───────────────────────────────┬───────────────+
| EVIDENCE ID  | CATEGORY         | SNAPSHOT 1 (ORIGINAL)           | SNAPSHOT 2 (RE-RUN)           | DELTA TYPE    |
+──────────────┼──────────────────┼─────────────────────────────────┼───────────────────────────────┼───────────────+
| EVD-NET-006  | THREAT_INTEL     | [ NOT EVALUATED / CACHE MISS ]  | AbuseIPDB Confirmed 100% Mal  | NEW EVIDENCE  |
| EVD-NET-007  | THREAT_INTEL     | [ NOT EVALUATED / CACHE MISS ]  | Reported in 42 Attack Reports | NEW EVIDENCE  |
| EVD-RSK-002  | RISK_SCORING     | Risk Contribution: +30 pts      | Risk Contribution: +35 pts    | SCORE WEIGHT  |
+──────────────┴──────────────────┴─────────────────────────────────┴───────────────────────────────┴───────────────+
| [ (•) ACCEPT NEW SNAPSHOT AS ACTIVE ]               [ ( ) REVERT TO HISTORIC SNAPSHOT ]       [ EXPORT DIFF REPORT|
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
```

---

# SECTION 20 — FIRST-CLASS INCONCLUSIVE EXPERIENCE

In strict accordance with Axiom 6 (*Missing Evidence $\neq$ Safe*), an `INCONCLUSIVE` verdict receives a specialized, high-urgency interface rather than being treated as benign.

### 20.1 Wireframe Layout (`/case/:id` with Inconclusive State)

```
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| CASE HUD: #ASH-2026-9018  |  Status: INCONCLUSIVE  |  Iteration: 1/5  |  Stop: BUDGET_EXHAUSTED                   |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| [ INCONCLUSIVE ] | RISK SCORE: 50/100 (Uncertain) | CONFIDENCE: 0.22 (CRITICALLY LOW) | ENVELOPE: info@partner.com |
|  (Slate Blue)    | Indeterminate threat signals  | Missing critical attachments      | Subject: Encrypted Doc    |
|  Alert Octagon   | Potential dormant threat      | Requires manual analyst input     | Date: 2026-09-05 16:10 UTC|
+──────────────────┴───────────────────────────────┴───────────────────────────────────┴───────────────────────────+
| [!] CRITICAL INVESTIGATION WARNING: ANALYSIS HALTED EARLY DUE TO BUDGET OR TELEMETRY CONSTRAINTS.                  |
|     Lack of detected threat is NOT proof of safety. High-risk indicators could not be evaluated.                 |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| MISSING ARTIFACT CHECKLIST (Blocks Required for High-Confidence Resolution):                                      |
|                                                                                                                   |
| [ ] 1. Password-Protected RAR Archive (Payload encrypted with unknown key)                                        |
|        Action Required: Contact recipient out-of-band to obtain password.                                         |
|        Input Key: [ Enter Password...                         ] [ DECRYPT & DETONATE IN SANDBOX ]                  |
|                                                                                                                   |
| [ ] 2. Destination URL Unreachable (Host timed out during LightURLNet crawler)                                    |
|        Action Required: Verify whether web infrastructure is geo-fenced or currently offline.                    |
|        Action: [ RETRY HTTP FETCH VIA TOR EXIT ]                                                                  |
|                                                                                                                   |
| [ ] 3. External RDAP Domain Lookup Timeout (Network latency exceeded 2,000ms budget limit)                        |
|        Action: [ QUERY EXTERNAL WHOIS MANUALLY -> ]                                                               |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| ANALYST MANUAL OVERRIDE & ESCALATION CONTROLS:                                                                    |
| [ ESCALATE TO L3 INCIDENT RESPONSE ]  |  [ MARK AS SAFE (REQUIRES SIGNED JUSTIFICATION) ]  |  [ RE-INVESTIGATE ]   |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
```

---

# SECTION 21 — ERROR & DEGRADED STATE WIREFRAMES

Every real failure mode from Section 12 of `ASHIELDER_FRONTEND_API_INTEGRATION_SPEC.md` is given a precise, non-generic UI representation.

### 21.1 Wireframe Layout (429 Rate Limit Cooldown)

```
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| [!] WORKSTATION RATE LIMIT REACHED (HTTP 429 Too Many Requests)                                                   |
| The backend investigation cluster limits clients to 10 email analyses per minute per IP.                          |
| Cooldown timer remaining: 00:42 seconds [=========================                   ]                            |
| Action: Analysis queue is paused. The workstation will automatically resume ingestion upon cooldown completion.   |
| [ FORCE RE-CHECK STATUS ]                                                                                         |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
```

### 21.2 Wireframe Layout (Corrupted .EML Upload)

```
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
| [X] INVALID RFC 822/5322 MIME FORMAT (HTTP 400 Bad Request)                                                       |
| File: "corrupted_dump.txt" (0 bytes or missing MIME headers)                                                      |
| Detail: The backend MIME parser could not locate valid 'From', 'Date', or boundary delimiters.                    |
| Recovery Action: Ensure you export the target message directly as an RFC 822 .eml file from your mail client.    |
| [ DISMISS & SELECT NEW FILE ]                                                                                     |
+───────────────────────────────────────────────────────────────────────────────────────────────────────────────────+
```

---

# SECTION 22 — REUSABLE COMPONENT INVENTORY

This component tree forms the building blocks for the implementation phase:

```
AppRoot
├── GlobalShell
│   ├── TopBar
│   │   ├── BrandLogo
│   │   ├── ActiveCaseHUDMini
│   │   ├── OmnisearchTrigger
│   │   ├── SystemHealthIndicator
│   │   └── SessionProfileMenu
│   ├── NavigationRail
│   │   ├── NavRailItem
│   │   └── KeyboardLegendTrigger
│   ├── BreadcrumbBar
│   │   ├── BreadcrumbItem
│   │   └── GlobalActionButtons
│   └── GlobalStatusBar
│       ├── ConnectionPingTag
│       ├── CaseHashSeal
│       └── SlaCountdownTimer
├── InboxComponents
│   ├── InboxToolbar
│   ├── FilterBar
│   ├── DensitySelector
│   ├── CaseTable
│   │   ├── CaseTableRow
│   │   │   ├── VerdictBadge
│   │   │   ├── RiskPill
│   │   │   ├── ConfidencePill
│   │   │   └── CaseActionMenu
│   │   └── TablePagination
│   └── QuickPeekDrawer
├── WorkspaceComponents
│   ├── CaseHeaderHUD
│   │   ├── VerdictDisplayCard
│   │   ├── RiskScoreCard
│   │   ├── ConfidenceCard
│   │   └── EnvelopeSummaryCard
│   ├── TabNavigationHeader
│   ├── OverviewTab
│   │   ├── KeyFindingsTable
│   │   ├── JourneyStepper
│   │   │   └── JourneyStepNode
│   │   └── ResourceBudgetCard
│   ├── HeaderForensicsTab
│   │   ├── AuthMatrixGrid
│   │   ├── ReceivedHopVisualizer
│   │   │   └── HopNodeCard
│   │   ├── HeaderAnomalyList
│   │   └── RawHeaderViewer
│   ├── URLForensicsTab
│   │   ├── DefangedURLCard
│   │   ├── RedirectChainFlow
│   │   └── DomainReputationCard
│   ├── GeoInfrastructureTab
│   │   ├── OriginIPCard
│   │   ├── ASNReputationCard
│   │   └── WorldMapViewer
│   ├── AttachmentTab
│   │   ├── AttachmentCard
│   │   ├── EntropyGauge
│   │   └── HashCopyCluster
│   ├── HistoricalTab
│   │   ├── PrecedentMatchCard
│   │   └── BlastRadiusSummary
│   ├── EvidenceExplorerTab
│   │   ├── EvidenceSearchFilter
│   │   ├── EvidenceDataTable
│   │   └── EvidenceDetailDrawer
│   ├── ForensicReportTab
│   │   ├── ReportHeader
│   │   ├── ExecutiveBriefingSection
│   │   ├── SystemFindingsSection
│   │   ├── AICopilotAdvisorySection
│   │   └── CryptographicAuditSeal
│   ├── ReinvestigationDiffView
│   │   ├── MetricDeltaRow
│   │   └── EvidenceDiffTable
│   └── InconclusiveView
│       ├── WarningAlertBanner
│       ├── MissingArtifactChecklist
│       └── ManualInterventionForm
└── SharedAtoms
    ├── EvidenceChip (`[EVD-***]`)
    ├── HashDisplayTag
    ├── DefangedLinkText
    ├── CopyButton
    ├── EmptyStateCard
    └── LoadingSkeletonCard
```

---

# SECTION 23 — DESIGN TOKENS & VISUAL SPECIFICATION

The color system is derived from strict dark-mode accessibility requirements (WCAG AA, contrast ratio $\ge 4.5:1$).

### 23.1 Color Palette & Semantics

```
NEUTRAL SURFACES (Dark Slate Theme):
├── surface-canvas:     #0B0F17  (App background, lowest elevation)
├── surface-subtle:     #111827  (Navigation rail, table alternating rows)
├── surface-card:       #1F2937  (Standard card background)
├── surface-elevated:   #374151  (Modals, popovers, quick-peek drawer)
├── border-subtle:      #1F2937  (Subtle dividers)
├── border-default:     #374151  (Standard card borders)
└── border-focused:     #4B5563  (Interactive focus outlines)

TYPOGRAPHY CONTRAST:
├── text-primary:       #F9FAFB  (Headings, critical values, 14:1 contrast)
├── text-secondary:     #9CA3AF  (Field labels, timestamps, 7.5:1 contrast)
└── text-tertiary:      #6B7280  (Disabled states, non-essential metadata)

STATUS SEMANTICS (Color + Icon + Text):
├── verdict-malicious:  #DC2626  (Crimson Red | Shield Alert Icon)
├── verdict-suspicious: #D97706  (Amber Orange | Alert Triangle Icon)
├── verdict-benign:     #059669  (Emerald Green | Check Circle Icon)
├── verdict-inconcl:    #475569  (Slate Blue | Alert Octagon Icon)
├── info-accent:        #2563EB  (Cobalt Blue | Information Circle Icon)
└── ai-probabilistic:   #7C3AED  (Violet Purple | Sparkle Advisory Icon)
```

---

# SECTION 24 — INTERACTION MODEL & KEYBOARD MATRIX

Operational efficiency is maximized through an intuitive, non-conflicting keyboard shortcut system designed specifically for SOC analysts:

| Key Binding | Scope | Action Executed | UI Feedback |
| :--- | :--- | :--- | :--- |
| `J` or `Down` | Case Inbox | Move selection to next case row | Blue focus ring moves down |
| `K` or `Up` | Case Inbox | Move selection to previous case row | Blue focus ring moves up |
| `Spacebar` | Case Inbox | Toggle Quick-Peek Drawer for selected case | Right drawer slides in |
| `Enter` | Case Inbox | Open Case Workspace (`/case/:id`) | Navigates to full workspace |
| `C` | Case Inbox / WS | Confirm benign/clean disposition | Confirmation modal triggers |
| `Q` | Case Inbox / WS | Quarantine message / block sender | Quarantine modal triggers |
| `Ctrl + K` / `/` | Global Shell | Open Omnisearch & Command Palette | Centered modal opens |
| `Ctrl + E` | Case Workspace | Open Evidence Explorer Drawer | Right drawer switches to Evidence |
| `Ctrl + J` | Case Workspace | Open AI Copilot Drawer | Right drawer switches to Copilot |
| `Ctrl + P` | Case Workspace | Print Formal Forensic Report | Browser print dialog opens |
| `1` through `7`| Case Workspace | Switch between Forensic Tabs (1:Overview, 2:Headers...) | Active tab switches immediately |
| `Esc` | Global Shell | Close any open drawer, modal, or overlay | Focus returns to parent canvas |
| `?` | Global Shell | Display Keyboard Legend Modal | Cheat sheet overlays canvas |

---

# SECTION 25 — URL / DEEP-LINK STATE MODEL

The client application serializes workspace parameters directly into URL query parameters. This ensures that forensic state is linkable, shareable, and verifiable in audit tickets:

```
URL PATTERN:
/case/:investigation_id?tab=:tab_name&evd=:evidence_id&hop=:hop_index&drawer=:drawer_mode

EXAMPLES:
1. Deep-link to Header Forensics with Hop 1 pre-selected:
   /case/case_20260905_181402_a1b2c3d4?tab=headers&hop=1

2. Deep-link to Evidence Explorer with specific atom open in drawer:
   /case/case_20260905_181402_a1b2c3d4?tab=evidence&evd=EVD-AUT-001&drawer=inspector

3. Deep-link to Forensic Report ready for print:
   /case/case_20260905_181402_a1b2c3d4?tab=report&print=true
```

---

# SECTION 26 — RESPONSIVE WIREFRAME ADAPTATIONS

Layouts adapt gracefully across display profiles without truncating critical security telemetry:

### 26.1 Desktop Standard (1920x1080)
- **Layout:** 3-Pane Structure.
- **Left:** 56px Navigation Rail.
- **Center:** 1384px Main Investigation Canvas (Full 2D grid, multi-column tab views).
- **Right:** 480px Pinned Evidence / Copilot Drawer.

### 26.2 Laptop Standard (1366x768)
- **Layout:** 2-Pane Structure.
- **Left:** 56px Navigation Rail.
- **Center:** Flex Canvas (Cards scale to single/two-column arrangements).
- **Right:** 380px Slide-Over Drawer (Overlays canvas with subtle backdrop blur, dismissible via `Esc`).

### 26.3 Mobile Emergency Mode (375x812 / Handheld SOC Triage)
- **Layout:** Single-column stacked stream.
- **Navigation:** Rail collapses to sticky bottom action bar (Ingest, Inbox, Active Case, Settings).
- **HUD:** Verdict banner displays at top (Height: 48px); Risk & Confidence display as side-by-side metric chips.
- **Tabs:** Horizontal swipeable pill rail.
- **Drawers:** Expand to full-screen modals (`100vw`, `100vh`) with top sticky close bars.

---

# SECTION 27 — ACCESSIBILITY & TECHNICAL COMPLIANCE

1. **Color Independence:** No status indicator relies solely on color. Every verdict and risk level is accompanied by an explicit text label (`MALICIOUS`, `SUSPICIOUS`, `BENIGN`, `INCONCLUSIVE`) and a distinct geometric Lucide icon.
2. **Focus Management:** All interactive elements feature visible, high-contrast focus rings (`outline: 2px solid #3B82F6; outline-offset: 2px`).
3. **Screen Reader ARIA Annotations:**
   - Table rows include `role="row"` and `aria-label="Case {id}, Verdict {verdict}, Risk {risk}"`.
   - Evidence chips include `aria-description="Click to inspect evidence item {id}"`.
   - Tab lists feature `role="tablist"` with `aria-selected` tracking.
4. **Reduced Motion:** Respects `prefers-reduced-motion: reduce` by replacing sliding drawer transitions with instant opacity cuts.

---

# SECTION 28 — UNIFIED FRONTEND STATE MODEL

To prevent UI race conditions and invalid combinations, the frontend maintains four strictly decoupled state dimensions:

```
+─────────────────────────────────────────────────────────────────────────────────────────────+
| DIMENSION 1: REQUEST STATE (Network Lifecycle)                                              |
| • IDLE:       No active network request.                                                    |
| • LOADING:    Waiting for backend response (Multi-stage progress indicator active).         |
| • SUCCESS:    Payload validated against contract schema and committed to local store.       |
| • ERROR:      Structured backend error received (HTTP 400, 401, 413, 429, 500).             |
+─────────────────────────────────────────────────────────────────────────────────────────────+
| DIMENSION 2: DATA COMPLETENESS STATE (Telemetry Integrity)                                  |
| • LOADED:     All tools completed successfully; full evidence graph available.              |
| • PARTIAL:    Some tools degraded or timed out; missing evidence flags displayed.           |
| • CORRUPTED:  Hash verification failed; tamper warning seal displayed.                     |
| • EMPTY:      No case loaded or zero records matching filter.                               |
+─────────────────────────────────────────────────────────────────────────────────────────────+
| DIMENSION 3: INVESTIGATION STATE (Backend FSM Status)                                       |
| • INITIALIZED:File ingested, hashes computed.                                               |
| • LEVEL_0:    Static triage and header parsing.                                             |
| • LEVEL_1:    ML intent models and URL canonicalization.                                    |
| • LEVEL_2:    Deep external enrichment (GeoIP, ASN, History).                               |
| • STOPPED:    Pipeline stopped due to target reached or budget exhaustion.                  |
| • COMPLETED:  Terminal investigation result generated.                                      |
+─────────────────────────────────────────────────────────────────────────────────────────────+
| DIMENSION 4: UI WORKSPACE STATE (Presentation Configuration)                                |
| • ACTIVE_TAB: Current tab index ('overview' | 'headers' | 'urls' | 'geo' | 'evidence' ...)  |
| • DRAWER_MODE:'none' | 'quick_peek' | 'evidence_detail' | 'copilot'                         |
| • DENSITY:    'compact' | 'standard' | 'forensic_preview'                                   |
| • PII_MASK:   'masked' (e.g., v***@targetcorp.in) | 'unmasked' (raw verified string)        |
+─────────────────────────────────────────────────────────────────────────────────────────────+
```

---

# SECTION 29 — SCREEN-BY-SCREEN ACCEPTANCE CRITERIA

### 29.1 Case Workspace HUD & Triage Canvas
- [ ] Analyst can ascertain case Verdict, Risk, and Confidence within 3 seconds of screen arrival.
- [ ] Risk and Confidence are presented in separate, dedicated cards; they do not merge into a single metric.
- [ ] Every finding card displays at least one clickable Evidence ID (`EVD-***`).
- [ ] Clicking any Evidence ID opens the Evidence Detail Drawer within 100ms.
- [ ] Missing evidence items are highlighted in a prominent, dedicated alert card when `verdict == 'INCONCLUSIVE'`.
- [ ] No frontend control allows an analyst or AI assistant to directly edit the computed risk score or verdict.

### 29.2 Header Forensics & Received Hop Visualizer
- [ ] The 5-pillar authentication matrix displays SPF, DKIM, DMARC, Alignment, and ARC.
- [ ] Received hops are ordered chronologically from origin (Hop 1) to final recipient MX.
- [ ] Transit latency delta is computed and displayed for every intermediate hop.
- [ ] Hops involving Tor exit nodes or known anonymizers feature prominent crimson alert borders.
- [ ] Raw RFC 5322 header lines can be searched using regex with instantaneous highlighting.

### 29.3 URL & Domain Forensics
- [ ] All extracted URLs are defanged by default (`hxxp://`, `[.]`).
- [ ] Destination links cannot be accidentally triggered via browser click.
- [ ] Domains registered $< 30\text{ days ago}$ display an unmistakable amber `NEWLY REGISTERED` badge.
- [ ] Redirect chains display each intermediate HTTP status code and final destination payload.

### 29.4 Evidence Explorer & Audit Integrity
- [ ] All 42+ collected evidence atoms are displayed in a filterable, sortable datatable.
- [ ] Each evidence item specifies its exact `producer_module`, `trust_level`, and raw RFC byte offset.
- [ ] The audit trail displays the complete SHA-256 genesis-chained hash record.

---

# SECTION 30 — FINAL IMPLEMENTATION BLUEPRINT

This consolidated matrix serves as the direct hand-off map for frontend engineering:

| Screen Surface | Primary Route | Root Component Tree | Primary API Endpoint | Consumed Data Contract | Critical Invariant Rule |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Authentication** | `/login` | `AppRoot > LoginCard` | `GET /health` | `{ status: "healthy" }` | Store API key in `sessionStorage` only. |
| **Ingestion** | `/ingest` | `AppRoot > IngestDropzone` | `POST /investigations/analyze` | Multipart Form `.eml` | Enforce 10 MB maximum file size. |
| **Case Inbox** | `/inbox` | `AppRoot > InboxTable > CaseRow` | Local IndexedDB Repository | `Array<InvestigationResult>` | Backed by local storage in lieu of backend endpoint. |
| **Quick Peek** | Contextual Drawer| `InboxTable > QuickPeekDrawer` | Local Case Cache | `InvestigationResult` | Advance rows via `J`/`K` without closing drawer. |
| **Workspace HUD** | `/case/:id` | `WorkspaceShell > CaseHUD` | `GET /investigations/{id}` | `InvestigationResult` | Keep Risk (0–100) and Confidence (0–1) orthogonal. |
| **Overview Tab** | `/case/:id/overview`| `CaseCanvas > OverviewTab` | `GET /{id}` & `GET /{id}/evidence` | `InvestigationResult`, `EvidenceItem[]`| Map journey steps directly to `tools_used`. |
| **Header Forensics**| `/case/:id/headers` | `CaseCanvas > HeaderForensics` | `GET /{id}/evidence` | `HeaderSet`, `ReceivedHop[]` | Treat `raw_headers_all` as source of truth. |
| **URL Intelligence**| `/case/:id/urls` | `CaseCanvas > URLForensics` | `GET /{id}/evidence` | `URLRecord[]`, `LightURLNet` | Automatically defang all URLs. |
| **Geo/Infra Tab** | `/case/:id/geo` | `CaseCanvas > GeoMapViewer` | `GET /{id}` (`geolocation`) | `GeoLocationSummary[]` | Disclaim that GeoIP is infrastructure, not person. |
| **Attachments** | `/case/:id/attachments`| `CaseCanvas > AttachmentLab` | `GET /{id}/evidence` | `AttachmentRef[]` | Flag magic-byte vs extension mismatches. |
| **Historical Tab** | `/case/:id/history` | `CaseCanvas > HistoricalPanel` | `GET /{id}/evidence` | `HistoricalMatch[]` | Strictly isolate past precedent from current facts. |
| **Evidence Explorer**| `/case/:id/evidence` | `CaseCanvas > EvidenceExplorer`| `GET /investigations/{id}/evidence`| `Array<EvidenceItem>` | Enforce hard rule: Model scores are `ML_SIGNAL`. |
| **Forensic Report** | `/case/:id/report` | `CaseCanvas > ForensicReport` | `GET /investigations/{id}/report` | `ForensicReport` | Provide client-side `@media print` PDF styles. |
| **AI Copilot** | Contextual Drawer| `WorkspaceShell > CopilotDrawer` | Client Evidence Engine | `EvidenceItem[]`, `groq_narrative` | Ground all answers in Evidence IDs; zero mutations. |
| **Re-investigation**| `/case/:id/diff` | `WorkspaceShell > ReinvestDiff` | `POST /{id}/reinvestigate` | `InvestigationResult` (new run) | Show side-by-side deltas; never mutate original. |
| **Inconclusive** | `/case/:id` | `WorkspaceShell > InconclState` | `GET /investigations/{id}` | `missing_evidence`, `StopReason` | Never display `BENIGN` on resource stops. |

---
*End of Authoritative Specification: `ASHIELDER_FRONTEND_WIREFRAME_SPEC.md`*
