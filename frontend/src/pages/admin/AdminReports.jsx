import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import axios from 'axios'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const AdminReports = () => {
  const [reports, setReports] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30')
  const [reportType, setReportType] = useState('overview')

  useEffect(() => {
    fetchReports()
  }, [dateRange, reportType])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/admin/dashboard')
      setReports(response.data.data)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReportData = () => {
    if (!reports) return null

    const stats = reports.stats
    const recentMembers = reports.recentMembers || []
    const recentBookings = reports.recentBookings || []

    // Calculate additional metrics
    const memberGrowthRate = 12 // This would come from historical data
    const bookingCompletionRate = stats.totalBookings > 0 
      ? Math.round((stats.completedBookings / stats.totalBookings) * 100)
      : 0
    const averageRevenuePerMember = stats.totalMembers > 0 
      ? Math.round(stats.monthlyRevenue / stats.totalMembers)
      : 0

    return {
      overview: {
        totalMembers: stats.totalMembers,
        activeMembers: stats.activeMembers,
        totalTrainers: stats.totalTrainers,
        totalBookings: stats.totalBookings,
        monthlyRevenue: stats.monthlyRevenue,
        memberGrowthRate,
        bookingCompletionRate,
        averageRevenuePerMember
      },
      bookings: {
        pending: stats.pendingBookings,
        confirmed: stats.confirmedBookings,
        completed: stats.completedBookings,
        total: stats.totalBookings
      },
      members: recentMembers,
      recentBookings: recentBookings
    }
  }

  const reportData = generateReportData()

  const handleExportPdf = () => {
    if (!reportData) return
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })

    // Header with logo (simple circle placeholder) and title/date
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 40
    const now = new Date()
    const dateStr = now.toLocaleString()

    // Logo placeholder
    doc.setFillColor(51, 102, 255)
    doc.circle(margin + 20, margin + 20, 18, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.text('FG', margin + 12, margin + 25)

    // Title and date
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(18)
    doc.text('FitGym - Reports & Analytics', margin + 55, margin + 15)
    doc.setFontSize(10)
    doc.text(`Generated: ${dateStr}`, margin + 55, margin + 32)

    let cursorY = margin + 60

    // Overview table
    const overviewRows = [
      ['Total Members', String(reportData.overview.totalMembers || 0)],
      ['Active Members', String(reportData.overview.activeMembers || 0)],
      ['Total Trainers', String(reportData.overview.totalTrainers || 0)],
      ['Total Bookings', String(reportData.overview.totalBookings || 0)],
      ['Monthly Revenue', `$${reportData.overview.monthlyRevenue || 0}`],
      ['Member Growth Rate', `${reportData.overview.memberGrowthRate || 0}%`],
      ['Booking Completion', `${reportData.overview.bookingCompletionRate || 0}%`],
      ['Avg Revenue / Member', `$${reportData.overview.averageRevenuePerMember || 0}`]
    ]

    doc.setFontSize(14)
    doc.text('Overview', margin, cursorY)
    cursorY += 10
    doc.autoTable({
      startY: cursorY + 10,
      head: [['Metric', 'Value']],
      body: overviewRows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [51, 102, 255] }
    })
    cursorY = doc.lastAutoTable.finalY + 20

    // Recent Members table (first 10)
    const members = (reportData.members || []).slice(0, 10)
    if (members.length) {
      doc.setFontSize(14)
      doc.text('Recent Members', margin, cursorY)
      doc.autoTable({
        startY: cursorY + 10,
        head: [['Name', 'Email', 'Status']],
        body: members.map(m => [m.name, m.email, m.isActive ? 'Active' : 'Inactive']),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [51, 102, 255] }
      })
      cursorY = doc.lastAutoTable.finalY + 20
    }

    // Recent Bookings table (first 10)
    const bookings = (reportData.recentBookings || []).slice(0, 10)
    if (bookings.length) {
      doc.setFontSize(14)
      doc.text('Recent Bookings', margin, cursorY)
      doc.autoTable({
        startY: cursorY + 10,
        head: [['Member', 'Trainer', 'Date', 'Time', 'Status']],
        body: bookings.map(b => [
          b.memberId?.name || '-',
          b.trainerId?.name || '-',
          new Date(b.date).toLocaleDateString(),
          b.time,
          b.status
        ]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [51, 102, 255] }
      })
      cursorY = doc.lastAutoTable.finalY + 20
    }

    doc.save(`fitgym-report-${now.toISOString().slice(0,10)}.pdf`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Reports & Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Comprehensive insights into your gym's performance
              </p>
            </div>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <Button onClick={handleExportPdf}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Report Type Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'members', label: 'Members', icon: Users },
              { id: 'bookings', label: 'Bookings', icon: Calendar },
              { id: 'revenue', label: 'Revenue', icon: DollarSign }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setReportType(id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  reportType === id
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Overview Report */}
          {reportType === 'overview' && (
            <>
              {/* Key Metrics */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Members</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {reportData?.overview?.totalMembers || 0}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Members</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {reportData?.overview?.activeMembers || 0}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Trainers</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {reportData?.overview?.totalTrainers || 0}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mr-4">
                      <DollarSign className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${reportData?.overview?.monthlyRevenue || 0}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Performance Metrics */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Member Growth
                  </h3>
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-600">
                        +{reportData?.overview?.memberGrowthRate || 0}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Growth rate this month
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Booking Completion
                  </h3>
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                      <CheckCircle className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-blue-600">
                        {reportData?.overview?.bookingCompletionRate || 0}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Completion rate
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Avg Revenue/Member
                  </h3>
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4">
                      <DollarSign className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-purple-600">
                        ${reportData?.overview?.averageRevenuePerMember || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Per member
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </>
          )}

          {/* Bookings Report */}
          {reportType === 'bookings' && (
            <motion.div variants={itemVariants}>
              <Card>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Booking Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportData?.bookings?.pending || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportData?.bookings?.confirmed || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Confirmed</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportData?.bookings?.completed || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {reportData?.bookings?.total || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Members Report */}
          {reportType === 'members' && (
            <motion.div variants={itemVariants}>
              <Card>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Member Analytics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Member Status Distribution
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Active Members</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ 
                                width: `${reportData?.overview?.totalMembers > 0 
                                  ? (reportData.overview.activeMembers / reportData.overview.totalMembers) * 100 
                                  : 0}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {reportData?.overview?.activeMembers || 0}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Inactive Members</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                            <div 
                              className="bg-red-500 h-2 rounded-full" 
                              style={{ 
                                width: `${reportData?.overview?.totalMembers > 0 
                                  ? ((reportData.overview.totalMembers - reportData.overview.activeMembers) / reportData.overview.totalMembers) * 100 
                                  : 0}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {(reportData?.overview?.totalMembers || 0) - (reportData?.overview?.activeMembers || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Recent Members
                    </h4>
                    <div className="space-y-3">
                      {reportData?.members?.slice(0, 5).map((member, index) => (
                        <div key={member._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3">
                              <Users className="w-4 h-4 text-primary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white text-sm">
                                {member.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {member.email}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            member.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {member.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Revenue Report */}
          {reportType === 'revenue' && (
            <motion.div variants={itemVariants}>
              <Card>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Revenue Analytics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <DollarSign className="w-8 h-8 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${reportData?.overview?.monthlyRevenue || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${reportData?.overview?.averageRevenuePerMember || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg per Member</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      +18%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminReports
