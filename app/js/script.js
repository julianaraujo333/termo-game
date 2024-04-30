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

console.log('\nsolutionWord ' + solutionWord)
/* 
	* **   DICIONARIO API ** 
	* fetch("https://api.dicionario-aberto.net/random")    
	*		.then(response => response.json())
	*		.then(data => console.log(data))
*/

document.addEventListener('keydown', (e) => {
	let keypress = e.key;

  if (currentGuessCount < 7) {
    if (
      keypress.length == 1 &&
      lettersPattern.test(e.key) &&
			currentGuess.dataset.letters.length < 5
    ) {
			updateLetters(keypress);
      // console.log('is letter');
    } else if (e.key == 'Backspace' && currentGuess.dataset.letters != '' || e.key === "Delete" && currentGuess.dataset.letters != '') {
			
      deleteFromLetters();
    } else if (e.key == 'Enter' && currentGuess.dataset.letters.length == 5) {
			// console.log('submit guess')
			for(let i = 0; i < 5; i++){
				revealTile(i, checkLetter(i));
			}
    }
  }
})

const submitGuess = () =>{

}


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

/**
 *  Check Letter solution
 */

const checkLetter = (position) =>{
	console.log('position ' + position)

  let guessedLetter = currentGuess.dataset.letters.charAt(position);
  let solutionLetter = solutionWord.charAt(position);
  console.log(guessedLetter, solutionLetter);

	// Se a letra existir e a posição estiver correta retorna correct
	if(guessedLetter == solutionLetter){
		return 'correct'
	} else{
		// se a letra existir e a posicao estiver incorreta retorna present 
		if(checkLetterExists(guessedLetter)){
			return 'present'
		}else{
			// se a letra não existir na solucao retorna absent
			return 'absent'
		}
	}
}

const checkLetterExists =  (letter) => {
	return solutionWord.includes (letter)
}

const revealTile = (i, status) => {
	let guessedLetter = currentGuess.dataset.letters.charAt(i);
	let tileNum = i + 1;
	let tile = document.querySelector('#guessTile' + tileNum);

	if(status == 'correct'){
		tile.classList.add('correct');
		tile.setAttribute("aria-label", "letra '" + guessedLetter + "' está correta");
	}else if(status == 'present'){
		tile.classList.add('present');
		tile.setAttribute("aria-label", "letra '" + guessedLetter + "' está em outra posição");
	}else  if(status == 'absent'){
		tile.classList.add('absent');
		tile.setAttribute("aria-label", "letra '" + guessedLetter + "' está errada");
	}
}