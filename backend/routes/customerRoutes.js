const express = require('express');
const router = express.Router();
const { 
    getCustomers, 
    getCustomerById, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer, 
    addPurchase 
} = require('../controllers/customerController');
const { protect, requireAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.route('/')
    .get(protect, getCustomers)
    .post(protect, requireAdmin, upload.single('image'), createCustomer);

router.route('/:id')
    .get(protect, getCustomerById)
    .put(protect, requireAdmin, upload.single('image'), updateCustomer)
    .delete(protect, requireAdmin, deleteCustomer);

router.post('/:id/purchase', protect, requireAdmin, addPurchase);

module.exports = router;
