import React from "react";
import { marked } from "marked";

const Markdown = ({ children }) => (
  <div
    dangerouslySetInnerHTML={{
      __html: marked.parse(children)
    }}
  />
);

export default Markdown;
