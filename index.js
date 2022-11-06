let deckId;
const cardsContainer = document.getElementById("cards");
const newDeckBtn = document.getElementById("new-deck");
const drawCardBtn = document.getElementById("draw-cards");
const winnerSection = document.getElementById("winner");
const remainingCards = document.getElementById("remaining");
const computerScoreEl = document.getElementById("computer-score");
const myScoreEl = document.getElementById("player-score");

let compScore = 0;
let myScore = 0;

async function handleClick() {
  const response = await fetch(
    "https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/"
  );
  const data = await response.json();

  deckId = data.deck_id;
  remainingCards.textContent = `Remaining: ${data.remaining} `;
}

newDeckBtn.addEventListener("click", handleClick);

drawCardBtn.addEventListener("click", async () => {
  const response = await fetch(
    `https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`
  );
  const data = await response.json();

  cardsContainer.children[0].innerHTML = `
                <img src=${data.cards[0].image} class="card" />
            `;
  cardsContainer.children[1].innerHTML = `
                <img src=${data.cards[1].image} class="card" />
            `;

  const winnerText = determineCardWinner(data.cards[0], data.cards[1]);
  winnerSection.textContent = winnerText;
  remainingCards.textContent = `Remaining: ${data.remaining} `;

  if (data.remaining === 0) {
    drawCardBtn.disabled = true;
    if (myScore > compScore) {
      winnerSection.textContent = "Computer wins the war!";
    } else if (compScore > myScore) {
      winnerSection.textContent = "You win the war!";
    } else {
      winnerSection.textContent = "No one wins!";
    }
  }
});

function determineCardWinner(card1, card2) {
  const valueOptions = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "JACK",
    "QUEEN",
    "KING",
    "ACE",
  ];
  const card1ValueIndex = valueOptions.indexOf(card1.value);
  const card2ValueIndex = valueOptions.indexOf(card2.value);

  if (card1ValueIndex > card2ValueIndex) {
    compScore++;
    computerScoreEl.textContent = `
    Computer score: ${compScore}
    `;
    return "Computer wins!";
  } else if (card1ValueIndex < card2ValueIndex) {
    myScore++;
    myScoreEl.textContent = `
    My score: ${myScore}
    `;
    return "You win";
  } else {
    return "War!";
  }
}
