import puppeteer from 'puppeteer';
const url = process.argv[2];
const out = process.argv[3];
const scrollY = parseFloat(process.argv[4] || '0');
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
await new Promise(r => setTimeout(r, 1500));
await page.evaluate((y) => {
  const sec = document.getElementById('gallery');
  if (!sec) return;
  const top = sec.offsetTop;
  window.scrollTo({ top: top + y, behavior: 'instant' });
}, scrollY);
await new Promise(r => setTimeout(r, 1800));
await page.screenshot({ path: out, fullPage: false });
await browser.close();
console.log('saved', out);
