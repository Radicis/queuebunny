// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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
  messages: Array,
  clearMessages: () => void,
  bindExchanges: () => void,
  createConnection: () => void,
  classes: object
};

class QueueMonitor extends Component<Props> {
  props: Props;

  state = {};

  componentWillMount () {
    const { createConnection } = this.props;
    console.log('Connecting...');
    createConnection();
  }

  render() {
    const { classes, exchanges, messages, setExchanges } = this.props;
    const {} = this.state;
    return (
      <Grid container direction="column">
        <Grid item>
          <QueueOptions exchanges={exchanges} setExchanges={setExchanges} />
        </Grid>
        <Grid item>
          <MessageList messages={messages} />
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  messages: state.messages.messages,
  exchanges: state.amqp.exchanges
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(_.assign({}, AmqpActions, MessageActions), dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(QueueMonitor));