require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const { noteListing } = require('./utils/note');
const { createRealtimeWatcher } = require('./utils/realtime');

const app = express();
const port = process.env.PORT || 3000;
const corsOrigin = process.env.CORS_ORIGIN || '*';
const basePath = (process.env.BASE_PATH || '').replace(/\/$/, '');
const publicDir = path.join(__dirname, '../public');
const notesDir = path.join(publicDir, 'notes');
// Written by src/build/prerender.js: one static HTML file per URL, each with
// its own title, description and content already in it. Missing until the
// build has run, so every route here falls back to the empty shell. Kept out
// of publicDir so the pages are only reachable at the URL they belong to.
const prerenderDir = path.join(__dirname, '../.prerender');

const shell = path.join(publicDir, 'index.html');
const prerendered = (name) => {
  const file = path.join(prerenderDir, `${name}.html`);
  return fs.existsSync(file) ? file : shell;
};

const router = express.Router();

// CORS middleware
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', corsOrigin);
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  return next();
});

// Parse JSON request bodies
app.use(express.json());

// Logging middleware for API requests
router.use('/api', (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    console.log(`[API] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`);
  });
  next();
});

// Logging middleware for static file requests
router.use((req, res, next) => {
  const isStaticFileRequest =
    (req.method === 'GET' || req.method === 'HEAD')
    && (req.path.startsWith('/notes/') || path.extname(req.path) !== '');

  if (!isStaticFileRequest) {
    return next();
  }

  const startTime = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    console.log(`[STATIC] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`);
  });

  return next();
});

// Set up the SSE watcher for real-time updates
// SSE endpoint — clients subscribe here to receive change notifications
const { sseHandler } = createRealtimeWatcher(notesDir);
router.get('/api/watch', sseHandler);

// Serve the built frontend and static note files from the same server.
// index: false — "/" is answered below, with the prerendered front page rather
// than the shell express.static would reach for on its own. Dotfiles keep the
// default handling: the notes live in .markdown/ and .images/ folders, and
// ignoring dotfiles here takes every note body and image down with it.
router.use(express.static(publicDir, { index: false }));

// Serve the main page
router.get('/', (req, res) => {
  res.sendFile(prerendered('index'));
})

// Landing pages: one per folder in src/pages, served at /<folder> (e.g. /liveboard).
// Each gets the copy of itself the build rendered, so the page has a title and
// its words in it before the bundle arrives and takes over.
const pagesDir = path.join(__dirname, 'pages');
// A page is a folder that describes itself: src/pages also holds common/, which
// is shared parts rather than anything with a URL.
const pageSlugs = fs.existsSync(pagesDir)
  ? fs.readdirSync(pagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => fs.existsSync(path.join(pagesDir, name, 'meta.json')))
  : [];

router.get('/:page', (req, res, next) => {
  if (!pageSlugs.includes(req.params.page)) {
    return next();
  }
  // index.html links its assets relatively, so keep the path free of a trailing
  // slash — and one page one URL, which is also what the canonical tag says.
  if (req.path.endsWith('/')) {
    return res.redirect(301, `${basePath}/${req.params.page}`);
  }
  return res.sendFile(prerendered(req.params.page));
})

// Get full index: { "": ["root.md"], "category1": ["abc.md"], ... }
// - Keys are category names (subdirectory names); "" key holds root-level notes
// - For each category, if a .markdown/ subfolder exists its contents are used instead
router.get('/api/index', (req, res) => {
  fs.readdir(notesDir, { withFileTypes: true }, (err, entries) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read notes directory' });
    }
    const index = {};

    // Root-level .md files → "__root__" key
    index["__root__"] = noteListing(notesDir);

    // One entry per category directory
    const categories = entries
      .filter(e => e.isDirectory() && !e.name.startsWith('.'))
      .map(e => e.name);

    for (const category of categories) {
      const categoryDir = path.join(notesDir, category);
      const markdownDir = path.join(categoryDir, '.markdown');
      const isDotMarkdown = fs.existsSync(markdownDir) && fs.statSync(markdownDir).isDirectory();
      if (isDotMarkdown) {
        index[category] = noteListing(markdownDir).map(note => path.posix.join('.markdown', note));
      } else {
        index[category] = noteListing(categoryDir);
      }
    }

    res.json(index);
  });
});

