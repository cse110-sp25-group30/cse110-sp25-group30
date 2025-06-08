import {update_points} from "../index.js"
import {fetch_user_info} from "../index.js"

window.addEventListener("DOMContentLoaded", init);





/**
 * @description Adds click event to clicker page where needed
 */
function clicker_buttons() {
  const clicker_button = document.getElementById("clicker-button");
  const points_display = document.getElementById("points_display");

  if (!clicker_button) return;

  clicker_button.addEventListener("mousedown", function () {
    let user_info = fetch_user_info();
    if (!user_info) {
      console.error("No user info found");
      return;
    }
    update_points(1);
    user_info.points += 1;//updates points
    points_display.innerHTML = `Points: ${user_info.points}`;
    //  5% chance to show a bonus popup instead of earning 1 point
    if (Math.random() < 0.05) {
      showBonusPopup();
    }


    clicker_button.style.transform = "scale(0.95)";
  });

  clicker_button.addEventListener("mouseup", function () {
    clicker_button.style.transform = "scale(1)";
  });
  /**
 * @description Creates the reandom popup buttons at 5% per click and removes them after 1.5 seconds.
 */
  function showBonusPopup() {
    const bonus = document.createElement("div");//creates the bonus window
    bonus.id = "bonus-popup";
    bonus.textContent = "+10!";
    bonus.classList.add("bonus-popup");

    // Random position on screen
    bonus.style.left = Math.random() * 80 + 10 + "%";
    bonus.style.top = Math.random() * 60 + 20 + "%";

    document.body.appendChild(bonus);
    //actually adds 10 when clicked
    bonus.addEventListener("click", () => {
      let user_info = fetch_user_info();
      update_points(10);
      user_info.points += 10;
      points_display.innerHTML = `Points: ${user_info.points}`;
      bonus.remove();
    });

    // Auto-remove after 1 seconds
    setTimeout(() => {
      if (document.body.contains(bonus)) {
        bonus.remove();
      }
    }, 1500);
  }
}


  async function init(){
    clicker_buttons()
    const points_display = document.getElementById("points_display");
    let user_info = JSON.parse(localStorage.getItem("user_data"));
    points_display.innerHTML =`Points: ${user_info.points}`;
  }