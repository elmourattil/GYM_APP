const express = require('express');
const { body } = require('express-validator');
const {
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
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard routes
router.get('/dashboard', getDashboard);

// User management routes
router.get('/users', getUsers);
router.post('/users', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['member', 'trainer', 'admin']).withMessage('Invalid role')
], createUser);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);

// Membership plan routes
router.get('/membership-plans', getMembershipPlans);
router.post('/membership-plans', [
  body('name').notEmpty().withMessage('Plan name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('duration').isIn(['monthly', 'quarterly', 'yearly']).withMessage('Invalid duration'),
  body('features').isArray({ min: 1 }).withMessage('At least one feature is required'),
  body('description').notEmpty().withMessage('Description is required')
], createMembershipPlan);
router.put('/membership-plans/:planId', updateMembershipPlan);
router.delete('/membership-plans/:planId', deleteMembershipPlan);

// Booking management routes
router.get('/bookings', getAllBookings);
router.get('/bookings/stats', getBookingStats);
router.put('/bookings/:bookingId/status', updateBookingStatus);
router.put('/bookings/:bookingId/assign-trainer', assignTrainerToBooking);
router.delete('/bookings/:bookingId', deleteBooking);

// Membership approvals
router.put('/memberships/:userId/approve', approveMembership);
router.put('/memberships/:userId/reject', rejectMembership);

module.exports = router;
