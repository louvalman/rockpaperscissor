// initialize animate on scroll lib
AOS.init();

// add animation on click on image
const img = document.getElementById('anch');

img.addEventListener('click', function () {
  img.style.animation = 'bounce 1s';

  img.addEventListener('animationend', function () {
    img.style.animation = '';
  });
});

// defines a variable to store computer choice - 33% chance for r/p/s based on a random number generated between 1-100
let getComputerChoice = () => {
  let randomNumber = Math.floor(Math.random() * 100) + 1;
  if (randomNumber <= 33) {
    return 'rock';
  } else if (randomNumber <= 66) {
    return 'paper';
  } else {
    return 'scissor';
  }
};

// defines playRound function (core mechanics of game)
function playRound(playerSelection, computerSelection) {
  if (playerSelection === 'rock' && computerSelection === 'paper') {
    return { result: 'You lose! Paper beats Rock.', winner: 'computer' };
  } else if (playerSelection === 'rock' && computerSelection === 'scissor') {
    return { result: 'You win! Rock beats Scissor.', winner: 'player' };
  } else if (playerSelection === 'rock' && computerSelection === 'rock') {
    return { result: 'It is a tie!', winner: null };
  } else if (playerSelection === 'paper' && computerSelection === 'rock') {
    return { result: 'You win! Paper beats rock.', winner: 'player' };
  } else if (playerSelection === 'paper' && computerSelection === 'paper') {
    return { result: 'It is a tie!', winner: null };
  } else if (playerSelection === 'paper' && computerSelection === 'scissor') {
    return { result: 'You lose! Scissor beats paper.', winner: 'computer' };
  } else if (playerSelection === 'scissor' && computerSelection === 'rock') {
    return { result: 'You lose! Rock beats Scissor.', winner: 'computer' };
  } else if (playerSelection === 'scissor' && computerSelection === 'paper') {
    return { result: 'You win! Scissor beats paper', winner: 'player' };
  } else if (playerSelection === 'scissor' && computerSelection === 'scissor') {
    return { result: 'It is a tie!', winner: null };
  }
}

// removes intro game text when game starts
const removeGameText = () => {
  gameText.classList.add('fade-out');
  gameText.addEventListener('transitionend', () => {
    gameTextContainer.removeChild(gameText);
  });
};

const removeRoundCountPlaceholder = () => {
  roundContainer.removeChild(roundCountPlaceholder);
};

// defines game components
let gameText = document.querySelector('.gameText');
let roundContainer = document.querySelector('.roundContainer');
let roundCountPlaceholder = document.querySelector('.roundCountPlaceholder');
let score = document.querySelector('.score');
let playerCompScore = document.querySelector('.playerCompScore');
let gameTextContainer = document.querySelector('.gameTextContainer');

// init scores
let playerScore = 0;
let computerScore = 0;
let tieCounter = 0;

let roundStatus = document.createElement('p');
let playerResult = document.createElement('p');
let computerResult = document.createElement('p');
let roundCount = document.createElement('p');
let gameResult = document.createElement('h2');
let playAgain = document.createElement('button');

const buttons = document.querySelectorAll('button');

// when buttons (r/p/s) are clicked, define player selection, get computer choice and play game
buttons.forEach((button) => {
  button.addEventListener('click', (e) => {
    // if the round count placeholder exists in DOM, remove it (is replaced with round counter below)
    if (roundCountPlaceholder.parentNode === roundContainer) {
      removeRoundCountPlaceholder();
    }

    if (gameText.parentNode === gameTextContainer) {
      removeGameText();
    }

    const playerSelection = e.target.id;
    const computerSelection = getComputerChoice();

    const roundResult = playRound(playerSelection, computerSelection);

    if (roundResult.winner === 'player') {
      // calculate the winner by incrementing the player's or computer's score by looking at the winner variable defined in the playRound function
      playerScore++;
      roundStatus.innerHTML = `For humanity! You win the round with <strong>${playerSelection}</strong> against <strong>${computerSelection}</strong>.`;
      roundStatus.style.color = 'lightgreen';
    } else if (roundResult.winner === 'computer') {
      computerScore++;
      roundStatus.innerHTML = `Damn machines! You lost the round with <strong>${playerSelection}</strong> against <strong>${computerSelection}</strong>.`;
      roundStatus.style.color = 'lightcoral';
    } else if (roundResult.winner === null) {
      tieCounter++;
      roundStatus.innerHTML = `It's a tie. Both you and the machines picked <strong>${playerSelection}</strong>.`;
      roundStatus.style.color = 'cadetblue';
    }

    let roundScore = playerScore + computerScore + tieCounter;

    roundCount.textContent = `Round ${roundScore}`; // move below buttons (and make bigger)
    roundCount.classList.add('roundNumber');
    roundContainer.append(roundCount);

    playerCompScore.appendChild(roundStatus);
    roundStatus.classList.add('fade-in-animation');

    playerResult.innerHTML = `Your score: <strong>${playerScore}</strong><br /> Machine score: <strong>${computerScore}</strong>`; // giver color to leading player (if playerScore > computerScore) playerScore.color = green;
    playerCompScore.appendChild(playerResult);

    const endGame = () => {
      if (computerScore > playerScore) {
        gameResult.textContent =
          'Oh no, the invasion has begun. Humanity is lost.';
        gameResult.style.color = 'lightcoral';
      } else if (playerScore > computerScore) {
        gameResult.textContent = 'You did it! Humanity is saved!';
        gameResult.style.color = 'lightgreen';
      } else if (playerScore === computerScore) {
        gameResult.textContent =
          "It's a tie! Not the kind you tie around your neck.";
        gameResult.style.color = 'cadetblue';
      }

      score.appendChild(gameResult);
      gameResult.classList.add('fade-in-animation');

      score.append(playAgain);
      playAgain.textContent = 'Play again';
      playAgain.classList.add('playAgainClass');

      buttons.forEach((button) => {
        button.setAttribute('disabled', '');
      });
    };

    if (
      // end game if:
      playerScore + computerScore + tieCounter === 5 || // if five rounds are played
      (playerScore === 3 && computerScore === 0 && tieCounter === 1) || // if player/computer reaches a 3-0 score (in 4 rounds)
      (computerScore === 3 && playerScore === 0 && tieCounter === 1) ||
      (playerScore === 2 && computerScore === 0 && tieCounter === 2) || // if a 2-0 score is reached after 4 rounds
      (computerScore === 2 && playerScore === 0 && tieCounter === 2) ||
      (computerScore === 3 && playerScore === 1 && tieCounter === 0) || // if the score is 3-1 after 4 rounds
      (playerScore === 3 && computerScore === 1 && tieCounter === 0) ||
      (playerScore === 3 && computerScore === 0 && tieCounter === 0) || // if the score is 3-0 after 3 rounds
      (computerScore === 3 && playerScore === 0 && tieCounter === 0)
    ) {
      endGame();
    }
  });
});

const newGame = () => {
  // reset the scoreboard and all counters
  playerScore = 0;
  computerScore = 0;
  tieCounter = 0;
  roundScore = 0;
  buttons.forEach((button) => {
    button.removeAttribute('disabled', '');
  });
  roundContainer.appendChild(roundCountPlaceholder);
  gameTextContainer.appendChild(gameText);
  gameText.classList.remove('fade-out');

  roundContainer.removeChild(roundCount);
  playerCompScore.removeChild(playerResult);
  playerCompScore.removeChild(roundStatus);
  score.removeChild(playAgain);
  score.removeChild(gameResult);
  gameResult.textContent = '';
};

playAgain.addEventListener('click', newGame);
