export default class Controller {

  constructor(components, events) {
    this.store = components.store;
    this.events = events;

    this.events.on('action:init', this.onInit.bind(this));
    this.events.on('action:update-content', this.onUpdateContent.bind(this));
    this.events.on('action:update-template', this.onUpdateTemplate.bind(this));
    this.events.on('action:sync', this.onSync.bind(this));
  }

  on(events, callback) {
    const names = events.split(/\s*,\s*/);

    names.forEach(event => this.events.on(event, callback));
  }

  dispatch(name, data) {
    this.events.emit(name, data);
  }

  onInit({ id, secret }) {
    this.store.load(id, secret);
  }

  onUpdateContent(content) {
    this.store.updateContent(content);
  }

  onUpdateTemplate(template) {
    this.store.updateTemplate(template);
  }

  onSync() {
    this.store.sync();
  }
}
