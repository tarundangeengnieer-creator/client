/**
 * ASHIELDER Investigator Store
 *
 * Manages reactive forensic investigation state using useSyncExternalStore.
 * Enforces tenant isolation, bounded graph depth, resilient subsystem failure isolation,
 * and immutable evidence tracking.
 */

import { useSyncExternalStore } from 'react';
import { investigatorRepo } from '../api/investigator-repository.ts';
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

export interface InvestigatorState {
  currentCaseId: string | null;
  cases: InvestigatorCase[];
  currentCase: InvestigatorCase | null;
  timelineEvents: TimelineEvent[];
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  graphDepth: number;
  relatedCases: RelatedCaseMatch[];
  caseEvidence: InvestigatorEvidence[];
  emailEntity: EmailEntity | null;
  geographicHops: GeographicActivityHop[];
  threatIntel: ThreatIntelEnrichment | null;
  
  // Resilient subsystem simulation
  isThreatIntelOffline: boolean;

  // Selected item contexts
  selectedEntity: GraphNode | null;
  selectedEdge: GraphEdge | null;
  isolatedNodeId: string | null;
  selectedTimelineEvent: TimelineEvent | null;
  selectedEvidence: InvestigatorEvidence | null;
  selectedGeoHop: GeographicActivityHop | null;
  focusedMapCoords: [number, number] | null;

  // Drawers and Modals
  isEntityProfileOpen: boolean;
  isEvidenceInspectorOpen: boolean;
  isEmailEntityOpen: boolean;
  isLinkModalOpen: boolean;
  isMergeModalOpen: boolean;
  isEscalateModalOpen: boolean;

  // Graph accessibility & filtering
  graphViewMode: 'graph' | 'table';
  graphFilterType: string | null;

  // Granular Loading States
  isLoadingCases: boolean;
  isLoadingCaseDetail: boolean;
  isLoadingTimeline: boolean;
  isLoadingGraph: boolean;
  isLoadingRelated: boolean;
  isLoadingEvidence: boolean;
  isLoadingTI: boolean;
  isExpandingNode: boolean;
  isActionInProgress: boolean;

  // Granular Error States (Isolated Subsystems)
  errorCases: string | null;
  errorTimeline: string | null;
  errorGraph: string | null;
  errorRelated: string | null;
  errorEvidence: string | null;
  errorTI: string | null;
};

const initialState: InvestigatorState = {
  currentCaseId: 'CASE-2026-8812',
  cases: [],
  currentCase: null,
  timelineEvents: [],
  graphNodes: [],
  graphEdges: [],
  graphDepth: 2,
  relatedCases: [],
  caseEvidence: [],
  emailEntity: null,
  geographicHops: [],
  threatIntel: null,
  isThreatIntelOffline: false,

  selectedEntity: null,
  selectedEdge: null,
  isolatedNodeId: null,
  selectedTimelineEvent: null,
  selectedEvidence: null,
  selectedGeoHop: null,
  focusedMapCoords: null,

  isEntityProfileOpen: false,
  isEvidenceInspectorOpen: false,
  isEmailEntityOpen: false,
  isLinkModalOpen: false,
  isMergeModalOpen: false,
  isEscalateModalOpen: false,

  graphViewMode: 'graph',
  graphFilterType: null,

  isLoadingCases: false,
  isLoadingCaseDetail: false,
  isLoadingTimeline: false,
  isLoadingGraph: false,
  isLoadingRelated: false,
  isLoadingEvidence: false,
  isLoadingTI: false,
  isExpandingNode: false,
  isActionInProgress: false,

  errorCases: null,
  errorTimeline: null,
  errorGraph: null,
  errorRelated: null,
  errorEvidence: null,
  errorTI: null,
};

let currentState: InvestigatorState = initialState;
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

