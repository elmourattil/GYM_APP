import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Star, 
  Quote, 
  User, 
  Calendar,
  ThumbsUp,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'
import LoadingSpinner from './ui/LoadingSpinner'
import axios from 'axios'
import toast from 'react-hot-toast'

const ReviewsDisplay = ({ showFilters = true, limit = 6, showHeader = true }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchReviews()
  }, [currentPage, ratingFilter])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage,
        limit: limit.toString()
      })
      
      if (ratingFilter !== 'all') {
        params.append('rating', ratingFilter)
      }

      const response = await axios.get(`/api/reviews/public?${params}`)
      setReviews(response.data.data)
      
      // Calculate total pages based on response
      if (response.data.pagination) {
        setTotalPages(response.data.pagination.pages)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      const isFilled = starValue <= rating
      
      return (
        <Star
          key={index}
          className={`w-4 h-4 ${
            isFilled 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300'
          }`}
        />
      )
    })
  }

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return 'Poor'
      case 2: return 'Fair'
      case 3: return 'Good'
      case 4: return 'Very Good'
      case 5: return 'Excellent'
      default: return ''
    }
  }

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600 dark:text-green-400'
    if (rating >= 3) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const filteredReviews = reviews.filter(review => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      review.title.toLowerCase().includes(searchLower) ||
      review.content.toLowerCase().includes(searchLower) ||
      review.memberId?.name.toLowerCase().includes(searchLower)
    )
  })

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="w-full">
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Members Say
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover why our members love training with us. Read their honest reviews and experiences.
          </p>
        </motion.div>
      )}

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="flex-1">
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
          <div className="flex gap-4">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>
          </div>
        </motion.div>
      )}

      {filteredReviews.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredReviews.map((review, index) => (
            <motion.div key={review._id} variants={itemVariants}>
              <Card hover className="h-full">
                <div className="p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {review.memberId?.name || 'Anonymous'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(review.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Quote className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center mr-2">
                      {renderStars(review.rating)}
                    </div>
                    <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>
                      {getRatingText(review.rating)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {review.title}
                  </h3>

                  {/* Content */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-4 flex-grow">
                    {review.content}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span className="text-sm">Helpful</span>
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm">Reply</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {review.rating}/5
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Quote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No reviews found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || ratingFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Be the first to share your experience!'
            }
          </p>
          {(searchTerm || ratingFilter !== 'all') && (
            <Button
              onClick={() => {
                setSearchTerm('')
                setRatingFilter('all')
              }}
            >
              Clear Filters
            </Button>
          )}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center mt-8"
        >
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                const page = index + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                )
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ReviewsDisplay
