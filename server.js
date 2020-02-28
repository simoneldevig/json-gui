// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
var middlewares = jsonServer.defaults();

server.use(middlewares);

server.use(jsonServer.bodyParser);

server.all('/:name', function (req, res, next) {
  const isPost = req.method === 'POST';
  const isPut = req.method === 'PUT';
  const isDelete = req.method === 'DELETE';
  const defaultObject = {
    "timesToRepeat": 1
  }
  const body = req.body.length ? req.body : defaultObject;

  if (isPost || isPut) {
    try {
      router.db.set(req.params.name, body).value();
      router.db.write();
      if (isPost) {
        res.sendStatus(201);
      } else if (isPut) {
        res.sendStatus(204);
      }
    } catch (error) {
      res.sendStatus(400);
    }
  } else if (isDelete) {
    try {
      let state = router.db.getState(); 
      delete state[req.params.name]; 
      router.db.setState(state);
      router.db.write();
      res.sendStatus(204);
    } catch (error) {
      res.sendStatus(400);
    }
  } else {
    next();
  }
});

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running');
});
