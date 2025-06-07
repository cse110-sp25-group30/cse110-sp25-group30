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
		const style = document.createElement('style');
		style.textContent = style.textContent = `
		.flip-card {
			width: 400px;
			height: 400px;
			perspective: 1000px;
			cursor: pointer;
		}

		.flip-card-inner {
			position: relative;
			width: 100%;
			height: 100%;
			transition: transform 0.8s;
			transform-style: preserve-3d;
		}

		.flipped .flip-card-inner {
			transform: rotateY(180deg);
		}

		.flip-card-front, .flip-card-back {
			position: absolute;
			width: 100%;
			height: 100%;
			backface-visibility: hidden;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
		}

		.flip-card-back {
			transform: rotateY(180deg);
		}

		.face {
			width: auto;
			height: 53%; /* sets height to fit the height of the frame */
			max-width: 71%; /* makes sure if the image is landscape, it does not go past the border of the card */
			margin-top: 30%;
			position: relative;
			z-index: 1;
		}

		.card-fg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			object-fit: contain;
			pointer-events: none;
			z-index: 2;
		}

		.front-name {
			position: absolute;
			bottom: 6%;
			z-index: 3;
			color: #003057; /* ucsd blue */
			font-size: 100%;
		}

		.back-bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			object-fit: contain;
			z-index: 1;
		}

		.back-name {
			position: absolute;
			top: 23%;
			z-index: 2;
			color: #003057; /* ucsd blue */
			font-size: 80%;
		}

		.bio {
			position: absolute;
			top: 31.5%;
			z-index: 2;
			color: var(--text-color);
			text-align: center;
			font-size: 54%;
			max-width: 40%;
		}

		.course {
			position: absolute;
			top: 16%;
			z-index: 2;
			color: var(--text-color);
			text-align: center;
			font-size: 80%;
		}

		.loading {
			margin-top: 65%;
		}
		
		.spinner {
			width: 150px;
			height: 150px;
			border: 10px solid rgba(0, 0, 0, 0.1);
			border-left-color: #003057;
			border-radius: 50%;
			animation: spin 1s linear infinite;
		}

		@keyframes spin {
			to {
				transform: rotate(360deg);
			}
		}
		`;
		this.shadow.appendChild(style);
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
		if (!data || !data.rarity || !data.name || !data.bio || !data.course) return;

		const profImgUrl = `./assets/prof-images/${data.name}.webp`;
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
			<div class="loading"></div>
				<div class="spinner"></div>
			<div class="loading"></div>
		`;

		Promise.all([
			loadImage(profImgUrl),
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
						<!-- FRONT -->
						<div class="flip-card-front">
							<img class="face" src="${profImgUrl}" alt="${data.name} image">
							<img class="card-fg" src="${fgImgUrl}" alt="foreground layer">
							<p class="front-name">${data.name}</p>
						</div>
						<!-- BACK -->
						<div class="flip-card-back">
							<img class="back-bg" src="${bgImgUrl}" alt="background">
							<p class="back-name">${data.name}</p>
							<p class="bio">${data.bio}</p>
							<p class="course">${data.course}</p>
						</div>
					</div>
				</div>
			`;
		}).catch((err) => {
			card.innerHTML = `<p class="loading">Failed to load card</p>`;
			console.error("Image failed to load", err);
		});
	}

	click() {
		this.card.click();
	}
}

customElements.define('frog-card', FrogCard);