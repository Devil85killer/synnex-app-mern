import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  BriefcaseIcon, 
  CalendarIcon, 
  ChartBarIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  
  // Dummy Stats (Baad mein API se fetch karenge)
  const stats = [
    { name: 'Total Students', value: '450', icon: UsersIcon, color: 'bg-blue-500' },
    { name: 'Active Alumni', value: '120', icon: ChartBarIcon, color: 'bg-green-500' },
    { name: 'Jobs Posted', value: '35', icon: BriefcaseIcon, color: 'bg-purple-500' },
    { name: 'Upcoming Events', value: '8', icon: CalendarIcon, color: 'bg-orange-500' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-black text-white flex flex-col shadow-xl">
        <div className="p-6 text-2xl font-bold border-b border-gray-800 tracking-wider">
          SYNNEX <span className="text-sm font-light block">Admin Panel</span>
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-2">
          <button className="flex items-center w-full p-3 bg-gray-900 rounded-lg text-white">
            <ChartBarIcon className="h-5 w-5 mr-3" /> Dashboard
          </button>
          <button className="flex items-center w-full p-3 hover:bg-gray-800 rounded-lg transition">
            <UsersIcon className="h-5 w-5 mr-3" /> Manage Users
          </button>
          <button className="flex items-center w-full p-3 hover:bg-gray-800 rounded-lg transition">
            <BriefcaseIcon className="h-5 w-5 mr-3" /> Job Approvals
          </button>
          <button className="flex items-center w-full p-3 hover:bg-gray-800 rounded-lg transition">
            <CalendarIcon className="h-5 w-5 mr-3" /> Event Manager
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center w-full p-3 text-red-400 hover:bg-gray-800 rounded-lg transition"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP BAR */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center px-8">
          <h1 className="text-xl font-semibold text-gray-800">Welcome back, Admin</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">March 18, 2026</span>
            <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-white font-bold">A</div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
          
          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((item) => (
              <div key={item.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div className={`${item.color} p-3 rounded-lg mr-4`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{item.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* DUMMY PROJECT TABLE (Like Project Management System) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-500/10 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Recent Pending Approvals</h3>
              <button className="text-sm text-black font-bold hover:underline">View All</button>
            </div>
            <div className="p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-sm uppercase tracking-wider">
                    <th className="pb-4 font-medium">Name</th>
                    <th className="pb-4 font-medium">Role</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                    <td className="py-4 font-medium text-gray-900">Rahul Sharma</td>
                    <td className="py-4">Alumni</td>
                    <td className="py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Pending</span></td>
                    <td className="py-4 font-bold text-black cursor-pointer">Review</td>
                  </tr>
                  <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">
                    <td className="py-4 font-medium text-gray-900">Priya Das</td>
                    <td className="py-4">Student</td>
                    <td className="py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Approved</span></td>
                    <td className="py-4 font-bold text-black cursor-pointer">Review</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;