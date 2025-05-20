class CardDeck extends HTMLElement {
  //TODO: make the card deck of pentagons. When the next/prev button is clicked, the pentagons should be flipped to repalce the main cards showing. Shown now is like the back, so we have to flip to tsee the front
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.render();
        this.card_data = []
        this.selected_card = 0
    }
    
        
    render() {
        this.shadowRoot.innerHTML = `
        <style>
           .pentagon {
            width: 400px;
            height: 400px;
            background:var(--card-background-color);
            clip-path: polygon(
              50% 0%,     /* top */
              100% 38%,   /* top-right */
              82% 100%,   /* bottom-right */
              18% 100%,   /* bottom-left */
              0% 38%      /* top-left */
            );
          }
        </style>
        <div class="pentagon">
        ss
        </div>

        `;
  }

  /**
   * Creates a new frog-card element and sets its data.
   * @param {Object} data - The data to set on the frog-card element. Of type card-data.json
   * @returns {HTMLElement} The created frog-card element.
   */
  card_button_click() {
    this.displayDeck();
    const next_button = document.getElementById("next");
    if (this.selected_card+1 > this.card_data.length-1) {
      next_button.disabled = true;
    }

    const prev_button = document.getElementById("prev");
    if (this.selected_card-1 < 0) {
      prev_button.disabled = true;
    }
    next_button.addEventListener("click", () => {
      if (this.selected_card+1 > (this.card_data.length)-1) {
        console.log("No more cards to show");
        next_button.disabled = true;
        return
      }
      this.selected_card++;
      next_button.disabled = this.selected_card + 1 > this.card_data.length - 1;
      prev_button.disabled = false;
      if (this.selected_card >= 0 && this.selected_card < this.card_data.length) {
        this.createCard(this.card_data[this.selected_card]);
      }
    });

    prev_button.addEventListener("click", () => {
      if (this.selected_card-1 < 0) {
        console.log("No more cards to show");
        return
      }
      this.selected_card--;
      prev_button.disabled = this.selected_card - 1 < 0;
      next_button.disabled = false;
      this.createCard(this.card_data[this.selected_card]);
    });

  }
  
  createCard(data) {
    const container = document.getElementById("frog-card");
    container.innerHTML = ""; 
    const card = document.createElement("frog-card");
    card.data = data;
    container.append(card)
  }

  displayDeck() {
    for (let i = 0; i < this.card_data.length; i++) {
      const img = document.createElement("img");
      img.src = "../assets/placeholder_back.png"; // <- card back image
      img.style.setProperty("--x", `${-i * 10}px`);
      img.style.setProperty("--y", `${-i * 10}px`);
      img.style.visibility = 'visible'
      this.appendChild(img);
    }
  }
}
customElements.define('card-deck', CardDeck);
export default CardDeck

/**
 * Card deck Animation Breakdown:
 * 1) Card moves the right 
 * 2) Card flips to show the back
 * 3) Card is tucked in the back of the deck
 * 4) Bring new card forward
 * 5) Flip new card
 * 6) Set new card back down
 * */ 