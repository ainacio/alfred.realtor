///ChatContext.js
//////////////////////////
import React, { createContext, useContext, useState } from "react";

// Create the context
const ChatContext = createContext();

// Context provider
export const ChatProvider = ({ children }) => {
  const [conversationId, setConversationId] = useState(null);
  const [assistantId, setAssistantId] = useState(null); // Add assistantId state
  const [threadId, setThreadId] = useState(null); // Add threadId state

  return (
    <ChatContext.Provider
      value={{
        conversationId,
        setConversationId,
        assistantId,
        setAssistantId, // Provide setter for assistantId
        threadId,
        setThreadId, // Provide setter for threadId
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Hook for consuming the context
export const useChatContext = () => useContext(ChatContext);
