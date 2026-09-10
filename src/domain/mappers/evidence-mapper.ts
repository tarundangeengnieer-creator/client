/**
 * ASHIELDER Evidence Mapper
 * Maps backend EvidenceItem contracts to NormalizedEvidenceEntity view models
 */

import { EvidenceItem } from '../../contracts/backend.ts';
import { getSeverityFromWeight, NormalizedEvidenceEntity } from '../evidence.ts';

export function mapBackendEvidenceToNormalized(item: EvidenceItem): NormalizedEvidenceEntity {
  // Extract risk weight contribution if present in metadata or value
  let riskWeight = 0;
  if (item.metadata && typeof item.metadata.risk_weight === 'number') {
    riskWeight = item.metadata.risk_weight;
  } else if (item.value && typeof item.value === 'object' && 'weight' in (item.value as Record<string, unknown>)) {
    riskWeight = Number((item.value as Record<string, unknown>).weight) || 0;
  }

  // Derive human title and technical description
  const title = item.key ? item.key.replace(/_/g, ' ').toUpperCase() : `EVIDENCE ${item.evidence_id}`;
  let description = '';
  if (typeof item.value === 'string') {
    description = item.value;
  } else if (typeof item.value === 'object' && item.value !== null) {
    if ('description' in (item.value as Record<string, unknown>)) {
      description = String((item.value as Record<string, unknown>).description);
    } else {
      description = JSON.stringify(item.value);
    }
  } else {
    description = String(item.value);
  }

  // Provenance mapping
  const provenance = {
    producerModule: item.provenance?.producer_module || item.source || 'core_engine',
    sourceArtifact: item.provenance?.source_artifact || undefined,
    extractionMethod: item.provenance?.extraction_method || undefined,
    createdAt: item.provenance?.created_at || item.timestamp || new Date().toISOString(),
    sha256Hash: (item.metadata?.sha256 as string) || (item.metadata?.hash as string) || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    byteOffsetStart: typeof item.metadata?.byte_offset_start === 'number' ? item.metadata.byte_offset_start : undefined,
    byteOffsetEnd: typeof item.metadata?.byte_offset_end === 'number' ? item.metadata.byte_offset_end : undefined,
    rawSnippet: typeof item.metadata?.raw_snippet === 'string' ? item.metadata.raw_snippet : undefined,
  };

  return {
    id: item.evidence_id,
    category: item.category,
    type: item.type,
    trustLevel: item.trust_level,
    severity: getSeverityFromWeight(riskWeight),
    title,
    description,
    sourceTool: item.provenance?.producer_module || item.source || 'analyzer',
    timestamp: item.timestamp,
    provenance,
    metrics: {
      riskWeight,
      confidenceScore: item.confidence ?? 1.0,
    },
    relatedEvidenceIds: item.evidence_reference ? [item.evidence_reference] : [],
    rawItem: item,
  };
}
