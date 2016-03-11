const { Promise } = global;

export default () => {
  return new Promise(resolve => {
    require.ensure([], () => {
      require('highlight.js/styles/zenburn.css');

      resolve({
        hljs: require('highlight.js'),
        marked: require('marked'),
        emojione: require('emojione')
      });
    });
  });
}
