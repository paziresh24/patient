const { createServer } = require('https');
const fs = require('fs');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8766;
const app = next({ dev });
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
    createServer(httpsOptions, (req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;
      handle(req, res, parsedUrl);
    }).listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on https://localhost:${port} | https://local.paziresh24.com:${port} 🎉`);
    });
  });
})();
