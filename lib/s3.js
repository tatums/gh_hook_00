// UPLOAD
var mime  = require('mime-types');
var AWS   = require('aws-sdk');
var branch = 'master';
var Promise = require('es6-promise').Promise;
var exports = exports || {};

var awsConfig = require('./../config/aws.config.js');

AWS.config.update({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey
});

var s3 = new AWS.S3(
  {
    params: {
      Bucket: "gh-hook-00"
    }
  }
);


exports.deleteObject = function (key) {
  return new Promise(function (resolve, reject){
    s3.deleteObject({Key: key}, function(err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};


exports.listObjects = function () {
  return new Promise(function (resolve, reject){
    s3.listObjects({}, function(err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};


exports.uploadFiles = function (items) {
  var tasks = items.map(function(item){
    return exports.upload(item);
  });
  return Promise.all(tasks);
};


exports.upload = function (data) {
  return new Promise(function (resolve, reject){
    var array = data.path.split('/');
    var path = array[array.length-1];
    var params = {
      ACL: 'public-read',
      ContentType: mime.contentType(path),
      Key:  data.path,
      Body: new Buffer(data.content, 'base64')
    };
    s3.upload(params, function(err, data) {
      if (err) return reject(err);
      else resolve(data);
    });
  });
};

module.exports = exports;
