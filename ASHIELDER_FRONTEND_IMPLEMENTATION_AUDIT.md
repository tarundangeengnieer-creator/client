# ASHIELDER — Frontend Implementation Audit & Repository Assessment
## Phase 0: Baseline Codebase Audit, Contract Alignment, Gap Analysis & Phased Implementation Plan
**Smart India Hackathon 2026 | Problem Statement: PS 26106**  
**Document Class:** Phase 0 Codebase Audit & Architectural Gap Assessment  
**Authority Level:** Authoritative Implementation Blueprint Reference  
**Input Grounding:**  
- `ASHIELDER_FRONTEND_PRODUCT_SPEC.md` (Product & UX Authority)  
- `ASHIELDER_FRONTEND_API_INTEGRATION_SPEC.md` (Backend & Data Contract Authority)  
- `ASHIELDER_FRONTEND_WIREFRAME_SPEC.md` (Layout & UI Hierarchy Authority)  
- `ASHIELDER_FRONTEND_ARCHITECTURE.md` (Engineering Architecture Authority)  
**Status:** Audit Approved | Code Base State: Clean Greenfield Skeleton (Ready for Phase 1)  

---

# SECTION 1 — REPOSITORY DISCOVERY & CURRENT STATE

A comprehensive audit of the file system, dependencies, toolchains, and existing source files was conducted.

### 1.1 Repository Manifest & File System Inventory

```
/
├── .env.example                               # Default environment variable template
├── .gitignore                                 # Git exclusion rules (node_modules, dist)
├── ASHIELDER_FRONTEND_PRODUCT_SPEC.md         # Stage 1 UX / Product Specification
├── ASHIELDER_FRONTEND_API_INTEGRATION_SPEC.md # Stage 2 API & Backend Contract Specification
├── ASHIELDER_FRONTEND_WIREFRAME_SPEC.md       # Stage 3 Screen & Component Wireframe Specification
├── ASHIELDER_FRONTEND_ARCHITECTURE.md         # Stage 4 System Architecture Specification
├── bun.lock                                   # Bun package lockfile
├── index.html                                 # HTML5 entry point
├── metadata.json                              # AI Studio applet metadata & permissions
├── package.json                               # npm project manifest & dependencies
├── tsconfig.json                              # TypeScript 5.8 compiler configuration
├── vite.config.ts                             # Vite 6 build configuration & Tailwind v4 plugin
├── public/
│   └── assets/aistudio/                       # Static platform assets
└── src/
    ├── App.tsx                                # Main application root component (Currently Empty Stub)
    ├── main.tsx                               # React 19 DOM entry mount
    ├── index.css                              # Tailwind CSS v4 entry point (@import "tailwindcss";)
    └── contracts/
        └── backend.ts                         # 868-line authoritative backend contract mirror
```

### 1.2 Technology Toolchain & Runtime Environment

| Category | Discovered Technology | Version | Assessment |
| :--- | :--- | :--- | :--- |
| **Runtime / Tooling** | Node.js / Vite | Vite 6.2.3 | **Optimal:** Instant HMR in dev, fast production bundling via `vite build`. |
| **Framework** | React / React-DOM | 19.0.1 | **Optimal:** Latest React release with native concurrent features. |
| **Language** | TypeScript | 5.8.2 | **Optimal:** `strict: true` typechecking via `tsc --noEmit`. |
| **CSS System** | Tailwind CSS v4 | 4.1.14 | **Optimal:** Integrated directly via `@tailwindcss/vite` plugin. |
| **Animation** | Motion (`motion/react`) | 12.23.24 | **Optimal:** Modern, lightweight animation library pre-installed. |
| **Iconography** | Lucide React | 0.546.0 | **Optimal:** Pre-installed; aligns with design system mandate. |
| **Server Capabilities**| Express + TSX + Dotenv | Express 4.21, TSX 4.21 | **Present:** Available for local dev proxying or mock server if required. |
| **AI SDK** | `@google/genai` | 2.4.0 | **Present:** Server-side capability declared in `metadata.json`. |

