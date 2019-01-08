// @flow
import React, { Component } from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/json';

import 'brace/theme/monokai';
import 'brace/theme/github';

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

  componentWillMount() {
    const { content } = this.props;
    this.setState({
      content
    });
  }

  updateContent = value => {
    const self = this;
    const { updateContent } = this.props;
    clearTimeout(self.timer);
    this.setState({
      content: this.parseContent(value)
    });
    self.timer = setTimeout(() => {
      updateContent(self.parseContent(value));
    }, 500);
  };

  parseContent = content => {
    try {
      return JSON.stringify(JSON.parse(content), null, 2);
    } catch {
      return content;
    }
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
