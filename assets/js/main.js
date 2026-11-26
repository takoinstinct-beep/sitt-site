/* SITT — ست | storefront interactions (cart, wishlist, gallery, forms) */
(function () {
  'use strict';

  /* ---------- catalog ---------- */
  const PRODUCTS = {
    malika: { id: 'malika', name: 'شميز اللفّة الذهبية', price: 950, img: 'assets/img/shirt-burgundy.jpg', color: 'بوردو', isNew: true, url: 'product.html?p=malika' },
    nil:    { id: 'nil',    name: 'شميز اللفّة الذهبية',  price: 950, img: 'assets/img/shirt-black.jpg',    color: 'أسود',      url: 'product.html?p=malika' },
    oud:    { id: 'oud',    name: 'بلوزة العود الذهبي', price: 950, img: 'assets/img/oud-burgundy.jpg', color: 'بوردو', url: 'product.html?p=oud' },
    shams:  { id: 'shams',  name: 'بلوزة جرس اللوتس', price: 650, img: 'assets/img/flare-burgundy.jpg', color: 'بوردو',     url: 'product.html?p=shams' }
  };
  const DOTS = ['#33291f', '#b9a77f', '#e8dfca'];
  const CATP = (window.SITT_CAT || []);
  const IMGU = (u) => (window.SITT_IMG ? window.SITT_IMG(u) : u);
  const catImg = (p, key) => (p.images && p.images[key]) ? IMGU(p.images[key]) : (p.pre ? 'assets/img/' + p.pre + '-' + key + '.jpg' : '');
  CATP.forEach((p) => {
    const c0 = (p.colors && p.colors[0]) || { key: 'burgundy', name: '' };
    PRODUCTS[p.id] = Object.assign(PRODUCTS[p.id] || {}, { id: p.id, name: p.name, price: p.price, img: catImg(p, c0.key), color: c0.name, isNew: !!p.isNew, url: 'product.html?p=' + p.id });
  });
  if (PRODUCTS.malika && PRODUCTS.nil) { PRODUCTS.nil.name = PRODUCTS.malika.name; PRODUCTS.nil.price = PRODUCTS.malika.price; }
  const catHas = (id) => !CATP.length || CATP.some((p) => p.id === id);

  /* ---------- storage ---------- */
  const read = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v === null || v === undefined ? d : v; } catch (e) { return d; } };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  // One-time cleanup of the old demo seed (fake cart/wishlist).
  if (!localStorage.getItem('sitt_v2')) {
    if (localStorage.getItem('sitt_seeded')) { localStorage.removeItem('sitt_cart'); localStorage.removeItem('sitt_wish'); }
    localStorage.setItem('sitt_v2', '1');
  }

  const getCart = () => read('sitt_cart', []);
  const setCart = (c) => { write('sitt_cart', c); renderBagCount(); };
  const getWish = () => read('sitt_wish', []);
  const setWish = (w) => write('sitt_wish', w);

  /* ---------- helpers ---------- */
  const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
  const arNum = (n) => String(n).replace(/\d/g, (d) => AR_DIGITS[d]).replace(/,/g, '٬');
  const money = (n) => arNum(n.toLocaleString('en-US')) + ' ج.م';

  function toast(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove('on'), 2400);
  }

  function renderBagCount() {
    const n = getCart().reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll('.bag-count').forEach((b) => {
      b.textContent = arNum(n);
      b.classList.toggle('on', n > 0);
    });
  }

  const heartSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20.5s-8-4.9-8-11a4.6 4.6 0 0 1 8-3.1 4.6 4.6 0 0 1 8 3.1c0 6.1-8 11-8 11z"/></svg>';

  /* ---------- wishlist hearts on cards ---------- */
  function bindHearts(scope) {
    (scope || document).querySelectorAll('[data-wish]').forEach((btn) => {
      const id = btn.getAttribute('data-wish');
      const paint = () => btn.classList.toggle('saved', getWish().includes(id));
      paint();
      btn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        let w = getWish();
        if (w.includes(id)) { w = w.filter((x) => x !== id); toast('اتشالت من المفضلة'); }
        else { w.push(id); toast('اتضافت للمفضلة'); }
        setWish(w); paint();
        if (document.body.dataset.page === 'wishlist') renderWishlist();
      });
    });
  }

  /* ---------- card renderer (wishlist page) ---------- */
  function cardHTML(p, opts) {
    opts = opts || {};
    const dots = DOTS.map((c, i) => `<i class="dot${i === 0 ? ' on' : ''}" style="--c:${c}"></i>`).join('');
    return `<article class="card" data-id="${p.id}">
      <a class="card-img" href="${p.url}">
        <img src="${p.img}" alt="${p.name}">
        ${p.isNew ? '<span class="badge-new">جديد</span>' : ''}
        <button class="wish-heart${opts.saved ? ' saved' : ''}" data-wish="${p.id}" aria-label="المفضلة">${heartSVG}</button>
      </a>
      <h3 class="card-name">${p.name}</h3>
      <p class="card-price">${money(p.price)}</p>
      <div class="dots">${dots}</div>
    </article>`;
  }

  /* ---------- wishlist page ---------- */
  function renderWishlist() {
    const wrap = document.getElementById('wish-grid');
    if (!wrap) return;
    const ids = getWish();
    const panel = document.getElementById('wish-panel');
    if (!ids.length) {
      wrap.innerHTML = '';
      if (panel) {
        panel.querySelector('h2').textContent = 'لسه مفيش اختيارات؟';
        panel.querySelector('p').textContent = 'المفضلة بتجمع القطع اللي حبيتيها في مكان واحد. تصفحي المجموعة واضغطي على القلب عشان تحفظي القطع اللي شبهك.';
      }
      return;
    }
    wrap.innerHTML = ids.map((id) => cardHTML(PRODUCTS[id], { saved: true })).join('');
    bindHearts(wrap);
    if (panel) {
      panel.querySelector('h2').textContent = 'اختيارات تشبهك.';
      panel.querySelector('p').textContent = 'المفضلة بتجمع القطع اللي حبيتيها في مكان واحد. اختاري المقاس واللون من صفحة القطعة قبل إضافتها للحقيبة.';
    }
  }

  /* ---------- cart ---------- */
  function renderCart() {
    const wrap = document.getElementById('cart-items');
    if (!wrap) return;
    const cart = getCart();
    if (!cart.length) {
      document.getElementById('cart-layout').innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1">
          <h2 class="display">حقيبتك فاضية... لسه.</h2>
          <p>كل قطعة هنا بداية حكاية جديدة. اختاري أول قطعة في حكايتك.</p>
          <a class="btn" href="shop.html">تسوقي المجموعة <span class="arr">←</span></a>
        </div>`;
      return;
    }
    wrap.innerHTML = cart.map((item, idx) => {
      const p = PRODUCTS[item.id];
      return `<div class="cart-item" data-idx="${idx}">
        <a class="ci-img" href="${p.url}"><img src="${p.img}" alt="${p.name}"></a>
        <div>
          <h3 class="ci-name">${p.name}</h3>
          <p class="ci-meta">${item.color} / المقاس ${item.size}</p>
          <div class="ci-controls">
            <span class="qty">
              <button data-qty="-1" aria-label="أقل">−</button>
              <span>${arNum(item.qty)}</span>
              <button data-qty="1" aria-label="أكتر">+</button>
            </span>
            <button class="ci-remove" data-remove>إزالة</button>
          </div>
        </div>
        <div class="ci-price">${money(p.price * item.qty)}</div>
      </div>`;
    }).join('');

    wrap.querySelectorAll('.cart-item').forEach((row) => {
      const idx = +row.dataset.idx;
      row.querySelectorAll('[data-qty]').forEach((b) => b.addEventListener('click', () => {
        const c = getCart();
        c[idx].qty = Math.max(1, c[idx].qty + (+b.dataset.qty));
        setCart(c); renderCart();
      }));
      row.querySelector('[data-remove]').addEventListener('click', () => {
        const c = getCart(); c.splice(idx, 1); setCart(c); renderCart();
        toast('اتشالت من الحقيبة');
      });
    });

    const total = cart.reduce((s, i) => s + PRODUCTS[i.id].price * i.qty, 0);
    const st = document.getElementById('sum-total');
    if (st) st.textContent = money(total);
    const ss = document.getElementById('sum-sub');
    if (ss) ss.textContent = money(total);
  }

  /* ---------- checkout summary ---------- */
  function renderCheckoutSummary() {
    const wrap = document.getElementById('co-sum-items');
    if (!wrap) return;
    const cart = getCart();
    wrap.innerHTML = cart.map((i) => {
      const p = PRODUCTS[i.id];
      return `<div class="sum-item">
        <img src="${p.img}" alt="${p.name}">
        <div>
          <div class="si-name">${p.name}</div>
          <div class="si-meta">${i.color} / ${i.size} / الكمية ${arNum(i.qty)}</div>
        </div>
        <div class="si-price">${money(p.price * i.qty)}</div>
      </div>`;
    }).join('');
    const total = cart.reduce((s, i) => s + PRODUCTS[i.id].price * i.qty, 0);
    const t = document.getElementById('co-total');
    if (t) t.textContent = money(total);
    const s = document.getElementById('co-sub');
    if (s) s.textContent = money(total);
  }

  /* ---------- product page ---------- */
  function bindProductPage() {
    const VARS = {
      malika: { name: 'شميز اللفّة الذهبية', price: '٩٥٠ ج.م', pre: 'shirt', desc: 'قصّة ملفوفة بأزرار مائلة وحاشية مدببة، وخطوط ذهبية بالعنخ والجعران واللوتس على الياقة والكم والحاشية.' },
      oud: { name: 'بلوزة العود الذهبي', price: '٩٥٠ ج.م', pre: 'oud', desc: 'بلوزة بأكمام جرسية واسعة وطباعة ذهبية لآلة العود بأيادٍ عازفة على الصدر، وأزرار برموز مصرية على الأمام.' },
      shams: { name: 'بلوزة جرس اللوتس', price: '٦٥٠ ج.م', pre: 'flare', desc: 'بلوزة بياقة V وأكمام جرسية واسعة، أزرار برموز مصرية، وزهرة لوتس ذهبية على الصدر وتطريز على الياقة.' }
    };
    CATP.forEach((p) => {
      VARS[p.id] = Object.assign(VARS[p.id] || {}, { name: p.name, price: money(p.price), pre: p.pre || '', cat: p });
      if (p.desc) VARS[p.id].desc = p.desc; else if (!VARS[p.id].desc) VARS[p.id].desc = '';
    });
    const COLS0 = [['burgundy', 'بوردو', '#6b2335'], ['black', 'أسود', '#1b1b1b'], ['cream', 'كريمي', '#efe6d3']];
    const PID = (new URLSearchParams(location.search).get('p')) && VARS[new URLSearchParams(location.search).get('p')] ? new URLSearchParams(location.search).get('p') : 'malika';
    const V = VARS[PID];
    if (V.cat && V.cat.active === false) { location.replace('shop.html'); return; }
    const COLS = V.cat ? V.cat.colors.map((c) => [c.key, c.name, c.hex]) : COLS0;
    const imgOf = (c) => V.cat ? catImg(V.cat, c) : 'assets/img/' + V.pre + '-' + c + '.jpg';
    if (V.cat) {
      const sw = document.querySelector('.swatches');
      if (sw) sw.innerHTML = COLS.map((c, i) => '<button class="swatch' + (i ? '' : ' on') + '" data-color="' + c[1] + '" data-img="' + c[0] + '" style="--c:' + c[2] + '" aria-label="' + c[1] + '"></button>').join('');
      const cl0 = document.getElementById('color-label'); if (cl0 && COLS[0]) cl0.textContent = COLS[0][1];
      const sb = document.querySelector('.size-btn');
      if (sb && sb.parentNode && V.cat.sizes) sb.parentNode.innerHTML = V.cat.sizes.map((s) => '<button class="size-btn' + (s === 'M' || (V.cat.sizes.indexOf('M') < 0 && s === V.cat.sizes[0]) ? ' on' : '') + '" data-size="' + s + '">' + s + '</button>').join('');
    }
    if (document.getElementById('gallery-main-img')) {
      document.title = V.name + ' — ست SITT';
      const h1 = document.querySelector('h1.display'); if (h1) h1.textContent = V.name;
      const pp = document.querySelector('.p-price'); if (pp) pp.textContent = V.price;
      const pd = document.querySelector('.p-desc'); if (pd) pd.textContent = V.desc;
      const cr = document.querySelector('.crumbs'); if (cr) cr.lastChild.textContent = ' / ' + V.name;
      document.getElementById('gallery-main-img').src = imgOf(COLS[0][0]);
      const th = document.querySelector('.gallery-thumbs');
      if (th) th.innerHTML = COLS.map((c, i) => '<button class="' + (i ? '' : 'active') + '" data-src="' + imgOf(c[0]) + '"><img src="' + imgOf(c[0]) + '" alt="' + V.name + ' ' + c[1] + '"></button>').join('');
      document.querySelectorAll('.swatch').forEach((s, i) => { if (COLS[i]) s.dataset.img = COLS[i][0]; });
      document.querySelectorAll('.related-grid .card').forEach((c) => { if (c.dataset.id === PID || !catHas(c.dataset.id)) c.style.display = 'none'; });
    }
    const gallMain = document.getElementById('gallery-main-img');
    if (gallMain) {
      document.querySelectorAll('.gallery-thumbs button').forEach((b) => {
        b.addEventListener('click', () => {
          document.querySelectorAll('.gallery-thumbs button').forEach((x) => x.classList.remove('active'));
          b.classList.add('active');
          gallMain.src = b.dataset.src;
        });
      });
    }
    let size = (V.cat && V.cat.sizes && V.cat.sizes.indexOf('M') < 0) ? V.cat.sizes[0] : 'M';
    document.querySelectorAll('.size-btn').forEach((b) => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach((x) => x.classList.remove('on'));
        b.classList.add('on');
        size = b.dataset.size;
        const lbl = document.getElementById('size-label');
        if (lbl) lbl.textContent = size;
      });
    });
    let color = COLS[0][1];
    document.querySelectorAll('.swatch').forEach((s) => {
      s.addEventListener('click', () => {
        document.querySelectorAll('.swatch').forEach((x) => x.classList.remove('on'));
        s.classList.add('on');
        color = s.dataset.color;
        const lbl = document.getElementById('color-label');
        if (lbl) lbl.textContent = color;
        if (s.dataset.img && gallMain) { gallMain.src = imgOf(s.dataset.img); document.querySelectorAll('.gallery-thumbs button').forEach((x) => x.classList.toggle('active', x.dataset.src.indexOf(s.dataset.img) > -1)); }
      });
    });
    const qtySpan = document.getElementById('p-qty');
    document.querySelectorAll('[data-pqty]').forEach((b) => {
      b.addEventListener('click', () => {
        qtySpan.textContent = arNum(Math.max(1, parseInt(qtySpan.textContent.replace(/[٠-٩]/g, (d) => AR_DIGITS.indexOf(d)), 10) + (+b.dataset.pqty)));
      });
    });
    const addBtn = document.getElementById('add-to-cart');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const qty = parseInt(qtySpan.textContent.replace(/[٠-٩]/g, (d) => AR_DIGITS.indexOf(d)), 10) || 1;
        const c = getCart();
        const ex = c.find((i) => i.id === PID && i.size === size);
        if (ex) ex.qty += qty; else c.push({ id: PID, size, color, qty });
        setCart(c);
        toast('اتضافت للحقيبة');
      });
    }
    const fav = document.getElementById('fav-toggle');
    if (fav) {
      const paint = () => fav.classList.toggle('saved', getWish().includes(PID));
      paint();
      fav.addEventListener('click', () => {
        let w = getWish();
        if (w.includes(PID)) { w = w.filter((x) => x !== PID); toast('اتشالت من المفضلة'); }
        else { w.push(PID); toast('اتضافت للمفضلة'); }
        setWish(w); paint();
      });
    }
    document.querySelectorAll('.acc-head').forEach((h) => {
      h.addEventListener('click', () => {
        const body = h.nextElementSibling;
        const open = body.style.display !== 'none';
        body.style.display = open ? 'none' : '';
        h.querySelector('.pm').textContent = open ? '+' : '−';
      });
    });
  }

  /* ---------- forms ---------- */
  function bindForms() {
    document.querySelectorAll('form[data-demo]').forEach((f) => {
      f.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = f.querySelector('input[type="email"], input[type="text"]');
        if (input && input.value.trim()) {
          const v = input.value.trim();
          fetch((window.SITT_API || '') + '/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: v, source: 'form' }) }).then((r) => toast(r.ok ? 'تمام! هنوصلك أول ما يكون عندنا جديد.' : 'الإيميل مش مظبوط')).catch(() => toast('مشكلة في الاتصال، جربي تاني'));
          input.value = '';
        } else if (input) {
          toast('اكتبي بريدك الإلكتروني الأول');
          input.focus();
        }
      });
    });
    const co = document.getElementById('checkout-form');
    if (co) {
      co.addEventListener('submit', (e) => {
        e.preventDefault();
        const err = document.getElementById('co-err');
        const required = co.querySelectorAll('[required]');
        let ok = true;
        required.forEach((r) => {
          const bad = r.type === 'checkbox' ? !r.checked : !r.value.trim();
          r.style.borderColor = bad ? '#a33' : '';
          if (bad) ok = false;
        });
        if (!ok) { err.textContent = 'كمّلي البيانات المطلوبة الأول، ووافقي على الشروط.'; err.classList.add('on'); return; }
        err.classList.remove('on');
        setCart([]);
        document.getElementById('checkout-form-wrap').innerHTML = `
          <div class="co-success">
            <h2 class="display">طلبك وصلنا.</h2>
            <p>فريق ست هيراجع طلبك وهيتواصل معاكي على رقم موبايلك لتأكيد الشحن وتفاصيل الدفع قبل التجهيز.</p>
            <p style="margin-top:22px"><a class="btn" href="shop.html">كمّلي تسوق <span class="arr">←</span></a></p>
          </div>`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ---------- shop grid from the live catalog ---------- */
  function shopCard(p) {
    const cs = p.colors || [];
    const dots = cs.map((c, i) => '<button type="button" class="dot' + (i ? '' : ' on') + '" data-c="' + c.key + '" aria-label="' + c.name + '" style="--c:' + c.hex + '"></button>').join('');
    return '<article class="card" data-id="' + p.id + '"><a class="card-img" href="product.html?p=' + p.id + '"><img src="' + (cs[0] ? catImg(p, cs[0].key) : '') + '" alt="' + p.name + '">' + (p.isNew ? '<span class="badge-new">جديد</span>' : '') + '<button class="wish-heart" data-wish="' + p.id + '" aria-label="أضيفي للمفضلة">' + heartSVG + '</button></a><h3 class="card-name">' + p.name + '</h3><p class="card-price">' + money(p.price) + '</p><div class="dots">' + dots + '</div></article>';
  }
  function renderShopGrid() {
    const g = document.querySelector('.grid-products');
    if (!g || !CATP.length) return;
    const page = document.body.dataset.page || '';
    const list = CATP.filter((p) => p.active !== false && (page === 'tees' ? p.category === 'tees' : (page === 'shirts' ? p.category !== 'tees' : true)));
    if (!list.length) return;
    g.innerHTML = list.map(shopCard).join('');
    bindHearts(g);
    document.querySelectorAll('span').forEach((s) => { if (/^[٠-٩]+ قطع$/.test(s.textContent.trim())) s.textContent = arNum(list.length) + ' قطع'; });
  }

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    renderBagCount();
    renderShopGrid();
    bindHearts();
    renderWishlist();
    renderCart();
    renderCheckoutSummary();
    bindProductPage();
    bindForms();
    const y = document.querySelectorAll('[data-year]');
    y.forEach((el) => (el.textContent = '2026'));
  });
})();
