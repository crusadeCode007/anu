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
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.route('/')
    .get(protect, getCustomers)
    .post(protect, upload.single('image'), createCustomer);

router.route('/:id')
    .get(protect, getCustomerById)
    .put(protect, upload.single('image'), updateCustomer)
    .delete(protect, deleteCustomer);

router.post('/:id/purchase', protect, addPurchase);

module.exports = router;
