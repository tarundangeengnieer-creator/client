import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { toCanvas } from 'html-to-image';
import { apiClient } from '../../api/client.ts';

/**
 * Builds the official Evidence Manifest JSON schema requested by the user
 */
export function buildEvidenceManifestJson(d: any): Record<string, any> {
  return {
    case_id: d.metadata?.caseId,
    investigation_id: d.metadata?.investigationId,
    generated_at: new Date('2026-09-08T14:21:20Z').toISOString(),
    classification: d.executive?.verdict || 'MALICIOUS',
    risk_score: d.executive?.riskScore || '91',
    confidence: d.executive?.confidence || 'HIGH',
    primary_classification: d.executive?.threatType || 'Credential Phishing',
    analyst: d.metadata?.analystSignOff || 'ASHIELDER AI + Analyst Review',
    report_status: d.metadata?.reportStatus || 'FINAL',
    dataset_notice: d.notice || 'NOTICE: DEMO REPORT — NOT FOR REAL-WORLD EVIDENCE',
    disclaimer: d.verdictBadge,
    executive_summary: d.executive?.narrative || d.abstract,
    scope: {
      objective: d.methodology?.objective || 'Comprehensive forensic triage of inbound electronic message.',
      source: d.methodology?.source || 'Ingestion API',
      acquisition_method: d.methodology?.acquisitionMethod || 'RFC 822 raw stream capture with immediate SHA-256 cryptographic preservation.',
      pipeline: d.methodology?.scope || 'Headers, authentication alignment, URL payload redirection, attachment analysis.',
    },
    evidence: (d.evidenceRegister || []).map((item: any) => ({
      evidence_id: item.id,
      type: item.type,
      description: item.description,
      source: item.source,
      sha256_demo: item.sha256,
      acquired_at: item.acquired || new Date().toISOString(),
      status: item.status || 'Preserved',
      details: item.details || '',
    })),
    findings: (d.findings || []).map((f: any) => ({
      finding_id: f.id,
      title: f.title,
      severity: f.severity,
      observation: f.summary,
      linked_evidence: [f.ref],
    })),
    hash_manifest: (d.evidenceRegister || []).map((e: any) => ({
      artifact: e.type,
      evidence_id: e.id,
      algorithm: 'SHA-256',
      hash_value: e.sha256,
      integrity_status: 'VALID_DEMO_HASH',
    })),
    correlation: {
      weights: d.riskWeights || [],
      final_aggregate_score: d.executive?.riskScore || '91',
      verdict: d.executive?.verdict || 'MALICIOUS',
    },
    analyst_review: d.analystReview || {},
    chain_of_custody: d.custodyLog || [],
    threat_intel_indicators: d.threatIntel || [],
    recommendations: d.recommendations || [],
    limitations: d.methodology?.limitations || [],
  };
}

/**
 * Download the JSON Evidence Manifest as a browser file
 */
