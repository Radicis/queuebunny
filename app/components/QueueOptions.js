// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';

type Props = {
  classes: object,
  exchanges: Array,
  connection: boolean,
  bindExchanges: () => void,
  createConnection: () => void,
  clearMessages: () => void
};

const styles = () => ({
  select: {
    flexGrow: 1,
    overflow: 'hidden'
  },
  button: {
    marginRight: 10
  }
});

class QueueOptions extends Component<Props> {
  props: Props;

  state = {
    selectedExchanges: []
  };

  componentDidUpdate(prevProps) {
    const { exchanges } = this.props;
    if (exchanges !== prevProps.exchanges) {
      this.setState({
        selectedExchanges: []
      });
    }
  }

  handleSelectedExchangesChange = e => {
    const { exchanges } = this.props;
    this.setState({
      selectedExchanges: _.filter(
        exchanges,
        ex => e.target.value.indexOf(ex.name) > -1
      )
    });
  };

  getStyles = exchange => {
    const { selectedExchanges } = this.state;
    return {
      fontWeight: selectedExchanges.indexOf(exchange) === -1 ? 300 : 500
    };
  };

  render() {
    const {
      classes,
      exchanges,
      bindExchanges,
      connection,
      clearMessages
    } = this.props;
    const { selectedExchanges } = this.state;

    return (
      <Grid container spacing={24} direction="row" alignItems="stretch">
        <Grid item className={classes.select}>
          <Select
            multiple
            disabled={!connection}
            fullWidth
            value={_.map(selectedExchanges, ex => ex.name)}
            onChange={this.handleSelectedExchangesChange}
            input={<Input id="select-multiple-chip" />}
            renderValue={selected => (
              <div>
                {selected.map(value => (
                  <Chip key={value} label={value} />
                ))}
              </div>
            )}
          >
            {exchanges.map(e => (
              <MenuItem value={e.name} style={this.getStyles(e, this)}>
                {e.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => bindExchanges(selectedExchanges)}
            disabled={!connection}
          >
            Bind
          </Button>
          <Button
            variant="contained"
            color="inherit"
            className={classes.button}
            onClick={clearMessages}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(QueueOptions);
