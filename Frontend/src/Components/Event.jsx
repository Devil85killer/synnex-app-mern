import React, { useState } from 'react';
import { getLoggedIn } from '../services/authService';
import NotLoggedIn from './helper/NotLoggedIn';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux'; 

function Event() {
  const loggedIn = getLoggedIn();
  const [showForm, setShowForm] = useState(false);
  const user = useSelector((state) => state.auth?.user);

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Annual Alumni Meet 2026",
      date: "Oct 15, 2026",
      time: "10:00 AM - 4:00 PM",
      location: "College Campus, Main Auditorium",
      description: "Join us for the biggest gathering of the year. Reconnect with old friends, network with seniors, and relive college memories.",
      type: "Offline"
    },
    {
      id: 2,
      title: "Tech Talk: Future of AI & React.js",
      date: "Nov 02, 2026",
      time: "6:00 PM - 7:30 PM",
      location: "Google Meet",
      description: "An exclusive online session by industry experts on how AI is shaping frontend development. Don't miss this out!",
      type: "Online"
    }
  ]);

  const handleRegister = (eventName) => {
    toast.success(`Successfully registered for: ${eventName}! 🎉`);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    toast.success("New Event Published! ✅");
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 w-full">
      <ToastContainer position="top-right" autoClose={3000} />
      {loggedIn ? (
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-gray-200 pb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upcoming Events 📅</h1>
              <p className="text-gray-500 mt-1">Discover and join events hosted by your alumni network.</p>
            </div>
            {/* Create Event Button - SIRF ALUMNI AUR TEACHER KO DIKHEGA */}
            {(user?.role === "alumni" || user?.role === "teacher") && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="mt-4 sm:mt-0 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition shadow-md font-medium z-10"
              >
                {showForm ? "Close Form ❌" : "+ Create Event"}
              </button>
            )}
          </div>

          {showForm && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Host a New Event</h2>
              <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" required placeholder="Event Title" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  <input type="time" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <input type="text" required placeholder="Location or Meeting Link" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                <select required className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white">
                  <option value="">Event Type</option>
                  <option value="Online">Online / Virtual</option>
                  <option value="Offline">Offline / In-person</option>
                </select>
                <textarea required placeholder="Event Description..." rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-md md:col-span-2"></textarea>
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-green-700">Publish Event</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition duration-300 flex flex-col h-full overflow-hidden">
                <div className={`h-2 w-full ${event.type === 'Online' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${event.type === 'Online' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                      {event.type}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">{event.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <div className="text-sm text-gray-600 mb-4 space-y-1">
                    <p>⏰ {event.time}</p>
                    <p className="truncate">📍 {event.location}</p>
                  </div>
                  <p className="text-gray-600 text-sm flex-grow line-clamp-3 mb-6">{event.description}</p>
                  <button 
                    onClick={() => handleRegister(event.title)}
                    className={`mt-auto w-full text-center border-2 font-semibold px-4 py-2 rounded-lg transition ${event.type === 'Online' ? 'border-black text-black hover:bg-black hover:text-white' : 'bg-black text-white hover:bg-gray-800'}`}
                  >
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-screen items-center justify-center">
          <NotLoggedIn text="Events" />
        </div>
      )}
    </div>
  );
}

export default Event;