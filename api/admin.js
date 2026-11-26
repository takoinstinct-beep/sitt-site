const { admin, authed, login, setPassword, createInvite, inviteInfo, acceptInvite } = require('../lib/store');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    const q = req.query || {};
    const body = typeof req.body === 'string' ? (req.body ? JSON.parse(req.body) : {}) : (req.body || {});
    const act = q.action || body.action;
    let out;
    if (req.method === 'POST' && act === 'login') out = await login(req, body);
    else if (req.method === 'POST' && act === 'setpw') out = await setPassword(body);
    else if (req.method === 'POST' && act === 'invite') out = await createInvite(body);
    else if (req.method === 'POST' && act === 'inviteinfo') out = await inviteInfo(req, body);
    else if (req.method === 'POST' && act === 'accept') out = await acceptInvite(req, body);
    else if (!authed(req)) out = { status: 401, json: { error: 'unauthorized' } };
    else out = await admin(req);
    res.status(out.status).json(out.json);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
};
