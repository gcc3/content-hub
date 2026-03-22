import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const ALLOWED_RAW_HTML_TAGS = new Set([
  "a",
  "abbr",
  "b",
  "blockquote",
  "br",
  "code",
  "del",
  "details",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "kbd",
  "li",
  "ol",
  "p",
  "pre",
  "section",
  "small",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
  "iframe"
]);

const escapeUnknownHtmlTags = content =>
  content.replace(/<\/?([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*>/g, match => {
    const tagMatch = match.match(/^<\/?\s*([a-zA-Z][a-zA-Z0-9-]*)/);
    const tagName = tagMatch?.[1]?.toLowerCase();

    if (tagName && ALLOWED_RAW_HTML_TAGS.has(tagName)) {
      return match;
    }

    return match.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  });

const Markdown = ({ children }) => (
  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
    {escapeUnknownHtmlTags(children || "")}
  </ReactMarkdown>
);

export default Markdown;
