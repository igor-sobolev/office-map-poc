const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const buildingsPath = path.resolve(
  __dirname,
  '../../public/data/json/buildings.json'
);
const objectsPath = path.resolve(
  __dirname,
  '../../public/data/json/objects.json'
);

const { objectConvertor } = require('../helpers/objects');

const getAllBuildings = () => require(buildingsPath);

const getAllObjects = () => require(objectsPath);

const updateBuildingObjectsByBuildingName = (buildingName, objects) => {
  const buildings = getAllBuildings();
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
  const objects = require(objectsPath);
  const foundObject = objects.find((object) => object.name === objectName);

  if (!foundObject) throw new Error('Bad object name');

  const imageName = foundObject && foundObject.image;
  const imagePath = path.resolve(
    __dirname,
    `../../public/data/store/objects/${imageName}`
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
