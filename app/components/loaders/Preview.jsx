const { Promise } = global;

export default () => {
  return new Promise(resolve => {
    require.ensure([], () => {
      require('highlight.js/styles/zenburn.css');

      resolve({
        hljs: require('highlight.js'),
        markdownIt: require('markdown-it'),
        emojione: require('emojione')
      });
    });
  });
};
