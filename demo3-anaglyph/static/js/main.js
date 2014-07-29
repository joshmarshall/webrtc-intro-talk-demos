var channel = null;
var socket = null;
//createSocket();

var getUserMedia = window.navigator.GetUserMedia ||
  window.navigator.webkitGetUserMedia ||
  window.navigator.mozGetUserMedia;
var videoSources = [];
var currentVideo = null;
var videoContainer = document.getElementById("container");

var onstream = function(stream) {
  console.log("Camera attached.");
  var videoPreview = document.createElement("video");
  videoPreview.width = 640;
  videoPreview.height = 360;
  videoContainer.appendChild(videoPreview);
  videoPreview.src = window.URL.createObjectURL(stream);
  videoPreview.play();
};

var onfail = function() {
  console.log("Camera failed to attach.");
};

var iterateSources = function(sources) {
  console.log(sources);
  for (var i = 0; i != sources.length; i++) {
    if (sources[i].kind === "video") {
      videoSources.push(sources[i]);
      var sourceButton = document.createElement("button");
      sourceButton.className = "source";
      sourceButton.setAttribute("data-index", videoSources.length - 1);
      var label = sources[i].label || "Source " + videoSources.length;
      sourceButton.textContent = label;
      (function(button) {
        button.onclick = function() {
          var index = parseInt(button.getAttribute("data-index"), 10);
          connect(index);
          button.onclick = null;
          button.disabled = true;
        };
      })(sourceButton);
      document.getElementById("source-buttons").appendChild(sourceButton);

      console.log(sources[i]);
    }
  }
};


window.MediaStreamTrack.getSources(iterateSources);

var mixer = document.getElementById("mixer").getContext("2d");
var output = document.getElementById("output").getContext("2d");
var leftData = null;
var rightData = null;
var leftScale = 1.0;
var rightScale = 1.0;
var width = 640;
var height = 360;
var fullscreen = false;
var outputElement = document.getElementById("output");

outputElement.onclick = function() {
  if (!fullscreen) {
    outputElement.webkitRequestFullScreen();
  } else {
    window.webkitExitFullScreen();
  }
};

var frame = function() {
  var videos = document.getElementsByTagName("video");
  var leftVideo = videos[0];
  var rightVideo = videos[1];

  if (leftVideo && rightVideo) {

    var leftScaleWidth = leftVideo.videoWidth * leftScale;
    var leftScaleHeight = leftVideo.videoHeight * leftScale;
    var leftWidthStart = (leftVideo.videoWidth - leftScaleWidth) / 2;
    var leftHeightStart = (leftVideo.videoHeight - leftScaleHeight) / 2;

    var rightScaleWidth = rightVideo.videoWidth * rightScale;
    var rightScaleHeight = rightVideo.videoHeight * rightScale;
    var rightWidthStart = (rightVideo.videoWidth - rightScaleWidth) / 2;
    var rightHeightStart = (rightVideo.videoHeight - rightScaleHeight) / 2;

    mixer.drawImage(leftVideo, leftWidthStart, leftHeightStart, leftScaleWidth, leftScaleHeight, 0, 0, 640, 360);
    leftData = mixer.getImageData(0, 0, 640, 360);
    mixer.drawImage(rightVideo, rightWidthStart, rightHeightStart, rightScaleWidth, rightScaleHeight, 0, 0, 640, 360);
    rightData = mixer.getImageData(0, 0, 640, 360);
    process(640, 360, leftData, rightData, output);
  }

  setTimeout(frame, 10);
};

var connect = function(sourceIndex) {
  var source = videoSources[sourceIndex];
  currentVideo = document.getElementById(source.id);
  var constraints = {
    video: {
      mandatory: {
        minWidth: 1280,
        minHeight: 720,
        sourceId: source.id
      }
    },
    audio: false
  };
  console.log("connecting");
  window.navigator.webkitGetUserMedia(constraints, onstream, onfail);
};


frame();
