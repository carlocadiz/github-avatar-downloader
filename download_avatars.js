var argv = process.argv.slice(2);
var request = require('request');
var token = require('./secrets');
var fs = require('fs');

// checks to see if avatar folder exist. if not, creates the folder.
if (!fs.existsSync('avatars/')) {
    fs.mkdir('avatars/');
}

console.log('Welcome to the GitHub Avatar Downloader!');



// function will accept repo owner and name and function parameter for callback function
function getRepoContributors(repoOwner, repoName, cb) {

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization' : 'token ' + token.GITHUB_TOKEN
    }
  };
  // parses the body into a readable JSON format
  request(options, function(err, res, body) {
    var data = JSON.parse(body);
    console.log(typeof(data));
    cb(err, data);
  });
}

//callback function to cycle through data object and calls downloadImageByURL function sending each elements avatar URL and concatinating
// file path using login name.
//
function getContributerUrl( err, data ){

  data.forEach(function(element){
      downloadImageByURL(element.avatar_url, `avatars/${element.login}.jpg`);
    })
}

//function will save an avatar image for parameter 'url' into location  parameter 'filepath'
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

// requires two command line arguements to exist. If not and error message is displayed and system exists.
if (argv.length === 2){
  getRepoContributors(argv[0], argv[1], getContributerUrl);
} else {
    console.log("Missing parameter - shutting down");
    process.exit;
}

