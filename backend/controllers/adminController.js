const User = require('../models/User');
const MembershipPlan = require('../models/MembershipPlan');
const WorkoutPlan = require('../models/WorkoutPlan');
const NutritionPlan = require('../models/NutritionPlan');
const Booking = require('../models/Booking');

// @desc    Approve pending membership (cash payment received)
// @route   PUT /api/admin/memberships/:userId/approve
// @access  Private (Admin)
const approveMembership = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('pendingMembershipPlan');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.membershipStatus !== 'pending' || !user.pendingMembershipPlan) {
      return res.status(400).json({ success: false, message: 'No pending membership to approve' });
    }

    // Activate membership: move pending plan to active membershipPlan
    user.membershipPlan = user.pendingMembershipPlan._id;
    user.pendingMembershipPlan = null;
    user.membershipStatus = 'active';

    // Set dates based on plan duration
    const now = new Date();
    // Monthly cycles run from the first day for 30 days
    const duration = user.membershipPlan.duration || 'monthly';
    let start;
    let end;
    if (duration === 'monthly') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(start);
      end.setDate(end.getDate() + 30); // 30 jours window
    } else if (duration === 'quarterly') {
      start = new Date(now);
      end = new Date(start);
      end.setMonth(end.getMonth() + 3);
    } else if (duration === 'yearly') {
      start = new Date(now);
      end = new Date(start);
      end.setFullYear(end.getFullYear() + 1);
    } else {
      start = new Date(now);
      end = new Date(start);
      end.setMonth(end.getMonth() + 1);
    }
    user.membershipStartDate = start;
    user.membershipEndDate = end;
    user.isActive = true; // Reactivate account upon payment/approval

    await user.save();

    res.json({ success: true, message: 'Membership approved and activated', data: user });
  } catch (error) {
    console.error('Approve membership error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Reject pending membership (cash payment not received)
// @route   PUT /api/admin/memberships/:userId/reject
// @access  Private (Admin)
const rejectMembership = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body || {};

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.membershipStatus !== 'pending' || !user.pendingMembershipPlan) {
      return res.status(400).json({ success: false, message: 'No pending membership to reject' });
    }

    user.pendingMembershipPlan = null;
    user.membershipStatus = 'rejected';
    await user.save();

    res.json({ success: true, message: 'Membership request rejected', data: { userId, reason: reason || null } });
  } catch (error) {
    console.error('Reject membership error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get admin dashboard data
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboard = async (req, res) => {
  try {
    // Get user statistics
    const totalMembers = await User.countDocuments({ role: 'member' });
    const totalTrainers = await User.countDocuments({ role: 'trainer' });
    const activeMembers = await User.countDocuments({ role: 'member', isActive: true });
    const activeTrainers = await User.countDocuments({ role: 'trainer', isActive: true });

    // Get membership plan statistics
    const totalPlans = await MembershipPlan.countDocuments();
    const activePlans = await MembershipPlan.countDocuments({ isActive: true });

    // Get booking statistics
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    // Get recent members
    const recentMembers = await User.find({ role: 'member' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email joinDate isActive');

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('memberId', 'name email')
      .populate('trainerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get monthly revenue (mock data - in real app, calculate from payments)
    const monthlyRevenue = await MembershipPlan.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalMembers,
          totalTrainers,
          activeMembers,
          activeTrainers,
          totalPlans,
          activePlans,
          totalBookings,
          pendingBookings,
          confirmedBookings,
          completedBookings,
          monthlyRevenue: monthlyRevenue[0]?.total || 0
        },
        recentMembers,
        recentBookings
      }
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;

    const query = {};
    if (role) {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .populate('membershipPlan')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password');

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create user
// @route   POST /api/admin/users
// @access  Private (Admin)
const createUser = async (req, res) => {
  try {
    const userData = req.body;
    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:userId
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Don't allow password updates through this route
    delete updateData.password;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:userId
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id; // Get current user ID from auth middleware

    // Prevent admin from deleting themselves
    if (userId === currentUserId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all membership plans
// @route   GET /api/admin/membership-plans
// @access  Private (Admin)
const getMembershipPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Get membership plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create membership plan
// @route   POST /api/admin/membership-plans
// @access  Private (Admin)
const createMembershipPlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Membership plan created successfully',
      data: plan
    });
  } catch (error) {
    console.error('Create membership plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update membership plan
// @route   PUT /api/admin/membership-plans/:planId
// @access  Private (Admin)
const updateMembershipPlan = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await MembershipPlan.findByIdAndUpdate(
      planId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Membership plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Membership plan updated successfully',
      data: plan
    });
  } catch (error) {
    console.error('Update membership plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete membership plan
// @route   DELETE /api/admin/membership-plans/:planId
// @access  Private (Admin)
const deleteMembershipPlan = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await MembershipPlan.findByIdAndDelete(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Membership plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Membership plan deleted successfully'
    });
  } catch (error) {
    console.error('Delete membership plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all bookings with filters
// @route   GET /api/admin/bookings
// @access  Private (Admin)
const getAllBookings = async (req, res) => {
  try {
    const { status, trainerId, memberId, page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc' } = req.query;

    const query = {};
    if (status) query.status = status;
    if (trainerId) query.trainerId = trainerId;
    if (memberId) query.memberId = memberId;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const bookings = await Booking.find(query)
      .populate('memberId', 'name email')
      .populate('trainerId', 'name email specialization')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:bookingId/status
// @access  Private (Admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, notes } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    if (notes) booking.notes = notes;
    await booking.save();

    await booking.populate('memberId', 'name email');
    await booking.populate('trainerId', 'name email');

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Assign trainer to booking
// @route   PUT /api/admin/bookings/:bookingId/assign-trainer
// @access  Private (Admin)
const assignTrainerToBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { trainerId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const trainer = await User.findOne({ _id: trainerId, role: 'trainer', isActive: true });
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found or inactive'
      });
    }

    // Check for conflicting bookings
    const existingBooking = await Booking.findOne({
      trainerId,
      date: booking.date,
      time: booking.time,
      status: { $in: ['pending', 'confirmed'] },
      _id: { $ne: bookingId }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Trainer already has a booking at this time'
      });
    }

    booking.trainerId = trainerId;
    await booking.save();

    await booking.populate('memberId', 'name email');
    await booking.populate('trainerId', 'name email');

    res.json({
      success: true,
      message: 'Trainer assigned successfully',
      data: booking
    });
  } catch (error) {
    console.error('Assign trainer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete booking
// @route   DELETE /api/admin/bookings/:bookingId
// @access  Private (Admin)
const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await Booking.findByIdAndDelete(bookingId);

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get booking statistics
// @route   GET /api/admin/bookings/stats
// @access  Private (Admin)
const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    // Get bookings by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
        monthlyBookings
      }
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getDashboard,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getMembershipPlans,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
  getAllBookings,
  updateBookingStatus,
  assignTrainerToBooking,
  deleteBooking,
  getBookingStats,
  approveMembership,
  rejectMembership
};
