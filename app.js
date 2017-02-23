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

// Color and thickness of the grid's lines
const gridColor = 'white';
const gridThickness = 1;
let gridLinesOn = false;

const rectangleColor = 'white';
const numRectanglesWide = 8000;
const numRectanglesHigh = 8000;

// The total size of the grid lines
const totalVerticalLineSize = numRectanglesWide * gridThickness;
const totalHorizontalLineSize = numRectanglesHigh * gridThickness;

let utils = {
  clearGrid: null,
  redrawGrid: null,
};

(function init() {

  const canvas = document.getElementById('canvas');
	canvas.width = 800;
	canvas.height = 800;

  // If this function exists, the canvas can be used for drawing on
  if (!canvas.getContext) {
    console.log('This browser does not support the canvas element.');
    return;
  }

  // The canvas's context used for drawing
  const ctx = canvas.getContext('2d');

  utils.clearGrid = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // The room for the rectangles is what is left over after the lines are drawn
  const rectangleWidth = (canvas.width - totalVerticalLineSize) / numRectanglesWide;
  const rectangleHeight = (canvas.height - totalHorizontalLineSize) / numRectanglesHigh;

  drawSpiral();

  // Draws a rect from (x, y) to (x + rectangleWidth, y + rectangleHeight)
  function drawRectangleAt(x, y) {
    ctx.clearRect(x, y, rectangleWidth, rectangleHeight);
    ctx.fillStyle = rectangleColor;
    ctx.fillRect(x, y, rectangleWidth, rectangleHeight);
  }

  // Wrapper for drawRectangleAt with col,row params instead of x,y
  function drawRectangle(column, row) {
    const {x, y} = rectangleToCoordinate(column, row);
    drawRectangleAt(x, y);
  }

  // Returns coord's of the bottom left corner of the rectangle at (column, row)
  function rectangleToCoordinate(column, row) {

    //Canvas coord's start in the top left, but xy coords start in the bottom left.
    //To convert, we subtract our y from the max possible y - inverting it.

    // The max amount of vertical space rectangles and grid lines could take up
    const maxRectSpace = (numRectanglesHigh - 1) * rectangleHeight;
    const maxGridSpace = numRectanglesHigh * gridThickness;
    const maxy = maxRectSpace + maxGridSpace;

    // The actual amount of space, up to the column specified
    const rectSpaceHorizontal = column * rectangleWidth;
    const gridSpaceHorizontal = (column * gridThickness) + (gridThickness / 2);

    // The actual amount of space, up to the row specified
    const rectSpaceVertical = row * rectangleHeight;
    const gridSpaceVertical = (row * gridThickness) + (gridThickness / 2);

    const x = rectSpaceHorizontal + gridSpaceHorizontal;
    const y = maxy - (rectSpaceVertical + gridSpaceVertical);

    return {x, y};
  }

  function drawSpiral() {
    let row = numRectanglesHigh / 2;
    let col = numRectanglesWide / 2;
    let gap = 0;
    let skips = 0;

    let x = 0;
    let y = 0;
    let delta = [0, -1];
    let width = 4000;
    let height = 4000;
    let iterations = Math.pow(Math.max(width, height), 2);

    for (let i = iterations; i > 0; i--) { 
      skips++;

      if (skips == gap)
        drawRectangle(col + x, row + y);
      
      if (skips == gap + 1) {
        drawRectangle(col + x, row + y);
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
