import React from 'react'
import { Check } from 'lucide-react'

const FeatureList = ({ title, features = [] }) => {
  if (!features?.length) return null
  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
      )}
      <ul className="space-y-2">
        {features.map((feature, idx) => (
          <li key={`${feature}-${idx}`} className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FeatureList


