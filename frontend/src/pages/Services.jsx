import React from 'react'
import { Link } from 'react-router-dom'

const Services = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/services/personal-training" className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Personal Training</h2>
            <p className="text-gray-600 dark:text-gray-300">One-on-one coaching tailored to your goals.</p>
          </Link>
          <Link to="/services/group-classes" className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Group Classes</h2>
            <p className="text-gray-600 dark:text-gray-300">Fun, energetic classes for all levels.</p>
          </Link>
          <Link to="/services/nutrition" className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Nutrition Plans</h2>
            <p className="text-gray-600 dark:text-gray-300">Meal guidance and tracking to fuel your progress.</p>
          </Link>
          <Link to="/services/assessment" className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fitness Assessment</h2>
            <p className="text-gray-600 dark:text-gray-300">Comprehensive assessment to personalize your journey.</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Services


