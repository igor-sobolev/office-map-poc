const express = require('express');
const cors = require('cors');

const { getTile } = require('./services/tiles');

const app = express();
const port = 8080;

app.use(cors());

app.get('/tile', async (req, res) => {
  const { zoom, x, y } = req.query;
  try {
    const image = await getTile(x, y, zoom);
    res.send(image);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.get('/objects', async (req, res) => {
  const objects = [
    {
      type: 'table',
      rotate: 0,
      position: {
        lat: 24.972668049404348,
        lng: 61.267712443011675,
      },
      meta: {
        computer: 'Intel i5-6400, 16Gb RAM, Nvidia GTX-970',
        owner: 'Ivan Ivanov',
      },
    },
    {
      type: 'table',
      rotate: 90,
      position: {
        lat: 1.7575368113083254,
        lng: -30.5859375,
      },
      meta: {
        computer: 'Intel i5-6500, 8Gb RAM, Nvidia GTX-1030',
        owner: 'Petr Petrov',
      },
    },
  ];

  res.send(objects);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
