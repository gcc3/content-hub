import React, { useEffect, useRef, useState } from "react";
import styles from "./recorder.module.css";

// Hold the pad and the intensity climbs, one step every step of the way to ten.
// Let go and the moment is tied onto the rope as a knot — the same gesture the
// app itself uses.
const MAX_INTENSITY = 10;
const STEP_MS = 240;
const MAX_KNOTS = 14;

const Recorder = ({ t }) => {
  const [intensity, setIntensity] = useState(1);
  const [pressed, setPressed] = useState(false);
  const [knots, setKnots] = useState([]);
  const timer = useRef(null);
  const level = useRef(1);
  const nextId = useRef(1);

  useEffect(() => () => clearInterval(timer.current), []);

  const start = () => {
    if (pressed) return;
    setPressed(true);
    level.current = 1;
    setIntensity(1);
    timer.current = setInterval(() => {
      level.current = Math.min(level.current + 1, MAX_INTENSITY);
      setIntensity(level.current);
    }, STEP_MS);
  };

  const end = () => {
    if (!pressed) return;
    clearInterval(timer.current);
    setPressed(false);
    const knot = { id: nextId.current, intensity: level.current };
    nextId.current += 1;
    setKnots((previous) => [...previous, knot].slice(-MAX_KNOTS));
    setIntensity(1);
    level.current = 1;
  };

  const width = 640;
  const height = 48;
  const midline = height / 2;
  const span = width - 80;
  const gap = knots.length > 1 ? span / (knots.length - 1) : 0;

  const count = (template) => template.replace("{{count}}", knots.length);
  const caption = knots.length === 0
    ? t.empty
    : knots.length === 1 ? t.countOne : count(t.countMany);

  return (
    <div className={styles.recorder}>
      <div className={styles.ropeBox}>
        <svg
          className={styles.rope}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={count(t.ropeAria)}
        >
          <line
            x1="0"
            y1={midline}
            x2={width}
            y2={midline}
            className={styles.ropeLine}
          />
          {knots.map((knot, i) => {
            const x = knots.length === 1 ? width / 2 : 40 + i * gap;
            const r = 6 + knot.intensity * 1.6;
            return (
              <g key={knot.id} className={styles.knot}>
                <line
                  x1={x - r}
                  y1={midline}
                  x2={x + r}
                  y2={midline}
                  className={styles.knotRope}
                />
                <circle cx={x} cy={midline} r={r} className={styles.knotBody} />
                <circle cx={x} cy={midline} r={r / 2.6} className={styles.knotCore} />
              </g>
            );
          })}
        </svg>
        <div className={styles.ropeCaption}>{caption}</div>
      </div>

      <div className={styles.controls}>
        <div className={styles.meter} aria-hidden="true">
          {Array.from({ length: MAX_INTENSITY }, (_, i) => (
            <span
              key={i}
              className={i < intensity ? styles.barOn : styles.bar}
              style={{ height: `${14 + i * 6}px` }}
            />
          ))}
        </div>

        <button
          type="button"
          className={pressed ? styles.padHeld : styles.pad}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            start();
          }}
          onPointerUp={end}
          onPointerLeave={end}
          onPointerCancel={end}
          onKeyDown={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              start();
            }
          }}
          onKeyUp={(event) => {
            if (event.key === " " || event.key === "Enter") end();
          }}
          aria-label={t.holdAria}
        >
          <span className={styles.padLabel}>
            {pressed ? t.keepHolding : t.hold}
          </span>
          <span className={styles.padValue}>{intensity}</span>
        </button>

        <div className={styles.legend}>
          {t.legend.map((row) => (
            <div className={styles.legendRow} key={row.key}>
              <span className={styles.legendKey}>{row.key}</span>
              <span>{row.meaning}</span>
            </div>
          ))}
          {knots.length > 0 && (
            <button type="button" className={styles.clear} onClick={() => setKnots([])}>
              {t.clear}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recorder;
