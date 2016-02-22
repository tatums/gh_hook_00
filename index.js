exports.handler = function(event, context) {

    var _ = require('lodash');
    var s3 = require('./lib/s3.js');
    var gh = require('./lib/github.js');
    var message = event.Records[0].Sns.Message;
    var body = JSON.parse(message);


    Promise.all([
      s3.listObjects(),
      gh.allFiles()
    ]).then(function (results) {
      var ghFiles = results[1].tree.map(function (file) {
        if (file.type === 'blob') return file.path
      });
    var s3Files = results[0].Contents.map(function (file) {
      return file.Key;
    });

    var items = [];
    s3Files.forEach(function(file){
      if ( !_.includes(ghFiles, file) ) {
        items.push(file);
      }
    });

    items.forEach(function (item) {
      s3.deleteObject(item)
      .then(function(data){
        console.log('data');
      }).catch(function(err){
        console.log(err);
      })
    });
    }).catch(function(err){
      console.log('err', err);
    });

    gh.allFiles()
    .then(function(data){
      return gh.fetchContents(data.tree);
    })
    .then(function(data){
      return s3.uploadFiles(data);
    })
    .then(function(data){
      context.succeed(data);
    })
    .catch(function(error){
      console.log('error', error);
    });

}
