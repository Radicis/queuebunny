// @flow
import _ from 'lodash';
import {
  ADD_MESSAGE,
  CLEAR_MESSAGES
} from '../actions/messages';
import type { Action } from './types';

const initialState = {
  messages: []
};

export default function(state = initialState, action: Action) {
  switch (action.type) {
    case CLEAR_MESSAGES:
      return {
        ...state,
        messages: []
      };
    case ADD_MESSAGE:
      return {
        ...state,
        messages: _.concat(state.messages, action.message)
      };
    default:
      return state;
  }
}
