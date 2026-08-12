const NOTES_LIMIT = 30;
const BASE_PATH = process.env.REACT_APP_BASE_PATH || '';

// What this deployment calls itself. One codebase is served under more than one
// name — "simple-ai doc" here, "gcc³" on gcc3.com — so the name belongs in .env
// rather than in the source. SITE_TITLE is empty when neither is set, which is
// the signal to whoever reads it to keep the title it already had.
const APP_NAME = process.env.REACT_APP_NAME || '';
const APP_SUBTITLE = process.env.REACT_APP_SUBTITLE || '';
const SITE_TITLE = [APP_NAME, APP_SUBTITLE].filter(Boolean).join(' ');

export { NOTES_LIMIT, BASE_PATH, APP_NAME, APP_SUBTITLE, SITE_TITLE };
