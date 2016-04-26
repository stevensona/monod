const { Promise } = global;

export default () => {
  return new Promise(resolve => {
    require.ensure([], () => {
      require('highlight.js/styles/zenburn.css');
      require('katex/dist/katex.min.css');

      require('katex');

      resolve({
        hljs: require('highlight.js'),
        markdownIt: require('markdown-it'),
        markdownItPlugins: [
          require('markdown-it-fontawesome'),
          require('markdown-it-modify-token'),
          require('markdown-it-sup'),
          require('markdown-it-sub'),
          require('markdown-it-mark'),
          require('markdown-it-ins'),
          require('markdown-it-abbr'),
          require('markdown-it-katex'),
        ],
        emojione: require('emojione')
      });
    });
  });
};
