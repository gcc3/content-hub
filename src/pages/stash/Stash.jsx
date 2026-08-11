import React, { useEffect } from "react";
import meta from "./meta.json";
import { useStrings } from "./strings";
import LanguageSwitcher from "./LanguageSwitcher";
import PasteBar from "./PasteBar";
import styles from "./stash.module.css";

const { github, online } = meta.repositories[0];

const Stash = () => {
  const { t, language, languages, setLanguage } = useStrings();

  useEffect(() => {
    document.title = t.title;
  }, [t]);

  return (
    <div className={styles.page}>
      <nav className={styles.topbar}>
        <a className={styles.home} href="/">gcc³</a>
        <span className={styles.crumb}>/ stash</span>
        <LanguageSwitcher language={language} languages={languages} onChange={setLanguage} />
      </nav>

      <header className={styles.hero}>
        <h1 className={styles.wordmark}>stash</h1>
        <p className={styles.tagline}>{t.tagline}</p>
        <p className={styles.lede}>{t.lede}</p>
        <div className={styles.actions}>
          <a className={styles.primary} href={online}>{t.open}</a>
          <a className={styles.secondary} href={github}>{t.source}</a>
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.boxTitle}</h2>
        <p className={styles.sectionLede}>{t.boxLede}</p>
        <PasteBar t={t.paste} />
      </section>

      <section className={styles.sectionFlush}>
        <h2 className={styles.label}>{t.storesTitle}</h2>
        <div className={styles.stores}>
          {t.stores.map((store) => (
            <div className={styles.store} key={store.name}>
              <div className={styles.storeName}>{store.name}</div>
              <div className={styles.storeSources}>{store.sources}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.behavesTitle}</h2>
        <div className={styles.features}>
          {t.features.map((feature) => (
            <div className={styles.feature} key={feature.name}>
              <h3 className={styles.featureName}>{feature.name}</h3>
              <p className={styles.featureBody}>{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href={online}>stash.gcc3.com</a>
          <a href={github}>GitHub</a>
          <a href="/">gcc³</a>
        </div>
        <div className={styles.copyright}>© 2026 gcc3.com</div>
      </footer>
    </div>
  );
};

export default Stash;
