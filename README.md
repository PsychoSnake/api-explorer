API Explorer
=================

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![Circle CI](https://circleci.com/gh/sky-uk/api-explorer.svg?style=svg&circle-token=316a0c863d30835bace2fa013b5e5cacfbed6c69)](https://circleci.com/gh/sky-uk/api-explorer)

**Documentation is in progress**

API Explorer is a live documentation client for Swagger. It provides a nice and highly customizable UI for Swagger.

![Sample API Explorer](http://sky-uk.github.io/api-explorer/docs/apiexplorer-demo.gif)

## Sample Application (development)

You can try the application in our online development sandbox.

[https://apiexplorer-app.herokuapp.com](https://apiexplorer-app.herokuapp.com)

## Features

* Clean UI
* Multiple APIs
* Loaders for Swagger version 1.0 and 2.0
* Custom HTTP Headers
* Extensible tab widgets
* Built-in proxy for bypass CORS restrictions


## Development

### Build

To build this project you need to clone the repo and then:

```
npm install
npm run start:dev
open http://localhost:3000
```

You can change the port number using the `PORT` environment variable.


### Production build

To generate a production build you need to run the following commands:


```
npm install
npm run dev
```

The output files are stored in the `dist` folder. You can grab the files and place then in your application server.

You can also use a local server to run this application using `npm start`


### Linting

This project uses [StandardJS](http://standardjs.com/) for linting the code.

```
npm run lint
```

### Customization

You can customize APIExplorer using the following fluent configuration:

```html
<script src="/APIExplorer.umd.js?s=2317557"></script>
```

Minimal configuration

```javascript
APIExplorer
  .addAPI('petstore', 'swagger2', 'https://api.swaggerhub.com/apis/anil614sagar/petStore/1.0.0')
  .start()
```

Extended configuration

```javascript
APIExplorer
  .addAPI('petstore', 'swagger2', 'https://api.swaggerhub.com/apis/anil614sagar/petStore/1.0.0', c => {
    c.addHeader('X-Foo', 'Some Value')
    c.addHeader('X-Bar', 'Another Value')
    c.useProxy(true)
  })
  .addAPI('github', 'swagger2', 'https://api.apis.guru/v2/specs/github.com/v3/swagger.json', c => {
    c.useProxy(true)
  })
  .addWidgetTab('HATEOAS', APIExplorer.HATEOASWidget)
  .addPlugin(samplePlugin)
  .configCORS({ credentials: 'omit' })
  .start()
```

## Sample API Explorer client

You can find a sample project that depends on API Explorer in https://github.com/sky-uk/petstore-api-explorer.


## Core Maintainers

- [Carlos Guedes](https://github.com/cguedes) - carlos.guedes@sky.uk
- [Daniel Correia](https://github.com/danielbcorreia) - daniel.correia@sky.uk

## Contributing

We appreciate any contribution to API Explorer, please check out [CONTRIBUTING.md](CONTRIBUTING.md).
We keep a list of features and bugs [in the issue tracker](https://github.com/sky-uk/api-explorer/issues).


## Contributors

- [Nuno Silva](https://github.com/nunoas) - nuno.silva@sky.uk
- [Pedro Félix](https://github.com/pmhsfelix) - pedro.felix@sky.uk
