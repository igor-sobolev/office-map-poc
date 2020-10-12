const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const buildingsPath = path.resolve(__dirname, '../data/json/buildings.json');
const objectsPath = path.resolve(__dirname, '../data/json/objects.json');

const { getObjectSvgByType } = require('./svg');
const { objectConvertor } = require('../helpers/objects');

const getAllBuildings = () => {
  const buildings = require(buildingsPath);
  const buildingsWithSvg = buildings.map(async (building) => ({
    ...building,
    objects: await addSvgToObjects(building.objects),
  }));

  return Promise.all(buildingsWithSvg);
};

const getAllObjects = async () => {
  const objects = require(objectsPath);

  return await addSvgToObjects(objects);
};

const addSvgToObjects = (objects) => {
  const newObjects = objects.map(async (object) => ({
    ...object,
    svg: await getObjectSvgByType(object.name, { rotate: object.rotate }),
  }));

  return Promise.all(newObjects);
};

const updateBuildingObjectsByBuildingName = (buildingName, objects) => {
  const buildings = require(buildingsPath);
  const updatedBuildings = buildings.map((currentBuilding) => ({
    ...currentBuilding,
    objects:
      currentBuilding.name === buildingName
        ? objects.map(objectConvertor)
        : currentBuilding.objects,
  }));
  fs.writeFile(buildingsPath, JSON.stringify(updatedBuildings), (err) => {
    if (err) return console.log(err);
    console.log(JSON.stringify(updatedBuildings));
    console.log('writing to ' + buildingsPath);
  });
};

const getImageByObjectName = async (objectName) => {
  const imagePath = path.resolve(
    __dirname,
    `../data/store/objects/${objectName}.svg`
  );

  const image = fs.readFileSync(imagePath);

  return sharp(image).toFormat('png').toBuffer();
};

module.exports = {
  getAllBuildings,
  getAllObjects,
  updateBuildingObjectsByBuildingName,
  getImageByObjectName,
};
