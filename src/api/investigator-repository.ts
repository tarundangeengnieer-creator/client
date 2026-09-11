/**
 * ASHIELDER Investigator Repository & Service Adapter
 *
 * Prepares strict API boundaries for backend integration:
 * - GET /cases/{id}/timeline
 * - GET /cases/{id}/graph
 * - GET /cases?similar_to={case_id}
 * - POST /cases/{id}/link
 * - POST /cases/{id}/merge
 * - GET /evidence/{id}
 * - POST /evidence/{id}/annotate
 * - GET /emails/{id}/entity
 *
 * Implements a realistic, tenant-scoped mock adapter that can be seamlessly
 * replaced by actual REST/GraphQL endpoints without modifying UI components.
 */

import {
  InvestigatorCase,
  InvestigatorEvidence,
  TimelineEvent,
  GraphNode,
  GraphEdge,
  RelatedCaseMatch,
  EmailEntity,
  GeographicActivityHop,
  ThreatIntelEnrichment,
} from '../domain/investigator.ts';

export interface InvestigatorRepository {
  getCases(tenantId: string): Promise<InvestigatorCase[]>;
  getCase(caseId: string, tenantId: string): Promise<InvestigatorCase | null>;
  getTimeline(caseId: string, tenantId: string): Promise<TimelineEvent[]>;
  getGraph(
    caseId: string,
    tenantId: string,
    maxDepth?: number,
    centerNodeId?: string
  ): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }>;
  expandGraphNode(
    caseId: string,
    nodeId: string,
    tenantId: string
  ): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }>;
  getRelatedCases(caseId: string, tenantId: string): Promise<RelatedCaseMatch[]>;
  linkCase(
    caseId: string,
    targetCaseId: string,
    justification: string,
    tenantId: string
  ): Promise<{ success: boolean; message: string; linkedAt: string }>;
  mergeCases(
    caseId: string,
    targetCaseId: string,
    campaignName: string,
    tenantId: string
  ): Promise<{ success: boolean; campaignId: string; message: string }>;
  getCaseEvidence(caseId: string, tenantId: string): Promise<InvestigatorEvidence[]>;
  getEvidence(evidenceId: string, tenantId: string): Promise<InvestigatorEvidence | null>;
  annotateEvidence(
    evidenceId: string,
    note: string,
    author: string,
    tenantId: string
  ): Promise<InvestigatorEvidence>;
  verifyEvidence(
    evidenceId: string,
    state: 'VERIFIED' | 'DISPUTED',
    author: string,
    tenantId: string
  ): Promise<InvestigatorEvidence>;
  getEmailEntity(emailId: string, tenantId: string): Promise<EmailEntity | null>;
  getGeographicActivity(caseId: string, tenantId: string): Promise<GeographicActivityHop[]>;
  getThreatIntel(indicator: string, tenantId: string): Promise<ThreatIntelEnrichment | null>;
  escalateToFraudIR(
    caseId: string,
    rationale: string,
    urgency: string,
    tenantId: string
  ): Promise<{ success: boolean; escalationId: string; timestamp: string }>;
  exportForensicReport(
    caseId: string,
    tenantId: string
  ): Promise<{ reportId: string; downloadUrl: string; generatedAt: string }>;
}

/**
 * Robust mock implementation seeded with realistic forensic specimens.
 * All mutations are stored in memory and preserved during the session.
 */
class MockInvestigatorRepository implements InvestigatorRepository {
  private cases: InvestigatorCase[] = [
    {
      case_id: 'CASE-2026-8812',
      tenant_id: 'tnt_acme_soc',
      status: 'Open',
      opened_at: '2026-09-08T08:14:22Z',
      opened_by: 'Automated Ingest / Heuristic Escalation',
      evidence_confidence: 88,
      related_case_ids: ['CASE-2026-8790', 'CASE-2026-8651'],
      subject: 'URGENT: Disputed Invoice Wire Transfer Confirmation (#INV-9041)',
      sender: 'accounts-billing@paypal1-secure.com',
      recipient: 'finance.controller@acme-corp.com',
      risk_score: 92,
      verdict: 'MALICIOUS',
      summary:
        'Targeted credential phishing & wire fraud lure deploying brand impersonation of PayPal Enterprise. Origin relay routed through an active German Tor exit node with newly-registered lookalike domain and embedded credential harvesting webhook.',
      assigned_investigator: 'Ankit Sharma',
      primary_ioc: 'paypal1-secure.com/invoice',
      origin_ip: '185.220.101.5',
      origin_country: 'Germany',
      is_tor_exit: true,
      campaign_id: 'CMP-PHISH-FIN-2026',
    },
    {
      case_id: 'CASE-2026-8815',
      tenant_id: 'tnt_acme_soc',
      status: 'Evidence Pending',
      opened_at: '2026-09-07T14:32:00Z',
      opened_by: 'SOC Tier 2 Escalation (Alice SOC)',
      evidence_confidence: 74,
      related_case_ids: ['CASE-2026-8812'],
      subject: 'Updated Banking Details for Upcoming Q3 Settlement',
      sender: 'invoicing@vendor-portal-direct.in',
      recipient: 'treasury@acme-corp.com',
      risk_score: 78,
      verdict: 'SUSPICIOUS',
      summary:
        'Suspected Business Email Compromise (BEC) with vendor bank redirect. Domain vendor-portal-direct.in was registered 48 hours prior to email dispatch. DMARC policy absent and SPF softfail observed.',
      assigned_investigator: 'Ankit Sharma',
      primary_ioc: 'vendor-portal-direct.in',
      origin_ip: '103.251.167.22',
      origin_country: 'India',
      is_tor_exit: false,
    },
    {
      case_id: 'CASE-2026-8819',
      tenant_id: 'tnt_acme_soc',
      status: 'Ready for Report',
      opened_at: '2026-09-06T11:05:40Z',
      opened_by: 'Ankit Sharma',
      evidence_confidence: 96,
      related_case_ids: ['CASE-2026-8744'],
      subject: 'Executive Compensation & Q3 Performance Bonus Breakdown',
      sender: 'ceo-office@exec-acme-board.com',
      recipient: 'vps@acme-corp.com',
      risk_score: 96,
      verdict: 'MALICIOUS',
      summary:
        'Spearphishing delivery of weaponized Windows PE payload disguised with double extension (Executive_Bonus_Q3.docx.exe). Magic bytes confirm MS-DOS header with encrypted C2 payload beaconing to 91.240.118.172.',
      assigned_investigator: 'Ankit Sharma',
      primary_ioc: 'Executive_Bonus_Q3.docx.exe',
      origin_ip: '91.240.118.172',
      origin_country: 'Romania',
      is_tor_exit: false,
      campaign_id: 'CMP-APT-EXEC-2026',
    },
    {
      case_id: 'CASE-2026-8824',
      tenant_id: 'tnt_acme_soc',
      status: 'Open',
      opened_at: '2026-09-09T03:45:12Z',
      opened_by: 'Autonomous Threat Triage',
      evidence_confidence: 82,
      related_case_ids: [],
      subject: 'Microsoft 365: Re-authenticate Session Immediately to Avoid Service Interruption',
      sender: 'compliance@login-microsoftonline-sec.com',
      recipient: 'all-staff@acme-corp.com',
      risk_score: 84,
      verdict: 'MALICIOUS',
      summary:
        'Cloud credential theft attempt mimicking Microsoft Entra ID authentication challenge. Reverse proxy infrastructure harvesting session tokens to bypass conditional access MFA.',
      assigned_investigator: 'Ankit Sharma',
      primary_ioc: 'login-microsoftonline-sec.com',
      origin_ip: '194.26.29.112',
      origin_country: 'Netherlands',
      is_tor_exit: false,
    },
  ];

