# Demos from my Python WebRTC Talk

Just some code from my WebRTC demos. Not pretty but functional. :) Each folder has a `start.sh` script which spins up the server for the test.

## Demo 1 - getUserMedia()
The first demo just demonstrates grabbing a media source (in this case a camera) and attaching it to a viewing element (in this case `<video>`).

## Demo 2 - Using Stream Information
This is a simple example using the audio input from a camera microphone and artificially "zooming" based on amplitude. Fun when you put a dubstep song next to the microphone. Also a bit nausea-inducing.

## Demo 3 - Anaglyph
This example allows a user to select two cameras, and using a simplifed version of the [HTML5 Anaglyph Javascript library](https://github.com/logicmd/HTML5-Anaglyph-Image), it generates an anaglyph (sterescopic or "red-cyan 3d") image.

## Demo 4 - Data Channels
This example demonstrates connecting via ICE + STUN and using data channels to send chat messages peer to peer. It includes a simple signaling server in Python, so you'll need to make a virtualenv and install the requirements.txt first before running `start.sh`. It only does 1-to-1, so don't try to start up a real chat session. :)

## PDF / Slides
Won't make a lot of sense by themselves, but I've include my slides as a PDF here.
