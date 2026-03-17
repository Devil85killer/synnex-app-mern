import { Navigate, useNavigate } from "react-router-dom";
import { getUserData, getLoggedIn } from "../services/authService";

function Home() {
  const loggedin = getLoggedIn();
  const navigate = useNavigate(); // <-- BUTTONS KO ZINDA KARNE WALA HOOK YAHAN HAI

  // FIXED: Navigation ko proper early return bana diya taaki bina login koi yahan na aa sake
  if (!loggedin) {
    return <Navigate to="/login" />;
  }

  const { role, email, firstName, adminName } = getUserData();
  const displayName = role === "admin" ? adminName : firstName;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 w-full">
      <div className="max-w-6xl mx-auto">
        
        {/* Dynamic Welcome Banner */}
        <div className="bg-black text-white rounded-2xl p-6 md:p-8 mb-8 shadow-lg flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName || "User"}! 🎓</h1>
            <p className="text-gray-300">Manage your profile, connect with peers, and explore opportunities.</p>
          </div>
          <div className="hidden md:block">
            <span className="bg-white text-black px-4 py-2 rounded-full font-bold uppercase tracking-wide text-sm">
              {role} Portal
            </span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Profile Card (Live Data from Backend) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold border-b pb-3 mb-4 text-gray-800">My Profile</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-gray-900">{displayName || "Not Provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-900">{email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Role</p>
                <p className="font-semibold text-blue-600 capitalize">{role}</p>
              </div>
            </div>
            {/* FIXED: Edit Profile Button */}
            <button 
              onClick={() => navigate('/profile')}
              className="mt-5 w-full bg-gray-100 text-black border border-gray-300 py-2 rounded-lg hover:bg-black hover:text-white transition font-medium"
            >
              Edit Profile
            </button>
          </div>

          {/* Highlights / Skills Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold border-b pb-3 mb-4 text-gray-800">Professional Highlights</h2>
            <p className="text-sm text-gray-600 mb-4">Top skills and interests added to your profile:</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">Data Analytics</span>
              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium border border-purple-100">SQL</span>
              <span className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium border border-cyan-100">React.js</span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-100">Python</span>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold border-b pb-3 mb-4 text-gray-800">Quick Actions</h2>
            <div className="space-y-3">
              {/* FIXED: Saare buttons mein onClick add kar diya hai */}
              <button 
                onClick={() => navigate('/jobs')} 
                className="block w-full text-center bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition shadow-sm"
              >
                Explore Jobs
              </button>
              <button 
                onClick={() => navigate('/search-people')} 
                className="block w-full text-center bg-white text-black border-2 border-black py-2 rounded-lg hover:bg-gray-50 transition shadow-sm"
              >
                Find Alumni
              </button>
              <button 
                onClick={() => navigate('/events')} 
                className="block w-full text-center bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition shadow-sm"
              >
                Upcoming Events
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;