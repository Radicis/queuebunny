// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import Input from '@material-ui/core/Input';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider/Divider';

type Props = {
  classes: object,
  exchanges: Array,
  connection: boolean,
  hasBindings: boolean,
  bindExchanges: () => void
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

  /**
   * On update, set the selected exchanges to empty
   * @param prevProps
   */
  componentDidUpdate(prevProps) {
    const { exchanges } = this.props;
    if (exchanges !== prevProps.exchanges) {
      this.setState({
        selectedExchanges: []
      });
    }
  }

  /**
   * Manage the change in selected exchanges
   * @param e
   */
  handleSelectedExchangesChange = e => {
    const { exchanges } = this.props;
    this.setState({
      selectedExchanges: _.filter(exchanges, ex => e.target.value.indexOf(ex.name) > -1)
    });
  };

  render() {
    const { classes, exchanges, bindExchanges, connection, hasBindings } = this.props;
    const { selectedExchanges } = this.state;

    return (
      <Grid container spacing={16} direction="row" justify="space-around" alignItems="center">
        <Grid item className={classes.select} xs={8}>
          <Select
            multiple
            placeholder="Exchanges"
            disabled={!connection}
            fullWidth
            value={_.map(selectedExchanges, ex => ex.name)}
            onChange={this.handleSelectedExchangesChange}
            input={<Input id="select-multiple" />}
            renderValue={selected => selected.join(', ')}
          >
            {exchanges.map(e => (
              <MenuItem key={e.name} value={e.name}>
                <Checkbox color="primary" checked={_.map(selectedExchanges, sx => sx.name).indexOf(e.name) > -1} />
                <ListItemText primary={e.name} />
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={4}>
          {hasBindings ? (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => bindExchanges([])}
            >
              Stop
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => bindExchanges(selectedExchanges)}
              disabled={!connection}
            >
              Bind
            </Button>
          )}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(QueueOptions);
