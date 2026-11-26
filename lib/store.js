// Shared store logic v2 (sequential ST-1001 numbers, tracking, admin). Used by api/*.js (Vercel) and netlify/functions/*.js.
// Needs env vars: MONGODB_URI (required), MONGODB_DB (optional, default "sitt").
const { MongoClient } = require('mongodb');

const CATALOG = [
  { _id: 'malika', name: 'شميز اللفّة الذهبية', price: 950, colors: ['برجندي', 'أسود', 'كريمي'], category: 'shirts', active: true },
  { _id: 'shams',  name: 'بلوزة جرس اللوتس',    price: 650, colors: ['برجندي', 'أسود', 'كريمي'], category: 'shirts', active: true },
  { _id: 'oud',    name: 'بلوزة العود الذهبي',  price: 950, colors: ['برجندي', 'أسود', 'كريمي'], category: 'shirts', active: true }
];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

let clientPromise;
function db() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
  if (!clientPromise) clientPromise = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 }).connect();
  return clientPromise.then((c) => c.db(process.env.MONGODB_DB || 'sitt'));
}

async function products() {
  const d = await db();
  const col = d.collection('products');
  if ((await col.countDocuments()) === 0) await col.insertMany(CATALOG);
  return col.find({ active: true }).toArray();
}

const clean = (s, n) => String(s == null ? '' : s).replace(/[\u0000-\u001f<>]/g, ' ').trim().slice(0, n);
const STATUSES = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const SHIPPING_FEE = Number(process.env.SHIPPING_FEE || 0); // owners set this env var; 0 until confirmed


