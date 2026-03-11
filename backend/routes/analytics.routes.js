const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

// analytics endpoint
router.get('/', analyticsController.getAnalyticsController);

module.exports = router;
