#!/usr/bin/env node
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsonGui = require('./server');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsonServer = require('./json-server');

jsonGui();
jsonServer();