  private evidenceStore: Record<string, InvestigatorEvidence[]> = {
    'CASE-2026-8812': [
      {
        evidence_id: 'EVD-8812-001',
        case_id: 'CASE-2026-8812',
        tenant_id: 'tnt_acme_soc',
        type: 'RAW EVIDENCE',
        category: 'HEADER',
        title: 'RFC 5322 Inbound Header Trace',
        description:
          'Original Received headers proving dispatch from unauthorized Tor relay hop (185.220.101.5) claiming to be mail.paypal.com.',
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        collected_at: '2026-09-08T08:14:24Z',
        collected_by: 'MTA Ingestion Agent v4.2',
        verification_state: 'VERIFIED',
        source_ref: 'Message-ID: <202609080814.x88EEM@paypal1-secure.com>',
        annotations: [
          {
            id: 'ann-1',
            author: 'Ankit Sharma',
            timestamp: '2026-09-08T09:20:10Z',
            note: 'Confirmed header syntax anomaly: Date header timezone offset does not match originating relay timestamp.',
          },
        ],
        immutable_raw_snippet:
          'Received: from mail.paypal1-secure.com (unknown [185.220.101.5])\n\tby mta-inbound-02.acme-corp.com (Postfix) with ESMTPS id 4StLzq19vNz\n\tfor <finance.controller@acme-corp.com>; Tue, 8 Sep 2026 08:14:22 +0000 (UTC)',
        weight: 35,
        confidence: 0.96,
      },
      {
        evidence_id: 'EVD-8812-002',
        case_id: 'CASE-2026-8812',
        tenant_id: 'tnt_acme_soc',
        type: 'RAW EVIDENCE',
        category: 'AUTHENTICATION',
        title: 'Cryptographic Auth Failure Matrix (SPF/DKIM/DMARC)',
        description:
          'DMARC policy rejection: Envelope domain paypal1-secure.com fails strict alignment with verified brand PayPal, Inc. (paypal.com). SPF record returned softfail from IP range.',
        hash: 'b4a83e01a88b8fa28f411b98a0fcd5efc076579a6cb6e72b4f2c524316885661',
        collected_at: '2026-09-08T08:14:25Z',
        collected_by: 'Autonomous Auth Inspector',
        verification_state: 'VERIFIED',
        source_ref: 'Authentication-Results: mta-inbound-02.acme-corp.com',
        annotations: [],
        immutable_raw_snippet:
          'Authentication-Results: mta-inbound-02.acme-corp.com; dkim=neutral (no key); dmarc=fail (p=reject dis=none) header.from=paypal1-secure.com; spf=softfail (mta: 185.220.101.5)',
        weight: 25,
        confidence: 0.94,
      },
      {
        evidence_id: 'EVD-8812-003',
        case_id: 'CASE-2026-8812',
        tenant_id: 'tnt_acme_soc',
        type: 'THREAT INTELLIGENCE',
        category: 'NETWORK',
        title: 'Tor Exit Node Geolocation & Network Telemetry',
        description:
          'Origin IP 185.220.101.5 correlates with known Tor Exit Node operated by AS205100 in Frankfurt, Germany. Multiple active malicious abuse reports recorded within the last 14 days.',
        hash: 'f721d0a51923e20e88b22a0194883f3e9c1c4f52e3e84323891456bc992a41d9',
        collected_at: '2026-09-08T08:14:26Z',
        collected_by: 'Threat Intel Enricher (AbuseIPDB + OTX)',
        verification_state: 'VERIFIED',
        source_ref: 'Indicator: 185.220.101.5 (ASN 205100)',
        annotations: [
          {
            id: 'ann-2',
            author: 'Ankit Sharma',
            timestamp: '2026-09-08T09:45:00Z',
            note: 'Cross-referenced with internal case history: exact same exit node utilized in Case #CASE-2026-8790 9 days ago.',
          },
        ],
        immutable_raw_snippet:
          'ASN: AS205100 | Country: DE (Germany) | City: Frankfurt am Main | Usage Type: Data Center/Web Hosting/Transit | Tor Exit Node: YES (Confidence 100%)',
        weight: 20,
        confidence: 0.99,
      },
      {
        evidence_id: 'EVD-8812-004',
        case_id: 'CASE-2026-8812',
        tenant_id: 'tnt_acme_soc',
        type: 'AI FINDING',
        category: 'CONTENT',
        title: 'NLP Impersonation & Coercion Signal',
        description:
          'Heuristic NLP model identified synthetic urgency intent (0.91) paired with fraudulent wire redirection commands targeting Accounts Payable staff.',
        hash: '2c5a2e998144b670f5e4129b8c067e713d2f2fae804f56f15777df4c9bcf01e4',
        collected_at: '2026-09-08T08:14:27Z',
        collected_by: 'Groq/Llama-3.3 Reasoning Core',
        verification_state: 'UNVERIFIED',
        source_ref: 'Model: ashielder-intent-bert-v2.1',
        annotations: [],
        immutable_raw_snippet:
          'Intent: WIRE_FRAUD_URGENT | Confidence: 0.914 | Key tokens: ["final notice", "immediate wire transfer", "suspend account", "dispute reference #INV-9041"]',
        weight: 15,
        confidence: 0.89,
      },
      {
        evidence_id: 'EVD-8812-005',
        case_id: 'CASE-2026-8812',
        tenant_id: 'tnt_acme_soc',
        type: 'CORRELATION RESULT',
        category: 'URL',
        title: 'Lookalike Domain Cluster Correlation',
        description:
          'Domain paypal1-secure.com registered at NameSilo LLC at 2026-09-07 22:18:00 UTC (10 hours prior to email dispatch). Host DNS points to fast-flux IP pool matching adversary campaign CMP-PHISH-FIN-2026.',
        hash: '8f4c2e61a87756e89a3f1245cd998b1e4f62a1b9c8d7e6f5a4b3c2d1e0f9a8b7',
        collected_at: '2026-09-08T08:15:02Z',
        collected_by: 'Campaign Clustering Engine',
        verification_state: 'VERIFIED',
        source_ref: 'Domain: paypal1-secure.com (Registrar: NameSilo LLC)',
        annotations: [],
        immutable_raw_snippet:
          'Domain Age: 10 hours | Registrar: NameSilo | Nameservers: ns1.bulletproof-dns.org, ns2.bulletproof-dns.org | WHOIS Privacy: Enabled',
        weight: 20,
        confidence: 0.95,
      },
    ],
  };

