import { createContext, useContext, useState, useEffect } from "react";
import config from "../config/Config";

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [chat, setChat] = useState(() => {
    const saved = localStorage.getItem("chat");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeChat, setActiveChat] = useState(null);
  const [sidebar, setSidebar] = useState(true);
  const [loading, setLoading] = useState(false);

  // Save chats to localStorage
  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(chat));
  }, [chat]);

  // New Chat
  const newChat = () => {
    const id = Date.now();
    const newConv = { id, title: "New Chat", message: [] };
    setChat([newConv, ...chat]);
    setActiveChat(id);
  };

  // Delete Chat
  const delChat = (id) => {
    setChat(chat.filter((c) => c.id !== id));
    if (activeChat === id) setActiveChat(null);
  };

  // Clear All Chats
  const clearChat = () => {
    setChat([]);
    setActiveChat(null);
    localStorage.removeItem("chat");
  };

  // Update Chat Title
  const updateChat = (id, title) => {
    setChat((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  };

  // Add Message
 // In your AppContext, update the addMessage function:

// Add Message (with validation)
const addMessage = (id, message) => {
  setChat((prev) =>
    prev.map((c) =>
      c.id === id 
        ? { 
            ...c, 
            message: [
              ...c.message, 
              {
                sender: message.sender || "user",
                text: message.text || "",
                timestamp: message.timestamp || Date.now()
              }
            ] 
          } 
        : c
    )
  );
};

  // Get Current Chat
  const getCurrentChat = () => chat.find((c) => c.id === activeChat);


  // ✅ Send message to Google Gemini API (Fixed Version)
const sendMessageToOpenAI = async (userMessage) => {
  const current = getCurrentChat();
  if (!current) return;

  addMessage(current.id, { sender: "user", text: userMessage });
  setLoading(true);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.GEMINI_MODEL}:generateContent?key=${config.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }]
            }
          ]
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      addMessage(current.id, {
        sender: "bot",
        text: "⚠️ Error: " + (data.error?.message || "Failed to get response from Gemini"),
      });
      return;
    }

    // Extract the response text from Gemini API
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                  "Sorry, I couldn't process that request.";

    addMessage(current.id, { sender: "bot", text: reply });
    
  } catch (err) {
    console.error("Network error:", err);
    addMessage(current.id, {
      sender: "bot",
      text: "⚠️ Network error. Please check your connection and API key.",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <AppContext.Provider
      value={{
        chat,
        activeChat,
        sidebar,
        loading,
        setSidebar,
        setActiveChat,
        newChat,
        delChat,
        clearChat,
        updateChat,
        addMessage,
        getCurrentChat,
        sendMessageToOpenAI, // same name for compatibility
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
