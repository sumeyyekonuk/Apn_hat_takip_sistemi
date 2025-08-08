const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const auth = require('../middleware/auth');

router.get('/active-sim-count', auth(['admin', 'user']), reportsController.activeSimCardCount);
router.get('/operator-distribution', auth(['admin', 'user']), reportsController.operatorDistribution);
router.get('/customer-allocations', auth(['admin', 'user']), reportsController.customerAllocations);
router.get('/allocations-by-date', auth(['admin', 'user']), reportsController.allocationsByDate);

module.exports = router;