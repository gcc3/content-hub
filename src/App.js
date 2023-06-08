import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Timeline from "./projects/Timeline.md";
import SimpleAiChat from "./projects/Simple AI Chat.md";
import PlainTextNote from "./projects/Plain Text Note.md";
import UnixNote from "./note/.markdown/Unix Note.md";
import rehypeRaw from 'rehype-raw'

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
          <div id="timeline">
            <ReactMarkdown children={`${Timeline}`} rehypePlugins={[rehypeRaw]} />
          </div>
          <div id="simple-ai-chat">
            <ReactMarkdown children={`${SimpleAiChat}`} />
          </div>
          <div id="plain-text-note">
            <ReactMarkdown children={`${PlainTextNote}`} />
          </div>
          <ReactMarkdown>
            Welcome to [join](mailto:lhypds.dev@gmail.com) the projects. 
          </ReactMarkdown>
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
