/* eslint-disable-next-line no-unused-vars */
import {update_points} from "../index.js"

window.addEventListener("DOMContentLoaded", init);





/**
 * @description Adds click event to clicker page where needed
 */
function clicker_buttons(){

    const clicker_comp = document.getElementById("clicker_comp")
    if (!clicker_comp){
      return;
    }
    clicker_comp.addEventListener("click", function(){
      /*
      TODO: Use update_points to update the # of points. So you dont call the function
      a ton of times, I recommend using setTimeout so
      like every 500 ms save points with update_points function.
      */
      console.log("clicked")
    })
  
  
  
  }

  function init(){
    clicker_buttons()
  }