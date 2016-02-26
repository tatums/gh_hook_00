var index = require('./index.js');
event = {"Records": [
  {
    Sns: {
      "Message": "{}"
    }
  }
]}
context = {
  succeed: function(msg){
    console.log(msg)
  }
};

index.handler(event, context);
