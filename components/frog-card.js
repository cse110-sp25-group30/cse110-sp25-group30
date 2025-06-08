/*
This is the JavaScript file for the frog-card component.
*/

class FrogCard extends HTMLElement {
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
			const audio = new Audio('assets/sound-effects/card-flip.mp3');
			audio.volume = 0.1;
			this.card.classList.toggle('flipped');
			audio.currentTime = 0; // Reset if replaying
    		audio.play();
		});
	}

	set data(data) {
		console.log("frog-card received data:", data);
		// if (!data || !data.rarity || !data.name || !data.bio || !data.course) return;
		if (!data || !data.rarity || !data.name) return;
		const profImgUrl = `./assets/prof-images/${data.name}.webp`;
		const fallbackImage = './assets/prof-images/Thomas A. Powell.webp';
		const fgImgUrl = `./assets/card-backings/${data.rarity}_front.webp`;
		const bgImgUrl = `./assets/card-backings/${data.rarity}_back.webp`;

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
			// loadImage(profImgUrl),
			loadImage(profImgUrl).catch(() => loadImage(fallbackImage)),
			loadImage(fgImgUrl),
			loadImage(bgImgUrl),
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
					<div class="flip-card-back">
						<img class="back-bg" src="${bgImgUrl}" alt="background">
						<p class="back-name">${data.name}</p>
						${data.bio ? `<p class="bio">${data.bio}</p>` : ""}
						${data.course ? `<p class="course">${data.course}</p>` : ""}
					</div>
					</div>
				</div>
			`;

		}).catch((err) => {
			this.card.innerHTML = `<p class="loading">Failed to load card</p>`;
			console.error("Image failed to load", err);
		});
	}

	click() {
		this.card.click();
	}
}

customElements.define('frog-card', FrogCard);