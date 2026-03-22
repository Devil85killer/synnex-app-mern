import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, BriefcaseIcon, CalendarIcon, ChartBarIcon, ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// YAHAN authService IMPORT KIYA HAI SECURITY KE LIYE
import { getLoggedIn, getUserRole } from '../services/authService';

function AdminDashboard() {
  const navigate = useNavigate();
  const loggedIn = getLoggedIn();
  const role = getUserRole();
  const userRole = role?.toLowerCase();

  const [activeTab, setActiveTab] = useState('dashboard'); 
  
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Event Modal States
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '', description: '' });

  // SECURITY CHECK: Is the user an Admin?
  useEffect(() => {
    if (!loggedIn || userRole !== 'admin') {
      alert("Access Denied: Admin privileges required.");
      navigate('/dashboard'); // Kick normal users out
    }
  }, [loggedIn, userRole, navigate]);

  // API Calls
  const fetchUsers = async () => {
    try { const res = await axios.get('https://synnex-backend.onrender.com/api/admin/all-users'); setUsers(res.data); } catch (err) {}
  };
  const fetchJobs = async () => {
    try { const res = await axios.get('https://synnex-backend.onrender.com/api/admin/all-jobs'); setJobs(res.data); } catch (err) {}
  };
  const fetchEvents = async () => {
    try { const res = await axios.get('https://synnex-backend.onrender.com/api/admin/all-events'); setEvents(res.data); } catch (err) {}
  };

  useEffect(() => {
    // Only fetch data if the user is actually an admin
    if (userRole === 'admin') {
      setLoading(true);
      Promise.all([fetchUsers(), fetchJobs(), fetchEvents()]).finally(() => setLoading(false));
    }
  }, [userRole]);

  // Action Handlers
  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Warning: Delete ${userName}? This cannot be undone.`)) {
      try {
        await axios.delete(`https://synnex-backend.onrender.com/api/admin/user/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
      } catch (error) { alert("Failed to delete user."); }
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    if(window.confirm(`Delete job: ${jobTitle}?`)) {
      try {
        await axios.put(`https://synnex-backend.onrender.com/api/admin/job/${jobId}/delete`);
        setJobs(jobs.filter(j => j._id !== jobId));
      } catch(error) { alert("Failed to delete job."); }
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://synnex-backend.onrender.com/api/admin/event', newEvent, {
    withCredentials: true
});
      setEvents([...events, res.data]); 
      setShowEventModal(false); 
      setNewEvent({ title: '', date: '', location: '', description: '' }); 
      alert("Event Created Successfully!");
    } catch (error) { alert("Failed to create event."); }
  };

  const stats = [
    { name: 'Total Students', value: users.filter(u => u.role === 'student').length || 0, icon: UsersIcon, color: 'bg-blue-500' },
    { name: 'Active Alumni', value: users.filter(u => u.role === 'alumni').length || 0, icon: ChartBarIcon, color: 'bg-green-500' },
    { name: 'Jobs Posted', value: jobs.length || 0, icon: BriefcaseIcon, color: 'bg-purple-500' },
    { name: 'Upcoming Events', value: events.length || 0, icon: CalendarIcon, color: 'bg-orange-500' },
  ];

  const renderContent = () => {
    if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div></div>;

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((item) => (
              <div key={item.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                <div className={`${item.color} p-3 rounded-lg mr-4`}><item.icon className="h-6 w-6 text-white" /></div>
                <div><p className="text-sm text-gray-500 font-medium">{item.name}</p><p className="text-2xl font-bold text-gray-900">{item.value}</p></div>
              </div>
            ))}
          </div>
        );

      case 'users':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-bold px-4 py-1 rounded-full">Total: {users.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                    <th className="p-4 font-bold">Name</th><th className="p-4 font-bold">Email</th>
                    <th className="p-4 font-bold">Role</th><th className="p-4 font-bold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-gray-900">{user.firstName} {user.lastName}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4 capitalize font-medium">{user.role}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDeleteUser(user._id, user.firstName)} className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1 rounded transition hover:bg-red-100">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && <tr><td colSpan="4" className="p-4 text-center text-gray-500 py-10">No users found in database.</td></tr>}
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
                <p className="text-gray-500 p-4 text-center border-2 border-dashed border-gray-200 rounded-lg">No jobs posted yet.</p>
            ) : (
                <div className="space-y-4">
                    {jobs.map(job => (
                        <div key={job._id} className="border border-gray-200 p-4 rounded-lg flex justify-between items-center hover:bg-gray-50 transition">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{job.title || "Job Title"}</h3>
                                <p className="text-sm text-gray-600">{job.company || "Company"} • {job.location || "Location"}</p>
                            </div>
                            <button onClick={()=> handleDeleteJob(job._id, job.title)} className="text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded font-bold text-sm transition">Delete Job</button>
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
                <button onClick={() => setShowEventModal(true)} className="bg-black hover:bg-gray-800 transition text-white px-4 py-2 rounded-lg font-bold shadow-lg">+ Create New Event</button>
            </div>
            
             {events.length === 0 ? (
                <p className="text-gray-500 p-4 text-center border-2 border-dashed border-gray-200 rounded-lg">No events found. Click 'Create New Event' to add one.</p>
            ) : (
                 <div className="space-y-4">
                     {events.map(event => (
                         <div key={event._id} className="border border-gray-200 p-4 rounded-lg flex justify-between items-center hover:bg-gray-50">
                             <div>
                               <h3 className="font-bold text-lg text-black">{event.title}</h3>
                               <p className="text-sm text-gray-600 font-medium">{new Date(event.date).toDateString()} • {event.location}</p>
                             </div>
                             <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold border border-green-200">Upcoming</span>
                         </div>
                     ))}
                 </div>
            )}

            {/* EVENT CREATION MODAL */}
            {showEventModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Event</h2>
                  <form onSubmit={handleCreateEvent} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Event Title</label>
                      <input type="text" required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black outline-none transition" placeholder="e.g. Alumni Meet 2026" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                      <input type="date" required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Location / Venue</label>
                      <input type="text" required value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black outline-none transition" placeholder="e.g. Main Auditorium" />
                    </div>
                    {/* ADDED DESCRIPTION FIELD */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                      <textarea required value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black outline-none transition" placeholder="Event details..." rows="3"></textarea>
                    </div>
                    <div className="flex justify-end space-x-3 mt-8">
                      <button type="button" onClick={() => setShowEventModal(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-bold transition">Cancel</button>
                      <button type="submit" className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg font-bold shadow-lg transition">Publish Event</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  // If not logged in or not admin, return null so nothing renders while redirecting
  if (!loggedIn || userRole !== 'admin') {
      return null; 
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-black text-white flex flex-col shadow-xl z-10">
        <div className="p-6 text-2xl font-bold border-b border-gray-800 tracking-wider">
          SYNNEX <span className="text-sm font-light block text-gray-400">Admin Panel</span>
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <ChartBarIcon className="h-5 w-5 mr-3" /> Dashboard
          </button>
          <button onClick={() => setActiveTab('users')} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'users' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <UsersIcon className="h-5 w-5 mr-3" /> Manage Users
          </button>
          <button onClick={() => setActiveTab('jobs')} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'jobs' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <BriefcaseIcon className="h-5 w-5 mr-3" /> Job Approvals
          </button>
          <button onClick={() => setActiveTab('events')} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'events' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <CalendarIcon className="h-5 w-5 mr-3" /> Event Manager
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button onClick={() => navigate('/login')} className="flex items-center w-full p-3 text-red-400 hover:bg-gray-800 rounded-lg transition font-medium">
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center px-8 z-0">
          <h1 className="text-xl font-bold text-gray-800">
            {activeTab === 'dashboard' && 'Welcome back, Admin'}
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'jobs' && 'Job Board Control'}
            {activeTab === 'events' && 'Event Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 font-medium">Admin Mode</span>
            <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center text-white font-bold shadow-md">A</div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;