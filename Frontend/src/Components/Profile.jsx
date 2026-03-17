import React, { useState } from "react";
import { getUserData } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Profile() {
  // Backend se current data nikalo
  const userData = getUserData();
  const navigate = useNavigate();

  // Form ka state manage karne ke liye
  const [formData, setFormData] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    role: userData.role || "",
    skills: "Data Analytics, SQL, React.js", // Dummy default
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Yahan aage chalke backend API call lagayenge profile update karne ke liye
    console.log("Updated Data ready to send to backend:", formData);
    alert("Profile saved successfully (Dummy action for now)!");
    navigate("/dashboard"); // Save hone ke baad wapas dashboard le jao
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 w-full flex justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-4">Edit Profile</h2>
        
        <form onSubmit={handleSave} className="space-y-5">
          {/* Name Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input 
                type="text" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input 
                type="text" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
              />
            </div>
          </div>

          {/* Email (Disabled, usually emails aren't editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={formData.email} 
              disabled
              className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-md text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Skills Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Key Skills (Comma separated)</label>
            <input 
              type="text" 
              name="skills" 
              value={formData.skills} 
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 mt-6 border-t">
            <button 
              type="submit" 
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition font-medium"
            >
              Save Changes
            </button>
            <button 
              type="button" 
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;