import React from "react";
import Chat from "./Chat";
import styles from "./ChatPage.module.css";

const ChatPage = () => {
  return (
    <div className={styles.chatPageContainer}>
      <h1 className={styles.chatPageTitle}>Welcome to the Chat</h1>
      <Chat />
    </div>
  );
};

export default ChatPage;
