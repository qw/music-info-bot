var client = require("../api/restClient");

exports.send = function postFavourite(username, favouriteTrack) {
	client.post(username, favouriteTrack);
}

exports.get = function getFavourite(session, username) {
	client.get(findFavouritesByUsername, [session, username]);
}

exports.delete = function deleteFavourite(session, username, track) {
	client.get(deleteMatching, [session, username, track]);
}

function findFavouritesByUsername(response, session, username) {
	var allTracks = JSON.parse(response);
	var userFavourites = [];
	for (var i in allTracks) {
		var currentUsername = allTracks[i].username.toLowerCase();
		if (username.toLowerCase() == currentUsername) {
			var currentFavourite = allTracks[i].favouriteTrack;
            if (i !== 0) {
                userFavourites.push(" " + currentFavourite);
            } else {
                userFavourites.push(currentFavourite);
            }
		}
	}

	if (userFavourites.length > 0) {
		session.send("%s, your favourites tracks are %s", username, userFavourites);
	} else {
		session.send("You, %s, currently have no favourites. It's a good time to add some!", username);
	}
}

function deleteMatching (response, session, username, track){
	console.log("fun deleteMatching")
    var allTracks = JSON.parse(response);
    for (var i in allTracks) {
        if (allTracks[i].favouriteTrack === track && allTracks[i].username === username) {
            console.log("DELETE " + allTracks[i]);
            client.delete(session, username, track, allTracks[i].id, deleteMessage);
        }
    }
}

function deleteMessage(response, session, username, track) {
   session.send("Deleted %s from your favourites.", track);
}