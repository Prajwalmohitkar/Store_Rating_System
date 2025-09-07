//This is adminRoutes
const express = require('express');
const router = express.Router();
const { getDashboardStats, addStore, addUpdateUser, getAllStoresAdmin, getAllUsers } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorize(['System Administrator']), getDashboardStats);
router.post('/users', protect, authorize(['System Administrator']), addUpdateUser);
router.get('/users', protect, authorize(['System Administrator']), getAllUsers);
router.post('/stores', protect, authorize(['System Administrator']), addStore);
router.get('/stores', protect, authorize(['System Administrator']), getAllStoresAdmin);

module.exports = router;
