import React from 'react'

const Faq = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h1>
        <div id="faq-top" className="space-y-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow" id="faq-plans">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">How do I choose a membership plan?</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Browse our membership plans and pick the one that suits your goals. You can always upgrade later.</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow" id="faq-pt">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">What is included in Personal Training?</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Personalized programs, coaching sessions, and progress tracking with a certified trainer.</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow" id="faq-pause">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Can I pause my membership?</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Please contact support for membership pause options available at your location.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Faq
