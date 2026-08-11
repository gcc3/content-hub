import React, { useEffect, useState } from "react";
import styles from "./modules.module.css";

// Cards come from module packs, and a pack is just a repository. These two are
// published; anything named liveboard-mod-* loads the same way.
// Modules are picked by position, so a card stays selected across a language change.
const clock = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

const Modules = ({ t }) => {
  const [selected, setSelected] = useState({ pack: 0, module: 2 });
  const [now, setNow] = useState(clock);

  useEffect(() => {
    const id = setInterval(() => setNow(clock()), 1000);
    return () => clearInterval(id);
  }, []);

  const pack = t.packs[selected.pack];
  const active = pack.modules[selected.module];

  return (
    <div className={styles.modules}>
      <div className={styles.chrome}>
        <span className={styles.chromeTitle}>{t.board}</span>
        <span className={styles.chromeClock}>{now}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.list}>
          {t.packs.map((entry, packIndex) => (
            <div className={styles.pack} key={entry.pack}>
              <div className={styles.packName}>{entry.pack}</div>
              <div className={styles.packNote}>{entry.note}</div>
              <div className={styles.chips}>
                {entry.modules.map((module, moduleIndex) => {
                  const isOn = selected.pack === packIndex && selected.module === moduleIndex;
                  return (
                    <button
                      key={module.name}
                      type="button"
                      className={isOn ? styles.chipOn : styles.chip}
                      onClick={() => setSelected({ pack: packIndex, module: moduleIndex })}
                    >
                      {module.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.cardTitle}>{active.name}</span>
            <span className={styles.cardPack}>{pack.pack}</span>
          </div>
          <p className={styles.cardBody}>{active.body}</p>
          <div className={styles.cardFoot}>{t.foot}</div>
        </div>
      </div>
    </div>
  );
};

export default Modules;
