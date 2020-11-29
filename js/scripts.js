/**
 * -------------------------------------------------------------
 *  DAN ALCAIDE www.danalcaide.com
 *  Jigsaw Puzzle
 * -------------------------------------------------------------
 *  Author:     Dan Alcaide
 *  Desc.:      General script
 *  Date:       29 November, 2020
 * -------------------------------------------------------------
 */

/**
 * Initial loading.
 */
// window.addEventListener("DOMContentLoaded", function(event) {
//   mainStartGame();
//   mainParallaxScroll();
//   mainPuzzleOptions();
// });

document.onreadystatechange = function () {
  switch (document.readyState) {
    case "loading": // The document is still loading.
      break;
    case "interactive": // DOM is ready.
      mainStartGame();
      mainParallaxScroll();
      mainPuzzleOptions();
      break;
    case "complete": // The page is fully loaded.
      break;
  }
}

/**
 * Start game.
 */
function mainStartGame() {
  document.getElementById('start').onclick = function (e) {
    mainPuzzle();
  };
}

/**
 * Parallax.
 */
// Main function.
function mainParallaxScroll() {
  window.onscroll = function () {
    parallaxScroll();
  };
}

// Parallax effect.
function parallaxScroll() {
  let scrollTop = (document.documentElement || document.body.parentNode || document.body).scrollTop;

  document.getElementById('home').style.backgroundPositionY = (scrollTop * 0.5) + 'px';
}

/**
 * Check puzzle options.
 */
function mainPuzzleOptions() {
  // Level options.
  defaultPuzzleOptions(document.querySelector('input[name="level"]:checked'));
  listActivePuzzleOptions(document.querySelectorAll("#form-level label"))

  // Picture options.
  defaultPuzzleOptions(document.querySelector('input[name="picture"]:checked'));
  listActivePuzzleOptions(document.querySelectorAll("#form-picture label"))

  // Toggle solution.
  document.getElementById('picture-original-link').onclick = function (e) {
    e.preventDefault();
    document.getElementById('puzzle-picture-original').classList.toggle("show");
  };
}

/**
 * Helper function.
 * @param default_option (NodeList object)
 */
function defaultPuzzleOptions(default_option) {
  if (default_option) {
    default_option.parentNode.classList.add('active');
  }
}

/**
 * Helper function.
 * @param options (NodeList object)
 */
function listActivePuzzleOptions(options) {
  if (options) {
    options.forEach(function(option) {
      option.onclick = function (e) {
        this.classList.add('active');
        for (let sibling of option.parentNode.children) {
          if (sibling !== this) {
            sibling.classList.remove('active');
          }
        }
      };
    });
  }
}
