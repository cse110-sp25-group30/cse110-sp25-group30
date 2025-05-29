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
		`;
		this.shadow.appendChild(style);
	}

	initCover() {
		this.cover = document.createElement('div');
		this.cover.classList.add('cover');
		this.cover.innerHTML = `
			<img class="left" src="./assests/pack_left.png" alt="pack left">
			<img class="right" src="./assests/pack_right.png" alt="pack right">
		`;
		this.shadow.appendChild(this.cover);
	}

	addEventListeners() {
		const left = this.cover.querySelector('.left');
		const right = this.cover.querySelector('.right');

		const audio = new Audio('assests/sound-effects/rip-sound.mp3');

		this.cover.addEventListener('click', () => {
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