/* ---------- catalog management (founders dashboard) ---------- */
const LEGACY_COLORS = { 'برجندي': ['burgundy', '#6b2335', 'Burgundy'], 'أسود': ['black', '#1b1b1b', 'Black'], 'كريمي': ['cream', '#efe6d3', 'Cream'] };
const LEGACY_PRE = { malika: 'shirt', shams: 'flare', oud: 'oud' };
const LEGACY_EN = { malika: ['Golden Wrap Shirt', ''], shams: ['Lotus Bell Blouse', ''], oud: ['Golden Oud Blouse', ''] };
function normColors(p) {
  const cs = Array.isArray(p.colors) ? p.colors : [];
  return cs.map((c, i) => {
    if (typeof c === 'string') { const L = LEGACY_COLORS[c]; return L ? { key: L[0], name: c, nameEn: L[2], hex: L[1] } : { key: 'c' + i, name: c, nameEn: c, hex: '#999999' }; }
    return { key: String(c.key || 'c' + i), name: String(c.name || ''), nameEn: String(c.nameEn || c.name || ''), hex: String(c.hex || '#999999') };
  });
}
async function publicProducts(all) {
  const d = await db();
  await products();
  const docs = await d.collection('products').find(all ? {} : { active: true }).sort({ order: 1, createdAt: 1 }).toArray();
  const imgs = await d.collection('pimages').find({}, { projection: { p: 1, k: 1, v: 1 } }).toArray();
  const im = {};
  imgs.forEach((x) => { (im[x.p] = im[x.p] || {})[x.k] = '/api/img?p=' + encodeURIComponent(x.p) + '&c=' + encodeURIComponent(x.k) + '&v=' + x.v; });
  const out = docs.map((p) => ({
    id: p._id, name: p.name, nameEn: p.nameEn || (LEGACY_EN[p._id] || [''])[0] || '', price: p.price, cost: all ? Number(p.cost || 0) : undefined,
    desc: p.desc || '', descEn: p.descEn || '', category: p.category || 'shirts', active: p.active !== false, isNew: p.isNew === undefined ? p._id === 'malika' : !!p.isNew,
    sizes: Array.isArray(p.sizes) && p.sizes.length ? p.sizes : SIZES, colors: normColors(p), images: im[p._id] || {},
    pre: LEGACY_PRE[p._id] || '', edited: !!p.edited, order: p.order || 0
  }));
  return out;
}
const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30);
async function saveProduct(b) {
  const d = await db(); const col = d.collection('products');
  const name = clean(b.name, 80);
  if (!name) return { status: 400, json: { error: 'name_required' } };
  const price = Number(b.price);
  if (!(price >= 0 && price < 1e6)) return { status: 400, json: { error: 'bad_price' } };
  const colors = (Array.isArray(b.colors) ? b.colors : []).slice(0, 10).map((c, i) => ({
    key: slug(c.key) || 'c' + i, name: clean(c.name, 30), nameEn: clean(c.nameEn || c.name, 30), hex: /^#[0-9a-fA-F]{6}$/.test(c.hex) ? c.hex : '#999999' })).filter((c) => c.name);
  if (!colors.length) return { status: 400, json: { error: 'color_required' } };
  const sizes = (Array.isArray(b.sizes) ? b.sizes : SIZES).map((x) => clean(x, 6)).filter(Boolean).slice(0, 12);
  const set = {
    name, nameEn: clean(b.nameEn, 80), price, cost: Math.max(0, Number(b.cost) || 0), desc: clean(b.desc, 800), descEn: clean(b.descEn, 800),
    category: ['shirts', 'tees'].includes(b.category) ? b.category : 'shirts', active: b.active !== false, isNew: !!b.isNew,
    colors, sizes: sizes.length ? sizes : SIZES, edited: true, updatedAt: new Date()
  };
  let id = clean(b.id, 30);
  if (id) {
    const r = await col.updateOne({ _id: id }, { $set: set });
    if (!r.matchedCount) return { status: 404, json: { error: 'not_found' } };
  } else {
    id = slug(b.slug || b.nameEn || name) || 'p';
    if (await col.findOne({ _id: id })) id = id + '-' + Date.now().toString(36).slice(-4);
    const n = await col.countDocuments();
    await col.insertOne(Object.assign({ _id: id, order: n + 1, createdAt: new Date() }, set));
  }
  await maybeAnnounce(d, id);
  return { status: 200, json: { ok: true, id } };
}
// ---------- auto announcement of new products (flag ANNOUNCE_AUTO=1, off by default) ----------
const ANNOUNCE_SINCE = new Date('2026-11-27T00:00:00Z');
async function maybeAnnounce(d, id) {
  const log = d.collection('announcements');
  try {
    if (process.env.ANNOUNCE_AUTO !== '1') return;
    const mail = require('./mail');
    if (!mail.configured()) return;
    const p = await d.collection('products').findOne({ _id: id });
    if (!p || p.active === false || p.announcedAt || !p.createdAt || new Date(p.createdAt) < ANNOUNCE_SINCE) return;
    const placeholders = String(process.env.PLACEHOLDER_PRICES == null ? '950,650' : process.env.PLACEHOLDER_PRICES).split(',').map(Number).filter(Boolean);
    if (!(Number(p.price) > 0) || placeholders.includes(Number(p.price)) || !p.name) { await log.updateOne({ _id: id }, { $set: { at: new Date(), status: 'skipped', reason: 'placeholder_or_missing_price' } }, { upsert: true }); return; }
    const claim = await d.collection('products').updateOne({ _id: id, announcedAt: { $exists: false } }, { $set: { announcedAt: new Date() } });
    if (!claim.modifiedCount) return;
    const subs = await d.collection('subscribers').find({ unsubscribed: { $ne: true } }).sort({ _id: 1 }).limit(40).toArray();
    const t = mail.announceText({ name: p.name, price: p.price }), prod = { id: p._id, name: p.name, price: p.price };
    let sent = 0, failed = 0; const t0 = Date.now();
    for (const sb of subs) {
      if (Date.now() - t0 > 7000) break;
      try { await d.collection('announce_log').insertOne({ _id: id + '|' + sb._id, at: new Date() }); } catch (e) { continue; }
      try { await mail.send(sb._id, t.subject, t.body, prod); sent++; } catch (e) { failed++; console.error('announce fail', e && e.message); }
    }
    await log.updateOne({ _id: id }, { $set: { at: new Date(), status: 'sent', sent, failed, total: subs.length, product: p.name, price: p.price } }, { upsert: true });
  } catch (e) { console.error('announce error', e && e.message); }
}

async function saveImage(b) {
  const d = await db();
  const id = clean(b.id, 30), key = slug(b.key);
  if (!id || !key) return { status: 400, json: { error: 'bad_request' } };
  if (!(await d.collection('products').findOne({ _id: id }))) return { status: 404, json: { error: 'not_found' } };
  const m = /^data:(image\/(?:webp|jpeg|png));base64,([A-Za-z0-9+/=]+)$/.exec(String(b.data || ''));
  if (!m) return { status: 400, json: { error: 'bad_image' } };
  const buf = Buffer.from(m[2], 'base64');
  if (buf.length > 1500000) return { status: 400, json: { error: 'too_big' } };
  const v = Date.now();
  await d.collection('pimages').updateOne({ _id: id + ':' + key }, { $set: { p: id, k: key, mime: m[1], data: buf, v } }, { upsert: true });
  await d.collection('products').updateOne({ _id: id }, { $set: { edited: true, updatedAt: new Date() } });
  return { status: 200, json: { ok: true, v } };
}
async function delImage(b) {
  const d = await db();
  await d.collection('pimages').deleteOne({ _id: clean(b.id, 30) + ':' + slug(b.key) });
  await d.collection('products').updateOne({ _id: clean(b.id, 30) }, { $set: { edited: true, updatedAt: new Date() } });
  return { status: 200, json: { ok: true } };
}
async function getImage(p, c) {
  const d = await db();
  const x = await d.collection('pimages').findOne({ _id: clean(p, 30) + ':' + slug(c) });
  return x ? { mime: x.mime, data: x.data.buffer ? Buffer.from(x.data.buffer) : x.data } : null;
}
async function deleteProduct(b) {
  const d = await db(); const id = clean(b.id, 30);
  if (LEGACY_PRE[id]) { await d.collection('products').updateOne({ _id: id }, { $set: { active: false, edited: true } }); return { status: 200, json: { ok: true, hidden: true } }; }
  await d.collection('products').deleteOne({ _id: id });
  await d.collection('pimages').deleteMany({ p: id });
  return { status: 200, json: { ok: true } };
}

async function subscribe(b) {
  const email = clean(b && b.email, 120).toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) return { status: 400, json: { error: 'bad_email' } };
  const d = await db(); const col = d.collection('subscribers');
  if ((await col.countDocuments()) > 50000) return { status: 503, json: { error: 'full' } };
  const nm = clean(b.name, 40);
  const kind = b.kind === 'f' || b.kind === 'm' ? b.kind : '';
  const set = Object.assign(nm ? { name: nm } : {}, kind ? { kind } : {});
  const prev = await col.findOne({ _id: email }, { projection: { createdAt: 1, welcomeSentAt: 1, unsubscribed: 1 } });
  const r = await col.updateOne({ _id: email }, { $setOnInsert: { createdAt: new Date(), source: clean(b.source, 20) || 'site' }, $unset: { unsubscribed: '' }, ...(Object.keys(set).length ? { $set: set } : {}) }, { upsert: true });
  // welcome: brand-new address, or an address that signed up after the one-off welcome (2026-11-26 23:06Z) but never got one (auto-send was not on yet), and did not unsubscribe
  const never = prev && !prev.welcomeSentAt && !prev.unsubscribed && prev.createdAt && new Date(prev.createdAt) > new Date('2026-11-26T23:06:00Z');
  if (r.upsertedCount === 1 || never) {
    // welcome email: new addresses only, one per address; skipped when many signups arrive within a minute
    try {
      const mail = require('./mail');
      const recent = await col.countDocuments({ welcomeSentAt: { $gte: new Date(Date.now() - 60000) } });
      if (process.env.WELCOME_AUTO === '1' && mail.configured() && recent <= 10) { await mail.sendWelcome(email, nm, kind); await col.updateOne({ _id: email }, { $set: { welcomeSentAt: new Date() } }); }
    } catch (e) { console.error('welcome failed', e && e.message); }
  }
  return { status: 200, json: { ok: true } };
}
async function nextOrderNo(d) {
  const r = await d.collection('counters').findOneAndUpdate({ _id: 'orders' }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: 'after' });
  const seq = (r && (r.value || r).seq) || 1;
  return 'ST-' + (1000 + seq);
}

async function notifyNewOrder(doc) {
  // Webhook-ready hook: if NEW_ORDER_WEBHOOK_URL is set, POST the order summary (no card data exists). Failures never block the order.
  const url = process.env.NEW_ORDER_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      event: 'order.created', orderNo: doc.orderNo, createdAt: doc.createdAt, name: doc.customer.name, phone: doc.customer.phone,
      governorate: doc.shipping.governorate, address: doc.shipping.address, items: doc.items, total: doc.total, paymentMethod: doc.payment.method }) });
  } catch (e) { console.error('webhook failed', e && e.message); }
}

