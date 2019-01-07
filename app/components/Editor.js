// @flow
import React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/json';

import 'brace/theme/monokai';
import 'brace/theme/github';

type Props = {
  content: string,
  lightTheme: boolean,
  updateContent: () => void
};

const Editor = (props: Props) => {
  const { content, updateContent, lightTheme } = props;
  return (
    <AceEditor
      mode="json"
      theme={lightTheme ? 'github' : 'monokai'}
      name="contents"
      fontSize={12}
      showPrintMargin={false}
      height="100%"
      width="100%"
      highlightActiveLine
      value={content}
      onChange={updateContent}
      setOptions={{
        showLineNumbers: true,
        tabSize: 2
      }}
    />
  );
};

export default Editor;
