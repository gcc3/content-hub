import React, { useEffect, useRef, useState } from "react";
import styles from "./install.module.css";

// The one command the repo ships: get.sh works out which release fits the
// machine it is run on, downloads it, and installs it the way a hand would
// have. It is macOS and Linux only — Windows has no line of its own, so what
// it gets here is the line it does have, the installer inside the zip.
const PLATFORMS = [
  {
    id: "unix",
    command: "curl -fsSL https://raw.githubusercontent.com/lhypds/pob/master/get.sh | sh",
  },
  {
    id: "windows",
    command: "powershell -ExecutionPolicy Bypass -File install.ps1",
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

// The tab this opens on follows the machine reading the page, and then stays
// put: the platform the page detects can be withdrawn later, once the release
// is known to carry no build for it, and a tab that moves under the pointer
// is worse than one that opened on the wrong guess.
const Install = ({ t, platform, releasesHref }) => {
  const [tab, setTab] = useState(() => (platform === "windows" ? "windows" : "unix"));
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const current = PLATFORMS.find((entry) => entry.id === tab);

  const choose = (id) => {
    setTab(id);
    setCopied(false);
  };

  const copy = async () => {
    const ok = await writeToClipboard(current.command);
    if (!ok) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={styles.install}>
      <p className={styles.body}>{t.body}</p>

      <div className={styles.tabs} role="tablist" aria-label={t.platformsLabel}>
        {PLATFORMS.map((entry) => (
          <button
            type="button"
            key={entry.id}
            role="tab"
            aria-selected={entry.id === tab}
            className={entry.id === tab ? styles.tabOn : styles.tab}
            onClick={() => choose(entry.id)}
          >
            {t.platforms[entry.id]}
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

      {tab === "windows" && (
        <a className={styles.zip} href={releasesHref}>{t.zip}</a>
      )}
    </div>
  );
};

export default Install;
