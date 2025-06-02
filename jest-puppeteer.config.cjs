module.exports = {
    launch: {
      headless: false,
      slowMo: 25
    },
    server: {
      command: 'npx serve . -l 3000', // or `npm run start`
      port: 3000,
      launchTimeout: 10000,           // ms to wait for server to be ready
      debug: false
    }
  }