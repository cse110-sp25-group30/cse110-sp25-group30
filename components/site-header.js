class SiteHeader extends HTMLElement {
  //TODO: Add styling and proper header based on the design
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }
    
    render() {
        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
            }

            nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: black;
                color: white;
                padding: 10px 20px;
                font-family: sans-serif;
            }

            .nav-left {
                font-size: 1.5rem;
                font-weight: bold;
            }

            .nav-right button {
                background: none;
                border: none;
                color: white;
                font-size: 1rem;
                margin-left: 15px;
                cursor: pointer;
            }

            .nav-right button:hover {
                text-decoration: underline;
            }
        </style>

        <nav>
            <div class="nav-left">Nerdy Thirty</div>
            <div class="nav-right">
                <button>Home</button>
                <button>About</button>
                <button>Contact</button>
            </div>
        </nav>
        `;
    }

}
customElements.define('site-header', SiteHeader);