// This is storeRoutes
const express = require('express');
const router = express.Router();
const { getAllStores, rateStore, getStoreOwnerDashboard } = require('../controllers/storeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize(['Normal User']), getAllStores);
router.put('/:storeId/rate', protect, authorize(['Normal User']), rateStore);
router.get('/owner-dashboard', protect, authorize(['Store Owner']), getStoreOwnerDashboard);

module.exports = router;
