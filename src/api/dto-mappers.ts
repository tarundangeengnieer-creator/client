/**
 * dto-mappers.ts
 * Maps backend API response DTOs → frontend domain types.
 * Updated to match actual backend response shapes.
 */

import type {
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
import type { InvestigationResult } from '../contracts/backend.ts';

interface BackendCase {
  case_id?: string;
  tenant_id?: string;
  status?: string;
  verdict?: string | null;
  risk_score?: number | null;
  confidence?: number | null;
  created_at?: string | null;
  user_id?: string | null;
  original_case_id?: string | null;
  eml_sha256?: string | null;
  geolocation?: unknown[];
  content_analysis?: unknown;
  attack_hypotheses?: unknown[];
  risk_reasons?: string[];
  tools_used?: string[];
  missing_evidence?: string[];
  stop_reason?: string | null;
  iteration_count?: number;
  subject?: string;
  sender?: string;
  recipient?: string;
  summary?: string;
}

interface BackendEvidence {
  evidence_id?: string;
  case_id?: string;
  type?: string;
  category?: string;
  key?: string;
  value?: unknown;
  related_entity?: string | null;
  timestamp?: string;
  annotations?: Array<{ note: string; author: string; timestamp: string }>;
  verification_state?: string;
  confidence?: number;
  severity?: string;
  mitre_technique?: string | null;
  source?: string;
  [key: string]: unknown;
}

interface BackendTimelineEvent {
  event_id?: string;
  event_type?: string;
  timestamp?: string | null;
  summary?: string;
  severity?: string;
  source?: string;
  evidence_hash?: string | null;
  associated_entity_id?: string | null;
  mitre_technique?: string | null;
}

interface BackendGraphNode {
  id?: string;
  type?: string;
  label?: string;
  value?: string;
  risk_score?: number | null;
  confidence?: number | null;
  depth?: number;
  reputation?: string;
  first_seen?: string | null;
  last_seen?: string | null;
  has_more_relations?: boolean;
  [key: string]: unknown;
}

interface BackendGraphEdge {
  id?: string;
  source?: string;
  target?: string;
  label?: string;
  type?: string;
  relationship_type?: string;
  confidence?: number;
  provenance?: string;
}

interface BackendRelatedCase {
  related_case_id?: string;
  shared_indicators?: string[];
  similarity_score?: number;
  verdict?: string | null;
  status?: string;
  created_at?: string | null;
  subject?: string;
}

interface BackendEmailEntity {
  email_id?: string;
  message_id?: string | null;
  sender?: string | null;
  recipients?: string[];
  reply_to?: string | null;
  subject?: string | null;
  date?: string | null;
  body_preview?: string | null;
  has_html?: boolean;
  attachments?: unknown[];
  // auth_results from backend: { spf: "pass"|"fail"|"none"|"neutral"|"softfail"| ..., dkim: ..., dmarc: ... }
  auth_results?: Record<string, unknown>;
  routing_hops?: unknown[];
  // Legacy boolean fields (may be present in some backend versions)
  spf_pass?: boolean | null;
  dkim_pass?: boolean | null;
  dmarc_pass?: boolean | null;
  is_reply?: boolean | null;
  eml_sha256?: string | null;
}

interface BackendGeoHop {
  ip?: string;
  country?: string;
  country_code?: string;
  region?: string;
  city?: string;
  lat?: number;
  lng?: number;
  longitude?: number;
  latitude?: number;
  asn?: string | number;
  provider?: string;
  org?: string;
  hostname?: string | null;
  is_earliest_reliable?: boolean;
  hop_index?: number;
  hop_position?: number;  // backend uses hop_position
  is_tor?: boolean;
  is_vpn?: boolean;
  threat_reputation?: string;
  anomaly_context?: string;
  timestamp?: string | null;
  [key: string]: unknown;
}

interface BackendThreatIntel {
  indicator?: string;
  indicator_type?: string;
  verdict?: string;
  confidence?: number;
  risk_score?: number;
  sources?: string[];
  tags?: string[];
  malicious_votes?: number;
  harmless_votes?: number;
  last_seen?: string | null;
  first_seen?: string | null;
  providers?: Record<string, unknown>;
  note?: string;
}

export function mapCase(raw: unknown): InvestigatorCase {
  const b = raw as BackendCase;
  return {
    case_id: b.case_id ?? `case_${Date.now()}`,
    tenant_id: b.tenant_id ?? 'unknown_tenant',
    status: (b.status as InvestigatorCase['status']) ?? 'Open',
    opened_at: b.created_at ?? new Date().toISOString(),
    opened_by: b.user_id ?? 'System',
    evidence_confidence: b.confidence != null ? Math.round(b.confidence * 100) : 50,
    related_case_ids: [],
    subject: b.subject ?? 'Unknown Subject',
    sender: b.sender ?? 'unknown@unknown',
    recipient: b.recipient ?? 'unknown@unknown',
    risk_score: b.risk_score ?? 0,
    verdict: (b.verdict as InvestigatorCase['verdict']) ?? 'INCONCLUSIVE',
    summary: b.summary ?? 'No summary provided',
    assigned_investigator: 'Unassigned',
    primary_ioc: _extractPrimaryIoc(b),
  };
}

function _extractPrimaryIoc(b: BackendCase): string | undefined {
  const hypotheses = b.attack_hypotheses as Array<{ ioc?: string; indicator?: string }> | undefined;
  if (hypotheses && hypotheses.length > 0) {
    return hypotheses[0]?.ioc ?? hypotheses[0]?.indicator;
  }
  return undefined;
}

export function mapCaseList(raw: unknown): InvestigatorCase[] {
  // Backend returns { cases: [...], total, limit, offset }
  const list = raw as { cases?: unknown[] };
  const cases = list.cases ?? (Array.isArray(raw) ? raw : []);
  return cases.map(mapCase);
}

export function mapEvidence(raw: unknown): InvestigatorEvidence {
  const b = raw as BackendEvidence;
  // Get the raw_json nested value if present (backend stores evidence as raw_json)
  const rawJson = (b.raw_json as Record<string, unknown>) ?? {};
  const key = b.key ?? (rawJson.key as string) ?? 'Evidence';
  const value = b.value ?? rawJson.value;
  const source = b.source ?? (rawJson.source as string) ?? 'System';
  return {
    evidence_id: b.evidence_id ?? `ev_${Date.now()}`,
    case_id: b.case_id ?? '',
    tenant_id: 'unknown_tenant',
    type: (b.type as InvestigatorEvidence['type']) ?? 'RAW EVIDENCE',
    category: (b.category as InvestigatorEvidence['category']) ?? 'CONTENT',
    title: key,
    description: typeof value === 'string' ? value : JSON.stringify(value ?? {}),
    hash: b.evidence_id ?? 'unknown_hash',
    collected_at: b.timestamp ?? new Date().toISOString(),
    collected_by: source,
    verification_state: (b.verification_state as InvestigatorEvidence['verification_state']) ?? 'UNVERIFIED',
    source_ref: source,
    annotations: (b.annotations ?? []).map((a, i) => ({
      id: `ann_${i}`,
      author: a.author,
      timestamp: a.timestamp,
      note: a.note,
    })),
    weight: 1,
    confidence: b.confidence ?? 50,
  };
}

export function mapEvidenceList(raw: unknown): InvestigatorEvidence[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(mapEvidence);
}

/** Map backend event_type string to one of the domain's strict union values. */
function _mapEventType(raw?: string): TimelineEvent['event_type'] {
  if (!raw) return 'Analyst action';
  const upper = raw.toUpperCase();
  if (upper.includes('EMAIL') || upper.includes('RECEIVED')) return 'Email received';
  if (upper.includes('HOP') || upper.includes('RELAY') || upper.includes('AUDIT')) return 'Received-chain hop';
  if (upper.includes('URL') || upper.includes('CLICK')) return 'URL click';
  if (upper.includes('ATTACHMENT')) return 'Attachment activity';
  if (upper.includes('EXEC') || upper.includes('EXECUTION')) return 'Execution indicator';
  if (upper.includes('THREAT') || upper.includes('INTEL') || upper.includes('ENRICHMENT')) return 'Threat-intelligence enrichment';
  if (upper.includes('ML') || upper.includes('SIGNAL') || upper.includes('HEURISTIC')) return 'Threat-intelligence enrichment';
  return 'Analyst action';
}

/** Map backend severity/relevance string to domain relevance values. */
function _mapRelevance(sev?: string): TimelineEvent['relevance'] {
  if (!sev) return 'INFO';
  const up = sev.toUpperCase();
  if (up === 'CRITICAL') return 'CRITICAL';
  if (up === 'HIGH') return 'HIGH';
  if (up === 'MEDIUM' || up === 'MED') return 'MEDIUM';
  if (up === 'LOW') return 'LOW';
  return 'INFO';
}

export function mapTimelineEvent(raw: unknown): TimelineEvent {
  const b = raw as BackendTimelineEvent;
  return {
    event_id: b.event_id ?? `evt_${Date.now()}`,
    case_id: '',
    event_type: _mapEventType(b.event_type),
    timestamp: b.timestamp ?? new Date().toISOString(),
    summary: b.summary ?? 'No summary',
    relevance: _mapRelevance(b.severity),
    source_ref: b.source ?? 'System',
    evidence_hash: b.evidence_hash ?? '',
    mitre_technique: b.mitre_technique ?? undefined,
    tenant_id: 'unknown_tenant',
    associated_entity_id: b.associated_entity_id ?? undefined,
  };
}

export function mapTimeline(raw: unknown): TimelineEvent[] {
  // Backend returns { events: [...], total } or flat array
  if (Array.isArray(raw)) return raw.map(mapTimelineEvent);
  const r = raw as { events?: unknown[] };
  return (r.events ?? []).map(mapTimelineEvent);
}

export function mapGraphNode(raw: unknown): GraphNode {
  const b = raw as BackendGraphNode;
  return {
    id: b.id ?? `node_${Date.now()}`,
    type: (b.type as GraphNode['type']) ?? 'Email',
    label: b.label ?? 'Unknown Node',
    value: b.value ?? '',
    confidence: b.confidence ?? b.risk_score ?? undefined,
    depth: b.depth ?? 0,
    reputation: (b.reputation as GraphNode['reputation']) ?? 'unknown',
    first_seen: b.first_seen ?? undefined,
    last_seen: b.last_seen ?? undefined,
    has_more_relations: b.has_more_relations ?? false,
  };
}

export function mapGraphEdge(raw: unknown): GraphEdge {
  const b = raw as BackendGraphEdge;
  return {
    id: b.id ?? `edge_${Date.now()}`,
    source: b.source ?? '',
    target: b.target ?? '',
    relationship_type: b.relationship_type ?? b.type ?? 'RELATION',
    label: b.label ?? '',
    confidence: b.confidence,
    provenance: (b.provenance as GraphEdge['provenance']) ?? undefined,
  };
}

export function mapGraph(raw: unknown): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const r = raw as { nodes?: unknown[]; edges?: unknown[] };
  return {
    nodes: (r.nodes ?? []).map(mapGraphNode),
    edges: (r.edges ?? []).map(mapGraphEdge),
  };
}

