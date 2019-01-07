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
import ShowMessage from '../dialogs/ShowMessage';

const styles = () => ({
  container: {
    height: 'calc(100% - 70px)',
    width: '100%',
    overflow: 'hidden'
  },
  fullHeight: {
    height: '100%',
    overflow: 'auto'
  }
});

type Props = {
  exchanges: Array,
  connection: boolean,
  messages: Array,
  addMessage: () => void,
  clearMessages: () => void,
  setExchanges: () => void,
  createConnection: () => void,
  bindExchanges: () => void,
  setConnection: () => void,
  clearMessages: () => void,
  pauseMessages: () => void,
  resumeMessages: () => void,
  isPaused: boolean,
  classes: object
};

class QueueMonitor extends Component<Props> {
  props: Props;

  state = {
    messageFeedVisible: false,
    showMessageOpen: false,
    message: {}
  };

  componentDidMount() {
    const { setExchanges, addMessage, createConnection, setConnection } = this.props;
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
      createConnection();
    });
  }

  componentWillUnmount() {
    ipcRenderer.on('ready', false);
    ipcRenderer.on('bindComplete', false);
    ipcRenderer.on('message', false);
    ipcRenderer.on('error', false);
  }

  openShowMessage = message => {
    this.setState({
      showMessageOpen: true,
      message
    });
  };

  closeDialogs = () => {
    this.setState({
      showMessageOpen: false
    });
  };

  render() {
    const {
      classes,
      exchanges,
      messages,
      bindExchanges,
      connection,
      clearMessages,
      isPaused,
      pauseMessages,
      resumeMessages
    } = this.props;
    const {
      messageFeedVisible,
      showMessageOpen,
      shownMessage,
      message
    } = this.state;
    return (
      <div className={classes.container}>
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="center"
          spacing={16}
          className={classes.container}
        >
          <Grid item xs={12}>
            <QueueOptions
              exchanges={exchanges}
              isPaused={isPaused}
              pauseMessages={pauseMessages}
              resumeMessages={resumeMessages}
              connection={connection}
              bindExchanges={bindExchanges}
              clearMessages={clearMessages}
            />
          </Grid>
          <Grid item className={classes.fullHeight} xs={12}>
            <MessageList
              messages={messages}
              showMessage={this.openShowMessage}
              messageFeedVisible={messageFeedVisible}
            />
          </Grid>
        </Grid>
        {showMessageOpen ? (
          <ShowMessage
            showMessage={shownMessage}
            message={message}
            handleOk={this.closeDialogs}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  messages: state.messages.messages,
  exchanges: state.amqp.exchanges,
  connection: state.amqp.connection,
  isPaused: state.amqp.isPaused
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(_.assign({}, AmqpActions, MessageActions), dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(QueueMonitor));
