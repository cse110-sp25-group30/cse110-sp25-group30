module.exports = {
  //maxWorkers: 1,  
    projects: [
      {
        displayName: "unit",
        testMatch: ["<rootDir>/tests/unit/**/*.test.js"],
        testEnvironment: "jsdom",
      },
      {
        displayName: "puppeteer",
        testMatch: ["<rootDir>/tests/e2e/**/*.test.js"],
        preset: "jest-puppeteer",
      },
    ],
  };
  