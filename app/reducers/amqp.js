// @flow
import { SET_CONNECTION, SET_EXCHANGES, SET_PAUSED, SET_LOADING } from '../actions/amqp';
import type { Action } from './types';

const initialState = {
  connection: false,
  exchanges: [],
  isPaused: false,
  loading: false
};

export default function(state = initialState, action: Action) {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: action.loading
      };
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
    case SET_PAUSED:
      return {
        ...state,
        isPaused: action.isPaused
      };
    default:
      return state;
  }
}
