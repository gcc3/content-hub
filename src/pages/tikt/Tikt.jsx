import React, { useEffect } from "react";
import meta from "./meta.json";
import { useStrings } from "./strings";
import LanguageSwitcher from "./LanguageSwitcher";
import Recorder from "./Recorder";
import styles from "./tikt.module.css";

const { github, online } = meta.repositories[0];

const Tikt = () => {
  const { t, language, languages, setLanguage } = useStrings();

  useEffect(() => {
    document.title = t.title;
  }, [t]);

  return (
    <div className={styles.page}>
      <nav className={styles.topbar}>
        <a className={styles.home} href="/">gcc³</a>
        <span className={styles.crumb}>/ tikt</span>
        <LanguageSwitcher language={language} languages={languages} onChange={setLanguage} />
      </nav>

      <header className={styles.hero}>
        <h1 className={styles.wordmark}>tikt</h1>
        <p className={styles.tagline}>{t.tagline}</p>
        <p className={styles.lede}>{t.lede}</p>
        <div className={styles.actions}>
          <a className={styles.primary} href={online}>{t.open}</a>
          <a className={styles.secondary} href={github}>{t.source}</a>
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.tieOne}</h2>
        <Recorder t={t.recorder} />
        <p className={styles.footnote}>{t.footnote}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.threeWords}</h2>
        <div className={styles.vocabulary}>
          {t.vocabulary.map((item) => (
            <div className={styles.entry} key={item.word}>
              <h3 className={styles.word}>
                {item.word}
                <span className={styles.gloss}>{item.gloss}</span>
              </h3>
              <p className={styles.entryBody}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.sectionFlush}>
        <h2 className={styles.label}>{t.lookingBack}</h2>
        <p className={styles.sectionLede}>{t.lookingBackLede}</p>
        <div className={styles.views}>
          {t.views.map((view) => (
            <div className={styles.view} key={view.name}>
              <div className={styles.viewName}>{view.name}</div>
              <p className={styles.viewBody}>{view.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.smallThings}</h2>
        <ul className={styles.details}>
          {t.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href={online}>tikt.gcc3.com</a>
          <a href={github}>GitHub</a>
          <a href="/">gcc³</a>
        </div>
        <div className={styles.copyright}>© 2026 gcc3.com</div>
      </footer>
    </div>
  );
};

export default Tikt;