export function mapRelatedCase(raw: unknown): RelatedCaseMatch {
  const b = raw as BackendRelatedCase;
  return {
    case_id: b.related_case_id ?? '',
    tenant_id: 'unknown_tenant',
    similarity_basis: 'Related behavior',
    similarity_score: b.similarity_score ?? 0,
    date: b.created_at ?? new Date().toISOString(),
    status: (b.status as RelatedCaseMatch['status']) ?? 'Closed',
    subject: b.subject ?? 'Unknown',
    shared_iocs: b.shared_indicators ?? [],
  };
}

export function mapRelatedCases(raw: unknown): RelatedCaseMatch[] {
  const r = raw as { related_cases?: unknown[] };
  return (r.related_cases ?? []).map(mapRelatedCase);
}

/**
 * Normalize SPF/DKIM/DMARC from backend auth_results object.
 * Backend sends: auth_results: { spf: "pass"|"fail"|"none"|"neutral"|"softfail"| ..., dkim: ..., dmarc: ... }
 * OR legacy boolean fields: spf_pass: true|false|null
 */
function _normalizeAuthResult(
  authResults: Record<string, unknown> | undefined,
  protocol: string,
  legacyBool?: boolean | null
): 'PASS' | 'FAIL' | 'SOFTFAIL' | 'NONE' {
  // Try string value from auth_results first
  if (authResults && protocol in authResults) {
    const val = String(authResults[protocol]).toLowerCase();
    if (val === 'pass') return 'PASS';
    if (val === 'fail' || val === 'permerror' || val === 'reject') return 'FAIL';
    if (val === 'softfail' || val === 'temperror' || val === 'neutral') return 'SOFTFAIL';
    return 'NONE';
  }
  // Fall back to legacy boolean
  if (legacyBool === true) return 'PASS';
  if (legacyBool === false) return 'FAIL';
  return 'NONE';
}

