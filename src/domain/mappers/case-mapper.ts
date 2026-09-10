/**
 * ASHIELDER Case ViewModel Mapper
 * Converts backend InvestigationResult into an immutable CaseViewModel
 */

import { InvestigationResult, Recommendation, Verdict } from '../../contracts/backend.ts';
import { CaseViewModel } from '../case.ts';

export function mapInvestigationToCaseViewModel(
  result: InvestigationResult,
  extra?: { subject?: string; sender?: string; recipient?: string }
): CaseViewModel {
  const verdict = result.verdict || Verdict.INCONCLUSIVE;

  // Derive primary IOC from threat intelligence or geolocation
  let primaryIoc: string | undefined;
  if (result.threat_intelligence && result.threat_intelligence.length > 0) {
    primaryIoc = result.threat_intelligence[0];
  } else if (result.geolocation && result.geolocation.length > 0 && result.geolocation[0].ip) {
    primaryIoc = result.geolocation[0].ip;
  }

  // Derive origin IP & country
  const originGeo = result.geolocation && result.geolocation.length > 0 ? result.geolocation[0] : null;

  // Derive recommendation based on verdict
  let recommendation: Recommendation = Recommendation.MONITOR;
  if (verdict === Verdict.MALICIOUS) {
    recommendation = Recommendation.QUARANTINE;
  } else if (verdict === Verdict.SUSPICIOUS) {
    recommendation = Recommendation.ESCALATE_TO_ANALYST;
  } else if (verdict === Verdict.BENIGN) {
    recommendation = Recommendation.NO_ACTION;
  } else if (verdict === Verdict.INCONCLUSIVE) {
    recommendation = Recommendation.REQUEST_MORE_EVIDENCE;
  }

  return {
    id: result.investigation_id,
    status: result.status,
    verdict,
    riskScore: result.risk_score ?? 0,
    confidence: result.confidence ?? 0,
    recommendation,
    subject: extra?.subject || (result.risk_reasons && result.risk_reasons.length > 0 ? result.risk_reasons[0] : 'Forensic Investigation Case'),
    sender: extra?.sender || (originGeo?.ip ? `origin:[${originGeo.ip}]` : 'unknown@sender.external'),
    recipient: extra?.recipient || 'soc-triage@targetcorp.in',
    timestamp: result.completed_at || result.created_at || new Date().toISOString(),
    toolsUsed: result.tools_used || [],
    toolsFailed: result.tools_failed || [],
    iterationCount: result.iteration_count || 1,
    stopReason: result.stop_reason || 'COMPLETE',
    resourceEnvelope: {
      wallClockMs: result.budget_spent?.latency_ms ?? 0,
      toolCalls: result.budget_spent?.tool_calls ?? (result.tools_used?.length || 0),
      externalCalls: result.budget_spent?.external_calls ?? 0,
      tokensUsed: result.budget_spent?.llm_tokens ?? 0,
    },
    evidenceCount: (result.observed_facts?.length || 0) +
                   (result.heuristic_findings?.length || 0) +
                   (result.ml_signals?.length || 0) +
                   (result.threat_intelligence?.length || 0),
    attackHypotheses: result.attack_hypotheses ? result.attack_hypotheses.map(h => h.hypothesis_type) : [],
    primaryIoc,
    originIp: originGeo?.ip,
    originCountry: originGeo?.country || originGeo?.country_code || undefined,
    isTorExit: originGeo ? (originGeo.provider_observations && JSON.stringify(originGeo.provider_observations).includes('tor')) : false,
    hasAttachmentMismatch: false,
  };
}
