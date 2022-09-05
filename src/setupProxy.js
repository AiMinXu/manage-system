//使用中间件创建代理
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5050',
      changeOrigin: true,
    })
  );
};
