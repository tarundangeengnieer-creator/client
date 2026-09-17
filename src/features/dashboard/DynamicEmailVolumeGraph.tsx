import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Mail,
  ShieldCheck,
  Zap,
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Maximize2,
  Minimize2,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type TimeRange = '24h' | '7d' | '30d' | '90d' | 'custom';
export type ViewMode = 'telemetry' | 'trend';

export interface DefenderTelemetryPoint {
  label: string;
  fullDate: string;
  totalEmails: number;
  malicious: number;
  suspicious: number;
  clean: number;
  threats: number;
  casesCreated: number;
  autoClosed: number;
  escalated: number;
  threatLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  anomaly?: boolean;
  campaign?: string;
  gatewayBlocked?: number;
  zapPurged?: number;
}

const DEFENDER_DATA_24H: DefenderTelemetryPoint[] = [
  { label: '00:00', fullDate: 'Today 00:00 UTC', totalEmails: 8, malicious: 0, suspicious: 1, clean: 7, threats: 1, casesCreated: 1, autoClosed: 7, escalated: 0, threatLevel: 'Low' },
  { label: '02:00', fullDate: 'Today 02:00 UTC', totalEmails: 5, malicious: 0, suspicious: 0, clean: 5, threats: 0, casesCreated: 0, autoClosed: 5, escalated: 0, threatLevel: 'Low' },
  { label: '04:00', fullDate: 'Today 04:00 UTC', totalEmails: 7, malicious: 0, suspicious: 1, clean: 6, threats: 1, casesCreated: 1, autoClosed: 6, escalated: 0, threatLevel: 'Low' },
  { label: '06:00', fullDate: 'Today 06:00 UTC', totalEmails: 16, malicious: 1, suspicious: 2, clean: 13, threats: 3, casesCreated: 2, autoClosed: 14, escalated: 0, threatLevel: 'Low', gatewayBlocked: 2, zapPurged: 1 },
  { label: '08:00', fullDate: 'Today 08:00 UTC', totalEmails: 34, malicious: 3, suspicious: 4, clean: 27, threats: 7, casesCreated: 4, autoClosed: 30, escalated: 1, threatLevel: 'Moderate', gatewayBlocked: 5, zapPurged: 2 },
  { label: '10:00', fullDate: 'Today 10:00 UTC', totalEmails: 48, malicious: 6, suspicious: 7, clean: 35, threats: 13, casesCreated: 6, autoClosed: 42, escalated: 2, threatLevel: 'Moderate', gatewayBlocked: 9, zapPurged: 4 },
  { label: '12:00', fullDate: 'Today 12:00 UTC', totalEmails: 64, malicious: 14, suspicious: 9, clean: 41, threats: 23, casesCreated: 9, autoClosed: 55, escalated: 5, threatLevel: 'Critical', anomaly: true, campaign: 'CP-9041: Microsoft 365 OAuth Phish Surge', gatewayBlocked: 18, zapPurged: 5 },
  { label: '14:00', fullDate: 'Today 14:00 UTC', totalEmails: 52, malicious: 7, suspicious: 6, clean: 39, threats: 13, casesCreated: 6, autoClosed: 46, escalated: 2, threatLevel: 'Moderate', gatewayBlocked: 10, zapPurged: 3 },
  { label: '16:00', fullDate: 'Today 16:00 UTC', totalEmails: 38, malicious: 4, suspicious: 3, clean: 31, threats: 7, casesCreated: 4, autoClosed: 34, escalated: 1, threatLevel: 'Low', gatewayBlocked: 5, zapPurged: 2 },
  { label: '18:00', fullDate: 'Today 18:00 UTC', totalEmails: 24, malicious: 2, suspicious: 2, clean: 20, threats: 4, casesCreated: 2, autoClosed: 22, escalated: 0, threatLevel: 'Low', gatewayBlocked: 3, zapPurged: 1 },
  { label: '20:00', fullDate: 'Today 20:00 UTC', totalEmails: 18, malicious: 1, suspicious: 1, clean: 16, threats: 2, casesCreated: 2, autoClosed: 16, escalated: 0, threatLevel: 'Low', gatewayBlocked: 2, zapPurged: 0 },
  { label: '22:00', fullDate: 'Today 22:00 UTC', totalEmails: 11, malicious: 0, suspicious: 1, clean: 10, threats: 1, casesCreated: 1, autoClosed: 10, escalated: 0, threatLevel: 'Low' },
];

