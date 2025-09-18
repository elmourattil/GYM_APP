import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Plus, Search, Edit, Trash2, Eye, DollarSign, Clock, CheckCircle, Users, XCircle } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import axios from 'axios'
import toast from 'react-hot-toast'

const AdminPlans = () => {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [planToDelete, setPlanToDelete] = useState(null)

  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '',
    duration: 'monthly',
    description: '',
    features: [''],
    maxTrainings: '',
    includesPersonalTraining: false,
    includesNutritionPlan: false,
    includesLocker: false,
    includesSauna: false
  })

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/admin/membership-plans')
      setPlans(response.data.data)
    } catch (error) {
      console.error('Error fetching plans:', error)
      toast.error('Failed to fetch membership plans')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlan = async (e) => {
    e.preventDefault()
    try {
      const planData = {
        ...newPlan,
        price: parseInt(newPlan.price),
        maxTrainings: newPlan.maxTrainings ? parseInt(newPlan.maxTrainings) : null,
        features: newPlan.features.filter(feature => feature.trim() !== '')
      }
      
      await axios.post('/api/admin/membership-plans', planData)
      toast.success('Membership plan created successfully!')
      setShowCreateForm(false)
      setNewPlan({
        name: '',
        price: '',
        duration: 'monthly',
        description: '',
        features: [''],
        maxTrainings: '',
        includesPersonalTraining: false,
        includesNutritionPlan: false,
        includesLocker: false,
        includesSauna: false
      })
      fetchPlans()
    } catch (error) {
      console.error('Error creating plan:', error)
      toast.error('Failed to create membership plan')
    }
  }

  const handleDeletePlan = (plan) => {
    setPlanToDelete(plan)
    setShowDeleteModal(true)
  }

  const confirmDeletePlan = async () => {
    if (!planToDelete) return
    
    try {
      await axios.delete(`/api/admin/membership-plans/${planToDelete._id}`)
      toast.success('Plan deleted successfully!')
      setShowDeleteModal(false)
      setPlanToDelete(null)
      fetchPlans()
    } catch (error) {
      console.error('Error deleting plan:', error)
      toast.error('Failed to delete plan')
    }
  }

  const handleViewPlan = (plan) => {
    setSelectedPlan(plan)
    setShowViewModal(true)
  }

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan)
    setNewPlan({
      name: plan.name,
      price: plan.price.toString(),
      duration: plan.duration,
      description: plan.description,
      features: plan.features,
      maxTrainings: plan.maxTrainings ? plan.maxTrainings.toString() : '',
      includesPersonalTraining: plan.includesPersonalTraining,
      includesNutritionPlan: plan.includesNutritionPlan,
      includesLocker: plan.includesLocker,
      includesSauna: plan.includesSauna
    })
    setShowEditForm(true)
  }

  const handleUpdatePlan = async (e) => {
    e.preventDefault()
    try {
      const planData = {
        ...newPlan,
        price: parseInt(newPlan.price),
        maxTrainings: newPlan.maxTrainings ? parseInt(newPlan.maxTrainings) : null,
        features: newPlan.features.filter(feature => feature.trim() !== '')
      }
      
      await axios.put(`/api/admin/membership-plans/${selectedPlan._id}`, planData)
      toast.success('Membership plan updated successfully!')
      setShowEditForm(false)
      setSelectedPlan(null)
      setNewPlan({
        name: '',
        price: '',
        duration: 'monthly',
        description: '',
        features: [''],
        maxTrainings: '',
        includesPersonalTraining: false,
        includesNutritionPlan: false,
        includesLocker: false,
        includesSauna: false
      })
      fetchPlans()
    } catch (error) {
      console.error('Error updating plan:', error)
      toast.error('Failed to update membership plan')
    }
  }

  const addFeature = () => {
    setNewPlan(prev => ({
      ...prev,
      features: [...prev.features, '']
    }))
  }

  const updateFeature = (index, value) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }))
  }

  const removeFeature = (index) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const filteredPlans = plans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              Membership Plans
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage membership plans and pricing
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="mt-4 sm:mt-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Plan
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
            placeholder="Search plans..."
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
                Create New Membership Plan
              </h2>
              
              <form onSubmit={handleCreatePlan} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Plan Name"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration
                    </label>
                    <select
                      value={newPlan.duration}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Price ($)"
                    type="number"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                  <Input
                    label="Max Trainings (leave empty for unlimited)"
                    type="number"
                    value={newPlan.maxTrainings}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, maxTrainings: e.target.value }))}
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

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Features
                  </label>
                  <div className="space-y-2">
                    {newPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder="Enter feature"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addFeature}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
                </div>

                {/* Inclusions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Plan Inclusions
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPlan.includesPersonalTraining}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, includesPersonalTraining: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Personal Training</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPlan.includesNutritionPlan}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, includesNutritionPlan: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Nutrition Plan</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPlan.includesLocker}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, includesLocker: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Locker Access</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPlan.includesSauna}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, includesSauna: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Sauna Access</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Plan
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* View Plan Modal */}
        {showViewModal && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedPlan.name}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowViewModal(false)}
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price
                    </label>
                    <div className="flex items-center text-2xl font-bold text-primary-600">
                      <DollarSign className="w-5 h-5 mr-1" />
                      {selectedPlan.price}
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                        /{selectedPlan.duration}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      selectedPlan.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {selectedPlan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedPlan.description}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Features
                  </label>
                  <ul className="space-y-1">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Plan Inclusions
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${selectedPlan.includesPersonalTraining ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Personal Training</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${selectedPlan.includesNutritionPlan ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Nutrition Plan</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${selectedPlan.includesLocker ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Locker Access</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${selectedPlan.includesSauna ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sauna Access</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Training Limit
                  </label>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedPlan.maxTrainings ? `${selectedPlan.maxTrainings} sessions` : 'Unlimited sessions'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setShowViewModal(false)
                    handleEditPlan(selectedPlan)
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Plan
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Plan Modal */}
        {showEditForm && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowEditForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Edit Membership Plan
              </h2>
              
              <form onSubmit={handleUpdatePlan} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Plan Name"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration
                    </label>
                    <select
                      value={newPlan.duration}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Price ($)"
                    type="number"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                  <Input
                    label="Max Trainings (leave empty for unlimited)"
                    type="number"
                    value={newPlan.maxTrainings}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, maxTrainings: e.target.value }))}
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

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Features
                  </label>
                  <div className="space-y-2">
                    {newPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder="Enter feature"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addFeature}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
                </div>

                {/* Inclusions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Plan Inclusions
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPlan.includesPersonalTraining}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, includesPersonalTraining: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Personal Training</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPlan.includesNutritionPlan}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, includesNutritionPlan: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Nutrition Plan</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPlan.includesLocker}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, includesLocker: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Locker Access</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPlan.includesSauna}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, includesSauna: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Sauna Access</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Update Plan
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && planToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Delete Plan
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Are you sure you want to delete this membership plan?
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {planToDelete.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${planToDelete.price} / {planToDelete.duration}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      planToDelete.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {planToDelete.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeletePlan}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Plan
                </Button>
              </div>
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
                    plan.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm capitalize">{plan.duration}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                
                <div className="mb-4">
                  <div className="flex items-center text-2xl font-bold text-primary-600 mb-2">
                    <DollarSign className="w-5 h-5 mr-1" />
                    {plan.price}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                      /{plan.duration}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {plan.features.slice(0, 3).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                    {plan.features.length > 3 && (
                      <li className="text-xs text-gray-500 dark:text-gray-400">
                        +{plan.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{plan.maxTrainings ? `${plan.maxTrainings} trainings` : 'Unlimited trainings'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {plan.includesPersonalTraining && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 text-xs rounded-full">
                        Personal Training
                      </span>
                    )}
                    {plan.includesNutritionPlan && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 text-xs rounded-full">
                        Nutrition Plan
                      </span>
                    )}
                    {plan.includesLocker && (
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 text-xs rounded-full">
                        Locker
                      </span>
                    )}
                    {plan.includesSauna && (
                      <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-600 text-xs rounded-full">
                        Sauna
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 text-xs rounded-full">
                    {plan.duration}
                  </span>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewPlan(plan)}
                      title="View Plan Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditPlan(plan)}
                      title="Edit Plan"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeletePlan(plan)}
                      title="Delete Plan"
                    >
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
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No membership plans found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm 
                ? 'Try adjusting your search criteria'
                : 'Create your first membership plan to get started'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Create Plan
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminPlans
