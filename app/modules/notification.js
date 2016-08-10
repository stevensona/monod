// Actions
const NOTIFY = 'monod/notification/NOTIFY';
const CLOSE = 'monod/notification/CLOSE';

// Action Creators
export function notify(message, level) {
  return { type: NOTIFY, message, level };
}

export function close(index) {
  return { type: CLOSE, index };
}

// Reducer
const initialState = {
  messages: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case NOTIFY:
      return {
        messages: state.messages.concat({
          content: action.message,
          level: action.level,
          count: 1,
        }),
      };

    case CLOSE:
      return {
        messages: state.messages.filter((_, index) => index !== action.index),
      };

    default: return state;
  }
}
