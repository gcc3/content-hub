export function parseContent(content_ = "") {
  if (!content_ || typeof content_ !== "string") {
    return { type: "", category: "", note: "" };
  }

  if (content_.startsWith("[category]")) {
    const category_ = content_.slice("[category]".length);
    if (category_) {
      return {
        type: "category",
        category: category_,
        note: "",
      };
    }
  }

  if (content_.startsWith("[note]")) {
    const category_colon_note = content_.slice("[note]".length);
    const colonIndex = category_colon_note.indexOf(":");
    if (colonIndex !== -1) {
      const category_ = category_colon_note.slice(0, colonIndex);
      const note_ = category_colon_note.slice(colonIndex + 1);
      if (category_ && note_) {
        return {
          type: "note",
          category: category_,
          note: note_,
        };
      }
    }
  }

  return { type: "", category: "", note: "" };
}
