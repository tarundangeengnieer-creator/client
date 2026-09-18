/**
 * ASHIELDER Global UI Store
 * Manages transient interface state, drawer toggles, active case HUD, and global search.
 */

import { useSyncExternalStore } from 'react';
import { Verdict } from '../contracts/backend.ts';

export interface ToastItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  durationMs?: number;
}

export interface UIState {
  currentPath: string;
  activeCaseId: string | null;
  activeCaseVerdict: Verdict | null;
  activeCaseRisk: number | null;
  activeCaseConfidence: number | null;
  activeCaseSubject: string | null;
  activeTab: string;
  
  // Drawer states
  isCopilotOpen: boolean;
  isEvidenceInspectorOpen: boolean;
  selectedEvidenceId: string | null;
  isQuickPeekOpen: boolean;
  quickPeekCaseId: string | null;
  isMobileSidebarOpen: boolean;
  isSidebarCollapsed: boolean;

  // Search & Modals
  isSearchOpen: boolean;
  searchQuery: string;

  // Workstation controls
  piiMaskingEnabled: boolean;
  theme: 'light' | 'dark';
  toasts: ToastItem[];
}

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = localStorage.getItem('ashielder_theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // ignore
  }
  return 'dark';
}

function applyTheme(theme: 'light' | 'dark') {
  if (typeof document !== 'undefined') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  try {
    localStorage.setItem('ashielder_theme', theme);
  } catch {
    // ignore
  }
}

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

const initialUIState: UIState = {
  currentPath: typeof window !== 'undefined' ? (window.location.pathname || '/') : '/',
  activeCaseId: 'A2291',
  activeCaseVerdict: null,
  activeCaseRisk: null,
  activeCaseConfidence: null,
  activeCaseSubject: null,
  activeTab: 'summary',
  isCopilotOpen: false,
  isEvidenceInspectorOpen: false,
  selectedEvidenceId: null,
  isQuickPeekOpen: false,
  quickPeekCaseId: null,
  isMobileSidebarOpen: false,
  isSidebarCollapsed: false,
  isSearchOpen: false,
  searchQuery: '',
  piiMaskingEnabled: true,
  theme: initialTheme,
  toasts: [],
};

let currentUIState: UIState = initialUIState;
const uiListeners = new Set<() => void>();

function notifyUI() {
  uiListeners.forEach((fn) => fn());
}

export const uiStore = {
  getSnapshot(): UIState {
    return currentUIState;
  },

  subscribe(listener: () => void): () => void {
    uiListeners.add(listener);
    return () => uiListeners.delete(listener);
  },

  navigate(path: string): void {
    if (currentUIState.currentPath === path && !currentUIState.isMobileSidebarOpen) return;
    currentUIState = {
      ...currentUIState,
      currentPath: path,
      isMobileSidebarOpen: false,
    };
    notifyUI();
  },

  toggleMobileSidebar(): void {
    currentUIState = {
      ...currentUIState,
      isMobileSidebarOpen: !currentUIState.isMobileSidebarOpen,
    };
    notifyUI();
  },

  setMobileSidebarOpen(open: boolean): void {
    if (currentUIState.isMobileSidebarOpen === open) return;
    currentUIState = {
      ...currentUIState,
      isMobileSidebarOpen: open,
    };
    notifyUI();
  },

  toggleSidebarCollapsed(): void {
    currentUIState = {
      ...currentUIState,
      isSidebarCollapsed: !currentUIState.isSidebarCollapsed,
    };
    notifyUI();
  },

  setActiveCase(
    caseId: string | null,
    subject?: string,
    verdict?: Verdict,
    risk?: number,
    confidence?: number
  ): void {
    currentUIState = {
      ...currentUIState,
      activeCaseId: caseId,
      activeCaseSubject: subject ?? null,
      activeCaseVerdict: verdict ?? null,
      activeCaseRisk: risk ?? null,
      activeCaseConfidence: confidence ?? null,
    };
    notifyUI();
  },

  setActiveTab(tab: string): void {
    currentUIState = {
      ...currentUIState,
      activeTab: tab,
    };
    notifyUI();
  },

  openCopilot(open: boolean = true): void {
    currentUIState = {
      ...currentUIState,
      isCopilotOpen: open,
    };
    notifyUI();
  },

  openEvidenceInspector(evidenceId: string | null): void {
    currentUIState = {
      ...currentUIState,
      isEvidenceInspectorOpen: Boolean(evidenceId),
      selectedEvidenceId: evidenceId,
    };
    notifyUI();
  },

  openQuickPeek(caseId: string | null): void {
    currentUIState = {
      ...currentUIState,
      isQuickPeekOpen: Boolean(caseId),
      quickPeekCaseId: caseId,
    };
    notifyUI();
  },

  closeQuickPeek(): void {
    this.openQuickPeek(null);
  },

  setSearchOpen(open: boolean): void {
    currentUIState = {
      ...currentUIState,
      isSearchOpen: open,
      searchQuery: open ? currentUIState.searchQuery : '',
    };
    notifyUI();
  },

  setSearchQuery(query: string): void {
    currentUIState = {
      ...currentUIState,
      searchQuery: query,
    };
    notifyUI();
  },

  togglePiiMasking(): void {
    currentUIState = {
      ...currentUIState,
      piiMaskingEnabled: !currentUIState.piiMaskingEnabled,
    };
    notifyUI();
  },

  setTheme(theme: 'light' | 'dark'): void {
    if (currentUIState.theme === theme) return;
    currentUIState = {
      ...currentUIState,
      theme,
    };
    applyTheme(theme);
    notifyUI();
  },

  toggleTheme(): void {
    const nextTheme = currentUIState.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  },

  addToast(type: ToastItem['type'], message: string, durationMs: number = 4000): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast: ToastItem = { id, type, message, durationMs };

    currentUIState = {
      ...currentUIState,
      toasts: [...currentUIState.toasts, newToast],
    };
    notifyUI();

    setTimeout(() => {
      uiStore.removeToast(id);
    }, durationMs);
  },

  removeToast(id: string): void {
    currentUIState = {
      ...currentUIState,
      toasts: currentUIState.toasts.filter((t) => t.id !== id),
    };
    notifyUI();
  },
};

export function useUI(): UIState {
  return useSyncExternalStore(uiStore.subscribe, uiStore.getSnapshot);
}
