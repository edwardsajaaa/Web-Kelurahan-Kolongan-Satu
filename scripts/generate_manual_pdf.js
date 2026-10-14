const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Baca logo sebagai Base64
function getBase64Image(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const bitmap = fs.readFileSync(filePath);
      const ext = path.extname(filePath).replace('.', '');
      return `data:image/${ext === 'png' ? 'png' : 'jpeg'};base64,${bitmap.toString('base64')}`;
    }
  } catch (e) {
    console.warn('Gagal membaca gambar:', filePath, e.message);
  }
  return '';
}

const logoTomohonBase64 = getBase64Image(path.join(__dirname, '../public/images/logo-tomohon.png'));
const logoKktBase64 = getBase64Image(path.join(__dirname, '../public/images/logo-kkt-149.png'));

// 2. Baca file PANDUAN_PENGGUNAAN.md
const mdPath = path.join(__dirname, '../PANDUAN_PENGGUNAAN.md');
const mdContent = fs.readFileSync(mdPath, 'utf8');

// 3. Robust & Clean Markdown to HTML Parser
function markdownToHtml(md) {
  let lines = md.split(/\r?\n/);
  let html = [];
  
  let activeList = null; // 'ul' | 'ol' | null
  let inTable = false;
  let inCodeBlock = false;
  let inAlert = false;
  let isMermaid = false;

  function closeList() {
    if (activeList) {
      html.push(`</${activeList}>`);
      activeList = null;
    }
  }

  function closeTable() {
    if (inTable) {
      html.push('</tbody></table></div>');
      inTable = false;
    }
  }

  function closeAlert() {
    if (inAlert) {
      html.push('</div>');
      inAlert = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Check Code blocks & Mermaid
    if (line.startsWith('```')) {
      closeList();
      closeTable();
      closeAlert();

      if (inCodeBlock) {
        if (isMermaid) {
          // Render visual stepper instead of raw code
          html.push(`
            <div class="pipeline-flow-container">
              <div class="pipeline-step">
                <div class="step-num">1</div>
                <div class="step-label">Warga Mengajukan</div>
                <div class="step-sub">Form Mandiri / KTP</div>
              </div>
              <div class="pipeline-arrow">➔</div>
              <div class="pipeline-step">
                <div class="step-num">2</div>
                <div class="step-label">Verifikasi Staf</div>
                <div class="step-sub">Staf Karlin Pieter</div>
              </div>
              <div class="pipeline-arrow">➔</div>
              <div class="pipeline-step">
                <div class="step-num">3</div>
                <div class="step-label">Paraf Seklur</div>
                <div class="step-sub">Seklur Febronia</div>
              </div>
              <div class="pipeline-arrow">➔</div>
              <div class="pipeline-step step-final">
                <div class="step-num">4</div>
                <div class="step-label">TTD &amp; Terbit PDF</div>
                <div class="step-sub">Lurah Theresia (BSrE)</div>
              </div>
            </div>
          `);
          isMermaid = false;
        } else {
          html.push('</pre></div>');
        }
        inCodeBlock = false;
      } else {
        if (line.includes('mermaid')) {
          isMermaid = true;
          inCodeBlock = true;
        } else {
          html.push('<div class="code-box"><pre>');
          inCodeBlock = true;
        }
      }
      continue;
    }

    if (inCodeBlock) {
      if (!isMermaid) {
        html.push(line.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
      }
      continue;
    }

    // Skip Cover Headings (Already rendered in Custom Executive Cover)
    if (line.startsWith('# BUKU PANDUAN PENGGUNAAN') || 
        line.startsWith('## SISTEM INFORMASI & PORTAL') ||
        line.startsWith('### Pemerintah Kota Tomohon')) {
      continue;
    }

    // Alert Callouts (> [!IMPORTANT], > [!NOTE], etc.)
    if (line.startsWith('> [!IMPORTANT]') || line.startsWith('> [!NOTE]') || line.startsWith('> [!TIP]')) {
      closeList();
      closeTable();
      closeAlert();

      let alertType = line.includes('IMPORTANT') ? 'important' : line.includes('TIP') ? 'tip' : 'note';
      let title = alertType === 'important' ? 'PERINGATAN KEDINASAN' : alertType === 'tip' ? 'PETUNJUK SISTEM' : 'CATATAN KHUSUS';
      html.push(`<div class="alert-box alert-${alertType}"><div class="alert-title">${title}</div>`);
      inAlert = true;
      continue;
    } else if (line.startsWith('>')) {
      let content = line.substring(1).trim();
      html.push(`<p class="alert-content">${formatInline(content)}</p>`);
      continue;
    } else if (inAlert && !line.startsWith('>')) {
      closeAlert();
    }

    // Tables
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      closeList();
      closeAlert();

      if (line.includes('---')) {
        continue; // Separator row
      }

      let cells = line.split('|').slice(1, -1).map(c => c.trim());
      
      if (!inTable) {
        inTable = true;
        html.push('<div class="table-container"><table><thead><tr>');
        cells.forEach(c => {
          html.push(`<th>${formatInline(c)}</th>`);
        });
        html.push('</tr></thead><tbody>');
      } else {
        html.push('<tr>');
        cells.forEach(c => {
          html.push(`<td>${formatInline(c)}</td>`);
        });
        html.push('</tr>');
      }
      continue;
    } else if (inTable) {
      closeTable();
    }

    // Unordered Lists (* or -)
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      closeAlert();
      closeTable();
      if (activeList !== 'ul') {
        closeList();
        html.push('<ul>');
        activeList = 'ul';
      }
      let content = line.trim().substring(2);
      html.push(`<li>${formatInline(content)}</li>`);
      continue;
    }

    // Ordered Lists (1. 2. 3.)
    if (/^\d+\.\s/.test(line.trim())) {
      closeAlert();
      closeTable();
      if (activeList !== 'ol') {
        closeList();
        html.push('<ol>');
        activeList = 'ol';
      }
      let content = line.trim().replace(/^\d+\.\s/, '');
      html.push(`<li>${formatInline(content)}</li>`);
      continue;
    }

    // Empty line closes open list
    if (line.trim() === '') {
      closeList();
      closeAlert();
      continue;
    }

    // Headings
    if (line.startsWith('## BAB ')) {
      closeList();
      closeTable();
      closeAlert();
      html.push(`<div class="chapter-wrapper"><div class="chapter-badge">MODUL KEDINASAN</div><h2 class="chapter-heading">${formatInline(line.replace('## ', ''))}</h2></div>`);
      continue;
    }
    if (line.startsWith('## DAFTAR ISI')) {
      closeList();
      closeTable();
      closeAlert();
      html.push(`<h2 class="section-heading" style="margin-top:0;">DAFTAR ISI BUKU PANDUAN</h2>`);
      continue;
    }
    if (line.startsWith('## ')) {
      closeList();
      closeTable();
      closeAlert();
      html.push(`<h2 class="section-heading">${formatInline(line.replace('## ', ''))}</h2>`);
      continue;
    }
    if (line.startsWith('### ')) {
      closeList();
      closeTable();
      closeAlert();
      html.push(`<h3 class="subsection-heading">${formatInline(line.replace('### ', ''))}</h3>`);
      continue;
    }
    if (line.startsWith('#### ')) {
      closeList();
      closeTable();
      closeAlert();
      html.push(`<h4 class="minor-heading">${formatInline(line.replace('#### ', ''))}</h4>`);
      continue;
    }

    // Horizontal Rule
    if (line.trim() === '---') {
      closeList();
      closeTable();
      closeAlert();
      html.push('<hr class="divider" />');
      continue;
    }

    // Normal Paragraph
    closeList();
    closeTable();
    closeAlert();
    html.push(`<p>${formatInline(line)}</p>`);
  }

  closeList();
  closeTable();
  closeAlert();

  return html.join('\n');
}

