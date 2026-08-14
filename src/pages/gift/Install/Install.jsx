import React, { useEffect, useRef, useState } from "react";
import styles from "./install.module.css";

// Two ways in. get.sh takes the latest release, unpacks it into ~/.gift and
// runs the setup and install steps from there; a checkout runs those same two
// steps itself. The commands are code, so they stay as written in every
// language and only what is said about them comes from `t`.
const WAYS = [
  {
    id: "release",
    command: "curl -fsSL https://raw.githubusercontent.com/lhypds/gift/master/get.sh | bash",
  },
  {
    id: "checkout",
    command: "./setup.sh\n./install.sh",
  },
];

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

const Install = ({ t }) => {
  const [tab, setTab] = useState("release");
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const current = WAYS.find((way) => way.id === tab);

  const choose = (id) => {
    setTab(id);
    setCopied(false);
  };

  const copy = async () => {
    const ok = await writeToClipboard(current.command);
    if (!ok) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={styles.install}>
      <p className={styles.body}>{t.body}</p>

      <div className={styles.tabs} role="tablist" aria-label={t.waysLabel}>
        {WAYS.map((way) => (
          <button
            type="button"
            key={way.id}
            role="tab"
            aria-selected={way.id === tab}
            className={way.id === tab ? styles.tabOn : styles.tab}
            onClick={() => choose(way.id)}
          >
            {t.ways[way.id]}
          </button>
        ))}
      </div>

      <div className={styles.line}>
        <pre className={styles.command}>{current.command}</pre>
        <button
          type="button"
          className={styles.copy}
          onClick={copy}
          aria-label={`${t.copy} — ${current.command}`}
        >
          {copied ? t.copied : t.copy}
        </button>
      </div>

      {t.notes[tab].map((note) => (
        <p className={styles.note} key={note}>{note}</p>
      ))}
    </div>
  );
};

export default Install;
