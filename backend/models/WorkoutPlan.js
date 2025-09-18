const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide exercise name']
  },
  sets: {
    type: Number,
    required: [true, 'Please provide number of sets'],
    min: [1, 'Sets must be at least 1']
  },
  reps: {
    type: String,
    required: [true, 'Please provide reps']
  },
  weight: {
    type: String,
    default: 'Body weight'
  },
  restTime: {
    type: String,
    default: '60 seconds'
  },
  instructions: {
    type: String,
    default: ''
  }
});

const workoutPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a workout title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Please provide workout duration']
  },
  exercises: [exerciseSchema],
  targetMuscles: [{
    type: String
  }],
  equipment: [{
    type: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'hiit', 'yoga', 'pilates'],
    default: 'strength'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
