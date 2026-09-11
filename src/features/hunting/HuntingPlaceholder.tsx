import React from 'react';
import { ThreatIntelWorkspace } from '../threat-intel/ThreatIntelWorkspace.tsx';

/**
 * HuntingPlaceholder
 *
 * Upgraded from static placeholder to comprehensive Threat Intelligence & Geo-Intelligence Workspace.
 * Preserves backward compatibility with legacy /hunting routes and component references.
 */
export const HuntingPlaceholder: React.FC = () => {
  return <ThreatIntelWorkspace />;
};
