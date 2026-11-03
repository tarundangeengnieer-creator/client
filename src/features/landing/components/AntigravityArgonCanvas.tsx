import React, { useEffect, useRef } from 'react';

interface Particle {
  u: number; // Angle around primary circle
  v: number; // Angle around torus tube
  uSpeed: number;
  vSpeed: number;
  size: number;
  baseColor: 'cyan' | 'argon-violet' | 'white' | 'electric-blue';
  pulsePhase: number;
  pulseSpeed: number;
  dispWeight: number;
}

interface CyberNode {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  label: string;
  sublabel: string;
  size: number;
  pulse: number;
}

export const AntigravityArgonCanvas: React.FC<{
  className?: string;
  focusX?: number; // 0 to 1 relative horizontal center offset (defaults to ~0.65 for product mockup)
}> = ({ className = '', focusX = 0.65 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Motion preference check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse coordinates relative to canvas center
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      active: false,
    };

    // Responsive sizing
    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = (e.clientX - rect.left) - width * focusX;
      mouse.targetY = (e.clientY - rect.top) - height * 0.5;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    // Initialize 3D Torus Particles (Antigravity-inspired gravitational ring)
    const PARTICLE_COUNT = width < 768 ? 160 : 280;
    const particles: Particle[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const colorRoll = Math.random();
      let baseColor: Particle['baseColor'] = 'cyan';
      if (colorRoll < 0.45) baseColor = 'cyan'; // Argon noble gas cyan
      else if (colorRoll < 0.8) baseColor = 'argon-violet'; // Deep electric violet
      else if (colorRoll < 0.95) baseColor = 'electric-blue';
      else baseColor = 'white';

      particles.push({
        u: Math.random() * Math.PI * 2,
        v: Math.random() * Math.PI * 2,
        uSpeed: (Math.random() * 0.003 + 0.0015) * (Math.random() > 0.5 ? 1 : -1),
        vSpeed: (Math.random() * 0.006 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 1.8 + 1.2,
        baseColor,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        dispWeight: Math.random() * 0.6 + 0.7,
      });
    }

    // Floating Cyber Telemetry Nodes (Forensic graph coordinates in space)
    const cyberNodes: CyberNode[] = [
      { x: -320, y: -160, z: -80, vx: 0.12, vy: -0.08, vz: 0.05, label: 'NODE-01 // 185.234.21.9', sublabel: 'ORIGIN RELAY', size: 3.5, pulse: 0 },
      { x: 340, y: -220, z: 60, vx: -0.09, vy: 0.11, vz: -0.04, label: 'GEMINI-4 // ARGON', sublabel: 'CORRELATION ENGINE', size: 4.2, pulse: 1.2 },
      { x: -380, y: 190, z: 120, vx: 0.08, vy: 0.07, vz: -0.06, label: 'ENT:05 // CLUSTER', sublabel: 'GRAPH ENTITY', size: 3.2, pulse: 2.5 },
      { x: 390, y: 160, z: -100, vx: -0.07, vy: -0.1, vz: 0.04, label: 'DNS // REPUTATION', sublabel: 'ZONE MATCH', size: 3.8, pulse: 3.8 },
      { x: 20, y: -280, z: -150, vx: 0.06, vy: 0.05, vz: 0.08, label: 'TRACE // DMARC.FAIL', sublabel: 'AUTH POLICY', size: 3.0, pulse: 4.6 },
      { x: -140, y: 260, z: 40, vx: -0.11, vy: -0.04, vz: 0.02, label: 'PAYPAL.SPOOF // DETECT', sublabel: 'HOMOGLYPH PHISH', size: 3.4, pulse: 5.3 },
    ];

    let time = 0;
    let currentTiltX = 0.85; // Initial camera tilt ~50 degrees for scenic ring horizon
    let currentTiltY = 0.25;

    // Render loop
    const render = () => {
      time += prefersReducedMotion ? 0.003 : 0.014;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      const targetTiltX = 0.9 + (mouse.y / height) * 0.35;
      const targetTiltY = 0.2 + (mouse.x / width) * 0.45;

      currentTiltX += (targetTiltX - currentTiltX) * 0.04;
      currentTiltY += (targetTiltY - currentTiltY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // Center point for 3D projection
      const cx = width > 1024 ? width * focusX : width * 0.5;
      const cy = height * 0.5;

      // ─── 1. NOBLE-GAS ARGON DIFFUSE BACKDROP HALO ─────────────────────────────
      // Cyan-blue central core
      const coreAura = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.min(width * 0.45, 480));
      coreAura.addColorStop(0, 'rgba(0, 229, 255, 0.12)'); // Radiant Argon Cyan
      coreAura.addColorStop(0.35, 'rgba(24, 191, 255, 0.06)');
      coreAura.addColorStop(0.7, 'rgba(99, 102, 241, 0.03)'); // Noble Argon Violet edge
      coreAura.addColorStop(1, 'transparent');

      ctx.fillStyle = coreAura;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(width * 0.45, 480), 0, Math.PI * 2);
      ctx.fill();

      // Deep Argon violet secondary reflection
      const violetAura = ctx.createRadialGradient(cx + 80, cy - 40, 0, cx + 80, cy - 40, 360);
      violetAura.addColorStop(0, 'rgba(124, 58, 237, 0.08)');
      violetAura.addColorStop(0.5, 'rgba(99, 102, 241, 0.025)');
      violetAura.addColorStop(1, 'transparent');

      ctx.fillStyle = violetAura;
      ctx.beginPath();
      ctx.arc(cx + 80, cy - 40, 360, 0, Math.PI * 2);
      ctx.fill();

      // ─── 2. 3D TORUS PARTICLE COMPUTATION ────────────────────────────────────
      const majorRadius = Math.min(width * 0.28, 300); // R: Distance from center of tube to center of torus
      const minorRadius = Math.min(width * 0.09, 85);  // r: Radius of tube
      const focalLength = 550;

      // Cosine and Sine transforms for rotation matrices
      const cosX = Math.cos(currentTiltX);
      const sinX = Math.sin(currentTiltX);
      const cosY = Math.cos(currentTiltY);
      const sinY = Math.sin(currentTiltY);

      // Collect projected particles to sort by Z depth for correct alpha blending
      interface ProjectedPoint {
        x: number;
        y: number;
        z: number;
        scale: number;
        radius: number;
        color: string;
        glowColor: string;
        alpha: number;
      }

      const projected: ProjectedPoint[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.u += p.uSpeed;
          p.v += p.vSpeed;
          p.pulsePhase += p.pulseSpeed;
        }

        // Gravitational displacement wave (like Antigravity's undulating particle ring)
        const displacement =
          Math.sin(p.u * 3 + time * 1.4) *
          Math.cos(p.v * 2 + time * 0.9) *
          24 * p.dispWeight;

        const effectiveMinor = minorRadius + displacement;

        // Torus 3D coordinate math
        const x0 = (majorRadius + effectiveMinor * Math.cos(p.v)) * Math.cos(p.u);
        const y0 = (majorRadius + effectiveMinor * Math.cos(p.v)) * Math.sin(p.u);
        const z0 = effectiveMinor * Math.sin(p.v);

        // Rotation around X (pitch tilt)
        const y1 = y0 * cosX - z0 * sinX;
        const z1 = y0 * sinX + z0 * cosX;

        // Rotation around Y (yaw spin)
        const x2 = x0 * cosY + z1 * sinY;
        const z2 = -x0 * sinY + z1 * cosY;
        const y2 = y1;

        // 3D Perspective Projection
        const zCamera = z2 + focalLength;
        if (zCamera <= 50) continue;

        const scale = focalLength / zCamera;
        const projX = cx + x2 * scale;
        const projY = cy + y2 * scale;

        // Depth-based opacity & size
        const depthFactor = (z2 + minorRadius * 2) / (minorRadius * 4); // 0 (far) to 1 (near)
        const clampedDepth = Math.max(0.1, Math.min(1, depthFactor));

        const pulse = 0.85 + Math.sin(p.pulsePhase) * 0.15;
        const alpha = (0.2 + clampedDepth * 0.65) * pulse;
        const radius = Math.max(0.8, p.size * scale * (0.8 + clampedDepth * 0.5));

        let color = `rgba(0, 229, 255, ${alpha.toFixed(3)})`;
        let glowColor = 'rgba(0, 229, 255, 0.4)';

        if (p.baseColor === 'argon-violet') {
          color = `rgba(167, 139, 250, ${(alpha * 0.9).toFixed(3)})`;
          glowColor = 'rgba(139, 92, 246, 0.4)';
        } else if (p.baseColor === 'electric-blue') {
          color = `rgba(56, 189, 248, ${alpha.toFixed(3)})`;
          glowColor = 'rgba(24, 191, 255, 0.4)';
        } else if (p.baseColor === 'white') {
          color = `rgba(255, 255, 255, ${(alpha * 1.1).toFixed(3)})`;
          glowColor = 'rgba(255, 255, 255, 0.5)';
        }

        projected.push({
          x: projX,
          y: projY,
          z: z2,
          scale,
          radius,
          color,
          glowColor,
          alpha,
        });
      }

      // Sort by Z depth so back particles are drawn first
      projected.sort((a, b) => a.z - b.z);

      // Render Torus Particles
      for (let i = 0; i < projected.length; i++) {
        const pt = projected[i];

        // Draw outer glow for near particles
        if (pt.scale > 1.05 && pt.radius > 1.8) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = pt.glowColor;
          ctx.fill();
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.fill();
      }

      // ─── 3. FLOATING CYBER TELEMETRY NODES ────────────────────────────────────
      const projectedNodes: { x: number; y: number; z: number; scale: number; node: CyberNode }[] = [];

      for (let i = 0; i < cyberNodes.length; i++) {
        const node = cyberNodes[i];

        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;
          node.z += node.vz;

          // Soft boundary containment
          if (node.x > 450 || node.x < -450) node.vx *= -1;
          if (node.y > 300 || node.y < -300) node.vy *= -1;
          if (node.z > 200 || node.z < -200) node.vz *= -1;

          node.pulse += 0.025;
        }

        // Apply same camera rotation to nodes for cohesive 3D parallax
        const y1 = node.y * cosX - node.z * sinX;
        const z1 = node.y * sinX + node.z * cosX;
        const x2 = node.x * cosY + z1 * sinY;
        const z2 = -node.x * sinY + z1 * cosY;
        const y2 = y1;

        const zCamera = z2 + focalLength;
        if (zCamera <= 50) continue;

        const scale = focalLength / zCamera;
        const px = cx + x2 * scale;
        const py = cy + y2 * scale;

        projectedNodes.push({ x: px, y: py, z: z2, scale, node });
      }

      // Draw faint correlation lines between proximate nodes (forensic network links)
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 4]);

      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i];
          const n2 = projectedNodes[j];
          const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);

          if (dist < 260) {
            const lineAlpha = (1 - dist / 260) * 0.22;
            ctx.strokeStyle = `rgba(0, 229, 255, ${lineAlpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      ctx.setLineDash([]); // Reset dash

      // Draw nodes and telemetry tags
      for (let i = 0; i < projectedNodes.length; i++) {
        const { x, y, scale, node } = projectedNodes[i];
        const pulse = 0.5 + Math.sin(node.pulse) * 0.5;
        const nodeRadius = Math.max(2, node.size * scale);

        // Outer pulsing ring
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius * (2.2 + pulse * 0.8), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 229, 255, ${(0.15 + pulse * 0.2).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Node center diamond / dot
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#00e5ff';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Monospace technical microcopy (only on desktop or when scale > 0.8 to avoid clutter)
        if (width >= 960 && scale > 0.75) {
          ctx.font = '500 9px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
          ctx.fillStyle = 'rgba(148, 163, 184, 0.75)'; // slate-400
          ctx.fillText(node.label, x + nodeRadius + 8, y + 3);

          ctx.font = '700 7.5px Inter, system-ui, sans-serif';
          ctx.fillStyle = 'rgba(56, 189, 248, 0.6)'; // sky-400
          ctx.fillText(node.sublabel, x + nodeRadius + 8, y + 13);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [focusX]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          maskImage: 'radial-gradient(ellipse 95% 85% at 55% 50%, black 50%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 95% 85% at 55% 50%, black 50%, transparent 100%)',
        }}
      />
    </div>
  );
};
