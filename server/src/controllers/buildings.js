const { getAllBuildings } = require('../services/buildings');

const getBuildings = async (req, res) => {
  try {
    const buildings = await getAllBuildings();

    res.json(buildings);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = {
  getBuildings,
};
