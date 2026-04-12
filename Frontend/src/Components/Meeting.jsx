import React, { useState, useEffect } from 'react';
import { getLoggedIn, getUserData } from "../services/authService"; 
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'; 

const Meeting = () => { 
  const loggedIn = getLoggedIn();
  const user = getUserData() || {}; 
  
  // 🔥 Admin aur Alumni DONO ko link paste karne ka power milega
  const userRole = user?.role?.toLowerCase();
  const canGenerateLink = userRole === 'alumni' || userRole === 'admin';
  
  const [meetingLink, setMeetingLink] = useState('');
  const [meetingTime, setMeetingTime] = useState(''); // 🔥 NAYA: Time ke liye state
  const [loading, setLoading] = useState(false);

  // Page load hote hi backend se current link aur time layega
  useEffect(() => {
    const fetchMeetingLink = async () => {
      try {
        const response = await axios.get('https://synnex-backend.onrender.com/api/meeting');
        if (response.data.status === 'success') {
          if (response.data.link) setMeetingLink(response.data.link);
          if (response.data.time) setMeetingTime(response.data.time); // 🔥 Time bhi fetch hoga
        }
      } catch (error) {
        console.log("No active meeting found on server.");
      }
    };
    if (loggedIn) fetchMeetingLink();
  }, [loggedIn]);

  const handleManualLinkChange = (e) => {
    setMeetingLink(e.target.value);
  };

  // Broadcast button dabane par ye chalega
  const handleSaveMeetingLink = async () => {
    if (!meetingLink || !meetingLink.startsWith('http')) {
      toast.error("⚠️ Error: Please copy and paste a REAL Google Meet link!");
      return;
    }
    
    // 🔥 CHECK: Time select kiya hai ya nahi
    if (!meetingTime) {
      toast.error("⚠️ Please select a Date and Time for the meeting!");
      return;
    }

    setLoading(true);
    try {
      // 🔥 NAYA: Link ke sath 'time' bhi backend bhej rahe hain
      await axios.post('https://synnex-backend.onrender.com/api/meeting', {
        link: meetingLink,
        time: meetingTime,
        role: userRole
      });
      toast.success("Meeting Link & Time Broadcasted to Everyone! 🚀");
    } catch (error) {
      console.error("Error saving meeting:", error);
      toast.error("Database Error: Failed to save link.");
    }
    setLoading(false);
  };

  const handleJoinMeeting = () => {
    if (meetingLink) {
      toast.info("Opening Meeting Room..."); 
      window.open(meetingLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={4000} />
      
      <div className="max-w-lg w-full p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        {loggedIn ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Alumni Meeting Room 🎥</h2>
              <p className="text-gray-500">
                {canGenerateLink 
                  ? "Paste link and select time to broadcast it." 
                  : "Active meeting details shared by the Alumni/Admin are below."}
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="meetingLink" className="block text-sm font-semibold text-gray-700 mb-2">
                {canGenerateLink ? "Your Secure Meeting Link" : "Active Meeting Link"}
              </label>
              <input
                id="meetingLink"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none"
                value={meetingLink}
                onChange={handleManualLinkChange}
                placeholder={canGenerateLink ? "Paste real link here (https://meet.google.com/...)" : "Waiting for meeting to start..."}
                readOnly={!canGenerateLink} 
              />
            </div>

            {/* 🔥 NAYA: Date and Time Picker */}
            <div className="mb-6">
              <label htmlFor="meetingTime" className="block text-sm font-semibold text-gray-700 mb-2">
                Meeting Date & Time
              </label>
              <input
                id="meetingTime"
                type="datetime-local"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                readOnly={!canGenerateLink} 
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              {canGenerateLink && (
                <button
                  className="flex-1 border-2 border-black text-black hover:bg-black hover:text-white px-4 py-3 rounded-lg font-bold transition duration-300 disabled:opacity-50"
                  onClick={handleSaveMeetingLink}
                  disabled={loading}
                >
                  {loading ? "Broadcasting..." : "1. Broadcast Meeting"}
                </button>
              )}
              <button
                className={`flex-1 px-4 py-3 rounded-lg font-bold transition duration-300 shadow-md ${
                  meetingLink 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                }`}
                onClick={handleJoinMeeting}
                disabled={!meetingLink}
              >
                {canGenerateLink ? '2. Join Meeting' : 'Join Meeting'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">You're Not Logged In 🔒</h1>
            <p className="text-gray-600 mb-8">Please log in to access the secure meeting rooms.</p>
            <Link to="/login" className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition">
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meeting;
