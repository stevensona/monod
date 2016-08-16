import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import fauxJax from 'faux-jax';

import Document from '../../Document';
import { encrypt } from '../../utils';
import * as app from '../monod';
import * as actions from '../sync';
import * as documents from '../documents';
import * as persistence from '../persistence';
import * as notification from '../notification';
import dbMock from './dbMock';

// see: https://github.com/mochajs/mocha/issues/1847
const { beforeEach, afterEach, describe, it } = global;


describe('modules/sync', () => {
  const middlewares = [thunk.withExtraArgument({ db: dbMock })];
  const mockStore = configureMockStore(middlewares);

  const secret = 'secret';

  beforeEach(() => {
    dbMock.reset();
  });

  describe('synchronize()', () => {
    it('does nothing when current document is the default one', () => {
      const store = mockStore({
        documents: {
          current: new Document(),
        },
      });

      const expectedActions = [
        { type: actions.SYNCHRONIZE },
        { type: actions.NO_NEED_TO_SYNC },
        { type: actions.SYNCHRONIZE_SUCCESS },
      ];

      return store
        .dispatch(actions.synchronize())
        .then(() => {
          expect(store.getActions()).to.eql(expectedActions);
        });
    });

    describe('(API call)', () => {
      beforeEach(() => {
        fauxJax.install();
      });

      afterEach(() => {
        fauxJax.restore();
      });

      it('directly persist the document on the server when it has never been sync\'ed', () => {
        fauxJax.on('request', (request) => {
          request.respond(
            201, { 'Content-Type': 'application/json' },
            JSON.stringify({
              last_modified: 'new date'
            })
          );
        });

        const content = 'Hello';

        const store = mockStore({
          documents: {
            current: new Document({ content }),
            secret,
          },
        });

        const expectedActions = [
          { type: actions.SYNCHRONIZE },
          { type: persistence.SERVER_PERSIST },
          { type: app.IS_ONLINE },
          { type: documents.UPDATE_CURRENT_DOCUMENT },
          { type: persistence.SERVER_PERSIST_SUCCESS },
          { type: actions.SYNCHRONIZE_SUCCESS },
        ];

        return store
          .dispatch(actions.synchronize())
          .then(() => {
            const triggeredActions = store.getActions();

            expect(triggeredActions).to.have.length(expectedActions.length);
            expectedActions.forEach((action, index) => {
              expect(triggeredActions[index].type).to.equal(action.type);
            });

            expect(triggeredActions[3].document.get('last_modified')).to.equal('new date');
          });
      });

      it('deals with non 404 responses', () => {
        fauxJax.on('request', (request) => {
          request.respond(
            404, { 'Content-Type': 'application/json' }
          );
        });

        const content = 'Hello';

        const store = mockStore({
          documents: {
            current: new Document({ content, last_modified: Date.now() }),
            secret,
          },
        });

        const expectedActions = [
          { type: actions.SYNCHRONIZE },
          { type: actions.SYNCHRONIZE_ERROR },
        ];

        return store
          .dispatch(actions.synchronize())
          .then(() => {
            const triggeredActions = store.getActions();

            expect(triggeredActions).to.have.length(expectedActions.length);
            expectedActions.forEach((action, index) => {
              expect(triggeredActions[index].type).to.equal(action.type);
            });
          });
      });

      it('should not do anything when there are no (local or server) changes', () => {
        // it is important to set a date in the future to emulate the case
        // where the `last_modified` is "after" any local changes
        const date = Date.now() + 1000;

        fauxJax.on('request', (request) => {
          request.respond(
            200, { 'Content-Type': 'application/json' },
            JSON.stringify({
              last_modified: date
            })
          );
        });

        const doc = new Document({
          uuid: 'foo',
          content: 'bar',
          last_modified: date
        });

        const store = mockStore({
          documents: {
            current: doc,
            secret,
          },
        });

        const expectedActions = [
          { type: actions.SYNCHRONIZE },
          { type: app.IS_ONLINE },
          { type: actions.NO_NEED_TO_SYNC },
          { type: actions.SYNCHRONIZE_SUCCESS },
        ];

        return store
          .dispatch(actions.synchronize())
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
          });
      });

      it('should directly update the document when no server changes and local changes', () => {
        const responses = function* () {
          yield { status: 200, body: { last_modified: 1 } };
          yield { status: 200, body: { last_modified: 2 } };
        }();

        fauxJax.on('request', (request) => {
          const response = responses.next().value;

          request.respond(
            response.status,
            { 'Content-Type': 'application/json' },
            JSON.stringify(response.body)
          );
        });

        const doc = new Document({
          uuid: 'foo',
          content: 'bar',
          last_modified: 1,
          last_modified_locally: Date.now(),
        });

        const store = mockStore({
          documents: {
            current: doc,
            secret,
          },
        });

        const expectedActions = [
          { type: actions.SYNCHRONIZE },
          { type: app.IS_ONLINE },
          { type: persistence.SERVER_PERSIST },
          { type: app.IS_ONLINE },
          { type: documents.UPDATE_CURRENT_DOCUMENT },
          { type: persistence.SERVER_PERSIST_SUCCESS },
          { type: actions.SYNCHRONIZE_SUCCESS },
        ];

        return store
          .dispatch(actions.synchronize())
          .then(() => {
            const triggeredActions = store.getActions();

            expect(triggeredActions).to.have.length(expectedActions.length);
            expectedActions.forEach((action, index) => {
              expect(triggeredActions[index].type).to.equal(action.type);
            });
          });
      });

      it('should get the latest version of the server when there is no local change', () => {
        const contentSentByServer = 'new content';

        const responses = function* () {
          yield { status: 200, body: {
            uuid: 'foo',
            content: encrypt(contentSentByServer, secret),
            last_modified: 2
          } };
          yield { status: 200, body: {
            uuid: 'foo',
            content: encrypt(contentSentByServer, secret),
            last_modified: 2
          } };
        }();

        fauxJax.on('request', (request) => {
          const response = responses.next().value;

          request.respond(
            response.status,
            { 'Content-Type': 'application/json' },
            JSON.stringify(response.body)
          );
        });

        const store = mockStore({
          documents: {
            current: new Document({
              uuid: 'foo',
              content: 'whatever, it is not used in this test',
              last_modified: 1,
            }),
            secret,
          },
        });

        const expectedActions = [
          { type: actions.SYNCHRONIZE },
          { type: app.IS_ONLINE },
          { type: documents.UPDATE_CURRENT_DOCUMENT },
          { type: notification.NOTIFY },
          { type: persistence.LOCAL_PERSIST },
          { type: persistence.LOCAL_PERSIST_SUCCESS },
          { type: actions.SYNCHRONIZE_SUCCESS },
        ];

        return store
          .dispatch(actions.synchronize())
          .then(() => {
            const triggeredActions = store.getActions();

            expect(triggeredActions).to.have.length(expectedActions.length);
            expectedActions.forEach((action, index) => {
              expect(triggeredActions[index].type).to.equal(action.type);
            });
          });
      });

      it('should create a fork when there is a conflict', () => {
        const contentSentByServer = 'some content from the server';

        const responses = function* () {
          yield { status: 200, body: {
            uuid: 'foo',
            content: encrypt(contentSentByServer, secret),
            last_modified: 10
          } };
        }();

        fauxJax.on('request', (request) => {
          const response = responses.next().value;

          request.respond(
            response.status,
            { 'Content-Type': 'application/json' },
            JSON.stringify(response.body)
          );
        });

        const store = mockStore({
          documents: {
            current: new Document({
              uuid: 'foo',
              content: 'Change ALL THE THINGS!',
              last_modified: 1,
              last_modified_locally: 16 // we made a lot of changes
            }),
            secret,
          },
        });

        const expectedActions = [
          { type: actions.SYNCHRONIZE },
          { type: app.IS_ONLINE },
          { type: actions.FORKING },
          { type: notification.NOTIFY },
          { type: documents.LOAD_SUCCESS },
          { type: actions.SYNCHRONIZE_SUCCESS },
        ];

        return store
          .dispatch(actions.synchronize())
          .then(() => {
            const triggeredActions = store.getActions();

            expect(triggeredActions).to.have.length(expectedActions.length);
            expectedActions.forEach((action, index) => {
              expect(triggeredActions[index].type).to.equal(action.type);
            });

            const uuids = Object.keys(dbMock.items);

            expect(uuids).to.have.length(2);
            expect(uuids).to.contain('foo'); // the current doc

            // fork
            const forkId = uuids[0];
            const fork = dbMock.items[forkId];

            expect(fork.uuid).to.equal(forkId);
            expect(fork.last_modified).to.be.null;
            expect(fork.last_modified_locally).to.be.null;

            // former document
            const formerId = uuids[1];
            const former = dbMock.items[formerId];

            expect(formerId).to.equal('foo');

            expect(former.uuid).to.equal(formerId);
            expect(former.last_modified).to.equal(10); // from server
            // ensure we reset the local date
            expect(former.last_modified_locally).to.be.null;
          });
      });
    });
  });
});
