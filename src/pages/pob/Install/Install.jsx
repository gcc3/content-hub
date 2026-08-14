import React, { useState } from "react";
import CommandLine from "../CommandLine";
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

const UPDATE = "pob update";

// The tab this opens on follows the machine reading the page, and then stays
// put: the platform the page detects can be withdrawn later, once the release
// is known to carry no build for it, and a tab that moves under the pointer
// is worse than one that opened on the wrong guess.
const Install = ({ t, platform, releasesHref }) => {
  const [tab, setTab] = useState(() => (platform === "windows" ? "windows" : "unix"));

  const current = PLATFORMS.find((entry) => entry.id === tab);

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
            onClick={() => setTab(entry.id)}
          >
            {t.platforms[entry.id]}
          </button>
        ))}
      </div>

      <div className={styles.line}>
        <CommandLine command={current.command} copy={t.copy} copied={t.copied} />
      </div>

      {t.notes[tab].map((note) => (
        <p className={styles.note} key={note}>{note}</p>
      ))}

      {tab === "windows" && (
        <a className={styles.zip} href={releasesHref}>{t.zip}</a>
      )}

      {/* The install again, later — one line on every platform, so it sits
          under both tabs rather than inside either. */}
      <div className={styles.update}>
        <CommandLine command={UPDATE} copy={t.copy} copied={t.copied} />
        <p className={styles.note}>{t.updateBody}</p>
      </div>
    </div>
  );
};

export default Install;
