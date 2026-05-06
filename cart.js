(function(){
  const KEY = 'najdCart';
  const TR = {
    "Cart": "السلة",
    "Your Cart": "سلتك",
    "Your Order": "طلبك",
    "Your cart is empty": "سلتك فارغة",
    "Browse our menu and add a few favorites.": "تصفح القائمة وأضف بعض المفضلات.",
    "View Menu": "عرض القائمة",
    "Back to Menu": "العودة للقائمة",
    "Back to Cart": "العودة للسلة",
    "Product": "المنتج",
    "Total": "الإجمالي",
    "Cart Totals": "إجماليات السلة",
    "Subtotal": "المجموع الفرعي",
    "VAT (15%)": "ضريبة القيمة المضافة (15%)",
    "VAT included · Delivery calculated at checkout": "شامل الضريبة · رسوم التوصيل تُحتسب عند الدفع",
    "Add Coupon": "إضافة كوبون",
    "Apply": "تطبيق",
    "Estimated Total": "الإجمالي التقديري",
    "Proceed to Checkout": "المتابعة للدفع",
    "Remove": "حذف",
    "View Cart": "عرض السلة",
    "Checkout": "الدفع",
    "Add to Cart": "أضف للسلة",
    "Added": "تمت الإضافة",
    "Order": "اطلب",
    "© 2026 Najd. All Rights Reserved.": "© ٢٠٢٦ نجد. جميع الحقوق محفوظة.",
    "Riyadh · KSA": "الرياض · المملكة العربية السعودية",
    "العربية": "EN",
    "Reservation": "احجز طاولة",

    // checkout
    "CHECKOUT": "الدفع",
    "Billing & Delivery": "بيانات الفوترة والتوصيل",
    "Billing Details": "بيانات الفوترة",
    "First Name": "الاسم الأول",
    "Last Name": "اسم العائلة",
    "Country / Region": "الدولة / المنطقة",
    "Saudi Arabia": "المملكة العربية السعودية",
    "Street address": "العنوان",
    "House number and street name": "رقم المنزل واسم الشارع",
    "Apartment, suite, unit, etc. (optional)": "شقة، وحدة، مبنى... (اختياري)",
    "Town / City": "المدينة",
    "District (optional)": "الحي (اختياري)",
    "Phone": "رقم الجوال",
    "Email Address": "البريد الإلكتروني",
    "Order Notes (optional)": "ملاحظات الطلب (اختياري)",
    "Notes about your order, e.g. special notes for delivery.": "ملاحظات حول طلبك، مثل تعليمات التوصيل.",
    "Your Order": "طلبك",
    "Have a coupon?": "لديك كوبون؟",
    "Click here to enter your coupon code": "اضغط لإدخال رمز الكوبون",
    "Payment Method": "طريقة الدفع",
    "Moyasar — Cards & Wallets": "ميسر — بطاقات ومحافظ",
    "Secure checkout via Moyasar Payment Gateway.": "دفع آمن عبر بوابة ميسر.",
    "How would you like to pay?": "كيف تود الدفع؟",
    "Pay with Apple Pay": "ادفع بـ Apple Pay",
    "Or Pay With": "أو ادفع بـ",
    "Mada": "مدى",
    "Or Insert Card Details": "أو أدخل بيانات البطاقة",
    "Name on card": "الاسم على البطاقة",
    "Card number": "رقم البطاقة",
    "MM / YY": "شهر / سنة",
    "CVV": "الرمز",
    "Pay Now": "ادفع الآن",
    "Riyadh": "الرياض",
    "Delivery Fee": "رسوم التوصيل",
    "Order Total": "إجمالي الطلب",
    "Place Order": "أكد الطلب",
    "By placing your order you agree to our terms.": "بتأكيد الطلب فأنت توافق على الشروط.",
    "Order received": "تم استلام طلبك",
    "Thank you. We'll call to confirm shortly.": "شكراً. سنتصل لتأكيد الطلب قريباً.",
    "All prices include 15% VAT": "جميع الأسعار شاملة ضريبة القيمة المضافة 15%"
  };

  const NajdCart = {
    get(){ try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } },
    save(items){ localStorage.setItem(KEY, JSON.stringify(items)); this._syncItemTr(items); this.refresh(); },
    _syncItemTr(items){
      window.NAJD_ITEM_TR = window.NAJD_ITEM_TR || {};
      items.forEach(i => { if (i.nameAr || i.descAr) window.NAJD_ITEM_TR[i.id] = { name: i.nameAr || i.name, desc: i.descAr || i.desc || '' }; });
    },
    add(item){
      const items = this.get();
      const ex = items.find(i => i.id === item.id);
      if (ex) ex.qty += (item.qty || 1);
      else items.push({ ...item, qty: item.qty || 1 });
      this.save(items);
    },
    update(id, delta){
      const items = this.get();
      const it = items.find(i => i.id === id); if (!it) return;
      it.qty = Math.max(1, it.qty + delta);
      this.save(items);
    },
    set(id, qty){
      const items = this.get();
      const it = items.find(i => i.id === id); if (!it) return;
      it.qty = Math.max(1, qty);
      this.save(items);
    },
    remove(id){ this.save(this.get().filter(i => i.id !== id)); },
    clear(){ this.save([]); },
    count(){ return this.get().reduce((s,i) => s + i.qty, 0); },
    subtotal(){ return this.get().reduce((s,i) => s + i.price * i.qty, 0); },

    refresh(){
      const c = this.count();
      const badge = document.getElementById('cartBadge');
      if (badge){ if (c > 0){ badge.textContent = c; badge.classList.remove('hidden'); } else badge.classList.add('hidden'); }
      this.renderDrawer();
    },

    renderDrawer(){
      const wrap = document.getElementById('drawerItems');
      const sub  = document.getElementById('drawerSubtotal');
      if (!wrap) return;
      const items = this.get();
      if (!items.length){
        wrap.innerHTML = `<p class="text-center text-sm text-white/50 py-12" data-tr>Your cart is empty</p>`;
      } else {
        wrap.innerHTML = items.map(it => `
          <div class="flex gap-3 py-3 border-b border-white/5 last:border-0">
            <img src="${it.img}" alt="${it.name}" class="w-14 h-14 object-cover">
            <div class="flex-1 min-w-0">
              <p class="text-xs tracking-[0.15em] uppercase truncate" data-tr-name="${it.id}">${it.name}</p>
              <p class="text-[11px] text-white/50 mt-1">${it.qty} × ${it.price} SAR</p>
            </div>
            <div class="text-right">
              <p class="text-sm gold-text">${(it.qty * it.price).toFixed(0)} SAR</p>
              <button class="text-[10px] text-white/40 hover:text-[#d9bc7d] mt-1" data-drawer-rm="${it.id}">×</button>
            </div>
          </div>`).join('');
        wrap.querySelectorAll('[data-drawer-rm]').forEach(b => b.addEventListener('click', () => {
          this.remove(b.dataset.drawerRm);
          if (typeof renderCartPage === 'function') renderCartPage();
          this.applyLangToDynamic();
        }));
      }
      if (sub) sub.textContent = `${this.subtotal().toFixed(0)} SAR`;
      this.applyLangToDynamic();
      document.dispatchEvent(new CustomEvent('najdcart:rendered'));
    },

    initDrawer(){
      const icon = document.getElementById('cartIcon');
      const drawer = document.getElementById('cartDrawer');
      const backdrop = document.getElementById('cartBackdrop');
      const close = document.getElementById('cartDrawerClose');
      const open = () => { drawer.classList.add('open'); backdrop.classList.add('open'); };
      const shut = () => { drawer.classList.remove('open'); backdrop.classList.remove('open'); };
      if (icon) icon.addEventListener('click', () => { this.renderDrawer(); open(); });
      if (close) close.addEventListener('click', shut);
      if (backdrop) backdrop.addEventListener('click', shut);
      document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
      this._syncItemTr(this.get());
      this.refresh();
    },

    initHeader(){
      this.initDrawer();
      const lang = document.getElementById('langToggle');
      if (lang) lang.addEventListener('click', () => this.toggleLang());
      if (localStorage.getItem('najdLang') === 'ar') this.applyLang('ar');
    },

    toggleLang(){
      const cur = document.documentElement.lang === 'ar' ? 'en' : 'ar';
      this.applyLang(cur);
    },

    _origText: new WeakMap(),
    applyLang(lang){
      const html = document.documentElement;
      html.lang = lang; html.dir = lang === 'ar' ? 'rtl' : 'ltr';
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: n => n.nodeValue && n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
      });
      const nodes = []; let n; while (n = walker.nextNode()) nodes.push(n);
      nodes.forEach(node => {
        if (!this._origText.has(node)) this._origText.set(node, node.nodeValue);
        const orig = this._origText.get(node);
        const trimmed = orig.trim();
        const item = this._lookupItemTranslation(node);
        if (lang === 'ar' && item) node.nodeValue = orig.replace(trimmed, item);
        else if (lang === 'ar' && TR[trimmed]) node.nodeValue = orig.replace(trimmed, TR[trimmed]);
        else node.nodeValue = orig;
      });
      // placeholders
      document.querySelectorAll('[data-ph-ar]').forEach(el => {
        if (!el._origPh) el._origPh = el.placeholder;
        el.placeholder = lang === 'ar' ? el.getAttribute('data-ph-ar') : el._origPh;
      });
      localStorage.setItem('najdLang', lang);
    },
    applyLangToDynamic(){ this.applyLang(document.documentElement.lang || 'en'); },

    _lookupItemTranslation(node){
      const p = node.parentElement;
      if (!p) return null;
      if (p.hasAttribute('data-tr-name')){
        const id = p.getAttribute('data-tr-name');
        return (window.NAJD_ITEM_TR && window.NAJD_ITEM_TR[id] && window.NAJD_ITEM_TR[id].name) || null;
      }
      if (p.hasAttribute('data-tr-desc')){
        const id = p.getAttribute('data-tr-desc');
        return (window.NAJD_ITEM_TR && window.NAJD_ITEM_TR[id] && window.NAJD_ITEM_TR[id].desc) || null;
      }
      return null;
    }
  };

  window.NajdCart = NajdCart;
  window.NAJD_TR = TR;
})();