### 1.3 Baseline Code Inspection
1. **`src/App.tsx`:** Currently a minimal stub returning an empty `<div></div>` (9 lines). Zero legacy or conflicting feature code exists.
2. **`src/main.tsx`:** Standard React 19 root bootstrap mounting `<App />` inside `<StrictMode>`. Clean.
3. **`src/index.css`:** Contains `@import "tailwindcss";`. Clean.
4. **`src/contracts/backend.ts`:** An extensive, highly accurate 868-line TypeScript mirror of the backend Pydantic models (covering `InvestigationResult`, `EvidenceItem`, `ParsedEmail`, `AuthenticationEvidence`, `GeolocationResult`, `ToolsUsed`, `AttackHypothesis`, etc.). This file is a **critical reusable asset** that guarantees 100% contract compliance with `ASHIELDER_FRONTEND_API_INTEGRATION_SPEC.md`.
5. **`index.html`:** Title and OpenGraph meta tags are already configured for ASHIELDER (`ASHIELDER — AI-Powered Email Threat Detection & Forensic Platform`).

---

# SECTION 2 — CURRENT IMPLEMENTATION MATRIX

Assessment of all 21 functional surfaces and subsystem domains against the project specifications:

| Feature / Subsystem Area | Current Status | Relevant Files | Reusable Code Assets | Missing Work & Gaps | Architecture Conflict | Implementation Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Authentication** | **MISSING** | None (`/login` unbuilt) | None | Access key input, session storage, `GET /health` ping, session guard | None | **P0 (Phase 2)** |
| **App Shell** | **MISSING** | `src/App.tsx` (stub) | None | TopBar (48px), NavRail (56px), Active HUD, Global Search, Status Footer | None | **P0 (Phase 2)** |
| **Navigation** | **MISSING** | None | None | Declarative routing tree, deep-link search param synchronization | None | **P0 (Phase 2)** |
| **Case Ingestion** | **MISSING** | None (`/ingest` unbuilt)| None | RFC 822 `.eml` drag-and-drop dropzone, upload progress, file hash validation | None | **P0 (Phase 3)** |
| **Case Inbox** | **MISSING** | None (`/inbox` unbuilt) | None | TanStack Table, density modes (Compact/Std/Preview), filter pills, metrics bar | None | **P0 (Phase 3)** |
| **Quick-Peek Drawer** | **MISSING** | None | None | Spacebar-activated non-destructive inspection drawer over inbox rows | None | **P1 (Phase 3)** |
| **Case Workspace Shell**| **MISSING** | None (`/case/:id`) | None | Workspace container, Level 1 HUD, tab switcher, drawer anchors | None | **P0 (Phase 4)** |
| **2D Metrics & Overview**| **MISSING** | None | None | Orthogonal Risk (0–100) and Confidence (0.0–1.0) cards, key findings, journey | None | **P0 (Phase 4)** |
| **Investigation Stepper**| **MISSING** | None | `src/contracts/backend.ts` | 4-stage pipeline stepper (L0–L3), 4D resource budget meters (latency, tools) | None | **P1 (Phase 4)** |
| **Evidence Explorer** | **MISSING** | None (`/case/:id/evidence`)| `backend.ts` (`EvidenceItem`) | Searchable datatable of all 42+ typed atoms, category filters, provenance view | None | **P0 (Phase 5)** |
| **Evidence Inspector** | **MISSING** | None | None | Slide-over drawer with raw snippet, cryptographic hash, and "Jump to Source" | None | **P0 (Phase 5)** |
| **Header Forensics** | **MISSING** | None (`/case/:id/headers`) | `backend.ts` (`AuthenticationEvidence`) | 5-pillar auth matrix, Received hop visualizer, 1-indexed raw RFC 5322 viewer | None | **P0 (Phase 6)** |
| **URL Intelligence** | **MISSING** | None (`/case/:id/urls`) | `backend.ts` (`LightUrlNetResult`) | Defanged links table (`hxxp://`, `[.]`), homoglyph alert, redirect hop viewer | None | **P0 (Phase 6)** |
| **Infrastructure & Geo**| **MISSING** | None (`/case/:id/geo`) | `backend.ts` (`GeolocationResult`) | ASN details, Tor/VPN classification, offline SVG map with disclaimer | None | **P1 (Phase 7)** |
| **Attachments** | **MISSING** | None (`/case/:id/attachments`)| `backend.ts` (`AttachmentEvidence`) | Static SHA-256 hashes, magic-byte MIME mismatches, entropy visualizer | None | **P1 (Phase 7)** |
| **Historical Context** | **MISSING** | None (`/case/:id/history`)| `backend.ts` (`HistoricalCorrelation`) | Quarantined past campaign matches, blast radius, recurrence timeline | None | **P1 (Phase 7)** |
| **Forensic Reports** | **MISSING** | None (`/case/:id/report`) | None | Court-admissible report document, digital seal card, print engine | None | **P0 (Phase 8)** |
| **AI Copilot Drawer** | **MISSING** | None | None | Evidence-grounded advisory side-panel, citation parser, strict prompt guard | None | **P1 (Phase 9)** |
| **Re-investigation Diff**| **MISSING** | None (`/case/:id/diff`) | `backend.ts` (`ReinvestigationResult`) | Side-by-side split canvas, delta metrics, new/resolved evidence diff | None | **P2 (Phase 10)**|
| **Threat Hunting** | **MISSING** | None (`/hunting`) | None | Local case indicator search (IPs, hashes, domains), cross-case pivot table | None | **P2 (Phase 10)**|
| **System Health & Admin**| **MISSING** | None (`/admin/health`) | None | Tool status grid, pipeline latency monitoring, `GET /health` polling | None | **P2 (Phase 10)**|
| **Error & Degraded UI** | **MISSING** | None | None | First-class INCONCLUSIVE view, 429 countdown, 404 recovery, offline banner | None | **P0 (Phase 2)** |
| **Responsive UI** | **MISSING** | None | None | Breakpoint adaptations: Desktop (3-pane), Laptop, Tablet, Mobile Emergency | None | **P1 (Phase 11)**|

