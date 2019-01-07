// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  },
  container: {
    height: 'calc(100% - 68px)'
  },
  fullHeight: {
    height: '100%'
  },
  editor: {
    height: '100%',
    width: '100%'
  }
});

type Props = {
  handleOk: () => void,
  error: object,
  classes: object
};

class ShowMessage extends Component<Props> {
  props: Props;

  render() {
    const { classes, error, handleOk } = this.props;
    return (
      <Dialog open>
        <DialogTitle>Message Details</DialogTitle>
        <DialogContent className={classes.fullHeight}>
          <Typography>Error: {error.toString()}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ShowMessage);
