/**
 * dto-mappers.ts
 * Maps backend API response DTOs → frontend domain types.
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
  depth?: number;
  [key: string]: unknown;
}

interface BackendGraphEdge {
  id?: string;
  source?: string;
  target?: string;
  label?: string;
  type?: string;
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
  auth_results?: Record<string, unknown>;
  routing_hops?: unknown[];
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
  city?: string;
  lat?: number;
  lng?: number;
  longitude?: number;
  latitude?: number;
  asn?: string | number;
  org?: string;
  hostname?: string | null;
  is_earliest_reliable?: boolean;
  hop_index?: number;
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
    evidence_confidence: b.confidence ?? 50,
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
  const list = raw as { cases?: unknown[] };
  return (list.cases ?? []).map(mapCase);
}

export function mapEvidence(raw: unknown): InvestigatorEvidence {
  const b = raw as BackendEvidence;
  return {
    evidence_id: b.evidence_id ?? `ev_${Date.now()}`,
    case_id: b.case_id ?? '',
    tenant_id: 'unknown_tenant',
    type: (b.type as InvestigatorEvidence['type']) ?? 'RAW EVIDENCE',
    category: (b.category as InvestigatorEvidence['category']) ?? 'CONTENT',
    title: b.key ?? 'Evidence',
    description: typeof b.value === 'string' ? b.value : JSON.stringify(b.value ?? {}),
    hash: b.evidence_id ?? 'unknown_hash',
    collected_at: b.timestamp ?? new Date().toISOString(),
    collected_by: b.source ?? 'System',
    verification_state: (b.verification_state as InvestigatorEvidence['verification_state']) ?? 'UNVERIFIED',
    source_ref: b.source ?? 'System',
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

export function mapTimelineEvent(raw: unknown): TimelineEvent {
  const b = raw as BackendTimelineEvent;
  return {
    event_id: b.event_id ?? `evt_${Date.now()}`,
    case_id: '',
    event_type: (b.event_type as TimelineEvent['event_type']) ?? 'Analyst action',
    timestamp: b.timestamp ?? new Date().toISOString(),
    summary: b.summary ?? 'No summary',
    relevance: (b.severity as TimelineEvent['relevance']) ?? 'INFO',
    source_ref: b.source ?? 'System',
    evidence_hash: b.evidence_hash ?? '',
    mitre_technique: b.mitre_technique ?? undefined,
    tenant_id: 'unknown_tenant',
    associated_entity_id: b.associated_entity_id ?? undefined,
  };
}

export function mapTimeline(raw: unknown): TimelineEvent[] {
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
    confidence: b.risk_score ?? undefined,
    depth: b.depth ?? 0,
  };
}

export function mapGraphEdge(raw: unknown): GraphEdge {
  const b = raw as BackendGraphEdge;
  return {
    id: b.id ?? `edge_${Date.now()}`,
    source: b.source ?? '',
    target: b.target ?? '',
    relationship_type: b.type ?? 'RELATION',
    label: b.label ?? '',
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

export function mapEmailEntity(raw: unknown, caseId: string): EmailEntity {
  const b = raw as BackendEmailEntity;
  return {
    email_id: b.email_id ?? caseId,
    tenant_id: 'unknown_tenant',
    sender: b.sender ?? 'unknown@unknown',
    recipients: b.recipients ?? [],
    subject: b.subject ?? '(No subject)',
    received_chain: [],
    attachment_ids: [],
    url_ids: [],
    risk_score: 0,
    confidence_score: 50,
    spf: b.spf_pass === true ? 'PASS' : b.spf_pass === false ? 'FAIL' : 'NONE',
    dkim: b.dkim_pass === true ? 'PASS' : b.dkim_pass === false ? 'FAIL' : 'NONE',
    dmarc: b.dmarc_pass === true ? 'PASS' : b.dmarc_pass === false ? 'FAIL' : 'NONE',
    message_id: b.message_id ?? undefined,
  };
}

export function mapGeoHop(raw: unknown, index: number): GeographicActivityHop {
  const b = raw as BackendGeoHop;
  return {
    ip: b.ip ?? '0.0.0.0',
    country: b.country ?? 'Unknown',
    country_code: b.country_code ?? 'XX',
    city: b.city ?? undefined,
    asn: b.asn !== undefined ? String(b.asn) : '0',
    hop_number: b.hop_index ?? index,
    timestamp: new Date().toISOString(),
    anomaly_context: '',
    lat: b.lat ?? b.latitude ?? undefined,
    lng: b.lng ?? b.longitude ?? undefined,
    hostname: b.hostname ?? undefined,
    is_earliest_reliable: b.is_earliest_reliable ?? index === 0,
  };
}

export function mapGeoHops(raw: unknown): GeographicActivityHop[] {
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
