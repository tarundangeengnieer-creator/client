import { useSyncExternalStore } from 'react';
import { socRepo } from '../api/soc-repository.ts';
import { uiStore } from './ui-store.ts';
import { authStore } from './auth-store.ts';
import {
  Alert,
  KPIContext,
  ThreatCategoryTrend,
  AlertAgingBucket,
  AuthFailureTrendPoint,
  AlertStatus
} from '../domain/soc.ts';
import { EmailEntity } from '../domain/investigator.ts';

interface SOCState {
  // Data
  alerts: Alert[];
  kpis: KPIContext | null;
  alertAging: AlertAgingBucket[];
  threatTrend: ThreatCategoryTrend[];
  authTrend: AuthFailureTrendPoint[];
  emailEntity: EmailEntity | null;
  
  // UI State
  isLoadingQueue: boolean;
  isLoadingKPIs: boolean;
  isLoadingCharts: boolean;
  isLoadingEmailEntity: boolean;
  errorQueue: string | null;
  
  // Selection
  selectedAlertId: string | null;
  isTriagePanelOpen: boolean;
  isEmailEntityOpen: boolean;
  
  // Filters
  filterSeverity: string;
  filterStatus: string;
  filterCategory: string;
  filterAgingBucket: string;
}

const initialState: SOCState = {
  alerts: [],
  kpis: null,
  alertAging: [],
  threatTrend: [],
  authTrend: [],
  emailEntity: null,
  isLoadingQueue: false,
  isLoadingKPIs: false,
  isLoadingCharts: false,
  isLoadingEmailEntity: false,
  errorQueue: null,
  selectedAlertId: null,
  isTriagePanelOpen: false,
  isEmailEntityOpen: false,
  filterSeverity: 'ALL',
  filterStatus: 'ALL',
  filterCategory: 'ALL',
  filterAgingBucket: 'ALL',
};

class SOCStore {
  private state: SOCState = { ...initialState };
  private listeners: Set<() => void> = new Set();

  getState = () => this.state;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private notify = () => {
    this.listeners.forEach((l) => l());
  };

  private patch = (partial: Partial<SOCState>) => {
    this.state = { ...this.state, ...partial };
    this.notify();
  };

  // Actions
  setFilters = (filters: Partial<{ severity: string; status: string; category: string; agingBucket: string }>) => {
    this.patch({
      filterSeverity: filters.severity ?? this.state.filterSeverity,
      filterStatus: filters.status ?? this.state.filterStatus,
      filterCategory: filters.category ?? this.state.filterCategory,
      filterAgingBucket: filters.agingBucket ?? this.state.filterAgingBucket
    });
    this.fetchQueue();
  };

  resetFilters = () => {
    this.patch({
      filterSeverity: 'ALL',
      filterStatus: 'ALL',
      filterCategory: 'ALL',
      filterAgingBucket: 'ALL'
    });
    this.fetchQueue();
  };

  selectAlert = (alertId: string | null) => {
    this.patch({ 
      selectedAlertId: alertId,
      isTriagePanelOpen: !!alertId,
      isEmailEntityOpen: false,
      emailEntity: null
    });
  };

  openEmailEntity = async () => {
    const alertId = this.state.selectedAlertId;
    if (!alertId) return;
    const alert = this.state.alerts.find(a => a.id === alertId);
    if (!alert) return;

    const tenantId = authStore.getState().tenant?.id ;
    this.patch({ isEmailEntityOpen: true, isLoadingEmailEntity: true });
    try {
      const emailEntity = await socRepo.getEmailEntity(alert.email_entity_id, tenantId);
      this.patch({ emailEntity, isLoadingEmailEntity: false });
    } catch {
      this.patch({ isLoadingEmailEntity: false });
      uiStore.addToast('error', 'Failed to retrieve email entity details');
    }
  };

  closeEmailEntity = () => {
    this.patch({ isEmailEntityOpen: false });
  };

  fetchQueue = async () => {
    const tenantId = authStore.getState().tenant?.id ;

    this.patch({ isLoadingQueue: true, errorQueue: null });
    try {
      const alerts = await socRepo.getAlerts(tenantId, {
        severity: this.state.filterSeverity,
        status: this.state.filterStatus,
        category: this.state.filterCategory,
        agingBucket: this.state.filterAgingBucket
      });
      this.patch({ alerts, isLoadingQueue: false });
    } catch (e: any) {
      this.patch({ isLoadingQueue: false, errorQueue: e.message || 'Failed to load alert queue' });
      uiStore.addToast('error', 'Alert Queue sync failed');
    }
  };

