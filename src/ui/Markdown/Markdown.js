import React from "react";
import { marked } from "marked";
import "./markdown.css";

const escapeHtmlAttribute = value => String(value)
  .replace(/&/g, "&amp;")
  .replace(/"/g, "&quot;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

const normalizeLanguageClass = language => {
  if (!language) {
    return "";
  }
  return language.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
};

const createMarkedRenderer = () => {
  const renderer = new marked.Renderer();

  renderer.paragraph = text => `<p class="md-token md-token-paragraph">${text}</p>\n`;

  renderer.heading = (text, level) => {
    const headingTag = `h${level}`;
    return `<${headingTag} class="md-token md-token-heading md-token-heading-${level}">${text}</${headingTag}>\n`;
  };

  renderer.blockquote = quote => `<blockquote class="md-token md-token-blockquote">\n${quote}</blockquote>\n`;

  renderer.list = (body, ordered, start) => {
    const tagName = ordered ? "ol" : "ul";
    const startAttribute = ordered && start !== 1 ? ` start="${start}"` : "";
    const listClassName = ordered
      ? "md-token md-token-list md-token-list-ordered"
      : "md-token md-token-list md-token-list-unordered";
    return `<${tagName} class="${listClassName}"${startAttribute}>\n${body}</${tagName}>\n`;
  };

  renderer.listitem = (text, task, checked) => {
    if (task) {
      const checkbox = `<input class="md-token md-token-task-checkbox" ${checked ? "checked=" : ""}disabled="" type="checkbox"> `;
      return `<li class="md-token md-token-list-item md-token-task-item">${checkbox}${text}</li>\n`;
    }

    return `<li class="md-token md-token-list-item">${text}</li>\n`;
  };

  renderer.code = (code, infostring) => {
    const language = (infostring || "").match(/^[^\s]*/)?.[0] || "";
    const normalizedLanguage = normalizeLanguageClass(language);
    const languageClass = normalizedLanguage ? ` md-token-language-${normalizedLanguage}` : "";
    return `<pre class="md-token md-token-code-block"><code class="md-token md-token-code${languageClass}">${code}</code></pre>\n`;
  };

  renderer.hr = () => "<hr class=\"md-token md-token-hr\">\n";

  renderer.br = () => "<br class=\"md-token md-token-break\">";

  renderer.strong = text => `<strong class="md-token md-token-strong">${text}</strong>`;

  renderer.em = text => `<em class="md-token md-token-emphasis">${text}</em>`;

  renderer.codespan = text => `<code class="md-token md-token-codespan">${text}</code>`;

  renderer.del = text => `<del class="md-token md-token-delete">${text}</del>`;

  renderer.text = text => `<span class="md-token md-token-text">${text}</span>`;

  renderer.link = (href, title, text) => {
    const titleAttribute = title ? ` title="${escapeHtmlAttribute(title)}"` : "";
    return `<a class="md-token md-token-link" href="${escapeHtmlAttribute(href)}"${titleAttribute}>${text}</a>`;
  };

  renderer.image = (href, title, text) => {
    const titleAttribute = title ? ` title="${escapeHtmlAttribute(title)}"` : "";
    return `<img class="md-token md-token-image" src="${escapeHtmlAttribute(href)}" alt="${escapeHtmlAttribute(text)}"${titleAttribute}>`;
  };

  renderer.table = (header, body) => `<table class="md-token md-token-table">\n<thead class="md-token md-token-table-head">\n${header}</thead>\n<tbody class="md-token md-token-table-body">\n${body}</tbody>\n</table>\n`;

  renderer.tablerow = content => `<tr class="md-token md-token-table-row">\n${content}</tr>\n`;

  renderer.tablecell = (content, flags) => {
    const tagName = flags.header ? "th" : "td";
    const alignClassName = flags.align ? ` md-token-table-cell-${flags.align}` : "";
    const alignStyle = flags.align ? ` style="text-align:${flags.align}"` : "";
    return `<${tagName} class="md-token md-token-table-cell${alignClassName}"${alignStyle}>${content}</${tagName}>\n`;
  };

  return renderer;
};

// In Markdown, resolve the baseUrl for relative URLs (e.g. images).
const resolveRelativeUrls = (html, basePath) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return html;
  }

  const template = document.createElement("template");
  template.innerHTML = html;

  // Links
  template.content.querySelectorAll("a[href]").forEach(element => {
    element.setAttribute("target", "_blank");
    element.setAttribute("rel", "noopener noreferrer");
  });

  // Images
  template.content.querySelectorAll("img[src]").forEach(element => {
    const attributeValue = element.getAttribute("src");
    if (!attributeValue) {
      return;
    }
    element.setAttribute("src", basePath + attributeValue);
  });
  return template.innerHTML;
};

const Markdown = ({ children, basePath = "/" }) => {
  const renderer = createMarkedRenderer();
  let resolvedHtml = marked.parse(children, { renderer });

  // Resolve relative URLs
  resolvedHtml = resolveRelativeUrls(resolvedHtml, basePath);

  // Replace spaces in markdown with non-breaking spaces
  resolvedHtml = resolvedHtml.replace(/░/g, "&nbsp;");

  return (
    <div
      className="md-root"
      dangerouslySetInnerHTML={{
        __html: resolvedHtml
      }}
    />
  );
};

export default Markdown;
