import React from 'react'

const Support = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Support</h1>
        <div id="billing" className="mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Billing & Payments</h2>
          <p className="text-gray-600 dark:text-gray-300">Information about how payments and renewals work at our gym.</p>
        </div>
        <div id="account" className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Account & Security</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage your account information and keep your data secure.</p>
        </div>
        <div id="plans" className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Membership Plans</h2>
          <p className="text-gray-600 dark:text-gray-300">Learn about plan features, upgrades, and eligibility.</p>
        </div>
      </div>
    </div>
  )
}

export default Support
