const path = require('path');

const { getObjectSvgByType } = require('./svg');
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
    svg: await getObjectSvgByType(object.type, { rotate: object.rotate }),
  }));

  return Promise.all(newObjects);
};

module.exports = { getAllBuildings };
