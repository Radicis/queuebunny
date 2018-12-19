// @flow
import _ from 'lodash';
import amqp from 'amqplib';
import EventEmitter from 'events';
import axios from 'axios';
import UUID from 'uuid/v1';

import type { Dispatch, GetState } from '../reducers/types';

export const SET_CONNECTION = 'SET_CONNECTION';
export const SET_CHANNEL = 'SET_CHANNEL';

export function createConnection() {
  return (dispatch: Dispatch, getState: GetState) => {
    const { host, port, user, password } = getState().options.amqp;
    const connectionString = `${user}:${password}@${host}:${port}`;
    return amqp
      .connect(connectionString)
      .then(conn => {
        dispatch(setConnection(conn));
        return getState().amqp.connection.createChannel();
      })
      .then(ch => {
        dispatch(setChannel(ch));
      })
      .then(() => {
        getState().amqp.channel.assertQueue(queue, { durable: false, autoDelete: true });
      })
      .then(() => {
        return getExchanges();
      })
      .catch(() => {
        emitter.emit('error');
      });
  };
}

async function getExchanges () {
  const { host, port, user, password } = getState().options.http;
  const exchangeUrl = `${host}:${port}/api/exchanges`;
  console.log(`Getting exchanges: ${exchangeUrl}`);
  return axios.get(exchangeUrl, {
    auth: {
      username: user,
      password: password
    }
  });
}

function bindExchanges (exchanges) {
  return (getState: GetState) => {
    const { channel, exchanges } = getState().amqp;
    const { queue } = getState().options;
    channel.deleteQueue(queue).then(() => {
      return channel.assertQueue(queue, { durable: false, autoDelete: true });
    }).then(() => {
      exchanges = _.map(exchanges, (exchange) => {
        return channel.assertExchange(exchange.name, exchange.type, {durable: exchange.durable}).then(() => {
          return channel.bindQueue(queue, exchange.name, '#');
        });
      });
      return Promise.all(exchanges).then(() => {
        console.log('Connected to all exchanges');
          channel.consume(queue, (msg) => {
          if (msg && msg.content) {
            emitter.emit('msg', msg);
            console.log('Got a message');
            channel.ack(msg);
          } else {
            console.log('Ignored a message with no content');
          }
        });
        emitter.emit('connected');
      });
    }).catch(() => {
      emitter.emit('error');
    });
  }
}

function publish (msg) {
  const { channel } = getState().amqp;
  const { exchangeName, routingKey, content } = msg;
  content.messageId = UUID();
  channel.publish(exchangeName, routingKey, Buffer.from(content));
}

function on (event, cb) {
  emitter.on(event, cb);
}

export function setConnection(connection) {
  return {
    type: SET_CONNECTION,
    connection
  };
}

export function setChannel(channel) {
  return {
    type: SET_CHANNEL,
    channel
  };
}