  private timelineStore: Record<string, TimelineEvent[]> = {
    'CASE-2026-8812': [
      {
        event_id: 'EVT-8812-01',
        case_id: 'CASE-2026-8812',
        tenant_id: 'tnt_acme_soc',
        event_type: 'Received-chain hop',
        timestamp: '2026-09-08T08:14:18Z',
        summary: 'Inbound connection initiated from origin relay 185.220.101.5 to edge gateway mta-inbound-02.',
        relevance: 'HIGH',
        source_ref: 'MTA edge log #mta-02',
        evidence_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        mitre_technique: 'T1583.001 - Domains',
        associated_entity_id: 'node-ip-185',
        evidence_id: 'EVD-8812-001',
      },
      {
        event_id: 'EVT-8812-02',
        case_id: 'CASE-2026-8812',
        tenant_id: 'tnt_acme_soc',
        event_type: 'Email received',
        timestamp: '2026-09-08T08:14:22Z',
        summary: 'MIME specimen delivered with subject "URGENT: Disputed Invoice Wire Transfer Confirmation (#INV-9041)" to finance.controller@acme-corp.com.',
        relevance: 'MEDIUM',
        source_ref: 'RFC 5322 Ingestion Spool',
        evidence_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        mitre_technique: 'T1566.002 - Spearphishing Link',
        associated_entity_id: 'node-email-root',
        evidence_id: 'EVD-8812-001',
      },
      {
        event_id: 'EVT-8812-03',
        case_id: 'CASE-2026-8812',
        tenant_id: 'tnt_acme_soc',
        event_type: 'Threat-intelligence enrichment',
        timestamp: '2026-09-08T08:14:26Z',
        summary: 'Origin IP 185.220.101.5 flagged as active Tor Exit Node in Frankfurt, Germany (AS205100).',
        relevance: 'CRITICAL',
        source_ref: 'Tor Project Directory + AbuseIPDB Feed',
        evidence_hash: 'f721d0a51923e20e88b22a0194883f3e9c1c4f52e3e84323891456bc992a41d9',
        mitre_technique: 'T1090.003 - Multi-hop Proxy',
        associated_entity_id: 'node-ip-185',
        evidence_id: 'EVD-8812-003',
      },
      {
        event_id: 'EVT-8812-04',
        case_id: 'CASE-2026-8812',
        tenant_id: 'tnt_acme_soc',
        event_type: 'URL click',
        timestamp: '2026-09-08T08:14:30Z',
        summary: 'Automated sandbox URL extraction detected target href "https://paypal1-secure.com/invoice/INV-9041/auth".',
        relevance: 'CRITICAL',
        source_ref: 'MIME HTML Parser DOM walker',
        evidence_hash: '8f4c2e61a87756e89a3f1245cd998b1e4f62a1b9c8d7e6f5a4b3c2d1e0f9a8b7',
        mitre_technique: 'T1204.001 - User Execution: Malicious Link',
        associated_entity_id: 'node-url-invoice',
        evidence_id: 'EVD-8812-005',
      },
      {
        event_id: 'EVT-8812-05',
        case_id: 'CASE-2026-8812',
        tenant_id: 'tnt_acme_soc',
        event_type: 'Attachment activity',
        timestamp: '2026-09-08T08:14:35Z',
        summary: 'Inspected embedded HTML attachment invoice_statement_9041.html containing obfuscated credential harvest script.',
        relevance: 'HIGH',
        source_ref: 'Sandbox Static Analyzer',
        evidence_hash: '2c5a2e998144b670f5e4129b8c067e713d2f2fae804f56f15777df4c9bcf01e4',
        mitre_technique: 'T1027.006 - HTML Smuggling',
        associated_entity_id: 'node-att-html',
      },
      {
        event_id: 'EVT-8812-06',
        case_id: 'CASE-2026-8812',
        tenant_id: 'tnt_acme_soc',
        event_type: 'Analyst action',
        timestamp: '2026-09-08T09:20:10Z',
        summary: 'Investigator Ankit Sharma verified RFC header evidence and linked correlated historical case #CASE-2026-8790.',
        relevance: 'INFO',
        source_ref: 'Investigator Workbench Audit Log',
        evidence_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        associated_entity_id: 'node-case-8790',
      },
    ],
  };

