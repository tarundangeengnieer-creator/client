/**
 * ASHIELDER Backend API Endpoints Registry
 * Authoritative mapping to FastAPI endpoints defined in ASHIELDER_FRONTEND_API_INTEGRATION_SPEC.md
 */

export const ENDPOINTS = {
  HEALTH: '/health',
  INVESTIGATIONS_ANALYZE: '/api/v1/investigations/analyze',
  INVESTIGATION_DETAIL: (id: string) => `/api/v1/investigations/${encodeURIComponent(id)}`,
  INVESTIGATION_EVIDENCE: (id: string) => `/api/v1/investigations/${encodeURIComponent(id)}/evidence`,
  INVESTIGATION_REPORT: (id: string) => `/api/v1/investigations/${encodeURIComponent(id)}/report`,
  INVESTIGATION_REINVESTIGATE: (id: string) => `/api/v1/investigations/${encodeURIComponent(id)}/reinvestigate`,
  EMAILS_ANALYZE: '/api/v1/emails/analyze',
  CASES_REASONING: '/api/v1/cases/reasoning',
  CASES_NOTES: '/api/v1/cases/notes',
} as const;
