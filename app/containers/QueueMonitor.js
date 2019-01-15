// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import * as MessageActions from '../actions/messages';
import * as AmqpActions from '../actions/amqp';

import MessageList from '../components/MessageList';
import QueueOptions from '../components/QueueOptions';
import ShowMessage from '../dialogs/ShowMessage';
import ShowError from '../dialogs/ShowError';

const styles = () => ({
  fullHeight: {
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
  bindExchanges: () => void,
  setConnection: () => void,
  clearMessages: () => void,
  hasBindings: boolean,
  classes: object
};

class QueueMonitor extends Component<Props> {
  props: Props;

  state = {
    showMessageOpen: false,
    showErrorOpen: false,
    currentError: null,
    message: {}
  };

  /**
   * On mount, set up the event listeners for the ipcRenderer bridge
   */
  componentDidMount() {
    const { setExchanges, addMessage, setConnection } = this.props;
    ipcRenderer.on('ready', (e, exchanges) => {
      setExchanges(exchanges);
      setConnection(true);
    });
    ipcRenderer.on('message', (e, msg) => {
      addMessage(msg);
    });
    ipcRenderer.on('error', (e, err) => {
      if (!_.isEqual(err, {})) {
        this.displayError(err);
        setConnection(false); // it is likely that the error broke the amqp connection
      }
    });
  }

  /**
   * On unmount, clear the event listeners to prevent duplicate events
   */
  componentWillUnmount() {
    ipcRenderer.on('ready', false);
    ipcRenderer.on('bindComplete', false);
    ipcRenderer.on('message', false);
    ipcRenderer.on('error', false);
  }

  /**
   * Show the error dialog with the generated error
   * @param currentError
   */
  displayError = currentError => {
    this.setState({
      showErrorOpen: true,
      currentError
    });
  };

  /**
   * Display the message details
   * @param message
   */
  openShowMessage = message => {
    this.setState({
      showMessageOpen: true,
      message
    });
  };

  /**
   * Close all dialogs
   */
  closeDialogs = () => {
    this.setState({
      showMessageOpen: false,
      showErrorOpen: false
    });
  };

  render() {
    const { classes, exchanges, messages, bindExchanges, connection, clearMessages, hasBindings } = this.props;
    const { showMessageOpen, shownMessage, message, showErrorOpen, currentError } = this.state;
    return (
      <div className={classes.fullHeight}>
        <Grid container direction="row" spacing={16} className={classes.fullHeight}>
          <Grid item xs={12}>
            <QueueOptions
              exchanges={exchanges}
              hasBindings={hasBindings}
              connection={connection}
              bindExchanges={bindExchanges}
            />
          </Grid>
          <Grid item xs={12} className={classes.fullHeight}>
            <MessageList messages={messages} clearMessages={clearMessages} showMessage={this.openShowMessage} />
          </Grid>
        </Grid>
        {showMessageOpen ? (
          <ShowMessage showMessage={shownMessage} message={message} handleOk={this.closeDialogs} />
        ) : (
          ''
        )}
        {showErrorOpen ? <ShowError error={currentError} handleOk={this.closeDialogs} /> : ''}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  messages: state.messages.messages,
  exchanges: state.amqp.exchanges,
  connection: state.amqp.connection,
  isPaused: state.amqp.isPaused,
  hasBindings: state.amqp.hasBindings
});

const mapDispatchToProps = dispatch => bindActionCreators(_.assign({}, AmqpActions, MessageActions), dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(QueueMonitor));
