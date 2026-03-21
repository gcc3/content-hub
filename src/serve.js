require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('gcc3')
})

app.get('/api/notes', (req, res) => {
  const noteDir = path.join(__dirname, '../public/note');
  fs.readdir(noteDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read notes directory' });
    }
    res.json(files);
  });
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
