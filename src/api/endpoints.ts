/**
 * ASHIELDER Backend API Endpoints Registry
 * Authoritative mapping to FastAPI endpoints defined in ASHIELDER_FRONTEND_API_INTEGRATION_SPEC.md
 */

export const ENDPOINTS = {
  HEALTH: '/health',

  // Auth & Users
  LOGIN: '/api/v1/users/login',
  REGISTER: '/api/v1/users/register',
  ME: '/api/v1/users/me',

  // Investigations (core)
  INVESTIGATIONS_LIST: '/api/v1/investigations',
  INVESTIGATIONS_ANALYZE: '/api/v1/investigations/analyze',
  INVESTIGATION_DETAIL: (id: string) => `/api/v1/investigations/${encodeURIComponent(id)}`,
  INVESTIGATION_EVIDENCE: (id: string) => `/api/v1/investigations/${encodeURIComponent(id)}/evidence`,
  INVESTIGATION_REPORT: (id: string) => `/api/v1/investigations/${encodeURIComponent(id)}/report`,
  INVESTIGATION_REINVESTIGATE: (id: string) => `/api/v1/investigations/${encodeURIComponent(id)}/reinvestigate`,
  INVESTIGATION_TIMELINE: (id: string) => `/api/v1/investigations/${encodeURIComponent(id)}/timeline`,
  INVESTIGATION_GRAPH: (id: string) => `/api/v1/investigations/${encodeURIComponent(id)}/graph`,
  INVESTIGATION_GRAPH_EXPAND: (caseId: string, nodeId: string) =>
    `/api/v1/investigations/${encodeURIComponent(caseId)}/graph/expand/${encodeURIComponent(nodeId)}`,
  INVESTIGATION_RELATED: (id: string) => `/api/v1/investigations/${encodeURIComponent(id)}/related`,
  INVESTIGATION_EMAIL_ENTITY: (id: string) => `/api/v1/investigations/${encodeURIComponent(id)}/email-entity`,
  INVESTIGATION_GEOLOCATION: (id: string) => `/api/v1/investigations/${encodeURIComponent(id)}/geolocation`,
  INVESTIGATION_ARTIFACT: (id: string) => `/api/v1/investigations/${encodeURIComponent(id)}/artifact`,
  INVESTIGATION_REASON: (id: string) => `/api/v1/investigations/${encodeURIComponent(id)}/reason`,

  // Evidence actions
  EVIDENCE_ANNOTATE: (evidenceId: string) => `/api/v1/evidence/${encodeURIComponent(evidenceId)}/annotate`,
  EVIDENCE_VERIFY: (evidenceId: string) => `/api/v1/evidence/${encodeURIComponent(evidenceId)}/verify`,

  // Threat Intelligence
  THREAT_INTEL: (indicator: string) => `/api/v1/threat-intel/${encodeURIComponent(indicator)}`,
} as const;
