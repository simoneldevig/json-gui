const path = require('path');
const { writeFile } = require('fs');
const { isEmpty } = require('lodash');
const jsonServer = require('json-server');
const port = 5001;
const config = require('./config');
const projectRoot = process.cwd();
const chokidar = require('chokidar');
const { isEqual } = require('lodash');
const fs = require('fs');

const filePaths = {
  endpoints: path.resolve(projectRoot, `${config.baseDir}/internals/endpoints.json`),
  models: path.resolve(projectRoot, `${config.baseDir}/internals/models.json`),
  db: path.resolve(projectRoot, `${config.baseDir}/db.json`),
  settings: path.resolve(projectRoot, `${config.baseDir}/internals/settings.json`)
};

const server = jsonServer.create();
const router = jsonServer.router(
  {
    endpoints: require(filePaths.endpoints),
    models: require(filePaths.models),
    db: require(filePaths.db),
    settings: require(filePaths.settings)
  }
);

module.exports = () => {
  return new Promise((resolve, reject) => {
    server.use(jsonServer.rewriter({
      '/json-gui/*': '/$1'
    }));
    server.use(jsonServer.defaults({ logger: false }));
    server.use(jsonServer.bodyParser);

    // Make sure to serve the latest changes by looking at the physical file
    server.use('/:name', (req, _res, next) => {
      const paramName = req.params.name;
      if (req.method === 'GET' && paramName) {
        const currentObj = JSON.parse(fs.readFileSync(filePaths[paramName]));
        const state = router.db.getState();
        state[paramName] = currentObj;
        router.db.setState(state);
      }
      next();
    });

    // Support nested routes
    server.use('/:type/:name', (req, res) => {
      const isPost = req.method === 'POST';
      const isDelete = req.method === 'DELETE';
      const isPut = req.method === 'PUT';
      const defaultObject = {
        timesToRepeat: 1
      };
      const body = !isEmpty(req.body) ? req.body : defaultObject;
      if (isPost || isDelete || isPut) {
        try {
          const state = router.db.getState();
          const fileName = req.params.type;

          if (isPost) {
            // Remove old obj and replace with new
            if (req.params.name) {
              delete state[req.params.type][req.params.name];
              state[req.params.type][req.params.name] = body;
            } else {
              delete state[req.params.type];
              state[req.params.type] = body;
            }
          } else if (isPut && req.params.name) {
            if (req.params.name) {
              const tempBody = state[req.params.type][req.params.name];
              const newName = body.newName;
              delete state[req.params.type][req.params.name];
              state[req.params.type][newName] = tempBody;
            }
          } else if (isDelete && req.params.name) {
            // Remove obj
            if (req.params.name) {
              delete state[req.params.type][req.params.name];
            }
          }

          // Set the lowdb context to new data
          router.db.setState(state);

          // Persists the changes
          writeFile(filePaths[fileName], JSON.stringify(state[req.params.type], null, 2), (error) => {
            if (error) {
              throw new Error(error);
            } else {
              res.sendStatus(201);
            }
          });
        } catch (error) {
          res.sendStatus(400);
        }
      } else {
        const returnedObj = router.db.get(req.params.type)
          .get(req.params.name)
          .value();

        if (returnedObj) {
          res.status(200).jsonp(
            returnedObj
          );
        } else {
          res.status(404).jsonp();
        }
      }
    });

    server.use(router);
    try {
      server.listen(port, () => {
        resolve();
      }).on('error', (err) => {
        throw new Error(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};
