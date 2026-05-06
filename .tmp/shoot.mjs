import puppeteer from 'puppeteer';
const url = process.argv[2] || 'http://localhost:8080/';
const out = process.argv[3] || 'shot.png';
const sel = process.argv[4];
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
await new Promise(r => setTimeout(r, 1500));
if (sel) {
  const el = await page.$(sel);
  await el.screenshot({ path: out });
} else {
  await page.screenshot({ path: out, fullPage: true });
}
await browser.close();
console.log('saved', out);
