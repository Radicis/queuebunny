// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';

import AddEvent from '../dialogs/AddEvent';
import Editor from './Editor';

const styles = () => ({
  grow: {
    flexGrow: 1
  },
  fullHeight: {
    height: '100%'
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
  classes: object
};

class Events extends Component<Props> {
  props: Props;

  state = {
    dialogAddEventOpen: false
  };

  componentWillMount() {
    const { getEventsFromStore } = this.props;
    getEventsFromStore();
  }

  openOptionsDialog = () => {
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

  handleEventChange = e => {
    const { selectEvent } = this.props;
    selectEvent(e.target.value);
  };

  handleExchangeChange = e => {
    const { updateEvent, selectedEvent, exchanges } = this.props;
    console.log(e.target.value);
    updateEvent(selectedEvent.id, {
      exchange: _.find(exchanges, ex => ex.name === e.target.value)
    });
  };

  handlePublish = () => {
    const { publish, selectedEvent } = this.props;
    const { exchange } = selectedEvent;
    publish(exchange, 'test', JSON.stringify({ hello: true }));
  };

  updateEventContent = content => {
    console.log(content);
    const { updateEvent, selectedEvent } = this.props;
    updateEvent(selectedEvent.id, {
      content
    });
  };

  render() {
    const {
      classes,
      addEvent,
      deleteEvent,
      selectedEvent,
      events,
      connection,
      exchanges
    } = this.props;

    const { dialogAddEventOpen } = this.state;

    return (
      <Grid
        container
        spacing={24}
        direction="column"
        alignItems="stretch"
        className={classes.fullHeight}
      >
        <Grid item>
          <Select
            value={selectedEvent ? selectedEvent.id : ' '}
            onChange={this.handleEventChange}
            fullWidth
          >
            <MenuItem value=" ">
              <em>Select Event</em>
            </MenuItem>
            {events.map(e => (
              <MenuItem value={e.id}>{e.name}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item>
          <Select
            disabled={!connection}
            value={
              selectedEvent && selectedEvent.exchange
                ? selectedEvent.exchange.name
                : ' '
            }
            onChange={this.handleExchangeChange}
            fullWidth
          >
            <MenuItem value=" ">
              <em>Select Exchange</em>
            </MenuItem>
            {exchanges.map(e => (
              <MenuItem value={e.name}>{e.name}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item className={classes.grow}>
          <Editor
            content={selectedEvent.content}
            updateContent={this.updateEventContent}
          />
        </Grid>
        <Grid item>
          <Button
            onClick={this.openOptionsDialog}
            variant="contained"
            color="primary"
          >
            Add New
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handlePublish}
            disabled={!connection || !(selectedEvent || selectedEvent.exchange)}
          >
            Send it
          </Button>
        </Grid>
        <AddEvent
          open={dialogAddEventOpen}
          handleOk={addEvent}
          handleClose={this.closeDialogs}
        />
      </Grid>
    );
  }
}

export default withStyles(styles)(Events);
