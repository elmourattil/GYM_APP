const express = require('express');
const MembershipPlan = require('../models/MembershipPlan');
const User = require('../models/User');
const WorkoutPlan = require('../models/WorkoutPlan');

const router = express.Router();

// @desc    Get all membership plans (public)
// @route   GET /api/public/membership-plans
// @access  Public
const getMembershipPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({ isActive: true }).sort({ price: 1 });

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

// @desc    Get all trainers (public)
// @route   GET /api/public/trainers
// @access  Public
const getTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ 
      role: 'trainer', 
      isActive: true 
    })
    .select('name email profileImage')
    .sort({ name: 1 });

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

// @desc    Get featured workout plans (public)
// @route   GET /api/public/workouts
// @access  Public
const getFeaturedWorkouts = async (req, res) => {
  try {
    const workouts = await WorkoutPlan.find({ isActive: true })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: workouts
    });
  } catch (error) {
    console.error('Get featured workouts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get gym statistics (public)
// @route   GET /api/public/stats
// @access  Public
const getGymStats = async (req, res) => {
  try {
    const totalMembers = await User.countDocuments({ role: 'member', isActive: true });
    const totalTrainers = await User.countDocuments({ role: 'trainer', isActive: true });
    const totalWorkouts = await WorkoutPlan.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        totalMembers,
        totalTrainers,
        totalWorkouts,
        yearsExperience: 15
      }
    });
  } catch (error) {
    console.error('Get gym stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

router.get('/membership-plans', getMembershipPlans);
router.get('/trainers', getTrainers);
router.get('/workouts', getFeaturedWorkouts);
router.get('/stats', getGymStats);

module.exports = router;
