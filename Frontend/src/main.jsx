import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store/store";
import store from "./store/store";
import Register from "./pages/Register.jsx";
import Layout from "./Layout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import Home from "./Components/Home.jsx";
import Event from "./Components/Event.jsx";
import Jobs from "./Components/Jobs.jsx";
import Newsletter from "./Components/NewsLetter.jsx";
// 🔥 NAYA: SendMail ko hata kar Complaint import kiya
import Complaint from "./Components/Complaint.jsx"; 
import BulkUpload from "./Components/BulkUpload.jsx";
import SearchPeople from "./Components/SearchPeople.jsx";
import Meeting from "./Components/Meeting.jsx";
import Feedback from "./Components/Feedback.jsx";
import Profile from "./Components/Profile.jsx";

// 🔥 Forgot Password ka import
import ForgotPassword from "./pages/ForgotPassword.jsx"; 

// 🔥 Tere Secret Admin Panel ke imports
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Ye aam janta ka darwaza hai
    children: [
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "",
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      // 🔥 Forgot Password ka route
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "events",
        element: <Event />,
      },
      {
        path: "/jobs",
        element: <Jobs />,
      },
      {
        path: "/newsletter",
        element: <Newsletter />,
      },
      // 🔥 NAYA: Yahan SendMail ka rasta hata kar Complaint ka laga diya hai
      {
        path: "/complaint",
        element: <Complaint />,
      },
      {
        path: "/bulk-upload",
        element: <BulkUpload />,
      },
      {
        path: "/search-people",
        element: <SearchPeople />,
      },
      {
        path: "/meeting",
        element: <Meeting />,
      },
      {
        path: "/feedback",
        element: <Feedback />,
      },
    ],
  },
  
  // 🔥 SECRET ADMIN ROUTES
  {
    path: "/synnex-hq-admin",
    element: <AdminLogin />,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },

  // Ye safety ke liye hai, koi galat URL daalega toh Login pe jayega
  {
    path: "/*",
    element: <Navigate to="/login" />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
