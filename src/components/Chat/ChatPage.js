import React, { useState, useEffect, useRef } from "react";
import Chat from "./Chat";
import styles from "./ChatPage.module.css";

const ChatPage = () => {
  const [hideTitle, setHideTitle] = useState(false);
  const welcomeMessageRef = useRef(null); // Ref for the welcome message
  const chatContainerRef = useRef(null); // Ref for the chat container

  const [availableHeight, setAvailableHeight] = useState(0); // State to store calculated height

  // Hide the title after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHideTitle(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Adjust the available height for the chat container
  useEffect(() => {
    const adjustChatHeight = () => {
      const navbarHeight = document.querySelector("nav")?.offsetHeight || 56; // Navbar height
      const titleHeight =
        welcomeMessageRef.current && !hideTitle
          ? welcomeMessageRef.current.offsetHeight
          : 0; // Title height only if visible
      const footerHeight = 0; // Footer is part of chatForm, no extra height needed
      const calculatedHeight = window.innerHeight - navbarHeight - titleHeight - footerHeight;
      setAvailableHeight(calculatedHeight); // Update state
    };

    adjustChatHeight(); // Initial adjustment
    window.addEventListener("resize", adjustChatHeight); // Recalculate on resize

    return () => window.removeEventListener("resize", adjustChatHeight); // Cleanup
  }, [hideTitle]);

  return (
    <div className={styles.chatPageContainer}>
      {!hideTitle && (
        <h1 ref={welcomeMessageRef} className={styles.chatPageTitle}>
          Welcome to the Chat
        </h1>
      )}

      <div
        ref={chatContainerRef}
        className={styles.chatContainer}
        style={{
          height: `${availableHeight}px`, // Dynamic height calculation
          border: "2px dashed red", // Debug only; remove after verification
        }}
      >
        <Chat availableHeight={availableHeight} /> {/* Pass the calculated height */}
      </div>
    </div>
  );
};

export default ChatPage;
