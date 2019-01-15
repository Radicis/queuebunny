// @flow
import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

type Props = {
  open: boolean,
  itemId: string,
  handleClose: () => void,
  handleOk: () => void
};

const DeleteConfirm = (props: Props) => {
  const { open, itemId, handleClose, handleOk } = props;
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Really Delete?</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this event?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit" variant="contained">
          Cancel
        </Button>
        <Button onClick={() => handleOk(itemId)} color="primary" variant="contained">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirm;