---

# SECTION 3 — CODE QUALITY AUDIT

Because the repository is currently in a pristine, pre-implementation greenfield state, there are zero accumulated legacy defects, broken components, or duplicated libraries:

- **Duplicated Components:** None.
- **Duplicated API Calls:** None.
- **Inconsistent Types:** None. `src/contracts/backend.ts` is the single source of truth for contract types.
- **Hardcoded URLs:** None in codebase.
- **Mock Data / Slop:** None.
- **Dead Code:** None.
- **Unused Dependencies:** Express and tsx exist in `package.json` for potential full-stack server operations; they do not interfere with client Vite bundling.
- **Unsafe HTML Rendering:** None. Zero calls to `dangerouslySetInnerHTML` exist.
- **Unsafe URL Handling:** None. Defanging utility will be established in Phase 1 before any link rendering.
- **Secret Exposure:** None. Zero secrets in client code or `.env.example`.
- **Circular Dependencies:** None.

---

# SECTION 4 — BACKEND CONTRACT AUDIT & COMPATIBILITY CHECK

The contract types in `src/contracts/backend.ts` were systematically audited against `ASHIELDER_FRONTEND_API_INTEGRATION_SPEC.md`.

### 4.1 Schema Verification Results

| Backend Contract | Spec Section | `src/contracts/backend.ts` Status | Field Name Alignment |
| :--- | :--- | :--- | :--- |
| **`InvestigationResult`** | Spec Sec. 3.2 | **100% Match** | `case_id`, `status`, `verdict`, `risk_score`, `confidence`, `tools_used`, `tools_failed`, `iteration_count`, `stop_reason`, `resource_envelope`, `evidence_items` all match perfectly. |
| **`EvidenceItem`** | Spec Sec. 4.1 | **100% Match** | `evidence_id`, `category`, `type`, `source_tool`, `weight`, `confidence`, `provenance`, `timestamp` match. |
| **`AuthenticationEvidence`**| Spec Sec. 5.1 | **100% Match** | `spf`, `dkim`, `dmarc`, `alignment_spf`, `alignment_dkim`, `raw_auth_results_header` match. |
| **`ParsedEmail`** | Spec Sec. 6.1 | **100% Match** | `headers`, `received_hops`, `sender`, `recipient`, `subject`, `date`, `urls`, `attachments` match. |
| **`GeolocationResult`** | Spec Sec. 7.1 | **100% Match** | `ip`, `country`, `country_code`, `city`, `latitude`, `longitude`, `asn`, `asn_organization`, `is_tor_exit`, `is_vpn` match. |
| **`ToolsUsed` & Stop Reasons**| Spec Sec. 8.1 | **100% Match** | All 16 tool identifiers and stop reasons (`CONFIDENCE_TARGET_REACHED`, `BUDGET_EXHAUSTED`, etc.) match. |

