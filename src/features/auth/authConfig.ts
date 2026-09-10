export enum Role {
  SOC_ANALYST = 'SOC_ANALYST',
  INVESTIGATOR = 'INVESTIGATOR',
  IT_ADMIN = 'IT_ADMIN',
  FRAUD_IR = 'FRAUD_IR',
  ADMIN = 'ADMIN'
}

export const RoleLabels: Record<Role, string> = {
  [Role.SOC_ANALYST]: 'SOC Analyst',
  [Role.INVESTIGATOR]: 'Investigator',
  [Role.IT_ADMIN]: 'IT Admin',
  [Role.FRAUD_IR]: 'Fraud / IR',
  [Role.ADMIN]: 'Admin'
};

export type Permission = 
  | 'dashboard.view'
  | 'soc.view'
  | 'investigation.view'
  | 'investigation.create'
  | 'investigation.manage'
  | 'evidence.view'
  | 'evidence.manage'
  | 'cases.view'
  | 'cases.manage'
  | 'reports.view'
  | 'reports.create'
  | 'threat_intel.view'
  | 'users.view'
  | 'users.manage'
  | 'tenant.manage'
  | 'integrations.manage'
  | 'audit.view'
  | 'system.manage';

export const RolePermissions: Record<Role, Permission[]> = {
  [Role.SOC_ANALYST]: ['dashboard.view', 'soc.view', 'investigation.view', 'investigation.create', 'cases.view', 'threat_intel.view'],
  [Role.INVESTIGATOR]: ['dashboard.view', 'soc.view', 'investigation.view', 'investigation.create', 'evidence.view', 'evidence.manage', 'cases.view', 'cases.manage', 'reports.view', 'reports.create', 'threat_intel.view'],
  [Role.IT_ADMIN]: ['dashboard.view', 'users.view', 'users.manage', 'integrations.manage', 'system.manage', 'audit.view'],
  [Role.FRAUD_IR]: ['dashboard.view', 'cases.view', 'cases.manage', 'investigation.view', 'evidence.view', 'reports.view', 'reports.create'],
  [Role.ADMIN]: ['dashboard.view', 'soc.view', 'users.view', 'users.manage', 'tenant.manage', 'integrations.manage', 'audit.view', 'system.manage']
};

export interface Tenant {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthSession {
  user: User;
  tenant: Tenant;
  role: Role;
}
