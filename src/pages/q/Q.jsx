import React, { useEffect } from "react";
import meta from "./meta.json";
import { useStrings } from "./strings";
import LanguageSwitcher from "./LanguageSwitcher";
import Demo from "./Demo";
import styles from "./q.module.css";

const { github, online } = meta.repositories[0];

const Q = () => {
  const { t, language, languages, setLanguage } = useStrings();

  useEffect(() => {
    document.title = t.title;
  }, [t]);

  return (
    <div className={styles.page}>
      <nav className={styles.topbar}>
        <a className={styles.home} href="/">gcc³</a>
        <span className={styles.crumb}>/ q</span>
        <LanguageSwitcher language={language} languages={languages} onChange={setLanguage} />
      </nav>

      <header className={styles.hero}>
        <h1 className={styles.wordmark}>q</h1>
        <p className={styles.tagline}>{t.tagline}</p>
        <p className={styles.lede}>{t.lede}</p>
        <div className={styles.actions}>
          <a className={styles.primary} href={online}>{t.open}</a>
          <a className={styles.secondary} href={github}>{t.source}</a>
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.walkTitle}</h2>
        <Demo t={t.demo} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.stepsTitle}</h2>
        <ol className={styles.steps}>
          {t.steps.map((step, i) => (
            <li className={styles.step} key={step.name}>
              <div className={styles.stepIndex}>{i + 1}</div>
              <div>
                <h3 className={styles.stepName}>{step.name}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.sectionFlush}>
        <h2 className={styles.label}>{t.typesTitle}</h2>
        <div className={styles.types}>
          {t.types.map((type) => (
            <div className={styles.type} key={type.name}>
              <div className={styles.typeName}>{type.name}</div>
              <p className={styles.typeBody}>{type.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.scoredTitle}</h2>
        <div className={styles.scored}>
          <p className={styles.scoredBody}>{t.scoredBody}</p>
          <ul className={styles.scoredList}>
            {t.scoredList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href={online}>q.gcc3.com</a>
          <a href={github}>GitHub</a>
          <a href="/">gcc³</a>
        </div>
        <div className={styles.copyright}>© 2026 gcc3.com</div>
      </footer>
    </div>
  );
};

export default Q;
