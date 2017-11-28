var builder = require("botbuilder");
var favourites = require("../controller/favourites");

exports.startDialog = function(bot) {
	var recognizer = new builder.LuisRecognizer("https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/033ae1b6-dfe3-416a-8bc4-6de624245ef1?subscription-key=7d6b1b4d7f5148eca197f249906a368d&verbose=true&timezoneOffset=0&q=");
	bot.recognizer(recognizer);
	bot.set('persistConversationData', true);

	bot.dialog("Favourite.Add", [
		function (session, args, next) {
			console.log("Favourite.Add Intent");
            session.dialogData.args = args;
			if (!session.conversationData["username"]) {
				builder.Prompts.text(session, "Enter a username for me to know you by:")
			} else {
				next();
			}
		},
		function (session, results, next) {
			if (results.response) {
				session.conversationData["username"] = results.response;
			}

			var username = session.conversationData["username"];
			var track = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'track');
			if (track) {
				builder.Prompts.text(session, "I have saved " + track.entity + " to your favourites.");
				favourites.sendFavourite(username, track.entity);
			} else {
				builder.Prompts.text(session, "Sorry, I could not recognize the track.");
			}
		}
	]).triggerAction({
		matches: "Favourite.Add"
	});
}