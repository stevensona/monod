const { Promise } = global;

export default () => {
  return new Promise(resolve => {
    require.ensure([], () => {
      require('codemirror/mode/gfm/gfm');
      require('codemirror/mode/dockerfile/dockerfile');
      require('codemirror/mode/elm/elm');
      require('codemirror/mode/gherkin/gherkin');
      require('codemirror/mode/go/go');
      require('codemirror/mode/javascript/javascript');
      require('codemirror/mode/jinja2/jinja2');
      require('codemirror/mode/jsx/jsx');
      require('codemirror/mode/php/php');
      require('codemirror/mode/properties/properties');
      require('codemirror/mode/python/python');
      require('codemirror/mode/ruby/ruby');
      require('codemirror/mode/sass/sass');
      require('codemirror/mode/shell/shell');
      require('codemirror/mode/twig/twig');
      require('codemirror/mode/xml/xml');
      require('codemirror/mode/yaml/yaml');

      resolve();
    });
  });
};
