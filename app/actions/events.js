// @flow
import Store from 'electron-store';
import _ from 'lodash';

import type { Dispatch } from '../reducers/types';

export const SET_EVENTS = 'SET_EVENTS';
export const SELECT_EVENT = 'SELECT_EVENT';

const JSONStore = new Store();

/**
 * Gets the items from the json store and sets the state
 * @returns {Function}
 */
export function getEventsFromStore() {
  return (dispatch: Dispatch) => {
    const storeEvents = JSONStore.get('events') || [];
    dispatch(setEvents(storeEvents));
  };
}

/**
 * Sets the state options {}
 * @param options
 * @returns {{type: boolean, options: *}}
 */
export function setEvents(events) {
  return {
    type: SET_EVENTS,
    events
  };
}

export function selectEvent(eventId) {
  return {
    type: SELECT_EVENT,
    selectEvent: eventId
  }
}

export function updateEvent(updatedEvent) {
  return (dispatch: Dispatch, getState: GetState) => {
    // Get events from the store
    const storeEvents = JSONStore.get('events');

    const index = _.findIndex(storeEvents, {id: updateEvent.id});

    const updatedStoreEvents = storeEvents.splice(index, 1, updatedEvent)

    // Update the store with the new values
    JSONStore.set('events', updatedStoreEvents);

    // Update the item in the state
    dispatch(setEvents(updatedStoreEvents));
  };
}

export function addEvent(newEvent) {
  return (dispatch: Dispatch) => {
    // Get events from the store
    const storeEvents = JSONStore.get('events');

    const updatedStoreEvents = storeEvents.push(newEvent);

    // Update the store with the new values
    JSONStore.set('events', updatedStoreEvents);

    // Update the item in the state
    dispatch(setEvents(updatedStoreEvents));
  };
}