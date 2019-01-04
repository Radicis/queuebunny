// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import AddEvent from '../dialogs/AddEvent';
import Editor from './Editor';

const styles = () => ({
  editor: {
    flexGrow: 1,
    height: 'calc(100% - 250px)'
  },
  fullHeight: {
    height: '100%'
  },
  button: {
    marginRight: 10
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

  handleRoutingKeyChange = e => {
    const { updateEvent, selectedEvent } = this.props;
    updateEvent(selectedEvent.id, {
      routingKey: e.target.value
    });
  };

  handlePublish = () => {
    const { publish, selectedEvent } = this.props;
    const { exchange, routingKey, content } = selectedEvent;
    publish(exchange, routingKey, JSON.stringify(content || {}));
  };

  handlePublish100 = () => {
    const { publish, selectedEvent } = this.props;
    const { exchange, routingKey, content } = selectedEvent;
    for (let i = 0; i < 100; i += 1) {
      publish(exchange, routingKey, JSON.stringify(content || {}));
    }
  };

  updateEventContent = content => {
    console.log(content);
    const { updateEvent, selectedEvent } = this.props;
    updateEvent(selectedEvent.id, {
      content
    });
  };

  handleDelete = () => {
    console.log('Delete');
  };

  render() {
    const {
      classes,
      addEvent,
      selectedEvent,
      events,
      connection,
      exchanges,
      lightTheme
    } = this.props;

    const { dialogAddEventOpen } = this.state;

    return (
      <Grid
        container
        spacing={24}
        direction="row"
        className={classes.fullHeight}
      >
        <Grid item xs={12}>
          <Select
            value={selectedEvent ? selectedEvent.id : ' '}
            onChange={this.handleEventChange}
            fullWidth
          >
            {events.map(e => (
              <MenuItem value={e.id}>{e.name}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12}>
          <Select
            disabled={!(selectedEvent && connection)}
            value={
              selectedEvent && selectedEvent.exchange
                ? selectedEvent.exchange.name
                : ' '
            }
            onChange={this.handleExchangeChange}
            fullWidth
          >
            {exchanges.map(e => (
              <MenuItem value={e.name}>{e.name}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled={!(selectedEvent && connection)}
            required
            margin="dense"
            value={selectedEvent.routingKey}
            onChange={this.handleRoutingKeyChange}
            fullWidth
          />
        </Grid>
        <Grid item className={classes.editor} xs={12}>
          <Editor
            lightTheme={lightTheme}
            content={selectedEvent.content}
            updateContent={this.updateEventContent}
          />
        </Grid>
        <Grid item>
          <Button
            onClick={this.openOptionsDialog}
            className={classes.button}
            variant="contained"
            color="primary"
          >
            Add New
          </Button>
          <Button
            onClick={this.handleDelete}
            className={classes.button}
            variant="contained"
            color="secondary"
          >
            Delete
          </Button>
          <Button
            variant="contained"
            className={classes.button}
            color="primary"
            onClick={this.handlePublish}
            disabled={
              !(
                connection &&
                selectedEvent &&
                selectedEvent.exchange &&
                selectedEvent.routingKey
              )
            }
          >
            Send it
          </Button>
          <Button
            variant="contained"
            className={classes.button}
            color="primary"
            onClick={this.handlePublish100}
            disabled={
              !(
                connection &&
                selectedEvent &&
                selectedEvent.exchange &&
                selectedEvent.routingKey
              )
            }
          >
            Send 100
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
