//import { saveCardsToLocal, loadCardsFromLocal, addOrUpdateCard } from "shop.js";

// index of the card to be displayed
let selected_card = 0;
let card_data = [];

function loadSelectedCard() {
  const data = localStorage.getItem("selected_card");
  return data ? JSON.parse(data) : [];
}

window.addEventListener("DOMContentLoaded", init);

/**
 * @description Finds the index of a card in localStorage's "card_data" array.
 * @param {Object} card - The card object to find (must include at least `name` and `rarity`).
 * @returns {number} The index of the card if found, or -1 if not found.
 */
function findCardIndex(card) {
  const cardData = localStorage.getItem("card_data");
  if (!cardData) return -1;

  const cards = JSON.parse(cardData);
  return cards.findIndex(c => c.name === card.name && c.rarity === card.rarity);
}

/**
 * @description Adds a click event listener to the next and prev buttons.
 * When clicked, it updates the selected_card index and creates a new card.
 * @returns {void}
 */
function card_button_click() {
  const next_button = document.getElementById("next");
  const prev_button = document.getElementById("prev");
  if (!next_button || !prev_button){
    return
  }
  next_button.addEventListener("click", function () {
    if (selected_card + 1 > card_data.length - 1) {
      console.log("No more cards to show");
      next_button.disabled = true;
      return;
    }
    selected_card++;
    next_button.disabled = selected_card + 1 > card_data.length - 1;
    prev_button.disabled = false;

    if (selected_card >= 0 && selected_card < card_data.length) {
      createCard(card_data[selected_card]);
    }
  });

  prev_button.addEventListener("click", function () {
    if (selected_card - 1 < 0) {
      console.log("No more cards to show");
      prev_button.disabled = true;
      return;
    }
    selected_card--;
    prev_button.disabled = selected_card - 1 < 0;
    next_button.disabled = false;

    createCard(card_data[selected_card]);
  });

  // Initial button state
  next_button.disabled = selected_card + 1 > card_data.length - 1;
  prev_button.disabled = selected_card - 1 < 0;
}

/**
 * @description Creates a new frog-card element and appends it inside the <card-deck>.
 * @param {Object} data - The data to set on the frog-card element. Matches card-data.json format.
 * @returns {HTMLElement} The created frog-card element.
 */
export function createCard(data) {
  const cardDeck = document.querySelector("card-display");
  if (!cardDeck){
    return
  }
  cardDeck.innerHTML = ""; // Clear previous card
  const card = document.createElement("frog-card");
  card.data = data;
  cardDeck.appendChild(card);
}

/**
 * Initializes the card deck on DOM load.
 */
async function init() {
  // Load all unlocked cards from localStorage
  const storedCards = localStorage.getItem("card_data");
  card_data = storedCards ? JSON.parse(storedCards) : [];

  // Load the selected card
  const selectedData = loadSelectedCard();
  selected_card = findCardIndex(selectedData); // get its index in card_data

  // Fallback: show the first card if index is invalid
  if (selected_card === -1 || selected_card >= card_data.length) {
    selected_card = 0;
  }

  createCard(card_data[selected_card]);
  card_button_click();

  // redirect to grid.html when view all button is clicked
  const viewAllBtn = document.getElementById("view-all");
  if (viewAllBtn) {
    viewAllBtn.addEventListener("click", () => {
      window.location.href = "grid.html";
    });
  }
}
