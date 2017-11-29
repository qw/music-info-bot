var builder = require("botbuilder");
var favourites = require("../controller/favourites");
var information = require("../controller/information");

exports.startDialog = function(bot) {
	var recognizer = new builder.LuisRecognizer("https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/033ae1b6-dfe3-416a-8bc4-6de624245ef1?subscription-key=7d6b1b4d7f5148eca197f249906a368d&verbose=true&timezoneOffset=0&q=");
	bot.recognizer(recognizer);

	// Conversation data defaults to false (disabled)
	bot.set('persistConversationData', true);

	bot.dialog("Favourite.Add", [
		function (session, args, next) {
			console.log("Favourite.Add Intent");
            session.dialogData.args = args || {};
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
				favourites.send(username, track.entity);
			} else {
				builder.Prompts.text(session, "Sorry, I could not recognize the track.");
			}
		}
	]).triggerAction({
		matches: "Favourite.Add"
	});

	bot.dialog("Favourite.Delete", [
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
			console.log("#######################");
			if (results.response) {
				session.conversationData["username"] = results.response;
			}

			var username = session.conversationData["username"];
            var track = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'track');
			if (track) {
				session.send("Deleting %s from your favourites.", track.entity);
				favourites.delete(session, username, track.entity);
			} else {
				session.send("No track identified.");
			}
		}
	]).triggerAction({
		matches: "Favourite.Delete"
	});

	bot.dialog("Favourite.Get", [
		function(session, args, next) { 
			console.log("Favourite.Get Intent");
            session.dialogData.args = args;
			if (!session.conversationData["username"]) {
				builder.Prompts.text(session, "What's your username?");
			} else {
				next();
			}
		},
		function(session, results, next) { 
			if (results.response) {
				console.log("RESONSE NAME " + results.response);
				session.conversationData["username"] = results.response;
			}

			console.log(session.conversationData["username"]);
			if (session.conversationData["username"]) {
				session.send("Retrieving your favourites..")
				favourites.get(session, session.conversationData["username"])
			} else {
				session.send("Sorry, I could not recognize your username");
			}
		}
	]).triggerAction({
		matches: "Favourite.Get"
	});

	bot.dialog("Information.Lyrics", 
		function(session, args) { 
			session.send("Information.Lyrics Intent");
			console.log("Information.Lyrics Intent");
		}
	).triggerAction({
		matches: "Information.Lyrics"
	});

	bot.dialog("Information.Track", 
		function(session, args) { 
			console.log("Information.Track Intent");
	        var track = builder.EntityRecognizer.findEntity(args.intent.entities, 'track');
	        if (track) {
	        	session.send("Finding information on %s.", track.entity);
	        	information.get(session, track.entity);
	        } else {
	        	session.send("Sorry, could not recognize track.");
	        }
		}
	).triggerAction({
		matches: "Information.Track"
	});


	// bot.dialog("Welcome", 
	// 	function(session, args) { 
	// 		session.say("Welcome Intent", "Welcome Intent");
	// 		console.log("Welcome Intent");
	// 	}
	// ).triggerAction({
	// 	matches: "Welcome"
	// });

}