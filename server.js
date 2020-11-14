/* eslint-disable @typescript-eslint/no-var-requires */
const { join } = require('path');
const { writeFile } = require('fs');
const { isEmpty } = require('lodash');
const { create, router: _router, defaults, rewriter, bodyParser } = require('json-server');

const filePaths = {
  endpoints: './json-server/db/endpoints.json',
  models: './json-server/db/models.json',
  db: './json-server/db/db.json'
};
const server = create();
const router = _router(
  {
    endpoints: require(filePaths.endpoints),
    models: require(filePaths.models),
    db: require(filePaths.db)
  }
);
const middlewares = defaults(
  {
    static: join(__dirname, './dist')
  }
);

server.use(rewriter({
  '/api/*': '/$1'
}));
server.use(middlewares);
server.use(bodyParser);
server.all('/:type/:name', function (req, res) {
  const isPost = req.method === 'POST';
  const defaultObject = {
    timesToRepeat: 1
  };

  const body = !isEmpty(req.body) ? req.body : defaultObject;

  if (isPost) {
    try {
      const state = router.db.getState();
      const fileName = req.params.type;

      // Remove old obj and replace with new
      delete state[req.params.type][req.params.name];
      state[req.params.type][req.params.name] = body;

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
    res.status(200).jsonp(
      returnedObj
    );
  }
});

server.use(router);
server.listen(5000, function () {
  console.log('JSON Server is running');
});
