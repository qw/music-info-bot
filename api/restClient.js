var request = require("request");
var url = "https://music-info-bot.azurewebsites.net/tables/musicinfo";

var headers = {
    'ZUMO-API-VERSION': '2.0.0',	
    'Content-Type': 'application/json'
};

// exports.get = function get(session, userName, callback) {
// 	request.get(url, { 'headers': headers }, function(err, res, body) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			callback(body, session, userName);
// 		}
// 	});
// };

exports.post = function postData(username, favouriteTrack) {
    var options = {
        url: url,
        method: 'POST',
        headers: {
    		'ZUMO-API-VERSION': '2.0.0',	
    		'Content-Type': 'application/json'
		},
        json: {
            "username": username,
            "favouriteTrack": favouriteTrack
        }
    };

    request(options, function (err, response, body) {
        if (!err && response.statusCode === 200) {
        	console.log("POST Sucess: ");
            console.log(body);
        } else {
        	console.log("POST Error: ");
            console.log(err);
            console.log(body);
        }
    });
};