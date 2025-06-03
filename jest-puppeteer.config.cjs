module.exports = {
    launch: {
      headless: false,
      slowMo: 0,
      //Stuff for github actions
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',               
        '--disable-dev-shm-usage'       
      ]
    },
    server: {
      command: 'npx serve . -l 3000', 
      port: 3000,
      launchTimeout: 10000,          
      debug: false
    }
  }