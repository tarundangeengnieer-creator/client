/**
 * rest-investigator-repository.ts
 *
 * REST implementation of InvestigatorRepository.
 * Calls the real FastAPI backend via apiClient.
 *
 * TENANT ISOLATION NOTE:
 *   The tenantId parameter is accepted for interface compatibility with
 *   MockInvestigatorRepository but is NOT sent to the backend.
 *   Tenant context is derived exclusively from the JWT Bearer token
 *   embedded by auth-store after login.
 *
 * DEFERRED OPERATIONS:
 *   linkCase, mergeCases, escalateToFraudIR — not yet implemented server-side.
 *   They throw a descriptive error in live mode. Mock mode remains fully functional.
 */

import type { InvestigatorRepository } from './investigator-repository.ts';
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
import { apiClient } from './client.ts';
import { ENDPOINTS } from './endpoints.ts';
import {
  mapCaseList,
  mapCase,
  mapEvidenceList,
  mapEvidence,
  mapTimeline,
  mapGraph,
  mapRelatedCases,
  mapEmailEntity,
  mapGeoHops,
  mapThreatIntel,
} from './dto-mappers.ts';

export class RestInvestigatorRepository implements InvestigatorRepository {
  // -----------------------------------------------------------------
  // Cases
  // -----------------------------------------------------------------

  async getCases(_tenantId: string): Promise<InvestigatorCase[]> {
    const raw = await apiClient.get<unknown>(ENDPOINTS.INVESTIGATIONS_LIST);
    return mapCaseList(raw);
  }

