const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  const port = process.env.API_PORT;
  app.use(
    '/api',
    proxy.createProxyMiddleware({
      target: `http://localhost:${port}`,
      secure: false
    })
  );
};
