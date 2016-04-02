import Store, { Events } from '../Store';
import Document from '../Document';

import sinon from 'sinon';
import localforage from 'localforage';
import fauxJax from 'faux-jax';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

// chai-as-promised
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;


describe('Store', () => {

  const STORE_NAME = 'mocha-test';

  let eventSpy, localForageMock, store;

   beforeEach(() => {
    eventSpy = sinon.spy();
    localForageMock   = {
      items: {},
      nbGetItemCall: 0,
      nbSetItemCall: 0,
      config: function() {
        return this;
      },
      setItem: function (k, v) {
        localForageMock.nbSetItemCall++;
        localForageMock.items[k] = v;

        return Promise.resolve();
      },
      getItem: function (k) {
        localForageMock.nbGetItemCall++;

        return Promise.resolve(localForageMock.items[k] || null);
      }
    };

    store = new Store(STORE_NAME, { emit: eventSpy }, '', localForageMock);
  });

  describe('- findById()', (done) => {
    // 0. No ID => Events.NO_DOCUMENT_ID
    it('emits an event when no id is supplied', () => {
      store
        .findById()
        .catch(() => {
          expect(eventSpy.calledOnce).to.be.true;
          expect(eventSpy.calledWith(Events.NO_DOCUMENT_ID)).to.be.true;

          done();
        });
    });

    describe('with Internet connection', () => {
      beforeEach(() => {
        fauxJax.install();
      });

      it('starts by looking into local database', () => {
        fauxJax.on('request', (request) => {
          request.respond(
            404, { 'Content-Type': 'application/json' }
          );

          fauxJax.restore();
        });

        return store.findById(123).catch(() => {
          expect(localForageMock.nbGetItemCall).to.equal(1);
        });
      });

      it('returns the item in the local database', () => {
        fauxJax.restore();

        return store
          .encrypt('foo', 'secret')
          .then((encrypted) => {
            localForageMock.items['123'] = new Document({
              content: encrypted
            });

            return store.findById(123, 'secret').then((state) => {
              expect(eventSpy.calledOnce).to.be.true;
              expect(eventSpy.calledWith(Events.CHANGE)).to.be.true;

              expect(state).to.have.property('document');
              expect(state).to.have.property('secret');
            });
          });
      });

      it('deals with 404 error when document is not stored locally', () => {
        fauxJax.on('request', (request) => {
          request.respond(
            404, { 'Content-Type': 'application/json' }
          );

          fauxJax.restore();
        });

        return store.findById(123, 'secret').catch(() => {
          expect(eventSpy.calledOnce).to.be.true;
          expect(eventSpy.calledWith(Events.DOCUMENT_NOT_FOUND)).to.be.true;
        });
      });

      it('requests the server if document is not stored locally', () => {
        return store
          .encrypt('foo', 'secret')
          .then((encrypted) => {
            fauxJax.on('request', (request) => {
              request.respond(
                200, { 'Content-Type': 'application/json' },
                JSON.stringify({
                  uuid: 123,
                  content: encrypted,
                  last_modified: Date.now()
                })
              );

              fauxJax.restore();
            });

            return store.findById(123, 'secret').then((state) => {
              expect(eventSpy.calledTwice).to.be.true;
              expect(eventSpy.calledWith(Events.APP_IS_ONLINE)).to.be.true;
              expect(eventSpy.calledWith(Events.CHANGE)).to.be.true;

              expect(state).to.have.property('document');
              expect(state).to.have.property('secret');

              expect(localForageMock.items[123]).to.be.an('object');
            });
          });
      });
    });

    describe('with NO Internet connection', () => {
      it('emits an event because we are offline', () => {
        return store.findById(123, 'secret').catch(() => {
          expect(eventSpy.calledOnce).to.be.true;
          expect(eventSpy.calledWith(Events.APP_IS_OFFLINE)).to.be.true;
        });
      });
    });
  });

  describe('encrypt', () => {
    it('returns a promise', () => {
      const promise = store.encrypt('foo', 'secret');

      expect(eventSpy.called).to.be.false;

      return expect(promise).to.be.fulfilled;
    });
  });

  describe('decrypt', () => {
    it('emits an event when decryption has failed', () => {
      let promise = store.decrypt('foo', 'secret');

      expect(eventSpy.calledOnce).to.be.true;
      expect(eventSpy.calledWith(Events.DECRYPTION_FAILED)).to.be.true;

      return expect(promise).to.be.rejected;
    });

    it('returns a promise with the decrypted content', (done) => {
      const content   = 'foo';
      const secret    = 'secret';

      store.encrypt(content, secret).then((encrypted) => {
        const promise = store.decrypt(encrypted, secret);

        expect(promise).to.be.eventually.equal(content).notify(done);
      });
    });
  });

  describe('update', () => {
    it('should not modify the passed document that will be persisted', () => {
      const doc = new Document({ uuid: 'foo', content: 'bar' });

      store.update(doc);

      expect(doc).not.to.have.property('last_local_persist');

      expect(eventSpy.calledOnce).to.be.true;
      expect(eventSpy.calledWith(Events.CHANGE)).to.be.true;
    });
  });

  describe('sync', () => {
    it('should not sync if the document has default content', () => {
      const promise = store.sync();

      return expect(promise).to.be.eventually.equal('No need to sync');
    });

    describe('with Internet connection', () => {
      beforeEach(() => {
        fauxJax.install();
      });

      afterEach(() => {
        fauxJax.restore();
      });

      it('should directly push a new document', () => {
        fauxJax.on('request', (request) => {
          request.respond(
            201, { 'Content-Type': 'application/json' },
            JSON.stringify({
              last_modified: 'new date'
            })
          );
        });

        const doc = new Document({ uuid: 'foo', content: 'bar' });

        store.update(doc);
        eventSpy.reset();

        // test
        return store.sync().then((state) => {
          expect(eventSpy.calledTwice).to.be.true;
          expect(eventSpy.calledWith(Events.SYNCHRONIZE)).to.be.true;
          expect(eventSpy.calledWith(Events.APP_IS_ONLINE)).to.be.true;

          expect(state).to.have.property('document');
          expect(state).to.have.property('secret');
          expect(state.document.get('last_modified')).to.equal('new date');
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

        store.update(doc);
        eventSpy.reset();

        // test
        return expect(store.sync()).to.eventually.equal('nothing to do');
      });

      it([
        'should directly update the document when there are no server changes,',
        'but there are local changes !!'
      ].join(' '), () => {
        const responses =  function* () {
          yield { status: 200, body: { last_modified: 1 } }
          yield { status: 200, body: { last_modified: 2 } }
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
          last_modified: 1
        });

        store.update(doc);
        eventSpy.reset();

        // test
        return store.sync().then((state) => {
          expect(eventSpy.calledThrice).to.be.true;
          expect(eventSpy.calledWith(Events.SYNCHRONIZE)).to.be.true;
          expect(eventSpy.calledWith(Events.APP_IS_ONLINE)).to.be.true; // 2 times

          expect(state).to.have.property('document');
          expect(state).to.have.property('secret');

          expect(state.document.get('last_modified')).to.equal(2);
        });
      });

      it([
        'should get the latest version of the server',
        'when there is no local change'
      ].join(' '), () => {
        const contentSentByServer = 'new content';

        return store
          // we need to encrypt the content that will be sent by the server
          .encrypt(contentSentByServer, 'secret')
          .then((encryptedContent) => {
            const responses =  function* () {
              yield { status: 200, body: {
                content: encryptedContent,
                last_modified: 2
              } }
              yield { status: 200, body: {
                content: encryptedContent,
                last_modified: 2
              } }
            }();

            fauxJax.on('request', (request) => {
              const response = responses.next().value;

              request.respond(
                response.status,
                { 'Content-Type': 'application/json' },
                JSON.stringify(response.body)
              );
            });

            // force store state
            store.state = {
              document: new Document({
                uuid: 'foo',
                content: 'whatever, it is not used in this test',
                last_modified: 1
              }),
              secret: 'secret'
            };

            eventSpy.reset();

            // test
            return store.sync().then((state) => {
              expect(eventSpy.calledTwice).to.be.true;
              expect(eventSpy.calledWith(Events.APP_IS_ONLINE)).to.be.true;
              expect(eventSpy.calledWith(Events.UPDATE_WITHOUT_CONFLICT)).to.be.true;

              expect(state).to.have.property('document');
              expect(state).to.have.property('secret');

              expect(state.document.get('last_modified')).to.equal(2);
              expect(state.document.get('content')).to.equal(contentSentByServer);
            });
          });
      });
    });

    describe('with NO Internet connection', () => {
      it('emits an event because we are offline', () => {
        const doc = new Document({
          uuid: 'foo',
          content: 'bar',
          last_modified: 1
        });

        store.update(doc);
        eventSpy.reset();

        // test
        return store.sync().catch(() => {
          expect(eventSpy.calledOnce).to.be.true;
          expect(eventSpy.calledWith(Events.APP_IS_OFFLINE)).to.be.true;
        });
      });
    });
  });
});
