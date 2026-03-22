import React, { useState, useEffect } from "react";
import axios from "axios"; // AXIOS IMPORT KIYA
import { getLoggedIn, getUserRole } from "../services/authService"; // getUserRole use karenge
import { Link } from "react-router-dom";
import NotLoggedIn from "./helper/NotLoggedIn";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NewsAndNotices() {
  const loggedIn = getLoggedIn();
  
  // ROLE CHECK LOGIC FIX KIYA
  const role = getUserRole();
  const userRole = role?.toLowerCase();
  
  // Yahan 'faculty' add kar diya hai taaki unhe bhi button dikhe
  const canPostNews = userRole === 'admin' || userRole === 'teacher' || userRole === 'faculty' || userRole === 'college';
  
  const [showForm, setShowForm] = useState(false);

  // DUMMY DATA GAYA! Live list ke liye state
  const [newsList, setNewsList] = useState([]);

  // New Notice form ke liye state
  const [newNotice, setNewNotice] = useState({
    title: "",
    type: "", // Category ke liye
    content: ""
  });

  // 1. SMART FETCH LOGIC
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Backend URL check kar lena agar route ka naam notices hai toh change kar dena
        let res = await axios.get('https://synnex-backend.onrender.com/api/news/all', {
          withCredentials: true 
        });
        
        if (res.data?.data?.news) {
          setNewsList(res.data.data.news);
        } else if (Array.isArray(res.data)) {
          setNewsList(res.data);
        } else {
          // Fallback admin route
          const adminRes = await axios.get('https://synnex-backend.onrender.com/api/admin/all-news');
          setNewsList(adminRes.data);
        }
      } catch (error) {
        console.error("News fetch error, trying fallback...", error);
        try {
           const adminRes = await axios.get('https://synnex-backend.onrender.com/api/admin/all-news');
           setNewsList(adminRes.data);
        } catch(e) {
           console.error("Fallback also failed.");
        }
      }
    };

    if (loggedIn) {
      fetchNews();
    }
  }, [loggedIn]);

  // 2. CREATE NOTICE KA LIVE API CALL
  const handlePostNews = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://synnex-backend.onrender.com/api/news/create', newNotice, {
        withCredentials: true
      });

      // UI update bina refresh kiye
      if (res.data?.status === 'success') {
        setNewsList([res.data.data.news, ...newsList]); // Naya notice top pe
      } else {
        setNewsList([res.data, ...newsList]);
      }

      toast.success("Notice published successfully! 📢");
      setShowForm(false);
      setNewNotice({ title: "", type: "", content: "" }); // Form reset
    } catch (error) {
      console.error("Error creating notice:", error);
      toast.error("Failed to publish notice.");
    }
  };

  // 3. DELETE NOTICE KA LIVE API CALL (For Admin)
  const handleDelete = async (newsId) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        await axios.delete(`https://synnex-backend.onrender.com/api/news/delete/${newsId}`, { 
          withCredentials: true 
        });
        
        setNewsList(newsList.filter((news) => news._id !== newsId));
        toast.error("Notice Deleted! 🗑️");
      } catch (error) {
        console.error("Error deleting notice:", error);
        toast.error("Failed to delete notice.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 w-full">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {loggedIn ? (
        <div className="max-w-5xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-gray-200 pb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">News & Notices 📢</h1>
              <p className="text-gray-500 mt-1">Stay updated with the latest college announcements.</p>
            </div>
            
            {/* CONDITIONAL BUTTON */}
            {canPostNews && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="mt-4 sm:mt-0 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition shadow-md font-medium"
              >
                {showForm ? "Cancel Posting" : "+ Post Notice"}
              </button>
            )}
          </div>

          {/* Post News Form */}
          {canPostNews && showForm && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 animate-fade-in">
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Publish an Announcement</h2>
              
              <form onSubmit={handlePostNews} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" required value={newNotice.title} onChange={(e) => setNewNotice({...newNotice, title: e.target.value})} placeholder="Notice Title" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black" />
                  
                  <select required value={newNotice.type} onChange={(e) => setNewNotice({...newNotice, type: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black bg-white">
                    <option value="">Select Category</option>
                    <option value="Important">Important Alert</option>
                    <option value="Notice">General Notice</option>
                    <option value="Event">Event Update</option>
                  </select>
                </div>
                
                <textarea required value={newNotice.content} onChange={(e) => setNewNotice({...newNotice, content: e.target.value})} placeholder="Write your full announcement here..." rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"></textarea>
                
                <div className="flex justify-end">
                  <button type="submit" className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-green-700 transition shadow-sm">
                    Publish Now
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* News List */}
          <div className="space-y-6">
            {newsList.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No recent announcements.</p>
            ) : (
              newsList.map((news) => (
                <div key={news._id} className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-300">
                  
                  {/* ADMIN DELETE BUTTON */}
                  {userRole === "admin" && (
                    <button 
                      onClick={() => handleDelete(news._id)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-sm transition"
                      title="Delete Notice (Admin Only)"
                    >
                      Delete
                    </button>
                  )}

                  <div className="flex justify-between items-start mb-3 pr-16">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${news.type === 'Important' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                      {news.type || "Notice"}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">{new Date(news.createdAt || Date.now()).toLocaleDateString() || news.date}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{news.title}</h3>
                  <p className="text-sm font-semibold text-gray-600 mb-4">
                    By: {news.author || news.createdBy?.firstName || "College Admin"}
                  </p>
                  
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100 whitespace-pre-line">
                    {news.content}
                  </p>
                </div>
              ))
            )}
          </div>

        </div>
      ) : (
        <div className="flex h-screen items-center justify-center">
          <NotLoggedIn text="News & Notices" />
        </div>
      )}
    </div>
  );
}

export default NewsAndNotices;