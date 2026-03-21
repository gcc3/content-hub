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
  const notesDir = path.join(__dirname, '../public/notes');
  fs.readdir(notesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read notes directory' });
    }
    res.json(files);
  });
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
