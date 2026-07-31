const { createServer } = require('https');
const fs = require('fs');
const { parse } = require('url');
const next = require('next');
const { isVoicePath, proxyHttp, proxyUpgrade, TARGET } = require('./vui-dev-proxy');

const dev = process.env.NODE_ENV !== 'production';
const turbo = process.env.TURBO === '1';
const port = process.env.PORT || 443;
const app = next({ dev, turbo });
const handle = app.getRequestHandler();

(() => {
  if (!fs.existsSync('./cert/localhost-key.pem') && !fs.existsSync('./cert/localhost.pem'))
    return console.log(
      '> 💔 Error: Please create the certificate file before running npm run dev -> https://github.com/paziresh24/patient/blob/main/CONTRIBUTING.md#your-connection-is-not-private',
    );

  const httpsOptions = {
    key: fs.readFileSync('./cert/localhost-key.pem'),
    cert: fs.readFileSync('./cert/localhost.pem'),
  };

  app.prepare().then(() => {
    const server = createServer(httpsOptions, (req, res) => {
      const pathname = (req.url || '').split('?')[0];
      if (dev && isVoicePath(pathname)) {
        proxyHttp(req, res);
        return;
      }
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    // Avoid half-dead sockets that accept TLS then never finish (common hung-dev symptom).
    server.keepAliveTimeout = 65_000;
    server.headersTimeout = 70_000;
    server.requestTimeout = 120_000;

    if (dev) {
      server.on('upgrade', (req, socket, head) => {
        const pathname = (req.url || '').split('?')[0];
        if (!isVoicePath(pathname)) return;
        proxyUpgrade(req, socket, head);
      });
      console.log(`> Voice WS proxy: /api/voice/* → ${TARGET}`);
    }

    server.on('error', err => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `> 💔 Port ${port} is already in use (stale node server.js?).\n` +
            `> Run: npm run free-dev-port   then   npm run dev`,
        );
      }
      throw err;
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on https://localhost:${port} | https://local.paziresh24.com:${port} 🎉`);
      if (dev) {
        console.log(
          '> Tip: first compile of / or /_/ can take 1–2 min. If the tab hangs forever, run npm run free-dev-port && npm run dev',
        );
      }
    });
  });
})();
