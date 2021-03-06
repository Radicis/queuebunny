// @flow
import Store from 'electron-store';
import _ from 'lodash';
import UUID from 'uuid/v1';

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
    let storeEvents = JSONStore.get('events') || [];
    _.isArray(storeEvents) ? null : (storeEvents = []);
    dispatch(setEvents(storeEvents));
  };
}

/**
 * Sets the state options {}
 * @param events
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
    eventId
  };
}

export function updateEvent(updatedEventId, updatedEvent) {
  return (dispatch: Dispatch) => {
    // Get events from the store
    let storeEvents = JSONStore.get('events') || [];

    _.isArray(storeEvents) ? null : (storeEvents = []);

    console.log('Updating event..');

    // Update the item in the store
    storeEvents = _.map(storeEvents, i => (i.id === updatedEventId ? _.assign({}, i, updatedEvent) : i));

    // Update the store with the new values
    JSONStore.set('events', storeEvents);

    // Update the item in the state
    dispatch(setEvents(storeEvents));
    dispatch(selectEvent(updatedEventId));
  };
}

export function addEvent(newEventName) {
  return (dispatch: Dispatch) => {
    // Get events from the store
    let storeEvents = JSONStore.get('events') || [];

    _.isArray(storeEvents) ? null : (storeEvents = []);

    const newEvent = {
      name: newEventName,
      routingKey: 'Test',
      id: UUID(),
      content: '{\n\t"test": true\n}'
    };

    storeEvents.push(newEvent);

    // Update the store with the new values
    JSONStore.set('events', storeEvents);

    // Update the item in the state
    dispatch(setEvents(storeEvents));
    dispatch(selectEvent(newEvent.id));
  };
}

export function deleteEvent(eventId) {
  return (dispatch: Dispatch) => {
    // Get events from the store
    let storeEvents = JSONStore.get('events') || [];

    _.isArray(storeEvents) ? null : (storeEvents = []);

    const index = _.findIndex(storeEvents, { id: eventId });

    storeEvents.splice(index, 1);

    // Update the store with the new values
    JSONStore.set('events', storeEvents);

    // Update the item in the state
    dispatch(setEvents(storeEvents));
    dispatch(selectEvent(null));
  };
}

export function purgeEvents() {
  return (dispatch: Dispatch) => {
    // Update the store with the new values
    JSONStore.delete('events');

    // Update the item in the state
    dispatch(setEvents([]));
  };
}
