import {
  Alert,
  KPIContext,
  ThreatCategoryTrend,
  AlertAgingBucket,
  AuthFailureTrendPoint,
  AlertStatus
} from '../domain/soc.ts';
import { EmailEntity } from '../domain/investigator.ts';

export interface SOCRepository {
  getAlerts(
    tenantId: string,
    filters?: { severity?: string; status?: string; category?: string; assignedTo?: string; agingBucket?: string }
  ): Promise<Alert[]>;
  updateAlertStatus(
    alertId: string,
    status: AlertStatus,
    tenantId: string,
    justification?: string
  ): Promise<Alert>;
  acknowledgeAlert(alertId: string, analyst: string, tenantId: string): Promise<Alert>;
  getEmailEntity(emailEntityId: string, tenantId: string): Promise<EmailEntity | null>;
  escalateToFraudIR(alertId: string, rationale: string, urgency: string, tenantId: string): Promise<{ success: boolean; escalationId: string }>;
  quarantine(target: string, type: 'DOMAIN' | 'SENDER' | 'IP', tenantId: string): Promise<{ success: boolean; quarantinedAt: string }>;
  addNote(alertId: string, note: string, author: string, tenantId: string): Promise<{ success: boolean }>;
  getKPIs(tenantId: string, analyst: string): Promise<KPIContext>;
  getAlertAging(tenantId: string): Promise<AlertAgingBucket[]>;
  getThreatCategoryTrend(tenantId: string): Promise<ThreatCategoryTrend[]>;
  getAuthFailureTrend(tenantId: string): Promise<AuthFailureTrendPoint[]>;
}

