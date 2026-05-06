import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const file = (n) => 'file:///' + path.join(root, n).replace(/\\/g, '/');
const b = await puppeteer.launch();
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto(file('index.html'));
await p.evaluate(() => {
  localStorage.setItem('najdCart', JSON.stringify([
    { id:'mandi-royale', name:'Mandi Royale', nameAr:'مندي ملكي', desc:'Twelve-hour roasted lamb.', price:145, qty:2, img:'images/mandi.jpg' }
  ]));
});
await p.goto(file('cart.html'));
await new Promise(r => setTimeout(r, 1200));
await p.click('#langToggle');
await new Promise(r => setTimeout(r, 800));
const info = await p.evaluate(() => {
  const d = document.getElementById('cartDrawer');
  return { lang: document.documentElement.lang, dir: document.documentElement.dir, classes: d.className, hasOpen: d.classList.contains('open'), transform: getComputedStyle(d).transform, left: getComputedStyle(d).left, right: getComputedStyle(d).right, w: getComputedStyle(d).width };
});
console.log(JSON.stringify(info, null, 2));
await b.close();
