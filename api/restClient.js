var request = require("request");

var url = "https://music-info-bot.azurewebsites.net/tables/musicinfo";
var headers = {
    'ZUMO-API-VERSION': '2.0.0',	
    'Content-Type': 'application/json'
};

// Calling the callback function with the response body inserted before an array of specified parameters of the callback function.
// Please see ../controller/favourites#getFavourite() for an example.
exports.get = function get(callback, params) {
	request.get(url, { 'headers': headers }, function(err, res, body) { // parameter body is the response body of the GET request
		if (err) {
			console.log(err);
		} else {
			params.unshift(body);
			return callback.apply(null, params);
		}
	});
};

exports.post = function postData(username, favouriteTrack) {
    var options = {
        url: url,
        method: 'POST',
        headers: headers,
        json: {
            "username": username,
            "favouriteTrack": favouriteTrack
        }
    };

    request(options, function (err, response, body) {
        if (!err && response.statusCode === 200) {
        	console.log("POST Success: ");
            console.log(body);
        } else {
        	console.log("POST Error: ");
            console.log(err);
            console.log(body);
        }
    });
};

exports.delete = function deleteData(session, username, track, id, callback) {
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: headers
    };

    request(options, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            console.log(body);
            callback(body, session, username, track);
        } else {
            console.log(err);
            console.log(res);
        }
    });
}

exports.postCredentials = function getAuthToken(session, track, callback) {
	var options = {
		url: "https://accounts.spotify.com/api/token",
		method: "POST",
		headers: {
			"Authorization": "Basic MzYxMzVmNmE5ZTRjNGE0NDliYjkxZDhjZDhlNGU2NzU6NGM0YjM1Mzc2ZjE1NGNjY2JkOTI3NTIzNTRiMzU1ZTA=",
			"Content-Type": "application/x-www-form-urlencoded"
		},
		form: {
			"grant_type": "client_credentials"
		}
	}

	request(options, function (err, response, body) {
		if (!err && response.statusCode == 200) {
			console.log(body);
			var responseBody = JSON.parse(body);
			searchTrack(session, track, responseBody.access_token, callback);
		} else {
			console.log("POST Error");
			console.log(err);
		}
	});
}

function searchTrack(session, track, token, callback) {
	console.log("Bearer " + token);
	var options = {
		url: "https://api.spotify.com/v1/search?type=track" + "&q=" + track,
		method: "GET",
		headers: {
			"Authorization": "Bearer " + token
		}
	}

	request(options, function(err, response, body) {
		if (!err && response.statusCode === 200) {
			callback(session, body);
		} else {
			console.log(err);
			console.log(response.statusCode);
		}
	})
}

exports.postQnAResults = function getQnAAnswer(session, question, callback){
  var options = {
      url: "https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/c9888aaf-17bf-45fd-82ff-040b047cfefc/generateAnswer",
      method: 'POST',
      headers: {
          'Ocp-Apim-Subscription-Key': '6571a8c7b32e49608de564b82d972327',
          'Content-Type':'application/json'
      },
      json: {
          "question" : question
      }
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
          callback(body, session, question);
      }
      else{
          console.log(error);
      }
    });
};