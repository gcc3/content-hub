import React, { useEffect, useRef, useState } from "react";
import styles from "./terminal.module.css";

// The CLI, typed out. `sc` is the command; anything starting with ":" is an
// instruction to the CLI itself, anything else is a message to the model.
// Commands stay as they are; the output and the message come from `t`.
const TYPE_MS = 26;
const PAUSE_MS = 420;

const scriptFor = (t) => [
  { kind: "cmd", text: "npm i simple-ai-chat -g" },
  { kind: "out", text: t.lines[0] },
  { kind: "cmd", text: "sc" },
  { kind: "out", text: t.lines[1] },
  { kind: "ask", text: ":help" },
  { kind: "out", text: t.lines[2] },
  { kind: "ask", text: t.ask },
  { kind: "out", text: t.lines[3] },
];

const prefixFor = (kind) => (kind === "cmd" ? "$ " : kind === "ask" ? "> " : "  ");

const Terminal = ({ t }) => {
  const [line, setLine] = useState(0);
  const [typed, setTyped] = useState("");
  const timer = useRef(null);

  const script = scriptFor(t);

  // Start over when the language changes, so the screen is never half-translated.
  useEffect(() => {
    clearTimeout(timer.current);
    setLine(0);
    setTyped("");
  }, [t]);

  useEffect(() => {
    const reduced =
      typeof window.matchMedia === "function"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setLine(script.length);
      return undefined;
    }

    if (line >= script.length) return undefined;

    const current = script[line];

    // Output lines land whole; typed lines arrive a character at a time.
    if (current.kind === "out") {
      timer.current = setTimeout(() => {
        setLine(line + 1);
        setTyped("");
      }, PAUSE_MS);
      return () => clearTimeout(timer.current);
    }

    if (typed.length < current.text.length) {
      timer.current = setTimeout(() => setTyped(current.text.slice(0, typed.length + 1)), TYPE_MS);
      return () => clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      setLine(line + 1);
      setTyped("");
    }, PAUSE_MS);
    return () => clearTimeout(timer.current);
  }, [line, typed, t]);

  const done = line >= script.length;
  const shown = script.slice(0, line);
  const current = done ? null : script[line];

  return (
    <div className={styles.terminal}>
      <div className={styles.chrome}>
        <span>sc</span>
        <button
          type="button"
          className={styles.replay}
          onClick={() => {
            clearTimeout(timer.current);
            setTyped("");
            setLine(0);
          }}
        >
          {t.replay}
        </button>
      </div>
      <pre className={styles.screen} aria-live="off">
        {shown.map((entry, i) => (
          <div key={i} className={entry.kind === "out" ? styles.out : styles.input}>
            <span className={styles.prefix}>{prefixFor(entry.kind)}</span>
            {entry.text}
          </div>
        ))}
        {current && current.kind !== "out" && (
          <div className={styles.input}>
            <span className={styles.prefix}>{prefixFor(current.kind)}</span>
            {typed}
            <span className={styles.caret} />
          </div>
        )}
        {done && (
          <div className={styles.input}>
            <span className={styles.prefix}>&gt; </span>
            <span className={styles.caret} />
          </div>
        )}
      </pre>
    </div>
  );
};

export default Terminal;
