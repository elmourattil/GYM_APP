import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Utensils, Search, Edit, Trash2, Eye, Target, Clock } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import axios from 'axios'
import toast from 'react-hot-toast'

const TrainerNutrition = () => {
  const [nutritionPlans, setNutritionPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [newPlan, setNewPlan] = useState({
    title: '',
    description: '',
    targetCalories: '',
    category: 'maintenance',
    duration: 30,
    meals: []
  })

  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    ingredients: '',
    instructions: '',
    mealType: 'breakfast'
  })

  useEffect(() => {
    fetchNutritionPlans()
  }, [])

  const fetchNutritionPlans = async () => {
    try {
      const response = await axios.get('/api/trainers/nutrition')
      setNutritionPlans(response.data.data.nutritionPlans)
    } catch (error) {
      console.error('Error fetching nutrition plans:', error)
      toast.error('Failed to fetch nutrition plans')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlan = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/trainers/nutrition', newPlan)
      toast.success('Nutrition plan created successfully!')
      setShowCreateForm(false)
      setNewPlan({
        title: '',
        description: '',
        targetCalories: '',
        category: 'maintenance',
        duration: 30,
        meals: []
      })
      fetchNutritionPlans()
    } catch (error) {
      console.error('Error creating nutrition plan:', error)
      toast.error('Failed to create nutrition plan')
    }
  }

  const addMeal = () => {
    if (newMeal.name && newMeal.calories) {
      const meal = {
        ...newMeal,
        calories: parseInt(newMeal.calories),
        protein: parseInt(newMeal.protein) || 0,
        carbs: parseInt(newMeal.carbs) || 0,
        fat: parseInt(newMeal.fat) || 0,
        ingredients: newMeal.ingredients.split(',').map(ing => ing.trim()).filter(ing => ing)
      }
      
      setNewPlan(prev => ({
        ...prev,
        meals: [...prev.meals, meal]
      }))
      
      setNewMeal({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        ingredients: '',
        instructions: '',
        mealType: 'breakfast'
      })
    }
  }

  const removeMeal = (index) => {
    setNewPlan(prev => ({
      ...prev,
      meals: prev.meals.filter((_, i) => i !== index)
    }))
  }

  const filteredPlans = nutritionPlans.filter(plan => 
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Nutrition Plans
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create and manage nutrition plans for your clients
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="mt-4 sm:mt-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Nutrition Plan
          </Button>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Input
            placeholder="Search nutrition plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
          />
        </motion.div>

        {/* Create Plan Form Modal */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Create New Nutrition Plan
              </h2>
              
              <form onSubmit={handleCreatePlan} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Plan Title"
                    value={newPlan.title}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={newPlan.category}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="weight_loss">Weight Loss</option>
                      <option value="muscle_gain">Muscle Gain</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="performance">Performance</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Target Calories"
                    type="number"
                    value={newPlan.targetCalories}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, targetCalories: e.target.value }))}
                    required
                  />
                  <Input
                    label="Duration (days)"
                    type="number"
                    value={newPlan.duration}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, duration: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newPlan.description}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                {/* Add Meal Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Add Meals
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Meal Name"
                      value={newMeal.name}
                      onChange={(e) => setNewMeal(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Meal Type
                      </label>
                      <select
                        value={newMeal.mealType}
                        onChange={(e) => setNewMeal(prev => ({ ...prev, mealType: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <Input
                      label="Calories"
                      type="number"
                      value={newMeal.calories}
                      onChange={(e) => setNewMeal(prev => ({ ...prev, calories: e.target.value }))}
                    />
                    <Input
                      label="Protein (g)"
                      type="number"
                      value={newMeal.protein}
                      onChange={(e) => setNewMeal(prev => ({ ...prev, protein: e.target.value }))}
                    />
                    <Input
                      label="Carbs (g)"
                      type="number"
                      value={newMeal.carbs}
                      onChange={(e) => setNewMeal(prev => ({ ...prev, carbs: e.target.value }))}
                    />
                    <Input
                      label="Fat (g)"
                      type="number"
                      value={newMeal.fat}
                      onChange={(e) => setNewMeal(prev => ({ ...prev, fat: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Ingredients (comma separated)
                      </label>
                      <textarea
                        value={newMeal.ingredients}
                        onChange={(e) => setNewMeal(prev => ({ ...prev, ingredients: e.target.value }))}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Ingredient 1, Ingredient 2, Ingredient 3..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Instructions
                      </label>
                      <textarea
                        value={newMeal.instructions}
                        onChange={(e) => setNewMeal(prev => ({ ...prev, instructions: e.target.value }))}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    onClick={addMeal}
                    variant="outline"
                    className="mb-4"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Meal
                  </Button>
                </div>

                {/* Meal List */}
                {newPlan.meals.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Meals ({newPlan.meals.length})
                    </h3>
                    <div className="space-y-3">
                      {newPlan.meals.map((meal, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{meal.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {meal.calories} cal • {meal.protein}g protein • {meal.carbs}g carbs • {meal.fat}g fat
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {meal.mealType}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMeal(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Nutrition Plan
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Plans Grid */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredPlans.map((plan, index) => (
            <motion.div key={plan._id} variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
              <Card hover className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    plan.category === 'weight_loss' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : plan.category === 'muscle_gain'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : plan.category === 'maintenance'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  }`}>
                    {plan.category.replace('_', ' ')}
                  </span>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{plan.duration} days</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {plan.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {plan.description}
                </p>

                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <Target className="w-4 h-4 mr-2" />
                    <span>{plan.targetCalories} calories/day</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Utensils className="w-4 h-4 mr-2" />
                    <span>{plan.meals.length} meals</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 text-xs rounded-full">
                    {plan.category.replace('_', ' ')}
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredPlans.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Utensils className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No nutrition plans found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm 
                ? 'Try adjusting your search criteria'
                : 'Create your first nutrition plan to get started'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Create Nutrition Plan
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TrainerNutrition
