const { createServer } = require('https');
const https = require('https');
const fs = require('fs');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const turbo = process.env.TURBO === '1';
const port = process.env.PORT || 443;
const app = next({ dev, turbo });
const handle = app.getRequestHandler();

const SEARCH_PROXY_PREFIX = '/__dev-proxy/search';

/**
 * Local-dev proxy for Search/Suggestion (apigw).
 * Browser Origin `https://localhost:3443` makes suggestion return `[]`;
 * allowlisted hosts (www / local.paziresh24.com) work. Proxy same-origin and
 * omit Origin/Referer so expertise lists load on localhost.
 */
function proxySearchDev(req, res, pathname, search) {
  const upstreamPath = pathname.slice(SEARCH_PROXY_PREFIX.length) || '/';
  const target = `https://apigw.paziresh24.com${upstreamPath}${search || ''}`;

  const upstreamReq = https.request(
    target,
    {
      method: req.method,
      headers: {
        accept: req.headers.accept || 'application/json',
        'user-agent': req.headers['user-agent'] || 'patient-local-dev-proxy',
        // Intentionally omit Origin / Referer — apigw filters localhost Origin.
      },
    },
    upstreamRes => {
      res.writeHead(upstreamRes.statusCode || 502, {
        'content-type': upstreamRes.headers['content-type'] || 'application/json',
        'cache-control': 'no-store',
      });
      upstreamRes.pipe(res);
    },
  );

  upstreamReq.on('error', err => {
    res.writeHead(502, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ message: 'search proxy failed', error: err.message }));
  });

  if (req.method === 'GET' || req.method === 'HEAD') {
    upstreamReq.end();
  } else {
    req.pipe(upstreamReq);
  }
}

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
    createServer(httpsOptions, (req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname, search } = parsedUrl;

      if (dev && pathname && pathname.startsWith(SEARCH_PROXY_PREFIX)) {
        return proxySearchDev(req, res, pathname, search);
      }

      handle(req, res, parsedUrl);
    }).listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on https://localhost:${port} | https://local.paziresh24.com:${port} 🎉`);
    });
  });
})();
