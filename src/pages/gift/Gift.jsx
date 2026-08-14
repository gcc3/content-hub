import React, { useEffect } from "react";
import meta from "./meta.json";
import { useStrings } from "./strings";
import LanguageSwitcher from "./LanguageSwitcher";
import Delivery from "./Delivery";
import Install from "./Install";
import styles from "./gift.module.css";

const { github, download } = meta.repositories[0];
const readme = `${github}#readme`;

// The file as gift writes it on first use, from the README. It is code, so it
// is the same in every language and lives here rather than in strings.js.
const CONFIG = `{
    "github_webhook_secret": "…",
    "port": 3999,
    "functions": {
        "repo-master": { "repo_root": "/Users/me/projects" },
        "weekly-prs": { "repos": "owner/repo1,owner/repo2", "author": "octocat" }
    }
}`;

const Gift = () => {
  const { t, language, languages, setLanguage } = useStrings();

  useEffect(() => {
    document.title = t.title;
  }, [t]);

  return (
    <div className={styles.page}>
      <nav className={styles.topbar}>
        <a className={styles.home} href="/">gcc³</a>
        <span className={styles.crumb}>/ gift</span>
        <LanguageSwitcher language={language} languages={languages} onChange={setLanguage} />
      </nav>

      <header className={styles.hero}>
        <h1 className={styles.wordmark}>gift</h1>
        {/* A heading, not a paragraph: it is the line that says what a name
            as short as this one means, to a reader and to a crawler alike. */}
        <h2 className={styles.tagline}>{t.tagline}</h2>
        <p className={styles.lede}>{t.lede}</p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#install">{t.installCta}</a>
          <a className={styles.secondary} href={github}>{t.source}</a>
        </div>
        <div className={styles.facts}>
          {t.facts.map((fact, index) => (
            <React.Fragment key={fact}>
              {index > 0 && <span className={styles.dot}>·</span>}
              <span>{fact}</span>
            </React.Fragment>
          ))}
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.deliveryTitle}</h2>
        <p className={styles.sectionLede}>{t.deliveryLede}</p>
        <Delivery t={t.delivery} />
        <p className={styles.footnote}>{t.deliveryNote}</p>
      </section>

      <section className={styles.sectionFlush}>
        <h2 className={styles.label}>{t.hookTitle}</h2>
        <dl className={styles.parts}>
          {t.hookParts.map((part) => (
            <div className={styles.part} key={part.term}>
              <dt className={styles.term}>{part.term}</dt>
              <dd className={styles.detail}>{part.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.serverTitle}</h2>
        <div className={styles.commands}>
          {t.commands.map((command) => (
            <div className={styles.command} key={command.cmd}>
              <code className={styles.cmd}>{command.cmd}</code>
              <div className={styles.cmdBody}>{command.body}</div>
            </div>
          ))}
        </div>
        <p className={styles.footnote}>{t.serverNote}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.funcsTitle}</h2>
        <p className={styles.sectionLede}>{t.funcsLede}</p>
        <div className={styles.funcs}>
          {t.funcs.map((func) => (
            <div className={styles.func} key={func.name}>
              <h3 className={styles.funcName}>{func.name}</h3>
              <p className={styles.funcBody}>{func.body}</p>
              <div className={styles.funcRuns}>
                <span className={styles.runsLabel}>{t.runsLabel}</span>
                <code className={styles.inline}>{func.runs}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.configTitle}</h2>
        <p className={styles.sectionLede}>{t.configBody}</p>
        <pre className={styles.config}>{CONFIG}</pre>
        <p className={styles.footnote}>{t.configNote}</p>
      </section>

      <section className={styles.section} id="install">
        <h2 className={styles.label}>{t.startTitle}</h2>
        <Install t={t.install} />
        <ol className={styles.steps}>
          {t.steps.map((step) => (
            <li key={step.lead}>
              <strong>{step.lead}</strong>{step.body}
            </li>
          ))}
        </ol>
        <p className={styles.footnote}>{t.startNote}</p>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href={github}>GitHub</a>
          <a href={download}>{t.releases}</a>
          <a href={readme}>{t.readme}</a>
          <a href="/">gcc³</a>
        </div>
        <div className={styles.copyright}>© 2026 gcc3.com</div>
      </footer>
    </div>
  );
};

export default Gift;
