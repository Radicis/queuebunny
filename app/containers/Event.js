// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as EventActions from '../actions/events';
import * as AmqpActions from '../actions/amqp';

import Events from '../components/Events';

const styles = () => ({});

type Props = {
  selectEvent: () => void,
  addEvent: () => void,
  deleteEvent: () => void,
  updateEvent: () => void,
  publish: () => void,
  getEventsFromStore: () => void,
  events: Array,
  exchanges: Array,
  selectedEvent: object,
  connection: boolean,
  classes: object
};

const mapStateToProps = state => ({
  events: state.events.events,
  exchanges: state.amqp.exchanges,
  selectedEvent: state.events.selectedEvent,
  connection: state.amqp.connection
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(_.assign({}, EventActions, AmqpActions), dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Events));
