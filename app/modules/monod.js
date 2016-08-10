// Actions
const IS_ONLINE = 'monod/IS_ONLINE';
const IS_OFFLINE = 'monod/IS_OFFLINE';

// Action Creators
export function isOnline() {
  return { type: IS_ONLINE };
}

export function isOffline() {
  return { type: IS_OFFLINE };
}

// Reducer
const initialState = {
  offline: true,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case IS_ONLINE:
      return { offline: false };

    case IS_OFFLINE:
      return { offline: true };

    default: return state;
  }
}
