#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const consola = require('consola');
const chalk = require('chalk');
const jsonGui = require('./server/json-gui');
const jsonServerModule = require('./server/json-server');
const boxen = require('boxen');
const jsonServerConfig = require('./json-server.config.js');

const log = {
  info: (message) => consola.info(chalk.bold('JSON GUI'), message),
  success: (message) => consola.success(chalk.bold('JSON GUI'), message),
  warn: (message) => consola.warn(chalk.bold('JSON GUI'), message),
  error: (message) => consola.error(chalk.bold('JSON GUI:'), message)
};

Promise.all([jsonServerModule(), jsonGui()]).then(() => {
  const greeting = chalk.white(chalk.yellow.bold('Firing up JSON GUI 🔥🔥') + '\n\nRunning at ' + chalk.blue.underline(`http://localhost:${jsonServerConfig.port || 5000}`));
  const boxenOptions = {
    borderColor: 'yellow',
    padding: 1,
    margin: {
      top: 1,
      bottom: 1
    }
  };
  const msgBox = boxen(greeting, boxenOptions);
  console.log(msgBox);
  log.info('Type s + enter at any time to create a snapshot of the database');
  if (jsonServerConfig && jsonServerConfig.watch) {
    log.info('Watching for changes...');
  }
}).catch((error) => {
  console.log(error);
  log.error(chalk.red(error));
  process.exit();
});
