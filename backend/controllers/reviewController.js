const Review = require('../models/Review');
const User = require('../models/User');

// Get all reviews for public display (only approved and published)
const getPublicReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ 
      status: 'approved', 
      isPublished: true 
    })
    .populate('memberId', 'name email')
    .sort({ publishedAt: -1 })
    .limit(20);

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Get public reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get member's own reviews
const getMemberReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ memberId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Get member reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create a new review
const createReview = async (req, res) => {
  try {
    const { rating, title, content } = req.body;

    // Check if user already has a pending review
    const existingReview = await Review.findOne({ 
      memberId: req.user.id, 
      status: 'pending' 
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending review. Please wait for admin approval.'
      });
    }

    const review = await Review.create({
      memberId: req.user.id,
      rating,
      title,
      content
    });

    await review.populate('memberId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. It will be reviewed by admin before publishing.',
      data: review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update member's own review (only if pending)
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, content } = req.body;

    const review = await Review.findOne({ 
      _id: reviewId, 
      memberId: req.user.id,
      status: 'pending'
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or cannot be updated'
      });
    }

    review.rating = rating;
    review.title = title;
    review.content = content;
    await review.save();

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete member's own review (only if pending)
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findOne({ 
      _id: reviewId, 
      memberId: req.user.id,
      status: 'pending'
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or cannot be deleted'
      });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Admin: Get all reviews for moderation
const getAllReviews = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const reviews = await Review.find(query)
      .populate('memberId', 'name email')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Admin: Approve a review
const approveReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { adminNotes } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.status = 'approved';
    review.isPublished = true;
    review.publishedAt = new Date();
    review.approvedAt = new Date();
    review.approvedBy = req.user.id;
    if (adminNotes) {
      review.adminNotes = adminNotes;
    }

    await review.save();

    res.json({
      success: true,
      message: 'Review approved and published successfully',
      data: review
    });
  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Admin: Reject a review
const rejectReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { adminNotes } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.status = 'rejected';
    review.isPublished = false;
    review.rejectedAt = new Date();
    if (adminNotes) {
      review.adminNotes = adminNotes;
    }

    await review.save();

    res.json({
      success: true,
      message: 'Review rejected successfully',
      data: review
    });
  } catch (error) {
    console.error('Reject review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Admin: Get review statistics
const getReviewStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    const totalReviews = await Review.countDocuments();
    const publishedReviews = await Review.countDocuments({ 
      status: 'approved', 
      isPublished: true 
    });
    const pendingReviews = await Review.countDocuments({ status: 'pending' });
    const rejectedReviews = await Review.countDocuments({ status: 'rejected' });

    const avgRating = await Review.aggregate([
      { $match: { status: 'approved', isPublished: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    res.json({
      success: true,
      data: {
        total: totalReviews,
        published: publishedReviews,
        pending: pendingReviews,
        rejected: rejectedReviews,
        averageRating: avgRating[0]?.avgRating || 0
      }
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getPublicReviews,
  getMemberReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  approveReview,
  rejectReview,
  getReviewStats
};
