/* eslint-disable no-undef */

import { jest } from '@jest/globals';
import {
  get_random_element,
  update_pity_counters,
  get_random_rarity,
  generate_random_card,
  load_pity_counters
} from '../../scripts/shop.js';

import {
  add_or_update_card,
  save_cards_to_local,
  load_cards_from_local
} from '../../index.js';

beforeEach(() => {
  localStorage.clear();
  jest.restoreAllMocks(); // clear mocks between tests
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

  expect(result.rare).toBe(0); // reset
  expect(result.epic).toBe(5); // incremented
  expect(result.legendary).toBe(4); // incremented
  expect(result['special-edition']).toBe(3); // incremented
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
  expect(typeof card).toBe('object');

  expect(card).toHaveProperty('name');
  expect(card).toHaveProperty('rarity');
  expect(card).toHaveProperty('quantity', 1); // always 1
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




