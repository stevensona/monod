/* eslint no-unused-expressions: 0 */
const sauce = require('../sauce');
const utils = require('../utils');


const endpoint = 'http://localhost:3000';

module.exports = {
  before: browser => {
    browser
      .url(endpoint)
      .waitForElementVisible('body');
  },
  'should load the preview': browser => {
    const monod = browser.page.monod();

    monod.expect.element('@preview').to.be.visible;
  },
  'should switch between templates': browser => {
    const monod = browser.page.monod();

    monod.expect.element('@previewSlides').to.not.be.present;

    monod.selectSlidedeckTemplate();
    monod.expect.element('@previewSlides').to.be.present;

    monod.selectLetterTemplate();
    monod.expect.element('@previewSlides').to.not.be.present;
    monod.expect.element('@previewLetter').to.be.present;

    monod.selectNoTemplate();
    monod.expect.element('@previewLetter').to.not.be.present;
  },
  'should create a new document when starting edition': browser => {
    const monod = browser.page.monod();

    monod.write('Hello, World!');
    monod.expect.element('@preview').to.contain.text('Hello, World!');

    browser.url(function ensureUrlHasChanged(result) {
      this.assert.ok(utils.isValidURL(result.value), 'The URL has changed');
    });
  },
  after: browser => browser.end(),
  tearDown: sauce,
};
