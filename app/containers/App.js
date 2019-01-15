// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';

import classNames from 'classnames';

import * as OptionsActions from '../actions/options';
import * as AmqpActions from '../actions/amqp';
import * as EventActions from '../actions/events';

import AppHeader from '../components/AppHeader';
import Sidebar from './Sidebar';

const drawerWidth = 450;

const styles = theme => ({
  fullHeight: {
    height: '100%'
  },
  mainContainer: {
    height: 'calc(100% - 96px)',
    padding: theme.spacing.unit * 2,
    overflow: 'hidden',
    borderRadius: 0
  },
  padding: {
    padding: 15
  },
  root: {
    display: 'flex',
    height: 'calc(100% + 80px)',
    overflow: 'hidden',
    borderRadius: 0,
    backgroundColor: '#424242'
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    padding: 15
  },
  drawerPaper: {
    width: drawerWidth,
    padding: 15
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  },
  content: {
    flexGrow: 1,
    width: '100%',
    padding: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -(drawerWidth + 30)
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
});

type Props = {
  httpOptions: object,
  amqpOptions: object,
  menuCollapsed: boolean,
  connection: boolean,
  toggleMenuCollapse: () => void,
  getOptionsFromStore: () => void,
  purgeEvents: () => void,
  children: React.Node,
  updateOptions: () => void,
  purgeEvents: () => void,
  lightTheme: boolean,
  createConnection: () => void,
  loading: boolean,
  classes: object
};

/**
 * Defines the primary palette for dark mode
 * @type {{light: string, main: string, dark: string, contrastText: string}}
 */
const primary = {
  light: '#ffc4ff',
  main: '#ce93d8',
  dark: '#9c64a6',
  contrastText: '#212121'
};

/**
 * Defines the primary palette for light mode
 * @type {{light: string, main: string, dark: string, contrastText: string}}
 */
const primaryLight = {
  light: '#00e2ff',
  main: '#2e96d8',
  dark: '#276ba6',
  contrastText: '#ededed'
};

/**
 * Defines the secondary palette
 * @type {{light: string, main: string, dark: string, contrastText: string}}
 */
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
      typography: {
        useNextVariants: true
      },
      palette: {
        type: 'light',
        primary,
        secondary
      }
    })
  };

  /**
   * On mount, create a theme from the options
   */
  componentWillMount() {
    const { getOptionsFromStore, lightTheme, createConnection } = this.props;
    getOptionsFromStore();
    const updatedTheme = {
      typography: {
        useNextVariants: true
      },
      palette: {
        type: lightTheme ? 'light' : 'dark',
        primary: lightTheme ? primaryLight : primary,
        secondary
      }
    };
    this.setState({
      theme: createMuiTheme(updatedTheme)
    });
    createConnection();
  }

  /**
   * On update, create a theme from the options
   */
  componentDidUpdate() {
    const { lightTheme } = this.props;
    const { theme } = this.state;

    const updatedType = lightTheme ? 'light' : 'dark';

    const updatedTheme = createMuiTheme({
      typography: {
        useNextVariants: true
      },
      palette: {
        type: lightTheme ? 'light' : 'dark',
        primary: lightTheme ? primaryLight : primary,
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
    const {
      classes,
      children,
      connection,
      menuCollapsed,
      purgeEvents,
      updateOptions,
      toggleMenuCollapse,
      createConnection,
      lightTheme,
      amqpOptions,
      httpOptions,
      loading
    } = this.props;
    const { theme } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <AppHeader
            loading={loading}
            httpOptions={httpOptions}
            connection={connection}
            amqpOptions={amqpOptions}
            updateOptions={updateOptions}
            menuCollapsed={menuCollapsed}
            toggleMenuCollapse={toggleMenuCollapse}
            purgeEvents={purgeEvents}
            createConnection={createConnection}
            lightTheme={lightTheme}
          />

          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={!menuCollapsed}
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <Sidebar />
          </Drawer>
          <main
            className={classNames(classes.content, {
              [classes.contentShift]: !menuCollapsed
            })}
          >
            <div className={classes.drawerHeader} />
            <Paper className={classes.mainContainer}>
              <React.Fragment>{children}</React.Fragment>
            </Paper>
          </main>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  httpOptions: state.options.options.httpOptions,
  amqpOptions: state.options.options.amqpOptions,
  menuCollapsed: state.options.menuCollapsed,
  lightTheme: state.options.options.lightTheme,
  connection: state.amqp.connection,
  loading: state.amqp.loading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(_.assign({}, OptionsActions, AmqpActions, EventActions), dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(App));
