/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
function Card(title, author) {
  this.title = title;
  this.author = author;
}
const c1 = new Card("HEY", "Bob");
console.log(c1.author);

//index of the card to be displayed
let selected_card = 0;
let card_data = [];

window.addEventListener("DOMContentLoaded", init);

/**
 * Fetches data from the JSON file and returns it as a Promise.
 * @param {string} path - The path to the JSON file relative to index.html.
 * @returns {Promise} A promise that resolves to the data from the JSON file.
 * @throws {Error} If the fetch operation fails.
 */
async function fetch_data(path){
  try{
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Fetch error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }
  catch(error){
    console.error("Error fetching data:", error);
    throw error;
  }
}

//TODO: Later we have to just fetch the unlocked cards, for now fetches all cards.
/**
 * Fetches unlocked cards from local storage.
 * @returns {Array} An array of unlocked cards from local storage.
 */
 function fetch_unlocked_cards(){
  const data = localStorage.getItem("card_data");
  if (!data){
    return []
  }
  const parsed_data = JSON.parse(data);
  return parsed_data;
}
/**
 * Saves data to local storage.
 * @param {Object} data - The data to save to local storage.
 * @param {string} key - The key under which to save the data.
 * @returns {void}
 * */
function save_to_local(data, key){
  if (!key){
    return
  }
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * 
 * @description Adds a click event listener to the next button. When clicked, it increments the selected_card index and creates a new card.
 * @param {Array} card_data - The array of card data.
 * @returns {void}
 * */
function card_button_click(){
    const next_button = document.getElementById("next");
  if (selected_card+1 > card_data.length-1) {
    next_button.disabled = true;
  }

 const prev_button = document.getElementById("prev");
    if (selected_card-1 < 0) {
    prev_button.disabled = true;
  }
  next_button.addEventListener("click", function() {
    if (selected_card+1 > card_data.length-1) {
      console.log("No more cards to show");
      next_button.disabled = true;
      return
    }
    selected_card++;
    next_button.disabled = selected_card + 1 > card_data.length - 1;
    prev_button.disabled = false;
    if (selected_card >= 0 && selected_card < card_data.length) {
    createCard(card_data[selected_card]);
    }
  });
  prev_button.addEventListener("click", function() {
    if (selected_card-1 < 0) {
      console.log("No more cards to show");
      return
    }
    selected_card--;
    prev_button.disabled = selected_card - 1 < 0;
    next_button.disabled = false;
    createCard(card_data[selected_card]);
  });
}

async function init() {
  const card_data_all = await fetch_data("./card-data.json"); 
  save_to_local(card_data_all, "card_data");//TODO: Delete this line and use unlocked cards from local storage
  const card_data_get =  fetch_unlocked_cards()
  card_data = card_data_get
  createCard(card_data[selected_card]);
  card_button_click()



}

/**
 * Creates a new frog-card element and sets its data.
 * @param {Object} data - The data to set on the frog-card element. Of type card-data.json
 * @returns {HTMLElement} The created frog-card element.
 */
function createCard(data) {
  const container = document.getElementById("frog-card");
  container.innerHTML = ""; 
  const card = document.createElement("frog-card");
  card.data = data;
  container.append(card)
}