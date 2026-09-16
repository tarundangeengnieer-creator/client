import { useMemo } from 'react';
import { useAuth, authStore, hasPermission } from '../../stores/auth-store.ts';

export interface AppCapabilities {
  // Case & Investigation Capabilities
  canViewCases: boolean;
  canManageCases: boolean; // Assign, escalate, change priority
  canCreateInvestigation: boolean;
  canManageInvestigation: boolean; // Advanced investigation controls
  
  // Evidence & Intel
  canViewEvidence: boolean;
  canManageEvidence: boolean;
  canViewThreatIntel: boolean;
  canPivotThreatIntel: boolean;
  
  // Reporting
  canViewReports: boolean;
  canCreateReports: boolean;
  
  // Specialized Workspaces
  canViewSOCDashboard: boolean;
  
  // AI & ML
  canQueryAI: boolean;
  canViewMLDetection: boolean;
  
  // Admin & System
  canManageUsers: boolean;
  canManageSystem: boolean;
  canViewAudit: boolean;
}

/**
 * Derives UI capabilities from the authenticated user's underlying permissions.
 * This is the central source of truth for component visibility and action authorization.
 */
export function useCapabilities(): AppCapabilities {
  // Subscribe to auth state changes to trigger re-renders if role changes
  useAuth();

  return useMemo(() => {
    // We check permissions synchronously using the store snapshot
    return {
      canViewCases: hasPermission('cases.view'),
      canManageCases: hasPermission('cases.manage'),
      canCreateInvestigation: hasPermission('investigation.create'),
      canManageInvestigation: hasPermission('investigation.manage'),
      
      canViewEvidence: hasPermission('evidence.view'),
      canManageEvidence: hasPermission('evidence.manage'),
      canViewThreatIntel: hasPermission('threat_intel.view'),
      canPivotThreatIntel: hasPermission('threat_intel.pivot'),
      
      canViewReports: hasPermission('reports.view'),
      canCreateReports: hasPermission('reports.create'),
      
      canViewSOCDashboard: hasPermission('soc.view'),
      
      canQueryAI: hasPermission('ai.query'),
      canViewMLDetection: hasPermission('ml.detection.view'),
      
      canManageUsers: hasPermission('users.manage'),
      canManageSystem: hasPermission('system.manage'),
      canViewAudit: hasPermission('audit.view'),
    };
  }, [authStore.getSnapshot().currentRole]);
}
