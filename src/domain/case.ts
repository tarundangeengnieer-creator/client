/**
 * ASHIELDER Case Domain & View Models
 */

import { InvestigationStatus, Recommendation, Verdict } from '../contracts/backend.ts';

export interface ResourceEnvelopeModel {
  wallClockMs: number;
  toolCalls: number;
  externalCalls: number;
  tokensUsed: number;
}

export interface CaseViewModel {
  id: string;
  status: InvestigationStatus;
  verdict: Verdict;
  riskScore: number; // 0 - 100
  confidence: number; // 0.0 - 1.0
  recommendation: Recommendation;
  subject: string;
  sender: string;
  recipient: string;
  timestamp: string;
  toolsUsed: string[];
  toolsFailed: string[];
  iterationCount: number;
  stopReason: string;
  resourceEnvelope: ResourceEnvelopeModel;
  evidenceCount: number;
  attackHypotheses: string[];
  primaryIoc?: string;
  originIp?: string;
  originCountry?: string;
  isTorExit?: boolean;
  hasAttachmentMismatch?: boolean;
  
  // Universal Queue / SOC Attributes
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  assignee?: string;
  isSlaBreached?: boolean;
  threatCategory?: string;
  authSignals?: { spf: string; dkim: string; dmarc: string };
}

export type TableDensityMode = 'compact' | 'standard' | 'preview';
