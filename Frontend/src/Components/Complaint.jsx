import React, { useState } from 'react';
import axios from 'axios';
import { getLoggedIn, getUserData } from '../services/authService';
import NotLoggedIn from './helper/NotLoggedIn';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Complaint() {
  const loggedIn = getLoggedIn();
  const user = getUserData() || {};
  
  const [loading, setLoading] = useState(false);
  const [complaintData, setComplaintData] = useState({
    subject: "",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Yahan hum pehle wale send-mail API ka hi use kar rahe hain, bas Admin ko direct bhej rahe hain
      await axios.post('https://synnex-backend.onrender.com/api/send-mail', {
        to: "admin@college.com", // Ise apne actual admin email se replace kar dena backend mein
        subject: `🚨 Portal Complaint: ${complaintData.subject}`,
        message: `New complaint raised by ${user.firstName || 'User'} (${user.email || 'No email provided'}).\n\nIssue Details:\n${complaintData.message}`
      });

      toast.success("Complaint submitted successfully to the Admin. We will look into it! ✅");
      setComplaintData({ subject: "", message: "" });
    } catch (error) {
      console.error("Complaint Submission Error:", error);
      toast.error("Failed to send complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex justify-center items-start pt-16">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {loggedIn ? (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Support & Complaints 🛑</h1>
            <p className="text-gray-500 mt-2">Facing an issue or need help? Report it directly to the admin team.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Subject / Issue Type</label>
              <input 
                type="text" 
                required 
                value={complaintData.subject} 
                onChange={(e) => setComplaintData({...complaintData, subject: e.target.value})} 
                placeholder="E.g., Portal Login Issue, Incorrect Event Data..." 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Describe the Issue in Detail</label>
              <textarea 
                required 
                rows="6"
                value={complaintData.message} 
                onChange={(e) => setComplaintData({...complaintData, message: e.target.value})} 
                placeholder="Please describe exactly what happened..." 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white transition shadow-md ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {loading ? "Sending..." : "Submit Complaint"}
            </button>
          </form>
        </div>
      ) : (
        <NotLoggedIn text="Complaints" />
      )}
    </div>
  );
}

export default Complaint;
