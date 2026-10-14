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

// 3. Simple Markdown to Rich HTML Parser khusus dokumen PDF
function markdownToHtml(md) {
  let lines = md.split('\n');
  let html = [];
  let inTable = false;
  let tableHeaderParsed = false;
  let inList = false;
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        html.push('</pre></div>');
        inCodeBlock = false;
      } else {
        if (inList) { html.push('</ul>'); inList = false; }
        if (inTable) { html.push('</tbody></table></div>'); inTable = false; }
        html.push('<div class="code-box"><pre>');
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      html.push(line.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
      continue;
    }

    // Skip Cover & TOC Markdown headings as they are handled in custom cover layout
    if (line.startsWith('# BUKU PANDUAN PENGGUNAAN') || 
        line.startsWith('## SISTEM INFORMASI & PORTAL') ||
        line.startsWith('### Pemerintah Kota Tomohon')) {
      continue;
    }

    // Table parsing
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (inList) { html.push('</ul>'); inList = false; }
      
      // Separator row
      if (line.includes('---')) {
        continue;
      }

      let cells = line.split('|').slice(1, -1).map(c => c.trim());
      
      if (!inTable) {
        inTable = true;
        tableHeaderParsed = true;
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
      html.push('</tbody></table></div>');
      inTable = false;
      tableHeaderParsed = false;
    }

    // Unordered / Ordered Lists
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      let content = line.trim().substring(2);
      html.push(`<li>${formatInline(content)}</li>`);
      continue;
    } else if (/^\d+\.\s/.test(line.trim())) {
      if (!inList) {
        html.push('<ol>');
        inList = true;
      }
      let content = line.trim().replace(/^\d+\.\s/, '');
      html.push(`<li>${formatInline(content)}</li>`);
      continue;
    } else if (inList && line.trim() === '') {
      html.push('</ul>');
      inList = false;
    }

    // Quotes / Alerts
    if (line.startsWith('> [!IMPORTANT]') || line.startsWith('> [!NOTE]') || line.startsWith('> [!TIP]')) {
      let alertType = line.includes('IMPORTANT') ? 'important' : line.includes('TIP') ? 'tip' : 'note';
      let title = alertType === 'important' ? 'PERINGATAN KEDINASAN' : alertType === 'tip' ? 'PETUNJUK PENTING' : 'CATATAN';
      html.push(`<div class="alert-box alert-${alertType}"><div class="alert-title">${title}</div>`);
      continue;
    } else if (line.startsWith('>')) {
      let content = line.substring(1).trim();
      html.push(`<p class="alert-content">${formatInline(content)}</p></div>`);
      continue;
    }

    // Headings
    if (line.startsWith('## BAB ')) {
      html.push(`<div class="page-break"></div><h2 class="chapter-heading">${formatInline(line.replace('## ', ''))}</h2>`);
      continue;
    }
    if (line.startsWith('## ')) {
      html.push(`<h2 class="section-heading">${formatInline(line.replace('## ', ''))}</h2>`);
      continue;
    }
    if (line.startsWith('### ')) {
      html.push(`<h3 class="subsection-heading">${formatInline(line.replace('### ', ''))}</h3>`);
      continue;
    }
    if (line.startsWith('#### ')) {
      html.push(`<h4 class="minor-heading">${formatInline(line.replace('#### ', ''))}</h4>`);
      continue;
    }

    // Horizontal Rule
    if (line.trim() === '---') {
      html.push('<hr class="divider" />');
      continue;
    }

    // Normal Paragraph
    if (line.trim()) {
      html.push(`<p>${formatInline(line)}</p>`);
    }
  }

  if (inList) html.push('</ul>');
  if (inTable) html.push('</tbody></table></div>');
  if (inCodeBlock) html.push('</pre></div>');

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

