import React, { useEffect, useRef, useState } from "react";
import styles from "./pastebar.module.css";

// Paste anything into one box and stash works out where it belongs — the link's
// host picks the store, and the store knows how to read that kind of page.
// The URLs are real examples of each route and stay the same in every language;
// what the card says about them comes from `t`.
const URLS = [
  "https://github.com/lhypds/stash",
  "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  "https://chatgpt.com/share/…",
  "https://apps.apple.com/app/id1234567890",
];

// The last sample is a plain note, so it stands in for its own text.
const urlFor = (sample, i) => URLS[i] || sample.name;

const CUSTOM = -1;

const PasteBar = ({ t }) => {
  const samples = t.samples.map((sample, i) => ({ ...sample, url: urlFor(sample, i) }));

  // What is on the card is derived from the selection, so it follows the
  // language without any copying of strings into state.
  const [selected, setSelected] = useState(0);
  const [value, setValue] = useState(samples[0].url);
  const [custom, setCustom] = useState("");
  const [working, setWorking] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  // A translated sample changes text with the language; keep the box in step.
  useEffect(() => {
    if (selected >= 0) setValue(samples[selected].url);
  }, [t]);

  const analyze = (input) => {
    const text = input.trim();
    if (!text) return;
    setWorking(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const index = samples.findIndex((sample) => sample.url === text);
      setSelected(index >= 0 ? index : CUSTOM);
      setCustom(text);
      setWorking(false);
    }, 420);
  };

  const item = selected >= 0 ? samples[selected] : { ...t.fallback, url: custom };

  return (
    <div className={styles.pasteBar}>
      <form
        className={styles.bar}
        onSubmit={(event) => {
          event.preventDefault();
          analyze(value);
        }}
      >
        <input
          className={styles.input}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={t.placeholder}
          aria-label={t.inputAria}
        />
        <button type="submit" className={styles.stash}>{t.stash}</button>
      </form>

      <div className={styles.samples}>
        <span className={styles.samplesLabel}>{t.try}</span>
        {samples.map((sample) => (
          <button
            key={sample.chip}
            type="button"
            className={styles.sample}
            onClick={() => {
              setValue(sample.url);
              analyze(sample.url);
            }}
          >
            {sample.chip}
          </button>
        ))}
      </div>

      <div className={styles.result}>
        {working ? (
          <div className={styles.working}>{t.working}</div>
        ) : (
          <article className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.store}>{item.store}</span>
              <span className={styles.source}>{item.source}</span>
            </div>
            <h3 className={styles.cardName}>{item.name}</h3>
            <div className={styles.byline}>{item.byline}</div>
            <p className={styles.preview}>{item.preview}</p>
            <div className={styles.cardMeta}>{item.meta}</div>
          </article>
        )}
      </div>
    </div>
  );
};

export default PasteBar;
