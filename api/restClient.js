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
			console.log("################ERROR");
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