// @flow
import _ from 'lodash';
import { SET_OPTIONS, TOGGLE_MENU } from '../actions/options';
import type { Action } from './types';

const initialState = {
  options: {
    amqp: {
      host: 'localhost',
      port: '5672',
      user: 'user',
      password: 'bitnami'
    },
    http: {
      host: 'localhost',
      port: '15672',
      user: 'user',
      password: 'bitnami'
    },
    queue: 'bunny'
  },
  menuCollapsed: false
};

export default function(state = initialState, action: Action) {
  switch (action.type) {
    case SET_OPTIONS:
      return {
        ...state,
        options: _.assign({}, state.options, action.options)
      };
    case TOGGLE_MENU: {
      return {
        ...state,
        menuCollapsed: !state.menuCollapsed
      }
    }
    default:
      return state;
  }
}