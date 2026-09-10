# ASHIELDER — Frontend Engineering Architecture Specification
## Technical Architecture, System Boundaries, State Topology & Implementation Blueprint
**Smart India Hackathon 2026 | Problem Statement: PS 26106**  
**Document Class:** Frontend Engineering Architecture Specification  
**Authority Level:** Authoritative Stage 4 Pre-Implementation Specification  
**Input Grounding:** `ASHIELDER_FRONTEND_PRODUCT_SPEC.md` (Product/UX), `ASHIELDER_FRONTEND_API_INTEGRATION_SPEC.md` (Backend/Data), `ASHIELDER_FRONTEND_WIREFRAME_SPEC.md` (UI/Wireframe)  
**Status:** Approved for Immediate Engineering Execution | Target Release: Production v1.0  

---

# SECTION 1 — ARCHITECTURE GOAL & SYSTEM BOUNDARIES

### 1.1 Architectural Purpose
The goal of the ASHIELDER frontend architecture is to provide an immutable, deterministic, high-velocity digital forensic workstation for Security Operations Center (SOC) L1/L2/L3 analysts, incident responders, and forensic examiners. 

The frontend functions as:
1. **A Contract-Driven Forensic Workstation:** Strictly bounded by backend schema contracts with zero optimistic data invention.
2. **A Reactive Investigation UI:** Translating multi-stage pipeline executions, 4D budget consumption, and tool lifecycle states into zero-layout-shift views.
3. **An Evidence Visualization Layer:** Rendering atomic, immutable evidence items (`EVD-***`), network transit topologies, and cryptographic verification matrices with one-click provenance jump.
4. **A Controlled AI Copilot Interface:** Providing an evidence-grounded advisory side-panel strictly barred from authoritative verdict assignment or unvetted backend mutation.

### 1.2 The Absolute System Boundary
The frontend is strictly decoupled from forensic computation and risk derivation. Under no circumstances does the browser execute threat classification, evidence synthesis, or heuristic scoring.

```
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                     SYSTEM BOUNDARY TOPOLOGY                                      |
+───────────────────────────────────────────────────┬───────────────────────────────────────────────+
| BACKEND RESPONSIBILITY (Authoritative Engine)     | FRONTEND RESPONSIBILITY (Workstation Client)  |
+───────────────────────────────────────────────────┼───────────────────────────────────────────────+
| • RFC 5322 Parsing & MIME Boundary Dissection     | • Forensic Presentation & Information Density |
| • Evidence Generation & Cryptographic Hashing     | • Analyst Navigation & Deep-Link State Sync   |
| • Deterministic Rules & Heuristic Penalties       | • Multi-Parameter Filtering & Search Indexing |
| • ML Threat Intelligence (DistilBERT, LightURLNet)| • Graph, Relay Hop & Geospatial Visualization|
| • Adaptive Investigation Orchestration (L0 -> L3) | • Evidence Inspector & Byte-Level Jump        |
| • Risk, Confidence & Verdict Computation          | • Case Triage Workflow & Disposition Actions  |
| • Historical Correlation & Blast Radius DB        | • State Rendering & Loading/Error Boundaries  |
| • LLM Groq Orchestration & Prompt Hardening       | • Safe, Defanged API Interaction              |
| • Court-Admissible Forensic Audit Trail & PDF     | • Zero-Trust Execution & Client Sanitization  |
+───────────────────────────────────────────────────┴───────────────────────────────────────────────+
```

### 1.3 Anti-Goals (What the Frontend Must NEVER Become)
- **NOT a Second Backend:** The client will never parse raw RFC 5322 byte streams to recompute DKIM canonicalization or evaluate SPF macros locally.
- **NOT a Second Risk Engine:** The client will never adjust risk scores, evaluate heuristic penalties, or recalculate confidence values from raw findings.
- **NOT an Autonomous AI Agent:** The client will never run LLM inference in the browser, call third-party AI APIs directly, or execute automated remediation actions based on unvetted narrative text.
- **NOT a Monolithic Data Processor:** The client will never perform cross-tenant data aggregation or heavy graph clustering client-side.

---

# SECTION 2 — TECHNOLOGY DECISIONS & SELECTION JUSTIFICATION

Every dependency in the ASHIELDER client stack is selected based on forensic performance requirements, zero-trust constraints, and strict runtime predictability.

| Layer | Selected Technology | Version | Rationale Relevant to ASHIELDER | Evaluated & Rejected Alternatives |
| :--- | :--- | :--- | :--- | :--- |
| **Core Framework** | **React + Vite** | React 19.x<br>Vite 6.x | Near-instant HMR during local dev, single-bundle distribution (`dist/`), zero server-side hydration mismatches for static forensic logs, lightning-fast client execution in air-gapped or sandboxed SOC networks. | **Next.js (App Router):** Server Components add unnecessary complexity and latency for a dedicated single-page SOC workstation that communicates directly with an external FastAPI backend. |
| **Language** | **TypeScript** | 5.8.x | Strict null checking (`strict: true`), absolute contract parity with backend Pydantic models via generated interfaces, compile-time schema validation. | **JavaScript / JSDoc:** Unacceptable risk of runtime `undefined` property crashes during live cyber incident triage. |
| **Styling System** | **Tailwind CSS** | 4.x | Utility-first, zero runtime CSS overhead, mathematically locked 4px/8px spacing grid, deterministic slate/zinc dark palette matching SOC standards without visual "AI slop". | **CSS-in-JS (Emotion/Styled):** Runtime style injection causes micro-freezes during high-throughput case table scrolling. |
| **Animation Engine** | **Motion (`motion/react`)** | 12.x | Sub-pixel hardware-accelerated drawer slide-overs, tab transitions, and layout morphing without Cumulative Layout Shift (CLS). | **Framer Motion (Legacy):** Replaced by lightweight modern `motion` package. |
| **Iconography** | **Lucide React** | 0.546.x | Strict compliance with framework rules. Clean, functional, monochromatic vector glyphs representing security primitives (Shield, Terminal, Key, FileCheck). | **Custom SVGs / FontAwesome:** Custom SVGs bloat bundle; FontAwesome imports unused icon bloat. |
| **State Management** | **Zustand** | 5.x | Minimal footprint (<1.5 KB), zero boilerplate, outside-React selector access for high-speed table triage (`J`/`K` keys), unopinionated client/UI store. | **Redux Toolkit:** Excessive boilerplate for client UI toggles; **Context API:** Triggers full-canvas re-renders on active drawer selection. |
| **Server State / Cache** | **TanStack Query (React Query)**| 5.x | Deterministic query caching, stale-while-revalidate, automatic retry cancellation with `AbortController`, mutation lifecycle for re-investigation. | **SWR:** Lacks robust multi-key query invalidation and granular garbage collection required for forensic run diffing. |
| **Table Engine** | **TanStack Table (React Table)**| 8.x | Headless, zero-DOM styling injection, full control over keyboard navigation, multi-column sorting, row selection, and density modes (Compact/Standard/Preview). | **AG-Grid / Material React Table:** Heavy DOM footprint, bundled styling clashes with dark SOC workstation requirements. |
| **Data Visualization** | **D3.js + Recharts** | D3 7.x<br>Recharts 2.x | Recharts for responsive SVG timeline metrics and 4D resource radar charts; D3 DAG utilities for layout calculations of Received Hop routing chains. | **Chart.js:** Canvas-based rendering hampers crisp SVG text inspection and DOM accessibility. |
| **Geospatial Mapping** | **Lightweight SVG / Leaflet** | Leaflet 1.9.x | Offline-capable tile rendering, strict IP-estimate bounding box rendering, zero external commercial tracking telemetry. | **Google Maps / Mapbox GL:** Requires external billing keys, violates air-gapped SOC network deployment policies. |
| **Raw Text Viewer** | **PrismJS / Custom Pre** | Prism 1.29.x | High-throughput 1-indexed raw RFC 5322 header viewer with syntax highlighting and line anchor jumping (`#L42`) without DOM freezing. | **Monaco Editor:** 35MB+ bundle footprint is excessive for read-only forensic log inspection. |
| **Real-time Engine** | **Short-Polling (`TanStack Query`)**| Built-in | Backend is purely synchronous REST (`POST /analyze` blocks until L0–L2 completion; `reinvestigate` returns in ~2s). Polling is only scheduled for long runs. | **WebSocket / SSE:** **STRICTLY PROHIBITED.** The backend API specification does not implement WebSocket or SSE protocols. |
| **Testing & Quality** | **Vitest + Testing Library + Playwright** | Vitest 3.x<br>Playwright 1.50.x | Vitest for instant unit test execution, React Testing Library for component contract tests, Playwright for end-to-end evidence drill-down workflows. | **Jest / Cypress:** Vitest shares Vite config; Playwright handles multi-tab and deep-link browser automation seamlessly. |

---

# SECTION 3 — ARCHITECTURE STYLE & SYSTEM BOUNDARIES

The application adopts a **Modular Feature-Oriented Clean Architecture** layered vertically to enforce strict unidirectional data flow and prevent circular dependencies.

### 3.1 High-Level Architecture Topology