async function createOrder(b) {
  if (!b || typeof b !== 'object') return { status: 400, json: { error: 'bad_request' } };
  const c = b.customer || {}, s = b.shipping || {};
  const phone = clean(c.phone, 20).replace(/[\s-]/g, '');
  if (!/^01[0125]\d{8}$/.test(phone)) return { status: 400, json: { error: 'bad_phone' } };
  if (!clean(c.name, 100) || !clean(s.governorate, 60) || clean(s.address, 200).length < 6) return { status: 400, json: { error: 'missing_fields' } };
  if (!Array.isArray(b.items) || b.items.length === 0 || b.items.length > 30) return { status: 400, json: { error: 'no_items' } };
  const clientRef = clean(b.clientRef || b.orderNo, 40);
  const d = await db();
  if (clientRef) { const dup = await d.collection('orders').findOne({ clientRef }); if (dup) return { status: 200, json: { ok: true, orderNo: dup.orderNo, duplicate: true } }; }

  const prods = await products();
  const byId = Object.fromEntries(prods.map((p) => [p._id, p]));
  const items = [];
  for (const i of b.items) {
    const p = byId[i.id];
    const qty = parseInt(i.qty, 10);
    if (!p || !(qty >= 1 && qty <= 10)) return { status: 400, json: { error: 'bad_item' } };
    items.push({ id: p._id, name: p.name, color: clean(i.color, 20), size: clean(i.size, 4), qty, unitPrice: p.price, unitCost: Number(p.cost || 0) });
  }
  const subtotal = items.reduce((t, i) => t + i.qty * i.unitPrice, 0);
  const doc = {
    orderNo: await nextOrderNo(d), clientRef, items, subtotal, shippingFee: SHIPPING_FEE, total: subtotal + SHIPPING_FEE, currency: 'EGP',
    customer: { name: clean(c.name, 100), phone, email: clean(c.email, 120) },
    shipping: { governorate: clean(s.governorate, 60), area: clean(s.area, 60), address: clean(s.address, 200), floor: clean(s.floor, 60), landmark: clean(s.landmark, 100) },
    notes: clean(b.notes, 300),
    payment: { method: 'cod', status: 'pending' },
    status: 'new', courierNo: '', demo: false, createdAt: new Date()
  };
  doc._id = doc.orderNo;
  await d.collection('orders').insertOne(doc);
  await notifyNewOrder(doc);
  return { status: 201, json: { ok: true, orderNo: doc.orderNo, subtotal, shippingFee: doc.shippingFee, total: doc.total } };
}

