const sharp = require('sharp');
const path = require('path');

const TILE_SIZE = 256;

const getTile = (x, y, zoom) => {
  const number = getNumberOfTiles(zoom);
  const picSize = number * TILE_SIZE;
  const imagePath = path.resolve(__dirname, '../../public/building1.jpg'); // example

  if (x >= number || y >= number || x < 0 || y < 0) return null;

  return sharp(imagePath)
    .resize(picSize, picSize, { fit: 'cover' })
    .extract({
      left: x * TILE_SIZE,
      top: y * TILE_SIZE,
      width: TILE_SIZE,
      height: TILE_SIZE,
    })
    .toBuffer();
};

const getNumberOfTiles = (zoom) => 1 << zoom;

module.exports = {
  getTile,
};
