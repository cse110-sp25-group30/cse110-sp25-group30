import { update_points, fetch_user_info } from "../index.js";
import {cardNames, rarities, bios, courses} from "/scripts/card-values.js";

// TODO: Consider moving constants to config file
let cover_opened = false;
let COST = 100;

// Guarantee thresholds for each rarity
const GUARANTEE_THRESHOLDS = {
  rare: 10,
  epic: 20,
  legendary: 50,
  "special-edition": 100
};

window.addEventListener("DOMContentLoaded", init);

/**
 * @description Returns a random element from an array.
 * @param {Array} arr The array to choose from.
 * @returns {*} A randomly selected element from the array.
 */
function get_random_element(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * @description Updates pity counters based on obtained rarity.
 * @param {string} obtained_rarity The rarity that was obtained.
 * @returns {Object} Updated counters.
 */
function update_pity_counters(obtained_rarity) {
  const counters = load_pity_counters();
  const rarity_hierarchy = ["common", "uncommon", "rare", "epic", "legendary", "special-edition"];
  const obtained_index = rarity_hierarchy.indexOf(obtained_rarity);
  
  // Increment counters for rarities above what we got
  for (let i = obtained_index + 1; i < rarity_hierarchy.length; i++) {
    const rarity = rarity_hierarchy[i];
    if (counters[rarity] !== undefined) {
      counters[rarity]++;
    }
  }
  
  // Reset counters at or below what we got
  for (let i = 0; i <= obtained_index; i++) {
    const rarity = rarity_hierarchy[i];
    if (counters[rarity] !== undefined) {
      counters[rarity] = 0;
    }
  }
  
  save_pity_counters(counters);
  return counters;
}

/**
 * @description Randomly selects a rarity, checking guarantees first.
 * @param {Array} rarities Array of rarity objects.
 * @returns {string} Selected rarity type.
 */
function get_random_rarity(rarities) {
  const counters = load_pity_counters();
  
  // Check guarantees from highest to lowest
  if (counters["special-edition"] >= GUARANTEE_THRESHOLDS["special-edition"]) {
    return "special-edition";
  }
  if (counters.legendary >= GUARANTEE_THRESHOLDS.legendary) {
    return "legendary";
  }
  if (counters.epic >= GUARANTEE_THRESHOLDS.epic) {
    return "epic";
  }
  if (counters.rare >= GUARANTEE_THRESHOLDS.rare) {
    return "rare";
  }
  
  // Normal RNG
  const rand = Math.random() * 100;
  let sum = 0;
  for (let rarity of rarities) {
    sum += rarity.chance;
    if (rand <= sum) {
      return rarity.type;
    }
  }
  return rarities[0].type; // fallback
}

/**
 * @description Generates a random card object with a name, rarity, and metadata.
 * @returns {Object} A card object.
 */
function generate_random_card() {
  const name = get_random_element(cardNames);
  const rarity = get_random_rarity(rarities);
  return {
    name,
    rarity,
    quantity: 1,
    bio: bios[name] || "A mysterious card.",
    course: courses[name] || "???"
  };
}

/**
 * @description Loads the user's saved cards from local storage.
 * @returns {Array} An array of saved card objects.
 */
function load_cards_from_local() {
  const data = localStorage.getItem("card_data");
  return data ? JSON.parse(data) : [];
}

/**
 * @description Loads pity counters from local storage.
 * @returns {Object} Pity counters object.
 */
function load_pity_counters() {
  const data = localStorage.getItem("pity_counters");
  return data ? JSON.parse(data) : {
    rare: 0,
    epic: 0,
    legendary: 0,
    "special-edition": 0
  };
}

/**
 * @description Saves pity counters to local storage.
 * @param {Object} counters Counters to save.
 * @returns {void}
 */
function save_pity_counters(counters) {
  localStorage.setItem("pity_counters", JSON.stringify(counters));
}

/**
 * @description Saves an array of cards to local storage.
 * @param {Array} cards Array of card objects to save.
 * @returns {void}
 */
function save_cards_to_local(cards) {
  localStorage.setItem("card_data", JSON.stringify(cards));
}

/**
 * @description Adds a new card or increments the quantity if it already exists.
 * @param {Object} card The card to add or update.
 * @returns {Object} The updated or newly added card object.
 */
function add_or_update_card(card) {
  let cards = load_cards_from_local();
  const index = cards.findIndex(c => c.name === card.name && c.rarity === card.rarity);

  if (index !== -1) {
    cards[index].quantity += 1;
  } else {
    cards.push(card);
  }

  save_cards_to_local(cards);
  return cards[index] || card;
}

/**
 * @description Creates light ray effects for card reveal.
 * @param {string} rarity The rarity of the card.
 * @returns {void}
 */
function create_light_rays(rarity) {
  const container = document.getElementById("card-container");
  
  // Remove any existing light rays
  const existing_rays = container.querySelector(".light-rays");
  if (existing_rays) {
    existing_rays.remove();
  }
  
  const light_rays_div = document.createElement("div");
  light_rays_div.className = "light-rays";
  
  const colors = {
    common: "#FFFFFF",
    uncommon: "#22C55E",
    rare: "#3B82F6",
    epic: "#A855F7",
    legendary: "#FFD700",
    "special-edition": "linear-gradient(45deg, #FF006E, #FFD700)"
  };
  
  // Create multiple light rays
  for (let i = 0; i < 12; i++) {
    const ray = document.createElement("div");
    ray.className = "light-ray";
    ray.style.setProperty("--rotation", `${i * 30}deg`);
    ray.style.background = colors[rarity] || colors.common;
    ray.style.animationDelay = `${i * 0.05}s`;
    light_rays_div.appendChild(ray);
  }
  
  container.appendChild(light_rays_div);
  
  // Remove after animation
  setTimeout(() => light_rays_div.remove(), 2000);
}

/**
 * @description Shows congratulations animation with particles.
 * @param {string} rarity The rarity of the card.
 * @returns {void}
 */
function show_congrats_animation(rarity) {
  const container = document.getElementById("gen-container");
  
  // Remove any existing congratulations animation
  const existing_congrats = container.querySelector(".congrats-animation");
  if (existing_congrats) {
    existing_congrats.remove();
  }
  
  const congrats_div = document.createElement("div");
  congrats_div.className = "congrats-animation";
  
  const rarity_text = {
    common: "COMMON",
    uncommon: "UNCOMMON!",
    rare: "RARE!",
    epic: "✨ EPIC! ✨",
    legendary: "⚡ LEGENDARY! ⚡",
    "special-edition": "🌟 SPECIAL EDITION! 🌟"
  };
  
  const congrats_text = document.createElement("div");
  congrats_text.className = `congrats-text congrats-${rarity}`;
  congrats_text.textContent = rarity_text[rarity];
  congrats_div.appendChild(congrats_text);
  
  // Create particle effects for rare and above
  if (['rare', 'epic', 'legendary', 'special-edition'].includes(rarity)) {
    const particles_div = document.createElement("div");
    particles_div.className = "congrats-particles";
    
    const particle_colors = {
      rare: ['#3B82F6', '#60A5FA', '#2563EB'],
      epic: ['#A855F7', '#C084FC', '#9333EA'],
      legendary: ['#FFD700', '#FFC700', '#FFE700'],
      "special-edition": ['#FF006E', '#FFD700', '#00D9FF', '#FF00FF']
    };
    
    const colors = particle_colors[rarity] || ['#FFD700'];
    const particle_count = rarity === 'special-edition' ? 30 : rarity === 'legendary' ? 20 : 15;
    
    for (let i = 0; i < particle_count; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = "50%";
      particle.style.top = "50%";
      
      const angle = (Math.PI * 2 * i) / particle_count;
      const distance = 50 + Math.random() * 50;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      particle.style.setProperty('--x', `${x}px`);
      particle.style.setProperty('--y', `${y}px`);
      particle.style.animationDelay = `${Math.random() * 0.3}s`;
      
      if (rarity === 'special-edition') {
        particle.style.boxShadow = `0 0 10px ${particle.style.backgroundColor}`;
      }
      
      particles_div.appendChild(particle);
    }
    
    congrats_div.appendChild(particles_div);
  }
  
  container.appendChild(congrats_div);
  
  // Remove after animation
  setTimeout(() => congrats_div.remove(), 2000);
}

/**
 * @description Updates the container background based on rarity.
 * @param {string} rarity The rarity to apply.
 * @returns {void}
 */
function update_container_rarity(rarity) {
  const container = document.getElementById("gen-container");
  // Remove all previous rarity classes
  container.classList.remove('rarity-common', 'rarity-uncommon', 'rarity-rare', 
                           'rarity-epic', 'rarity-legendary', 'rarity-special-edition');
  // Add new rarity class
  if (rarity) {
    container.classList.add(`rarity-${rarity}`);
  }
}

/**
 * @description Displays a placeholder card.
 * @param {boolean} is_first_purchase If this is user's first purchase.
 * @returns {void}
 */
function display_placeholder(is_first_purchase = true) {
  const container = document.getElementById("card-container");
  const placeholder_text = is_first_purchase 
    ? "Click below to purchase your first pack!" 
    : "Click below to purchase a pack!";
    
  container.innerHTML = `
    <div class="placeholder-card">
      <div class="pack-wrapper">
        <img src="./assets/misc-images/pack_left.webp" alt="placeholder pack left" class="pack-left">
        <img src="./assets/misc-images/pack_right.webp" alt="placeholder pack right" class="pack-right">
      </div>
      <div class="placeholder-text">${placeholder_text}</div>
    </div>
  `;
}

/**
 * @description Displays a card and overlays a pack-cover.
 * @param {Object} card The card object to display.
 * @returns {void}
 */
function display_card(card) {
  const container = document.getElementById("card-container");
  container.innerHTML = ""; // Clear previous content

  const frog_card = document.createElement("frog-card");
  frog_card.data = card;

  const cover = document.createElement("pack-cover");
  cover.classList.add("with-glow", `rarity-${card.rarity}`);

  container.appendChild(frog_card);
  container.appendChild(cover);
  
  // Create light rays immediately for unopened pack
  setTimeout(() => create_light_rays(card.rarity), 100);

  cover_opened = false;
}

/**
 * @description Updates the points display on the page using user data.
 * @returns {void}
 */
function update_points_display() {
  const data = fetch_user_info();
  const points = data?.points ?? 0;
  const display = document.getElementById("points-display");
  if (display) {
    display.textContent = `${points}`;
  }
  
  // Update button visual state based on points
  const generate_btn = document.getElementById("generate-card");
  if (generate_btn) {
    if (points < COST) {
      generate_btn.classList.add("no-points");
    } else {
      generate_btn.classList.remove("no-points");
    }
  }
}

/**
 * @description Updates the card generation cost displayed on the page.
 * @returns {void}
 */
function update_cost() {
  const cost_display = document.getElementById("cost");
  if (cost_display) {
    cost_display.textContent = `Cost: ${COST}`;
  }
}

/**
 * @description Updates tooltip with drop rates and guarantees.
 * @returns {void}
 */
function update_tooltip() {
  const tooltip_text = document.querySelector(".tooltip-text");
  if (tooltip_text) {
    tooltip_text.innerHTML = `
      Drop Rates:<br>
      <span class="rarity-common">Common: 55%</span><br>
      <span class="rarity-uncommon">Uncommon: 25%</span><br>
      <span class="rarity-rare">Rare: 15% (G:10)</span><br>
      <span class="rarity-epic">Epic: 4% (G:20)</span><br>
      <span class="rarity-legendary">Legendary: 0.9% (G:50)</span><br>
      <span class="rarity-special-edition">Special-Edition: 0.1% (G:100)</span><br>
      <span style="font-size: 0.85rem; color: #ccc; margin-top: 0.5rem; display: block; border-top: 1px solid #555; padding-top: 0.5rem;">G = Guaranteed after X buys</span>
    `;
  }
}

/**
 * @description Updates the guarantee progress bar.
 * @returns {void}
 */
function update_guarantee_display() {
  const counters = load_pity_counters();
  const guarantee_display = document.getElementById("guarantee-display");
  
  if (!guarantee_display) {
    return;
  }
  
  // Show Special Edition progress
  const special_count = counters["special-edition"];
  const special_threshold = GUARANTEE_THRESHOLDS["special-edition"];
  const percentage = (special_count / special_threshold) * 100;
  
  guarantee_display.innerHTML = `
    <div class="guarantee-text">${special_count}/${special_threshold} to guaranteed Special Edition</div>
    <div class="guarantee-bar">
      <div class="guarantee-fill guarantee-special-edition" style="width: ${percentage}%"></div>
    </div>
  `;
}

/**
 * @description Gets the display color for a rarity (brighter for dark background).
 * @param {string} rarity The rarity type.
 * @returns {string} The color code.
 */
function get_rarity_display_color(rarity) {
  const colors = {
    common: "#FFFFFF",
    uncommon: "#4ADE80",
    rare: "#60A5FA",
    epic: "#C084FC",
    legendary: "#FFD700",
    "special-edition": "#FFD700"  // Use gold instead of gradient for simplicity
  };
  return colors[rarity] || colors.common;
}

/**
 * @description Initializes the shop page.
 */
function init() {
  const generate_btn = document.getElementById("generate-card");
  const result_display = document.getElementById("result");

  update_points_display();
  update_cost();
  update_tooltip();
  update_guarantee_display();
  
  // Check if user has any cards to determine placeholder text
  const existing_cards = load_cards_from_local();
  const is_first_purchase = existing_cards.length === 0;
  
  // Always display placeholder when entering shop
  display_placeholder(is_first_purchase);
  
  // Clear any previous container styling and result text
  update_container_rarity(null);
  result_display.innerHTML = "";
  result_display.style.visibility = "visible";

  // Store handler reference to prevent double-firing
  let current_open_handler = null;

  generate_btn.addEventListener("click", function () {
    const user = fetch_user_info();
    if (!user || user.points < COST) {
      result_display.textContent = "❌ Not enough points. ❌";
      return;
    }
    
    // Remove any previous handler to prevent double-firing
    if (current_open_handler) {
      document.removeEventListener("cover-opened", current_open_handler);
      current_open_handler = null;
    }
    
    // Clear any existing animations
    const existing_congrats = document.querySelector(".congrats-animation");
    if (existing_congrats) {
      existing_congrats.remove();
    }
    const existing_rays = document.querySelector(".light-rays");
    if (existing_rays) {
      existing_rays.remove();
    }
    
    const click = new Audio('assets/sound-effects/buy.mp3');
    click.currentTime = 0.095;
    click.play();

    const new_card = generate_random_card();
    const updated_card = add_or_update_card(new_card);
    
    // Update pity counters after card generation
    update_pity_counters(new_card.rarity);

    generate_btn.disabled = true;

    result_display.innerHTML = "click to open [O]";
    
    // Update container background immediately
    update_container_rarity(updated_card.rarity);

    display_card(updated_card);
    update_points(-COST);
    update_points_display();

    // Create handler for this card
    current_open_handler = function handler() {
      cover_opened = true;
      
      // Show congratulations animation
      show_congrats_animation(updated_card.rarity);
      
      // Create another set of light rays on reveal
      create_light_rays(updated_card.rarity);

      if (updated_card.quantity === 1) {
        const rarity_span = updated_card.rarity === 'special-edition' 
          ? `<span style="color: #FFD700; font-weight: 900; text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000, 0 0 20px #FF006E, 0 0 40px #00D9FF;">✨ ${updated_card.rarity.toUpperCase()} ✨</span>`
          : `<span style="color: ${get_rarity_display_color(updated_card.rarity)}; font-weight: 900; text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000;">${updated_card.rarity.toUpperCase()}</span>`;
        
        result_display.innerHTML =
        `🎉 New card unlocked: You got a ${rarity_span} "${updated_card.name}"<br>click to flip [F]`;
      }
      else {
        const rarity_span = updated_card.rarity === 'special-edition' 
          ? `<span style="color: #FFD700; font-weight: 900; text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000, 0 0 20px #FF006E, 0 0 40px #00D9FF;">✨ ${updated_card.rarity.toUpperCase()} ✨</span>`
          : `<span style="color: ${get_rarity_display_color(updated_card.rarity)}; font-weight: 900; text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000;">${updated_card.rarity.toUpperCase()}</span>`;
          
        result_display.innerHTML =
        `🎉 You got a ${rarity_span} "${updated_card.name}" (Total owned: ${updated_card.quantity})<br>click to flip [F]`;
      }
      result_display.style.visibility = "visible";
      
      if (updated_card.rarity == 'epic') {
        const audio = new Audio('assets/sound-effects/lucky-draw1.mp3');
        audio.currentTime = 0;
        audio.play();
      }
      else if (updated_card.rarity == 'legendary' || updated_card.rarity == 'special-edition') {
        const audio = new Audio('assets/sound-effects/lucky-draw2.mp3');
        audio.currentTime = 0;
        audio.play();
      }

      generate_btn.disabled = false;
      
      // Update guarantee display after revealing
      update_guarantee_display();

      // Remove listener so it only triggers once per open
      document.removeEventListener("cover-opened", current_open_handler);
      current_open_handler = null;
    };
    
    // Wait for the 'cover-opened' event, then reveal result
    document.addEventListener("cover-opened", current_open_handler);
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    const key = e.key.toLowerCase();
    if (key === 'b') {
      document.getElementById("generate-card")?.click();
    } else if (key === 'o') {
      document.querySelector("pack-cover")?.click();
    } else if ((key === 'f') && (cover_opened === true)) {
      document.querySelector("frog-card")?.click();
    }
  });
}