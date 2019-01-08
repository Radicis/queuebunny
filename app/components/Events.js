// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';

import Editor from './Editor';

const styles = () => ({
  editor: {
    flexGrow: 1,
    height: 'calc(100% - 165px)'
  },
  fullHeight: {
    height: '100%'
  }
});

type Props = {
  selectEvent: () => void,
  updateEvent: () => void,
  openAddEventDialog: () => void,
  events: Array,
  exchanges: Array,
  selectedEvent: object,
  classes: object,
  lightTheme: boolean
};

class Events extends Component<Props> {
  props: Props;

  handleEventChange = e => {
    const { selectEvent, openAddEventDialog } = this.props;
    if (!e.target.value) {
      openAddEventDialog();
    } else {
      selectEvent(e.target.value);
    }
  };

  handleExchangeChange = e => {
    const { updateEvent, selectedEvent, exchanges } = this.props;
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

  updateEventContent = content => {
    const { updateEvent, selectedEvent } = this.props;
    if (selectedEvent) {
      updateEvent(selectedEvent.id, {
        content
      });
    }
  };

  render() {
    const { classes, selectedEvent, events, exchanges, lightTheme } = this.props;

    return (
      <Grid container item spacing={24} direction="row" className={classes.fullHeight}>
        <Grid item xs={12}>
          <Select value={selectedEvent ? selectedEvent.id : ' '} onChange={this.handleEventChange} fullWidth>
            {_.isEmpty(events) ? <MenuItem value={null}>Click to Add An Event</MenuItem> : ''}
            {events.map(e => (
              <MenuItem key={e.id} value={e.id}>
                {e.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12}>
          {selectedEvent ? (
            <Select
              value={selectedEvent && selectedEvent.exchange ? selectedEvent.exchange.name : ' '}
              onChange={this.handleExchangeChange}
              fullWidth
            >
              {_.isEmpty(exchanges) ? <MenuItem value="">No Exchanges</MenuItem> : ''}
              {exchanges.map(e => (
                <MenuItem key={e.name} value={e.name}>
                  {e.name}
                </MenuItem>
              ))}
            </Select>
          ) : (
            ''
          )}
        </Grid>
        <Grid item xs={12}>
          {selectedEvent ? (
            <Input
              placeholder="Routing Key"
              required
              margin="dense"
              value={selectedEvent ? selectedEvent.routingKey : ' '}
              onChange={this.handleRoutingKeyChange}
              fullWidth
            />
          ) : (
            ''
          )}
        </Grid>
        <Grid item className={classes.editor} xs={12}>
          {selectedEvent ? (
            <Editor
              lightTheme={lightTheme}
              content={selectedEvent ? selectedEvent.content : ' '}
              updateContent={this.updateEventContent}
            />
          ) : (
            <div />
          )}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Events);
