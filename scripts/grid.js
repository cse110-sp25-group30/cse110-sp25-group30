window.addEventListener("DOMContentLoaded", () => {
  const localData = localStorage.getItem("card_data");
  if (!localData) return;

  const cards = JSON.parse(localData);
  const container = document.getElementById("card-grid");
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");

  if (!container) return;

  let currentSort = "default";

  //get card rarities for sorting
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
