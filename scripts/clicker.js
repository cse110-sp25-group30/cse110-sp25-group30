import {update_points} from "../index.js"
import {fetch_user_info} from "../index.js"

window.addEventListener("DOMContentLoaded", init);





/**
 * @description Adds click event to clicker page where needed
 */
function clicker_buttons(){
    const clicker_button = document.getElementById("clicker-button");
    const points_display = document.getElementById("points_display");
    if (!clicker_button){
      return;
    }
    clicker_button.addEventListener("mousedown", function(){
      /*
      TODO: Use update_points to update the # of points. So you dont call the function
      a ton of times, I recommend using setTimeout so
      like every 500 ms save points with update_points function.
      */
      // console.log("clicked")
      update_points(1);
      let user_info = fetch_user_info();
      if (!user_info){
        console.error("No user info found");
        return;
      }
      // else{
      //   console.log(user_info.points);
      // }
      points_display.innerHTML = `Points: ${user_info.points}`;
      clicker_button.style.transform = "scale(0.95)";
    })
    clicker_button.addEventListener("mouseup", function(){
      /*
      TODO: Use update_points to update the # of points. So you dont call the function
      a ton of times, I recommend using setTimeout so
      like every 500 ms save points with update_points function.
      */      
     
      clicker_button.style.transform = "scale(1)";
    })
    /**
     * Updates the user point in the backend and the UI.
     * Calls update_points() with the new points.
     */
    
    // Update the user points
    // call update_points with the new points
    // update the UI with the new pointsg


}



  async function init(){
    clicker_buttons()
    const points_display = document.getElementById("points_display");
    let user_info = JSON.parse(localStorage.getItem("user_data"));
    points_display.innerHTML =`Points: ${user_info.points}`;
  }