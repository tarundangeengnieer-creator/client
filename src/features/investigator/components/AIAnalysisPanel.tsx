import React, { useState } from "react";
import { useInvestigator, investigatorStore } from "../../../stores/investigator-store.ts";
import { useAuth } from "../../../stores/auth-store.ts";
import { ProvenanceLabel } from "../../../components/ui/ProvenanceLabel.tsx";
import { EvidenceReference } from "../../../components/ui/EvidenceReference.tsx";
import {
  Sparkles,
  Send,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Fingerprint,
  Info,
} from "lucide-react";

interface QueryResult {
  id: string;
  label: string;
  query: string;
  response: string;
  evidenceCount: number;
  evidenceIds: string[];
  sources: string[];
  fromBackend?: boolean;
}

const PRESET_LABELS: { id: string; label: string; query: string }[] = [
  {
    id: "q-classify",
    label: "Explain threat classification",
    query: "Why was this email classified with its current verdict? Explain the key signals.",
  },
  {
    id: "q-attack-chain",
    label: "Summarize attack chain",
    query: "Summarize the chronological attack chain and list any mapped MITRE ATT&CK techniques.",
  },
  {
    id: "q-pivots",
    label: "Suggest investigative pivots",
    query: "What investigative pivots are recommended next based on the available evidence?",
  },
  {
    id: "q-exec-summary",
    label: "Generate executive summary",
    query: "Generate an executive forensic summary suitable for case report disposition.",
  },
];

