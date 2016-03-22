const { Promise } = global;

export default () => {
  return new Promise(resolve => {
    require.ensure([], () => {
      require('highlight.js/styles/zenburn.css');

      resolve({
        hljs: require('highlight.js'),
        md: require('markdown-it'),
        emojione: require('emojione')
      });
    });
  });
}
