import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

// ─── Semantic Threat Node Definitions ──────────────────────────────────────────

export interface ThreatNodeData {
  id: string;
  name: string;
  category: 'malicious' | 'suspicious' | 'analysis' | 'neutral';
  classification: string;
  details: string;
  coords: [number, number, number];
  colorHex: string;
}

const THREAT_NODES: ThreatNodeData[] = [
  // Red: Confirmed Malicious Indicators
  {
    id: 'mal-1',
    name: 'C2 Payload Origin',
    category: 'malicious',
    classification: 'Confirmed Threat Vector',
    details: 'IP 185.220.101.42 · Known APT29 Dropper Host',
    coords: [4.2, 1.8, -1.2],
    colorHex: '#FF4D5A',
  },
  {
    id: 'mal-2',
    name: 'Credential Harvester',
    category: 'malicious',
    classification: 'Active Phishing URL',
    details: 'auth-microsoft-sso-verify.cc · Zero-day Domain',
    coords: [-4.8, -1.4, 2.0],
    colorHex: '#FF4D5A',
  },

  // Amber: Suspicious Indicators
  {
    id: 'susp-1',
    name: 'Anomalous Relaying Hop',
    category: 'suspicious',
    classification: 'Header Anomaly',
    details: 'MTA Hop #3 Delay 8.4s · ASN Mismatch (AS13335)',
    coords: [2.5, -2.8, -0.8],
    colorHex: '#F5A623',
  },
  {
    id: 'susp-2',
    name: 'Lookalike Sender Domain',
    category: 'suspicious',
    classification: 'Homoglyph Phish',
    details: 'micros0ft-support.com · Cyrillic Unicode Inject',
    coords: [-3.2, 2.4, -1.5],
    colorHex: '#F5A623',
  },
  {
    id: 'susp-3',
    name: 'Nested Archive Payload',
    category: 'suspicious',
    classification: 'Evasion Technique',
    details: 'invoice_march.pdf.iso · Double Extension Cloak',
    coords: [5.8, -0.6, 1.6],
    colorHex: '#F5A623',
  },

  // Cyan: Active Intelligence Analysis & Correlation
  {
    id: 'ana-1',
    name: 'SPF / DKIM Cryptographic Check',
    category: 'analysis',
    classification: 'Authentication Verification',
    details: 'DKIM-Signature RSA-SHA256 · Fail (Body Altered)',
    coords: [0.0, 3.2, 0.5],
    colorHex: '#08B4ED',
  },
  {
    id: 'ana-2',
    name: 'DMARC Enforcement Engine',
    category: 'analysis',
    classification: 'Policy Alignment',
    details: 'p=reject · Subdomain Strict Isolation Match',
    coords: [1.8, 1.2, 2.4],
    colorHex: '#39CFFF',
  },
  {
    id: 'ana-3',
    name: 'IP Geolocation Correlator',
    category: 'analysis',
    classification: 'Spatial Telemetry',
    details: 'GeoIP: St. Petersburg (RU) -> Bypassed US Gateway',
    coords: [-2.1, 0.4, 3.0],
    colorHex: '#08B4ED',
  },
  {
    id: 'ana-4',
    name: 'NLP Lexical Threat Scoring',
    category: 'analysis',
    classification: 'Urgency & BEC Detection',
    details: 'Wire Transfer Urgency Index: 0.94 (Extreme Risk)',
    coords: [3.4, -1.8, 3.2],
    colorHex: '#39CFFF',
  },
  {
    id: 'ana-5',
    name: 'Header Hop Graph Reconstruction',
    category: 'analysis',
    classification: 'Forensic Pathway',
    details: '5 Relays Trace: Internal Exchange -> Cloudflare',
    coords: [-1.4, -2.6, 1.2],
    colorHex: '#08B4ED',
  },

  // Silver: Neutral Forensic Records
  {
    id: 'neu-1',
    name: 'MX Record Verification',
    category: 'neutral',
    classification: 'Forensic Baseline',
    details: 'mail.protection.outlook.com · Priority 10',
    coords: [-5.4, 0.8, -2.2],
    colorHex: '#BFC9D5',
  },
  {
    id: 'neu-2',
    name: 'Reverse DNS Pointer',
    category: 'neutral',
    classification: 'Neutral Infrastructure',
    details: 'PTR: out-relay-19.internal.corp · Verified Clean',
    coords: [-0.8, -3.5, -1.8],
    colorHex: '#AAB8C8',
  },
  {
    id: 'neu-3',
    name: 'Client TLS Cipher Audit',
    category: 'neutral',
    classification: 'Encryption Protocol',
    details: 'TLS 1.3 / ECDHE-RSA-AES256-GCM-SHA384 Valid',
    coords: [3.6, 3.0, -2.5],
    colorHex: '#D5DEE8',
  },
  {
    id: 'neu-4',
    name: 'Evidence Hash Chain',
    category: 'neutral',
    classification: 'Chain of Custody',
    details: 'SHA-256 Digest Sealed · RFC 3161 Timestamped',
    coords: [-3.8, -2.2, -2.0],
    colorHex: '#BFC9D5',
  },
];