export function downloadEvidenceManifest(d: any): void {
  const manifestData = buildEvidenceManifestJson(d);
  const jsonString = JSON.stringify(manifestData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `ASHIELDER_Evidence_Manifest_${d.metadata?.caseId || 'CASE'}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────────────────────
//  A2 PDF EXPORT — Section-per-page architecture
//
//  A2 paper  : 420 mm × 594 mm (portrait)
//  Margins   : 12 mm each side  →  usable area 396 mm × 570 mm
//  Capture W : 1587 px  (420 mm @ 96 dpi)
//  Pixel ratio: 2 ×  (high-DPI / crisp)
//  Format    : PNG (lossless, forensic-grade)
//  Grouping  : Short sections (height < 30 % of A2 content height) are
//              stacked onto the same page with the next section until full.
//  Footer    : Repeated on every page — Case ID • Page N of N
// ─────────────────────────────────────────────────────────────────────────────

/** A2 dimensions & margins (all mm unless suffixed _PX) */
const A2_W_MM   = 420;
const A2_H_MM   = 594;
const MARGIN_MM = 12;
const CONTENT_W_MM = A2_W_MM - MARGIN_MM * 2;  // 396 mm
const CONTENT_H_MM = A2_H_MM - MARGIN_MM * 2;  // 570 mm

/** DOM pixel width for captures (420 mm @ 96 dpi ≈ 1587 px). */
const CAPTURE_W_PX = 1587;

/** Sections shorter than this fraction of a page may share the page. */
const GROUP_THRESHOLD_FRAC = 0.30;

/**
 * Draws a footer line + text on the current jsPDF page.
 */
function addPageFooter(
  pdf: any,
  caseId: string,
  pageNum: number,
  totalPages: number
): void {
  const pw = pdf.internal.pageSize.getWidth() as number;
  const ph = pdf.internal.pageSize.getHeight() as number;
  const y  = ph - MARGIN_MM + 2;

  pdf.setDrawColor(160, 160, 160);
  pdf.setLineWidth(0.25);
  pdf.line(MARGIN_MM, y, pw - MARGIN_MM, y);

  pdf.setFontSize(7);
  pdf.setTextColor(130, 130, 130);
  pdf.text(
    `ASHIELDER FORENSICS  •  CASE ${caseId}  •  CONFIDENTIAL / DEMO`,
    MARGIN_MM,
    y + 4
  );
  pdf.text(
    `Page ${pageNum} of ${totalPages}`,
    pw - MARGIN_MM,
    y + 4,
    { align: 'right' }
  );
  // Reset text color for next operations
  pdf.setTextColor(0, 0, 0);
}

/**
 * Captures one DOM element as a high-DPI PNG canvas.
 * Temporarily expands it to CAPTURE_W_PX for consistent layout.
 */
async function captureSectionCanvas(el: HTMLElement): Promise<HTMLCanvasElement> {
  const savedStyle = el.getAttribute('style') ?? '';

  el.style.cssText = [
    `width: ${CAPTURE_W_PX}px !important`,
    'max-width: none !important',
    'margin: 0 !important',
    'box-shadow: none !important',
    'border-radius: 4px !important',
    'padding: 24px !important',
  ].join('; ');

  // Two animation frames — enough for Tailwind to reflow
  await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

  const canvas = await toCanvas(el, {
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    fontEmbedCSS: '',
    width: CAPTURE_W_PX,
    style: {
      width: `${CAPTURE_W_PX}px`,
      maxWidth: 'none',
      margin: '0',
    },
  });

  // Restore
  if (savedStyle) {
    el.setAttribute('style', savedStyle);
  } else {
    el.removeAttribute('style');
  }

  return canvas;
}

/**
 * Converts a canvas height (at CAPTURE_W_PX, pixelRatio 2) to mm on the PDF page.
 * canvas.width  = CAPTURE_W_PX * 2  (because pixelRatio = 2)
 * CONTENT_W_MM  = 396 mm
 */
function canvasHeightToMm(canvas: HTMLCanvasElement): number {
  // canvas.width is already the physical pixel width (CAPTURE_W_PX * 2 = 3174)
  return (canvas.height / canvas.width) * CONTENT_W_MM;
}

/**
 * Places one canvas image onto the current PDF page, centred within the
 * content area starting at `topOffsetMm` from the top margin.
 * Returns the mm height consumed.
 */
function placeCanvas(
  pdf: any,
  canvas: HTMLCanvasElement,
  topOffsetMm: number
): number {
  const imgData   = canvas.toDataURL('image/png');
  const imgH_mm   = canvasHeightToMm(canvas);

  // If the section is taller than the usable content area, scale it down
  // proportionally so it always fits on a single A2 page.
  const maxH = CONTENT_H_MM - topOffsetMm;
  const finalH = Math.min(imgH_mm, maxH);
  const finalW = (finalH / imgH_mm) * CONTENT_W_MM;
  const xOffset = MARGIN_MM + (CONTENT_W_MM - finalW) / 2;

  pdf.addImage(imgData, 'PNG', xOffset, MARGIN_MM + topOffsetMm, finalW, finalH);
  return finalH;
}

/**
 * Generates and downloads a multi-page A2 PDF.
 * Each `[data-pdf-section]` element gets its own page (short sections
 * are grouped with the next one to avoid near-empty pages).
 */
export async function downloadPdfReport(
  elementId: string = 'exact-forensic-report-main',
  caseId: string,
  onProgress?: (msg: string) => void,
  _caseData?: any,
  _investigation?: any
): Promise<boolean> {
  onProgress?.('Initializing A2 PDF export…');

  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id ${elementId} not found`);
    }

    // ── 1. Switch to light mode for clean white-background capture ──────────
    const htmlElement = document.documentElement;
    const wasDark = htmlElement.classList.contains('dark');
    if (wasDark) htmlElement.classList.remove('dark');

    // ── 2. Expand outer wrapper so section widths lay out at A2 size ────────
    const origContainerStyle = element.getAttribute('style') ?? '';
    element.style.cssText = [
      `width: ${CAPTURE_W_PX}px !important`,
      'max-width: none !important',
      'margin: 0 !important',
      'padding: 0 !important',
      'box-shadow: none !important',
      'border: none !important',
      'border-radius: 0 !important',
    ].join('; ');

    // Brief settle time for CSS reflow
    await new Promise<void>((r) => setTimeout(r, 120));

    // ── 3. Collect all <section data-pdf-section> elements ──────────────────
    const sections = Array.from(
      element.querySelectorAll<HTMLElement>('[data-pdf-section]')
    );

    if (sections.length === 0) {
      throw new Error('No [data-pdf-section] elements found inside report container.');
    }

    onProgress?.(`Capturing ${sections.length} sections for A2 PDF…`);

    // ── 4. Capture every section canvas + measure height ────────────────────
    type SectionCapture = { id: string; canvas: HTMLCanvasElement; heightMm: number };
    const captures: SectionCapture[] = [];

    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      const id = sec.getAttribute('data-pdf-section') ?? `section-${i}`;
      onProgress?.(`  Rendering section ${i + 1}/${sections.length}: ${id}…`);
      const canvas = await captureSectionCanvas(sec);
      captures.push({ id, canvas, heightMm: canvasHeightToMm(canvas) });
    }

    // ── 5. Restore DOM ───────────────────────────────────────────────────────
    if (origContainerStyle) {
      element.setAttribute('style', origContainerStyle);
    } else {
      element.removeAttribute('style');
    }
    if (wasDark) htmlElement.classList.add('dark');

    // ── 6. Group captures into pages ─────────────────────────────────────────
    //  A "short" section is one whose height is < GROUP_THRESHOLD_FRAC of
    //  CONTENT_H_MM.  Greedily stack consecutive short sections onto the same
    //  page as long as they fit, then flush to a new page.
    type PdfPage = SectionCapture[];
    const pages: PdfPage[] = [];
    let current: PdfPage = [];
    let currentHeight = 0;
    const GAP_MM = 6; // vertical gap between stacked sections on same page

    for (const cap of captures) {
      const isShort  = cap.heightMm < CONTENT_H_MM * GROUP_THRESHOLD_FRAC;
      const needed   = currentHeight + (current.length > 0 ? GAP_MM : 0) + cap.heightMm;
      const wouldFit = needed <= CONTENT_H_MM;

      if (current.length === 0) {
        current.push(cap);
        currentHeight = cap.heightMm;
      } else if (isShort && wouldFit) {
        current.push(cap);
        currentHeight += GAP_MM + cap.heightMm;
      } else {
        pages.push(current);
        current = [cap];
        currentHeight = cap.heightMm;
      }
    }
    if (current.length > 0) pages.push(current);

    onProgress?.(`Building ${pages.length}-page A2 PDF…`);

    // ── 7. Build PDF ─────────────────────────────────────────────────────────
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a2',   // 420 × 594 mm
    });

    const totalPages = pages.length;

    for (let p = 0; p < totalPages; p++) {
      if (p > 0) pdf.addPage();

      let cursorMm = 0; // offset from top of content area (inside margins)

      for (const cap of pages[p]) {
        placeCanvas(pdf, cap.canvas, cursorMm);
        cursorMm += canvasHeightToMm(cap.canvas) + GAP_MM;
      }

      addPageFooter(pdf, caseId, p + 1, totalPages);
    }

    // ── 8. Save ──────────────────────────────────────────────────────────────
    pdf.save(`ASHIELDER-Forensic-Report-CASE-${caseId}-A2.pdf`);
    onProgress?.('A2 PDF download complete.');

    // Trigger mock endpoint (rate-limit requirement)
    try {
      await apiClient.get(`/case/${caseId}`);
    } catch (_e: any) {
      throw new Error(`Rate limit exceeded for /case/${caseId} endpoint`);
    }

    return true;
  } catch (error) {
    console.error('A2 PDF generation error:', error);
    if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
      throw error;
    }
    onProgress?.('Error rendering PDF. Falling back to browser print dialog…');
    window.print();
    return false;
  }
}



