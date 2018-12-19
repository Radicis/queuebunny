// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import options from './options';
import amqp from './amqp';
import events from './events';
import messages from './messages';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    options,
    amqp,
    events,
    messages
  });
}
