# AShieldER — Interactive 3D Threat Intelligence Universe
## Landing Page Visual Upgrade & Forensic Implementation Plan

Interactive 3D Threat Intelligence Universe for AShieldER, an AI-powered cybersecurity platform for email threat detection, geolocation, and forensic intelligence.

---

## 1. System Architecture & Core Concept

### Creative Direction: A Living Threat Intelligence Universe
An abstract, cinematic 3D environment representing the real-time flow of digital threat intelligence.

1. **Dimensional Orbital Structure**:
   - Multiple elliptical and circular orbital formations with natural depth variations.
   - Counter-rotating orbital rings with different speeds and inclinations ($+16^\circ$, $-22^\circ$, $+38^\circ$, and transversal cross track).
   - Suspended digital forensic micro-dust particles adding atmospheric depth.

2. **Binary Particle System (0 and 1)**:
   - **0 — Metallic Silver (`#AAB8C8`, `#D5DEE8`)**: Neutral information and digital forensic baseline data.
   - **1 — Electric Cyan (`#08B4ED`, `#39CFFF`)**: Active intelligence and data processing.
   - **Independent Digit Mutation**: Binary particles independently switch between '0' and '1' using an instanced billboard shader with an organic color morph and luminous illumination pulse.
   - Staggered timers prevent synchronized blinking or aggressive flashing.

3. **Threat Intelligence Layer**:
   - 18 semantic nodes distributed across the universe:
     - **Red (`#FF4D5A`)**: Confirmed malicious indicators (C2 payload origins, credential harvesting domains).
     - **Amber (`#F5A623`)**: Suspicious indicators (anomalous relaying hops, homoglyph phishing domains, nested archive payloads).
     - **Cyan (`#08B4ED`, `#39CFFF`)**: Active intelligence processing (SPF/DKIM cryptographic checks, DMARC enforcement, IP geolocation, NLP threat scoring).
     - **Silver (`#BFC9D5`, `#AAB8C8`)**: Neutral forensic baseline data (MX verification, PTR reverse DNS, TLS cipher audits, RFC 3161 evidence hash chains).
   - Interconnecting intelligence paths rendered with subtle traveling light packets moving between correlated nodes.

4. **Central Intelligent Threat-Analysis Nucleus**:
   - Multi-layered central core with subtle breathing scale.
   - Inner glowing sphere with a noble-gas Argon aura (`#18BFFF` / `#08B4ED`).
   - Geodesic icosahedron analysis cage with metallic cyber wireframes.
   - Concentric orbital gimbal rings rotating continuously.

5. **Advanced Interaction & Responsiveness**:
   - **Cursor Parallax**: Gentle tilt and camera parallax with frame-rate independent exponential damping.
   - **Node Hover Raycasting**: Hovering over threat nodes dynamically highlights the node and reveals a forensic HUD breakdown card (`classification`, `name`, `details`, `node ID`).
   - **Performance & Mobile**: Particle count dynamically adapts for mobile/tablet; `prefers-reduced-motion` slows motion down to an ambient crawl; WebGL software fallback guard; full memory cleanup on unmount.

---

## 2. Updated Hero Section Identity & Copy

- **Eyebrow**: `AI-POWERED EMAIL THREAT INTELLIGENCE`
- **Noble-gas Argon Badge**: `Argon · Gemini 4`
- **Main Headline**: `"Every Threat Leaves a Trace."`
- **Supporting Statement**: `"Detect sophisticated email threats. Trace malicious infrastructure. Transform digital evidence into actionable intelligence."`
- **Primary CTA**: `Explore AShieldER` (Launches interactive `.eml` forensic analysis workflow)
- **Secondary CTA**: `Discover How It Works` (Smoothly scrolls to the product showcase and workflow pipeline)
- **Product Preview**: Authentic high-fidelity Threat Investigator Workspace card anchored on the right.

---

## 3. Verification & Quality Assurance

- [x] Three.js (`three` + `@types/three`) integrated with `InstancedMesh` and custom GLSL billboard shaders.
- [x] Zero-GC animation loop with pre-allocated vectors and exponential damping.
- [x] Strict WCAG text contrast maintained over the 3D canvas via radial depth scrims.
- [x] TypeScript linter (`npm run lint` / `tsc --noEmit`) passes with 0 errors.
- [x] Production build (`npm run build`) compiles cleanly without warnings.
- [x] Development server verified and running on port 3000.
