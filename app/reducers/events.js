// @flow
import _ from 'lodash';
import { SELECT_EVENT, SET_EVENTS } from '../actions/events';
import type { Action } from './types';

const initialState = {
  events: [],
  selectedEvent: null
};

export default function(state = initialState, action: Action) {
  switch (action.type) {
    case SELECT_EVENT:
      return {
        ...state,
        selectedEvent: _.find(state.events, e => e.id === action.eventId)
      };
    case SET_EVENTS:
      return {
        ...state,
        eventS: action.events
      };
    default:
      return state;
  }
}
