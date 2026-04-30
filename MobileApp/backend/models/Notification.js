const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'review'],
      default: 'info'
    },
    targetRole: {
      type: String,
      enum: ['all', 'admin', 'sales'],
      default: 'all'
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
