const { pathThatSvg } = require('path-that-svg');
const fs = require('fs');

const mergePaths = (svg) => {
  const pathRE = /<path.*? d="([\d\w \.\-]+?)"/gim;
  let merged = '';
  let result;

  while (null !== (result = pathRE.exec(svg))) {
    const [, dContent] = result;

    merged += `\n${dContent}`;
  }
  return merged;
};

const getDimensions = (svg) => {
  const widthRE = /<svg.*? width="(\d+)/gm;
  const heightRE = /<svg.*? height="(\d+)"/gm;
  const [, width] = widthRE.exec(svg);
  const [, height] = heightRE.exec(svg);

  return {
    width,
    height,
  };
};

const getSvgWithMeta = (pathToFile) =>
  new Promise((resolve, reject) => {
    fs.readFile(pathToFile, (err, input) => {
      if (err) reject(err);
      pathThatSvg(input)
        .then((convertedFromBuffer) => convertedFromBuffer)
        .then((svgWithPaths) => {
          const path = mergePaths(svgWithPaths);
          const dimensions = getDimensions(svgWithPaths);
          resolve({
            path,
            dimensions,
          });
        })
        .catch((err) => reject(err));
    });
  });

module.exports = { getSvgWithMeta };
