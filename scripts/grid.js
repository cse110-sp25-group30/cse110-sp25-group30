import { RARITY_ORDER } from "/scripts/card-values.js";
import { add_or_update_card, load_cards_from_local } from "../index.js";

const CRAFT_COST = 1;

let currentSort = "default";

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

  // Get the no-cards-message element
  let noCardsMessage = document.getElementById("no-cards-message");
  if (!noCardsMessage) {
    noCardsMessage = document.createElement("div");
    noCardsMessage.id = "no-cards-message";
    noCardsMessage.className = "no-cards-message hidden";
    noCardsMessage.innerHTML = `
      <h2>No Cards Found</h2>
      <p>Start collecting cards in the shop or gain points using the clicker!</p>
      <div class="button-group">
        <a href="shop.html" class="shop-button">Go to Shop</a>
        <a href="clicker.html" class="clicker-button">Open Clicker</a>
      </div>
    `;
    container.appendChild(noCardsMessage);
  }

  // Update total cards count
  const totalCardsElement = document.getElementById("total-cards");
  if (totalCardsElement) {
    const totalCards = cards ? cards.reduce((sum, card) => sum + (card.quantity || 1), 0) : 0;
    totalCardsElement.textContent = `Total Filtered Cards: ${totalCards}`;
  }

  // Clear existing cards
  container.innerHTML = "";
  container.appendChild(noCardsMessage);

  if (!cards || cards.length === 0) {
    noCardsMessage.classList.remove("hidden");
    return;
  }

  noCardsMessage.classList.add("hidden");
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

  const rarityIndex = RARITY_ORDER.indexOf(data.rarity);
  const nextRarity = RARITY_ORDER[rarityIndex + 1];
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
    add_or_update_card(new_data, craftAmount);
    add_or_update_card(data, -craftAmount * CRAFT_COST);

    // Update the grid to reflect changes
    const searchInput = document.getElementById("search-input");
    const filteredData = renderCards(searchInput.value);
    updateCardGrid(filteredData);


    //creates the popup message at the end of crafting
    const popup = document.getElementById("craft-popup");
    const amountSpan = document.getElementById("crafted-amount");
    if (popup && amountSpan) {
      amountSpan.textContent = `${craftAmount} ${nextRarity} "${data.name}"`;
      popup.classList.remove("hidden");
      popup.classList.add("show");

      //remove the popup after 3 seconds
      setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.classList.add("hidden"), 500);
      }, 3000);
    }

    // Close the modal
    const modal = document.getElementById("card-modal");
    if (modal) {
      modal.classList.add("hidden");
    }


    // Show success message (optional)
    console.log(`Crafted ${craftAmount} ${nextRarity} "${data.name}"`);
    //alert(`🎉 Congratulations! You crafted ${craftAmount} ${nextRarity} "${data.name}" card(s)!`);
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
        return RARITY_ORDER.indexOf(a.rarity?.toLowerCase()) - RARITY_ORDER.indexOf(b.rarity?.toLowerCase());
      });
    } 
    else if (currentSort === "rarity-desc") {
      filteredCards.sort((a, b) => {
        return RARITY_ORDER.indexOf(b.rarity?.toLowerCase()) - RARITY_ORDER.indexOf(a.rarity?.toLowerCase());
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
    else if (currentSort === "quantity-asc") {
      filteredCards.sort((a, b) => a.quantity - b.quantity);
    }
    else if (currentSort === "quantity-desc") {
      filteredCards.sort((a, b) => b.quantity - a.quantity);
    }

    return filteredCards
}

/**
 * @description Initializes the application when the DOM is fully loaded. Sets up the card grid,
 * modal close functionality, and keyboard event listeners for closing the modal with the Escape key.
 */
window.addEventListener("DOMContentLoaded", () => {
  updateCardGrid(load_cards_from_local());

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