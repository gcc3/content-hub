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

export function parseContent_(content) {
  const type = content.type || "null";
  const category = content.category || "";
  const note = content.note || "";
  return "[" + type + "]" + (category ? category + ":" : "") + note;
}

export function toContentUrl({ type, category = "", note = "" } = {}) {
  let content_;
  if (type === "note") {
    content_ = !category || category === "__root__"
      ? `[note]${note}`
      : `[note]${category}:${note}`;
  } else if (type === "category") {
    content_ = !category || category === "__root__"
      ? `[category]${note}`
      : `[category]${category}:${note}`;
  } else if (type === "categories") {
    content_ = "[categories]";
  } else {
    content_ = "";
  }
  return `${window.location.origin}${window.location.pathname}?content=${encodeURIComponent(content_)}`;
}
