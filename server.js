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
const CLINIC_PROXY_PREFIX = '/__dev-proxy/clinic';
const CLINIC_UPSTREAM = (process.env.CLINIC_BASE_URL || 'https://www.paziresh24.com').replace(/\/$/, '');

/** @param {Record<string, string | string[] | undefined>} reqHeaders */
function pickProxyHeaders(reqHeaders, names) {
  /** @type {Record<string, string>} */
  const headers = {};
  for (const name of names) {
    const value = reqHeaders[name];
    if (value != null && value !== '') headers[name] = Array.isArray(value) ? value.join(', ') : value;
  }
  return headers;
}

function proxyDevUpstream(req, res, pathname, search, { prefix, upstreamOrigin, errorLabel, extraHeaders = [] }) {
  const upstreamPath = pathname.slice(prefix.length) || '/';
  const target = `${upstreamOrigin}${upstreamPath}${search || ''}`;

  const upstreamReq = https.request(
    target,
    {
      method: req.method,
      headers: {
        accept: req.headers.accept || 'application/json',
        'user-agent': req.headers['user-agent'] || 'patient-local-dev-proxy',
        ...pickProxyHeaders(req.headers, extraHeaders),
        // Intentionally omit Origin / Referer — upstream filters localhost Origin.
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
    res.end(JSON.stringify({ message: `${errorLabel} proxy failed`, error: err.message }));
  });

  if (req.method === 'GET' || req.method === 'HEAD') {
    upstreamReq.end();
  } else {
    req.pipe(upstreamReq);
  }
}

/**
 * Local-dev proxy for Search/Suggestion (apigw).
 * Browser Origin `https://localhost:3443` makes suggestion return `[]`;
 * allowlisted hosts (www / local.paziresh24.com) work. Proxy same-origin and
 * omit Origin/Referer so expertise lists load on localhost.
 */
function proxySearchDev(req, res, pathname, search) {
  proxyDevUpstream(req, res, pathname, search, {
    prefix: SEARCH_PROXY_PREFIX,
    upstreamOrigin: 'https://apigw.paziresh24.com',
    errorLabel: 'search',
  });
}

/**
 * Local-dev proxy for Clinic API (www.paziresh24.com).
 * Browser cross-origin calls (setTerminal, getbaseinfo, …) are CORS-blocked from localhost.
 */
function proxyClinicDev(req, res, pathname, search) {
  proxyDevUpstream(req, res, pathname, search, {
    prefix: CLINIC_PROXY_PREFIX,
    upstreamOrigin: CLINIC_UPSTREAM,
    errorLabel: 'clinic',
    extraHeaders: ['authorization', 'terminal_id', 'user_id', 'accept-timezone', 'content-type', 'cookie'],
  });
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

      if (dev && pathname && pathname.startsWith(CLINIC_PROXY_PREFIX)) {
        return proxyClinicDev(req, res, pathname, search);
      }

      handle(req, res, parsedUrl);
    }).listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on https://localhost:${port} | https://local.paziresh24.com:${port} 🎉`);
    });
  });
})();
