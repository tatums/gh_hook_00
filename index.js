exports.handler = function(event, context) {

  var _ = require('lodash');
  var s3 = require('./lib/s3.js');
  var gh = require('./lib/github.js');
  var message = event.Records[0].Sns.Message;
  var body = JSON.parse(message);
  var Promise = require("bluebird");

  // Get all github files;
  // Get all s3 objects
  // iterate over github files and fire off update on match of s3 object. (pop matched items)
  // delete any remaiders.

  Promise.all([
    s3.allPaths(),
    gh.allPaths()
  ])
  .then(function(results){
    var s3Files = results[0];
    var ghFiles = results[1];

    var promises = [];
    var diff = _.difference(s3Files, ghFiles);


    ghFiles.forEach(function(file){
      var promise = gh.getFile({path: file});
      promises.push(promise);
    });

    Promise.all(promises)
    .then(function(files){
      var promises = [];

      files.forEach(function(file){
        var promise = s3.upload(file);
        promises.push(promise);
      });

      diff.forEach(function(file){
        var promise = s3.deleteObject(file);
        promises.push(promise);
      });

      Promise.all(promises)
      .then(function(data){
        context.succeed({data: data, deletedFiles: diff});
      })
      .catch(function(err){
        console.log(err);
      });

    }).catch(function(err){
      console.log(err);
    });
  }).catch(function(err){
    console.log(err);
  });

}
