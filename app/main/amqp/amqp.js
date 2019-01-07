import amqp from 'amqplib';
import EventEmitter from 'events';
import _ from 'lodash';
import axios from 'axios';
import UUID from 'uuid/v1';

// amqp://localhost

class AMQP {
  constructor() {
    const self = this;
    self._channel = null;
    self._conn = null;
    self._exchanges = null;
    self._emmitter = new EventEmitter();
  }

  createConnection(options, cb) {
    const self = this;
    const { amqpOptions, httpOptions } = options;

    self.httpOptions = httpOptions;
    self.amqpOptions = amqpOptions;

    console.log(`Connecting to: amqp://${self.amqpOptions.host}`);

    try {
      self._channel.deleteQueue(self.amqpOptions.queue);
    } catch (err) {
      console.log('No queue to delete');
    }

    self
      .setUp()
      .then(exchanges => {
        self._exchanges = exchanges.data;
        cb(null, self._exchanges);
      })
      .catch(err => {
        cb(err);
      });
  }

  setUp() {
    const self = this;
    console.log('Setting up channel');
    self._conn = null;
    self._channel = null;
    return amqp
      .connect(
        `${self.amqpOptions.protocol}://${self.amqpOptions.host}?heartbeat=2`
      )
      .then(conn => {
        self._conn = conn;
        return self._conn.createChannel();
      })
      .then(ch => {
        self._channel = ch;
      })
      .then(() =>
        self._channel.assertQueue(self.amqpOptions.queue, {
          durable: false,
          // exclusive: true,
          autoDelete: true
        })
      )
      .then(() => self.getExchanges())
      .catch(err => {
        console.log('Error');
        console.log(err);
        self._emmitter.emit('error');
      });
  }

  async getExchanges() {
    const self = this;
    const exchangeUrl = `${self.httpOptions.protocol}://${
      self.httpOptions.host
    }:${self.httpOptions.port}/api/exchanges`;
    console.log(`Getting exchanges: ${exchangeUrl}`);
    return axios.get(exchangeUrl, {
      auth: {
        username: self.httpOptions.username,
        password: self.httpOptions.password
      }
    });
  }

  bindExchanges(exchanges) {
    const self = this;
    self._channel
      .deleteQueue(self.amqpOptions.queue)
      .then(() =>
        self._channel.assertQueue(self.amqpOptions.queue, {
          durable: false,
          // exclusive: true,
          autoDelete: true
        })
      )
      .then(() => {
        exchanges = _.map(exchanges, exchange =>
          self._channel
            .assertExchange(exchange.name, exchange.type, {
              durable: exchange.durable
            })
            .then(() =>
              self._channel.bindQueue(
                self.amqpOptions.queue,
                exchange.name,
                '#'
              )
            )
        );
        return Promise.all(exchanges).then(res => {
          self._channel.consume(
            self.amqpOptions.queue,
            msg => {
              if (msg && msg.content) {
                self._emmitter.emit('message', msg);
                console.log('Got a message');
                self._channel.ack(msg);
              } else {
                console.log('Ignored a message with no content');
              }
            },
            {
              consumerTag: 'QueueBunnyUI'
            }
          );
          self._emmitter.emit('connected');
        });
      })
      .catch(err => {
        console.log('ERROR');
        console.log(err);
        self._emmitter.emit('error');
      });
  }

  publish(msg) {
    const self = this;
    const { exchangeName, routingKey, content } = msg;
    // content.messageId = UUID();
    try {
      self._channel.publish(exchangeName, routingKey, Buffer.from(content));
    } catch (err) {
      console.log('ERROR');
      console.log(err);
      self._emmitter.emit('error');
    }
  }

  pauseConsume() {
    const self = this;
    console.log('Pausing Consume');
    self._channel.consume(self.amqpOptions.queue, false);
  }

  resumeConsume() {
    const self = this;
    console.log('Resuming Consume');
    self._channel.consume(
      self.amqpOptions.queue,
      msg => {
        if (msg && msg.content) {
          self._emmitter.emit('message', msg);
          console.log('Got a message');
          self._channel.ack(msg);
        } else {
          console.log('Ignored a message with no content');
        }
      },
      {
        consumerTag: 'QueueBunnyUI'
      }
    );
  }

  on(event, cb) {
    const self = this;
    self._emmitter.on(event, cb);
  }
}

export default new AMQP();
