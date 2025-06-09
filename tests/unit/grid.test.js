/* eslint-disable no-undef */
import {init} from "../../scripts/grid.js"
import {jest} from '@jest/globals';

if (!window.matchMedia) {
  window.matchMedia = query => ({
    matches: false,           // default: "no media query matched"
    media: query,
    onchange: null,
    // the old-style listener APIs
    addListener:   () => {},
    removeListener:() => {},
    // the modern ones (jsdom v21+ expects these)
    addEventListener:    () => {},
    removeEventListener: () => {},
    dispatchEvent:       () => false,
  });
}

function fakePointer(type) {
  // create a plain Event whose properties we can override
  const ev = new Event(type, { bubbles: true, cancelable: true });

  // add the fields your code looks at
  Object.defineProperty(ev, 'button', { value: 0 });       // primary button
  Object.defineProperty(ev, 'pointerType', { value: 'touch' }); // optional

  return ev;
}

describe('Init clicker', () => {