class MockSOCRepository implements SOCRepository {
  private alerts: Alert[] = [
    {
      id: 'ALT-10045',
      tenant_id: 'tnt_acme_soc',
      timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
      severity: 'CRITICAL',
      status: 'NEW',
      threat_category: 'Business Email Compromise',
      threat_score: 98,
      subject: 'URGENT: Executive Wire Authorization - Acquisition Settlement',
      sender: 'ceo-office@exec-acmecorp.com',
      recipient: 'treasury-ops@acme-corp.com',
      source_geo: 'RU',
      source_ip: '185.220.101.5',
      assigned_analyst: 'Alice SOC',
      auth_signals: { spf: 'FAIL', dkim: 'FAIL', dmarc: 'FAIL' },
      is_sla_breached: false,
      email_entity_id: 'eml_10045'
    },
    {
      id: 'ALT-10044',
      tenant_id: 'tnt_acme_soc',
      timestamp: new Date(Date.now() - 9 * 60000).toISOString(),
      severity: 'HIGH',
      status: 'NEW',
      threat_category: 'Phishing',
      threat_score: 89,
      subject: 'Microsoft 365: Your account password expires in 2 hours',
      sender: 'no-reply@auth-notifications-portal.live',
      recipient: 'sarah.jenkins@acme-corp.com',
      source_geo: 'NG',
      source_ip: '102.89.23.44',
      auth_signals: { spf: 'PASS', dkim: 'FAIL', dmarc: 'FAIL' },
      is_sla_breached: false,
      email_entity_id: 'eml_10044'
    },
    {
      id: 'ALT-10043',
      tenant_id: 'tnt_acme_soc',
      timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
      severity: 'CRITICAL',
      status: 'NEW',
      threat_category: 'Malware',
      threat_score: 95,
      subject: 'Security Patch Required: Critical_Update_KB99482.zip',
      sender: 'it-hotfix@microsoft-support-cdn.net',
      recipient: 'dev-team@acme-corp.com',
      source_geo: 'KP',
      source_ip: '175.45.176.8',
      auth_signals: { spf: 'FAIL', dkim: 'FAIL', dmarc: 'FAIL' },
      is_sla_breached: false,
      email_entity_id: 'eml_10043'
    },
    {
      id: 'ALT-10042',
      tenant_id: 'tnt_acme_soc',
      timestamp: new Date(Date.now() - 145 * 60000).toISOString(),
      severity: 'CRITICAL',
      status: 'NEW',
      threat_category: 'Business Email Compromise',
      threat_score: 96,
      subject: 'RE: Updated Vendor Banking Info (#INV-2026-8812)',
      sender: 'billing@paypal1-secure.com',
      recipient: 'finance.controller@acme-corp.com',
      source_geo: 'DE',
      source_ip: '185.220.101.5',
      assigned_analyst: 'Alice SOC',
      auth_signals: { spf: 'FAIL', dkim: 'FAIL', dmarc: 'FAIL' },
      is_sla_breached: true,
      email_entity_id: 'eml_10042',
      related_case_id: 'CASE-2026-8812'
    },
    {
      id: 'ALT-10041',
      tenant_id: 'tnt_acme_soc',
      timestamp: new Date(Date.now() - 95 * 60000).toISOString(),
      severity: 'HIGH',
      status: 'OPEN',
      threat_category: 'Account Takeover',
      threat_score: 87,
      subject: 'Suspicious OAuth App Grant: "Automated Mail Sync Protocol"',
      sender: 'cloud-identity@microsoft.com',
      recipient: 'ciso@acme-corp.com',
      source_geo: 'IR',
      source_ip: '5.200.14.92',
      auth_signals: { spf: 'PASS', dkim: 'PASS', dmarc: 'PASS' },
      is_sla_breached: true,
      email_entity_id: 'eml_10041'
    },
    {
      id: 'ALT-10040',
      tenant_id: 'tnt_acme_soc',
      timestamp: new Date(Date.now() - 75 * 60000).toISOString(),
      severity: 'HIGH',
      status: 'NEW',
      threat_category: 'Phishing',
      threat_score: 84,
      subject: 'DocuSign: Please review and sign Employee Bonus Schedule',
      sender: 'docusign@docusign-envelope-review.com',
      recipient: 'hr-all@acme-corp.com',
      source_geo: 'BR',
      source_ip: '177.12.98.110',
      assigned_analyst: 'Ankit Sharma',
      auth_signals: { spf: 'NEUTRAL', dkim: 'FAIL', dmarc: 'FAIL' },
      is_sla_breached: true,
      email_entity_id: 'eml_10040'
    },
    {
      id: 'ALT-10039',
      tenant_id: 'tnt_acme_soc',
      timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
      severity: 'HIGH',
      status: 'INVESTIGATING',
      threat_category: 'Malware',
      threat_score: 88,
      subject: 'DHL Express: Shipment Waybill Notification #884920412',
      sender: 'tracking@dhl-global-tracking.xyz',
      recipient: 'logistics@acme-corp.com',
      source_geo: 'CN',
      source_ip: '114.114.114.114',
      assigned_analyst: 'Alice SOC',
      auth_signals: { spf: 'FAIL', dkim: 'NONE', dmarc: 'FAIL' },
      is_sla_breached: false,
      email_entity_id: 'eml_10039'
    },
    {
      id: 'ALT-10038',
      tenant_id: 'tnt_acme_soc',
      timestamp: new Date(Date.now() - 13 * 60000).toISOString(),
      severity: 'HIGH',
      status: 'NEW',
      threat_category: 'Phishing',
      threat_score: 85,
      subject: 'IT Helpdesk: Scan QR Code to enroll in Authenticator App',
      sender: 'helpdesk-support@vpn-portal-auth.link',
      recipient: 'remote-workers@acme-corp.com',
      source_geo: 'UA',
      source_ip: '91.214.124.9',
      auth_signals: { spf: 'FAIL', dkim: 'FAIL', dmarc: 'FAIL' },
      is_sla_breached: false,
      email_entity_id: 'eml_10038'
    },
    {
      id: 'ALT-10037',
      tenant_id: 'tnt_acme_soc',
      timestamp: new Date(Date.now() - 50 * 60000).toISOString(),
      severity: 'MEDIUM',
      status: 'INVESTIGATING',
      threat_category: 'Suspicious Login',
      threat_score: 64,
      subject: 'New MFA Registration from Unrecognized Device (Firefox/Linux)',
      sender: 'security-alerts@acme-corp.com',
      recipient: 'james.miller@acme-corp.com',
      source_geo: 'NL',
      source_ip: '195.123.245.12',
      assigned_analyst: 'Alice SOC',
      auth_signals: { spf: 'PASS', dkim: 'PASS', dmarc: 'PASS' },
      is_sla_breached: false,
      email_entity_id: 'eml_10037'
    },
    {
      id: 'ALT-10036',
      tenant_id: 'tnt_acme_soc',
      timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
      severity: 'MEDIUM',
      status: 'NEW',
      threat_category: 'Suspicious Login',
      threat_score: 62,
      subject: 'Multiple failed login attempts from Tor Exit Node (185.220.101.9)',
      sender: 'identity-protect@acme-corp.com',
      recipient: 'admin-alerts@acme-corp.com',
      source_geo: 'NL',
      source_ip: '185.220.101.9',
      auth_signals: { spf: 'PASS', dkim: 'PASS', dmarc: 'PASS' },
      is_sla_breached: false,
      email_entity_id: 'eml_10036'
    },
    {
      id: 'ALT-10035',
      tenant_id: 'tnt_acme_soc',
      timestamp: new Date(Date.now() - 42 * 60000).toISOString(),
      severity: 'CRITICAL',
      status: 'INVESTIGATING',
      threat_category: 'Malware',
      threat_score: 93,
      subject: 'Overdue Payment Notice: Statement_August.iso',
      sender: 'receivables@accounts-globaltrade.top',
      recipient: 'billing@acme-corp.com',
      source_geo: 'RU',
      source_ip: '193.106.191.24',
      assigned_analyst: 'Alice SOC',
      auth_signals: { spf: 'NEUTRAL', dkim: 'FAIL', dmarc: 'FAIL' },
      is_sla_breached: false,
      email_entity_id: 'eml_10035'
    },
    {
      id: 'ALT-10034',
      tenant_id: 'tnt_acme_soc',
      timestamp: new Date(Date.now() - 22 * 60000).toISOString(),
      severity: 'MEDIUM',
      status: 'NEW',
      threat_category: 'Spam',
      threat_score: 58,
      subject: 'Expand your offshore software engineering bandwidth',
      sender: 'outreach@b2b-leads-global.com',
      recipient: 'engineering-leads@acme-corp.com',
      source_geo: 'IN',
      source_ip: '49.36.102.18',
      auth_signals: { spf: 'PASS', dkim: 'PASS', dmarc: 'PASS' },
      is_sla_breached: false,
      email_entity_id: 'eml_10034'
    },
    {
      id: 'ALT-10033',
      tenant_id: 'tnt_acme_soc',
      timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
      severity: 'CRITICAL',
      status: 'ESCALATED',
      threat_category: 'Business Email Compromise',
      threat_score: 99,
      subject: 'Direct Payroll Deposit Routing Number Change Request',
      sender: 'david.cfo@corp-acme-finance.com',
      recipient: 'payroll-desk@acme-corp.com',
      source_geo: 'NG',
      source_ip: '197.210.64.12',
      assigned_analyst: 'Alice SOC',
      auth_signals: { spf: 'FAIL', dkim: 'FAIL', dmarc: 'FAIL' },
      is_sla_breached: false,
      email_entity_id: 'eml_10033',
      related_case_id: 'CASE-2026-8815'
    },
    {
      id: 'ALT-10032',
      tenant_id: 'tnt_acme_soc',
      timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
      severity: 'LOW',
      status: 'CLOSED_FALSE_POSITIVE',
      threat_category: 'Spam',
      threat_score: 22,
      subject: 'Internal Employee Engagement Q3 Pulse Survey',
      sender: 'surveys@cultureamp-enterprise.com',
      recipient: 'all-employees@acme-corp.com',
      source_geo: 'US',
      source_ip: '54.240.11.22',
      assigned_analyst: 'Alice SOC',
      auth_signals: { spf: 'PASS', dkim: 'PASS', dmarc: 'PASS' },
      is_sla_breached: false,
      email_entity_id: 'eml_10032'
    },
    {
      id: 'ALT-10031',
      tenant_id: 'tnt_acme_soc',
      timestamp: new Date(Date.now() - 360 * 60000).toISOString(),
      severity: 'LOW',
      status: 'CLOSED_TRUE_POSITIVE',
      threat_category: 'Spam',
      threat_score: 45,
      subject: 'Final Chance: Claim your Amazon gift voucher code ($100)',
      sender: 'promo-rewards@giftcard-claim44.info',
      recipient: 'mark.stevens@acme-corp.com',
      source_geo: 'US',
      source_ip: '198.51.100.41',
      assigned_analyst: 'Ankit Sharma',
      auth_signals: { spf: 'FAIL', dkim: 'FAIL', dmarc: 'FAIL' },
      is_sla_breached: false,
      email_entity_id: 'eml_10031'
    }
  ];

