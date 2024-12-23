import React, { useState, useEffect } from "react";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { getOpenAIResponse } from "../../services/openaiService";
import styles from "./Chat.module.css";
import { getAuth } from "firebase/auth";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [fontSize, setFontSize] = useState(16); // Default font size
  const [user, setUser] = useState(null);

  // Fetch current user data
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser({
        displayName: currentUser.displayName || "User",
        email: currentUser.email,
      });
    }
  }, []);

  // Fetch messages from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });
    return unsubscribe; // Cleanup listener on component unmount
  }, []);

  // Handle sending messages
  const sendMessage = async (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      const userName = user?.displayName || user?.email || "Unknown User";

      // Save user message
      const userMessage = {
        text: userInput,
        sender: userName,
        timestamp: new Date(),
      };
      await addDoc(collection(db, "messages"), userMessage);

      // Include user's name in the prompt to Beta
      const prompt = `The user's name is ${userName}. Respond to their query accordingly: "${userInput}"`;

      // Get AI response
      const aiResponse = await getOpenAIResponse(prompt);
      const aiMessage = {
        text: aiResponse,
        sender: "Beta", // Capitalized name
        timestamp: new Date(),
      };
      await addDoc(collection(db, "messages"), aiMessage);

      setUserInput(""); // Clear input field
    }
  };

  // Font size adjustment functions
  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 24)); // Max font size: 24px
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 12)); // Min font size: 12px
  const resetFontSize = () => setFontSize(16); // Reset to default font size

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <button onClick={increaseFontSize} className={styles.fontSizeButton}>
          A+
        </button>
        <button onClick={decreaseFontSize} className={styles.fontSizeButton}>
          A-
        </button>
        <button onClick={resetFontSize} className={styles.fontSizeButton}>
          Reset
        </button>
      </div>
      <div className={styles.chatMessages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.chatMessage} ${
              msg.sender === user?.displayName || msg.sender === user?.email || msg.sender === "Unknown User"
                ? styles.chatMessageUser
                : styles.chatMessageAI
            }`}
            style={{ fontSize: `${fontSize}px` }} // Apply dynamic font size
          >
            <p>
              <strong>{msg.sender}:</strong> {msg.text}
            </p>
          </div>
        ))}
      </div>
      <form className={styles.chatForm} onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className={styles.chatInput}
        />
        <button type="submit" className={styles.chatSendButton}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
