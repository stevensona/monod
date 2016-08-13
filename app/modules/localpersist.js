import sjcl from 'sjcl';
import db from '../db';

// Actions
const PERSIST = 'monod/localpersist/PERSIST';
const PERSIST_SUCCESS = 'monod/localpersist/PERSIST_SUCCESS';

// Action Creators
export function persist() {
  const thunk = (dispatch, getState) => {
    dispatch({ type: PERSIST });

    const document = getState().documents.current;
    const secret = getState().documents.secret;

    const encrypted = document.set(
      'content', sjcl.encrypt(secret, document.get('content'), { ks: 256 })
    );

    db
      .setItem(encrypted.get('uuid'), encrypted.toJS())
      .then(() => dispatch({ type: PERSIST_SUCCESS }));
  };

  thunk.meta = {
    debounce: {
      time: 150,
    },
  };

  return thunk;
}

// Reducer
const initialState = {
  persisting: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case PERSIST:
      return { persisting: true };

    case PERSIST_SUCCESS:
      return { persisting: false };

    default:
      return state;
  }
}
