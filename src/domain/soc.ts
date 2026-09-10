export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertStatus = 'NEW' | 'OPEN' | 'INVESTIGATING' | 'ESCALATED' | 'CLOSED_TRUE_POSITIVE' | 'CLOSED_FALSE_POSITIVE';
export type ThreatCategory = 'Phishing' | 'Malware' | 'Business Email Compromise' | 'Spam' | 'Account Takeover' | 'Suspicious Login';

export interface AlertAuthSignals {
  spf: 'PASS' | 'FAIL' | 'NEUTRAL' | 'NONE';
  dkim: 'PASS' | 'FAIL' | 'NEUTRAL' | 'NONE';
  dmarc: 'PASS' | 'FAIL' | 'NEUTRAL' | 'NONE';
}

export interface Alert {
  id: string;
  tenant_id: string;
  timestamp: string; // ISO 8601
  severity: AlertSeverity;
  status: AlertStatus;
  threat_category: ThreatCategory;
  threat_score: number; // 0-100
  subject: string;
  sender: string;
  recipient: string;
  source_geo: string;
  source_ip: string;
  assigned_analyst?: string;
  auth_signals: AlertAuthSignals;
  is_sla_breached: boolean;
  email_entity_id: string; // foreign key to EmailEntity
  related_case_id?: string; // if escalated
}

export interface KPIContext {
  openAlertsAssignedToMe: number;
  alertsBreachingSLA: number;
  criticalHighUnresolved: number;
  newAlertsLast15m: number;
}

export interface ThreatCategoryTrend {
  category: ThreatCategory;
  count: number;
  severity_breakdown: Record<AlertSeverity, number>;
}

export interface AlertAgingBucket {
  label: '0-15m' | '15m-1h' | '1-4h' | '4h+' | 'SLA Breaching';
  count: number;
}

export interface AuthFailureTrendPoint {
  timestamp: string;
  spfFails: number;
  dkimFails: number;
  dmarcFails: number;
}
