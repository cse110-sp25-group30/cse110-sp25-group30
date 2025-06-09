/* eslint-disable no-undef */
import {  init, clicker_buttons } from "../../scripts/clicker.js";
import { jest } from '@jest/globals';

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
  beforeEach(async () => {
    // fresh DOM for each test
    document.body.innerHTML = `
        <div id="clicker-comp"></div>
        <div id="points_display"></div>
        <div id="clicker-comp-wrapper"></div>
        <div id="clicker-container"></div>
        `;
    //Set initial user data
    localStorage.setItem("user_data", JSON.stringify({ points: 0 }));
    await init()
  });


  it('Render Dom and Ensure Everything Works', () => {
    // add something dynamically
    const clickerComp = document.getElementById("clicker-comp");
    const pointsDisplay = document.getElementById("points_display");
    //expect the element to be in the DOM
    expect(clickerComp).not.toBeNull();
    expect(pointsDisplay).not.toBeNull();
    const point_text = pointsDisplay.textContent;
    console.log(point_text, "point_text");
    expect(point_text).toMatch(/Points: \d+/);
    const Initpoints = parseInt(point_text.split(" ")[1], 10);
    expect(Initpoints).toBe(0);
    clickerComp.dispatchEvent(fakePointer('pointerdown'));
    clickerComp.dispatchEvent(fakePointer('pointerup'));
    //expect the points to be greater than 0
    const updatedPointsText = pointsDisplay.textContent;
    const updatedPoints = parseInt(updatedPointsText.split(" ")[1], 10);
    expect(updatedPoints).toBe(1);
  });

  it("Ensure Popups Work",()=>{
    const clickerComp = document.getElementById("clicker-comp");
    const pointsDisplay = document.getElementById("points_display");
    //Simulate clicks, check pop up exists
    let popup_exists = false;
    let points_before =0
    for (let i = 0; i < 100; i++) {
        clickerComp.dispatchEvent(fakePointer('pointerdown'));
    clickerComp.dispatchEvent(fakePointer('pointerup'));
      // Check if the popup exists
      const popup = document.querySelector('.bonus-popup');
      const pointsDisplay = document.getElementById("points_display");
      const pointsText = pointsDisplay.textContent;
      const points = parseInt(pointsText.split(" ")[1], 10);
      points_before= points;
      if (popup) {
        popup_exists = true;
        popup.click(); // Simulate clicking the popup
        console.log("Popup clicked");
        break; // Exit loop if popup is found
      }
    }
    const points_after = parseInt(pointsDisplay.textContent.split(" ")[1], 10);
    expect(points_after).toBe(points_before + 10);
    expect(popup_exists).toBe(true);
  })

  it("No clicker component", () => {
    document.body.innerHTML = `
        <div id="points_display"></div>
    `;
    expect(() => clicker_buttons()).toThrow("Clicker component not found");

  })

    it('throws on mousedown when no user info', () => {
    // 1️⃣  Fresh DOM
    document.body.innerHTML = `
        <div id="clicker-comp"></div>
        <div id="points_display"></div>
    `;

    localStorage.removeItem('user_data');
    clicker_buttons()
    const clickerComp = document.getElementById('clicker-comp');
  
  const errorListener = jest.fn();
window.addEventListener('error', errorListener);

clickerComp.dispatchEvent(fakePointer('pointerdown'));

expect(errorListener).toHaveBeenCalled();
expect(errorListener.mock.calls[0][0].error.message)
  .toBe('No user info found');

window.removeEventListener('error', errorListener);
})

it("test frenzy mode", async () => {
  clicker_buttons(true) // Enable frenzy mode for testing
  const clickerComp = document.getElementById("clicker-comp");
  clickerComp.dispatchEvent(fakePointer('pointerdown'));
  clickerComp.dispatchEvent(fakePointer('pointerup'));
  const pointsDisplay = document.getElementById("points_display");
  const pointsText = pointsDisplay.textContent;
  const pointVal = parseInt(pointsText.split(" ")[1], 10);
  //get class frenzy-popup
  const frenzyPopup = document.querySelector('.frenzy-popup');
  expect(frenzyPopup).not.toBeNull(); // Ensure frenzy popup is displayed
  //Time out for 10 seconds 
  await new Promise(resolve => setTimeout(resolve, 10000));
  const frenzyPopupAfter = document.querySelector('.frenzy-popup');
  expect(frenzyPopupAfter).toBeNull(); // Ensure frenzy popup is removed after 10 seconds
  expect(pointVal).toBe(2); // Frenzy mode should increase points significantly

}, 15000);
})


