import { update_points, fetch_user_info } from "../index.js";
import {cardNames, rarities, bios, courses} from "/scripts/card-values.js";

window.addEventListener("DOMContentLoaded", init);

let coverOpened = false;
const COST = 100;

/**
 * @description Returns a random element from an array.
 * @param {Array} arr - The array to choose from.
 * @returns {*} A randomly selected element from the array.
 */
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}


/**
 * @description Randomly selects a rarity based on weighted chances.
 * @param {Array} rarities - Array of rarity objects, each with `type` and `chance` properties.
 * @returns {string} The selected rarity type.
 */
function getRandomRarity(rarities) {
  const rand = Math.random() * 100;
  let sum = 0;
  for (let rarity of rarities) {
    sum += rarity.chance;
    if (rand <= sum) return rarity.type;
  }
  return rarities[0].type; // fallback
}


/**
 * @description Generates a random card object with a name, rarity, and metadata.
 * @returns {Object} A card object.
 */
function generateRandomCard() {
  const name = getRandomElement(cardNames);
  const rarity = getRandomRarity(rarities);
  return {
    name,
    rarity,
    quantity: 1,
    bio: bios[name] || "A mysterious card.",
    course: courses[name] || "???"
  };
}

/**
 * @description Loads the user's saved cards from local storage.
 * @returns {Array} An array of saved card objects.
 */
//Here we can use fetch_unlocked_cards to load cards from index.js
export function loadCardsFromLocal() {
  const data = localStorage.getItem("card_data");
  return data ? JSON.parse(data) : [];
}

/**
 * @description Saves an array of cards to local storage.
 * @param {Array} cards - Array of card objects to save.
 */
//Here we can use save_to_local to save cards fron index.js
export function saveCardsToLocal(cards) {
  localStorage.setItem("card_data", JSON.stringify(cards));
}

/**
 * @description Adds a new card or updates the quantity if it already exists.
 * If the quantity is positive, it increments or sets the card's quantity.
 * If the quantity is negative, it decrements the quantity and removes the card if the total falls to 0 or below.
 * If the card doesn't exist and quantity is 0 or negative, it does nothing.
 *
 * @param {Object} card - The card object to add or update. Must include `name` and `rarity` properties.
 * @param {number} [quantity=1] - The number of cards to add (positive) or remove (negative).
 * @returns {Object|null} The updated card object, or `null` if the card was removed or not added.
 */
export function addOrUpdateCard(card, num_cards = 1) {
  let cards = loadCardsFromLocal();
  const index = cards.findIndex(c => c.name === card.name && c.rarity === card.rarity);

  if (index !== -1) {
    cards[index].quantity += num_cards;

    if (cards[index].quantity <= 0) {
      cards.splice(index, 1);
    }
  } else {
    cards.push(card);
  }

  saveCardsToLocal(cards);
  return cards[index] || card;
}

/**
 * @description Displays a card and overlays a pack-cover.
 * @param {Object} card - The card object to display.
 */
function displayCard(card) {
  const container = document.getElementById("card-container");
  container.innerHTML = ""; // Clear previous card

  const cover = document.createElement("pack-cover");

  const frogCard = document.createElement("frog-card");
  frogCard.data = card;

  container.appendChild(frogCard);
  container.appendChild(cover);

  coverOpened = false;
}

/**
 * @description Updates the points display on the page using user data.
 */
function updatePointsDisplay() {
  const data = fetch_user_info();
  const points = data?.points ?? 0;
  const display = document.getElementById("points-display");
  if (display) {
    display.textContent = `${points}`;
  }
}

/**
 * @description Updates the card generation cost displayed on the page.
 */
function updateCost() {
  const cost_display = document.getElementById("cost");
  if (cost_display) {
    cost_display.textContent = `Cost: ${COST}`;
  }
}

/**
 * @description Initializes the card generation page, sets up event listeners, and handles card generation logic.
 */
function init() {
  const generateBtn = document.getElementById("generate-card");
  const resultDisplay = document.getElementById("result");

  updatePointsDisplay();
  updateCost();

  generateBtn.addEventListener("click", () => {
    const user = fetch_user_info();
    if (!user || user.points < COST) {
    resultDisplay.textContent = "❌ Not enough points. ❌";
    return;
    }
    const click = new Audio('assets/sound-effects/buy.mp3');
    click.currentTime = 0.095;
    click.play();

    const newCard = generateRandomCard();
    const updatedCard = addOrUpdateCard(newCard);

    generateBtn.disabled = true;

    resultDisplay.innerHTML = "click to open [O]";

    displayCard(updatedCard);
    update_points(-COST);
    updatePointsDisplay();

    // Wait for the 'cover-opened' event, then reveal result
    document.addEventListener("cover-opened", function handler() {
      coverOpened = true;

      if (updatedCard.quantity === 1) {
        resultDisplay.innerHTML =
        `🎉 New card unlocked: You got a ${updatedCard.rarity} "${updatedCard.name}"<br>click to flip [F]`;
      }
      else {
        resultDisplay.innerHTML =
        `🎉 You got a ${updatedCard.rarity} "${updatedCard.name}" (Total owned: ${updatedCard.quantity})<br>click to flip [F]`;
      }
      resultDisplay.style.visibility = "visible";
      if (updatedCard.rarity == 'epic') {
        const audio = new Audio('assets/sound-effects/lucky-draw1.mp3');
        audio.currentTime = 0;
        audio.play();
      }
      else if (updatedCard.rarity == 'legendary' || updatedCard.rarity == 'special-edition') {
        const audio = new Audio('assets/sound-effects/lucky-draw2.mp3');
        audio.currentTime = 0;
        audio.play();
      }

      generateBtn.disabled = false; //re-enable the button

      // Remove listener so it only triggers once per open
      document.removeEventListener("cover-opened", handler);
    });
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (key === 'b') {
      document.getElementById("generate-card")?.click();
    } else if (key === 'o') {
      document.querySelector("pack-cover")?.click();
    } else if ((key === 'f') && (coverOpened === true)) {
      document.querySelector("frog-card")?.click();
    }
  });
}
