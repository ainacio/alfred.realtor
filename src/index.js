import React from "react";
import ReactDOM from "react-dom/client"; // Updated import for createRoot
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")); // Use createRoot
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap App in BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);