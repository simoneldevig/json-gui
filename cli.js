#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const consola = require('consola');
const chalk = require('chalk');
const nodemon = require('nodemon');
const boxen = require('boxen');
const jsonGui = require('./server/json-gui');
const config = require('./server/config');
const path = require('path');

const log = {
  info: (message) => consola.info(chalk.bold('JSON GUI'), message),
  success: (message) => consola.success(chalk.bold('JSON GUI'), message),
  warn: (message) => consola.warn(chalk.bold('JSON GUI'), message),
  error: (message) => consola.error(chalk.bold('JSON GUI:'), message)
};

Promise.all([jsonGui(), nodemon({
  script: path.resolve(process.cwd(), '/server/json-server.js'),
  watch: !config.watch ? false : `${config.baseDir}/db.json`
})]).then(() => {
  const greeting = chalk.white(chalk.yellow.bold('Firing up JSON GUI 🔥🔥') + '\n\nRunning at ' + chalk.blue.underline(`http://localhost:${config.port}`));
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
  if (config.watch) {
    log.info('Watching for changes...');
  }
}).catch((error) => {
  console.log(error);
  log.error(chalk.red(error));
  process.exit();
});
