// File: openaiService.js
// =====================================

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const fetchFromAPI = async (endpoint, body) => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`API Error: ${errorMessage}`);
  }

  return response.json();
};

export const getOpenAIResponse = async (threadId, userMessage) => {
  try {
    const payload = {
      threadId,
      role: "user",
      content: userMessage.trim(),
    };
    console.log("API payload:", payload); // Debugging payload
    const response = await fetchFromAPI("api/chat", payload);
    return response.content || "No response received.";
  } catch (error) {
    console.error("Error in getOpenAIResponse:", error.message);
    throw error;
  }
};

export const sendUserMessageToOpenAI = async (threadId, userMessage) => {
  try {
    const payload = {
      threadId,
      role: "user",
      content: userMessage.trim(),
    };
    return await fetchFromAPI("api/chat", payload);
  } catch (error) {
    console.error("Error sending message to OpenAI:", error.message);
    throw error;
  }
};

