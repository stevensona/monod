import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';

import reducer, * as actions from '../documents';
import Document from '../../Document';
import { LOCAL_PERSIST } from '../persistence';
import { NOTIFY } from '../notification';
import dbMock from './dbMock';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;


describe('modules/documents', () => {
  const middlewares = [thunk.withExtraArgument({ db: dbMock })];
  const mockStore = configureMockStore(middlewares);

  beforeEach(() => {
    dbMock.reset();
  });

  it('should return the initial state', () => {
    const state = reducer(undefined, {});

    expect(state).to.have.all.keys([
      'current',
      'loaded',
      'secret',
    ]);
  });

  it('should be able to load default state', () => {
    let state = reducer(undefined, { type: actions.LOAD_DEFAULT });

    expect(state.loaded).to.be.true;
  });

  it('should return a new document (with local modifications) when updating the template', () => {
    const template = 'letter';

    let state = reducer(undefined, '');

    const docBeforeUpdate = state.current;

    state = reducer(state, { type: actions.UPDATE_TEMPLATE, template });

    expect(state.current.get('template')).to.equal(template);
    expect(state.current !== docBeforeUpdate).to.be.true;
    expect(state.current.get('last_modified_locally')).to.not.be.null;
  });

  it('should return a new document (with local modifications) when updating the content', () => {
    const content = 'foo';

    let state = reducer(undefined, '');

    const docBeforeUpdate = state.current;

    state = reducer(state, { type: actions.UPDATE_CONTENT, content });

    expect(state.current.get('content')).to.equal(content);
    expect(state.current !== docBeforeUpdate).to.be.true;
    expect(state.current.get('last_modified_locally')).to.not.be.null;
  });

  it('should be able to load a default document', () => {
    const store = mockStore();

    const expectedActions = [
      { type: actions.LOAD_DEFAULT },
    ];

    store.dispatch(actions.loadDefault());

    expect(store.getActions()).to.eql(expectedActions);
  });

  it('should load a given document', () => {
    const store = mockStore();

    const doc = new Document();
    const secret = 'secret';

    const expectedActions = [
      { type: actions.LOAD_SUCCESS, document: doc, secret },
    ];


    store.dispatch(actions.loadSuccess(doc, secret));

    expect(store.getActions()).to.eql(expectedActions);
  });

  describe('updateCurrentDocument()', () => {
    it('should update the current document', () => {
      const doc1 = new Document({ uuid: '1234' });
      const doc2 = new Document({ uuid: '5678' });

      let state = reducer(undefined, {
        type: actions.LOAD_SUCCESS, document: doc1, secret: 'secret',
      });

      expect(state.current.get('uuid')).to.equal(doc1.get('uuid'));

      state = reducer(state, actions.updateCurrentDocument(doc2));

      expect(state.current.get('uuid')).to.equal(doc2.get('uuid'));
    });
  });

  describe('updateContent()', () => {
    it('should create a new document on update if new', () => {
      const store = mockStore({
        documents: {
          current: new Document(),
          secret: null, // that's because the secret is null that we think it is a new document
        },
      });

      store.dispatch(actions.updateContent('Hello'));

      const triggeredActions = store.getActions();

      expect(triggeredActions[0].type).to.equal(actions.LOAD_SUCCESS);
      expect(triggeredActions[0].document.get('content')).to.equal('Hello');
    });

    it('should update content of the current document and then call LOCAL_PERSIST', () => {
      const store = mockStore({
        documents: {
          current: new Document(),
          secret: 'secret',
        },
      });

      const content = 'Hello';

      const expectedActions = [
        { type: actions.UPDATE_CONTENT, content },
        { type: LOCAL_PERSIST },
      ];

      store.dispatch(actions.updateContent(content));

      expect(store.getActions()).to.eql(expectedActions);
    });
  });

  describe('updateTemplate()', () => {
    it('should only update template of the current document if new', () => {
      const store = mockStore({
        documents: {
          current: new Document(),
          secret: 'secret',
        },
      });

      const template = 'letter';

      const expectedActions = [
        { type: actions.UPDATE_TEMPLATE, template },
        { type: LOCAL_PERSIST },
      ];

      store.dispatch(actions.updateTemplate(template));

      expect(store.getActions()).to.eql(expectedActions);
    });


    it('should update template of the current document and then call LOCAL_PERSIST', () => {
      const store = mockStore({
        documents: {
          current: new Document(),
          secret: 'secret',
        },
      });

      const template = 'letter';

      const expectedActions = [
        { type: actions.UPDATE_TEMPLATE, template },
        { type: LOCAL_PERSIST },
      ];

      store.dispatch(actions.updateTemplate(template));

      expect(store.getActions()).to.eql(expectedActions);
    });
  });

  describe('notFound()', () => {
    it('should notify user and loads the default document', () => {
      const store = mockStore();

      store.dispatch(actions.notFound());

      const triggeredActions = store.getActions();
      expect(triggeredActions).to.have.length(2);

      expect(triggeredActions[0].type).to.equal(NOTIFY);
      expect(triggeredActions[0].level).to.equal('error');
      expect(triggeredActions[1].type).to.equal(actions.LOAD_DEFAULT);
    });
  });

  describe('decryptionFailed()', () => {
    it('should notify user and loads the default document', () => {
      const store = mockStore();

      store.dispatch(actions.decryptionFailed());

      const triggeredActions = store.getActions();
      expect(triggeredActions).to.have.length(2);

      expect(triggeredActions[0].type).to.equal(NOTIFY);
      expect(triggeredActions[0].level).to.equal('error');
      expect(triggeredActions[1].type).to.equal(actions.LOAD_DEFAULT);
    });
  });

  describe('serverUnreachable()', () => {
    it('should notify user and loads the default document', () => {
      const store = mockStore();

      store.dispatch(actions.serverUnreachable());

      const triggeredActions = store.getActions();
      expect(triggeredActions).to.have.length(2);

      expect(triggeredActions[0].type).to.equal(NOTIFY);
      expect(triggeredActions[0].level).to.equal('error');
      expect(triggeredActions[1].type).to.equal(actions.LOAD_DEFAULT);
    });
  });
});