async function track(orderNo, phone) {
  const d = await db();
  const o = await d.collection('orders').findOne({ orderNo: clean(orderNo, 20).toUpperCase(), 'customer.phone': clean(phone, 20).replace(/[\s-]/g, '') });
  if (!o) return { status: 404, json: { error: 'not_found' } };
  return { status: 200, json: { orderNo: o.orderNo, status: o.status, courierNo: o.courierNo || '', createdAt: o.createdAt, items: o.items.map(({ name, color, size, qty }) => ({ name, color, size, qty })), total: o.total, payment: o.payment } };
}

const crypto = require('crypto');
const b64 = (b) => Buffer.from(b).toString('base64url');
function sign(payload) { return crypto.createHmac('sha256', String(process.env.SESSION_SECRET || '')).update(payload).digest('base64url'); }
function makeToken(email) { const p = b64(JSON.stringify({ e: email, x: Date.now() + 12 * 3600 * 1000 })); return p + '.' + sign(p); }
function verifyToken(tok) {
  if (!process.env.SESSION_SECRET || !tok) return null;
  const [p, sg] = String(tok).split('.');
  if (!p || !sg) return null;
  const good = sign(p);
  if (sg.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sg), Buffer.from(good))) return null;
  try { const d = JSON.parse(Buffer.from(p, 'base64url').toString()); return d.x > Date.now() ? d.e : null; } catch (e) { return null; }
}
function hashPw(pw, salt) { return crypto.scryptSync(String(pw), salt, 64).toString('hex'); }
const allowedEmails = () => String(process.env.ADMIN_EMAILS || '').toLowerCase().split(',').map((x) => x.trim()).filter(Boolean);
function ipOf(req) { return String((req.headers['x-forwarded-for'] || '').split(',')[0] || 'x').trim(); }

// Returns {email} when a valid session token is sent, else null.
function authed(req) {
  const h = String(req.headers.authorization || '');
  const email = verifyToken(h.startsWith('Bearer ') ? h.slice(7) : '');
  return email && allowedEmails().includes(email) ? email : null;
}

async function login(req, body) {
  const d = await db();
  const email = clean(body.email, 120).toLowerCase();
  const key = ipOf(req) + '|' + email;
  const att = d.collection('login_attempts');
  const since = new Date(Date.now() - 15 * 60 * 1000);
  const fails = await att.countDocuments({ key, at: { $gte: since } });
  if (fails >= 5) return { status: 429, json: { error: 'too_many_attempts' } };
  const u = allowedEmails().includes(email) ? await d.collection('admins').findOne({ _id: email }) : null;
  // constant-ish work even for unknown users
  const salt = u ? u.salt : 'x'.repeat(32);
  const h = hashPw(String(body.password || ''), salt);
  const ok = u && h.length === u.hash.length && crypto.timingSafeEqual(Buffer.from(h), Buffer.from(u.hash));
  if (!ok) { await att.insertOne({ key, at: new Date() }); return { status: 401, json: { error: 'invalid_credentials' } }; }
  await att.deleteMany({ key });
  return { status: 200, json: { token: makeToken(email), name: u.name, email } };
}

// One-time/maintenance: set a founder's password. Guarded by ADMIN_SETUP_KEY (env), only for emails in ADMIN_EMAILS.
async function setPassword(body) {
  const sk = String(process.env.ADMIN_SETUP_KEY || '');
  const k = String(body.setupKey || '');
  if (!sk || k.length !== sk.length || !crypto.timingSafeEqual(Buffer.from(k), Buffer.from(sk))) return { status: 401, json: { error: 'unauthorized' } };
  const email = clean(body.email, 120).toLowerCase();
  if (!allowedEmails().includes(email)) return { status: 400, json: { error: 'email_not_allowed' } };
  const pw = String(body.password || '');
  if (pw.length < 8) return { status: 400, json: { error: 'weak_password' } };
  const salt = crypto.randomBytes(16).toString('hex');
  await (await db()).collection('admins').updateOne({ _id: email }, { $set: { name: clean(body.name, 60), salt, hash: hashPw(pw, salt), updatedAt: new Date() } }, { upsert: true });
  return { status: 200, json: { ok: true } };
}