  private graphStore: Record<string, { nodes: GraphNode[]; edges: GraphEdge[] }> = {
    'CASE-2026-8812': {
      nodes: [
        {
          id: 'node-email-root',
          type: 'Email',
          label: 'Email Specimen',
          value: 'URGENT: Disputed Invoice Wire Transfer',
          confidence: 96,
          first_seen: '2026-09-08T08:14:22Z',
          last_seen: '2026-09-08T08:14:22Z',
          depth: 0,
          reputation: 'malicious',
          has_more_relations: false,
          attributes: {
            subject: 'URGENT: Disputed Invoice Wire Transfer Confirmation (#INV-9041)',
            message_id: '<202609080814.x88EEM@paypal1-secure.com>',
            spf: 'FAIL',
            dkim: 'NONE',
            dmarc: 'REJECT',
          },
        },
        {
          id: 'node-sender',
          type: 'Sender',
          label: 'Sender',
          value: 'accounts-billing@paypal1-secure.com',
          confidence: 94,
          first_seen: '2026-09-08T08:14:18Z',
          last_seen: '2026-09-08T08:14:22Z',
          depth: 1,
          reputation: 'malicious',
          has_more_relations: true,
        },
        {
          id: 'node-recipient',
          type: 'Recipient',
          label: 'Recipient',
          value: 'finance.controller@acme-corp.com',
          confidence: 100,
          first_seen: '2024-01-15T00:00:00Z',
          last_seen: '2026-09-08T08:14:22Z',
          depth: 1,
          reputation: 'benign',
          has_more_relations: false,
        },
        {
          id: 'node-domain-paypal1',
          type: 'Domain',
          label: 'Lookalike Domain',
          value: 'paypal1-secure.com',
          confidence: 92,
          first_seen: '2026-09-07T22:18:00Z',
          last_seen: '2026-09-08T08:14:22Z',
          depth: 2,
          reputation: 'malicious',
          has_more_relations: true,
          attributes: {
            registrar: 'NameSilo LLC',
            age_hours: 10,
            nameservers: 'ns1.bulletproof-dns.org',
          },
        },
        {
          id: 'node-url-invoice',
          type: 'URL',
          label: 'Phishing URL',
          value: 'paypal1-secure.com/invoice/INV-9041/auth',
          confidence: 95,
          first_seen: '2026-09-08T08:14:22Z',
          last_seen: '2026-09-08T08:14:30Z',
          depth: 2,
          reputation: 'malicious',
          has_more_relations: true,
        },
        {
          id: 'node-ip-185',
          type: 'Source IP',
          label: 'Tor Exit Origin',
          value: '185.220.101.5',
          confidence: 99,
          first_seen: '2026-08-20T11:00:00Z',
          last_seen: '2026-09-08T08:14:18Z',
          depth: 2,
          reputation: 'malicious',
          has_more_relations: true,
          attributes: {
            country: 'Germany (DE)',
            city: 'Frankfurt',
            asn: 'AS205100',
            is_tor: true,
          },
        },
        {
          id: 'node-att-html',
          type: 'Attachment',
          label: 'Attachment',
          value: 'invoice_statement_9041.html',
          confidence: 89,
          first_seen: '2026-09-08T08:14:22Z',
          last_seen: '2026-09-08T08:14:35Z',
          depth: 1,
          reputation: 'suspicious',
          has_more_relations: false,
          attributes: {
            sha256: '2c5a2e998144b670f5e4129b8c067e713d2f2fae804f56f15777df4c9bcf01e4',
            mime: 'text/html',
            size_bytes: 14280,
          },
        },
        {
          id: 'node-case-8790',
          type: 'Related Case',
          label: 'Historical Case',
          value: 'CASE-2026-8790',
          confidence: 87,
          first_seen: '2026-08-30T10:15:00Z',
          last_seen: '2026-08-30T10:15:00Z',
          depth: 2,
          reputation: 'malicious',
          has_more_relations: true,
          attributes: {
            similarity: '87% Shared Tor exit IP 185.220.101.5 and PayPal lure template',
          },
        },
        {
          id: 'node-ti-indicator',
          type: 'Threat Intelligence Indicator',
          label: 'TI Indicator',
          value: 'OTX:TorExit-Cluster-44',
          confidence: 96,
          first_seen: '2026-07-12T00:00:00Z',
          last_seen: '2026-09-08T08:14:26Z',
          depth: 2,
          reputation: 'malicious',
          has_more_relations: false,
          attributes: {
            provider: 'AlienVault OTX',
            threat_group: 'FIN7 / Impersonation Cluster',
          },
        },
      ],
      edges: [
        {
          id: 'edge-1',
          source: 'node-email-root',
          target: 'node-sender',
          relationship_type: 'sent_from',
          label: 'Sent From',
          confidence: 0.98,
          provenance: 'OBSERVED',
          evidence_source: 'RFC 5322 From: Header',
          observed_at: '2026-09-08T08:14:18Z',
          source_record: 'RFC-5322-MIME-RAW',
          evidence_id: 'EVD-8812-001',
        },
        {
          id: 'edge-2',
          source: 'node-email-root',
          target: 'node-recipient',
          relationship_type: 'received_by',
          label: 'Targeted To',
          confidence: 1.0,
          provenance: 'OBSERVED',
          evidence_source: 'RFC 5322 To: Header',
          observed_at: '2026-09-08T08:14:22Z',
          source_record: 'MTA Inbound Envelope Enclosure',
          evidence_id: 'EVD-8812-001',
        },
        {
          id: 'edge-3',
          source: 'node-sender',
          target: 'node-domain-paypal1',
          relationship_type: 'domain_of',
          label: 'Registered Under',
          confidence: 0.99,
          provenance: 'OBSERVED',
          evidence_source: 'DNS Domain Hierarchy Parse',
          observed_at: '2026-09-08T08:14:22Z',
          source_record: 'RFC 5321 Sender Domain Extraction',
          evidence_id: 'EVD-8812-005',
        },
        {
          id: 'edge-4',
          source: 'node-domain-paypal1',
          target: 'node-url-invoice',
          relationship_type: 'hosts_path',
          label: 'Hosts URL Path',
          confidence: 0.95,
          provenance: 'OBSERVED',
          evidence_source: 'HTML Body URL Extraction',
          observed_at: '2026-09-08T08:14:24Z',
          source_record: 'MIME Part text/html AST Crawl',
          evidence_id: 'EVD-8812-002',
        },
        {
          id: 'edge-5',
          source: 'node-url-invoice',
          target: 'node-ip-185',
          relationship_type: 'resolves_to',
          label: 'A-Record Resolves To',
          confidence: 0.92,
          provenance: 'ENRICHED',
          evidence_source: 'Passive DNS Resolution Telemetry',
          observed_at: '2026-09-08T08:14:25Z',
          source_record: 'pDNS A-Record Telemetry Cache',
          evidence_id: 'EVD-8812-005',
        },
        {
          id: 'edge-6',
          source: 'node-email-root',
          target: 'node-att-html',
          relationship_type: 'delivers',
          label: 'Contains MIME Body',
          confidence: 1.0,
          provenance: 'OBSERVED',
          evidence_source: 'MIME Attachment Stream Enclosure',
          observed_at: '2026-09-08T08:14:22Z',
          source_record: 'MIME Boundary: ----=_NextPart_001_8812',
          evidence_id: 'EVD-8812-003',
        },
        {
          id: 'edge-7',
          source: 'node-ip-185',
          target: 'node-case-8790',
          relationship_type: 'associated_case',
          label: 'Shared Tor Hop In Case',
          confidence: 0.87,
          provenance: 'INFERRED',
          evidence_source: 'Tenant Incident Clustering Algorithm',
          observed_at: '2026-09-08T08:15:00Z',
          source_record: 'Cross-Incident IOC Correlation Hypothesis',
          evidence_id: 'EVD-8812-005',
        },
        {
          id: 'edge-8',
          source: 'node-ip-185',
          target: 'node-ti-indicator',
          relationship_type: 'threat_indicator',
          label: 'Known Threat Signature',
          confidence: 0.96,
          provenance: 'ENRICHED',
          evidence_source: 'Tor Project Directory + OTX Pulse',
          observed_at: '2026-09-08T08:14:26Z',
          source_record: 'AlienVault OTX Pulse #44-TorExit',
          evidence_id: 'EVD-8812-004',
        },
      ],
    },
  };

