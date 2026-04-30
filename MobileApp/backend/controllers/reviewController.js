const Review = require('../models/Review');
const { createNotification } = require('../services/notificationService');

const getReviews = async (req, res) => {
  const { status, search } = req.query;
  const filter = {};

  if (status && status !== 'All') {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { customerName: { $regex: search, $options: 'i' } },
      { customerEmail: { $regex: search, $options: 'i' } },
      { comment: { $regex: search, $options: 'i' } }
    ];
  }

  const reviews = await Review.find(filter)
    .populate('createdBy', 'username role')
    .sort({ createdAt: -1 });

  res.json(reviews);
};

const getReviewById = async (req, res) => {
  const review = await Review.findById(req.params.id).populate('createdBy', 'username role');

  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  res.json(review);
};

const createReview = async (req, res) => {
  const { customerName, customerEmail, rating, category, comment } = req.body;
  const ratingValue = Number(rating);

  if (!customerName || !rating || !comment) {
    return res.status(400).json({ message: 'Customer name, rating and comment are required' });
  }

  if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
    return res.status(400).json({ message: 'Rating must be a number from 1 to 5' });
  }

  const review = await Review.create({
    customerName: customerName.trim(),
    customerEmail,
    rating: ratingValue,
    category,
    comment: comment.trim(),
    createdBy: req.user._id
  });

  const isLowRating = ratingValue <= 2;

  await createNotification({
    title: isLowRating ? 'Urgent low rating review' : 'New review submitted',
    message: `${customerName.trim()} submitted a ${ratingValue}-star review.`,
    type: isLowRating ? 'warning' : 'review',
    targetRole: 'admin',
    createdBy: req.user._id,
    review: review._id
  });

  res.status(201).json(await review.populate('createdBy', 'username role'));
};

const updateReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  const previousStatus = review.status;
  const allowedFields = ['customerName', 'customerEmail', 'rating', 'category', 'comment', 'status'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      review[field] = req.body[field];
    }
  });

  await review.save();

  if (req.body.status && req.body.status !== previousStatus) {
    await createNotification({
      title: 'Review status updated',
      message: `${review.customerName}'s review is now ${review.status}.`,
      type: review.status === 'Approved' ? 'success' : 'warning',
      targetRole: 'all',
      createdBy: req.user._id,
      review: review._id
    });
  }

  res.json(await review.populate('createdBy', 'username role'));
};

const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  await review.deleteOne();
  res.json({ message: 'Review deleted successfully' });
};

const getReviewStats = async (req, res) => {
  const [statusCounts, average] = await Promise.all([
    Review.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Review.aggregate([{ $group: { _id: null, rating: { $avg: '$rating' }, total: { $sum: 1 } } }])
  ]);

  const statuses = { Pending: 0, Approved: 0, Rejected: 0 };
  statusCounts.forEach((item) => {
    statuses[item._id] = item.count;
  });

  res.json({
    total: average[0]?.total || 0,
    averageRating: Number((average[0]?.rating || 0).toFixed(1)),
    statuses
  });
};

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats
};