const DEFENDER_DATA_7D: DefenderTelemetryPoint[] = [
  { label: 'Mon', fullDate: 'Aug 10 UTC', totalEmails: 42, malicious: 4, suspicious: 6, clean: 32, threats: 10, casesCreated: 5, autoClosed: 37, escalated: 1, threatLevel: 'Low', gatewayBlocked: 7, zapPurged: 3 },
  { label: 'Tue', fullDate: 'Aug 11 UTC', totalEmails: 54, malicious: 6, suspicious: 7, clean: 41, threats: 13, casesCreated: 6, autoClosed: 48, escalated: 1, threatLevel: 'Low', gatewayBlocked: 10, zapPurged: 3 },
  { label: 'Wed', fullDate: 'Aug 12 UTC', totalEmails: 49, malicious: 5, suspicious: 6, clean: 38, threats: 11, casesCreated: 5, autoClosed: 44, escalated: 1, threatLevel: 'Low', gatewayBlocked: 8, zapPurged: 3 },
  { label: 'Thu', fullDate: 'Aug 13 UTC', totalEmails: 62, malicious: 9, suspicious: 11, clean: 42, threats: 20, casesCreated: 8, autoClosed: 54, escalated: 2, threatLevel: 'Moderate', gatewayBlocked: 15, zapPurged: 5 },
  { label: 'Fri', fullDate: 'Aug 14 UTC', totalEmails: 82, malicious: 18, suspicious: 14, clean: 50, threats: 32, casesCreated: 12, autoClosed: 70, escalated: 6, threatLevel: 'Critical', anomaly: true, campaign: 'CP-9041: Banking Lure Impersonation Wave', gatewayBlocked: 24, zapPurged: 8 },
  { label: 'Sat', fullDate: 'Aug 15 UTC', totalEmails: 28, malicious: 3, suspicious: 3, clean: 22, threats: 6, casesCreated: 3, autoClosed: 25, escalated: 0, threatLevel: 'Low', gatewayBlocked: 5, zapPurged: 1 },
  { label: 'Sun', fullDate: 'Aug 16 UTC', totalEmails: 22, malicious: 2, suspicious: 2, clean: 18, threats: 4, casesCreated: 2, autoClosed: 20, escalated: 0, threatLevel: 'Low', gatewayBlocked: 3, zapPurged: 1 },
];

const DEFENDER_DATA_14D: DefenderTelemetryPoint[] = [
  { label: 'Aug 01', fullDate: 'Aug 01 UTC', totalEmails: 26, malicious: 2, suspicious: 3, clean: 21, threats: 5, casesCreated: 3, autoClosed: 23, escalated: 0, threatLevel: 'Low', gatewayBlocked: 4, zapPurged: 1 },
  { label: 'Aug 03', fullDate: 'Aug 03 UTC', totalEmails: 34, malicious: 3, suspicious: 4, clean: 27, threats: 7, casesCreated: 4, autoClosed: 30, escalated: 0, threatLevel: 'Low', gatewayBlocked: 5, zapPurged: 2 },
  { label: 'Aug 05', fullDate: 'Aug 05 UTC', totalEmails: 38, malicious: 4, suspicious: 5, clean: 29, threats: 9, casesCreated: 4, autoClosed: 34, escalated: 1, threatLevel: 'Low', gatewayBlocked: 7, zapPurged: 2 },
  { label: 'Aug 07', fullDate: 'Aug 07 UTC', totalEmails: 44, malicious: 5, suspicious: 6, clean: 33, threats: 11, casesCreated: 5, autoClosed: 39, escalated: 1, threatLevel: 'Low', gatewayBlocked: 8, zapPurged: 3 },
  { label: 'Aug 09', fullDate: 'Aug 09 UTC', totalEmails: 32, malicious: 3, suspicious: 4, clean: 25, threats: 7, casesCreated: 3, autoClosed: 29, escalated: 0, threatLevel: 'Low', gatewayBlocked: 5, zapPurged: 2 },
  { label: 'Aug 11', fullDate: 'Aug 11 UTC', totalEmails: 54, malicious: 6, suspicious: 7, clean: 41, threats: 13, casesCreated: 6, autoClosed: 48, escalated: 1, threatLevel: 'Low', gatewayBlocked: 10, zapPurged: 3 },
  { label: 'Aug 13', fullDate: 'Aug 13 UTC', totalEmails: 60, malicious: 9, suspicious: 10, clean: 41, threats: 19, casesCreated: 7, autoClosed: 53, escalated: 2, threatLevel: 'Moderate', gatewayBlocked: 14, zapPurged: 5 },
  { label: 'Aug 14', fullDate: 'Aug 14 UTC', totalEmails: 82, malicious: 18, suspicious: 14, clean: 50, threats: 32, casesCreated: 12, autoClosed: 70, escalated: 6, threatLevel: 'Critical', anomaly: true, campaign: 'CP-9041: Credential Harvest & QR Code Phish', gatewayBlocked: 24, zapPurged: 8 },
  { label: 'Aug 15', fullDate: 'Aug 15 UTC', totalEmails: 46, malicious: 5, suspicious: 6, clean: 35, threats: 11, casesCreated: 5, autoClosed: 41, escalated: 1, threatLevel: 'Moderate', gatewayBlocked: 8, zapPurged: 3 },
  { label: 'Aug 16', fullDate: 'Aug 16 UTC', totalEmails: 40, malicious: 4, suspicious: 5, clean: 31, threats: 9, casesCreated: 4, autoClosed: 36, escalated: 1, threatLevel: 'Low', gatewayBlocked: 7, zapPurged: 2 },
];

