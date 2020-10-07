const sharp = require('sharp');
const path = require('path');

const TILE_SIZE = 256;
const EXTENSION_FACTOR = 0.5; // image padding for x axis

const getLongestDimensionSize = ({ width, height }) =>
  width > height ? width : height;

const getNumberOfTiles = (zoom) => 1 << zoom;

const resizeOriginalImage = async (imagePath, picSize) => {
  const image = sharp(imagePath);
  const imageMeta = await image.metadata();
  const longestDimensionSize = getLongestDimensionSize(imageMeta);
  const extensionSize = Math.ceil(longestDimensionSize * EXTENSION_FACTOR);

  const extendedImage = await image
    .extend({
      top: extensionSize,
      left: extensionSize,
      bottom: extensionSize,
      right: extensionSize,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toFormat('png')
    .toBuffer();

  return sharp(extendedImage).resize(picSize, picSize, {
    fit: sharp.fit.contain,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
};

const getTile = async (x, y, zoom, buildingName) => {
  const number = getNumberOfTiles(zoom); // number of tiles map contains for exact zoom level
  const picSize = number * TILE_SIZE; // expected size of image to be resized to
  const imagePath = path.resolve(
    __dirname,
    `../data/store/buildings/${buildingName}.jpg`
  ); // example image

  if (x >= number || y >= number || x < 0 || y < 0) return null; // if outside bounds should return nothing

  const image = await resizeOriginalImage(imagePath, picSize);

  return image // @TODO: store tiles in FS, could be storing on demand or split original resized on upload to server
    .extract({
      left: x * TILE_SIZE,
      top: y * TILE_SIZE,
      width: TILE_SIZE,
      height: TILE_SIZE,
    })
    .toFormat('png')
    .toBuffer();
};

module.exports = {
  getTile,
};
