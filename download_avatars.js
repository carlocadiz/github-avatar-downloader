var request = require('request');
var token = require('./secrets');
var fs = require('fs');


console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization' : 'token ' + token.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    var data = JSON.parse(body);
    cb(err, data);
  });
}

function getContributerUrl( err, data ){

  data.forEach(function(element){
      downloadImageByURL(element.avatar_url, `avatars/${element.login}.jpg`);
    })
}

function downloadImageByURL(url, filePath) {
  request.get(url)
       .on('error', function (err) {
         throw err;
       })
       .on('response', function (response) {
         console.log('Response Status Code: ', response.statusCode);
       })
       .on('end', function() {
        console.log("Download complete");
      })

       .pipe(fs.createWriteStream(filePath));

}
getRepoContributors("jquery", "jquery", getContributerUrl);


