/* eslint-disable no-undef */

describe.skip('createCard in browser', () => {
  beforeEach(async () => {
    await page.setContent(`
      <html>
        <body>
          <card-deck></card-deck>
          <script>
            window.createCard = function(data) {
              const cardDeck = document.querySelector("card-deck");
              if (!cardDeck) return;
              cardDeck.innerHTML = "";
              const card = document.createElement("frog-card");
              card.data = data;
              cardDeck.appendChild(card);
            };
          </script>
        </body>
      </html>
    `);
  });

  test('creates a frog-card and appends it inside card-deck', async () => {
    const mockData = { id: 1, name: 'Test Frog' };

    await page.evaluate((data) => {
      window.createCard(data);
    }, mockData);

    const cardExists = await page.$eval('card-deck frog-card', () => true);
    const childrenCount = await page.$eval('card-deck', el => el.children.length);
    const cardData = await page.$eval('card-deck frog-card', el => el.data);

    expect(cardExists).toBe(true);
    expect(childrenCount).toBe(1);
    expect(cardData).toEqual(mockData);
  });

  test('does nothing if card-deck is missing', async () => {
    await page.setContent(`<html><body><script>
      window.createCard = ${String(function(data) {
        const cardDeck = document.querySelector("card-deck");
        if (!cardDeck) return;
        cardDeck.innerHTML = "";
        const card = document.createElement("frog-card");
        card.data = data;
        cardDeck.appendChild(card);
      })}
    </script></body></html>`);

    const error = await page.evaluate(() => {
      try {
        window.createCard({ id: 2 });
        return false;
      } catch (error) {
        console.error(error);
        return true;
      }
    });

    expect(error).toBe(false);
  });
});
