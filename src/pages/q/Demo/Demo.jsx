import React, { useEffect, useRef, useState } from "react";
import styles from "./demo.module.css";

// The whole arc of q in one widget: say what you want to ask, let the model
// draft it, answer it, read the results. The numbers stay put across languages;
// only the words come from `t`.
const SHARES = [42, 21, 24, 13];
const KEYS = ["a", "b", "c", "d"];

const Demo = ({ t }) => {
  const [stage, setStage] = useState("topic");
  const [answer, setAnswer] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const generate = () => {
    setStage("generating");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStage("question"), 700);
  };

  const options = t.options.map((text, i) => ({ key: KEYS[i], text, share: SHARES[i] }));

  return (
    <div className={styles.demo}>
      <ol className={styles.stages} aria-hidden="true">
        <li className={stage === "topic" || stage === "generating" ? styles.stageOn : styles.stage}>
          {t.stages[0]}
        </li>
        <li className={stage === "question" ? styles.stageOn : styles.stage}>{t.stages[1]}</li>
        <li className={stage === "results" ? styles.stageOn : styles.stage}>{t.stages[2]}</li>
      </ol>

      {(stage === "topic" || stage === "generating") && (
        <div className={styles.panel}>
          <div className={styles.panelLabel}>{t.topicLabel}</div>
          <div className={styles.topic}>{t.topic}</div>
          <button
            type="button"
            className={styles.action}
            onClick={generate}
            disabled={stage === "generating"}
          >
            {stage === "generating" ? t.generating : t.generate}
          </button>
          <p className={styles.note}>{t.generateNote}</p>
        </div>
      )}

      {stage === "question" && (
        <div className={styles.panel}>
          <div className={styles.panelLabel}>{t.questionOf}</div>
          <h3 className={styles.question}>{t.question}</h3>
          <p className={styles.description}>{t.description}</p>
          <div className={styles.options}>
            {options.map((option) => (
              <button
                key={option.key}
                type="button"
                className={answer === option.key ? styles.optionOn : styles.option}
                onClick={() => setAnswer(option.key)}
              >
                <span className={styles.optionKey}>{option.key}</span>
                <span>{option.text}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className={styles.action}
            onClick={() => setStage("results")}
            disabled={!answer}
          >
            {answer ? t.submit : t.pickOne}
          </button>
        </div>
      )}

      {stage === "results" && (
        <div className={styles.panel}>
          <div className={styles.panelLabel}>{t.collected}</div>
          <h3 className={styles.question}>{t.question}</h3>
          <div className={styles.bars}>
            {options.map((option) => (
              <div key={option.key} className={styles.barRow}>
                <div className={styles.barLabel}>
                  {option.text}
                  {answer === option.key && <span className={styles.yours}>{t.yours}</span>}
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={answer === option.key ? styles.barFillOwn : styles.barFill}
                    style={{ width: `${option.share}%` }}
                  />
                </div>
                <div className={styles.barValue}>{option.share}%</div>
              </div>
            ))}
          </div>
          <div className={styles.analysis}>
            <div className={styles.analysisLabel}>{t.analysisLabel}</div>
            <p className={styles.analysisBody}>{t.analysis}</p>
          </div>
          <button
            type="button"
            className={styles.reset}
            onClick={() => {
              setAnswer(null);
              setStage("topic");
            }}
          >
            {t.startOver}
          </button>
        </div>
      )}
    </div>
  );
};

export default Demo;
