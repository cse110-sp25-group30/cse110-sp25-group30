class CardDeck extends HTMLElement {
  //TODO: make the card deck of pentagons. When the next/prev button is clicked, the pentagons should be flipped to repalce the main cards showing. Shown now is like the back, so we have to flip to tsee the front
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }
    

    
    render() {
        this.shadowRoot.innerHTML = `
        <style>
           .pentagon {
  width: 150px;
  height: 150px;
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

}
customElements.define('card-deck', CardDeck);