  private relatedCasesStore: Record<string, RelatedCaseMatch[]> = {
    'CASE-2026-8812': [
      {
        case_id: 'CASE-2026-8790',
        tenant_id: 'tnt_acme_soc',
        similarity_basis: 'Shared origin Tor exit node (185.220.101.5); Identical PayPal brand impersonation lure',
        similarity_score: 87,
        date: '2026-08-30T10:15:00Z',
        status: 'Closed',
        subject: 'PayPal Billing Notice: Urgent action required on account #8821',
        shared_iocs: ['185.220.101.5', 'paypal-billing-notice.com'],
        is_linked: true,
      },
      {
        case_id: 'CASE-2026-8651',
        tenant_id: 'tnt_acme_soc',
        similarity_basis: 'Shared bulletproof DNS infrastructure (ns1.bulletproof-dns.org); Matching WHOIS registrar',
        similarity_score: 76,
        date: '2026-08-14T16:40:00Z',
        status: 'Closed',
        subject: 'Accounts Department - Overdue Statement Wire Request',
        shared_iocs: ['ns1.bulletproof-dns.org', 'NameSilo LLC'],
        is_linked: false,
      },
      {
        case_id: 'CASE-2026-8815',
        tenant_id: 'tnt_acme_soc',
        similarity_basis: 'Shared financial controller recipient; Matching invoice keyword phrasing',
        similarity_score: 64,
        date: '2026-09-07T14:32:00Z',
        status: 'Evidence Pending',
        subject: 'Updated Banking Details for Upcoming Q3 Settlement',
        shared_iocs: ['finance.controller@acme-corp.com'],
        is_linked: false,
      },
    ],
  };

  private emailEntitiesStore: Record<string, EmailEntity> = {
    'CASE-2026-8812': {
      email_id: 'EML-8812-ROOT',
      tenant_id: 'tnt_acme_soc',
      sender: 'accounts-billing@paypal1-secure.com',
      recipients: ['finance.controller@acme-corp.com'],
      subject: 'URGENT: Disputed Invoice Wire Transfer Confirmation (#INV-9041)',
      received_chain: [
        {
          hop_number: 1,
          from_host: 'tor-exit-frankfurt.node.org',
          by_host: 'mta-inbound-02.acme-corp.com',
          ip: '185.220.101.5',
          timestamp: '2026-09-08T08:14:18Z',
          auth_state: 'FAIL',
          delay_seconds: 0,
        },
        {
          hop_number: 2,
          from_host: 'mta-inbound-02.acme-corp.com',
          by_host: 'internal-sec-filter-01.acme-corp.local',
          ip: '10.240.12.4',
          timestamp: '2026-09-08T08:14:20Z',
          auth_state: 'PASS',
          delay_seconds: 2,
        },
        {
          hop_number: 3,
          from_host: 'internal-sec-filter-01.acme-corp.local',
          by_host: 'exchange-mailbox-mbx04.acme-corp.local',
          ip: '10.240.14.88',
          timestamp: '2026-09-08T08:14:22Z',
          auth_state: 'PASS',
          delay_seconds: 2,
        },
      ],
      attachment_ids: ['invoice_statement_9041.html'],
      url_ids: ['https://paypal1-secure.com/invoice/INV-9041/auth'],
      risk_score: 92,
      confidence_score: 88,
      spf: 'FAIL',
      dkim: 'NONE',
      dmarc: 'REJECT',
      message_id: '<202609080814.x88EEM@paypal1-secure.com>',
      raw_headers_snippet:
        'Return-Path: <bounce@paypal1-secure.com>\nReceived: from tor-exit-frankfurt.node.org (185.220.101.5)\n\tby mta-inbound-02.acme-corp.com (Postfix) with ESMTPS\n\tid 4StLzq19vNz for <finance.controller@acme-corp.com>;\n\tTue, 8 Sep 2026 08:14:18 +0000 (UTC)\nFrom: "PayPal Enterprise Accounts" <accounts-billing@paypal1-secure.com>\nTo: <finance.controller@acme-corp.com>\nSubject: URGENT: Disputed Invoice Wire Transfer Confirmation (#INV-9041)\nDate: Tue, 8 Sep 2026 08:14:10 +0000\nMessage-ID: <202609080814.x88EEM@paypal1-secure.com>\nMIME-Version: 1.0\nContent-Type: multipart/alternative; boundary="----=_NextPart_001_8812"',
      body_text_sample:
        'Dear Accounts Payable Team,\n\nWe have placed an urgent hold on your invoice wire transaction #INV-9041. Immediate re-verification of corporate banking details is required within 4 hours to avoid settlement cancellation and penalty fees.\n\nPlease log in immediately to complete verification: https://paypal1-secure.com/invoice/INV-9041/auth\n\nCorporate Security Operations\nPayPal Commercial Gateway',
    },
  };

