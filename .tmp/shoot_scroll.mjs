import puppeteer from 'puppeteer';
const url = process.argv[2];
const out = process.argv[3];
const scrollY = parseInt(process.argv[4] || '0');
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 420, height: 1400, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 });
await new Promise(r => setTimeout(r, 3000));
try {
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const accept = btns.find(b => /accept/i.test(b.textContent));
    if (accept) accept.click();
  });
  await new Promise(r => setTimeout(r, 800));
} catch (e) {}
await page.evaluate((y) => window.scrollTo(0, y), scrollY);
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: out, fullPage: false });
await browser.close();
console.log('saved', out);
