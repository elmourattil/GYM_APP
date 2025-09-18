const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide member ID']
  },
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide trainer ID']
  },
  date: {
    type: Date,
    required: [true, 'Please provide booking date']
  },
  time: {
    type: String,
    required: [true, 'Please provide booking time']
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  sessionType: {
    type: String,
    enum: ['personal_training', 'group_class', 'consultation'],
    default: 'personal_training'
  },
  notes: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: 'Main Gym'
  },
  price: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
bookingSchema.index({ memberId: 1, date: 1 });
bookingSchema.index({ trainerId: 1, date: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
