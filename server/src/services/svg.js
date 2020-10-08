const svgTools = require('simple-svg-tools');
const path = require('path');

const getObjectSvgByType = async (type, { rotate }) => {
  const filePath = path.resolve(__dirname, `../data/store/objects/${type}.svg`);
  try {
    const svg = await svgTools.ImportSVG(filePath);
    const optimized = await svgTools.SVGO(svg);
    const rotated = optimized
      .toString()
      .replace('<svg', `<svg transform="rotate(${rotate})"`);

    return rotated;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getObjectSvgByType };
