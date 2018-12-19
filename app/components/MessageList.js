// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import Typography from '@material-ui/core/Typography';

const styles = () => ({});

type Props = {
  messages: Array,
  classes: object
};

class MessageList extends Component<Props> {
  props: Props;

  state = {};

  render() {
    const { classes, messages } = this.props;
    const {} = this.state;
    return (
      <Typography variant="h6" color="inherit">
        Message List
      </Typography>
    );
  }
}

export default withStyles(styles)(MessageList);
