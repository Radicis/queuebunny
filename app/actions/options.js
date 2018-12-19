// @flow
import Store from 'electron-store';
import _ from 'lodash';

import type { Dispatch } from '../reducers/types';

export const SET_OPTIONS = 'SET_OPTIONS';
export const TOGGLE_MENU = 'TOGGLE_MENU';

const JSONStore = new Store();

/**
 * Gets the items from the json store and sets the state
 * @returns {Function}
 */
export function getOptionsFromStore() {
  return (dispatch: Dispatch) => {
    const storeOptions = JSONStore.get('options') || {};
    dispatch(setOptions(storeOptions));
  };
}

/**
 * Sets the state options {}
 * @param options
 * @returns {{type: boolean, options: *}}
 */
export function setOptions(options) {
  return {
    type: SET_OPTIONS,
    options
  };
}

/**
 * Updates thes options {}
 * @param options
 * @returns {Function}
 */
export function updateOptions(updatedOptions) {
  return (dispatch: Dispatch, getState: GetState) => {
    // Get the current options from the state
    const options = getState().options.options;

    // Assign new values
    let newOptions = _.assign({}, options, updatedOptions);

    console.log(newOptions);

    // Update the store with the new values
    JSONStore.set('options', newOptions);

    // Update the item in the state
    dispatch(setOptions(newOptions));
  };
}

/**
 * Sets the toggled menu state  {}
 * @returns {{type: boolean, state: *}}
 */
export function toggleMenuCollapse() {
  return {
    type: TOGGLE_MENU
  };
}
