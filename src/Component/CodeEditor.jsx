import React, { useState, useEffect } from "react";
import * as editor from "highlight.js";
import python from 'highlight.js/lib/languages/python'

editor.registerLanguage('python', python)

const CodeEditor = props => {
  const [content, setContent] = useState(props.content);
  const [codeOutput, setCodeOutput] = useState('')

  const handleKeyDown = event => {
    let value = content,
      selStartPos = event.currentTarget.selectionStart;

    console.log(event.currentTarget);

    // handle 4-space indent on
    if (event.key === "Tab") {
      value =
        value.substring(0, selStartPos) +
        "    " +
        value.substring(selStartPos, value.length);
      event.currentTarget.selectionStart = selStartPos + 3;
      event.currentTarget.selectionEnd = selStartPos + 4;
      event.preventDefault();

      setContent(value);
    }
  };

  const updateCodeSyntaxHighlighting = () => {
    document.querySelectorAll("pre code").forEach(block => {
      editor.highlightBlock(block);
      // const newLanguage = require(`highlight.js/lib/languages/python`);
      // editor.registerLanguage(props.language, newLanguage)
      //  editor.highlight('python',block);
    });
  }

  const handleExecute = () => {
    fetch('https://api.jdoodle.com/v1/execute', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "clientId": "d7f973e133f3dac779329dffd3344f4e",
        "clientSecret": "b67c8484ea26ca17f703c931155c03357f641ef205ba477622d0eff6740c47ff",
        "script": content,
        "language": "python3",
        "versionIndex": "3"
      })
    }).then(response => response.json())
      .then(json => {
        let codeOutputValue = (JSON.stringify(json.output).slice(1, -1)).replace(/\\n/g, '')
        setCodeOutput(codeOutputValue)
      })
      .catch(error => console.log('Authorization failed : ' + error.message));
  }

  useEffect(() => {
    updateCodeSyntaxHighlighting();
  }, []);

  useEffect(() => {
    updateCodeSyntaxHighlighting();
  }, [props.language, content]);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>

      <div className="code-edit-container">
        <textarea
          className="code-input"
          value={content}
          onChange={event => setContent(event.target.value)}
          onKeyDown={handleKeyDown}
        />

        <pre className="code-syntax-edit">
          <code class='python' className={`language-${props.language}`}>{content}</code>
        </pre>


        <div style={{ marginTop: '640px', borderTop: '2px solid rgb(99, 97, 97)' }}>
          <button style={{ width: '150px', height: '40px', fontSize: 20, marginTop: '10px', marginLeft: '10px' }}
            onClick={handleExecute}>Run Code >> </button>
        </div>

      </div>


      <div className="output-window">
        <h3>Output :</h3>
        {codeOutput}
        </div>
    </div>
  );
};

export default CodeEditor;