  fetchDashboardData = async () => {
    const state = authStore.getState();
    const tenantId = state.tenant?.id ;
    const analyst = state.user?.name || 'Alice SOC';

    this.patch({ isLoadingKPIs: true, isLoadingCharts: true });
    try {
      const [kpis, aging, threat, auth] = await Promise.all([
        socRepo.getKPIs(tenantId, analyst),
        socRepo.getAlertAging(tenantId),
        socRepo.getThreatCategoryTrend(tenantId),
        socRepo.getAuthFailureTrend(tenantId)
      ]);
      this.patch({
        kpis,
        alertAging: aging,
        threatTrend: threat,
        authTrend: auth,
        isLoadingKPIs: false,
        isLoadingCharts: false
      });
    } catch (e) {
      this.patch({ isLoadingKPIs: false, isLoadingCharts: false });
    }
  };

  acknowledgeAlert = async (alertId: string) => {
    const state = authStore.getState();
    const tenantId = state.tenant?.id ;
    const userName = state.user?.name || 'Alice SOC';
    try {
      await socRepo.acknowledgeAlert(alertId, userName, tenantId);
      uiStore.addToast('success', `Alert ${alertId} acknowledged and assigned to you.`);
      await this.fetchQueue();
      await this.fetchDashboardData();
    } catch (e: any) {
      uiStore.addToast('error', `Failed to acknowledge alert: ${e.message}`);
    }
  };

  updateAlertStatus = async (alertId: string, status: AlertStatus, justification?: string) => {
    const state = authStore.getState();
    const tenantId = state.tenant?.id ;
    try {
      await socRepo.updateAlertStatus(alertId, status, tenantId, justification);
      uiStore.addToast('success', `Alert ${alertId} marked as ${status.replace(/_/g, ' ')}.`);
      this.patch({ isTriagePanelOpen: false, selectedAlertId: null });
      await this.fetchQueue();
      await this.fetchDashboardData();
    } catch (e: any) {
      uiStore.addToast('error', `Failed to update alert: ${e.message}`);
    }
  };

  escalateToInvestigator = async (alertId: string) => {
    const state = authStore.getState();
    const tenantId = state.tenant?.id ;
    try {
      await socRepo.updateAlertStatus(alertId, 'ESCALATED', tenantId, 'Escalated to Forensic Investigator');
      uiStore.addToast('success', `Alert ${alertId} escalated to Investigator. Case generated.`);
      this.patch({ isTriagePanelOpen: false, selectedAlertId: null });
      await this.fetchQueue();
      await this.fetchDashboardData();
    } catch (e: any) {
      uiStore.addToast('error', `Failed to escalate alert: ${e.message}`);
    }
  };

  escalateToFraudIR = async (alertId: string, rationale: string, urgency = 'HIGH') => {
    const state = authStore.getState();
    const tenantId = state.tenant?.id ;
    try {
      const res = await socRepo.escalateToFraudIR(alertId, rationale, urgency, tenantId);
      uiStore.addToast('success', `Alert ${alertId} escalated to Fraud / IR (${res.escalationId}).`);
      this.patch({ isTriagePanelOpen: false, selectedAlertId: null });
      await this.fetchQueue();
      await this.fetchDashboardData();
    } catch (e: any) {
      uiStore.addToast('error', `Escalation failed: ${e.message}`);
    }
  };

  quarantineSenderOrDomain = async (target: string, type: 'DOMAIN' | 'SENDER') => {
    const state = authStore.getState();
    const tenantId = state.tenant?.id ;
    try {
      await socRepo.quarantine(target, type, tenantId);
      uiStore.addToast('success', `Quarantined ${type}: ${target} across email gateway.`);
    } catch (e: any) {
      uiStore.addToast('error', `Quarantine operation failed: ${e.message}`);
    }
  };

  addNote = async (alertId: string, note: string) => {
    const state = authStore.getState();
    const tenantId = state.tenant?.id ;
    const author = state.user?.name || 'Alice SOC';
    try {
      await socRepo.addNote(alertId, note, author, tenantId);
      uiStore.addToast('success', 'Analyst note attached to alert record.');
    } catch (e: any) {
      uiStore.addToast('error', `Failed to save note: ${e.message}`);
    }
  };
}

export const socStore = new SOCStore();

export const useSOC = () => {
  return useSyncExternalStore(socStore.subscribe, socStore.getState);
};
