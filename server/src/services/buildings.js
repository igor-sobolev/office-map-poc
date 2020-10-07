const path = require('path');

const { getSvgWithMeta } = require('./svg');
const buildings = require('../data/json/buildings.json');

const getAllBuildings = () => {
  const buildingsWithSvg = buildings.map(async (building) => ({
    ...building,
    objects: await addSvgToObjects(building.objects),
  }));

  return Promise.all(buildingsWithSvg);
};

const addSvgToObjects = (objects) => {
  const newObjects = objects.map(async (object) => ({
    ...object,
    svg: await getSvgWithMeta(
      path.resolve(__dirname, '../data/store/objects/table.svg') // @TODO: populate according to type
    ),
  }));

  return Promise.all(newObjects);
};

module.exports = { getAllBuildings };
