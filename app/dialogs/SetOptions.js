// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField/TextField';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  tabs: {
    backgroundColor: theme.palette.background.paper
  }
});

type Props = {
  open: boolean,
  lightTheme: boolean,
  amqpOptions: object,
  httpOptions: object,
  handleClose: () => void,
  handleOk: () => void,
  purgeEvents: () => void
};

function TabContainer(props) {
  const { children } = props;
  return <div style={{ paddingTop: 20 }}>{children}</div>;
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

class SetOptions extends Component<Props> {
  props: Props;

  state = {
    lightTheme: false,
    value: 0,
    localAmqpOptions: {
      protocol: 'amqp',
      host: 'localhost',
      port: '5672',
      username: 'guest',
      password: 'guest',
      queue: 'foo'
    },
    localHttpOptions: {
      protocol: 'http',
      host: 'localhost',
      port: '15672',
      username: 'guest',
      password: 'guest'
    }
  };

  componentWillMount() {
    const { lightTheme, amqpOptions, httpOptions } = this.props;
    this.setState({
      lightTheme,
      localAmqpOptions: amqpOptions,
      localHttpOptions: httpOptions
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.checked
    });
  };

  handleHttpConfigChange = name => event => {
    const { localHttpOptions } = this.state;
    const updatedHttpOptions = _.assign({}, localHttpOptions, {
      [name]: event.target.value
    });

    this.setState({
      localHttpOptions: updatedHttpOptions
    });
  };

  handleAmqpConfigChange = name => event => {
    const { localAmqpOptions } = this.state;
    const updatedAmqpOptions = _.assign({}, localAmqpOptions, {
      [name]: event.target.value
    });

    this.setState({
      localAmqpOptions: updatedAmqpOptions
    });
  };

  handleValueChange = (event, value) => {
    this.setState({
      value
    });
  };

  handleOk = () => {
    const { handleOk } = this.props;
    const { lightTheme, localHttpOptions, localAmqpOptions } = this.state;
    handleOk({
      lightTheme,
      amqpOptions: localAmqpOptions,
      httpOptions: localHttpOptions
    });
  };

  render() {
    const { open, handleClose, purgeEvents } = this.props;
    const { lightTheme, value, localAmqpOptions, localHttpOptions } = this.state;
    return (
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogContent>
          <Tabs
            value={value}
            onChange={this.handleValueChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="AMQP Config" />
            <Tab label="Http Config" />
            <Tab label="Other" />
          </Tabs>
          {value === 0 && (
            <TabContainer>
              <FormGroup row>
                <TextField
                  label="Protocol"
                  value={localAmqpOptions.protocol}
                  onChange={this.handleAmqpConfigChange('protocol')}
                  type="text"
                  fullWidth
                />
              </FormGroup>
              <FormGroup row>
                <TextField
                  label="Host"
                  value={localAmqpOptions.host}
                  onChange={this.handleAmqpConfigChange('host')}
                  type="text"
                  fullWidth
                />
              </FormGroup>
              <FormGroup row>
                <TextField
                  label="Port"
                  value={localAmqpOptions.port}
                  onChange={this.handleAmqpConfigChange('port')}
                  type="text"
                  fullWidth
                />
              </FormGroup>
              <FormGroup row>
                <TextField
                  label="Username"
                  value={localAmqpOptions.username}
                  onChange={this.handleAmqpConfigChange('username')}
                  type="text"
                  fullWidth
                />
              </FormGroup>
              <FormGroup row>
                <TextField
                  label="Password"
                  value={localAmqpOptions.password}
                  onChange={this.handleAmqpConfigChange('password')}
                  type="password"
                  fullWidth
                />
              </FormGroup>
              <FormGroup row>
                <TextField
                  label="Queue Name"
                  value={localAmqpOptions.queue}
                  onChange={this.handleAmqpConfigChange('queue')}
                  type="text"
                  fullWidth
                />
              </FormGroup>
            </TabContainer>
          )}
          {value === 1 && (
            <TabContainer>
              <FormGroup row>
                <TextField
                  label="Protocol"
                  value={localHttpOptions.protocol}
                  onChange={this.handleHttpConfigChange('protocol')}
                  type="text"
                  fullWidth
                />
              </FormGroup>
              <FormGroup row>
                <TextField
                  label="Host"
                  value={localHttpOptions.host}
                  onChange={this.handleHttpConfigChange('host')}
                  type="text"
                  fullWidth
                />
              </FormGroup>
              <FormGroup row>
                <TextField
                  label="Port"
                  value={localHttpOptions.port}
                  onChange={this.handleHttpConfigChange('port')}
                  type="text"
                  fullWidth
                />
              </FormGroup>
              <FormGroup row>
                <TextField
                  label="Username"
                  value={localHttpOptions.username}
                  onChange={this.handleHttpConfigChange('username')}
                  type="text"
                  fullWidth
                />
              </FormGroup>
              <FormGroup row>
                <TextField
                  label="Password"
                  value={localHttpOptions.password}
                  onChange={this.handleHttpConfigChange('password')}
                  type="password"
                  fullWidth
                />
              </FormGroup>
            </TabContainer>
          )}
          {value === 2 && (
            <TabContainer>
              <FormGroup row>
                <FormControlLabel
                  control={<Switch checked={lightTheme} onChange={this.handleChange('lightTheme')} value="light" />}
                  label="Vlad Mode"
                />
              </FormGroup>
              <FormGroup row>
                <Button onClick={purgeEvents}>Purge Events</Button>
              </FormGroup>
            </TabContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="contained">
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
