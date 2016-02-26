var ghConfig = require('./../config/gh.config.js');
var github = require('octonode');
var client = github.client(ghConfig.token);
var ghrepo = client.repo('tatums/hooks');
var branch = 'master';
var Promise = require("bluebird");
var _ = require('lodash');
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


function filterForBlobs(data){
  var items = _.filter(data.tree, function(file) {
    return file.type === 'blob';
  });
  return items.map(function(i){
    return i.path;
  })
};

exports.allPaths = function () {
  return exports.allObjects()
            .then(filterForBlobs)
            .catch(function(err){
              console.log(err);
            });
};

exports.allObjects = function () {
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
