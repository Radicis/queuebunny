// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button/Button';

const styles = () => ({
  grow: {
    flexGrow: 1
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
    borderRadius: 5,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(238,238,238,0.2)'
    }
  },
  itemList: {
    height: '100%',
    overflow: 'auto'
  },
  input: {
    marginRight: 10
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

  componentWillMount() {
    const { messages } = this.props;
    this.setState({
      filteredMessages: messages
    });
  }

  componentDidUpdate(prevProps) {
    const { messages } = this.props;
    if (!_.isEqual(messages, prevProps.messages)) {
      this.setState({
        filteredMessages: messages
      });
    }
  }

  reset = () => {
    const { messages } = this.props;
    this.setState({
      filteredMessages: messages,
      routingKey: '',
      content: ''
    });
  };

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

  clearMessages = () => {
    const { clearMessages } = this.props;
    this.reset();
    clearMessages();
  };

  isFiltered = () => {
    const { messages } = this.props;
    const { filteredMessages } = this.state;
    return filteredMessages.length !== messages.length;
  };

  render() {
    const { classes, showMessage, messages } = this.props;
    const { filteredMessages, routingKey, content } = this.state;
    return (
      <div className={classes.grow}>
        <Input
          className={classes.input}
          placeholder="Routing Key"
          value={routingKey}
          onChange={this.filterMessagesByField('routingKey')}
        />
        <Input
          className={classes.input}
          placeholder="Content"
          value={content}
          onChange={this.filterMessagesByContent}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={!this.isFiltered()}
          className={classes.input}
          onClick={this.reset}
        >
          Reset
        </Button>
        <Button variant="contained" color="inherit" disabled={_.isEmpty(messages)} onClick={this.clearMessages}>
          Clear
        </Button>
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
      </div>
    );
  }
}

export default withStyles(styles)(MessageList);
