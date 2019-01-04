// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
  }
});

type Props = {
  open: boolean,
  lightTheme: boolean,
  handleClose: () => void,
  handleOk: () => void,
  purgeEvents: () => void
};

class SetOptions extends Component<Props> {
  props: Props;

  state = {
    lightTheme: false
  };

  componentWillMount() {
    const { lightTheme } = this.props;
    this.setState({
      lightTheme
    });
  }

  /**
   * Updates the state when the text input changes
   * @param name
   * @returns {Function}
   */
  handleChange = name => event => {
    this.setState({
      [name]: event.target.checked
    });
  };

  handleOk = () => {
    const { handleOk } = this.props;
    const updatedOptions = _.assign({}, this.state);
    handleOk(updatedOptions);
  };

  render() {
    const { open, handleClose, purgeEvents } = this.props;
    const { lightTheme } = this.state;
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Options</DialogTitle>
        <DialogContent>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={lightTheme}
                  onChange={this.handleChange('lightTheme')}
                  value="light"
                />
              }
              label="Vlad Mode"
            />
          </FormGroup>
          <FormGroup row>
            <Button onClick={purgeEvents}>Purge Events</Button>
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={this.handleOk} color="primary" variant="contained">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(SetOptions);
