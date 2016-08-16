import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import fauxJax from 'faux-jax';

import Document from '../../Document';
import * as app from '../monod';
import * as actions from '../persistence';
import * as documents from '../documents';
import dbMock from './dbMock';

// see: https://github.com/mochajs/mocha/issues/1847
const { beforeEach, afterEach, describe, it } = global;


describe('modules/persistence', () => {
  const middlewares = [thunk.withExtraArgument({ db: dbMock })];
  const mockStore = configureMockStore(middlewares);

  const secret = 'secret';

  beforeEach(() => {
    dbMock.reset();
  });

  describe('localPersist()', () => {
    it('should persist the current document locally', () => {
      const store = mockStore({
        documents: {
          current: new Document(),
          secret,
        },
      });

      const expectedActions = [
        { type: actions.LOCAL_PERSIST },
        { type: actions.LOCAL_PERSIST_SUCCESS },
      ];

      return store
        .dispatch(actions.localPersist())
        .then(() => {
          expect(store.getActions()).to.eql(expectedActions);

          expect(dbMock.nbSetItemCall).to.equal(1);
        });
    });
  });

  describe('serverPersist()', () => {
    beforeEach(() => {
      fauxJax.install();
    });

    afterEach(() => {
      fauxJax.restore();
    });

    it('should persist the current document locally', () => {
      const doc = new Document();
      const store = mockStore({
        documents: {
          current: doc,
          secret,
        },
      });

      const expectedActions = [
        { type: actions.SERVER_PERSIST },
        { type: app.IS_ONLINE },
        { type: documents.UPDATE_CURRENT_DOCUMENT },
        { type: actions.SERVER_PERSIST_SUCCESS },
      ];

      fauxJax.on('request', (request) => {
        request.respond(
          200, { 'Content-Type': 'application/json' },
          JSON.stringify({
            uuid: doc.get('uuid'),
            content: doc.get('content'),
            last_modified: Date.now(),
            template: '',
          })
        );
      });

      return store
        .dispatch(actions.serverPersist())
        .then(() => {
          const triggeredActions = store.getActions();

          expect(triggeredActions).to.have.length(expectedActions.length);
          expectedActions.forEach((action, index) => {
            expect(triggeredActions[index].type).to.equal(action.type);
          });
        });
    });

    it('should deal with non 2xx-responses', () => {
      const doc = new Document();
      const store = mockStore({
        documents: {
          current: doc,
          secret,
        },
      });

      const expectedActions = [
        { type: actions.SERVER_PERSIST },
        { type: actions.SERVER_PERSIST_ERROR },
      ];

      fauxJax.on('request', (request) => {
        request.respond(
          404, { 'Content-Type': 'application/json' }
        );
      });

      return store
        .dispatch(actions.serverPersist())
        .catch(() => {
          const triggeredActions = store.getActions();

          expect(triggeredActions).to.have.length(expectedActions.length);
          expectedActions.forEach((action, index) => {
            expect(triggeredActions[index].type).to.equal(action.type);
          });
        });
    });
  });

  it('serverPersist() should deal with offline mode', () => {
    const doc = new Document();
    const store = mockStore({
      documents: {
        current: doc,
        secret,
      },
    });

    const expectedActions = [
      { type: actions.SERVER_PERSIST },
      { type: app.IS_OFFLINE },
      { type: actions.SERVER_PERSIST_ERROR },
    ];

    return store
      .dispatch(actions.serverPersist())
      .catch(() => {
        const triggeredActions = store.getActions();

        expect(triggeredActions).to.have.length(expectedActions.length);
        expectedActions.forEach((action, index) => {
          expect(triggeredActions[index].type).to.equal(action.type);
        });
      });
  });
});
