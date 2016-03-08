Monod
=====

[![Circle
CI](https://circleci.com/gh/TailorDev/tdit/tree/master.svg?style=svg&circle-token=6aa578e2ce718d2dc620f37ba077da016c76f876)](https://circleci.com/gh/TailorDev/tdit/tree/master)

## Getting started

### For developers

```
$ npm install
$ npm run dev
```

#### Common Tasks

##### `npm run dev`

Runs the development server at [`http://localhost:8080`](http://127.0.0.1:8080),
and use Hot Module Replacement. You can override the default host and port
through env (`HOST`, `PORT`).

##### `npm run build`

Builds the project in `build/` (production ready).

##### `npm run lint`

Runs [ESLint](http://eslint.org/).

##### `npm run lint:fix`

Fix all ESLint problems.

##### `npm run test`

Runs the test suite.

##### `npm run test:watch`

Runs the test suite with `--watch` option.

#### Tools

##### Babel

[Babel](https://babeljs.io/) is modular and distributed in different npm
modules. The core functionality is available in the `babel-core` npm package,
the integration with webpack is available through the `babel-loader` npm
package, and for every type of feature and extensions you want to make available
to your code, you will need to install a separate package (the most common are
`babel-preset-es2015` and `babel-preset-react`, for compiling ES6 and React's
JSX, respectively). A preset is a npm module exporting Babel configuration.

##### Stylesheets

Webpack provides two loaders to deal with stylesheets:

* `css-loader`, which looks for `@import` and `url` statements and resolves
  them;
* `style-loader`, which adds all the computed style rules into the page.

Combined together, these loaders enable you to embed stylesheets into a Webpack
JavaScript bundle. By default, the CSS rules will be bundled together with the
JavaScript file.
