import React, { useState, useEffect, useRef } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import styles from "./Chat.module.css";
import { useAuth } from "../../context/AuthContext";
import { useChatContext } from "../../context/ChatContext";
import { saveMessageToFirestore } from "../../services/firestoreService";
import { getOpenAIResponse } from "../../services/openaiService";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [isSending, setIsSending] = useState(false);
  const initializationLock = useRef(false);

  const { user, loading } = useAuth();
  const { conversationId, setConversationId, assistantId, setAssistantId, threadId, setThreadId } = useChatContext();

  // Initialize conversation, assistant, and thread
  useEffect(() => {
    if (loading || !user || initializationLock.current) return;

    const initializeChat = async () => {
      try {
        initializationLock.current = true;

        console.log("Initializing assistant and thread for user:", user.firstName);

        // Call backend to create assistant and thread
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/init`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName: user.firstName }),
        });

        if (!response.ok) {
          throw new Error("Failed to initialize assistant and thread.");
        }

        const { assistantId: newAssistantId, threadId: newThreadId } = await response.json();
        console.log("Assistant and thread initialized:", { newAssistantId, newThreadId });

        setAssistantId(newAssistantId);
        setThreadId(newThreadId);

        // Create a new conversation in Firestore
        const conversationsRef = collection(db, "conversations");
        const newConversation = {
          userId: user.uid,
          assistantId: newAssistantId,
          threadId: newThreadId,
          createdAt: new Date().toISOString(),
        };

        const conversationDocRef = await addDoc(conversationsRef, newConversation);
        setConversationId(conversationDocRef.id);

        console.log("New conversation created with ID:", conversationDocRef.id);
      } catch (error) {
        console.error("Error initializing conversation:", error.message);
      }
    };

    initializeChat();
  }, [loading, user, setAssistantId, setThreadId, setConversationId]);

  // Send message and handle OpenAI response
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!conversationId || !threadId || !userInput.trim()) {
      console.error("Missing conversationId, threadId, or user input.");
      return;
    }

    const userMessage = {
      content: userInput.trim(),
      role: "user",
      senderId: user.uid,
      senderName: user.displayName || "User",
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");

    setIsSending(true);
    try {
      // Save user message to Firestore
      await saveMessageToFirestore(conversationId, userMessage);

      // Fetch response from OpenAI
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/chat?assistantId=${assistantId}&threadId=${threadId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch assistant response.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let partialMessage = "";

      // Process the SSE stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        chunk.split("\n").forEach((line) => {
          if (line.startsWith("data:")) {
            const data = line.replace("data: ", "").trim();

            if (data === "[DONE]") {
              // End of stream
              return;
            }

            try {
              const json = JSON.parse(data);
              if (json.content) {
                partialMessage += json.content;

                // Update the assistant's message in the UI incrementally
                setMessages((prev) => {
                  const lastMessage = prev[prev.length - 1];
                  if (lastMessage?.senderId === "Beta") {
                    return [
                      ...prev.slice(0, -1),
                      { ...lastMessage, content: partialMessage },
                    ];
                  } else {
                    return [
                      ...prev,
                      { content: partialMessage, role: "assistant", senderId: "Beta", senderName: "Beta" },
                    ];
                  }
                });
              }
            } catch (err) {
              console.error("Error parsing stream chunk:", err);
            }
          }
        });
      }

      // Save the final assistant message to Firestore
      await saveMessageToFirestore(conversationId, {
        content: partialMessage,
        role: "assistant",
        senderId: "Beta",
        senderName: "Beta",
      });
    } catch (error) {
      console.error("Error sending message:", error.message);
    } finally {
      setIsSending(false);
    }
  };



  const renderContent = (content) => {
    if (typeof content === "string") {
      return content;
    } else if (Array.isArray(content)) {
      return content.map((item, index) => <span key={index}>{item.text?.value || ""}</span>);
    }
    return "Invalid content";
  };

  const renderMessageSender = (msg) => {
    if (msg.senderId === "Beta") {
      return "Beta"; // Assistant's name
    } else {
      return user.firstName || "User"; // Only display the first name of the user
    }
  };


  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <button
          className={styles.fontSizeButton}
          onClick={() => setFontSize((size) => Math.min(size + 2, 24))}
        >
          A+
        </button>
        <button
          className={styles.fontSizeButton}
          onClick={() => setFontSize((size) => Math.max(size - 2, 12))}
        >
          A-
        </button>
        <button className={styles.fontSizeButton} onClick={() => setFontSize(16)}>
          Reset
        </button>
      </div>
      <div className={styles.chatMessages}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.chatMessage} ${msg.senderId === "Beta" ? styles.chatMessageAI : styles.chatMessageUser
              }`}
            style={{ fontSize: `${fontSize}px` }}
          >
            <strong>{renderMessageSender(msg)}:</strong> {renderContent(msg.content)}
          </div>
        ))}
      </div>

      <form className={styles.chatForm} onSubmit={sendMessage}>
        <input
          className={styles.chatInput}
          type="text"
          placeholder="Type a message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={isSending}
        />
        <button className={styles.chatSendButton} type="submit" disabled={isSending}>
          {isSending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default Chat;
