const express = require('express');
const { body } = require('express-validator');
const {
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
} = require('../controllers/trainerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and require trainer role
router.use(protect);
router.use(authorize('trainer'));

// Dashboard routes
router.get('/dashboard', getDashboard);

// Workout plan routes
router.get('/workouts', getWorkoutPlans);
router.post('/workouts', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('duration').isNumeric().withMessage('Duration must be a number'),
  body('exercises').isArray({ min: 1 }).withMessage('At least one exercise is required')
], createWorkoutPlan);

// Nutrition plan routes
router.get('/nutrition', getNutritionPlans);
router.post('/nutrition', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('targetCalories').isNumeric().withMessage('Target calories must be a number'),
  body('meals').isArray({ min: 1 }).withMessage('At least one meal is required')
], createNutritionPlan);

// Booking routes
router.get('/bookings', getBookings);
router.get('/bookings/stats', getBookingStats);
router.get('/bookings/upcoming', getUpcomingBookings);
router.get('/bookings/today', getTodayBookings);
router.put('/bookings/:bookingId', [
  body('status').isIn(['pending', 'confirmed', 'completed', 'cancelled'])
    .withMessage('Invalid status')
], updateBookingStatus);
router.put('/bookings/:bookingId/notes', [
  body('notes').notEmpty().withMessage('Notes are required')
], addBookingNotes);

module.exports = router;