// 4. Struktur Lengkap Dokumen HTML dengan Desain Cetak Eksekutif A4
const fullHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Buku Panduan Penggunaan - Kelurahan Kolongan Satu</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

    @page {
      size: A4 portrait;
      margin: 16mm 14mm 18mm 14mm;
      @bottom-right {
        content: counter(page);
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 9.5pt;
      line-height: 1.55;
      color: #1e293b;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }

    .page-break {
      page-break-before: always;
      break-before: page;
      clear: both;
    }

    /* COVER PAGE */
    .cover-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 3px double #004d77;
      padding: 35px 30px;
      position: relative;
      background: radial-gradient(circle at top right, #f0f7ff, #ffffff 60%);
    }

    .cover-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2.5px solid #004d77;
      padding-bottom: 18px;
    }

    .cover-logo {
      height: 70px;
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
      font-size: 11pt;
      font-weight: 700;
      letter-spacing: 1px;
      color: #334155;
      text-transform: uppercase;
    }

    .cover-header-text h3 {
      margin: 2px 0;
      font-size: 13pt;
      font-weight: 800;
      letter-spacing: 1.2px;
      color: #004d77;
      text-transform: uppercase;
    }

    .cover-header-text h2 {
      margin: 0;
      font-size: 15pt;
      font-weight: 900;
      letter-spacing: 1.5px;
      color: #0f172a;
      text-transform: uppercase;
    }

    .cover-header-text p {
      margin: 3px 0 0 0;
      font-size: 7.5pt;
      color: #64748b;
    }

    .cover-body {
      text-align: center;
      padding: 40px 10px;
    }

    .cover-tagline {
      display: inline-block;
      padding: 6px 16px;
      background: #e0f2fe;
      color: #0284c7;
      border-radius: 999px;
      font-size: 8.5pt;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 18px;
      border: 1px solid #bae6fd;
    }

    .cover-title {
      font-size: 24pt;
      font-weight: 900;
      line-height: 1.2;
      color: #0f172a;
      margin: 0 0 12px 0;
      letter-spacing: -0.5px;
    }

    .cover-subtitle {
      font-size: 12.5pt;
      font-weight: 600;
      color: #004d77;
      margin: 0 0 25px 0;
      line-height: 1.4;
    }

    .cover-badge-box {
      display: inline-flex;
      gap: 12px;
      background: #ffffff;
      padding: 10px 18px;
      border-radius: 12px;
      border: 1px solid #cbd5e1;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      margin-top: 10px;
      font-size: 8.5pt;
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
    }

    .cover-footer {
      border-top: 1.5px solid #cbd5e1;
      padding-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 8pt;
      color: #475569;
    }

    .cover-footer-left {
      text-align: left;
    }

    .cover-footer-right {
      text-align: right;
    }

    .stamp-box {
      border: 1.5px dashed #004d77;
      border-radius: 8px;
      padding: 6px 12px;
      display: inline-block;
      color: #004d77;
      font-weight: 700;
      font-size: 7.5pt;
      text-transform: uppercase;
      background: #f8fafc;
    }

    /* TYPOGRAPHY IN BODY */
    h2.chapter-heading {
      font-size: 14pt;
      font-weight: 800;
      color: #ffffff;
      background: #004d77;
      padding: 9px 14px;
      border-radius: 8px;
      margin: 0 0 16px 0;
      letter-spacing: -0.2px;
      border-left: 6px solid #38bdf8;
    }

    h2.section-heading {
      font-size: 12pt;
      font-weight: 800;
      color: #004d77;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 5px;
      margin: 22px 0 10px 0;
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

    p {
      margin: 0 0 8px 0;
      text-align: justify;
    }

    ul, ol {
      margin: 0 0 10px 0;
      padding-left: 20px;
    }

    li {
      margin-bottom: 4px;
    }

    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      background: #f1f5f9;
      color: #0f172a;
      padding: 1.5px 5px;
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
      margin: 16px 0;
    }

    /* TABLES */
    .table-container {
      margin: 12px 0 16px 0;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #cbd5e1;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
    }

    th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      text-align: left;
      padding: 7px 10px;
      border-bottom: 2px solid #cbd5e1;
      border-right: 1px solid #e2e8f0;
    }

    th:last-child {
      border-right: none;
    }

    td {
      padding: 6.5px 10px;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      vertical-align: top;
    }

    td:last-child {
      border-right: none;
    }

    tr:nth-child(even) td {
      background: #f8fafc;
    }

    /* ALERTS / CALLOUT BOXES */
    .alert-box {
      border-radius: 8px;
      padding: 10px 14px;
      margin: 12px 0;
      font-size: 8.5pt;
      border-left: 4px solid;
    }

    .alert-title {
      font-weight: 800;
      text-transform: uppercase;
      font-size: 7.5pt;
      letter-spacing: 0.8px;
      margin-bottom: 3px;
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
    }

    /* CODE & MERMAID CONTAINER */
    .code-box {
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 14px;
      border-radius: 8px;
      margin: 10px 0;
      overflow-x: auto;
    }

    .code-box pre {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      margin: 0;
      line-height: 1.4;
    }

    /* HEADER & FOOTER RUNNING */
    .doc-running-header {
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      font-size: 7.5pt;
      color: #64748b;
      font-weight: 600;
    }

    .doc-running-footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 4px;
      margin-top: 14px;
      display: flex;
      justify-content: space-between;
      font-size: 7.5pt;
      color: #94a3b8;
    }
  </style>
</head>
<body>

  <!-- ======================== HALAMAN SAMPUL (COVER) ======================== -->
  <div class="cover-container">
    <div class="cover-header">
      ${logoTomohonBase64 ? `<img src="${logoTomohonBase64}" class="cover-logo" alt="Logo Tomohon" />` : '<div style="width:70px;"></div>'}
      <div class="cover-header-text">
        <h4>Pemerintah Kota Tomohon</h4>
        <h3>Kecamatan Tomohon Tengah</h3>
        <h2>Kelurahan Kolongan Satu</h2>
        <p>Alamat Kantor: Jl. Lingkungan 1, Kolongan Satu, Tomohon Tengah, Kota Tomohon, Sulawesi Utara</p>
      </div>
      ${logoKktBase64 ? `<img src="${logoKktBase64}" class="cover-logo" alt="Logo Kolongan Satu" />` : '<div style="width:70px;"></div>'}
    </div>

    <div class="cover-body">
      <div class="cover-tagline">Dokumentasi Standar Operasional & Tata Kelola Digital</div>
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
      <div class="cover-footer-left">
        <strong>Pemerintah Kelurahan Kolongan Satu</strong><br>
        Lurah: <strong>Theresia J. Kaunang, SE</strong> (NIP. 19731206 200312 2 007)<br>
        Sekretaris: <strong>Febronia L. Pijoh, S.Kom</strong> (NIP. 19780203 200902 2 002)
      </div>
      <div class="cover-footer-right">
        <div class="stamp-box">Tervalidasi Resmi Kelurahan 2026</div>
      </div>
    </div>
  </div>

  <!-- ======================== KONTEN BUKU PANDUAN ======================== -->
  <div class="page-break"></div>

  <div class="doc-running-header">
    <span>Buku Panduan Penggunaan Sistem Informasi - Kelurahan Kolongan Satu</span>
    <span>Edisi Produksi 2026</span>
  </div>

  ${parsedBodyHtml}

  <div class="doc-running-footer">
    <span>Pemerintah Kelurahan Kolongan Satu • Kota Tomohon</span>
    <span>https://kolongansatu.site</span>
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
