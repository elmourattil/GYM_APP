const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getPublicReviews,
  getMemberReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  approveReview,
  rejectReview,
  getReviewStats
} = require('../controllers/reviewController');

// Public routes
router.get('/public', getPublicReviews);

// Member routes (authenticated)
router.get('/member', protect, getMemberReviews);
router.post('/member', [
  protect,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('content').notEmpty().withMessage('Content is required').isLength({ max: 1000 }).withMessage('Content cannot exceed 1000 characters')
], createReview);
router.put('/member/:reviewId', [
  protect,
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('content').optional().notEmpty().withMessage('Content is required').isLength({ max: 1000 }).withMessage('Content cannot exceed 1000 characters')
], updateReview);
router.delete('/member/:reviewId', protect, deleteReview);

// Admin routes
router.get('/admin', protect, authorize('admin'), getAllReviews);
router.get('/admin/stats', protect, authorize('admin'), getReviewStats);
router.put('/admin/:reviewId/approve', [
  protect,
  authorize('admin'),
  body('adminNotes').optional().isLength({ max: 500 }).withMessage('Admin notes cannot exceed 500 characters')
], approveReview);
router.put('/admin/:reviewId/reject', [
  protect,
  authorize('admin'),
  body('adminNotes').optional().isLength({ max: 500 }).withMessage('Admin notes cannot exceed 500 characters')
], rejectReview);

module.exports = router;
