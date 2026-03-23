import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, BriefcaseIcon, CalendarIcon, ChartBarIcon, ArrowRightOnRectangleIcon,
  DocumentTextIcon, ChatBubbleLeftEllipsisIcon 
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  const [news, setNews] = useState([]); 
  const [feedbacks, setFeedbacks] = useState([]); 
  const [loading, setLoading] = useState(false);

  // Modals States
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  
  // ATTENDEES MODAL STATE
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [attendeesList, setAttendeesList] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '', description: '' });
  const [newNotice, setNewNotice] = useState({ title: '', content: '', type: 'Notice' });

  useEffect(() => {
    if (!loggedIn || userRole !== 'admin') {
      navigate('/login'); 
    }
  }, [loggedIn, userRole, navigate]);

  // APIs Functions
  const fetchUsers = async () => { try { const res = await axios.get('https://synnex-backend.onrender.com/api/admin/all-users', { withCredentials: true }); setUsers(res.data); } catch (err) {} };
  const fetchJobs = async () => { try { const res = await axios.get('https://synnex-backend.onrender.com/api/admin/all-jobs', { withCredentials: true }); setJobs(res.data); } catch (err) {} };
  const fetchEvents = async () => { try { const res = await axios.get('https://synnex-backend.onrender.com/api/admin/all-events', { withCredentials: true }); setEvents(res.data); } catch (err) {} };
  const fetchNews = async () => { try { const res = await axios.get('https://synnex-backend.onrender.com/api/admin/all-news', { withCredentials: true }); setNews(res.data); } catch (err) {} };
  const fetchFeedbacks = async () => { try { const res = await axios.get('https://synnex-backend.onrender.com/api/admin/all-feedback', { withCredentials: true }); setFeedbacks(res.data); } catch (err) {} };

  useEffect(() => {
    if (userRole === 'admin') {
      setLoading(true);
      Promise.all([fetchUsers(), fetchJobs(), fetchEvents(), fetchNews(), fetchFeedbacks()]).finally(() => setLoading(false));
    }
  }, [userRole]);

  // Handlers
  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Warning: Delete ${userName}? This cannot be undone.`)) {
      try {
        await axios.delete(`https://synnex-backend.onrender.com/api/admin/user/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
      } catch (error) { alert("Failed to delete user."); }
    }
  };

  const handleResetPassword = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to reset the password for ${userName}? It will be changed to 'synnex123'.`)) {
      try {
        await axios.put(`https://synnex-backend.onrender.com/api/admin/reset-password/${userId}`, {}, { withCredentials: true });
        alert(`Success! Password for ${userName} is now 'synnex123'.`);
      } catch (error) { alert("Failed to reset password."); }
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

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if(window.confirm(`Delete event: ${eventTitle}?`)) {
      try {
        await axios.delete(`https://synnex-backend.onrender.com/api/admin/event/${eventId}`, { withCredentials: true });
        setEvents(events.filter(e => e._id !== eventId));
      } catch(error) { alert("Failed to delete event."); }
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://synnex-backend.onrender.com/api/admin/event', newEvent, { withCredentials: true });
      setEvents([...events, res.data]); 
      setShowEventModal(false); 
      setNewEvent({ title: '', date: '', location: '', description: '' }); 
      alert("Event Created Successfully!");
    } catch (error) { alert("Failed to create event."); }
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://synnex-backend.onrender.com/api/admin/news', newNotice, { withCredentials: true });
      setNews([res.data, ...news]);
      setShowNewsModal(false);
      setNewNotice({ title: '', content: '', type: 'Notice' });
      alert("Notice Published!");
    } catch (err) { alert("Failed to publish notice."); }
  };

  const handleDeleteNews = async (id) => {
    if (window.confirm("Delete this notice?")) {
      try {
        await axios.delete(`https://synnex-backend.onrender.com/api/admin/news/${id}`, { withCredentials: true });
        setNews(news.filter(n => n._id !== id));
      } catch (err) { alert("Error deleting notice."); }
    }
  };

  const viewAttendees = async (eventId) => {
    setShowAttendeesModal(true);
    setLoadingAttendees(true);
    try {
      const res = await axios.get(`https://synnex-backend.onrender.com/api/admin/event-attendees/${eventId}`, { withCredentials: true });
      setAttendeesList(res.data);
    } catch (error) {
      alert("Could not fetch attendees list.");
    } finally {
      setLoadingAttendees(false);
    }
  };

  const renderContent = () => {
    if (loading) return <div className="p-10 text-center font-bold">Loading Admin Data...</div>;

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100"><p className="text-gray-500 text-sm">Total Users</p><h3 className="text-3xl font-bold">{users.length}</h3></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100"><p className="text-gray-500 text-sm">Jobs Listed</p><h3 className="text-3xl font-bold">{jobs.length}</h3></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100"><p className="text-gray-500 text-sm">Active Events</p><h3 className="text-3xl font-bold">{events.length}</h3></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100"><p className="text-gray-500 text-sm">Feedback Received</p><h3 className="text-3xl font-bold">{feedbacks.length}</h3></div>
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
                <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200"><th className="p-4 font-bold">Name</th><th className="p-4 font-bold">Email</th><th className="p-4 font-bold">Role</th><th className="p-4 font-bold text-center">Action</th></tr></thead>
                <tbody className="text-gray-700">
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-gray-900">{user.firstName} {user.lastName}</td><td className="p-4">{user.email}</td><td className="p-4 capitalize font-medium">{user.role}</td>
                      <td className="p-4 text-center space-x-2">
                        <button onClick={() => handleResetPassword(user._id, user.firstName)} className="text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 px-3 py-1 rounded transition hover:bg-blue-100">Reset Pass</button>
                        <button onClick={() => handleDeleteUser(user._id, user.firstName)} className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1 rounded transition hover:bg-red-100">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'news':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">News & Notices</h2>
              <button onClick={() => setShowNewsModal(true)} className="bg-black text-white px-4 py-2 rounded-lg">+ Add Notice</button>
            </div>
            <div className="space-y-4">
              {news.map(n => (
                <div key={n._id} className="border p-4 rounded-lg flex justify-between">
                  <div><span className="text-xs font-bold uppercase bg-blue-100 px-2 py-1 rounded text-blue-700">{n.type}</span><h3 className="font-bold mt-2">{n.title}</h3><p className="text-gray-600 text-sm">{n.content}</p></div>
                  <button onClick={() => handleDeleteNews(n._id)} className="text-red-500 font-bold">Delete</button>
                </div>
              ))}
            </div>
            {showNewsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Post New Notice</h2>
                        <form onSubmit={handleCreateNews} className="space-y-4">
                            <input type="text" placeholder="Title" required className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black" value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} />
                            <select className="w-full border p-3 rounded-lg outline-none" value={newNotice.type} onChange={e => setNewNotice({...newNotice, type: e.target.value})}><option value="Notice">Notice</option><option value="News">News</option><option value="Update">Update</option></select>
                            <textarea placeholder="Content..." required className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black" rows="4" value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})}></textarea>
                            <div className="flex justify-end space-x-2 pt-4"><button type="button" onClick={() => setShowNewsModal(false)} className="px-4 py-2 font-bold text-gray-500">Cancel</button><button type="submit" className="bg-black text-white px-6 py-2 rounded-lg font-bold">Publish Now</button></div>
                        </form>
                    </div>
                </div>
            )}
          </div>
        );

      case 'feedback':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6">User Feedback Dashboard</h2>
            <div className="space-y-4">
              {feedbacks.length === 0 ? <p className="text-gray-400 text-center py-10">No feedback received yet.</p> : feedbacks.map(f => (
                <div key={f._id} className="border-b pb-4 last:border-0"><p className="font-bold text-gray-800">{f.userId?.firstName || 'User'} {f.userId?.lastName || ''}:</p><p className="text-gray-600 italic">"{f.message}"</p><p className="text-xs text-gray-400 mt-1">{new Date(f.createdAt).toLocaleString()}</p></div>
              ))}
            </div>
          </div>
        );

      case 'jobs':
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
            <h2 className="text-2xl font-bold mb-6">Job Board Control</h2>
            {jobs.length === 0 ? ( <p className="text-gray-500 p-4 text-center border-2 border-dashed border-gray-200 rounded-lg">No jobs posted yet.</p> ) : (
                <div className="space-y-4">
                    {jobs.map(job => (
                        <div key={job._id} className="border border-gray-200 p-4 rounded-lg flex justify-between items-center hover:bg-gray-50 transition">
                            <div><h3 className="font-bold text-lg text-gray-900">{job.title || "Job Title"}</h3><p className="text-sm text-gray-600">{job.company || "Company"} • {job.location || "Location"}</p></div>
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
                <p className="text-gray-500 p-4 text-center border-2 border-dashed border-gray-200 rounded-lg">No events found.</p>
            ) : (
                 <div className="space-y-4">
                     {events.map(event => (
                         <div key={event._id} className="border border-gray-200 p-4 rounded-lg flex justify-between items-center hover:bg-gray-50">
                             <div>
                               <h3 className="font-bold text-lg text-black">{event.title}</h3>
                               <p className="text-sm text-gray-600 font-medium">{new Date(event.date).toDateString()} • {event.location}</p>
                             </div>
                             
                             <div className="flex items-center space-x-3">
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold border border-green-200">Upcoming</span>
                                
                                <button 
                                  onClick={() => viewAttendees(event._id)} 
                                  className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded font-bold text-sm transition"
                                >
                                  👥 View ({event.attendees ? event.attendees.length : 0})
                                </button>
                                
                                <button 
                                  onClick={() => handleDeleteEvent(event._id, event.title)} 
                                  className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded font-bold text-sm transition"
                                >
                                  Delete
                                </button>
                             </div>
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
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Event Title</label><input type="text" required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black outline-none transition" /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Date</label><input type="date" required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black outline-none transition" /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Location / Venue</label><input type="text" required value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black outline-none transition" /></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Description</label><textarea required value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:border-black outline-none transition" rows="3"></textarea></div>
                    <div className="flex justify-end space-x-3 mt-8"><button type="button" onClick={() => setShowEventModal(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-bold transition">Cancel</button><button type="submit" className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg font-bold shadow-lg transition">Publish Event</button></div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );

      default: return <div className="p-10 text-center">Section under maintenance.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <div className="w-64 bg-black text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 text-2xl font-bold border-b border-gray-800 tracking-wider">
          SYNNEX <span className="text-sm font-light block text-gray-400">Admin Panel</span>
        </div>
        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><ChartBarIcon className="h-5 w-5 mr-3"/>Dashboard</button>
          <button onClick={() => setActiveTab('users')} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'users' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><UsersIcon className="h-5 w-5 mr-3"/>Manage Users</button>
          <button onClick={() => setActiveTab('jobs')} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'jobs' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><BriefcaseIcon className="h-5 w-5 mr-3"/>Job Approvals</button>
          <button onClick={() => setActiveTab('events')} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'events' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><CalendarIcon className="h-5 w-5 mr-3"/>Event Manager</button>
          <button onClick={() => setActiveTab('news')} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'news' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><DocumentTextIcon className="h-5 w-5 mr-3"/>News & Notices</button>
          <button onClick={() => setActiveTab('feedback')} className={`flex items-center w-full p-3 rounded-lg transition ${activeTab === 'feedback' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}><ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-3"/>User Feedback</button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={() => navigate('/login')} className="flex items-center w-full p-3 text-red-400 hover:bg-gray-800 rounded-lg transition font-medium"><ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" /> Logout</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center px-8 z-0">
            <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">{activeTab.replace('-', ' ')}</h1>
            <div className="flex items-center space-x-3">
                <span className="font-bold text-gray-600">Admin Mode</span>
                <div className="w-10 h-10 bg-black rounded-full text-white flex justify-center items-center shadow-lg font-bold">A</div>
            </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
            {renderContent()}
        </main>
      </div>

      {/* 🔥 FIX: YAHAN CLOSE BUTTON EKDUM PERFECTLY ALIGN KIYA HAI */}
      {showAttendeesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            
            {/* Header with Perfect Flex Justify-Between */}
            <div className="flex justify-between items-center p-5 border-b bg-gray-50 w-full">
              <h3 className="text-lg font-bold text-gray-900">👥 Registered Attendees</h3>
              <button 
                onClick={() => setShowAttendeesModal(false)} 
                className="text-gray-500 hover:text-red-600 text-3xl font-bold leading-none focus:outline-none transition"
              >
                &times;
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
                {loadingAttendees ? (
                    <div className="flex justify-center py-8"><p className="text-gray-500 font-medium animate-pulse">Loading data...</p></div>
                ) : attendeesList.length === 0 ? (
                    <div className="text-center py-8"><p className="text-gray-400">No one has registered yet.</p></div>
                ) : (
                    <ul className="space-y-3">
                        {attendeesList.map((user, idx) => (
                            <li key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                                <div>
                                  <p className="font-bold text-gray-800">{user.firstName} {user.lastName}</p>
                                  <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded font-bold capitalize ${user.role === 'student' ? 'bg-blue-100 text-blue-700' : user.role === 'alumni' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                  {user.role || 'User'}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            <div className="p-4 border-t bg-gray-50 w-full">
               <button onClick={() => setShowAttendeesModal(false)} className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 font-bold transition">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;