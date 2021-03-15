module.exports = {
  port: 5000,
  static: 'dist',
  host: 'localhost',
  watch: true,
  delay: 0,
  routes: {
    '/api/*': '/$1'
  },
  snapshotsDir: './json-server/snapshots',
  foreignKeySuffix: '_id',
  id: 'id',
  middlewares: []
};
