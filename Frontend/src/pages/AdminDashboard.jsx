import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  BriefcaseIcon, 
  CalendarIcon, 
  ChartBarIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 🔥 Data fetch karne ke liye axios import kiya

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard'); 
  
  // 🔥 Asli Data store karne ke liye naye states
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Dummy Stats (Baad mein isko bhi dynamic karenge)
  const stats = [
    { name: 'Total Students', value: '450', icon: UsersIcon, color: 'bg-blue-500' },
    { name: 'Active Alumni', value: '120', icon: ChartBarIcon, color: 'bg-green-500' },
    { name: 'Jobs Posted', value: '35', icon: BriefcaseIcon, color: 'bg-purple-500' },
    { name: 'Upcoming Events', value: '8', icon: CalendarIcon, color: 'bg-orange-500' },
  ];

  // 🔥 API call function (Database se users laane ke liye)
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get('https://synnex-backend.onrender.com/api/admin/all-users');
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Jab bhi 'users' tab open hoga, tabhi data fetch hoga
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);


  // Ye function decide karega ki main screen par kya dikhana hai
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
          </>
        );

      // 🔥 NAYA: Asli Users ki Table
      case 'users':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-bold px-4 py-1 rounded-full">
                Total: {users.length}
              </span>
            </div>

            {loadingUsers ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                      <th className="p-4 font-bold">Name</th>
                      <th className="p-4 font-bold">Email</th>
                      <th className="p-4 font-bold">Role</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {users.map((user, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="p-4 font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4 capitalize font-medium">{user.role}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            user.isApproved 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {user.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1 rounded transition hover:bg-red-100">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-4 text-center text-gray-500 py-10">
                          No users found in database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
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