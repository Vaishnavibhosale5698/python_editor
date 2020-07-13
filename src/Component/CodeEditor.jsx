import React, { useState, useEffect } from "react";
import * as editor from "highlight.js";
import python from 'highlight.js/lib/languages/python'

editor.registerLanguage('python', python)

const CodeEditor = props => {
  const [content, setContent] = useState(props.content);
  const [codeOutput, setCodeOutput] = useState('');
  const [loader ,setLoaderValue] = useState(false)

  const handleKeyDown = event => {
    let value = content,
      selStartPos = event.currentTarget.selectionStart;

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
    });
  }

  const handleExecute = () => {
    setLoaderValue(true);
    fetch('http://localhost:8080/output', {
      method: 'POST',   
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "codeInput": content
      })
    }).then(response =>response.text())
        .then(json =>{
           console.log('msg', json)
           setCodeOutput(json)
       })
  }

  useEffect(() => {
    updateCodeSyntaxHighlighting();
  }, []);

  useEffect(() => {
    updateCodeSyntaxHighlighting();
  }, [props.language, content]);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'row',height:'100%' }}>
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


        <div className="run-button-container">
          <button className="run-button"
            onClick={handleExecute}>Run Code>> </button>
          {
            loader === true && codeOutput === '' ?
              <img className="loader"
                src="https://media.giphy.com/media/2c85mEsTFONgM0sOQ/giphy.gif" alt="loading..." />
              : null
          }
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