  private geoStore: Record<string, GeographicActivityHop[]> = {
    'CASE-2026-8812': [
      {
        hop_number: 1,
        ip: '185.220.101.5',
        hostname: 'tor-exit-frankfurt.node.org',
        country: 'Germany',
        country_code: 'DE',
        city: 'Frankfurt am Main',
        lat: 50.1109,
        lng: 8.6821,
        asn: 'AS205100 (Tor Exit Network Operator)',
        isp: 'Zwiebelfreunde e.V. Anonymity Node',
        timestamp: '2026-09-08T08:14:18Z',
        anomaly_context: 'CONFIRMED TOR EXIT NODE — Anonymized source connection bypassing geo-fencing policies',
        is_tor: true,
        is_vpn: false,
        is_earliest_reliable: true,
        threat_reputation: 'MALICIOUS',
      },
      {
        hop_number: 2,
        ip: '10.240.12.4',
        hostname: 'mta-inbound-02.acme-corp.com',
        country: 'United States',
        country_code: 'US',
        city: 'Ashburn',
        lat: 39.0438,
        lng: -77.4874,
        asn: 'AS13335 (Acme Corp Internal Transit)',
        isp: 'Acme Dedicated Inbound Gateway',
        timestamp: '2026-09-08T08:14:20Z',
        anomaly_context: 'Internal secure demarcation perimeter filter',
        is_tor: false,
        is_vpn: false,
        is_earliest_reliable: false,
        threat_reputation: 'INTERNAL',
      },
      {
        hop_number: 3,
        ip: '10.240.14.88',
        hostname: 'exchange-mailbox-mbx04.acme-corp.local',
        country: 'United States',
        country_code: 'US',
        city: 'Ashburn',
        lat: 39.0438,
        lng: -77.4874,
        asn: 'AS13335 (Acme Corp Mailbox Store)',
        isp: 'Internal Exchange Cluster',
        timestamp: '2026-09-08T08:14:22Z',
        anomaly_context: 'Destination mailbox quarantine spool',
        is_tor: false,
        is_vpn: false,
        is_earliest_reliable: false,
        threat_reputation: 'INTERNAL',
      },
    ],
    'CASE-2026-8815': [
      {
        hop_number: 1,
        ip: '103.251.167.22',
        hostname: 'mail-out.vendor-portal-direct.in',
        country: 'India',
        country_code: 'IN',
        city: 'Bengaluru',
        lat: 12.9716,
        lng: 77.5946,
        asn: 'AS45820 (Tata Communications Ltd)',
        isp: 'Tata Internet Services Data Center',
        timestamp: '2026-09-07T14:31:50Z',
        anomaly_context: 'NEWLY REGISTERED SENDER DOMAIN — Domain created 48h prior to payment invoice dispatch',
        is_tor: false,
        is_vpn: false,
        is_earliest_reliable: true,
        threat_reputation: 'SUSPICIOUS',
      },
      {
        hop_number: 2,
        ip: '103.74.23.12',
        hostname: 'relay-sin-01.cloudflare-mx.net',
        country: 'Singapore',
        country_code: 'SG',
        city: 'Singapore',
        lat: 1.3521,
        lng: 103.8198,
        asn: 'AS13335 (Cloudflare Inc.)',
        isp: 'Cloudflare Public Edge Transit',
        timestamp: '2026-09-07T14:31:55Z',
        anomaly_context: 'Regional CDN proxy relay hop',
        is_tor: false,
        is_vpn: false,
        is_earliest_reliable: false,
        threat_reputation: 'NEUTRAL',
      },
      {
        hop_number: 3,
        ip: '10.240.12.4',
        hostname: 'mta-inbound-02.acme-corp.com',
        country: 'United States',
        country_code: 'US',
        city: 'Ashburn',
        lat: 39.0438,
        lng: -77.4874,
        asn: 'AS13335 (Acme Corp Internal Transit)',
        isp: 'Acme Border MTA',
        timestamp: '2026-09-07T14:32:00Z',
        anomaly_context: 'Inbound boundary ingress',
        is_tor: false,
        is_vpn: false,
        is_earliest_reliable: false,
        threat_reputation: 'INTERNAL',
      },
    ],
    'CASE-2026-8819': [
      {
        hop_number: 1,
        ip: '91.240.118.172',
        hostname: 'vps-host-bucharest.c2-network.ro',
        country: 'Romania',
        country_code: 'RO',
        city: 'Bucharest',
        lat: 44.4268,
        lng: 26.1025,
        asn: 'AS202425 (IP Telecom Bulletproof Transit)',
        isp: 'Bulletproof Cloud Services S.R.L.',
        timestamp: '2026-09-06T11:05:25Z',
        anomaly_context: 'BULLETPROOF HOSTING PROVIDER — Known FIN7 malware command & control infrastructure',
        is_tor: false,
        is_vpn: true,
        is_earliest_reliable: true,
        threat_reputation: 'MALICIOUS',
      },
      {
        hop_number: 2,
        ip: '10.240.12.4',
        hostname: 'mta-inbound-01.acme-corp.com',
        country: 'United States',
        country_code: 'US',
        city: 'Ashburn',
        lat: 39.0438,
        lng: -77.4874,
        asn: 'AS13335 (Acme Corp Internal Transit)',
        isp: 'Acme Border Gateway',
        timestamp: '2026-09-06T11:05:40Z',
        anomaly_context: 'Heuristic attachment sandbox detonation trigger',
        is_tor: false,
        is_vpn: false,
        is_earliest_reliable: false,
        threat_reputation: 'INTERNAL',
      },
    ],
    'CASE-2026-8824': [
      {
        hop_number: 1,
        ip: '194.26.29.112',
        hostname: 'edge-proxy-ams.evilproxy-auth.nl',
        country: 'Netherlands',
        country_code: 'NL',
        city: 'Amsterdam',
        lat: 52.3676,
        lng: 4.9041,
        asn: 'AS49981 (WorldStream B.V.)',
        isp: 'WorldStream Dedicated Server Infrastructure',
        timestamp: '2026-09-09T03:45:00Z',
        anomaly_context: 'ADVERSARY-IN-THE-MIDDLE (AiTM) PROXY — Live session token interceptor',
        is_tor: false,
        is_vpn: false,
        is_earliest_reliable: true,
        threat_reputation: 'MALICIOUS',
      },
      {
        hop_number: 2,
        ip: '10.240.12.4',
        hostname: 'mta-inbound-01.acme-corp.com',
        country: 'United States',
        country_code: 'US',
        city: 'Ashburn',
        lat: 39.0438,
        lng: -77.4874,
        asn: 'AS13335 (Acme Corp Internal Transit)',
        isp: 'Acme Inbound Demarcation',
        timestamp: '2026-09-09T03:45:12Z',
        anomaly_context: 'Credential harvester alert triggered',
        is_tor: false,
        is_vpn: false,
        is_earliest_reliable: false,
        threat_reputation: 'INTERNAL',
      },
    ],
  };

