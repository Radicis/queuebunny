// @flow
import _ from 'lodash';
import {
  SET_CONNECTION,
  SET_CHANNEL,
  SET_EXCHANGES
} from '../actions/amqp';
import type { Action } from './types';

const initialState = {
  connection: null,
  channel: null,
  exchanges: []
};

export default function(state = initialState, action: Action) {
  switch (action.type) {
    case SET_CONNECTION:
      return {
        ...state,
        connection: action.connection
      };
    case SET_CHANNEL:
      return {
        ...state,
        channel: action.channel
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
