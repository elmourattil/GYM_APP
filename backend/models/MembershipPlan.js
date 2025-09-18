const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a plan name'],
    trim: true,
    unique: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: String,
    required: [true, 'Please provide duration'],
    enum: ['monthly', 'quarterly', 'yearly']
  },
  features: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxTrainings: {
    type: Number,
    default: null // null means unlimited
  },
  includesPersonalTraining: {
    type: Boolean,
    default: false
  },
  personalTrainingLimit: {
    type: Number,
    default: 0 // 0 means none; null means unlimited
  },
  includesNutritionPlan: {
    type: Boolean,
    default: false
  },
  includesLocker: {
    type: Boolean,
    default: false
  },
  includesSauna: {
    type: Boolean,
    default: false
  },
  wifiIncluded: { type: Boolean, default: true },
  swimmingPoolAccess: { type: Boolean, default: false },
  priorityBooking: { type: Boolean, default: false },
  advancedNutritionTracking: { type: Boolean, default: false },
  vipLockerRoom: { type: Boolean, default: false },
  priorityEquipmentAccess: { type: Boolean, default: false },
  guestPassLimit: { type: Number, default: 0 },
  massageSessionLimit: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
