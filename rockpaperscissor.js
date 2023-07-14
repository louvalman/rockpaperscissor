// initialize animate on scroll lib
AOS.init();

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

// removes game text header when game starts
const removeGameTextHeader = () => {
  gameTextHeader.classList.add('fade-out');
  gameTextHeader.addEventListener('transitionend', () => {
    gameTextHeaderContainer.removeChild(gameTextHeader);
  });
};

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
let gameTextHeaderContainer = document.querySelector(
  '.gameTextHeaderContainer'
);
let gameTextHeader = document.querySelector('.gameTextHeader');
let gameText = document.querySelector('.gameText');
let roundContainer = document.querySelector('.roundContainer');
let roundCountPlaceholder = document.querySelector('.roundCountPlaceholder');
let score = document.querySelector('.score');
let playerCompScore = document.querySelector('.playerCompScore');
let gameTextContainer = document.querySelector('.gameTextContainer');

// init scores
let playerScore = 0;
let computerScore = 0;
let roundScore = 1;

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
    // if the gameTextHeader, gameText or round count placeholder exists in DOM, remove it (it is replaced below)
    if (gameTextHeader.parentNode === gameTextHeaderContainer) {
      removeGameTextHeader();
    }

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
      roundScore++;
      roundStatus.innerHTML = `For humanity! You win round <strong>${
        roundScore - 1
      }</strong> with <strong>${playerSelection}</strong> against <strong>${computerSelection}</strong>.`;
      roundStatus.style.color = 'lightgreen';
    } else if (roundResult.winner === 'computer') {
      computerScore++;
      roundScore++;
      roundStatus.innerHTML = `Damn machines! You lost round <strong>${
        roundScore - 1
      }</strong> with <strong>${playerSelection}</strong> against <strong>${computerSelection}</strong>.`;
      roundStatus.style.color = 'lightcoral';
    } else if (roundResult.winner === null) {
      roundStatus.innerHTML = `It's a tie. Both you and the machines picked <strong>${playerSelection}</strong>.<br>Replay the round.`;
      roundStatus.style.color = 'cadetblue';
    }

    let bestOfText = document.createElement('p');
    bestOfText.textContent = 'best of 5';
    bestOfText.classList.add('bestOf');

    roundCount.innerHTML = `Round ${roundScore}<br>`; // show round score below buttons (and make bigger)

    roundCount.appendChild(bestOfText);
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
          "It's a tie! The machines want a rematch. Do you?";
        gameResult.style.color = 'cadetblue';
      }

      roundCount.innerHTML = `Game over<br>`;

      score.append(gameResult);
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
      playerScore + computerScore === 5 || // if five rounds are played
      (playerScore === 3 && computerScore === 0) || // if player/computer reaches a 3-0 score (in 4 rounds)
      (computerScore === 3 && playerScore === 0) ||
      (computerScore === 3 && playerScore === 1) || // if the score is 3-1 after 4 rounds
      (playerScore === 3 && computerScore === 1) ||
      (playerScore === 3 && computerScore === 0) || // if the score is 3-0 after 3 rounds
      (computerScore === 3 && playerScore === 0)
    ) {
      endGame();
      // scroll to bottom of page
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  });
});

const newGame = () => {
  // reset the scoreboard and all counters
  playerScore = 0;
  computerScore = 0;
  roundScore = 1;
  buttons.forEach((button) => {
    button.removeAttribute('disabled', '');
  });
  gameTextHeaderContainer.appendChild(gameTextHeader);
  gameTextHeader.classList.remove('fade-out');
  roundContainer.appendChild(roundCountPlaceholder);
  gameTextContainer.appendChild(gameText);
  gameText.classList.remove('fade-out');

  roundContainer.removeChild(roundCount);
  playerCompScore.removeChild(playerResult);
  playerCompScore.removeChild(roundStatus);
  score.removeChild(playAgain);
  score.removeChild(gameResult);
  gameResult.textContent = '';

  // scroll to top of page
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

playAgain.addEventListener('click', newGame);
