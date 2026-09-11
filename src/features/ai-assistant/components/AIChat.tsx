import React, { useState, useEffect, useRef } from 'react';
import { useUI } from '../../../stores/ui-store.ts';
import { investigatorStore } from '../../../stores/investigator-store.ts';
import { AIMessage, AIMessageProps } from './AIMessage.tsx';
import { AIInput } from './AIInput.tsx';
import { AIContext } from './AIContext.tsx';
import { AISuggestedPrompts } from './AISuggestedPrompts.tsx';
import { EvidenceReference } from '../../../components/ui/EvidenceReference.tsx';
import { Sparkles, Trash2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: React.ReactNode;
  timestamp: string;
}

export const AIChat: React.FC = () => {
  const ui = useUI();
  const invState = investigatorStore.getSnapshot();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Derive Context
  const getContextType = () => {
    if (ui.currentPath.startsWith('/hunting')) return 'threat-intel';
    if (ui.currentPath.startsWith('/graph')) return 'graph';
    if (ui.currentPath.startsWith('/case') || ui.activeCaseId) return 'workspace';
    return 'global';
  };
  
  const contextType = getContextType();

  // Initial Welcome Message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'system',
          content: 'AShieldER Investigation Assistant online. Context tracking enabled. Strict evidence grounding enforced.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  }, [messages.length]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getSuggestedPrompts = () => {
    switch (contextType) {
      case 'workspace':
        return [
          'Summarize this case',
          'Extract all IOCs',
          'Is this a known phishing pattern?',
        ];
      case 'threat-intel':
        return [
          'What is the reputation of this IP?',
          'Correlate this domain with known campaigns',
        ];
      case 'graph':
        return [
          'Find shortest path to known malicious node',
          'Identify central cluster',
        ];
      default:
        return [
          'What cases need immediate attention?',
          'Show system health summary',
        ];
    }
  };

  const handleSend = (text: string) => {
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setIsProcessing(true);

    // Mock AI Response
    setTimeout(() => {
      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: (
          <div className="space-y-3">
            <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
              Analysis Results
            </p>
            <p>
              Based on the context, I've cross-referenced the provided information. 
              The payload delivery mechanism aligns with known patterns.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <EvidenceReference evidenceId="EV-8821" title="Suspicious Attachment" size="sm" />
              <EvidenceReference evidenceId="EV-8822" title="Header Analysis" size="sm" />
            </div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Recommendation: Isolate the affected endpoint and update firewall rules to block the associated IP.
            </p>
          </div>
        ),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newAiMsg]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#070b14]">
      {/* Context Banner */}
      <AIContext 
        type={contextType} 
        caseId={ui.activeCaseId || undefined} 
        entityName={invState.selectedEntity?.value} 
      />

      {/* Header Actions */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-slate-200 dark:border-slate-800">
        <span className="text-[11px] font-mono text-slate-500 uppercase">Chat History</span>
        <button
          onClick={handleClear}
          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {messages.map((msg) => (
          <AIMessage key={msg.id} role={msg.role} content={msg.content} timestamp={msg.timestamp} />
        ))}
        {isProcessing && (
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-mono p-4">
            <Sparkles className="w-4 h-4 animate-pulse text-[#08B4ED]" />
            Analyzing evidence...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-[#0b1329] border-t border-slate-200 dark:border-slate-800">
        <AISuggestedPrompts prompts={getSuggestedPrompts()} onSelect={handleSend} />
        <AIInput onSend={handleSend} isProcessing={isProcessing} />
      </div>
    </div>
  );
};
