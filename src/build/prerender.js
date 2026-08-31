#!/usr/bin/env node
// Writes the HTML a crawler sees.
//
// The site is one bundle that decides at runtime which page it is, which means
// every URL used to arrive as an empty <div id="root">: no title, no heading,
// no words. This renders each page once at build time and puts the result on
// disk, so /pob arrives as a page about Pob whether or not anything runs it.
//
// The bundle still boots and takes the page over — nothing here is hydrated, so
// there is no markup contract to keep. What is on disk is a photograph of the
// first frame, correct at build time; the running app is the page itself.
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const Module = require("module");
const { localIdent, ROOT } = require("./local-ident");
const { PAGES_DIR } = require("./pages-dir");
const { assetPath } = require("./asset-url");

const PUBLIC_DIR = path.join(ROOT, "public");
// Outside public/ on purpose. These are reachable at /pob, not at
// /.prerender/pob.html — one page, one URL — and the way to be sure of that is
// to keep them somewhere the static handler never looks. (Hiding them under a
// dot inside public/ would have meant turning dotfiles off there, which also
// hides the notes: they live in .markdown/ and .images/ folders.)
const OUT_DIR = path.join(ROOT, ".prerender");
const TEMPLATE = path.join(PUBLIC_DIR, "index.html");

// --- the parts of webpack that node does not have -------------------------

// The aliases from webpack.config.js, resolved the same way here.
const ALIASES = {
  "@components": path.join(ROOT, "src/components"),
  "@ui": path.join(ROOT, "src/ui"),
  "@utils": path.join(ROOT, "src/utils"),
  "@constants": path.join(ROOT, "src/constants.js"),
  "@pages": PAGES_DIR,
};

const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  const alias = Object.keys(ALIASES).find(
    (key) => request === key || request.startsWith(`${key}/`),
  );
  if (!alias) {
    return resolveFilename.call(this, request, ...rest);
  }
  const rest_ = request.slice(alias.length + 1);
  const target = rest_ ? path.join(ALIASES[alias], rest_) : ALIASES[alias];
  return resolveFilename.call(this, target, ...rest);
};

// css-loader's job: hand back the class names, leave the rules to main.css.
// __esModule has to stay undefined or babel's interop takes the proxy for a
// module and reaches for a .default that is a class name.
require.extensions[".css"] = (module_, filename) => {
  if (!filename.endsWith(".module.css")) {
    module_.exports = {};
    return;
  }
  module_.exports = new Proxy({}, {
    get: (_, local) => (
      typeof local === "string" && local !== "__esModule"
        ? localIdent(filename, local)
        : undefined
    ),
  });
};

// raw-loader's job.
const readAsString = (module_, filename) => {
  module_.exports = fs.readFileSync(filename, "utf8");
};
require.extensions[".txt"] = readAsString;
require.extensions[".md"] = readAsString;

// asset/resource's job: an imported image is its URL. The name comes from the
// same helper webpack emits the file under, so both agree on it.
[".webp", ".png", ".jpg", ".jpeg", ".gif"].forEach((extension) => {
  require.extensions[extension] = (module_, filename) => {
    module_.exports = `/${assetPath(filename)}`;
  };
});

// babel-loader's job. The project .babelrc targets browsers and asks for the
// runtime transform; here the only reader is this node process.
require("@babel/register")({
  cwd: ROOT,
  only: [path.join(ROOT, "src")],
  extensions: [".js", ".jsx"],
  babelrc: false,
  configFile: false,
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    // The bundle compiles JSX to React.createElement and finds React on the
    // window, put there by the script tag — a global there is no reason to
    // recreate here, so this build reaches for react/jsx-runtime instead.
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
});

// --- the parts of a browser that the pages touch while rendering ----------

// Effects do not run in a static render, so what is needed here is small: the
// language picker reads storage and navigator, and the download buttons read
// the user agent. An empty user agent is deliberate — it matches no platform,
// so the page is written with its neutral wording ("Download Pob") rather than
// with a guess that is wrong for most of the people who will read it.
const noop = () => {};

const define = (name, value) => Object.defineProperty(globalThis, name, {
  value, writable: true, configurable: true,
});

const storage = { getItem: () => null, setItem: noop, removeItem: noop, clear: noop };

