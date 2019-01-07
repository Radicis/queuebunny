// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const styles = () => ({
  itemText: {
    fontSize: '14px'
  },
  itemTextFaded: {
    fontSize: '14px',
    marginRight: 5,
    color: '#ccc'
  },
  item: {
    padding: 5,
    borderRadius: 5,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(238,238,238,0.2)'
    }
  },
  itemList: {
    height: '100%',
    overflow: 'auto'
  }
});

type Props = {
  messages: Array,
  classes: object,
  showMessage: () => void
};

class MessageList extends Component<Props> {
  props: Props;

  state = {};

  render() {
    const { classes, messages, showMessage } = this.props;
    return (
      <div>
        <List className={classes.itemList}>
          {_.map(messages, m => (
            <ListItem
              className={classes.item}
              onClick={() => showMessage(m)}
            >
              <ListItemText
                primary={
                  <React.Fragment>
                    <span className={classes.itemTextFaded}>
                      {m.fields.exchange}
                    </span>
                    <span className={classes.itemText}>
                      {m.fields.routingKey}
                    </span>
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(MessageList);
