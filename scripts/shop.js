/* eslint-disable-next-line no-unused-vars */
import { update_points, fetch_user_info } from "../index.js";

window.addEventListener("DOMContentLoaded", init);

const cardNames = ["Thomas A. Powell", "Test Professor"];
const rarities = [
  { type: "common", chance: 55 },
  { type: "uncommon", chance: 25 },
  { type: "rare", chance: 15 },
  { type: "epic", chance: 4 },
  { type: "legendary", chance: 0.9 },
  { type: "special-edition", chance: 0.1 }
];

const bios = {
  "Thomas A. Powell": "Powell bio",
  "Test Professor": "Test bio",
};

const courses = {
  "Thomas A. Powell": "CSE 110",
  "Test Professor": "CSE 0",
};

const images = {
  "Thomas A. Powell": "assests/prof-images/powell.jpg",
  "Test Professor": "https://media.istockphoto.com/id/916306960/photo/faceless-man-in-hoodie-standing-isolated-on-black.jpg?s=612x612&w=0&k=20&c=pMeGd1UuJgvdZ2gV2VQC2Jn3VwMNeW6TF3cG9RIo1tY=",
};

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomRarity(rarities) {
  const rand = Math.random() * 100;
  let sum = 0;
  for (let rarity of rarities) {
    sum += rarity.chance;
    if (rand <= sum) return rarity.type;
  }
  return rarities[0].type; // fallback
}

function generateRandomCard() {
  const name = getRandomElement(cardNames);
  const rarity = getRandomRarity(rarities);
  return {
    name,
    rarity,
    quantity: 1,
    imgSrc: images[name] || "admin/branding/cse_110_logo.jpg",
    bio: bios[name] || "A mysterious card.",
    course: courses[name] || "???"
  };
}

function loadCardsFromLocal() {
  const data = localStorage.getItem("owned_cards");
  return data ? JSON.parse(data) : [];
}

function saveCardsToLocal(cards) {
  localStorage.setItem("owned_cards", JSON.stringify(cards));
}

function addOrUpdateCard(card) {
  let cards = loadCardsFromLocal();
  const index = cards.findIndex(c => c.name === card.name && c.rarity === card.rarity);

  if (index !== -1) {
    cards[index].quantity += 1;
  } else {
    cards.push(card);
  }

  saveCardsToLocal(cards);
  return cards[index] || card;
}

function displayCard(card) {
  const container = document.getElementById("card-container");
  container.innerHTML = ""; // Clear previous

  const frogCard = document.createElement("frog-card");
  frogCard.data = card;
  container.appendChild(frogCard);
}

function updatePointsDisplay() {
  const data = fetch_user_info();
  const points = data?.points ?? 0;
  const display = document.getElementById("points-display");
  if (display) {
    display.textContent = `Points: ${points}`;
  }
}

function init() {
    const generateBtn = document.getElementById("generate-card");
    const resultDisplay = document.getElementById("result");
    const cardContainer = document.getElementById("card-container");

    updatePointsDisplay();

    generateBtn.addEventListener("click", () => {
        const user = fetch_user_info();
        if (!user || user.points < 1) { //currently set to price of generation = 1, can change later
        resultDisplay.textContent = "❌ Not enough points to generate a card.";
        return;
        }

        const newCard = generateRandomCard();
        const updatedCard = addOrUpdateCard(newCard);

        resultDisplay.textContent =
        `🎉 You got a ${updatedCard.rarity} "${updatedCard.name}" (Total owned: ${updatedCard.quantity})`;

        displayCard(updatedCard);
        update_points(-1); //price of card generation, can change later
        updatePointsDisplay();
    });

    /* temporary for testing */
    document.getElementById("add-points").addEventListener("click", () => {
        update_points(500);
        updatePointsDisplay();
    });
}
