const { admin, authed } = require('../lib/store');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Key');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!authed(req)) return res.status(401).json({ error: 'unauthorized' });
  try { const out = await admin(req); res.status(out.status).json(out.json); }
  catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
};
