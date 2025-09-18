import React from 'react'

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Help Center</h1>
        <p className="text-gray-600 dark:text-gray-300">Welcome to our Help Center. Browse topics below.</p>
        
        <div id="getting-started" className="mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Getting Started</h2>
          <p className="text-gray-600 dark:text-gray-300">Learn how to set up your account and choose a plan.</p>
        </div>
        <div id="membership" className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Membership</h2>
          <p className="text-gray-600 dark:text-gray-300">Information about memberships, renewals, and upgrades.</p>
        </div>
        <div id="technical" className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Technical Issues</h2>
          <p className="text-gray-600 dark:text-gray-300">Troubleshooting login problems and other technical issues.</p>
        </div>
      </div>
    </div>
  )
}

export default HelpCenter
