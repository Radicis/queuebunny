// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = () => ({
  container: {
    minWidth: '300px'
  },
  fullHeight: {
    height: '100%'
  }
});

type Props = {
  handleOk: () => void,
  error: object,
  classes: object
};

const ShowMessage = (props: Props) => {
  const { classes, error, handleOk } = props;
  return (
    <Dialog open>
      <DialogTitle className={classes.container}>Error!</DialogTitle>
      <DialogContent className={classes.fullHeight}>
        <Typography>Error: {JSON.stringify(error, null, 3)}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(ShowMessage);
