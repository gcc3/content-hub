require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const { noteListing } = require('./utils/noteUtils');
const { createRealtimeWatcher } = require('./utils/realtimeUtils');

const app = express();
const port = process.env.PORT || 3000;
const corsOrigin = process.env.CORS_ORIGIN || '*';
const publicDir = path.join(__dirname, '../public');
const notesDir = path.join(publicDir, 'notes');

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', corsOrigin);
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  return next();
});

// Logging middleware for API requests
app.use('/api', (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    console.log(`[API] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`);
  });
  next();
});

// Logging middleware for static file requests
app.use((req, res, next) => {
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
app.get('/api/watch', sseHandler);

// Serve the built frontend and static note files from the same server.
app.use(express.static(publicDir));

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
})

// Get full index: { "": ["root.md"], "category1": ["abc.md"], ... }
// - Keys are category names (subdirectory names); "" key holds root-level notes
// - For each category, if a .markdown/ subfolder exists its contents are used instead
app.get('/api/index', (req, res) => {
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
app.get('/api/categories', (req, res) => {
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
app.get('/api/categories/__root__/notes', (req, res) => {
  res.json(noteListing(notesDir));
});

// List notes in a category
// The notes folder structure can be either:
// note/Note.md
// note/Note.txt, note/.markdown/Note.md, .md build from .txt
app.get('/api/categories/:category/notes', (req, res) => {
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

app.listen(port, () => {
  const pageUrl = `http://localhost:${port}/`;
  const apiBaseUrl = `http://localhost:${port}/api`;
  const apiEndpoints = [
    `GET ${apiBaseUrl}/index`,
    `GET ${apiBaseUrl}/categories`,
    `GET ${apiBaseUrl}/categories/:category/notes`,
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
