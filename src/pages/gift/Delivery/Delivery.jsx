import React, { useEffect, useRef, useState } from "react";
import styles from "./delivery.module.css";

// Three hooks of the kind gift is actually run with, and four pushes to throw
// at them. The hooks and the pushes are code — the same words at every
// terminal — so they stay as written in every language; only what is said
// about them comes from `t`.
const HOOKS = [
  {
    name: "site",
    repo: "gcc3/gcc3",
    branches: "main, master",
    script: "./build.sh",
    dir: "~/sites/gcc3",
  },
  {
    name: "notes",
    repo: "gcc3/gcc3-content",
    branches: "*",
    script: "./pull.sh",
    dir: "~/sites/gcc3/public/notes",
  },
  {
    name: "gift",
    repo: "lhypds/gift",
    branches: "master",
    script: "./restart.sh",
    dir: "~/gift",
  },
];

const PUSHES = [
  { repo: "gcc3/gcc3", branch: "main", commits: 3 },
  { repo: "gcc3/gcc3", branch: "draft", commits: 2 },
  { repo: "gcc3/gcc3-content", branch: "notes-aug", commits: 2 },
  { repo: "lhypds/gift", branch: "master", commits: 8 },
];

// The matching gift itself does, which is small enough to do here rather than
// tabulate: the repository has to be the hook's, and the branch has to be one
// the hook was told to watch — or the hook has to watch any of them.
const watches = (hook, push) => hook.repo === push.repo
  && hook.branches.split(",").map((branch) => branch.trim())
    .some((branch) => branch === "*" || branch === push.branch);

const fill = (template, values) => Object.keys(values).reduce(
  (text, key) => text.replace(`{${key}}`, values[key]),
  template,
);

const Delivery = ({ t }) => {
  // Nothing is stored about a delivery except which push it was: the hooks
  // that ran are worked out from it, so they follow the language without a
  // string being copied into state.
  const [selected, setSelected] = useState(0);
  const [matching, setMatching] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const deliver = (index) => {
    setSelected(index);
    setMatching(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMatching(false), 460);
  };

  const push = PUSHES[selected];
  const matched = HOOKS.filter((hook) => watches(hook, push));

  return (
    <div className={styles.delivery}>
      <div className={styles.pushes}>
        <span className={styles.pushesLabel}>{t.try}</span>
        {PUSHES.map((item, index) => (
          <button
            key={`${item.repo}#${item.branch}`}
            type="button"
            className={index === selected ? styles.pushOn : styles.push}
            aria-pressed={index === selected}
            onClick={() => deliver(index)}
          >
            {`${item.repo} → ${item.branch}`}
          </button>
        ))}
      </div>

      <div className={styles.request}>
        <div className={styles.requestHead}>
          <span className={styles.method}>{t.request}</span>
          <span className={styles.signature}>{t.signature}</span>
        </div>
        <div className={styles.event}>
          <span className={styles.eventKind}>{t.push}</span>
          <span className={styles.dot}>·</span>
          {push.repo}
          <span className={styles.dot}>·</span>
          {`refs/heads/${push.branch}`}
          <span className={styles.dot}>·</span>
          {fill(t.commits, { n: push.commits })}
        </div>
      </div>

      <div className={styles.hooks}>
        <div className={styles.hooksLabel}>{t.hooks}</div>
        <div className={styles.row} aria-hidden="true">
          <span className={styles.head}>{t.columns.name}</span>
          <span className={styles.head}>{t.columns.repo}</span>
          <span className={styles.head}>{t.columns.branches}</span>
          <span className={styles.head}>{t.columns.runs}</span>
          <span className={styles.head}>{t.columns.dir}</span>
          <span className={styles.head} />
        </div>
        {HOOKS.map((hook) => {
          const hit = !matching && watches(hook, push);
          return (
            <div className={hit ? styles.rowOn : styles.row} key={hook.name}>
              <span className={styles.name}>{hook.name}</span>
              <span className={styles.cell}>{hook.repo}</span>
              <span className={styles.cell}>{hook.branches}</span>
              <span className={styles.cell}>{hook.script}</span>
              <span className={styles.cell}>{hook.dir}</span>
              <span className={styles.verdict}>
                {matching ? "…" : (hit ? <span className={styles.match}>{t.match}</span> : t.noMatch)}
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.result} role="status" aria-label={t.resultLabel}>
        {matching && <span className={styles.working}>{t.matching}</span>}
        {!matching && matched.length === 0 && (
          <span className={styles.nothing}>{t.nothing}</span>
        )}
        {!matching && matched.map((hook) => (
          <span className={styles.ran} key={hook.name}>
            {fill(t.ran, { script: hook.script, dir: hook.dir })}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Delivery;
