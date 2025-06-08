window.addEventListener("DOMContentLoaded", () => {
  const localData = localStorage.getItem("card_data");
  if (!localData) return;

  const cards = JSON.parse(localData);
  const container = document.getElementById("card-grid");
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");

  if (!container) return;

  let currentSort = "default";

  const rarityRank = {
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5,
    "special-edition": 6,
  };

  function renderCards(filter = "") {
    container.innerHTML = "";

    let filteredCards = cards.filter(data => {
      const name = data.name?.toLowerCase() || "";
      return !filter || name.includes(filter.toLowerCase());
    });

    if (currentSort === "az") {
      filteredCards.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } 
    else if (currentSort === "za") {
      filteredCards.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    } 
    else if (currentSort === "rarity-asc") {
      filteredCards.sort((a, b) => {
        return (rarityRank[a.rarity?.toLowerCase()] || 0) - 
               (rarityRank[b.rarity?.toLowerCase()] || 0);
      });
    } 
    else if (currentSort === "rarity-desc") {
      filteredCards.sort((a, b) => {
        return (rarityRank[b.rarity?.toLowerCase()] || 0) - 
               (rarityRank[a.rarity?.toLowerCase()] || 0);
      });
    }

    filteredCards.forEach((data, index) => {
      const card = document.createElement("frog-card");
      card.data = data;
      card.style.animationDelay = `${index * 0.1}s`;
      container.appendChild(card);
    });
  }

  //initial render
  renderCards();

  //search bar functionality
  searchInput.addEventListener("input", () => {
    renderCards(searchInput.value);
  });

  //sorting functionality
  sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;
    renderCards(searchInput.value);
  });
});
