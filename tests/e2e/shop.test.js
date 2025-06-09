
/* eslint-disable no-undef */
describe.skip('Test Shop Functionality', () => {
  beforeAll(async () => {
        await page.evaluateOnNewDocument(() => {
      localStorage.setItem('user_data', JSON.stringify({ points: 100000 }));
      const card_data = localStorage.getItem("card_data");
      if (card_data) localStorage.removeItem("card_data");
    
    });
    const response = await page.goto('http://localhost:3000/shop', {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
    });

    if (!response || !response.ok()) {
        throw new Error(`Failed to load page: ${response?.status()} ${response?.statusText()}`);
    }
    else {
        console.log("Shop page loaded successfully");
        console.log("Current URL:", page.url());
        console.log("Page title:", await page.title());
    }



    
  });
  it("Buy 100 cards, ensure points subtracted correctly and user recieves a special edition", async () => {
    const pointsElem = await page.$("#points-display");
    if (!pointsElem) throw new Error("Points display not found");

    const initialText = await page.evaluate(el => el.textContent, pointsElem);
    const initialPoints = Number(initialText);
    const card_cost = 100;
    const buy_button = await page.$("#generate-card");
    const card_cointainer = await page.$("#card-container");
    let card_count = 0;
    let special_edition_found = false;
    for (let i = 0; i < 101; i++) {
        await buy_button.click();
        await card_cointainer.click()
        card_count++
        await page.waitForSelector('#result span', { visible: true });
        const resultSpan = await page.$('#result span');
        if (!resultSpan) throw new Error("Result span not found");
        const resultText = await page.evaluate(el => el.textContent, resultSpan);
        if (resultText.toLocaleLowerCase().includes("special")) {
            special_edition_found = true;
            console.log("Special edition card found!");
        }
    }
    const finalText = await page.evaluate(el => el.textContent, pointsElem);
    console.log("final_text", finalText);
    const finalPoints = Number(finalText);
    console.log("finalPoints", finalPoints);
    expect(finalPoints).toBe(initialPoints - (card_cost * (card_count)));
    const localData = await page.evaluate(() => {
    return localStorage.getItem("card_data");
    });
    if (!localData) throw new Error("No card data found in localStorage");
    const cards = JSON.parse(localData);
    const total = cards.reduce((sum, card) => sum + card.quantity, 0);

    expect(total).toBe(card_count);
    if (card_count > 100){
        expect(special_edition_found).toBe(true);
    }
    

  }, 100000);

});
