// initialize animate on scroll lib
AOS.init();

// defines game components
const container = document.querySelector('.container');
const startBtn = document.querySelector('.start-btn');
const startBtnText = document.querySelector('.start-btn-text');
const startGame = document.querySelector('.start-game');
const selectionButtons = document.querySelectorAll('.selection button');
const gameTextHeaderContainer = document.querySelector(
  '.game-text-header-container'
);
const gameTextHeader = document.querySelector('.game-text-header');
const gameText = document.querySelector('.game-text');
const roundContainer = document.querySelector('.round-container');
const roundCountPlaceholder = document.querySelector(
  '.round-count-placeholder'
);
const score = document.querySelector('.score');
const playerCompScore = document.querySelector('.player-comp-score');
const gameTextContainer = document.querySelector('.game-text-container');
const gameOverMsg = document.querySelector('.game-over-msg');
const selection = document.querySelector('.selection');

// remove animation on hover on start game btn
function disableAnimation() {
  startBtnText.classList.remove('start-btn-text');
  startBtn.classList.remove('start-btn');
  startBtn.classList.add('start-btn-hover');
}

function enableAnimation() {
  startBtnText.classList.add('start-btn-text');
  startBtn.classList.add('start-btn');
  startBtn.classList.remove('start-btn-hover');
}

startBtn.addEventListener('mouseenter', disableAnimation);
startBtn.addEventListener('mouseleave', enableAnimation);

// start game and make round 1 selection visible
startBtn.addEventListener('click', () => {
  startGame.style.opacity = '1';
  container.removeChild(startBtn);
});

// defines a variable to store computer choice - 33% chance for r/p/s based on a random number generated between 1-100
let getComputerChoice = () => {
  let randomNumber = Math.floor(Math.random() * 100) + 1;
  if (randomNumber <= 33) {
    return 'rock';
  } else if (randomNumber <= 66) {
    return 'paper';
  } else {
    return 'scissors';
  }
};

// defines playRound function (core mechanics of game) used when player clicks on their selection for each round
function playRound(playerSelection, computerSelection) {
  if (playerSelection === 'rock' && computerSelection === 'paper') {
    return { winner: 'computer' };
  } else if (playerSelection === 'rock' && computerSelection === 'scissors') {
    return { winner: 'player' };
  } else if (playerSelection === 'rock' && computerSelection === 'rock') {
    return { winner: null };
  } else if (playerSelection === 'paper' && computerSelection === 'rock') {
    return { winner: 'player' };
  } else if (playerSelection === 'paper' && computerSelection === 'paper') {
    return { winner: null };
  } else if (playerSelection === 'paper' && computerSelection === 'scissors') {
    return { winner: 'computer' };
  } else if (playerSelection === 'scissors' && computerSelection === 'rock') {
    return { winner: 'computer' };
  } else if (playerSelection === 'scissors' && computerSelection === 'paper') {
    return { winner: 'player' };
  } else if (
    playerSelection === 'scissors' &&
    computerSelection === 'scissors'
  ) {
    return { winner: null };
  }
}

// removes game text header when game starts
const removeGameTextHeader = () => {
  gameTextHeader.classList.add('fade-out');
  gameTextHeaderContainer.removeChild(gameTextHeader);
};

// removes intro game text when game starts
const removeGameText = () => {
  gameText.classList.add('fade-out');
  gameTextContainer.removeChild(gameText);
};

const removeRoundCountPlaceholder = () => {
  roundContainer.removeChild(roundCountPlaceholder);
};

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
selectionButtons.forEach((button) => {
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

    const playerSelection = e.currentTarget.id;
    const computerSelection = getComputerChoice();

    const roundResult = playRound(playerSelection, computerSelection);

    if (roundResult.winner === 'player') {
      playerScore++;
      roundScore++;
      roundStatus.innerHTML = `<span style="color: #00cb00; font-size: 20px;"><strong>You won round ${
        roundScore - 1
      }</strong></span><br><strong>${
        playerSelection.charAt(0).toUpperCase() + playerSelection.slice(1)
      }</strong> beats <strong>${computerSelection}</strong>. Hope is restored!`;
    } else if (roundResult.winner === 'computer') {
      computerScore++;
      roundScore++;
      roundStatus.innerHTML = `<span style="color: #EE3224; font-size: 20px;"><strong>You lost round ${
        roundScore - 1
      }</strong></span><br><strong>${
        playerSelection.charAt(0).toUpperCase() + playerSelection.slice(1)
      }</strong> loses to <strong>${computerSelection}</strong>. Damn machines!`;
    } else if (roundResult.winner === null) {
      roundStatus.innerHTML = `<span style="color: cadetblue; font-size: 20px;"><strong>It's a tie</strong></span><br>Both you and the machines picked <strong>${playerSelection}</strong>. Replay round <strong>${roundScore}</strong>.`;
    }

    let bestOfText = document.createElement('p');
    bestOfText.textContent = 'best of 5';
    bestOfText.classList.add('best-of');

    roundCount.innerHTML = `<strong>Round ${roundScore}</strong><br>`; // show round score below buttons (and make bigger)

    roundCount.appendChild(bestOfText);
    roundCount.classList.add('round-number');
    roundContainer.append(roundCount);

    playerCompScore.appendChild(roundStatus);
    roundStatus.classList.add('fade-in-animation');

    playerResult.innerHTML = `Your score: <strong>${playerScore}</strong><br /> Machine score: <strong>${computerScore}</strong>`; // giver color to leading player (if playerScore > computerScore) playerScore.color = green;
    playerCompScore.appendChild(playerResult);

    const endGame = () => {
      if (computerScore > playerScore) {
        gameResult.textContent =
          'Oh no, the invasion has begun. Humanity is lost.';
        gameResult.style.color = '#EE3224';
      } else if (playerScore > computerScore) {
        gameResult.textContent = 'You did it! Humanity is saved!';
        gameResult.style.color = '#00cb00';
      } else if (playerScore === computerScore) {
        gameResult.textContent =
          "It's a tie! The machines want a rematch. Do you?";
        gameResult.style.color = '#83C5BE';
      }

      roundCount.innerHTML = `<br>`;

      gameOverMsg.append(gameResult);
      gameResult.classList.add('fade-in-animation');

      score.append(playAgain);
      playAgain.textContent = 'Play again';
      playAgain.classList.add('play-again-class');

      selectionButtons.forEach((button) => {
        button.setAttribute('disabled', '');
        selection.removeChild(button);
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
    }
  });
});

const newGame = () => {
  // reset the scoreboard and all counters
  playerScore = 0;
  computerScore = 0;
  roundScore = 1;
  selectionButtons.forEach((button) => {
    button.removeAttribute('disabled', '');
    selection.appendChild(button); // Re-append each button to the selection container
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
  gameOverMsg.removeChild(gameResult);
  gameResult.textContent = '';

  // scroll to top of page
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

playAgain.addEventListener('click', newGame);
