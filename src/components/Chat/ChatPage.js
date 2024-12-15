import React, { useState } from "react";
import styles from "./ChatPage.module.css";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);

  const sendMessage = () => {
    if (message.trim()) {
      setConversation([...conversation, { user: "You", text: message }]);
      setMessage("");
    }
  };

  return (
    <div className={styles.chatContainer}>
      <h1>Chat</h1>
      <div>
        {conversation.map((msg, index) => (
          <p key={index}>
            <strong>{msg.user}: </strong>
            {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className={styles.chatInput}
      />
      <button onClick={sendMessage} className={styles.chatButton}>
        Send
      </button>
    </div>
  );
};

export default ChatPage;
