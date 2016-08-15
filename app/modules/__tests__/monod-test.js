import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import fauxJax from 'faux-jax';

import { encrypt } from '../../utils';
import reducer, * as actions from '../monod';
import { NOTIFY } from '../notification';
import * as documents from '../documents';
import dbMock from './dbMock';

// see: https://github.com/mochajs/mocha/issues/1847
const { beforeEach, afterEach, describe, it } = global;


describe('modules/monod', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const secret = 'secret';

  beforeEach(() => {
    dbMock.reset();
  });

  it('should return the initial state', () => {
    const state = reducer(undefined, {});

    expect(state).to.have.all.keys([
      'offline',
    ]);
  });

  it('can flag the app as online', () => {
    const state = reducer(undefined, actions.isOnline());

    expect(state.offline).to.be.false;
  });

  describe('load()', () => {
    it('should dispatch documents.LOAD_DEFAULT when no document id supplied', () => {
      const store = mockStore();

      const expectedActions = [
        { type: documents.LOAD_DEFAULT },
      ];

      store.dispatch(actions.load());

      expect(store.getActions()).to.eql(expectedActions);
    });

    it('should look into the local storage first', () => {
      const store = mockStore();

      const id = '123';
      const content = 'foo';

      dbMock.addDocument(id, encrypt(content, secret));

      return store
        .dispatch(actions.load(id, secret, dbMock))
        .then(() => {
          const triggeredActions = store.getActions();

          expect(triggeredActions).to.have.length(1);
          expect(triggeredActions[0].type).to.equal(documents.LOAD_SUCCESS);
          expect(triggeredActions[0].document.get('uuid')).to.equal(id);
          expect(triggeredActions[0].document.get('content')).to.equal(content);
        });
    });

    it('should notify user when decryption failed', () => {
      const store = mockStore();

      const id = '123';
      const content = 'foo';

      dbMock.addDocument(id, encrypt(content, secret));

      return store
        .dispatch(actions.load(id, 'bad-secret', dbMock)) // decryption will fail
        .then(() => {
          const triggeredActions = store.getActions();

          expect(triggeredActions).to.have.length(2);
          expect(triggeredActions[0].type).to.equal(NOTIFY);
          expect(triggeredActions[1].type).to.equal(documents.LOAD_DEFAULT);

          expect(dbMock.nbGetItemCall).to.equal(1);
        });
    });

    describe('(API call)', () => {
      beforeEach(() => {
        fauxJax.install();
      });

      afterEach(() => {
        fauxJax.restore();
      });

      it('should fetch the server when not found locally', () => {
        const id = '456';
        const content = 'hello';
        const encrypted = encrypt(content, secret);

        fauxJax.on('request', (request) => {
          request.respond(
            200, { 'Content-Type': 'application/json' },
            JSON.stringify({
              uuid: id,
              content: encrypted,
              last_modified: Date.now(),
            })
          );
        });

        const store = mockStore();

        return store
          .dispatch(actions.load(id, secret, dbMock))
          .then(() => {
            const triggeredActions = store.getActions();

            expect(triggeredActions).to.have.length(2);
            expect(triggeredActions[0].type).to.equal(actions.IS_ONLINE);
            expect(triggeredActions[1].type).to.equal(documents.LOAD_SUCCESS);
            expect(triggeredActions[1].document.get('uuid')).to.equal(id);
          });
      });

      it('deals with 404 error when document is not stored locally', () => {
        const id = '456';

        fauxJax.on('request', (request) => {
          request.respond(
            404, { 'Content-Type': 'application/json' }
          );
        });

        const store = mockStore();

        return store
          .dispatch(actions.load(id, secret, dbMock))
          .then(() => {
            const triggeredActions = store.getActions();

            expect(triggeredActions).to.have.length(2);
            expect(triggeredActions[0].type).to.equal(NOTIFY);
            expect(triggeredActions[1].type).to.equal(documents.LOAD_DEFAULT);
          });
      });
    });

    it('should notify user when server is unreachable', () => {
      const id = 'not-in-local-db';
      const store = mockStore();

      return store
        .dispatch(actions.load(id, secret, dbMock))
        .then(() => {
          const triggeredActions = store.getActions();

          expect(triggeredActions).to.have.length(3);
          expect(triggeredActions[0].type).to.equal(actions.IS_OFFLINE);
          expect(triggeredActions[1].type).to.equal(NOTIFY);
          expect(triggeredActions[2].type).to.equal(documents.LOAD_DEFAULT);
        });
    });
  });
});
