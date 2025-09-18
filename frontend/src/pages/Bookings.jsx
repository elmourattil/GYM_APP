import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle,
  Plus,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Star,
  AlertCircle,
  Edit,
  Trash2,
  Award,
  Lock,
  Crown
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const Bookings = () => {
  const { loadUser, isAuthenticated, loading: authLoading } = useAuth()
  const [bookings, setBookings] = useState([])
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [selectedTrainer, setSelectedTrainer] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [notes, setNotes] = useState('')
  const [canBookPT, setCanBookPT] = useState(false)
  const [membershipMessage, setMembershipMessage] = useState('')
  const [userPlan, setUserPlan] = useState(null)

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchBookings()
      fetchTrainers()
      fetchPermissions()
    }
  }, [isAuthenticated, authLoading])

  // Refresh user data when component mounts to get latest membership status
  useEffect(() => {
    if (isAuthenticated && authLoading) {
      loadUser()
    }
  }, [loadUser, isAuthenticated, authLoading])

  const fetchPermissions = async () => {
    try {
      const res = await axios.get('/api/auth/me')
      const u = res.data.data
      const isActive = u?.membershipStatus === 'active'
      const includesPT = u?.membershipPlan?.includesPersonalTraining
      const planName = u?.membershipPlan?.name
      const plan = u?.membershipPlan
      
      setUserPlan(plan)
      
      if (!isActive) {
        setCanBookPT(false)
        setMembershipMessage('Your membership is awaiting confirmation by the gym admin.')
      } else if (!includesPT) {
        setCanBookPT(false)
        if (planName === 'Starter Plan') {
          setMembershipMessage('Personal training sessions are not included in your Starter Plan. Upgrade to Basic, Premium, or Elite to book personal training sessions and accelerate your fitness journey!')
        } else {
          setMembershipMessage('Personal training bookings are not included in your current plan. Upgrade to Basic, Premium, or Elite to book personal training sessions!')
        }
      } else {
        setCanBookPT(true)
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

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/members/bookings')
      setBookings(response.data.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      if (error.response?.status === 401) {
        window.location.href = '/login'
        return
      }
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        toast.error('Unable to connect to server. Please check if the backend is running.')
      } else {
        toast.error('Failed to fetch bookings')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchTrainers = async () => {
    try {
      const response = await axios.get('/api/members/trainers')
      setTrainers(response.data.data)
    } catch (error) {
      console.error('Error fetching trainers:', error)
      if (error.response?.status === 401) {
        window.location.href = '/login'
        return
      }
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        toast.error('Unable to connect to server. Please check if the backend is running.')
      } else {
        toast.error('Failed to fetch trainers')
      }
    }
  }

  const createBooking = async (e) => {
    e.preventDefault()
    if (!canBookPT) {
      toast.error(membershipMessage || 'Not allowed by your membership')
      return
    }
    try {
      await axios.post('/api/members/bookings', {
        trainerId: selectedTrainer,
        date: selectedDate,
        time: selectedTime,
        notes: notes
      })
      toast.success('Session booked successfully!')
      setShowBookingForm(false)
      setSelectedTrainer('')
      setSelectedDate('')
      setSelectedTime('')
      setNotes('')
      fetchBookings()
    } catch (error) {
      console.error('Error creating booking:', error)
      toast.error('Failed to book session')
    }
  }

  const cancelBooking = async (bookingId) => {
    try {
      await axios.put(`/api/members/bookings/${bookingId}/cancel`)
      toast.success('Booking cancelled successfully!')
      fetchBookings()
    } catch (error) {
      console.error('Error cancelling booking:', error)
      toast.error('Failed to cancel booking')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const filteredBookings = (bookings || []).filter(booking => {
    const matchesSearch = booking.trainerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const upcomingBookings = (bookings || []).filter(booking => 
    new Date(booking.date) >= new Date() && booking.status !== 'cancelled'
  )

  const pastBookings = (bookings || []).filter(booking => 
    new Date(booking.date) < new Date() || booking.status === 'completed'
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // If user doesn't have permission, show upgrade message
  if (!canBookPT) {
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
                Personal Training Not Available
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
                  Unlock personal training sessions and accelerate your fitness journey with our premium plans.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Basic Plan</h3>
                    <p className="text-2xl font-bold text-blue-600 mb-2">$39/month</p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>✓ 2 Personal Training Sessions</li>
                      <li>✓ Basic nutrition guidance</li>
                      <li>✓ Sauna access</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border-2 border-purple-500 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Premium Plan</h3>
                    <p className="text-2xl font-bold text-purple-600 mb-2">$69/month</p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>✓ 4 Personal Training Sessions</li>
                      <li>✓ Custom nutrition plan</li>
                      <li>✓ Priority booking</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Elite Plan</h3>
                    <p className="text-2xl font-bold text-orange-600 mb-2">$99/month</p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>✓ Unlimited Personal Training</li>
                      <li>✓ Advanced nutrition plans</li>
                      <li>✓ VIP amenities</li>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Bookings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your training sessions and appointments
              </p>
            </div>
            <Button onClick={() => setShowBookingForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Book Session
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingBookings.length}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="flex-1">
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </motion.div>

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Upcoming Sessions
              </h2>
              <div className="space-y-4">
                {upcomingBookings.map((booking, index) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-4">
                        <User className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {booking.trainerId?.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(booking.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })} at {booking.time}
                        </p>
                        {booking.notes && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Note: {booking.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{booking.status}</span>
                      </span>
                      {booking.status === 'confirmed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelBooking(booking._id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* All Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              All Bookings
            </h2>
            {filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Trainer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date & Time</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Notes</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking, index) => (
                      <motion.tr
                        key={booking._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3">
                              <User className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {booking.trainerId?.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {booking.trainerId?.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(booking.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {booking.time}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1">{booking.status}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                            {booking.notes || 'No notes'}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            {booking.status === 'confirmed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => cancelBooking(booking._id)}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No bookings found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'You haven\'t booked any sessions yet'
                  }
                </p>
                <Button onClick={() => setShowBookingForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Book Your First Session
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Book a Session
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBookingForm(false)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={createBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Trainer
                  </label>
                  <select
                    value={selectedTrainer}
                    onChange={(e) => setSelectedTrainer(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  >
                    <option value="">Choose a trainer</option>
                    {(trainers || []).map(trainer => (
                      <option key={trainer._id} value={trainer._id}>
                        {trainer.name} - {trainer.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time
                  </label>
                  <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={3}
                    placeholder="Any special requests or notes..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowBookingForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Book Session
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Bookings