  async getCase(caseId: string, _tenantId: string): Promise<InvestigatorCase | null> {
    try {
      const raw = await apiClient.get<unknown>(ENDPOINTS.INVESTIGATION_DETAIL(caseId));
      return mapCase(raw);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'NOT_FOUND_ERROR') {
        return null;
      }
      throw err;
    }
  }

  // -----------------------------------------------------------------
  // Timeline
  // -----------------------------------------------------------------

  async getTimeline(caseId: string, _tenantId: string): Promise<TimelineEvent[]> {
    const raw = await apiClient.get<unknown>(ENDPOINTS.INVESTIGATION_TIMELINE(caseId));
    return mapTimeline(raw);
  }

  // -----------------------------------------------------------------
  // Graph
  // -----------------------------------------------------------------

  async getGraph(
    caseId: string,
    _tenantId: string,
    maxDepth?: number,
    centerNodeId?: string,
  ): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    const params = new URLSearchParams();
    if (maxDepth !== undefined) params.set('max_depth', String(maxDepth));
    if (centerNodeId) params.set('center_node_id', centerNodeId);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const raw = await apiClient.get<unknown>(`${ENDPOINTS.INVESTIGATION_GRAPH(caseId)}${qs}`);
    return mapGraph(raw);
  }

  async expandGraphNode(
    caseId: string,
    nodeId: string,
    _tenantId: string,
  ): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
    const raw = await apiClient.get<unknown>(ENDPOINTS.INVESTIGATION_GRAPH_EXPAND(caseId, nodeId));
    return mapGraph(raw);
  }

  // -----------------------------------------------------------------
  // Related cases
  // -----------------------------------------------------------------

  async getRelatedCases(caseId: string, _tenantId: string): Promise<RelatedCaseMatch[]> {
    const raw = await apiClient.get<unknown>(ENDPOINTS.INVESTIGATION_RELATED(caseId));
    return mapRelatedCases(raw);
  }

  // -----------------------------------------------------------------
  // Deferred operations (not yet implemented server-side)
  // -----------------------------------------------------------------

  async linkCase(
    _caseId: string,
    _targetCaseId: string,
    _justification: string,
    _tenantId: string,
  ): Promise<{ success: boolean; message: string; linkedAt: string }> {
    throw new Error(
      'linkCase is not available in live mode. This operation requires a dedicated backend endpoint. Use mock mode for this workflow.',
    );
  }

  async mergeCases(
    _caseId: string,
    _targetCaseId: string,
    _campaignName: string,
    _tenantId: string,
  ): Promise<{ success: boolean; campaignId: string; message: string }> {
    throw new Error(
      'mergeCases is not available in live mode. This operation requires a dedicated backend endpoint. Use mock mode for this workflow.',
    );
  }

  // -----------------------------------------------------------------
  // Evidence
  // -----------------------------------------------------------------

  async getCaseEvidence(caseId: string, _tenantId: string): Promise<InvestigatorEvidence[]> {
    const raw = await apiClient.get<unknown>(ENDPOINTS.INVESTIGATION_EVIDENCE(caseId));
    return mapEvidenceList(raw);
  }

  async getEvidence(evidenceId: string, _tenantId: string): Promise<InvestigatorEvidence | null> {
    try {
      return null;
    } catch {
      return null;
    }
  }

  async annotateEvidence(
    evidenceId: string,
    note: string,
    author: string,
    _tenantId: string,
  ): Promise<InvestigatorEvidence> {
    const raw = await apiClient.post<unknown>(
      ENDPOINTS.EVIDENCE_ANNOTATE(evidenceId),
      { note, author },
    );
    return mapEvidence(raw);
  }

  async verifyEvidence(
    evidenceId: string,
    state: 'VERIFIED' | 'DISPUTED',
    author: string,
    _tenantId: string,
  ): Promise<InvestigatorEvidence> {
    const raw = await apiClient.post<unknown>(
      ENDPOINTS.EVIDENCE_VERIFY(evidenceId),
      { state, author },
    );
    return mapEvidence(raw);
  }

  // -----------------------------------------------------------------
  // Email entity
  // -----------------------------------------------------------------

  async getEmailEntity(emailId: string, _tenantId: string): Promise<EmailEntity | null> {
    try {
      const raw = await apiClient.get<unknown>(ENDPOINTS.INVESTIGATION_EMAIL_ENTITY(emailId));
      return mapEmailEntity(raw, emailId);
    } catch {
      return null;
    }
  }

  // -----------------------------------------------------------------
  // Geolocation
  // -----------------------------------------------------------------

  async getGeographicActivity(
    caseId: string,
    _tenantId: string,
  ): Promise<GeographicActivityHop[]> {
    try {
      const raw = await apiClient.get<unknown>(ENDPOINTS.INVESTIGATION_GEOLOCATION(caseId));
      return mapGeoHops(raw);
    } catch {
      return [];
    }
  }

  // -----------------------------------------------------------------
  // Threat intelligence
  // -----------------------------------------------------------------

  async getThreatIntel(
    indicator: string,
    _tenantId: string,
  ): Promise<ThreatIntelEnrichment | null> {
    try {
      const raw = await apiClient.get<unknown>(ENDPOINTS.THREAT_INTEL(indicator));
      return mapThreatIntel(raw);
    } catch {
      return null;
    }
  }

  // -----------------------------------------------------------------
  // Escalation (deferred)
  // -----------------------------------------------------------------

  async escalateToFraudIR(
    _caseId: string,
    _rationale: string,
    _urgency: string,
    _tenantId: string,
  ): Promise<{ success: boolean; escalationId: string; timestamp: string }> {
    throw new Error(
      'escalateToFraudIR is not available in live mode. Use mock mode or implement a dedicated escalation backend endpoint.',
    );
  }

  // -----------------------------------------------------------------
  // Forensic report export
  // -----------------------------------------------------------------

  async exportForensicReport(
    caseId: string,
    _tenantId: string,
  ): Promise<{ reportId: string; downloadUrl: string; generatedAt: string }> {
    try {
      const artifact = await apiClient.get<{ download_url: string; eml_sha256: string }>(
        ENDPOINTS.INVESTIGATION_ARTIFACT(caseId),
      );
      return {
        reportId: `report-${caseId}`,
        downloadUrl: artifact.download_url,
        generatedAt: new Date().toISOString(),
      };
    } catch {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
      const reportUrl = `${baseUrl.replace(/\/$/, '')}${ENDPOINTS.INVESTIGATION_REPORT(caseId)}`;
      return {
        reportId: `report-${caseId}`,
        downloadUrl: reportUrl,
        generatedAt: new Date().toISOString(),
      };
    }
  }
}
