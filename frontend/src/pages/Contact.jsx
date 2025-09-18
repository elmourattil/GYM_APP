import React from 'react'

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Contact</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Get in touch with us for memberships, training, or general inquiries.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Address</h2>
            <p className="text-gray-600 dark:text-gray-300">123 Fitness Street, Gym City, GC 12345</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Email</h2>
            <p className="text-gray-600 dark:text-gray-300">info@fitgym.com</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Phone</h2>
            <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Hours</h2>
            <p className="text-gray-600 dark:text-gray-300">Mon - Sun: 6:00 AM - 10:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact


