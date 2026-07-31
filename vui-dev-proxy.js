/**
 * Dev-only: proxy /api/voice/* from patient HTTPS → local voice-ws (Node).
 * Avoids mixed-content block (wss://local… → ws://127.0.0.1:3001).
 *
 * Override target: VUI_PROXY_TARGET=http://127.0.0.1:3001
 */
const http = require('http');
const { URL } = require('url');

const TARGET = process.env.VUI_PROXY_TARGET || 'http://127.0.0.1:3001';

function isVoicePath(pathname) {
  return pathname === '/api/voice' || pathname.startsWith('/api/voice/');
}

function targetUrl(reqUrl) {
  return new URL(reqUrl, TARGET);
}

function proxyHttp(req, res) {
  const dest = targetUrl(req.url);
  const headers = { ...req.headers, host: dest.host };
  delete headers['accept-encoding'];

  const upstream = http.request(
    {
      protocol: dest.protocol,
      hostname: dest.hostname,
      port: dest.port || 80,
      path: dest.pathname + dest.search,
      method: req.method,
      headers,
    },
    upRes => {
      res.writeHead(upRes.statusCode || 502, upRes.headers);
      upRes.pipe(res);
    },
  );
  upstream.on('error', err => {
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
    }
    res.end(JSON.stringify({ ok: false, error: 'voice_proxy_upstream', detail: err.message }));
  });
  req.pipe(upstream);
}

function proxyUpgrade(req, socket, head) {
  const dest = targetUrl(req.url);
  const headers = { ...req.headers, host: dest.host };

  const upstream = http.request({
    protocol: dest.protocol,
    hostname: dest.hostname,
    port: dest.port || 80,
    path: dest.pathname + dest.search,
    method: 'GET',
    headers,
  });

  upstream.on('upgrade', (upRes, upSocket, upHead) => {
    const lines = [`HTTP/1.1 ${upRes.statusCode} Switching Protocols`];
    for (const [k, v] of Object.entries(upRes.headers)) {
      if (v == null) continue;
      if (Array.isArray(v)) v.forEach(item => lines.push(`${k}: ${item}`));
      else lines.push(`${k}: ${v}`);
    }
    lines.push('', '');
    socket.write(lines.join('\r\n'));
    if (upHead && upHead.length) upSocket.write(upHead);
    if (head && head.length) socket.write(head);

    upSocket.pipe(socket);
    socket.pipe(upSocket);
  });

  upstream.on('error', () => {
    try {
      socket.destroy();
    } catch {
      /* ignore */
    }
  });

  socket.on('error', () => {
    try {
      upstream.destroy();
    } catch {
      /* ignore */
    }
  });

  upstream.end();
}

module.exports = {
  isVoicePath,
  proxyHttp,
  proxyUpgrade,
  TARGET,
};
