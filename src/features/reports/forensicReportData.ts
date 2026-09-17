export interface EvidenceItem {
  id: string; // e.g. '[E-001]'
  type: string;
  description: string;
  source: string;
  sha256: string;
  acquired: string;
  status: 'Preserved' | 'Derived' | 'Scanned' | 'Verified' | 'Correlated' | 'Evaluated';
  details?: string;
}

export interface CustodyLogItem {
  timestamp: string;
  action: string;
  actor: string;
  evidenceRef: string;
  resultingState: string;
}

export interface HeaderAnalysisItem {
  field: string;
  value: string;
  assessment: string;
  status: 'FLAGGED' | 'FAIL' | 'NEUTRAL' | 'VALID';
  evidenceRef: string;
}

export interface RelayHopItem {
  hopNumber: string;
  time: string;
  role: string;
  ip: string;
  host: string;
  state: string;
}

export interface ThreatFeedMatch {
  indicator: string;
  type: 'IP' | 'Domain' | 'URL' | 'Hash';
  source: string;
  result: 'Suspicious' | 'Malicious';
  confidence: 'High';
  checked: string;
}

export interface RiskWeightingItem {
  component: string;
  weight: string;
  scoreContribution: string;
  state: 'Fail' | 'Suspicious' | 'Malicious' | 'Untrusted';
}

export interface FindingItem {
  id: string;
  title: string;
  severity: 'FAIL' | 'SUSPICIOUS' | 'ANOMALOUS' | 'MALICIOUS';
  summary: string;
  evidenceRef: string;
  corroboratingEvidence: string[];
}