```
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                    APPLICATION SHELL (Global HUD)                                 |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
                                                  │
                                                  ▼
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                  ROUTER & PERMISSION GUARDS                                       |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
          │                                       │                                       │
          ▼                                       ▼                                       ▼
+───────────────────+                   +───────────────────+                   +───────────────────+
|  FEATURE MODULES  |                   |  FEATURE MODULES  |                   |  FEATURE MODULES  |
|  (Case Workspace) |                   |  (Evidence Engine)|                   |  (Header Forensics|
+───────────────────+                   +───────────────────+                   +───────────────────+
          │                                       │                                       │
          └───────────────────────────────────────┼───────────────────────────────────────┘
                                                  ▼
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                               DOMAIN / VIEW MODELS & CONTRACT ADAPTERS                             |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
                                                  │
                                                  ▼
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                 STATE MANAGEMENT (Dual Boundary)                                  |
|          Server State (TanStack Query Cache)    │    Client/UI State (Zustand Stores)             |
+─────────────────────────────────────────────────┼─────────────────────────────────────────────────+
                                                  │
                                                  ▼
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                               API CLIENT TRANSPORT & RESILIENCE LAYER                             |
|          [X-API-Key Auth]  |  [X-Request-ID]  |  [AbortController]  |  [Error Normalizer]         |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
                                                  │
                                                  ▼
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                    FASTAPI BACKEND RUNTIME                                        |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
```

### 3.2 Core Architectural Boundaries
1. **App Shell:** Enforces persistent workspace geometry (TopBar 48px, Navigation Rail 56px, Breadcrumb 32px, Footer 24px). It owns global search dispatch, backend ping telemetry, and active case indicators.
2. **Routing:** Maps deterministic path structures to lazy-loaded feature boundaries with route guards, error boundaries, and loading skeletons.
3. **Feature Modules:** Self-contained domains owning their local components, presentation hooks, and visual transforms. Modules cannot import internal private files of other modules.
4. **Domain Models & Adapters:** Normalizes backend JSON responses into frozen, type-safe frontend entities, resolving byte indices and assigning display classifications.
5. **API Client:** Singular gatekeeper for all network traffic. Injects authentication headers, attaches UUIDv4 request IDs, enforces timeouts, and normalizes HTTP status codes into domain errors.

---

# SECTION 4 — PROJECT & FOLDER STRUCTURE

The directory hierarchy strictly isolates feature domains, technical foundations, and contract definitions.

```
src/
├── app/                                 # Global Shell & Application Initialization
│   ├── App.tsx                          # Root component with providers & shell layout
│   ├── main.tsx                         # Entry point rendering App into #root
│   ├── routes.tsx                       # Complete declarative route definition tree
│   └── index.css                        # Tailwind CSS imports & base theme variables
├── api/                                 # Unified API Client Transport
│   ├── client.ts                        # Configured Fetch wrapper, interceptors, timeouts
│   ├── endpoints.ts                     # Explicit endpoint path constants
│   ├── errors.ts                        # Normalized domain error classes
│   └── request-id.ts                    # UUIDv4 request ID generation and tracing
├── contracts/                           # Pure Backend Type Mirrors (No Client Modifications)
│   ├── backend.ts                       # Direct TypeScript export of backend Pydantic models
│   └── index.ts                         # Re-exports with type aliases
├── domain/                              # Frontend Domain Models & Contract Adapters
│   ├── case.ts                          # Case summary view models & triage classifications
│   ├── evidence.ts                      # Evidence atom model, categories, provenance helpers
│   ├── investigation.ts                 # Investigation result, journey step, 4D budget
│   ├── hop.ts                           # Received transit hop node & latency calculation
│   └── mappers/                         # Pure adapter functions transforming backend -> domain
│       ├── case-mapper.ts               # InvestigationResult -> CaseViewModel
│       ├── evidence-mapper.ts           # EvidenceItem -> NormalizedEvidenceEntity
│       └── hop-mapper.ts                # ParsedEmail.received_hops -> VisualHopGraph
├── features/                            # Feature Modules (Autonomous Domain Slices)
│   ├── auth/                            # P-01: API Key & Session Verification
│   ├── ingestion/                       # P-02: .EML Dropzone & Initial Pipeline Dispatch
│   ├── cases/                           # P-03, P-04: Triage Inbox & Quick-Peek Drawer
│   ├── workspace/                       # P-05: Case Master Container & HUD Level 1
│   ├── overview/                        # P-06: 2D Metrics, Key Findings, Journey Stepper
│   ├── headers/                         # P-07: 5-Pillar Auth Matrix & RFC 5322 Viewer
│   ├── urls/                            # P-08: URL Dissection & Defanged Intel
│   ├── infrastructure/                  # P-09: ASN, GeoIP Map & Relay Forensics
│   ├── attachments/                     # P-10: File Hashes, Magic Mismatches & Entropy
│   ├── history/                         # P-11: Quarantined Correlation & Recipient Blast
│   ├── evidence/                        # P-12: Full Evidence Explorer Datatable & Inspector
│   ├── reports/                         # P-13: Court-Admissible Interactive Report & Export
│   ├── copilot/                         # P-14: Evidence-Grounded Advisory Copilot Drawer
│   ├── reinvestigate/                   # P-15: Run Diffing & Delta Visualization
│   ├── hunting/                         # P-16: Global Indicator Pivot & Cross-Case Match
│   ├── system-health/                   # P-17: Backend Engine & Tool Telemetry
│   └── settings/                        # P-18: Local Preferences & Workstation Configuration
├── components/                          # Shared Design System Primitives (Domain-Agnostic)
│   ├── ui/                              # Atomic buttons, inputs, dialogs, badges, tooltips
│   ├── feedback/                        # Skeletons, empty states, error alerts, banners
│   ├── layout/                          # AppTopBar, NavigationRail, Breadcrumbs, DrawerShell
│   └── data-display/                    # CodeViewer, DefangedText, MetricCard, ProgressGauge
├── stores/                              # Global Client/UI State (Zustand)
│   ├── auth-store.ts                    # API key session, analyst profile, workstation mode
│   ├── ui-store.ts                      # Drawer open/close, active tooltips, global search
│   └── table-store.ts                   # Inbox density mode, column visibility, active selection
├── hooks/                               # Cross-Feature Global Hooks
│   ├── use-keyboard-shortcuts.ts        # Global key listener (J, K, Space, Enter, Ctrl+K)
│   ├── use-media-query.ts               # Responsive breakpoint observer
│   └── use-clipboard.ts                 # Safe clipboard write with analyst feedback
├── lib/                                 # General Utilities & Defanging Tools
│   ├── defang.ts                        # RFC-compliant URL & IP defanger (hxxp, [.])
│   ├── formatters.ts                    # Byte size, microsecond latency, ISO timestamp
│   ├── sanitization.ts                  # Strict HTML strip & safe text sanitizers
│   └── utils.ts                         # Tailwind clsx/twMerge utility (cn)
└── tests/                               # Comprehensive Test Suites
    ├── unit/                            # Pure function & mapper unit tests
    ├── components/                      # UI primitive & evidence chip tests
    ├── integration/                     # Feature hook & query lifecycle tests
    └── e2e/                             # Playwright automated forensic workflows
```

### 4.1 Dependency Direction Rules
To eliminate circular dependencies and ensure unidirectional modularity:
- `components/ui` $\rightarrow$ May import nothing outside `lib/` and external icons.
- `domain/` $\rightarrow$ May import only `contracts/` and pure math/string utilities.
- `api/` $\rightarrow$ May import `contracts/` and `domain/`.
- `features/*` $\rightarrow$ May import `components/`, `domain/`, `api/`, `stores/`, `lib/`.
- **Prohibited Dependency:** A feature module (`features/A`) is **strictly forbidden** from importing components or private hooks from another feature module (`features/B`). Common logic must be elevated to `domain/`, `components/`, or `stores/`.

---

# SECTION 5 — FEATURE MODULE ARCHITECTURE

Every feature module is encapsulated with explicit boundaries, owning its presentation, data hooks, and test fixtures.

```
features/<feature-name>/
├── api/               # TanStack Query query/mutation definitions for this feature
├── components/        # Feature-private visual components
├── hooks/             # Feature-specific state machines or keyboard adapters
├── types/             # Feature-specific view models or display interfaces
├── index.ts           # Public API barrier (exports ONLY routes & embeddable cards)
└── __tests__/         # Feature unit & integration test specs
```

### 5.1 Comprehensive Feature Specification Matrix

| Module Name | Purpose | Assigned Routes | Key Components | Data Hooks / API Calls | Primary Types | State Ownership |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`auth`** | API Key validation, session boot, header injection. | `/login` | `ApiKeyInput`, `EndpointSelector`, `SessionGuard` | `useVerifyApiKey`, `GET /health` | `AuthSession`, `ApiKeyStatus` | Session storage, auth error message |
| **`ingestion`** | RFC 822 `.eml` dropzone, file validation, execution trigger. | `/ingest` | `DropzoneArea`, `FileValidator`, `UploadProgressBar` | `useIngestEmail`, `POST /api/v1/investigations/analyze` | `IngestPayload`, `UploadState` | Drag-active, upload progress, file hash |
| **`cases`** | Triage queue, multi-column filtering, quick-peek panel. | `/inbox` | `CaseInboxTable`, `QuickPeekDrawer`, `QueueMetricsBar` | `useCasesQueue`, `useCaseQuickPeek` | `CaseViewModel`, `TableDensity` | Active row index, filter pills, drawer state |
| **`workspace`** | Case Master Container, Level 1 HUD, Tab Navigation. | `/case/:id` | `CaseMasterHUD`, `VerdictBanner`, `ForensicTabNav` | `useCaseDetails`, `GET /investigations/{id}` | `InvestigationResult`, `ActiveTab` | Tab selection, active case ID |
| **`overview`** | Executive triage, 2D metrics, findings list, journey stepper. | `/case/:id/overview`| `RiskConfidenceHUD`, `KeyFindingsList`, `JourneyStepper` | `useInvestigationJourney`, `GET /{id}/evidence` | `KeyFindingItem`, `JourneyStep` | Stepper expanded node, finding filter |
| **`headers`** | 5-pillar auth matrix, Received hop graph, raw RFC 5322 viewer.| `/case/:id/headers` | `AuthMatrixCard`, `ReceivedHopGraph`, `RawHeaderViewer` | `useHeaderForensics`, `POST /emails/analyze` | `AuthResult`, `HopNode`, `RawLine` | Selected hop index, view mode (Split/Raw) |
| **`urls`** | Defanged links, homoglyphs, redirect chains, LightURLNet scores.| `/case/:id/urls` | `UrlDefangedTable`, `HomoglyphAlert`, `LightUrlNetScore` | `useUrlEvidence`, `GET /{id}/evidence` (URL) | `UrlEvidenceItem`, `RedirectHop` | Defanged copy confirmation, expanded URL |
| **`infrastructure`**| Origin IP ASN routing, Tor/VPN classification, GeoIP estimate. | `/case/:id/geo` | `AsnDetailsCard`, `TorVpnClassifier`, `GeoEstimateMap` | `useGeoIntel`, `InvestigationResult.geolocation` | `GeoIntel`, `AsnInfo`, `RelayIp` | Selected IP node, map zoom/pan coordinate |
| **`attachments`** | Static SHA-256 hashes, magic-byte mismatches, entropy gauges. | `/case/:id/attachments`| `AttachmentList`, `MagicMismatchAlert`, `EntropyGauge` | `useAttachmentForensics`, `ParsedEmail` | `AttachmentItem`, `EntropyScore` | Selected attachment index, hash copy state |
| **`history`** | Quarantined correlation matches, past attacks, blast radius. | `/case/:id/history` | `QuarantineNotice`, `RecipientBlastCard`, `ClusterTimeline` | `useHistoricalContext`, `GET /{id}/evidence` | `HistoryCluster`, `BlastRadius` | Quarantined acknowledged, filter timeframe |
| **`evidence`** | Searchable datatable of all 42+ typed `EvidenceItem` atoms. | `/case/:id/evidence`| `EvidenceDataTable`, `EvidenceInspectorDrawer`, `EvidenceChip` | `useCaseEvidence`, `GET /{id}/evidence` | `EvidenceItem`, `ProvenanceRecord` | Search query, selected evidence atom |
| **`reports`** | Court-admissible interactive report & cryptographic print engine.| `/case/:id/report` | `ReportDocument`, `DigitalSealCard`, `PrintControls` | `useCaseReport`, `GET /{id}/report` | `InvestigationReport`, `AuditSeal` | Print-preview mode, signature verified |
| **`copilot`** | Advisory Q&A side-panel citing loaded Evidence IDs. | Contextual Drawer | `CopilotDrawer`, `CopilotMessageList`, `EvidenceCitation` | `useCopilotChat`, `useCaseEvidence` | `CopilotMessage`, `CitationRef` | Message history, input text, citation target |
| **`reinvestigate`**| Side-by-side comparative diff of original vs rerun case. | `/case/:id/diff` | `DiffSplitCanvas`, `DeltaMetricsBar`, `EvidenceDiffTable` | `useReinvestigateCase`, `POST /{id}/reinvestigate` | `InvestigationDiff`, `DeltaScore` | Selected baseline run ID, diff view filter |
| **`hunting`** | Cross-case indicator search (IPs, domains, hashes) in local DB.| `/hunting` | `HuntingSearchBar`, `PivotMatchTable`, `IndicatorGraph` | `useThreatHuntingQuery` | `HuntingMatch`, `IndicatorPivot` | Active search indicator, match filter |
| **`system-health`**| Engine execution status, latency monitoring, feed status. | `/admin/health` | `ToolHealthGrid`, `PipelineLatencyGauge`, `EngineStatus`| `useSystemHealth`, `GET /health` | `SystemHealth`, `ToolStatus` | Auto-refresh toggle, selected tool row |
| **`settings`** | API key persistence, theme contrast, PII masking rules. | `/settings` | `WorkstationConfigForm`, `PiiMaskToggle`, `AuditExport` | `useSettingsStore` | `WorkstationSettings` | Form dirty state, test connection status |

---

# SECTION 6 — ROUTING ARCHITECTURE

Routing is driven by a deterministic, hierarchical tree with deep-linkable forensic parameters, route-level code splitting, and strict navigation guards.

### 6.1 Route Hierarchy Map

```
/ (Root Redirect -> /inbox or /login)
├── /login                                    [Layout: MinimalShell, Auth: Public]
├── /ingest                                   [Layout: StandardShell, Auth: Protected]
├── /inbox                                    [Layout: StandardShell, Auth: Protected]
│   └── ?case=<id>&peek=true                  [Deep-link opens QuickPeekDrawer over Inbox]
├── /case/:id                                 [Layout: WorkspaceShell, Auth: Protected]
│   ├── /case/:id/overview                    [Default active tab landing]
│   ├── /case/:id/headers                     [Header Forensics, ?hop=<index>&mode=split]
│   ├── /case/:id/urls                        [URL & Domain Intelligence, ?url_id=<id>]
│   ├── /case/:id/geo                         [Infrastructure & Geospatial Routing]
│   ├── /case/:id/attachments                 [Attachment Forensics & Entropy]
│   ├── /case/:id/history                     [Quarantined Historical Correlation]
│   ├── /case/:id/evidence                    [Complete Evidence Datatable, ?evd=<EVD-***>]
│   ├── /case/:id/report                      [Court-Admissible Report View, ?seal=verify]
│   └── /case/:id/diff                        [Comparative Diff against rerun run_id]
├── /hunting                                  [Layout: StandardShell, Auth: Protected, ?q=<ioc>]
├── /admin/health                             [Layout: StandardShell, Auth: Protected]
├── /settings                                 [Layout: StandardShell, Auth: Protected]
└── /*                                        [NotFoundBoundary: 404 Forensic Recovery View]
```

### 6.2 Route Guard Specifications
- **`AuthGuard`:** Evaluates `authStore.apiKey`. If empty, redirects to `/login` preserving target route via `?redirect=/case/case_2026_9012`.
- **`CaseExistenceGuard`:** Prefetches `GET /api/v1/investigations/:id`. If backend returns 404, mounts `CaseNotFoundBoundary` offering immediate return to `/inbox` or `.eml` re-ingest.
- **`LoadingBoundaries`:** Every route features a dedicated skeleton matching the exact pixel layout of the target view (e.g., `HeaderForensicsSkeleton`, `InboxTableSkeleton`) preventing CLS.
- **`ErrorBoundaries`:** Isolated per feature. An unhandled exception in the URL homoglyph visualizer will **never** crash the master Case HUD or Evidence Inspector.

---

# SECTION 7 — SERVER STATE VS. CLIENT STATE TOPOLOGY

The application maintains an absolute separation between authoritative server telemetry and transient UI state. Under no circumstances is server evidence cloned into a mutable global client store.

```
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                    APPLICATION STATE REPOSITORY                                   |
+───────────────────────────────────────────────────┬───────────────────────────────────────────────+
| SERVER STATE (Managed by TanStack Query)          | CLIENT / UI STATE (Managed by Zustand & URL)  |
+───────────────────────────────────────────────────┼───────────────────────────────────────────────+
| • InvestigationResult (Case verdict, scores, runs)| • Active Navigation Tab (`overview`, `headers`)|
| • Raw ParsedEmail RFC 5322 metadata               | • Quick-Peek / Evidence Drawer Open/Close     |
| • 42+ Typed EvidenceItem Entities (`EVD-***`)     | • Selected Evidence Atom ID (`EVD-HDR-001`)   |
| • 4D Resource Budget (Tokens, Latency, Tool Calls)| • Selected Transit Hop Index (`hop=2`)        |
| • Tool Execution State & Failures (`tools_failed`)| • Case Inbox Density Mode (`COMPACT`/`STD`)   |
| • Quarantined Historical Correlation Records      | • Table Filter Pills & Text Search Query      |
| • Backend Health & Latency Metrics (`GET /health`)| • Raw Header Line Offset Jump (`#L42`)        |
| • Re-investigation Diff Payload                   | • Copilot Contextual Drawer Visibility        |
| • Generated Forensic Report Document & Seal       | • Local PII Masking Toggle & Contrast Theme   |
+───────────────────────────────────────────────────┴───────────────────────────────────────────────+
```

### 7.1 Persistence Matrix

| State Item | Storage Medium | Cache Lifetime / Stale Time | Eviction Policy |
| :--- | :--- | :--- | :--- |
| **API Access Key** | `sessionStorage` | Session lifetime | Cleared on tab close or manual logout |
| **Investigation Result**| TanStack Query Cache | `staleTime: 5 min`, `gcTime: 30 min` | Evicted on memory pressure or manual re-analyze |
| **Evidence Atoms** | TanStack Query Cache | `staleTime: 10 min`, `gcTime: 60 min`| Immutable; never modified client-side |
| **Active Case Queue** | Local IndexedDB | Persistent across sessions | Max 100 cases, LRU eviction |
| **Active Tab & Filters**| URL Query Params | Immediate push/replace | Restored on bookmark / refresh |
| **Drawer Toggles** | Zustand Store | Transient (Memory) | Reset on route transition |

---

# SECTION 8 — DATA FETCHING & SYNCHRONIZATION STRATEGY

The client's data fetching strategy aligns strictly with the synchronous REST reality of the ASHIELDER FastAPI backend.

### 8.1 Fetching Lifecycle & Cancellation
1. **Request Deduplication:** TanStack Query handles concurrent component requests for the same `caseId` with zero duplicate network calls.
2. **Deterministic Cancellation:** Every query hook attaches an `AbortController` signal to the underlying fetch. Navigating away from `/case/:id` immediately aborts inflight evidence payloads.
3. **No Phantom Polling:** Because `POST /api/v1/investigations/analyze` and `GET /api/v1/investigations/:id` are synchronous endpoints, polling is **disabled by default**. Polling is strictly limited to `GET /health` (every 30s) and active re-investigation execution.

```
FETCHING LIFECYCLE (Investigation Ingestion):
[Analyst Drops .EML]
       │
       ▼
