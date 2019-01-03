// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import Grid from '@material-ui/core/Grid';

import * as MessageActions from '../actions/messages';
import * as AmqpActions from '../actions/amqp';

import MessageList from '../components/MessageList';
import QueueOptions from '../components/QueueOptions';

const styles = () => ({
  container: {
    height: '100%'
  }
});

type Props = {
  exchanges: Array,
  connection: boolean,
  messages: Array,
  addMessage: () => void,
  clearMessages: () => void,
  setExchanges: () => void,
  reset: () => void,
  bindExchanges: () => void,
  createConnection: () => void,
  setConnection: () => void,
  clearMessages: () => void,
  classes: object
};

class QueueMonitor extends Component<Props> {
  props: Props;

  state = {
    messageFeedVisible: false
  };

  componentDidMount() {
    const { setExchanges, addMessage, reset, setConnection } = this.props;
    ipcRenderer.on('ready', (e, exchanges) => {
      setExchanges(exchanges);
      setConnection(true);
    });
    ipcRenderer.on('bindComplete', () => {
      this.setState({
        messageFeedVisible: true
      });
    });
    ipcRenderer.on('message', (e, msg) => {
      addMessage(msg);
    });
    ipcRenderer.on('error', () => {
      reset();
    });
  }

  render() {
    const {
      classes,
      exchanges,
      messages,
      bindExchanges,
      connection,
      clearMessages
    } = this.props;
    const { messageFeedVisible } = this.state;
    return (
      <Grid container direction="column">
        <Grid item>
          <QueueOptions
            exchanges={exchanges}
            connection={connection}
            bindExchanges={bindExchanges}
            clearMessages={clearMessages}
          />
        </Grid>
        <Grid item>
          <MessageList
            messages={messages}
            messageFeedVisible={messageFeedVisible}
          />
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  messages: state.messages.messages,
  exchanges: state.amqp.exchanges,
  connection: state.amqp.connection
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(_.assign({}, AmqpActions, MessageActions), dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(QueueMonitor));
