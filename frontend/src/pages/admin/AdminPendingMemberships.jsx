import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const AdminPendingMemberships = () => {
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState([])

  useEffect(() => {
    fetchPending()
  }, [])

  const fetchPending = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/admin/users', { params: { role: 'member' } })
      const allMembers = res.data.data.users || []
      setMembers(allMembers.filter(m => m.membershipStatus === 'pending'))
    } catch (e) {
      console.error('Failed to load pending memberships', e)
      toast.error('Failed to load pending memberships')
    } finally {
      setLoading(false)
    }
  }

  const approve = async (userId) => {
    try {
      await axios.put(`/api/admin/memberships/${userId}/approve`)
      toast.success('Membership approved')
      fetchPending()
    } catch (e) {
      console.error('Approve failed', e)
      toast.error(e.response?.data?.message || 'Approve failed')
    }
  }

  const reject = async (userId) => {
    try {
      await axios.put(`/api/admin/memberships/${userId}/reject`, { reason: 'Not paid' })
      toast.success('Membership rejected')
      fetchPending()
    } catch (e) {
      console.error('Reject failed', e)
      toast.error(e.response?.data?.message || 'Reject failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pending Memberships</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Review and confirm cash payments</p>
        </motion.div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4">Member</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Selected Plan</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m._id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{m.name}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{m.email}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {m.pendingMembershipPlan?.name || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => approve(m._id)}>Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => reject(m._id)}>Reject</Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td className="py-6 px-4 text-center text-gray-600 dark:text-gray-400" colSpan={4}>
                      No pending memberships
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminPendingMemberships


