import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  BriefcaseIcon, 
  CalendarIcon, 
  ChartBarIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard'); 
  
  // 🔥 Saare Data States
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Database se saara data laane ke functions
  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://synnex-backend.onrender.com/api/admin/all-users');
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get('https://synnex-backend.onrender.com/api/admin/all-jobs');
      setJobs(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get('https://synnex-backend.onrender.com/api/admin/all-events');
      setEvents(res.data);
    } catch (err) { console.error(err); }
  };

  // Jab bhi tab change ho ya page load ho, data mangwa lo
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchUsers(), fetchJobs(), fetchEvents()]).finally(() => {
      setLoading(false);
    });
  }, []);

  // 🔥 ACTION: USER DELETE FUNCTION
  const handleDeleteUser = async (userId, userName) => {
    const isConfirmed = window.confirm(`Warning: Are you sure you want to delete ${userName}? This cannot be undone.`);
    if (isConfirmed) {
      try {
        await axios.delete(`https://synnex-backend.onrender.com/api/admin/user/${userId}`);
        setUsers(users.filter(user => user._id !== userId)); // UI update bina refresh ke
        alert("User successfully deleted.");
      } catch (error) {
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  // 🔥 ACTION: JOB DELETE FUNCTION
  const handleDeleteJob = async (jobId, jobTitle) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete the job: ${jobTitle}?`);
    if(isConfirmed) {
      try {
        await axios.put(`https://synnex-backend.onrender.com/api/admin/job/${jobId}/delete`);
        setJobs(jobs.filter(job => job._id !== jobId)); // UI update
      } catch(error) {
        alert("Failed to delete job.");
      }
    }
  };

  // 🔥 Dynamic Stats (Sach mein DB ke hisaab se)
  const stats = [
    { name: 'Total Students', value: users.filter(u => u.role === 'student').length || 0, icon: UsersIcon, color: 'bg-blue-500' },
    { name: 'Active Alumni', value: users.filter(u => u.role === 'alumni').length || 0, icon: ChartBarIcon, color: 'bg-green-500' },
    { name: 'Jobs Posted', value: jobs.length || 0, icon: BriefcaseIcon, color: 'bg-purple-500' },
    { name: 'Upcoming Events', value: events.length || 0, icon: CalendarIcon, color: 'bg-orange-500' },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      );
    }

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
            {/* Recent Users preview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-500/10 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Recently Joined</h3>
                <button onClick={() => setActiveTab('users')} className="text-sm text-black font-bold hover:underline">View All</button>
              </div>
              <div className="p-6">
                 {users.slice(0, 3).map(u => (
                     <div key={u._id} className="flex justify-between items-center mb-3 border-b pb-2 last:border-0">
                         <span className="font-medium">{u.firstName} {u.lastName}</span>
                         <span className="text-sm text-gray-500 capitalize">{u.role}</span>
                     </div>
                 ))}
                 {users.length === 0 && <p className="text-gray-500">No users yet.</p>}
              </div>
            </div>
          </>
        );

      case 'users':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-bold px-4 py-1 rounded-full">
                Total: {users.length}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                    <th className="p-4 font-bold">Name</th>
                    <th className="p-4 font-bold">Email</th>
                    <th className="p-4 font-bold">Role</th>
                    <th className="p-4 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4 capitalize font-medium">{user.role}</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDeleteUser(user._id, user.firstName)}
                          className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1 rounded transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan="4" className="p-4 text-center text-gray-500 py-10">No users found in database.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'jobs':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
            <h2 className="text-2xl font-bold mb-6">Job Board Control</h2>
            {jobs.length === 0 ? (
                <p className="text-gray-500 p-4 text-center">No jobs posted yet.</p>
            ) : (
                <div className="space-y-4">
                    {jobs.map(job => (
                        <div key={job._id} className="border border-gray-200 p-4 rounded-lg flex justify-between items-center hover:bg-gray-50 transition">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{job.title || "Job Title"}</h3>
                                <p className="text-sm text-gray-600">{job.company || "Company"} • {job.location || "Location"}</p>
                            </div>
                            <div>
                                <button 
                                  onClick={()=> handleDeleteJob(job._id, job.title)} 
                                  className="text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded font-bold text-sm transition"
                                >
                                  Delete Job
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>
        );

      case 'events':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Event Manager</h2>
                <button className="bg-black hover:bg-gray-800 transition text-white px-4 py-2 rounded-lg font-bold">
                    + Create Event (Coming Soon)
                </button>
            </div>
             {events.length === 0 ? (
                <p className="text-gray-500 p-4 text-center">No events found in the database.</p>
            ) : (
                 <div className="space-y-4">
                     {events.map(event => (
                         <div key={event._id} className="border border-gray-200 p-4 rounded-lg flex justify-between items-center hover:bg-gray-50">
                             <div>
                               <h3 className="font-bold text-lg">{event.title || "Event Name"}</h3>
                               <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString() || "Date"}</p>
                             </div>
                         </div>
                     ))}
                 </div>
            )}
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