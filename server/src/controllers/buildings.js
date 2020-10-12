const {
  getAllBuildings,
  getAllObjects,
  updateBuildingObjectsByBuildingName,
  getImageByObjectName,
} = require('../services/buildings');

const getBuildings = async (req, res) => {
  try {
    const buildings = await getAllBuildings();

    res.json(buildings);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const getObjects = async (req, res) => {
  try {
    const objects = await getAllObjects();

    res.json(objects);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const updateBuildingObjects = async (req, res) => {
  const { buildingName } = req.params;
  const objects = req.body;

  try {
    await updateBuildingObjectsByBuildingName(buildingName, objects);

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const getObjectIcon = async (req, res) => {
  const { objectName } = req.params;

  try {
    const image = await getImageByObjectName(objectName);

    res.set('Content-Type', 'image/png');
    res.set('Content-Disposition', 'inline');
    res.send(image);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = {
  getBuildings,
  getObjectIcon,
  getObjects,
  updateBuildingObjects,
};
