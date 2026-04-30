const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Review = require('../models/Review');
const Notification = require('../models/Notification');

const seedData = async () => {
  await Promise.all([User.deleteMany(), Review.deleteMany(), Notification.deleteMany()]);
  console.log('Cleared existing review and notification demo data');

  const [adminPassword, salesPassword] = await Promise.all([
    bcrypt.hash('admin123', 10),
    bcrypt.hash('sales123', 10)
  ]);

  const [admin, sales] = await User.create([
    { username: 'admin', password: adminPassword, role: 'admin' },
    { username: 'sales', password: salesPassword, role: 'sales' }
  ]);

  const reviews = await Review.create([
    {
      customerName: 'Nimal Perera',
      customerEmail: 'nimal@example.com',
      rating: 5,
      category: 'Service',
      comment: 'Fast service and very helpful staff.',
      status: 'Approved',
      createdBy: sales._id
    },
    {
      customerName: 'Ayesha Fernando',
      customerEmail: 'ayesha@example.com',
      rating: 4,
      category: 'Product',
      comment: 'Good product quality, packaging can improve.',
      status: 'Pending',
      createdBy: sales._id
    },
    {
      customerName: 'Kavin Silva',
      customerEmail: 'kavin@example.com',
      rating: 2,
      category: 'Delivery',
      comment: 'Delivery was delayed and updates were unclear.',
      status: 'Rejected',
      createdBy: admin._id
    },
    {
      customerName: 'Tharushi Jayasinghe',
      customerEmail: 'tharushi@example.com',
      rating: 5,
      category: 'Support',
      comment: 'Support team solved my issue quickly.',
      status: 'Approved',
      createdBy: sales._id
    }
  ]);

  await Notification.create([
    {
      title: 'Review module ready',
      message: 'Review management and notifications are connected to the ERP API.',
      type: 'success',
      targetRole: 'all',
      createdBy: admin._id
    },
    {
      title: 'Pending review waiting',
      message: `${reviews[1].customerName}'s review needs admin approval.`,
      type: 'review',
      targetRole: 'admin',
      createdBy: sales._id,
      review: reviews[1]._id
    }
  ]);

  console.log('Seeded users: admin (admin/admin123), sales (sales/sales123)');
  console.log('Seeded 4 reviews and 2 notifications');
};

module.exports = seedData;
