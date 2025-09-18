const User = require('../models/User');
const WorkoutPlan = require('../models/WorkoutPlan');
const NutritionPlan = require('../models/NutritionPlan');
const Booking = require('../models/Booking');
const MembershipPlan = require('../models/MembershipPlan');
const Usage = require('../models/Usage');

const loadMemberWithPlan = async (memberId) => {
  const member = await User.findById(memberId).populate('membershipPlan');
  const isActive = member?.membershipStatus === 'active' && (!member.membershipEndDate || new Date(member.membershipEndDate) > new Date());
  return { member, isActive };
};

const getMembershipCycleStart = (member) => {
  // Use recorded membershipStartDate; fallback to start of current month
  if (member?.membershipStartDate) return new Date(member.membershipStartDate);
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

const getCurrentMonthKey = () => {
  const d = new Date();
  const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  return month;
};

const getOrCreateUsage = async (userId, planId) => {
  const month = getCurrentMonthKey();
  let usage = await Usage.findOne({ userId, month });
  if (!usage) {
    usage = await Usage.create({ userId, planId, month, usage: {} });
  } else if (String(usage.planId) !== String(planId)) {
    usage.planId = planId;
    await usage.save();
  }
  return usage;
};

const ensureNotExpired = async (userId) => {
  const user = await User.findById(userId).populate('membershipPlan');
  if (!user) return null;
  if (user.membershipEndDate && new Date(user.membershipEndDate) <= new Date()) {
    // Expire and deactivate until admin re-activates for next month payment
    user.membershipStatus = 'expired';
    user.pendingMembershipPlan = user.membershipPlan?._id || user.pendingMembershipPlan;
    user.membershipPlan = null;
    user.membershipStartDate = null;
    user.membershipEndDate = null;
    user.isActive = false;
    await user.save();
  }
  return user;
};

// @desc    Select membership plan (cash, pending approval)
// @route   POST /api/members/membership/select
// @access  Private (Member)
const selectMembershipPlan = async (req, res) => {
  try {
    const memberId = req.user._id;
    const { planId } = req.body;

    const plan = await MembershipPlan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({ success: false, message: 'Plan not found or inactive' });
    }

    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    member.pendingMembershipPlan = plan._id;
    member.membershipStatus = 'pending';
    member.isActive = false; // Account remains inactive until admin approves payment
    await member.save();

    res.status(200).json({
      success: true,
      message: 'Membership selection submitted. Please pay at gym for approval.',
      data: {
        pendingMembershipPlan: planId,
        membershipStatus: member.membershipStatus
      }
    });
  } catch (error) {
    console.error('Select membership plan error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Note: We allow access before admin approval (membershipStatus 'pending')
// Plan-based gating can be added per feature after activation if needed.

// @desc    Get member dashboard data
// @route   GET /api/members/dashboard
// @access  Private (Member)
const getDashboard = async (req, res) => {
  try {
    const memberId = req.user._id;

    // Auto-expire memberships past end date
    await ensureNotExpired(memberId);

    // Get member with populated data
    const member = await User.findById(memberId)
      .populate('membershipPlan')
      .populate('workouts')
      .populate('nutritionPlan');

    // Get upcoming bookings
    const upcomingBookings = await Booking.find({
      memberId,
      date: { $gte: new Date() },
      status: { $in: ['pending', 'confirmed'] }
    })
    .populate('trainerId', 'name email')
    .sort({ date: 1 })
    .limit(5);

    // Get recent workouts
    const recentWorkouts = member.workouts.slice(-3);

    res.json({
      success: true,
      data: {
        member,
        upcomingBookings,
        recentWorkouts,
        stats: {
          totalWorkouts: member.workouts.length,
          upcomingSessions: upcomingBookings.length,
          membershipStatus: member.membershipStatus || 'none'
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all workout plans
// @route   GET /api/members/workouts
// @access  Private (Member)
const getWorkoutPlans = async (req, res) => {
  try {
    const workouts = await WorkoutPlan.find({ isActive: true })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: workouts
    });
  } catch (error) {
    console.error('Get workout plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all nutrition plans
// @route   GET /api/members/nutrition
// @access  Private (Member)
const getNutritionPlans = async (req, res) => {
  try {
    const nutritionPlans = await NutritionPlan.find({ isActive: true })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: nutritionPlans
    });
  } catch (error) {
    console.error('Get nutrition plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Assign workout plan to member
// @route   POST /api/members/workouts/:workoutId/assign
// @access  Private (Member)
const assignWorkoutPlan = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const memberId = req.user._id;

    const workout = await WorkoutPlan.findById(workoutId);
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found'
      });
    }

    const member = await User.findById(memberId);
    if (member.workouts.includes(workoutId)) {
      return res.status(400).json({
        success: false,
        message: 'Workout plan already assigned'
      });
    }

    member.workouts.push(workoutId);
    await member.save();

    res.json({
      success: true,
      message: 'Workout plan assigned successfully'
    });
  } catch (error) {
    console.error('Assign workout plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Assign nutrition plan to member
// @route   POST /api/members/nutrition/:nutritionId/assign
// @access  Private (Member)
const assignNutritionPlan = async (req, res) => {
  try {
    const { nutritionId } = req.params;
    const memberId = req.user._id;

    await ensureNotExpired(memberId);
    const { member: currentMember, isActive } = await loadMemberWithPlan(memberId);
    if (!isActive) {
      return res.status(403).json({ success: false, message: 'Your membership is awaiting confirmation by the gym admin.' });
    }
    const includesNutrition = currentMember?.membershipPlan?.includesNutritionPlan;
    if (!includesNutrition) {
      return res.status(403).json({ success: false, message: 'Your membership plan does not include nutrition plans' });
    }

    const nutritionPlan = await NutritionPlan.findById(nutritionId);
    if (!nutritionPlan) {
      return res.status(404).json({
        success: false,
        message: 'Nutrition plan not found'
      });
    }

    const updatedMember = await User.findByIdAndUpdate(
      memberId,
      { nutritionPlan: nutritionId },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Nutrition plan assigned successfully',
      data: updatedMember
    });
  } catch (error) {
    console.error('Assign nutrition plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get member bookings
// @route   GET /api/members/bookings
// @access  Private (Member)
const getBookings = async (req, res) => {
  try {
    const memberId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { memberId };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('trainerId', 'name email')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create booking
// @route   POST /api/members/bookings
// @access  Private (Member)
const createBooking = async (req, res) => {
  try {
    const { trainerId, date, time, duration, sessionType, notes } = req.body;
    const memberId = req.user._id;

    await ensureNotExpired(memberId);
    const { member: currentMember, isActive } = await loadMemberWithPlan(memberId);
    if (!isActive) {
      return res.status(403).json({ success: false, message: 'Your membership is awaiting confirmation by the gym admin.' });
    }
    // Enforce plan rules for active members
    const plan = currentMember?.membershipPlan;
    if (!plan) {
      return res.status(403).json({ success: false, message: 'No active membership plan found' });
    }
    if (sessionType === 'personal_training' && !plan.includesPersonalTraining) {
      return res.status(403).json({ success: false, message: 'Your plan does not include personal training sessions' });
    }
    if (sessionType === 'personal_training') {
      const usage = await getOrCreateUsage(memberId, plan._id);
      const limit = plan.personalTrainingLimit === null ? null : (plan.personalTrainingLimit ?? (plan.maxTrainings ?? 0));
      if (limit !== null && limit >= 0) {
        const used = usage.usage.personalTrainingSessions || 0;
        if (used >= limit) {
          return res.status(403).json({ success: false, message: 'You have reached your personal training session limit for this period' });
        }
      }
    }

    // Check if trainer exists and is active
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
      date: new Date(date),
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Time slot already booked'
      });
    }

    const booking = await Booking.create({
      memberId,
      trainerId,
      date: new Date(date),
      time,
      duration: duration || 60,
      sessionType: sessionType || 'personal_training',
      notes
    });

    await booking.populate('trainerId', 'name email');

    // Increment usage if applicable
    if (sessionType === 'personal_training') {
      const plan = (await User.findById(memberId).populate('membershipPlan')).membershipPlan;
      if (plan?.includesPersonalTraining) {
        const usage = await getOrCreateUsage(memberId, plan._id);
        usage.usage.personalTrainingSessions = (usage.usage.personalTrainingSessions || 0) + 1;
        await usage.save();
      }
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get available trainers
// @route   GET /api/members/trainers
// @access  Private (Member)
const getTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ 
      role: 'trainer', 
      isActive: true 
    }).select('name email specialization');

    res.json({
      success: true,
      data: trainers
    });
  } catch (error) {
    console.error('Get trainers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get member usage summary
// @route   GET /api/members/usage
// @access  Private (Member)
const getUsageSummary = async (req, res) => {
  try {
    const memberId = req.user._id;
    const member = await User.findById(memberId).populate('membershipPlan');
    const plan = member.membershipPlan;
    const month = getCurrentMonthKey();
    const usage = await Usage.findOne({ userId: memberId, month });

    const limits = {
      personalTrainingSessions: plan?.includesPersonalTraining ? (plan.personalTrainingLimit ?? null) : 0,
      guestPasses: plan?.guestPassLimit ?? 0,
      massageSessions: plan?.massageSessionLimit ?? 0
    };

    res.json({
      success: true,
      data: {
        month,
        limits,
        usage: usage?.usage || { personalTrainingSessions: 0, guestPasses: 0, massageSessions: 0 },
        planName: plan?.name || null
      }
    });
  } catch (error) {
    console.error('Get usage summary error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Use a guest pass (increments usage with plan checks)
// @route   POST /api/members/usage/guest-pass
// @access  Private (Member)
const useGuestPass = async (req, res) => {
  try {
    const memberId = req.user._id;
    const { member: currentMember, isActive } = await loadMemberWithPlan(memberId);
    if (!isActive) {
      return res.status(403).json({ success: false, message: 'Membership not active' });
    }
    const plan = currentMember.membershipPlan;
    const limit = plan?.guestPassLimit || 0;
    if (!limit) {
      return res.status(403).json({ success: false, message: 'Guest passes are not included in your plan' });
    }
    const usage = await getOrCreateUsage(memberId, plan._id);
    const used = usage.usage.guestPasses || 0;
    if (used >= limit) {
      return res.status(403).json({ success: false, message: 'You have reached your guest pass limit for this period' });
    }
    usage.usage.guestPasses = used + 1;
    await usage.save();
    res.json({ success: true, message: 'Guest pass used', data: usage.usage });
  } catch (error) {
    console.error('Use guest pass error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Use a massage session (increments usage with plan checks)
// @route   POST /api/members/usage/massage
// @access  Private (Member)
const useMassageSession = async (req, res) => {
  try {
    const memberId = req.user._id;
    const { member: currentMember, isActive } = await loadMemberWithPlan(memberId);
    if (!isActive) {
      return res.status(403).json({ success: false, message: 'Membership not active' });
    }
    const plan = currentMember.membershipPlan;
    const limit = plan?.massageSessionLimit || 0;
    if (!limit) {
      return res.status(403).json({ success: false, message: 'Massage sessions are not included in your plan' });
    }
    const usage = await getOrCreateUsage(memberId, plan._id);
    const used = usage.usage.massageSessions || 0;
    if (used >= limit) {
      return res.status(403).json({ success: false, message: 'You have reached your massage session limit for this period' });
    }
    usage.usage.massageSessions = used + 1;
    await usage.save();
    res.json({ success: true, message: 'Massage session used', data: usage.usage });
  } catch (error) {
    console.error('Use massage session error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Cancel booking
// @route   PUT /api/members/bookings/:bookingId/cancel
// @access  Private (Member)
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const memberId = req.user._id;

    const booking = await Booking.findOne({ 
      _id: bookingId, 
      memberId 
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking already cancelled'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getDashboard,
  getWorkoutPlans,
  getNutritionPlans,
  assignWorkoutPlan,
  assignNutritionPlan,
  getBookings,
  createBooking,
  getTrainers,
  cancelBooking,
  selectMembershipPlan,
  getUsageSummary,
  useGuestPass,
  useMassageSession
};
