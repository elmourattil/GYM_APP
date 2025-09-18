const User = require('../models/User');
const WorkoutPlan = require('../models/WorkoutPlan');
const NutritionPlan = require('../models/NutritionPlan');
const Booking = require('../models/Booking');

// @desc    Get trainer dashboard data
// @route   GET /api/trainers/dashboard
// @access  Private (Trainer)
const getDashboard = async (req, res) => {
  try {
    const trainerId = req.user._id;

    // Get upcoming bookings
    const upcomingBookings = await Booking.find({
      trainerId,
      date: { $gte: new Date() },
      status: { $in: ['pending', 'confirmed'] }
    })
    .populate('memberId', 'name email phone')
    .sort({ date: 1 })
    .limit(10);

    // Get today's bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayBookings = await Booking.find({
      trainerId,
      date: { $gte: today, $lt: tomorrow },
      status: { $in: ['pending', 'confirmed'] }
    })
    .populate('memberId', 'name email phone')
    .sort({ time: 1 });

    // Get created workout plans
    const workoutPlans = await WorkoutPlan.find({ createdBy: trainerId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get created nutrition plans
    const nutritionPlans = await NutritionPlan.find({ createdBy: trainerId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get stats
    const totalBookings = await Booking.countDocuments({ trainerId });
    const completedBookings = await Booking.countDocuments({ 
      trainerId, 
      status: 'completed' 
    });
    const totalWorkoutPlans = await WorkoutPlan.countDocuments({ createdBy: trainerId });
    const totalNutritionPlans = await NutritionPlan.countDocuments({ createdBy: trainerId });

    res.json({
      success: true,
      data: {
        upcomingBookings,
        todayBookings,
        workoutPlans,
        nutritionPlans,
        stats: {
          totalBookings,
          completedBookings,
          totalWorkoutPlans,
          totalNutritionPlans,
          todaySessions: todayBookings.length
        }
      }
    });
  } catch (error) {
    console.error('Get trainer dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create workout plan
// @route   POST /api/trainers/workouts
// @access  Private (Trainer)
const createWorkoutPlan = async (req, res) => {
  try {
    const workoutData = {
      ...req.body,
      createdBy: req.user._id
    };

    const workoutPlan = await WorkoutPlan.create(workoutData);

    res.status(201).json({
      success: true,
      message: 'Workout plan created successfully',
      data: workoutPlan
    });
  } catch (error) {
    console.error('Create workout plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create nutrition plan
// @route   POST /api/trainers/nutrition
// @access  Private (Trainer)
const createNutritionPlan = async (req, res) => {
  try {
    const nutritionData = {
      ...req.body,
      createdBy: req.user._id
    };

    const nutritionPlan = await NutritionPlan.create(nutritionData);

    res.status(201).json({
      success: true,
      message: 'Nutrition plan created successfully',
      data: nutritionPlan
    });
  } catch (error) {
    console.error('Create nutrition plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get trainer's bookings
// @route   GET /api/trainers/bookings
// @access  Private (Trainer)
const getBookings = async (req, res) => {
  try {
    const trainerId = req.user._id;
    const { status, date, page = 1, limit = 10 } = req.query;

    const query = { trainerId };
    if (status) {
      query.status = status;
    }
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const bookings = await Booking.find(query)
      .populate('memberId', 'name email phone')
      .sort({ date: 1, time: 1 })
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
    console.error('Get trainer bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/trainers/bookings/:bookingId
// @access  Private (Trainer)
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, notes } = req.body;
    const trainerId = req.user._id;

    const booking = await Booking.findOne({ _id: bookingId, trainerId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    if (notes) {
      booking.notes = notes;
    }

    await booking.save();
    await booking.populate('memberId', 'name email phone');

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

// @desc    Get trainer's workout plans
// @route   GET /api/trainers/workouts
// @access  Private (Trainer)
const getWorkoutPlans = async (req, res) => {
  try {
    const trainerId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const workoutPlans = await WorkoutPlan.find({ createdBy: trainerId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await WorkoutPlan.countDocuments({ createdBy: trainerId });

    res.json({
      success: true,
      data: {
        workoutPlans,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get trainer workout plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get trainer's nutrition plans
// @route   GET /api/trainers/nutrition
// @access  Private (Trainer)
const getNutritionPlans = async (req, res) => {
  try {
    const trainerId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const nutritionPlans = await NutritionPlan.find({ createdBy: trainerId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await NutritionPlan.countDocuments({ createdBy: trainerId });

    res.json({
      success: true,
      data: {
        nutritionPlans,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get trainer nutrition plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get trainer's booking statistics
// @route   GET /api/trainers/bookings/stats
// @access  Private (Trainer)
const getBookingStats = async (req, res) => {
  try {
    const trainerId = req.user._id;

    const totalBookings = await Booking.countDocuments({ trainerId });
    const pendingBookings = await Booking.countDocuments({ trainerId, status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ trainerId, status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ trainerId, status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ trainerId, status: 'cancelled' });

    // Get upcoming bookings (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingBookings = await Booking.countDocuments({
      trainerId,
      date: { $gte: new Date(), $lte: nextWeek },
      status: { $in: ['pending', 'confirmed'] }
    });

    // Get bookings by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          trainerId: trainerId,
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
        upcoming: upcomingBookings,
        monthlyBookings
      }
    });
  } catch (error) {
    console.error('Get trainer booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get trainer's upcoming sessions
// @route   GET /api/trainers/bookings/upcoming
// @access  Private (Trainer)
const getUpcomingBookings = async (req, res) => {
  try {
    const trainerId = req.user._id;
    const { limit = 10 } = req.query;

    const upcomingBookings = await Booking.find({
      trainerId,
      date: { $gte: new Date() },
      status: { $in: ['pending', 'confirmed'] }
    })
      .populate('memberId', 'name email phone')
      .sort({ date: 1, time: 1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: upcomingBookings
    });
  } catch (error) {
    console.error('Get upcoming bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get trainer's today's schedule
// @route   GET /api/trainers/bookings/today
// @access  Private (Trainer)
const getTodayBookings = async (req, res) => {
  try {
    const trainerId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayBookings = await Booking.find({
      trainerId,
      date: { $gte: today, $lt: tomorrow },
      status: { $in: ['pending', 'confirmed'] }
    })
      .populate('memberId', 'name email phone')
      .sort({ time: 1 });

    res.json({
      success: true,
      data: todayBookings
    });
  } catch (error) {
    console.error('Get today bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add notes to booking
// @route   PUT /api/trainers/bookings/:bookingId/notes
// @access  Private (Trainer)
const addBookingNotes = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { notes } = req.body;
    const trainerId = req.user._id;

    const booking = await Booking.findOne({ _id: bookingId, trainerId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or not assigned to you'
      });
    }

    booking.notes = notes;
    await booking.save();

    await booking.populate('memberId', 'name email phone');

    res.json({
      success: true,
      message: 'Notes added successfully',
      data: booking
    });
  } catch (error) {
    console.error('Add booking notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getDashboard,
  createWorkoutPlan,
  createNutritionPlan,
  getBookings,
  updateBookingStatus,
  getWorkoutPlans,
  getNutritionPlans,
  getBookingStats,
  getUpcomingBookings,
  getTodayBookings,
  addBookingNotes
};
