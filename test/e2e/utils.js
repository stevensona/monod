module.exports = {
  isValidURL(value) {
    return /^https?:\/\/.+\/[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}/.test(value);
  },

  isFirefoxWithMarionette(browser) {
    return !!browser.capabilities.marionette;
  },

  isEdge(browser) {
    return 'microsoftedge' === browser.options.desiredCapabilities.browserName;
  },

  isSafari(browser) {
    return 'safari' === browser.options.desiredCapabilities.browserName;
  },
};
