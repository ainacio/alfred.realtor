import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import ChatPage from "./components/Chat/ChatPage";
import SuccessPage from "./components/Success/SuccessPage";
import LogoutSuccessPage from "./components/LogoutSuccessPage/LogoutSuccessPage";
import Settings from "./components/Settings/Settings";
import Navbar from "./components/Navbar/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import AuthProvider

import "./index.css";

const App = () => {
  return (
    <AuthProvider>
      <RoutesWrapper />
    </AuthProvider>
  );
};

const RoutesWrapper = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Display a loader while checking auth state

  return (
    <>
      <Navbar user={user} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/logout-success" element={<LogoutSuccessPage />} />
          <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
