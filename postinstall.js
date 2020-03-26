#!/usr/bin/env node
const path = require('path');
const copyfiles = require('copyfiles');
const outDir = process.env.INIT_CWD || path.resolve("../../", __dirname);

copyfiles(["./json-server/**/*.json", outDir], {error: true, verbose: true}, function (err) {
  if (err) {
    console.error(err);
  }
});
