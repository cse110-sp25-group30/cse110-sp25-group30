import {update_points} from "../index.js"
import {fetch_user_info} from "../index.js"

window.addEventListener("DOMContentLoaded", init);
/**
 * Initializes click event listeners for the clicker component.
 * 
 * When the clicker component is pressed, increments the user's points,
 * updates the points display, and applies a scaling effect for visual feedback.
 * On mouse release, restores the original scale.
 * 
 * Assumes the existence of `update_points` and `fetch_user_info` functions,
 * and elements with IDs "clicker-comp" and "points_display" in the DOM.
 */
function clicker_buttons() {

  const clicker_comp = document.getElementById("clicker-comp");
  const clicker_wrap = document.getElementById("clicker-comp-wrapper");
  const points_display = document.getElementById("points_display");
  const clicker_container = document.getElementById("clicker-container");
  let point_worth = 1;
  let frenzy = false;
  if (!clicker_comp) {
    return;
  }

  const handleClick = (e) => {
    e.preventDefault();
    if (e.button == 0 || e.type == "touchstart") {
      update_points(point_worth);
      
      let user_info = fetch_user_info();
      if (!user_info) {
        console.error("No user info found");
        return;
      }
      
      points_display.innerHTML = `Points: ${user_info.points}`;
      clicker_wrap.style.transform = "scale(0.93)";

      // Generate a popup with low probability
      const popup_prob = 0.9;
      if (Math.random() < popup_prob) {
        showBonusPopup();
      }
      // Trigger clicker frenzy with even lower chance
      if (Math.random() < 0.005  && !frenzy) {
        triggerFrenzy();
      }
    }
  };
  
  /**
  * @description Creates the random popup buttons at 5% per click. Element fades away and removes them after 1.5 seconds.
  */
  function showBonusPopup() {
    const bonus = document.createElement("div");//creates the bonus window
    bonus.id = "bonus-popup";
    bonus.textContent = `+${10 * point_worth}! `;
    bonus.classList.add("bonus-popup");

    const mq = window.matchMedia("(max-width: 768px)");
    if (mq.matches) {
      bonus.style.left = Math.random() * 60 + 10 + "vw";
      bonus.style.top = Math.random() * 60 + 20 + "vh";
    } else {
      bonus.style.left = Math.random() * 80 + 10 + "vw";
      bonus.style.top = Math.random() * 60 + 20 + "vh";
    }

    document.body.appendChild(bonus);
    //actually adds 10 when clicked
    bonus.addEventListener("click", (e) => {
      e.preventDefault();
      let user_info = fetch_user_info();
      update_points(10 * point_worth);
      user_info.points += 10 * point_worth;
      points_display.innerHTML = `Points: ${user_info.points}`;
      bonus.remove();
    });

    // Have the element fade out while on screen
    let duration = 1500;
    let interval = 10;
    let decrement = interval / duration;
    let opacity = 1;
    let fade = setInterval(() => {
      opacity -= decrement;
      if (opacity <= 0) {
        opacity = 0;
        clearInterval(fade);
      }
      bonus.style.opacity = opacity;
    }, interval);

    // Auto-remove after 1.5 seconds
    setTimeout(() => {
      if (document.body.contains(bonus)) {
        bonus.remove();
      }
    }, duration);
  }

  /**
   * @description Restores the clicker back to normal size
   */
  const resetScale = () => {
    clicker_wrap.style.transform = "scale(1)";
  };

  /**
   * @description Triggers a clicker frenzy, increasing the number of points per click
   */
  function triggerFrenzy() {
    const frenz = document.createElement("div");
    frenz.id = "frenzy-popup";
    frenz.classList.add("frenzy-popup");

    document.body.appendChild(frenz);

    const duration = 10000;
    let count = 10;
    point_worth = 2;
    frenzy = true;

    frenz.textContent = `Frenzy! X2 Multiplier for ${count} seconds!`;

    const ticker = setInterval(() => {
      count--;
      if(count >= 0) {
        frenz.textContent = `Frenzy! X2 Multiplier for ${count} seconds!`;
      }
      else {
        clearInterval(ticker);
      }

    }, 1000);

    setTimeout(() => {
      clicker_container.style.background = "linear-gradient(0deg, transparent 0%, #00629B 50%, transparent 100%)"
      frenzy = false;
      point_worth = 1;
      if (document.body.contains(frenz)) {
        frenz.remove();
      }
    }, duration);

    // Change background
    clicker_container.style.background = "linear-gradient(0deg, transparent 0%,rgb(224, 153, 1) 50%, transparent 100%)"
  }

  // Desktop and mobile events
  clicker_comp.addEventListener("pointerdown", handleClick);
  clicker_comp.addEventListener("pointerup", resetScale);
}


  async function init(){
    clicker_buttons()
    const points_display = document.getElementById("points_display");
    let user_info = JSON.parse(localStorage.getItem("user_data"));
    points_display.innerHTML =`Points: ${user_info.points}`;
  }