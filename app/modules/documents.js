import sjcl from 'sjcl';
import Document from '../Document';


// Actions
const LOAD = 'monod/documents/LOAD';

// Action Creators
export function load() {
  return { type: LOAD };
}

// Reducer
const initialState = {
  // we automatically create a default document, but it might not be used
  current: new Document(),
  // we automatically generate a secret, but it might not be used
  secret: sjcl.codec.base64.fromBits(sjcl.random.randomWords(8, 10), 0),
  loaded: true,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:

    default: return state;
  }
}
