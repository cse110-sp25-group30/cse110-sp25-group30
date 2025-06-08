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
