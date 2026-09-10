/**
 * ASHIELDER Backend Contract Mirror (TypeScript)
 * SIH 2026 | Problem Statement: PS 26106
 *
 * Authoritative client-side mirror of backend Pydantic contracts.
 * Generated to guarantee 100% type safety and strict schema alignment
 * between Python backend analyzers and React/TypeScript investigation workstation.
 */

export type CaseId = string;
export type EvidenceId = string;
export type ExecutionId = string;
export type ConflictId = string;
export type HypothesisId = string;
export type CorrelationId = string;

// ---------------------------------------------------------------------------
// Common & Core Primitives (contracts/common.py)
// ---------------------------------------------------------------------------

export enum SourceType {
  DETERMINISTIC = "deterministic",
  ML_MODEL = "ml_model",
  THREAT_INTEL_API = "threat_intel_api",
  HISTORICAL_CORRELATION = "historical_correlation",
  TOOL_EXECUTION = "tool_execution",
  GROQ_REASONING = "groq_reasoning",
  ANALYST = "analyst",
}

export enum Recommendation {
  NO_ACTION = "no_action",
  MONITOR = "monitor",
  QUARANTINE = "quarantine",
  BLOCK_SENDER = "block_sender",
  BLOCK_URL = "block_url",
  ESCALATE_TO_ANALYST = "escalate_to_analyst",
  REQUEST_MORE_EVIDENCE = "request_more_evidence",
}

export interface Provenance {
  producer_module: string;
  source_artifact?: string | null;
  extraction_method?: string | null;
  created_at: string; // ISO8601 UTC
  model_name?: string | null;
  model_version?: string | null;
  api_provider?: string | null;
  original_evidence_reference?: EvidenceId | null;
}

export interface ContractError {
  error_code: string;
  message: string;
  detail?: Record<string, unknown> | null;
  occurred_at: string;
}

// ---------------------------------------------------------------------------
// Audit Trail & Hash Chain (contracts/audit.py)
// ---------------------------------------------------------------------------

export enum AuditEventType {
  TOOL_EXECUTED = "TOOL_EXECUTED",
  POLICY_DECISION = "POLICY_DECISION",
  EVIDENCE_CREATED = "EVIDENCE_CREATED",
  RISK_UPDATED = "RISK_UPDATED",
  CONFIDENCE_UPDATED = "CONFIDENCE_UPDATED",
  GROQ_CALLED = "GROQ_CALLED",
  GROQ_REJECTED = "GROQ_REJECTED",
  STOP = "STOP",
  ESCALATION = "ESCALATION",
  REPORT_GENERATED = "REPORT_GENERATED",
}

export interface AuditRecord {
  case_id: CaseId;
  step: number;
  event_type: AuditEventType;
  tool?: string | null;
  policy_decision?: Record<string, unknown> | null;
  reason_code?: string | null;
  reason_data: Record<string, unknown>;
  evidence_before: string[];
  evidence_after: string[];
  risk_before?: number | null;
  risk_after?: number | null;
  confidence_before?: number | null;
  confidence_after?: number | null;
  stop_reason?: string | null;
  escalation_reason?: string | null;
  timestamp: string;
  hash_prev: string;
  hash_self: string;
}

// ---------------------------------------------------------------------------
// Authentication Matrix (contracts/authentication.py)
// ---------------------------------------------------------------------------

export enum AuthResult {
  PASS = "pass",
  FAIL = "fail",
  NONE = "none",
  NEUTRAL = "neutral",
  SOFTFAIL = "softfail",
  TEMPERROR = "temperror",
  PERMERROR = "permerror",
  UNKNOWN = "unknown",
}

export interface AuthenticationEvidence {
  spf: AuthResult;
  spf_domain?: string | null;
  dkim: AuthResult;
  dkim_domain?: string | null;
  dkim_selector?: string | null;
  dmarc: AuthResult;
  dmarc_policy?: string | null; // 'none' | 'quarantine' | 'reject'
  alignment_spf?: boolean | null;
  alignment_dkim?: boolean | null;
  raw_auth_results_header?: string | null;
}

