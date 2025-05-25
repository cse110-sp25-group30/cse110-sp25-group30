// /scripts/grid.js

window.addEventListener("DOMContentLoaded", () => {
  const localData = localStorage.getItem("card_data");
  if (!localData) return;

  const cards = JSON.parse(localData);
  const container = document.getElementById("card-grid");
  if (!container) return;

  for (const data of cards) {
    const card = document.createElement("frog-card");
    card.data = data;
    container.appendChild(card);
  }
});
