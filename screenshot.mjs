import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SAVE_DIR = path.join(__dirname, 'temporary screenshots');

// Args: node screenshot.mjs <url> [label]
const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

if (!url.startsWith('http')) {
  console.error('Usage: node screenshot.mjs <url> [label]');
  console.error('  e.g. node screenshot.mjs http://localhost:3000');
  console.error('  e.g. node screenshot.mjs http://localhost:3000 hero');
  process.exit(1);
}

// Ensure output directory exists
fs.mkdirSync(SAVE_DIR, { recursive: true });

// Find next available screenshot index (never overwrite)
function nextIndex() {
  const files = fs.readdirSync(SAVE_DIR).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
  if (files.length === 0) return 1;
  const nums = files.map(f => {
    const m = f.match(/^screenshot-(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  });
  return Math.max(...nums) + 1;
}

const idx      = nextIndex();
const suffix   = label ? `-${label}` : '';
const filename = `screenshot-${idx}${suffix}.png`;
const outPath  = path.join(SAVE_DIR, filename);

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Full HD viewport
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  console.log(`📸 Navigating to ${url} …`);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait a beat for animations to settle
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: outPath, fullPage: true });

  await browser.close();

  console.log(`✓ Saved → temporary screenshots/${filename}`);
  console.log(`  Full path: ${outPath}`);
})();
