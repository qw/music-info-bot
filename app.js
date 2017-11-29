var builder = require("botbuilder");
var restify = require("restify");
var luis = require("./luis/main");
var os = require("os");

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log("%s listening to %s", server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: "a01a7b25-fe25-4c15-ad4e-f7fba7c16203",
    appPassword: "hRXRO697%;)kyxozaJRV62!"
});

//MICROSOFT_APP_PASSWORD: hRXRO697%;)kyxozaJRV62!

server.post("/api/messages", connector.listen());

// Receive messages from the user
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.", session.message.text);
});

// Sends greeting message when the bot is first added to a conversation
bot.on("conversationUpdate", function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
            	sendMessage(bot, message, "Hi! I am Ares! I can find information on tracks, or remember your favourite tracks. \n\nTry tpying: \n\n - [track] sounds good \n\n- I hate [track] \n\n - I'd like to know more about [track]");
            	// sendMessage(bot, message, "");
            	// sendMessage(bot, message, "I'd like to know more about [track]");
            }
        });
    }
});

function sendMessage(bot, message, text) {
	var reply = new builder.Message()
	    .address(message.address)
	    .text(text);
	bot.send(reply);
}

luis.startDialog(bot);