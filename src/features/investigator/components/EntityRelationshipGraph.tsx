import React, { useState, useRef, useMemo } from 'react';
import { useInvestigator, investigatorStore } from '../../../stores/investigator-store.ts';
import { useAuth } from '../../../stores/auth-store.ts';
import { GraphNode, GraphEdge, EntityType } from '../../../domain/investigator.ts';
import {
  Mail,
  UserCheck,
  Users,
  Globe,
  Link2,
  Server,
  Paperclip,
  FolderGit2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Table,
  Network,
  Filter,
  Plus,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Clock,
  Layers,
  Copy,
  Check,
  X,
  Target,
} from 'lucide-react';

export const EntityRelationshipGraph: React.FC = () => {
  const {
    graphNodes,
    graphEdges,
    selectedEntity,
    selectedEdge,
    isLoadingGraph,
    isExpandingNode,
    errorGraph,
    graphViewMode,
    graphFilterType,
  } = useInvestigator();

  const auth = useAuth();
  const tenantId = auth.currentTenant?.id || 'tnt_acme_soc';

  // Canvas Pan & Zoom State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Focus & Dragging State
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [draggedPositions, setDraggedPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [copiedIndicator, setCopiedIndicator] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndicator(text);
    setTimeout(() => setCopiedIndicator(null), 2000);
  };

  // Filter nodes if filter type is applied
  const visibleNodes = useMemo(() => {
    if (!graphFilterType) return graphNodes;
    return graphNodes.filter((n) => n.type === graphFilterType);
  }, [graphNodes, graphFilterType]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((n) => n.id)), [visibleNodes]);

  const visibleEdges = useMemo(() => {
    return graphEdges.filter(
      (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
    );
  }, [graphEdges, visibleNodeIds]);

  // Hierarchical & Radial hybrid layout computation
  const layout = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    const width = 1000;

    // Group nodes by depth
    const depthGroups: Record<number, GraphNode[]> = {};
    visibleNodes.forEach((node) => {
      const d = node.depth || 0;
      if (!depthGroups[d]) depthGroups[d] = [];
      depthGroups[d].push(node);
    });

    const maxNodesInDepth = Math.max(1, ...Object.values(depthGroups).map((g) => g.length));
    const height = Math.max(520, maxNodesInDepth * 95);
    const centerY = height / 2;

    // Root node (depth 0) placed at center left
    if (depthGroups[0] && depthGroups[0][0]) {
      map.set(depthGroups[0][0].id, { x: 140, y: centerY });
    }

    // Depth 1 nodes
    const d1Nodes = depthGroups[1] || [];
    d1Nodes.forEach((node, idx) => {
      const ySpacing = height / (d1Nodes.length + 1);
      map.set(node.id, { x: 420, y: ySpacing * (idx + 1) });
    });

    // Depth 2 nodes
    const d2Nodes = depthGroups[2] || [];
    d2Nodes.forEach((node, idx) => {
      const ySpacing = height / (d2Nodes.length + 1);
      map.set(node.id, { x: 700, y: ySpacing * (idx + 1) });
    });

    // Depth 3+ (expanded nodes)
    const d3Nodes = depthGroups[3] || [];
    d3Nodes.forEach((node, idx) => {
      const ySpacing = height / (d3Nodes.length + 1);
      map.set(node.id, { x: 920, y: ySpacing * (idx + 1) });
    });

    return { map, width, height };
  }, [visibleNodes]);

  // Pan & Drag interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      setDraggedPositions((prev) => {
        const oldPos = prev[draggingNodeId] || layout.map.get(draggingNodeId) || { x: 0, y: 0 };
        return {
          ...prev,
          [draggingNodeId]: {
            x: oldPos.x + e.movementX / zoom,
            y: oldPos.y + e.movementY / zoom,
          },
        };
      });
      return;
    }

    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingNodeId(null);
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(0.5, prev + delta), 2.2));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Node styling adhering to AShieldER visual language:
  // Dual surfaces: light mode clean white, dark neutral surface #0c1322, subtle semantic borders
  const getNodeColor = (type: EntityType, reputation?: string) => {
    if (reputation === 'malicious') {
      return {
        bg: 'fill-white dark:fill-[#0c1322]',
        stroke: 'stroke-rose-500',
        badge: 'bg-rose-50 dark:bg-[#0c1322] text-rose-600 dark:text-rose-400 border border-rose-500/40',
        icon: 'text-rose-600 dark:text-rose-400',
      };
    }
    if (reputation === 'suspicious') {
      return {
        bg: 'fill-white dark:fill-[#0c1322]',
        stroke: 'stroke-amber-500',
        badge: 'bg-amber-50 dark:bg-[#0c1322] text-amber-600 dark:text-amber-400 border border-amber-500/40',
        icon: 'text-amber-600 dark:text-amber-400',
      };
    }

    switch (type) {
      case 'Email':
        return {
          bg: 'fill-white dark:fill-[#0c1322]',
          stroke: 'stroke-[#08B4ED]',
          badge: 'bg-cyan-50/50 dark:bg-[#0c1322] text-[#08B4ED] border border-[#08B4ED]/50',
          icon: 'text-[#08B4ED]',
        };
      case 'Sender':
        return {
          bg: 'fill-white dark:fill-[#0c1322]',
          stroke: 'stroke-indigo-400',
          badge: 'bg-indigo-50/50 dark:bg-[#0c1322] text-indigo-600 dark:text-indigo-400 border border-indigo-500/40',
          icon: 'text-indigo-600 dark:text-indigo-400',
        };
      case 'Recipient':
        return {
          bg: 'fill-white dark:fill-[#0c1322]',
          stroke: 'stroke-teal-400',
          badge: 'bg-teal-50/50 dark:bg-[#0c1322] text-teal-600 dark:text-teal-400 border border-teal-500/40',
          icon: 'text-teal-600 dark:text-teal-400',
        };
      case 'Domain':
        return {
          bg: 'fill-white dark:fill-[#0c1322]',
          stroke: 'stroke-sky-400',
          badge: 'bg-sky-50/50 dark:bg-[#0c1322] text-sky-600 dark:text-sky-400 border border-sky-500/40',
          icon: 'text-sky-600 dark:text-sky-400',
        };
      case 'URL':
        return {
          bg: 'fill-white dark:fill-[#0c1322]',
          stroke: 'stroke-amber-400',
          badge: 'bg-amber-50/50 dark:bg-[#0c1322] text-amber-600 dark:text-amber-400 border border-amber-500/40',
          icon: 'text-amber-600 dark:text-amber-400',
        };
      case 'Source IP':
        return {
          bg: 'fill-white dark:fill-[#0c1322]',
          stroke: 'stroke-purple-400',
          badge: 'bg-purple-50/50 dark:bg-[#0c1322] text-purple-600 dark:text-purple-400 border border-purple-500/40',
          icon: 'text-purple-600 dark:text-purple-400',
        };
      case 'Attachment':
        return {
          bg: 'fill-white dark:fill-[#0c1322]',
          stroke: 'stroke-rose-400',
          badge: 'bg-rose-50/50 dark:bg-[#0c1322] text-rose-600 dark:text-rose-400 border border-rose-500/40',
          icon: 'text-rose-600 dark:text-rose-400',
        };
      case 'Threat Intelligence Indicator':
        return {
          bg: 'fill-white dark:fill-[#0c1322]',
          stroke: 'stroke-rose-500',
          badge: 'bg-rose-50/50 dark:bg-[#0c1322] text-rose-600 dark:text-rose-400 border border-rose-500/40',
          icon: 'text-rose-600 dark:text-rose-400',
        };
      case 'Related Case':
        return {
          bg: 'fill-white dark:fill-[#0c1322]',
          stroke: 'stroke-cyan-400',
          badge: 'bg-cyan-50/50 dark:bg-[#0c1322] text-cyan-600 dark:text-cyan-400 border border-cyan-500/40',
          icon: 'text-cyan-600 dark:text-cyan-400',
        };
      default:
        return {
          bg: 'fill-white dark:fill-[#0c1322]',
          stroke: 'stroke-slate-400 dark:stroke-slate-600',
          badge: 'bg-slate-100 dark:bg-[#0c1322] text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700',
          icon: 'text-slate-600 dark:text-slate-400',
        };
    }
  };

  const getNodeIcon = (type: EntityType) => {
    switch (type) {
      case 'Email':
        return <Mail className="w-3.5 h-3.5" />;
      case 'Sender':
        return <UserCheck className="w-3.5 h-3.5" />;
      case 'Recipient':
        return <Users className="w-3.5 h-3.5" />;
      case 'Domain':
        return <Globe className="w-3.5 h-3.5" />;
      case 'URL':
        return <Link2 className="w-3.5 h-3.5" />;
      case 'Source IP':
        return <Server className="w-3.5 h-3.5" />;
      case 'Attachment':
        return <Paperclip className="w-3.5 h-3.5" />;
      case 'Related Case':
        return <FolderGit2 className="w-3.5 h-3.5" />;
      case 'Threat Intelligence Indicator':
        return <ShieldAlert className="w-3.5 h-3.5" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5" />;
    }
  };

  // Cross-linked investigation focus:
  // Active focus target is either the explicitly hovered node OR the selected entity
  const activeFocusId = hoveredNodeId || selectedEntity?.id || null;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
      {/* Graph Toolbar */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#0a0f1d] border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-white dark:bg-[#0c1322] border border-[#08B4ED]/40 text-[#08B4ED] flex items-center justify-center font-bold">
            <Network className="w-3.5 h-3.5 text-[#08B4ED]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <span>Entity Relationship Graph</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-50 dark:bg-[#0c1322] text-[#08B4ED] border border-[#08B4ED]/30 font-normal">
                Depth ~2 Hops
              </span>
            </h3>
          </div>
        </div>

        {/* Controls: Filter, Mode, Zoom */}
        <div className="flex items-center gap-1.5">
          {/* Filter by Entity Type */}
          <div className="relative">
            <select
              aria-label="Filter entities by type"
              value={graphFilterType || ''}
              onChange={(e) => investigatorStore.setGraphFilterType(e.target.value || null)}
              className="text-[11px] font-mono font-medium bg-white dark:bg-[#0e1627] border border-slate-200 dark:border-slate-800 rounded-md px-2 py-1 text-slate-700 dark:text-slate-300 outline-none cursor-pointer hover:border-[#08B4ED]/40 transition-colors shadow-2xs"
            >
              <option value="">All Entity Types ({graphNodes.length})</option>
              <option value="Email">Email</option>
              <option value="Sender">Sender</option>
              <option value="Domain">Domain</option>
              <option value="URL">URL</option>
              <option value="Source IP">Source IP</option>
              <option value="Attachment">Attachment</option>
              <option value="Related Case">Related Case</option>
              <option value="Threat Intelligence Indicator">Threat Intel</option>
            </select>
          </div>

          {/* Toggle between Graph Canvas and Accessibility Table Mode */}
          <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-md bg-slate-100 dark:bg-[#0e1627] p-0.5">
            <button
              type="button"
              onClick={() => investigatorStore.setGraphViewMode('graph')}
              className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                graphViewMode === 'graph'
                  ? 'bg-[#08B4ED] text-slate-900 dark:text-[#0c1322] font-bold shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Interactive Visual Graph"
            >
              <Network className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => investigatorStore.setGraphViewMode('table')}
              className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                graphViewMode === 'table'
                  ? 'bg-[#08B4ED] text-slate-900 dark:text-[#0c1322] font-bold shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Accessible Relationship Table Matrix"
            >
              <Table className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pan & Zoom Controls */}
          {graphViewMode === 'graph' && (
            <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-1.5">
              <button
                type="button"
                onClick={() => handleZoom(0.15)}
                className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleZoom(-0.15)}
                className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetView}
                className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Reset View Fit"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Graph Content Area */}
      <div className="relative flex-1 min-h-[440px] bg-slate-50/50 dark:bg-[#060a14] overflow-hidden">
        {/* Loading State */}
        {isLoadingGraph && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 dark:bg-[#070b14]/80 backdrop-blur-xs">
            <div className="w-8 h-8 rounded-full border-2 border-[#08B4ED] border-t-transparent animate-spin mb-2" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
              Correlating multi-hop entity relationships...
            </span>
          </div>
        )}

        {/* Isolated Error State */}
        {errorGraph && (
          <div className="p-6 text-center text-slate-500 dark:text-slate-400">
            <AlertTriangle className="w-8 h-8 mx-auto text-amber-500 mb-2" />
            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
              Relationship Graph Telemetry Unavailable
            </p>
            <p className="text-[11px] mt-1 text-slate-500 dark:text-slate-400">{errorGraph}</p>
            <p className="text-[11px] mt-2 text-[#08B4ED]">
              Forensic timeline and raw evidence ledger remain fully operational.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoadingGraph && !errorGraph && visibleNodes.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 dark:text-slate-400">
            <Layers className="w-8 h-8 text-slate-400 dark:text-slate-600 mb-2" />
            <p className="font-bold text-xs text-slate-700 dark:text-slate-300">
              No entities matching selected filter
            </p>
            <p className="text-[11px] mt-0.5">
              Reset entity type filter to observe multi-hop infrastructure links.
            </p>
          </div>
        )}

        {/* Accessibility Alternative: Structured Table View */}
        {graphViewMode === 'table' && visibleNodes.length > 0 && (
          <div className="h-full overflow-y-auto p-4 bg-white dark:bg-transparent">
            <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span>
                Entity Relationship Matrix ({visibleNodes.length} entities, {visibleEdges.length} connections)
              </span>
              <span className="text-[10px] text-[#08B4ED] font-semibold">WCAG 2.1 AA Compliant</span>
            </div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0f1d] text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase font-mono tracking-wider">
                  <th className="py-2.5 px-3">Entity Type</th>
                  <th className="py-2.5 px-3">Value / Indicator</th>
                  <th className="py-2.5 px-3">Hop Depth</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Reputation</th>
                  <th className="py-2.5 px-3 text-right">Forensic Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 font-mono text-[11px]">
                {visibleNodes.map((node) => {
                  const style = getNodeColor(node.type, node.reputation);
                  const isSelected = selectedEntity?.id === node.id;
                  return (
                    <tr
                      key={node.id}
                      onClick={() => investigatorStore.selectEntity(node)}
                      className={`hover:bg-slate-50 dark:hover:bg-[#0f172a] cursor-pointer transition-colors ${
                        isSelected ? 'bg-cyan-50/60 dark:bg-[#0f172a] border-l-2 border-l-[#08B4ED]' : ''
                      }`}
                    >
                      <td className="py-2 px-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${style.badge}`}>
                          {getNodeIcon(node.type)}
                          <span>{node.type}</span>
                        </span>
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-100 max-w-xs truncate">
                        <div className="flex items-center gap-1.5">
                          <span>{node.value}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(node.value);
                            }}
                            className="p-0.5 text-slate-400 hover:text-[#08B4ED] transition-colors"
                            title="Copy Indicator"
                          >
                            {copiedIndicator === node.value ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{node.depth}</td>
                      <td className="py-2 px-3">
                        <span className="font-bold text-[#08B4ED]">
                          {node.confidence ? `${node.confidence}%` : 'N/A'}
                        </span>
                      </td>
                      <td className="py-2 px-3 uppercase font-bold text-[10px]">
                        <span className={node.reputation === 'malicious' ? 'text-rose-600 dark:text-rose-400' : node.reputation === 'suspicious' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}>
                          {node.reputation || 'unknown'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            investigatorStore.selectEntity(node);
                          }}
                          className="text-[11px] text-[#08B4ED] hover:underline font-mono cursor-pointer font-semibold"
                        >
                          Inspect Profile →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Visual Interactive SVG Graph Canvas */}
        {graphViewMode === 'graph' && visibleNodes.length > 0 && (
          <div
            className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg
              ref={svgRef}
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              className="w-full h-full select-none"
            >
              <defs>
                {/* Arrowhead marker for directed forensic relationships */}
                <marker
                  id="forensic-arrow"
                  viewBox="0 0 10 10"
                  refX="28"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                </marker>
                <marker
                  id="forensic-arrow-active"
                  viewBox="0 0 10 10"
                  refX="28"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#08B4ED" />
                </marker>

                {/* Subtle forensic grid pattern */}
                <pattern id="forensic-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.75"
                    className="text-slate-300/40 dark:text-slate-800/40"
                  />
                </pattern>
              </defs>

              {/* Background Grid */}
              <rect width="100%" height="100%" fill="url(#forensic-grid)" />

              {/* Zoom & Pan Transform Container */}
              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                {/* 1. Render Relationship Edges */}
                {visibleEdges.map((edge) => {
                  const sourcePos = draggedPositions[edge.source] || layout.map.get(edge.source);
                  const targetPos = draggedPositions[edge.target] || layout.map.get(edge.target);
                  if (!sourcePos || !targetPos) return null;

                  const isEdgeConnectedToFocus = activeFocusId === null ||
                    activeFocusId === edge.source ||
                    activeFocusId === edge.target;
                  const isHighlighted = activeFocusId !== null && isEdgeConnectedToFocus;
                  const isDimmed = activeFocusId !== null && !isEdgeConnectedToFocus;

                  // Compute curved Bezier line
                  const midX = (sourcePos.x + targetPos.x) / 2;
                  const midY = (sourcePos.y + targetPos.y) / 2 - 12;

                  const isSelectedEdge = selectedEdge?.id === edge.id;

                  return (
                    <g
                      key={edge.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        investigatorStore.selectEdge(edge);
                      }}
                      className="transition-opacity duration-200 cursor-pointer group"
                      style={{ opacity: isDimmed && !isSelectedEdge ? 0.18 : 1 }}
                    >
                      <path
                        d={`M ${sourcePos.x} ${sourcePos.y} Q ${midX} ${midY} ${targetPos.x} ${targetPos.y}`}
                        fill="none"
                        stroke={isSelectedEdge ? '#08B4ED' : isHighlighted ? '#08B4ED' : '#94a3b8'}
                        strokeWidth={isSelectedEdge ? 3.5 : isHighlighted ? 2.5 : 1.3}
                        strokeDasharray={edge.relationship_type.includes('threat') ? '4 3' : undefined}
                        markerEnd={isSelectedEdge || isHighlighted ? 'url(#forensic-arrow-active)' : 'url(#forensic-arrow)'}
                      />
                      {/* Edge Label Pill */}
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x={-edge.label.length * 3 - 6}
                          y={-9}
                          width={edge.label.length * 6 + 12}
                          height={16}
                          rx={4}
                          className={`${
                            isSelectedEdge
                              ? 'fill-[#08B4ED]/20 stroke-[#08B4ED]'
                              : 'fill-white dark:fill-[#0a0f1d] stroke-slate-200 dark:stroke-slate-800'
                          } transition-colors`}
                          strokeWidth={isSelectedEdge ? 1.5 : 1}
                        />
                        <text
                          textAnchor="middle"
                          y={2.5}
                          className={`text-[9px] font-mono select-none pointer-events-none ${
                            isSelectedEdge
                              ? 'fill-[#08B4ED] font-extrabold'
                              : isHighlighted
                              ? 'fill-[#08B4ED] font-bold'
                              : 'fill-slate-500 dark:fill-slate-400'
                          }`}
                        >
                          {edge.label}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* 2. Render Forensic Nodes */}
                {visibleNodes.map((node) => {
                  const pos = draggedPositions[node.id] || layout.map.get(node.id);
                  if (!pos) return null;

                  const isSelected = selectedEntity?.id === node.id;
                  const isConnectedToFocus = activeFocusId === null ||
                    activeFocusId === node.id ||
                    visibleEdges.some(
                      (e) =>
                        (e.source === activeFocusId && e.target === node.id) ||
                        (e.target === activeFocusId && e.source === node.id)
                    );
                  const isDimmed = activeFocusId !== null && !isConnectedToFocus;
                  const isNeighborhood = activeFocusId !== null && isConnectedToFocus && !isSelected;

                  const style = getNodeColor(node.type, node.reputation);

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      onMouseDown={(e) => {
                        if (e.button !== 0) return;
                        e.stopPropagation();
                        setDraggingNodeId(node.id);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        investigatorStore.selectEntity(node);
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        investigatorStore.expandNode(node.id, tenantId);
                      }}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      className={`group ${draggingNodeId === node.id ? 'cursor-grabbing' : 'cursor-grab'} transition-opacity duration-200`}
                      style={{ opacity: isDimmed ? 0.22 : 1 }}
                    >
                      {/* Selection Halo (Approved #08B4ED) */}
                      {isSelected && (
                        <circle
                          r={32}
                          className="fill-[#08B4ED]/15 stroke-[#08B4ED] animate-pulse"
                          strokeWidth="2"
                        />
                      )}

                      {/* Neighborhood Focus Ring (1-hop connected) */}
                      {isNeighborhood && (
                        <circle
                          r={28}
                          className="fill-transparent stroke-[#08B4ED]/50"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        r={24}
                        className={`${style.bg} ${style.stroke} transition-all duration-150 group-hover:scale-105`}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                      />

                      {/* Icon Centered */}
                      <g transform="translate(-8, -8)" className={style.icon}>
                        {getNodeIcon(node.type)}
                      </g>

                      {/* Node Label & Value Pill (Identity & Value Prominent) */}
                      <g transform="translate(30, 0)">
                        <rect
                          x={-4}
                          y={-15}
                          width={155}
                          height={30}
                          rx={4}
                          className="fill-white/95 dark:fill-[#070b14]/95 stroke-slate-200 dark:stroke-slate-800/80 shadow-xs"
                        />
                        {/* 1. Entity Name / Value Prominent */}
                        <text
                          textAnchor="start"
                          y={-2}
                          className="text-[11px] font-mono font-bold fill-slate-900 dark:fill-slate-100 select-none"
                        >
                          {node.value.length > 21 ? `${node.value.substring(0, 19)}...` : node.value}
                        </text>
                        {/* 2. Entity Type & Confidence Subordinate */}
                        <text
                          textAnchor="start"
                          y={10}
                          className="text-[9px] font-mono font-semibold fill-slate-500 dark:fill-slate-400 select-none"
                        >
                          {node.type}
                          {node.confidence ? ` • ${node.confidence}%` : ''}
                        </text>
                      </g>

                      {/* Confidence Tag */}
                      {node.confidence && (
                        <g transform="translate(-15, 28)">
                          <rect
                            width={30}
                            height={14}
                            rx={4}
                            className="fill-white dark:fill-[#0a0f1d] stroke-slate-200 dark:stroke-slate-800"
                            strokeWidth="1"
                          />
                          <text
                            x={15}
                            y={10}
                            textAnchor="middle"
                            className="text-[8px] font-mono font-bold fill-[#08B4ED]"
                          >
                            {node.confidence}%
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        )}

        {/* Selected Entity Compact Pivot Action HUD (Floating Lower Left) */}
        {selectedEntity && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-lg bg-white/95 dark:bg-[#0c1322]/95 border border-[#08B4ED]/60 rounded-lg p-2.5 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn z-10">
            <div className="min-w-0 flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-slate-100 dark:bg-[#070b14] border border-[#08B4ED]/50 flex items-center justify-center shrink-0">
                <Target className="w-3.5 h-3.5 text-[#08B4ED]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] font-bold text-[#08B4ED] uppercase">{selectedEntity.type}:</span>
                  <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                    {selectedEntity.value}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedEntity.value)}
                    className="p-0.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    title="Copy Indicator"
                  >
                    {copiedIndicator === selectedEntity.value ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                  Depth: {selectedEntity.depth} • Reputation: <span className="font-bold text-rose-600 dark:text-rose-400 uppercase">{selectedEntity.reputation || 'unknown'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => investigatorStore.expandNode(selectedEntity.id, tenantId)}
                disabled={isExpandingNode}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-semibold bg-slate-100 dark:bg-[#070b14] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded transition-colors cursor-pointer disabled:opacity-50"
                title="Bounded relationship expansion (+1 hop)"
              >
                <Plus className="w-3 h-3 text-[#08B4ED]" />
                <span>{isExpandingNode ? 'Expanding...' : '+1 Hop'}</span>
              </button>

              <button
                type="button"
                onClick={() => investigatorStore.selectEntity(selectedEntity)}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-semibold bg-[#08B4ED] hover:bg-[#08B4ED]/90 text-slate-900 dark:text-[#0c1322] rounded transition-colors cursor-pointer font-bold"
              >
                <span>Inspect Dossier</span>
                <ArrowRight className="w-3 h-3 text-slate-900 dark:text-[#0c1322]" />
              </button>

              <button
                type="button"
                onClick={() => investigatorStore.selectEntity(null)}
                className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Deselect Node"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
