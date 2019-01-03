// @flow
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';

export function addMessage(message) {
  return {
    type: ADD_MESSAGE,
    message
  };
}

export function clearMessages() {
  return {
    type: CLEAR_MESSAGES
  };
}
