import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getLoggedIn, getUserRole, getUserData } from '../services/authService';
import NotLoggedIn from './helper/NotLoggedIn';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Event() {
  const loggedIn = getLoggedIn();
  const userData = getUserData();
  const role = getUserRole();
  const userRole = role?.toLowerCase();

  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]); 

  // ADMIN POPUP STATES
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [attendeesList, setAttendeesList] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "", location: "", type: "", description: "" });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let res = await axios.get('https://synnex-backend.onrender.com/api/events/all', { withCredentials: true });
        
        let fetchedEvents = res.data?.data?.events || res.data;
        setEvents(fetchedEvents);

        if (userData?._id && Array.isArray(fetchedEvents)) {
            const userRegEvents = fetchedEvents
                .filter(ev => ev.attendees && ev.attendees.includes(userData._id))
                .map(ev => ev._id);
            setRegisteredEvents(userRegEvents);
        }

      } catch (error) {
        try {
           const adminRes = await axios.get('https://synnex-backend.onrender.com/api/admin/all-events');
           setEvents(adminRes.data);
        } catch(e) { console.error("Fallback also failed."); }
      }
    };

    if (loggedIn) fetchEvents();
  }, [loggedIn]);

  const handleRegister = async (eventId, eventName) => {
    try {
      await axios.post(`https://synnex-backend.onrender.com/api/events/register/${eventId}`, {
        userId: userData._id
      });
      
      setRegisteredEvents([...registeredEvents, eventId]);
      toast.success(`Successfully registered for: ${eventName}! 🎉`);
    } catch (error) {
      if (error.response?.status === 400) {
          toast.info("You are already registered!");
          setRegisteredEvents([...registeredEvents, eventId]); 
      } else {
          toast.error("Failed to register. Please try again.");
      }
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://synnex-backend.onrender.com/api/events/create', newEvent, { withCredentials: true });
      const createdEvent = res.data?.data?.event || res.data;
      setEvents([...events, createdEvent]);
      toast.success("New Event Published! ✅");
      setShowForm(false);
      setNewEvent({ title: "", date: "", time: "", location: "", type: "", description: "" }); 
    } catch (error) { toast.error("Failed to publish event."); }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`https://synnex-backend.onrender.com/api/events/delete/${eventId}`, { withCredentials: true });
        setEvents(events.filter((event) => event._id !== eventId));
        toast.error("Event Deleted! 🗑️");
      } catch (error) { toast.error("Failed to delete event."); }
    }
  };

  const viewAttendees = async (eventId) => {
      setShowAttendeesModal(true);
      setLoadingAttendees(true);
      try {
          const res = await axios.get(`https://synnex-backend.onrender.com/api/admin/event-attendees/${eventId}`);
          setAttendeesList(res.data);
      } catch (error) {
          toast.error("Could not fetch attendees list.");
      } finally {
          setLoadingAttendees(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 w-full relative">
      <ToastContainer position="top-right" autoClose={3000} />
      {loggedIn ? (
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-gray-200 pb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Upcoming Events 📅</h1>
              <p className="text-gray-500 mt-1">Discover and join events hosted by your alumni network.</p>
            </div>
            
            {/* 🔥 FIX: Yahan sirf 'admin' condition rakhi hai */}
            {userRole === "admin" && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="mt-4 sm:mt-0 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition shadow-md font-medium z-10"
              >
                {showForm ? "Close Form ❌" : "+ Create Event"}
              </button>
            )}
          </div>

          {/* 🔥 FIX: Yahan bhi sirf 'admin' condition rakhi hai */}
          {userRole === "admin" && showForm && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Host a New Event</h2>
              <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" required value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} placeholder="Event Title" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" required value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  <input type="time" required value={newEvent.time} onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <input type="text" required value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} placeholder="Location or Meeting Link" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                <select required value={newEvent.type} onChange={(e) => setNewEvent({...newEvent, type: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white">
                  <option value="">Event Type</option>
                  <option value="Online">Online / Virtual</option>
                  <option value="Offline">Offline / In-person</option>
                </select>
                <textarea required value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} placeholder="Event Description..." rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-md md:col-span-2"></textarea>
                <div className="md:col-span-2 flex justify-end">
                  <button type="submit" className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-green-700">Publish Event</button>
                </div>
              </form>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-10">No upcoming events found.</p>
            ) : (
              events.map((event) => {
                const isRegistered = registeredEvents.includes(event._id);

                return (
                  <div key={event._id} className="relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition duration-300 flex flex-col h-full overflow-hidden">
                    <div className={`h-2 w-full ${event.type === 'Online' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${event.type === 'Online' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                          {event.type || "Event"}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">{event.date}</span>
                      </div>

                      {userRole === "admin" && (
                        <div className="absolute top-6 right-4 flex gap-2 z-10">
                          <button 
                            onClick={() => viewAttendees(event._id)}
                            className="text-blue-600 hover:text-blue-800 font-bold px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded text-xs transition"
                            title="View Registrations"
                          >
                            👥 {event.attendees ? event.attendees.length : 0}
                          </button>
                          <button 
                            onClick={() => handleDelete(event._id)}
                            className="text-red-500 hover:text-red-700 font-bold px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-xs transition"
                            title="Delete Event"
                          >
                            Delete
                          </button>
                        </div>
                      )}

                      <h3 className="text-xl font-bold text-gray-900 mb-2 pr-20">{event.title}</h3>
                      <div className="text-sm text-gray-600 mb-4 space-y-1">
                        <p>⏰ {event.time}</p>
                        <p className="truncate">📍 {event.location}</p>
                      </div>
                      <p className="text-gray-600 text-sm flex-grow line-clamp-3 mb-6">{event.description}</p>
                      
                      {/* Normal users ke liye Register button (Admin ke liye bhi chalega test karne ko) */}
                      <button 
                        onClick={() => handleRegister(event._id, event.title)}
                        disabled={isRegistered}
                        className={`mt-auto w-full text-center border-2 font-semibold px-4 py-2 rounded-lg transition ${
                          isRegistered 
                            ? 'bg-gray-400 text-white border-gray-400 cursor-not-allowed'
                            : event.type === 'Online' 
                              ? 'border-black text-black hover:bg-black hover:text-white'
                              : 'bg-black text-white border-black hover:bg-gray-800'
                        }`}
                      >
                        {isRegistered ? "Registered ✅" : "Register Now"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="flex h-screen items-center justify-center">
          <NotLoggedIn text="Events" />
        </div>
      )}

      {/* ADMIN REGISTRATIONS MODAL */}
      {showAttendeesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">Registered Users</h3>
              <button onClick={() => setShowAttendeesModal(false)} className="text-gray-500 hover:text-red-500 text-xl font-bold">×</button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto bg-gray-50">
                {loadingAttendees ? (
                    <p className="text-center text-gray-500 my-4">Loading data...</p>
                ) : attendeesList.length === 0 ? (
                    <p className="text-center text-gray-500 my-4">No one has registered yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {attendeesList.map((user, idx) => (
                            <li key={idx} className="bg-white p-3 rounded shadow-sm border border-gray-100">
                                <p className="font-bold text-gray-800">{user.firstName} {user.lastName}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mt-1 inline-block capitalize">{user.role || 'User'}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="p-4 border-t bg-white">
               <button onClick={() => setShowAttendeesModal(false)} className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Event;