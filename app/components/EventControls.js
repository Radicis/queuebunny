// @flow
import React from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

type Props = {
  handleDelete: () => void,
  openAddEventDialog: () => void,
  handlePublish: () => void,
  handlePublish100: () => void,
  connection: boolean,
  selectedEvent: object
};

const EventControls = (props: Props) => {
  const { selectedEvent, openAddEventDialog, handlePublish, handlePublish100, handleDelete, connection } = props;

  return (
    <Grid container justify="space-around" alignItems="center" item xs={12} spacing={8}>
      <Grid item>
        <Button onClick={openAddEventDialog} variant="contained" color="primary">
          Add New
        </Button>
      </Grid>

      <Grid item>
        <Button onClick={handleDelete} variant="contained" color="light" disabled={!selectedEvent}>
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
};

export default EventControls;
