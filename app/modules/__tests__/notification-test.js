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

  it('should register new notifications', () => {
    const state = reducer(undefined, actions.notify('hello', 'info'));

    expect(state.messages).to.have.length(1);
  });

  it('should avoid duplicated similar notifications', () => {
    let state = reducer(undefined, {});

    state = reducer(state, actions.notify('hello', 'info'));
    state = reducer(state, actions.notify('oops', 'error'));
    state = reducer(state, actions.notify('hello', 'info'));

    expect(state.messages).to.have.length(2);
    expect(state.messages[0].count).to.equal(2);
    expect(state.messages[0].content).to.equal('hello');
    expect(state.messages[1].count).to.equal(1);
  });
});