  // Asynchronous helpers simulating network latency
  private async delay(ms = 80): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getCases(tenantId: string): Promise<InvestigatorCase[]> {
    await this.delay(60);
    // Strict tenant boundary enforcement
    return this.cases.filter((c) => c.tenant_id === tenantId);
  }

  async getCase(caseId: string, tenantId: string): Promise<InvestigatorCase | null> {
    await this.delay(40);
    const found = this.cases.find((c) => c.case_id === caseId && c.tenant_id === tenantId);
    return found || null;
  }

  async getTimeline(caseId: string, tenantId: string): Promise<TimelineEvent[]> {
    await this.delay(70);
    const events = this.timelineStore[caseId] || [];
    return events.filter((e) => e.tenant_id === tenantId);
  }

  async getGraph(
    caseId: string,
    tenantId: string,
    maxDepth = 2,
    centerNodeId?: string
  ): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    await this.delay(90);
    const graphData = this.graphStore[caseId];
    if (!graphData) {
      // Return bare minimum case root node if unknown case
      return {
        nodes: [
          {
            id: `node-${caseId}`,
            type: 'Email',
            label: 'Case Specimen',
            value: caseId,
            depth: 0,
            confidence: 90,
            reputation: 'unknown',
          },
        ],
        edges: [],
      };
    }

    // Default graph depth ≈ 2 hops. Backend depth limiting and pagination readiness.
    const filteredNodes = graphData.nodes.filter((n) => n.depth <= maxDepth);
    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    const filteredEdges = graphData.edges.filter(
      (e) => nodeIds.has(e.source) && nodeIds.has(e.target)
    );

