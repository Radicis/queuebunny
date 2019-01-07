// @flow
import { ipcRenderer } from 'electron';
import type { Dispatch, GetState } from '../reducers/types';

export const SET_CONNECTION = 'SET_CONNECTION';
export const SET_EXCHANGES = 'SET_EXCHANGES';
export const SET_PAUSED = 'SET_PAUSED';
export const SET_LOADING = 'SET_LOADING';

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
  return () => {
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

export function pauseMessages() {
  return (dispatch: Dispatch) => {
    ipcRenderer.send('pause');
    dispatch(setPaused(true));
  };
}

export function resumeMessages() {
  return (dispatch: Dispatch) => {
    ipcRenderer.send('resume');
    dispatch(setPaused(false));
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
