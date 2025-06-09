/*
This is the JavaScript file for the card-thumbnail component.
*/

class CardThumbnail extends HTMLElement {
	constructor() {
		super();

		this.shadow = this.attachShadow({ mode: 'open' });
		this.card = document.createElement('div');
		this.card.className = 'card';
		this.infoContainer = document.createElement('div');
		this.infoContainer.className = 'card-info';

		this.shadow.appendChild(this.card);
		this.shadow.appendChild(this.infoContainer);

		this.initStyles();
		this.addCardClickListener();
	}

	initStyles() {
		const link = document.createElement('link');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('href', 'styles/card-thumbnail.css');
		this.shadow.appendChild(link);

		const style = document.createElement('style');
		style.textContent = `
			.card-info {
				text-align: center;
				margin-top: 0.5rem;
				color: #f2a900;
				font-size: 2rem;
			}
			.card-info .quantity {
				opacity: 0.9;
			}
		`;
		this.shadow.appendChild(style);
	}

	addCardClickListener() {
		this.card.addEventListener('click', () => {
			if (this._data) {
				this.dispatchEvent(
					new CustomEvent('card-clicked', {
					detail: this._data,
					bubbles: true,
					composed: true
					})
				);
    		}
		});
	}

	set data(data) {
		if (!data || !data.rarity || !data.name) return;

		const profImgUrl = `./assets/prof-images/${data.name}.webp`;
		const fgImgUrl = `./assets/card-backings/${data.rarity}_front.webp`;

        this._data = data;

		const loadImage = (src) =>
			new Promise((resolve, reject) => {
				const img = new Image();
				img.onload = resolve;
				img.onerror = reject;
				img.src = src;
			});

		// Set default loading message
		this.card.innerHTML = `
			<div class="loading">
				<div class="spinner"></div>
			</div>
		`;

		Promise.all([
			loadImage(profImgUrl),
			loadImage(fgImgUrl),
		]).then(() => {
			this.style.setProperty('--text-color', '#f2a900');
			if (data.rarity === "legendary") {
				this.style.setProperty('--text-color', '#003057');
			}

			this.card.innerHTML = `
                <div class="card-content">
                    <img class="face" src="${profImgUrl}" alt="${data.name} image">
                    <img class="card-fg" src="${fgImgUrl}" alt="foreground layer">
                    <p class="front-name">${data.name}</p>
                </div>
            `;

			// Update card info with rarity class
			this.infoContainer.innerHTML = `
				<div class="quantity rarity-${data.rarity.toLowerCase()}">${data.quantity || 1} owned</div>
			`;
		}).catch((err) => {
			this.card.innerHTML = `<p class="loading">Failed to load card</p>`;
			this.infoContainer.innerHTML = '';
			console.error("Image failed to load", err);
		});
	}
}

customElements.define('card-thumbnail', CardThumbnail);