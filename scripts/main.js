import { devNames } from './card-values.js';

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll("#contributors frog-card");

  cards.forEach((card, index) => {
    const name = devNames[index];
    if (name) {
      card.data = {
        name: name,
        bio: "To be determined",
        course: "CSE 110",
        rarity: "legendary"
      };
    }
  });
});
