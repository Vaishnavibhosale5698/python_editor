import React from 'react'
import "./styles.css";
import CodeEditor from '../src/Component/CodeEditor';

export default function App() {
  return (
    <div className="App">
      <h3>Q.Write Program to Check whether Year is a Leap Year or not</h3>
      <CodeEditor language='python' />      
    </div>
  );
}