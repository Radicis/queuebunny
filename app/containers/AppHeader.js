// @flow
import React, { Component } from 'react';
import {withStyles} from '@material-ui/core/styles';
import {bindActionCreators} from "redux";
import _ from "lodash";
import connect from "react-redux/es/connect/connect";
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Settings from '@material-ui/icons/Settings';

import * as OptionsActions from '../actions/options';

import SetOptions from "../dialogs/SetOptions";

const styles = () => ({
  grow: {
    flexGrow: 1
  },
});

type Props = {
  updateOptions: () => void,
  toggleMenuCollapse: () => void,
  options: object,
  menuCollapsed: boolean,
  classes: object
};

class AppHeader extends Component<Props> {
  props: Props;

  state = {
    dialogOptionsOpen: false
  };

  openOptionsDialog = () => {
    this.setState({
      dialogOptionsOpen: true
    });
  };

  /**
   * Closes the dialogs
   */
  closeDialogs = () => {
    this.setState({
      dialogOptionsOpen: false
    });
  };

  /**
   * Updates the options
   * @param options
   */
  setOptions = options => {
    const { updateOptions } = this.props;
    updateOptions(options);
    this.closeDialogs();
  };

  render() {
    const { classes, lightTheme, menuCollapsed, toggleMenuCollapse } = this.props;
    const { dialogOptionsOpen } = this.state;
    return (
      <div>
        <AppBar position="sticky" color="default">
          <Toolbar>
            <IconButton onClick={toggleMenuCollapse} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" className={classes.grow}>App Thingerer!</Typography>
            <IconButton color="default" onClick={this.openOptionsDialog}>
              <Settings/>
            </IconButton>
          </Toolbar>
        </AppBar>

        <SetOptions
          lightTheme={lightTheme}
          open={dialogOptionsOpen}
          handleOk={this.setOptions}
          handleClose={this.closeDialogs}
        />

      </div>
    );
  }
};

const mapStateToProps = state => ({
  options: state.options.options,
  menuCollapsed: state.options.menuCollapsed
});

const mapDispatchToProps = (dispatch) => (bindActionCreators(_.assign({}, OptionsActions), dispatch));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AppHeader));