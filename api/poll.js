const { pollNew, serviceAuthed } = require('../lib/store');
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!serviceAuthed(req)) return res.status(401).json({ error: 'unauthorized' });
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  try { const out = await pollNew(req); res.status(out.status).json(out.json); }
  catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
};
