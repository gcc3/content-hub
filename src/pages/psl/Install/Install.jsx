import React, { useEffect, useRef, useState } from "react";
import styles from "./install.module.css";

// The two installers the repo ships: get.sh for macOS and Linux, get.ps1 for
// Windows. Both fetch the build for the platform, check it against the
// release's SHA256SUMS and put psl on the PATH.
const PLATFORMS = [
  {
    id: "unix",
    commands: [
      {
        shell: "shell",
        command: "curl -fsSL https://raw.githubusercontent.com/lhypds/psl/main/get.sh | sh",
      },
    ],
  },
  {
    id: "windows",
    commands: [
      {
        shell: "PowerShell",
        command: "irm https://raw.githubusercontent.com/lhypds/psl/main/get.ps1 | iex",
      },
      {
        shell: "cmd.exe",
        command:
          'powershell -NoProfile -Command "irm https://raw.githubusercontent.com/lhypds/psl/main/get.ps1 | iex"',
      },
    ],
  },
];

const UPDATE = "psl update";

// Windows gets the PowerShell line, everyone else the curl one. A wrong guess
// is one click away from being right, so a cheap guess is the right kind.
const detectPlatform = () => {
  const hints = [
    (navigator.userAgentData || {}).platform,
    navigator.platform,
    navigator.userAgent,
  ];
  return hints.join(" ").toLowerCase().includes("win") ? "windows" : "unix";
};

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

const Command = ({ shell, command, t, copied, onCopy }) => (
  <div className={styles.row}>
    {shell ? <div className={styles.shell}>{shell}</div> : null}
    <div className={styles.line}>
      <pre className={styles.command}>{command}</pre>
      <button
        type="button"
        className={styles.copy}
        onClick={() => onCopy(command)}
        aria-label={`${t.copy} — ${command}`}
      >
        {copied ? t.copied : t.copy}
      </button>
    </div>
  </div>
);

const Install = ({ t }) => {
  const [platform, setPlatform] = useState(detectPlatform);
  const [copied, setCopied] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async (command) => {
    const ok = await writeToClipboard(command);
    if (!ok) return;
    setCopied(command);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(null), 1600);
  };

  const current = PLATFORMS.find((entry) => entry.id === platform);

  return (
    <div className={styles.install}>
      <p className={styles.body}>{t.body}</p>

      <div className={styles.tabs} role="tablist" aria-label={t.platformsLabel}>
        {PLATFORMS.map((entry) => (
          <button
            type="button"
            key={entry.id}
            role="tab"
            aria-selected={entry.id === platform}
            className={entry.id === platform ? styles.tabOn : styles.tab}
            onClick={() => setPlatform(entry.id)}
          >
            {t.platforms[entry.id]}
          </button>
        ))}
      </div>

      <div className={styles.commands}>
        {current.commands.map((entry) => (
          <Command
            key={entry.command}
            shell={current.commands.length > 1 ? entry.shell : null}
            command={entry.command}
            t={t}
            copied={copied === entry.command}
            onCopy={copy}
          />
        ))}
      </div>

      <p className={styles.note}>{t.notes[platform]}</p>

      <div className={styles.update}>
        <Command command={UPDATE} t={t} copied={copied === UPDATE} onCopy={copy} />
        <p className={styles.note}>{t.updateBody}</p>
      </div>
    </div>
  );
};

export default Install;
