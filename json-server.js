/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const pause = require('connect-pause');
const jsonServer = require('json-server');
const jsonServerConfig = require('./json-server.config.js');
const { isEqual } = require('lodash');

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
    static: config.static,
    logger: config.logger,
    noCors: config.noCors,
    readOnly: config.readOnly
  }
);

// Load external middlewares
let externalMiddlewares;
if (config.middlewares) {
  externalMiddlewares = config.middlewares.map(function (m) {
    console.log(`Loading, ${m}`);
    return require(path.resolve(m));
  });
}

module.exports = () => {
  server.use(middlewares);
  if (externalMiddlewares.length) {
    server.use(externalMiddlewares);
  }
  server.use(pause(config.delay));
  server.use(jsonServer.rewriter(config.routes));
  router.db._.id = config.id;
  server.use(router);
  server.listen(config.port, config.host, () => {
    console.log('JSON Server is running');
    // Snapshot
    console.log('Type s + enter at any time to create a snapshot of the database');
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
        console.log(`Saved snapshot to ${path.relative(process.cwd(), file)}\n`);
      }
    });

    if (config.watch) {
      console.log('Watching...');

      chokidar.watch(db).on('change', function (file) {
        if (file === db) {
          const obj = JSON.parse(fs.readFileSync(file));
          // Compare .json file content with in memory database
          const isDatabaseDifferent = !isEqual(obj, router.db.getState());
          if (isDatabaseDifferent) {
            console.log('DB has changed, reloading...');
            router.db.setState(obj);
          }
        }
      });
    }
  });
};