// Connection topology (indexes into THREAT_NODES)
const THREAT_CONNECTIONS: [number, number][] = [
  [0, 2], // C2 Origin -> Anomalous Hop
  [0, 5], // C2 Origin -> SPF Check
  [1, 3], // Phishing URL -> Lookalike Domain
  [1, 7], // Phishing URL -> GeoIP Correlator
  [2, 9], // Anomalous Hop -> Header Graph
  [3, 5], // Lookalike Domain -> SPF Check
  [4, 8], // Nested Archive -> NLP Threat Scoring
  [5, 6], // SPF Check -> DMARC Engine
  [6, 8], // DMARC Engine -> NLP Threat Scoring
  [7, 9], // GeoIP Correlator -> Header Graph
  [10, 5], // MX Record -> SPF Check
  [11, 2], // Reverse DNS -> Anomalous Hop
  [12, 0], // TLS Audit -> C2 Origin
  [13, 9], // Evidence Hash -> Header Graph
  [6, 4], // DMARC -> Nested Archive
  [7, 1], // GeoIP -> Phishing URL
];

// ─── Procedural Binary Glyph Texture Atlas ─────────────────────────────────────

function createBinaryAtlas(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, 256, 128);

  // Left half: '0'
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 86px "JetBrains Mono", "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('0', 64, 68);

  // Right half: '1'
  ctx.fillText('1', 192, 68);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// ─── Binary Particle Shaders ──────────────────────────────────────────────────

const binaryVertexShader = `
  uniform float uTime;
  uniform float uSwapSpeed;

  attribute float aDigit;
  attribute float aNextDigit;
  attribute float aTransition;
  attribute vec3 aColor;
  attribute vec3 aTargetColor;
  attribute float aPulse;
  attribute float aScale;

  varying vec2 vUv;
  varying vec3 vColor;
  varying float vDigit;
  varying float vNextDigit;
  varying float vTransition;
  varying float vPulse;

  void main() {
    vUv = uv;
    vDigit = aDigit;
    vNextDigit = aNextDigit;
    vTransition = aTransition;
    vPulse = aPulse;

    // Instance world/local position
    vec4 instPos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);

    // Smooth continuous spatial wave phase across the orbital universe
    float spatialPhase = atan(instPos.y, instPos.x) * 0.6 + length(instPos.xyz) * 0.08;

    // Harmonic smooth color swapping wave oscillating between 0.0 and 1.0
    // When swapWave = 0.0: '0' is Silver, '1' is Cyan
    // When swapWave = 1.0: '0' is Cyan, '1' is Silver (swapped!)
    float swapWave = 0.5 + 0.5 * sin(uTime * uSwapSpeed + spatialPhase);

    // AShieldER Metallic Silver and Electric Cyan palettes
    vec3 colSilver = vec3(0.68, 0.74, 0.82); // #AAB8C8 - Neutral data
    vec3 colCyan   = vec3(0.04, 0.71, 0.94); // #08B4ED - Active cyber intelligence

    // Color for digit '0': smoothly swaps between Silver and Cyan
    vec3 c0 = mix(colSilver, colCyan, swapWave);
    // Color for digit '1': smoothly swaps between Cyan and Silver
    vec3 c1 = mix(colCyan, colSilver, swapWave);

    // Blend based on effective digit (including individual particle switch transitions)
    float effectiveDigit = mix(aDigit, aNextDigit, aTransition);
    vColor = mix(c0, c1, effectiveDigit);

    // Camera-facing billboard from instance position
    vec4 mvPosition = modelViewMatrix * instPos;
    mvPosition.xy += position.xy * aScale;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const binaryFragmentShader = `
  uniform sampler2D uAtlas;
  varying vec2 vUv;
  varying vec3 vColor;
  varying float vDigit;
  varying float vNextDigit;
  varying float vTransition;
  varying float vPulse;

  void main() {
    vec2 uv0 = vec2(vUv.x * 0.5, vUv.y);
    vec2 uv1 = vec2(0.5 + vUv.x * 0.5, vUv.y);

    float alpha0 = texture2D(uAtlas, uv0).a;
    float alpha1 = texture2D(uAtlas, uv1).a;

    float currentAlpha = mix(alpha0, alpha1, vDigit);
    float targetAlpha = mix(alpha0, alpha1, vNextDigit);
    float finalAlpha = mix(currentAlpha, targetAlpha, vTransition);

    if (finalAlpha < 0.05) discard;

    // Luminous pulse boost during active switch
    vec3 outColor = vColor * (1.0 + vPulse * 1.6);
    gl_FragColor = vec4(outColor, finalAlpha * 0.92);
  }