1. Dispatch `POST /api/v1/investigations/analyze` (Abortable, Timeout: 60s)
       │
       ├─► State: `isPending = true` -> Render AnalysisProgressModal
       │
       ▼ (Backend Processes L0 -> L2 in ~1.8s)
2. Response: `200 OK` (Returns full `InvestigationResult`)
       │
       ├─► Populate TanStack Query Cache under `['investigation', id]`
       ├─► Commit summary record to Local IndexedDB Case Index
       ├─► Invalidate `['cases-queue']` query
       │
       ▼
3. Router Navigates to `/case/:id/overview` (Instant Render from Warm Cache)
```

---

# SECTION 9 — API CLIENT ARCHITECTURE & RESILIENCE LAYER

The API client is implemented as an isolated, multi-layered transport module. Direct invocation of `fetch()` or `axios()` inside components is strictly prohibited.

```
Frontend Component
       │
       ▼
Feature Data Hook (`useCaseEvidence`)
       │
       ▼
API Endpoint Client (`investigationsApi.getEvidence`)
       │
       ▼
Central Transport Layer (`src/api/client.ts`)
       ├── Request Interceptors:
       │     • Attach `X-API-Key: <sessionStorage>`
       │     • Attach `X-Request-ID: <crypto.randomUUID()>`
       │     • Enforce `Content-Type: application/json` or `multipart/form-data`
       │     • Attach `AbortSignal` with configurable timeout
       │
       ▼ [Network Boundary -> FastAPI Backend]
       │
       ▼
       ├── Response Interceptors & Error Normalizer:
             • 200–299: Unwrap & pass to Domain Adapter
             • 401 Unauthorized: Wipe session, redirect to `/login?session=expired`
             • 403 Forbidden: Surface `ForbiddenOperationError`
             • 404 Not Found: Surface `EntityNotFoundError`
             • 413 Payload Too Large: Surface `EmlSizeExceededError` (>25MB)
             • 422 Unprocessable Entity: Surface `ValidationError` with field paths
             • 429 Rate Limit: Surface `RateLimitError` with `Retry-After` calculation
             • 500–504 Server Error: Surface `EngineExecutionError`
             • Network Failure: Surface `BackendUnreachableError`
```

### 9.1 Request Resilience & Timeout Budget

| Endpoint Class | Target Route | Timeout | Max Retries | Backoff Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **System Ping** | `GET /health` | 5,000ms | 2 | Exponential (1s, 2s) |
| **Synchronous Ingestion** | `POST /investigations/analyze` | 60,000ms | 0 (No auto-retry on file ingest) | Manual retry button |
| **Forensic Fetch** | `GET /investigations/{id}` | 10,000ms | 2 | Exponential (500ms, 1s) |
| **Evidence Extraction** | `GET /{id}/evidence` | 15,000ms | 2 | Exponential (500ms, 1s) |
| **Re-investigation** | `POST /{id}/reinvestigate` | 30,000ms | 0 | Manual retry |
| **Report Generation** | `GET /{id}/report` | 15,000ms | 1 | Linear (1s) |

---

# SECTION 10 — TYPESCRIPT CONTRACT ARCHITECTURE

TypeScript types are partitioned into three immutable tiers to prevent accidental contract mutation and maintain 100% fidelity with backend schemas.

```
+───────────────────────────────────────────────────────────────────────────────────────────────────+
| TIER 1: CONTRACT MIRRORS (`src/contracts/backend.ts`)                                             |
| Direct 1:1 reflection of backend Pydantic models. Auto-generated or strictly maintained.          |
| E.g.: `InvestigationResult`, `EvidenceItem`, `ParsedEmail`, `GeolocationResult`, `ToolsUsed`.    |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
                                                  │
                                                  ▼
+───────────────────────────────────────────────────────────────────────────────────────────────────+
| TIER 2: DOMAIN ENTITIES & VIEW MODELS (`src/domain/*.ts`)                                         |
| Normalized, immutable representations with computed display classifications and provenance links. |
| E.g.: `CaseViewModel`, `NormalizedEvidenceEntity`, `VisualHopGraph`, `AuthMatrixPillar`.          |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
                                                  │
                                                  ▼
