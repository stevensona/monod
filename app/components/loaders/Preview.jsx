const { Promise } = global;

export default () => {
  return new Promise(resolve => {
    require.ensure([], () => {
      require('highlight.js/styles/zenburn.css');

      resolve({
        hljs: require('highlight.js'),
        markdownIt: require('markdown-it'),
        markdownItPlugins: [
          require('markdown-it-fontawesome'),
          require('markdown-it-modify-token'),
          require('markdown-it-sup'),
          require('markdown-it-sub'),
          require('markdown-it-mark'),
        ],
        emojione: require('emojione')
      });
    });
  });
};
