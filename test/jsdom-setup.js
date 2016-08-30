var jsdom = require('jsdom').jsdom;

global.document = jsdom("", { url: "http://www.example.org/" });
global.window   = document.defaultView;

global.navigator = {
  userAgent: 'Node.js'
};

global.document.createRange = function() {
  return {
    setEnd: function() {
    },
    setStart: function() {
    },
    getBoundingClientRect: function() {
      return { right: 0 };
    }
  }
};

global.window.requestAnimationFrame = function(callback) {
  return callback();
};
