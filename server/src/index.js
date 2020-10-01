const express = require('express');
const cors = require('cors');
const path = require('path'); // @TODO: remove it to service

const { getTile } = require('./services/tiles');
const { getSvgWithMeta } = require('./services/svg');

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
      svg: await getSvgWithMeta(
        // @TODO: remove it to service
        path.resolve(__dirname, '../public/objects/table.svg')
      ),
      rotate: 270,
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
      svg: await getSvgWithMeta(
        // @TODO: remove it to service
        path.resolve(__dirname, '../public/objects/table.svg')
      ),
      rotate: 90,
      position: {
        lat: 4.7575368113083254,
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