// ---------------------------------------------------------------------------
// Evidence Registry (contracts/evidence.py)
// ---------------------------------------------------------------------------

export enum EvidenceType {
  FACT = "FACT",
  HEURISTIC = "HEURISTIC",
  ML_SIGNAL = "ML_SIGNAL",
  THREAT_INTEL = "THREAT_INTEL",
  HISTORICAL = "HISTORICAL",
  CORRELATION = "CORRELATION",
  INFERENCE = "INFERENCE",
}

export enum TrustLevel {
  VERIFIED = "VERIFIED",
  REPORTED = "REPORTED",
  INFERRED = "INFERRED",
  UNKNOWN = "UNKNOWN",
}

export enum EvidenceCategory {
  AUTHENTICATION = "AUTHENTICATION",
  HEADER = "HEADER",
  CONTENT = "CONTENT",
  URL = "URL",
  HTML = "HTML",
  ATTACHMENT = "ATTACHMENT",
  RELAY = "RELAY",
  IOC = "IOC",
  THREAT_INTEL = "THREAT_INTEL",
  HISTORICAL = "HISTORICAL",
  CORRELATION = "CORRELATION",
  SENDER_BEHAVIOR = "SENDER_BEHAVIOR",
}

export enum EvidenceStatus {
  ACTIVE = "ACTIVE",
  SUPERSEDED = "SUPERSEDED",
  DISPUTED = "DISPUTED",
  RETRACTED = "RETRACTED",
}

