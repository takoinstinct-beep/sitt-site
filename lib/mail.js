// Newsletter mail: SMTP via env vars (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM_NAME). Nothing is sent without them.
const crypto = require('crypto');
const SITE = process.env.SITE_URL || 'https://sitt-site-eosin.vercel.app';
const ADDRESS = process.env.MAIL_ADDRESS || 'Suez Bridge, Cairo 11871, Egypt';
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const secret = () => String(process.env.SESSION_SECRET || '');
const unsubToken = (email) => crypto.createHmac('sha256', secret()).update('unsub:' + String(email).toLowerCase()).digest('base64url').slice(0, 32);
const unsubUrl = (email) => SITE + '/api/unsub?e=' + encodeURIComponent(email) + '&t=' + unsubToken(email);
const unsubOk = (email, t) => { const a = Buffer.from(unsubToken(email)); const b = Buffer.from(String(t || '')); return secret() && a.length === b.length && crypto.timingSafeEqual(a, b); };
const configured = () => !!(process.env.SMTP_USER && process.env.SMTP_PASS);

function render(subject, body, product, email) {
  const paras = String(body || '').split(/\n{2,}/).map((p) => '<p style="margin:0 0 14px;line-height:1.8">' + esc(p).replace(/\n/g, '<br>') + '</p>').join('');
  const prod = product ? '<div style="border:1px solid #cba85e;padding:16px;margin:18px 0;text-align:center"><div style="font-size:18px;color:#5c1f2e">' + esc(product.name) + '</div><div style="margin:6px 0;color:#555">' + esc(product.price) + ' ج.م</div><a href="' + SITE + '/product.html?p=' + encodeURIComponent(product.id) + '" style="display:inline-block;background:#5c1f2e;color:#f5eee0;padding:10px 22px;text-decoration:none;margin-top:6px">شوفيها دلوقتي</a></div>' : '';
  const un = email ? unsubUrl(email) : SITE + '/api/unsub';
  const html = '<!doctype html><html lang="ar" dir="rtl"><body style="margin:0;background:#f5eee0;font-family:Tahoma,Arial,sans-serif;color:#2b2020"><div style="max-width:560px;margin:0 auto;padding:24px"><div style="text-align:center;font-size:28px;letter-spacing:6px;color:#5c1f2e;margin-bottom:18px">SITT · ست</div><div style="background:#fff;padding:22px;border:1px solid #e3d6b8"><h2 style="margin:0 0 14px;color:#5c1f2e;font-size:20px">' + esc(subject) + '</h2>' + paras + prod + '</div><div style="text-align:center;font-size:12px;color:#777;margin-top:16px;line-height:1.8">' + esc(ADDRESS) + '<br><a href="' + un + '" style="color:#777">إلغاء الاشتراك</a></div></div></body></html>';
  const text = subject + '\n\n' + body + (product ? '\n\n' + product.name + ' - ' + product.price + ' EGP\n' + SITE + '/product.html?p=' + product.id : '') + '\n\n' + ADDRESS + '\nUnsubscribe: ' + un;
  return { html, text, unsub: un };
}

let tr;
function transport() {
  if (tr) return tr;
  const nm = require('nodemailer');
  tr = nm.createTransport({ host: process.env.SMTP_HOST || 'smtp.gmail.com', port: Number(process.env.SMTP_PORT || 465), secure: Number(process.env.SMTP_PORT || 465) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  return tr;
}
async function send(to, subject, body, product) {
  if (!configured()) throw new Error('smtp_not_configured');
  const r = render(subject, body, product, to);
  await transport().sendMail({ from: '"' + (process.env.MAIL_FROM_NAME || 'SITT ست') + '" <' + process.env.SMTP_USER + '>', to, subject, html: r.html, text: r.text, headers: { 'List-Unsubscribe': '<' + r.unsub + '>', 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } });
}
function welcomeText(name, kind) {
  const nm = String(name || '').replace(/[\u0000-\u001f<>]/g, ' ').trim().slice(0, 40);
  const hi = (d) => (nm ? 'أهلًا ' + nm + '،' : d);
  if (kind === 'f') return { subject: 'أهلًا بيكي في ست', body: hi('أهلًا بيكي.') + '\n\nشكرًا إنك اشتركتي معانا. إحنا ست، براند هدوم طالع من جذور مصرية ملكية، ونفسنا كل قطعة تحس إنها بتحكي حكايتك إنتِ.\n\nهنبعتلك بس لما يكون عندنا حاجة تستاهل: قطعة جديدة، أو خبر عن الموقع. مش هنزعجك.\n\nلو حبيتي تعرفي أكتر عننا، الموقع مفتوح: sitt-site-eosin.vercel.app\n\nنورتينا.\nست' };
  if (kind === 'm') return { subject: 'أهلًا بيك في ست', body: hi('أهلًا بيك.') + '\n\nشكرًا إنك اشتركت معانا. إحنا ست، براند هدوم طالع من جذور مصرية ملكية، وكل قطعة عندنا بتحكي حكاية.\n\nلو بتدور على هدية، ده مكانها: أختك، مراتك، خطيبتك، صاحبتك، أو أي حد غالي عليك. هدية ليها معنى، مش مجرد هدوم.\n\nهنبعتلك بس لما يكون عندنا حاجة تستاهل: قطعة جديدة، أو خبر عن الموقع. من غير إزعاج.\n\nتعرّف علينا أكتر على الموقع: sitt-site-eosin.vercel.app\n\nنورتنا.\nست' };
  return { subject: 'أهلًا وسهلًا في ست', body: hi('أهلًا وسهلًا،') + '\n\nشكرًا على اشتراكك. إحنا ست، براند هدوم طالع من جذور مصرية ملكية، ونفسنا كل قطعة تحكي حكاية.\n\nهنبعتلك بس لما يكون عندنا حاجة تستاهل: قطعة جديدة، أو خبر عن الموقع. من غير إزعاج.\n\nتعرّف علينا أكتر على الموقع: sitt-site-eosin.vercel.app\n\nأهلًا وسهلًا بيكم في ست.\nست' };
}
async function sendWelcome(email, name, kind) {
  const w = welcomeText(name, kind);
  await send(email, w.subject, w.body, null);
}
module.exports = { welcomeText, sendWelcome, render, send, configured, unsubOk, esc };
