// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
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
    console.log(messages);
    return (
      <List>
        {_.map(messages, m => (
          <ListItem>
            <Typography variant="h6" color="inherit">
              Message: {m.name}
            </Typography>
          </ListItem>
        ))}
      </List>
    );
  }
}

export default withStyles(styles)(MessageList);
