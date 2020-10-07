const express = require('express');
const router = express.Router();

const tilesController = require('../controllers/tiles');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log(`Tile ctrl - ${req.path}, Time: ${new Date()}`);
  next();
});

// define the home page route
router.get('/:buildingName', tilesController.getTile);

module.exports = router;