// One-time invite links. Token is random, only its sha256 is stored. Created with ADMIN_SETUP_KEY; redeemed once, expires.
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');
function setupOk(body) {
  const sk = String(process.env.ADMIN_SETUP_KEY || ''); const k = String(body.setupKey || '');
  return sk && k.length === sk.length && crypto.timingSafeEqual(Buffer.from(k), Buffer.from(sk));
}
async function createInvite(body) {
  if (!setupOk(body)) return { status: 401, json: { error: 'unauthorized' } };
  const email = clean(body.email, 120).toLowerCase();
  if (!allowedEmails().includes(email)) return { status: 400, json: { error: 'email_not_allowed' } };
  const hours = Math.min(Math.max(Number(body.hours) || 72, 1), 168);
  const token = crypto.randomBytes(32).toString('hex');
  const d = await db();
  await d.collection('invites').updateMany({ email, used: false }, { $set: { used: true, revoked: true } });
  await d.collection('invites').insertOne({ _id: sha(token), email, name: clean(body.name, 60), used: false, expiresAt: new Date(Date.now() + hours * 3600 * 1000), createdAt: new Date() });
  return { status: 200, json: { token, expiresInHours: hours } };
}
async function inviteLimit(req, d) {
  const att = d.collection('login_attempts'); const key = 'inv|' + ipOf(req);
  const fails = await att.countDocuments({ key, at: { $gte: new Date(Date.now() - 15 * 60 * 1000) } });
  return { att, key, blocked: fails >= 10 };
}
async function inviteInfo(req, body) {
  const d = await db(); const lim = await inviteLimit(req, d);
  if (lim.blocked) return { status: 429, json: { error: 'too_many_attempts' } };
  const inv = await d.collection('invites').findOne({ _id: sha(body.token || ''), used: false, expiresAt: { $gt: new Date() } });
  if (!inv) { await lim.att.insertOne({ key: lim.key, at: new Date() }); return { status: 404, json: { error: 'invalid_or_expired' } }; }
  return { status: 200, json: { name: inv.name, email: inv.email } };
}
async function acceptInvite(req, body) {
  const d = await db(); const lim = await inviteLimit(req, d);
  if (lim.blocked) return { status: 429, json: { error: 'too_many_attempts' } };
  const pw = String(body.password || '');
  if (pw.length < 10) return { status: 400, json: { error: 'weak_password' } };
  const inv = await d.collection('invites').findOneAndUpdate({ _id: sha(body.token || ''), used: false, expiresAt: { $gt: new Date() } }, { $set: { used: true, usedAt: new Date() } }, { returnDocument: 'before' });
  const doc = inv && (inv.value !== undefined ? inv.value : inv);
  if (!doc || !doc.email) { await lim.att.insertOne({ key: lim.key, at: new Date() }); return { status: 404, json: { error: 'invalid_or_expired' } }; }
  const salt = crypto.randomBytes(16).toString('hex');
  await d.collection('admins').updateOne({ _id: doc.email }, { $set: { name: doc.name, salt, hash: hashPw(pw, salt), updatedAt: new Date() } }, { upsert: true });
  return { status: 200, json: { ok: true, email: doc.email } };
}

