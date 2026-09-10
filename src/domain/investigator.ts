/**
 * ASHIELDER Forensic Investigator Domain Contracts & View Models
 *
 * Implements strict tenant-scoped, tamper-evident forensic contracts
 * for the Investigator Workspace.
 */

export type CaseStatus = 'Open' | 'Evidence Pending' | 'Ready for Report';

export type EvidenceVerificationState = 'VERIFIED' | 'DISPUTED' | 'UNVERIFIED';

export type EvidenceTypeCategory =
  | 'RAW EVIDENCE'
  | 'ANALYST ANNOTATION'
  | 'AI FINDING'
  | 'THREAT INTELLIGENCE'
  | 'CORRELATION RESULT';

export type EntityType =
  | 'Email'
  | 'Sender'
  | 'Recipient'
  | 'Domain'
  | 'URL'
  | 'Source IP'
  | 'Attachment'
  | 'Related Case'
  | 'Threat Intelligence Indicator';

export interface InvestigatorCase {
  case_id: string;
  tenant_id: string;
  status: CaseStatus;
  opened_at: string;
  opened_by: string;
  evidence_confidence: number; // 0 - 100 percentage or 0.0 - 1.0
  related_case_ids: string[];
  subject: string;
  sender: string;
  recipient: string;
  risk_score: number;
  verdict: 'MALICIOUS' | 'SUSPICIOUS' | 'INCONCLUSIVE' | 'BENIGN';
  summary: string;
  assigned_investigator: string;
  primary_ioc?: string;
  origin_ip?: string;
  origin_country?: string;
  is_tor_exit?: boolean;
  campaign_id?: string;
  severity?: string;
}

export interface EvidenceAnnotation {
  id: string;
  author: string;
  timestamp: string;
  note: string;
}

export interface InvestigatorEvidence {
  evidence_id: string;
  case_id: string;
  tenant_id: string;
  type: EvidenceTypeCategory;
  category: 'AUTHENTICATION' | 'HEADER' | 'URL' | 'ATTACHMENT' | 'RELAY' | 'CONTENT' | 'THREAT_INTEL' | 'NETWORK';
  title: string;
  description: string;
  hash: string; // SHA-256 tamper-evident hash
  collected_at: string;
  collected_by: string;
  verification_state: EvidenceVerificationState;
  source_ref: string;
  annotations: EvidenceAnnotation[];
  immutable_raw_snippet?: string;
  weight: number;
  confidence: number;
}

export interface TimelineEvent {
  event_id: string;
  case_id: string;
  event_type:
    | 'Email received'
    | 'Received-chain hop'
    | 'URL click'
    | 'Attachment activity'
    | 'Execution indicator'
    | 'Threat-intelligence enrichment'
    | 'Analyst action';
  timestamp: string;
  summary: string;
  relevance: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  source_ref: string;
  evidence_hash: string;
  mitre_technique?: string;
  tenant_id: string;
  associated_entity_id?: string;
  evidence_id?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface GraphNode {
  id: string;
  type: EntityType;
  label: string;
  value: string;
  confidence?: number;
  first_seen?: string;
  last_seen?: string;
  depth: number;
  is_expanded?: boolean;
  reputation?: 'malicious' | 'suspicious' | 'benign' | 'unknown';
  has_more_relations?: boolean;
  attributes?: Record<string, string | number | boolean>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship_type: string;
  label: string;
  confidence?: number;
}

export interface EntityRelationship {
  entity_id: string;
  tenant_id: string;
  entity_type: EntityType;
  relationship_type: string;
  source_email_id: string;
  first_seen: string;
  last_seen: string;
  confidence_score: number;
  target_id: string;
}

export interface RelatedCaseMatch {
  case_id: string;
  tenant_id: string;
  similarity_basis: string; // e.g. "87% Shared sender infrastructure; Shared URL/domain"
  similarity_score: number; // 0 - 100 percentage
  date: string;
  status: CaseStatus | 'Closed';
  subject: string;
  shared_iocs: string[];
  is_linked?: boolean;
  is_merged?: boolean;
}

export interface ReceivedHop {
  hop_number: number;
  from_host: string;
  by_host: string;
  ip: string;
  timestamp: string;
  auth_state: 'PASS' | 'FAIL' | 'NEUTRAL' | 'NONE';
  delay_seconds?: number;
}

export interface EmailEntity {
  email_id: string;
  tenant_id: string;
  sender: string;
  recipients: string[];
  subject: string;
  received_chain: ReceivedHop[];
  attachment_ids: string[];
  url_ids: string[];
  risk_score: number;
  confidence_score: number;
  spf: 'PASS' | 'FAIL' | 'SOFTFAIL' | 'NONE';
  dkim: 'PASS' | 'FAIL' | 'NONE';
  dmarc: 'PASS' | 'FAIL' | 'NONE' | 'REJECT';
  raw_headers_snippet?: string;
  message_id?: string;
  body_text_sample?: string;
}

export interface GeographicActivityHop {
  ip: string;
  country: string;
  country_code: string;
  city?: string;
  asn: string;
  hop_number: number;
  timestamp: string;
  anomaly_context: string;
  is_tor?: boolean;
  is_vpn?: boolean;
  lat?: number;
  lng?: number;
  hostname?: string;
  isp?: string;
  threat_reputation?: 'MALICIOUS' | 'SUSPICIOUS' | 'NEUTRAL' | 'INTERNAL';
  is_earliest_reliable?: boolean;
}

export interface ThreatIntelEnrichment {
  indicator: string;
  type: 'ip' | 'domain' | 'url' | 'hash';
  source: string;
  reputation: 'MALICIOUS' | 'SUSPICIOUS' | 'NEUTRAL' | 'CLEAN';
  confidence: number;
  summary: string;
  first_observed?: string;
  last_resolved?: string;
  tags: string[];
}
