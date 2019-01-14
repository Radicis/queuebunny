// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import Grid from '@material-ui/core/Grid/Grid';
import * as AmqpActions from '../actions/amqp';
import * as EventActions from '../actions/events';
import AddEvent from '../dialogs/AddEvent';

import Events from '../components/Events';
import EventControls from '../components/EventControls';

const styles = () => ({
  fullHeight: {
    height: 'calc(100% - 30px)'
  }
});

type Props = {
  selectEvent: () => void,
  addEvent: () => void,
  deleteEvent: () => void,
  updateEvent: () => void,
  publish: () => void,
  getEventsFromStore: () => void,
  connection: boolean,
  events: Array,
  exchanges: Array,
  selectedEvent: object,
  classes: object,
  lightTheme: boolean
};

class Sidebar extends Component<Props> {
  props: Props;

  state = {
    dialogAddEventOpen: false
  };

  /**
   * On mount, get the options from the store
   */
  componentWillMount() {
    const { getEventsFromStore } = this.props;
    getEventsFromStore();
  }

  /**
   * Show the add event dialog
   */
  openAddEventDialog = () => {
    this.setState({
      dialogAddEventOpen: true
    });
  };

  /**
   * Closes the dialogs
   */
  closeDialogs = () => {
    this.setState({
      dialogAddEventOpen: false
    });
  };

  /**
   * Publish a message
   */
  handlePublish = () => {
    const { publish, selectedEvent } = this.props;
    const { exchange, routingKey, content } = selectedEvent;
    publish(exchange, routingKey, JSON.stringify(content || {}));
  };

  /**
   * Publish x100
   */
  handlePublish100 = () => {
    for (let i = 0; i < 100; i += 1) {
      this.handlePublish();
    }
  };

  /**
   * Delete an event
   */
  handleDelete = () => {
    const { selectedEvent, deleteEvent } = this.props;
    deleteEvent(selectedEvent.id);
  };

  /**
   * Add an event
   * @param name
   */
  handleAddEvent = name => {
    const { addEvent } = this.props;
    this.closeDialogs();
    addEvent(name);
  };

  render() {
    const { classes, selectEvent, updateEvent, selectedEvent, events, connection, exchanges, lightTheme } = this.props;

    const { dialogAddEventOpen } = this.state;
    return (
      <Grid container justify="center" alignItems="center" spacing={24} direction="row" className={classes.fullHeight}>
        <Events
          selectEvent={selectEvent}
          updateEvent={updateEvent}
          events={events}
          openAddEventDialog={this.openAddEventDialog}
          exchanges={exchanges}
          selectedEvent={selectedEvent}
          lightTheme={lightTheme}
        />

        <EventControls
          connection={connection}
          openAddEventDialog={this.openAddEventDialog}
          handleDelete={this.handleDelete}
          handlePublish={this.handlePublish}
          handlePublish100={this.handlePublish100}
          selectedEvent={selectedEvent}
        />

        <AddEvent open={dialogAddEventOpen} handleOk={this.handleAddEvent} handleClose={this.closeDialogs} />
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  events: state.events.events,
  exchanges: state.amqp.exchanges,
  selectedEvent: state.events.selectedEvent,
  connection: state.amqp.connection,
  lightTheme: state.options.options.lightTheme
});

const mapDispatchToProps = dispatch => bindActionCreators(_.assign({}, EventActions, AmqpActions), dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Sidebar));
