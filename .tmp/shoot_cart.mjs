import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const file = (n) => 'file:///' + path.join(root, n).replace(/\\/g, '/');

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });

// seed localStorage with sample cart
await page.goto(file('index.html'), { waitUntil: 'networkidle0' });
await page.evaluate(() => {
  localStorage.setItem('najdCart', JSON.stringify([
    { id:'mandi-royale', name:'Mandi Royale', nameAr:'مندي ملكي', desc:'Twelve-hour underground-roasted lamb, saffron basmati, charred tomato relish.', price:145, qty:2, img:'images/mandi.jpg' },
    { id:'saleeg-royale', name:'Saleeg Royale', nameAr:'صليق ملكي', desc:'Hejazi creamed rice, slow-poached chicken, brown butter, cardamom oil.', price:95, qty:1, img:'images/saleeg.jpg' },
    { id:'qahwa-arabiya', name:'Qahwa Arabiya', nameAr:'قهوة عربية', desc:'Traditional Arabic coffee, cardamom, saffron.', price:18, qty:2, img:'images/jareesh.jpg' }
  ]));
});

await page.goto(file('cart.html'), { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: path.join(__dirname, 'cart_en.png'), fullPage: true });

// AR cart — toggle via UI
await page.click('#langToggle');
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: path.join(__dirname, 'cart_ar.png'), fullPage: true });
const lang = await page.evaluate(() => document.documentElement.lang);
console.log('cart lang after toggle:', lang);

// EN checkout
await page.evaluate(() => { localStorage.setItem('najdLang', 'en'); });
await page.goto(file('checkout.html'), { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: path.join(__dirname, 'checkout_en.png'), fullPage: true });

// AR checkout — toggle via UI
await page.click('#langToggle');
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: path.join(__dirname, 'checkout_ar.png'), fullPage: true });

// Menu page (test add-to-cart buttons appear)
await page.evaluate(() => { localStorage.setItem('najdLang', 'en'); localStorage.removeItem('najdCart'); });
await page.goto(file('menu.html'), { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: path.join(__dirname, 'menu_en.png'), fullPage: false });

await browser.close();
console.log('done');
