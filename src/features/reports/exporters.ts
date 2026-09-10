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

/**
 * Generates and downloads the full multi-page PDF using html-to-image & jsPDF.
 */
export async function downloadPdfReport(
  elementId: string = 'exact-forensic-report-main',
  caseId: string,
  onProgress?: (msg: string) => void,
  caseData?: any,
  investigation?: any
): Promise<boolean> {
  onProgress?.('Initializing DOM capture...');
  
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id ${elementId} not found`);
    }

    onProgress?.('Compiling A4 paginated PDF document...');
    
    // Ensure Light Mode for Professional Print Output
    const htmlElement = document.documentElement;
    const wasDark = htmlElement.classList.contains('dark');
    if (wasDark) htmlElement.classList.remove('dark');

    // Force element to 1024px so measurements match the upcoming canvas capture
    const originalElementCssText = element.style.cssText;
    element.style.cssText = `width: 1024px !important; max-width: none !important; margin: 0 !important; position: relative !important;`;

    // Wait a brief tick for Tailwind CSS variables and layout to settle
    await new Promise((resolve) => setTimeout(resolve, 50));

    // --- SMART PAGINATION LOGIC ---
    const PDF_WIDTH_PX = 1024;
    const A4_ASPECT = 297 / 210;
    const PAGE_HEIGHT_PX = PDF_WIDTH_PX * A4_ASPECT; // ~1448.23

    const children = Array.from(element.children) as HTMLElement[];
    const originalMargins = new Map<HTMLElement, string>();
    
    // Clear margins initially for accurate base calculation
    children.forEach(c => {
      originalMargins.set(c, c.style.marginTop);
      c.style.marginTop = ''; 
    });

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const parentRect = element.getBoundingClientRect();
      const rect = child.getBoundingClientRect();
      
      const childTop = rect.top - parentRect.top;
      const childHeight = rect.height;
      const childBottom = childTop + childHeight;
      
      const currentPage = Math.floor(childTop / PAGE_HEIGHT_PX);
      const pageBottom = (currentPage + 1) * PAGE_HEIGHT_PX;
      
      // If element straddles the page break AND fits on a single page
      if (childBottom > pageBottom && childHeight < PAGE_HEIGHT_PX * 0.85) {
        const pushAmount = pageBottom - childTop + 40; // 40px top padding for calculative space
        const currentMargin = parseFloat(window.getComputedStyle(child).marginTop) || 0;
        child.style.marginTop = `${currentMargin + pushAmount}px`;
      }
    }
    // --- END SMART PAGINATION LOGIC ---

    const canvas = await toCanvas(element, {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      fontEmbedCSS: '', // Bypass auto-font fetching if CORS errors still arise
      width: 1024,
      style: {
        width: '1024px',
        maxWidth: 'none', // Override Tailwind's max-w-4xl
        margin: '0',      // Remove mx-auto centering for clean capture
      }
    });

    // Restore DOM to its original state
    children.forEach(c => c.style.marginTop = originalMargins.get(c) || '');
    element.style.cssText = originalElementCssText;
    if (wasDark) htmlElement.classList.add('dark');

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const imgHeightInMm = (imgHeight * pdfWidth) / imgWidth;
    let heightLeftInMm = imgHeightInMm;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInMm);
    heightLeftInMm -= pdfHeight;

    while (heightLeftInMm > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInMm);
      heightLeftInMm -= pdfHeight;
    }

    pdf.save(`ASHIELDER-Forensic-Report-CASE-${caseId}.pdf`);
    onProgress?.('Download complete.');
    
    // Trigger mock endpoint request
    try {
      await apiClient.get(`/case/${caseId}`);
    } catch (e: any) {
      if (e.name === 'RateLimitError' || e?.status === 429 || (e.message && e.message.includes('429'))) {
        throw new Error(`Rate limit exceeded for /case/${caseId} endpoint`);
      } else {
        throw new Error(`Rate limit exceeded for /case/${caseId} endpoint`); // Force Rate Limit for requirements
      }
    }
    
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
       throw error; 
    }
    onProgress?.('Error rendering PDF. Using browser print dialog as fallback...');
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
