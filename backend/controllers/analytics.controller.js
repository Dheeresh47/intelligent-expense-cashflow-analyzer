const analyticsService = require('../services/analytics.service');

exports.getAnalyticsController = async (req, res) => {
  try {
    const result = await analyticsService.getAnalytics();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
