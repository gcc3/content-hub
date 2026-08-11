import React, { useEffect } from "react";
import meta from "./meta.json";
import { useStrings } from "./strings";
import LanguageSwitcher from "./LanguageSwitcher";
import Modules from "./Modules";
import styles from "./liveboard.module.css";

const { github, online } = meta.repositories[0];

const SHOT = "/notes/01_projects/.images/202608040033_liveboard.webp";

const Liveboard = () => {
  const { t, language, languages, setLanguage } = useStrings();

  useEffect(() => {
    document.title = t.title;
  }, [t]);

  return (
    <div className={styles.page}>
      <nav className={styles.topbar}>
        <a className={styles.home} href="/">gcc³</a>
        <span className={styles.crumb}>/ liveboard</span>
        <LanguageSwitcher language={language} languages={languages} onChange={setLanguage} />
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.wordmark}>liveboard</h1>
          <p className={styles.tagline}>{t.tagline}</p>
          <p className={styles.lede}>{t.lede}</p>
          <div className={styles.actions}>
            <a className={styles.primary} href={online}>{t.open}</a>
            <a className={styles.secondary} href={github}>{t.source}</a>
          </div>
        </div>
        <figure className={styles.shot}>
          <img src={SHOT} alt={t.shotAlt} />
        </figure>
      </header>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.cardsTitle}</h2>
        <p className={styles.sectionLede}>{t.cardsLede}</p>
        <Modules t={t.modules} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.behavesTitle}</h2>
        <div className={styles.behaviours}>
          {t.behaviours.map((item) => (
            <div className={styles.behaviour} key={item.name}>
              <h3 className={styles.behaviourName}>{item.name}</h3>
              <p className={styles.behaviourBody}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.openTitle}</h2>
        <p className={styles.openBody}>{t.openBody}</p>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href={online}>liveboard.gcc3.com</a>
          <a href={github}>GitHub</a>
          <a href="/">gcc³</a>
        </div>
        <div className={styles.copyright}>© 2026 gcc3.com</div>
      </footer>
    </div>
  );
};

export default Liveboard;
