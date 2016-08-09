/* eslint new-cap: 0 */
import { Record } from 'immutable';
import uuid from 'uuid';
import Config from './Config';

export default class Document extends Record({
  uuid: uuid.v4(),
  content: Config.DEFAULT_CONTENT,
  last_modified: null, // defined by the server
  last_modified_locally: null,
  template: ''
}) {

  hasDefaultContent() {
    return Config.DEFAULT_CONTENT === this.content;
  }

  hasNeverBeenSync() {
    return null === this.last_modified;
  }

  hasNoLocalChanges() {
    return null === this.last_modified_locally;
  }

  isNew() {
    return this.hasDefaultContent() && this.hasNeverBeenSync()
      && this.hasNoLocalChanges() && '' === this.template;
  }
}