function formatInline(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/<br>/g, '<br/>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

const parsedBodyHtml = markdownToHtml(mdContent);

// 4. Struktur Lengkap Dokumen HTML dengan Desain Cetak Eksekutif A4 yang Konsisten
const fullHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Buku Panduan Penggunaan - Kelurahan Kolongan Satu</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');

    @page {
      size: A4 portrait;
      margin: 18mm 16mm 18mm 16mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    html, body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 10pt;
      line-height: 1.6;
      color: #1e293b;
      margin: 0;
      padding: 0;
      background: #ffffff;
      width: 100%;
    }

    /* Strict container for all content to prevent shrinking / horizontal blowout */
    .content-container {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
    }

    /* COVER PAGE */
    .cover-page {
      page-break-after: always;
      break-after: page;
      min-height: 250mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 3px double #004d77;
      padding: 30px 25px;
      background: #ffffff;
    }

    .cover-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2.5px solid #004d77;
      padding-bottom: 15px;
    }

    .cover-logo {
      height: 68px;
      width: auto;
      object-fit: contain;
    }

    .cover-header-text {
      text-align: center;
      flex: 1;
      padding: 0 15px;
    }

    .cover-header-text h4 {
      margin: 0;
      font-size: 10.5pt;
      font-weight: 700;
      letter-spacing: 0.8px;
      color: #475569;
      text-transform: uppercase;
    }

    .cover-header-text h3 {
      margin: 2px 0;
      font-size: 12.5pt;
      font-weight: 800;
      letter-spacing: 1px;
      color: #004d77;
      text-transform: uppercase;
    }

    .cover-header-text h2 {
      margin: 0;
      font-size: 15pt;
      font-weight: 900;
      letter-spacing: 1.2px;
      color: #0f172a;
      text-transform: uppercase;
    }

    .cover-header-text p {
      margin: 3px 0 0 0;
      font-size: 8pt;
      color: #64748b;
    }

    .cover-body {
      text-align: center;
      padding: 35px 10px;
    }

    .cover-tagline {
      display: inline-block;
      padding: 5px 14px;
      background: #f0f9ff;
      color: #0369a1;
      border-radius: 999px;
      font-size: 8pt;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin-bottom: 18px;
      border: 1px solid #bae6fd;
    }

    .cover-title {
      font-size: 22pt;
      font-weight: 900;
      line-height: 1.25;
      color: #0f172a;
      margin: 0 0 12px 0;
      letter-spacing: -0.3px;
    }

    .cover-subtitle {
      font-size: 11.5pt;
      font-weight: 600;
      color: #004d77;
      margin: 0 0 25px 0;
      line-height: 1.45;
    }

    .cover-badge-box {
      display: inline-flex;
      gap: 16px;
      background: #ffffff;
      padding: 10px 20px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
    }

    .badge-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .badge-label {
      font-size: 7pt;
      color: #64748b;
      font-weight: 700;
      text-transform: uppercase;
    }

    .badge-value {
      font-weight: 800;
      color: #004d77;
      font-size: 9pt;
    }

    .cover-footer {
      border-top: 1.5px solid #cbd5e1;
      padding-top: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 8pt;
      color: #475569;
    }

    .stamp-box {
      border: 1.5px dashed #004d77;
      border-radius: 6px;
      padding: 6px 12px;
      display: inline-block;
      color: #004d77;
      font-weight: 700;
      font-size: 7.5pt;
      text-transform: uppercase;
      background: #f8fafc;
    }

    /* CHAPTER HEADINGS */
    .chapter-wrapper {
      page-break-before: always;
      break-before: page;
      margin-top: 0;
      padding-top: 10px;
      margin-bottom: 18px;
    }

    .chapter-badge {
      display: inline-block;
      font-size: 7pt;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #0284c7;
      background: #e0f2fe;
      padding: 3px 10px;
      border-radius: 4px;
      margin-bottom: 5px;
    }

    h2.chapter-heading {
      font-size: 13pt;
      font-weight: 800;
      color: #ffffff;
      background: #004d77;
      padding: 10px 14px;
      border-radius: 6px;
      margin: 0;
      letter-spacing: -0.2px;
    }

    h2.section-heading {
      font-size: 12pt;
      font-weight: 800;
      color: #004d77;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 4px;
      margin: 20px 0 10px 0;
    }

    h3.subsection-heading {
      font-size: 10.5pt;
      font-weight: 700;
      color: #0f172a;
      margin: 16px 0 6px 0;
    }

    h4.minor-heading {
      font-size: 9.5pt;
      font-weight: 700;
      color: #334155;
      margin: 12px 0 4px 0;
    }

    /* PARAGRAPHS & LISTS - 100% CONSISTENT SIZING */
    p {
      font-size: 10pt;
      margin: 0 0 8px 0;
      text-align: justify;
      color: #1e293b;
    }

    ul, ol {
      font-size: 10pt;
      margin: 0 0 10px 0;
      padding-left: 20px;
      color: #1e293b;
    }

    li {
      margin-bottom: 4px;
      line-height: 1.55;
    }

    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      background: #f1f5f9;
      color: #0f172a;
      padding: 1px 4px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    a {
      color: #0284c7;
      text-decoration: none;
      font-weight: 600;
    }

    .divider {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 18px 0;
    }

    /* TABLES - FIXED LAYOUT (NO OVERFLOW) */
    .table-container {
      margin: 12px 0 16px 0;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #cbd5e1;
      width: 100%;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
      table-layout: fixed;
    }

    th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      text-align: left;
      padding: 7px 10px;
      border-bottom: 2px solid #cbd5e1;
      border-right: 1px solid #e2e8f0;
      word-wrap: break-word;
    }

    th:last-child {
      border-right: none;
    }

    td {
      padding: 6px 10px;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      vertical-align: top;
      word-wrap: break-word;
      line-height: 1.45;
    }

    td:last-child {
      border-right: none;
    }

    tr:nth-child(even) td {
      background: #f8fafc;
    }

    /* ALERTS */
    .alert-box {
      border-radius: 6px;
      padding: 10px 14px;
      margin: 12px 0;
      font-size: 9pt;
      border-left: 4px solid;
    }

    .alert-title {
      font-weight: 800;
      text-transform: uppercase;
      font-size: 7.5pt;
      letter-spacing: 0.8px;
      margin-bottom: 4px;
    }

    .alert-important {
      background: #fef2f2;
      border-color: #ef4444;
      color: #991b1b;
    }

    .alert-tip {
      background: #f0fdf4;
      border-color: #22c55e;
      color: #166534;
    }

    .alert-note {
      background: #f0f9ff;
      border-color: #0ea5e9;
      color: #075985;
    }

    .alert-content {
      margin: 0;
      font-size: 9pt;
    }

    /* VISUAL PIPELINE WORKFLOW CARD */
    .pipeline-flow-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 14px 12px;
      margin: 14px 0 18px 0;
    }

    .pipeline-step {
      flex: 1;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }

    .pipeline-step.step-final {
      border-color: #004d77;
      background: #f0f7ff;
    }

    .step-num {
      width: 20px;
      height: 20px;
      line-height: 20px;
      border-radius: 50%;
      background: #004d77;
      color: #ffffff;
      font-size: 7.5pt;
      font-weight: 800;
      margin: 0 auto 4px auto;
    }

    .step-label {
      font-size: 8pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
    }

    .step-sub {
      font-size: 6.5pt;
      color: #64748b;
      margin-top: 2px;
    }

    .pipeline-arrow {
      color: #94a3b8;
      font-weight: 800;
      font-size: 11pt;
    }

    .code-box {
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 14px;
      border-radius: 6px;
      margin: 10px 0;
    }

    .code-box pre {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      margin: 0;
      line-height: 1.4;
      white-space: pre-wrap;
      word-break: break-all;
    }

    /* HEADER & FOOTER RUNNING */
    .doc-running-header {
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #64748b;
      font-weight: 600;
    }
  </style>
