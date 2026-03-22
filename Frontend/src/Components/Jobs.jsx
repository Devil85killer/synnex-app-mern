import React, { useState, useEffect } from "react";
import axios from "axios"; // AXIOS IMPORT ZAROORI HAI
import { getLoggedIn, getUserRole } from "../services/authService"; 
import { useNavigate } from "react-router-dom";
import NotLoggedIn from "./helper/NotLoggedIn";

function Jobs() {
  const loggedIn = getLoggedIn();
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const role = getUserRole(); 
  const userRole = role?.toLowerCase();

  // DUMMY DATA GAYA! Ab khali array se start hoga
  const [jobs, setJobs] = useState([]);

  // NEW: State for New Job Form
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    description: ""
  });

  // 1. LIVE DATA FETCH KARNE KA CODE
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('https://synnex-backend.onrender.com/api/jobs/all', {
          withCredentials: true 
        });
        
        // Backend response format ke hisaab se set karo
        if (res.data.status === 'success') {
          setJobs(res.data.data.jobs);
        } else {
          setJobs(res.data);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    if (loggedIn) {
      fetchJobs();
    }
  }, [loggedIn]);

  // 2. CREATE JOB KA LIVE API CALL
  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://synnex-backend.onrender.com/api/jobs/create', newJob, {
        withCredentials: true
      });
      
      // Naya job list mein add karo bina refresh kiye
      if (res.data.status === 'success') {
        setJobs([...jobs, res.data.data.job]);
      } else {
        fetchJobs(); // Fallback: wapas sab fetch kar lo
      }
      
      setShowForm(false);
      setNewJob({ title: "", company: "", location: "", type: "", description: "" }); // Form clear
      alert("Job Posted Successfully! ✅");
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to post job. Please try again.");
    }
  };

  // 3. DELETE JOB KA LIVE API CALL (For Admin)
  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job permanently?")) {
      try {
        await axios.delete(`https://synnex-backend.onrender.com/api/jobs/delete/${jobId}`, { 
          withCredentials: true 
        });
        
        // UI se turant hata do (MongoDB mein '_id' use hota hai)
        setJobs(jobs.filter((job) => job._id !== jobId));
        alert("Job deleted permanently. 🗑️");
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Error deleting job.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 w-full">
      {loggedIn ? (
        <div className="max-w-6xl mx-auto">
          
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-900">Alumni Job Board 💼</h1>
            
            {/* Post Job Button */}
            {(userRole === "alumni" || userRole === "admin") && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition shadow-lg font-medium"
              >
                {showForm ? "Cancel Posting ❌" : "+ Post a Job"}
              </button>
            )}
          </div>

          {/* Add Job Form */}
          {(userRole === "alumni" || userRole === "admin") && showForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Post a New Opportunity</h2>
              
              <form onSubmit={handleCreateJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" required value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} placeholder="Job Title (e.g., Frontend Developer)" className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black" />
                
                <input type="text" required value={newJob.company} onChange={(e) => setNewJob({...newJob, company: e.target.value})} placeholder="Company Name" className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black" />
                
                <input type="text" required value={newJob.location} onChange={(e) => setNewJob({...newJob, location: e.target.value})} placeholder="Location (e.g., Remote, Pune)" className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black" />
                
                <select required value={newJob.type} onChange={(e) => setNewJob({...newJob, type: e.target.value})} className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black">
                  <option value="">Select Job Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                </select>
                
                <textarea required value={newJob.description} onChange={(e) => setNewJob({...newJob, description: e.target.value})} placeholder="Job Description & Requirements..." className="border border-gray-300 p-2 rounded md:col-span-2 focus:outline-none focus:ring-2 focus:ring-black" rows="3"></textarea>
                
                <button type="submit" className="bg-green-600 text-white font-bold px-4 py-2 rounded hover:bg-green-700 md:col-span-2 transition shadow-sm">
                  Submit Job to Portal
                </button>
              </form>
            </div>
          )}

          {/* Jobs List */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-10">No jobs posted yet.</p>
            ) : (
              jobs.map((job) => (
                // Dhyan de: job.id ki jagah job._id use hoga MongoDB ke liye
                <div key={job._id} className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition duration-300 flex flex-col justify-between">
                  
                  {/* ADMIN DELETE BUTTON */}
                  {userRole === "admin" && (
                    <button 
                      onClick={() => handleDelete(job._id)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-sm transition"
                      title="Delete Job (Admin Only)"
                    >
                      Delete
                    </button>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 pr-12">{job.title || "Job Title"}</h3>
                    <p className="text-gray-600 mt-1 font-medium">{job.company || "Company Name"}</p>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">{job.location || "Remote"}</span>
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-1 rounded-md">{job.type || "Full-time"}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4">
                    <div className="border-t border-gray-100 pt-3 pb-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Posted By</p>
                      <p className="text-sm font-bold text-gray-900">
                        {/* Handling populated createdBy data safely */}
                        {job.createdBy?.name || job.createdBy?.firstName || "Alumni User"} 
                        <span className="text-xs font-normal text-gray-500 ml-1">
                          ({job.createdBy?.role || "alumni"})
                        </span>
                      </p>
                    </div>

                    <button 
                      onClick={() => navigate(`/send-mail?to=${encodeURIComponent(job.createdBy?.email || "admin@example.com")}&subject=${encodeURIComponent(`Job Application: ${job.title} at ${job.company}`)}`)}
                      className="block w-full text-center border-2 border-black text-black font-bold px-4 py-2 rounded-lg hover:bg-black hover:text-white transition shadow-sm"
                    >
                      Contact / Apply Now
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      ) : (
        <div className="flex h-screen items-center justify-center">
          <NotLoggedIn text="Jobs" />
        </div>
      )}
    </div>
  );
}

export default Jobs;