import { rarityOrder } from "/scripts/card-values.js";
import { loadCardsFromLocal, saveCardsToLocal, addOrUpdateCard } from "./shop.js";

const CRAFT_COST = 5;

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

  if (!craftingUI || !slider || !summary || !craftBtn) return;

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
    card.data = data;
    card.style.animationDelay = `${index * 0.1}s`;

    // Listen for the custom card-clicked event
    card.addEventListener("card-clicked", (e) => {
      const selectedData = e.detail;

      // Set the card title above the modal card
      const titleEl = document.getElementById("card-title");
      if (titleEl) {
        titleEl.textContent = `${selectedData.rarity} \"${selectedData.name}\" | quantity: ${selectedData.quantity}` || "Unnamed Card";
      }

      createCard(selectedData);
      document.getElementById("card-modal").classList.remove("hidden");
    });

    container.appendChild(card);
  });

  // Modal close logic
  const closeBtn = document.getElementById("modal-close");
  const modal = document.getElementById("card-modal");

  closeBtn?.addEventListener("click", () => modal.classList.add("hidden"));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modal.classList.add("hidden");
    }
  });
});