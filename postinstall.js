#!/usr/bin/env node
import { resolve } from 'path';
import copyfiles from 'copyfiles';
const outDir = process.env.INIT_CWD || resolve('../../', __dirname);

copyfiles(['./json-server/**/*.json', outDir], { error: true, verbose: true }, function (err) {
  if (err) {
    console.error(err);
  }
});
