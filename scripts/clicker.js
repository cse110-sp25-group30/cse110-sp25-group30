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

  const handleClick = () => {
    update_points(1);
    let user_info = fetch_user_info();
    if (!user_info) {
      console.error("No user info found");
      return;
    }
    points_display.innerHTML = `Points: ${user_info.points}`;
    clicker_comp.style.transform = "scale(0.95)";
  };

  const resetScale = () => {
    clicker_comp.style.transform = "scale(1)";
  };

  // Desktop events
  clicker_comp.addEventListener("mousedown", handleClick);
  clicker_comp.addEventListener("mouseup", resetScale);

  // Mobile events
  clicker_comp.addEventListener("touchstart", handleClick);
  clicker_comp.addEventListener("touchend", resetScale);
}



  async function init(){
    clicker_buttons()
    const points_display = document.getElementById("points_display");
    let user_info = JSON.parse(localStorage.getItem("user_data"));
    points_display.innerHTML =`Points: ${user_info.points}`;
  }