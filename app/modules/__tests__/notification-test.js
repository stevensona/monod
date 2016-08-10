import { expect } from 'chai';
import reducer, * as actions from '../notification';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;


describe('modules/notification', () => {
  it('should return the initial state', () => {
    const state = reducer(undefined, {});

    expect(state.messages).not.to.be.undefined;
    expect(state.messages).to.be.empty;
  });
});
