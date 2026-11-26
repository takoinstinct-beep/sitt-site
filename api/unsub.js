const { unsubscribe } = require('../lib/store');
const { esc } = require('../lib/mail');
module.exports = async (req, res) => {
  const q = req.query || {};
  let ok = false;
  try { ok = await unsubscribe(String(q.e || ''), String(q.t || '')); } catch (e) { console.error(e); }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(ok ? 200 : 400).end('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><body dir="rtl" style="font-family:Tahoma,Arial;background:#f5eee0;color:#5c1f2e;text-align:center;padding:60px 20px"><h2>' + (ok ? 'اتلغى اشتراكك' : 'الرابط مش صالح') + '</h2><p>' + (ok ? 'مش هنبعتلك رسائل تانية. ممكن ترجعي تشتركي في أي وقت.' : 'جربي الرابط اللي في آخر إيميل وصلك.') + '</p><a href="/" style="color:#5c1f2e">ارجعي للموقع</a></body>');
};
