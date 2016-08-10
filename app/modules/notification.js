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
      const idx = state.messages.findIndex(
        m => action.message === m.content && action.level === m.level
      );

      if (-1 !== idx) {
        return {
          messages: state.messages.map((m, index) => {
            if (idx === index) {
              return Object.assign({}, m, { count: m.count + 1 });
            }

            return m;
          }),
        };
      }

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
