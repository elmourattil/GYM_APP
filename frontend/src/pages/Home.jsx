import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Award, 
  Clock,
  Dumbbell,
  Heart,
  Target,
  Zap
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ReviewsDisplay from '../components/ReviewsDisplay'
import axios from 'axios'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const [stats, setStats] = useState(null)
  const [featuredWorkouts, setFeaturedWorkouts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, workoutsRes] = await Promise.all([
          axios.get('/api/public/stats'),
          axios.get('/api/public/workouts')
        ])
        setStats(statsRes.data.data)
        setFeaturedWorkouts(workoutsRes.data.data.slice(0, 3))
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const features = [
    {
      icon: Dumbbell,
      title: 'State-of-the-Art Equipment',
      description: 'Latest fitness equipment and machines for all your workout needs.'
    },
    {
      icon: Users,
      title: 'Expert Trainers',
      description: 'Certified personal trainers to guide you on your fitness journey.'
    },
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive approach to fitness including nutrition and recovery.'
    },
    {
      icon: Target,
      title: 'Personalized Plans',
      description: 'Custom workout and nutrition plans tailored to your goals.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Member',
      content: 'FitGym has transformed my fitness journey. The trainers are amazing and the community is so supportive!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Member',
      content: 'Best gym in the city! The equipment is top-notch and the staff is incredibly helpful.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Member',
      content: 'I love the variety of classes and the personalized attention from the trainers.',
      rating: 5
    }
  ]

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Transform Your
              <span className="block text-yellow-300">Fitness Journey</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-primary-100">
              Join thousands of members who have achieved their fitness goals with our 
              world-class facilities, expert trainers, and personalized programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => window.location.href = '/dashboard'}
                  className="text-primary-600"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => window.location.href = '/register'}
                    className="text-primary-600"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => window.location.href = '/plans'}
                    className="border-white text-white hover:bg-white hover:text-primary-600"
                  >
                    View Plans
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              <motion.div variants={itemVariants} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stats.totalMembers}+
                </div>
                <div className="text-gray-600 dark:text-gray-400">Active Members</div>
              </motion.div>
              <motion.div variants={itemVariants} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stats.totalTrainers}+
                </div>
                <div className="text-gray-600 dark:text-gray-400">Expert Trainers</div>
              </motion.div>
              <motion.div variants={itemVariants} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stats.totalWorkouts}+
                </div>
                <div className="text-gray-600 dark:text-gray-400">Workout Plans</div>
              </motion.div>
              <motion.div variants={itemVariants} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stats.yearsExperience}+
                </div>
                <div className="text-gray-600 dark:text-gray-400">Years Experience</div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose FitGym?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We provide everything you need to achieve your fitness goals in a supportive 
              and motivating environment.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card hover className="text-center h-full">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Workouts */}
      {!loading && featuredWorkouts.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Workouts
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Discover our most popular workout plans designed by expert trainers.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {featuredWorkouts.map((workout, index) => (
                <motion.div key={workout._id} variants={itemVariants}>
                  <Card hover className="h-full">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 text-sm font-medium rounded-full">
                        {workout.difficulty}
                      </span>
                      <div className="flex items-center text-yellow-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{workout.duration} min</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {workout.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {workout.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        By {workout.createdBy?.name || 'Trainer'}
                      </span>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Button size="lg" onClick={() => window.location.href = '/workouts'}>
                View All Workouts
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReviewsDisplay showFilters={false} limit={6} showHeader={true} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Fitness Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Join thousands of members who have transformed their lives with FitGym. 
              Your fitness journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated && (
                <>
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => window.location.href = '/register'}
                    className="text-primary-600"
                  >
                    Join Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => window.location.href = '/plans'}
                    className="border-white text-white hover:bg-white hover:text-primary-600"
                  >
                    View Membership Plans
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
