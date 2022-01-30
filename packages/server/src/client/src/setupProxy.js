const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    proxy.createProxyMiddleware({
      target: 'http://localhost:3001',
      secure: false
    })
  );

  app.use(
    '/media',
    proxy.createProxyMiddleware({
      target: 'http://localhost:3001',
      secure: false
    })
  );

  app.use(
    '/assets',
    proxy.createProxyMiddleware({
      target: 'http://localhost:3001',
      secure: false
    })
  );

  app.use(
    '/service-worker.js',
    proxy.createProxyMiddleware({
      target: 'http://localhost:3001',
      secure: false
    })
  );
};