export function mapEmailEntity(raw: unknown, caseId: string): EmailEntity {
  const b = raw as BackendEmailEntity;
  const authResults = b.auth_results as Record<string, unknown> | undefined;
  return {
    email_id: b.email_id ?? caseId,
    tenant_id: 'unknown_tenant',
    sender: b.sender ?? 'unknown@unknown',
    recipients: b.recipients ?? [],
    subject: b.subject ?? '(No subject)',
    received_chain: _mapRoutingHops(b.routing_hops),
    attachment_ids: [],
    url_ids: [],
    risk_score: 0,
    confidence_score: 50,
    spf: _normalizeAuthResult(authResults, 'spf', b.spf_pass),
    dkim: _normalizeAuthResult(authResults, 'dkim', b.dkim_pass) as EmailEntity['dkim'],
    dmarc: _normalizeAuthResult(authResults, 'dmarc', b.dmarc_pass) as EmailEntity['dmarc'],
    message_id: b.message_id ?? undefined,
    body_text_sample: b.body_preview ?? undefined,
    raw_headers_snippet: undefined,
  };
}

function _mapRoutingHops(hops?: unknown[]): import('../domain/investigator.ts').ReceivedHop[] {
  if (!hops || !Array.isArray(hops)) return [];
  return hops.map((hop, i) => {
    const h = hop as Record<string, unknown>;
    const authState = h.auth_state ?? h.spf ?? 'NONE';
    return {
      hop_number: (h.hop_number as number) ?? (h.position as number) ?? i + 1,
      from_host: (h.from_host as string) ?? (h.sending_hostname as string) ?? '',
      by_host: (h.by_host as string) ?? (h.receiving_hostname as string) ?? '',
      ip: (h.ip as string) ?? (h.sending_ip as string) ?? '',
      timestamp: (h.timestamp as string) ?? new Date().toISOString(),
      auth_state: (['PASS', 'FAIL', 'NEUTRAL', 'NONE'].includes(String(authState).toUpperCase())
        ? String(authState).toUpperCase()
        : 'NONE') as import('../domain/investigator.ts').ReceivedHop['auth_state'],
      delay_seconds: h.delay_seconds as number | undefined,
    };
  });
}

