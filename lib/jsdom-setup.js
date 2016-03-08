var jsdom = require('jsdom').jsdom;

global.document = jsdom();
global.window = document.defaultView;
global.navigator = {
    userAgent: 'Node.js'
};

global.document.createRange = function() {
    return {
        setEnd: function(){},
        setStart: function(){},
        getBoundingClientRect: function(){
            return {right: 0};
        }
    }
};