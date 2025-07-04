/* eslint-disable no-undef */

import {
  get_random_element,
  update_pity_counters,
  get_random_rarity,
  generate_random_card,
  load_pity_counters,
  get_rarity_display_color,
  save_pity_counters,
  update_cost,
  update_container_rarity,
  display_placeholder,
  create_light_rays,
  init,
  show_congrats_animation,

} from '../../scripts/shop.js';

import {
  add_or_update_card,
  save_cards_to_local,
  load_cards_from_local
} from '../../index.js';

describe("display_placeholder", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="card-container"></div>`;
  });

  test('shows first purchase message', () => {
    display_placeholder(true);
    expect(document.querySelector(".placeholder-text").textContent)
      .toContain("Click below to purchase your first pack!");
  });

  test('shows regular message', () => {
    display_placeholder(false);
    expect(document.querySelector(".placeholder-text").textContent)
      .toContain("purchase a pack");
  });
});

test('get_random_element returns a valid element from the array', () => {
  const arr = ['apple', 'banana', 'cherry'];
  const result = get_random_element(arr);
  expect(arr).toContain(result);
});

test('update_pity_counters resets lower rarities and increments higher', () => {
  localStorage.setItem('pity_counters', JSON.stringify({
    rare: 5,
    epic: 4,
    legendary: 3,
    'special-edition': 2
  }));

  const result = update_pity_counters('rare');

  expect(result.rare).toBe(0);
  expect(result.epic).toBe(5);
  expect(result.legendary).toBe(4);
  expect(result['special-edition']).toBe(3);
});

test('get_random_rarity returns guaranteed rarity if threshold met', () => {
  localStorage.setItem('pity_counters', JSON.stringify({
    rare: 10,
    epic: 0,
    legendary: 0,
    'special-edition': 0
  }));

  const result = get_random_rarity([
    { type: 'common', chance: 55 },
    { type: 'uncommon', chance: 25 },
    { type: 'rare', chance: 15 },
    { type: 'epic', chance: 4 },
    { type: 'legendary', chance: 0.9 },
    { type: 'special-edition', chance: 0.1 }
  ]);

  expect(result).toBe('rare');
});

test('generate_random_card returns a valid card object', () => {
  const card = generate_random_card();
  expect(card).toBeDefined();
  expect(card).toHaveProperty('name');
  expect(card).toHaveProperty('rarity');
  expect(card).toHaveProperty('quantity', 1);
  expect(card).toHaveProperty('bio');
  expect(card).toHaveProperty('course');
});

test('load_pity_counters returns default counters when localStorage is empty', () => {
  localStorage.removeItem("pity_counters");
  const counters = load_pity_counters();
  expect(counters).toEqual({
    rare: 0,
    epic: 0,
    legendary: 0,
    "special-edition": 0
  });
});

test('load_pity_counters returns stored counters when they exist', () => {
  const stored = {
    rare: 3,
    epic: 1,
    legendary: 2,
    "special-edition": 0
  };
  localStorage.setItem("pity_counters", JSON.stringify(stored));
  const counters = load_pity_counters();
  expect(counters).toEqual(stored);
});

test('save_pity_counters stores the counters in localStorage', () => {
  const testCounters = {
    rare: 2,
    epic: 1,
    legendary: 0,
    "special-edition": 5
  };
  save_pity_counters(testCounters);
  const stored = JSON.parse(localStorage.getItem("pity_counters"));
  expect(stored).toEqual(testCounters);
});

test('save and load cards to/from local storage', () => {
  const testCards = [{ name: 'Alice', rarity: 'rare', quantity: 1 }];
  save_cards_to_local(testCards);
  const result = load_cards_from_local();
  expect(result).toEqual(testCards);
});

test('add_or_update_card adds new card', () => {
  const card = { name: 'Bob', rarity: 'epic', quantity: 1 };
  localStorage.setItem('card_data', JSON.stringify([]));
  const result = add_or_update_card(card);
  expect(result).toEqual(card);
});

test('add_or_update_card increments existing card', () => {
  const existing = { name: 'Charlie', rarity: 'rare', quantity: 2 };
  localStorage.setItem('card_data', JSON.stringify([existing]));
  const newCard = { name: 'Charlie', rarity: 'rare', quantity: 1 };
  const result = add_or_update_card(newCard);
  expect(result.quantity).toBe(3);
});

test('add_or_update_card removes card if quantity <= 0', () => {
  const existing = { name: 'Dana', rarity: 'legendary', quantity: 1 };
  localStorage.setItem('card_data', JSON.stringify([existing]));
  const removal = { name: 'Dana', rarity: 'legendary', quantity: 1 };
  const result = add_or_update_card(removal, -2);
  expect(result).toBe(null);
  expect(load_cards_from_local()).toEqual([]);
});

test('get_rarity_display_color returns correct color for known rarity', () => {
  expect(get_rarity_display_color('rare')).toBe('#60A5FA');
  expect(get_rarity_display_color('legendary')).toBe('#FFD700');
  expect(get_rarity_display_color('special-edition')).toBe('#FFD700');
});

test('get_rarity_display_color returns default color for unknown rarity', () => {
  expect(get_rarity_display_color('mythical')).toBe('#FFFFFF');
});

test('update_cost populates cost display with correct HTML', () => {
  document.body.innerHTML = `<div id="cost"></div>`;
  update_cost();
  const costDiv = document.getElementById("cost");
  expect(costDiv.innerHTML).toContain("Cost:");
  expect(costDiv.innerHTML).toContain('<img');
});

test('update_container_rarity applies the correct class', () => {
  document.body.innerHTML = `<div id="gen-container" class="rarity-common"></div>`;
  update_container_rarity('epic');
  const container = document.getElementById("gen-container");
  expect(container.classList.contains('rarity-epic')).toBe(true);
  expect(container.classList.contains('rarity-common')).toBe(false);
});

describe("display_placeholder", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="card-container"></div>`;
  });

  test('shows first purchase message', () => {
    display_placeholder(true);
    expect(document.querySelector(".placeholder-text").textContent)
      .toContain("Click below to purchase your first pack!");
  });

  test('shows regular message', () => {
    display_placeholder(false);
    expect(document.querySelector(".placeholder-text").textContent)
      .toContain("purchase a pack");
  });
});

