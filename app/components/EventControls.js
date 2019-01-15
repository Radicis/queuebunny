// @flow
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import DeleteConfirm from '../dialogs/DeleteConfirm';

type Props = {
  handleDelete: () => void,
  openAddEventDialog: () => void,
  handlePublish: () => void,
  handlePublish100: () => void,
  connection: boolean,
  selectedEvent: object
};

class EventControls extends Component<Props> {
  props: Props;

  state = {
    dialogOpen: false,
    eventId: null
  };

  /**
   * Displays the delete dialog
   * @param eventId
   */
  openDeleteDialog = eventId => {
    this.setState({
      dialogOpen: true,
      eventId
    });
  };

  /**
   * Closes the dialog
   */
  closeDialog = () => {
    this.setState({
      dialogOpen: false
    });
  };

  /**
   * Removes the item from the store and state
   * @param eventId
   */
  removeItem = eventId => {
    const { handleDelete } = this.props;
    handleDelete(eventId);
    this.closeDialog();
  };

  render() {
    const { selectedEvent, openAddEventDialog, handlePublish, handlePublish100, connection } = this.props;
    const { dialogOpen, eventId } = this.state;

    return (
      <Grid container justify="space-around" alignItems="center" item xs={12} spacing={8}>
        <Grid item>
          <Button onClick={openAddEventDialog} variant="contained" color="primary">
            Add New
          </Button>
        </Grid>

        <Grid item>
          <Button onClick={this.openDeleteDialog} variant="contained" color="inherit" disabled={!selectedEvent}>
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
        <DeleteConfirm open={dialogOpen} itemId={eventId} handleOk={this.removeItem} handleClose={this.closeDialog} />
      </Grid>
    );
  }
}

export default EventControls;
