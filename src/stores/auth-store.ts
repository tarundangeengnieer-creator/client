import { useSyncExternalStore } from 'react';
import { apiClient } from '../api/client.ts';
import { ENDPOINTS } from '../api/endpoints.ts';
import { Role, RoleLabels, RolePermissions, Permission, AuthSession, User, Tenant } from '../features/auth/authConfig.ts';

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  currentTenant: Tenant | null;
  currentRole: Role | null;
  backendHealth: 'healthy' | 'degraded' | 'offline' | 'checking';
  backendLatencyMs: number | null;
  lastPingAt: string | null;
  // Dev-only token
  token: string | null;
}

const STORAGE_KEY = 'ashielder_auth_session';

function getInitialState(): AuthState {
  let session: AuthSession | null = null;
  let token: string | null = null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      session = parsed.session;
      token = parsed.token;
    }
  } catch {
    // SessionStorage unavailable
  }

  // Default to authoritative Investigator session
  if (!session) {
    session = {
      user: { id: 'usr_inv_01', name: 'Ankit', email: 'ankit.investigator@acme-sec.io' },
      tenant: { id: 'tnt_acme_soc', name: 'Acme Security Operations' },
      role: Role.INVESTIGATOR
    };
    token = 'ashielder_investigator_jwt_token';
  }

  return {
    isAuthenticated: true,
    currentUser: session.user,
    currentTenant: session.tenant,
    currentRole: session.role,
    token,
    backendHealth: 'healthy',
    backendLatencyMs: 12,
    lastPingAt: new Date().toISOString(),
  };
}

let currentState: AuthState = getInitialState();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

// Development mock users for each role
const MOCK_USERS: Record<Role, AuthSession> = {
  [Role.SOC_ANALYST]: {
    user: { id: 'usr_soc_01', name: 'Alice SOC', email: 'alice@soc.local' },
    tenant: { id: 'tnt_acme_soc', name: 'Acme Security Operations' },
    role: Role.SOC_ANALYST
  },
  [Role.INVESTIGATOR]: {
    user: { id: 'usr_inv_01', name: 'Ankit', email: 'ankit.investigator@acme-sec.io' },
    tenant: { id: 'tnt_acme_soc', name: 'Acme Security Operations' },
    role: Role.INVESTIGATOR
  },
  [Role.IT_ADMIN]: {
    user: { id: 'usr_ita_01', name: 'Charlie IT', email: 'charlie@soc.local' },
    tenant: { id: 'tnt_acme_soc', name: 'Acme Security Operations' },
    role: Role.IT_ADMIN
  },
  [Role.FRAUD_IR]: {
    user: { id: 'usr_fir_01', name: 'Dave Fraud', email: 'dave@soc.local' },
    tenant: { id: 'tnt_acme_soc', name: 'Acme Security Operations' },
    role: Role.FRAUD_IR
  },
  [Role.ADMIN]: {
    user: { id: 'usr_adm_01', name: 'Eve Admin', email: 'eve@soc.local' },
    tenant: { id: 'tnt_acme_soc', name: 'Acme Security Operations' },
    role: Role.ADMIN
  }
};

export const authStore = {
  getSnapshot(): AuthState {
    return currentState;
  },

  getState(): AuthState & { tenant: Tenant | null; user: User | null; role: Role | null } {
    return {
      ...currentState,
      tenant: currentState.currentTenant,
      user: currentState.currentUser,
      role: currentState.currentRole,
    };
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // Mock login replacing actual backend integration
  async login(email: string, password: string): Promise<boolean> {
    if (!email.trim() || !password.trim()) return false;
    
    // Dev mock logic: we determine role from email domain or alias
    let assignedRole = Role.SOC_ANALYST;
    if (email.includes('investigator')) assignedRole = Role.INVESTIGATOR;
    if (email.includes('itadmin')) assignedRole = Role.IT_ADMIN;
    if (email.includes('fraud')) assignedRole = Role.FRAUD_IR;
    if (email.includes('admin')) assignedRole = Role.ADMIN;
    
    const session = MOCK_USERS[assignedRole];
    const token = 'mock_jwt_token_' + Date.now();

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ session, token }));
    } catch (e) {
      console.error('SessionStorage failed', e);
    }

    apiClient.setApiKey(token);

    currentState = {
      ...currentState,
      isAuthenticated: true,
      currentUser: session.user,
      currentTenant: session.tenant,
      currentRole: session.role,
      token,
    };
    notify();

    // Verify backend connectivity
    await authStore.checkHealth();
    return true;
  },
  
  // Developer helper to switch role instantly
  devSwitchRole(role: Role) {
    const session = MOCK_USERS[role];
    const token = currentState.token || 'mock_jwt_token_' + Date.now();
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ session, token }));
    } catch {}
    
    currentState = {
      ...currentState,
      isAuthenticated: true,
      currentUser: session.user,
      currentTenant: session.tenant,
      currentRole: session.role,
      token
    };
    notify();
  },

  logout(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }

    apiClient.clearApiKey();

    currentState = {
      ...currentState,
      isAuthenticated: false,
      currentUser: null,
      currentTenant: null,
      currentRole: null,
      token: null,
      backendHealth: 'offline',
    };
    notify();
  },

  async checkHealth(): Promise<void> {
    currentState = { ...currentState, backendHealth: 'checking' };
    notify();

    const start = performance.now();
    try {
      await apiClient.get<{ status: string; timestamp?: string }>(ENDPOINTS.HEALTH, {
        timeoutMs: 5000,
      });
      const latency = Math.round(performance.now() - start);

      currentState = {
        ...currentState,
        backendHealth: 'healthy',
        backendLatencyMs: latency,
        lastPingAt: new Date().toISOString(),
      };
    } catch {
      const latency = Math.round(performance.now() - start);
      currentState = {
        ...currentState,
        backendHealth: 'degraded',
        backendLatencyMs: latency,
        lastPingAt: new Date().toISOString(),
      };
    }
    notify();
  },
};

// React hook for consuming state
export function useAuth(): AuthState {
  return useSyncExternalStore(authStore.subscribe, authStore.getSnapshot);
}

// Helpers for role and permission checks
export function useCurrentUser() {
  const { currentUser } = useAuth();
  return currentUser;
}

export function useCurrentTenant() {
  const { currentTenant } = useAuth();
  return currentTenant;
}

export function useCurrentRole() {
  const { currentRole } = useAuth();
  return currentRole;
}

export function hasRole(requiredRoles: Role | Role[]) {
  const { currentRole } = authStore.getSnapshot();
  if (!currentRole) return false;
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.includes(currentRole);
}

export function hasPermission(permission: Permission) {
  const { currentRole } = authStore.getSnapshot();
  if (!currentRole) return false;
  const perms = RolePermissions[currentRole] || [];
  return perms.includes(permission);
}
