const { products } = require('../lib/store');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try { res.status(200).json(await products()); }
  catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
};
