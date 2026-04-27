const express = require('express');
const router = express.Router();
const { createUser, getUsers, deleteUser } = require('../controllers/userController');
const { protect, requireAdmin } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, requireAdmin, getUsers)
    .post(protect, requireAdmin, createUser);

router.route('/:id')
    .delete(protect, requireAdmin, deleteUser);

module.exports = router;
