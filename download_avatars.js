var request = require('request');
var token = require('./secrets')

console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization' : 'token' + token
    }
  };

  request(options, function(err, res, body) {
    var data = JSON.parse(body);
    cb(err, body);
    data.forEach(function(element){
      console.log(element.avatar_url);
    })
  });
}
getRepoContributors("jquery", "jquery", function(err, result) {

  });
