
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
        // TODO: Fill in the style tag, preferably using the CSS variables
		style.textContent = `
		<style>

	</style>
	`;
		// A5. TODO - Append the <style> and <card> elements to the Shadow DOM
		shadow.appendChild(style);
		shadow.appendChild(card);
	}

	/**
	 *
	 * @param {Object} data - The data to pass into the <recipe-card> must be of the
	 *                        following format:
	 *                        {
	 *                          "imgSrc": "string",
	 *                          "bio": "string",
     *                          "course": "string",
     *                          "name": "string",
	 *                        }
	 */
	set data(data) {
		// If nothing was passed in, return
		if (!data) return;

		const card = this.shadowRoot.querySelector('card');
        // TODO - Build the card template using the data passed in
        // codacy-disable-next-line security/detect-unsafe-innerhtml
        //This error doesn't matter since data is trusted
		card.innerHTML = `
            <img src="${data.imgSrc}" alt="${data.name} Image" style="width: 300px; height: 300px;">
            <h2>${data.name}</h2>
            <p>${data.bio}</p>
            <p>${data.course}</p>
         `
	}
}

customElements.define('frog-card', FrogCard);