+───────────────────────────────────────────────────────────────────────────────────────────────────+
| TIER 3: UI COMPONENT PROPS (`src/features/*/types.ts`)                                            |
| Narrow presentation props passed directly to renderers.                                           |
| E.g.: `EvidenceChipProps`, `MetricGaugeProps`, `HopNodeCardProps`.                                |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
```

### 10.1 Mapping & Transformation Invariant
Transformations are permitted **only** within `src/domain/mappers/*.ts`. A mapper is a pure, side-effect-free function that:
- Normalizes missing fields to explicit fallback structures (`N/A`, `UNAVAILABLE`).
- Parses RFC 5322 transit hop headers into chronological, delta-latency graph nodes.
- Classifies evidence items into the 11 official product categories (`HEADER`, `AUTH`, `NETWORK`, `URL`, `HTML`, `ATTACHMENT`, `CONTENT`, `INTEL`, `HISTORICAL`, `REASONING`, `PIPELINE`).

---

# SECTION 11 — AUTHENTICATION ARCHITECTURE

The authentication implementation is grounded in the backend reality documented in the API Integration Spec: authentication is enforced via the `X-API-Key` HTTP header.

### 11.1 Authentication Workflow

```
[Analyst Launches Workstation]
       │
       ▼
Check `sessionStorage.getItem('ashielder_api_key')`
       │
       ├───► [Found]: Inject into client header -> Mount App
       │
       └───► [Missing / Invalid]:
                 │
                 ▼
       Mount `/login` View
                 │
                 ▼
       Analyst Inputs Access Key (`X-API-Key`)
                 │
                 ▼
       Dispatch Verification Ping: `GET /health` with `X-API-Key: <key>`
                 │
                 ├───► [200 OK]:
                 │       • Store key in `sessionStorage`
                 │       • Initialize `authStore` with analyst handle
                 │       • Redirect to `/inbox` (or `?redirect=` target)
                 │
                 └───► [401 / Network Failure]:
                         • Render red banner: "Invalid Access Key"
                         • Zero-out input buffer
```

### 11.2 Storage & Credential Security Rules
- **No Long-Lived Storage:** API keys are **never** committed to `localStorage`, browser cookies, or IndexedDB. They are scoped strictly to `sessionStorage` and cleared when the browser tab closes.
- **Header Scoping:** The `X-API-Key` is injected exclusively into requests targeting the verified backend endpoint (`VITE_API_BASE_URL`). It is never transmitted to external domains or CDNs.

---

# SECTION 12 — ROLE-BASED ACCESS CONTROL (RBAC) ARCHITECTURE

While backend v1.0 operates on a singular API key verification model, the frontend implements an **Authoritative Capability Abstraction Layer** to ensure enterprise RBAC readiness without fabricating backend endpoints.

### 12.1 Capability Definition
Frontend UI elements check against discrete **Capabilities**, not raw role strings.

```typescript
export type WorkstationCapability =
  | 'case:view'             // View triage inbox, overview, headers, evidence
  | 'case:ingest'           // Upload and ingest new .EML files
  | 'case:reinvestigate'    // Trigger re-investigation pipeline runs
  | 'case:export_report'    // Generate court-admissible PDF reports
  | 'case:quarantine'       // Mark case disposition as confirmed malicious
  | 'admin:view_health'     // View tool latency and engine metrics
  | 'admin:configure_keys'; // Mutate workstation settings
```

### 12.2 Authority Enforcement
- **UX Controls Only:** Frontend capability checks are strictly UI presentation guards (disabling buttons, concealing admin navigation items). 
- **Backend Authority:** If a user attempts to dispatch an unpermitted action (e.g., re-investigate without privileges), the backend responds with `403 Forbidden`, which the normalized API client catches and renders as an authoritative refusal banner.

---

# SECTION 13 — SECURITY ARCHITECTURE & ZERO-TRUST CONTROLS

The ASHIELDER client operates in hostile cyber environments, rendering weaponized emails, exploit payloads, and obfuscated URLs. It enforces strict zero-trust client security.

### 13.1 Security Control Invariants

```
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                  CLIENT ZERO-TRUST SECURITY CONTROLS                              |
+───────────────────────────┬───────────────────────────────────────────────────────────────────────+
| THREAT VECTOR             | MANDATORY FRONTEND DEFENSE INVARIANT                                  |
+───────────────────────────┼───────────────────────────────────────────────────────────────────────+
| **Malicious Email HTML**  | NEVER render raw email HTML in native DOM. Stripped to safe plaintext |
|                           | or rendered inside a sandboxed, script-disabled `<iframe sandbox="">` |
+───────────────────────────┼───────────────────────────────────────────────────────────────────────+
| **Weaponized Hyperlinks** | AUTOMATIC URL DEFANGING: All displayed URLs converted:                |
|                           | `http://` -> `hxxp://`, `.` -> `[.]`. Native clicks disabled.        |
+───────────────────────────┼───────────────────────────────────────────────────────────────────────+
| **Exploit Attachments**   | NO BROWSER EXECUTION: Attachments are never downloaded as executable   |
|                           | binaries. Only hex views, entropy graphs, and hashes are rendered.   |
+───────────────────────────┼───────────────────────────────────────────────────────────────────────+
| **Prompt Injection / AI** | AI Copilot narrative is treated as UNTRUSTED advisory text.           |
|                           | Barred from rendering unescaped HTML, `<script>`, or SVG vectors.     |
+───────────────────────────┼───────────────────────────────────────────────────────────────────────+
| **Sensitive PII Leakage** | Client-side PII masking engine masks email local parts, phone numbers,|
|                           | and internal IP subnets unless explicitly unmasked by analyst click.  |
+───────────────────────────┼───────────────────────────────────────────────────────────────────────+
| **DOM XSS Injection**     | Zero use of `dangerouslySetInnerHTML`. Syntax highlighting utilizes   |
|                           | strict tokenized AST DOM nodes via Prism tokenizers.                  |
+───────────────────────────┼───────────────────────────────────────────────────────────────────────+
```

### 13.2 Content Security Policy (CSP) Directives
The production application is delivered with strict CSP headers:
```http
Content-Security-Policy: 
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'self' https://api.ashielder.soc:8000;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
```

---

# SECTION 14 — EVIDENCE ARCHITECTURE

Evidence is the foundational atomic currency of the ASHIELDER platform. Every finding, metric, and risk score must trace to an immutable `EvidenceItem`.

### 14.1 Evidence Atom Entity Model

```typescript
export interface NormalizedEvidenceEntity {
  id: string;                      // Immutable Evidence ID (e.g., "EVD-HDR-001")
  category: EvidenceCategory;      // One of 11 defined forensic categories
  severity: EvidenceSeverity;      // 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'
  title: string;                   // Concise technical summary
  description: string;             // Detailed forensic finding
  source_tool: string;             // Tool that generated the finding (e.g., "spf_dkim_dmarc")
  timestamp: string;               // ISO 8601 UTC timestamp of creation
  provenance: {
    artifact_type: string;         // 'RFC5322_HEADER' | 'MIME_PART' | 'NETWORK_RELAY' | 'URL'
    byte_offset_start?: number;    // Line or byte offset in raw email source
    byte_offset_end?: number;      // End line or byte offset
    raw_snippet?: string;          // Verbatim uninterpreted string from source
    sha256_hash: string;           // Cryptographic hash of the source artifact
  };
  metrics: {
    risk_weight: number;           // Absolute points contributed to risk score
    confidence_score: number;      // Metric confidence (0.0 to 1.0)
  };
  related_evidence_ids: string[];  // Graph links to correlated evidence atoms
}
```

### 14.2 Reusable Evidence UI Mechanism
1. **`EvidenceChip` (`[EVD-***]`):** An interactive monospace pill rendered alongside every finding. Clicking opens the global `EvidenceInspectorDrawer` pinned to that atom.
2. **`EvidenceLink`:** Monospace anchor text with preview tooltip showing source tool and risk weight on hover.
3. **`EvidenceInspectorDrawer`:** Slide-over container rendering the raw provenance snippet, cryptographic hash, parser line offsets, and a **"Jump to Source"** button that navigates directly to `/case/:id/headers#L42`.

---

# SECTION 15 — INVESTIGATION LIFECYCLE ARCHITECTURE

The frontend models an investigation as an adaptive, multi-stage state machine tracking pipeline execution across four analytical levels (L0 to L3).

```
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                    INVESTIGATION LIFECYCLE                                        |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
  [PENDING] ──► [RUNNING] ──► [EVALUATION] ──┬──► [SUCCESS] ──────► [COMPLETE]
                                              ├──► [DEGRADED] ────► [COMPLETE]
                                              ├──► [FAILED] ──────► [COMPLETE]
                                              └──► [INCONCLUSIVE] ─► [COMPLETE]
```

### 15.1 Investigation State Representation

| State | UI Representation | Color Token | Description |
| :--- | :--- | :--- | :--- |
| **`PENDING`** | Dotted outline circle | Slate-500 | Tool or level scheduled but not yet executing. |
| **`RUNNING`** | Pulsing radar spinner | Sky-400 | Actively computing ML models or querying external feeds. |
| **`SUCCESS`** | Solid checkmark | Emerald-500 | Completed within budget; evidence generated. |
| **`DEGRADED`** | Amber warning triangle | Amber-500 | Completed with partial telemetry (e.g., external WHOIS timeout). |
| **`FAILED`** | Red cross | Rose-500 | Tool crashed or threw uncaught exception (`tools_failed`). |
| **`SKIPPED`** | Diagonal slash | Slate-600 | Bypassed due to early stop-guard (e.g., confidence target reached). |
| **`INCONCLUSIVE`**| Indigo question mark | Indigo-400 | Pipeline completed but failed confidence threshold or budget exhausted. |

### 15.2 4D Resource Budget Visualization
The frontend renders the backend's strict 4D resource envelope:
1. **Wall-Clock Latency:** Progress bar tracking execution vs. 4,000ms SLA target.
2. **Tool Execution Count:** Circular gauge tracking executed vs. 16 allowed calls.
3. **External Network Calls:** Meter tracking external DNS/GeoIP queries vs. 6 budget limit.
4. **Token Consumption:** Meter tracking LLM tokens consumed vs. policy budget.

---

# SECTION 16 — RISK, CONFIDENCE & VERDICT RENDERING RULES

The presentation of analytical metrics adheres to strict orthogonal separation: Risk and Confidence are distinct mathematical dimensions that must never be collapsed into a composite score.

```
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                     ORTHOGONAL 2D METRIC HUD                                      |
+─────────────────────────────────────────────┬─────────────────────────────────────────────────────+
| RISK SCORE CARD (0 - 100)                   | CONFIDENCE METER CARD (0.0 - 1.0)                   |
| Represents Threat Severity & Impact         | Represents Data Completeness & Engine Calibration   |
+─────────────────────────────────────────────┼─────────────────────────────────────────────────────+
| Value: 92.5 / 100 (HIGH SEVERITY)           | Value: 0.842 / 1.0 (84.2% CERTAINTY)                |
| Visual: Solid Crimson Progress Bar          | Visual: Emerald / Cyan Ratio Progress Bar           |
| Sub-label: +35 DMARC, +30 Tor, +20 Intent   | Sub-label: Completeness: 100% | Penalties: 0.00     |
| Threshold: >= 70.0 (MALICIOUS)              | Threshold: >= 0.80 Target Met                       |
+─────────────────────────────────────────────┴─────────────────────────────────────────────────────+
```

### 16.1 Mathematical Invariants
- **Never Derived on Frontend:** Risk, Confidence, and Verdict are read directly from `InvestigationResult`. The client never sums weights or overrides thresholds.
- **Visual Separation:** Risk and Confidence cards are physically separated by a 16px spatial gutter. They are never rendered as a single divided progress bar or combined percentage.

---

# SECTION 17 — AI COPILOT ARCHITECTURE (ADVISORY DOCK)

The AI Copilot operates solely as an evidence-grounded advisory assistant docked in a 420px contextual side-drawer.

```
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                    COPILOT BOUNDARY ARCHITECTURE                                  |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
  Analyst Query ("Explain why DMARC failed")
         │
         ▼
  Copilot Client (`src/features/copilot`)
         │
         ▼ (Sanitizes query, attaches active Case ID & loaded Evidence IDs)
  FastAPI Backend (`POST /api/v1/cases/reasoning` or Server-Side Groq Proxy)
         │
         ▼ (Evaluates system prompt, performs evidence citation grounding)
  Structured Reasoning Response
         │
         ▼
  Frontend Markdown Renderer (Strictly tokenized, unescaped scripts disabled)
         │
         ▼
  Evidence Citation Links Rendered: "DMARC failed because [EVD-HDR-001] rejected origin IP"
```

### 17.1 Copilot Operational Invariants
- **No Direct Groq Access:** The browser never calls the Groq SDK, holds Groq API keys, or crafts ungrounded prompts.
- **Advisory Only:** Copilot responses are typographically distinguished with a subtle dashed border and a persistent badge: *"AI Advisory Clerk — Evidence Grounded"*. The Copilot is structurally barred from setting verdicts, altering scores, or triggering automated remediation.

---

# SECTION 18 — EVIDENCE & RAW DATA VIEWERS

Forensic examiners require byte-level inspection of raw email headers, MIME boundaries, and cryptographic signatures.

### 18.1 Safe Raw Rendering Engine
- **1-Indexed Line Highlighting:** Raw RFC 5322 text is rendered with line numbers matching backend parser offsets.
- **Syntax Tokenization:** Headers like `Received:`, `Authentication-Results:`, `DKIM-Signature:` are highlighted using non-DOM-injecting tokenizers.
- **Deep-Link Anchor Support:** Visiting `/case/:id/headers#L42` smoothly scrolls to and highlights line 42 with an amber indicator.
- **Defanged Copy Toolbar:** Allows copying raw byte streams or defanged sanitized text to the clipboard with one click.

---

# SECTION 19 — TABLE & DATA-DENSE UI ARCHITECTURE

The Case Triage Inbox and Evidence Explorer present dense forensic records requiring instantaneous keyboard navigation and sorting.

### 19.1 Virtualization & Density Strategy
- **Dataset Sizing:** Ingestion queues typically contain 50–200 active cases; evidence explorer contains 42+ items. TanStack Table renders this without virtual DOM overhead, maintaining standard DOM accessibility.
- **Conditional Virtualization:** Virtualization (`@tanstack/react-virtual`) is dynamically activated **only** if the row count exceeds 250 items.
- **Density Modes:**
  - `Compact` (36px row): High-density triage via keyboard (`J`/`K` navigation).
  - `Standard` (54px row — Default): Balanced display with primary IOC and attack hypothesis tags.
  - `Preview` (78px row): Forensic overview including stop reasons and tools executed.

---

# SECTION 20 — INVESTIGATION VISUALIZATION ARCHITECTURE

Visualizations transform complex network and authentication data into intuitive forensic mental models.

### 20.1 Received Hop Route Visualizer
- **Chronological Layout:** Maps transit hops from Originating MTA (Hop 0) to Corporate Ingress MX (Hop N) from left to right.
- **Transit Latency Deltas:** Displays delta timestamps between relays (`+124ms`, `+1,420ms`). Relays exceeding 10s latency are highlighted in amber.
- **Hostile Infrastructure Nodes:** Tor exit nodes, VPN proxies, and FCrDNS mismatches are marked with distinct warning glyphs and direct links to corresponding `EVD-NET-***` atoms.

```
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                    RECEIVED HOP TRANSIT ROUTE                                     |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
  [ORIGIN MTA]                 [INTERMEDIATE RELAY]               [CORPORATE INGRESS MX]
  IP: 185.220.101.5   ──► +142ms ──►   IP: 198.51.100.24   ──► +84ms  ──►   IP: 203.0.113.10
  TOR EXIT NODE [!]                    Clean ASN                        mx.targetcorp.in
  [EVD-NET-003]                        [EVD-NET-004]                    [EVD-NET-001]
```

---

# SECTION 21 — GEOLOCATION ARCHITECTURE

The geolocation interface provides visual geographic intelligence while strictly preventing forensic attribution errors.

### 21.1 Attribution Guard & Display Rules
- **IP Estimate $\neq$ Physical Attacker:** The UI explicitly displays the label: *"Estimated Originating MTA Server Geolocation (MaxMind GeoLite2). Does NOT represent physical threat actor location."*
- **Visual Mapping:** Rendered using lightweight offline SVG world boundaries with marker coordinates bounded to city-level precision.

---

# SECTION 22 — REPORT ARCHITECTURE

The Forensic Report view (`/case/:id/report`) renders a court-admissible forensic document verified by a cryptographic digital seal.

### 22.1 Report Integrity & Print Engine
- **Deterministic Layout:** Rendered using standard print CSS media queries (`@media print`) matching 8.5" x 11" A4 dimensions with page break controls (`break-inside: avoid`).
- **Cryptographic Seal:** Displays the SHA-256 case integrity hash, verification timestamp, engine version, and analyst session handle.
- **Zero Client PDF Generation:** PDF export leverages browser native PDF rendering or fetches the official backend PDF artifact. The client never attempts to construct PDF binary streams using heavy libraries.

---

# SECTION 23 — RE-INVESTIGATION & RUN DIFF ARCHITECTURE

When new threat intelligence feeds become available or analysts supply decryption keys, the case can be re-investigated. Original evidence is **never** overwritten.

### 23.1 Run Diff Data Model

```typescript
export interface InvestigationDiff {
  case_id: string;
  baseline_run_id: string;      // Original investigation execution
  comparison_run_id: string;    // New investigation execution
  deltas: {
    risk_score_delta: number;       // e.g., -34.5 (if false positive cleared)
    confidence_delta: number;       // e.g., +0.14
    verdict_changed: boolean;       // e.g., SUSPICIOUS -> BENIGN
    new_evidence_ids: string[];     // Evidence generated in run 2
    resolved_conflicts: string[];   // Ambiguities cleared
  };
}
```

### 23.2 Side-by-Side Diff Canvas
Rendered as a comparative split-screen (`/case/:id/diff`):
- Left Pane: Baseline Run (Run #1) with original scores and findings.
- Right Pane: Comparison Run (Run #2) highlighting new evidence in green and resolved risks in red strikethrough.

---

# SECTION 24 — URL & DEEP-LINK STATE ARCHITECTURE

All investigative contexts are fully restorable via URL query parameters, enabling instant multi-analyst handoffs.

```
URL PARAMETER SCHEMA:
/case/:id/:tab?evd=<EVD-***>&hop=<index>&peek=<bool>&mode=<view>&seal=<verify>

PARAMETERS:
├── id: Case Identifier (`ASH-2026-9012`)
├── tab: Active tab (`overview`, `headers`, `urls`, `geo`, `attachments`, `history`, `evidence`, `report`)
├── evd: Active Evidence ID in inspector drawer (`EVD-HDR-001`)
├── hop: Active transit hop selected in Received visualizer (`2`)
├── peek: Quick-peek drawer open status over inbox (`true`)
└── mode: View mode toggle (`split`, `raw`, `compact`)
```

---

# SECTION 25 — PERFORMANCE & LATENCY ARCHITECTURE

To ensure high-throughput operation during critical cyber incident responses, the frontend enforces strict performance budgets.

### 25.1 Performance Targets & Budgets
- **Initial Bundle Size:** < 350 KB gzipped.
- **First Contentful Paint (FCP):** < 800ms on standard SOC workstations.
- **Route Transition Latency:** < 50ms (zero layout shift).
- **Table Keyboard Navigation:** 60 FPS response during rapid `J`/`K` row traversals.
- **Code Splitting:** All forensic tabs (`/headers`, `/urls`, `/geo`, `/report`) are lazy-loaded via React `lazy()` and dynamic imports.

---

# SECTION 26 — UNIFIED ERROR ARCHITECTURE

The application implements a normalized, resilient error model. A failure in an auxiliary tool (e.g., WHOIS lookup) will never crash the core triage workstation.

### 26.1 Error Hierarchy & Recovery Strategies

```
DomainError (Base)
├── ApiError
│   ├── AuthenticationError (401)  ──► Wipe session, redirect to /login
│   ├── ForbiddenError (403)       ──► Surface capability warning banner
│   ├── NotFoundError (404)        ──► Mount CaseNotFoundRecoveryView
│   ├── PayloadTooLargeError (413) ──► Prompt user to compress .EML (<25MB)
│   ├── ValidationError (422)      ──► Highlight invalid form fields
│   ├── RateLimitError (429)       ──► Display countdown timer using Retry-After
│   └── BackendExecutionError (500)──► Render degraded state with logs
├── NetworkError                   ──► Display persistent offline warning pill
└── ParseError                     ──► Render RawHexFallbackViewer
```

---

# SECTION 27 — LOADING, EMPTY & DEGRADED STATE PRIMITIVES

Every view supports first-class primitives for asynchronous states, eliminating generic, uninformative loading spinners.

### 27.1 The First-Class INCONCLUSIVE Experience
When an investigation finishes with `verdict == 'INCONCLUSIVE'` (confidence < 0.70 or budget exhausted):
1. **Prominent Warning Banner:** Indigo-accented alert explaining the exact stop reason (`BUDGET_EXHAUSTED` or `UNRESOLVED_AUTH_CONFLICTS`).
2. **Missing Evidence Checklist:** Interactive checklist showing missing artifacts (e.g., encrypted attachment password required).
3. **Analyst Action Panel:** Direct triggers to provide decryption passwords or dispatch manual external enrichment queries.

---

# SECTION 28 — COMPREHENSIVE TESTING STRATEGY

The codebase is fortified with four testing tiers ensuring zero regression in security or forensic logic.

```
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                      TESTING ARCHITECTURE MATRIX                                  |
+───────────────────────────┬───────────────────────────────┬───────────────────────────────────────+
| TIER                      | FOCUS & SCOPE                 | TOOLING & RUNTIME                     |
+───────────────────────────┼───────────────────────────────┼───────────────────────────────────────+
| **Unit Tests**            | Mappers, defanging utilities, | Vitest (Shared Vite config)           |
|                           | PII masking, math invariance  | Execution: < 5ms per spec             |
+───────────────────────────┼───────────────────────────────┼───────────────────────────────────────+
| **Component Tests**       | Evidence chips, 2D HUD cards, | React Testing Library + Vitest        |
|                           | raw code viewers, drawers     | Zero-DOM mocking of security features |
+───────────────────────────┼───────────────────────────────┼───────────────────────────────────────+
| **Integration Tests**     | TanStack Query hooks, API     | Mock Service Worker (MSW)             |
|                           | client interceptors, errors   | Full HTTP lifecycle simulation        |
+───────────────────────────┼───────────────────────────────┼───────────────────────────────────────+
| **End-to-End (E2E)**      | Dropzone ingest -> Triage ->  | Playwright (Multi-browser)            |
|                           | Evidence drill-down -> Report | Real browser forensic validation      |
+───────────────────────────┼───────────────────────────────┼───────────────────────────────────────+
```

---

# SECTION 29 — FRONTEND OBSERVABILITY & TELEMETRY

Telemetry tracks workstation performance and network health while strictly adhering to data privacy constraints.

### 29.1 Tracing & Redaction Rules
- **Request ID Correlation:** Every outbound request generates an `X-Request-ID` (UUIDv4), correlated with the backend audit log and displayed in the Global Status Bar.
- **Zero Sensitive Data Ingestion:** Telemetry and error reporting logs **never** capture email bodies, recipient addresses, raw headers, attachments, or API keys. Logs capture only route paths, latency timings, and error status codes.

---

# SECTION 30 — ENVIRONMENT CONFIGURATION

Configuration is partitioned into browser-safe public variables and strictly forbidden secret variables.

```
# .env.example
# BROWSER-SAFE (Prefixed with VITE_)
VITE_API_BASE_URL=https://api.ashielder.soc:8000
VITE_ENVIRONMENT=production
VITE_ENABLE_MOCK_DEMO_CASES=true
VITE_SLA_TARGET_MS=4000

# STRICTLY PROHIBITED IN FRONTEND ENVIRONMENT:
# GROQ_API_KEY (Server-only secret)
# DATABASE_URL (Server-only secret)
# VT_API_KEY (Server-only secret)
# ABUSEIPDB_API_KEY (Server-only secret)
```

---

# SECTION 31 — DEPLOYMENT ARCHITECTURE

The application compiles into static production assets (`dist/`) served by a lightweight reverse proxy or container environment.

```
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                    DEPLOYMENT ARCHITECTURE                                        |
+───────────────────────────────────────────────────────────────────────────────────────────────────+
  Client Browser (Analyst Workstation)
         │
         ▼ (HTTPS: Port 443 / Container Port 3000)
  Nginx / Static Web Server
         ├── Static Assets (`dist/index.html`, `dist/assets/*.js`, `dist/assets/*.css`)
         │
         ▼ (Proxy `/api/v1/*` and `/health`)
  FastAPI Forensic Backend (Port 8000)
```

---

# SECTION 32 — DEVELOPMENT & IMPLEMENTATION WORKFLOW

Implementation proceeds sequentially through 20 structured phases:

1. **Foundations:** Project initialization, Tailwind 4 theme tokens, Lucide icon bindings.
2. **Contracts:** Direct mirror generation of backend Pydantic models in `src/contracts/backend.ts`.
3. **Transport:** API client transport, `X-API-Key` interceptor, `X-Request-ID`, error normalizer.
4. **Shell:** Persistent layout, TopBar, Navigation Rail, Global Status Bar, Breadcrumbs.
5. **Authentication:** `/login` page, session storage, `GET /health` verification ping.
6. **Ingestion:** `/ingest` drag-and-drop .EML dropzone, upload progress modal.
7. **Triage Queue:** `/inbox` table, density modes, multi-parameter filter pills.
8. **Quick-Peek:** Spacebar-triggered contextual drawer over inbox rows.
9. **Case Workspace:** Level 1 HUD, 2D Risk & Confidence cards, Envelope metadata summary.
10. **Overview Tab:** 2D metrics breakdown, key findings list, chronological investigation journey.
11. **Header Forensics:** 5-pillar authentication matrix, Received hop visualizer, raw RFC 5322 viewer.
12. **URL Intelligence:** Defanged links table, homoglyph detection, LightURLNet scores.
13. **Infrastructure & Geo:** ASN routing, Tor/VPN classification, offline SVG world map.
14. **Attachments:** SHA-256 hash calculation, magic-byte MIME mismatches, entropy gauges.
15. **History & Correlation:** Quarantined past campaign matches, recipient blast radius.
16. **Evidence Explorer:** Full 42+ typed evidence datatable, EvidenceInspector drawer.
17. **Forensic Report:** Court-admissible interactive view, digital seal verification, print engine.
18. **AI Copilot:** Contextual side-dock, evidence snapshot grounding, citation parser.
19. **Re-investigation:** Diff canvas comparing baseline and new pipeline runs.
20. **Hardening & Verification:** CSP enforcement, XSS audit, unit/integration/E2E test suite.

---

# SECTION 33 — CODING AGENT RULES & INVARIANTS

Future coding agents executing changes on this repository must strictly obey these non-negotiable rules:

### Mandatory Directives (Agents MUST):
- **MUST** read all four ASHIELDER specifications before making modifications.
- **MUST** preserve exact backend Pydantic field names (`tools_used`, `risk_score`, `verdict`).
- **MUST** maintain physical separation between Risk (0–100) and Confidence (0.0–1.0).
- **MUST** defang all displayed URLs and IP addresses (`hxxp://`, `[.]`).
- **MUST** ground all UI findings in immutable Evidence IDs (`EVD-***`).
- **MUST** render the AI Copilot as an advisory assistant barred from setting case verdicts.
- **MUST** write corresponding unit/component tests for any new UI element or data adapter.

### Prohibited Actions (Agents MUST NOT):
- **MUST NOT** invent synthetic backend endpoints or fabricated response fields.
- **MUST NOT** place API keys, Groq tokens, or backend secrets in browser code.
- **MUST NOT** call Groq SDK or third-party AI APIs directly from client-side code.
- **MUST NOT** execute unescaped raw email HTML in native DOM elements.
- **MUST NOT** calculate or mutate the authoritative case verdict client-side.
- **MUST NOT** introduce circular imports across feature modules.

---

# SECTION 34 — ARCHITECTURAL DECISION RECORDS (ADRS)

### ADR-001: Selection of React + Vite over Next.js
- **Status:** Approved.
- **Context:** Need maximum client-side rendering speed for high-density forensic tables in air-gapped or sandboxed SOC networks.
- **Decision:** Use React 19 + Vite 6 SPA.
- **Consequences:** Eliminates Node.js SSR runtime complexity; ensures zero hydration mismatches during static log inspection.

### ADR-002: Dual-Store State Topology (TanStack Query + Zustand)
- **Status:** Approved.
- **Context:** Need strict isolation between immutable server evidence and transient UI controls.
- **Decision:** TanStack Query owns server state; Zustand owns client UI toggles.
- **Consequences:** Prevents accidental client-side evidence mutation and eliminates unnecessary re-renders.

### ADR-003: Dedicated Single API Client Transport Layer
- **Status:** Approved.
- **Context:** Inconsistent fetch calls cause unhandled 401s, missing request IDs, and security leaks.
- **Decision:** All network traffic routes through `src/api/client.ts`.
- **Consequences:** Guarantees uniform header injection, error normalization, and request cancellation.

### ADR-004: SessionStorage for API Key Credential
- **Status:** Approved.
- **Context:** API keys must not persist indefinitely on shared SOC workstations.
- **Decision:** Store `X-API-Key` in `sessionStorage`.
- **Consequences:** Key automatically purges when browser tab closes; prevents cross-session leakage.

### ADR-005: First-Class Immutable Evidence Model
- **Status:** Approved.
- **Context:** Every finding must be court-admissible and traceable to raw RFC 5322 source bytes.
- **Decision:** Enforce `NormalizedEvidenceEntity` with immutable `EVD-***` IDs across all UI views.
- **Consequences:** Enables 1-click drill-down from any finding to raw header byte offsets.

### ADR-006: Absolute Separation of Risk and Confidence
- **Status:** Approved.
- **Context:** Collapsing threat severity and data certainty into one number leads to catastrophic triage errors.
- **Decision:** Render Risk (0–100) and Confidence (0.0–1.0) in physically separated visual cards.
- **Consequences:** Analysts immediately identify high-risk cases with low confidence requiring manual evidence gathering.

### ADR-007: Advisory Copilot Boundary
- **Status:** Approved.
- **Context:** Probabilistic LLMs must never exert administrative authority over forensic conclusions.
- **Decision:** Copilot is an advisory side-panel with zero mutation permissions over case state.
- **Consequences:** Prevents hallucinated LLM responses from altering court-admissible verdicts.

### ADR-008: Mandatory Client-Side URL Defanging
- **Status:** Approved.
- **Context:** SOC analysts clicking malicious links in investigation consoles causes severe breach risk.
- **Decision:** All displayed URLs converted to `hxxp://` and `[.]` with native navigation stripped.
- **Consequences:** Guarantees zero accidental analyst link executions.

### ADR-009: Deep-Link Synchronization for Forensic Handoffs
- **Status:** Approved.
- **Context:** L1 analysts must hand off exact investigative contexts to L2/L3 specialists.
- **Decision:** Synchronize active tab, selected evidence, and transit hops into URL search params.
- **Consequences:** Pasting a URL restores the exact forensic state including drawer anchors.

### ADR-010: First-Class INCONCLUSIVE Case State
- **Status:** Approved.
- **Context:** Low-confidence investigations or budget-halted pipelines must not be mislabeled as Benign.
- **Decision:** Render a dedicated INCONCLUSIVE interface with missing evidence checklists.
- **Consequences:** Directs analysts to clear ambiguities (e.g., provide decryption passwords) rather than closing active threats.

---

# SECTION 35 — DEPENDENCY RULES & MODULE BARRIERS

To preserve system maintainability, module dependencies must strictly follow a directed acyclic graph (DAG).

```
[ UI Component ]  ──►  [ Feature Hook ]  ──►  [ Domain Adapter ]  ──►  [ API Client ]  ──►  [ Backend ]
      │                                              │
      ▼                                              ▼
[ Shared Design System ]                    [ Contract Mirror ]
```

- **Acyclic Enforcement:** Feature modules never import from peer feature modules. Shared abstractions reside in `components/`, `domain/`, or `stores/`.
- **Public API Barrier:** Each feature exports only its route component and public embeddables via `index.ts`. Internal sub-components remain private to that feature.

---

# SECTION 36 — MASTER ARCHITECTURAL DIAGRAMS

### 36.1 End-to-End Forensic Data Flow

```
[ .EML File ] ──► Ingestion Dropzone ──► POST /api/v1/investigations/analyze
                                                        │
                                                        ▼
                                            FastAPI Pipeline (L0 -> L2)
                                                        │
                                                        ▼
                                            InvestigationResult JSON
                                                        │
                      ┌─────────────────────────────────┴─────────────────────────────────┐
                      ▼                                                                   ▼
         TanStack Query Cache Entry                                             IndexedDB Case Record
                      │                                                                   │
                      ▼                                                                   ▼
          Case Workspace HUD & Tabs                                               Case Inbox Queue
                      │
  ┌───────────────────┼───────────────────┬───────────────────┐
  ▼                   ▼                   ▼                   ▼
Overview Tab       Headers Tab         Evidence Tab        Report Tab
(2D Metrics &      (Auth Matrix &      (42+ Atoms &        (Court Seal &
Journey Stepper)   Hop Visualizer)     Inspector)          Print Engine)
```

### 36.2 Investigation State Machine Diagram

```
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                                    INVESTIGATION STATE MACHINE                                    |
+───────────────────────────────────────────────────────────────────────────────────────────────────+

                 ┌─────────────────────────┐
                 │         IDLE            │
                 └────────────┬────────────┘
                              │
                      [Drop .EML File]
                              │
                              ▼
                 ┌─────────────────────────┐
                 │        PENDING          │
                 └────────────┬────────────┘
                              │
                      [Dispatch /analyze]
                              │
                              ▼
                 ┌─────────────────────────┐
                 │        RUNNING          │ ◄─────────────────────────┐
                 └────────────┬────────────┘                           │
                              │                                        │
                      [Pipeline Level L0-L2]                   [Re-investigate]
                              │                                        │
                              ▼                                        │
                 ┌─────────────────────────┐                           │
                 │       EVALUATION        │                           │
                 └────────────┬────────────┘                           │
                              │                                        │
         ┌────────────────────┼────────────────────┐                   │
         ▼                    ▼                    ▼                   │
  [Conf >= 0.80]       [Conf < 0.80 / Stop]   [Tool Crashes]           │
         │                    │                    │                   │
         ▼                    ▼                    ▼                   │
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐           │
  │   SUCCESS    │     │ INCONCLUSIVE │     │   DEGRADED   │           │
  └──────┬───────┘     └──────┬───────┘     └──────┬───────┘           │
         │                    │                    │                   │
         └────────────────────┼────────────────────┘                   │
                              │                                        │
                              ▼                                        │
                 ┌─────────────────────────┐                           │
                 │        COMPLETE         ├───────────────────────────┘
                 └─────────────────────────┘
```

---

# SECTION 37 — MASTER IMPLEMENTATION CONTRACT

This authoritative matrix dictates the technical stack, ownership, data binding, and security requirement for every area of the ASHIELDER frontend.

| Feature Area | Core Technology | Owner Module | Authoritative Data Source | State Type | Mandatory Security Rule | Minimum Test Requirement |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Authentication** | React, SessionStorage | `features/auth` | `GET /health` with `X-API-Key` | Client Session | Clear key on tab close; never write to localStorage | Mock 401 & 200 health responses |
| **Case Ingestion** | Drag-and-Drop, Fetch | `features/ingestion` | `POST /investigations/analyze` | Transient Upload | Validate RFC 822 extension; cap size at 25MB | Test boundary payload rejection |
| **Triage Inbox** | TanStack Table, Zustand | `features/cases` | Local IndexedDB + Query Cache | Client Cached List | Defang subject lines & sender domains | Keyboard `J`/`K`/`Space` navigation test |
| **Quick-Peek** | Motion, Zustand | `features/cases` | Cached `InvestigationResult` | Transient Drawer | Trap focus; close on `Esc` | Test non-destructive preview open/close |
| **Case HUD** | Tailwind CSS 4 Grid | `features/workspace` | `GET /investigations/{id}` | Server State | Display Verdict verbatim; no client override | Test threshold color mapping |
| **Overview Tab** | SVG Progress, Motion | `features/overview` | `InvestigationResult` | Server State | Physical separation: Risk $\neq$ Confidence | Assert orthogonal card rendering |
| **Header Forensics**| D3 DAG, PrismJS | `features/headers` | `POST /emails/analyze`, Raw EML | Server State | Sanitize raw headers; no innerHTML execution | Assert 1-indexed line jump accuracy |
| **URL Intelligence**| TanStack Table | `features/urls` | `GET /{id}/evidence` (URL) | Server State | AUTOMATIC DEFANGING: `hxxp://`, `[.]` | Test zero-click defanged URL link safety |
| **Infrastructure** | Leaflet / SVG Map | `features/infrastructure`| `InvestigationResult.geolocation`| Server State | Label as "IP Geolocation Estimate" | Test ASN & Tor warning badges |
| **Attachments** | SVG Gauges | `features/attachments` | `ParsedEmail.attachments` | Server State | Disable binary execution; display SHA-256 | Test magic-byte MIME mismatch alert |
| **History Context** | Tailwind Split Card | `features/history` | `GET /{id}/evidence` (HISTORICAL)| Quarantined Cache| Cordon off past cases from current verdict | Test quarantined container boundary |
| **Evidence Explorer**| TanStack Table | `features/evidence` | `GET /investigations/{id}/evidence`| Server State | Every row requires immutable `EVD-***` ID | Test 1-click EvidenceInspector drawer jump |
| **Forensic Report** | Print CSS Media | `features/reports` | `GET /investigations/{id}/report` | Server State | Digital seal verification; clean A4 breaks | Test print layout without visual clipping |
| **AI Copilot** | Markdown AST, Drawer | `features/copilot` | Server-Side Reasoning Proxy | Transient Session| Strictly advisory; barred from setting verdicts | Test citation parsing & unescaped HTML block|
| **Re-investigation**| Split View Diff | `features/reinvestigate` | `POST /{id}/reinvestigate` | Server Mutation | Never overwrite baseline run #1 | Test risk/confidence delta calculation |
| **Threat Hunting** | Local Search Index | `features/hunting` | Local Case IndexedDB | Client Search | Exact indicator match across stored cases | Test IP and domain pivot lookups |
| **System Health** | Polling Query (30s) | `features/system-health`| `GET /health` | Server Polling | Display backend latency & tool error counts | Test degraded tool status banner |

---

# SECTION 38 — FINAL ARCHITECTURAL CHECKLIST

Before implementing frontend code, verify adherence to all pre-implementation criteria:

- [x] **Zero Fabricated Endpoints:** Every API call maps directly to `ASHIELDER_FRONTEND_API_INTEGRATION_SPEC.md`.
- [x] **Zero Fabricated Fields:** Field names mirror backend Pydantic models (`tools_used`, `risk_score`, `verdict`).
- [x] **Zero Client-Side LLM Access:** The browser never calls Groq directly or manages LLM API keys.
- [x] **Zero Frontend Verdict Authority:** Risk and Verdict are strictly computed backend outputs.
- [x] **Orthogonal Metrics:** Risk (0–100) and Confidence (0.0–1.0) are physically and conceptually separate.
- [x] **Evidence Immutability:** All findings resolve to immutable `EVD-***` atoms with provenance snippets.
- [x] **First-Class INCONCLUSIVE:** Explicit wireframe and workflow for low-confidence or budget-halted cases.
- [x] **Client Zero-Trust Security:** Automatic URL defanging, script-disabled email views, and sanitized code blocks.
- [x] **High-Density Keyboard Triage:** Standard SOC navigation (`J`, `K`, `Space`, `Enter`, `Ctrl+K`).
- [x] **Deep-Link State Synchronization:** Full investigative state serializable in URL query parameters.
- [x] **Acyclic Feature Boundaries:** Modular, feature-oriented structure preventing circular dependencies.
- [x] **Implementation Readiness:** Detailed enough that an engineer or coding agent can begin Phase 1 immediately without architectural ambiguity.
