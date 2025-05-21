class CardDeck extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          width: 400px;
          height: 400px;
        }

        .deck-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .back-card {
          position: absolute;
          width: 100%;
          height: 100%;
          background: var(--card-background-color);
          clip-path: polygon(
            50% 0%,
            100% 38%,
            82% 100%,
            18% 100%,
            0% 38%
          );
          opacity: 0.5;
          transform: scale(0.95);
          z-index: 0;
        }

        .back-card:nth-child(1) {
          top: 6px;
          left: 6px;
        }

        .back-card:nth-child(2) {
          top: 12px;
          left: 12px;
        }

        .back-card:nth-child(3) {
          top: 18px;
          left: 18px;
        }

        .main-card {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 5;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        ::slotted(frog-card) {
          width: 100%;
          height: 100%;
        }
      </style>

      <div class="deck-wrapper">
        <div class="back-card"></div>
        <div class="back-card"></div>
        <div class="back-card"></div>
        <div class="main-card">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('card-deck', CardDeck);