export const EXACT_REPORT_DATA = {
  // Header & Cover Metadata
  division: 'ASHIELDER / FORENSIC INTELLIGENCE DIVISION',
  verdictBadge: 'VERDICT: MALICIOUS • SCORE: 91 / 100',
  notice: 'NOTICE: DEMO REPORT — NOT FOR REAL-WORLD EVIDENCE',
  title: 'Forensic Investigation Report',
  subtitle: 'Automated MIME Ingestion, Cryptographic Custody, Protocol Alignment & Multi-Vector Threat Analysis',

  metadata: {
    caseId: 'CASE-DEMO-2026-00142',
    investigationId: 'INV-DEMO-8F92',
    reportStatus: 'FINAL',
    generated: '08 September 2026',
    analystSignOff: 'ASHIELDER AI + Analyst Review',
    datasetOrigin: 'DEMO / SAMPLE DATA',
    preservedEvidence: '7 Artifacts Recorded',
    confidenceRating: 'HIGH (94.2%)',
  },

  // Abstract
  abstract: `This forensic investigation report details the multi-vector technical examination of inbound electronic mail artifact [E-001] intercepted during staging ingestion. Multi-signal analysis combining cryptographic protocol verification, lexical URL deconstruction, static PDF object stream analysis, and ensemble machine learning heuristics determined a consolidated verdict of MALICIOUS (Risk Score: 91/100, High Confidence). Critical evidence corroborates authoritative domain spoofing with hard failures across SPF, DKIM, and DMARC [E-005], an obfuscated credential-harvesting landing destination [E-003], and an armed PDF document containing an embedded execution launch directive [E-004]. Preserved technical evidence items [E-001] through [E-007] maintain unbroken chain of custody; immediate host containment and tenant-wide credential revocation are recommended.`,
  keywords: 'Email Forensics • Domain Spoofing • Cryptographic Authentication • Credential Harvesting • PDF Object Tree Exploitation • SWGDE / NIST SP 800-86',

  // 1.0 Cover / Case Summary
  triageSummary: 'Inbound MIME stream flagged due to unaligned SPF/DKIM authentication failures, an obfuscated external launch action in attached PDF invoice_demo.pdf, and high lexical phishing entropy in embedded URL hxxps://example[.]invalid/account/verify.',
  keyFindings: [
    {
      id: '[F-001]',
      status: 'FAIL',
      ref: 'E-005',
      title: 'Authentication Anomalies',
      desc: 'SPF, DKIM, & DMARC hard fails',
    },
    {
      id: '[F-002]',
      status: 'SUSPICIOUS',
      ref: 'E-003',
      title: 'Suspicious URL',
      desc: 'Credential prompt path tokens',
    },
    {
      id: '[F-003]',
      status: 'FAIL',
      ref: 'E-004',
      title: 'Attachment Risk Indicators',
      desc: 'PDF embedded action stream',
    },
  ],

  // 2.0 Executive Summary
  executive: {
    verdict: 'MALICIOUS',
    verdictSub: 'Actionable Threat',
    riskScore: '91',
    riskMax: '/ 100',
    riskSub: 'Critical Band (90+)',
    confidence: 'HIGH',
    confidenceSub: 'Multi-Engine Cons.',
    threatType: 'Credential Phishing',
    threatSub: 'High Severity',
    narrative: `During automated ingest triage, ASHIELDER flagged the target communication for severe protocol violations and active payload delivery mechanisms. The sender address forged an authoritative domain identity while transmitting from an unauthorized relay host, triggering definitive SPF, DKIM, and DMARC failures. Concurrently, the message body concealed an evasive URL leading to a cloned authentication endpoint, paired with an attached document engineered with executable launch directives. Correlation across seven distinct forensic artifacts confirms deliberate credential interception and weaponized delivery with an aggregate risk score of 91/100.`,
    flaggedReasons: [
      'Authentication results contain failures.',
      'Extracted URL has suspicious characteristics in the demo dataset.',
      'Attachment analysis returned a malicious demo verdict.',
      'Multiple indicators contribute to the overall risk score.',
    ],
    corroboratingEvidence: ['[E-001]', '[E-003]', '[E-004]', '[E-005]'],
  },

  // 3.0 Case Scope & Methodology
  methodology: {
    objective: 'Comprehensive forensic triage and artifact examination of a simulated inbound email suspected of unauthorized credential harvesting.',
    acquisitionMethod: 'RFC 822 MIME raw stream capture with immediate SHA-256 cryptographic preservation baseline upon receipt.',
    sourceEndpoint: 'Simulated mailbox ingestion endpoint (demo-quarantine@example.invalid)',
    scope: 'Transport relay headers, SPF/DKIM/DMARC protocol alignment, URL payload redirection behavior, PDF attachment structural heuristic scanning, and synthetic correlation models.',
    pipeline: [
      'Email',
      'Evidence Preservation',
      'Parsing',
      'Artifact Extraction',
      'Authentication Analysis',
      'URL Analysis',
      'Attachment Analysis',
      'Threat Intelligence',
      'AI/ML Analysis',
      'Correlation',
      'Risk Assessment',
      'Final Finding',
    ],
  },

  // 4.0 Evidence Register
  evidenceRegister: [
    {
      id: '[E-001]',
      type: 'Original Email',
      description: 'Original .eml message evidence containing RFC 822 headers and MIME multi-part body',
      source: 'User Upload',
      sha256: 'SHA256-DEMO-001',
      acquired: '08 Sep 2026 14:21:08 UTC',
      status: 'Preserved',
    },
    {
      id: '[E-002]',
      type: 'Headers',
      description: 'Parsed RFC 5322 transport & authentication routing headers',
      source: 'E-001',
      sha256: 'SHA256-DEMO-002',
      acquired: '08 Sep 2026 14:21:11 UTC',
      status: 'Derived',
    },
    {
      id: '[E-003]',
      type: 'URL',
      description: 'Extracted URL artifact embedded in HTML anchor body tag',
      source: 'E-001',
      sha256: 'SHA256-DEMO-003',
      acquired: '08 Sep 2026 14:21:12 UTC',
      status: 'Derived',
    },
    {
      id: '[E-004]',
      type: 'Attachment',
      description: 'Sample attachment artifact extracted from multipart boundary',
      source: 'E-001',
      sha256: 'SHA256-DEMO-004',
      acquired: '08 Sep 2026 14:21:15 UTC',
      status: 'Scanned',
    },
    {
      id: '[E-005]',
      type: 'Authentication',
      description: 'SPF, DKIM, and DMARC protocol alignment verification record',
      source: 'E-001',
      sha256: 'SHA256-DEMO-005',
      acquired: '08 Sep 2026 14:21:13 UTC',
      status: 'Verified',
    },
    {
      id: '[E-006]',
      type: 'Threat Intelligence',
      description: 'Multi-source synthetic reputation correlation record',
      source: 'Engine',
      sha256: 'SHA256-DEMO-006',
      acquired: '08 Sep 2026 14:21:17 UTC',
      status: 'Correlated',
    },
    {
      id: '[E-007]',
      type: 'Model Results',
      description: 'Natural language transformer and heuristic inference records',
      source: 'AI Engine',
      sha256: 'SHA256-DEMO-007',
      acquired: '08 Sep 2026 14:21:18 UTC',
      status: 'Evaluated',
    },
  ] as EvidenceItem[],

  // 5.0 Chain of Custody & Investigation Chronology
  custodyFlow: [
    'Original Email',
    'Evidence Preserved',
    'SHA-256 Recorded',
    'Artifact Extraction',
    'Analysis',
    'Derived Evidence',
    'Final Report',
  ],
  custodyChronology: [
    {
      timestamp: '08 Sep 2026 14:21:08 UTC',
      action: 'Inbound message ingress and raw file staging',
      actor: 'System',
      evidenceRef: 'E-001',
      resultingState: 'Stream captured from transport queue',
    },
    {
      timestamp: '08 Sep 2026 14:21:10 UTC',
      action: 'Cryptographic baseline hashing & preservation write lock',
      actor: 'System',
      evidenceRef: 'E-001',
      resultingState: 'SHA256-DEMO-001 computed and sealed',
    },
    {
      timestamp: '08 Sep 2026 14:21:11 UTC',
      action: 'MIME RFC 5322 parsing & header extraction',
      actor: 'System',
      evidenceRef: 'E-002',
      resultingState: 'Derived artifact E-002 hashed & recorded',
    },
    {
      timestamp: '08 Sep 2026 14:21:12 UTC',
      action: 'HTML body tokenization & hyperlink extraction',
      actor: 'System',
      evidenceRef: 'E-003',
      resultingState: 'Extracted demo URL artifact E-003',
    },
    {
      timestamp: '08 Sep 2026 14:21:13 UTC',
      action: 'Email authentication protocol verification',
      actor: 'Analyst-01',
      evidenceRef: 'E-005',
      resultingState: 'SPF, DKIM, and DMARC evaluated as FAIL',
    },
    {
      timestamp: '08 Sep 2026 14:21:15 UTC',
      action: 'Attachment MIME detachment & static inspection',
      actor: 'System',
      evidenceRef: 'E-004',
      resultingState: 'Artifact E-004 scanned for anomaly signatures',
    },
    {
      timestamp: '08 Sep 2026 14:21:17 UTC',
      action: 'Synthetic threat intelligence correlation query',
      actor: 'System',
      evidenceRef: 'E-006',
      resultingState: 'Indicators queried against local demo DB',
    },
    {
      timestamp: '08 Sep 2026 14:21:18 UTC',
      action: 'AI/ML multimodal heuristic evaluation',
      actor: 'AI Engine',
      evidenceRef: 'E-007',
      resultingState: 'Phishing classification 94% confidence',
    },
    {
      timestamp: '08 Sep 2026 14:21:19 UTC',
      action: 'Multi-vector correlation & risk weighting synthesis',
      actor: 'AI Engine',
      evidenceRef: 'All (E-001..E-007)',
      resultingState: 'Overall risk calculated at 91 / 100',
    },
    {
      timestamp: '08 Sep 2026 14:21:20 UTC',
      action: 'Forensic report compilation and final sign-off',
      actor: 'Analyst-01',
      evidenceRef: 'Final Report',
      resultingState: 'Report status finalized for export',
    },
  ] as CustodyLogItem[],

  // 6.0 Original Email Overview
  originalEmail: {
    from: 'analyst-demo@example.invalid',
    to: 'recipient-demo@example.invalid',
    subject: 'Sample Account Verification Required',
    received: '08 Sep 2026 14:21:08 UTC',
    messageId: '<demo-001@example.invalid>',
    replyTo: 'support-demo@example.invalid / bounce-demo@example.invalid',
    bodyText: `Dear Customer,

We detected unusual login activity on your demo account. To prevent unauthorized termination, you are required to verify your credentials within 24 hours.

Please visit the secure portal below:
hxxps://example[.]invalid/account/verify

Alternatively, review the attached invoice breakdown.

Support Operations Team`,
  },

  // 7.0 Email Header Analysis
  headersAnalysis: [
    {
      field: 'From',
      value: '"Support Verification" <analyst-demo@example.invalid>',
      assessment: 'Header address does not match Return-Path envelope identity. High likelihood of display spoofing.',
      status: 'FLAGGED',
      evidenceRef: '[E-002]',
    },
    {
      field: 'Reply-To',
      value: 'support-demo@example.invalid',
      assessment: 'Points to a distinct address designed to redirect responses away from the originating domain.',
      status: 'FLAGGED',
      evidenceRef: '[E-002]',
    },
    {
      field: 'Return-Path',
      value: '<bounce-demo@example.invalid>',
      assessment: 'Envelope sender domain differs from visible From header, failing strict DMARC alignment.',
      status: 'FAIL',
      evidenceRef: '[E-002]',
    },
    {
      field: 'Message-ID',
      value: '<demo-001@example.invalid>',
      assessment: 'Format conforms to RFC 5322 syntax; originating MTA generated synthetic identifier.',
      status: 'NEUTRAL',
      evidenceRef: '[E-002]',
    },
    {
      field: 'Date',
      value: 'Tue, 08 Sep 2026 14:20:55 +0000',
      assessment: 'Timestamp is within 13 seconds of primary hop reception. No clock skew anomalies detected.',
      status: 'VALID',
      evidenceRef: '[E-002]',
    },
    {
      field: 'Received Chain',
      value: '3 transport relay hops documented across RFC 5737 demo subnets',
      assessment: 'First hop originates from unverified IP 192.0.2.45 not designated in reverse DNS records.',
      status: 'FAIL',
      evidenceRef: '[E-002]',
    },
  ] as HeaderAnalysisItem[],

  // Relay Hops
  relayHops: [
    {
      hopNumber: 'HOP 01',
      time: '14:20:55 UTC',
      role: 'Sender',
      ip: '192.0.2.45',
      host: 'Client MTA (example.invalid)',
      state: 'Untrusted Origin',
    },
    {
      hopNumber: 'HOP 02',
      time: '14:21:02 UTC',
      role: 'Relay-01',
      ip: '198.51.100.12',
      host: 'Edge Gateway (gw-relay01.example.invalid)',
      state: 'Intermediate Transit',
    },
    {
      hopNumber: 'HOP 03',
      time: '14:21:06 UTC',
      role: 'Relay-02',
      ip: '203.0.113.88',
      host: 'Border Filter (mx-in02.example.invalid)',
      state: 'Filter Node',
    },
    {
      hopNumber: 'HOP 04',
      time: '14:21:08 UTC',
      role: 'Recipient',
      ip: '203.0.113.150',
      host: 'Delivery MTA (mailbox-hub.example.invalid)',
      state: 'Ingested & Quarantined',
    },
  ] as RelayHopItem[],

  // 8.0 SPF / DKIM / DMARC
  authProtocols: {
    spf: {
      status: 'FAIL',
      spec: 'RFC 7208',
      interpretation: 'Sender IP 192.0.2.45 is not authorized by the published SPF record for example.invalid.',
      rawHeader: 'Authentication-Results: mx-in02.example[.]invalid; spf=fail (sender IP 192.0.2.45 not permitted for domain example[.]invalid)',
      ref: '[E-005]',
    },
    dkim: {
      status: 'FAIL',
      spec: 'RFC 6376',
      interpretation: 'Cryptographic signature header is missing or public key selector failed validation.',
      rawHeader: 'Authentication-Results: mx-in02.example[.]invalid; dkim=fail (signature header absent; no valid selector)',
      ref: '[E-005]',
    },
    dmarc: {
      status: 'FAIL',
      spec: 'RFC 7489',
      interpretation: 'Identifier alignment failed between envelope Return-Path and RFC 5322 From; policy p=reject.',
      rawHeader: 'Authentication-Results: mx-in02.example[.]invalid; dmarc=fail (p=reject dis=quarantine) header.from=example[.]invalid',
      ref: '[E-005]',
    },
    explanation: '“The sample message did not satisfy the configured authentication checks in the demonstration dataset. These failures increase risk but should not be treated as standalone proof of malicious activity.”',
  },

  // 9.0 URL Analysis
  urlAnalysis: {
    targetUrl: 'hxxps://example[.]invalid/account/verify',
    defangedUrl: 'hxxps://example[.]invalid/account/verify',
    verdict: 'SUSPICIOUS',
    riskScore: '87 / 100',
    workflow: [
      { step: '#1', label: 'URL', value: 'hxxps://example[.]invalid/account/verify' },
      { step: '#2', label: 'Domain', value: 'example.invalid (Safe Demo TLD)' },
      { step: '#3', label: 'Reputation', value: 'Flagged in synthetic credential harvester feed' },
      { step: '#4', label: 'Redirect Analysis', value: 'Single-hop meta refresh simulated' },
      { step: '#5', label: 'ML URL Score', value: '87 / 100 Suspicious probability' },
    ],
    bulletPoints: [
      'Target domain mimics account verification paths commonly employed in credential theft campaigns.',
      'URL lacks TLS certificate pinning and employs deceptive subdirectory nomenclature.',
      'Defanged demonstration preview only. No outbound HTTP/HTTPS request was initiated by ASHIELDER.',
    ],
  },

  // 10.0 Attachment Analysis
  attachmentAnalysis: {
    filename: 'invoice_demo.pdf',
    resultBadge: 'MALICIOUS DEMO RESULT',
    confidence: 'Confidence: HIGH',
    mime: 'application/pdf',
    size: '142.1 KB',
    sha256: 'SHA256-DEMO-004',
    heuristics: [
      { name: 'PDF.EmbeddedExecutableStream', detail: 'Detected (/JavaScript block found)', severity: 'Critical' },
      { name: 'PDF.ObfuscatedNameObjects', detail: 'Hexadecimal hex-encoded stream keys', severity: 'High' },
      { name: 'PDF.ExternalURIAction', detail: 'Targets secondary URL artifact', severity: 'High' },
      { name: 'PDF.InvalidPageTreeOffsets', detail: 'Exploits parser tolerance discrepancies', severity: 'Medium' },
    ],
    notice: 'IMPORTANT: Clearly labeled as SAMPLE / DEMO data. File structure was statically audited; no dynamic payload execution occurred.',
  },

  // 11.0 Threat Intelligence
  threatIntel: [
    {
      indicator: '192.0.2.45',
      type: 'IP',
      source: 'ASHIELDER Demo Intel',
      result: 'Suspicious',
      confidence: 'High',
      checked: '08 Sep 2026 14:21:17 UTC',
    },
    {
      indicator: 'example.invalid',
      type: 'Domain',
      source: 'Local Demo Reputation DB',
      result: 'Suspicious',
      confidence: 'High',
      checked: '08 Sep 2026 14:21:17 UTC',
    },
    {
      indicator: 'hxxps://example[.]invalid/account/verify',
      type: 'URL',
      source: 'Synthetic Threat Feed',
      result: 'Malicious',
      confidence: 'High',
      checked: '08 Sep 2026 14:21:17 UTC',
    },
    {
      indicator: 'SHA256-DEMO-004',
      type: 'Hash',
      source: 'ASHIELDER Demo Intel',
      result: 'Malicious',
      confidence: 'High',
      checked: '08 Sep 2026 14:21:17 UTC',
    },
  ] as ThreatFeedMatch[],

  // 12.0 AI / ML Analysis
  aiAnalysis: {
    models: [
      {
        name: 'SEMANTIC EMAIL MODEL',
        verdict: 'PHISHING',
        verdictSeverity: 'MALICIOUS',
        conf: '94%',
        desc: 'Detected urgency triggers, threat of account termination, and anomalous call-to-action linguistic patterns.',
      },
      {
        name: 'URL MODEL',
        verdict: 'SUSPICIOUS',
        verdictSeverity: 'SUSPICIOUS',
        conf: '97%',
        desc: 'High-entropy lexical path, credential keyword density, and synthetic brand impersonation profile.',
      },
      {
        name: 'RISK ENGINE',
        verdict: 'MALICIOUS',
        verdictSeverity: 'MALICIOUS',
        conf: '91%',
        desc: 'Ensemble Bayesian weighting converged on critical credential-harvesting attack archetype.',
      },
    ],
    driver: 'Ensemble classification was driven by the co-occurrence of DMARC alignment failure (p=reject), the presence of /Launch and /JavaScript PDF object dictionary keys in E-004, and deceptive credential-prompt subdirectory tokens in E-003.',
    notice: 'IMPORTANT: Machine learning and neural inferences serve as supportive analytical indicators and do not constitute independent forensic proof.',
  },

  // 13.0 Analyst Review & Disposition
  analystReview: {
    badge: 'Tier-3 Human Verification Completed',
    examiner: 'Sarah Chen, CISSP (Senior Incident Responder #408)',
    verdict: 'Concur with AI Verdict — Confirmed Malicious Phishing',
    timestamp: '08 Sep 2026 14:23:45 UTC',
    notes: `Manual inspection of PDF object stream confirms non-standard /OpenAction invoking external command shell. Sender IP 192.0.2.45 confirmed outside SPF CIDR blocks. No prior legitimate communication history detected between recipient and envelope sender domain. Recommending tenant-wide containment and firewall rule deployment.`,
    digest: 'SHA256-SIGN-DEMO-884A2',
  },

  // 14.0 Correlation & Risk Assessment
  fusionSignals: [
    { label: 'Authentication Signals [E-005]', weight: '30%' },
    { label: 'URL Lexical Indicators [E-003]', weight: '30%' },
    { label: 'Attachment Structural Scan [E-004]', weight: '25%' },
    { label: 'Sender Protocol History [E-002]', weight: '15%' },
  ],
  riskWeights: [
    {
      component: 'Authentication anomalies',
      weight: '30%',
      scoreContribution: '27.3 pts',
      state: 'Fail',
    },
    {
      component: 'URL indicators',
      weight: '30%',
      scoreContribution: '26.1 pts',
      state: 'Suspicious',
    },
    {
      component: 'Attachment indicators',
      weight: '25%',
      scoreContribution: '23.8 pts',
      state: 'Malicious',
    },
    {
      component: 'Sender reputation',
      weight: '15%',
      scoreContribution: '13.8 pts',
      state: 'Untrusted',
    },
  ] as RiskWeightingItem[],

  // 15.0 Final Findings
  findings: [
    {
      id: '[F-001]',
      title: 'Authentication Anomalies',
      severity: 'ANOMALOUS',
      summary: 'Sample SPF/DKIM/DMARC checks failed. Originating MTA 192.0.2.45 is unauthorized for example.invalid, and cryptographic DKIM selector is absent.',
      evidenceRef: 'E-005',
      corroboratingEvidence: ['[E-005]', '[E-002]'],
    },
    {
      id: '[F-002]',
      title: 'Suspicious URL',
      severity: 'SUSPICIOUS',
      summary: 'The extracted demo URL (hxxps://example[.]invalid/account/verify) was classified as suspicious by the sample URL analysis due to deceptive path tokens and credential prompt indicators.',
      evidenceRef: 'E-003',
      corroboratingEvidence: ['[E-003]', '[E-007]'],
    },
    {
      id: '[F-003]',
      title: 'Attachment Risk Indicators',
      severity: 'MALICIOUS',
      summary: 'The sample attachment (invoice_demo.pdf) received a malicious demo verdict due to embedded executable launch actions and obfuscated name objects within the PDF object tree.',
      evidenceRef: 'E-004',
      corroboratingEvidence: ['[E-004]', '[E-006]'],
    },
  ] as FindingItem[],

  // 16.0 Conclusion & Recommendation
  recommendations: [
    {
      action: 'Quarantine',
      detail: 'Enforce immediate tenant-wide quarantine on message and any pending deliverable copies in user mailboxes.',
    },
    {
      action: 'Block Related Indicators',
      detail: 'Add IP 192.0.2.45, URL hxxps://example[.]invalid/account/verify, and attachment hash SHA256-DEMO-004 to firewall and gateway blocklists.',
    },
    {
      action: 'Review Similar Messages',
      detail: 'Execute retroactive log hunting across last 72 hours for messages matching From header or subject pattern.',
    },
    {
      action: 'Preserve Original Evidence',
      detail: 'Retain raw E-001 MIME file and computed custody log under immutable storage for post-incident review.',
    },
  ],
  disclaimer: '“This recommendation is generated from demonstration data and must not be used as an operational security decision.”',

  // 17.0 Investigation Limitations
  limitations: [
    '[1] Dataset is synthetic and created exclusively for software demonstration purposes.',
    '[2] Threat-intelligence records are simulated within a sandboxed local environment.',
    '[3] ML scores are demonstration values and reflect model heuristics rather than verified active adversaries.',
    '[4] No live external network lookups or DNS queries were performed.',
    '[5] No real attachment execution or dynamic sandboxing occurred.',
    '[6] No threat actor attribution or legal culpability conclusion is made.',
    '[7] This report does not constitute legal or regulatory compliance advice.',
  ],

  // 18.0 Appendix — Evidence References
  appendix: [
    {
      id: '[E-001]',
      title: 'Original Email',
      hash: 'SHA256-DEMO-001',
      desc: 'Original .eml message evidence containing RFC 822 headers and MIME multi-part body',
      meta: 'MIME raw stream (28.4 KB). Ingested into tamper-evident storage.',
    },
    {
      id: '[E-002]',
      title: 'Headers',
      hash: 'SHA256-DEMO-002',
      desc: 'Parsed RFC 5322 transport & authentication routing headers',
      meta: 'Normalized header tree including 3 Received hops and SPF/DKIM tags.',
    },
    {
      id: '[E-003]',
      title: 'URL',
      hash: 'SHA256-DEMO-003',
      desc: 'Extracted URL artifact embedded in HTML anchor body tag',
      meta: 'Defanged target: hxxps://example[.]invalid/account/verify',
    },
    {
      id: '[E-004]',
      title: 'Attachment',
      hash: 'SHA256-DEMO-004',
      desc: 'Sample attachment artifact extracted from multipart boundary',
      meta: 'File: invoice_demo.pdf (application/pdf, 142.1 KB)',
    },
    {
      id: '[E-005]',
      title: 'Authentication',
      hash: 'SHA256-DEMO-005',
      desc: 'SPF, DKIM, and DMARC protocol alignment verification record',
      meta: 'SPF: fail, DKIM: fail, DMARC: fail (p=reject).',
    },
    {
      id: '[E-006]',
      title: 'Threat Intelligence',
      hash: 'SHA256-DEMO-006',
      desc: 'Multi-source synthetic reputation correlation record',
      meta: 'Correlation across 3 internal synthetic threat feeds.',
    },
    {
      id: '[E-007]',
      title: 'Model Results',
      hash: 'SHA256-DEMO-007',
      desc: 'Natural language transformer and heuristic inference records',
      meta: 'Semantic NLP Model: 94% Phishing, URL Model: 97% Suspicious.',
    },
  ],

  // Footer metadata
  footer: {
    engine: 'ASHIELDER Forensic Engine',
    caseString: 'Case CASE-DEMO-2026-00142',
    timestamp: '08 Sep 2026 14:21:20 UTC',
    pageInfo: 'Page 1 of 1',
    manifestCheck: 'MD5 Manifest Verified',
    certified: 'FINAL CERTIFIED',
  },
};

