import React from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import app from "./firebase-config"; // Import app

const ChatPage = () => {
  const auth = getAuth(app); // Use the initialized app
  const user = auth.currentUser;

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h1>Chat with Beta</h1>
        <p>You must log in to access the chat feature.</p>
        <a href="/login" style={{ color: "blue", textDecoration: "underline" }}>
          Click here to log in
        </a>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Welcome to the Chat Page</h1>
      <p>Beta is here to assist you!</p>
    </div>
  );
};

export default ChatPage;
