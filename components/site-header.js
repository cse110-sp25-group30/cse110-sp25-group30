class SiteHeader extends HTMLElement {
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
            background-color: #101d31;
            color: #FFCD00;
            padding: 10px 40px;
            font-family: 'Wizard World';
            width: 100%;
            box-sizing: border-box;
            position: relative;
            z-index: 10;
        }

        .nav-left {
            font-size: 1.5rem;
            font-weight: bold;
            text-decoration: none;
            color: white;
            display: flex;
            align-items: center;
        }

        .nav-left img {
            margin-right: 10px;
        }

        /* Default: horizontal nav bar (for wide screens) */
        .nav-right {
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .nav-right a {
            color: white;
            text-decoration: none;
            font-size: 1.25rem;
            margin-left: 15px;
            transition: color 0.3s ease;
        }

        .nav-right a:hover {
            color: #D3D3D3;
        }

        /* Hamburger hidden by default (only shows on small screens) */
        .hamburger {
            display: none;
            flex-direction: column;
            justify-content: space-between;
            width: 24px;
            height: 18px;
            cursor: pointer;
            z-index: 1001;
        }

        .hamburger span {
            display: block;
            height: 3px;
            width: 100%;
            background-color: white;
            border-radius: 2px;
            transition: all 0.6s ease;
        }

        .hamburger.active span:nth-child(1) {
            transform: translateY(7.5px) rotate(45deg);
        }

        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
            transform: translateY(-7.5px) rotate(-45deg);
        }

        /* Small screen styles: hamburger + slide-out */
        @media (max-width: 768px) {
            .nav-right {
                position: fixed;
                top: 0;
                right: 0;
                height: 100%;
                width: 250px;
                background-color: #182B49;
                padding-top: 60px;
                flex-direction: column;
                transform: translateX(100%);
                z-index: 1000;
            }

            .nav-right.open {
                transform: translateX(0);
                transition: transform 0.5s ease;
            }

            .hamburger {
                display: flex;
            }

            .nav-right a {
                margin-left: 0;
                padding: 15px 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
            }

            .nav-right a:last-child {
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
        }

        .backdrop {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.6s ease;
            z-index: 999;
        }

        .backdrop.show {
            opacity: 1;
            pointer-events: auto;
        }
        </style>

        <nav>
        <a class="nav-left" href="index.html">
            <img src="/admin/branding/cse_110_logo.jpg" alt="Nerdy Thirty Logo" style="height: 30px;">
            CSE Card Collector
        </a>
        <div class="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="nav-right">
            <a href="grid.html">📁 Collection</a>
            <a href="shop.html">🛍️ Shop</a>
            <a href="clicker.html">🟡 Clicker</a>
        </div>
        <div class="backdrop"></div>
        </nav>
        `;

        const hamburger = this.shadowRoot.querySelector('.hamburger');
        const navRight = this.shadowRoot.querySelector('.nav-right');
        const backdrop = this.shadowRoot.querySelector('.backdrop');
        const links = this.shadowRoot.querySelectorAll('.nav-right a');

        const closeMenu = () => {
            navRight.classList.remove('open');
            hamburger.classList.remove('active');
            backdrop.classList.remove('show');
        };

        const openMenu = () => {
            navRight.classList.add('open');
            hamburger.classList.add('active');
            backdrop.classList.add('show');
        };

        hamburger.addEventListener('click', () => {
            const isOpen = navRight.classList.contains('open');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        backdrop.addEventListener('click', closeMenu);
        links.forEach(link => link.addEventListener('click', closeMenu));
    }
}

customElements.define('site-header', SiteHeader);
