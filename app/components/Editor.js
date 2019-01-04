// @flow
import React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/json';

import 'brace/theme/monokai';
import 'brace/theme/github';

type Props = {
  content: string,
  aceMode: string,
  showLines: boolean,
  aceTheme: string,
  updateContent: () => void
};

const Editor = (props: Props) => {
  const { content, updateContent, showLines, aceTheme, aceMode } = props;

  const defaults = {
    aceMode: 'text',
    aceTheme: 'monokai',
    showLines: true
  };

  return (
    <AceEditor
      mode={aceMode || defaults.aceMode}
      theme={aceTheme || defaults.aceTheme}
      name="contents"
      fontSize={12}
      showPrintMargin={false}
      showGutter={showLines || defaults.showLines}
      height="355px"
      width="100%"
      highlightActiveLine
      value={content}
      onChange={updateContent}
      setOptions={{
        showLineNumbers: true,
        enableLiveAutocompletion: true,
        enableBasicAutocompletion: true,
        tabSize: 2
      }}
    />
  );
};

export default Editor;
