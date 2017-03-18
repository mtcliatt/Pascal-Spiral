'use strict';

const colors = [
  'white',
  'red',
]

let colorIndex = 0;
let canvasSize = 800;
let resolution = canvasSize / 40;

// helps stop lagging if you hold down WASD keys
let maxZoom = 4000;

/*
  Original:
    let initialGap = 1;
    let gapIncrement = 1;
    let incrementDelta = 0;
  
  Square:
    let initialGap = 1;
    let gapIncrement = 2;
    let incrementDelta = 0;

  Pentagonal:
    let initialGap = 1;
    let gapIncrement = 4;
    let incrementDelta = 3;
  
  WOW! oscillations:
    let initialGap = 5;
    let gapIncrement = 4;
    let incrementDelta = 3;
*/

let initialGap = 1;
let gapIncrement = 1;
let incrementDelta = 0;

let utils = {
  clearGrid: null,
  redrawGrid: null,
  drawRectangle: null,
  drawRectangleAt: null,
  rectangleToCoordinate: null,
  getParameters: null,
};

(function init() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
	canvas.width = canvasSize;
	canvas.height = canvasSize;

  let rectangleSize = (canvasSize - resolution) / resolution;

  utils.doMath = () => {
    rectangleSize = (canvasSize - resolution) / resolution;
  }

  utils.clearGrid = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

  utils.redrawGrid = () => {
    utils.clearGrid();
    drawSpiral();
  }

  utils.drawRectangleAt = (x, y) => {
    ctx.clearRect(x, y, rectangleSize, rectangleSize);
    ctx.fillStyle = colors[colorIndex % colors.length];
    ctx.fillRect(x, y, rectangleSize, rectangleSize);
  }

  utils.drawRectangle = (column, row) => {
    const {x, y} = utils.rectangleToCoordinate(column, row);
    colorIndex++ 
    utils.drawRectangleAt(x, y);
  }

  utils.rectangleToCoordinate = (column, row) => {
    const x = column * rectangleSize + column;
    const maxy = (resolution * rectangleSize) + resolution;
    const y = maxy - (row * rectangleSize + row);

    return {x, y};
  }

  utils.handleInput = () => {
    utils.doMath();
    utils.redrawGrid();
  }

  const increaseResolution = () => {
    if (resolution * 1.25 < maxZoom) {
      resolution *= 1.25;
      //inputRes.value = resolution;
      utils.handleInput();
    }
  }

  const decreaseResolution = () => {
    resolution /= 1.25;
    //inputRes.value = resolution;
    utils.handleInput();
  }

  const increaseGap = () => {
    initialGap += gapIncrement;
    gapIncrement += incrementDelta;
    utils.handleInput();
  }

  const decreaseGap = () => {
    if (gapIncrement - incrementDelta > 0) {
        gapIncrement -= incrementDelta;
        initialGap -= gapIncrement;
        utils.handleInput();
    }
  }

  /*
  const inputRes = document.getElementById('inputRes');
  const btnResInc = document.getElementById('btnResInc');
  const btnResDec = document.getElementById('btnResDec');
  btnResInc.addEventListener('click', e => increaseResolution());
  btnResDec.addEventListener('click', e => decreaseResolution());
  */

  document.onkeydown = function(e) {
    switch (e.keyCode) {
    case 87:
      increaseResolution();
      break;
    case 83:
      decreaseResolution();
      break;
    case 65:
      decreaseGap();
      break;
    case 68:
      increaseGap();
      break;
    }
  };

  drawSpiral();
})();

function drawSpiral() {
  let offset = resolution / 2;
  let gap = initialGap;
  let skips = 0;
  let x = 0;
  let y = 0;
  let delta = [0, -1];

  for (let i = Math.pow(resolution * 2, 2); i > 0; i--, skips++) {

    if (skips === gap) {
      utils.drawRectangle(x + offset, y + offset);
      skips = 0;
      gap += gapIncrement;
    }
    
    if (x === y || (x < 0 && x === -y) || (x > 0 && x === 1 - y))
      delta = [-delta[1], delta[0]];

    x += delta[0];
    y += delta[1];
  }
}

