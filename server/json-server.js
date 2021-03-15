/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const pause = require('connect-pause');
const jsonServer = require('json-server');
const { isEqual } = require('lodash');
const consola = require('consola');
const chalk = require('chalk');
let jsonServerConfig;
const projectRoot = process.cwd();
if (fs.existsSync(path.resolve(projectRoot, 'json-server.config.js'))) {
  jsonServerConfig = require(path.resolve(projectRoot, 'json-server.config.js'));
}
const log = {
  info: (message) => consola.info(chalk.bold('JSON-GUI'), message),
  success: (message) => consola.success(chalk.bold('JSON-GUI'), message),
  warn: (message) => consola.warn(chalk.bold('JSON-GUI'), message),
  error: (message) => consola.error(chalk.bold('JSON-GUI:'), message)
};

const config = {
  port: 5000,
  host: 'localhost',
  watch: true,
  routes: '',
  delay: 0,
  logger: true,
  noCors: false,
  readOnly: true,
  snapshotsDir: './json-server/snapshots',
  foreignKeySuffix: 'Id',
  id: 'id',
  middlewares: [],
  ...jsonServerConfig
};

const db = 'json-server/db/db.json';
const server = jsonServer.create();
const router = jsonServer.router(db, config.foreignKeySuffix);

const middlewares = jsonServer.defaults(
  {
    static: 'dist',
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

module.exports = () => {
  // eslint-disable-next-line no-undef
  return new Promise((resolve, reject) => {
    try {
      server.use(middlewares);

      // Execute external middlewares
      if (externalMiddlewares) {
        server.use(externalMiddlewares);
      }

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

        // Watch for changes
        if (config.watch) {
          chokidar.watch(db).on('change', function (file) {
            if (file === db) {
              const obj = JSON.parse(fs.readFileSync(file));
              // Compare .json file content with in memory database
              const isDatabaseDifferent = !isEqual(obj, router.db.getState());
              if (isDatabaseDifferent) {
                log.info('DB changed, refreshing...');
                router.db.setState(obj);
              }
            }
          });
        }
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
