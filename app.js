'use strict';

/*
  TODO 

  - Make array to hold diff rect colors and loop through them
  - Make input option for resolution (rectsWide & rectsHigh)
  - Make input option for canvas width, height
  - Make input for gap starting and increment
  - Make util functions
  - Get rid of grid lines completely, they obsfuscate the code

  Notes:

  - Really able to see patterns if you make the canvas small with a high 
    number of rectanglesWide/High and a high num for the spiral

*/

let rectangleColor = 'white';
const gridColor = 'white';
const gridThickness = 1;

let resolution = 8000;
let spiralSize = 4000;
let canvasSize = 800;

let utils = {
  clearGrid: null,
  redrawGrid: null,
  getParameters: null,
};

(function init() {
  const canvas = document.getElementById('canvas');
	canvas.width = canvasSize;
	canvas.height = canvasSize;

  // The canvas's context used for drawing
  const ctx = canvas.getContext('2d');

  // The room for the rectangles is what is left over after the lines are drawn
  let rectangleSize = (canvasSize - resolution) / resolution;

  utils.clearGrid = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawSpiral();

  // Draws a rect from (x, y) to (x + rectangleWidth, y + rectangleHeight)
  function drawRectangleAt(x, y) {
    ctx.clearRect(x, y, rectangleSize, rectangleSize);
    ctx.fillStyle = rectangleColor;
    ctx.fillRect(x, y, rectangleSize, rectangleSize);
  }

  // Wrapper for drawRectangleAt with col,row params instead of x,y
  function drawRectangle(column, row) {
    const {x, y} = rectangleToCoordinate(column, row);
    drawRectangleAt(x, y);
  }

  // Just don't even question this.
  function rectangleToCoordinate(column, row) {

    // The max amount of vertical space rectangles and grid lines could take up
    const maxRectSpace = (resolution - 1) * rectangleSize;
    const maxGridSpace = resolution * gridThickness;
    const maxy = maxRectSpace + maxGridSpace;

    // The actual amount of space, up to the column specified
    const rectSpaceHorizontal = column * rectangleSize;
    const gridSpaceHorizontal = (column * gridThickness) + (gridThickness / 2);

    // The actual amount of space, up to the row specified
    const rectSpaceVertical = row * rectangleSize;
    const gridSpaceVertical = (row * gridThickness) + (gridThickness / 2);
    const x = rectSpaceHorizontal + gridSpaceHorizontal;
    const y = maxy - (rectSpaceVertical + gridSpaceVertical);

    return {x, y};
  }

  function drawSpiral() {
    let offset = resolution / 2;
    let gap = 0;
    let skips = 0;
    let x = 0;
    let y = 0;
    let delta = [0, -1];

    for (let i = Math.pow(spiralSize, 2); i > 0; i--, skips++) {

      // Is it time to draw one of the 1's at the end of the gap?
      if (skips === gap) {
        drawRectangle(x + offset, y + offset);
      } else if (skips === gap + 1) {
        drawRectangle(x + offset, y + offset);
        skips = 0;
        gap += 1;
      }
      
      if (x === y || (x < 0 && x === -y) || (x > 0 && x === 1 - y))
          delta = [-delta[1], delta[0]];

      x += delta[0];
      y += delta[1];
    }
  }
})();
