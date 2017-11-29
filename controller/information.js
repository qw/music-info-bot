var client = require("../api/restClient");
var builder = require("botbuilder");

exports.get = function (session, track) {
	client.postCredentials(session, track, displayAlbumCard);
}

function displayAlbumCard(session, response) {
	var cards = []; 
	console.log(JSON.parse(response));
	var message = JSON.parse(response);

    // Assemble cards representing album information
	for (var i in message.tracks.items) {
		// Only display 5 cards.
		if (i > 4) {
			break;
		}
		var currentItem = message.tracks.items[i].album;
		var album = currentItem.name;
		var albumType = currentItem.album_type;
		var url = currentItem.external_urls.spotify;
		var imageUrl = currentItem.images[1].url;

        var card = new builder.HeroCard(session)
	        .title(album)
	        .text("This is a(an) " + albumType)
	        .images([
	            builder.CardImage.create(session, imageUrl)])
	        .buttons([
	            builder.CardAction.openUrl(session, url, 'View on Spotify')
        	]);
        cards.push(card);
	}
    // Displays cards to the user
    var feedback = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);

    session.send(feedback);
}