const { publicProducts } = require('../lib/store');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=20, stale-while-revalidate=60');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const list = await publicProducts(false);
    const legacy = ['malika', 'shams', 'oud'];
    const custom = list.some((p) => p.edited || !legacy.includes(p.id)) || list.length < 3;
    res.status(200).json({ products: list, custom });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
};
