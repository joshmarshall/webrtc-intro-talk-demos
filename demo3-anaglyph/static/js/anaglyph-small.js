/*
 *  HTML5 Anaglyph Image
 * 
 *  Copyright (C) 2012 Kevin Tong (logicmd AT gmail.com)
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


// simplified version of the anaglyph function...
function process(width, height, leftData, rightData, outputContext) {

  var index = 0;
  var y = width * height;
  var idr = leftData;
  var idg = rightData;
  var idb = rightData;
	var tempCanvas = document.createElement('canvas');
  var outputData = tempCanvas.getContext("2d").createImageData(width, height);
  var r, g, b;

  for (var x = 0; x < y; x++) {
    // Data1 - left; Data2 - right
    r = idr.data[index+0] * 0.299 + idr.data[index+1] * 0.587 + idr.data[index+2] * 0.114;
    g = idg.data[index+0] * 0.299 + idg.data[index+1] * 0.587 + idg.data[index+2] * 0.114;
    b = idb.data[index+0] * 0.299 + idb.data[index+1] * 0.587 + idb.data[index+2] * 0.114;
    r = Math.min(Math.max(r, 0), 255);
    g = Math.min(Math.max(g, 0), 255);
    b = Math.min(Math.max(b, 0), 255);

    /*
    // Data1 - left; Data2 - right
    g = idr.data[index+1] + 0.45 * Math.max(0, idr.data[index+0] - idr.data[index+1]);
    b = idr.data[index+2] + 0.25 * Math.max(0, idr.data[index+0] - idr.data[index+2]);
    r = g * 0.749 + b * 0.251;
    //r = Math.pow(g * 0.749 + b * 0.251, 1/1.6);
    g = idg.data[index+1] + 0.45 * Math.max(0, idg.data[index+0] - idg.data[index+1]);
    b = idb.data[index+2] + 0.25 * Math.max(0, idb.data[index+0] - idb.data[index+2]);
    r = Math.min(Math.max(r, 0), 255);
    g = Math.min(Math.max(g, 0), 255);
    b = Math.min(Math.max(b, 0), 255);
    */

    outputData.data[index] = r;
    index += 1;
    outputData.data[index] = g;
    index += 1;
    outputData.data[index] = b;
    index += 1;
    outputData.data[index] = 0xFF;
    index += 1;
  }

  outputContext.putImageData(outputData, 0, 0);
}
