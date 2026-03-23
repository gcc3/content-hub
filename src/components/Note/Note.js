import React, { useEffect, useState } from "react";
import Markdown from "@ui/Markdown";
import { toNoteId } from "@utils/textUtils";
import styles from "./note.module.css";

const Note = ({ category, note_ }) => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!category || !note_) {
      setNote(null);
      setLoading(false);
      return;
    }

    let isCancelled = false;

    setLoading(true);

    // Not RESTful, its content
    fetch(`/notes/${category}/${note_}`)
      .then(async response => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const content = await response.text();
        return { filename: note_, content };
      })
      .then(result => {
        if (!isCancelled) {
          setNote(result);
        }
      })
      .catch(error => {
        if (!isCancelled) {
          console.error(`Failed to fetch note ${note_}:`, error);
          setNote(null);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [category, note_]);

  return (
    <>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : !note ? null : (
        <div id={toNoteId(category, note.filename)} key={note.filename}>
          <Markdown basePath={`/notes/${category}/`}>{note.content}</Markdown>
        </div>
      )}
    </>
  );
};

export default Note;
