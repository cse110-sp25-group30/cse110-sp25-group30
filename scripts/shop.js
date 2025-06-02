import { update_points, fetch_user_info } from "../index.js";
import {cardNames, rarities, bios, courses} from "/scripts/card-values.js";

/*
TODO: Add description for functions in this file.
*/
window.addEventListener("DOMContentLoaded", init);

let coverOpened = false;
let COST = 100;

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
    bio: bios[name] || "A mysterious card.",
    course: courses[name] || "???"
  };
}
//Here we can use fetch_unlocked_cards to load cards from index.js
function loadCardsFromLocal() {
  const data = localStorage.getItem("card_data");
  return data ? JSON.parse(data) : [];
}

//Here we can use save_to_local to save cards fron index.js
function saveCardsToLocal(cards) {
  localStorage.setItem("card_data", JSON.stringify(cards));
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
  container.innerHTML = ""; // Clear previous card

  const cover = document.createElement("pack-cover");

  const frogCard = document.createElement("frog-card");
  frogCard.data = card;

  container.appendChild(frogCard);
  container.appendChild(cover);

  coverOpened = false;
}

function updatePointsDisplay() {
  const data = fetch_user_info();
  const points = data?.points ?? 0;
  const display = document.getElementById("points-display");
  if (display) {
    display.textContent = `${points}`;
  }
}

function updateCost() {
  const cost_display = document.getElementById("cost");
  if (cost_display) {
    cost_display.textContent = `Cost: ${COST}`;
  }
}

function init() {
  const generateBtn = document.getElementById("generate-card");
  const resultDisplay = document.getElementById("result");

  updatePointsDisplay();
  updateCost();

  generateBtn.addEventListener("click", () => {
    const user = fetch_user_info();
    if (!user || user.points < COST) { //currently set to price of generation = 1, can change later
    resultDisplay.textContent = "❌ Not enough points. ❌";
    return;
    }
    const click = new Audio('assets/sound-effects/buy.mp3');
    click.currentTime = 0.095;
    click.play();

    const newCard = generateRandomCard();
    const updatedCard = addOrUpdateCard(newCard);

    generateBtn.disabled = true;

    resultDisplay.innerHTML = "click to open [O]";

    displayCard(updatedCard);
    update_points(-COST); //price of card generation, can change later
    updatePointsDisplay();

    // Wait for the 'cover-opened' event, then reveal result
    document.addEventListener("cover-opened", function handler() {
      coverOpened = true;

      if (updatedCard.quantity === 1) {
        resultDisplay.innerHTML =
        `🎉 New card unlocked: You got a ${updatedCard.rarity} "${updatedCard.name}"<br>click to flip [F]`;
      }
      else {
        resultDisplay.innerHTML =
        `🎉 You got a ${updatedCard.rarity} "${updatedCard.name}" (Total owned: ${updatedCard.quantity})<br>click to flip [F]`;
      }
      resultDisplay.style.visibility = "visible";
      if (updatedCard.rarity == 'epic') {
        const audio = new Audio('assets/sound-effects/lucky-draw1.mp3');
        audio.currentTime = 0;
        audio.play();
      }
      else if (updatedCard.rarity == 'legendary' || updatedCard.rarity == 'special-edition') {
        const audio = new Audio('assets/sound-effects/lucky-draw2.mp3');
        audio.currentTime = 0;
        audio.play();
      }

      generateBtn.disabled = false; //re-enable the button

      // Remove listener so it only triggers once per open
      document.removeEventListener("cover-opened", handler);
    });
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (key === 'b') {
      document.getElementById("generate-card")?.click();
    } else if (key === 'o') {
      document.querySelector("pack-cover")?.click();
    } else if ((key === 'f') && (coverOpened === true)) {
      document.querySelector("frog-card")?.click();
    }
  });
}
