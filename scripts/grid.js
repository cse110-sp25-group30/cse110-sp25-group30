import { rarityOrder } from "/scripts/card-values.js";

const CRAFT_COST = 5;

/**
 * @description Loads the user's saved cards from local storage.
 * @returns {Array} An array of saved card objects.
 */
//Here we can use fetch_unlocked_cards to load cards from index.js
function loadCardsFromLocal() {
  const data = localStorage.getItem("card_data");
  return data ? JSON.parse(data) : [];
}

/**
 * @description Saves an array of cards to local storage.
 * @param {Array} cards - Array of card objects to save.
 */
//Here we can use save_to_local to save cards fron index.js
function saveCardsToLocal(cards) {
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
function addOrUpdateCard(card, num_cards = 1) {
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
 * @description Creates a new frog-card element and appends it inside the <card-display> element.
 * @param {Object} data - The data to set on the frog-card element. Matches card-data.json format.
 * @returns {void}
 */
function createCard(data) {
  const card_display = document.querySelector("card-display");
  if (!card_display){
    return;
  }
  card_display.innerHTML = ""; // Clear previous card
  const card = document.createElement("frog-card");
  card.data = data;
  card_display.appendChild(card);

  setupCraftingUI(data);
}

function setupCraftingUI(cardData) {
  const craftingUI = document.getElementById("crafting-ui");
  const slider = document.getElementById("craft-slider");
  const summary = document.getElementById("craft-summary");
  const craftBtn = document.getElementById("craft-button");

  if (!craftingUI || !slider || !summary || !craftBtn) {
    console.error("Required crafting UI elements not found");
    return;
  }

  const rarityIndex = rarityOrder.indexOf(cardData.rarity);
  const nextRarity = rarityOrder[rarityIndex + 1];
  const quantity = cardData.quantity;
  const maxCraftable = Math.floor(quantity / CRAFT_COST);

  craftingUI.classList.remove("hidden");

  if (!nextRarity || maxCraftable < 1) {
    craftBtn.disabled = true;
    slider.disabled = true;
    summary.textContent = "";
    slider.value = 0;
    slider.max = 0;
  } else {
    craftBtn.disabled = false;
    slider.disabled = false;

    slider.max = maxCraftable;
    slider.value = 1;

    const updateSummary = () => {
      summary.textContent = `Use ${slider.value * CRAFT_COST} cards to craft ${slider.value} ${nextRarity}`;
    };

    slider.oninput = updateSummary;
    updateSummary();
  }

  craftBtn.onclick = () => {
    if (craftBtn.disabled) return;

    const craftAmount = parseInt(slider.value);

    const newCard = {
      name: cardData.name,
      rarity: nextRarity,
      quantity: craftAmount,
    };

    addOrUpdateCard(newCard, craftAmount);
    addOrUpdateCard(cardData, -craftAmount * CRAFT_COST);

    location.reload();
  };
}

window.addEventListener("DOMContentLoaded", () => {
  const localData = localStorage.getItem("card_data");
  if (!localData) return;

  const cards = JSON.parse(localData);
  const container = document.getElementById("card-grid");
  if (!container) return;

  cards.forEach((data, index) => {
    const card = document.createElement("card-thumbnail");
    
    // Check if custom element creation was successful
    if (!card) {
      console.error("Failed to create card-thumbnail element");
      return;
    }
    
    card.data = data;
    card.style.animationDelay = `${index * 0.1}s`;

    // Listen for the custom card-clicked event
    card.addEventListener("card-clicked", (e) => {
      const selectedData = e.detail;

      // Set the card title above the modal card
      const titleEl = document.getElementById("card-title");
      titleEl.textContent = `${selectedData.rarity} \"${selectedData.name}\" | quantity: ${selectedData.quantity}`;

      createCard(selectedData);
      const modal = document.getElementById("card-modal");
      if (modal) {
        modal.classList.remove("hidden");
      }
    });

    container.appendChild(card);
  });

  // Modal close logic
  const closeBtn = document.getElementById("modal-close");
  const modal = document.getElementById("card-modal");

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal) {
      modal.classList.add("hidden");
    }
  });
});