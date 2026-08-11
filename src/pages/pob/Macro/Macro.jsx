import React, { useState } from "react";
import styles from "./macro.module.css";

// A macro from the Pob manual, and what Pob is doing while it runs that line.
// Pob works through a macro one line at a time; where a line holds a `:: … ::`
// slot, psl fills the slot in before the line runs.
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
  { code: 'call("../sign-out.psl")', kind: "act" },
];

const LAST = STEPS.length - 1;

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
        <span className={current.kind === "ask" ? styles.tagAsk : styles.tagAct}>
          {current.kind === "ask" ? t.perceive : current.kind === "act" ? t.operate : t.idle}
        </span>
        <span className={styles.statusText}>{t.statuses[step] || "…"}</span>
        {answer && <span className={styles.answer}>{answer}</span>}
      </div>
    </div>
  );
};

export default Macro;
