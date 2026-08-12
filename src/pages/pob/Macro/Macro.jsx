import React, { useState } from "react";
import styles from "./macro.module.css";

// A macro from the Pob manual, and what Pob is doing while it runs that line.
// Pob works through a macro one line at a time; where a line holds a `:: … ::`
// slot, psl fills the slot in before the line runs.
//
// It ends on a `once`, which is where a macro stops being a replay: the lines
// above it run through, and from there Pob watches the screen and plays the
// block again every time what it sees changes into something the condition
// holds of. Nothing is written under one, because nothing would reach it.
//
// The code stays as written; only the comment, the slot instructions and the
// status line are translated, so a line names them by index into `t`.
const STEPS = [
  { comment: true, kind: "idle" },
  { code: "move(398, 915)", kind: "act" },
  { code: "click()", kind: "act" },
  { code: ["if (:: ", " ::) {"], slot: 0, kind: "ask" },
  { code: ["  loop (:: ", " ::, 10) {"], slot: 1, kind: "ask" },
  { code: ["    move(:: ", " ::, 738)"], slot: 2, kind: "ask" },
  { code: "    click()", kind: "act" },
  { code: ["    typeText(:: ", " ::)"], slot: 3, kind: "ask" },
  { code: '    keyPress("return")', kind: "act" },
  { code: "  }", kind: "idle" },
  { code: "}", kind: "idle" },
  { code: ["once (:: ", " ::) {"], slot: 4, kind: "watch" },
  { code: ["  move(:: ", " ::, 738)"], slot: 5, kind: "ask" },
  { code: "  click()", kind: "act" },
  { code: ["  typeText(:: ", " ::)"], slot: 6, kind: "ask" },
  { code: '  keyPress("return")', kind: "act" },
  { code: "}", kind: "watch" },
];

const LAST = STEPS.length - 1;

const TAG_CLASS = { ask: "tagAsk", act: "tagAct", watch: "tagWatch", idle: "tagAct" };

const Macro = ({ t }) => {
  const [step, setStep] = useState(0);
  const done = step >= LAST;
  const current = STEPS[step];
  const answer = t.answers[step];

  const codeFor = (line) => {
    if (line.comment) return t.comment;
    if (line.slot === undefined) return line.code;
    return `${line.code[0]}${t.slots[line.slot]}${line.code[1]}`;
  };

  return (
    <div className={styles.macro}>
      <div className={styles.head}>
        <span className={styles.file}>macro.psl</span>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.step}
            onClick={() => setStep(done ? 0 : step + 1)}
          >
            {done ? t.restart : t.step}
          </button>
        </div>
      </div>

      <pre className={styles.code}>
        {STEPS.map((line, i) => (
          <div
            key={i}
            className={
              i === step ? styles.lineActive : i < step ? styles.linePast : styles.line
            }
          >
            <span className={styles.gutter}>{i === step ? "▸" : " "}</span>
            {codeFor(line)}
          </div>
        ))}
      </pre>

      <div className={styles.status}>
        <span className={styles[TAG_CLASS[current.kind]]}>
          {current.kind === "ask"
            ? t.perceive
            : current.kind === "act"
              ? t.operate
              : current.kind === "watch"
                ? t.watch
                : t.idle}
        </span>
        <span className={styles.statusText}>{t.statuses[step] || "…"}</span>
        {answer && <span className={styles.answer}>{answer}</span>}
      </div>
    </div>
  );
};

export default Macro;
