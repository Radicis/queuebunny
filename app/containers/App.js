// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles
} from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import * as OptionsActions from '../actions/options';
import * as AmqpActions from '../actions/amqp';

import AppHeader from './AppHeader';
import Event from './Event';

const styles = theme => ({
  mainContainer: {
    height: 'calc(100% - 16px)',
    padding: theme.spacing.unit * 2,
    overflow: 'hidden',
    borderRadius: 0
  },
  fullHeight: {
    height: '100%'
  }
});

type Props = {
  options: object,
  menuCollapsed: boolean,
  getOptionsFromStore: () => void,
  children: React.Node,
  createConnection: () => void,
  classes: object
};

const primary = {
  light: '#ffc4ff',
  main: '#ce93d8',
  dark: '#9c64a6',
  contrastText: '#212121'
};

const secondary = {
  light: '#b085f5',
  main: '#7e57c2',
  dark: '#4d2c91',
  contrastText: '#ffffff'
};

class App extends Component<Props> {
  props: Props;

  state = {
    theme: createMuiTheme({
      palette: {
        type: 'light',
        primary,
        secondary
      }
    })
  };

  componentWillMount() {
    const { getOptionsFromStore, options, createConnection } = this.props;
    getOptionsFromStore();
    const updatedTheme = {
      palette: {
        type: options.lightTheme ? 'light' : 'dark',
        primary,
        secondary
      }
    };
    this.setState({
      theme: createMuiTheme(updatedTheme)
    });
    createConnection();
  }

  componentDidUpdate() {
    const { options } = this.props;
    const { theme } = this.state;

    const updatedType = options.lightTheme ? 'light' : 'dark';

    const updatedTheme = createMuiTheme({
      palette: {
        type: updatedType,
        primary,
        secondary
      }
    });
    if (theme.palette.type !== updatedType) {
      this.setState({
        theme: createMuiTheme(updatedTheme)
      });
    }
  }

  render() {
    const { classes, children, options, menuCollapsed } = this.props;
    const { theme } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <AppHeader options={options} menuCollapsed={menuCollapsed} />
        <Paper className={classes.mainContainer}>
          {menuCollapsed ? (
            <Grid
              container
              spacing={24}
              alignItems="stretch"
              className={classes.fullHeight}
            >
              <Grid item xs={12} className={classes.fullHeight}>
                <React.Fragment>{children}</React.Fragment>
              </Grid>
            </Grid>
          ) : (
            <Grid
              container
              spacing={24}
              alignItems="stretch"
              className={classes.fullHeight}
            >
              <Grid item xs={4} className={classes.fullHeight}>
                <Event />
              </Grid>

              <Grid item xs={8} className={classes.fullHeight}>
                <React.Fragment>{children}</React.Fragment>
              </Grid>
            </Grid>
          )}
        </Paper>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  options: state.options.options,
  menuCollapsed: state.options.menuCollapsed
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(_.assign({}, OptionsActions, AmqpActions), dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(App));
