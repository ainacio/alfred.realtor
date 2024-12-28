import React, { useState, useEffect } from "react";
import { collection, addDoc, query, orderBy, onSnapshot, limit, Timestamp } from "firebase/firestore";
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
    const q = query(
      collection(db, "messages"),
      orderBy("timestamp"),
      limit(50) // Limit query results to 50
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });
    return unsubscribe; // Cleanup listener on component unmount
  }, []);

  // Handle sending messages
  const sendMessage = async (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      const auth = getAuth();
      if (!auth.currentUser) {
        console.error("User is not authenticated. Cannot send message.");
        return;
      }

      const userName = user?.displayName || user?.email || "Unknown User";

      // Save user message
      const userMessage = {
        text: userInput,
        sender: user?.email, // Ensure sender matches Firestore rules
        receiver: "Beta", // Beta is the receiver
        timestamp: Timestamp.fromDate(new Date()), // Convert to Firestore timestamp
      };

      try {
        console.log("Sending user message:", userMessage);
        await addDoc(collection(db, "messages"), userMessage);
        console.log("User message sent successfully.");

        // Include user's name in the prompt to Beta
        const prompt = `The user's name is ${userName}. Respond to their query accordingly: "${userInput}"`;

        // Get AI response
        const aiResponse = await getOpenAIResponse(prompt);
        const aiMessage = {
          text: aiResponse,
          sender: "Beta", // Ensure sender is "Beta"
          receiver: user?.email, // User is the receiver
          timestamp: Timestamp.fromDate(new Date()), // Convert to Firestore timestamp
        };

        console.log("Sending AI message:", aiMessage);
        await addDoc(collection(db, "messages"), aiMessage);
        console.log("AI message sent successfully.");
      } catch (error) {
        console.error("Error sending message:", error.message);
      }

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
              msg.sender === "Beta" ? styles.chatMessageAI : styles.chatMessageUser
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
