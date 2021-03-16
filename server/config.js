const fs = require('fs');
const path = require('path');

let jsonServerConfig;
const projectRoot = process.cwd();
if (fs.existsSync(path.resolve(projectRoot, 'json-server.config.js'))) {
  jsonServerConfig = require(path.resolve(projectRoot, 'json-server.config.js'));
}

module.exports = {
  baseDir: 'json-gui',
  port: 5000,
  host: 'localhost',
  watch: true,
  routes: '',
  delay: 0,
  logger: true,
  noCors: false,
  readOnly: true,
  snapshotsDir: 'json-gui/snapshots',
  foreignKeySuffix: 'Id',
  id: 'id',
  middlewares: [],
  ...jsonServerConfig
};