export const investigatorStore = {
  getSnapshot(): InvestigatorState {
    return currentState;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  async initWorkspace(tenantId: string, preferredCaseId?: string): Promise<void> {
    currentState = {
      ...currentState,
      isLoadingCases: true,
      errorCases: null,
    };
    notify();

    try {
      const cases = await investigatorRepo.getCases(tenantId);
      const targetCaseId = preferredCaseId || currentState.currentCaseId || (cases[0]?.case_id ?? null);

      currentState = {
        ...currentState,
        cases,
        currentCaseId: targetCaseId,
        isLoadingCases: false,
      };
      notify();

      if (targetCaseId) {
        await investigatorStore.loadCaseDetails(targetCaseId, tenantId);
      }
    } catch (err: unknown) {
      currentState = {
        ...currentState,
        isLoadingCases: false,
        errorCases: err instanceof Error ? err.message : 'Failed to retrieve cases for tenant context.',
      };
      notify();
    }
  },

  async selectCase(caseId: string, tenantId: string): Promise<void> {
    if (currentState.currentCaseId === caseId && currentState.currentCase) return;

    currentState = {
      ...currentState,
      currentCaseId: caseId,
      selectedEntity: null,
      selectedTimelineEvent: null,
      selectedEvidence: null,
      isEntityProfileOpen: false,
      isEvidenceInspectorOpen: false,
      isEmailEntityOpen: false,
    };
    notify();

    await investigatorStore.loadCaseDetails(caseId, tenantId);
  },

  async loadCaseDetails(caseId: string, tenantId: string): Promise<void> {
    currentState = {
      ...currentState,
      isLoadingCaseDetail: true,
      isLoadingTimeline: true,
      isLoadingGraph: true,
      isLoadingRelated: true,
      isLoadingEvidence: true,
      isLoadingTI: true,
      errorTimeline: null,
      errorGraph: null,
      errorRelated: null,
      errorEvidence: null,
      errorTI: null,
    };
    notify();

    // 1. Fetch Case info
    const caseObj = await investigatorRepo.getCase(caseId, tenantId);
    currentState = {
      ...currentState,
      currentCase: caseObj,
      isLoadingCaseDetail: false,
    };
    notify();

    // 2. Fetch Timeline (Isolated subsystem)
    investigatorRepo
      .getTimeline(caseId, tenantId)
      .then((events) => {
        currentState = {
          ...currentState,
          timelineEvents: events,
          isLoadingTimeline: false,
        };
        notify();
      })
      .catch((err) => {
        currentState = {
          ...currentState,
          errorTimeline: err instanceof Error ? err.message : 'Timeline service unavailable.',
          isLoadingTimeline: false,
        };
        notify();
      });

    // 3. Fetch Graph (Isolated subsystem with default bounded depth ≈ 2 hops)
    investigatorRepo
      .getGraph(caseId, tenantId, currentState.graphDepth)
      .then((graph) => {
        currentState = {
          ...currentState,
          graphNodes: graph.nodes,
          graphEdges: graph.edges,
          isLoadingGraph: false,
        };
        notify();
      })
      .catch((err) => {
        currentState = {
          ...currentState,
          errorGraph: err instanceof Error ? err.message : 'Entity relationship graph service unavailable.',
          isLoadingGraph: false,
        };
        notify();
      });

    // 4. Fetch Related Cases (Isolated subsystem)
    investigatorRepo
      .getRelatedCases(caseId, tenantId)
      .then((related) => {
        currentState = {
          ...currentState,
          relatedCases: related,
          isLoadingRelated: false,
        };
        notify();
      })
      .catch((err) => {
        currentState = {
          ...currentState,
          errorRelated: err instanceof Error ? err.message : 'Related case correlation unavailable.',
          isLoadingRelated: false,
        };
        notify();
      });

    // 5. Fetch Evidence (Isolated subsystem)
    investigatorRepo
      .getCaseEvidence(caseId, tenantId)
      .then((evidence) => {
        currentState = {
          ...currentState,
          caseEvidence: evidence,
          isLoadingEvidence: false,
        };
        notify();
      })
      .catch((err) => {
        currentState = {
          ...currentState,
          errorEvidence: err instanceof Error ? err.message : 'Forensic evidence ledger unavailable.',
          isLoadingEvidence: false,
        };
        notify();
      });

    // 6. Fetch Email Entity & Secondary Geolocation
    investigatorRepo.getEmailEntity(caseId, tenantId).then((eml) => {
      currentState = { ...currentState, emailEntity: eml };
      notify();
    });

    investigatorRepo.getGeographicActivity(caseId, tenantId).then((hops) => {
      const earliest = hops.find((h) => h.is_earliest_reliable) || hops[0] || null;
      currentState = {
        ...currentState,
        geographicHops: hops,
        selectedGeoHop: earliest,
        focusedMapCoords: earliest?.lng !== undefined && earliest?.lat !== undefined ? [earliest.lng, earliest.lat] : null,
      };
      notify();
    });

    // 7. Threat Intelligence (Isolated subsystem)
    if (!currentState.isThreatIntelOffline && caseObj?.primary_ioc) {
      investigatorRepo
        .getThreatIntel(caseObj.primary_ioc, tenantId)
        .then((ti) => {
          currentState = {
            ...currentState,
            threatIntel: ti,
            isLoadingTI: false,
          };
          notify();
        })
        .catch((err) => {
          currentState = {
            ...currentState,
            errorTI: err instanceof Error ? err.message : 'Threat Intelligence service degraded.',
            isLoadingTI: false,
          };
          notify();
        });
    } else {
      currentState = {
        ...currentState,
        threatIntel: null,
        isLoadingTI: false,
        errorTI: currentState.isThreatIntelOffline ? 'Threat intelligence provider temporarily offline (Simulated Fallback)' : null,
      };
      notify();
    }
  },

  async expandNode(nodeId: string, tenantId: string): Promise<void> {
    if (!currentState.currentCaseId || currentState.isExpandingNode) return;

    currentState = { ...currentState, isExpandingNode: true };
    notify();

    try {
      const expansion = await investigatorRepo.expandGraphNode(
        currentState.currentCaseId,
        nodeId,
        tenantId
      );

      // Merge new bounded nodes and edges without mutating existing state
      const existingNodeIds = new Set(currentState.graphNodes.map((n) => n.id));
      const newNodes = expansion.nodes.filter((n) => !existingNodeIds.has(n.id));

      const existingEdgeIds = new Set(currentState.graphEdges.map((e) => e.id));
      const newEdges = expansion.edges.filter((e) => !existingEdgeIds.has(e.id));

      currentState = {
        ...currentState,
        graphNodes: [...currentState.graphNodes, ...newNodes],
        graphEdges: [...currentState.graphEdges, ...newEdges],
        isExpandingNode: false,
      };
      notify();
    } catch (err: unknown) {
      currentState = {
        ...currentState,
        isExpandingNode: false,
        errorGraph: err instanceof Error ? err.message : 'Failed to expand graph relationship.',
      };
      notify();
    }
  },

  selectEntity(node: GraphNode | null): void {
    const matchingHop = node
      ? currentState.geographicHops.find(
          (h) => h.ip.toLowerCase() === node.value.toLowerCase() || (h.hostname && h.hostname.toLowerCase() === node.value.toLowerCase())
        )
      : null;

    currentState = {
      ...currentState,
      selectedEntity: node,
      isEntityProfileOpen: Boolean(node),
      selectedGeoHop: matchingHop || currentState.selectedGeoHop,
      focusedMapCoords: matchingHop?.lng !== undefined && matchingHop?.lat !== undefined ? [matchingHop.lng, matchingHop.lat] : currentState.focusedMapCoords,
    };
    notify();
  },

  openEntityProfile(open = true): void {
    currentState = {
      ...currentState,
      isEntityProfileOpen: open,
    };
    notify();
  },

  closeEntityProfile(): void {
    currentState = {
      ...currentState,
      isEntityProfileOpen: false,
    };
    notify();
  },

  selectTimelineEvent(event: TimelineEvent | null): void {
    const matchingNode = event
      ? currentState.graphNodes.find(
          (n) =>
            (event.associated_entity_id && (n.id === event.associated_entity_id || n.value.toLowerCase() === event.associated_entity_id.toLowerCase())) ||
            (n.value && n.value.length > 3 && event.summary.toLowerCase().includes(n.value.toLowerCase()))
        )
      : null;

    const matchingHop = event
      ? currentState.geographicHops.find(
          (h) =>
            event.summary.toLowerCase().includes(h.ip.toLowerCase()) ||
            (h.hostname && event.summary.toLowerCase().includes(h.hostname.toLowerCase()))
        )
      : null;

    currentState = {
      ...currentState,
      selectedTimelineEvent: event,
      selectedEntity: matchingNode || currentState.selectedEntity,
      selectedGeoHop: matchingHop || currentState.selectedGeoHop,
      focusedMapCoords: matchingHop?.lng !== undefined && matchingHop?.lat !== undefined ? [matchingHop.lng, matchingHop.lat] : currentState.focusedMapCoords,
    };
    notify();
  },

  selectGeoHop(hop: GeographicActivityHop | null): void {
    if (!hop) {
      currentState = {
        ...currentState,
        selectedGeoHop: null,
      };
      notify();
      return;
    }

    const matchingGraphNode = currentState.graphNodes.find(
      (n) => n.value.toLowerCase() === hop.ip.toLowerCase() || (hop.hostname && n.value.toLowerCase().includes(hop.hostname.toLowerCase()))
    );

    const matchingTimelineEvent = currentState.timelineEvents.find(
      (e) =>
        e.summary.toLowerCase().includes(hop.ip.toLowerCase()) ||
        (hop.hostname && e.summary.toLowerCase().includes(hop.hostname.toLowerCase()))
    );

    currentState = {
      ...currentState,
      selectedGeoHop: hop,
      focusedMapCoords: hop.lng !== undefined && hop.lat !== undefined ? [hop.lng, hop.lat] : currentState.focusedMapCoords,
      selectedEntity: matchingGraphNode || currentState.selectedEntity,
      selectedTimelineEvent: matchingTimelineEvent || currentState.selectedTimelineEvent,
    };
    notify();
  },

  selectEvidence(evidence: InvestigatorEvidence | null): void {
    currentState = {
      ...currentState,
      selectedEvidence: evidence,
      isEvidenceInspectorOpen: Boolean(evidence),
    };
    notify();
  },

  openEvidenceInspector(isOpen: boolean = true): void {
    currentState = {
      ...currentState,
      isEvidenceInspectorOpen: isOpen,
    };
    notify();
  },

  closeEvidenceInspector(): void {
    currentState = {
      ...currentState,
      isEvidenceInspectorOpen: false,
    };
    notify();
  },

  openEmailEntityModal(open = true): void {
    currentState = {
      ...currentState,
      isEmailEntityOpen: open,
    };
    notify();
  },

  openLinkModal(open = true): void {
    currentState = {
      ...currentState,
      isLinkModalOpen: open,
    };
    notify();
  },

  openMergeModal(open = true): void {
    currentState = {
      ...currentState,
      isMergeModalOpen: open,
    };
    notify();
  },

  openEscalateModal(open = true): void {
    currentState = {
      ...currentState,
      isEscalateModalOpen: open,
    };
    notify();
  },

  setGraphViewMode(mode: 'graph' | 'table'): void {
    currentState = {
      ...currentState,
      graphViewMode: mode,
    };
    notify();
  },

  setGraphFilterType(type: string | null): void {
    currentState = {
      ...currentState,
      graphFilterType: type,
    };
    notify();
  },

  selectEdge(edge: GraphEdge | null): void {
    currentState = {
      ...currentState,
      selectedEdge: edge,
    };
    notify();
  },

  setIsolatedNode(nodeId: string | null): void {
    currentState = {
      ...currentState,
      isolatedNodeId: nodeId,
    };
    notify();
  },

  async setGraphDepth(depth: number, tenantId: string): Promise<void> {
    if (!currentState.currentCaseId || currentState.graphDepth === depth) return;
    currentState = {
      ...currentState,
      graphDepth: depth,
      isLoadingGraph: true,
    };
    notify();

    try {
      const graph = await investigatorRepo.getGraph(currentState.currentCaseId, tenantId, depth);
      currentState = {
        ...currentState,
        graphNodes: graph.nodes,
        graphEdges: graph.edges,
        isLoadingGraph: false,
      };
      notify();
    } catch (err: unknown) {
      currentState = {
        ...currentState,
        isLoadingGraph: false,
        errorGraph: err instanceof Error ? err.message : 'Failed to update graph depth.',
      };
      notify();
    }
  },

  toggleThreatIntelOffline(): void {
    const next = !currentState.isThreatIntelOffline;
    currentState = {
      ...currentState,
      isThreatIntelOffline: next,
      errorTI: next ? 'Threat intelligence provider temporarily offline (Simulated Fallback)' : null,
    };
    notify();
  },

  async annotateEvidence(
    evidenceId: string,
    note: string,
    author: string,
    tenantId: string
  ): Promise<boolean> {
    currentState = { ...currentState, isActionInProgress: true };
    notify();

    try {
      const updated = await investigatorRepo.annotateEvidence(evidenceId, note, author, tenantId);
      currentState = {
        ...currentState,
        caseEvidence: currentState.caseEvidence.map((e) =>
          e.evidence_id === evidenceId ? updated : e
        ),
        selectedEvidence:
          currentState.selectedEvidence?.evidence_id === evidenceId
            ? updated
            : currentState.selectedEvidence,
        isActionInProgress: false,
      };
      notify();
      return true;
    } catch {
      currentState = { ...currentState, isActionInProgress: false };
      notify();
      return false;
    }
  },

  async verifyEvidence(
    evidenceId: string,
    state: 'VERIFIED' | 'DISPUTED',
    author: string,
    tenantId: string
  ): Promise<boolean> {
    currentState = { ...currentState, isActionInProgress: true };
    notify();

    try {
      const updated = await investigatorRepo.verifyEvidence(evidenceId, state, author, tenantId);
      currentState = {
        ...currentState,
        caseEvidence: currentState.caseEvidence.map((e) =>
          e.evidence_id === evidenceId ? updated : e
        ),
        selectedEvidence:
          currentState.selectedEvidence?.evidence_id === evidenceId
            ? updated
            : currentState.selectedEvidence,
        isActionInProgress: false,
      };
      notify();
      return true;
    } catch {
      currentState = { ...currentState, isActionInProgress: false };
      notify();
      return false;
    }
  },

  async linkCase(
    targetCaseId: string,
    justification: string,
    tenantId: string
  ): Promise<{ success: boolean; message: string }> {
    if (!currentState.currentCaseId) return { success: false, message: 'No active case' };

    currentState = { ...currentState, isActionInProgress: true };
    notify();

    try {
      const res = await investigatorRepo.linkCase(
        currentState.currentCaseId,
        targetCaseId,
        justification,
        tenantId
      );

      // Refresh timeline and related cases
      const [events, related] = await Promise.all([
        investigatorRepo.getTimeline(currentState.currentCaseId, tenantId),
        investigatorRepo.getRelatedCases(currentState.currentCaseId, tenantId),
      ]);

      currentState = {
        ...currentState,
        timelineEvents: events,
        relatedCases: related,
        isLinkModalOpen: false,
        isActionInProgress: false,
      };
      notify();
      return res;
    } catch (err: unknown) {
      currentState = { ...currentState, isActionInProgress: false };
      notify();
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Linking failed.',
      };
    }
  },

  async mergeCases(
    targetCaseId: string,
    campaignName: string,
    tenantId: string
  ): Promise<{ success: boolean; message: string }> {
    if (!currentState.currentCaseId) return { success: false, message: 'No active case' };

    currentState = { ...currentState, isActionInProgress: true };
    notify();

    try {
      const res = await investigatorRepo.mergeCases(
        currentState.currentCaseId,
        targetCaseId,
        campaignName,
        tenantId
      );

      const [events, updatedCase] = await Promise.all([
        investigatorRepo.getTimeline(currentState.currentCaseId, tenantId),
        investigatorRepo.getCase(currentState.currentCaseId, tenantId),
      ]);

      currentState = {
        ...currentState,
        timelineEvents: events,
        currentCase: updatedCase,
        isMergeModalOpen: false,
        isActionInProgress: false,
      };
      notify();
      return res;
    } catch (err: unknown) {
      currentState = { ...currentState, isActionInProgress: false };
      notify();
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Campaign merge failed.',
      };
    }
  },

  async escalateCase(
    rationale: string,
    urgency: string,
    tenantId: string
  ): Promise<{ success: boolean; escalationId?: string; message: string }> {
    if (!currentState.currentCaseId) return { success: false, message: 'No active case' };

    currentState = { ...currentState, isActionInProgress: true };
    notify();

    try {
      const res = await investigatorRepo.escalateToFraudIR(
        currentState.currentCaseId,
        rationale,
        urgency,
        tenantId
      );

      const events = await investigatorRepo.getTimeline(currentState.currentCaseId, tenantId);

      currentState = {
        ...currentState,
        timelineEvents: events,
        isEscalateModalOpen: false,
        isActionInProgress: false,
      };
      notify();
      return {
        success: true,
        escalationId: res.escalationId,
        message: `Case successfully escalated to Fraud & IR (${res.escalationId})`,
      };
    } catch (err: unknown) {
      currentState = { ...currentState, isActionInProgress: false };
      notify();
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Escalation failed.',
      };
    }
  },
};

export function useInvestigator(): InvestigatorState {
  return useSyncExternalStore(investigatorStore.subscribe, investigatorStore.getSnapshot);
}
