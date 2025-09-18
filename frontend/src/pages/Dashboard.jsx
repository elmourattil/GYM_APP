import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Dumbbell, 
  Utensils, 
  TrendingUp, 
  Clock, 
  Target,
  Users,
  Award,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ProfileAvatar from '../components/ui/ProfileAvatar'
import axios from 'axios'
import FeatureList from '../components/ui/FeatureList'
import ReviewForm from '../components/ReviewForm'

const Dashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usage, setUsage] = useState(null)
  const [permissions, setPermissions] = useState({
    canBookPT: false,
    canAccessNutrition: false,
    membershipMessage: ''
  })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userReviews, setUserReviews] = useState([])
  const [showReviews, setShowReviews] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/members/dashboard')
        setDashboardData(response.data.data)
        const usageRes = await axios.get('/api/members/usage')
        setUsage(usageRes.data.data)
        
        // Check permissions
        const userRes = await axios.get('/api/auth/me')
        const userData = userRes.data.data
        const isActive = userData?.membershipStatus === 'active'
        const includesPT = userData?.membershipPlan?.includesPersonalTraining
        const includesNutrition = userData?.membershipPlan?.includesNutritionPlan
        const planName = userData?.membershipPlan?.name
        
        setPermissions({
          canBookPT: isActive && includesPT,
          canAccessNutrition: isActive && includesNutrition,
          membershipMessage: !isActive 
            ? 'Your membership is awaiting confirmation by the gym admin.'
            : !includesPT && !includesNutrition
            ? `Your ${planName} does not include personal training or nutrition plans. Upgrade to Premium or Elite for full access!`
            : !includesPT
            ? `Your ${planName} does not include personal training. Upgrade to Premium or Elite to book sessions!`
            : !includesNutrition
            ? `Your ${planName} does not include nutrition plans. Upgrade to Premium or Elite for nutrition access!`
            : ''
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        if (error.response?.status === 401) {
          // Token expired or invalid, redirect to login
          window.location.href = '/login'
        }
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      if (isAuthenticated) {
        fetchDashboardData()
        fetchUserReviews()
      } else {
        setLoading(false)
      }
    }
  }, [isAuthenticated, authLoading])

  const fetchUserReviews = async () => {
    try {
      const response = await axios.get('/api/reviews/member')
      setUserReviews(response.data.data)
    } catch (error) {
      console.error('Error fetching user reviews:', error)
    }
  }

  const handleReviewSubmitted = () => {
    fetchUserReviews()
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const computeActiveStreakDays = () => {
    const member = dashboardData?.member
    if (!member || member.membershipStatus !== 'active') return 0
    const start = member.membershipStartDate ? new Date(member.membershipStartDate) : null
    const end = member.membershipEndDate ? new Date(member.membershipEndDate) : null
    if (!start) return 0
    const today = new Date()
    const cappedToday = end && today > end ? end : today
    const diffMs = cappedToday - start
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1
    return Math.max(0, days)
  }

  const activeStreakLabel = `${computeActiveStreakDays()} days`

  const stats = [
    {
      title: 'Total Workouts',
      value: dashboardData?.stats?.totalWorkouts || 0,
      icon: Dumbbell,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Upcoming Sessions',
      value: dashboardData?.stats?.upcomingSessions || 0,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Membership Status',
      value: dashboardData?.stats?.membershipStatus || 'No Plan',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    },
    {
      title: 'Active Streak',
      value: activeStreakLabel,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900'
    }
  ]

  const isMembershipActive = dashboardData?.member?.membershipStatus === 'active'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
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
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's an overview of your fitness journey
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card hover>
                  <div className="flex items-center">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Permission Message */}
        {permissions.membershipMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <div className="p-4 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800">
                <div className="flex items-start">
                  <Award className="w-5 h-5 mr-3 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium mb-2">{permissions.membershipMessage}</p>
                    {permissions.membershipMessage.includes('Upgrade') && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.href = '/plans'}
                        className="mt-2"
                      >
                        <Award className="w-4 h-4 mr-2" />
                        View Upgrade Options
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Bookings */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2"
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Upcoming Sessions
                </h2>
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/bookings'} disabled={!isMembershipActive}>
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              {!isMembershipActive ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Your membership is awaiting admin confirmation. Sessions will appear here once activated.
                  </p>
                </div>
              ) : dashboardData?.upcomingBookings?.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.upcomingBookings.map((booking, index) => (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center">
                        <ProfileAvatar 
                          user={booking.trainerId} 
                          size="md" 
                          showRole={false}
                          className="mr-4"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {booking.trainerId?.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No upcoming sessions scheduled
                  </p>
                  <Button className="mt-4" onClick={() => window.location.href = '/bookings'}>
                    Book a Session
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/workouts'}
                  disabled={!isMembershipActive}
                >
                  <Dumbbell className="w-5 h-5 mr-3" />
                  {isMembershipActive ? 'View Workouts' : 'View Workouts (Locked)'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/nutrition'}
                  disabled={!isMembershipActive || !permissions.canAccessNutrition}
                >
                  <Utensils className="w-5 h-5 mr-3" />
                  {isMembershipActive
                    ? (permissions.canAccessNutrition ? 'Nutrition Plans' : 'Nutrition Plans (Not in Plan)')
                    : 'Nutrition Plans (Locked)'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/bookings'}
                  disabled={!isMembershipActive || !permissions.canBookPT}
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  {isMembershipActive
                    ? (permissions.canBookPT ? 'Book Session' : 'Book Session (Not in Plan)')
                    : 'Book Session (Locked)'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/profile'}
                >
                  <Users className="w-5 h-5 mr-3" />
                  Update Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowReviewForm(true)}
                >
                  <Star className="w-5 h-5 mr-3" />
                  Write Review
                </Button>
              </div>
            </Card>

            {/* Recent Workouts */}
            <Card className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Recent Workouts
              </h2>
              {dashboardData?.recentWorkouts?.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recentWorkouts.map((workout, index) => (
                    <div key={workout._id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {workout.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {workout.duration} minutes
                        </p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Dumbbell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No recent workouts
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Membership Info */}
        {dashboardData?.member && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="mt-8"
          >
            <Card>
              {dashboardData.member.membershipStatus !== 'active' ? (
                <div className="p-4 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800">
                  Your membership is awaiting confirmation by the gym admin.
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Current Membership
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {dashboardData.member.membershipPlan.name} - ${dashboardData.member.membershipPlan.price}/{dashboardData.member.membershipPlan.duration}
                      </p>
                    </div>
                  </div>
                  {usage && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Personal Training Sessions</p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${Math.min(100, ((usage.usage.personalTrainingSessions || 0) / (usage.limits.personalTrainingSessions || Infinity)) * 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {usage.limits.personalTrainingSessions === null ? 'Unlimited' : `${usage.usage.personalTrainingSessions || 0} / ${usage.limits.personalTrainingSessions}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Guest Passes</p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.min(100, ((usage.usage.guestPasses || 0) / (usage.limits.guestPasses || 1)) * 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {usage.limits.guestPasses ? `${usage.usage.guestPasses || 0} / ${usage.limits.guestPasses}` : 'Not in plan'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Massage Sessions</p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${Math.min(100, ((usage.usage.massageSessions || 0) / (usage.limits.massageSessions || 1)) * 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {usage.limits.massageSessions ? `${usage.usage.massageSessions || 0} / ${usage.limits.massageSessions}` : 'Not in plan'}
                        </p>
                      </div>
                    </div>
                  )}
                  <FeatureList
                    title="Your Plan Features"
                    features={dashboardData.member.membershipPlan.features || []}
                  />
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* User Reviews Section */}
        {userReviews.length > 0 && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="mt-8"
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  My Reviews
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReviews(!showReviews)}
                >
                  {showReviews ? 'Hide' : 'Show'} Reviews
                </Button>
              </div>
              
              {showReviews && (
                <div className="space-y-4">
                  {userReviews.map((review) => (
                    <div key={review._id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {review.title}
                          </h3>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < review.rating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                              {review.rating}/5
                            </span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          review.status === 'approved' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : review.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {review.status}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {review.content}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          Submitted: {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                        {review.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowReviewForm(review)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Review Form Modal */}
        {showReviewForm && (
          <ReviewForm
            existingReview={typeof showReviewForm === 'object' ? showReviewForm : null}
            onReviewSubmitted={handleReviewSubmitted}
            onClose={() => setShowReviewForm(false)}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard
