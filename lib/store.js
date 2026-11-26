// Shared store logic. Used by api/*.js (Vercel) and netlify/functions/*.js.
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

async function createOrder(b) {
  if (!b || typeof b !== 'object') return { status: 400, json: { error: 'bad_request' } };
  const orderNo = clean(b.orderNo, 20);
  if (!/^SITT-[A-Z0-9]{6}$/.test(orderNo)) return { status: 400, json: { error: 'bad_order_no' } };
  const c = b.customer || {}, s = b.shipping || {};
  const phone = clean(c.phone, 20).replace(/[\s-]/g, '');
  const email = clean(c.email, 120);
  if (!/^01[0125]\d{8}$/.test(phone)) return { status: 400, json: { error: 'bad_phone' } };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { status: 400, json: { error: 'bad_email' } };
  if (!clean(c.name, 100) || !clean(s.governorate, 60) || clean(s.address, 200).length < 6) return { status: 400, json: { error: 'missing_fields' } };
  if (!Array.isArray(b.items) || b.items.length === 0 || b.items.length > 30) return { status: 400, json: { error: 'no_items' } };

  const prods = await products();
  const byId = Object.fromEntries(prods.map((p) => [p._id, p]));
  const items = [];
  for (const i of b.items) {
    const p = byId[i.id];
    const qty = parseInt(i.qty, 10);
    if (!p || !(qty >= 1 && qty <= 10)) return { status: 400, json: { error: 'bad_item' } };
    items.push({ id: p._id, name: p.name, color: clean(i.color, 20), size: SIZES.includes(i.size) ? i.size : clean(i.size, 4), qty, unitPrice: p.price }); // price always from the server catalog
  }
  const subtotal = items.reduce((t, i) => t + i.qty * i.unitPrice, 0);
  const doc = {
    _id: orderNo, orderNo, items, subtotal, currency: 'EGP',
    customer: { name: clean(c.name, 100), email, phone },
    shipping: { governorate: clean(s.governorate, 60), area: clean(s.area, 60), address: clean(s.address, 200), floor: clean(s.floor, 60), landmark: clean(s.landmark, 100) },
    payment: { method: 'cod', status: 'pending' },
    status: 'awaiting_payment',
    createdAt: new Date()
  };
  const d = await db();
  try { await d.collection('orders').insertOne(doc); }
  catch (e) { if (e && e.code === 11000) return { status: 200, json: { ok: true, orderNo, duplicate: true } }; throw e; }
  return { status: 201, json: { ok: true, orderNo, subtotal } };
}

module.exports = { products, createOrder };
