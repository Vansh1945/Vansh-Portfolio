import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import {
  Award,
  Wrench,
  UserCheck,
  MessageSquare,
  Star,
  Home,
  ShieldAlert,
  Server
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const adminUsername = localStorage.getItem('adminUsername') || 'vansh';

  const [stats, setStats] = useState({
    certificates: 0,
    services: 0,
    unreadContacts: 0,
    pendingTestimonials: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get(`${API_URL}dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.data && res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8">

      {/* Top welcome banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Welcome Back, {adminUsername}!</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">Here is a quick overview of your portfolio metrics and systems.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-lg transition-all"
          >
            <Home className="w-4 h-4" />
            Go to Website
          </Link>
        </div>
      </div>

      {/* Stats Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Certificates Added', count: stats.certificates, icon: Award, color: 'text-amber-600 bg-amber-500/10 border-amber-500/20', path: '/admin/certificates' },
          { label: 'Active Services', count: stats.services, icon: Wrench, color: 'text-purple-600 bg-purple-500/10 border-purple-500/20', path: '/admin/services' },
          { label: 'Unread Inquiries', count: stats.unreadContacts, icon: MessageSquare, color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20', path: '/admin/messages' },
          { label: 'Pending Reviews', count: stats.pendingTestimonials, icon: Star, color: 'text-rose-600 bg-rose-500/10 border-rose-500/20', path: '/admin/testimonials' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              onClick={() => navigate(stat.path)}
              className="bg-white border border-gray-200/60 hover:border-blue-500/30 rounded-2xl p-6 shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                <span className="text-2xl font-black text-gray-900 mt-2 block">{stat.count}</span>
              </div>
              <div className={`p-3.5 rounded-xl border ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Administrative Status & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Connection status board */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-6 md:p-8 shadow-sm space-y-5 lg:col-span-2">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <UserCheck className="w-5 h-5 text-blue-600" />
            Administrative Controls
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            From this control center, you can edit and manage dynamic portfolio layouts, add completed projects, modify details, verify client pricing, and answer inquiries directly.
          </p>

          {/* Status Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-500" />
                <span className="text-xxs font-bold text-gray-500">Security Layer</span>
              </div>
              <span className="text-[8px] font-bold bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-wider">JWT Shield Active</span>
            </div>
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-500" />
                <span className="text-xxs font-bold text-gray-500">Database Status</span>
              </div>
              <span className="text-[8px] font-bold bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Connected</span>
            </div>
          </div>
        </div>

        {/* Quick Nav Tools */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">Quick Shortcuts</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Direct shortcuts to modify and preview projects, services, or website settings.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 w-full">
            <button
              onClick={() => navigate('/admin/projects')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm text-center"
            >
              Manage Portfolio Projects
            </button>
            <button
              onClick={() => navigate('/admin/skills')}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-lg transition-colors text-center"
            >
              Manage Skills
            </button>
            <button
              onClick={() => navigate('/admin/experience')}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-lg transition-colors text-center"
            >
              Manage Experience
            </button>
            <button
              onClick={() => navigate('/admin/settings')}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-lg transition-colors text-center"
            >
              Website Global Settings
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
