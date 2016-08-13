import sjcl from 'sjcl';
import Document from '../Document';
import { error } from './notification';
import { persist } from './localpersist';


// Actions
const LOAD_DEFAULT = 'monod/documents/LOAD_DEFAULT';
const LOAD_SUCCESS = 'monod/documents/LOAD_SUCCESS';
const UPDATE_TEMPLATE = 'monod/documents/UPDATE_TEMPLATE';
const UPDATE_CONTENT = 'monod/documents/UPDATE_CONTENT';

// Action Creators
export function loadDefault() {
  return (dispatch) => {
    dispatch({ type: LOAD_DEFAULT });

    window.history.pushState({}, 'Monod', '/');
  };
}

export function loadSuccess(document, secret) {
  return (dispatch) => {
    dispatch({ type: LOAD_SUCCESS, document, secret });

    window.history.pushState({}, 'Monod', `/${document.get('uuid')}#${secret}`);
  };
}

export function updateContent(content) {
  return (dispatch, getState) => {
    const current = getState().documents.current;
    let secret = getState().documents.secret;

    if (null === secret) {
      const document = current.set('content', content);
      secret = sjcl.codec.base64.fromBits(sjcl.random.randomWords(8, 10), 0);

      dispatch(loadSuccess(document, secret));

      return;
    }

    dispatch({ type: UPDATE_CONTENT, content });

    dispatch(persist());
  };
}

export function updateTemplate(template) {
  return (dispatch) => {
    dispatch({ type: UPDATE_TEMPLATE, template });

    dispatch(persist());
  };
}

export function notFound() {
  return (dispatch) => {
    dispatch(error([
      'We could not find the document you were trying to load',
      'so we have redirected you to a new document.',
    ].join(' ')));

    dispatch(loadDefault());
  };
}

export function decryptionFailed() {
  return (dispatch) => {
    dispatch(error([
      'We were unable to decrypt the document. Either the secret has not',
      'been supplied or it is invalid.',
      'We have redirected you to a new document.',
    ].join(' ')));

    dispatch(loadDefault());
  };
}

// Reducer
const initialState = {
  current: new Document(),
  secret: null,
  loaded: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_TEMPLATE:
      return {
        ...state,
        current: state.current.set('template', action.template),
      };

    case UPDATE_CONTENT:
      return {
        ...state,
        current: state.current.set('content', action.content),
      };

    case LOAD_SUCCESS:
      return {
        current: action.document,
        secret: action.secret,
        loaded: true,
      };

    case LOAD_DEFAULT:
      return {
        ...initialState,
        loaded: true,
      };

    default: return state;
  }
}