function acctStats(orders, cfg, from, to) {
  var iso = function (v) { return new Date(v).toISOString(); };
  var o = { count: 0, revenue: 0, gross: 0, refunds: 0, cost: 0, gatewayFees: 0, shippingCost: 0, profit: 0, deferred: 0, deferredCount: 0, openCod: 0, openCodCount: 0, receivable: 0, receivableCount: 0, refundDue: 0, refundDueCount: 0, funnel: {}, cancelled: 0, byProduct: {}, byColor: {}, bySize: {}, byMonth: {}, recon: { total: 0, delivered: 0, deferred: 0, open: 0, refundedEarly: 0 } };
  orders.forEach(function (x) {
    var created = iso(x.createdAt).slice(0, 10), inC = !((from && created < from) || (to && created > to));
    var pay = x.payment || {}, ps = pay.status || 'pending', cod = !pay.method || pay.method === 'cod', total = Number(x.total) || 0;
    if (inC) {
      o.funnel[x.status] = (o.funnel[x.status] || 0) + 1;
      if (x.status === 'cancelled') o.cancelled++;
      else x.items.forEach(function (i) {
        var p = o.byProduct[i.id] || (o.byProduct[i.id] = { name: i.name, qty: 0, revenue: 0 });
        p.qty += i.qty; p.revenue += i.qty * i.unitPrice;
        o.byColor[i.color] = (o.byColor[i.color] || 0) + i.qty; o.bySize[i.size] = (o.bySize[i.size] || 0) + i.qty;
      });
    }
    if (x.status === 'cancelled') { if (ps === 'paid') { o.refundDue += total; o.refundDueCount++; } return; }
    o.recon.total += total;
    if (x.status === 'delivered') {
      o.recon.delivered += total;
      if (ps === 'pending') { o.receivable += total; o.receivableCount++; }
      var rd = iso(x.deliveredAt || x.updatedAt || x.createdAt).slice(0, 10);
      if ((from && rd < from) || (to && rd > to)) return;
      var refunded = ps === 'refunded', net = refunded ? 0 : total;
      var cost = refunded ? 0 : x.items.reduce(function (s, i) { return s + i.qty * (i.unitCost || 0); }, 0);
      var fee = refunded || cod ? 0 : total * (cfg.gatewayPct || 0) / 100, ship = refunded ? 0 : (cfg.courierCost || 0);
      o.gross += total; if (refunded) o.refunds += total; else o.count++;
      o.revenue += net; o.cost += cost; o.gatewayFees += fee; o.shippingCost += ship;
      var m = rd.slice(0, 7), mm = o.byMonth[m] || (o.byMonth[m] = { revenue: 0, profit: 0, orders: 0 });
      mm.revenue += net; mm.profit += net - cost - fee - ship; if (!refunded) mm.orders++;
    } else if (ps === 'paid') { o.deferred += total; o.deferredCount++; o.recon.deferred += total; }
    else if (ps === 'refunded') o.recon.refundedEarly += total;
    else { o.openCod += total; o.openCodCount++; o.recon.open += total; }
  });
  o.profit = o.revenue - o.cost - o.gatewayFees - o.shippingCost;
  return o;
}

// ---------- returns / exchange requests ----------
const RET_STATUSES = ['new', 'contacted', 'approved', 'rejected', 'received', 'exchanged'];
const RET_REASONS = ['size', 'color', 'defect', 'notasdescribed', 'changed', 'other'];
const normPhone = (p) => clean(p, 20).replace(/[\s-]/g, '').replace(/^\+?20/, '0');
async function findOrderFor(d, orderNo, phone) {
  const no = clean(orderNo, 20).toUpperCase();
  const ph = normPhone(phone);
  const cands = [ph, ph.replace(/^0/, '+20'), ph.replace(/^0/, '20')];
  return d.collection('orders').findOne({ orderNo: no, 'customer.phone': { $in: cands } });
}
async function returnLookup(orderNo, phone) {
  const d = await db();
  const o = await findOrderFor(d, orderNo, phone);
  if (!o || o.status === 'cancelled') return { status: 404, json: { error: 'not_found' } };
  const prev = await d.collection('returns').find({ orderNo: o.orderNo }).project({ _id: 1, status: 1, type: 1, itemIdx: 1, createdAt: 1 }).toArray();
  return { status: 200, json: { orderNo: o.orderNo, orderStatus: o.status, createdAt: o.createdAt, items: o.items.map((i, k) => ({ idx: k, name: i.name, color: i.color, size: i.size, qty: i.qty })), previous: prev.map((r) => ({ id: r._id, status: r.status, type: r.type, itemIdx: r.itemIdx })) } };
}
async function returnCreate(b) {
  b = b || {};
  const d = await db();
  const o = await findOrderFor(d, b.orderNo, b.phone);
  if (!o || o.status === 'cancelled') return { status: 404, json: { error: 'not_found' } };
  const idx = Number(b.itemIdx);
  if (!Number.isInteger(idx) || !o.items[idx]) return { status: 400, json: { error: 'bad_item' } };
  const type = b.type === 'return' ? 'return' : 'exchange';
  const reason = RET_REASONS.includes(b.reason) ? b.reason : 'other';
  const open = await d.collection('returns').countDocuments({ orderNo: o.orderNo, itemIdx: idx, status: { $in: ['new', 'contacted', 'approved', 'received'] } });
  if (open) return { status: 409, json: { error: 'already_requested' } };
  if ((await d.collection('returns').countDocuments({ orderNo: o.orderNo })) >= 6) return { status: 429, json: { error: 'too_many' } };
  const it = o.items[idx];
  const r = await d.collection('counters').findOneAndUpdate({ _id: 'returns' }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: 'after' });
  const id = 'RT-' + (1000 + (r.seq || (r.value && r.value.seq) || 1));
  const doc = {
    _id: id, orderNo: o.orderNo, customer: { name: clean(o.customer && o.customer.name, 80), phone: clean(o.customer && o.customer.phone, 20) },
    itemIdx: idx, item: { name: it.name, color: it.color, size: it.size, qty: it.qty }, type, reason, note: clean(b.note, 400),
    wantSize: clean(b.wantSize, 6), orderStatus: o.status, status: 'new', handledBy: '', adminNotes: '', createdAt: new Date(), updatedAt: new Date()
  };
  await d.collection('returns').insertOne(doc);
  return { status: 200, json: { ok: true, id } };
}
async function returnsList(d) { return d.collection('returns').find({}).sort({ createdAt: -1 }).limit(500).toArray(); }
async function returnUpdate(d, body, email) {
  const set = { updatedAt: new Date() };
  if (RET_STATUSES.includes(body.status)) set.status = body.status;
  if (typeof body.adminNotes === 'string') set.adminNotes = clean(body.adminNotes, 600);
  if (typeof body.handledBy === 'string') set.handledBy = clean(body.handledBy, 60);
  else if (email) { const a = await d.collection('admins').findOne({ _id: email }); set.handledBy = (a && a.name) || email; }
  const res = await d.collection('returns').updateOne({ _id: clean(body.id, 20) }, { $set: set });
  return { status: res.matchedCount ? 200 : 404, json: { ok: !!res.matchedCount, handledBy: set.handledBy } };
}