</head>
<body>

  <!-- ======================== HALAMAN SAMPUL (COVER) ======================== -->
  <div class="cover-page">
    <div class="cover-header">
      ${logoTomohonBase64 ? `<img src="${logoTomohonBase64}" class="cover-logo" alt="Logo Tomohon" />` : '<div style="width:68px;"></div>'}
      <div class="cover-header-text">
        <h4>Pemerintah Kota Tomohon</h4>
        <h3>Kecamatan Tomohon Tengah</h3>
        <h2>Kelurahan Kolongan Satu</h2>
        <p>Alamat Kantor: Jl. Lingkungan 1, Kolongan Satu, Tomohon Tengah, Kota Tomohon, Sulawesi Utara</p>
      </div>
      ${logoKktBase64 ? `<img src="${logoKktBase64}" class="cover-logo" alt="Logo Kolongan Satu" />` : '<div style="width:68px;"></div>'}
    </div>

    <div class="cover-body">
      <div class="cover-tagline">Dokumentasi Standar Operasional &amp; Tata Kelola Digital</div>
      <h1 class="cover-title">BUKU PANDUAN PENGGUNAAN<br>(USER MANUAL)</h1>
      <div class="cover-subtitle">Sistem Informasi Pemerintahan &amp; Portal e-Monografi Digital Kelurahan Kolongan Satu</div>

      <div class="cover-badge-box">
        <div class="badge-item">
          <span class="badge-label">Nomor Dokumen</span>
          <span class="badge-value">MANUAL/KKT/2026/V1</span>
        </div>
        <div style="border-right: 1px solid #cbd5e1;"></div>
        <div class="badge-item">
          <span class="badge-label">Versi Sistem</span>
          <span class="badge-value">1.0.0 (Production)</span>
        </div>
        <div style="border-right: 1px solid #cbd5e1;"></div>
        <div class="badge-item">
          <span class="badge-label">Tahun Berlaku</span>
          <span class="badge-value">2026</span>
        </div>
        <div style="border-right: 1px solid #cbd5e1;"></div>
        <div class="badge-item">
          <span class="badge-label">Domain Resmi</span>
          <span class="badge-value">kolongansatu.site</span>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div>
        <strong>Pemerintah Kelurahan Kolongan Satu</strong><br>
        Lurah: <strong>Theresia J. Kaunang, SE</strong> (NIP. 19731206 200312 2 007)<br>
        Sekretaris: <strong>Febronia L. Pijoh, S.Kom</strong> (NIP. 19780203 200902 2 002)
      </div>
      <div>
        <div class="stamp-box">Tervalidasi Resmi Kelurahan 2026</div>
      </div>
    </div>
  </div>

  <!-- ======================== KONTEN BUKU PANDUAN ======================== -->
  <div class="content-container">
    <div class="doc-running-header">
      <span>Buku Panduan Penggunaan Sistem Informasi - Kelurahan Kolongan Satu</span>
      <span>Edisi Produksi 2026</span>
    </div>

    ${parsedBodyHtml}
  </div>

