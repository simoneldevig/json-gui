<p align="center">
    <h1 align="center">Work in progress👷‍♂️</h1>
</p>

<p align="center">
    <img align="center" width="180" src="public/logo.png?raw=true" alt="json-gui logo">
</p>
<br/>
<p align="center">
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/badge/node-%3E%3D10-green" alt="node compatility"></a>
</p>
<br/>

> Create REST API with a GUI

- ⚡️ Create endpoints
- ♻️ Create resuable models
- ➕ Add property types (string, number, boolean, object, array)
- 🦄 [Faker.js](https://github.com/marak/Faker.js/) integration for quickly adding random data
- 🔌 [Quicktype.io](https://quicktype.io/) integration for converting models and endpoints to C# and TypeScript (properly more to come)

JSON GUI is a tool for making even easier mock up a full REST API for your project. It's a GUI for [json-server](https://github.com/typicode/json-server) so you don't have to write JSON or generator functions to set up your API.

Even though it's made for json-server, it can also be used as a JSON generator.


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

## Future stuff (up for grabs)
[ ] Unit tests

[ ] Importing JSON from another source


## Running the project
``` bash
npm i
npm json-gui (fires up json-server)
npm run dev (has to be run in seperate window)
```

## Contributing To This Project
Anyone and everyone is welcome to contribute. Just create a PR with your changes and I will have a look at it.

## License
Copyright © 2021 Simon Eldevig

All source code is licensed under the [Mozilla Public License]().

