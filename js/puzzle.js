/**
 * -------------------------------------------------------------
 *  DAN ALCAIDE www.danalcaide.com
 *  Jigsaw Puzzle
 * -------------------------------------------------------------
 *  Author:     Dan Alcaide
 *  Desc.:      Puzzle script
 *  Date:       29 November, 2020
 * -------------------------------------------------------------
 */

/**
 * Main function.
 * Start a new game.
 */
function mainPuzzle() {
  // Check options.
  let level = getOptionLevel();
  let picture = getOptionPicture();
  let puzzleGameOriginal = document.getElementById('puzzle-game-original');
  let puzzleGameGrid = document.getElementById('puzzle-game-grid');
  let puzzlePictureOriginal = document.getElementById('puzzle-picture-original');
  
  // Delete all node childs just in case there is an old game yet.
  removeAllChilds(puzzleGameOriginal);
  removeAllChilds(puzzleGameGrid);
  removeAllChilds(puzzlePictureOriginal);
  puzzleGameGrid.removeAttribute("class");
  
  // Add original picture to toggle solution.
  puzzlePictureOriginal.insertAdjacentHTML('afterbegin', '<img id="picture-original" src="' + picture + '" alt="Original image">');
  
  // Add a class in game grid.
  puzzleGameGrid.classList.add('grid' + level);
  
  // Create grid.
  let pictureOriginal = document.getElementById('picture-original');
  createGrid(level, pictureOriginal, puzzleGameOriginal, puzzleGameGrid);

  // Capture event to shuffle pieces.
  document.getElementById('shuffle-link').onclick = function (e) {
    e.preventDefault();
    shufflePieces();
  }

  // Events drag&drop for puzzle pieces	.
  let cols = document.querySelectorAll('#puzzle-game-original img');
  [].forEach.call(cols, function (col) {
    col.addEventListener('dragstart', handleDragStart, false);
    col.addEventListener('dragend', handleDragEnd, false);
  });

  document.addEventListener('dragenter', handleDragEnter, false)
  document.addEventListener('dragover', handleDragOver, false);
  document.addEventListener('dragleave', handleDragLeave, false);
  document.addEventListener('drop', handleDrop, false);
}

/**
 * When the draggable element is being dragged.
 */
function handleDragStart(e) {
  e.dataTransfer.effecAllowed = 'move';
  // Taking the element being moved.
  e.dataTransfer.setData('Text', e.target.id);
  this.classList.add('drag');
}

/**
 * When the draggable element is ended to drag.
 */
function handleDragEnd(e) {
  this.classList.remove('drag');
  // e.dataTransfer.clearData('Data');
}

/**
 * When the draggable element enter in droptarget.
 */
function handleDragEnter(e) {
  if ((e.target.id == 'puzzle-game-original') || (e.target.className == 'grid-piece')) {
    e.target.style.boxShadow = 'inset 0 0 0 2px red';
  }

  return true;
}

/**
 * When the draggable element leaves the droptarget.
 */
function handleDragLeave(e) {
  if ((e.target.id == 'puzzle-game-original') || (e.target.className == 'grid-piece')) {
    e.target.style.boxShadow = 'none';
  }
}

/**
 * When the draggable element is over droptarget.
 * Return false if the object can be dropped in that element and true otherwise.
 */
function handleDragOver(e) {
  e.preventDefault();
}

/**
 * When the draggable element is dropped in droptarget.
 */
function handleDrop(e) {
  e.preventDefault();

  if ((e.target.id == 'puzzle-game-original') || (e.target.className == 'grid-piece')) {
    let elementDrag = e.dataTransfer.getData('Text');

    // Add the element in droptarget.
    e.target.appendChild(document.getElementById(elementDrag));
    e.target.style.boxShadow = 'none';

    // Check if the puzzle is finished.
    checkPuzzle();
  }
}

/**
 * Check if the puzzle is finished.
 */
