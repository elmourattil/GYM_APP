import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Utensils, 
  Clock, 
  Target, 
  CheckCircle, 
  Star,
  Search,
  Filter,
  Award,
  Flame,
  Apple,
  Coffee,
  Sun,
  Moon,
  Zap,
  Lock,
  Crown,
  Heart
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const Nutrition = () => {
  const { loadUser, isAuthenticated, loading: authLoading } = useAuth()
  const [nutritionPlans, setNutritionPlans] = useState([])
  const [assignedPlan, setAssignedPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [canUseNutrition, setCanUseNutrition] = useState(false)
  const [membershipMessage, setMembershipMessage] = useState('')
  const [userPlan, setUserPlan] = useState(null)

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchNutritionPlans()
      fetchAssignedPlan()
      fetchPermissions()
    }
  }, [isAuthenticated, authLoading])

  // Refresh user data when component mounts to get latest membership status
  useEffect(() => {
    if (isAuthenticated && authLoading) {
      loadUser()
    }
  }, [loadUser, isAuthenticated, authLoading])

  const fetchNutritionPlans = async () => {
    try {
      const response = await axios.get('/api/members/nutrition')
      setNutritionPlans(response.data.data)
    } catch (error) {
      console.error('Error fetching nutrition plans:', error)
      if (error.response?.status === 401) {
        window.location.href = '/login'
        return
      }
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        toast.error('Unable to connect to server. Please check if the backend is running.')
      } else {
        toast.error('Failed to fetch nutrition plans')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchAssignedPlan = async () => {
    try {
      const response = await axios.get('/api/members/dashboard')
      setAssignedPlan(response.data.data.member?.nutritionPlan || null)
    } catch (error) {
      console.error('Error fetching assigned nutrition plan:', error)
      if (error.response?.status === 401) {
        window.location.href = '/login'
        return
      }
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        toast.error('Unable to connect to server. Please check if the backend is running.')
      }
    }
  }

  const fetchPermissions = async () => {
    try {
      const res = await axios.get('/api/auth/me')
      const u = res.data.data
      const isActive = u?.membershipStatus === 'active'
      const includesNutrition = u?.membershipPlan?.includesNutritionPlan
      const planName = u?.membershipPlan?.name
      const plan = u?.membershipPlan
      
      setUserPlan(plan)
      
      if (!isActive) {
        setCanUseNutrition(false)
        setMembershipMessage('Your membership is awaiting confirmation by the gym admin.')
      } else if (!includesNutrition) {
        setCanUseNutrition(false)
        if (planName === 'Basic Plan') {
          setMembershipMessage('Nutrition plans are not included in your Basic Plan. Upgrade to Premium or Elite to access personalized nutrition plans and unlock your full potential!')
        } else if (planName === 'Starter Plan') {
          setMembershipMessage('Nutrition plans are not included in your Starter Plan. Upgrade to Premium or Elite to access personalized nutrition plans and unlock your full potential!')
        } else {
          setMembershipMessage('Your current plan does not include nutrition plans. Upgrade to Premium or Elite to access personalized nutrition plans!')
        }
      } else {
        setCanUseNutrition(true)
        setMembershipMessage('')
      }
    } catch (e) {
      console.error('Failed to load membership permissions', e)
      if (e.response?.status === 401) {
        window.location.href = '/login'
        return
      }
      if (e.code === 'ERR_NETWORK' || e.message === 'Network Error') {
        toast.error('Unable to connect to server. Please check if the backend is running.')
      }
    }
  }

  const assignNutritionPlan = async (planId) => {
    if (!canUseNutrition) {
      toast.error(membershipMessage || 'Not allowed by your membership')
      return
    }
    try {
      await axios.post(`/api/members/nutrition/${planId}/assign`)
      toast.success('Nutrition plan assigned successfully!')
      fetchAssignedPlan()
    } catch (error) {
      console.error('Error assigning nutrition plan:', error)
      toast.error('Failed to assign nutrition plan')
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'weight_loss':
        return <Flame className="w-5 h-5" />
      case 'muscle_gain':
        return <Zap className="w-5 h-5" />
      case 'maintenance':
        return <Target className="w-5 h-5" />
      case 'performance':
        return <Heart className="w-5 h-5" />
      default:
        return <Utensils className="w-5 h-5" />
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'weight_loss':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'muscle_gain':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'maintenance':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'performance':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getMealIcon = (mealType) => {
    switch (mealType) {
      case 'breakfast':
        return <Sun className="w-4 h-4" />
      case 'lunch':
        return <Utensils className="w-4 h-4" />
      case 'dinner':
        return <Moon className="w-4 h-4" />
      case 'snack':
        return <Coffee className="w-4 h-4" />
      default:
        return <Utensils className="w-4 h-4" />
    }
  }

  const filteredPlans = nutritionPlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || plan.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // If user doesn't have permission, show upgrade message
  if (!canUseNutrition) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8">
              <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Nutrition Plans Not Available
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {membershipMessage}
              </p>
            </div>

            <Card className="max-w-2xl mx-auto">
              <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <Crown className="w-8 h-8 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Upgrade Your Plan
                  </h2>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Unlock personalized nutrition plans and transform your health with our premium plans.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Premium Plan</h3>
                    <p className="text-2xl font-bold text-purple-600 mb-2">$69/month</p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>✓ Custom nutrition plan</li>
                      <li>✓ 4 Personal Training Sessions</li>
                      <li>✓ Priority booking</li>
                      <li>✓ Nutrition consultation</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Elite Plan</h3>
                    <p className="text-2xl font-bold text-orange-600 mb-2">$99/month</p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>✓ Advanced nutrition plans</li>
                      <li>✓ Unlimited Personal Training</li>
                      <li>✓ VIP amenities</li>
                      <li>✓ 1-on-1 nutrition coaching</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => window.location.href = '/plans'}
                    className="flex items-center"
                  >
                    <Award className="w-5 h-5 mr-2" />
                    View All Plans
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/dashboard'}
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
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
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Nutrition Plans
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover personalized nutrition plans to fuel your fitness journey
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="flex-1">
            <Input
              placeholder="Search nutrition plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
          <div className="flex gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Categories</option>
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
              <option value="performance">Performance</option>
            </select>
          </div>
        </motion.div>

        {/* Assigned Nutrition Plan */}
        {assignedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  My Current Nutrition Plan
                </h2>
                <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm font-medium rounded-full">
                  Active Plan
                </span>
              </div>
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 rounded-lg p-6 border border-primary-200 dark:border-primary-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mr-4">
                      {getCategoryIcon(assignedPlan.category)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {assignedPlan.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        by {assignedPlan.createdBy?.name || 'Trainer'}
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {assignedPlan.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {assignedPlan.targetCalories}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Target Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {assignedPlan.meals?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Meals per Day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {assignedPlan.duration || 30}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Days Duration</div>
                  </div>
                </div>
                <Button className="w-full">
                  <Utensils className="w-4 h-4 mr-2" />
                  View Meal Plan
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Available Nutrition Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Available Nutrition Plans
              </h2>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-full">
                {filteredPlans.length} plans
              </span>
            </div>

            {filteredPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map((plan, index) => (
                  <motion.div
                    key={plan._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                          {getCategoryIcon(plan.category)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {plan.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            by {plan.createdBy?.name || 'Trainer'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(plan.category)}`}>
                        {plan.category?.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {plan.description}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {plan.targetCalories}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {plan.meals?.length || 0}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Meals</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {plan.duration || 30}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Days</div>
                      </div>
                    </div>

                    {/* Sample Meals */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Sample Meals:
                      </h4>
                      <div className="space-y-2">
                        {plan.meals?.slice(0, 3).map((meal, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              {getMealIcon(meal.mealType)}
                              <span className="ml-2 text-gray-600 dark:text-gray-400">
                                {meal.name}
                              </span>
                            </div>
                            <span className="text-gray-500 dark:text-gray-400">
                              {meal.calories} cal
                            </span>
                          </div>
                        ))}
                        {plan.meals?.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            +{plan.meals.length - 3} more meals
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          4.9 (18 reviews)
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant={assignedPlan?._id === plan._id ? "outline" : "primary"}
                        onClick={() => assignNutritionPlan(plan._id)}
                        disabled={assignedPlan?._id === plan._id}
                      >
                        {assignedPlan?._id === plan._id ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Assigned
                          </>
                        ) : (
                          <>
                            <Award className="w-4 h-4 mr-1" />
                            Assign Plan
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Utensils className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No nutrition plans found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm || categoryFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'No nutrition plans available at the moment'
                  }
                </p>
                {(searchTerm || categoryFilter !== 'all') && (
                  <Button
                    onClick={() => {
                      setSearchTerm('')
                      setCategoryFilter('all')
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Nutrition