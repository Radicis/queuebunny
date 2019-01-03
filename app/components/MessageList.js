// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

const styles = () => ({});

type Props = {
  messages: Array,
  classes: object,
  messageFeedVisible: boolean
};

class MessageList extends Component<Props> {
  props: Props;

  state = {};

  parseMsg = content => {
    try {
      JSON.stringify(JSON.parse(content.toString()), null, 2);
    } catch {
      return content.toString();
    }
  };

  render() {
    const { classes, messages, messageFeedVisible } = this.props;
    return (
      <List disabled={!messageFeedVisible}>
        {_.map(messages, m => (
          <ListItem>
            <ListItemText
              primary={m.fields.routingKey}
              secondary={
                <React.Fragment>
                  <Typography component="span" color="textPrimary">
                    <pre>{this.parseMsg(m.content)}</pre>
                  </Typography>
                  {m.fields.exchange}
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
    );
  }
}

export default withStyles(styles)(MessageList);
