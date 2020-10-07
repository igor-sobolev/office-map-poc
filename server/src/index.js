const express = require('express');
const cors = require('cors');

const buildingsRoutes = require('./routes/buildings');
const tilesRoutes = require('./routes/tiles');

const app = express();
const port = 8080;

app.use(cors());

app.use('/buildings', buildingsRoutes);
app.use('/tiles', tilesRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
