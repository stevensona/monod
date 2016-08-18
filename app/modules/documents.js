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
export const TOGGLE_TASK_LIST_ITEM = 'monod/documents/TOGGLE_TASK_LIST_ITEM';

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

export function updateCurrentDocument(document, force) {
  return { type: UPDATE_CURRENT_DOCUMENT, document, forceUpdate: force || false };
}

export function forceUpdateCurrentDocument(document) {
  return updateCurrentDocument(document, true);
}

export function updateContent(content) {
  const thunk = (dispatch, getState) => {
    const current = getState().documents.current;
    const secret = getState().documents.secret;

    // prevent unwanted content update (e.g., after a // `UPDATE_CURRENT_DOCUMENT` action)
    if (content === current.get('content')) {
      return Promise.resolve();
    }

    if (null === secret) { // looks like it is the very first edit
      const document = current.set('content', content);

      dispatch(loadSuccess(document, newSecret()));

      return Promise.resolve();
    }

    dispatch({ type: UPDATE_CONTENT, content });

    return dispatch(localPersist());
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
      return dispatch(localPersist());
    }

    return Promise.resolve();
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

export function toggleTaskListItem(index) {
  return { type: TOGGLE_TASK_LIST_ITEM, index };
}

// Reducer
const initialState = {
  current: new Document(),
  secret: null,
  loaded: false,
  forceUpdate: false,
};

function doUpdateTemplate(state, action) {
  let newCurrent = state.current.set('template', action.template);

  // so that we don't create "working" document when users only change
  // templates on the home page (i.e. default content loaded)
  if (!state.current.isDefault()) {
    newCurrent = newCurrent.set('last_modified_locally', Date.now());
  }

  return {
    ...state,
    current: newCurrent,
    forceUpdate: false,
  };
}

function doClickOnTask(state, action) {
  const content = state.current.get('content');

  let index = 0;
  const updatedContent = content.replace(/\- \[[x| ]\] /gi, (match) => {
    if (action.index !== index++) {
      return match;
    }

    if (/x/i.test(match)) {
      return '- [ ] ';
    }

    return '- [x] ';
  });

  if (content === updatedContent) {
    return state;
  }

  return {
    ...state,
    current: state.current
      .set('content', updatedContent)
      .set('last_modified_locally', Date.now()),
    forceUpdate: true,
  };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_TASK_LIST_ITEM:
      return doClickOnTask(state, action);

    case UPDATE_CURRENT_DOCUMENT:
      return {
        ...state,
        current: action.document,
        forceUpdate: action.forceUpdate,
      };

    case UPDATE_TEMPLATE:
      return doUpdateTemplate(state, action);

    case UPDATE_CONTENT:
      return {
        ...state,
        current: state.current
          .set('content', action.content)
          .set('last_modified_locally', Date.now()),
        forceUpdate: false,
      };

    case LOAD_SUCCESS:
      return {
        current: action.document,
        secret: action.secret,
        forceUpdate: false,
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
