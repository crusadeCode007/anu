const Notification = require('../models/Notification');
const { createNotification } = require('../services/notificationService');

const getNotifications = async (req, res) => {
  const notifications = await Notification.find({
    $or: [{ targetRole: 'all' }, { targetRole: req.user.role }]
  })
    .populate('createdBy', 'username role')
    .sort({ createdAt: -1 });

  res.json(
    notifications.map((notification) => ({
      ...notification.toObject(),
      isRead: notification.readBy.some((id) => id.equals(req.user._id))
    }))
  );
};

const createManualNotification = async (req, res) => {
  const { title, message, type, targetRole } = req.body;

  if (!title || !message) {
    return res.status(400).json({ message: 'Title and message are required' });
  }

  const notification = await createNotification({
    title,
    message,
    type,
    targetRole,
    createdBy: req.user._id
  });

  res.status(201).json(notification);
};

const markAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  if (!notification.readBy.some((id) => id.equals(req.user._id))) {
    notification.readBy.push(req.user._id);
    await notification.save();
  }

  res.json({ message: 'Notification marked as read' });
};

const markAllAsRead = async (req, res) => {
  await Notification.updateMany(
    {
      $or: [{ targetRole: 'all' }, { targetRole: req.user.role }],
      readBy: { $ne: req.user._id }
    },
    { $addToSet: { readBy: req.user._id } }
  );

  res.json({ message: 'All notifications marked as read' });
};

const deleteNotification = async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  await notification.deleteOne();
  res.json({ message: 'Notification deleted successfully' });
};

module.exports = {
  getNotifications,
  createManualNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
