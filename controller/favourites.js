var client = require("../api/restClient");

exports.sendFavourite = function postFavourite(username, favouriteTrack) {
	client.post(username, favouriteTrack);
}

