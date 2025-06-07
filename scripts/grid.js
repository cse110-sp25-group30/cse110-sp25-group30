// /scripts/grid.js

window.addEventListener("DOMContentLoaded", () => {
  const localData = localStorage.getItem("card_data");
  if (!localData) return;

  const cards = JSON.parse(localData);
  const container = document.getElementById("card-grid");
  if (!container) return;

 cards.forEach((data, index) => {
    const card = document.createElement("card-thumbnail");
    card.data = data;

    card.style.animationDelay = (index * 0.1) + 's';

    container.appendChild(card);
  });

});