const location = {
  href: `${(process.env.REACT_APP_SITE_URL || "https://gcc3.com").replace(/\/$/, "")}/`,
  origin: (process.env.REACT_APP_SITE_URL || "https://gcc3.com").replace(/\/$/, ""),
  protocol: "https:",
  pathname: "/",
  search: "",
  hash: "",
  assign: noop,
  replace: noop,
};

const documentStub = {
  documentElement: { lang: "en", style: { setProperty: noop } },
  body: { appendChild: noop, removeChild: noop, classList: { add: noop, remove: noop } },
  title: "",
  createElement: () => ({ style: {}, focus: noop, select: noop, setAttribute: noop }),
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: noop,
  removeEventListener: noop,
  execCommand: () => false,
};

const windowStub = {
  document: documentStub,
  localStorage: storage,
  sessionStorage: storage,
  location,
  innerWidth: 1280,
  innerHeight: 900,
  devicePixelRatio: 1,
  scrollTo: noop,
  addEventListener: noop,
  removeEventListener: noop,
  matchMedia: () => ({ matches: false, addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop }),
  requestAnimationFrame: (callback) => setTimeout(callback, 0),
  cancelAnimationFrame: clearTimeout,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  getComputedStyle: () => ({ getPropertyValue: () => "" }),
};

define("window", windowStub);
define("document", documentStub);
define("localStorage", storage);
define("sessionStorage", storage);
define("history", { replaceState: noop, pushState: noop });
define("navigator", {
  userAgent: "",
  platform: "",
  language: "en-US",
  languages: ["en-US", "en"],
  clipboard: { writeText: () => Promise.resolve() },
});
// A request that never settles: nothing awaits it, and a rejection during a
// static render would only be an unhandled one.
define("fetch", () => new Promise(noop));
define("EventSource", function EventSource() { return { close: noop, addEventListener: noop }; });

// --- render ---------------------------------------------------------------

/* eslint-disable global-require */
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { PROJECTS } = require("@pages/projects");
const { PAGES } = require("@pages");
const { homeHead, projectHead, robots, sitemap } = require("./seo");
const App = require("../App").default;
/* eslint-enable global-require */

const HEAD_START = "<!-- head:start -->";
const HEAD_END = "<!-- head:end -->";
const ROOT_DIV = '<div id="root"></div>';

const template = fs.readFileSync(TEMPLATE, "utf8");

if (!template.includes(HEAD_START) || !template.includes(ROOT_DIV)) {
  throw new Error(`public/index.html is missing the ${HEAD_START} block or ${ROOT_DIV}`);
}

const page = (head, markup) => {
  const start = template.indexOf(HEAD_START) + HEAD_START.length;
  const end = template.indexOf(HEAD_END);
  // A function replacement, so a $& or a $' in the page copy stays what it is.
  return `${template.slice(0, start)}\n    ${head}\n    ${template.slice(end)}`
    .replace(ROOT_DIV, () => `<div id="root">${markup}</div>`);
};

const write = (name, contents) => {
  fs.writeFileSync(path.join(OUT_DIR, name), contents, "utf8");
  console.log(`  ${path.relative(ROOT, path.join(OUT_DIR, name))} (${contents.length} bytes)`);
};

fs.mkdirSync(OUT_DIR, { recursive: true });

console.log("Prerendering...");

write("index.html", page(homeHead(PROJECTS), renderToStaticMarkup(React.createElement(App))));

PROJECTS.forEach((project) => {
  const Page = PAGES[project.slug];
  if (!Page) {
    throw new Error(`no page component for ${project.slug}`);
  }
  write(`${project.slug}.html`, page(projectHead(project), renderToStaticMarkup(React.createElement(Page))));
});

// A page in src/pages with no entry in projects.js would be prerendered by
// nobody and listed in no sitemap — quietly, which is the bad way to find out.
const missing = Object.keys(PAGES).filter(
  (slug) => !PROJECTS.some((project) => project.slug === slug),
);
if (missing.length) {
  throw new Error(`pages missing from src/pages/projects.js: ${missing.join(", ")}`);
}

fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), sitemap(PROJECTS), "utf8");
console.log("  public/sitemap.xml");

fs.writeFileSync(path.join(PUBLIC_DIR, "robots.txt"), robots(), "utf8");
console.log("  public/robots.txt");

console.log(`Prerendered ${PROJECTS.length + 1} pages.`);
