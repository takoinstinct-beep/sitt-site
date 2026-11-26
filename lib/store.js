// Shared store logic v2 (sequential ST-1001 numbers, tracking, admin). Used by api/*.js (Vercel) and netlify/functions/*.js.
// Needs env vars: MONGODB_URI (required), MONGODB_DB (optional, default "sitt").
const { MongoClient } = require('mongodb');

const CATALOG = [
  { _id: 'malika', name: 'شميز اللفّة الذهبية', price: 950, colors: ['بوردو', 'أسود', 'كريمي'], category: 'shirts', active: true },
  { _id: 'shams',  name: 'بلوزة جرس اللوتس',    price: 650, colors: ['بوردو', 'أسود', 'كريمي'], category: 'shirts', active: true },
  { _id: 'oud',    name: 'بلوزة العود الذهبي',  price: 950, colors: ['بوردو', 'أسود', 'كريمي'], category: 'shirts', active: true }
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

function authed(req) {
  const k = String(req.headers['x-admin-key'] || '');
  const s = String(process.env.ADMIN_SECRET || '');
  if (!s || k.length !== s.length) return false;
  return require('crypto').timingSafeEqual(Buffer.from(k), Buffer.from(s));
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
    if (STATUSES.includes(body.status)) set.status = body.status;
    if (typeof body.courierNo === 'string') set.courierNo = clean(body.courierNo, 60);
    if (['pending', 'paid', 'refunded'].includes(body.paymentStatus)) set['payment.status'] = body.paymentStatus;
    if (!Object.keys(set).length) return { status: 400, json: { error: 'nothing_to_update' } };
    const r = await d.collection('orders').updateOne({ _id: clean(body.orderNo, 20) }, { $set: set });
    return { status: r.matchedCount ? 200 : 404, json: { ok: !!r.matchedCount } };
  }
  if (req.method === 'GET' && act === 'products') return { status: 200, json: { products: await products() } };
  if (req.method === 'POST' && act === 'cost') {
    const cost = Number(body.cost);
    if (!(cost >= 0 && cost < 1e6)) return { status: 400, json: { error: 'bad_cost' } };
    await (await db()).collection('products').updateOne({ _id: clean(body.id, 30) }, { $set: { cost } });
    return { status: 200, json: { ok: true } };
  }
  return { status: 400, json: { error: 'bad_action' } };
}

module.exports = { products, createOrder, track, admin, authed, STATUSES };
