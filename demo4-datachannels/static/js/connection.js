window.RTCPeerConnection = window.RTCPeerConnection ||
  window.webkitRTCPeerConnection ||
  window.mozRTCPeerConnection;

window.RTCSessionDescription = window.RTCSessionDescription ||
  window.webkitRTCSessionDescription ||
  window.mozRTCSessionDescription;

window.RTCIceCandidate = window.RTCIceCandidate ||
  window.webkitRTCIceCandidate ||
  window.mozRTCIceCandidate;

var channel = null;
var connection = null;
var servers = {iceServers: [{url: "stun:stun.l.google.com:19302"}]};
var options = {};

var createOffer = function() {
  connection = createConnection();
  channel = createChannel();
  connection.createOffer(function(offer) {
    connection.setLocalDescription(offer, function() {
      sendSocket("user.offer", [users.localUser, offer.sdp]);
      chat.log("offer sent");
    });
  }, onerror);
};

var receiveOffer = function(offerSDP) {
  var description = new window.RTCSessionDescription({
    type: "offer",
    sdp: offerSDP
  });
  connection = createConnection();

  connection.setRemoteDescription(description, function() {
    sendAnswer();
  });

  connection.ondatachannel = function(event) {
    chat.log("data channel received");
    channel = event.channel;
    setupChannel(channel);
  };
};

var sendAnswer = function() {
  connection.createAnswer(function(answer) {
    connection.setLocalDescription(answer, function() {
      chat.log("sending answer");
      channel = connection.createDataChannel("chat");
      chat.log("data channel created");
      sendSocket("user.answer", [users.localUser, answer.sdp]);
    }, onerror);
  }, onerror);
};

var receiveAnswer = function(answerSDP) {
  var answer = new window.RTCSessionDescription({
    type: "answer",
    sdp: answerSDP
  });
  connection.setRemoteDescription(answer, function() {
    console.log("Remote description set.");
  }, onerror);
};

var sendIceCandidate = function(candidate, sdpLine) {
  sendSocket("user.ice", [users.localUser, candidate, sdpLine]);
  connection.onicecandidate = null;
};

var receiveIceCandidate = function(candidate, sdpLine) {
  connection.addIceCandidate(new window.RTCIceCandidate({
    candidate: candidate,
    sdpMLineIndex: sdpLine
  }), function() {
    console.log("Successfully added ice candidate.");
  }, onerror);
};

var createConnection = function() {
  connection = new window.RTCPeerConnection(servers, options);
  connection.onicecandidate = onicecandidate;
  connection.onconnection = onconnection;
  return connection;
};

var createChannel = function() {
  channel = connection.createDataChannel("chat");
  setupChannel(channel);
  return channel;
};

var onerror = function(error) {
  console.log("ERROR: " + error);
};

var onicecandidate = function(event) {
  var candidate = event.candidate;
  if (!candidate) {
    return;
  }
  sendIceCandidate(candidate.candidate, candidate.sdpMLineIndex);
};

var onconnection = function() {
  chat.log("connection opened");
};

var setupChannel = function(dataChannel) {
  dataChannel.onopen = function() {
    chat.clearLog();
    chat.log("connected");
  };

  dataChannel.onclose = function() {
    chat.log("disconnected");
  };

  dataChannel.onmessage = function(message) {
    message = window.JSON.parse(message.data);
    if (message.method == "user.chat") {
      chat.say(message.arguments[0], message.arguments[1]);
    }
  };
};

var sendChannel = function(method, args) {
  channel.send(window.JSON.stringify({
    method: method,
    arguments: args
  }));
};
