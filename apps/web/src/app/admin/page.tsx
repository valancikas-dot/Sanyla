'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Crown, Users, CreditCard, Database, TrendingUp, Shield } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizations: 0,
    totalProjects: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    aiGenerations: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
    // TODO: Check if user is super_admin
    // if (session?.user && session.user.role !== 'super_admin') {
    //   router.push('/');
    // }
  }, [status, session, router]);

  useEffect(() => {
    // TODO: Fetch admin stats from API
    // For now, mock data
    setStats({
      totalUsers: 147,
      totalOrganizations: 89,
      totalProjects: 234,
      totalRevenue: 12450,
      activeSubscriptions: 67,
      aiGenerations: 1823,
    });
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
          </div>
          <p className="text-purple-100 mt-2">
            Logged in as: <span className="font-semibold">{session?.user?.email}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-sm text-gray-400">Total</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.totalUsers}</h3>
            <p className="text-gray-400">Registered Users</p>
          </div>

          {/* Organizations */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-sm text-gray-400">Total</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.totalOrganizations}</h3>
            <p className="text-gray-400">Organizations</p>
          </div>

          {/* Projects */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-sm text-gray-400">Total</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.totalProjects}</h3>
            <p className="text-gray-400">Active Projects</p>
          </div>

          {/* Revenue */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-sm text-gray-400">MRR</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">€{stats.totalRevenue}</h3>
            <p className="text-gray-400">Monthly Revenue</p>
          </div>

          {/* Active Subscriptions */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-sm text-gray-400">Paid</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.activeSubscriptions}</h3>
            <p className="text-gray-400">Active Subscriptions</p>
          </div>

          {/* AI Generations */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-pink-400" />
              </div>
              <span className="text-sm text-gray-400">This Month</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.aiGenerations}</h3>
            <p className="text-gray-400">AI Generations</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
              View All Users
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
              Manage Subscriptions
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
              View Analytics
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div>
                <p className="text-white font-medium">New user registered</p>
                <p className="text-sm text-gray-400">john@example.com</p>
              </div>
              <span className="text-sm text-gray-400">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Subscription upgraded</p>
                <p className="text-sm text-gray-400">FREE → STARTER</p>
              </div>
              <span className="text-sm text-gray-400">15 minutes ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div>
                <p className="text-white font-medium">AI Image generated</p>
                <p className="text-sm text-gray-400">DALL-E 3 - Project #234</p>
              </div>
              <span className="text-sm text-gray-400">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-6 px-6 mt-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-sm text-gray-400">
            <span>© 2026 Sanyla. AI Marketing Autopilot.</span>
            <span className="hidden md:inline">•</span>
            <span className="text-cyan-400 font-medium">by Vilca</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