// List categories
router.get('/api/categories', (req, res) => {
  fs.readdir(notesDir, { withFileTypes: true }, (err, entries) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read notes directory' });
    }
    const directories = entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
      .map((entry) => entry.name);
    res.json(directories);
  });
});

// List root-level notes
router.get('/api/categories/__root__/notes', (req, res) => {
  res.json(noteListing(notesDir));
});

// List notes in a category
// The notes folder structure can be either:
// note/Note.md
// note/Note.txt, note/.markdown/Note.md, .md build from .txt
router.get('/api/categories/:category/notes', (req, res) => {
  const category = req.params.category;
  const categoryDir = path.resolve(notesDir, category);
  const markdownDir = path.join(categoryDir, '.markdown');
  if (!categoryDir.startsWith(notesDir)) {
    return res.status(400).json({ error: 'Invalid category name' });
  }

  const isDotMarkdownExists = fs.existsSync(markdownDir) && fs.statSync(markdownDir).isDirectory();
  if (isDotMarkdownExists) {
    return res.json(noteListing(markdownDir).map(note => path.posix.join('.markdown', note)));
  } else {
    return res.json(noteListing(categoryDir));
  }
});

// Post a comment for a note
// Appends to public/notes/.comments.json
router.post('/api/comments', (req, res) => {
  const { content, email, comment } = req.body || {};
  if (!email || !comment) {
    return res.status(400).json({ error: 'email and comment are required' });
  }

  const timestamp = Date.now();
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
  const commentsFile = path.join(notesDir, '.comments.json');

  let comments = [];
  if (fs.existsSync(commentsFile)) {
    try {
      comments = JSON.parse(fs.readFileSync(commentsFile, 'utf8'));
    } catch {
      comments = [];
    }
  }

  comments.push({ timestamp, ip, content, email, comment });
  fs.writeFile(commentsFile, JSON.stringify(comments, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Failed to save comment:', err);
      return res.status(500).json({ error: 'Failed to save comment' });
    }
    console.log(`[COMMENT] saved to ${commentsFile}`);
    res.status(201).json({ ok: true, timestamp });
  });
});

// Get comments for a specific content
router.get('/api/comments/:content', (req, res) => {
  const { content } = req.params;
  const commentsFile = path.join(notesDir, '.comments.json');

  if (!fs.existsSync(commentsFile)) {
    return res.json([]);
  }

  try {
    const comments = JSON.parse(fs.readFileSync(commentsFile, 'utf8'));
    if (!Array.isArray(comments)) {
      return res.json([]);
    }
    const filteredComments = comments
      .filter((item) => item && item.content === content)
      .map(({ ip, email, ...safeComment }) => safeComment);
    return res.json(filteredComments);
  } catch {
    return res.status(500).json({ error: 'Failed to read comments' });
  }
});

// Mount all routes under basePath (empty string = root, '/docs' = subpath)
app.use(basePath, router);

app.listen(port, () => {
  const pageUrl = `http://localhost:${port}${basePath}/`;
  const apiBaseUrl = `http://localhost:${port}${basePath}/api`;
  const apiEndpoints = [
    `GET ${apiBaseUrl}/index`,
    `GET ${apiBaseUrl}/categories`,
    `GET ${apiBaseUrl}/categories/:category/notes`,
    `GET ${apiBaseUrl}/comments/:content`,
    `POST ${apiBaseUrl}/comments`,
  ];
  console.log(`Webapp endpoint: ${pageUrl}`);
  console.log(`API endpoint: ${apiBaseUrl}`);
  console.log('\nAvailable APIs:');
  apiEndpoints.forEach((endpoint) => {
    console.log(`- ${endpoint}`);
  });

  // newline
  console.log();
})
