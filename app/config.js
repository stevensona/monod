/* eslint max-len: 0 */
export default {
  // localForage settings
  APP_NAME: 'monod',
  DOCUMENTS_STORE: 'documents',

  // CodeMirror
  CODE_MIRROR_MODE: 'gfm',
  CODE_MIRROR_THEME: 'monod',

  // in app/components/Sync/
  SYNC_COUNTER_DURATION: 5, // seconds
  SYNC_COUNTER_THRESHOLD: 600, // seconds

  SYNC_ONLINE_MESSAGE: 'Connected and synchronized!',
  SYNC_OFFLINE_MESSAGE: 'No Internet connection or server is unreachable',

  // in app/modules/documents.js
  UPDATE_CONTENT_DEBOUNCE_TIME: 100, // milliseconds

  // in app/modules/persistence.js
  LOCAL_PERSIST_DEBOUNCE_TIME: 500, // milliseconds

  // in app/modules/sync.js
  DOCUMENT_UPDATED_MESSAGE: [
    'We have updated the document you are viewing to the latest revision.',
    'Happy reading/working!',
  ].join(' '),

  // in app/modules/documents.js
  NOT_FOUND_MESSAGE: [
    'We could not find the document you were trying to load',
    'so we have redirected you to a new document.',
  ].join(' '),

  // in app/modules/documents.js
  DECRYPTION_FAILED_MESSAGE: [
    'We were unable to decrypt the document. Either the secret has not',
    'been supplied or it is invalid.',
    'We have redirected you to a new document.',
  ].join(' '),

  // in app/modules/documents.js
  SERVER_UNREACHABLE_MESSAGE: [
    'We could not load the document you are requesting because we did not',
    'find it locally and the server is currently unreachable.',
    'We have redirected you to a new document.',
  ].join(' '),

  // in app/modules/documents.js
  READONLY_MESSAGE: [
    'Unfortunately, the document you are viewing cannot be edited. We have',
    'reverted your changes.',
  ].join(' '),

  // in app/Document.js
  DEFAULT_CONTENT: [
    '---',
    'hello: world! # YAML Front Matter (for templates)',
    '---',
    '',
    'Introducing Monod',
    '=================',
    '',
    '> **TL;DR** Monod is an [Open Source](https://github.com/TailorDev/monod) React-based Markdown editor. You can use it any time (offline mode), share documents with anyone (encrypted), and render your content with a set of templates. This editor is brought to you by the good folks at [TailorDev](https://twitter.com/_TailorDev), as part of [a **Le lab** experiment (#2)](https://tailordev.fr/blog/2016/04/15/le-lab-2-offline-first-document-sharing-templates-monod-is-back/).',
    '',
    '### :fa-info-circle: Quick start',
    '',
    '* :pencil: As soon as you modify this document you will get a new unique document that belongs to you, so feel free to write anything you want. We support [CommonMark](http://commonmark.org/), and you can write `code`, FontAwesome icons :fa-flag:, and, obviously, Emoji too! :clap:;',
    '* :family: Let your friends review your content by **sharing** the **full URL** with them;',
    '* :page_facing_up: You can export your document as a **PDF** using the in-browser print feature (`Cmd + P` or `Ctrl + P` on Windows);',
    '* :airplane: Monod is offline-first, meaning you can use it all the time. When you go back online, it automatically synchronizes your work;',
    '* :lock: Everything is **encrypted in the browser** (_i.e._ on your laptop), the server does not have access or any way to decrypt your documents;',
    '* :warning: There is no document management system: be sure to bookmark or write down the full URLs of your documents somewhere.',
    '',
    'Read more about how and why we built Monod at: https://tailordev.fr/blog/.',
    '',
    '---',
    '*[Let us know your thoughts](mailto:hello@tailordev.fr?subject=About%20Monod). We would :heart: to hear from you!*',
  ].join('\n'),
};
