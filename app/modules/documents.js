import Document from '../Document';
import { error } from './notification';
import { localPersist } from './persistence';
import { newSecret } from '../utils';
import config from '../config';


// Actions
export const LOAD_DEFAULT = 'monod/documents/LOAD_DEFAULT';
export const LOAD_SUCCESS = 'monod/documents/LOAD_SUCCESS';
export const UPDATE_TEMPLATE = 'monod/documents/UPDATE_TEMPLATE';
export const UPDATE_CONTENT = 'monod/documents/UPDATE_CONTENT';
export const UPDATE_CURRENT_DOCUMENT = 'monod/documents/UPDATE_CURRENT_DOCUMENT';

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

export function updateCurrentDocument(document) {
  return { type: UPDATE_CURRENT_DOCUMENT, document };
}

export function updateContent(content) {
  const thunk = (dispatch, getState) => {
    const current = getState().documents.current;
    const secret = getState().documents.secret;

    // prevent unwanted content update (e.g., after a // `UPDATE_CURRENT_DOCUMENT` action)
    if (content === current.get('content')) {
      return;
    }

    if (null === secret) { // looks like it is the very first edit
      const document = current.set('content', content);

      dispatch(loadSuccess(document, newSecret()));

      return;
    }

    dispatch({ type: UPDATE_CONTENT, content });

    dispatch(localPersist());
  };

  thunk.meta = {
    debounce: {
      time: config.UPDATE_CONTENT_DEBOUNCE_TIME,
      key: UPDATE_CONTENT,
    },
  };

  return thunk;
}

export function updateTemplate(template) {
  return (dispatch, getState) => {
    const secret = getState().documents.secret;

    dispatch({ type: UPDATE_TEMPLATE, template });

    if (null !== secret) {
      dispatch(localPersist());
    }
  };
}

export function notFound() {
  return (dispatch) => {
    dispatch(error(config.NOT_FOUND_MESSAGE));

    dispatch(loadDefault());
  };
}

export function decryptionFailed() {
  return (dispatch) => {
    dispatch(error(config.DECRYPTION_FAILED_MESSAGE));

    dispatch(loadDefault());
  };
}

export function serverUnreachable() {
  return (dispatch) => {
    dispatch(error(config.SERVER_UNREACHABLE_MESSAGE));

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
    case UPDATE_CURRENT_DOCUMENT:
      return {
        ...state,
        current: action.document,
      };

    case UPDATE_TEMPLATE:
      return {
        ...state,
        current: state.current
          .set('template', action.template)
          .set('last_modified_locally', Date.now()),
      };

    case UPDATE_CONTENT:
      return {
        ...state,
        current: state.current
          .set('content', action.content)
          .set('last_modified_locally', Date.now()),
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
