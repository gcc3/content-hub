import React from "react";
import ReactMarkdown from 'react-markdown';
import Timeline from './Timeline.md';

const App = () =>{
  return (
    <>
      <ReactMarkdown>
        *(Building in progress...)*  
      </ReactMarkdown>
      <ReactMarkdown children={`${Timeline}`} />
    </>
  )
}

export default App
