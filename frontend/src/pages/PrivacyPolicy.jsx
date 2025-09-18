import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Your privacy is important to us.</p>
        <div id="data" className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Data Collection</h2>
          <p className="text-gray-600 dark:text-gray-300">We collect minimal data needed to operate the app and services.</p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
