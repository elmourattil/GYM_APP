import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Star, 
  X, 
  Send, 
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2
} from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const ReviewForm = ({ onReviewSubmitted, existingReview = null, onClose }) => {
  const { user } = useAuth()
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [title, setTitle] = useState(existingReview?.title || '')
  const [content, setContent] = useState(existingReview?.content || '')
  const [loading, setLoading] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    if (!content.trim()) {
      toast.error('Please enter your review content')
      return
    }

    setLoading(true)

    try {
      if (existingReview) {
        // Update existing review
        await axios.put(`/api/reviews/member/${existingReview._id}`, {
          rating,
          title: title.trim(),
          content: content.trim()
        })
        toast.success('Review updated successfully!')
      } else {
        // Create new review
        await axios.post('/api/reviews/member', {
          rating,
          title: title.trim(),
          content: content.trim()
        })
        toast.success('Review submitted successfully! It will be reviewed by admin before publishing.')
      }

      if (onReviewSubmitted) {
        onReviewSubmitted()
      }
      
      if (onClose) {
        onClose()
      }

      // Reset form if creating new review
      if (!existingReview) {
        setRating(0)
        setTitle('')
        setContent('')
      }
    } catch (error) {
      console.error('Review submission error:', error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Failed to submit review')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!existingReview) return

    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`/api/reviews/member/${existingReview._id}`)
        toast.success('Review deleted successfully!')
        if (onReviewSubmitted) {
          onReviewSubmitted()
        }
        if (onClose) {
          onClose()
        }
      } catch (error) {
        console.error('Delete review error:', error)
        toast.error('Failed to delete review')
      }
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      const isFilled = starValue <= (hoveredStar || rating)
      
      return (
        <button
          key={index}
          type="button"
          className={`w-8 h-8 transition-colors ${
            isFilled 
              ? 'text-yellow-400' 
              : 'text-gray-300 hover:text-yellow-300'
          }`}
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredStar(starValue)}
          onMouseLeave={() => setHoveredStar(0)}
        >
          <Star className="w-full h-full fill-current" />
        </button>
      )
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {existingReview ? 'Edit Review' : 'Write a Review'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Your Rating *
            </label>
            <div className="flex items-center space-x-1">
              {renderStars()}
              <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                {rating > 0 && (
                  <>
                    {rating} star{rating !== 1 ? 's' : ''} - {
                      rating === 1 ? 'Poor' :
                      rating === 2 ? 'Fair' :
                      rating === 3 ? 'Good' :
                      rating === 4 ? 'Very Good' :
                      rating === 5 ? 'Excellent' : ''
                    }
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Review Title *
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your review a title..."
              maxLength={100}
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {title.length}/100 characters
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Review *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your experience with our gym..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
              rows={6}
              maxLength={1000}
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {content.length}/1000 characters
            </p>
          </div>

          {/* Review Guidelines */}
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Review Guidelines
                </h4>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Be honest and constructive in your feedback</li>
                  <li>• Focus on your experience with facilities, trainers, and services</li>
                  <li>• Avoid personal attacks or inappropriate language</li>
                  <li>• Your review will be moderated before publishing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Status Info for Existing Reviews */}
          {existingReview && (
            <div className={`p-4 rounded-lg border ${
              existingReview.status === 'pending' 
                ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800'
                : existingReview.status === 'approved'
                ? 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800'
                : 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800'
            }`}>
              <div className="flex items-center">
                {existingReview.status === 'pending' ? (
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                ) : existingReview.status === 'approved' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                ) : (
                  <X className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
                )}
                <div>
                  <p className={`text-sm font-medium ${
                    existingReview.status === 'pending' 
                      ? 'text-yellow-900 dark:text-yellow-100'
                      : existingReview.status === 'approved'
                      ? 'text-green-900 dark:text-green-100'
                      : 'text-red-900 dark:text-red-100'
                  }`}>
                    Status: {existingReview.status.charAt(0).toUpperCase() + existingReview.status.slice(1)}
                  </p>
                  {existingReview.status === 'pending' && (
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      Your review is awaiting admin approval
                    </p>
                  )}
                  {existingReview.status === 'approved' && (
                    <p className="text-xs text-green-800 dark:text-green-200">
                      Your review has been published
                    </p>
                  )}
                  {existingReview.status === 'rejected' && (
                    <p className="text-xs text-red-800 dark:text-red-200">
                      Your review was not approved
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {existingReview && existingReview.status === 'pending' && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || rating === 0}
                className="flex items-center"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {existingReview ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {existingReview ? 'Update Review' : 'Submit Review'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default ReviewForm
