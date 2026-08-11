import React from "react";
import styles from "./lang.module.css";

const LanguageSwitcher = ({ language, languages, onChange }) => (
  <div className={styles.switcher}>
    {languages.map((item) => (
      <button
        key={item.code}
        type="button"
        lang={item.code}
        className={item.code === language ? styles.optionOn : styles.option}
        aria-pressed={item.code === language}
        onClick={() => onChange(item.code)}
      >
        {item.label}
      </button>
    ))}
  </div>
);

export default LanguageSwitcher;
