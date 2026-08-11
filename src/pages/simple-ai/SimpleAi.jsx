import React, { useEffect } from "react";
import meta from "./meta.json";
import { useStrings } from "./strings";
import LanguageSwitcher from "./LanguageSwitcher";
import Terminal from "./Terminal";
import styles from "./simple-ai.module.css";

const [chat, even] = meta.repositories;
const [web, webCli] = chat.online;
const docs = `${web}/docs`;

const MODELS = ["OpenAI", "Anthropic", "Google", "xAI", "Ollama"];

// The address of each way in — the same in every language.
const ENTRANCE_WHERE = ["simple-ai.io", "npm i simple-ai-chat -g", "cli.simple-ai.io"];
const ENTRANCE_HREF = [web, chat.download, webCli];

const SimpleAi = () => {
  const { t, language, languages, setLanguage } = useStrings();

  useEffect(() => {
    document.title = t.title;
  }, [t]);

  return (
    <div className={styles.page}>
      <nav className={styles.topbar}>
        <a className={styles.home} href="/">gcc³</a>
        <span className={styles.crumb}>/ simple-ai</span>
        <LanguageSwitcher language={language} languages={languages} onChange={setLanguage} />
      </nav>

      <header className={styles.hero}>
        <h1 className={styles.wordmark}>Simple AI</h1>
        {/* A heading, not a paragraph: it is the line that says what a name
            as short as this one means, to a reader and to a crawler alike. */}
        <h2 className={styles.tagline}>{t.tagline}</h2>
        <p className={styles.lede}>
          {t.ledeBefore}
          <code className={styles.inline}>:</code>
          {t.ledeAfter}
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href={web}>{t.open}</a>
          <a className={styles.secondary} href={chat.github}>{t.source}</a>
          <a className={styles.secondary} href={docs}>{t.docs}</a>
        </div>
        <div className={styles.models}>
          <span className={styles.modelsLabel}>{t.modelsLabel}</span>
          {MODELS.map((model) => (
            <span className={styles.model} key={model}>{model}</span>
          ))}
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.entrancesTitle}</h2>
        <div className={styles.entrances}>
          {t.entrances.map((entrance, i) => (
            <a className={styles.entrance} href={ENTRANCE_HREF[i]} key={entrance.name}>
              <h3 className={styles.entranceName}>{entrance.name}</h3>
              <div className={styles.entranceWhere}>{ENTRANCE_WHERE[i]}</div>
              <p className={styles.entranceBody}>{entrance.body}</p>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.cliTitle}</h2>
        <Terminal t={t.terminal} />
      </section>

      <section className={styles.sectionFlush}>
        <h2 className={styles.label}>{t.abilitiesTitle}</h2>
        <div className={styles.abilities}>
          {t.abilities.map((ability) => (
            <div className={styles.ability} key={ability.name}>
              <div className={styles.abilityName}>{ability.name}</div>
              <p className={styles.abilityBody}>{ability.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.label}>{t.evenTitle}</h2>
        <div className={styles.even}>
          <div>
            <p className={styles.evenBody}>
              {t.evenBodyBefore}
              <code className={styles.inline}>sc</code>
              {t.evenBodyAfter}
            </p>
            <p className={styles.evenBody}>{t.evenBodyTwo}</p>
            <div className={styles.actions}>
              <a className={styles.primary} href={even.download}>{t.evenDownload}</a>
              <a className={styles.secondary} href={even.github}>{t.source}</a>
            </div>
          </div>
          <dl className={styles.gestures}>
            {t.gestures.map((item) => (
              <div className={styles.gesture} key={item.gesture}>
                <dt className={styles.gestureName}>{item.gesture}</dt>
                <dd className={styles.gestureBody}>{item.meaning}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href={web}>simple-ai.io</a>
          <a href={webCli}>cli.simple-ai.io</a>
          <a href={chat.download}>npm</a>
          <a href={chat.github}>simple-ai-chat</a>
          <a href={even.github}>sc-even</a>
          <a href="/">gcc³</a>
        </div>
        <div className={styles.copyright}>© 2026 gcc3.com</div>
      </footer>
    </div>
  );
};

export default SimpleAi;
