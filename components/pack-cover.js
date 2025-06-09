/*
This is the JavaScript file for the pack-cover component.
*/

class PackCover extends HTMLElement {
	constructor() {
		super();

		this.shadow = this.attachShadow({ mode: 'open' });

		this.initStyles();
		this.initCover();
		this.addEventListeners();
	}

	initStyles() {
		const style = document.createElement('style');
		style.textContent = `
		.cover {
			width: 420px;
			height: 420px;
			position: relative;
			backface-visibility: hidden;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
            cursor: pointer;
            transition: transform 0.3s ease;
		}

        .cover:hover {
            transform: scale(1.1);
        }

		.left, .right {
			width: 100%;
			height: 100%;
			object-fit: cover;
			position: absolute;
		}

        .left {
            z-index: 10;
        }

        .right {
            z-index: 11;
        }

		.placeholder {
			width: 100%;
			height: 100%;
			position: absolute;
			background-color: white;
			z-index: 5;
			clip-path: polygon(50% 5%, 99% 39%, 80% 97%, 20% 97%, 1% 39%);
		}

		@keyframes dramaticSlideLeft {
		0%   { transform: translateX(0); }
		20%  { transform: translateX(-1.5%); }
		40%  { transform: translateX(-1%); }
		60%  { transform: translateX(-1%); opacity: 1; }
		80% { transform: translateX(-65%); opacity: 0.8; }
		100% { transform: translateX(-70%); opacity: 0; }
		}

		@keyframes dramaticSlideRight {
		0%   { transform: translateX(0); }
		20%  { transform: translateX(1.5%); }
		40%  { transform: translateX(1%); }
		60%  { transform: translateX(1%); opacity: 1; }
		80% { transform: translateX(65%); opacity: 0.8; }
		100% { transform: translateX(70%); opacity: 0; }
		}

		.left.slide-out {
		animation: dramaticSlideLeft 0.9s ease-in-out forwards;
		}

		.right.slide-out {
		animation: dramaticSlideRight 0.9s ease-in-out forwards;
		}

        @media screen and (max-width: 480px) {
            .cover {
                transform: scale(0.85);
                transform-origin: center center;
            }

            .cover:hover {
                transform: scale(0.9);
            }
        }
		`;
		this.shadow.appendChild(style);
	}

	initCover() {
		this.cover = document.createElement('cover');
		this.cover.innerHTML = `
			<div class="cover">
				<!-- Pentagon placeholder -->
				<div class="placeholder"></div>

				<!-- Actual images -->
				<img class="left" src="./assets/misc-images/pack_left.webp" alt="pack left">
				<img class="right" src="./assets/misc-images/pack_right.webp" alt="pack right">
			</div>
		`;

		this.shadow.appendChild(this.cover);

		const left = this.cover.querySelector('.left');
		const right = this.cover.querySelector('.right');
		const placeholder = this.cover.querySelector('.placeholder');

		const checkLoaded = () => {
			if (left.complete && right.complete) {
				placeholder.style.display = 'none';
			}
		};

		// Add listeners
		left.addEventListener('load', checkLoaded);
		right.addEventListener('load', checkLoaded);
	}

	addEventListeners() {
		const left = this.cover.querySelector('.left');
		const right = this.cover.querySelector('.right');

		const audio = new Audio('assets/sound-effects/rip-sound.mp3');

		let clicked = false;

		this.cover.addEventListener('click', () => {
			if (clicked) return;
			clicked = true;
			
			audio.currentTime = 0.17; // Reset if replaying
    		audio.play();
			left.classList.add('slide-out');
			right.classList.add('slide-out');

			setTimeout(() => {
				this.dispatchEvent(new CustomEvent('cover-opened', { bubbles: true }));
			}, 560); // Show content a bit before cover is gone

			setTimeout(() => {
				this.remove(); // remove the cover from the DOM
			}, 900); // duration should match CSS transition
		});
	}

	click() {
		this.cover.click();
	}
}

customElements.define('pack-cover', PackCover);