export function mapGeoHop(raw: unknown, index: number): GeographicActivityHop {
  const b = raw as BackendGeoHop;
  // backend uses hop_position (1-indexed); hop_index as fallback
  const hopNum = b.hop_position ?? b.hop_index ?? (index + 1);
  const isp = b.provider ?? b.org ?? (b.asn !== undefined ? String(b.asn) : undefined);
  return {
    ip: b.ip ?? '0.0.0.0',
    country: b.country ?? 'Unknown',
    country_code: b.country_code ?? 'XX',
    city: b.city ?? undefined,
    asn: b.asn !== undefined ? String(b.asn) : '0',
    hop_number: hopNum,
    timestamp: b.timestamp ?? new Date().toISOString(),
    anomaly_context: b.anomaly_context ?? '',
    lat: b.lat ?? b.latitude ?? undefined,
    lng: b.lng ?? b.longitude ?? undefined,
    hostname: b.hostname ?? undefined,
    isp: isp,
    is_tor: b.is_tor ?? false,
    is_vpn: b.is_vpn ?? false,
    threat_reputation: (b.threat_reputation as GeographicActivityHop['threat_reputation']) ?? undefined,
    is_earliest_reliable: b.is_earliest_reliable ?? index === 0,
  };
}

export function mapGeoHops(raw: unknown): GeographicActivityHop[] {
  // Backend returns { hops: [...] } wrapper
  if (Array.isArray(raw)) return raw.map((h, i) => mapGeoHop(h, i));
  const r = raw as { hops?: unknown[] };
  return (r.hops ?? []).map((h, i) => mapGeoHop(h, i));
}

