// @flow
import { SET_CONNECTION, SET_EXCHANGES } from '../actions/amqp';
import type { Action } from './types';

const initialState = {
  connection: false,
  exchanges: []
};

export default function(state = initialState, action: Action) {
  switch (action.type) {
    case SET_CONNECTION:
      return {
        ...state,
        connection: action.connection
      };
    case SET_EXCHANGES:
      return {
        ...state,
        exchanges: action.exchanges
      };
    default:
      return state;
  }
}