`;

// ─── Component Props ──────────────────────────────────────────────────────────

interface ThreatUniverse3DProps {
  className?: string;
  onNodeHover?: (node: ThreatNodeData | null) => void;
}

export const ThreatUniverse3D: React.FC<ThreatUniverse3DProps> = ({
  className = '',
  onNodeHover,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeNode, setActiveNode] = useState<ThreatNodeData | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  // Keep a stable ref for callback
  const onNodeHoverRef = useRef(onNodeHover);
  useEffect(() => {
    onNodeHoverRef.current = onNodeHover;
  }, [onNodeHover]);

  const handleNodeChange = useCallback((node: ThreatNodeData | null) => {
    setActiveNode(node);
    if (onNodeHoverRef.current) {
      onNodeHoverRef.current(node);
    }
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL or WebGL support
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // Prefers reduced motion check
    const prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060a14, 0.035);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setIsSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    // Root orbital group for parallax and cinematic tilt
    const orbitalUniverse = new THREE.Group();
    // Offset slightly to center the composition naturally behind hero typography & product
    orbitalUniverse.position.set(1.5, 0.2, 0);
    scene.add(orbitalUniverse);

    // ─── 1. Central Intelligent Threat-Analysis Nucleus ───────────────────────
    const nucleusGroup = new THREE.Group();
    orbitalUniverse.add(nucleusGroup);

    // Inner Glowing Core Sphere
    const coreGeo = new THREE.SphereGeometry(0.85, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x08b4ed,
      transparent: true,
      opacity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    nucleusGroup.add(coreMesh);

    // Noble-gas Argon Halo Aura
    const auraGeo = new THREE.SphereGeometry(1.25, 24, 24);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x18bfff,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    nucleusGroup.add(auraMesh);

    // Geodesic 3D analysis cage
    const cageGeo = new THREE.IcosahedronGeometry(1.65, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x39cfff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    nucleusGroup.add(cageMesh);

    // Concentric Orbital Gimbal Rings
    const ringGeo1 = new THREE.TorusGeometry(2.2, 0.015, 8, 80);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x08b4ed,
      transparent: true,
      opacity: 0.35,
    });
    const gimbalRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    gimbalRing1.rotation.x = Math.PI / 3;
    nucleusGroup.add(gimbalRing1);

    const ringGeo2 = new THREE.TorusGeometry(2.8, 0.012, 8, 80);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xbfc9d5,
      transparent: true,
      opacity: 0.25,
    });
    const gimbalRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    gimbalRing2.rotation.y = Math.PI / 4;
    nucleusGroup.add(gimbalRing2);

    // ─── 2. Orbital Guideline Rings ──────────────────────────────────────────
    const orbitPathGroup = new THREE.Group();
    orbitalUniverse.add(orbitPathGroup);

    const createOrbitLine = (radiusX: number, radiusY: number, rotX: number, rotY: number, color: number, opacity: number) => {
      const curve = new THREE.EllipseCurve(0, 0, radiusX, radiusY, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(100);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
      });
      const ellipse = new THREE.Line(geometry, material);
      ellipse.rotation.x = rotX;
      ellipse.rotation.y = rotY;
      orbitPathGroup.add(ellipse);
      return ellipse;
    };

    // Multiple inclined orbital paths
    createOrbitLine(5.5, 5.0, 0.3, 0.2, 0x08b4ed, 0.2);
    createOrbitLine(8.8, 6.4, -0.4, 0.3, 0x39cfff, 0.18);
    createOrbitLine(12.5, 10.5, 0.5, -0.25, 0xbfc9d5, 0.12);
    createOrbitLine(7.8, 7.8, 1.1, 0.4, 0xf5a623, 0.12);

    // ─── 3. Floating Binary Particle System (0 and 1) ─────────────────────────
    const isMobile = width < 768;
    const PARTICLE_COUNT = isMobile ? 48 : 110;

    const atlasTexture = createBinaryAtlas();
    const planeGeo = new THREE.PlaneGeometry(0.5, 0.5);

    // Colors
    const COLOR_SILVER = new THREE.Color('#AAB8C8');
    const COLOR_SILVER_LIGHT = new THREE.Color('#D5DEE8');
    const COLOR_CYAN = new THREE.Color('#08B4ED');
    const COLOR_CYAN_ELECTRIC = new THREE.Color('#39CFFF');

    // Shader Material for Billboard InstancedMesh
    const binaryMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uAtlas: { value: atlasTexture },
        uTime: { value: 0 },
        uSwapSpeed: { value: 0.75 },
      },
      vertexShader: binaryVertexShader,
      fragmentShader: binaryFragmentShader,
      transparent: true,
      depthWrite: false,
    });

    const binaryInstancedMesh = new THREE.InstancedMesh(planeGeo, binaryMaterial, PARTICLE_COUNT);
    binaryInstancedMesh.frustumCulled = false;
    orbitalUniverse.add(binaryInstancedMesh);

    // Particle Data Models
    interface ParticleData {
      orbitTrack: number;
      semiMajor: number;
      semiMinor: number;
      inclinationX: number;
      inclinationY: number;
      inclinationZ: number;
      angle: number;
      angularSpeed: number;
      depthOffset: number;
      currentPos: THREE.Vector3;
      velocity: THREE.Vector3;
      digit: number;
      targetDigit: number;
      transition: number;
      transitionSpeed: number;
      switchTimer: number;
      color: THREE.Color;
      targetColor: THREE.Color;
      pulse: number;
      scale: number;
    }

    const particles: ParticleData[] = [];
    const aDigitArr = new Float32Array(PARTICLE_COUNT);
    const aNextDigitArr = new Float32Array(PARTICLE_COUNT);
    const aTransitionArr = new Float32Array(PARTICLE_COUNT);
    const aColorArr = new Float32Array(PARTICLE_COUNT * 3);
    const aTargetColorArr = new Float32Array(PARTICLE_COUNT * 3);
    const aPulseArr = new Float32Array(PARTICLE_COUNT);
    const aScaleArr = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const track = i % 4;
      let semiMajor = 5.5;
      let semiMinor = 5.0;
      let incX = 0.3;
      let incY = 0.2;
      let incZ = 0.1;
      let speed = 0.25;

      if (track === 0) {
        // Inner fast track
        semiMajor = 4.8 + Math.random() * 1.5;
        semiMinor = 4.2 + Math.random() * 1.2;
        incX = 0.28;
        incY = 0.22;
        incZ = -0.15;
        speed = 0.32 + Math.random() * 0.12;
      } else if (track === 1) {
        // Middle counter-clockwise track
        semiMajor = 8.2 + Math.random() * 2.0;
        semiMinor = 6.2 + Math.random() * 1.5;
        incX = -0.38;
        incY = 0.32;
        incZ = 0.2;
        speed = -(0.22 + Math.random() * 0.08);
      } else if (track === 2) {
        // Outer halo track
        semiMajor = 12.0 + Math.random() * 2.5;
        semiMinor = 10.0 + Math.random() * 2.0;
        incX = 0.48;
        incY = -0.28;
        incZ = 0.35;
        speed = 0.14 + Math.random() * 0.06;
      } else {
        // Transversal inclined cross path
        semiMajor = 7.5 + Math.random() * 1.8;
        semiMinor = 7.0 + Math.random() * 1.4;
        incX = 1.05;
        incY = 0.42;
        incZ = -0.5;
        speed = -(0.26 + Math.random() * 0.1);
      }

      const initialDigit = Math.random() > 0.48 ? 1 : 0;
      const initialColor =
        initialDigit === 1
          ? Math.random() > 0.5
            ? COLOR_CYAN
            : COLOR_CYAN_ELECTRIC
          : Math.random() > 0.5
          ? COLOR_SILVER
          : COLOR_SILVER_LIGHT;

      const p: ParticleData = {
        orbitTrack: track,
        semiMajor,
        semiMinor,
        inclinationX: incX,
        inclinationY: incY,
        inclinationZ: incZ,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: speed,
        depthOffset: (Math.random() - 0.5) * 1.2,
        currentPos: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        digit: initialDigit,
        targetDigit: initialDigit,
        transition: 0.0,
        transitionSpeed: 1.8 + Math.random() * 1.4,
        switchTimer: 1.5 + Math.random() * 7.0, // Staggered start, no sync
        color: initialColor.clone(),
        targetColor: initialColor.clone(),
        pulse: 0.0,
        scale: 0.75 + Math.random() * 0.55,
      };

      particles.push(p);

      aDigitArr[i] = p.digit;
      aNextDigitArr[i] = p.targetDigit;
      aTransitionArr[i] = 0;
      aColorArr[i * 3 + 0] = p.color.r;
      aColorArr[i * 3 + 1] = p.color.g;
      aColorArr[i * 3 + 2] = p.color.b;
      aTargetColorArr[i * 3 + 0] = p.targetColor.r;
      aTargetColorArr[i * 3 + 1] = p.targetColor.g;
      aTargetColorArr[i * 3 + 2] = p.targetColor.b;
      aPulseArr[i] = 0;
      aScaleArr[i] = p.scale;
    }

    const aDigitAttr = new THREE.InstancedBufferAttribute(aDigitArr, 1);
    const aNextDigitAttr = new THREE.InstancedBufferAttribute(aNextDigitArr, 1);
    const aTransitionAttr = new THREE.InstancedBufferAttribute(aTransitionArr, 1);
    const aColorAttr = new THREE.InstancedBufferAttribute(aColorArr, 3);
    const aTargetColorAttr = new THREE.InstancedBufferAttribute(aTargetColorArr, 3);
    const aPulseAttr = new THREE.InstancedBufferAttribute(aPulseArr, 1);
    const aScaleAttr = new THREE.InstancedBufferAttribute(aScaleArr, 1);

    planeGeo.setAttribute('aDigit', aDigitAttr);
    planeGeo.setAttribute('aNextDigit', aNextDigitAttr);
    planeGeo.setAttribute('aTransition', aTransitionAttr);
    planeGeo.setAttribute('aColor', aColorAttr);
    planeGeo.setAttribute('aTargetColor', aTargetColorAttr);
    planeGeo.setAttribute('aPulse', aPulseAttr);
    planeGeo.setAttribute('aScale', aScaleAttr);

    // ─── 4. Suspended Digital Forensic Micro-Dust Particles ──────────────────
    const DUST_COUNT = isMobile ? 60 : 180;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(DUST_COUNT * 3);
    const dustColors = new Float32Array(DUST_COUNT * 3);

    for (let i = 0; i < DUST_COUNT; i++) {
      const radius = 3.0 + Math.random() * 14.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.7;

      dustPos[i * 3 + 0] = radius * Math.cos(theta) * Math.cos(phi);
      dustPos[i * 3 + 1] = radius * Math.sin(phi);
      dustPos[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const isCyan = Math.random() > 0.4;
      const c = isCyan ? COLOR_CYAN : COLOR_SILVER;
      dustColors[i * 3 + 0] = c.r;
      dustColors[i * 3 + 1] = c.g;
      dustColors[i * 3 + 2] = c.b;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    orbitalUniverse.add(dustParticles);

    // ─── 5. Threat Intelligence Nodes & Connecting Paths ──────────────────────
    const threatGroup = new THREE.Group();
    orbitalUniverse.add(threatGroup);

    // Meshes for raycasting and visual rendering
    const nodeMeshes: THREE.Mesh[] = [];
    const nodeGeos: THREE.BufferGeometry[] = [];
    const nodeMats: THREE.Material[] = [];

    THREAT_NODES.forEach((nodeData, idx) => {
      const nodeSubGroup = new THREE.Group();
      nodeSubGroup.position.set(...nodeData.coords);

      const color = new THREE.Color(nodeData.colorHex);

      // Core geometric body (octahedron)
      const octGeo = new THREE.OctahedronGeometry(0.28, 0);
      nodeGeos.push(octGeo);
      const octMat = new THREE.MeshBasicMaterial({
        color,
        wireframe: false,
      });
      nodeMats.push(octMat);
      const octMesh = new THREE.Mesh(octGeo, octMat);
      octMesh.userData = { index: idx, nodeData };
      nodeMeshes.push(octMesh);
      nodeSubGroup.add(octMesh);

      // Delicate wireframe beacon ring around the node
      const ringG = new THREE.RingGeometry(0.38, 0.44, 16);
      nodeGeos.push(ringG);
      const ringM = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      nodeMats.push(ringM);
      const ringMesh = new THREE.Mesh(ringG, ringM);
      ringMesh.rotation.x = Math.PI / 2;
      nodeSubGroup.add(ringMesh);

      threatGroup.add(nodeSubGroup);
    });

    // Connecting paths between threat intelligence nodes
    const linePositions: number[] = [];
    const lineColors: number[] = [];

    THREAT_CONNECTIONS.forEach(([fromIdx, toIdx]) => {
      const from = THREAT_NODES[fromIdx];
      const to = THREAT_NODES[toIdx];
      linePositions.push(...from.coords, ...to.coords);

      const cFrom = new THREE.Color(from.colorHex);
      const cTo = new THREE.Color(to.colorHex);
      lineColors.push(cFrom.r, cFrom.g, cFrom.b, cTo.r, cTo.g, cTo.b);
    });

    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    linesGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    const linesMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
    });
    const connectionLines = new THREE.LineSegments(linesGeo, linesMat);
    threatGroup.add(connectionLines);

    // Traveling Data Packets along Intelligence Paths
    const PACKET_COUNT = 8;
    const packetGeo = new THREE.SphereGeometry(0.09, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0x39cfff,
      transparent: true,
      opacity: 0.95,
    });
    const packetMeshes: {
      mesh: THREE.Mesh;
      edgeIdx: number;
      progress: number;
      speed: number;
    }[] = [];

    for (let i = 0; i < PACKET_COUNT; i++) {
      const edgeIdx = i % THREAT_CONNECTIONS.length;
      const mesh = new THREE.Mesh(packetGeo, packetMat);
      threatGroup.add(mesh);
      packetMeshes.push({
        mesh,
        edgeIdx,
        progress: Math.random(),
        speed: 0.25 + Math.random() * 0.35,
      });
    }

    // ─── 6. Mouse Interaction, Raycasting & Parallax ──────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouseNorm = new THREE.Vector2(-999, -999);
    const targetParallax = new THREE.Vector2(0, 0);
    const currentParallax = new THREE.Vector2(0, 0);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      mouseNorm.set(x, y);

      if (!prefersReducedMotion && !isMobile) {
        targetParallax.x = x * 0.4;
        targetParallax.y = y * 0.25;
      }
    };

    const handlePointerLeave = () => {
      mouseNorm.set(-999, -999);
      targetParallax.set(0, 0);
      handleNodeChange(null);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave);

    // ─── 7. Main Cinematic Animation Loop ────────────────────────────────────
    let animationFrameId: number;
    let lastTime = performance.now();

    // Reusable math temporaries outside render loop (Zero GC)
    const _dummy = new THREE.Object3D();
    const _targetPos = new THREE.Vector3();
    const _deltaVec = new THREE.Vector3();
    const _orbitQuat = new THREE.Quaternion();
    const _euler = new THREE.Euler();

    const tick = () => {
      animationFrameId = requestAnimationFrame(tick);

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const motionFactor = prefersReducedMotion ? 0.2 : 1.0;

      // Update time uniform for smooth continuous color swapping of all 0s and 1s
      binaryMaterial.uniforms.uTime.value = (now * 0.001) * motionFactor;

      // Smooth Parallax Damping
      currentParallax.x = THREE.MathUtils.damp(currentParallax.x, targetParallax.x, 3.5, dt);
      currentParallax.y = THREE.MathUtils.damp(currentParallax.y, targetParallax.y, 3.5, dt);

      orbitalUniverse.rotation.y = currentParallax.x * 0.35;
      orbitalUniverse.rotation.x = -currentParallax.y * 0.25;

      // Nucleus slow breathing and rotation
      const pulseTime = now * 0.002 * motionFactor;
      const coreScale = 1.0 + Math.sin(pulseTime * 1.5) * 0.08;
      coreMesh.scale.set(coreScale, coreScale, coreScale);

      cageMesh.rotation.x += 0.15 * dt * motionFactor;
      cageMesh.rotation.y += 0.22 * dt * motionFactor;

      gimbalRing1.rotation.z += 0.18 * dt * motionFactor;
      gimbalRing2.rotation.x -= 0.14 * dt * motionFactor;

      dustParticles.rotation.y += 0.03 * dt * motionFactor;

      // Raycasting for threat nodes
      if (!isMobile && mouseNorm.x > -900) {
        raycaster.setFromCamera(mouseNorm, camera);
        const intersects = raycaster.intersectObjects(nodeMeshes, false);

        if (intersects.length > 0) {
          const hit = intersects[0].object as THREE.Mesh;
          const hitData = hit.userData.nodeData as ThreatNodeData;
          if (activeNode?.id !== hitData.id) {
            handleNodeChange(hitData);
          }
          hit.scale.set(1.4, 1.4, 1.4);
        } else {
          if (activeNode !== null) {
            handleNodeChange(null);
          }
          nodeMeshes.forEach((m) => m.scale.set(1.0, 1.0, 1.0));
        }
      }

      // Animate Traveling Data Packets
      packetMeshes.forEach((packet) => {
        packet.progress += packet.speed * dt * motionFactor;
        if (packet.progress > 1.0) {
          packet.progress = 0;
          packet.edgeIdx = (packet.edgeIdx + 1) % THREAT_CONNECTIONS.length;
        }

        const [fromIdx, toIdx] = THREAT_CONNECTIONS[packet.edgeIdx];
        const from = THREAT_NODES[fromIdx].coords;
        const to = THREAT_NODES[toIdx].coords;

        packet.mesh.position.set(
          THREE.MathUtils.lerp(from[0], to[0], packet.progress),
          THREE.MathUtils.lerp(from[1], to[1], packet.progress),
          THREE.MathUtils.lerp(from[2], to[2], packet.progress)
        );
      });

      // Animate Binary Particles (0 and 1)
      let needsDigitUpdate = false;
      let needsTransitionUpdate = false;
      let needsColorUpdate = false;
      let needsPulseUpdate = false;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];

        // Orbit progression
        p.angle += p.angularSpeed * dt * 0.35 * motionFactor;

        // Base elliptical coordinate
        const unrotatedX = Math.cos(p.angle) * p.semiMajor;
        const unrotatedY = Math.sin(p.angle) * p.semiMinor;
        const unrotatedZ = p.depthOffset;

        _targetPos.set(unrotatedX, unrotatedY, unrotatedZ);

        // Apply 3D track inclination
        _euler.set(p.inclinationX, p.inclinationY, p.inclinationZ);
        _orbitQuat.setFromEuler(_euler);
        _targetPos.applyQuaternion(_orbitQuat);

        // Spring / Damping for displacement
        p.currentPos.x = THREE.MathUtils.damp(p.currentPos.x, _targetPos.x, 6.0, dt);
        p.currentPos.y = THREE.MathUtils.damp(p.currentPos.y, _targetPos.y, 6.0, dt);
        p.currentPos.z = THREE.MathUtils.damp(p.currentPos.z, _targetPos.z, 6.0, dt);

        _dummy.position.copy(p.currentPos);
        _dummy.updateMatrix();
        binaryInstancedMesh.setMatrixAt(i, _dummy.matrix);

        // Independent 0 <-> 1 Digit Switching Logic
        p.switchTimer -= dt;
        if (p.switchTimer <= 0) {
          // Trigger switch to opposite binary character
          const nextVal = p.digit === 0 ? 1 : 0;
          p.targetDigit = nextVal;
          p.digit = nextVal;
          p.transition = 0.0;
          p.switchTimer = 3.5 + Math.random() * 8.5; // Next switch in 3.5-12s (independent)

          // Smooth color transition
          if (nextVal === 1) {
            p.targetColor = Math.random() > 0.4 ? COLOR_CYAN : COLOR_CYAN_ELECTRIC;
          } else {
            p.targetColor = Math.random() > 0.4 ? COLOR_SILVER : COLOR_SILVER_LIGHT;
          }

          aNextDigitArr[i] = nextVal;
          aTargetColorArr[i * 3 + 0] = p.targetColor.r;
          aTargetColorArr[i * 3 + 1] = p.targetColor.g;
          aTargetColorArr[i * 3 + 2] = p.targetColor.b;

          needsDigitUpdate = true;
          needsColorUpdate = true;
        }

        // Advance transition smoothly
        if (p.transition < 1.0) {
          p.transition = Math.min(1.0, p.transition + p.transitionSpeed * dt);
          aTransitionArr[i] = p.transition;
          needsTransitionUpdate = true;

          // Organic illumination pulse bell-curve: sin(pi * t)
          p.pulse = Math.sin(Math.PI * p.transition);
          aPulseArr[i] = p.pulse;
          needsPulseUpdate = true;

          if (p.transition >= 1.0) {
            p.color.copy(p.targetColor);
            aColorArr[i * 3 + 0] = p.color.r;
            aColorArr[i * 3 + 1] = p.color.g;
            aColorArr[i * 3 + 2] = p.color.b;
            aDigitArr[i] = p.digit;
            aTransitionArr[i] = 0.0;
            p.pulse = 0.0;
            aPulseArr[i] = 0.0;
            needsColorUpdate = true;
            needsDigitUpdate = true;
          }
        }
      }

      binaryInstancedMesh.instanceMatrix.needsUpdate = true;
      if (needsDigitUpdate) {
        aDigitAttr.needsUpdate = true;
        aNextDigitAttr.needsUpdate = true;
      }
      if (needsTransitionUpdate) aTransitionAttr.needsUpdate = true;
      if (needsColorUpdate) {
        aColorAttr.needsUpdate = true;
        aTargetColorAttr.needsUpdate = true;
      }
      if (needsPulseUpdate) aPulseAttr.needsUpdate = true;

      // Render Scene
      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(tick);

    // ─── 8. Responsive Resize Handling ─────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // ─── 9. Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      resizeObserver.disconnect();

      // Dispose Geometries
      coreGeo.dispose();
      auraGeo.dispose();
      cageGeo.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      planeGeo.dispose();
      dustGeo.dispose();
      packetGeo.dispose();
      linesGeo.dispose();
      nodeGeos.forEach((g) => g.dispose());

      // Dispose Materials & Textures
      coreMat.dispose();
      auraMat.dispose();
      cageMat.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      binaryMaterial.dispose();
      dustMat.dispose();
      packetMat.dispose();
      linesMat.dispose();
      nodeMats.forEach((m) => m.dispose());
      atlasTexture.dispose();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [handleNodeChange]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full overflow-hidden select-none pointer-events-auto ${className}`}
      aria-label="Interactive 3D Threat Intelligence Universe"
    >
      {/* Fallback if WebGL fails */}
      {!isSupported && (
        <div className="absolute inset-0 bg-[#060a14] flex items-center justify-center text-xs text-slate-500 font-mono">
          Interactive Threat Universe (Hardware acceleration disabled)
        </div>
      )}

      {/* Interactive Cyber Threat Node HUD Overlay */}
      {activeNode && (
        <div
          className="absolute bottom-6 left-6 max-w-sm pointer-events-none z-20 font-mono transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
          role="status"
          aria-live="polite"
        >
          <div className="p-3.5 rounded-lg border border-sky-500/30 bg-[#071322]/90 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(8,180,237,0.15)] text-left">
            <div className="flex items-center justify-between gap-3 pb-1 border-b border-sky-500/20 mb-2">
              <span
                className="text-[10px] tracking-wider uppercase font-semibold flex items-center gap-1.5"
                style={{ color: activeNode.colorHex }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: activeNode.colorHex }}
                  aria-hidden="true"
                />
                {activeNode.classification}
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                Node ID: {activeNode.id}
              </span>
            </div>

            <h4 className="text-sm font-semibold text-white tracking-tight">
              {activeNode.name}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {activeNode.details}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
