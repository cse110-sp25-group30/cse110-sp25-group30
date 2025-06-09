import { DEV_NAMES, DEV_BIOS } from './scripts/card-values.js';

/**
 * user data
 * @constructor
 * @param {number} points represents # of points earned by user
 */
export function UserInfo(points){
  this.points = points
  this.life_time_points = points
}

// index of the card to be displayed
let selected_card = 0;
let card_data = [];

window.addEventListener("DOMContentLoaded", init);

/**
 * @description Loads the user's saved cards from local storage.
 * @returns {Array} An array of saved card objects.
 */
export function load_cards_from_local() {
  const data = localStorage.getItem("card_data");
  return data ? JSON.parse(data) : [];
}

/**
 * @description Saves an array of cards to local storage.
 * @param {Array} cards Array of card objects to save.
 * @returns {void}
 */
export function save_cards_to_local(cards) {
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
export function add_or_update_card(card, num_cards = 1) {
  let cards = load_cards_from_local();
  const index = cards.findIndex(c => c.name === card.name && c.rarity === card.rarity);

  if (index !== -1) {
    cards[index].quantity += num_cards;

    if (cards[index].quantity <= 0) {
      cards.splice(index, 1);
      save_cards_to_local(cards);
      return null;
    }
  } else {
    cards.push(card);
  }

  save_cards_to_local(cards);
  return cards[index] || card;
}

/**
 * @description Fetches data from the JSON file and returns it as a Promise.
 * @param {string} path - The path to the JSON file relative to index.html.
 * @returns {Promise} A promise that resolves to the data from the JSON file.
 * @throws {Error} If the fetch operation fails.
 */
export async function fetch_data(path) {
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
 * @description Fetches unlocked cards from local storage.
 * @returns {Array} An array of unlocked cards from local storage.
 */
export function fetch_unlocked_cards() {
  const data = localStorage.getItem("card_data");
  if (!data) {
    return [];
  }
  const parsed_data = JSON.parse(data);
  return parsed_data;
}

/**
 * 
 * @returns {UserInfo} returns the user_Data saved to local storage
 */

export function fetch_user_info(){
  const data = localStorage.getItem("user_data");
  if (!data) {
    return undefined;
  }
  const parsed_data = JSON.parse(data);
  return parsed_data;
}

/**
 * @description Saves data to local storage.
 * @param {Object} data - The data to save to local storage.
 * @param {string} key - The key under which to save the data.
 * @returns {void}
 */
export function save_to_local(data, key) {
  if (!key) {
    return;
  }
  localStorage.setItem(key, JSON.stringify(data));
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
  const cardDeck = document.querySelector("card-deck");
  if (!cardDeck){
    return
  }
  cardDeck.innerHTML = ""; // Clear previous card
  const card = document.createElement("frog-card");
  card.data = data;
  cardDeck.appendChild(card);
}


/**
 * @description update user points by the point value. Can be negative or positive
 * @param {number} points number to increase or decrease user points by
 * @return {boolean} returns true if successful else false. If user has too few points its false
 */
export function update_points(points){
  const user_data = fetch_user_info()
  if (!user_data || typeof user_data.points !== "number" || typeof points !=="number") {
    console.warn("Data is missing or malformed", user_data)
    return false;
  }
  let cur_points = user_data.points;
  let life_time_points = user_data.life_time_points;
  cur_points += points;
  if (points > 0) {
    life_time_points += points;
  }
  user_data.points = cur_points;
  user_data.life_time_points = life_time_points;
  if (cur_points >= 0) {
    save_to_local(user_data,"user_data");
    return true;
  }
  return false;
}

/**
 * Initializes the card deck on DOM load.
 */
async function init() {
  await fetch_data("./card-data.json");
  card_data = fetch_unlocked_cards();
  
  // Only create and show card if we have cards
  if (card_data.length > 0) {
    createCard(card_data[selected_card]);
    card_button_click();
  }

  const fetch_user_data = fetch_user_info();
  if (!fetch_user_data){
    const user_info = new UserInfo(0);
    save_to_local(user_info,"user_data");
  }

  // Handle view all
  const viewAllBtn = document.getElementById("view-all");
  if (viewAllBtn) {
    viewAllBtn.addEventListener("click", () => {
      window.location.href = "grid.html";
    });
  }

  //show contributor cards
  const cards = document.querySelectorAll("#contributors .contributors-grid frog-card");
  cards.forEach((card, index) => {
    const name = DEV_NAMES[index];
    console.log("Assigning to frog-card:", name, DEV_BIOS[name]);
    if (name) {
      card.data = {
        name: name,
        bio: DEV_BIOS[name],
        course: "CSE 110",
        rarity: "legendary"
      };
    }
  });
}