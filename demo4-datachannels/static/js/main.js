var chatElement = document.getElementById("chat");
var entry = document.getElementById("entry");

var users = {
  localUser: null,
  localName: "Anonymous",
  remoteUser: null,
  remoteName: "Anonymous"
};

var channel = null;
var socket = null;

entry.onkeyup = function(event) {
  if (event.keyCode === 13) {
    var value = entry.value;
    entry.value = "";
    entry.focus();
    if (value[0] == "/") {
      if (value.indexOf("/name ") === 0) {
        var originalName = users.localName;
        users.localName = value.split("/name ")[1];
        console.log("Changing name to " + users.localName);
        chat.log("'" + originalName + "' changed to '" + users.localName + "'");
        sendSocket("user.name", [users.localUser, users.localName]);
      }
      return;
    }
    sendChannel("user.chat", [users.localName, value]);
    chat.say("You", value);
  }
};

var chat = {};

chat.log = function(message) {
  chatElement.textContent = "<" + message + ">\n" + chatElement.textContent;
};

chat.clearLog = function() {
  chatElement.textContent = "";
};

chat.say = function(user, message) {
  chatElement.textContent = user + ": " + message + "\n" + chatElement.textContent;
};

createSocket();
