// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const styles = () => ({});

type Props = {
  handleDelete: () => void,
  openAddEventDialog: () => void,
  handlePublish: () => void,
  handlePublish100: () => void,
  connection: object,
  selectedEvent: object
};

class EventControls extends Component<Props> {
  props: Props;

  render() {
    const { selectedEvent, openAddEventDialog, handlePublish, handlePublish100, handleDelete, connection } = this.props;

    return (
      <Grid container justify="space-around" alignItems="center" item xs={12} spacing={8}>
        <Grid item>
          <Button onClick={openAddEventDialog} variant="contained" color="primary">
            Add New
          </Button>
        </Grid>

        <Grid item>
          <Button onClick={handleDelete} variant="contained" color="secondary" disabled={!selectedEvent}>
            Delete
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePublish}
            disabled={!(connection && selectedEvent && selectedEvent.exchange && selectedEvent.routingKey)}
          >
            Send it
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePublish100}
            disabled={!(connection && selectedEvent && selectedEvent.exchange && selectedEvent.routingKey)}
          >
            Send 100
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(EventControls);
