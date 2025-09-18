import React from 'react'
import { User } from 'lucide-react'

const ProfileAvatar = ({ 
  user, 
  size = 'md', 
  showRole = false, 
  className = '' 
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-2xl',
    '2xl': 'w-32 h-32 text-4xl'
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return '👑'
      case 'trainer':
        return '💪'
      default:
        return '🏃'
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'from-red-400 to-red-600'
      case 'trainer':
        return 'from-blue-400 to-blue-600'
      default:
        return 'from-green-400 to-green-600'
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizes[size]} bg-gradient-to-br ${getRoleColor(user?.role || 'member')} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
        {user?.profileImage ? (
          <img 
            src={user.profileImage} 
            alt={user.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          user?.name?.charAt(0)?.toUpperCase() || 'U'
        )}
      </div>
      {showRole && (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
          <span className="text-xs">
            {getRoleIcon(user?.role || 'member')}
          </span>
        </div>
      )}
    </div>
  )
}

export default ProfileAvatar