export const AIAnalysisPanel: React.FC = () => {
  const { currentCase, currentCaseId, selectedEntity, caseEvidence } = useInvestigator();
  const auth = useAuth();
  const tenantName = auth.currentTenant?.name || "Security Operations";
  const investigatorName = auth.currentUser?.name || "Analyst";

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const [activeResponse, setActiveResponse] = useState<QueryResult | null>(null);
  const [auditTimestamp, setAuditTimestamp] = useState<string>(new Date().toISOString());
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const caseId = currentCaseId;

  const callReasonEndpoint = async (question: string): Promise<QueryResult | null> => {
    if (!caseId) return null;
    const { apiClient } = await import("../../../api/client.ts");
    const { ENDPOINTS } = await import("../../../api/endpoints.ts");

    const raw = await apiClient.post<{
      reasoning_status: string;
      reasoning_result?: {
        summary?: string;
        explanation?: string;
        hypotheses?: string[];
        recommended_next_actions?: string[];
        uncertainty?: string;
        escalation_required?: boolean;
      };
      reason?: string;
    }>(ENDPOINTS.INVESTIGATION_REASON(caseId));

    if (raw.reasoning_status !== "available" || !raw.reasoning_result) {
      throw new Error(raw.reason ?? "AI reasoning unavailable");
    }

    const r = raw.reasoning_result;
    const parts: string[] = [];
    if (r.summary) parts.push(r.summary);
    if (r.explanation) parts.push(`\n${r.explanation}`);
    if (r.hypotheses && r.hypotheses.length > 0) {
      parts.push(`\nAttack Hypotheses:\n${r.hypotheses.map((h, i) => `${i + 1}. ${h}`).join("\n")}`);
    }
    if (r.recommended_next_actions && r.recommended_next_actions.length > 0) {
      parts.push(`\nRecommended Actions:\n${r.recommended_next_actions.map((a, i) => `${i + 1}. ${a}`).join("\n")}`);
    }

    return {
      id: `backend-${Date.now()}`,
      label: question,
      query: question,
      response: parts.join("\n") || "No response generated.",
      evidenceCount: caseEvidence.length || 0,
      evidenceIds: caseEvidence.slice(0, 3).map((e) => e.evidence_id),
      sources: ["Backend Reasoning Engine", "Groq LLM", "Persisted Evidence Snapshot"],
      fromBackend: true,
    };
  };

  const handleSelectPreset = async (preset: { id: string; label: string; query: string }) => {
    setIsLoadingAnswer(true);
    setActivePresetId(preset.id);
    setAuditTimestamp(new Date().toISOString());
    try {
      const result = await callReasonEndpoint(preset.query);
      if (result) setActiveResponse({ ...result, label: preset.label });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Backend reasoning unavailable";
      setActiveResponse({
        id: preset.id,
        label: preset.label,
        query: preset.query,
        response: `AI reasoning is currently unavailable: ${message}\n\nThis may occur if the Groq API is rate-limited or the case has no persisted evidence snapshot. The investigation verdict and risk score remain valid.`,
        evidenceCount: 0,
        evidenceIds: [],
        sources: [],
        fromBackend: false,
      });
    } finally {
      setIsLoadingAnswer(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const question = customInput.trim();
    if (!question) return;
    setIsLoadingAnswer(true);
    setActivePresetId(null);
    setAuditTimestamp(new Date().toISOString());
    try {
      const result = await callReasonEndpoint(question);
      if (result) setActiveResponse(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Backend reasoning unavailable";
      setActiveResponse({
        id: `custom-${Date.now()}`,
        label: question,
        query: question,
        response: `AI reasoning is currently unavailable: ${message}`,
        evidenceCount: 0,
        evidenceIds: [],
        sources: [],
        fromBackend: false,
      });
    } finally {
      setIsLoadingAnswer(false);
      setCustomInput("");
    }
  };

  return (
    <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs font-mono select-none">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-[#0a0f1d] border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-white dark:bg-[#070b14] border border-sky-500/40 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>AI-Assisted Investigation</span>
              <ProvenanceLabel type="AI ANALYSIS" size="xs" />
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[10.5px]">
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            <span className="font-bold text-slate-400">SCOPE:</span>
            <span className="text-[#08B4ED] font-bold">#{caseId ?? "N/A"}</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="truncate max-w-[120px]">{tenantName}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded transition-colors cursor-pointer"
            aria-label="Toggle AI Panel"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-4 bg-slate-50/20 dark:bg-transparent">
          {/* Context scope */}
          <div className="p-2.5 rounded-lg bg-slate-100/70 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Entity:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                {selectedEntity
                  ? `${selectedEntity.value} (${selectedEntity.type})`
                  : currentCase?.primary_ioc
                  ? `${currentCase.primary_ioc} (IOC)`
                  : "No entity selected"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 italic">
              <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Restricted strictly to case &amp; tenant boundary.</span>
            </div>
          </div>

          {/* Presets */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Ask about this investigation:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_LABELS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  disabled={isLoadingAnswer}
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-all cursor-pointer text-left disabled:opacity-50 disabled:cursor-not-allowed ${
                    activePresetId === preset.id
                      ? "bg-sky-50 dark:bg-[#0c1a2e] border-sky-500/60 text-sky-600 dark:text-sky-300 shadow-2xs"
                      : "bg-white dark:bg-[#070b14] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-500/40 hover:text-sky-500"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom input */}
          <form onSubmit={handleCustomSubmit} className="relative flex items-center">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder={`Ask evidence question regarding #${caseId ?? "N/A"}...`}
              disabled={isLoadingAnswer}
              className="w-full pl-3 pr-20 py-2 rounded-lg text-xs bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500/60 font-mono transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!customInput.trim() || isLoadingAnswer}
              className="absolute right-1.5 px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed"
            >
              <Send className="w-3 h-3" />
              <span>Ask</span>
            </button>
          </form>

          {/* Loading */}
          {isLoadingAnswer && (
            <div className="p-4 rounded-lg bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 space-y-1">
              <div className="w-5 h-5 rounded-full border-2 border-sky-500 border-t-transparent animate-spin mx-auto mb-1.5" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Querying Groq reasoning engine across {caseEvidence.length || "?"} evidence records…
              </span>
              <p className="text-[10px] text-slate-400 font-sans">
                Server constructs snapshot from persisted evidence.
              </p>
            </div>
          )}

          {/* Response card */}
          {!isLoadingAnswer && activeResponse && (
            <div className="p-4 rounded-lg bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">AI ASSESSMENT</span>
                  {activeResponse.fromBackend ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      LIVE · GROQ LLM
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      UNAVAILABLE
                    </span>
                  )}
                  {activeResponse.evidenceCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-500/30">
                      {activeResponse.evidenceCount} RECORDS
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 italic">Evidence-grounded • Non-authoritative</span>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                Question:{" "}
                <span className="text-slate-800 dark:text-slate-200 font-normal italic">
                  "{activeResponse.query}"
                </span>
              </div>

              <div className="text-xs font-sans text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50/50 dark:bg-[#0a0f1d] p-3 rounded-lg border border-slate-100 dark:border-slate-800/80">
                {activeResponse.response}
              </div>

              {activeResponse.sources.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Evidence Sources:</span>
                    <div className="flex flex-wrap gap-1">
                      {activeResponse.sources.map((src) => (
                        <span
                          key={src}
                          className="px-1.5 py-0.5 rounded text-[9.5px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                  {activeResponse.evidenceIds.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Primary Pointers:</span>
                      {activeResponse.evidenceIds.map((id) => (
                        <EvidenceReference key={id} evidenceId={id} size="sm" />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => investigatorStore.openEvidenceInspector(true)}
                    className="px-2.5 py-1 rounded bg-[#08B4ED]/10 hover:bg-[#08B4ED]/20 text-[#08B4ED] border border-[#08B4ED]/30 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>View Evidence{activeResponse.evidenceCount > 0 ? ` (${activeResponse.evidenceCount})` : ""}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomInput(`Follow-up on: ${activeResponse.label} — `)}
                    className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Ask Follow-up</span>
                  </button>
                </div>
                <div className="text-[9.5px] text-slate-400 font-mono flex items-center gap-1">
                  <Fingerprint className="w-3 h-3 text-slate-400" />
                  <span>Audit: {investigatorName} • {new Date(auditTimestamp).toLocaleTimeString()} • Reasoner v1.4</span>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isLoadingAnswer && !activeResponse && (
            <div className="p-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                AI Investigation Ready — Scoped to Case #{caseId ?? "N/A"}
              </p>
              <p className="text-[11px] text-slate-500 font-sans">
                Select a preset question above or enter a case-specific query. Responses are generated live by the Groq reasoning engine.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
