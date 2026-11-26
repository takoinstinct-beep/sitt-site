// Same logic as api/orders.js, for Netlify Functions (path: /.netlify/functions/orders).
const { createOrder } = require('../../lib/store');
const H = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Content-Type': 'application/json' };
exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: H, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: H, body: '{"error":"method_not_allowed"}' };
  try { const out = await createOrder(JSON.parse(event.body || '{}')); return { statusCode: out.status, headers: H, body: JSON.stringify(out.json) }; }
  catch (e) { console.error(e); return { statusCode: 500, headers: H, body: '{"error":"server_error"}' }; }
};
