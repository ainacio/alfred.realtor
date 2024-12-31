///Chat.js
////////////////////
import React, { useState, useEffect, useRef } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import styles from "./Chat.module.css";
import { useAuth } from "../../context/AuthContext";
import { useChatContext } from "../../context/ChatContext";
import { saveMessageToFirestore } from "../../services/firestoreService";
import { getOpenAIResponse } from "../../services/openaiService";

const Chat = ({ availableHeight }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef(null);

  const initializationLock = useRef(false);

  const { user, loading } = useAuth();
  const { conversationId, setConversationId, assistantId, setAssistantId, threadId, setThreadId } = useChatContext();

  const [isInitializing, setIsInitializing] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const adjustHeight = () => {
      const navbarHeight = document.querySelector("nav")?.offsetHeight || 60; // Navbar height
      const chatPageContainer = document.querySelector(`.${styles.chatPageContainer}`);
      const chatInputHeight = document.querySelector(`.${styles.chatForm}`)?.offsetHeight || 50; // Chat input form height

      if (chatPageContainer) {
        // Ensure the height accounts for both navbar and chat input
        chatPageContainer.style.height = `${window.innerHeight - navbarHeight - chatInputHeight}px`;
      }
    };

    window.addEventListener("resize", adjustHeight);
    adjustHeight(); // Initial adjustment

    return () => {
      window.removeEventListener("resize", adjustHeight);
    };
  }, []);



  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }, 10); // Slight delay for DOM to update
    }
  }, [messages, isTyping]);



  useEffect(() => {
    console.log("Messages updated:", messages);
    messages.forEach((msg, index) => {
      console.log(
        `Message at index ${index}: ${msg.content}, Sender: ${msg.senderId}`
      );
    });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      console.log("Messages updated:", messages);
    }
  }, [messages]);

  useEffect(() => {
    const chatContainer = document.querySelector(`.${styles.chatMessages}`);
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages, isTyping]);

  // Initialize conversation, assistant, and thread
  useEffect(() => {
    if (loading || !user || initializationLock.current) return;

    const initializeChat = async () => {
      try {
        initializationLock.current = true;
        setIsInitializing(true); // Start initialization loading

        console.log("Initializing assistant and thread for user:", user.firstName);

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/init`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName: user.firstName }),
        });

        if (!response.ok) {
          throw new Error("Failed to initialize assistant and thread.");
        }

        const { assistantId: newAssistantId, threadId: newThreadId } = await response.json();
        setAssistantId(newAssistantId);
        setThreadId(newThreadId);

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
      } finally {
        setIsInitializing(false); // End initialization loading
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
    setIsTyping(true); // Start typing indicator

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
              reader.cancel(); // Explicitly close the reader when done
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
      setIsTyping(false); // Stop typing indicator
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


  if (isInitializing) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading chat...</p>
      </div>
    );
  }

  return (
    <div className={styles.chatContainer} style={{ height: `${availableHeight}px` }}>
      {/* Font Size Controls */}
      <div className={styles.fontSizeControls}>
        <button
          className={styles.fontSizeButton}
          onClick={() => setFontSize((size) => Math.min(size + 2, 24))} // Increase font size, max 24px
        >
          A+
        </button>
        <button
          className={styles.fontSizeButton}
          onClick={() => setFontSize((size) => Math.max(size - 2, 12))} // Decrease font size, min 12px
        >
          A-
        </button>
        <button
          className={styles.fontSizeButton}
          onClick={() => setFontSize(16)} // Reset font size to default
        >
          Reset
        </button>
      </div>

      {/* Chat Messages */}
      <div className={styles.chatMessages} ref={chatContainerRef}>
        {/* Render messages */}
        {messages.map((msg, index) => {
          if (!msg.content || !msg.senderId) {
            console.warn(`Skipping message at index ${index}: Missing content or senderId`);
            return null;
          }

          const isBeta = msg.senderId === "Beta";
          const senderName = isBeta ? "Beta" : user?.firstName || "User";

          return (
            <div
              key={index}
              className={`${styles.chatMessage} ${isBeta ? styles.chatMessageAI : styles.chatMessageUser}`}
            >
              <strong>{senderName}:</strong> {msg.content}
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className={styles.typingMessage}>
            <span className={styles.typingIndicator}>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </div>
        )}
      </div>




      {/* Input Form */}
      <form className={styles.chatForm} onSubmit={sendMessage}>
        <input
          className={styles.chatInput}
          type="text"
          placeholder="Type a message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={isSending || isInitializing}
        />
        <button
          className={styles.chatSendButton}
          type="submit"
          disabled={isSending || isInitializing}
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );




};

export default Chat;