create_light_rays

describe("create_light_rays", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="card-container"></div>`;
  });

  test("creates 12 light rays with correct background color", () => {
    const rarity = "rare";
    create_light_rays(rarity);

    const rays = document.querySelectorAll(".light-ray");
    expect(rays.length).toBe(12);

    rays.forEach((ray, index) => {
      // Check rotation is applied via style
      const rotation = ray.style.getPropertyValue("--rotation");
      expect(rotation).toBe(`${index * 30}deg`);

      // Check background color matches rarity
      expect(getComputedStyle(ray).backgroundColor).toBe("rgb(59, 130, 246)");

    });

    // Check that the light-rays container was added
    const lightRayContainer = document.querySelector(".light-rays");
    expect(lightRayContainer).not.toBeNull();
    expect(lightRayContainer.children.length).toBe(12);
  });

  test("removes existing light rays before adding new ones", () => {
    // First call adds rays
    create_light_rays("epic");
    expect(document.querySelectorAll(".light-ray").length).toBe(12);

    // Second call replaces them
    create_light_rays("legendary");
    const rays = document.querySelectorAll(".light-ray");
    expect(rays.length).toBe(12);

    // Check one was not appended without cleanup
    const lightRaysContainers = document.querySelectorAll(".light-rays");
    expect(lightRaysContainers.length).toBe(1);
  });
});

describe("init", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="generate-card"></div>
      <div id="result"></div>
      <div id="points-display"></div>
      <div id="card-container"></div>
      <div id="gen-container"></div>
      <div id="guarantee-display"></div>
      <div class="tooltip-text"></div>
    `;
    localStorage.clear();
    localStorage.setItem("cards", JSON.stringify([]));
    localStorage.setItem("pity_counters", JSON.stringify({
      rare: 0,
      epic: 0,
      legendary: 0,
      "special-edition": 0
    }));
  });

  test("sets up event listeners and UI", () => {
    expect(() => init()).not.toThrow();
  });
});

describe("show_congrats_animation", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="gen-container"></div>`;
  });

  test("adds congrats animation text for a common card", () => {
    show_congrats_animation("common");
    const animation = document.querySelector(".congrats-animation");
    expect(animation).not.toBeNull();

    const text = animation.querySelector(".congrats-text");
    expect(text.textContent).toContain("COMMON");
  });

  test("adds particles for rare or higher rarities", () => {
    show_congrats_animation("epic");
    const particles = document.querySelectorAll(".congrats-particles .particle");
    expect(particles.length).toBeGreaterThan(0);
  });
});

describe("update_container_rarity", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="gen-container" class="rarity-common rarity-epic"></div>`;
  });

  test("removes all previous rarity classes", () => {
    update_container_rarity(null);
    const container = document.getElementById("gen-container");
    const classList = container.classList;
    expect([...classList].some(cls => cls.startsWith("rarity-"))).toBe(false);
  });

  test("adds new rarity class", () => {
    update_container_rarity("legendary");
    const container = document.getElementById("gen-container");
    expect(container.classList.contains("rarity-legendary")).toBe(true);
  });
});

describe("update_cost", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="cost"></div>`;
  });

  test("displays correct cost and image", () => {
    update_cost();
    const costElement = document.getElementById("cost");
    expect(costElement.innerHTML).toContain("100");
    expect(costElement.innerHTML).toContain("point.webp");
  });
});
