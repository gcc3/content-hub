import React, { useEffect } from "react";
import meta from "./meta.json";
import { useStrings } from "./strings";
import LanguageSwitcher from "./LanguageSwitcher";
import Compiler from "./Compiler";
import styles from "./psl.module.css";

const { github, download } = meta.repositories[0];

const COMMANDS = [
  "psl ui.html.psl --image design.png",
  'psl bot.py.psl --prompt "move(x, y) takes absolute screen pixels, origin top-left"',
];

const Psl = () => {
  const { t, language, languages, setLanguage } = useStrings();

  useEffect(() => {
    document.title = t.title;
  }, [t]);

  return (
    <div className={styles.page}>
      <nav className={styles.topbar}>
        <a className={styles.home} href="/">gcc³</a>
        <span className={styles.crumb}>/ psl</span>
        <LanguageSwitcher language={language} languages={languages} onChange={setLanguage} />
      </nav>

      <header className={styles.hero}>
        <h1 className={styles.wordmark}>psl</h1>
        <p className={styles.tagline}>{t.tagline}</p>
        <p className={styles.lede}>
          {t.ledeBefore}
          <code className={styles.inline}>::</code>
          {t.ledeMiddle}
          <code className={styles.inline}>psl</code>
          {t.ledeAfter}
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href={download}>{t.download}</a>
          <a className={styles.secondary} href={github}>{t.source}</a>
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.tryARun}</h2>
        <Compiler t={t.compiler} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.syntax}</h2>
        <div className={styles.syntax}>
          <code className={styles.syntaxLine}>
            <mark className={styles.mark}>:: xxx ::</mark>
          </code>
          <p className={styles.syntaxNote}>{t.syntaxNote}</p>
        </div>
        <div className={styles.rules}>
          {t.rules.map((rule) => (
            <div className={styles.rule} key={rule.title}>
              <h3 className={styles.ruleTitle}>{rule.title}</h3>
              <p className={styles.ruleBody}>{rule.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.optionsTitle}</h2>
        <div className={styles.options}>
          {t.options.map((option, i) => (
            <div className={styles.option} key={option.flag}>
              <div className={styles.flag}>{option.flag}</div>
              <pre className={styles.command}>{COMMANDS[i]}</pre>
              <p className={styles.optionBody}>{option.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.installTitle}</h2>
        <div className={styles.install}>
          <p className={styles.installBody}>{t.installBody}</p>
          <pre className={styles.command}>psl update</pre>
          <p className={styles.installBody}>{t.updateBody}</p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.usedTitle}</h2>
        <a className={styles.related} href="/pob">
          <span className={styles.relatedName}>{t.relatedName}</span>
          <span className={styles.relatedBody}>{t.relatedBody}</span>
        </a>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href={github}>GitHub</a>
          <a href={download}>{t.releases}</a>
          <a href="/">gcc³</a>
        </div>
        <div className={styles.copyright}>© 2026 gcc3.com</div>
      </footer>
    </div>
  );
};

export default Psl;
