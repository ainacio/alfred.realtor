export const getOpenAIResponse = async (userMessage) => {
    try {
      const response = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userMessage }],
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch OpenAI response");
      }
  
      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error("Error fetching OpenAI response:", error);
      return "Unable to process your request. Please try again.";
    }
  };
  