const { getImage } = require('../lib/store');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  try {
    const q = req.query || {};
    const im = await getImage(q.p, q.c);
    if (!im) return res.status(404).end();
    res.setHeader('Content-Type', im.mime);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.status(200).send(im.data);
  } catch (e) { console.error(e); res.status(500).end(); }
};
