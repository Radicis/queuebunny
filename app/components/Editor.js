// @flow
import React, { Component } from 'react';
import AceEditor from 'react-ace';
import _ from 'lodash';

import 'brace/mode/json';

import 'brace/theme/monokai';
import 'brace/theme/github';

import ParseContent from '../utils/ParseContent';

type Props = {
  content: string,
  lightTheme: boolean,
  updateContent: () => void
};

class Editor extends Component<Props> {
  props: Props;

  state = {
    content: ''
  };

  /**
   * On mount, set the local state content
   */
  componentWillMount() {
    const { content } = this.props;
    this.setState({
      content
    });
  }

  /**
   * On mount, set the local state content
   */
  componentDidUpdate(prevProps) {
    const { content } = this.props;
    if (!_.isEqual(prevProps.content, content)) {
      this.setState({
        content
      });
    }
  }

  /**
   * Debounce content edit event
   * @param value
   */
  updateContent = value => {
    const self = this;
    const { updateContent } = this.props;
    clearTimeout(self.timer);
    const parsedContent = ParseContent(value);
    this.setState({
      content: parsedContent
    });
    self.timer = setTimeout(() => {
      updateContent(parsedContent);
    }, 500);
  };

  render() {
    const { lightTheme } = this.props;
    const { content } = this.state;
    return (
      <AceEditor
        mode="json"
        theme={lightTheme ? 'github' : 'monokai'}
        name="contents"
        fontSize={12}
        height="100%"
        width="100%"
        highlightActiveLine
        value={content}
        onChange={this.updateContent}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2
        }}
      />
    );
  }
}

export default Editor;
