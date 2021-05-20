const fs = require('fs');
const path = require('path');
const pause = require('connect-pause');
const jsonServer = require('json-server');
const consola = require('consola');
const chalk = require('chalk');
const config = require('./config');
const bodyParser = require('body-parser');

const log = {
  info: (message) => consola.info(chalk.bold('JSON-GUI'), message),
  success: (message) => consola.success(chalk.bold('JSON-GUI'), message),
  warn: (message) => consola.warn(chalk.bold('JSON-GUI'), message),
  error: (message) => consola.error(chalk.bold('JSON-GUI:'), message)
};

const db = `${config.baseDir}/db.json`;

const server = jsonServer.create();
const router = jsonServer.router(db, config.foreignKeySuffix);

const middlewares = jsonServer.defaults(
  {
    static: 'node_modules/@simoneldevig/json-gui/dist',
    logger: config.logger,
    noCors: config.noCors,
    readOnly: config.readOnly
  }
);

// Load external middlewares
let externalMiddlewares;
if (config.middlewares && config.middlewares.length) {
  externalMiddlewares = config.middlewares.map(function (m) {
    log.success(`Loaded, ${m}`);
    return require(path.resolve(m));
  });
}

server.use(middlewares);

// Execute external middlewares
if (externalMiddlewares) {
  server.use(externalMiddlewares);
}

// Enable huge payloads
server.use(bodyParser.json({ limit: '100mb' }));
server.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));

// Set delay
server.use(pause(config.delay));

// Set rewrites
server.use(jsonServer.rewriter(config.routes));

// Set id
router.db._.id = config.id;
server.use(router);
server.listen(config.port, config.host, () => {
  // Enable snapshots
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => {
    if (chunk.trim().toLowerCase() === 's') {
      const filename = `db-${Date.now()}.json`;
      const file = path.join(config.snapshotsDir, filename);
      const state = router.db.getState();
      if (!fs.existsSync(config.snapshotsDir)) {
        fs.mkdirSync(config.snapshotsDir);
      }
      fs.writeFileSync(file, JSON.stringify(state, null, 2), 'utf-8');
      log.success(`Saved snapshot to ${path.relative(process.cwd(), file)}\n`);
    }
  });
});
