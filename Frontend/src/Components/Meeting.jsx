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
  const [loading, setLoading] = useState(false);

  // Page load hote hi backend se current link layega
  useEffect(() => {
    const fetchMeetingLink = async () => {
      try {
        const response = await axios.get('https://synnex-backend.onrender.com/api/meeting');
        if (response.data.status === 'success' && response.data.link) {
          setMeetingLink(response.data.link);
        }
      } catch (error) {
        console.log("No active meeting found on server.");
      }
    };
    if (loggedIn) fetchMeetingLink();
  }, [loggedIn]);

  // Input box mein typing/pasting handle karega
  const handleManualLinkChange = (e) => {
    setMeetingLink(e.target.value);
  };

  // Broadcast button dabane par ye chalega
  const handleSaveMeetingLink = async () => {
    // 🔥 STRICT CHECK: Asli link hona hi chahiye!
    if (!meetingLink || !meetingLink.startsWith('http')) {
      toast.error("⚠️ Error: Please copy and paste a REAL Google Meet link!");
      return;
    }

    setLoading(true);
    try {
      await axios.post('https://synnex-backend.onrender.com/api/meeting', {
        link: meetingLink,
        role: userRole
      });
      toast.success("Google Meet link Broadcasted to Everyone! 🚀");
    } catch (error) {
      console.error("Error saving meeting:", error);
      toast.error("Database Error: Failed to save link.");
    }
    setLoading(false);
  };

  // Join button dabane par naye tab me meeting khulegi
  const handleJoinMeeting = () => {
    if (meetingLink) {
      toast.info("Opening Meeting Room..."); 
      window.open(meetingLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-lg w-full p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        {loggedIn ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Alumni Meeting Room 🎥</h2>
              <p className="text-gray-500">
                {canGenerateLink 
                  ? "Paste your real Google Meet link below to broadcast it." 
                  : "Active meeting link shared by the Alumni/Admin is below."}
              </p>
            </div>

            <div className="mb-6">
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

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              {canGenerateLink && (
                <button
                  className="flex-1 border-2 border-black text-black hover:bg-black hover:text-white px-4 py-3 rounded-lg font-bold transition duration-300 disabled:opacity-50"
                  onClick={handleSaveMeetingLink}
                  disabled={loading}
                >
                  {loading ? "Broadcasting..." : "1. Broadcast Link"}
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