import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/Theme";
import { motion } from "framer-motion";
import { Send } from "lucide-react"; 

const Message = () => {
  const { darkMode } = useTheme();
  const {
    getCurrentChat,
    activeChat,
    sendMessageToOpenAI,
    updateChat,
    loading,
  } = useApp();

  const currentChat = getCurrentChat();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim() || !activeChat || isSending || loading) return;

    const userText = input.trim();
    setInput("");

    // Update chat title if it's the first message
    if (currentChat && currentChat.message.length === 0) {
      // Use first 30 chars of message as title
      const title = userText.length > 30 ? userText.substring(0, 30) + "..." : userText;
      updateChat(activeChat, title);
    }

    try {
      setIsSending(true);
      await sendMessageToOpenAI(userText);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSending(false);
    }
  };

  // Safe message text formatting function
  const formatMessageText = (text) => {
    if (!text) return [""];
    
    // Ensure text is a string
    const safeText = String(text || "");
    
    return safeText.split('\n').map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </span>
    ));
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat?.message]);

  if (!currentChat) {
    return (
      <div
        className={`flex items-center justify-center h-full text-center text-lg ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Start a new chat to begin conversation 💬
      </div>
    );
  }

  // Ensure messages array exists and is valid
  const messages = Array.isArray(currentChat.message) ? currentChat.message : [];

  return (
    <div className="flex flex-col h-full">
      {/* Messages section */}
      <div
        className={`flex-1 overflow-y-auto px-6 py-4 space-y-4 ${
          darkMode ? "text-white/90" : "text-black"
        }`}
      >
        {messages.map((msg, index) => {
          // Validate message object
          if (!msg || typeof msg !== 'object') {
            console.warn('Invalid message object at index:', index, msg);
            return null;
          }

          const messageText = msg.text || "";
          const sender = msg.sender || "user";

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-md ${
                  sender === "user"
                    ? darkMode
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                      : "bg-blue-500 text-white"
                    : darkMode
                    ? "bg-white/10 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {formatMessageText(messageText)}
              </div>
            </motion.div>
          );
        })}

        {(isSending || loading) && (
          <div className="flex justify-start">
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
              darkMode ? "bg-white/10 text-white" : "bg-gray-200 text-black"
            }`}>
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input section */}
      <div
        className={`flex items-center gap-3 border-t p-4 ${
          darkMode
            ? "bg-[#0b1120]/90 border-white/10"
            : "bg-white border-gray-200"
        }`}
      >
        <input
  type="text"
  placeholder="Type a new message..."
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && handleSend()}
  disabled={isSending || loading}
  className={`flex-1 px-3 py-1.5 rounded-full text-sm outline-none transition-all duration-200
    ${darkMode
      ? "bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:border-purple-400 focus:bg-white/20"
      : "bg-gray-100 text-black placeholder-gray-600 border border-gray-300 focus:border-blue-400 focus:bg-gray-200"
    } ${(isSending || loading) ? 'opacity-50 cursor-not-allowed' : 'shadow-sm hover:shadow-md'}
  `}
/>

        <button
  onClick={handleSend}
  disabled={isSending || loading || !input.trim()}
  className={`relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium 
    transition-all duration-300 shadow-md overflow-hidden group
    ${(isSending || loading || !input.trim()) 
      ? 'opacity-50 cursor-not-allowed' 
      : 'cursor-pointer'}
    ${darkMode 
      ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]"
      : "bg-blue-500 text-white hover:bg-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.4)]"}
  `}
>
  {/* Ripple effect */}
  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"></span>

  {/* Icon + text */}
  {isSending || loading ? (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
      <span>Sending...</span>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Send className="w-4 h-4" />
      <span className="hidden sm:inline">Send</span>
    </div>
  )}
</button>

      </div>
    </div>
  );
};

export default Message;