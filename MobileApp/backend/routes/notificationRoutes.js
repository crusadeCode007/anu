const express = require('express');
const {
  getNotifications,
  createManualNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.post('/', adminOnly, createManualNotification);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', adminOnly, deleteNotification);

module.exports = router;
