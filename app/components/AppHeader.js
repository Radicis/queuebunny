// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Settings from '@material-ui/icons/Settings';
import AutoRenew from '@material-ui/icons/Autorenew';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';

import SetOptions from '../dialogs/SetOptions';

const drawerWidth = 440;

const styles = theme => ({
  grow: {
    flexGrow: 1
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: 'none'
  }
});

type Props = {
  updateOptions: () => void,
  menuCollapsed: boolean,
  toggleMenuCollapse: () => void,
  purgeEvents: () => void,
  createConnection: () => void,
  lightTheme: boolean,
  httpOptions: object,
  amqpOptions: object,
  loading: boolean,
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
    const {
      classes,
      lightTheme,
      createConnection,
      purgeEvents,
      toggleMenuCollapse,
      menuCollapsed,
      httpOptions,
      amqpOptions,
      loading
    } = this.props;

    const { dialogOptionsOpen } = this.state;
    return (
      <div>
        <AppBar
          color="primary"
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: !menuCollapsed
          })}
        >
          <Toolbar disableGutters={menuCollapsed}>
            <IconButton onClick={toggleMenuCollapse} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow} noWrap>
              Queue Bunny @ {amqpOptions.queue}
            </Typography>
            <IconButton color="inherit" onClick={createConnection}>
              <AutoRenew />
            </IconButton>
            <IconButton color="inherit" onClick={this.openOptionsDialog}>
              <Settings />
            </IconButton>
          </Toolbar>

          {loading ? <LinearProgress /> : ''}
        </AppBar>

        {dialogOptionsOpen ? (
          <SetOptions
            amqpOptions={amqpOptions}
            httpOptions={httpOptions}
            lightTheme={lightTheme}
            open={dialogOptionsOpen}
            handleOk={this.setOptions}
            purgeEvents={purgeEvents}
            handleClose={this.closeDialogs}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default withStyles(styles)(AppHeader);
