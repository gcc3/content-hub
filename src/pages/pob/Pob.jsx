import React, { useEffect } from "react";
import meta from "./meta.json";
import { useStrings } from "./strings";
import LanguageSwitcher from "./LanguageSwitcher";
import Macro from "./Macro";
import styles from "./pob.module.css";

const { github, download } = meta.repositories[0];

const SHOT = "/notes/02_utils/.images/202608111912_pob.webp";

const Pob = () => {
  const { t, language, languages, setLanguage } = useStrings();

  useEffect(() => {
    document.title = t.title;
  }, [t]);

  return (
    <div className={styles.page}>
      <nav className={styles.topbar}>
        <a className={styles.home} href="/">gcc³</a>
        <span className={styles.crumb}>/ pob</span>
        <LanguageSwitcher language={language} languages={languages} onChange={setLanguage} />
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroText}>
          <div className={styles.eyebrow}>{t.eyebrow}</div>
          <h1 className={styles.wordmark}>Pob</h1>
          <p className={styles.tagline}>{t.tagline}</p>
          <p className={styles.lede}>{t.lede}</p>
          <div className={styles.actions}>
            <a className={styles.primary} href={download}>{t.download}</a>
            <a className={styles.secondary} href={github}>{t.source}</a>
          </div>
          <p className={styles.platforms}>{t.platforms}</p>
        </div>
        <figure className={styles.shot}>
          <img src={SHOT} alt={t.shotAlt} />
        </figure>
      </header>

      <section className={styles.sectionFlush}>
        <h2 className={styles.label}>{t.capabilitiesTitle}</h2>
        <dl className={styles.capabilities}>
          {t.capabilities.map((item) => (
            <div className={styles.capability} key={item.term}>
              <dt className={styles.term}>{item.term}</dt>
              <dd className={styles.detail}>{item.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.macroTitle}</h2>
        <p className={styles.sectionLede}>
          {t.macroLedeBefore}
          <code className={styles.inline}>::</code>
          {t.macroLedeMiddle}
          <em>{t.macroLedeEmphasis}</em>
          {t.macroLedeAfter}
        </p>
        <Macro t={t.macro} />
        <p className={styles.footnote}>
          {t.footnoteBefore}
          <a className={styles.link} href="/psl">PSL</a>
          {t.footnoteAfter}
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.waysTitle}</h2>
        <div className={styles.ways}>
          {t.ways.map((way) => (
            <div className={styles.way} key={way.name}>
              <h3 className={styles.wayName}>{way.name}</h3>
              <p className={styles.wayBody}>{way.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.startTitle}</h2>
        <ol className={styles.steps}>
          {t.steps.map((step) => (
            <li key={step.lead}>
              <strong>{step.lead}</strong>{step.body}
            </li>
          ))}
        </ol>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href={github}>GitHub</a>
          <a href={download}>{t.releases}</a>
          <a href="/psl">PSL</a>
          <a href="/">gcc³</a>
        </div>
        <div className={styles.copyright}>© 2026 gcc3.com</div>
      </footer>
    </div>
  );
};

export default Pob;
