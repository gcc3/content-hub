const fs = require("fs");
const path = require("path");
const { ROOT } = require("./local-ident");

// Where the @pages alias points. src/pages is a repo of its own — PAGES_REPO in
// .env — git ignored here and simply not there on a deployment that has no
// landing pages to serve, so nothing may import it by path: an absent folder is
// a build that cannot resolve rather than a site without pages.
//
// Everything that reaches for a page goes through the alias, and when the
// folder is missing it lands on src/pages-fallback: the same three modules,
// holding no pages. The content app is the whole site then, which is the
// correct answer for a deployment that never asked for any.
//
// index.js and not the folder, because an empty src/pages resolves no better
// than a missing one.
const PAGES_DIR = fs.existsSync(path.join(ROOT, "src/pages/index.js"))
  ? path.join(ROOT, "src/pages")
  : path.join(ROOT, "src/pages-fallback");

module.exports = { PAGES_DIR };
