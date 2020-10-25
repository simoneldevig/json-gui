/**
 * json-server.index.js
 */
import handler from 'serve-handler';
import { createServer } from 'http';
import { resolve } from 'path';
import { readdirSync } from 'fs';
import { isEmpty } from 'lodash';
import { create, router as _router, defaults, bodyParser } from 'json-server';
import portMapping from './portMapping';
const dbPath = './json-server/db/';

const files = readdirSync(resolve(__dirname, dbPath));

files.forEach((file) => {
  if (file.indexOf('.json') > -1) {
    const serverName = file.slice(0, file.indexOf('.json'));
    const server = create();
    const router = _router(dbPath + file);
    const middlewares = defaults();

    server.use(middlewares);

    server.use(bodyParser);

    server.all('/:name', function (req, res, next) {
      const isPost = req.method === 'POST';
      const isPut = req.method === 'PUT';
      const isDelete = req.method === 'DELETE';
      const defaultObject = {
        timesToRepeat: 1
      };

      const body = !isEmpty(req.body) ? req.body : defaultObject;

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
          const state = router.db.getState();
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
  public: resolve(__dirname, './dist'),
  renderSingle: true,
  rewrites: [
    { source: '/**', destination: '/index.html' }
  ]
};

const httpServer = createServer((request, response) => {
  return handler(request, response, serveOptions);
});

httpServer.listen(8001, () => {
  console.log('Running at http://localhost:8001');
});
