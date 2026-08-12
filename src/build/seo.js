// Everything that goes in a <head> for the sake of a machine — the title and
// description a search result is built from, the canonical URL, the card a link
// unfurls into, and the structured data that tells Google that "q" and "psl"
// are software rather than typos.
//
// The copy itself lives in each page's meta.json, next to the page it belongs
// to; this file only knows how to dress it.

const home = require("../pages/home.json");
const { APP_NAME, SITE_TITLE } = require("../constants");

const SITE_NAME = APP_NAME || "gcc³";
const SITE_URL = (process.env.REACT_APP_SITE_URL || "https://gcc3.com").replace(/\/$/, "");
const AUTHOR_URL = "https://github.com/gcc3";

const escapeAttribute = (value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

// A </script> anywhere inside the JSON would end the block early.
const escapeJson = (value) => JSON.stringify(value, null, 2).replace(/</g, "\\u003c");

const absolute = (pathname) => `${SITE_URL}${pathname === "/" ? "/" : pathname}`;

const meta = (attribute, name, content) => (
  content ? `<meta ${attribute}="${name}" content="${escapeAttribute(content)}" />` : ""
);

// The name on its own, taken from the front of the title: every seo.title is
// written "Name — what it is", and the structured data wants only the name.
const nameOf = (page) => page.title.split(" — ")[0].trim();

// One SoftwareApplication per project. Google reads this type, and it is the
// difference between a page called "q" and a page about a survey tool.
const applicationLd = (project) => {
  const repository = (project.repositories || [])[0] || {};
  const online = Array.isArray(repository.online) ? repository.online : [repository.online];
  const sameAs = [repository.github, ...online].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: nameOf(project),
    alternateName: project.name,
    description: project.description,
    url: absolute(project.path),
    applicationCategory: project.category,
    operatingSystem: project.os,
    ...(project.keywords ? { keywords: project.keywords } : {}),
    ...(project.image ? { screenshot: absolute(project.image) } : {}),
    ...(repository.download ? { downloadUrl: repository.download } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Organization", name: SITE_NAME, url: AUTHOR_URL },
  };
};

// The front page says what the site is and lists what is on it, so the seven
// project pages are reachable from the structured data as well as from a link.
const homeLd = (projects) => ([
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absolute("/"),
    description: HOME.description,
    publisher: { "@type": "Organization", name: SITE_NAME, url: AUTHOR_URL },
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Projects",
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: nameOf(project),
      description: project.blurb,
      url: absolute(project.path),
    })),
  },
]);

// The front page's own copy sits with the pages it introduces, and App.js puts
// the same title in the tab — a tab and a search result that disagree about
// what a page is called are two answers to one question. A deployment that
// names itself in .env is answering that question, so its name wins over the
// one in home.json; the project pages keep their own titles either way.
const HOME = { path: "/", ...home, ...(SITE_TITLE ? { title: SITE_TITLE } : {}) };

// The head for one URL. Everything here is a tag a crawler reads without
// running a line of JavaScript, which is the whole point of prerendering.
const headFor = ({ path, title, description, image, structuredData }) => {
  const url = absolute(path);
  const imageUrl = image ? absolute(image) : "";

  return [
    `<title>${escapeAttribute(title)}</title>`,
    meta("name", "description", description),
    `<link rel="canonical" href="${escapeAttribute(url)}" />`,
    meta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1"),
    meta("property", "og:type", "website"),
    meta("property", "og:site_name", SITE_NAME),
    meta("property", "og:title", title),
    meta("property", "og:description", description),
    meta("property", "og:url", url),
    meta("property", "og:locale", "en_US"),
    imageUrl && meta("property", "og:image", imageUrl),
    meta("name", "twitter:card", imageUrl ? "summary_large_image" : "summary"),
    meta("name", "twitter:title", title),
    meta("name", "twitter:description", description),
    imageUrl && meta("name", "twitter:image", imageUrl),
    `<script type="application/ld+json">${escapeJson(structuredData)}</script>`,
  ].filter(Boolean).join("\n    ");
};

// The head of a project page, and the head of the front page.
const projectHead = (project) => headFor({ ...project, structuredData: applicationLd(project) });

const homeHead = (projects) => headFor({ ...HOME, structuredData: homeLd(projects) });

// Every URL worth crawling, in the order they are listed on the site.
const sitemap = (projects) => [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...[HOME, ...projects].map((page) => `  <url>\n    <loc>${absolute(page.path)}</loc>\n  </url>`),
  "</urlset>",
  "",
].join("\n");

// Nothing here is worth hiding, and the sitemap is worth pointing at.
const robots = () => [
  "User-agent: *",
  "Allow: /",
  "",
  `Sitemap: ${absolute("/sitemap.xml")}`,
  "",
].join("\n");

module.exports = { HOME, SITE_NAME, SITE_URL, homeHead, projectHead, robots, sitemap };
