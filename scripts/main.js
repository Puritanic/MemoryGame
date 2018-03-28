const grid = document.getElementById('js-grid');
const startBtn = document.getElementById('js-start');
const restartBtn = document.getElementById('js-restart');
const modal = document.getElementById('js-modal');
const closeBtn = document.getElementById('js-close');
const movesDisplay = document.getElementById('js-moves');
const cardArr = ['css3', 'node', 'postcss', 'react', 'redux', 'gulp', 'sass', 'webpack'];
const timerDisplay = document.getElementById('js-timer');
const images = cardArr.concat(cardArr);

let config = {
  seconds: 0,
  minutes: 0,
  hours: 0,
  timeout: null,
  moveCounter: 0,
  pairs: 8,
};
let cardsToMatch = [];

// cards are an Array like object, and we cant use forEach directly on them, but we can use Array prototype call
// useful snippet
// Array.prototype.forEach.call(cards, card => {
//   card.addEventListener('click', ev => {
//     card.classList.add('active');
//   });
// });

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

if (cardsToMatch.length === 2) {
  cardsToMatch = [];
}

/**
 * Generates Grid with the cards
 * @param {array} src
 * @param {DOM Node} grid
 */
function generateGrid(src, grid) {
  src.map((image, index) => {
    var el = document.createElement('div');
    el.classList.add('card');
    el.id = `js-${image}-${index}`;
    el.setAttribute('data-card', image);
    el.innerHTML = `
      <div class="front">
        <img src="./images/gordon.svg" alt="game card">
      </div>
      <div class="back">
        <img src="./images/${image}.svg" alt="game card">
      </div>
    `;
    el.addEventListener('click', handleClick.bind(null, event, el));

    return grid.appendChild(el);
  });
}

/**
 * Handles click on the card
 * @param {event} e
 * @param {DOM element} clicked element
 */
function handleClick(e, el) {
  if (cardsToMatch.length === 2 && !cardsToMatch.some(c => c.id === el.id)) {
    cardsToMatch = [];
    resetClass(grid);
  }

  displayCard(el);

  if (cardsToMatch.length === 2) {
    return checkMatch(cardsToMatch) ? matched(cardsToMatch) : null;
  }
}

/**
 * Increment moves variable during the game
 */
function incrementMoves() {
  config.moveCounter++;

  movesDisplay.textContent = `Moves: ${config.moveCounter}`;
  if (config.moveCounter > 40) {
    document.getElementById('js-rating').innerHTML = `
    <img class="rating__star" src="/images/star.svg" alt="rating">
    <img class="rating__star" src="/images/star.svg" alt="rating">
    `;
  }
  if (config.moveCounter > 50) {
    document.getElementById('js-rating').innerHTML = `
    <img class="rating__star" src="/images/star.svg" alt="rating">
    `;
  }
}

/**
 * Check cardsToMatch array to see if two cards are the same
 * @param {arr} arr
 * @returns boolean
 */
function checkMatch(arr) {
  const [a, b] = arr;
  return a.data === b.data && !(a.id === b.id);
}

/**
 * displays clicked card, and pushes it to cardsToMatch array
 * @param {DOM Node} card
 */
function displayCard(el) {
  const card = {
    data: el.getAttribute('data-card'),
    id: el.id
  };
  // console.log(
  //   cardsToMatch.some(c => c.id === card.id),
  //   el.classList.contains('matched')
  // );
  if (!cardsToMatch.some(c => c.id === card.id) &&
    !el.classList.contains('matched')
  ) {
    el.classList.add('active');
    cardsToMatch.push(card);
    incrementMoves();
  }
}

/**
 * Activates when two cards are matched, controls styles
 * decrements number of card pairs, and checks if there is card pairs left
 * @param {any} arr
 */
function matched(arr) {
  const [a, b] = arr;
  const first = document.getElementById(a.id);
  const last = document.getElementById(b.id);
  if (!first.classList.contains('matched') &&
    !last.classList.contains('matched')
  ) {
    first.classList.add('matched');
    last.classList.add('matched');
    first.classList.remove('active');
    last.classList.remove('active');
    config.pairs--;

    if (config.pairs < 1) {
      return victory();
    }
  }
}

/**
 * Activates once pairs variable decrements to zero
 * Activates modal
 */
function victory() {
  clearTimeout(config.timeout);

  modal.classList.add('active');
  modal.innerHTML = renderModal();

  modal.addEventListener('click', function (event) {
    if (event.target.id === 'js-close') {
      modal.classList.remove('active');
    } else if (event.target.id === 'js-modal-restart') {
      modal.classList.remove('active');

      startGame();
    }
  });
}

/**
 * Resets active classes for unmatched cards
 * @param {DOM Nodes} Card elements
 */
function resetClass(el) {
  return el.childNodes.forEach(el => el.classList.remove('active'));
}

// https://stackoverflow.com/a/2450976/7453363
// https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  let m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

/**
 * Starts new game
 */
function startGame() {
  const shuffledCards = shuffle(images);

  clearTimeout(config.timeout);
  resetConfig();

  document.getElementById('js-rating').innerHTML = `
  <img class="rating__star" src="./images/star.svg" alt="rating">
  <img class="rating__star" src="./images/star.svg" alt="rating">
  <img class="rating__star" src="./images/star.svg" alt="rating">  
  `;
  restartBtn.style.display = 'block';

  generateGrid(shuffledCards, grid);
  timer();
}

/**
 * Resets game configuration
 */
function resetConfig() {
  config = {
    seconds: 0,
    minutes: 0,
    hours: 0,
    timeout: null,
    moveCounter: 0,
    pairs: 8,
  }
  grid.innerHTML = '';
  movesDisplay.textContent = '0';
  timerDisplay.textContent = '00:00:00';
  startBtn.textContent = 'Restart Game';
  modal.classList.remove('active');
}

// Timer functionality
function add() {
  config.seconds++;
  if (config.seconds >= 60) {
    config.seconds = 0;
    config.minutes++;
    if (config.minutes >= 60) {
      config.minutes = 0;
      config.hours++;
    }
  }

  timerDisplay.textContent =
    (config.hours ? (config.hours > 9 ? config.hours : '0' + config.hours) : '00') +
    ':' +
    (config.minutes ? (config.minutes > 9 ? config.minutes : '0' + config.minutes) : '00') +
    ':' +
    (config.seconds > 9 ? config.seconds : '0' + config.seconds);

  timer();
}

/**
 * Starts timer
 */
function timer() {
  config.timeout = setTimeout(add, 1000);
}

/**
 * Renders modal once the game is finished
 * @returns string
 */
function renderModal() {
  return `
  <span id="js-close">&times;</span>
  <h1>
    <img class="star" src="images/star.svg" alt="star">
    ${
      config.moveCounter <= 40
        ? '<img class="star" style="margin-bottom: 15px;"  src="images/star.svg" alt="star">'
        : ''
    }
    ${
      config.moveCounter <= 50
        ? '<img class="star" src="images/star.svg" alt="star">'
        : ''
    }
  </h1>
  <h2>Your score: ${config.moveCounter} | Time: ${timerDisplay.textContent}</h2>
  <button class="btn"> <img id="js-modal-restart" src="./images/restart.png" width="55px" height="auto" alt="Restart game" title="Restart game"></button>
  `;
}