import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Dumbbell, Clock, Target, Edit, Trash2, Eye, Search } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import axios from 'axios'
import toast from 'react-hot-toast'

const TrainerWorkouts = () => {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [newWorkout, setNewWorkout] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    duration: '',
    category: 'strength',
    exercises: []
  })

  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: 'Body weight',
    restTime: '60 seconds',
    instructions: ''
  })

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('/api/trainers/workouts')
      setWorkouts(response.data.data.workoutPlans)
    } catch (error) {
      console.error('Error fetching workouts:', error)
      toast.error('Failed to fetch workout plans')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWorkout = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/trainers/workouts', newWorkout)
      toast.success('Workout plan created successfully!')
      setShowCreateForm(false)
      setNewWorkout({
        title: '',
        description: '',
        difficulty: 'beginner',
        duration: '',
        category: 'strength',
        exercises: []
      })
      fetchWorkouts()
    } catch (error) {
      console.error('Error creating workout:', error)
      toast.error('Failed to create workout plan')
    }
  }

  const addExercise = () => {
    if (newExercise.name && newExercise.sets && newExercise.reps) {
      setNewWorkout(prev => ({
        ...prev,
        exercises: [...prev.exercises, { ...newExercise }]
      }))
      setNewExercise({
        name: '',
        sets: '',
        reps: '',
        weight: 'Body weight',
        restTime: '60 seconds',
        instructions: ''
      })
    }
  }

  const removeExercise = (index) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }))
  }

  const filteredWorkouts = workouts.filter(workout => 
    workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.description.toLowerCase().includes(searchTerm.toLowerCase())
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
              Workout Plans
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create and manage workout plans for your clients
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="mt-4 sm:mt-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Workout Plan
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
            placeholder="Search workout plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
          />
        </motion.div>

        {/* Create Workout Form Modal */}
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
                Create New Workout Plan
              </h2>
              
              <form onSubmit={handleCreateWorkout} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Workout Title"
                    value={newWorkout.title}
                    onChange={(e) => setNewWorkout(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Difficulty
                    </label>
                    <select
                      value={newWorkout.difficulty}
                      onChange={(e) => setNewWorkout(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Duration (minutes)"
                    type="number"
                    value={newWorkout.duration}
                    onChange={(e) => setNewWorkout(prev => ({ ...prev, duration: e.target.value }))}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={newWorkout.category}
                      onChange={(e) => setNewWorkout(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="strength">Strength</option>
                      <option value="cardio">Cardio</option>
                      <option value="flexibility">Flexibility</option>
                      <option value="hiit">HIIT</option>
                      <option value="yoga">Yoga</option>
                      <option value="pilates">Pilates</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newWorkout.description}
                    onChange={(e) => setNewWorkout(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                {/* Add Exercise Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Add Exercises
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Input
                      label="Exercise Name"
                      value={newExercise.name}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      label="Sets"
                      value={newExercise.sets}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, sets: e.target.value }))}
                    />
                    <Input
                      label="Reps"
                      value={newExercise.reps}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, reps: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Weight"
                      value={newExercise.weight}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, weight: e.target.value }))}
                    />
                    <Input
                      label="Rest Time"
                      value={newExercise.restTime}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, restTime: e.target.value }))}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Instructions
                    </label>
                    <textarea
                      value={newExercise.instructions}
                      onChange={(e) => setNewExercise(prev => ({ ...prev, instructions: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <Button
                    type="button"
                    onClick={addExercise}
                    variant="outline"
                    className="mb-4"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Exercise
                  </Button>
                </div>

                {/* Exercise List */}
                {newWorkout.exercises.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Exercises ({newWorkout.exercises.length})
                    </h3>
                    <div className="space-y-3">
                      {newWorkout.exercises.map((exercise, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{exercise.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {exercise.sets} sets × {exercise.reps} reps • {exercise.weight}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExercise(index)}
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
                    Create Workout Plan
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Workouts Grid */}
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
          {filteredWorkouts.map((workout, index) => (
            <motion.div key={workout._id} variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
              <Card hover className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    workout.difficulty === 'beginner' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : workout.difficulty === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {workout.difficulty}
                  </span>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{workout.duration} min</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {workout.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {workout.description}
                </p>

                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <Dumbbell className="w-4 h-4 mr-2" />
                    <span>{workout.exercises.length} exercises</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Target className="w-4 h-4 mr-2" />
                    <span className="capitalize">{workout.category}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 text-xs rounded-full">
                    {workout.category}
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

        {filteredWorkouts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No workout plans found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm 
                ? 'Try adjusting your search criteria'
                : 'Create your first workout plan to get started'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Create Workout Plan
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TrainerWorkouts
