// File: Chat.js
// =====================================
import React, { useState, useEffect } from "react";
import { collection, addDoc, doc, getDoc, query, orderBy, onSnapshot, limit, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import { getAuth } from "firebase/auth";
import styles from "./Chat.module.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [fontSize, setFontSize] = useState(16); // Default font size
  const [user, setUser] = useState(null);
  const [userFirstName, setUserFirstName] = useState("User"); // First name from Firestore

  // Fetch current user data
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const fetchUserDetails = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserFirstName(userData.firstName || "User");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      setUser({
        displayName: currentUser.displayName || "User",
        email: currentUser.email,
        uid: currentUser.uid, // Include UID for Firestore rules
      });

      fetchUserDetails();
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
      setMessages(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          // Map senderId to user's displayName if available
          return {
            ...data,
            senderName: data.senderId === user?.uid ? userFirstName : data.senderId === "Beta" ? "Beta" : "User",
          };
        })
      );
    });
    return unsubscribe; // Cleanup listener on component unmount
  }, [user, userFirstName]);

  // Handle sending messages
  const sendMessage = async (e) => {
    e.preventDefault(); // Prevent page reload

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error("User is not authenticated. Cannot send message.");
      return;
    }

    const userMessage = {
      text: userInput.trim(),
      senderId: currentUser.uid, // Use UID instead of email for Firestore rules
      receiverId: "Beta", // Beta is the receiver
      timestamp: Timestamp.fromDate(new Date()),
    };

    if (!userMessage.text || !userMessage.senderId || !userMessage.receiverId) {
      console.error("Invalid message format:", userMessage);
      return;
    }

    console.log("Sending user message:", userMessage);

    try {
      // Save user message to Firestore
      await addDoc(collection(db, "messages"), userMessage);
      console.log("Message successfully added to Firestore.");
      setUserInput(""); // Clear input after sending

      // Fetch Beta's response from the server
      const response = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "user", content: `This user needs assistance with real estate: ${userMessage.text}` }
          ],
          user: { name: userFirstName },
        }),
      });


      if (!response.ok) {
        throw new Error("Failed to fetch Beta's response.");
      }

      const betaResponse = await response.json();

      // Extract the content from the response
      const betaMessageContent = betaResponse?.content || null;

      if (betaMessageContent) {
        // Save Beta's response to Firestore
        const betaMessage = {
          text: betaMessageContent,
          senderId: "Beta",
          receiverId: currentUser.uid,
          timestamp: Timestamp.fromDate(new Date()),
        };

        await addDoc(collection(db, "messages"), betaMessage);
        console.log("Beta's response added to Firestore.");
      } else {
        console.error("Invalid Beta response format:", betaResponse);
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
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
            className={`${styles.chatMessage} ${msg.senderId === "Beta" ? styles.chatMessageAI : styles.chatMessageUser
              }`}
            style={{ fontSize: `${fontSize}px` }} // Apply dynamic font size
          >
            <p>
              <strong>{msg.senderName}:</strong> {msg.text}
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
