// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const styles = () => ({
  grow: {
    flexGrow: 1,
    height: '100%'
  },
  noPadding: {
    flexGrow: 1,
    height: '100%',
    padding: '0 !important'
  },
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
    borderRadius: 0,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(238,238,238,0.2)'
    }
  },
  itemList: {
    height: 'calc(100% - 85px)',
    overflowX: 'auto'
  }
});

type Props = {
  messages: Array,
  classes: object,
  showMessage: () => void,
  clearMessages: () => void
};

class MessageList extends Component<Props> {
  props: Props;

  state = {
    filteredMessages: [],
    routingKey: '',
    content: ''
  };

  /**
   * On mount set the filtered messages array
   */
  componentWillMount() {
    const { messages } = this.props;
    this.setState({
      filteredMessages: messages
    });
  }

  /**
   * On update check for equality to prevent max depth and set the filtered messages
   * TODO: Find a better way to do this
   * @param prevProps
   */
  componentDidUpdate(prevProps) {
    const { messages } = this.props;
    if (!_.isEqual(messages, prevProps.messages)) {
      this.setState({
        filteredMessages: messages
      });
    }
  }

  /**
   * Resets the filters
   */
  reset = () => {
    const { messages } = this.props;
    this.setState({
      filteredMessages: messages,
      routingKey: '',
      content: ''
    });
  };

  /**
   * Filters the messages by a specific field
   * @param field
   * @returns {Function}
   */
  filterMessagesByField = field => e => {
    const { messages } = this.props;
    const { filteredMessages, routingKey, content } = this.state;
    const filter = e.target.value;
    if (!(filter || (routingKey && content))) {
      this.setState({
        routingKey: '',
        filteredMessages: messages
      });
    } else {
      this.setState({
        [field]: filter,
        filteredMessages:
          !_.isEmpty(filteredMessages) && filter
            ? _.filter(
                filteredMessages,
                i => i.fields[field] && i.fields[field].toUpperCase().includes(filter.toUpperCase())
              )
            : filteredMessages
      });
    }
  };

  /**
   * Filters messages by content
   * @param e
   */
  filterMessagesByContent = e => {
    const { messages } = this.props;
    const { filteredMessages, routingKey, content } = this.state;
    const filter = e.target.value;
    if (!(filter || (routingKey && content))) {
      this.setState({
        content: '',
        filteredMessages: messages
      });
    } else {
      this.setState({
        content: filter,
        filteredMessages:
          !_.isEmpty(filteredMessages) && filter
            ? _.filter(filteredMessages, i => i.content && i.content.toUpperCase().includes(filter.toUpperCase()))
            : filteredMessages
      });
    }
  };

  /**
   * Purge the local message list
   */
  clearMessages = () => {
    const { clearMessages } = this.props;
    this.reset();
    clearMessages();
  };

  /**
   * Determine if the list if filtered so the ui can respond
   * @returns {boolean}
   */
  isFiltered = () => {
    const { messages } = this.props;
    const { filteredMessages } = this.state;
    return filteredMessages.length !== messages.length;
  };

  render() {
    const { classes, showMessage, messages } = this.props;
    const { filteredMessages, routingKey, content } = this.state;
    return (
      <Grid container spacing={24} className={classes.grow} alignItems="center">
        <Grid container item xs={12} spacing={8}>
          <Grid item container spacing={16} xs={8}>
            <Grid item xs={6}>
              <Input
                fullWidth
                placeholder="Routing Key"
                value={routingKey}
                onChange={this.filterMessagesByField('routingKey')}
              />
            </Grid>
            <Grid item xs={6}>
              <Input fullWidth placeholder="Content" value={content} onChange={this.filterMessagesByContent} />
            </Grid>
          </Grid>
          <Grid item container xs={4} spacing={16}>
            <Grid item xs={6}>
              <Button variant="contained" color="primary" disabled={!this.isFiltered()} onClick={this.reset} fullWidth>
                Reset
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                color="inherit"
                disabled={_.isEmpty(messages)}
                onClick={this.clearMessages}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.noPadding}>
          <List className={classes.itemList}>
            {_.map(filteredMessages, m => (
              <ListItem className={classes.item} onClick={() => showMessage(m)}>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <span className={classes.itemTextFaded}>{m.fields.exchange}</span>
                      <span className={classes.itemText}>{m.fields.routingKey}</span>
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(MessageList);
