import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Public pages
import Home from './pages/Home'
import About from './pages/About'
import MembershipPlans from './pages/MembershipPlans'
import Trainers from './pages/Trainers'
import Contact from './pages/Contact'
import Services from './pages/Services'
import PersonalTraining from './pages/Services/PersonalTraining'
import GroupClasses from './pages/Services/GroupClasses'
import NutritionPlans from './pages/Services/NutritionPlans'
import FitnessAssessment from './pages/Services/FitnessAssessment'
import Support from './pages/Support'
import HelpCenter from './pages/HelpCenter'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Faq from './pages/Faq'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Protected pages
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Workouts from './pages/Workouts'
import Nutrition from './pages/Nutrition'
import Bookings from './pages/Bookings'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminPlans from './pages/admin/AdminPlans'
import AdminBookings from './pages/admin/AdminBookings'
import AdminReviews from './pages/admin/AdminReviews'
import AdminReports from './pages/admin/AdminReports'
import AdminPendingMemberships from './pages/admin/AdminPendingMemberships'

// Trainer pages
import TrainerDashboard from './pages/trainer/TrainerDashboard'
import TrainerWorkouts from './pages/trainer/TrainerWorkouts'
import TrainerNutrition from './pages/trainer/TrainerNutrition'
import TrainerBookings from './pages/trainer/TrainerBookings'

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to role-specific dashboard
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    } else if (user.role === 'trainer') {
      return <Navigate to="/trainer/dashboard" replace />
    } else {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}

// Public Route component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (isAuthenticated) {
    // Redirect to role-specific dashboard
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    } else if (user.role === 'trainer') {
      return <Navigate to="/trainer/dashboard" replace />
    } else {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}

// Active membership guard for member-only features
const ActiveMembershipRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  // Only restrict members; trainers/admins can access their sections
  if (user?.role === 'member') {
    const isActive = user?.membershipStatus === 'active'
    if (!isActive) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}

function App() {
  const { loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/plans" element={<MembershipPlans />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/personal-training" element={<PersonalTraining />} />
          <Route path="/services/group-classes" element={<GroupClasses />} />
          <Route path="/services/nutrition" element={<NutritionPlans />} />
          <Route path="/services/assessment" element={<FitnessAssessment />} />
          <Route path="/support" element={<Support />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/faq" element={<Faq />} />
          
          {/* Auth routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />

          {/* Member routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/workouts" 
            element={
              <ProtectedRoute>
                <ActiveMembershipRoute>
                  <Workouts />
                </ActiveMembershipRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/nutrition" 
            element={
              <ProtectedRoute>
                <ActiveMembershipRoute>
                  <Nutrition />
                </ActiveMembershipRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute>
                <ActiveMembershipRoute>
                  <Bookings />
                </ActiveMembershipRoute>
              </ProtectedRoute>
            } 
          />

          {/* Trainer routes */}
          <Route 
            path="/trainer/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['trainer', 'admin']}>
                <TrainerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trainer/workouts" 
            element={
              <ProtectedRoute allowedRoles={['trainer', 'admin']}>
                <TrainerWorkouts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trainer/nutrition" 
            element={
              <ProtectedRoute allowedRoles={['trainer', 'admin']}>
                <TrainerNutrition />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trainer/bookings" 
            element={
              <ProtectedRoute allowedRoles={['trainer', 'admin']}>
                <TrainerBookings />
              </ProtectedRoute>
            } 
          />

          {/* Admin routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/plans" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPlans />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/bookings" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminBookings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reviews" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReviews />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/memberships/pending" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPendingMemberships />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReports />
              </ProtectedRoute>
            } 
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