const DEFENDER_DATA_30D: DefenderTelemetryPoint[] = [
  { label: 'Jul 18', fullDate: 'Jul 18 UTC', totalEmails: 28, malicious: 3, suspicious: 3, clean: 22, threats: 6, casesCreated: 3, autoClosed: 25, escalated: 0, threatLevel: 'Low', gatewayBlocked: 4, zapPurged: 2 },
  { label: 'Jul 22', fullDate: 'Jul 22 UTC', totalEmails: 36, malicious: 4, suspicious: 4, clean: 28, threats: 8, casesCreated: 4, autoClosed: 32, escalated: 0, threatLevel: 'Low', gatewayBlocked: 6, zapPurged: 2 },
  { label: 'Jul 26', fullDate: 'Jul 26 UTC', totalEmails: 42, malicious: 4, suspicious: 5, clean: 33, threats: 9, casesCreated: 4, autoClosed: 38, escalated: 1, threatLevel: 'Low', gatewayBlocked: 7, zapPurged: 2 },
  { label: 'Jul 30', fullDate: 'Jul 30 UTC', totalEmails: 48, malicious: 6, suspicious: 6, clean: 36, threats: 12, casesCreated: 5, autoClosed: 43, escalated: 1, threatLevel: 'Low', gatewayBlocked: 9, zapPurged: 3 },
  { label: 'Aug 03', fullDate: 'Aug 03 UTC', totalEmails: 40, malicious: 4, suspicious: 5, clean: 31, threats: 9, casesCreated: 4, autoClosed: 36, escalated: 1, threatLevel: 'Low', gatewayBlocked: 7, zapPurged: 2 },
  { label: 'Aug 07', fullDate: 'Aug 07 UTC', totalEmails: 52, malicious: 7, suspicious: 8, clean: 37, threats: 15, casesCreated: 6, autoClosed: 46, escalated: 2, threatLevel: 'Moderate', gatewayBlocked: 11, zapPurged: 4 },
  { label: 'Aug 10', fullDate: 'Aug 10 UTC', totalEmails: 58, malicious: 8, suspicious: 9, clean: 41, threats: 17, casesCreated: 7, autoClosed: 51, escalated: 2, threatLevel: 'Moderate', gatewayBlocked: 13, zapPurged: 4 },
  { label: 'Aug 14', fullDate: 'Aug 14 UTC', totalEmails: 88, malicious: 21, suspicious: 16, clean: 51, threats: 37, casesCreated: 14, autoClosed: 74, escalated: 7, threatLevel: 'Critical', anomaly: true, campaign: 'CP-9041: Multi-vector Financial Impersonation', gatewayBlocked: 27, zapPurged: 10 },
  { label: 'Aug 16', fullDate: 'Aug 16 UTC', totalEmails: 44, malicious: 5, suspicious: 5, clean: 34, threats: 10, casesCreated: 5, autoClosed: 39, escalated: 1, threatLevel: 'Low', gatewayBlocked: 7, zapPurged: 3 },
];

function createSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  return path;
}

