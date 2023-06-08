import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Timeline from "./projects/Timeline.md";
import SimpleAiChat from "./projects/Simple AI Chat.md";
import PlainTextNote from "./projects/Plain Text Note.md";
import UnixNote from "./note/.markdown/Unix Note.md";

const App = () => {
  const [contentView, setContentView] = useState("projects");

  useEffect(() => {
    window.addEventListener('changeContentView', (e) => {
      setContentView(e.detail);
    });
  }, []);

  return (
    <>
      <ReactMarkdown>
        *(Building in progress...)*  
      </ReactMarkdown>
      {
        contentView === "projects" &&
        <div>
          <ReactMarkdown children={`${Timeline}`} />
          <div style={{ maxWidth: '1000px' }}>
            <iframe frameBorder="0" scrolling="no"
              width="100%" height="450px"
              src="https://timeline.gcc3.com">
            </iframe>
          </div>
          <ReactMarkdown children={`${SimpleAiChat}`} />
          <ReactMarkdown children={`${PlainTextNote}`} />
        </div>
      }
      {
        contentView === "notes" &&
        <div>
          <ReactMarkdown children={`${UnixNote}`} />
        </div>
      }
    </>
  )
}

export default App
