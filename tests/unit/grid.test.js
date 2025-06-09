/* eslint-disable no-undef */
import {init, createCard, setupCraftingUI, updateCardGrid} from "../../scripts/grid.js"

const card_data = [{"name":"John D","rarity":"rare","quantity":1,"bio":"Got a Doctorate to UCLA, with 40+ years experience. Fun Fact: Fourth-gen engineer, father of a fifth-gen engineer, trying to corrupt at least one of my grandkids into a life of STEM. Course Takeaway: seek out opportunities in life, take advantage of the good ones when they come along","course":"CSE 140"},{"name":"Aohn A","rarity":"rare","quantity":10,"bio":"Got a Doctorate to UCLA, with 40+ years experience. Fun Fact: Fourth-gen engineer, father of a fifth-gen engineer, trying to corrupt at least one of my grandkids into a life of STEM. Course Takeaway: seek out opportunities in life, take advantage of the good ones when they come along","course":"CSE 140"}]

describe('Grid Function Tests', () => {
     beforeEach(async () => {
        // fresh DOM for each test
        document.body.innerHTML = `
    <h1 id="collectiontitle">Your Collection</h1>
    <p id="total-cards" class="total-cards">Total Filtered Cards: 0</p>
    <div class="search-wrapper">
        <input id="search-input" type="text" placeholder="Search by name..." />
        <select id="sort-select" style="margin-left: 10px; font-size: 1rem;">
            <option value="default">Sort: Default</option>
            <option value="first-name-az">Sort: First Name (A → Z)</option>
            <option value="first-name-za">Sort: First Name (Z → A)</option>
            <option value="last-name-az">Sort: Last Name (A → Z)</option>
            <option value="last-name-za">Sort: Last Name (Z → A)</option>
            <option value="rarity-asc">Sort: Rarity Low → High</option>
            <option value="rarity-desc">Sort: Rarity High → Low</option>
            <option value="quantity-asc">Sort: Quantity Low → High</option>
            <option value="quantity-desc">Sort: Quantity High → Low</option>
        </select>
    </div>
    <div class="grid-container" id="card-grid">
    </div>
    <script type="module" src="./scripts/grid.js"></script>
    <div id="craft-popup" class="hidden">
    You crafted <span id="crafted-amount"></span> new card(s)!
    </div>
    <!-- Modal -->
    <div id="card-modal" class="modal hidden">
        <div class="modal-content">
            <span id="modal-close" class="close-button">&times;</span>
            <h2 id="card-title" class="card-title"></h2>
            <div id="crafting-ui" class="crafting-ui hidden">
                <label for="craft-slider">Merge multiple cards into one of higher rarity</label>
                <input type="range" id="craft-slider" min="1" value="1" step="1" />
                <div id="craft-summary"></div>
                <button id="craft-button">Craft</button>
            </div>
        </div>
    </div>
            `;
        //Set initial user data
        localStorage.setItem("user_data", JSON.stringify({ points: 0 }));
        localStorage.setItem("card_data", JSON.stringify(card_data));
        
      });

    it('Render Grid and ensure card shows with one card then click a card',async () => {
        await init()
        const totalCards = document.getElementById("total-cards");
        const cardGrid = document.getElementById("card-grid");
        const noCardsMessage = document.getElementById("no-cards-message");
        expect(totalCards).not.toBeNull();
        expect(cardGrid).not.toBeNull();
        expect(noCardsMessage).not.toBeNull();
        expect(noCardsMessage.classList.contains("hidden")).toBe(true);
        const total_cards = totalCards.textContent;
        console.log(total_cards, "total_cards");
        expect(total_cards).toMatch(/Total Filtered Cards: 1/);

        //after, click a card
        const card_thumbnail = document.querySelectorAll('card-thumbnail');
        expect(card_thumbnail).not.toBeNull();
        //test for 1 craftable
        card_thumbnail[0].dispatchEvent(
        new CustomEvent('card-clicked', {
            detail: card_data[0],
            bubbles: true,      // so ancestors hear it too
            composed: true,   
        }),
        );
         const modal = document.getElementById("card-modal");
        expect(modal).not.toBeNull();
        expect(modal.classList.contains("hidden")).toBe(false);

        //test fpr craftable
        card_thumbnail[1].dispatchEvent(
        new CustomEvent('card-clicked', {
            detail: card_data[0],
            bubbles: true,      // so ancestors hear it too
            composed: true,   
        }),
        );
        const modal2 = document.getElementById("card-modal");
        expect(modal2).not.toBeNull();
        expect(modal2.classList.contains("hidden")).toBe(false);
    })

    it("test createCard Function", async () => {
        const card_data_test = {...card_data[0], name:"Bob"}
        createCard(card_data_test);
        //Should return, since there was now "card-display"
        
        const frogs = document.querySelectorAll('frog-card');
        expect(frogs.length).toBe(0);

        document.body.innerHTML += `<card-display></card-display>`;
         createCard(card_data_test);
         const frogs2 = document.querySelectorAll('frog-card');
         expect(frogs2.length).toBe(1);
        // Optional sanity-checks:
        expect(frogs2[0].data.name).toBe(card_data_test.name);   // the original grid card
    
    })
    it ("Test CraftButton", async () => {
        setupCraftingUI(card_data[1])
        const craftButton = document.getElementById("craft-button");
        expect(craftButton).not.toBeNull();
        const craftSlider = document.getElementById("craft-slider");
        expect(craftSlider).not.toBeNull();
        expect(craftSlider.disabled).toBe(false);
        //change slider value
        craftSlider.value = '1';
        craftSlider.dispatchEvent(new Event('input', { bubbles: true }));       
        craftButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        //wait for .5 sec for pop up to come
        await new Promise(resolve => setTimeout(resolve, 500));
        const craftPopup = document.getElementById("craft-popup");
        expect(craftPopup).not.toBeNull();
        await new Promise(resolve => setTimeout(resolve, 3100));
        expect(craftPopup.classList.contains("hidden")).toBe(true);
        
    })
    it ("Update card with no data", () => {
        updateCardGrid([])
        const cardGrid = document.getElementById("card-grid");
        const noCardsMessage = document.getElementById("no-cards-message");
        expect(cardGrid).not.toBeNull();
        expect(noCardsMessage).not.toBeNull();
        expect(noCardsMessage.classList.contains("hidden")).toBe(false);
    })

    it("Test for non-craftable cards",  () => {
        setupCraftingUI({...card_data[0], rarity: "legendary"})
        const craftButton = document.getElementById("crafting-ui");
        expect(craftButton).not.toBeNull();
        expect(craftButton.classList.contains("hidden")).toBe(true);
    })

    it("missing required elements", () => {
        document.body.innerHTML = `<div></div>`;
        expect(() => setupCraftingUI(card_data[0])).toThrow("Elements not foun");
    })

    it("Select every sort option and check if it works", async () => {
        await init();
        const sortSelect = document.getElementById("sort-select");
        expect(sortSelect).not.toBeNull();
        const cardGrid = document.getElementById("card-grid");
        expect(cardGrid).not.toBeNull();
        
        // Sort by first name A-Z
        sortSelect.value = "first-name-az";
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
        const firstCard = cardGrid.querySelector('card-thumbnail');
        expect(firstCard).not.toBeNull();
        expect(firstCard.data.name).toBe("Aohn A"); // Assuming Aohn comes before John alphabetically
        // Sort by first name Z-A
        sortSelect.value = "first-name-za";
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
        const lastCard = cardGrid.querySelector('card-thumbnail:last-child');
        expect(lastCard).not.toBeNull();
        expect(lastCard.data.name).toBe("Aohn A"); // Assuming John comes after Aohn alphabetically
        
        // Sort by last name A-Z
        sortSelect.value = "last-name-az";
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
        const firstLastCard = cardGrid.querySelector('card-thumbnail');
        expect(firstLastCard).not.toBeNull();
        expect(firstLastCard.data.name).toBe("Aohn A"); // Assuming Aohn comes before John by last name
        // Sort by last name Z-A
        sortSelect.value = "last-name-za";
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
        const lastLastCard = cardGrid.querySelector('card-thumbnail:last-child');
        expect(lastLastCard).not.toBeNull();
        
        // Sort by rarity ascending
        sortSelect.value = "rarity-asc";
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
        const sortedCardsAsc = Array.from(cardGrid.querySelectorAll('card-thumbnail'));
        expect(sortedCardsAsc.length).toBeGreaterThan(0);
        expect(sortedCardsAsc[0].data.rarity).toBe("rare"); // Assuming "Aohn A" is the first card in ascending order
        
        // Sort by rarity descending
        sortSelect.value = "rarity-desc";
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
        const sortedCardsDesc = Array.from(cardGrid.querySelectorAll('card-thumbnail'));
        expect(sortedCardsDesc.length).toBeGreaterThan(0);
        expect(sortedCardsDesc[0].data.rarity).toBe("rare"); // Assuming "John D" is the first card in descending order
        
        // Sort by quantity ascending
        sortSelect.value = "quantity-asc";
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
        const sortedQuantityAsc = Array.from(cardGrid.querySelectorAll('card-thumbnail'));
        expect(sortedQuantityAsc.length).toBeGreaterThan(0);
        expect(sortedQuantityAsc[0].data.quantity).toBe(1); // Assuming "John D" has quantity 1
        // Sort by quantity descending
        sortSelect.value = "quantity-desc";
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
        const sortedQuantityDesc = Array.from(cardGrid.querySelectorAll('card-thumbnail'));
        expect(sortedQuantityDesc.length).toBeGreaterThan(0);
        expect(sortedQuantityDesc[0].data.quantity).toBe(10); // Assuming "Aohn A" has quantity 10
    })
    
})
