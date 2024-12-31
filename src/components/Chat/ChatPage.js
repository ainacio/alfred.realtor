import React, { useState, useEffect, useRef } from "react";
import Chat from "./Chat";
import styles from "./ChatPage.module.css";
import useAdjustHeight from "../../hooks/useAdjustHeight";

const ChatPage = () => {
  const [hideTitle, setHideTitle] = useState(false);
  const welcomeMessageRef = useRef(null); // Ref for the welcome message
  const chatContainerRef = useRef(null); // Ref for the chat container

  // Customizable values
  const navbarHeight = 56; // Default height of navbar
  const footerHeight = 0; // Footer is part of the chat form, no extra height needed

  // Call useAdjustHeight with dynamic navbarHeight
  const availableHeight = useAdjustHeight({
    navbarHeight,
    titleRef: welcomeMessageRef,
    footerHeight,
    hideTitle, // Pass hideTitle here
  });

  // Hide the title after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHideTitle(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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
        }}
      >
        <Chat availableHeight={availableHeight} /> {/* Pass the calculated height */}
      </div>
    </div>
  );
};

export default ChatPage;