// ---------- newsletter ----------
async function unsubscribe(email, t) {
  const m = require('./mail');
  email = clean(email, 120).toLowerCase();
  if (!email || !m.unsubOk(email, t)) return false;
  const d = await db();
  await d.collection('subscribers').updateOne({ _id: email }, { $set: { unsubscribed: true, unsubscribedAt: new Date() } });
  return true;
}
async function mailProduct(d, id) {
  if (!id) return null;
  const p = await d.collection('products').findOne({ _id: clean(id, 60) });
  return p ? { id: p._id, name: p.name, price: p.price } : null;
}
async function mailAdmin(d, act, body, email) {
  const m = require('./mail');
  const active = () => d.collection('subscribers').countDocuments({ unsubscribed: { $ne: true } });
  const subject = clean(body.subject, 150), text = String(body.body == null ? '' : body.body).replace(/[\u0000-\u0008]/g, '').slice(0, 5000);
  if (act === 'mail-status') return { status: 200, json: { configured: m.configured(), recipients: await active() } };
  if (!subject || !text.trim()) return { status: 400, json: { error: 'empty' } };
  const product = await mailProduct(d, body.productId);
  if (act === 'mail-preview') return { status: 200, json: { html: m.render(subject, text, product, 'preview@example.com').html } };
  if (!m.configured()) return { status: 503, json: { error: 'smtp_not_configured' } };
  if (act === 'mail-test') {
    try { await m.send(email, '[تجربة] ' + subject, text, product); } catch (e) { console.error('mail test', e && e.message); return { status: 502, json: { error: 'send_failed' } }; }
    return { status: 200, json: { ok: true, to: email } };
  }
  if (act === 'mail-send') {
    let c;
    if (body.campaignId) c = await d.collection('campaigns').findOne({ _id: clean(body.campaignId, 40) });
    else {
      const n = await active();
      if (!n || Number(body.confirmCount) !== n) return { status: 409, json: { error: 'count_mismatch', recipients: n } };
      c = { _id: 'C' + Date.now(), subject, body: text, productId: product ? product.id : '', total: n, sent: 0, failed: 0, cursor: '', by: email, createdAt: new Date(), done: false };
      await d.collection('campaigns').insertOne(c);
    }
    if (!c) return { status: 404, json: { error: 'not_found' } };
    if (c.done) return { status: 200, json: { ok: true, done: true, sent: c.sent, failed: c.failed, total: c.total, campaignId: c._id } };
    const batch = await d.collection('subscribers').find({ unsubscribed: { $ne: true }, _id: { $gt: c.cursor } }).sort({ _id: 1 }).limit(15).toArray();
    const prod = await mailProduct(d, c.productId);
    let sent = 0, failed = 0;
    for (const s of batch) { try { await m.send(s._id, c.subject, c.body, prod); sent++; } catch (e) { failed++; console.error('mail fail', e && e.message); } }
    const done = batch.length < 15;
    const cursor = batch.length ? batch[batch.length - 1]._id : c.cursor;
    await d.collection('campaigns').updateOne({ _id: c._id }, { $set: { cursor, done }, $inc: { sent, failed } });
    return { status: 200, json: { ok: true, done, sent: c.sent + sent, failed: c.failed + failed, total: c.total, campaignId: c._id } };
  }
  return null;
}

