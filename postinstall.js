#!/usr/bin/env node
const path = require('path');
const copyfiles = require('copyfiles');
const outDir = path.resolve(process.env.INIT_CWD);

if (process.cwd() !== outDir) {
  copyfiles(['./json-gui/**/*.json', outDir], { error: false, verbose: false }, function (err) {
    if (err) {
      console.error(err);
    }
  });
}
