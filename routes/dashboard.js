const express = require("express");
const dashboardController = require('../controllers/dashboard');
const {protectRoute} = require('../jwtmid');


const router = express.Router();

router.get('/', protectRoute, dashboardController.dashboardView);
router.get('/profile', protectRoute, dashboardController.board_show_profile);

module.exports = router;

