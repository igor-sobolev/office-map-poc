const objectConvertor = (object) => ({
  name: object.name,
  position: object.position,
  proportions: object.proportions,
  rotate: object.rotate,
  svg: object.svg,
  meta: object.meta,
});

module.exports = {
  objectConvertor,
};
