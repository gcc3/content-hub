import React, { useEffect, useRef, useState } from "react";
import styles from "./commandline.module.css";

const writeToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // the clipboard API wants a secure context; fall back to selecting text
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  document.body.removeChild(area);
  return copied;
};

// A line meant to be taken away and pasted into a terminal: the page's ink,
// and a button that says it went. Each line keeps its own "copied" so the one
// that was pressed is the one that answers.
const CommandLine = ({ command, copy: copyLabel, copied: copiedLabel }) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // A line that changes under a "copied" is no longer the line that was copied.
  useEffect(() => {
    setCopied(false);
    window.clearTimeout(timer.current);
  }, [command]);

  const copy = async () => {
    const ok = await writeToClipboard(command);
    if (!ok) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={styles.line}>
      <pre className={styles.command}>{command}</pre>
      <button
        type="button"
        className={styles.copy}
        onClick={copy}
        aria-label={`${copyLabel} — ${command}`}
      >
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
};

export default CommandLine;
