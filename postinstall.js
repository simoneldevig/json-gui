#!/usr/bin/env node
const path = require('path');
const copyfiles = require('copyfiles');
const outDir = path.resolve(process.env.INIT_CWD);

copyfiles(['./json-gui/**/*.json', outDir], { error: true, verbose: true }, function (err) {
  if (err) {
    console.error(err);
  }
});
