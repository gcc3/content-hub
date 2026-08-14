// The landing pages a deployment has when it has none.
//
// src/pages is a separate repo and @pages resolves here when it is absent, so
// every reader gets an empty set of pages instead of an import that will not
// resolve. See src/build/pages-dir.js.
const PAGES = {};

// No path is a landing page, so the content app answers all of them.
const getPage = () => null;

export { PAGES, getPage };
