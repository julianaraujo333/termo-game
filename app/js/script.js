const lettersPattern = /[a-z]/;
let currentGuessCount = 1;
let currentGuess = document.querySelector('#guess' + currentGuessCount);
let currentLetter = currentGuess.dataset.letters;
let words = ['nobre', 'audaz', 'sonho', 'amigo', 'lapso'];
let solutionWord = '';

const chooseWord = () => {
  let randomItem = Math.floor(Math.random() * (words.length - 1)) + 1;
  solutionWord = words[randomItem];
};

chooseWord();

document.addEventListener('keydown', (e) => {
	let keypress = e.key;

	console.log(e)
  if (currentGuessCount < 7) {
    if (
      keypress.length == 1 &&
      lettersPattern.test(e.key) &&
			currentGuess.dataset.letters.length < 5
    ) {
			updateLetters(keypress);
      console.log('is letter');
    } else if (e.key == 'Backspace' && currentGuess.dataset.letters != '' || e.key === "Delete" && currentGuess.dataset.letters != '') {
			
      deleteFromLetters();
    } else if (e.key == 'Enter' && currentGuess.dataset.letters.length == 5) {
      // submitGuess();
    }
  }
})


/**
 * Updates the entered letters for the current guess and updates corresponding tiles.
 */

const updateLetters = (letter) => {
	let oldLetters = currentGuess.dataset.letters;
	let newLetters = oldLetters + letter; 
	let currentTile = newLetters.length;
	currentGuess.dataset.letters = newLetters;
	updateTiles(currentTile, letter);
}

const updateTiles = (tileNumber, letter) => {
	let currentTile = document.querySelector('#guessTile' + tileNumber);
	currentTile.innerText = letter;
}


/**
 * Delete last letter
 */
const deleteFromLetters = () => {
  let oldLetters = currentGuess.dataset.letters;
  let newLetters = oldLetters.slice(0, -1);
  currentGuess.dataset.letters = newLetters;
	
  deleteFromTiles(oldLetters.length);
};

const deleteFromTiles = (tileNumber) =>{
	document.querySelector('#guessTile' + tileNumber).innerText = "";
}

fetch("https://api.dicionario-aberto.net/random")
    .then(response => response.json())
    .then(data => console.log(data))

