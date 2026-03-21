import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Content from "./components/Content/Content";
import Sidebar from "./components/Sidebar/Sidebar";
import Copyright from "./components/Copyright/Copyright";
import { SITE_NAME } from "./constants";
import styles from "./app.module.css";

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    document.title = SITE_NAME;

    fetch("/api/categories")
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    const firstCategory = categories[0];
    if (!firstCategory) {
      return;
    }

    setCategory(firstCategory);
  }, [categories]);

  useEffect(() => {
    if (!category) {
      setNotes([]);
      return;
    }

    fetch(`/api/notes/${category}`)
      .then(response => response.json())
      .then(data => setNotes(data))
      .catch(error => console.error(error));
  }, [category]);

  return (
    <div className={clsx(styles.wrapper, styles.wrapperInlineBlock)}>
      {!isSidebarCollapsed && (
        <Sidebar
          category={category}
          notes={notes}
          onCollapse={() => setIsSidebarCollapsed(true)}
        />
      )}

      <div
        className={clsx(styles.content, { [styles.contentExpanded]: isSidebarCollapsed })}
      >
        <div className="content-view" id="main-view">
          <Content category={category} notes_={notes} />
          <Copyright />
        </div>

        {isSidebarCollapsed && (
          <div
            id="btn-expand-sidbar"
            className={styles.expandSidebarBtn}
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