  private emailEntities: Record<string, EmailEntity> = {
    'eml_10045': {
      email_id: 'eml_10045',
      tenant_id: 'tnt_acme_soc',
      sender: 'ceo-office@exec-acmecorp.com',
      recipients: ['treasury-ops@acme-corp.com', 'cfo@acme-corp.com'],
      subject: 'URGENT: Executive Wire Authorization - Acquisition Settlement',
      received_chain: [
        {
          hop_number: 1,
          from_host: 'tor-exit-frankfurt.node.org',
          by_host: 'mta-edge-01.acme-corp.com',
          ip: '185.220.101.5',
          timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
          auth_state: 'FAIL',
          delay_seconds: 0
        },
        {
          hop_number: 2,
          from_host: 'mta-edge-01.acme-corp.com',
          by_host: 'exchange-edge.acme-corp.local',
          ip: '10.240.1.12',
          timestamp: new Date(Date.now() - 4 * 60000 + 2000).toISOString(),
          auth_state: 'PASS',
          delay_seconds: 2
        }
      ],
      attachment_ids: ['Wire_Settlement_Instructions_Confidential.pdf'],
      url_ids: ['https://exec-acmecorp.com/wire/auth-confirm?token=8942b0a1'],
      risk_score: 98,
      confidence_score: 96,
      spf: 'FAIL',
      dkim: 'FAIL',
      dmarc: 'REJECT',
      message_id: '<202609110045.exec@exec-acmecorp.com>',
      raw_headers_snippet: 'Received: from tor-exit-frankfurt.node.org (185.220.101.5)\nFrom: "CEO Office (Priority Executive Desk)" <ceo-office@exec-acmecorp.com>\nReply-To: executive-direct@protonmail.com\nTo: <treasury-ops@acme-corp.com>\nSubject: URGENT: Executive Wire Authorization - Acquisition Settlement\nAuthentication-Results: spf=fail (sender IP 185.220.101.5) smtp.mailfrom=exec-acmecorp.com; dkim=fail; dmarc=fail (p=REJECT)',
      body_text_sample: 'Team, I am currently boarding an international flight for the strategic acquisition closing. Please immediately authorize and release the expedited escrow transfer of $450,000 USD according to the attached banking settlement statement. Strictly confidential. Complete wire authorization via secure link immediately: https://exec-acmecorp.com/wire/auth-confirm?token=8942b0a1'
    },
    'eml_10044': {
      email_id: 'eml_10044',
      tenant_id: 'tnt_acme_soc',
      sender: 'no-reply@auth-notifications-portal.live',
      recipients: ['sarah.jenkins@acme-corp.com'],
      subject: 'Microsoft 365: Your account password expires in 2 hours',
      received_chain: [
        {
          hop_number: 1,
          from_host: 'mail-relay-lagos.net',
          by_host: 'mta-edge-01.acme-corp.com',
          ip: '102.89.23.44',
          timestamp: new Date(Date.now() - 9 * 60000).toISOString(),
          auth_state: 'FAIL',
          delay_seconds: 1
        }
      ],
      attachment_ids: [],
      url_ids: ['https://auth-notifications-portal.live/login/m365/verify?user=sarah.jenkins'],
      risk_score: 89,
      confidence_score: 92,
      spf: 'PASS',
      dkim: 'FAIL',
      dmarc: 'REJECT',
      message_id: '<m365-notify-89201@auth-notifications-portal.live>',
      raw_headers_snippet: 'Received: from mail-relay-lagos.net (102.89.23.44)\nFrom: "Microsoft 365 Account Security" <no-reply@auth-notifications-portal.live>\nTo: <sarah.jenkins@acme-corp.com>\nSubject: Microsoft 365: Your account password expires in 2 hours\nAuthentication-Results: spf=pass; dkim=fail header.d=microsoft.com; dmarc=fail (action=quarantine)',
      body_text_sample: 'Your corporate Microsoft 365 enterprise credentials will expire today. To keep your current password and avoid service disruption, re-authenticate immediately: https://auth-notifications-portal.live/login/m365/verify?user=sarah.jenkins'
    },
    'eml_10042': {
      email_id: 'eml_10042',
      tenant_id: 'tnt_acme_soc',
      sender: 'billing@paypal1-secure.com',
      recipients: ['finance.controller@acme-corp.com'],
      subject: 'RE: Updated Vendor Banking Info (#INV-2026-8812)',
      received_chain: [
        {
          hop_number: 1,
          from_host: 'tor-exit-frankfurt.node.org',
          by_host: 'mta-inbound-02.acme-corp.com',
          ip: '185.220.101.5',
          timestamp: new Date(Date.now() - 145 * 60000).toISOString(),
          auth_state: 'FAIL',
          delay_seconds: 0
        }
      ],
      attachment_ids: ['invoice_statement_9041.html'],
      url_ids: ['https://paypal1-secure.com/invoice/INV-9041/auth'],
      risk_score: 96,
      confidence_score: 94,
      spf: 'FAIL',
      dkim: 'NONE',
      dmarc: 'REJECT',
      message_id: '<202609080814.x88EEM@paypal1-secure.com>',
      raw_headers_snippet: 'Received: from tor-exit-frankfurt.node.org (185.220.101.5)\nFrom: "PayPal Enterprise Accounts" <billing@paypal1-secure.com>\nTo: <finance.controller@acme-corp.com>\nSubject: RE: Updated Vendor Banking Info (#INV-2026-8812)\nAuthentication-Results: spf=fail; dkim=none; dmarc=reject',
      body_text_sample: 'Dear Accounts Payable Team, We have placed an urgent hold on your invoice wire transaction #INV-9041. Immediate re-verification of corporate banking details is required within 4 hours to avoid settlement cancellation and penalty fees: https://paypal1-secure.com/invoice/INV-9041/auth'
    }
  };

