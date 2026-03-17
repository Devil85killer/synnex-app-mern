import React, { useState } from "react";
import { getLoggedIn } from "../services/authService";
import { useNavigate } from "react-router-dom";
import NotLoggedIn from "./helper/NotLoggedIn";
import { useSelector } from "react-redux"; // REDUX IMPORT KIYA HAI YAHAN

function Jobs() {
  const loggedIn = getLoggedIn();
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // Redux se current user ka data nikal rahe hain
  // Note: Agar tere authSlice ka naam kuch aur hai, toh 'state.auth.user' ko adjust kar lena
  const user = useSelector((state) => state.auth?.user); 

  // Dummy jobs with Poster details
  const [jobs, setJobs] = useState([
    { 
      id: 1, 
      title: "Data Analyst", 
      company: "TechNova Solutions", 
      location: "Bangalore", 
      type: "Full-time",
      postedBy: "Rahul Sharma", 
      posterRole: "Alumni",
      posterEmail: "rahul.alumni@example.com"
    },
    { 
      id: 2, 
      title: "React.js Developer Intern", 
      company: "Nalco System Lab", 
      location: "Remote", 
      type: "Internship",
      postedBy: "Dr. Arvind", 
      posterRole: "Teacher",
      posterEmail: "arvind.faculty@example.com"
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 w-full">
      {loggedIn ? (
        <div className="max-w-6xl mx-auto">
          
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-900">Alumni Job Board 💼</h1>
            
            {/* Post Job Button - SIRF ALUMNI KO DIKHEGA */}
            {user?.role === "alumni" && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition shadow-lg font-medium"
              >
                {showForm ? "Cancel Posting" : "+ Post a Job"}
              </button>
            )}
          </div>

          {/* Add Job Form - SIRF ALUMNI KO DIKHEGA */}
          {user?.role === "alumni" && showForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Post a New Opportunity</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Job Title (e.g., Frontend Developer)" className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black" />
                <input type="text" placeholder="Company Name" className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black" />
                <input type="text" placeholder="Location (e.g., Remote, Pune)" className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black" />
                <select className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-black">
                  <option value="">Select Job Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                </select>
                <textarea placeholder="Job Description & Requirements..." className="border border-gray-300 p-2 rounded md:col-span-2 focus:outline-none focus:ring-2 focus:ring-black" rows="3"></textarea>
                <button type="button" className="bg-green-600 text-white font-bold px-4 py-2 rounded hover:bg-green-700 md:col-span-2 transition shadow-sm">
                  Submit Job to Portal
                </button>
              </form>
            </div>
          )}

          {/* Jobs List */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition duration-300 flex flex-col justify-between">
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                  <p className="text-gray-600 mt-1 font-medium">{job.company}</p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">{job.location}</span>
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-1 rounded-md">{job.type}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  {/* Poster Info Section */}
                  <div className="border-t border-gray-100 pt-3 pb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Posted By</p>
                    <p className="text-sm font-bold text-gray-900">
                      {job.postedBy} <span className="text-xs font-normal text-gray-500">({job.posterRole})</span>
                    </p>
                  </div>

                  {/* Apply Now -> Redirects to Send Mail */}
                  <button 
                    onClick={() => navigate(`/send-mail?to=${encodeURIComponent(job.posterEmail)}&subject=${encodeURIComponent(`Job Application: ${job.title} at ${job.company}`)}`)}
                    className="block w-full text-center border-2 border-black text-black font-bold px-4 py-2 rounded-lg hover:bg-black hover:text-white transition shadow-sm"
                  >
                    Contact / Apply Now
                  </button>
                </div>

              </div>
            ))}
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