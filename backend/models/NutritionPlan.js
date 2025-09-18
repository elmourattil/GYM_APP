const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide meal name']
  },
  calories: {
    type: Number,
    required: [true, 'Please provide calories'],
    min: [0, 'Calories cannot be negative']
  },
  protein: {
    type: Number,
    default: 0
  },
  carbs: {
    type: Number,
    default: 0
  },
  fat: {
    type: Number,
    default: 0
  },
  ingredients: [{
    type: String
  }],
  instructions: {
    type: String,
    default: ''
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  }
});

const nutritionPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a nutrition plan title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  targetCalories: {
    type: Number,
    required: [true, 'Please provide target calories']
  },
  meals: [mealSchema],
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
    enum: ['weight_loss', 'muscle_gain', 'maintenance', 'performance'],
    default: 'maintenance'
  },
  duration: {
    type: Number, // in days
    default: 30
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NutritionPlan', nutritionPlanSchema);
