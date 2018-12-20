// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

const styles = () => ({});

type Props = {
  selectEvent: () => void,
  addEvent: () => void,
  deleteEvent: () => void,
  updateevent: () => void,
  events: Array,
  exchanges: Array,
  selectedEvent: object,
  classes: object
};

class Events extends Component<Props> {
  props: Props;

  state = {};

  handleEventChange = (e) => {
    console.log('Event change');
  }

  render() {
    const {
      classes,
      selectEvent,
      addEvent,
      deleteEvent,
      updateevent,
      selectedEvent,
      events,
      exchanges
    } = this.props;
    const {} = this.state;
    console.log(this.props);
    return (
      <Grid container spacing={24} direction="column" alignItems="stretch">
        <Grid item>
            <Select
              value={selectedEvent ? selectedEvent.id : null}
              onChange={this.handleEventChange}
              fullWidth
            >
              <MenuItem value={null}>
                <em>Select Event</em>
              </MenuItem>
              {events.map(e => (
                <MenuItem value={e.id}>{e.name}</MenuItem>
              ))}
            </Select>
            </Grid>
            <Grid item>
            <Select
              value={selectedEvent && selectedEvent.exchange ? selectedEvent.exchange.name : ''}
              onChange={this.handleExchangeChange}
              fullWidth
            >
              <MenuItem value="">
                <em>Select Exchange</em>
              </MenuItem>
              {exchanges.map(e => (
                <MenuItem value={e.name}>{e.name}</MenuItem>
              ))}
            </Select>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Events);
