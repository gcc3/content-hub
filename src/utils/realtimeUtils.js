const fs = require('fs');
const path = require('path');

/**
 * Creates a file-system watcher for the given directory and returns
 * an Express route handler for the SSE `/api/watch` endpoint.
 *
 * @param {string} notesDir - Absolute path to the notes directory to watch.
 * @returns {{ sseHandler: import('express').RequestHandler }}
 */
function createRealtimeWatcher(notesDir) {
  const watchClients = new Set();

  function notify(filename) {
    if (!filename || path.basename(filename).startsWith('.')) return;
    const message = "data: " + filename + "\n\n";
    for (const res of watchClients) {
      res.write(message);
    }
  }

  // Recursively watch a directory and all existing subdirectories.
  // fs.watch without `recursive` is supported on all platforms.
  function watchDir(dir) {
    fs.watch(dir, (eventType, filename) => {
      if (!filename) return;
      const fullPath = path.join(dir, filename);
      notify(path.relative(notesDir, fullPath));
      // If a new directory was created, start watching it too
      try {
        if (fs.statSync(fullPath).isDirectory()) {
          watchDir(fullPath);
        }
      } catch (_) { }
    });

    // Watch each existing subdirectory
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (_) { return; }
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        watchDir(path.join(dir, entry.name));
      }
    }
  }

  watchDir(notesDir);

  // SSE endpoint — clients subscribe here to receive change notifications
  function sseHandler(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    watchClients.add(res);
    req.on('close', () => {
      watchClients.delete(res);
    });
  }

  return { sseHandler };
}

module.exports = { createRealtimeWatcher };
