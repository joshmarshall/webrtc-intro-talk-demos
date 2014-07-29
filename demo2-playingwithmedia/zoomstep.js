window.navigator.getUserMedia = window.navigator.getUserMedia ||
  window.navigator.webkitGetUserMedia ||
  window.navigator.mozGetUserMedia;

window.audioContext = window.audioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext;

console.log(window.audioContext);

var viewer = document.getElementById("viewer");
var viewerContext = viewer.getContext("2d");
var video = document.getElementById("preview");
var swap = document.getElementById("swap");
var swapContext = swap.getContext("2d");
var overlay = document.getElementById("overlay");

var audio = new window.audioContext();
var analyser = audio.createAnalyser();
var microphone = null;
var javascriptNode = null;
var amplitude = 0;
var width = 640;
var height = 360;
var maxAmplitude = 256;

var frame = function() {
  var zoomRatio = 1 - (amplitude / maxAmplitude);
  var cropWidth = width * zoomRatio;
  var cropHeight = height * zoomRatio;
  var left = (width - cropWidth) / 2;
  var top = (height - cropHeight) / 2;
  swapContext.drawImage(video, 0, 0, width, height);
  viewerContext.drawImage(
    swap, left, top, cropWidth, cropHeight, 0, 0, width, height);
  window.setTimeout(frame, 0);
};

var onstream = function(stream) {
  console.log("Camera attached.");
  overlay.style.display = "none";

  video.src = window.URL.createObjectURL(stream);
  video.play();

  microphone = audio.createMediaStreamSource(stream);
  javascriptNode = audio.createScriptProcessor(1024, 1, 1);
  analyser.smoothingTimeConstant = 0.3;
  analyser.fftSize = 1024;
  microphone.connect(analyser);
  analyser.connect(javascriptNode);
  javascriptNode.connect(audio.destination);

  javascriptNode.onaudioprocess = function() {
    var array = new window.Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    var values = 0;
    var length = array.length;
    for (var i = 0; i < length; i++) {
        values += array[i];
    }
    amplitude = values / length;
  };

  frame();
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
  audio: true
};

window.navigator.getUserMedia(constraints, onstream, onfail);
