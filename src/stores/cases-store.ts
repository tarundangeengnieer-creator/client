/**
 * ASHIELDER Case Repository & Triage Queue Store
 * Manages reactive case inventory, filtering, sorting, keyboard focus, and multi-selection.
 * Complies with Section 6 & 7 of ASHIELDER_FRONTEND_WIREFRAME_SPEC.md and Section 15 of API Integration Spec.
 */

import { useSyncExternalStore } from 'react';
import {
  InvestigationResult,
  InvestigationStatus,
  Recommendation,
  Verdict,
  AttackHypothesis,
  AttackHypothesisType,
  HypothesisStatus,
  StopReason,
  InvestigationLevel,
  GeoLocationSummary,
} from '../contracts/backend.ts';
import { CaseViewModel, TableDensityMode } from '../domain/case.ts';
export type { CaseViewModel, TableDensityMode };

export type RiskFilter = 'ALL' | 'HIGH' | 'MED' | 'LOW';
export type ConfidenceFilter = 'ALL' | 'HIGH' | 'MED' | 'LOW';
export type SortField = 'timestamp' | 'riskScore' | 'confidence' | 'wallClockMs';
export type SortDirection = 'asc' | 'desc';

export interface QueueMetrics {
  total: number;
  malicious: number;
  suspicious: number;
  inconclusive: number;
  benign: number;
  averageLatencyMs: number;
}

export interface CasesState {
  cases: CaseViewModel[];
  investigations: Record<string, InvestigationResult>;
  selectedCaseIds: Set<string>;
  focusedIndex: number;
  densityMode: TableDensityMode;
  searchQuery: string;
  verdictFilter: 'ALL' | Verdict;
  riskFilter: RiskFilter;
  confidenceFilter: ConfidenceFilter;
  sortField: SortField;
  sortDirection: SortDirection;
  severityFilter: string;
  statusFilter: string;
  categoryFilter: string;
}

const STORAGE_KEY = 'ashielder_cases_v3';
const INVESTIGATIONS_KEY = 'ashielder_investigations_v3';

export function makeGeoSummary(partial: Partial<GeoLocationSummary> & { ip: string }): GeoLocationSummary {
  return {
    ip: partial.ip,
    hop_position: partial.hop_position || 1,
    country: partial.country,
    country_code: partial.country_code,
    region: partial.region,
    city: partial.city,
    asn: partial.asn,
    provider: partial.provider,
    source: partial.source || 'geoip_lookup',
    success: partial.success !== undefined ? partial.success : true,
    is_private: partial.is_private || false,
    is_reserved: partial.is_reserved || false,
    is_loopback: partial.is_loopback || false,
    is_link_local: partial.is_link_local || false,
    is_multicast: partial.is_multicast || false,
    is_unspecified: partial.is_unspecified || false,
    provider_observations: partial.provider_observations || [],
  };
}

export function makeInvestigation(
  partial: Partial<InvestigationResult> & {
    investigation_id: string;
    verdict: Verdict;
    risk_score: number;
    confidence: number;
  }
): InvestigationResult {
  return {
    investigation_id: partial.investigation_id,
    created_at: partial.created_at || '2026-09-05T18:13:58Z',
    completed_at: partial.completed_at || '2026-09-05T18:14:00Z',
    status: partial.status || InvestigationStatus.COMPLETED,
    stop_reason: partial.stop_reason ?? StopReason.CONFIDENCE_TARGET_REACHED,
    investigation_level_reached: partial.investigation_level_reached || InvestigationLevel.L1_TARGETED,
    verdict: partial.verdict,
    risk_score: partial.risk_score,
    confidence: partial.confidence,
    risk_reasons: partial.risk_reasons || [],
    unresolved_questions: partial.unresolved_questions || [],
    observed_facts: partial.observed_facts || [],
    heuristic_findings: partial.heuristic_findings || [],
    ml_signals: partial.ml_signals || [],
    threat_intelligence: partial.threat_intelligence || [],
    historical_matches: partial.historical_matches || [],
    geolocation: partial.geolocation || [],
    attack_hypotheses: partial.attack_hypotheses || [],
    budget: partial.budget || {
      max_latency_ms: 4000,
      max_tool_calls: 15,
      max_external_calls: 5,
      max_llm_tokens: 2000,
    },
    budget_spent: partial.budget_spent || {
      latency_ms: 1500,
      tool_calls: 6,
      external_calls: 2,
      llm_tokens: 0,
    },
    budget_remaining: partial.budget_remaining || {
      max_latency_ms: 2500,
      max_tool_calls: 9,
      max_external_calls: 3,
      max_llm_tokens: 2000,
    },
    missing_evidence: partial.missing_evidence || [],
    pending_conflicts: partial.pending_conflicts || [],
    tools_used: partial.tools_used || [],
    tools_failed: partial.tools_failed || [],
    iteration_count: partial.iteration_count || 2,
    audit_chain_last_hash: partial.audit_chain_last_hash || 'hash_sha256_audit_block_initial',
  };
}

