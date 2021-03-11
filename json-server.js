// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsonServer = require('json-server');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsonServerConfig = require('./json-server.config.js');
const server = jsonServer.create();
const router = jsonServer.router('./json-server/db/db.json');

const config = {
  port: 5000,
  static: 'dist',
  host: 'localhost',
  watch: true,
  routes: '',
  delay: 0,
  logger: true,
  noCors: false,
  readOnly: true,
  ...jsonServerConfig
};

const middlewares = jsonServer.defaults(
  {
    static: config.static,
    logger: config.logger,
    noCors: config.noCors,
    readOnly: config.readOnly
  }
);

module.exports = () => {
  server.use(middlewares);
  server.use(jsonServer.rewriter(config.routes));
  server.use(router);
  server.listen(config.port, config.host, () => {
    console.log('JSON Server is running');
  });
};
