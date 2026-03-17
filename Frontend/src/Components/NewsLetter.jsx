import React, { useState } from "react";
import { getLoggedIn, getUserData } from "../services/authService";
import { Link } from "react-router-dom";
import NotLoggedIn from "./helper/NotLoggedIn";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NewsAndNotices() {
  const loggedIn = getLoggedIn();
  const userData = getUserData() || {};
  const userRole = (userData.role || '').toLowerCase();
  
  // YAHAN HAI LOGIC: Sirf in 3 roles ko post karne ki permission hai
  const canPostNews = userRole === 'admin' || userRole === 'teacher' || userRole === 'college';
  
  const [showForm, setShowForm] = useState(false);

  // Dummy News Data
  const [newsList, setNewsList] = useState([
    {
      id: 1,
      title: "Campus Drive by TechNova Next Week",
      date: "March 15, 2026",
      author: "Placement Cell",
      content: "All 4th-year students (CSE, IT) are informed that TechNova Solutions will be visiting our campus for a recruitment drive. Please carry 3 copies of your CV.",
      type: "Important"
    },
    {
      id: 2,
      title: "Semester Exams Postponed",
      date: "March 12, 2026",
      author: "Examination Dept",
      content: "Due to unforeseen circumstances, the mid-semester exams scheduled for next Monday have been postponed by two days. New timetable is attached on the notice board.",
      type: "Notice"
    }
  ]);

  const handlePostNews = (e) => {
    e.preventDefault();
    toast.success("Notice published successfully! 📢");
    setShowForm(false);
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
            
            {/* CONDITIONAL BUTTON: Sirf Admin/Teacher ko dikhega */}
            {canPostNews && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="mt-4 sm:mt-0 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition shadow-md font-medium"
              >
                {showForm ? "Cancel Posting" : "+ Post Notice"}
              </button>
            )}
          </div>

          {/* Post News Form (Admin/Teacher only) */}
          {canPostNews && showForm && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 animate-fade-in">
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Publish an Announcement</h2>
              <form onSubmit={handlePostNews} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" required placeholder="Notice Title" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black" />
                  <select required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black bg-white">
                    <option value="">Select Category</option>
                    <option value="Important">Important Alert</option>
                    <option value="Notice">General Notice</option>
                    <option value="Event">Event Update</option>
                  </select>
                </div>
                <textarea required placeholder="Write your full announcement here..." rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"></textarea>
                
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
            {newsList.map((news) => (
              <div key={news.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-300">
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${news.type === 'Important' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                    {news.type}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">{news.date}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{news.title}</h3>
                <p className="text-sm font-semibold text-gray-600 mb-4">By: {news.author}</p>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                  {news.content}
                </p>
              </div>
            ))}
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