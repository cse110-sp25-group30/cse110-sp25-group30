/*
This is the JavaScript file for the card-thumbnail component.
*/

class CardThumbnail extends HTMLElement {
	constructor() {
		super();

		this.shadow = this.attachShadow({ mode: 'open' });
		this.card = document.createElement('card');

		this.shadow.appendChild(this.card);

		this.initStyles();
		this.addEventListener();
	}

	initStyles() {
		const link = document.createElement('link');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('href', 'styles/frog-card.css');
		this.shadow.appendChild(link);
	}

	addEventListener() {
		this.card.addEventListener('click', () => {
			// Save card data and redirect
			if (this._data) {
				localStorage.setItem('selected_card', JSON.stringify(this._data));
				window.location.href = 'viewer.html';
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
                <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <img class="face" src="${profImgUrl}" alt="${data.name} image">
                            <img class="card-fg" src="${fgImgUrl}" alt="foreground layer">
                            <p class="front-name">${data.name}</p>
                        </div>
                    </div>
                </div>
            `;
		}).catch((err) => {
			this.card.innerHTML = `<p class="loading">Failed to load card</p>`;
			console.error("Image failed to load", err);
		});
	}
}

customElements.define('card-thumbnail', CardThumbnail);