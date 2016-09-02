/* eslint prefer-arrow-callback: 0 */
const utils = require('../utils');

module.exports = {
  commands: [{
    chooseTemplate(template) {
      // Firefox 48 does not work well with select change, maybe an issue with
      // Marionette / GeckoDriver???
      if (utils.isFirefoxWithMarionette(this.api)) {
        this.api.execute(function willBeExecutedInBrowser(v) {
          const $select = document.getElementsByTagName('select')[0];

          $select.value = v;
          $select.dispatchEvent(new Event('change', { bubbles: true }));
        }, [template]);

        return this;
      }

      this.click(`#templateForm select option[value="${template}"]`);

      // force event change in Edge
      // cf. https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/6051346/
      if (utils.isEdge(this.api)) {
        this.api.execute(function willBeExecutedInBrowser() {
          document.getElementsByTagName('select')[0].dispatchEvent(
            new Event('change', { bubbles: true })
          );
        });
      }

      return this;
    },
    selectSlidedeckTemplate() {
      return this.chooseTemplate('slidedeck');
    },
    selectLetterTemplate() {
      return this.chooseTemplate('letter');
    },
    selectNoTemplate() {
      return this.chooseTemplate('');
    },
    write(content) {
      // there is a bug with Safari WebDriver, which makes impossible to send keys...
      if (utils.isSafari(this.api) || utils.isFirefoxWithMarionette(this.api)) {
        this.api
          .execute(function willBeExecutedInBrowser(v) {
            const cm = document.getElementsByClassName('CodeMirror')[0].CodeMirror;

            cm.setValue('');
            cm.replaceSelection(v);
          }, [content])
          .pause(500);
      } else {
        this.api
          .execute(function willBeExecutedInBrowser() {
            // empty editor content
            document.getElementsByClassName('CodeMirror')[0].CodeMirror.setValue('');
          })
          .click('.CodeMirror')
          .keys(content)
          .pause(500);
      }

      return this;
    },
  }],
  elements: {
    // layout
    markdownPanel: '.markdown',
    previewPanel: '.preview',

    // high-level components
    editor: '.CodeMirror',
    preview: '.rendered',
    previewSlides: '.preview .rendered .reveal',
    previewLetter: '.preview .rendered article',
  },
};