async function admin(req) {
  const d = await db();
  const q = req.query || {};
  const body = typeof req.body === 'string' ? (req.body ? JSON.parse(req.body) : {}) : (req.body || {});
  const act = q.action || body.action;
  if (req.method === 'GET' && act === 'orders') {
    const f = {};
    if (STATUSES.includes(q.status)) f.status = q.status;
    return { status: 200, json: { orders: await d.collection('orders').find(f).sort({ createdAt: -1 }).limit(500).toArray() } };
  }
  if (req.method === 'POST' && act === 'update') {
    const set = {};
    if (STATUSES.includes(body.status)) { set.status = body.status; set.updatedAt = new Date(); if (body.status === 'delivered') { const cur = await d.collection('orders').findOne({ _id: clean(body.orderNo, 20) }, { projection: { status: 1, deliveredAt: 1 } }); if (!cur || cur.status !== 'delivered' || !cur.deliveredAt) set.deliveredAt = new Date(); } }
    if (typeof body.courierNo === 'string') set.courierNo = clean(body.courierNo, 60);
    if (['pending', 'paid', 'refunded'].includes(body.paymentStatus)) set['payment.status'] = body.paymentStatus;
    if (!Object.keys(set).length) return { status: 400, json: { error: 'nothing_to_update' } };
    const r = await d.collection('orders').updateOne({ _id: clean(body.orderNo, 20) }, { $set: set });
    return { status: r.matchedCount ? 200 : 404, json: { ok: !!r.matchedCount } };
  }
  if (req.method === 'POST' && act === 'delete-test') {
    const r = await d.collection('orders').deleteOne({ _id: clean(body.orderNo, 20), 'customer.name': /^TEST/ });
    return { status: 200, json: { deleted: r.deletedCount } };
  }
  if (req.method === 'GET' && act === 'mail-status') return mailAdmin(d, act, body, authed(req));
  if (req.method === 'POST' && ['mail-preview', 'mail-test', 'mail-send'].includes(act)) return mailAdmin(d, act, body, authed(req));
  if (req.method === 'GET' && act === 'announcements') return { status: 200, json: { announcements: await d.collection('announcements').find({}).sort({ at: -1 }).limit(50).toArray() } };
  if (req.method === 'GET' && act === 'returns') return { status: 200, json: { returns: await returnsList(d) } };
  if (req.method === 'POST' && act === 'return-update') return returnUpdate(d, body, authed(req));
  if (req.method === 'GET' && act === 'products') return { status: 200, json: { products: await publicProducts(true) } };
  if (req.method === 'GET' && act === 'subscribers') return { status: 200, json: { subscribers: await d.collection('subscribers').find({}).sort({ createdAt: -1 }).toArray() } };
  if (req.method === 'POST' && act === 'product-save') return saveProduct(body);
  if (req.method === 'POST' && act === 'product-image') return saveImage(body);
  if (req.method === 'POST' && act === 'product-image-del') return delImage(body);
  if (req.method === 'POST' && act === 'product-del') return deleteProduct(body);
  if (req.method === 'POST' && act === 'cost') {
    const cost = Number(body.cost);
    if (!(cost >= 0 && cost < 1e6)) return { status: 400, json: { error: 'bad_cost' } };
    await d.collection('products').updateOne({ _id: clean(body.id, 30) }, { $set: { cost } });
    return { status: 200, json: { ok: true } };
  }
  if (req.method === 'GET' && act === 'stats') {
    const orders = await d.collection('orders').find({}).toArray();
    return { status: 200, json: acctStats(orders, { gatewayPct: Number(process.env.GATEWAY_FEE_PCT || 0), courierCost: Number(process.env.COURIER_COST || 0) }, String(q.from || ''), String(q.to || '')) };
  }
  return { status: 400, json: { error: 'bad_action' } };
}

function serviceAuthed(req) {
  const k = String(req.headers['x-service-token'] || '');
  const s = String(process.env.SERVICE_TOKEN || '');
  return !!s && k.length === s.length && crypto.timingSafeEqual(Buffer.from(k), Buffer.from(s));
}
// Orders not yet announced (for a polling notifier). POST marks them announced.
async function pollNew(req) {
  const d = await db();
  const body = typeof req.body === 'string' ? (req.body ? JSON.parse(req.body) : {}) : (req.body || {});
  if (req.method === 'POST') {
    const nos = Array.isArray(body.orderNos) ? body.orderNos.slice(0, 50).map((x) => clean(x, 20)) : [];
    const r = await d.collection('orders').updateMany({ _id: { $in: nos } }, { $set: { notified: true } });
    return { status: 200, json: { marked: r.modifiedCount } };
  }
  const list = await d.collection('orders').find({ notified: { $ne: true }, demo: { $ne: true } }).sort({ createdAt: 1 }).limit(20).toArray();
  return { status: 200, json: { orders: list.map((o) => ({ orderNo: o.orderNo, createdAt: o.createdAt, name: o.customer.name, phone: o.customer.phone, governorate: o.shipping.governorate, area: o.shipping.area, address: o.shipping.address, notes: o.notes, items: o.items.map((i) => ({ name: i.name, color: i.color, size: i.size, qty: i.qty })), total: o.total, paymentMethod: o.payment.method })) } };
}

module.exports = { unsubscribe, returnLookup, returnCreate, subscribe, publicProducts, getImage, pollNew, serviceAuthed, products, createOrder, track, admin, authed, login, setPassword, createInvite, inviteInfo, acceptInvite, STATUSES };
