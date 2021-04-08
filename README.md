<p align="center">
    <h1 align="center">Currently in alpha👷‍♂️</h1>
</p>

<p align="center">
    <img align="center" width="180" src="public/logo.png?raw=true" alt="json-gui logo">
</p>
<br/>
<p align="center">
  <a href="https://travis-ci.org/simoneldevig/json-gui"><img src="https://travis-ci.org/simoneldevig/json-gui.svg?branch=master" alt="travis build"></a>
  <a href="https://www.npmjs.com/package/simoneldevig/json-gui"><img src="https://img.shields.io/npm/v/simoneldevig/json-gui" alt="npm version"></a>
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/badge/node-%3E%3D10-green" alt="node compatility"></a>
</p>
<br/>

> Create a REST API with a GUI

- ⚡️ Create endpoints
- ♻️ Create resuable models
- ➕ Add property types (string, number, boolean, object, array)
- 🦄 [Faker.js](https://github.com/marak/Faker.js/) integration for quickly adding random data
- 🔌 [Quicktype.io](https://quicktype.io/) integration for converting models and endpoints to C# and TypeScript (properly more to come)

JSON GUI is a tool for making even easier mock up a full REST API for your project. It's a GUI for [json-server](https://github.com/typicode/json-server) so you don't have to write JSON or generator functions to set up your API.

Even though it's made for json-server, it can also be used as a JSON generator.

## Demo
TBA

## Getting started

**Install using npm**

``` bash
npm i json-gui
```


**Run it with npx**

``` bash
npx json-gui 
```

**Run it with npm scripts**

Add `"json-gui": "json-gui` to `scripts` property in `package.json` and do

``` bash
npm run json-gui
```

## Configuration
It's possible to configure the json-server implementation via a config file. 

To configure the settings, simply create a file called json-server.config.js. All [json-server](https://github.com/typicode/json-server#cli-usage) CLI configurations are supported. The default config looks like this:

```javascript
module.exports = {
  baseDir: 'json-gui',                  // Directory where json-gui files are located
  port: 5000,                           // Set port  
  host: 'localhost',                    // Set host
  watch: true,                          // Watch for changes to db.json
  routes: '',                           // Path to custom routes file
  delay: 0,                             // Add delay to responses (ms)
  logger: true,                         // Show logs in console
  noCors: false,                        // Disable Cross-Origin Resource Sharing  
  readOnly: true,                       // Allow only GET requests (json-gui will overwrite posted data on generate)
  snapshotsDir: 'json-gui/snapshots',   // Set snapshots directory 
  foreignKeySuffix: 'Id',               // Set foreign key suffix, (e.g. _id as in post_id)
  id: 'id',                             // Set database id property (e.g. _id)
  middlewares: []                       // Relative paths to middleware files 
};
```

## Future stuff (up for grabs)
- [ ] [Unit tests](https://github.com/simoneldevig/json-gui/issues/2)
- [ ] [Importing JSON from another source](https://github.com/simoneldevig/json-gui/issues/1)
- [ ] [Easy deployment](https://github.com/simoneldevig/json-gui/issues/7)
 

## Contribution
See [Contributing Guide](https://github.com/simoneldevig/json-gui/tree/master/.github/CONTRIBUTING.md).

## License
Copyright © 2021 Simon Eldevig

All source code is licensed under the [Mozilla Public License](https://github.com/simoneldevig/json-gui/blob/master/LICENSE).

