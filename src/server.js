require('dotenv').config();
const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('gcc3')
})

app.get('/note/:note', (req, res) => {
  const note = req.params.note;
  fs.readFile('./src/note/.markdown/' + note + " Note.md", 'utf-8', (err, data) => {
    if (err) {
        console.log(err);
        res.status(500).send('An error occurred while reading the markdown file.');
    } else {
        res.send(data);
    }
  });
})

app.get('/projects/:project', (req, res) => {
  const project = req.params.project.replaceAll("_", " ");
  fs.readFile('./src/projects/' + project + ".md", 'utf-8', (err, data) => {
    if (err) {
        console.log(err);
        res.status(500).send('An error occurred while reading the markdown file.');
    } else {
        res.send(data);
    }
  });
})

app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
