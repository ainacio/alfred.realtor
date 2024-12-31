//index.js
import React from "react";
import ReactDOM from "react-dom/client"; // Updated import for createRoot
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import App from "./App";
import "./index.css";
import { ChatProvider } from "./context/ChatContext"; // Import ChatProvider

const root = ReactDOM.createRoot(document.getElementById("root")); // Use createRoot

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChatProvider> {/* Wrap App in ChatProvider */}
        <App />
      </ChatProvider>
    </BrowserRouter>
  </React.StrictMode>
);