### 4.2 Endpoint Mapping Audit
The frontend API client will target these exact endpoints from the API Integration Spec:
- `POST /api/v1/investigations/analyze` (Primary Ingest)
- `GET /api/v1/investigations/{id}` (Case Fetch)
- `GET /api/v1/investigations/{id}/evidence` (Evidence Extraction)
- `GET /api/v1/investigations/{id}/report` (Report Generation)
- `POST /api/v1/investigations/{id}/reinvestigate` (Re-investigation Rerun)
- `POST /api/v1/emails/analyze` (Header & MIME Parsing)
- `GET /health` (Backend Heartbeat)

---

# SECTION 5 — ARCHITECTURE GAP ANALYSIS (KEEP / REFACTOR / REPLACE / CREATE)

Comparison of current repository contents against the target architecture defined in `ASHIELDER_FRONTEND_ARCHITECTURE.md`:

```
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                    ARCHITECTURAL GAP INVENTORY                                    |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
| KEEP (Preserve As-Is):                                                                            |
| • `src/contracts/backend.ts`       -> Maintain as immutable Tier 1 backend contract mirror.      |
| • `vite.config.ts`                 -> Maintain Vite 6 + Tailwind v4 configuration.                |
| • `tsconfig.json`                 -> Maintain strict TypeScript compiler settings.              |
| • `index.html`                     -> Keep optimized title, viewport, and meta tags.              |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
| REFACTOR / EXPAND:                                                                                |
| • `.env.example`                   -> Declare `VITE_API_BASE_URL` and `VITE_SLA_TARGET_MS`.       |
| • `src/index.css`                  -> Add SOC dark-slate CSS variables and scrollbar styles.      |
| • `src/App.tsx`                    -> Replace stub with RootProvider, Router, and AppShell.       |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
| CREATE (New Architecture Layers):                                                                 |
| 1. API Client Layer:               `src/api/client.ts`, `endpoints.ts`, `errors.ts`               |
| 2. Domain & Mappers Layer:         `src/domain/case.ts`, `evidence.ts`, `mappers/*.ts`            |
| 3. State Management:               `src/stores/auth-store.ts`, `ui-store.ts`, `cases-store.ts`    |
| 4. Security & Sanitization Lib:    `src/lib/defang.ts`, `sanitization.ts`, `formatters.ts`       |
| 5. Shared Design System:           `src/components/ui/*`, `feedback/*`, `layout/*`                |
| 6. Feature Modules (All 17):       `src/features/auth`, `cases`, `workspace`, `headers`, etc.     |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
```

---

# SECTION 6 — BUILD & TEST VALIDATION BASELINE

Verification of the repository's baseline health before starting code implementation:

### 6.1 Validation Results
- **Install Validation:** All packages resolved and clean in container (`bun.lock` / `node_modules`).
- **TypeScript Typecheck (`tsc --noEmit`):** PASSED with **0 errors**.
- **Lint Check (`npm run lint`):** PASSED with **0 warnings / 0 errors**.
- **Production Build (`npm run build`):** PASSED in **426ms** producing static assets in `dist/`.

---

# SECTION 7 — PHASED IMPLEMENTATION ROADMAP

A risk-managed, dependency-ordered 12-phase execution roadmap designed for continuous verification:

```
[Phase 1: Foundations & Core Libs]
               │
               ▼
[Phase 2: App Shell & Authentication]
               │
               ▼
[Phase 3: Case Ingestion & Triage Inbox]
               │
               ▼
[Phase 4: Case Workspace HUD & Overview]
               │
               ▼
[Phase 5: Evidence Explorer & Inspector]
               │
               ▼
[Phase 6: Header Forensics & URL Intel]
               │
               ▼
[Phase 7: Infrastructure, Geo & Attachments]
               │
               ▼
[Phase 8: History & Forensic Reports]
               │
               ▼
[Phase 9: AI Copilot Advisory Dock]
               │
               ▼
[Phase 10: Re-investigation & Threat Hunting]
               │
               ▼
[Phase 11: System Health, Settings & Responsive Polish]
               │
               ▼
[Phase 12: Final Hardening & Verification]
```

---

### Phase 1: Foundations, Design System Primitives & API Client
- **Files to Create:**
  - `src/lib/utils.ts` (Tailwind clsx/twMerge helper)
  - `src/lib/defang.ts` (RFC-compliant URL & IP defanger: `hxxp://`, `[.]`)
  - `src/lib/formatters.ts` (Timestamps, latencies, byte formats)
  - `src/lib/sanitization.ts` (Safe text escaping & PII maskers)
  - `src/api/endpoints.ts` (API route constants)
  - `src/api/errors.ts` (Normalized domain error classes)
  - `src/api/client.ts` (Fetch transport, `X-API-Key`, `X-Request-ID`, timeouts, status handling)
  - `src/domain/case.ts`, `src/domain/evidence.ts`, `src/domain/hop.ts` (Domain view models)
  - `src/domain/mappers/case-mapper.ts`, `src/domain/mappers/evidence-mapper.ts`
  - `src/components/ui/Badge.tsx`, `Button.tsx`, `Card.tsx`, `Tooltip.tsx`, `Modal.tsx`
- **Dependencies:** Pre-installed packages (`lucide-react`, `motion`).
- **Acceptance Criteria:** Full unit tests for URL defanging, error normalizer, and domain mappers pass cleanly.

---

### Phase 2: Application Shell, Authentication & Global Routing
- **Files to Create / Modify:**
  - `src/stores/auth-store.ts` (API key session management, analyst profile)
  - `src/stores/ui-store.ts` (Active drawers, modals, keyboard shortcuts)
  - `src/components/layout/AppTopBar.tsx` (48px top bar, Active Case HUD, ping indicator)
  - `src/components/layout/NavigationRail.tsx` (56px fixed left rail with tooltips)
  - `src/components/layout/Breadcrumbs.tsx` (32px sticky sub-header)
  - `src/components/layout/GlobalStatusBar.tsx` (24px SLA & latency footer)
  - `src/components/layout/AppShell.tsx` (Master container with zero layout shift)
  - `src/features/auth/LoginPage.tsx` (`X-API-Key` input, health ping verification)
  - `src/components/feedback/ErrorBoundaries.tsx`, `NotFoundPage.tsx`
  - `src/App.tsx` (Integrated router and shell)
- **Backend APIs:** `GET /health` with `X-API-Key`.
- **Acceptance Criteria:** Analyst can input API key, authenticate against backend, and navigate the application shell.

---

### Phase 3: Case Ingestion & Triage Inbox
- **Files to Create:**
  - `src/stores/cases-store.ts` (Local case repository, active selection)
  - `src/features/ingestion/DropzonePage.tsx` (RFC 822 `.eml` drag-and-drop ingestion)
  - `src/features/ingestion/UploadProgressModal.tsx` (Multi-stage upload progress)
  - `src/features/cases/CaseInboxPage.tsx` (Triage table, metrics bar, filter pills)
  - `src/features/cases/CaseTableRow.tsx` (Density modes: Compact/Standard/Preview)
  - `src/features/cases/QuickPeekDrawer.tsx` (Spacebar-triggered 440px side-peek)
- **Backend APIs:** `POST /api/v1/investigations/analyze`.
- **Acceptance Criteria:** Dropping an `.eml` dispatches analysis, commits to case queue, and allows instant keyboard triage (`J`/`K`/`Space`).

---

### Phase 4: Case Workspace HUD, Overview & Investigation Journey
- **Files to Create:**
  - `src/features/workspace/CaseWorkspacePage.tsx` (Master container, Level 1 HUD, tab nav)
  - `src/features/workspace/VerdictBanner.tsx` (Verdict announcement, stop reason badge)
  - `src/features/overview/OverviewTab.tsx` (Landing view with 2D metrics)
  - `src/features/overview/RiskScoreCard.tsx` (0–100 threat severity, contribution list)
  - `src/features/overview/ConfidenceMeterCard.tsx` (0.0–1.0 completeness, penalty breakdown)
  - `src/features/overview/KeyFindingsList.tsx` (Ranked findings with `[EVD-***]` chips)
  - `src/features/overview/JourneyStepper.tsx` (Chronological L0–L3 stepper, 4D budget meters)
- **Backend APIs:** `GET /api/v1/investigations/{id}`.
- **Acceptance Criteria:** Risk and Confidence rendered in separate cards; Journey Stepper renders L0–L3 tool execution accurately.

---

### Phase 5: Evidence Explorer & Contextual Evidence Inspector
- **Files to Create:**
  - `src/features/evidence/EvidenceExplorerPage.tsx` (42+ evidence atom datatable)
  - `src/features/evidence/EvidenceCategoryFilter.tsx` (11 category filter pills)
  - `src/features/evidence/EvidenceInspectorDrawer.tsx` (380px drawer, provenance, hash)
  - `src/components/ui/EvidenceChip.tsx` (Universal `[EVD-***]` interactive chip)
- **Backend APIs:** `GET /api/v1/investigations/{id}/evidence`.
- **Acceptance Criteria:** Clicking any `[EVD-***]` chip in the app opens the inspector drawer showing raw provenance and byte offsets.

---

### Phase 6: Header Forensics & URL Intelligence
- **Files to Create:**
  - `src/features/headers/HeaderForensicsPage.tsx` (Split view container)
  - `src/features/headers/AuthMatrixCard.tsx` (5-pillar SPF, DKIM, DMARC, Alignment, ARC)
  - `src/features/headers/ReceivedHopGraph.tsx` (Chronological transit hop graph with latency deltas)
  - `src/features/headers/RawHeaderViewer.tsx` (1-indexed syntax-highlighted RFC 5322 viewer)
  - `src/features/urls/UrlIntelligencePage.tsx` (Defanged URL table, homoglyph alerts, LightURLNet scores)
- **Backend APIs:** `POST /api/v1/emails/analyze`, `GET /{id}/evidence`.
- **Acceptance Criteria:** 1-click jump from auth matrix to exact header byte line; all URLs strictly defanged.

---

### Phase 7: Infrastructure, GeoIP & Attachments Forensics
- **Files to Create:**
  - `src/features/infrastructure/InfrastructurePage.tsx` (ASN, Tor/VPN classification, relay IP intel)
  - `src/features/infrastructure/GeoEstimateMap.tsx` (Offline SVG world map with estimate disclaimer)
  - `src/features/attachments/AttachmentsPage.tsx` (Static SHA-256 hashes, magic-byte MIME mismatches, entropy visualizer)
- **Backend APIs:** `InvestigationResult.geolocation`, `ParsedEmail.attachments`.
- **Acceptance Criteria:** Explicit "IP Estimate != Attacker" disclaimer; attachments rendered with binary execution disabled.

---

### Phase 8: Quarantined Historical Context & Forensic Reports
- **Files to Create:**
  - `src/features/history/HistoricalContextPage.tsx` (Quarantined past campaign matches, blast radius)
  - `src/features/reports/ForensicReportPage.tsx` (Court-admissible report document, print controls)
  - `src/features/reports/DigitalSealCard.tsx` (Cryptographic verification seal, SHA-256 hash)
- **Backend APIs:** `GET /{id}/report`, `GET /{id}/evidence` (HISTORICAL).
- **Acceptance Criteria:** Historical context visually cordoned off; report view formats cleanly for A4/letter print.

---

### Phase 9: AI Copilot Advisory Side-Dock
- **Files to Create:**
  - `src/features/copilot/CopilotDrawer.tsx` (420px contextual advisory drawer)
  - `src/features/copilot/CopilotMessageList.tsx` (Evidence-grounded dialogue, citation renderer)
  - `src/features/copilot/PromptSuggestions.tsx` (Standard forensic queries)
- **Backend APIs:** Server-side reasoning proxy citing loaded `EvidenceItem` atoms.
- **Acceptance Criteria:** AI response visually distinct from deterministic findings; citations link directly to `[EVD-***]` atoms; zero direct Groq browser calls.

---

### Phase 10: Re-investigation Diff, Threat Hunting & System Health
- **Files to Create:**
  - `src/features/reinvestigate/ReinvestigationPage.tsx` (Side-by-side run diff canvas, delta badges)
  - `src/features/hunting/ThreatHuntingPage.tsx` (Cross-case indicator pivot table)
  - `src/features/system-health/SystemHealthPage.tsx` (Tool execution latency, error counts, ping monitor)
- **Backend APIs:** `POST /{id}/reinvestigate`, `GET /health`.
- **Acceptance Criteria:** Re-investigation preserves baseline run #1; Threat hunting pivots cleanly on IPs/hashes.

---

### Phase 11: Settings, First-Class INCONCLUSIVE & Responsive Polish
- **Files to Create / Modify:**
  - `src/features/settings/SettingsPage.tsx` (Local preferences, PII masking rules)
  - `src/features/workspace/InconclusiveRecoveryView.tsx` (Missing evidence checklist, password unlock)
  - Responsive breakpoint tests and layout hardening across desktop, laptop, tablet, and mobile.
- **Acceptance Criteria:** Cases with confidence < 0.70 render the dedicated INCONCLUSIVE recovery checklist.

---

### Phase 12: Final Hardening, Security Audit & E2E Validation
- **Activities:**
  - Content Security Policy (CSP) verification.
  - End-to-end user workflows validated via automated tests.
  - Performance audit: initial bundle < 350 KB, zero CLS.
- **Acceptance Criteria:** 100% clean production build and test execution with zero regressions.

---

# SECTION 8 — RISK REGISTER

Forensic, operational, and architectural risks categorized by severity:

| Risk ID | Severity | Category | Risk Description | Mitigating Architectural Control |
| :--- | :--- | :--- | :--- | :--- |
| **RSK-01** | **P0** | **Security** | Weaponized URLs in email bodies clicked by SOC analysts during investigation. | Mandatory client-side URL defanging (`hxxp://`, `[.]`); native click handlers stripped. |
| **RSK-02** | **P0** | **Security** | Malicious script execution from raw email HTML bodies. | Email HTML never rendered in native DOM; rendered as stripped plain text or in sandboxed iframes. |
| **RSK-03** | **P0** | **Security** | Accidental leakage of third-party API keys (Groq, VT) into client bundle. | Absolute prohibition of server secrets in client code; all AI reasoning proxied server-side. |
| **RSK-04** | **P0** | **Data Integrity** | Collapsing Risk (0–100) and Confidence (0.0–1.0) into a single percentage. | Strict physical separation into two distinct visual cards; composite calculation barred. |
| **RSK-05** | **P1** | **Attribution** | Analyst misinterpreting estimated GeoIP server location as physical threat actor. | Prominent, persistent disclaimer badge displayed directly on all map visualizations. |
| **RSK-06** | **P1** | **UX / Workflow**| External tool timeout (e.g., WHOIS) crashing entire investigation workspace. | Normalized error boundaries per feature tab; partial telemetry rendered with DEGRADED badge. |
| **RSK-07** | **P1** | **Performance** | High-throughput case inbox freezing during rapid keyboard navigation (`J`/`K`). | Headless TanStack Table with zero DOM styling overhead; memoized row cells. |
| **RSK-08** | **P2** | **Forensics** | Re-investigation run overwriting baseline evidence from original ingestion. | Immutable run diff model: Run #1 preserved as baseline; Run #2 rendered in comparative split. |

---

# SECTION 9 — RECOMMENDED FIRST CODING PHASE

### Phase 1: Foundations, Design System Primitives & API Client Layer
Phase 1 establishes the foundational bedrock upon which all forensic views depend:
1. **Utility Libraries:** Establish RFC-compliant URL defanger (`src/lib/defang.ts`), formatters, and sanitizers.
2. **API Client Layer:** Implement unified `src/api/client.ts` with `X-API-Key` session injection, `X-Request-ID` generation, and normalized error mapping.
3. **Domain Adapters:** Implement mappers converting `backend.ts` contracts into immutable frontend domain models.
4. **Design System Primitives:** Create monochromatic, dark-slate UI primitives (`Badge`, `Button`, `Card`, `Tooltip`, `EvidenceChip`).
5. **Validation:** Execute unit tests on all utilities and mappers to guarantee 100% mathematical and contract correctness before UI construction.
