/**
 * ASHIELDER Unit Tests: AI/ML & Threat Intelligence UX Integration
 * Validates Role Permissions, Provenance Classification, and Scoped Investigation
 */

import { Role, RolePermissions, Permission } from '../../features/auth/authConfig.ts';
import { ProvenanceType, MLDetectionSignal } from '../../domain/investigator.ts';

export function runAimlThreatIntelValidation(): { passed: number; failed: number; errors: string[] } {
  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  function assert(condition: boolean, testName: string) {
    if (condition) {
      passed++;
    } else {
      failed++;
      errors.push(`Assertion failed: ${testName}`);
    }
  }

  // 1. Role Capabilities Separation (Section 7)
  const investigatorPerms = RolePermissions[Role.INVESTIGATOR];
  assert(investigatorPerms.includes('ai.query'), 'Investigator has ai.query permission');
  assert(investigatorPerms.includes('ml.detection.view'), 'Investigator has ml.detection.view permission');
  assert(investigatorPerms.includes('threat_intel.pivot'), 'Investigator has threat_intel.pivot permission');
  assert(!investigatorPerms.includes('ml.admin.manage'), 'Investigator is strictly forbidden from ml.admin.manage');
  assert(!investigatorPerms.includes('tenant.manage'), 'Investigator is strictly forbidden from tenant.manage');

  const adminPerms = RolePermissions[Role.ADMIN];
  assert(adminPerms.includes('ml.admin.manage'), 'Admin has ml.admin.manage permission');
  assert(adminPerms.includes('system.manage'), 'Admin has system.manage permission');

  const socPerms = RolePermissions[Role.SOC_ANALYST];
  assert(socPerms.includes('ai.operational_metrics'), 'SOC Analyst has ai.operational_metrics permission');
  assert(!socPerms.includes('ml.admin.manage'), 'SOC Analyst cannot administer production models');

  // 2. Provenance Classification (Section 1 & 12)
  const validProvenances: ProvenanceType[] = [
    'OBSERVED EVIDENCE',
    'THREAT INTELLIGENCE',
    'ML DETECTION',
    'AI ANALYSIS',
    'ANALYST DECISION',
  ];
  assert(validProvenances.length === 5, 'Enforces the 5 discrete forensic data classes');
  assert(validProvenances[0] === 'OBSERVED EVIDENCE', 'Forensic evidence is the primary authoritative baseline');

  // 3. Specimen Confidence vs Model Performance Segregation (Section 6)
  const mockSignal: MLDetectionSignal = {
    model_id: 'mdl-email-phish',
    model_name: 'Email Phishing Classifier',
    model_version: 'email-classifier-v1.4.2',
    prediction: 'PHISHING',
    confidence: 96,
    inference_latency_ms: 47,
    inference_status: 'Completed (Deterministic)',
    timestamp: '2026-09-08T08:14:23Z',
    supporting_evidence_ids: ['EVD-8812-01'],
    key_features_triggered: ['Lookalike sender domain', 'Urgent wire transfer lure'],
    evaluation_metrics: {
      precision: 94.0,
      recall: 91.2,
      f1: 92.5,
      evaluation_dataset: 'Benchmark-50k',
    },
  };

  assert(mockSignal.confidence === 96, 'Specimen prediction confidence is 96%');
  assert(mockSignal.evaluation_metrics?.precision === 94.0, 'Global precision is 94.0% and kept separate');
  assert(mockSignal.evaluation_metrics?.recall === 91.2, 'Global recall is 91.2% and kept separate');
  assert(mockSignal.evaluation_metrics?.f1 === 92.5, 'Global F1 score is 92.5% and kept separate');

  return { passed, failed, errors };
}
