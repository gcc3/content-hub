import React, { useState } from "react";
import styles from "./compiler.module.css";

// The example from the psl manual: a Go file with two AI slots in it.
// Each run resolves exactly one slot and writes the result back into the file,
// which is what the button does here.
const FILE_NAME = "fib.go.psl";

// The code is the same in every language; only the instructions inside the
// slots are translated, so `slot` is an index into t.slots.
const LINES = [
  { text: "package main" },
  { text: "" },
  { text: 'import "fmt"' },
  { text: "" },
  {
    indent: "",
    before: "// ",
    slot: 0,
    resolved: ["// Fib returns the nth Fibonacci number."],
    tokens: "1204 tokens: 1180 in, 24 out",
  },
  { text: "func Fib(n int) int {" },
  { text: "\tif n < 2 {" },
  { text: "\t\treturn n" },
  { text: "\t}" },
  { text: "\ta, b := 0, 1" },
  {
    indent: "\t",
    before: "",
    slot: 1,
    resolved: [
      "\tfor i := 1; i < n; i++ {",
      "\t\ta, b = b, a+b",
      "\t}",
      "\treturn b",
    ],
    tokens: "1281 tokens: 1209 in, 72 out",
  },
  { text: "}" },
  { text: "" },
  { text: "func main() {" },
  { text: "\tfmt.Println(Fib(10))" },
  { text: "}" },
];

const SLOTS = LINES.filter((line) => line.slot !== undefined);

const Compiler = ({ t }) => {
  const [runs, setRuns] = useState(0);
  const remaining = SLOTS.length - runs;

  const log = [];
  for (let i = 0; i < runs; i += 1) {
    const slot = SLOTS[i];
    const left = SLOTS.length - i - 1;
    log.push(`psl: ${FILE_NAME} resolved with claude-opus-5 (${slot.tokens}) — ${t.slots[slot.slot]}`);
    log.push(left > 0 ? `psl: ${left} slot(s) remaining, run psl again` : "psl: no slots remaining");
  }

  let slotIndex = -1;

  return (
    <div className={styles.compiler}>
      <div className={styles.file}>
        <div className={styles.fileName}>{FILE_NAME}</div>
        <pre className={styles.code}>
          {LINES.map((line, i) => {
            if (line.slot === undefined) {
              return <div key={i} className={styles.line}>{line.text || " "}</div>;
            }

            slotIndex += 1;
            const isResolved = slotIndex < runs;
            const isNext = slotIndex === runs;

            if (isResolved) {
              return line.resolved.map((text, j) => (
                <div key={`${i}-${j}`} className={styles.resolvedLine}>{text}</div>
              ));
            }

            return (
              <div key={i} className={styles.line}>
                {line.indent}{line.before}
                <mark className={isNext ? styles.slotNext : styles.slot}>
                  :: {t.slots[line.slot]} ::
                </mark>
              </div>
            );
          })}
        </pre>
      </div>

      <div className={styles.shell}>
        <div className={styles.prompt}>
          <span className={styles.dollar}>$</span>
          <span>psl {FILE_NAME}</span>
          {remaining > 0 ? (
            <button type="button" className={styles.run} onClick={() => setRuns(runs + 1)}>
              {t.run}
            </button>
          ) : (
            <button type="button" className={styles.reset} onClick={() => setRuns(0)}>
              {t.reset}
            </button>
          )}
        </div>
        {log.length > 0 && (
          <div className={styles.log}>
            {log.map((entry, i) => (
              <div key={i} className={styles.logLine}>{entry}</div>
            ))}
          </div>
        )}
      </div>

      <p className={styles.caption}>{t.caption}</p>
    </div>
  );
};

export default Compiler;
