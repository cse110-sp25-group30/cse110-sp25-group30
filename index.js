/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
function Card(title, author) {
  this.title = title;
  this.author = author;
}
const c1 = new Card("HEY", "Bob");
console.log(c1.author);

// Index of the card to be displayed
let selected_card = 0;
let card_data = [];

window.addEventListener("DOMContentLoaded", init);

/**
 * Fetches data from the JSON file and returns it as a Promise.
 * @param {string} path - The path to the JSON file relative to index.html.
 * @returns {Promise} A promise that resolves to the data from the JSON file.
 */
async function fetch_data(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Fetch error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

/**
 * Fetches unlocked cards from local storage.
 * @returns {Array} An array of unlocked cards from local storage.
 */
function fetch_unlocked_cards() {
  const data = localStorage.getItem("card_data");
  if (!data) {
    return [];
  }
  return JSON.parse(data);
}

/**
 * Saves data to local storage.
 * @param {Object} data - The data to save.
 * @param {string} key - The key under which to save the data.
 */
function save_to_local(data, key) {
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Adds event listeners to Next/Prev buttons to flip through cards.
 */
function card_button_click() {
  const next_button = document.getElementById("next");
  const prev_button = document.getElementById("prev");

  next_button.addEventListener("click", function () {
    if (selected_card + 1 > card_data.length - 1) {
      console.log("No more cards to show");
      next_button.disabled = true;
      return;
    }
    selected_card++;
    next_button.disabled = selected_card + 1 > card_data.length - 1;
    prev_button.disabled = false;

    createCard(card_data[selected_card]);
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

  // Initialize button state
  next_button.disabled = selected_card + 1 > card_data.length - 1;
  prev_button.disabled = selected_card - 1 < 0;
}

/**
 * Initializes the card deck with local data or fetched data.
 */
async function init() {
  const card_data_all = await fetch_data("./card-data.json");
  save_to_local(card_data_all, "card_data");
  card_data = fetch_unlocked_cards();

  createCard(card_data[selected_card]);
  card_button_click();
}

/**
 * Creates and displays a new frog-card inside the card-deck with animation.
 * @param {Object} data - The card data.
 */
function createCard(data) {
  const cardDeck = document.querySelector("card-deck");
  const oldCard = cardDeck.querySelector("frog-card");

  if (oldCard) {
    oldCard.classList.add("anim-slide-out");
    setTimeout(() => {
      cardDeck.innerHTML = "";

      const newCard = document.createElement("frog-card");
      newCard.data = data;
      newCard.classList.add("anim-slide-in");

      cardDeck.appendChild(newCard);
    }, 600);
  } else {
    const newCard = document.createElement("frog-card");
    newCard.data = data;
    newCard.classList.add("anim-slide-in");
    cardDeck.appendChild(newCard);
  }
}