export interface EvidenceItem {
  evidence_id: EvidenceId;
  case_id: CaseId;
  type: EvidenceType;
  category: EvidenceCategory;
  key: string;
  value: unknown;
  source: string;
  source_type: SourceType;
  confidence: number; // 0.0 - 1.0
  trust_level: TrustLevel;
  timestamp: string;
  provenance: Provenance;
  related_entity?: string | null;
  evidence_reference?: EvidenceId | null;
  status: EvidenceStatus;
  metadata?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Risk, Confidence & Conflicts (contracts/risk.py)
// ---------------------------------------------------------------------------

export enum Verdict {
  BENIGN = "BENIGN",
  SUSPICIOUS = "SUSPICIOUS",
  MALICIOUS = "MALICIOUS",
  INCONCLUSIVE = "INCONCLUSIVE",
}

export interface RiskContribution {
  evidence_id: EvidenceId;
  weight: number;
  contribution: number; // Point contribution to 0-100 risk score
  reason_code: string;
}

export interface RiskAssessment {
  case_id: CaseId;
  risk_score: number; // 0.0 - 100.0 (Mathematically equals sum of contributions)
  confidence: number; // 0.0 - 1.0
  verdict: Verdict;
  contributing_evidence_ids: EvidenceId[];
  contributions: RiskContribution[];
  reasons: string[];
  unresolved_questions: string[];
  recommended_action: Recommendation;
  engine_version: string;
}

export interface ConfidenceAssessment {
  case_id: CaseId;
  confidence_score: number; // 0.0 - 1.0
  evidence_completeness: number; // 0.0 - 1.0
  calibration_quality: number; // 0.0 - 1.0
  evidence_reliability: number; // 0.0 - 1.0
  unresolved_conflicts_penalty: number; // 0.0 - 1.0
  tool_failure_penalty: number; // 0.0 - 1.0
  contributing_evidence_ids: EvidenceId[];
}

export enum ConflictType {
  ML_VS_REPUTATION = "ML_VS_REPUTATION",
  AUTH_VS_CONTENT_SIGNAL = "AUTH_VS_CONTENT_SIGNAL",
  HISTORICAL_VS_CURRENT = "HISTORICAL_VS_CURRENT",
  CROSS_TOOL_DISAGREEMENT = "CROSS_TOOL_DISAGREEMENT",
}

export enum ConflictSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum ConflictStatus {
  OPEN = "OPEN",
  RESOLVED = "RESOLVED",
  DISMISSED = "DISMISSED",
}

export interface EvidenceConflict {
  conflict_id: ConflictId;
  evidence_a_id: EvidenceId;
  evidence_b_id: EvidenceId;
  conflict_type: ConflictType;
  severity: ConflictSeverity;
  status: ConflictStatus;
  resolution_evidence_ids: EvidenceId[];
}

// ---------------------------------------------------------------------------
// Investigation Lifecycle, Budget & Hypotheses (contracts/investigation.py)
// ---------------------------------------------------------------------------

export enum AttackHypothesisType {
  CREDENTIAL_PHISHING = "credential_phishing",
  BEC = "bec",
  EXECUTIVE_IMPERSONATION = "executive_impersonation",
  VENDOR_FRAUD = "vendor_fraud",
  PAYMENT_DIVERSION = "payment_diversion",
  INVOICE_FRAUD = "invoice_fraud",
  MALICIOUS_URL = "malicious_url",
  MALWARE_DELIVERY = "malware_delivery",
  MALICIOUS_ATTACHMENT = "malicious_attachment",
  SPOOFING = "spoofing",
  COMPROMISED_ACCOUNT = "compromised_account",
  SOCIAL_ENGINEERING = "social_engineering",
  CAMPAIGN = "campaign",
}

export enum HypothesisStatus {
  SUPPORTED = "SUPPORTED",
  UNCERTAIN = "UNCERTAIN",
  WEAK = "WEAK",
  REJECTED = "REJECTED",
}

export interface AttackHypothesis {
  hypothesis_id: HypothesisId;
  case_id: CaseId;
  hypothesis_type: AttackHypothesisType;
  score: number; // 0.0 - 1.0
  confidence: number; // 0.0 - 1.0
  supporting_evidence_ids: EvidenceId[];
  contradicting_evidence_ids: EvidenceId[];
  status: HypothesisStatus;
  reasons: string[];
  investigation_triggered: boolean;
}

export enum InvestigationLevel {
  L0_TRIAGE = "L0_TRIAGE",
  L1_TARGETED = "L1_TARGETED",
  L2_DEEP = "L2_DEEP",
  L3_GROQ = "L3_GROQ",
}

export enum StateMachineStatus {
  INITIALIZED = "INITIALIZED",
  LEVEL_0 = "LEVEL_0",
  LEVEL_1 = "LEVEL_1",
  LEVEL_2 = "LEVEL_2",
  LEVEL_3 = "LEVEL_3",
  STOPPED = "STOPPED",
  COMPLETED = "COMPLETED",
}

export enum StopReason {
  CONFIDENCE_TARGET_REACHED = "CONFIDENCE_TARGET_REACHED",
  NO_MANDATORY_EVIDENCE_MISSING = "NO_MANDATORY_EVIDENCE_MISSING",
  NO_MAJOR_UNRESOLVED_CONFLICT = "NO_MAJOR_UNRESOLVED_CONFLICT",
  NO_CANDIDATE_TOOL_UTILITY = "NO_CANDIDATE_TOOL_UTILITY",
  NO_CANDIDATE_TOOLS = "NO_CANDIDATE_TOOLS",
  BUDGET_EXHAUSTED = "BUDGET_EXHAUSTED",
  LATENCY_BUDGET_EXHAUSTED = "LATENCY_BUDGET_EXHAUSTED",
  EXTERNAL_CALL_BUDGET_EXHAUSTED = "EXTERNAL_CALL_BUDGET_EXHAUSTED",
  MAX_ITERATIONS_REACHED = "MAX_ITERATIONS_REACHED",
  REPEATED_FAILURES_EXCEEDED = "REPEATED_FAILURES_EXCEEDED",
}

export enum EscalationStatus {
  NONE = "NONE",
  REQUESTED = "REQUESTED",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
}

export enum InvestigationStatus {
  COMPLETED = "COMPLETED",
  INCONCLUSIVE = "INCONCLUSIVE",
  ESCALATED = "ESCALATED",
  FAILED = "FAILED",
}

export interface InvestigationBudget {
  max_latency_ms: number;
  max_tool_calls: number;
  max_external_calls: number;
  max_llm_tokens: number;
}

export interface ToolCostSpent {
  latency_ms: number;
  tool_calls: number;
  external_calls: number;
  llm_tokens: number;
}

export interface InvestigationState {
  case_id: CaseId;
  original_case_id?: CaseId | null;
  created_at: string;
  attack_hypotheses: AttackHypothesis[];
  observed_facts: EvidenceId[];
  heuristic_findings: EvidenceId[];
  ml_signals: EvidenceId[];
  threat_intelligence: EvidenceId[];
  historical_matches: EvidenceId[];
  current_risk: number;
  current_confidence: number;
  risk_history: number[];
  missing_evidence: string[];
  pending_conflicts: string[];
  active_conflicts: EvidenceConflict[];
  resolved_conflicts: string[];
  tools_used: string[];
  tools_available: string[];
  tools_blocked: string[];
  tools_failed: string[];
  tool_cost_spent: ToolCostSpent;
  budget: InvestigationBudget;
  budget_remaining: InvestigationBudget;
  investigation_level: InvestigationLevel;
  iteration_count: number;
  max_iterations: number;
  sm_status: StateMachineStatus;
  stop_reason?: StopReason | null;
  escalation_reason?: string | null;
  escalation_status: EscalationStatus;
}

// ---------------------------------------------------------------------------
// Investigation Result (contracts/result.py) — Primary API Endpoint Response
// ---------------------------------------------------------------------------

export interface GeoLocationSummary {
  ip: string;
  hop_position: number;
  hostname?: string | null;
  timestamp?: string | null;
  country?: string | null;
  country_code?: string | null;
  region?: string | null;
  city?: string | null;
  asn?: string | null;
  provider?: string | null;
  source: string;
  success: boolean;
  unavailable_reason?: string | null;
  is_private: boolean;
  is_reserved: boolean;
  is_loopback: boolean;
  is_link_local: boolean;
  is_multicast: boolean;
  is_unspecified: boolean;
  provider_observations: Record<string, unknown>[];
}

export interface ContentAnalysisSummary {
  language: string;
  language_confidence: number;
  execution_mode: string;
  evidence_ids: EvidenceId[];
  unavailable_reason?: string | null;
}

export interface InvestigationResult {
  investigation_id: CaseId;
  created_at: string;
  completed_at: string;
  status: InvestigationStatus;
  stop_reason?: StopReason | null;
  investigation_level_reached: InvestigationLevel;
  verdict: Verdict;
  risk_score: number; // 0.0 - 100.0
  confidence: number; // 0.0 - 1.0
  risk_reasons: string[];
  unresolved_questions: string[];
  observed_facts: EvidenceId[];
  heuristic_findings: EvidenceId[];
  ml_signals: EvidenceId[];
  threat_intelligence: EvidenceId[];
  historical_matches: EvidenceId[];
  geolocation: GeoLocationSummary[];
  content_analysis?: ContentAnalysisSummary | null;
  attack_hypotheses: AttackHypothesis[];
  budget: InvestigationBudget;
  budget_spent: ToolCostSpent;
  budget_remaining: InvestigationBudget;
  missing_evidence: string[];
  pending_conflicts: string[];
  tools_used: string[];
  tools_failed: string[];
  iteration_count: number;
  reasoning_artifact?: Record<string, unknown> | null;
  audit_chain_last_hash: string;
}

// ---------------------------------------------------------------------------
// Header & Relay Structures (contracts/headers.py, contracts/relay.py)
// ---------------------------------------------------------------------------

export interface ReceivedHop {
  hop_index: number;
  from_host?: string | null;
  from_ip?: string | null;
  by_host?: string | null;
  by_ip?: string | null;
  ip_classification?: string | null; // Structural only
  protocol?: string | null;
  timestamp?: string | null;
  raw_line: string;
}

export interface HeaderSet {
  from_address?: string | null;
  from_domain?: string | null;
  to?: string | null;
  cc?: string | null;
  reply_to?: string | null;
  reply_to_domain?: string | null;
  return_path?: string | null;
  return_path_domain?: string | null;
  message_id?: string | null;
  subject?: string | null;
  date?: string | null;
  received_hops: ReceivedHop[];
  authentication_results_raw?: string | null;
  raw_headers: Record<string, string>;
  raw_headers_all: Record<string, string[]>; // Forensic source of truth
}

export interface HeaderFinding {
  finding_id: string;
  key: string;
  observed_fields: Record<string, string | null>;
  interpretation: boolean | string;
  is_heuristic: boolean;
}

export interface RelayHop {
  hop_index: number;
  received_from?: string | null;
  received_by?: string | null;
  timestamp?: string | null;
  ip_address?: string | null;
  is_internal?: boolean | null;
}

export interface RelayPath {
  hops: RelayHop[];
  hop_count: number;
  origin_ip?: string | null;
  anomalies: string[];
}

// ---------------------------------------------------------------------------
// Attachment Forensics (contracts/attachment.py)
// ---------------------------------------------------------------------------

export interface AttachmentRef {
  attachment_id: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  sha256: string;
  is_archive: boolean;
  is_executable_signature: boolean;
  detected_type?: string | null; // Magic-byte detected type
  extension_mismatch: boolean; // E.g. invoice.pdf.exe
  extracted_text_reference?: string | null;
}

// ---------------------------------------------------------------------------
// URL & Canonicalization Forensics (contracts/url.py, contracts/url_canonical.py)
// ---------------------------------------------------------------------------

export interface URLRecord {
  url_id: string;
  raw_url: string;
  normalized_url: string;
  domain: string;
  tld?: string | null;
  path?: string | null;
  query_params: Record<string, string>;
  is_shortened: boolean;
  contains_ip: boolean;
  punycode: boolean;
  extraction_context?: string | null;
}

export interface URLStructuralFeatures {
  url_id: string;
  length: number;
  subdomain_count: number;
  has_at_symbol: boolean;
  has_ip_literal: boolean;
  entropy: number;
  suspicious_tld: boolean;
  homoglyph_suspected: boolean;
}

export interface URLCanonical {
  canonical_url: string;
  original_urls: string[];
  original_evidence_ids: EvidenceId[];
  domain: string;
  is_shortened: boolean;
  bypass_cache: boolean;
}

export interface URLCanonicalSet {
  canonical_urls: URLCanonical[];
  total_original_urls: number;
  total_canonical_urls: number;
}

// ---------------------------------------------------------------------------
// Domain & Infrastructure Intelligence (contracts/domain_intel.py, contracts/geolocation.py)
// ---------------------------------------------------------------------------

export interface DomainIntelResult {
  domain: string;
  registration_date?: string | null;
  expiration_date?: string | null;
  updated_date?: string | null;
  domain_age_days?: number | null;
  is_newly_registered?: boolean | null; // < 30 days old
  registrar_name?: string | null;
  registrant_country?: string | null;
  registrant_organization?: string | null;
  nameservers: string[];
  resolves_to_ips: string[];
  has_mx_records?: boolean | null;
  has_txt_records?: boolean | null;
  retrieved_at: string;
}

export interface GeoLocationResult {
  ip: string;
  country?: string | null;
  country_code?: string | null;
  region?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  timezone?: string | null;
  asn?: string | null;
  isp?: string | null;
  organization?: string | null;
  is_private: boolean;
  is_reserved: boolean;
  is_loopback: boolean;
  is_link_local: boolean;
  is_multicast: boolean;
  is_unspecified: boolean;
  provider?: string | null;
  source: string;
  success: boolean;
  error?: string | null;
  external_calls_made: number;
}

// ---------------------------------------------------------------------------
// Threat Intelligence & External Adapters (contracts/threat_intel.py, contracts/provider_result.py)
// ---------------------------------------------------------------------------

export enum ThreatIntelVerdict {
  MALICIOUS = "MALICIOUS",
  SUSPICIOUS = "SUSPICIOUS",
  CLEAN = "CLEAN",
  UNKNOWN = "UNKNOWN",
  ERROR = "ERROR",
}

export enum CacheStatus {
  HIT = "HIT",
  MISS = "MISS",
  STALE = "STALE",
  NOT_APPLICABLE = "NOT_APPLICABLE",
}

export enum IOCType {
  IP = "IP",
  DOMAIN = "DOMAIN",
  URL = "URL",
  HASH_MD5 = "HASH_MD5",
  HASH_SHA1 = "HASH_SHA1",
  HASH_SHA256 = "HASH_SHA256",
  EMAIL_ADDRESS = "EMAIL_ADDRESS",
}

export interface ThreatIntelResult {
  provider: string;
  indicator: string;
  indicator_type: IOCType;
  verdict: ThreatIntelVerdict;
  confidence?: number | null;
  timestamp: string;
  raw_result_reference?: string | null;
  error?: string | null;
  cache_status: CacheStatus;
}

export interface ProviderResult {
  provider_name: string;
  indicator_value: string;
  indicator_type: IOCType;
  verdict?: ThreatIntelVerdict | null;
  provider_score?: number | null;
  features: Record<string, unknown>;
  raw_payload?: Record<string, unknown> | null;
  raw_result_reference?: string | null;
  cache_status: CacheStatus;
  retrieved_at: string;
}

// ---------------------------------------------------------------------------
// Historical Intelligence & Correlation (contracts/historical.py, contracts/correlation.py)
// ---------------------------------------------------------------------------

export enum MatchType {
  EXACT_HASH = "EXACT_HASH",
  EXACT_IP = "EXACT_IP",
  EXACT_DOMAIN = "EXACT_DOMAIN",
  EXACT_URL = "EXACT_URL",
  SENDER_RELATIONSHIP = "SENDER_RELATIONSHIP",
  HEADER_SIMILARITY = "HEADER_SIMILARITY",
  CONTENT_SIMILARITY = "CONTENT_SIMILARITY",
  INFRASTRUCTURE_RELATIONSHIP = "INFRASTRUCTURE_RELATIONSHIP",
}

export enum MatchStrength {
  WEAK = "WEAK",
  MEDIUM = "MEDIUM",
  STRONG = "STRONG",
  EXACT = "EXACT",
}

export interface HistoricalMatch {
  current_case_id: CaseId;
  previous_case_id: CaseId;
  match_type: MatchType;
  match_strength: MatchStrength;
  matched_indicator: string;
  first_seen: string;
  last_seen: string;
  historical_risk_score?: number | null;
  historical_verdict?: string | null;
  similarity: number; // 0.0 - 1.0
  reliability: number; // 0.0 - 1.0
  recency?: string | null;
  evidence_reference?: string | null;
  explanation: string;
}

export interface HistoricalCorrelationResult {
  case_id: CaseId;
  matches: HistoricalMatch[];
  correlation_reasons: string[];
  overall_strength: MatchStrength;
  is_campaign: boolean;
}

export enum CorrelationType {
  CAMPAIGN = "CAMPAIGN",
  SHARED_INFRASTRUCTURE = "SHARED_INFRASTRUCTURE",
  SHARED_SENDER = "SHARED_SENDER",
  SHARED_CONTENT_TEMPLATE = "SHARED_CONTENT_TEMPLATE",
}

export interface CorrelationLink {
  correlation_id: CorrelationId;
  case_id: CaseId;
  related_case_ids: CaseId[];
  correlation_type: CorrelationType;
  strength: number; // 0.0 - 1.0
  explanation: string;
  evidence_ids: EvidenceId[];
}

// ---------------------------------------------------------------------------
// Bounded Reasoning & Copilot Contracts (contracts/reasoning.py, contracts/groq.py)
// ---------------------------------------------------------------------------

export enum BudgetStatus {
  AVAILABLE = "AVAILABLE",
  LOW = "LOW",
  EXHAUSTED = "EXHAUSTED",
}

export interface ReasoningFinding {
  evidence_id: EvidenceId;
  type: string;
  category: string;
  key: string;
  value: unknown;
  source: string;
  confidence: number;
}

export interface ReasoningHypothesis {
  hypothesis_type: string;
  score: number;
  status: string;
  reasons: string[];
  supporting_evidence_ids: EvidenceId[];
  contradicting_evidence_ids: EvidenceId[];
}

export interface UntrustedContentItem {
  evidence_id: EvidenceId;
  content_type: string;
  text: string;
}

export interface ReasoningEvidenceSnapshot {
  case_id: CaseId;
  investigation_id: string;
  investigation_level: string;
  current_risk: number;
  current_confidence: number;
  key_findings: ReasoningFinding[];
  current_hypotheses: ReasoningHypothesis[];
  missing_evidence: string[];
  completed_tools: string[];
  failed_tools: string[];
  budget_status: BudgetStatus;
  supporting_evidence: EvidenceId[];
  contradictory_evidence: EvidenceId[];
  historical_context?: string | null;
  untrusted_content: UntrustedContentItem[];
}

export interface ReasoningResult {
  schema_version: "1.0";
  case_id: string;
  investigation_id: string;
  summary: string;
  hypotheses: string[];
  supporting_evidence_ids: string[];
  contradicting_evidence_ids: string[];
  uncertainty: "low" | "medium" | "high";
  recommended_next_actions: string[];
  explanation: string;
  escalation_required: boolean;
}

export enum ReasoningFailureCategory {
  PROVIDER_TIMEOUT = "PROVIDER_TIMEOUT",
  PROVIDER_UNAVAILABLE = "PROVIDER_UNAVAILABLE",
  RATE_LIMITED = "RATE_LIMITED",
  SCHEMA_VALIDATION_FAILED = "SCHEMA_VALIDATION_FAILED",
  VALIDATION_FAILED = "VALIDATION_FAILED",
  REASONING_DISABLED = "REASONING_DISABLED",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export interface ReasoningUnavailable {
  category: ReasoningFailureCategory;
  reason: string;
  request_correlation_id: string;
  timestamp: string;
  safe_diagnostic: Record<string, string>;
}

export interface ValidatedReasoningArtifact {
  source_type: "reasoning_model";
  model: string;
  prompt_version: string;
  snapshot_hash: string;
  timestamp: string;
  validation_status: "validated";
  result: ReasoningResult;
}

// ---------------------------------------------------------------------------
// Forensic Report & Re-investigation (contracts/report.py, contracts/reinvestigation.py)
// ---------------------------------------------------------------------------

export interface ForensicReport {
  case_id: CaseId;
  risk_assessment: RiskAssessment;
  attack_hypotheses: AttackHypothesis[];
  evidence_ids: string[];
  investigation_path: string[];
  historical_matches: HistoricalMatch[];
  correlation_links: CorrelationLink[];
  intelligence_results: ThreatIntelResult[];
  relay_path_reference?: string | null;
  recommended_action: Recommendation;
  narrative: string;
  audit_reference: string;
  generated_at: string;
}

export interface ReinvestigationRequest {
  original_case_id: CaseId;
  reason: string;
  requested_by: string;
  additional_evidence: Record<string, unknown>[];
}

export interface ReinvestigationResult {
  original_case_id: CaseId;
  new_case_id: CaseId;
  started_at: string;
  status: string;
  message: string;
}