function checkPuzzle() {
  let pieces = document.querySelectorAll('#puzzle-game-grid img');
  let level = getOptionLevel();
  let oPiece, gPiece;
  let cont = 0;

  [].forEach.call(pieces, function (piece) {
    oPiece = piece.id.substring(6, 8);
    gPiece = piece.parentNode.id.substring(6, 8);
    if (oPiece != gPiece) {
      return false;
    }
    cont++;
  });

  if (cont == level) {
    alert('Congratulations! the puzzle is complete');
  }
}

/**
 * Crop an image in n pieces
 * @param image (object)
 * @param numRows (int)
 * @param numCols (int)
 * @param i (int)
 * @param j (int)
 */
function cropImage(image, numRows, numCols, i, j) {
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  let imageCanvas = new Image();
  let imageX = new Image();

  canvas.width = image.naturalWidth / numRows;
  canvas.height = image.naturalHeight / numCols;
  // imageCanvas.crossOrigin = 'Anonymous';
  // imageX.crossOrigin = 'Anonymous';

  imageCanvas.onload = function () {
    // Draw cropped image.
    let sourceX = (image.naturalWidth / numRows) * j;
    let sourceY = (image.naturalHeight / numCols) * i;
    let sourceWidth = image.naturalWidth / numRows;
    let sourceHeight = image.naturalHeight / numCols;
    let destWidth = sourceWidth;
    let destHeight = sourceHeight;
    let destX = canvas.width / 2 - destWidth / 2;
    let destY = canvas.height / 2 - destHeight / 2;

    context.drawImage(imageCanvas, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

    // Convert canvas to image.
    imageX.src = canvas.toDataURL('image/png');
  };

  imageCanvas.src = image.src;

  return imageX;
}

/**
 * Create grid game.
 * @param dimension (int)
 * @param image (object)
 * @param puzzleGameOriginal (object)
 * @param puzzleGameGrid (object)
 */
function createGrid(dimension, image, puzzleGameOriginal, puzzleGameGrid) {
  // Create nodes in DOM.
  let originalPiece;
  let gridPiece;
  let numRows = Math.sqrt(dimension);
  let numCols = Math.sqrt(dimension);

  // Create pieces and their images.
  for (i = 0; i < numRows; i++) {
    for (j = 0; j < numCols; j++) {
      // Original pieces.
      originalPiece = cropImage(image, numRows, numCols, i, j);
      originalPiece.id = 'opiece' + i + j;
      originalPiece.classList.add('original-piece');
      originalPiece.draggable = 'true';
      // Add node.
      puzzleGameOriginal.appendChild(originalPiece);

      // Grid pieces.
      gridPiece = document.createElement('div');
      gridPiece.id = 'gpiece' + i + j;
      gridPiece.classList.add('grid-piece');
      // Add node.
      puzzleGameGrid.appendChild(gridPiece);
    }
  }

  // Shuffle pieces.
  shufflePieces();
}

/**
 * Shuffle pieces.
 */
function shufflePieces() {
  let pieces = document.getElementById('puzzle-game-original');
  let piecesx = pieces.getElementsByTagName('img');
  let elementsRandom = shuffle(piecesx);
  let l = elementsRandom.length;

  for (i = 0; i < l; i++) {
    pieces.appendChild(elementsRandom[i])
  }
}

/**
 * Randomize array element order.
 * Fisher-Yates algorithm
 * @param o (array)
 */
function shuffle(o) {
  for (let j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);

  return o;
}

/**
 * Check level option.
 */
function getOptionLevel() {
  let level = parseInt(document.querySelector('input[name="level"]:checked').value);

  document.querySelector('input[name="level"]').onchange = function () {
    return level;
  }

  return level;
}

/**
 * Check picture option.
 */
function getOptionPicture() {
  let picture = document.querySelector('input[name="picture"]:checked').value;

  document.querySelector('input[name="picture"]').onchange = function () {
    return picture;
  }

  return picture;
}

/**
 * Helper function to remove all childs in a node.
 * @param node (NodeList object)
 */
function removeAllChilds(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}