// Returns forensic report dataset bound dynamically to a specific case
export function getReportDataForCase(
  caseId: string,
  caseData?: any,
  investigation?: any
): typeof EXACT_REPORT_DATA {
  if (!caseData) {
    return EXACT_REPORT_DATA;
  }

  const isMalicious = caseData.verdict === 'MALICIOUS';
  const isSuspicious = caseData.verdict === 'SUSPICIOUS';
  const riskScore = Math.round(caseData.riskScore ?? (isMalicious ? 91 : isSuspicious ? 64 : 12));
  const confidencePct = Math.round((caseData.confidence ?? 0.88) * 100);
  const formattedCaseId = caseData.id?.startsWith('CASE-') ? caseData.id : `CASE-${caseData.id}`;
  const invId = investigation?.investigation_id || `INV-${caseData.id || '7823'}`;

  // Deep clone baseline report schema
  const report: typeof EXACT_REPORT_DATA = JSON.parse(JSON.stringify(EXACT_REPORT_DATA));

  report.metadata.caseId = formattedCaseId;
  report.metadata.investigationId = invId;
  report.metadata.confidenceRating = `${confidencePct}% Confidence`;
  report.verdictBadge = `VERDICT: ${caseData.verdict || 'MALICIOUS'} • SCORE: ${riskScore} / 100`;

  report.executive.verdict = caseData.verdict || 'MALICIOUS';
  report.executive.riskScore = `${riskScore}`;
  report.executive.confidence = confidencePct >= 80 ? 'HIGH' : confidencePct >= 60 ? 'MEDIUM' : 'LOW';

  // Customize narrative with case specifics
  report.executive.narrative = `During automated ingest triage, ASHIELDER analyzed Case #${caseData.id} (${caseData.subject}) flagged for high-risk threat indicators and weaponized email mechanics. Target address ${caseData.recipient} received an unverified communication from ${caseData.sender} relayed through ${caseData.originIp || '185.220.101.5'} (${caseData.originCountry || 'International Tor Exit'}). Analysis across header integrity, protocol alignment, URL deconstruction, and payload heuristics produced a consolidated verdict of ${caseData.verdict} with risk score ${riskScore}/100 and ${confidencePct}% confidence.`;

  report.abstract = `This certified forensic incident report documents the multi-vector technical examination of Case #${caseData.id} ("${caseData.subject}") intercepted during enterprise inbound mail inspection. Multi-signal analysis combining cryptographic verification, lexical URL analysis, payload inspection, and ensemble ML heuristics established a conclusive verdict of ${caseData.verdict} (Risk Score: ${riskScore}/100, Confidence: ${confidencePct}%). Preserved technical evidence items [E-001] through [E-007] maintain unbroken cryptographic chain of custody adhering to SWGDE and NIST SP 800-86 standards.`;

  report.originalEmail.from = caseData.sender || report.originalEmail.from;
  report.originalEmail.to = caseData.recipient || report.originalEmail.to;
  report.originalEmail.subject = caseData.subject || report.originalEmail.subject;
  if (caseData.timestamp) {
    report.originalEmail.received = new Date(caseData.timestamp).toUTCString();
  }
  if (caseData.originIp) {
    report.originalEmail.replyTo = `${caseData.sender || 'sender@external.net'} (Relayed via ${caseData.originIp})`;
  }

  if (caseData.primaryIoc) {
    const rawIoc = caseData.primaryIoc;
    const formattedUrl = rawIoc.startsWith('http') ? rawIoc : `hxxps://${rawIoc.replace(/\./g, '[.]')}`;
    report.urlAnalysis.targetUrl = formattedUrl;
    report.urlAnalysis.defangedUrl = formattedUrl;
    if (report.threatIntel && report.threatIntel[0]) {
      report.threatIntel[0].indicator = caseData.originIp || '185.220.101.5';
    }
    if (report.threatIntel && report.threatIntel[1]) {
      report.threatIntel[1].indicator = rawIoc.split('/')[0];
    }
  }

  report.footer.caseString = `Case ${formattedCaseId}`;

  return report;
}

