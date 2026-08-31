const path = require("path");
const { ROOT } = require("./local-ident");
const { PAGES_DIR } = require("./pages-dir");

// Where an imported image lands in the built site. The source lives with the
// page that shows it — src/pages/<page>/assets/… — and is served from
// /assets/<page>/…, the assets segment folded away. Webpack names the emitted
// file through here and the prerender names the URL through here, so the
// address a crawler reads is the address the bundle uses.
const assetPath = (filename) => {
  const parts = path.relative(PAGES_DIR, path.resolve(ROOT, filename)).split(path.sep);
  if (parts[0] === "..") {
    // Not a page asset; the bare file name is all there is to say.
    return `assets/${parts[parts.length - 1]}`;
  }
  return `assets/${parts.filter((part) => part !== "assets").join("/")}`;
};

module.exports = { assetPath };
