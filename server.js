/* eslint-disable @typescript-eslint/no-var-requires */
const { join } = require('path');
const { writeFile } = require('fs');
const { isEmpty } = require('lodash');
const chalk = require('chalk');
const boxen = require('boxen');
const { create, router: _router, defaults, rewriter, bodyParser } = require('json-server');
const port = 5001;
const filePaths = {
  endpoints: './json-server/db/endpoints.json',
  models: './json-server/db/models.json',
  db: './json-server/db/db.json',
  settings: './json-server/db/settings.json'
};
const server = create();
const router = _router(
  {
    endpoints: require(filePaths.endpoints),
    models: require(filePaths.models),
    db: require(filePaths.db),
    settings: require(filePaths.settings)
  }
);
const middlewares = defaults(
  {
    static: join(__dirname, './dist')
  }
);

module.exports = () => {
  console.log('hit');
  server.use(rewriter({
    '/json-gui/*': '/$1',
    '/api/*': '/db/$1'
  }));
  server.use(middlewares);
  server.use(bodyParser);
  server.all('/:type/:name', function (req, res) {
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
  server.listen(port, function () {
    const greeting = chalk.white(chalk.red.bold('Fired up JSON GUI 🔥🔥') + '\n\nRunning at: ' + chalk.blue.underline(`http://localhost:${port}/`));

    const boxenOptions = {
      borderColor: 'red',
      padding: 1,
      margin: 1
    };
    const msgBox = boxen(greeting, boxenOptions);

    console.log(msgBox);
  });
};
