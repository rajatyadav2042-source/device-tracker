const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.TRACKER_KEY || '';   // set karoge to devices ko x-api-key bhejna hoga
const HISTORY_LIMIT = 200;
const OFFLINE_MS = 30000;

const app = express();
app.use(express.json());
app.use(express.static('public'));

const devices = new Map(); // id -> {id,name,lat,lng,speed,battery,ts}
const history = new Map(); // id -> [{lat,lng,ts}]

const view = d => ({ ...d, online: Date.now() - d.ts < OFFLINE_MS });

app.post('/api/location', (req, res) => {
  if (API_KEY && req.get('x-api-key') !== API_KEY)
    return res.status(401).json({ error: 'invalid api key' });

  const { id, name, lat, lng, speed = 0, battery = null } = req.body || {};
  if (!id || typeof lat !== 'number' || typeof lng !== 'number' ||
      Math.abs(lat) > 90 || Math.abs(lng) > 180)
    return res.status(400).json({ error: 'id, lat, lng required (valid numbers)' });

  const d = { id: String(id).slice(0, 64), name: String(name || id).slice(0, 64),
              lat, lng, speed: Number(speed) || 0, battery, ts: Date.now() };
  devices.set(d.id, d);
  const h = history.get(d.id) || [];
  h.push({ lat, lng, ts: d.ts });
  if (h.length > HISTORY_LIMIT) h.shift();
  history.set(d.id, h);

  broadcast({ type: 'update', device: view(d) });
  res.json({ ok: true });
});

app.get('/api/devices', (_, res) => res.json([...devices.values()].map(view)));
app.get('/api/devices/:id/history', (req, res) => res.json(history.get(req.params.id) || []));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

function broadcast(msg) {
  const data = JSON.stringify(msg);
  wss.clients.forEach(c => c.readyState === 1 && c.send(data));
}

wss.on('connection', ws => {
  const snapshot = [...devices.values()].map(d => ({
    ...view(d), trail: (history.get(d.id) || []).map(p => [p.lat, p.lng])
  }));
  ws.send(JSON.stringify({ type: 'snapshot', devices: snapshot }));
});

// offline status refresh
setInterval(() => broadcast({ type: 'status', devices: [...devices.values()].map(view) }), 10000);

server.listen(PORT, () => console.log(`Tracker chal raha hai: http://localhost:${PORT}`));
