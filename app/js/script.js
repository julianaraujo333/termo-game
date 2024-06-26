const lettersPattern = /[a-z]/;
const msg = document.querySelector('.msg');

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


const validWord = (currentGuess)  => {
	return fetch("https://api.dicionario-aberto.net/word/" + currentGuess)
			.then(response => {
					if (!response.ok) {
							throw new Error('Erro ao acessar a API');
					}
					return response.json();
			})
			.then(data => {
					if (data.length !== 0) {
							return true;
					} else {
						const classes = ['default', 'popup'];
						msg.classList.add(...classes);
						msg.innerHTML = `essa palavra não é aceita`;
						
						return false;
					}
			})
			.catch(error => {
					console.error("Ocorreu um erro ao validar a palavra:", error);
					return false; 
			});
}

document.addEventListener('keydown', (e)  => {
	let keypress = e.key;
	let currentTile = document.querySelector('#guess'+ currentGuessCount +'Tile' + currentGuess.dataset.letters.length);

	// remove bottom border focus
	if(currentGuess.dataset.letters.length){
		currentTile.classList.remove('current-letter');
	}

  if (currentGuessCount < 7) {
    if (
      keypress.length == 1 &&
      lettersPattern.test(e.key) &&
			currentGuess.dataset.letters.length < 5
    ) {
			updateLetters(keypress);
      // console.log('is letter');
    } else if (e.key == 'Backspace' && currentGuess.dataset.letters != '' || e.key === "Delete" && currentGuess.dataset.letters != '') {
			
			// clearing error message
			let msgClean = document.querySelector(".default");
			if(msgClean){
				msg.innerHTML = "";
				msgClean.classList.remove('default');
			}

      deleteFromLetters();
    } else if (e.key == 'Enter' && currentGuess.dataset.letters.length == 5) {
			// console.log('submit guess')

		 validWord(currentGuess.dataset.letters)
			.then(result => {
					if(result){
						submitGuess()
					}
			});
    }
  }
})


const submitGuess = () =>{
	for(let i = 0; i < 5; i++){
		setTimeout(()=>{
			revealTile(i, checkLetter(i));
		}, i * 200)
	}
}

const checkIfGuessComplete = (i) => {
  if (i == 4) {
    checkWin();
  }
};

const checkWin = () =>{
	if(solutionWord == currentGuess.dataset.letters){
		console.log('YOUU WIN')
		jumpTiles()
	}else{
		currentGuessCount = currentGuessCount + 1;
		currentGuess = document.querySelector("#guess" +  currentGuessCount)
		document.querySelector('#guess'+ currentGuessCount).classList.remove('blocked')
	}
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
	let currentTile = document.querySelector('#guess'+ currentGuessCount +'Tile' + tileNumber);
	currentTile.innerText = letter;

	currentTile.classList.add('current-letter');
}

const jumpTiles = () => {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      let currentTile = document.querySelector(
        '#guess' + currentGuessCount + 'Tile' + (i + 1)
      );
      currentTile.classList.add('jump');
    }, i * 200);
  }
};


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
	let currentTile = document.querySelector('#guess'+ currentGuessCount +'Tile' + tileNumber);
	currentTile.innerText = "";
}

/**
 *  Check Letter solution
 */

const checkLetter = (position) =>{
  let guessedLetter = currentGuess.dataset.letters.charAt(position);
  let solutionLetter = solutionWord.charAt(position);

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


/**
 *  Reveal letters state
 */

const revealTile = (i, status) => {
	let guessedLetter = currentGuess.dataset.letters.charAt(i);
	let tileNum = i + 1;
	let tile = document.querySelector('#guess'+ currentGuessCount +'Tile' + tileNum);
	
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

	flipTile(tileNum)
	checkIfGuessComplete(i);
}

// adding flip animation
const flipTile = (tileNum) => {
	let tile = document.querySelector('#guess'+ currentGuessCount +'Tile' + tileNum);
	
  tile.classList.add('flip-in');
  setTimeout(() => {
    tile.classList.remove('flip-in');
    tile.classList.add('flip-out');
  }, 250);
  setTimeout(() => {
    tile.classList.remove('flip-out');
  }, 1500);
};
