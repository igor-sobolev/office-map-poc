const express = require('express');
const router = express.Router();

const buildingsController = require('../controllers/buildings');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log(`Building ctrl - ${req.path}, Time: ${new Date()}`);
  next();
});

// define the home page route
router.get('/', buildingsController.getBuildings);
router.get('/objects', buildingsController.getObjects);
router.put('/:buildingName/objects', buildingsController.updateBuildingObjects);

module.exports = router;
