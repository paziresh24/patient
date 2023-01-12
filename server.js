const { createServer } = require('https');
const fs = require('fs');
const { parse } = require('url');
const next = require('next');
const { join } = require('path');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./cert/localhost.key'),
  cert: fs.readFileSync('./cert/localhost.cert'),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    // if (pathname === '/sw.js' || /^\/(workbox|worker|fallback)-\w+\.js$/.test(pathname)) {
    //   console.log('kkk');
    //   const filePath = join(__dirname, '.next', pathname);
    //   app.serveStatic(req, res, filePath);
    // } else {
    handle(req, res, parsedUrl);
    // }
  }).listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on https://localhost:${port} | https://local.paziresh24.com:${port} 🎉`);
  });
});
