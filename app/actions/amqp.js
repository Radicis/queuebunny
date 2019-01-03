// @flow
import { ipcRenderer } from 'electron';
import type { Dispatch, GetState } from '../reducers/types';

export const SET_CONNECTION = 'SET_CONNECTION';
export const SET_EXCHANGES = 'SET_EXCHANGES';

export function createConnection() {
  return (dispatch: Dispatch, getState: GetState) => {
    const { options } = getState().options;
    console.log('Resetting..');
    dispatch(setConnection(false));
    dispatch(setExchanges([]));
    ipcRenderer.send('createConnection', options);
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
      content
    });
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
