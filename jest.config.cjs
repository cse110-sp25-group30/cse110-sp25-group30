module.exports = {
  //maxWorkers: 1,  
    collectCoverage: true,
    collectCoverageFrom: [
      "<rootDir>/index.js",
      "<rootDir>/scripts/grid.js",
      "<rootDir>/scripts/shop.js",
      "<rootDir>/scripts/clicker.js",
    ],
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
  