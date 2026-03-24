import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Content, Sidebar } from "./components";
import styles from "./app.module.css";
import { clearHash } from "@utils/hashUtils";

const siteName = process.env.REACT_APP_NAME || "";
const defaultLoad = process.env.REACT_APP_DEFAULT_LOAD || "category";

globalThis.content = "";

const App = () => {
  // Sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [index, setIndex] = useState({});

  // Content
  const [content, setContent] = useState("");

  // Initialize
  useEffect(() => {
    document.title = siteName;
    clearHash();

    // I. Load categories
    fetch("/api/categories")
      .then(response => response.json())
      .then(data => {
        const categories = data || [];

        // II. Load note list for each category
        Promise.all(
          categories.map(category =>
            fetch(`/api/categories/${category}/notes`)
              .then(response => response.json())
              .then(notes => ({ category: category, notes: notes }))
              .catch(() => ({ category: category, notes: [] }))
          )
        ).then(results => {
          const map = {};
          results.forEach(({ category, notes }) => { map[category] = notes; });
          setIndex(map);
        });

        // I and II will finish set `index`.

        // III. Set initial content
        // `category`              → load the first category
        // `categories`            → load all categories
        // `category_name`         → load a specific category, e.g. `Life`
        // `category_name:note`    → load a specific note, e.g. `Life:Note1.txt`
        let content_ = "";
        if (defaultLoad === "categories") {
          content_ = "";
        } else if (defaultLoad === "category") {
          content_ = categories.length > 0 ? "[category]" + categories[0] : "";
        } else if (defaultLoad.includes(":")) {
          const colonIndex = defaultLoad.indexOf(":");
          const cat = defaultLoad.slice(0, colonIndex);
          const note = defaultLoad.slice(colonIndex + 1);
          content_ = cat && note ? "[note]" + cat + ":" + note : "";
        } else if (defaultLoad) {
          content_ = "[category]" + defaultLoad;
        }

        globalThis.content = content_;
        setContent(content_);
        console.log("content:", content_ || "(all categories)");
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div className={clsx(styles.wrapper, styles.wrapperInlineBlock)}>
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
          <Content content_={content} />
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
