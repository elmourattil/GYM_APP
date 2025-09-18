const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan', required: true },
  month: { type: String, required: true, index: true }, // format YYYY-MM
  usage: {
    personalTrainingSessions: { type: Number, default: 0 },
    guestPasses: { type: Number, default: 0 },
    massageSessions: { type: Number, default: 0 }
  }
}, { timestamps: true });

usageSchema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Usage', usageSchema);


