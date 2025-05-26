/*
This is the JavaScript file for the pack-cover component.
*/

class PackCover extends HTMLElement {
	constructor() {
		super();

		const shadow = this.attachShadow({ mode: 'open' });

		const cover = document.createElement('cover');
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

		cover.innerHTML = `
        <div class="cover">
            <img class="left" src="./assests/pack_left.png" alt="pack left">
            <img class="right" src="./assests/pack_right.png" alt="pack right">
        </div>
        `;

		shadow.appendChild(style);
		shadow.appendChild(cover);

		const left = cover.querySelector('.left');
		const right = cover.querySelector('.right');

		cover.addEventListener('click', () => {
			left.classList.add('slide-out');
			right.classList.add('slide-out');

			setTimeout(() => {
				this.remove(); // remove the cover from the DOM
				this.dispatchEvent(new CustomEvent('cover-opened', { bubbles: true }));
			}, 900); // duration should match CSS transition
		});
	}
}

customElements.define('pack-cover', PackCover);