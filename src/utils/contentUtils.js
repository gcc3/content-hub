export function parseContent(content_ = "") {
  let type = "null";
  let category = "";
  let note = "";

  if (content_.startsWith("[category]")) {
    type = "category";

    const category_colon_note = content_.slice("[category]".length);
    const colonIndex = category_colon_note.indexOf(":");
    if (colonIndex === -1) {
      note = category_colon_note;
    } else {
      category = category_colon_note.slice(0, colonIndex);
      note = category_colon_note.slice(colonIndex + 1);
    }
  }

  if (content_.startsWith("[note]")) {
    type = "note";

    const category_colon_note = content_.slice("[note]".length);
    const colonIndex = category_colon_note.indexOf(":");
    if (colonIndex === -1) {
      note = category_colon_note;
    } else {
      category = category_colon_note.slice(0, colonIndex);
      note = category_colon_note.slice(colonIndex + 1);
    }
  }

  if (content_ === "[categories]") {
    type = "categories";
  }

  return {
    type,
    category,
    note,
  }
}
