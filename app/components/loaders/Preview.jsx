/* eslint global-require: 0 */
const { Promise } = global;

export default () => new Promise(resolve => {
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
        require('markdown-it-classy'),
        require('../../markdown-it-plugins/cite'),
        require('../../markdown-it-plugins/kbd'),
        require('../../markdown-it-plugins/br'),
      ],
      markdownItContainer: require('markdown-it-container'),
      markdownItTaskLists: require('markdown-it-task-lists'),
      emojione: require('emojione'),
    });
  });
});
