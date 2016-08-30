// see: https://stackoverflow.com/questions/33881123/handle-webpack-css-imports-when-testing-with-mocha-and-babel/34074103
function noop() {
  return null;
}

require.extensions['.css'] = noop;