// Seed realistic forensic demonstration specimens
function createDefaultDemonstrationCases(): {
  cases: CaseViewModel[];
  investigations: Record<string, InvestigationResult>;
} {
  const inv1 = makeInvestigation({
    investigation_id: 'ASH-2026-9012',
    status: InvestigationStatus.COMPLETED,
    verdict: Verdict.MALICIOUS,
    risk_score: 92.5,
    confidence: 0.842,
    created_at: '2026-09-05T18:13:58Z',
    completed_at: '2026-09-05T18:14:00Z',
    iteration_count: 3,
    stop_reason: StopReason.CONFIDENCE_TARGET_REACHED,
    risk_reasons: [
      'Origin IP 185.220.101.5 is a confirmed active Tor Exit Node',
      'DMARC authentication rejected: domain alignment mismatch with Bank of America brand',
      'Content NLP classifier detected high-confidence Credential Phishing intent (0.892)',
      'Lookalike domain registered 4 hours prior to email dispatch',
    ],
    tools_used: [
      'header_parse',
      'relay_reconstruction',
      'spf_dkim_dmarc',
      'nlp_intent_ml',
      'url_canonicalizer',
      'url_ml',
      'ip_classifier',
      'geoip_lookup',
      'sender_history',
      'attachment_hasher',
    ],
    tools_failed: [],
    budget_spent: {
      latency_ms: 1842,
      tool_calls: 10,
      external_calls: 4,
      llm_tokens: 0,
    },
    threat_intelligence: ['185.220.101.5', 'bankofamerica-secure.net'],
    geolocation: [
      makeGeoSummary({
        ip: '185.220.101.5',
        country: 'Germany',
        country_code: 'DE',
        city: 'Frankfurt am Main',
        asn: 'AS205100',
        provider: 'Tor Exit Node Operator Network',
        provider_observations: [{ tor_exit: true }],
      }),
    ],
    attack_hypotheses: [
      {
        hypothesis_id: 'HYP-01',
        case_id: 'ASH-2026-9012',
      
        hypothesis_type: AttackHypothesisType.CREDENTIAL_PHISHING,
        score: 0.92,
        confidence: 0.88,
        reasons: ['Harvesting online banking credentials through spoofed authentication portal'],
        supporting_evidence_ids: ['EVD-HDR-001', 'EVD-NET-003', 'EVD-ML-001'],
        contradicting_evidence_ids: [],
        status: HypothesisStatus.SUPPORTED,
        investigation_triggered: true,
      },
      {
        hypothesis_id: 'HYP-02',
        case_id: 'ASH-2026-9012',
      
        hypothesis_type: AttackHypothesisType.SPOOFING,
        score: 0.90,
        confidence: 0.92,
        reasons: ['Impersonating financial institution via unauthorized sender identity'],
        supporting_evidence_ids: ['EVD-HDR-002', 'EVD-AUT-001'],
        contradicting_evidence_ids: [],
        status: HypothesisStatus.SUPPORTED,
        investigation_triggered: true,
      },
    ],
  });

  const inv2 = makeInvestigation({
    investigation_id: 'ASH-2026-9015',
    status: InvestigationStatus.COMPLETED,
    verdict: Verdict.SUSPICIOUS,
    risk_score: 58.4,
    confidence: 0.72,
    created_at: '2026-09-05T17:22:10Z',
    completed_at: '2026-09-05T17:22:12Z',
    iteration_count: 2,
    stop_reason: StopReason.CONFIDENCE_TARGET_REACHED,
    risk_reasons: [
      'Sender domain vendor-portal.in was registered 4 days ago',
      'DKIM signature missing; SPF softfail from origin hosting range',
      'Invoice payment details differ from historical supplier records',
    ],
    tools_used: [
      'header_parse',
      'relay_reconstruction',
      'spf_dkim_dmarc',
      'url_canonicalizer',
      'ip_classifier',
      'geoip_lookup',
      'sender_history',
      'attachment_hasher',
    ],
    tools_failed: [],
    budget_spent: {
      latency_ms: 2120,
      tool_calls: 8,
      external_calls: 3,
      llm_tokens: 0,
    },
    threat_intelligence: ['vendor-portal.in', '103.251.167.22'],
    geolocation: [
      makeGeoSummary({
        ip: '103.251.167.22',
        country: 'India',
        country_code: 'IN',
        city: 'Mumbai',
        asn: 'AS55836',
        provider: 'Reliance Jio Infocomm Limited',
      }),
    ],
    attack_hypotheses: [
      {
        hypothesis_id: 'HYP-03',
        case_id: 'ASH-2026-9015',
      
        hypothesis_type: AttackHypothesisType.INVOICE_FRAUD,
        score: 0.74,
        confidence: 0.72,
        reasons: ['Interception of pending vendor transaction with altered routing details'],
        supporting_evidence_ids: ['EVD-DOM-001', 'EVD-HIST-002'],
        contradicting_evidence_ids: [],
        status: HypothesisStatus.SUPPORTED,
        investigation_triggered: true,
      },
    ],
  });

  const inv3 = makeInvestigation({
    investigation_id: 'ASH-2026-9018',
    status: InvestigationStatus.COMPLETED,
    verdict: Verdict.INCONCLUSIVE,
    risk_score: 50.0,
    confidence: 0.22,
    created_at: '2026-09-05T16:04:45Z',
    completed_at: '2026-09-05T16:04:49Z',
    iteration_count: 5,
    stop_reason: StopReason.BUDGET_EXHAUSTED,
    risk_reasons: [
      'Investigation terminated due to wall-clock latency limit budget exhaustion (3,980ms)',
      'Attachment Settlement_NDA_Signed.rar is encrypted with strong password; static sandbox cannot inspect payload',
      'Sender domain partner-network.com has neutral reputation with no prior security incidents',
    ],
    tools_used: [
      'header_parse',
      'relay_reconstruction',
      'spf_dkim_dmarc',
      'attachment_hasher',
      'geoip_lookup',
      'sender_history',
    ],
    tools_failed: [],
    budget_spent: {
      latency_ms: 3980,
      tool_calls: 6,
      external_calls: 2,
      llm_tokens: 0,
    },
    threat_intelligence: ['7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'],
    attack_hypotheses: [
      {
        hypothesis_id: 'HYP-04',
        case_id: 'ASH-2026-9018',
        hypothesis_type: AttackHypothesisType.MALICIOUS_ATTACHMENT,
        score: 0.45,
        confidence: 0.22,
        reasons: ['Use of password-protected container to bypass automated email gateway inspection'],
        supporting_evidence_ids: ['EVD-ATT-001'],
        contradicting_evidence_ids: [],
        status: HypothesisStatus.UNCERTAIN,
        investigation_triggered: false,
      },
    ],
  });

  const inv4 = makeInvestigation({
    investigation_id: 'ASH-2026-9022',
    status: InvestigationStatus.COMPLETED,
    verdict: Verdict.BENIGN,
    risk_score: 4.2,
    confidence: 0.985,
    created_at: '2026-09-05T14:10:12Z',
    completed_at: '2026-09-05T14:10:13Z',
    iteration_count: 1,
    stop_reason: StopReason.CONFIDENCE_TARGET_REACHED,
    risk_reasons: [
      'All authentication protocols passed (SPF PASS, DKIM PASS, DMARC PASS with strict alignment)',
      'Origin IP 140.82.112.4 belongs to verified GitHub Inc. ASN 36459',
      'MIME structure and notification headers adhere to RFC 5322 standard',
    ],
    tools_used: [
      'header_parse',
      'relay_reconstruction',
      'spf_dkim_dmarc',
      'url_canonicalizer',
      'geoip_lookup',
    ],
    tools_failed: [],
    budget_spent: {
      latency_ms: 940,
      tool_calls: 5,
      external_calls: 1,
      llm_tokens: 0,
    },
    threat_intelligence: [],
    geolocation: [
      makeGeoSummary({
        ip: '140.82.112.4',
        country: 'United States',
        country_code: 'US',
        city: 'San Francisco',
        asn: 'AS36459',
        provider: 'GitHub, Inc.',
      }),
    ],
    attack_hypotheses: [],
  });

  const inv5 = makeInvestigation({
    investigation_id: 'ASH-2026-9025',
    status: InvestigationStatus.COMPLETED,
    verdict: Verdict.MALICIOUS,
    risk_score: 88.0,
    confidence: 0.89,
    created_at: '2026-09-05T12:45:00Z',
    completed_at: '2026-09-05T12:45:02Z',
    iteration_count: 3,
    stop_reason: StopReason.CONFIDENCE_TARGET_REACHED,
    risk_reasons: [
      'Attachment Executive_Bonus_Q3.docx.exe has double extension hiding Windows Portable Executable',
      'Magic-byte inspection confirmed MZ executable header (application/x-dosexec) disguised as document',
      'Display Name spoofing executive identity (CEO Office)',
    ],
    tools_used: [
      'header_parse',
      'relay_reconstruction',
      'spf_dkim_dmarc',
      'nlp_intent_ml',
      'attachment_hasher',
      'attachment_entropy',
      'url_canonicalizer',
      'ip_classifier',
      'geoip_lookup',
      'sender_history',
    ],
    tools_failed: [],
    budget_spent: {
      latency_ms: 2410,
      tool_calls: 10,
      external_calls: 3,
      llm_tokens: 0,
    },
    threat_intelligence: ['e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
    attack_hypotheses: [
      {
        hypothesis_id: 'HYP-05',
        case_id: 'ASH-2026-9025',
        hypothesis_type: AttackHypothesisType.EXECUTIVE_IMPERSONATION,
        score: 0.91,
        confidence: 0.89,
        reasons: ['Impersonating Chief Executive to induce fraudulent document execution'],
        supporting_evidence_ids: ['EVD-ATT-003', 'EVD-HDR-005'],
        contradicting_evidence_ids: [],
        status: HypothesisStatus.SUPPORTED,
        investigation_triggered: true,
      },
      {
        hypothesis_id: 'HYP-06',
        case_id: 'ASH-2026-9025',
        hypothesis_type: AttackHypothesisType.MALWARE_DELIVERY,
        score: 0.94,
        confidence: 0.90,
        reasons: ['Delivering binary backdoor under camouflage of corporate bonus spreadsheet'],
        supporting_evidence_ids: ['EVD-ATT-004'],
        contradicting_evidence_ids: [],
        status: HypothesisStatus.SUPPORTED,
        investigation_triggered: true,
      },
    ],
  });

  const inv6 = makeInvestigation({
    investigation_id: 'ASH-2026-9031',
    status: InvestigationStatus.COMPLETED,
    verdict: Verdict.SUSPICIOUS,
    risk_score: 64.1,
    confidence: 0.68,
    created_at: '2026-09-05T11:15:30Z',
    completed_at: '2026-09-05T11:15:32Z',
    iteration_count: 2,
    stop_reason: StopReason.CONFIDENCE_TARGET_REACHED,
    risk_reasons: [
      'Domain targetc0rp.in is an optical homoglyph of company domain targetcorp.in (digit 0)',
      'Urgent call to action requiring employees to authenticate within 60 minutes',
      'SPF passed for bogus domain but DMARC policy absent',
    ],
    tools_used: [
      'header_parse',
      'relay_reconstruction',
      'spf_dkim_dmarc',
      'nlp_intent_ml',
      'url_canonicalizer',
      'url_ml',
      'geoip_lookup',
      'sender_history',
    ],
    tools_failed: [],
    budget_spent: {
      latency_ms: 1950,
      tool_calls: 8,
      external_calls: 2,
      llm_tokens: 0,
    },
    threat_intelligence: ['targetc0rp.in'],
    attack_hypotheses: [
      {
        hypothesis_id: 'HYP-07',
        case_id: 'ASH-2026-9031',
      
        hypothesis_type: AttackHypothesisType.CREDENTIAL_PHISHING,
        score: 0.85,
        confidence: 0.68,
        reasons: ['Targeted spear-phishing using visual lookalike domain registration'],
        supporting_evidence_ids: ['EVD-DOM-008'],
        contradicting_evidence_ids: [],
        status: HypothesisStatus.SUPPORTED,
        investigation_triggered: true,
      },
    ],
  });

  const invA2291 = makeInvestigation({
    investigation_id: 'A2291',
    status: InvestigationStatus.COMPLETED,
    verdict: Verdict.MALICIOUS,
    risk_score: 87.0,
    confidence: 0.87,
    created_at: '2025-08-12T10:24:00Z',
    completed_at: '2025-08-12T10:24:03Z',
    iteration_count: 3,
    stop_reason: StopReason.CONFIDENCE_TARGET_REACHED,
    risk_reasons: [
      'Lookalike domain paypal1-secure.com impersonates PayPal brand',
      'Suspicious URL detected pointing to credential harvester: https://paypal1-secure.com/invoice',
      'DKIM signature missing while SPF passed from untrusted VPS relay',
      'Urgent call to action attempting to induce immediate financial interaction',
    ],
    tools_used: [
      'header_parse',
      'relay_reconstruction',
      'spf_dkim_dmarc',
      'nlp_intent_ml',
      'url_canonicalizer',
      'url_ml',
      'geoip_lookup',
      'attachment_hasher',
    ],
    tools_failed: [],
    budget_spent: {
      latency_ms: 1840,
      tool_calls: 8,
      external_calls: 3,
      llm_tokens: 0,
    },
    threat_intelligence: ['paypal1-secure.com', '185.220.101.5'],
    geolocation: [
      makeGeoSummary({
        ip: '185.220.101.5',
        country: 'Germany',
        country_code: 'DE',
        asn: 'AS205100',
        provider: 'Tor Exit Node Operator Network',
        provider_observations: [{ tor_exit: true }],
      }),
    ],
    attack_hypotheses: [
      {
        hypothesis_id: 'HYP-A2291-1',
        case_id: 'A2291',
        hypothesis_type: AttackHypothesisType.CREDENTIAL_PHISHING,
        score: 0.87,
        confidence: 0.87,
        reasons: ['Impersonation + Credential Theft targeting PayPal credentials'],
        supporting_evidence_ids: ['EVD-DOM-01', 'EVD-URL-01'],
        contradicting_evidence_ids: [],
        status: HypothesisStatus.SUPPORTED,
        investigation_triggered: true,
      },
    ],
  });

  const invA2290 = makeInvestigation({
    investigation_id: 'A2290',
    status: InvestigationStatus.COMPLETED,
    verdict: Verdict.SUSPICIOUS,
    risk_score: 68.0,
    confidence: 0.72,
    created_at: '2025-08-12T09:18:00Z',
    completed_at: '2025-08-12T09:18:02Z',
    iteration_count: 2,
    stop_reason: StopReason.CONFIDENCE_TARGET_REACHED,
    risk_reasons: [
      'Suspicious security alert domain account-security.com not registered to company',
      'Urgent language threatening immediate account lockout',
    ],
    tools_used: ['header_parse', 'relay_reconstruction', 'spf_dkim_dmarc', 'nlp_intent_ml'],
    tools_failed: [],
    budget_spent: { latency_ms: 2100, tool_calls: 7, external_calls: 2, llm_tokens: 0 },
    threat_intelligence: ['account-security.com'],
  });

  const invA2289 = makeInvestigation({
    investigation_id: 'A2289',
    status: InvestigationStatus.COMPLETED,
    verdict: Verdict.BENIGN,
    risk_score: 8.0,
    confidence: 0.99,
    created_at: '2025-08-12T08:41:00Z',
    completed_at: '2025-08-12T08:41:01Z',
    iteration_count: 1,
    stop_reason: StopReason.CONFIDENCE_TARGET_REACHED,
    risk_reasons: ['Internal sender hr@company.com with verified DKIM signature and clean internal relay.'],
    tools_used: ['header_parse', 'spf_dkim_dmarc'],
    tools_failed: [],
    budget_spent: { latency_ms: 620, tool_calls: 4, external_calls: 1, llm_tokens: 0 },
  });

  const invA2288 = makeInvestigation({
    investigation_id: 'A2288',
    status: InvestigationStatus.COMPLETED,
    verdict: Verdict.INCONCLUSIVE,
    risk_score: 42.0,
    confidence: 0.35,
    created_at: '2025-08-11T16:20:00Z',
    completed_at: '2025-08-11T16:20:04Z',
    iteration_count: 4,
    stop_reason: StopReason.BUDGET_EXHAUSTED,
    risk_reasons: ['External hop with unaligned DMARC policy; awaiting additional threat telemetry.'],
    tools_used: ['header_parse', 'relay_reconstruction', 'spf_dkim_dmarc'],
    tools_failed: [],
    budget_spent: { latency_ms: 3400, tool_calls: 6, external_calls: 2, llm_tokens: 0 },
  });

  const invA2287 = makeInvestigation({
    investigation_id: 'A2287',
    status: InvestigationStatus.COMPLETED,
    verdict: Verdict.MALICIOUS,
    risk_score: 91.0,
    confidence: 0.94,
    created_at: '2025-08-11T14:03:00Z',
    completed_at: '2025-08-11T14:03:02Z',
    iteration_count: 3,
    stop_reason: StopReason.CONFIDENCE_TARGET_REACHED,
    risk_reasons: [
      'Password reset lure directing users to deceptive host secure-login.net',
      'Origin relay routed through high-risk ASN with known phishing history',
    ],
    tools_used: ['header_parse', 'url_ml', 'geoip_lookup'],
    tools_failed: [],
    budget_spent: { latency_ms: 1650, tool_calls: 8, external_calls: 3, llm_tokens: 0 },
  });

  const investigations: Record<string, InvestigationResult> = {
    'A2291': invA2291,
    'A2290': invA2290,
    'A2289': invA2289,
    'A2288': invA2288,
    'A2287': invA2287,
    'ASH-2026-9012': inv1,
    'ASH-2026-9015': inv2,
    'ASH-2026-9018': inv3,
    'ASH-2026-9022': inv4,
    'ASH-2026-9025': inv5,
    'ASH-2026-9031': inv6,
  };

  const cases: CaseViewModel[] = [
    {
      id: 'A2291',
      status: InvestigationStatus.COMPLETED,
      verdict: Verdict.MALICIOUS,
      riskScore: 87.0,
      confidence: 0.87,
      recommendation: Recommendation.QUARANTINE,
      subject: 'Invoice Payment Update - Action Required',
      sender: 'support@paypal1-secure.com',
      recipient: 'user@company.com',
      timestamp: '2025-08-12T10:24:00Z',
      toolsUsed: invA2291.tools_used || [],
      toolsFailed: [],
      iterationCount: 3,
      stopReason: 'CONFIDENCE_TARGET_REACHED',
      resourceEnvelope: { wallClockMs: 1840, toolCalls: 8, externalCalls: 3, tokensUsed: 0 },
      evidenceCount: 6,
      attackHypotheses: ['Impersonation + Credential Theft'],
      primaryIoc: 'paypal1-secure.com/invoice',
      originIp: '185.220.101.5',
      originCountry: 'Germany',
      isTorExit: true,
      hasAttachmentMismatch: false,
    },
    {
      id: 'A2290',
      status: InvestigationStatus.COMPLETED,
      verdict: Verdict.SUSPICIOUS,
      riskScore: 68.0,
      confidence: 0.72,
      recommendation: Recommendation.ESCALATE_TO_ANALYST,
      subject: 'Your Account Has Been Limited',
      sender: 'service@account-security.com',
      recipient: 'user@company.com',
      timestamp: '2025-08-12T09:18:00Z',
      toolsUsed: ['header_parse', 'relay_reconstruction', 'spf_dkim_dmarc'],
      toolsFailed: [],
      iterationCount: 2,
      stopReason: 'CONFIDENCE_TARGET_REACHED',
      resourceEnvelope: { wallClockMs: 2100, toolCalls: 7, externalCalls: 2, tokensUsed: 0 },
      evidenceCount: 5,
      attackHypotheses: ['Account Takeover Phishing'],
      primaryIoc: 'account-security.com',
      originIp: '103.251.167.22',
      originCountry: 'India',
      isTorExit: false,
      hasAttachmentMismatch: false,
    },
    {
      id: 'A2289',
      status: InvestigationStatus.COMPLETED,
      verdict: Verdict.BENIGN,
      riskScore: 8.0,
      confidence: 0.99,
      recommendation: Recommendation.NO_ACTION,
      subject: 'Meeting Schedule for Next Week',
      sender: 'hr@company.com',
      recipient: 'all-staff@company.com',
      timestamp: '2025-08-12T08:41:00Z',
      toolsUsed: ['header_parse', 'spf_dkim_dmarc'],
      toolsFailed: [],
      iterationCount: 1,
      stopReason: 'CONFIDENCE_TARGET_REACHED',
      resourceEnvelope: { wallClockMs: 620, toolCalls: 4, externalCalls: 1, tokensUsed: 0 },
      evidenceCount: 3,
      attackHypotheses: [],
      primaryIoc: 'Internal Exchange (Clean)',
      originIp: '10.0.4.12',
      originCountry: 'United States',
      isTorExit: false,
      hasAttachmentMismatch: false,
    },
    {
      id: 'A2288',
      status: InvestigationStatus.COMPLETED,
      verdict: Verdict.INCONCLUSIVE,
      riskScore: 42.0,
      confidence: 0.35,
      recommendation: Recommendation.REQUEST_MORE_EVIDENCE,
      subject: 'Re: Project Documents',
      sender: 'tarun.dange@cdgi.edu.in',
      recipient: 'team@cdgi.edu.in',
      timestamp: '2025-08-11T16:20:00Z',
      toolsUsed: ['header_parse', 'relay_reconstruction', 'spf_dkim_dmarc'],
      toolsFailed: [],
      iterationCount: 4,
      stopReason: 'BUDGET_EXHAUSTED',
      resourceEnvelope: { wallClockMs: 3400, toolCalls: 6, externalCalls: 2, tokensUsed: 0 },
      evidenceCount: 4,
      attackHypotheses: ['Suspicious External Routing'],
      primaryIoc: 'cdgi.edu.in (Pending SPF align)',
      originIp: '14.139.241.2',
      originCountry: 'India',
      isTorExit: false,
      hasAttachmentMismatch: false,
    },
    {
      id: 'A2287',
      status: InvestigationStatus.COMPLETED,
      verdict: Verdict.MALICIOUS,
      riskScore: 91.0,
      confidence: 0.94,
      recommendation: Recommendation.QUARANTINE,
      subject: 'Password Reset Request',
      sender: 'no-reply@secure-login.net',
      recipient: 'admin@targetcorp.in',
      timestamp: '2025-08-11T14:03:00Z',
      toolsUsed: ['header_parse', 'url_ml', 'geoip_lookup'],
      toolsFailed: [],
      iterationCount: 3,
      stopReason: 'CONFIDENCE_TARGET_REACHED',
      resourceEnvelope: { wallClockMs: 1650, toolCalls: 8, externalCalls: 3, tokensUsed: 0 },
      evidenceCount: 7,
      attackHypotheses: ['Credential Harvesting'],
      primaryIoc: 'secure-login.net',
      originIp: '185.220.101.5',
      originCountry: 'Russia',
      isTorExit: true,
      hasAttachmentMismatch: false,
    },
    {
      id: 'ASH-2026-9012',
      severity: 'CRITICAL',
      isSlaBreached: true,
      threatCategory: 'Credential Phishing',
      authSignals: { spf: 'FAIL', dkim: 'FAIL', dmarc: 'FAIL' },
      assignee: 'unassigned',
      status: InvestigationStatus.COMPLETED,
      verdict: Verdict.MALICIOUS,
      riskScore: 92.5,
      confidence: 0.842,
      recommendation: Recommendation.QUARANTINE,
      subject: 'URGENT: Verify Your Bank of America Account Access Immediately',
      sender: 'security@bankofamerica-secure.net',
      recipient: 'victim@targetcorp.in',
      timestamp: '2026-09-05T18:13:58Z',
      toolsUsed: inv1.tools_used || [],
      toolsFailed: [],
      iterationCount: 3,
      stopReason: 'CONFIDENCE_TARGET_REACHED',
      resourceEnvelope: { wallClockMs: 1842, toolCalls: 10, externalCalls: 4, tokensUsed: 0 },
      evidenceCount: 14,
      attackHypotheses: ['Credential Phishing', 'Financial Institution Spoofing'],
      primaryIoc: '185.220.101.5 (Tor Exit)',
      originIp: '185.220.101.5',
      originCountry: 'Germany',
      isTorExit: true,
      hasAttachmentMismatch: false,
    },
    {
      id: 'ASH-2026-9015',
      severity: 'HIGH',
      isSlaBreached: false,
      threatCategory: 'Business Email Compromise',
      authSignals: { spf: 'PASS', dkim: 'NONE', dmarc: 'NONE' },
      assignee: 'Alex Chen',
      status: InvestigationStatus.COMPLETED,
      verdict: Verdict.SUSPICIOUS,
      riskScore: 58.4,
      confidence: 0.72,
      recommendation: Recommendation.ESCALATE_TO_ANALYST,
      subject: 'Outstanding Invoice #42981 - Revised Wire Transfer Instructions',
      sender: 'billing@vendor-portal.in',
      recipient: 'finance@targetcorp.in',
      timestamp: '2026-09-05T17:22:10Z',
      toolsUsed: inv2.tools_used || [],
      toolsFailed: [],
      iterationCount: 2,
      stopReason: 'CONFIDENCE_TARGET_REACHED',
      resourceEnvelope: { wallClockMs: 2120, toolCalls: 8, externalCalls: 3, tokensUsed: 0 },
      evidenceCount: 9,
      attackHypotheses: ['Invoice Fraud & BEC'],
      primaryIoc: 'vendor-portal.in (NRD 4d)',
      originIp: '103.251.167.22',
      originCountry: 'India',
      isTorExit: false,
      hasAttachmentMismatch: false,
    },
    {
      id: 'ASH-2026-9018',
      status: InvestigationStatus.COMPLETED,
      verdict: Verdict.INCONCLUSIVE,
      riskScore: 50.0,
      confidence: 0.22,
      recommendation: Recommendation.REQUEST_MORE_EVIDENCE,
      subject: 'Encrypted Legal Settlement Document & Addendum.rar',
      sender: 'counsel@partner-network.com',
      recipient: 'legal@targetcorp.in',
      timestamp: '2026-09-05T16:04:45Z',
      toolsUsed: inv3.tools_used || [],
      toolsFailed: [],
      iterationCount: 5,
      stopReason: 'BUDGET_EXHAUSTED',
      resourceEnvelope: { wallClockMs: 3980, toolCalls: 6, externalCalls: 2, tokensUsed: 0 },
      evidenceCount: 6,
      attackHypotheses: ['Encrypted Delivery Evasion'],
      primaryIoc: 'Settlement_NDA.rar (Encrypted)',
      originIp: '198.51.100.44',
      originCountry: 'United States',
      isTorExit: false,
      hasAttachmentMismatch: true,
    },
    {
      id: 'ASH-2026-9022',
      status: InvestigationStatus.COMPLETED,
      verdict: Verdict.BENIGN,
      riskScore: 4.2,
      confidence: 0.985,
      recommendation: Recommendation.NO_ACTION,
      subject: '[GitHub] Pull Request #142: Fix input sanitization regex',
      sender: 'notifications@github.com',
      recipient: 'dev-team@targetcorp.in',
      timestamp: '2026-09-05T14:10:12Z',
      toolsUsed: inv4.tools_used || [],
      toolsFailed: [],
      iterationCount: 1,
      stopReason: 'CONFIDENCE_TARGET_REACHED',
      resourceEnvelope: { wallClockMs: 940, toolCalls: 5, externalCalls: 1, tokensUsed: 0 },
      evidenceCount: 7,
      attackHypotheses: [],
      primaryIoc: 'Clean Relay (ASN 36459)',
      originIp: '140.82.112.4',
      originCountry: 'United States',
      isTorExit: false,
      hasAttachmentMismatch: false,
    },
    {
      id: 'ASH-2026-9025',
      status: InvestigationStatus.COMPLETED,
      verdict: Verdict.MALICIOUS,
      riskScore: 88.0,
      confidence: 0.89,
      recommendation: Recommendation.QUARANTINE,
      subject: 'Confidential: Q3 Executive Performance & Bonus Schedule.docx.exe',
      sender: 'ceo-office@company-corp.co',
      recipient: 'cfo@targetcorp.in',
      timestamp: '2026-09-05T12:45:00Z',
      toolsUsed: inv5.tools_used || [],
      toolsFailed: [],
      iterationCount: 3,
      stopReason: 'CONFIDENCE_TARGET_REACHED',
      resourceEnvelope: { wallClockMs: 2410, toolCalls: 10, externalCalls: 3, tokensUsed: 0 },
      evidenceCount: 12,
      attackHypotheses: ['Executive Impersonation', 'Malware Dropper Delivery'],
      primaryIoc: 'Double Extension EXE',
      originIp: '45.142.122.9',
      originCountry: 'Russia',
      isTorExit: false,
      hasAttachmentMismatch: true,
    },
    {
      id: 'ASH-2026-9031',
      severity: 'MEDIUM',
      isSlaBreached: false,
      threatCategory: 'Spam',
      authSignals: { spf: 'PASS', dkim: 'PASS', dmarc: 'PASS' },
      assignee: 'unassigned',
      status: InvestigationStatus.COMPLETED,
      verdict: Verdict.SUSPICIOUS,
      riskScore: 64.1,
      confidence: 0.68,
      recommendation: Recommendation.ESCALATE_TO_ANALYST,
      subject: 'HR Policy Update: Mandatory Compliance Signature Required Within 1 Hour',
      sender: 'hr-portal@targetc0rp.in',
      recipient: 'all-employees@targetcorp.in',
      timestamp: '2026-09-05T11:15:30Z',
      toolsUsed: inv6.tools_used || [],
      toolsFailed: [],
      iterationCount: 2,
      stopReason: 'CONFIDENCE_TARGET_REACHED',
      resourceEnvelope: { wallClockMs: 1950, toolCalls: 8, externalCalls: 2, tokensUsed: 0 },
      evidenceCount: 8,
      attackHypotheses: ['Homoglyph Phishing'],
      primaryIoc: 'targetc0rp.in (Homoglyph)',
      originIp: '194.26.29.112',
      originCountry: 'Netherlands',
      isTorExit: false,
      hasAttachmentMismatch: false,
    },
  ];

  return { cases, investigations };
}

function loadPersistedState(): {
  cases: CaseViewModel[];
  investigations: Record<string, InvestigationResult>;
} {
  try {
    const rawCases = localStorage.getItem(STORAGE_KEY);
    const rawInvs = localStorage.getItem(INVESTIGATIONS_KEY);
    if (rawCases && rawInvs) {
      const parsedCases = JSON.parse(rawCases);
      const parsedInvs = JSON.parse(rawInvs);
      if (Array.isArray(parsedCases) && parsedCases.length > 0) {
        
        // Ensure all loaded investigation results are normalized
        // to prevent `TypeError: Cannot read properties of undefined (reading 'map')`
        const normalizedInvs: Record<string, InvestigationResult> = {};
        
        // Dynamically import mapInvestigationResult to avoid circular dependency
        // or just apply basic fallback defaults manually here.
        for (const [key, rawInv] of Object.entries(parsedInvs)) {
          const r = rawInv as Partial<InvestigationResult>;
          normalizedInvs[key] = {
            ...r,
            risk_reasons: r.risk_reasons ?? [],
            missing_evidence: r.missing_evidence ?? [],
            tools_used: r.tools_used ?? [],
            tools_failed: r.tools_failed ?? [],
            attack_hypotheses: r.attack_hypotheses ?? [],
            threat_intelligence: r.threat_intelligence ?? [],
            geolocation: r.geolocation ?? [],
            ml_signals: r.ml_signals ?? [],
            heuristic_findings: r.heuristic_findings ?? [],
            observed_facts: r.observed_facts ?? [],
            unresolved_questions: r.unresolved_questions ?? [],
            pending_conflicts: r.pending_conflicts ?? [],
          } as InvestigationResult;
        }

        return { cases: parsedCases, investigations: normalizedInvs };
      }
    }
  } catch (e) {
    console.warn('Failed to hydrate cases from localStorage', e);
  }

  const defaults = createDefaultDemonstrationCases();
  persistState(defaults.cases, defaults.investigations);
  return defaults;
}

function persistState(cases: CaseViewModel[], investigations: Record<string, InvestigationResult>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    localStorage.setItem(INVESTIGATIONS_KEY, JSON.stringify(investigations));
  } catch (e) {
    console.warn('Failed to write cases to localStorage', e);
  }
}

