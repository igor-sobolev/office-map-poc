const express = require('express');

const { getTile } = require('./services/tiles');

const app = express();
const port = 8080;

app.get('/', async (req, res) => {
  const { zoom, x, y } = req.query;
  console.log(zoom, x, y);
  try {
    const image = await getTile(x, y, zoom);
    console.log(image);
    res.send(image);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
