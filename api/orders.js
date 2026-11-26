const { createOrder } = require('../lib/store');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  try {
    const out = await createOrder(typeof req.body === 'string' ? JSON.parse(req.body) : req.body);
    res.status(out.status).json(out.json);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
};
