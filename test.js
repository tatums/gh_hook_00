var index = require('./index.js');
event = {"Records": [
  {
    Sns: {
      "Message": "{}"
    }
  }
]}
context = {
  succeed: function(){
    console.log('succeed!!!!')
  }
};

var x = index.handler(event, context);
