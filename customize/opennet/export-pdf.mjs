import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(directory, 'index.html');
const outputPath = path.resolve(directory, 'ken_chio_resume.pdf');

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

await page.setViewport({
    width: 1280,
    height: 900,
    deviceScaleFactor: 2,
});

await page.goto(`file://${htmlPath}`, {
    waitUntil: 'networkidle0',
    timeout: 30000,
});

await page.evaluate(() => document.fonts.ready);
await page.emulateMediaType('print');

await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
});

await browser.close();
console.log(outputPath);
