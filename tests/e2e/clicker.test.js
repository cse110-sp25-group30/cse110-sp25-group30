//After menu is done, add ability to navigate around from home page than verify
/* eslint-disable no-undef */

describe.skip('Test Clicker Functionality', () => {
  let startingPts = 0;
  beforeAll(async () => {
    await page.evaluateOnNewDocument(() => {
      const localItem = localStorage.getItem("user_data")
      if (!localItem ){
        console.log("No user data found, initializing with 0 points");
      localStorage.setItem('user_data', JSON.stringify({ points: 0 }));
    }
    });

    await page.goto('http://localhost:3000/clicker');
  });
  it("Click 100 times and verify points increased", async () => {
    const pointsElem = await page.$("#points_display");
    if (!pointsElem) throw new Error("Points display not found");

    const initialText = await page.evaluate(el => el.textContent, pointsElem);
    const initialPoints = Number(initialText.split(" ")[1]);
    startingPts = initialPoints;
    const clickerElem = await page.$("#clicker-comp");
    await page.evaluate(() => {
      const popup = document.querySelector('.bonus-popup');
     if (popup) popup.remove(); // or popup.style.display = 'none';
});
    if (!clickerElem) throw new Error("Clicker element not found");

    for (let i = 0; i < 100; i++) {
      await clickerElem.click();
    }

    const finalText = await page.evaluate(el => el.textContent, pointsElem);
    console.log("final_text",finalText)
    const finalPoints = Number(finalText.split(" ")[1]);
    console.log("finalPoints",finalPoints)
    console.log("initialPoints + 100",initialPoints + 100)
    expect(finalPoints).toBe(initialPoints + 100);

  }, 30000);
it("Ensure points remain on navigation and reload", async()=>{
    await page.reload();
    await page.goto('http://localhost:3000/shop');
    const pointsElem = await page.$("#points-display")
    const pointsNumber = Number(await page.evaluate(el => el.textContent, pointsElem))
    console.log("pointsNumber", pointsNumber)
    expect(pointsNumber).toBe(startingPts + 100)
  })
});