  async getAlerts(
    tenantId: string,
    filters?: { severity?: string; status?: string; category?: string; assignedTo?: string; agingBucket?: string }
  ): Promise<Alert[]> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return this.alerts
      .filter((a) => a.tenant_id === tenantId)
      .filter((a) => !filters?.severity || filters.severity === 'ALL' || a.severity === filters.severity)
      .filter((a) => !filters?.status || filters.status === 'ALL' || a.status === filters.status)
      .filter((a) => !filters?.category || filters.category === 'ALL' || a.threat_category === filters.category)
      .filter((a) => !filters?.assignedTo || a.assigned_analyst === filters.assignedTo)
      .filter((a) => {
        if (!filters?.agingBucket || filters.agingBucket === 'ALL') return true;
        const ageMins = (Date.now() - new Date(a.timestamp).getTime()) / 60000;
        if (filters.agingBucket === '0-15m') return ageMins <= 15;
        if (filters.agingBucket === '15m-1h') return ageMins > 15 && ageMins <= 60;
        if (filters.agingBucket === '1-4h') return ageMins > 60 && ageMins <= 240;
        if (filters.agingBucket === '4h+') return ageMins > 240;
        if (filters.agingBucket === 'SLA Breaching') return a.is_sla_breached;
        return true;
      })
      .sort((a, b) => {
        // High priority: SLA Breached first, then Critical/High, then newest
        if (a.is_sla_breached !== b.is_sla_breached) {
          return a.is_sla_breached ? -1 : 1;
        }
        const rank: Record<string, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        if (rank[a.severity] !== rank[b.severity]) {
          return rank[b.severity] - rank[a.severity];
        }
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
  }

  async updateAlertStatus(
    alertId: string,
    status: AlertStatus,
    tenantId: string,
    justification?: string
  ): Promise<Alert> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const alert = this.alerts.find((a) => a.id === alertId && a.tenant_id === tenantId);
    if (!alert) throw new Error('Alert not found');
    alert.status = status;
    return { ...alert };
  }

