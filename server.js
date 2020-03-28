/**
 * json-server.index.js
 */
const handler = require('serve-handler');
const http = require('http');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const jsonServer = require('json-server');
const dbPath = './json-server/db/';
const portMapping = {
  db: 8000,
  models: 8002
};

let files = fs.readdirSync(path.resolve(__dirname, dbPath));

files.forEach((file) => {
  if (file.indexOf('.json') > -1) {
    const serverName = file.slice(0, file.indexOf('.json'));
    const server = jsonServer.create();
    const router = jsonServer.router(dbPath + file);
    const middlewares = jsonServer.defaults();

    server.use(middlewares);

    server.use(jsonServer.bodyParser);

    server.all('/:name', function (req, res, next) {
      const isPost = req.method === 'POST';
      const isPut = req.method === 'PUT';
      const isDelete = req.method === 'DELETE';
      const defaultObject = {
        "timesToRepeat": 1
      };

      const body = !_.isEmpty(req.body) ? req.body : defaultObject;

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

    server.listen(portMapping[serverName], () => {
      console.log('\n⛴    ' + file + ' server is running');
    });

  }
});

const serveOptions = { 
  public: path.resolve(__dirname, './dist'),
  renderSingle: true,
  rewrites: [
    { "source": "/**", "destination": "/index.html" }
  ]
}; 

const httpServer = http.createServer((request, response) => {
  return handler(request, response, serveOptions);
});

// httpServer.listen(8001, () => {
//   console.log('Running at http://localhost:3000');
// });
