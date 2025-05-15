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
            header {
            background-color: var(--background-color);
            color: white;
            padding: 10px;
            text-align: center;
            margin:-8px;
            margin-bottom: 20px;
            }
        </style>
        <header>
            <h1>Nerdy Thirty</h1>
        </header>
        `;
    }

}
customElements.define('site-header', SiteHeader);