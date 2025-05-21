
/*
This is the JavaScript file for the frog-card component.
We need to add a flipping animation to the card so it can be flipped to show the back
Bio and course should go on the back of the card. 

Try to use CSS variables for the colors. 
*/
class FrogCard extends HTMLElement {
	constructor() {
		super();

		const shadow = this.attachShadow({ mode: 'open' });
		const card = document.createElement('card');
		const style = document.createElement('style');

		style.textContent = `
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
			background: transparent;
			border: none;
		}

		.flip-card-back {
			transform: rotateY(180deg);
		}

		.face {
			width: auto;
			height: 53%;
			max-width: 71%;
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
			color: var(--name-color);
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
			color: var(--name-color);
			font-size: 80%;
		}

		.bio {
			position: absolute;
			top: 30.5%;
			z-index: 2;
			color: var(--text-color);
			text-align: center;
			font-size: 65%;
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
		`;

		shadow.appendChild(style);
		shadow.appendChild(card);

		card.addEventListener('click', () => {
			card.classList.toggle('flipped');
		});
	}

	set data(data) {
		if (!data || !data.imgSrc || !data.rarity || !data.name || !data.bio || !data.course) return;

		const card = this.shadowRoot.querySelector('card');

		if (data.rarity === "legendary") {
			this.style.setProperty('--name-color', '#FFFFFF'); // ucsd blue
			this.style.setProperty('--text-color', '#003057'); // ucsd blue
		} else {
			this.style.setProperty('--name-color', '#003057'); // ucsd blue
			this.style.setProperty('--text-color', '#f2a900'); // ucsd yellow
		}

		card.innerHTML = `
		<div class="flip-card">
			<div class="flip-card-inner">
				<!-- FRONT -->
				<div class="flip-card-front">
					<img class="face" src="${data.imgSrc}" alt="${data.name} image">
					<img class="card-fg" src="./assests/${data.rarity}_front.png" alt="foreground layer">
					<p class="front-name">${data.name}</p>
				</div>

				<!-- BACK -->
				<div class="flip-card-back">
					<img class="back-bg" src="./assests/${data.rarity}_back.png" alt="background">
					<p class="back-name">${data.name}</p>
					<p class="bio">${data.bio}</p>
					<p class="course">${data.course}</p>
				</div>
			</div>
		</div>
		`;
	}
}

customElements.define('frog-card', FrogCard);
