import { rarityOrder } from "/scripts/card-values.js";

const CRAFT_COST = 5;

let currentSort = "default";
/**
 * @description Loads the user's saved cards from local storage.
 * @returns {Array} An array of saved card objects.
 */
function loadCardsFromLocal() {
  const data = localStorage.getItem("card_data");
  return data ? JSON.parse(data) : [];
}

/**
 * @description Saves an array of cards to local storage.
 * @param {Array} cards - Array of card objects to save.
 */
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
 * Also sets up the crafting UI for the displayed card.
 * @param {Object} data - The card data object containing name, rarity, course, bio, and quantity properties.
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

/**
 * @description Updates the card grid display by loading cards from local storage and creating
 * card-thumbnail elements for each card. Sets up click event listeners for each card to open
 * the card modal when clicked.
 * @param {Array} cardData - An array of card data objects to display in the grid.
 * @returns {void}
 */
function updateCardGrid(cards) {
  const container = document.getElementById("card-grid");
  if (!container) return;

  // Clear existing cards
  container.innerHTML = "";

  cards.forEach((data, index) => {
    const card = document.createElement("card-thumbnail");
    
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
      titleEl.textContent = `${selectedData.rarity} "${selectedData.name}" | quantity: ${selectedData.quantity}`;

      createCard(selectedData);
      const modal = document.getElementById("card-modal");
      if (modal) {
        modal.classList.remove("hidden");
      }
    });

    container.appendChild(card);
  });
}

/**
 * @description Sets up the crafting UI for a given card, including the slider, summary text,
 * and craft button. Handles the logic for determining if crafting is possible based on rarity
 * and available quantity. Sets up event listeners for the slider and craft button.
 * @param {Object} data - The card data object containing name, rarity, course, bio, and quantity properties.
 */
function setupCraftingUI(data) {
  const craftingUI = document.getElementById("crafting-ui");
  const slider = document.getElementById("craft-slider");
  const summary = document.getElementById("craft-summary");
  const craftBtn = document.getElementById("craft-button");

  if (!craftingUI || !slider || !summary || !craftBtn) {
    console.error("Required crafting UI elements not found");
    return;
  }

  // Hide crafting UI for legendary and special-edition cards
  if (data.rarity === "legendary" || data.rarity === "special-edition") {
    craftingUI.classList.add("hidden");
    return;
  }

  const rarityIndex = rarityOrder.indexOf(data.rarity);
  const nextRarity = rarityOrder[rarityIndex + 1];
  const quantity = data.quantity;
  const maxCraftable = Math.floor(quantity / CRAFT_COST);

  if (!nextRarity) {
    // Hide the entire crafting UI if there's no next rarity
    craftingUI.classList.add("hidden");
    return;
  }

  craftingUI.classList.remove("hidden");

  if (maxCraftable < 1) {
    craftBtn.disabled = true;
    slider.disabled = true;
    summary.textContent = "Not enough cards to merge";
    slider.value = 0;
    slider.max = 0;
  } else {
    slider.disabled = false;
    slider.max = maxCraftable;
    slider.min = 0;
    slider.value = 0; // Start at 0

    const updateSummary = () => {
      if (slider.value == 0) {
        summary.textContent = "Slide to increase the number of cards to craft";
        craftBtn.disabled = true;
      } else {
        summary.textContent = `Use ${slider.value * CRAFT_COST} ${data.rarity} "${data.name}" cards to craft ${slider.value} ${nextRarity} "${data.name}" card(s)`;
        craftBtn.disabled = false;
      }
    };

    slider.oninput = updateSummary;
    updateSummary(); // Initialize the summary
  }

  craftBtn.onclick = () => {
    if (craftBtn.disabled) return;

    const craftAmount = parseInt(slider.value);

    const new_data = {
      name: data.name,
      course: data.course,
      bio: data.bio,
      quantity: 1,
      rarity: nextRarity
    };

    // Update the cards
    addOrUpdateCard(new_data, craftAmount);
    addOrUpdateCard(data, -craftAmount * CRAFT_COST);

    // Update the grid to reflect changes
    const searchInput = document.getElementById("search-input");
    const filteredData = renderCards(searchInput.value);
    updateCardGrid(filteredData);

    // Close the modal
    const modal = document.getElementById("card-modal");
    if (modal) {
      modal.classList.add("hidden");
    }

    // Show success message (optional)
    console.log(`Crafted ${craftAmount} ${nextRarity} "${data.name}"`);
  };
}


/**
 * 
 * @param {string} filter - The search filter string to apply to the card names. 
 * @returns {Array} An array of card objects that match the filter criteria.
 * @description Renders the card grid based on the provided filter. It retrieves card data from local storage,
 */
function renderCards(filter = "") {
  const localData = localStorage.getItem("card_data");
  if (!localData) return;
  const cards = JSON.parse(localData);
  const container = document.getElementById("card-grid");
    container.innerHTML = "";

    //filter cards based on search
    let filteredCards = cards.filter(data => {
      const name = data.name?.toLowerCase() || "";
      return !filter || name.includes(filter.toLowerCase());
    });

    //sort according to selected option
    if (currentSort === "first-name-az") {
      filteredCards.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } 
    else if (currentSort === "first-name-za") {
      filteredCards.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    } 
    else if (currentSort === "rarity-asc") {
      filteredCards.sort((a, b) => {
        return rarityOrder.indexOf(a.rarity?.toLowerCase()) - rarityOrder.indexOf(b.rarity?.toLowerCase());
      });
    } 
    else if (currentSort === "rarity-desc") {
      filteredCards.sort((a, b) => {
        return rarityOrder.indexOf(b.rarity?.toLowerCase()) - rarityOrder.indexOf(a.rarity?.toLowerCase());
      });
    } 
    else if (currentSort === "last-name-az") {
      filteredCards.sort((a, b) => {
        const lastA = (a.name || "").trim().split(" ").slice(-1)[0].toLowerCase();
        const lastB = (b.name || "").trim().split(" ").slice(-1)[0].toLowerCase();
        return lastA.localeCompare(lastB);
      });
    }
    else if (currentSort === "last-name-za") {
      filteredCards.sort((a, b) => {
        const lastA = (a.name || "").trim().split(" ").slice(-1)[0].toLowerCase();
        const lastB = (b.name || "").trim().split(" ").slice(-1)[0].toLowerCase();
        return lastB.localeCompare(lastA);
      });
    }

    return filteredCards
}

/**
 * @description Initializes the application when the DOM is fully loaded. Sets up the card grid,
 * modal close functionality, and keyboard event listeners for closing the modal with the Escape key.
 */
window.addEventListener("DOMContentLoaded", () => {
  updateCardGrid(loadCardsFromLocal());

  // Modal close logic
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");
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
  
  //search bar functionality
  searchInput.addEventListener("input", () => {
    const data = renderCards(searchInput.value);
    updateCardGrid(data);

  });

  //sorting functionality
  sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;
    const data = renderCards(searchInput.value);
    updateCardGrid(data);
  });
});