/**
 * Downloads a complete Forensic Evidence Package (.ZIP)
 * Bundles raw .eml, headers, checksum manifest, and findings summary.
 */
export async function downloadEvidenceZipPackage(d: any, onProgress?: (msg: string) => void): Promise<boolean> {
  onProgress?.('Packaging forensic evidence archive...');
  const zip = new JSZip();

  // 1. Evidence Manifest JSON
  const manifest = buildEvidenceManifestJson(d);
  zip.file('evidence_manifest.json', JSON.stringify(manifest, null, 2));

  // 2. Dummy EML stream
  const rawEml = [
    'Received: from mx-in02.example.invalid (203.0.113.88) by mailbox-hub.example.invalid (203.0.113.150); Tue, 08 Sep 2026 14:21:08 +0000',
    'Received: from gw-relay01.example.invalid (198.51.100.12) by mx-in02.example.invalid (203.0.113.88); Tue, 08 Sep 2026 14:21:06 +0000',
    'Received: from client-mta.example.invalid (192.0.2.45) by gw-relay01.example.invalid (198.51.100.12); Tue, 08 Sep 2026 14:20:55 +0000',
    'Authentication-Results: mailbox-hub.example.invalid; spf=fail (192.0.2.45 not permitted); dkim=fail (missing selector); dmarc=fail (p=reject)',
    'Message-ID: <demo-001@example.invalid>',
    'Date: Tue, 08 Sep 2026 14:20:55 +0000',
    'From: "Support Verification" <analyst-demo@example.invalid>',
    'Reply-To: <support-demo@example.invalid>',
    'Return-Path: <bounce-demo@example.invalid>',
    'To: <recipient-demo@example.invalid>',
    'Subject: Sample Account Verification Required',
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="--boundary-demo-ashielder-001"',
    '',
    '----boundary-demo-ashielder-001',
    'Content-Type: text/plain; charset="utf-8"',
    '',
    'Dear Customer,',
    '',
    'We detected unusual login activity on your demo account. Please verify credentials:',
    'hxxps://example[.]invalid/account/verify',
    '',
    'Alternatively, review the attached invoice breakdown.',
    '',
    'Support Operations Team',
    '',
    '----boundary-demo-ashielder-001',
    'Content-Type: application/pdf; name="invoice_demo.pdf"',
    'Content-Disposition: attachment; filename="invoice_demo.pdf"',
    'Content-Transfer-Encoding: base64',
    '',
    'JVBERi0xLjQKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUi9PcGVuQWN0aW9uIDQgMCBSPj4K...[DEMO_PDF_STREAM]...',
    '----boundary-demo-ashielder-001--',
  ].join('\r\n');

  zip.file('E-001_original_message.eml', rawEml);

  // 3. Raw Headers
  const rawHeaders = (d.authProtocols?.headers || []).map((h: any) => `${h.field}: ${h.value}\n# Assessment: ${h.assessment}\n`).join('\n');
  zip.file('E-002_headers_analysis.txt', rawHeaders);

  // 4. SHA-256 Checksums
  const checksums = (d.evidenceRegister || []).map((e: any) => `${e.sha256}  ${e.id}_${e.type?.toLowerCase().replace(/\s+/g, '_')}`).join('\n');
  zip.file('checksums.sha256', checksums);

  // 5. Findings Readme
  const readme = [
    '=========================================================================',
    'ASHIELDER FORENSIC INVESTIGATION REPORT EVIDENCE PACKAGE',
    `Case ID: ${d.metadata?.caseId}`,
    `Investigation ID: ${d.metadata?.investigationId}`,
    `Generated: ${new Date().toISOString()}`,
    `Classification: ${d.executive?.verdict || 'MALICIOUS'} (${d.executive?.riskScore || '91'} / 100)`,
    'Notice: DEMO / SAMPLE DATA — NOT FOR REAL-WORLD EVIDENCE',
    '=========================================================================',
    '',
    'Files Included:',
    '1. evidence_manifest.json   - Machine-readable JSON manifest and findings',
    '2. E-001_original_message.eml - Anonymized demo MIME email stream',
    '3. E-002_headers_analysis.txt- Parsed transport routing and headers',
    '4. checksums.sha256         - SHA-256 baseline verification hashes',
    '',
    'Refer to the primary PDF report for full graphical correlation and chain of custody.',
  ].join('\n');

  zip.file('README_CUSTODY.txt', readme);

  const content = await zip.generateAsync({ type: 'blob' });

  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ASHIELDER_Evidence_Package_${d.metadata?.caseId || 'CASE'}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  onProgress?.('Evidence package downloaded.');
  return true;
}
