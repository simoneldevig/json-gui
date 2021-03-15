/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const jsonServer = require('json-server');
const jsonServerConfig = require('./json-server.config.js');
const db = 'json-server/db/db.json';
const server = jsonServer.create();
const router = jsonServer.router(db);
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
    // Snapshot
    console.log('Type s + enter at any time to create a snapshot of the database');

    // Support nohup
    // https://github.com/typicode/json-server/issues/221
    process.stdin.on('error', () => {
      console.log('Error, can\'t read from stdin');
      console.log('Creating a snapshot from the CLI won\'t be possible');
    });
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

// WATCH
// chokidar
// .watch(config.db)
// .on('change', function (file) {
//     if (file === config.db) {
//         var obj = JSON.parse(fs.readFileSync(file))
//         console.info('Setting new DB state')
//         router.db.setState(obj)
//     }
// })

// DELAY
// var pause = require('connect-pause');
// Add after jsonServer.use(middlewares))

// pause in ms
// jsonServer.use(pause(1000));

// ForenKeySuffix
// const router = jsonServer.router(data, {foreignKeySuffix: '_id'})

// ID
// router.db._.id = '_id';

// Middlewares
// array of paths to be imported ane executed
