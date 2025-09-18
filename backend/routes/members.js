const express = require('express');
const {
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
} = require('../controllers/memberController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and require member role
router.use(protect);
router.use(authorize('member'));

// Dashboard routes
router.get('/dashboard', getDashboard);

// Workout plan routes
router.get('/workouts', getWorkoutPlans);
router.post('/workouts/:workoutId/assign', assignWorkoutPlan);

// Nutrition plan routes
router.get('/nutrition', getNutritionPlans);
router.post('/nutrition/:nutritionId/assign', assignNutritionPlan);

// Booking routes
router.get('/bookings', getBookings);
router.post('/bookings', createBooking);
router.put('/bookings/:bookingId/cancel', cancelBooking);

// Trainer routes
router.get('/trainers', getTrainers);

// Membership selection
router.post('/membership/select', selectMembershipPlan);

// Usage summary
router.get('/usage', getUsageSummary);
router.post('/usage/guest-pass', useGuestPass);
router.post('/usage/massage', useMassageSession);

module.exports = router;
