import { expect } from 'chai';
import sinon from 'sinon';
import reducer, * as actions from '../monod';
import {
  LOAD_DEFAULT,
} from '../documents';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;


describe('modules/monod', () => {
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
    it('dispatches loadDefault() action if there is no document id supplied', () => {
      // TODO: write me
    });
  });
});
