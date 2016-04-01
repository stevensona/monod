import Store, { Events } from '../Store';

import sinon from 'sinon';
import localforage from 'localforage';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

// chai-as-promised
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;


describe('Store', () => {

  const STORE_NAME = 'mocha-test';

  let eventSpy, lfStub, store;

  beforeEach(() => {
    eventSpy = sinon.spy();
    lfStub   = Object.create({
      countGetItem: 0,
      countSetItem: 0,
      config: function() { return this; },
      getItem: function() { this.countGetItem++; return Promise.resolve(); },
      setItem: function() { this.countSetItem++; }
    });

    store = new Store(STORE_NAME, { emit: eventSpy }, 'endpoint', lfStub);
  });

  describe('findById', () => {
    it('emits an event when no id is supplied', () => {
      store.findById();

      expect(eventSpy.calledOnce).to.be.true;
      expect(eventSpy.calledWith(Events.NO_DOCUMENT_ID)).to.be.true;
    });

    it('starts by looking into local database', () => {
      const promise = store.findById(123);

      expect(lfStub.countGetItem).to.equal(1);
    });
  });

  describe('_encrypt', () => {
    it('returns a promise', () => {
      const promise = store._encrypt('foo', 'secret');

      expect(eventSpy.called).to.be.false;

      return expect(promise).to.be.fulfilled;
    });
  });

  describe('_decrypt', () => {
    it('emits an event when decryption has failed', () => {
      let promise = store._decrypt('foo', 'secret');

      expect(eventSpy.calledOnce).to.be.true;
      expect(eventSpy.calledWith(Events.DECRYPTION_FAILED)).to.be.true;

      return expect(promise).to.be.rejected;
    });

    it('returns a promise with the decrypted content', (done) => {
      const content   = 'foo';
      const secret    = 'secret';

      store._encrypt(content, secret).then((encrypted) => {
        const promise = store._decrypt(encrypted, secret);

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
