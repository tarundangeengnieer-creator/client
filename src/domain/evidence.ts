/**
 * ASHIELDER Normalized Evidence Domain Model
 * Adheres to Section 14 of ASHIELDER_FRONTEND_ARCHITECTURE.md
 */

import { EvidenceCategory, EvidenceType, TrustLevel } from '../contracts/backend.ts';

export type EvidenceSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface EvidenceProvenanceView {
  producerModule: string;
  sourceArtifact?: string;
  extractionMethod?: string;
  createdAt: string;
  byteOffsetStart?: number;
  byteOffsetEnd?: number;
  rawSnippet?: string;
  sha256Hash: string;
}

export interface NormalizedEvidenceEntity {
  id: string; // E.g., "EVD-HDR-001"
  category: EvidenceCategory;
  type: EvidenceType;
  trustLevel: TrustLevel;
  severity: EvidenceSeverity;
  title: string;
  description: string;
  sourceTool: string;
  timestamp: string;
  provenance: EvidenceProvenanceView;
  metrics: {
    riskWeight: number; // Contribution to total risk score
    confidenceScore: number; // 0.0 - 1.0
  };
  relatedEvidenceIds: string[];
  rawItem: unknown;
}

export function getSeverityFromWeight(weight: number): EvidenceSeverity {
  if (weight >= 30) return 'CRITICAL';
  if (weight >= 20) return 'HIGH';
  if (weight >= 10) return 'MEDIUM';
  if (weight > 0) return 'LOW';
  return 'INFO';
}

export function getCategoryBadgeColor(category: EvidenceCategory): string {
  switch (category) {
    case EvidenceCategory.AUTHENTICATION:
      return 'text-amber-600 dark:text-amber-400 bg-transparent border-amber-500/30';
    case EvidenceCategory.HEADER:
      return 'text-sky-600 dark:text-sky-400 bg-transparent border-sky-500/30';
    case EvidenceCategory.URL:
      return 'text-rose-600 dark:text-rose-400 bg-transparent border-rose-500/30';
    case EvidenceCategory.ATTACHMENT:
      return 'text-purple-600 dark:text-purple-400 bg-transparent border-purple-500/30';
    case EvidenceCategory.RELAY:
      return 'text-emerald-600 dark:text-emerald-400 bg-transparent border-emerald-500/30';
    case EvidenceCategory.CONTENT:
      return 'text-orange-600 dark:text-orange-400 bg-transparent border-orange-500/30';
    case EvidenceCategory.THREAT_INTEL:
      return 'text-rose-600 dark:text-rose-400 bg-transparent border-rose-500/30';
    case EvidenceCategory.HISTORICAL:
      return 'text-indigo-600 dark:text-indigo-400 bg-transparent border-indigo-500/30';
    default:
      return 'text-slate-600 dark:text-slate-400 bg-transparent border-slate-500/30';
  }
}
