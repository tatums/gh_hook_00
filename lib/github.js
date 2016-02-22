var github = require('octonode');
// TODO - move this KEY
var client = github.client('d226653480c6eeb110379d14ae12831591fb0255');
var ghrepo = client.repo('tatums/hooks');
var branch = 'master';
var Promise = require('es6-promise').Promise;
var exports = exports || {};

exports.fetchContents = function (items) {
  // TODO use filter
  //var files = _.filter(data.tree, function(i) { return i.type === 'blob'; });
  var tasks = [];
  items.forEach(function(item){
    if (item.type === 'blob') {
      var task = exports.getFile(item);
      tasks.push(task);
    }
  });
  return Promise.all(tasks);
}

exports.branch = function (branch) {
  return new Promise(function (resolve, reject){
    ghrepo.branch(branch, function (err, data, headers) {
      if (err) return reject(err);
      else resolve(data);
    })
  });
};

exports.tree = function (sha) {
  return new Promise(function (resolve, reject){
    ghrepo.tree(sha, true, function (err, data, headers) {
      if (err) reject(err);
      else resolve(data);
    })
  });
};

exports.getFile = function (params) {
  return new Promise(function (resolve, reject){
    ghrepo.contents(params.path, branch, function (err, data, headers) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

exports.allFiles = function () {
  return new Promise(function (resolve, reject){
    exports.branch('master')
    .then(function(data){
      resolve( exports.tree(data.commit.sha) );
     })
    .catch(function(err){
      reject(err);
    });
  });
}


module.exports = exports;