const Notification = require('../models/Notification');

const createNotification = async ({
  title,
  message,
  type = 'info',
  targetRole = 'all',
  createdBy,
  review
}) => {
  return Notification.create({
    title,
    message,
    type,
    targetRole,
    createdBy,
    review
  });
};

module.exports = { createNotification };
