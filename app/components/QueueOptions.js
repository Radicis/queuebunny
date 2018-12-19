// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import Typography from '@material-ui/core/Typography';

const styles = () => ({});

type Props = {
  classes: object,
  exchanges: Array,
  setExchanges: () => void
};

class QueueOptions extends Component<Props> {
  props: Props;

  state = {};

  render() {
    const { classes, exchanges, setExchanges } = this.props;
    const {} = this.state;
    return (
      <Typography variant="h6" color="inherit">
        Queue Options
      </Typography>
    );
  }
}

export default withStyles(styles)(QueueOptions);
