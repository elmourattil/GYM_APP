import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Dumbbell, 
  Clock, 
  Target, 
  Play, 
  CheckCircle, 
  Star,
  Filter,
  Search,
  Calendar,
  Users,
  Award,
  Timer,
  Zap
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const Workouts = () => {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [workouts, setWorkouts] = useState([])
  const [assignedWorkouts, setAssignedWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchWorkouts()
      fetchAssignedWorkouts()
    }
  }, [isAuthenticated, authLoading])

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('/api/members/workouts')
      setWorkouts(response.data.data)
    } catch (error) {
      console.error('Error fetching workouts:', error)
      if (error.response?.status === 401) {
        window.location.href = '/login'
        return
      }
      toast.error('Failed to fetch workout plans')
    } finally {
      setLoading(false)
    }
  }

  const fetchAssignedWorkouts = async () => {
    try {
      const response = await axios.get('/api/members/dashboard')
      setAssignedWorkouts(response.data.data.member?.workouts || [])
    } catch (error) {
      console.error('Error fetching assigned workouts:', error)
      if (error.response?.status === 401) {
        window.location.href = '/login'
        return
      }
    }
  }

  const assignWorkout = async (workoutId) => {
    try {
      await axios.post(`/api/members/workouts/${workoutId}/assign`)
      toast.success('Workout plan assigned successfully!')
      fetchAssignedWorkouts()
    } catch (error) {
      console.error('Error assigning workout:', error)
      toast.error('Failed to assign workout plan')
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'strength':
        return <Dumbbell className="w-5 h-5" />
      case 'cardio':
        return <Zap className="w-5 h-5" />
      case 'hiit':
        return <Timer className="w-5 h-5" />
      case 'yoga':
        return <Users className="w-5 h-5" />
      default:
        return <Target className="w-5 h-5" />
    }
  }

  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workout.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = difficultyFilter === 'all' || workout.difficulty === difficultyFilter
    const matchesCategory = categoryFilter === 'all' || workout.category === categoryFilter
    return matchesSearch && matchesDifficulty && matchesCategory
  })

  const isWorkoutAssigned = (workoutId) => {
    return assignedWorkouts.some(workout => workout._id === workoutId)
  }

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
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Workout Plans
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover and assign workout plans tailored to your fitness goals
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
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
          <div className="flex gap-4">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Categories</option>
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="hiit">HIIT</option>
              <option value="yoga">Yoga</option>
            </select>
          </div>
        </motion.div>

        {/* Assigned Workouts */}
        {assignedWorkouts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  My Assigned Workouts
                </h2>
                <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm font-medium rounded-full">
                  {assignedWorkouts.length} assigned
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignedWorkouts.map((workout, index) => (
                  <motion.div
                    key={workout._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 rounded-lg p-6 border border-primary-200 dark:border-primary-700"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                          {getCategoryIcon(workout.category)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {workout.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            by {workout.createdBy?.name || 'Trainer'}
                          </p>
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {workout.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {workout.duration} min
                        </div>
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-1" />
                          {workout.exercises?.length || 0} exercises
                        </div>
                      </div>
                      <Button size="sm">
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Available Workouts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Available Workout Plans
              </h2>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-full">
                {filteredWorkouts.length} plans
              </span>
            </div>

            {filteredWorkouts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkouts.map((workout, index) => (
                  <motion.div
                    key={workout._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                          {getCategoryIcon(workout.category)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {workout.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            by {workout.createdBy?.name || 'Trainer'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(workout.difficulty)}`}>
                        {workout.difficulty}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {workout.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {workout.duration} min
                        </div>
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-1" />
                          {workout.exercises?.length || 0} exercises
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {workout.targetMuscles?.slice(0, 3).map((muscle, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                          >
                            {muscle}
                          </span>
                        ))}
                        {workout.targetMuscles?.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                            +{workout.targetMuscles.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          4.8 (24 reviews)
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant={isWorkoutAssigned(workout._id) ? "outline" : "primary"}
                        onClick={() => assignWorkout(workout._id)}
                        disabled={isWorkoutAssigned(workout._id)}
                      >
                        {isWorkoutAssigned(workout._id) ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Assigned
                          </>
                        ) : (
                          <>
                            <Award className="w-4 h-4 mr-1" />
                            Assign
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No workout plans found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm || difficultyFilter !== 'all' || categoryFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'No workout plans available at the moment'
                  }
                </p>
                {(searchTerm || difficultyFilter !== 'all' || categoryFilter !== 'all') && (
                  <Button
                    onClick={() => {
                      setSearchTerm('')
                      setDifficultyFilter('all')
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

export default Workouts
