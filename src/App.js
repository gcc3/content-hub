import { useEffect, useState } from "react";
import clsx from "clsx";
import { Content, Sidebar } from "./components";
import { Toast, showToast } from "./ui";
import styles from "./app.module.css";
import { clearHash } from "@utils/hashUtils";
import { parseContent } from "@utils/contentUtils";

const APP_NAME = process.env.REACT_APP_NAME || "";
const DEFAULT_LOAD = process.env.REACT_APP_DEFAULT_LOAD || "category";
const USE_REALTIME = process.env.REACT_APP_USE_REALTIME === "true";

globalThis.content = "";

const App = () => {
  // Sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [index, setIndex] = useState({});

  // Content
  const [content, setContent] = useState("");
  const [reload, setReload] = useState(0);  // key trick

  // Initialize
  useEffect(() => {
    document.title = APP_NAME;
    clearHash();

    // Load full index
    fetch("/api/index")
      .then(response => response.json())
      .then(data => {
        const index = data || {};
        setIndex(index);

        const categories = Object.keys(index).filter(k => k !== "__root__");

        // III. Set initial content
        // `category`              → load the first category
        // `categories`            → load all categories
        // `category_name`         → load a specific category, e.g. `Life`
        // `category_name:note`    → load a specific note, e.g. `Life:Note1.txt`
        let content_ = "";
        if (DEFAULT_LOAD === "categories") {
          content_ = "";
        } else if (DEFAULT_LOAD === "category") {
          content_ = categories.length > 0 ? "[category]" + categories[0] : "";
        } else if (DEFAULT_LOAD.includes(":")) {
          const colonIndex = DEFAULT_LOAD.indexOf(":");
          const cat = DEFAULT_LOAD.slice(0, colonIndex);
          const note = DEFAULT_LOAD.slice(colonIndex + 1);
          content_ = cat && note ? "[note]" + cat + ":" + note : "";
        } else if (DEFAULT_LOAD) {
          content_ = "[category]" + DEFAULT_LOAD;
        }

        globalThis.content = content_;
        setContent(content_);
        console.log("content:", content_ || "(all categories)");
      })
      .catch(error => console.error(error));

    if (USE_REALTIME) {
      const reloadContent = (content) => {
        console.log("reload content: " + (content ? content : "(all categories)"));
        setReload(k => k + 1);
        showToast("Content updated.");
      }
      const es = new EventSource('/api/watch');
      es.onmessage = (event) => {
        const message = event.data;
        console.log("message: " + message);

        // If the content.category or content.note in the message, reload component
        const content_ = globalThis.content;
        const content = parseContent(content_);
        if (content.type === "") {
          reloadContent(content_);
        } else if (content.type === "category" && message.includes(content.category)) {
          reloadContent(content_);
        } else if (content.type === "note" && message.includes(content.category) && message.includes(content.note)) {
          reloadContent(content_);
        }
      }
    }

    // Unmount
    return () => {
      if (USE_REALTIME) {
        es.close();
      }
    };
  }, []);

  return (
    <div className={clsx(styles.wrapper, styles.wrapperInlineBlock)}>
      <Toast />
      {!isSidebarCollapsed && (
        <Sidebar
          index={index}
          onSetContent={(content) => {
            globalThis.content = content;
            setContent(content);
            console.log("content:", content);
          }}
          onCollapse={() => setIsSidebarCollapsed(true)}
        />
      )}

      <div
        className={clsx(styles.contentContainer, { [styles.contentExpanded]: isSidebarCollapsed })}
      >
        <div className="content" id="main-view">
          <Content content_={content} reloadKey={reload} />
        </div>
        {isSidebarCollapsed && (
          <div
            className={styles.expandSidebarButton}
            onClick={() => setIsSidebarCollapsed(false)}
          >
            •
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
