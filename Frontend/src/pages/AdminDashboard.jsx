import React, { useState } from 'react';
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
  // 🔥 Yahan humne state add kiya tab switch karne ke liye
  const [activeTab, setActiveTab] = useState('dashboard'); 
  
  // Dummy Stats
  const stats = [
    { name: 'Total Students', value: '450', icon: UsersIcon, color: 'bg-blue-500' },
    { name: 'Active Alumni', value: '120', icon: ChartBarIcon, color: 'bg-green-500' },
    { name: 'Jobs Posted', value: '35', icon: BriefcaseIcon, color: 'bg-purple-500' },
    { name: 'Upcoming Events', value: '8', icon: CalendarIcon, color: 'bg-orange-500' },
  ];

  // 🔥 Ye function decide karega ki main screen par kya dikhana hai
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-500/10 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Recent Pending Approvals</h3>
                <button className="text-sm text-black font-bold hover:underline">View All</button>
              </div>
              <div className="p-6">
                <p className="text-gray-500">Approvals table data will load here...</p>
              </div>
            </div>
          </>
        );
      case 'users':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
            <p className="text-gray-500">Yahan hum saare students, alumni aur teachers ki list dikhayenge aur unhe delete/edit karne ka option denge.</p>
          </div>
        );
      case 'jobs':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
            <h2 className="text-2xl font-bold mb-4">Job Approvals</h2>
            <p className="text-gray-500">Yahan tu jobs ko approve ya reject kar payega jo alumni post karte hain.</p>
          </div>
        );
      case 'events':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
            <h2 className="text-2xl font-bold mb-4">Event Manager</h2>
            <p className="text-gray-500">Yahan se tu naye events create kar sakta hai aur purane events manage kar sakta hai.</p>
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-black text-white flex flex-col shadow-xl">
        <div className="p-6 text-2xl font-bold border-b border-gray-800 tracking-wider">
          SYNNEX <span className="text-sm font-light block">Admin Panel</span>
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <ChartBarIcon className="h-5 w-5 mr-3" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'users' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <UsersIcon className="h-5 w-5 mr-3" /> Manage Users
          </button>
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'jobs' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <BriefcaseIcon className="h-5 w-5 mr-3" /> Job Approvals
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'events' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
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
          <h1 className="text-xl font-semibold text-gray-800">
            {activeTab === 'dashboard' && 'Welcome back, Admin'}
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'jobs' && 'Job Board Control'}
            {activeTab === 'events' && 'Event Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Admin Mode</span>
            <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-white font-bold">A</div>
          </div>
        </header>

        {/* DYNAMIC CONTENT */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;