export const DynamicEmailVolumeGraph: React.FC<{ timeRange: '24h' | '7d' | '30d' | '90d' | 'custom' }> = ({ timeRange }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('telemetry');
  const [trafficFilter, setTrafficFilter] = useState<'all' | 'threats'>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Series visibility defaults
  const visibleSeries = useMemo(() => ({
    baseline: true,
    malicious: true,
  }), []);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const expandedSvgRef = useRef<SVGSVGElement | null>(null);

  // Keyboard shortcut listener to close expanded view on Escape
  useEffect(() => {
    if (!isExpanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  // Active dataset
  const currentData = useMemo(() => {
    switch (timeRange) {
      case '24h':
        return DEFENDER_DATA_24H;
      case '7d':
        return DEFENDER_DATA_7D;
      case '30d':
      case '90d':
      case 'custom':
      default:
        return DEFENDER_DATA_30D;
    }
  }, [timeRange]);

  // Active point only when actively hovering
  const activeIndex = hoveredIndex;

  // Track standard container width & height
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(380);
  const [containerHeight, setContainerHeight] = useState(240);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(Math.round(entry.contentRect.width));
        }
        if (entry.contentRect.height > 0) {
          setContainerHeight(Math.round(entry.contentRect.height));
        }
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Track expanded container width
  const expandedContainerRef = useRef<HTMLDivElement | null>(null);
  const [expandedWidth, setExpandedWidth] = useState(880);

  useEffect(() => {
    if (!isExpanded || !expandedContainerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setExpandedWidth(Math.round(entry.contentRect.width));
        }
      }
    });
    ro.observe(expandedContainerRef.current);
    return () => ro.disconnect();
  }, [isExpanded]);

  // Aggregate Metrics & Defender catch rate
  const totals = useMemo(() => {
    const sum = currentData.reduce(
      (acc, d) => ({
        totalEmails: acc.totalEmails + d.totalEmails,
        threats: acc.threats + d.threats,
        malicious: acc.malicious + d.malicious,
        suspicious: acc.suspicious + d.suspicious,
        clean: acc.clean + d.clean,
        autoCleared: acc.autoCleared + d.autoClosed,
        escalated: acc.escalated + d.escalated,
        gatewayBlocked: acc.gatewayBlocked + (d.gatewayBlocked || 0),
        zapPurged: acc.zapPurged + (d.zapPurged || 0),
      }),
      {
        totalEmails: 0,
        threats: 0,
        malicious: 0,
        suspicious: 0,
        clean: 0,
        autoCleared: 0,
        escalated: 0,
        gatewayBlocked: 0,
        zapPurged: 0,
      }
    );

    const catchRate =
      sum.threats > 0
        ? ((sum.autoCleared / (sum.totalEmails || 1)) * 100).toFixed(1)
        : '99.4';

    return { ...sum, catchRate };
  }, [currentData]);

  // SVG Geometry Calculation helper
  const calculateGeometry = (viewW: number, viewH: number) => {
    const PADDING_LEFT = 28;
    const PADDING_RIGHT = 14;
    const PADDING_TOP = 16;
    const PADDING_BOTTOM = 18;

    const chartW = viewW - PADDING_LEFT - PADDING_RIGHT;
    const chartH = viewH - PADDING_TOP - PADDING_BOTTOM;

    const max = Math.max(
      ...currentData.map((d) => (trafficFilter === 'threats' ? d.threats : d.totalEmails)),
      10
    );
    const maxVal = Math.ceil(max / 10) * 10;

    const count = currentData.length;
    const baselineFloorY = PADDING_TOP + chartH;
    const points = currentData.map((point, index) => {
      const x = PADDING_LEFT + (index / (count - 1)) * chartW;
      const baselineY = baselineFloorY;
      const targetVal = trafficFilter === 'threats' ? point.threats : point.totalEmails;
      const y = PADDING_TOP + chartH - (targetVal / maxVal) * chartH;

      // Stacked column heights (Clean -> Suspicious -> Malicious)
      const cleanH = trafficFilter === 'threats' ? 0 : (point.clean / maxVal) * chartH;
      const suspH = (point.suspicious / maxVal) * chartH;
      const malicH = visibleSeries.malicious ? (point.malicious / maxVal) * chartH : 0;

      const cleanY = baselineY - cleanH;
      const suspY = cleanY - suspH;
      const malicY = suspY - malicH;

      return {
        ...point,
        x,
        y,
        baselineY,
        cleanH,
        cleanY,
        suspH,
        suspY,
        malicH,
        malicY,
        index,
      };
    });

    const linePath = visibleSeries.baseline ? createSmoothPath(points.map((p) => ({ x: p.x, y: p.y }))) : '';
    let areaPath = '';
    if (visibleSeries.baseline && points.length > 0) {
      const spline = createSmoothPath(points.map((p) => ({ x: p.x, y: p.y })));
      const firstX = points[0].x;
      const lastX = points[points.length - 1].x;
      areaPath = `${spline} L ${lastX.toFixed(1)} ${baselineFloorY} L ${firstX.toFixed(1)} ${baselineFloorY} Z`;
    }

    return {
      viewW,
      viewH,
      PADDING_LEFT,
      PADDING_RIGHT,
      PADDING_TOP,
      PADDING_BOTTOM,
      chartW,
      chartH,
      maxVal,
      points,
      linePath,
      areaPath,
    };
  };

  // Standard geometry (collapsed card)
  const standardGeom = useMemo(() => {
    const calcH = Math.max(180, containerHeight > 0 ? containerHeight - 20 : 220);
    return calculateGeometry(Math.max(300, containerWidth), calcH);
  }, [containerWidth, containerHeight, currentData, visibleSeries, trafficFilter]);

  // Expanded geometry (modal card)
  const expandedGeom = useMemo(() => {
    return calculateGeometry(Math.max(480, expandedWidth), 250);
  }, [expandedWidth, currentData, visibleSeries, trafficFilter]);

  // Mouse tracking
  const handleMouseMove = (
    e: React.MouseEvent<SVGSVGElement>,
    activeGeom: ReturnType<typeof calculateGeometry>,
    targetSvg: SVGSVGElement | null
  ) => {
    if (!targetSvg || activeGeom.points.length === 0) return;
    const rect = targetSvg.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * activeGeom.viewW;

    let closestIdx = 0;
    let minDiff = Infinity;
    activeGeom.points.forEach((p, idx) => {
      const diff = Math.abs(p.x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    setHoveredIndex(closestIdx);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  /**
   * Render Chart Canvas
   */
  const renderChartCanvas = (
    geom: ReturnType<typeof calculateGeometry>,
    activeSvgRef: React.MutableRefObject<SVGSVGElement | null>,
    isLarge: boolean = false
  ) => {
    const activePoint = geom.points[activeIndex] || null;

    return (
      <div className={`relative w-full min-w-0 flex flex-col ${isLarge ? 'h-[280px]' : 'flex-1 h-full min-h-[190px]'}`}>
        <div className="relative w-full flex-1 min-h-0">
          <svg
            ref={activeSvgRef}
            viewBox={`0 0 ${geom.viewW} ${geom.viewH}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
            onMouseMove={(e) => handleMouseMove(e, geom, activeSvgRef.current)}
            onMouseLeave={handleMouseLeave}
          >
          {/* Horizontal Gridlines */}
          {[0, 0.5, 1].map((ratio) => {
            const yPos = geom.PADDING_TOP + geom.chartH * ratio;
            return (
              <line
                key={ratio}
                x1={geom.PADDING_LEFT}
                y1={yPos}
                x2={geom.viewW - geom.PADDING_RIGHT}
                y2={yPos}
                stroke="currentColor"
                className="text-slate-200/80 dark:text-slate-800/80"
                strokeDasharray={ratio === 1 ? undefined : '2 3'}
                strokeWidth="0.8"
              />
            );
          })}

          {/* Y-Axis Value Labels */}
          <text
            x={geom.PADDING_LEFT - 4}
            y={geom.PADDING_TOP + 3}
            textAnchor="end"
            fontSize={isLarge ? '8.5' : '7'}
            className="fill-slate-600 dark:fill-slate-400 font-mono font-semibold"
          >
            {geom.maxVal}
          </text>
          <text
            x={geom.PADDING_LEFT - 4}
            y={geom.PADDING_TOP + geom.chartH / 2 + 2.5}
            textAnchor="end"
            fontSize={isLarge ? '8.5' : '7'}
            className="fill-slate-600 dark:fill-slate-400 font-mono font-semibold"
          >
            {Math.round(geom.maxVal / 2)}
          </text>
          <text
            x={geom.PADDING_LEFT - 4}
            y={geom.PADDING_TOP + geom.chartH + 1}
            textAnchor="end"
            fontSize={isLarge ? '8.5' : '7'}
            className="fill-slate-600 dark:fill-slate-400 font-mono font-semibold"
          >
            0
          </text>

          {/* Telemetry View: Stacked Bar Columns */}
          {viewMode === 'telemetry' && (
            <g id="defender-stacked-bars">
              {geom.points.map((p) => {
                const barWidth = Math.max(
                  isLarge ? 10 : 6,
                  Math.min(isLarge ? 28 : 18, (geom.chartW / geom.points.length) * 0.45)
                );
                const isHovered = activePoint?.index === p.index;

                return (
                  <g
                    key={p.index}
                    className="transition-opacity duration-150 cursor-pointer"
                    opacity={activePoint && !isHovered ? 0.6 : 1}
                  >
                    {/* Clean Segment (bottom) */}
                    {p.cleanH > 0 && (
                      <rect
                        x={p.x - barWidth / 2}
                        y={p.cleanY}
                        width={barWidth}
                        height={p.cleanH}
                        fill="#10C98A"
                        fillOpacity={isHovered ? 0.95 : 0.8}
                        rx="1"
                      />
                    )}

                    {/* Suspicious Segment (middle) */}
                    {p.suspH > 0 && (
                      <rect
                        x={p.x - barWidth / 2}
                        y={p.suspY}
                        width={barWidth}
                        height={p.suspH}
                        fill="#FFB800"
                        fillOpacity={isHovered ? 1 : 0.9}
                        rx="1"
                      />
                    )}

                    {/* Malicious Segment (top) */}
                    {p.malicH > 0 && (
                      <rect
                        x={p.x - barWidth / 2}
                        y={p.malicY}
                        width={barWidth}
                        height={p.malicH}
                        fill="#FF365C"
                        fillOpacity={isHovered ? 1 : 0.95}
                        rx="1"
                      />
                    )}

                    {/* Active Column Indicator outline */}
                    {isHovered && (
                      <rect
                        x={p.x - barWidth / 2 - 1.5}
                        y={Math.min(p.malicY, p.y) - 2}
                        width={barWidth + 3}
                        height={p.baselineY - Math.min(p.malicY, p.y) + 2}
                        fill="none"
                        stroke="currentColor"
                        className="text-blue-500 dark:text-sky-400"
                        strokeWidth="1.2"
                        rx="2"
                      />
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* Baseline Flow Area & Curve Line */}
          {geom.areaPath && (
            <path
              d={geom.areaPath}
              fill="#18BFFF"
              fillOpacity={viewMode === 'telemetry' ? '0.04' : '0.08'}
            />
          )}

          {geom.linePath && (
            <path
              d={geom.linePath}
              fill="none"
              stroke="#18BFFF"
              strokeWidth={viewMode === 'trend' ? (isLarge ? '2.5' : '2') : isLarge ? '1.8' : '1.4'}
              strokeDasharray={viewMode === 'telemetry' ? '3 3' : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Campaign & Anomaly Markers */}
          {geom.points.map((p) => {
            if (!p.anomaly) return null;
            return (
              <g key={`flag-${p.index}`} className="cursor-pointer">
                <circle
                  cx={p.x}
                  cy={geom.PADDING_TOP - 4}
                  r={isLarge ? '7.5' : '6.5'}
                  fill="#FF365C"
                  fillOpacity="0.2"
                  className="animate-pulse"
                />
                <circle
                  cx={p.x}
                  cy={geom.PADDING_TOP - 4}
                  r={isLarge ? '4' : '3.5'}
                  fill="#FF365C"
                  stroke="#ffffff"
                  strokeWidth="1"
                />
                <line
                  x1={p.x}
                  y1={geom.PADDING_TOP - 1}
                  x2={p.x}
                  y2={p.y}
                  stroke="#FF365C"
                  strokeWidth="1"
                  strokeDasharray="1.5 1.5"
                />
              </g>
            );
          })}

          {/* Continuous Scrubber Vertical Guideline */}
          {activePoint && (
            <g id="defender-scrubber">
              <line
                x1={activePoint.x}
                y1={geom.PADDING_TOP}
                x2={activePoint.x}
                y2={geom.PADDING_TOP + geom.chartH}
                stroke="currentColor"
                className="text-slate-400 dark:text-slate-500"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r={isLarge ? '5' : '4'}
                fill="#18BFFF"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>
      </div>

      {/* X-Axis Tick Labels */}
      <div className={`flex justify-between pl-7 pr-3 text-slate-600 dark:text-slate-400 font-mono shrink-0 ${isLarge ? 'text-[10px] mt-2' : 'text-[9px] mt-1.5'}`}>
        {geom.points
          .filter((_, i, arr) => {
            if (arr.length <= (isLarge ? 12 : 6)) return true;
            return i % (isLarge ? 1 : 2) === 0 || i === arr.length - 1;
          })
          .map((p) => (
            <span
              key={p.index}
              className={activePoint?.index === p.index ? 'text-blue-700 dark:text-sky-400 font-bold' : ''}
            >
              {p.label}
            </span>
          ))}
      </div>
    </div>
    );
  };

  /**
   * Reusable Header Component
   */
  const renderHeader = (isLarge: boolean = false) => (
    <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80 space-y-2.5">
      {/* Top Row: Title, Badge, Subtitle & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
            <Mail className={isLarge ? 'w-5 h-5' : 'w-4 h-4'} />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className={`font-bold text-slate-900 dark:text-white ${isLarge ? 'text-base' : 'text-sm'}`}>
                Inbound Flow & Threat Telemetry
              </h3>
              <span className="px-1.5 py-0.2 text-xs font-semibold rounded uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                MDO/SOC
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gateway ingress & automated threat interception
            </p>
          </div>
        </div>

        {/* Legend indicator for color-coded bars */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span>Clean</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Suspicious</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Malicious</span>
          </span>
        </div>

        {/* Fullscreen Expand / Exit Button (Icon only) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          title={isExpanded ? 'Close expanded view (Esc)' : 'Expand telemetry to full screen'}
          aria-label={isExpanded ? 'Exit full screen' : 'Expand full screen'}
          className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700/80"
        >
          {isExpanded ? (
            <Minimize2 className={isLarge ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
          ) : (
            <Maximize2 className={isLarge ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
          )}
        </button>
      </div>

      {/* Controls Row: Traffic Filter, View Mode Switcher and Timeframe Switcher */}
      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2">
        {/* Series Filter: All Traffic vs Threats Only with High-Contrast Active State */}
        <div className="flex items-center bg-slate-100 dark:bg-[#090e1a] p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setTrafficFilter('all');
            }}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              trafficFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-sky-500 dark:text-slate-950 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Traffic
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setTrafficFilter('threats');
            }}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              trafficFilter === 'threats'
                ? 'bg-rose-600 text-white dark:bg-rose-500 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400'
            }`}
          >
            Threats Only
          </button>
        </div>

        {/* View Mode Switcher: Telemetry vs Trendline */}
        <div className="flex items-center bg-slate-100 dark:bg-[#090e1a] p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewMode('telemetry');
            }}
            title="Telemetry Stacked Breakdown"
            className={`flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer transition-colors ${
              viewMode === 'telemetry'
                ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-sky-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Stacked</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewMode('trend');
            }}
            title="Continuous Flow Curve"
            className={`flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer transition-colors ${
              viewMode === 'trend'
                ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-sky-400 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Curve</span>
          </button>
        </div>


      </div>
    </div>
  );

  /**
   * Reusable KPI Ribbon
   */
  const renderKpiRibbon = (isLarge: boolean = false) => (
    <div className={`grid grid-cols-4 gap-2 mt-3 mb-2`}>
      <div className="bg-slate-50/70 dark:bg-[#090e1a]/80 border border-slate-200/60 dark:border-slate-800/80 rounded-lg p-2">
        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Inbound Volume</div>
        <div className={`${isLarge ? 'text-base' : 'text-sm'} font-bold text-slate-900 dark:text-white font-mono mt-0.5`}>
          {totals.totalEmails}
        </div>
      </div>

      <div className="bg-slate-50/70 dark:bg-[#090e1a]/80 border border-slate-200/60 dark:border-slate-800/80 rounded-lg p-2">
        <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Catch Rate</span>
        </div>
        <div className={`${isLarge ? 'text-base' : 'text-sm'} font-bold text-emerald-700 dark:text-emerald-400 font-mono mt-0.5`}>
          {totals.catchRate}%
        </div>
      </div>

      <div className="bg-slate-50/70 dark:bg-[#090e1a]/80 border border-slate-200/60 dark:border-slate-800/80 rounded-lg p-2">
        <div className="text-[10px] text-sky-700 dark:text-sky-400 font-medium flex items-center gap-1">
          <Zap className="w-3 h-3 text-sky-500" />
          <span>ZAP Purged</span>
        </div>
        <div className={`${isLarge ? 'text-base' : 'text-sm'} font-bold text-sky-700 dark:text-sky-400 font-mono mt-0.5`}>
          {totals.zapPurged}
        </div>
      </div>

      <div className="bg-slate-50/70 dark:bg-[#090e1a]/80 border border-slate-200/60 dark:border-slate-800/80 rounded-lg p-2">
        <div className="text-[10px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-rose-500" />
          <span>Escalated</span>
        </div>
        <div className={`${isLarge ? 'text-base' : 'text-sm'} font-bold text-rose-600 dark:text-rose-400 font-mono mt-0.5`}>
          {totals.escalated}
        </div>
      </div>
    </div>
  );

  /**
   * Reusable Bottom Summary Bar
   */
  const renderBottomSummary = (isLarge: boolean = false) => (
    <div className="grid grid-cols-4 gap-1 pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 text-center">
      <div>
        <div className={`${isLarge ? 'text-base' : 'text-sm'} font-bold text-slate-900 dark:text-white font-mono leading-tight`}>
          {totals.totalEmails}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Inbound Total</div>
      </div>

      <div>
        <div className={`${isLarge ? 'text-base' : 'text-sm'} font-bold text-rose-600 dark:text-rose-400 font-mono leading-tight`}>
          {totals.malicious}
        </div>
        <div className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-0.5">Malicious</div>
      </div>

      <div>
        <div className={`${isLarge ? 'text-base' : 'text-sm'} font-bold text-amber-600 dark:text-amber-400 font-mono leading-tight`}>
          {totals.suspicious}
        </div>
        <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">Suspicious</div>
      </div>

      <div>
        <div className={`${isLarge ? 'text-base' : 'text-sm'} font-bold text-emerald-600 dark:text-emerald-400 font-mono leading-tight`}>
          {totals.autoCleared}
        </div>
        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Auto-Mitigated</div>
      </div>
    </div>
  );

  return (
    <>
      {/* 
        Standard Collapsed Card 
        Hidden/invisible when expanded view is active.
      */}
      <div
        id="defender-email-volume-card"
        className={`bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between select-none transition-all ${
          isExpanded ? 'invisible pointer-events-none' : ''
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {renderHeader(false)}
          <div ref={containerRef} className="flex-1 flex flex-col justify-center min-h-[220px] my-2">
            {renderChartCanvas(standardGeom, svgRef, false)}
          </div>
        </div>
        {renderBottomSummary(false)}
      </div>

      {/* 
        Fullscreen / Expanded View Modal with Smooth Animations & Blurred Backdrop
      */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8">
            {/* Semi-transparent blurred backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-md cursor-pointer"
              onClick={() => setIsExpanded(false)}
              aria-hidden="true"
            />

            {/* Centered Expanded Telemetry Card */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Inbound Flow and Threat Telemetry Detail"
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative z-10 w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-5 sm:p-7 flex flex-col justify-between select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Close Control Bar */}
              <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                    Interactive SOC Telemetry Inspector
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                    ESC to close
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                {renderHeader(true)}
                <div ref={expandedContainerRef} className="mt-3">
                  {renderChartCanvas(expandedGeom, expandedSvgRef, true)}
                </div>
                {renderKpiRibbon(true)}
              </div>

              {/* Enhanced Expanded Correlation & Mitigation Insights */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-50/80 dark:bg-[#090e1a]/80 border border-slate-200/60 dark:border-slate-800/80">
                  <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                    <span>Active Incident Correlation (MDO Rule #9041)</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[10.5px] leading-relaxed">
                    Correlated spike detected in financial lure credential attacks. Automated remediation (ZAP & Quarantined) mitigated 94% of malicious deliveries before user interaction.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50/80 dark:bg-[#090e1a]/80 border border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between">
                  <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-sky-500" />
                      <span>Zero-Hour Auto Purge Status</span>
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold text-[10px]">HEALTHY</span>
                  </div>
                  <div className="flex items-center justify-between text-[10.5px] text-slate-500 dark:text-slate-400 mt-1">
                    <span>Mean Time to Detect (MTTD): <strong className="text-slate-700 dark:text-slate-200 font-mono">1.2s</strong></span>
                    <span>Mean Time to Remediate: <strong className="text-slate-700 dark:text-slate-200 font-mono">4.8s</strong></span>
                  </div>
                </div>
              </div>

              {renderBottomSummary(true)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
