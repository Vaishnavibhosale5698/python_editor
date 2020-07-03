import React, { useState, useEffect } from "react";
// import Prism from "prismjs";
import * as editor from "highlight.js";
import python from 'highlight.js/lib/languages/python'

editor.registerLanguage('python',python)

 const CodeEditor = props => {
  const [content, setContent] = useState(props.content);

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

  const  updateCodeSyntaxHighlighting = () => {
        document.querySelectorAll("pre code").forEach(block => {
         editor.highlightBlock(block);
          // const newLanguage = require(`highlight.js/lib/languages/python`);
          // editor.registerLanguage(props.language, newLanguage)
      //  editor.highlight('python',block);
     });
  }

  
      
  useEffect(() => {
    updateCodeSyntaxHighlighting();
  }, []);

  useEffect(() => {
    updateCodeSyntaxHighlighting();
  }, [props.language, content]);

  return (
    <div style={{width : '100%' , display : 'flex', flexDirection : 'row'} }>
     
      <div  className="code-edit-container"> 
      <textarea
         className="code-input"
        value={content}
        onChange={event => setContent(event.target.value)}
        onKeyDown={handleKeyDown}
      />

      <pre className="code-syntax-edit">
        <code class = 'python' className={`language-${props.language}`}>{content}</code>
      </pre>

      
      <div style={{marginTop : '80%',borderTop: '2px solid rgb(99, 97, 97)'}}>
      <button style={{width : '20%', height : '40px', fontSize: 20,marginTop: '10px', marginLeft: '10px'}}>Run Code >> </button> 
      </div>

      </div>
      
      
       <div className="output-window">
        <h3>Output :</h3>
        2000 is a leap year
        </div>
    </div>
  );
};
 
export default CodeEditor;
