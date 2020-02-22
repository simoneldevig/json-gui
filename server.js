// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
var middlewares = jsonServer.defaults();

server.use(middlewares);

server.post('/:name', function (req, res) {
  var obj = {};
  obj[req.params.name] = req.body;
  router.db.defaults(obj).value();
  router.db.write();
  res.sendStatus(201);
});

server.delete('/:name', function (req, res) {
  var state = router.db.getState(); 
  delete state[req.params.name]; 
  router.db.setState(state);
  router.db.write();
  res.sendStatus(204);
});

server.put('/:name', function (req, res) {
  router.db.set(req.params.name, req.query).value();
  router.db.write();
  res.sendStatus(200);
});

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running');
});