// Standalone HTML Generator function so user can download the exact report as an offline HTML file
export function generateStandaloneReportHtml(customData?: typeof EXACT_REPORT_DATA): string {
  const d = customData || EXACT_REPORT_DATA;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ASHIELDER — Forensic Investigation Report ${d.metadata.caseId}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 15mm 12mm 15mm 12mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f1f5f9;
      color: #0f172a;
      line-height: 1.5;
      font-size: 13px;
      -webkit-font-smoothing: antialiased;
    }
    .page-container {
      max-width: 900px;
      margin: 20px auto;
      background: #ffffff;
      padding: 40px 48px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: 1px solid #e2e8f0;
    }
    @media print {
      body { background: #ffffff !important; }
      .page-container { margin: 0 !important; padding: 0 !important; max-width: 100% !important; box-shadow: none !important; border: none !important; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
      .avoid-break { page-break-inside: avoid; break-inside: avoid; }
    }
    .font-serif { font-family: 'IBM Plex Serif', Georgia, serif; }
    .font-mono { font-family: 'IBM Plex Mono', Menlo, Consolas, monospace; }
    .font-sans { font-family: 'IBM Plex Sans', sans-serif; }
    .badge-black { background: #000000; color: #ffffff; padding: 2px 7px; border-radius: 4px; font-weight: bold; font-size: 11px; font-family: 'IBM Plex Mono', monospace; display: inline-block; margin-right: 8px; }
    .section-title { font-size: 15px; font-weight: 700; color: #0f172a; display: flex; align-items: center; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
    .table-custom { width: 100%; border-collapse: collapse; font-size: 12px; margin: 8px 0; }
    .table-custom th { background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 6px 10px; text-align: left; font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.05em; }
    .table-custom td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    .badge-status { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; text-transform: uppercase; }
    .badge-fail { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }
    .badge-suspicious { background: #fef3c7; color: #d97706; border: 1px solid #fde68a; }
    .badge-valid { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; }
    .badge-neutral { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
    .card-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="page-container">
    <!-- Top Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
      <div>
        <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: #64748b; font-family: 'IBM Plex Mono', monospace;">
          ASHIELDER <span style="color: #cbd5e1;">/</span> FORENSIC INTELLIGENCE DIVISION
        </div>
        <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; margin-top: 4px;">
          FORENSIC INVESTIGATION REPORT
        </h1>
        <p style="font-size: 11px; color: #64748b; margin-top: 2px;">
          ${d.subtitle}
        </p>
      </div>
      <div style="text-align: right;">
        <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 9999px; background: #fff1f2; border: 1px solid #fecdd3; color: #e11d48; font-weight: 700; font-size: 12px; font-family: 'IBM Plex Mono', monospace;">
          <span style="width: 7px; height: 7px; border-radius: 50%; background: #e11d48; display: inline-block;"></span>
          ${d.verdictBadge}
        </div>
        <div style="margin-top: 6px; font-size: 9px; font-weight: 700; color: #64748b; letter-spacing: 0.05em; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; border: 1px solid #e2e8f0; display: inline-block;">
          ${d.notice}
        </div>
      </div>
    </div>

    <!-- Metadata Grid -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 12px 0; margin-bottom: 24px; font-size: 11px;">
      <div><span style="color: #64748b; font-weight: 600; font-size: 9px; display: block; text-transform: uppercase;">CASE ID</span><strong class="font-mono">${d.metadata.caseId}</strong></div>
      <div><span style="color: #64748b; font-weight: 600; font-size: 9px; display: block; text-transform: uppercase;">INVESTIGATION ID</span><strong class="font-mono">${d.metadata.investigationId}</strong></div>
      <div><span style="color: #64748b; font-weight: 600; font-size: 9px; display: block; text-transform: uppercase;">REPORT STATUS</span><strong>${d.metadata.reportStatus}</strong></div>
      <div><span style="color: #64748b; font-weight: 600; font-size: 9px; display: block; text-transform: uppercase;">GENERATED</span><span>${d.metadata.generated}</span></div>
      <div><span style="color: #64748b; font-weight: 600; font-size: 9px; display: block; text-transform: uppercase;">ANALYST SIGN-OFF</span><span>${d.metadata.analystSignOff}</span></div>
      <div><span style="color: #64748b; font-weight: 600; font-size: 9px; display: block; text-transform: uppercase;">DATASET ORIGIN</span><span>${d.metadata.datasetOrigin}</span></div>
      <div><span style="color: #64748b; font-weight: 600; font-size: 9px; display: block; text-transform: uppercase;">PRESERVED EVIDENCE</span><span>${d.metadata.preservedEvidence}</span></div>
      <div><span style="color: #64748b; font-weight: 600; font-size: 9px; display: block; text-transform: uppercase;">CONFIDENCE RATING</span><strong>${d.metadata.confidenceRating}</strong></div>
    </div>

    <!-- Abstract -->
    <div style="margin-bottom: 28px;">
      <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 6px;">FORMAL FORENSIC ABSTRACT</div>
      <div class="card-box font-serif" style="font-size: 13px; line-height: 1.6; color: #1e293b;">
        <p style="text-align: justify;"><strong style="font-family: 'IBM Plex Sans', sans-serif;">Abstract—</strong>${d.abstract}</p>
        <div style="margin-top: 10px; font-size: 11px; color: #64748b; font-family: 'IBM Plex Sans', sans-serif;">
          <strong>Keywords:</strong> ${d.keywords}
        </div>
      </div>
    </div>

    <!-- 1.0 Cover / Case Summary -->
    <div style="margin-bottom: 28px;" class="avoid-break">
      <div class="section-title"><span class="badge-black">1.0</span> COVER / CASE SUMMARY</div>
      <div class="card-box">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">TRIAGE & SIGNAL IDENTIFICATION:</div>
        <p style="font-size: 12px; color: #1e293b; margin-bottom: 12px;">${d.triageSummary}</p>
        
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">KEY FINDINGS & DIRECT EVIDENCE CORROBORATION:</div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
          ${d.keyFindings.map(f => `
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px;">
              <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span class="font-mono" style="font-weight: 700; color: ${f.status === 'FAIL' ? '#dc2626' : '#d97706'};">${f.id} ${f.status}</span>
                <span style="color: #94a3b8; font-size: 10px;">&rarr; ${f.ref}</span>
              </div>
              <div style="font-weight: 600; font-size: 12px; color: #0f172a;">${f.title}</div>
              <div style="font-size: 11px; color: #64748b;">${f.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- 2.0 Executive Summary -->
    <div style="margin-bottom: 28px;" class="avoid-break">
      <div class="section-title"><span class="badge-black">2.0</span> EXECUTIVE SUMMARY</div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px;">
        <div class="card-box" style="margin-bottom: 0;">
          <span style="font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block;">VERDICT</span>
          <div style="font-size: 16px; font-weight: 800; color: #dc2626; margin: 4px 0;">&bull; ${d.executive.verdict}</div>
          <span style="font-size: 11px; color: #64748b;">${d.executive.verdictSub}</span>
        </div>
        <div class="card-box" style="margin-bottom: 0;">
          <span style="font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block;">RISK SCORE</span>
          <div style="font-size: 16px; font-weight: 800; color: #dc2626; margin: 4px 0;">
            ${d.executive.riskScore} <span style="font-size: 12px; font-weight: 400; color: #94a3b8;">${d.executive.riskMax}</span>
          </div>
          <span style="font-size: 11px; color: #64748b;">${d.executive.riskSub}</span>
        </div>
        <div class="card-box" style="margin-bottom: 0;">
          <span style="font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block;">CONFIDENCE</span>
          <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 4px 0;">${d.executive.confidence}</div>
          <span style="font-size: 11px; color: #64748b;">${d.executive.confidenceSub}</span>
        </div>
        <div class="card-box" style="margin-bottom: 0;">
          <span style="font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block;">PRIMARY THREAT TYPE</span>
          <div style="margin: 4px 0;">
            <span class="badge-status badge-fail" style="font-size: 11px; padding: 2px 6px;">${d.executive.threatType}</span>
          </div>
          <span style="font-size: 11px; color: #64748b;">${d.executive.threatSub}</span>
        </div>
      </div>
      <div class="card-box">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">EXECUTIVE SYNTHESIS & CASE NARRATIVE:</div>
        <p class="font-serif" style="font-size: 13px; line-height: 1.6; color: #1e293b; text-align: justify; margin-bottom: 14px;">${d.executive.narrative}</p>
        
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">WHY ASHIELDER FLAGGED THIS EMAIL:</div>
        <ul style="list-style: none; padding-left: 0; margin-bottom: 12px; font-size: 12px; color: #1e293b;">
          ${d.executive.flaggedReasons.map(r => `<li style="margin-bottom: 4px; display: flex; align-items: center; gap: 6px;"><span style="color: #dc2626; font-weight: bold;">&bull;</span> ${r}</li>`).join('')}
        </ul>
        <div style="font-size: 11px; color: #64748b;">
          <strong>Corroborating Evidence:</strong> ${d.executive.corroboratingEvidence.map(e => `<span class="badge-status badge-neutral font-mono" style="margin-left: 4px;">${e}</span>`).join('')}
        </div>
      </div>
    </div>

    <!-- 3.0 Case Scope & Methodology -->
    <div style="margin-bottom: 28px;" class="avoid-break">
      <div class="section-title"><span class="badge-black">3.0</span> CASE SCOPE & METHODOLOGY</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
        <div class="card-box" style="margin-bottom: 0;">
          <strong>Investigation Objective:</strong>
          <p style="font-size: 12px; color: #475569; margin-top: 4px;">${d.methodology.objective}</p>
        </div>
        <div class="card-box" style="margin-bottom: 0;">
          <strong>Evidence Acquisition Method:</strong>
          <p style="font-size: 12px; color: #475569; margin-top: 4px;">${d.methodology.acquisitionMethod}</p>
        </div>
        <div class="card-box" style="margin-bottom: 0;">
          <strong>Source Ingestion Endpoint:</strong>
          <p style="font-size: 12px; color: #475569; margin-top: 4px;">${d.methodology.sourceEndpoint}</p>
        </div>
        <div class="card-box" style="margin-bottom: 0;">
          <strong>Analysis Scope:</strong>
          <p style="font-size: 12px; color: #475569; margin-top: 4px;">${d.methodology.scope}</p>
        </div>
      </div>
      <div class="card-box">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">FORENSIC PROCESSING PIPELINE:</div>
        <div style="font-size: 11px; color: #334155; line-height: 1.8;">
          ${d.methodology.pipeline.join(' <span style="color: #94a3b8;">&rarr;</span> ')}
        </div>
      </div>
    </div>

    <!-- 4.0 Evidence Register -->
    <div style="margin-bottom: 28px;" class="avoid-break">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div class="section-title" style="margin-bottom: 0;"><span class="badge-black">4.0</span> EVIDENCE REGISTER</div>
        <span style="font-size: 11px; color: #64748b;">7 Chain-Preserved Artifacts</span>
      </div>
      <table class="table-custom">
        <thead>
          <tr>
            <th>EVIDENCE ID</th>
            <th>TYPE</th>
            <th>DESCRIPTION</th>
            <th>SOURCE</th>
            <th>SHA-256 CHECKSUM (DEMO)</th>
            <th>ACQUIRED</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          ${d.evidenceRegister.map(e => `
            <tr>
              <td class="font-mono" style="font-weight: 700;">${e.id}</td>
              <td><strong>${e.type}</strong></td>
              <td style="color: #334155;">${e.description}</td>
              <td class="font-mono" style="font-size: 11px; color: #64748b;">${e.source}</td>
              <td class="font-mono" style="font-size: 11px; color: #475569;">${e.sha256}</td>
              <td style="font-size: 11px; color: #64748b;">${e.acquired}</td>
              <td><span class="badge-status badge-neutral">${e.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="font-size: 10px; color: #94a3b8; font-style: italic; margin-top: 4px;">Notice: All hashes are synthetic DEMO HASH VALUES used to illustrate cryptographic custody and state verification.</div>
    </div>

    <!-- 5.0 Chain of Custody & Chronology -->
    <div style="margin-bottom: 28px;" class="avoid-break">
      <div class="section-title"><span class="badge-black">5.0</span> CHAIN OF CUSTODY & INVESTIGATION CHRONOLOGY</div>
      <div class="card-box" style="margin-bottom: 12px;">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">LINEAR FORENSIC CUSTODY FLOW:</div>
        <div style="font-size: 11px; color: #334155;">
          ${d.custodyFlow.join(' <span style="color: #94a3b8;">&darr;</span> ')}
        </div>
      </div>
      <table class="table-custom">
        <thead>
          <tr>
            <th>TIMESTAMP (UTC)</th>
            <th>ACTION / EVENT</th>
            <th>ACTOR</th>
            <th>EVIDENCE REF</th>
            <th>RESULTING STATE / STATUS</th>
          </tr>
        </thead>
        <tbody>
          ${d.custodyChronology.map(c => `
            <tr>
              <td class="font-mono" style="font-size: 11px; color: #64748b;">${c.timestamp}</td>
              <td>${c.action}</td>
              <td><strong>${c.actor}</strong></td>
              <td class="font-mono">${c.evidenceRef}</td>
              <td style="color: #334155; font-size: 11px;">${c.resultingState}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- 6.0 Original Email Overview -->
    <div style="margin-bottom: 28px;" class="avoid-break">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div class="section-title" style="margin-bottom: 0;"><span class="badge-black">6.0</span> ORIGINAL EMAIL OVERVIEW</div>
        <span class="font-mono" style="font-size: 11px; color: #64748b;">[E-001] Original Email</span>
      </div>
      <div class="card-box" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 11px; margin-bottom: 12px;">
        <div><span style="color: #64748b; font-weight: 700;">FROM:</span> <span class="font-mono">${d.originalEmail.from}</span></div>
        <div><span style="color: #64748b; font-weight: 700;">TO:</span> <span class="font-mono">${d.originalEmail.to}</span></div>
        <div><span style="color: #64748b; font-weight: 700;">SUBJECT:</span> <strong>${d.originalEmail.subject}</strong></div>
        <div><span style="color: #64748b; font-weight: 700;">RECEIVED (UTC):</span> <span>${d.originalEmail.received}</span></div>
        <div><span style="color: #64748b; font-weight: 700;">MESSAGE-ID:</span> <span class="font-mono">${d.originalEmail.messageId}</span></div>
        <div><span style="color: #64748b; font-weight: 700;">REPLY-TO:</span> <span class="font-mono">${d.originalEmail.replyTo}</span></div>
      </div>
      <div class="card-box">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">DECODED MESSAGE BODY (DEFANGED TEXT PREVIEW):</div>
        <pre class="font-mono" style="font-size: 11px; color: #334155; white-space: pre-wrap; background: #ffffff; padding: 12px; border: 1px solid #e2e8f0; border-radius: 4px;">${d.originalEmail.bodyText}</pre>
      </div>
    </div>

    <!-- 7.0 Email Header Analysis -->
    <div style="margin-bottom: 28px;" class="avoid-break">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div class="section-title" style="margin-bottom: 0;"><span class="badge-black">7.0</span> EMAIL HEADER ANALYSIS</div>
        <span class="font-mono" style="font-size: 11px; color: #64748b;">[E-002] Headers</span>
      </div>
      <table class="table-custom">
        <thead>
          <tr>
            <th>HEADER FIELD</th>
            <th>VALUE</th>
            <th>ASSESSMENT</th>
            <th>STATUS</th>
            <th>EVIDENCE</th>
          </tr>
        </thead>
        <tbody>
          ${d.headersAnalysis.map(h => `
            <tr>
              <td><strong>${h.field}</strong></td>
              <td class="font-mono" style="font-size: 11px;">${h.value}</td>
              <td style="font-size: 11px; color: #334155;">${h.assessment}</td>
              <td><span class="badge-status ${h.status === 'FAIL' ? 'badge-fail' : h.status === 'FLAGGED' ? 'badge-suspicious' : h.status === 'VALID' ? 'badge-valid' : 'badge-neutral'}">${h.status}</span></td>
              <td class="font-mono" style="font-size: 11px;">${h.evidenceRef}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-top: 14px;">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">TRANSPORT RELAY HOPS SEQUENCE (RFC 5737 SAFE DOCUMENTATION IPS):</div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
          ${d.relayHops.map(hop => `
            <div class="card-box" style="margin-bottom: 0; padding: 10px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #64748b; font-weight: 700;">
                <span>${hop.hopNumber}</span>
                <span>${hop.time}</span>
              </div>
              <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin: 4px 0;">${hop.role}</div>
              <div class="font-mono" style="font-size: 11px; color: #2563eb;">${hop.ip}</div>
              <div style="font-size: 10px; color: #64748b; margin-top: 2px;">${hop.host}</div>
              <div style="font-size: 10px; color: #dc2626; font-weight: 600; margin-top: 4px;">${hop.state}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- 8.0 SPF / DKIM / DMARC -->
    <div style="margin-bottom: 28px;" class="avoid-break">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div class="section-title" style="margin-bottom: 0;"><span class="badge-black">8.0</span> SPF / DKIM / DMARC ANALYSIS</div>
        <span class="font-mono" style="font-size: 11px; color: #64748b;">[E-005] Authentication</span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 12px;">
        ${['spf', 'dkim', 'dmarc'].map(p => {
          const item = (d.authProtocols as any)[p];
          return `
            <div class="card-box" style="margin-bottom: 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-weight: 800; font-size: 14px; text-transform: uppercase;">${p}</span>
                <span class="badge-status badge-fail">${item.status}</span>
              </div>
              <div style="font-size: 10px; color: #64748b; margin-bottom: 6px;">Specification: ${item.spec}</div>
              <p style="font-size: 11px; color: #334155; margin-bottom: 8px;"><strong>Interpretation:</strong> ${item.interpretation}</p>
              <div style="font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase;">RAW HEADER LINE EXCERPT:</div>
              <pre class="font-mono" style="font-size: 10px; background: #ffffff; padding: 6px; border: 1px solid #e2e8f0; border-radius: 4px; white-space: pre-wrap; margin-top: 2px;">${item.rawHeader}</pre>
              <div style="font-size: 10px; color: #64748b; margin-top: 6px;">Evidence Reference: <span class="font-mono">${item.ref}</span></div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="card-box" style="font-size: 11px; font-style: italic; color: #475569;">
        <strong>Forensic Protocol Explanation:</strong> ${d.authProtocols.explanation}
      </div>
    </div>

    <!-- 9.0 URL Analysis -->
    <div style="margin-bottom: 28px;" class="avoid-break">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div class="section-title" style="margin-bottom: 0;"><span class="badge-black">9.0</span> URL ANALYSIS</div>
        <span class="font-mono" style="font-size: 11px; color: #64748b;">[E-003] Extracted URL</span>
      </div>
      <div class="card-box" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div>
          <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">DISPLAY-SAFE TARGET URL:</span>
          <div class="font-mono" style="font-size: 13px; font-weight: 700; color: #d97706; margin-top: 2px;">${d.urlAnalysis.targetUrl}</div>
          <div style="font-size: 10px; color: #64748b;">Defanged: ${d.urlAnalysis.defangedUrl}</div>
        </div>
        <div style="text-align: right;">
          <span class="badge-status badge-suspicious" style="font-size: 11px; padding: 3px 8px;">VERDICT: ${d.urlAnalysis.verdict}</span>
          <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 4px;">URL RISK: ${d.urlAnalysis.riskScore}</div>
        </div>
      </div>
      <div class="card-box" style="margin-bottom: 12px;">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">ARTIFACT ANALYSIS WORKFLOW SEQUENCE:</div>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px;">
          ${d.urlAnalysis.workflow.map(w => `
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; padding: 6px 8px; font-size: 10px;">
              <div style="color: #64748b; font-weight: 700;">${w.step} ${w.label}</div>
              <div style="color: #0f172a; margin-top: 2px;">${w.value}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <ul style="list-style: none; padding-left: 0; font-size: 11px; color: #334155;">
        ${d.urlAnalysis.bulletPoints.map(b => `<li style="margin-bottom: 4px;">&bull; ${b}</li>`).join('')}
      </ul>
    </div>

    <!-- 10.0 Attachment Analysis -->
    <div style="margin-bottom: 28px;" class="avoid-break">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div class="section-title" style="margin-bottom: 0;"><span class="badge-black">10.0</span> ATTACHMENT ANALYSIS</div>
        <span class="font-mono" style="font-size: 11px; color: #64748b;">[E-004] Attachment</span>
      </div>
      <div class="card-box" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div>
          <span style="font-size: 15px; font-weight: 800; color: #0f172a;">${d.attachmentAnalysis.filename}</span>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">MIME: ${d.attachmentAnalysis.mime} &bull; Size: ${d.attachmentAnalysis.size}</div>
          <div class="font-mono" style="font-size: 11px; color: #475569; margin-top: 2px;">SHA-256: ${d.attachmentAnalysis.sha256}</div>
        </div>
        <div>
          <span class="badge-status badge-fail" style="font-size: 11px; padding: 4px 8px;">${d.attachmentAnalysis.resultBadge}</span>
          <div style="font-size: 11px; color: #64748b; text-align: right; margin-top: 4px;">${d.attachmentAnalysis.confidence}</div>
        </div>
      </div>
      <div class="card-box" style="margin-bottom: 8px;">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">STATIC PDF OBJECT STRUCTURE HEURISTIC DETECTIONS:</div>
        <div style="display: grid; gap: 6px;">
          ${d.attachmentAnalysis.heuristics.map(h => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px 10px; font-size: 11px;">
              <div>
                <strong>${h.name}</strong> <span style="color: #64748b;">— ${h.detail}</span>
              </div>
              <span class="badge-status ${h.severity === 'Critical' || h.severity === 'High' ? 'badge-fail' : 'badge-suspicious'}">${h.severity}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div style="font-size: 10px; color: #64748b; font-style: italic;">${d.attachmentAnalysis.notice}</div>
    </div>

    <!-- 11.0 Threat Intelligence -->
    <div style="margin-bottom: 28px;" class="avoid-break">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div class="section-title" style="margin-bottom: 0;"><span class="badge-black">11.0</span> THREAT INTELLIGENCE</div>
        <span style="font-size: 11px; color: #64748b;">Synthetic Local Correlator</span>
      </div>
      <table class="table-custom">
        <thead>
          <tr>
            <th>INDICATOR</th>
            <th>TYPE</th>
            <th>SOURCE (DEMO)</th>
            <th>RESULT</th>
            <th>CONFIDENCE</th>
            <th>CHECKED (UTC)</th>
          </tr>
        </thead>
        <tbody>
          ${d.threatIntel.map(t => `
            <tr>
              <td class="font-mono" style="font-weight: 600;">${t.indicator}</td>
              <td>${t.type}</td>
              <td style="color: #64748b;">${t.source}</td>
              <td><span class="badge-status ${t.result === 'Malicious' ? 'badge-fail' : 'badge-suspicious'}">${t.result}</span></td>
              <td>${t.confidence}</td>
              <td class="font-mono" style="font-size: 11px; color: #64748b;">${t.checked}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="font-size: 10px; color: #94a3b8; font-style: italic; margin-top: 4px;">Notice: Indicators originate from internal synthetic demo repositories; no real external commercial threat feeds were queried.</div>
    </div>

    <!-- 12.0 AI / ML Analysis -->
    <div style="margin-bottom: 28px;" class="avoid-break">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div class="section-title" style="margin-bottom: 0;"><span class="badge-black">12.0</span> AI / ML ANALYSIS</div>
        <span class="font-mono" style="font-size: 11px; color: #64748b;">[E-007] Model Results</span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 12px;">
        ${d.aiAnalysis.models.map(m => `
          <div class="card-box" style="margin-bottom: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 10px; font-weight: 700; color: #64748b;">${m.name}</span>
              <span class="badge-status ${m.verdictSeverity === 'MALICIOUS' ? 'badge-fail' : 'badge-suspicious'}">${m.verdict}</span>
            </div>
            <div style="font-size: 10px; color: #64748b; margin-bottom: 6px;">Conf: <strong>${m.conf}</strong></div>
            <p style="font-size: 11px; color: #334155; line-height: 1.4;">${m.desc}</p>
          </div>
        `).join('')}
      </div>
      <div class="card-box" style="margin-bottom: 6px;">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">ENSEMBLE MULTI-SIGNAL REASONING DRIVER:</div>
        <p style="font-size: 12px; color: #1e293b; line-height: 1.5;">${d.aiAnalysis.driver}</p>
      </div>
      <div style="font-size: 10px; color: #94a3b8; font-style: italic;">${d.aiAnalysis.notice}</div>
    </div>

    <!-- 13.0 Analyst Review & Disposition -->
    <div style="margin-bottom: 28px;" class="avoid-break">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div class="section-title" style="margin-bottom: 0;"><span class="badge-black">13.0</span> ANALYST REVIEW & DISPOSITION</div>
        <span class="badge-status badge-valid" style="font-size: 10px; padding: 2px 6px;">${d.analystReview.badge}</span>
      </div>
      <div class="card-box" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 12px;">
        <div>
          <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block;">REVIEWING EXAMINER</span>
          <strong style="font-size: 12px; color: #0f172a; margin-top: 4px; display: block;">${d.analystReview.examiner}</strong>
        </div>
        <div>
          <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block;">ANALYST VERDICT DISPOSITION</span>
          <span style="font-size: 12px; font-weight: 700; color: #dc2626; margin-top: 4px; display: block;">&bull; ${d.analystReview.verdict}</span>
        </div>
        <div>
          <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block;">SIGN-OFF TIMESTAMP (UTC)</span>
          <span class="font-mono" style="font-size: 11px; color: #475569; margin-top: 4px; display: block;">${d.analystReview.timestamp}</span>
        </div>
      </div>
      <div class="card-box font-serif" style="font-size: 12px; line-height: 1.6; color: #1e293b; margin-bottom: 8px;">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px; font-family: 'IBM Plex Sans', sans-serif;">FREEFORM ANALYST EXAMINATION NOTES:</div>
        ${d.analystReview.notes}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b;">
        <span>Digital Sign-Off Digest: <strong class="font-mono">${d.analystReview.digest}</strong></span>
        <span class="badge-status badge-valid">DISPOSITION RECORDED & SEALED</span>
      </div>
    </div>

    <!-- 14.0 Correlation & Risk Assessment -->
    <div style="margin-bottom: 28px;" class="avoid-break">
      <div class="section-title"><span class="badge-black">14.0</span> CORRELATION & RISK ASSESSMENT</div>
      <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 14px;">
        <div style="display: grid; gap: 6px;">
          ${d.fusionSignals.map(s => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 6px 10px; font-size: 11px; display: flex; justify-content: space-between;">
              <span>${s.label}</span>
              <strong style="color: #2563eb;">&rarr; ${s.weight}</strong>
            </div>
          `).join('')}
        </div>
        <div style="font-size: 20px; color: #94a3b8; text-align: center;">&rarr;</div>
        <div class="card-box" style="margin-bottom: 0; text-align: center;">
          <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block;">CONSOLIDATED DISPOSITION</span>
          <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin: 4px 0;">Signal correlation complete.</div>
          <p style="font-size: 10px; color: #64748b;">Refer to Section 2.0 (Executive Summary) for aggregate verdict, risk score, and primary classification.</p>
        </div>
      </div>
      <table class="table-custom">
        <thead>
          <tr>
            <th>SIGNAL COMPONENT</th>
            <th>DEMO WEIGHT</th>
            <th>SCORE CONTRIBUTION</th>
            <th>STATE</th>
          </tr>
        </thead>
        <tbody>
          ${d.riskWeights.map(r => `
            <tr>
              <td><strong>${r.component}</strong></td>
              <td>${r.weight}</td>
              <td class="font-mono"><strong>${r.scoreContribution}</strong></td>
              <td><span class="badge-status ${r.state === 'Fail' || r.state === 'Malicious' ? 'badge-fail' : r.state === 'Suspicious' ? 'badge-suspicious' : 'badge-neutral'}">${r.state}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- 15.0 Final Findings -->
    <div style="margin-bottom: 28px;" class="avoid-break">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div class="section-title" style="margin-bottom: 0;"><span class="badge-black">15.0</span> FINAL FINDINGS</div>
        <span style="font-size: 11px; color: #64748b;">For overall threat score & verdict, see Section 2.0</span>
      </div>
      <div style="display: grid; gap: 10px;">
        ${d.findings.map(f => `
          <div class="card-box" style="margin-bottom: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 13px; font-weight: 700; color: #0f172a;"><span class="font-mono">${f.id}</span> ${f.title}</span>
              <span class="badge-status ${f.severity === 'MALICIOUS' ? 'badge-fail' : 'badge-suspicious'}">${f.severity}</span>
            </div>
            <p style="font-size: 12px; color: #334155; line-height: 1.5; margin-bottom: 8px;">${f.summary}</p>
            <div style="font-size: 11px; color: #64748b;">
              <strong>Corroborating Evidence:</strong> ${f.corroboratingEvidence.map(e => `<span class="badge-status badge-neutral font-mono" style="margin-left: 4px;">${e}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 16.0 Conclusion & Recommendation -->
    <div style="margin-bottom: 28px;" class="avoid-break">
      <div class="section-title"><span class="badge-black">16.0</span> CONCLUSION & RECOMMENDATION</div>
      <div class="card-box" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div>
          <span style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">CASE DISPOSITION CROSS-REFERENCE</span>
          <p style="font-size: 12px; color: #334155; margin-top: 2px;">Following multi-vector correlation and analyst sign-off, see <strong>Section 2.0 (Executive Summary)</strong> for aggregate verdict, risk score, and primary threat classification.</p>
        </div>
        <span class="badge-status badge-neutral" style="white-space: nowrap; margin-left: 12px;">Disposition Finalized</span>
      </div>
      <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">RECOMMENDED INCIDENT RESPONSE ACTIONS:</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
        ${d.recommendations.map(r => `
          <div class="card-box" style="margin-bottom: 0; padding: 10px;">
            <div style="font-weight: 700; font-size: 12px; color: #0f172a; margin-bottom: 4px;">${r.action}</div>
            <p style="font-size: 11px; color: #475569; line-height: 1.4;">${r.detail}</p>
          </div>
        `).join('')}
      </div>
      <div style="font-size: 11px; font-style: italic; color: #64748b;">
        <strong>OPERATIONAL SECURITY DISCLAIMER:</strong> ${d.disclaimer}
      </div>
    </div>

    <!-- 17.0 Investigation Limitations -->
    <div style="margin-bottom: 28px;" class="avoid-break">
      <div class="section-title"><span class="badge-black">17.0</span> INVESTIGATION LIMITATIONS</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px; color: #475569; line-height: 1.5;">
        ${d.limitations.map(l => `<div class="card-box" style="margin-bottom: 0; padding: 8px 10px;">${l}</div>`).join('')}
      </div>
    </div>

    <!-- 18.0 Appendix — Evidence References -->
    <div style="margin-bottom: 28px;" class="avoid-break">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div class="section-title" style="margin-bottom: 0;"><span class="badge-black">18.0</span> APPENDIX — EVIDENCE REFERENCES</div>
        <span style="font-size: 11px; color: #64748b;">Cross-Referenced Corpus</span>
      </div>
      <div style="display: grid; gap: 8px;">
        ${d.appendix.map(a => `
          <div class="card-box" style="margin-bottom: 0; padding: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <strong style="font-size: 12px; color: #0f172a;"><span class="font-mono">${a.id}</span> ${a.title}</strong>
              <span class="font-mono" style="font-size: 10px; color: #64748b;">${a.hash}</span>
            </div>
            <p style="font-size: 11px; color: #475569; margin-bottom: 2px;">${a.desc}</p>
            <div class="font-mono" style="font-size: 10px; color: #64748b;">${a.meta}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Certified Footer -->
    <div style="border-top: 2px solid #0f172a; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #64748b; margin-top: 36px;">
      <div>
        <strong>${d.footer.engine}</strong> &bull; ${d.footer.caseString} &bull; ${d.footer.timestamp}
      </div>
      <div>
        ${d.footer.pageInfo} &bull; ${d.footer.manifestCheck} &bull; <strong>${d.footer.certified}</strong>
      </div>
    </div>
  </div>
</body>
</html>`;
}

