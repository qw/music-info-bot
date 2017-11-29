var rest = require("../API/restclient");

exports.talkToQnA = function postQnAResults(session, question){
    rest.postQnAResults(session, question, handleQnA)
};

function handleQnA(body, session, question) {
    session.send(body.answers[0].answer);
};