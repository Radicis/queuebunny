// @flow
import { ipcRenderer } from 'electron';
import type { Dispatch, GetState } from '../reducers/types';

export const SET_CONNECTION = 'SET_CONNECTION';
export const SET_EXCHANGES = 'SET_EXCHANGES';
export const SET_PAUSED = 'SET_PAUSED';
export const SET_LOADING = 'SET_LOADING';
export const SET_HAS_BINDINGS = 'SET_HAS_BINDINGS';

export function createConnection() {
  return (dispatch: Dispatch, getState: GetState) => {
    const { options } = getState().options;
    dispatch(setLoading(true));
    ipcRenderer.send('createConnection', options);
    ipcRenderer.on('ready', () => {
      dispatch(setLoading(false));
    });
    reset();
  };
}

export function reset() {
  return (dispatch: Dispatch) => {
    console.log('Resetting..');
    dispatch(setConnection(false));
    dispatch(setExchanges([]));
  };
}

export function bindExchanges(exchanges) {
  return (dispatch: Dispatch) => {
    dispatch(setHasBindings(exchanges.length !== 0));
    ipcRenderer.send('bindExchanges', exchanges);
  };
}

export function publish(exchange, routingKey, content) {
  return () => {
    ipcRenderer.send('publish', {
      exchangeName: exchange.name,
      routingKey,
      content: JSON.parse(content)
    });
  };
}

export function setHasBindings(hasBindings) {
  return {
    type: SET_HAS_BINDINGS,
    hasBindings
  };
}

export function setLoading(loading) {
  return {
    type: SET_LOADING,
    loading
  };
}

export function setConnection(connection) {
  return {
    type: SET_CONNECTION,
    connection
  };
}

export function setExchanges(exchanges) {
  return {
    type: SET_EXCHANGES,
    exchanges
  };
}

export function setPaused(isPaused) {
  return {
    type: SET_PAUSED,
    isPaused
  };
}