    return {
      nodes: filteredNodes,
      edges: filteredEdges,
    };
  }

  async expandGraphNode(
    caseId: string,
    nodeId: string,
    tenantId: string
  ): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    await this.delay(100);
    // On-demand bounded relationship expansion (+1 hop)
    const baseGraph = this.graphStore[caseId];
    if (!baseGraph) return { nodes: [], edges: [] };

    // Find existing node
    const targetNode = baseGraph.nodes.find((n) => n.id === nodeId);
    if (!targetNode) return { nodes: [], edges: [] };

    // Expand additional bounded node (e.g. Nameserver or ASN entity)
    const expandedNodeId = `exp-${nodeId}-${Date.now().toString(36)}`;
    const newNode: GraphNode = {
      id: expandedNodeId,
      type: targetNode.type === 'Domain' ? 'Source IP' : 'Threat Intelligence Indicator',
      label: targetNode.type === 'Domain' ? 'Secondary Fast-Flux IP' : 'Correlated Campaign Hash',
      value: targetNode.type === 'Domain' ? '185.220.101.42' : 'HASH-SHA256-F14B',
      depth: targetNode.depth + 1,
      confidence: 84,
      first_seen: new Date().toISOString(),
      last_seen: new Date().toISOString(),
      reputation: 'suspicious',
      has_more_relations: false,
    };

    const newEdge: GraphEdge = {
      id: `exp-edge-${Date.now().toString(36)}`,
      source: nodeId,
      target: expandedNodeId,
      relationship_type: 'discovered_relation',
      label: 'Secondary Correlation (Depth 3 Bounded)',
      confidence: 0.84,
    };

    // Store in memory
    baseGraph.nodes.push(newNode);
    baseGraph.edges.push(newEdge);

    return {
      nodes: [newNode],
      edges: [newEdge],
    };
  }

  async getRelatedCases(caseId: string, tenantId: string): Promise<RelatedCaseMatch[]> {
    await this.delay(60);
    const related = this.relatedCasesStore[caseId] || [];
    return related.filter((r) => r.tenant_id === tenantId);
  }

  async linkCase(
    caseId: string,
    targetCaseId: string,
    justification: string,
    tenantId: string
  ): Promise<{ success: boolean; message: string; linkedAt: string }> {
    await this.delay(120);
    const list = this.relatedCasesStore[caseId] || [];
    const match = list.find((m) => m.case_id === targetCaseId);
    if (match) {
      match.is_linked = true;
    }

    // Add an audit timeline event
    const timestamp = new Date().toISOString();
    const currentTimeline = this.timelineStore[caseId] || [];
    currentTimeline.push({
      event_id: `EVT-LINK-${Date.now()}`,
      case_id: caseId,
      tenant_id: tenantId,
      event_type: 'Analyst action',
      timestamp,
      summary: `Investigator linked related investigation #${targetCaseId}. Reason: ${justification}`,
      relevance: 'INFO',
      source_ref: 'Investigator Workbench',
      evidence_hash: 'hash-link-action',
      associated_entity_id: targetCaseId,
    });
    this.timelineStore[caseId] = currentTimeline;

    return {
      success: true,
      message: `Case #${caseId} successfully linked to #${targetCaseId}`,
      linkedAt: timestamp,
    };
  }

  async mergeCases(
    caseId: string,
    targetCaseId: string,
    campaignName: string,
    tenantId: string
  ): Promise<{ success: boolean; campaignId: string; message: string }> {
    await this.delay(140);
    const campaignId = `CMP-${Date.now().toString(36).toUpperCase()}`;

    const thisCase = this.cases.find((c) => c.case_id === caseId && c.tenant_id === tenantId);
    if (thisCase) {
      thisCase.campaign_id = campaignId;
    }
    const targetCase = this.cases.find((c) => c.case_id === targetCaseId && c.tenant_id === tenantId);
    if (targetCase) {
      targetCase.campaign_id = campaignId;
    }

    const currentTimeline = this.timelineStore[caseId] || [];
    currentTimeline.push({
      event_id: `EVT-MRG-${Date.now()}`,
      case_id: caseId,
      tenant_id: tenantId,
      event_type: 'Analyst action',
      timestamp: new Date().toISOString(),
      summary: `Case merged into incident campaign cluster "${campaignName}" (${campaignId}) alongside #${targetCaseId}`,
      relevance: 'HIGH',
      source_ref: 'Campaign Merger',
      evidence_hash: 'hash-campaign-merge',
    });
    this.timelineStore[caseId] = currentTimeline;

    return {
      success: true,
      campaignId,
      message: `Cases #${caseId} and #${targetCaseId} merged into campaign "${campaignName}" (${campaignId})`,
    };
  }

  async getCaseEvidence(caseId: string, tenantId: string): Promise<InvestigatorEvidence[]> {
    await this.delay(60);
    const evidenceList = this.evidenceStore[caseId] || [];
    return evidenceList.filter((e) => e.tenant_id === tenantId);
  }

  async getEvidence(evidenceId: string, tenantId: string): Promise<InvestigatorEvidence | null> {
    await this.delay(30);
    for (const list of Object.values(this.evidenceStore)) {
      const found = list.find((e) => e.evidence_id === evidenceId && e.tenant_id === tenantId);
      if (found) return found;
    }
    return null;
  }

  async annotateEvidence(
    evidenceId: string,
    note: string,
    author: string,
    tenantId: string
  ): Promise<InvestigatorEvidence> {
    await this.delay(100);
    const ev = await this.getEvidence(evidenceId, tenantId);
    if (!ev) {
      throw new Error(`Evidence #${evidenceId} not found in tenant context.`);
    }

    // HARD RULE: Annotations do NOT modify original evidence fields
    ev.annotations.push({
      id: `ann-${Date.now().toString(36)}`,
      author,
      timestamp: new Date().toISOString(),
      note,
    });

    return { ...ev };
  }

  async verifyEvidence(
    evidenceId: string,
    state: 'VERIFIED' | 'DISPUTED',
    author: string,
    tenantId: string
  ): Promise<InvestigatorEvidence> {
    await this.delay(100);
    const ev = await this.getEvidence(evidenceId, tenantId);
    if (!ev) {
      throw new Error(`Evidence #${evidenceId} not found in tenant context.`);
    }

    // Updates verification state without touching original raw record
    ev.verification_state = state;
    ev.annotations.push({
      id: `ann-v-${Date.now().toString(36)}`,
      author,
      timestamp: new Date().toISOString(),
      note: `Analyst marked evidence status as ${state}.`,
    });

    return { ...ev };
  }

  async getEmailEntity(emailId: string, tenantId: string): Promise<EmailEntity | null> {
    await this.delay(50);
    const email = this.emailEntitiesStore[emailId];
    if (email && email.tenant_id === tenantId) return email;

    // Default lookup by case id if not directly matching email id
    for (const [caseId, item] of Object.entries(this.emailEntitiesStore)) {
      if (item.tenant_id === tenantId && (caseId === emailId || item.email_id === emailId)) {
        return item;
      }
    }
    return null;
  }

  async getGeographicActivity(caseId: string, tenantId: string): Promise<GeographicActivityHop[]> {
    await this.delay(50);
    return this.geoStore[caseId] || [];
  }

  async getThreatIntel(indicator: string, tenantId: string): Promise<ThreatIntelEnrichment | null> {
    await this.delay(75);
    return {
      indicator,
      type: indicator.includes('.') ? 'ip' : 'hash',
      source: 'Global Threat Telemetry Grid (AbuseIPDB, OTX, VirusTotal)',
      reputation: indicator.includes('185.220') ? 'MALICIOUS' : 'SUSPICIOUS',
      confidence: 96,
      summary: `Active reputation hit for indicator ${indicator}. Detected in 34 distinct credential phishing incidents over the preceding 30 days.`,
      first_observed: '2026-07-02T14:22:00Z',
      last_resolved: '2026-09-08T08:14:00Z',
      tags: ['tor_exit_node', 'credential_phishing', 'bulletproof_transit', 'fin7_nexus'],
    };
  }

  async escalateToFraudIR(
    caseId: string,
    rationale: string,
    urgency: string,
    tenantId: string
  ): Promise<{ success: boolean; escalationId: string; timestamp: string }> {
    await this.delay(150);
    const escalationId = `ESC-IR-${Date.now().toString(36).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const currentTimeline = this.timelineStore[caseId] || [];
    currentTimeline.push({
      event_id: `EVT-ESC-${Date.now()}`,
      case_id: caseId,
      tenant_id: tenantId,
      event_type: 'Analyst action',
      timestamp,
      summary: `Forensic case escalated to Fraud & Incident Response Team (${escalationId}) [Urgency: ${urgency}]. Rationale: ${rationale}`,
      relevance: 'CRITICAL',
      source_ref: 'Escalation Bridge',
      evidence_hash: 'hash-escalation-action',
    });
    this.timelineStore[caseId] = currentTimeline;

    return {
      success: true,
      escalationId,
      timestamp,
    };
  }

  async exportForensicReport(
    caseId: string,
    tenantId: string
  ): Promise<{ reportId: string; downloadUrl: string; generatedAt: string }> {
    await this.delay(200);
    const reportId = `RPT-FOR-${caseId}-${Date.now().toString(36).toUpperCase()}`;
    return {
      reportId,
      downloadUrl: `/reports/download/${reportId}.pdf`,
      generatedAt: new Date().toISOString(),
    };
  }
}

import { RestInvestigatorRepository } from './rest-investigator-repository.ts';

const _isLiveMode = Boolean(import.meta.env.VITE_API_BASE_URL?.trim());
export const investigatorRepo: InvestigatorRepository = _isLiveMode
  ? new RestInvestigatorRepository()
  : new MockInvestigatorRepository();

// Expose mode for debugging
export const IS_LIVE_MODE = _isLiveMode;
