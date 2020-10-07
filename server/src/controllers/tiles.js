const { getTile: findTile } = require('../services/tiles');

const getTile = async (req, res) => {
  const { zoom, x, y } = req.query;
  const { buildingName } = req.params;
  try {
    const image = await findTile(x, y, zoom, buildingName);
    res.send(image);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = {
  getTile,
};
