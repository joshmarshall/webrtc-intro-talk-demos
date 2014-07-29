window.navigator.getUserMedia = window.navigator.getUserMedia ||
  window.navigator.webkitGetUserMedia ||
  window.navigator.mozGetUserMedia;

var video = document.getElementById("viewer");
var overlay = document.getElementById("overlay");

var onstream = function(stream) {
  console.log("Camera attached.");
  overlay.style.display = "none";
  video.src = window.URL.createObjectURL(stream);
  video.play();
};

var onfail = function(error) {
  console.log(
      "Camera failed to attach: " + error.name + " - " + error.message);
};

var constraints = {
  video: {
    mandatory: {
      minWidth: 1280,
      minHeight: 720
    }
  },
  audio: false
};

window.navigator.getUserMedia(constraints, onstream, onfail);
