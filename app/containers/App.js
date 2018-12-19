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
import AppHeader from './AppHeader';
import Menu from './Menu';

const styles = theme => ({
  mainContainer: {
    width: '100%',
    height: '100%',
    paddingTop: theme.spacing.unit * 2,
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
  classes: object
};

const primary = {
  light: '#03A9F4',
  main: '#607D8B',
  dark: '#455A64',
  contrastText: '#212121'
};

const secondary = {
  light: '#89e9ff',
  main: '#03A9F4',
  dark: '#026a99',
  contrastText: '#fff'
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
    const { getOptionsFromStore, options } = this.props;
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
                <Menu />
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
  bindActionCreators(_.assign({}, OptionsActions), dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(App));
