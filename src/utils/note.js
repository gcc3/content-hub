const fs = require('fs');
const path = require('path');

const loadNoterc = (notercPath) => {
  const noterc = {
    retrieveOrder: 'asc',
  };
  if (!fs.existsSync(notercPath) || !fs.statSync(notercPath).isFile()) {
    return noterc;
  }

  try {
    const notercContent = fs.readFileSync(notercPath, 'utf-8');
    const lines = notercContent.split('\n');
    for (const line of lines) {
      const [key, value] = line.split('=').map(part => part.trim());
      if (key === 'retrieveOrder' && (value === 'asc' || value === 'desc')) {
        noterc.retrieveOrder = value;
      }
    }
  } catch (err) {
    console.error('Failed to read or parse .noterc:', err);
  }
  return noterc;
};

const loadNoteignore = (noteignorePath) => {
  if (!fs.existsSync(noteignorePath) || !fs.statSync(noteignorePath).isFile()) {
    return [];
  }

  try {
    const noteignoreContent = fs.readFileSync(noteignorePath, 'utf-8');
    return noteignoreContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '' && !line.startsWith('#'));
  } catch (err) {
    console.error('Failed to read or parse .noteignore:', err);
    return [];
  }
};

const isIgnored = (name, ignorePatterns) => {
  return ignorePatterns.some((pattern) => {
    if (!pattern.includes('*')) {
      return name === pattern;
    }
    const regex = new RegExp('^' + pattern.split('*').map(part =>
      part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
    return regex.test(name);
  });
};

const noteListing = (dirPath) => {
  const noterc = loadNoterc(path.join(dirPath, '.noterc'));
  const noteignore = loadNoteignore(path.join(dirPath, '.noteignore'));
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === '.md' && !entry.name.startsWith('.'))
    .filter((entry) => !isIgnored(entry.name, noteignore))
    .map((entry) => entry.name)
    .sort((a, b) => noterc.retrieveOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a));
};

module.exports = {
  loadNoterc,
  loadNoteignore,
  noteListing,
};