export function mapThreatIntel(raw: unknown): ThreatIntelEnrichment {
  const b = raw as BackendThreatIntel;
  return {
    indicator: b.indicator ?? '',
    type: (b.indicator_type as ThreatIntelEnrichment['type']) ?? 'ip',
    source: (b.sources && b.sources.length > 0) ? b.sources[0] : 'Unknown',
    reputation: (b.verdict as ThreatIntelEnrichment['reputation']) ?? 'NEUTRAL',
    confidence: b.confidence ?? 50,
    summary: b.note ?? '',
    tags: b.tags ?? [],
  };
}

export function mapInvestigationResult(raw: unknown): InvestigationResult {
  const r = raw as Partial<InvestigationResult>;
  return {
    ...r,
    investigation_id: r.investigation_id ?? `case_${Date.now()}`,
    created_at: r.created_at ?? new Date().toISOString(),
    completed_at: r.completed_at ?? new Date().toISOString(),
    status: r.status ?? 'completed',
    investigation_level_reached: r.investigation_level_reached ?? 'L0_STATIC',
    verdict: r.verdict ?? 'benign',
    risk_score: r.risk_score ?? 0,
    confidence: r.confidence ?? 0,
    risk_reasons: r.risk_reasons ?? [],
    unresolved_questions: r.unresolved_questions ?? [],
    observed_facts: r.observed_facts ?? [],
    heuristic_findings: r.heuristic_findings ?? [],
    ml_signals: r.ml_signals ?? [],
    threat_intelligence: r.threat_intelligence ?? [],
    historical_matches: r.historical_matches ?? [],
    geolocation: r.geolocation ?? [],
    attack_hypotheses: r.attack_hypotheses ?? [],
    budget: r.budget ?? { max_tool_calls: 10, max_external_calls: 5, latency_budget_ms: 10000 },
    budget_spent: r.budget_spent ?? { latency_ms: 0, tool_calls: 0, external_calls: 0, llm_tokens: 0 },
    budget_remaining: r.budget_remaining ?? { max_tool_calls: 10, max_external_calls: 5, latency_budget_ms: 10000 },
    missing_evidence: r.missing_evidence ?? [],
    pending_conflicts: r.pending_conflicts ?? [],
    tools_used: r.tools_used ?? [],
    tools_failed: r.tools_failed ?? [],
    iteration_count: r.iteration_count ?? 1,
    audit_chain_last_hash: r.audit_chain_last_hash ?? 'none',
  } as InvestigationResult;
}
