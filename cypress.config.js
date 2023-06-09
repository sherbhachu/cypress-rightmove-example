const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    watchForFileChanges: false,
    retries: {runMode: 2},
    e2e: {
      baseUrl: 'http://www.rightmove.co.uk',
    },
  },
});
