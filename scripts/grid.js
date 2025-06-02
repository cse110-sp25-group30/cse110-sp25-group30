// /scripts/grid.js

window.addEventListener("DOMContentLoaded", () => {
  const localData = localStorage.getItem("card_data");
  if (!localData) return;

  const cards = JSON.parse(localData);
  const container = document.getElementById("card-grid");
  const searchInput = document.getElementById("search-input");

  if (!container) return;

 function renderCards(filter = "") {
    container.innerHTML = ""; // Clear existing cards
    cards.forEach((data, index) => {
      const name = data.name?.toLowerCase() || "";
      if (!filter || name.includes(filter.toLowerCase())) {
        const card = document.createElement("frog-card");
        card.data = data;
        card.style.animationDelay = `${index * 0.1}s`;
        container.appendChild(card);
      }
    });
  }

  // Initial render
  renderCards();

  // Search bar functionality
  searchInput.addEventListener("input", () => {
    renderCards(searchInput.value);
  });
});