  async acknowledgeAlert(alertId: string, analyst: string, tenantId: string): Promise<Alert> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const alert = this.alerts.find((a) => a.id === alertId && a.tenant_id === tenantId);
    if (!alert) throw new Error('Alert not found');
    alert.status = 'INVESTIGATING';
    alert.assigned_analyst = analyst;
    return { ...alert };
  }

  async getEmailEntity(emailEntityId: string, tenantId: string): Promise<EmailEntity | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (this.emailEntities[emailEntityId]) {
      return this.emailEntities[emailEntityId];
    }
    // Fallback dynamic generator for any alert
    const alert = this.alerts.find(a => a.email_entity_id === emailEntityId);
    if (!alert) return null;
    return {
      email_id: emailEntityId,
      tenant_id: tenantId,
      sender: alert.sender,
      recipients: [alert.recipient],
      subject: alert.subject,
      received_chain: [
        {
          hop_number: 1,
          from_host: `edge-relay-${alert.source_geo.toLowerCase()}.node.net`,
          by_host: 'mta-inbound-01.acme-corp.com',
          ip: alert.source_ip,
          timestamp: alert.timestamp,
          auth_state: alert.auth_signals.spf === 'PASS' ? 'PASS' : 'FAIL',
          delay_seconds: 1
        }
      ],
      attachment_ids: alert.severity === 'CRITICAL' || alert.threat_category === 'Malware' ? ['statement_document.pdf', 'executable_patch.iso'] : [],
      url_ids: [`https://${alert.sender.split('@')[1] || 'malicious-domain.com'}/auth/verify`],
      risk_score: alert.threat_score,
      confidence_score: 91,
      spf: alert.auth_signals.spf as any,
      dkim: alert.auth_signals.dkim as any,
      dmarc: alert.auth_signals.dmarc === 'FAIL' ? 'REJECT' : 'PASS',
      message_id: `<${alert.id.toLowerCase()}.${Date.now()}@acme-corp.com>`,
      raw_headers_snippet: `Received: from ${alert.source_ip} (${alert.source_geo})\nFrom: <${alert.sender}>\nTo: <${alert.recipient}>\nSubject: ${alert.subject}\nAuthentication-Results: spf=${alert.auth_signals.spf.toLowerCase()}; dkim=${alert.auth_signals.dkim.toLowerCase()}; dmarc=${alert.auth_signals.dmarc.toLowerCase()}`,
      body_text_sample: `This email was flagged with a threat score of ${alert.threat_score} under category ${alert.threat_category}.\n\nSubject: ${alert.subject}\nOriginating IP: ${alert.source_ip} (${alert.source_geo})\nAuthentication verdict: SPF=${alert.auth_signals.spf}, DKIM=${alert.auth_signals.dkim}, DMARC=${alert.auth_signals.dmarc}.`
    };
  }

  async escalateToFraudIR(alertId: string, rationale: string, urgency: string, tenantId: string): Promise<{ success: boolean; escalationId: string }> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const alert = this.alerts.find(a => a.id === alertId && a.tenant_id === tenantId);
    if (alert) {
      alert.status = 'ESCALATED';
      alert.related_case_id = `FRAUD-IR-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    return { success: true, escalationId: alert?.related_case_id || 'FRAUD-IR-9901' };
  }

  async quarantine(target: string, type: 'DOMAIN' | 'SENDER' | 'IP', tenantId: string): Promise<{ success: boolean; quarantinedAt: string }> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return { success: true, quarantinedAt: new Date().toISOString() };
  }

  async addNote(alertId: string, note: string, author: string, tenantId: string): Promise<{ success: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return { success: true };
  }

  async getKPIs(tenantId: string, analyst: string): Promise<KPIContext> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const tenantAlerts = this.alerts.filter((a) => a.tenant_id === tenantId);
    return {
      openAlertsAssignedToMe: tenantAlerts.filter((a) => 
        (a.assigned_analyst === analyst || (!a.assigned_analyst && analyst === 'Alice SOC')) && 
        ['NEW', 'OPEN', 'INVESTIGATING'].includes(a.status)
      ).length,
      alertsBreachingSLA: tenantAlerts.filter((a) => a.is_sla_breached && ['NEW', 'OPEN'].includes(a.status)).length,
      criticalHighUnresolved: tenantAlerts.filter((a) => 
        ['CRITICAL', 'HIGH'].includes(a.severity) && 
        !['CLOSED_TRUE_POSITIVE', 'CLOSED_FALSE_POSITIVE', 'ESCALATED'].includes(a.status)
      ).length,
      newAlertsLast15m: tenantAlerts.filter((a) => new Date(a.timestamp).getTime() > Date.now() - 15 * 60000).length
    };
  }

  async getAlertAging(tenantId: string): Promise<AlertAgingBucket[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const tenantAlerts = this.alerts.filter(a => a.tenant_id === tenantId);
    let b0 = 0, b15 = 0, b60 = 0, b240 = 0, bSla = 0;
    tenantAlerts.forEach(a => {
      const ageMins = (Date.now() - new Date(a.timestamp).getTime()) / 60000;
      if (a.is_sla_breached) bSla++;
      if (ageMins <= 15) b0++;
      else if (ageMins <= 60) b15++;
      else if (ageMins <= 240) b60++;
      else b240++;
    });

    return [
      { label: '0-15m', count: b0 },
      { label: '15m-1h', count: b15 },
      { label: '1-4h', count: b60 },
      { label: '4h+', count: b240 },
      { label: 'SLA Breaching', count: bSla }
    ];
  }

  async getThreatCategoryTrend(tenantId: string): Promise<ThreatCategoryTrend[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [
      { category: 'Phishing', count: 48, severity_breakdown: { CRITICAL: 8, HIGH: 22, MEDIUM: 15, LOW: 3 } },
      { category: 'Malware', count: 26, severity_breakdown: { CRITICAL: 14, HIGH: 9, MEDIUM: 3, LOW: 0 } },
      { category: 'Business Email Compromise', count: 16, severity_breakdown: { CRITICAL: 12, HIGH: 4, MEDIUM: 0, LOW: 0 } },
      { category: 'Account Takeover', count: 12, severity_breakdown: { CRITICAL: 3, HIGH: 7, MEDIUM: 2, LOW: 0 } },
      { category: 'Suspicious Login', count: 19, severity_breakdown: { CRITICAL: 2, HIGH: 5, MEDIUM: 10, LOW: 2 } },
      { category: 'Spam', count: 34, severity_breakdown: { CRITICAL: 0, HIGH: 2, MEDIUM: 12, LOW: 20 } }
    ];
  }

  async getAuthFailureTrend(tenantId: string): Promise<AuthFailureTrendPoint[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const now = Date.now();
    // 24 hours of simulated auth failure telemetry
    const points: AuthFailureTrendPoint[] = [];
    for (let i = 23; i >= 0; i--) {
      const isPeakHour = i >= 4 && i <= 8; // simulated morning attack wave
      points.push({
        timestamp: new Date(now - i * 3600000).toISOString(),
        spfFails: isPeakHour ? 28 + Math.floor(Math.random() * 15) : 4 + Math.floor(Math.random() * 8),
        dkimFails: isPeakHour ? 22 + Math.floor(Math.random() * 10) : 2 + Math.floor(Math.random() * 6),
        dmarcFails: isPeakHour ? 34 + Math.floor(Math.random() * 18) : 6 + Math.floor(Math.random() * 10)
      });
    }
    return points;
  }
}

export const socRepo = new MockSOCRepository();