</body>
</html>`;

// 5. Simpan file HTML sementara
const tempHtmlPath = path.join(__dirname, 'temp_manual.html');
fs.writeFileSync(tempHtmlPath, fullHtml, 'utf8');
console.log('File HTML sementara berhasil dibuat di:', tempHtmlPath);

// 6. Jalankan Microsoft Edge Headless untuk render PDF A4
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputPdfPath = path.join(__dirname, '../public/Buku_Panduan_Kolongan_Satu.pdf');
const rootPdfPath = path.join(__dirname, '../Buku_Panduan_Kolongan_Satu.pdf');
const artifactPdfPath = 'C:\\Users\\Asus\\.gemini\\antigravity-ide\\brain\\90995fcf-e849-4571-b770-aa5466e3b425\\Buku_Panduan_Kolongan_Satu.pdf';

try {
  console.log('Menjalankan Microsoft Edge headless untuk mencetak PDF...');
  const edgeCmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${outputPdfPath}" "file:///${tempHtmlPath.replace(/\\/g, '/')}"`;
  execSync(edgeCmd, { stdio: 'inherit' });

  // Salin ke root dan folder artifact
  if (fs.existsSync(outputPdfPath)) {
    fs.copyFileSync(outputPdfPath, rootPdfPath);
    try {
      fs.copyFileSync(outputPdfPath, artifactPdfPath);
    } catch(e) {}

    const stats = fs.statSync(outputPdfPath);
    console.log(`SUKSES! PDF berhasil dibuat:`);
    console.log(`1. ${outputPdfPath} (${(stats.size / 1024).toFixed(1)} KB)`);
    console.log(`2. ${rootPdfPath}`);
    console.log(`3. ${artifactPdfPath}`);
  } else {
    throw new Error('File PDF tidak ditemukan setelah dieksekusi.');
  }
} catch (err) {
  console.error('Gagal membuat PDF via Edge:', err.message);
  process.exit(1);
}
