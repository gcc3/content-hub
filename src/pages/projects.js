import liveboardMeta from "./liveboard/meta.json";
import pobMeta from "./pob/meta.json";
import pslMeta from "./psl/meta.json";
import qMeta from "./q/meta.json";
import simpleAiMeta from "./simple-ai/meta.json";
import stashMeta from "./stash/meta.json";
import tiktMeta from "./tikt/meta.json";

// Every landing page, in the order they are offered. The sitemap, the
// prerendered <head> of each page and the front page's structured data are all
// built from this, so a new project is added in one place — its folder — and
// shows up in all three. Nothing here imports a page component: this is a list
// of what exists, and seven pages of JSX is a lot to carry for that.
const project = (slug, meta) => ({
  slug,
  path: `/${slug}`,
  name: meta.name,
  repositories: meta.repositories,
  ...meta.seo,
});

const PROJECTS = [
  project("simple-ai", simpleAiMeta),
  project("psl", pslMeta),
  project("liveboard", liveboardMeta),
  project("pob", pobMeta),
  project("stash", stashMeta),
  project("tikt", tiktMeta),
  project("q", qMeta),
];

export { PROJECTS };
