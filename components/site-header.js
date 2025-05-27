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
                width: 100%;
            }
          
            nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: black;
                color: white;
                padding: 10px 40px;
                font-family: sans-serif;
                width: 100%;              /* ✅ instead of 100vw */
                box-sizing: border-box;   /* ✅ ensures padding is included */
            }

            .nav-left{
                font-size: 1.5rem;
                font-weight: bold;
                text-decoration: none;
                color: white;
            }

            .nav-right a {
                background: none;
                border: none;
                color: white;
                font-size: 1.25rem;
                margin-left: 15px;
                cursor: pointer;
                text-decoration: none;
                transition: all 0.3s ease-in-out;
            }       

            .nav-right a:hover {
                color: #D3D3D3;
            }
        </style>

        <nav>
            <a class="nav-left" href="index.html">Nerdy Thirty</a>
            <div class="nav-right">
                <a href="index.html">📁 Collection</a> <!-- TODO: goes to the grid html -->
                <a href="shop.html">🛍️ Shop</a>
                <a href="clicker.html">🟡 Clicker</a>
            </div>
        </nav>
        `;
    }

}
customElements.define('site-header', SiteHeader);