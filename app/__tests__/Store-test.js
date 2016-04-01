import Store, { Events } from '../Store';

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
            localForageMock.items['123'] = { content: encrypted };

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
      const doc = { uuid: 'foo', content: 'bar' };

      store.update(doc, true);

      expect(doc).not.to.have.property('last_local_persist');

      expect(eventSpy.calledOnce).to.be.true;
      expect(eventSpy.calledWith(Events.CHANGE)).to.be.true;
    });
  });
});
