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
  const points_display = document.getElementById("points_display");
  if (!clicker_comp) {
    return;
  }

  const handleClick = (e) => {
    if (e.button == 0 || e.type == "touchstart") {
      update_points(1);
      
      let user_info = fetch_user_info();
      if (!user_info) {
        console.error("No user info found");
        return;
      }
      
      points_display.innerHTML = `Points: ${user_info.points}`;
      clicker_comp.style.transform = "scale(0.93)";
      if (Math.random() < 0.05) {
        showBonusPopup();
      }
    }
  };
  
    /**
 * @description Creates the random popup buttons at 5% per click. Element fades away and removes them after 1.5 seconds.
 */
  function showBonusPopup() {
    const bonus = document.createElement("div");//creates the bonus window
    bonus.id = "bonus-popup";
    bonus.textContent = "+10!";
    bonus.classList.add("bonus-popup");

    // Random position on screen
    bonus.style.left = Math.random() * 80 + 10 + "vw";
    bonus.style.top = Math.random() * 60 + 20 + "vh";

    document.body.appendChild(bonus);
    //actually adds 10 when clicked
    bonus.addEventListener("click", () => {
      let user_info = fetch_user_info();
      update_points(10);
      user_info.points += 10;
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

  const resetScale = () => {
    clicker_comp.style.transform = "scale(1)";
  };

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