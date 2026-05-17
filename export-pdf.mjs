import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, 'index.html');
const outPath  = path.resolve(__dirname, 'ken_chio_resume.pdf');

(async () => {
  console.log('🚀 啟動 Chromium...');
  const browser = await puppeteer.launch({ headless: true });
  const page    = await browser.newPage();

  // 模擬桌機視窗，讓版面和螢幕顯示一致
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

  // 等待字體、圖片全部載入
  console.log('📄 載入頁面...');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });

  // 讓 Google Fonts 有時間套用（本機字體可能需要）
  await new Promise(r => setTimeout(r, 1500));

  // 隱藏導覽列（print CSS 已做，這裡雙重保險）
  await page.addStyleTag({ content: `
    .nav, .footer, .project-links, .btn { display: none !important; }
    html { font-size: 14px !important; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .header h1 { font-size: 3rem !important; }
    .section { padding: 28px 0 !important; }
    .main { min-height: auto !important; }
  `});

  console.log('🖨️  輸出 PDF...');
  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '18mm', bottom: '18mm', left: '14mm', right: '14mm' },
    displayHeaderFooter: false,
  });

  await browser.close();
  console.log(`✅ 完成！輸出至：${outPath}`);
})();