const initialData = loadPersistedState();

let currentCasesState: CasesState = {
  cases: initialData.cases,
  investigations: initialData.investigations,
  selectedCaseIds: new Set<string>(),
  focusedIndex: 0,
  densityMode: 'standard',
  searchQuery: '',
  verdictFilter: 'ALL',
  riskFilter: 'ALL',
  confidenceFilter: 'ALL',
      severityFilter: 'ALL',
      statusFilter: 'ALL',
      categoryFilter: 'ALL',
      sortField: 'timestamp',
  sortDirection: 'desc',
};

const caseListeners = new Set<() => void>();

function notifyCases() {
  caseListeners.forEach((listener) => listener());
}

export const casesStore = {
  getSnapshot(): CasesState {
    return currentCasesState;
  },

  subscribe(listener: () => void): () => void {
    caseListeners.add(listener);
    return () => caseListeners.delete(listener);
  },

  getCase(id: string): CaseViewModel | undefined {
    return currentCasesState.cases.find((c) => c.id === id);
  },

  getInvestigation(id: string): InvestigationResult | undefined {
    return currentCasesState.investigations[id];
  },

  getMetrics(): QueueMetrics {
    const cases = currentCasesState.cases;
    let malicious = 0;
    let suspicious = 0;
    let inconclusive = 0;
    let benign = 0;
    let totalLatency = 0;

    cases.forEach((c) => {
      if (c.verdict === Verdict.MALICIOUS) malicious++;
      else if (c.verdict === Verdict.SUSPICIOUS) suspicious++;
      else if (c.verdict === Verdict.INCONCLUSIVE) inconclusive++;
      else if (c.verdict === Verdict.BENIGN) benign++;
      totalLatency += c.resourceEnvelope?.wallClockMs ?? 0;
    });

    return {
      total: cases.length,
      malicious,
      suspicious,
      inconclusive,
      benign,
      averageLatencyMs: cases.length > 0 ? Math.round(totalLatency / cases.length) : 0,
    };
  },

  getFilteredCases(): CaseViewModel[] {
    const { cases, searchQuery, verdictFilter, riskFilter, confidenceFilter, sortField, sortDirection } =
      currentCasesState;

    const filtered = cases.filter((c) => {
      // Verdict filter
      if (verdictFilter !== 'ALL' && c.verdict !== verdictFilter) {
        return false;
      }

      // Risk filter
      if (riskFilter === 'HIGH' && c.riskScore < 70) return false;
      if (riskFilter === 'MED' && (c.riskScore < 40 || c.riskScore >= 70)) return false;
      if (riskFilter === 'LOW' && c.riskScore >= 40) return false;

      // Confidence filter
      if (confidenceFilter === 'HIGH' && c.confidence < 0.8) return false;
      if (confidenceFilter === 'MED' && (c.confidence < 0.6 || c.confidence >= 0.8)) return false;
      if (confidenceFilter === 'LOW' && c.confidence >= 0.6) return false;

      // Text search
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const matchesId = c.id.toLowerCase().includes(query);
        const matchesSubject = c.subject.toLowerCase().includes(query);
        const matchesSender = c.sender.toLowerCase().includes(query);
        const matchesRecipient = c.recipient.toLowerCase().includes(query);
        const matchesIoc = c.primaryIoc?.toLowerCase().includes(query) ?? false;
        const matchesHypothesis = c.attackHypotheses.some((h) => h.toLowerCase().includes(query));

        if (!matchesId && !matchesSubject && !matchesSender && !matchesRecipient && !matchesIoc && !matchesHypothesis) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'timestamp') {
        comparison = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (sortField === 'riskScore') {
        comparison = b.riskScore - a.riskScore;
      } else if (sortField === 'confidence') {
        comparison = b.confidence - a.confidence;
      } else if (sortField === 'wallClockMs') {
        comparison = (b.resourceEnvelope?.wallClockMs ?? 0) - (a.resourceEnvelope?.wallClockMs ?? 0);
      }

      return sortDirection === 'asc' ? -comparison : comparison;
    });

    return filtered;
  },

  addCase(caseModel: CaseViewModel, rawResult?: InvestigationResult): void {
    const existingIndex = currentCasesState.cases.findIndex((c) => c.id === caseModel.id);
    let updatedCases: CaseViewModel[];

    if (existingIndex >= 0) {
      updatedCases = [...currentCasesState.cases];
      updatedCases[existingIndex] = caseModel;
    } else {
      updatedCases = [caseModel, ...currentCasesState.cases];
    }

    const updatedInvs = { ...currentCasesState.investigations };
    if (rawResult) {
      updatedInvs[caseModel.id] = rawResult;
    }

    currentCasesState = {
      ...currentCasesState,
      cases: updatedCases,
      investigations: updatedInvs,
      focusedIndex: 0,
    };

    persistState(updatedCases, updatedInvs);
    notifyCases();
  },

  quarantineCase(id: string): void {
    const updated = currentCasesState.cases.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          recommendation: Recommendation.QUARANTINE,
          verdict: Verdict.MALICIOUS,
        };
      }
      return c;
    });

    currentCasesState = { ...currentCasesState, cases: updated };
    persistState(updated, currentCasesState.investigations);
    notifyCases();
  },

  confirmMalicious(id: string): void {
    const updated = currentCasesState.cases.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          verdict: Verdict.MALICIOUS,
          riskScore: Math.max(c.riskScore, 95),
          recommendation: Recommendation.QUARANTINE,
        };
      }
      return c;
    });

    currentCasesState = { ...currentCasesState, cases: updated };
    persistState(updated, currentCasesState.investigations);
    notifyCases();
  },

  markReviewed(id: string): void {
    const updated = currentCasesState.cases.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          recommendation: Recommendation.NO_ACTION,
        };
      }
      return c;
    });

    currentCasesState = { ...currentCasesState, cases: updated };
    persistState(updated, currentCasesState.investigations);
    notifyCases();
  },

  deleteCase(id: string): void {
    const updatedCases = currentCasesState.cases.filter((c) => c.id !== id);
    const updatedInvs = { ...currentCasesState.investigations };
    delete updatedInvs[id];

    const updatedSelection = new Set(currentCasesState.selectedCaseIds);
    updatedSelection.delete(id);

    currentCasesState = {
      ...currentCasesState,
      cases: updatedCases,
      investigations: updatedInvs,
      selectedCaseIds: updatedSelection,
      focusedIndex: Math.min(currentCasesState.focusedIndex, Math.max(0, updatedCases.length - 1)),
    };

    persistState(updatedCases, updatedInvs);
    notifyCases();
  },

  bulkQuarantine(): void {
    const selected = currentCasesState.selectedCaseIds;
    if (selected.size === 0) return;

    const updated = currentCasesState.cases.map((c) => {
      if (selected.has(c.id)) {
        return {
          ...c,
          recommendation: Recommendation.QUARANTINE,
          verdict: Verdict.MALICIOUS,
        };
      }
      return c;
    });

    currentCasesState = { ...currentCasesState, cases: updated, selectedCaseIds: new Set() };
    persistState(updated, currentCasesState.investigations);
    notifyCases();
  },

  bulkMarkReviewed(): void {
    const selected = currentCasesState.selectedCaseIds;
    if (selected.size === 0) return;

    const updated = currentCasesState.cases.map((c) => {
      if (selected.has(c.id)) {
        return {
          ...c,
          recommendation: Recommendation.NO_ACTION,
        };
      }
      return c;
    });

    currentCasesState = { ...currentCasesState, cases: updated, selectedCaseIds: new Set() };
    persistState(updated, currentCasesState.investigations);
    notifyCases();
  },

  bulkDelete(): void {
    const selected = currentCasesState.selectedCaseIds;
    if (selected.size === 0) return;

    const updatedCases = currentCasesState.cases.filter((c) => !selected.has(c.id));
    const updatedInvs = { ...currentCasesState.investigations };
    selected.forEach((id) => delete updatedInvs[id]);

    currentCasesState = {
      ...currentCasesState,
      cases: updatedCases,
      investigations: updatedInvs,
      selectedCaseIds: new Set(),
      focusedIndex: 0,
    };

    persistState(updatedCases, updatedInvs);
    notifyCases();
  },

  toggleSelect(id: string): void {
    const next = new Set(currentCasesState.selectedCaseIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    currentCasesState = { ...currentCasesState, selectedCaseIds: next };
    notifyCases();
  },

  selectAll(ids: string[]): void {
    const allSelected = ids.every((id) => currentCasesState.selectedCaseIds.has(id));
    const next = new Set(currentCasesState.selectedCaseIds);

    if (allSelected) {
      ids.forEach((id) => next.delete(id));
    } else {
      ids.forEach((id) => next.add(id));
    }

    currentCasesState = { ...currentCasesState, selectedCaseIds: next };
    notifyCases();
  },

  clearSelection(): void {
    if (currentCasesState.selectedCaseIds.size === 0) return;
    currentCasesState = { ...currentCasesState, selectedCaseIds: new Set() };
    notifyCases();
  },

  setFocusedIndex(index: number): void {
    const max = Math.max(0, currentCasesState.cases.length - 1);
    const clamped = Math.max(0, Math.min(index, max));
    if (currentCasesState.focusedIndex === clamped) return;

    currentCasesState = { ...currentCasesState, focusedIndex: clamped };
    notifyCases();
  },

  moveFocus(delta: number, filteredListLength?: number): void {
    const length = filteredListLength ?? currentCasesState.cases.length;
    if (length === 0) return;

    const current = currentCasesState.focusedIndex;
    let next = current + delta;
    if (next < 0) next = 0;
    if (next >= length) next = length - 1;

    currentCasesState = { ...currentCasesState, focusedIndex: next };
    notifyCases();
  },

  setDensityMode(mode: TableDensityMode): void {
    if (currentCasesState.densityMode === mode) return;
    currentCasesState = { ...currentCasesState, densityMode: mode };
    notifyCases();
  },

  setSearchQuery(query: string): void {
    currentCasesState = { ...currentCasesState, searchQuery: query, focusedIndex: 0 };
    notifyCases();
  },

  setFilters(filters: Partial<{ severity: string; status: string; category: string }>): void {
    currentCasesState = {
      ...currentCasesState,
      severityFilter: filters.severity ?? currentCasesState.severityFilter,
      statusFilter: filters.status ?? currentCasesState.statusFilter,
      categoryFilter: filters.category ?? currentCasesState.categoryFilter,
    };
    persistState(currentCasesState.cases, currentCasesState.investigations);
    notifyCases();
  },

  setVerdictFilter(verdict: 'ALL' | Verdict): void {
    currentCasesState = { ...currentCasesState, verdictFilter: verdict, focusedIndex: 0 };
    notifyCases();
  },

  setRiskFilter(filter: RiskFilter): void {
    currentCasesState = { ...currentCasesState, riskFilter: filter, focusedIndex: 0 };
    notifyCases();
  },

  setConfidenceFilter(filter: ConfidenceFilter): void {
    currentCasesState = { ...currentCasesState, confidenceFilter: filter, focusedIndex: 0 };
    notifyCases();
  },

  setSort(field: SortField): void {
    let direction: SortDirection = 'desc';
    if (currentCasesState.sortField === field) {
      direction = currentCasesState.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      direction = field === 'timestamp' || field === 'riskScore' || field === 'confidence' ? 'desc' : 'asc';
    }

    currentCasesState = {
      ...currentCasesState,
      sortField: field,
      sortDirection: direction,
    };
    notifyCases();
  },

  resetFilters(): void {
    currentCasesState = {
      ...currentCasesState,
      searchQuery: '',
      verdictFilter: 'ALL',
      riskFilter: 'ALL',
      confidenceFilter: 'ALL',
      severityFilter: 'ALL',
      statusFilter: 'ALL',
      categoryFilter: 'ALL',
      sortField: 'timestamp',
      sortDirection: 'desc',
      focusedIndex: 0,
    };
    notifyCases();
  },
};

export function useCases(): CasesState {
  return useSyncExternalStore(casesStore.subscribe, casesStore.getSnapshot);
}
