import sjcl from 'sjcl';
import Document from '../Document';


// Actions
const UPDATE_TEMPLATE = 'monod/documents/UPDATE_TEMPLATE';
const UPDATE_CONTENT = 'monod/documents/UPDATE_CONTENT';

// Action Creators
export function updateContent(content) {
  return { type: UPDATE_CONTENT, content };
}

export function updateTemplate(template) {
  return { type: UPDATE_TEMPLATE, template };
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
    case UPDATE_TEMPLATE:
      return Object.assign({}, state, {
        current: state.current.set('template', action.template),
      });

    case UPDATE_CONTENT:
      return Object.assign({}, state, {
        current: state.current.set('content', action.content),
      });

    default: return state;
  }
}
