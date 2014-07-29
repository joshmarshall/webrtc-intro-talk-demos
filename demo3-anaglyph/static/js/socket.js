var socket = null;
var users = null;

var _METHODS = {

  "user.id": function(userId) {
    users.localUser = userId;
    sendSocket("user.announce", [users.localUser, users.localName]);
  },

  "user.name": function(userId, userName) {
    var originalName;
    if (userId === users.remoteUser) {
      originalName = users.remoteName;
      users.remoteName = userName;
    } else {
      originalName = users.localName;
      users.localName = userName;
    }
    chat.log("'" + originalName + "' changed to '" + userName + "'");
  },

  "user.announce": function(userId, userName) {
    chat.log("user announced");
    users.remoteUser = userId;
    users.remoteName = userName;
    createOffer();
  },

  "user.offer": function(userId, offerSDP) {
    chat.log("offer received from " + userId);
    receiveOffer(offerSDP);
  },

  "user.answer": function(userId, answerSDP) {
    chat.log("answer received from " + userId);
    receiveAnswer(answerSDP);
  },

  "user.ice": function(userId, candidate, sdpLine) {
    chat.log("ice candidate received from " + userId);
    receiveIceCandidate(candidate, sdpLine);
  }
};

var createSocket = function() {
  socket = new window.WebSocket("ws://localhost:8000/events");
  socket.onopen = function() {
    chat.log("negotiating...");
  };

  socket.onclose = function() {
    chat.log("Negotiation failed.");
  };

  socket.onmessage = function(message) {
    message = window.JSON.parse(message.data);
    _METHODS[message.method].apply(null, message.arguments);
  };
};

var sendSocket = function(method, args) {
  socket.send(window.JSON.stringify({
    method: method,
    arguments: args
  }));
};
