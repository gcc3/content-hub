require('dotenv').config();
const fs = require('fs');
const express = require('express');

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('gcc3')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
