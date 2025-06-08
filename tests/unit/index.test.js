/* eslint-disable no-undef */
//Tests functiosn in index.js
import { update_points, fetch_user_info, save_to_local, UserInfo, fetch_unlocked_cards, fetch_data } from "../../index.js";
import { jest } from '@jest/globals';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([1, 2, 3, 4, 5]),
    })
  );
});

test("Update Points ", () => {
    localStorage.clear()
    const user_info = new UserInfo(0, 0);
    save_to_local(user_info, "user_data")
    expect(fetch_user_info().points).toBe(0);
    //Expected initial points is 0
    expect(update_points(0)).toBe(true);
    expect(fetch_user_info().points).toBe(0);
    //Update points by 100
    expect(update_points(100)).toBe(true);
    expect(fetch_user_info().points).toBe(100);
    //Update points by -50. Should subtract
    expect(update_points(-50)).toBe(true);
    expect(fetch_user_info().points).toBe(50);
    //Update points by -100. Should not subtract as user has only 50 points
    expect(update_points(-100)).toBe(false);
    expect(fetch_user_info().points).toBe(50);
})


test('resolves parsed JSON on success', async () => {
    const path = "./testing.json"
    const data = await fetch_data(path);
    const mockData = [1,2,3,4,5]
    expect(data).toBeDefined();
    expect(data).toEqual(mockData);
    
});

test("Fetch Unlocked Cards", () => {
    localStorage.clear()
    //When no data is stored, it should return an array with the default card. 
    const card_1 = {
        "name": "Thomas A. Powell",
        "bio": "Long time internet and web focused software engineer. Collector of retro games, Star Wars nerd, soccer fan, occasional joker. Fun Fact: Early Internet Semi-Famous and met Hollywood Stars. Course Takeaway: Guiding students in becoming more well rounded software engineers equipped with the technical skills as well as soft skills.",
        "course": "CSE 110",
        "rarity": "common",
        "quantity": 1
    }
    const card_2 = {
        "name": "Jane Doe",
        "bio": "A passionate software developer with a love for coding and teaching.",
        "course": "CSE 120",
        "rarity": "rare",
        "quantity": 1
    }
    const card_data = fetch_unlocked_cards()
    expect(card_data.length).toBe(0);

    //When data is stored, it should return the data stored
    save_to_local([card_1], "card_data");
    const card_data_1 = fetch_unlocked_cards();
    expect(card_data_1.length).toBe(1);
    expect(card_data_1[0].name).toBe(card_1.name);
    expect(card_data_1[0].bio).toBe(card_1.bio);
    expect(card_data_1[0].course).toBe(card_1.course);
    expect(card_data_1[0].rarity).toBe(card_1.rarity);

    //When data is stored, it should return the data stored
    save_to_local([card_2], "card_data");
    const card_data_2 = fetch_unlocked_cards();
    expect(card_data_2.length).toBe(2);
    expect(card_data_2[1].name).toBe(card_2.name);
    expect(card_data_2[1].bio).toBe(card_2.bio);
    expect(card_data_2[1].course).toBe(card_2.course);
    expect(card_data_2[1].rarity).toBe(card_2.rarity);

})

test("Fetch User Info", () => {
    localStorage.clear()
    //If no user info is stored, it should return undefined
    console.log(fetch_user_info());
    expect(fetch_user_info()).toBeUndefined();
    //If user info is stored, it should return the user info
    const user_info = new UserInfo(100);
    save_to_local(user_info, "user_data");
    const fetched_user_info = fetch_user_info();
    expect(fetched_user_info).toBeDefined();
    expect(fetched_user_info.points).toBe(100);
    expect(fetched_user_info.life_time_points).toBe(100);
    expect(fetched_user_info).toEqual(user_info);
})