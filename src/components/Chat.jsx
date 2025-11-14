
import React from "react";
import Sidebar from "./Sidebar";
import { Menu, Moon, Sun } from "lucide-react";
import chatLogo from "../assets/chat-logo/chat.png";
import Message from "./Message";
import { useTheme } from "../context/Theme";
import { useApp } from "../context/AppContext";

function Chat() {
  const { darkMode, toggleTheme } = useTheme();
  const { chat, activeChat, setSidebar } = useApp();
  const receChat = chat.find((conv) => conv.id === chat);
  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0e1203] via-[#0b2014] to-[#1a1f2e] text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Chat Section */}
      <div
        className={`flex-1 flex flex-col ${
          darkMode ? "bg-gray-900" : "bg-white"
        } relative `}
      >
        {/* Header */}
        <div
          className={`h-16 flex items-center justify-between px-6 border-b ${
            darkMode
              ? " border-white/10 backdrop-blur-xl bg-white/5 shadow-[0_0_30px_rgba(0,0,0,0.4)]"
              : "bg-white"
          } relative z-20`}
        >
          {/* Left Section */}
          {/* <div className="flex items-center gap-4"> */}
            {/* Menu */}
            <button
              className={`p-2 rounded-md ${
                darkMode
                  ? "bg-white/5 hover:bg-white/10 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                  : "bg-white"
              }`}
              onClick={() => setSidebar((prev) => !prev)}
            >
              <Menu className="text-cyan-400 w-5 h-5" />
            </button>

            {/* Logo */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-lg bg-cyan-500/40 animate-pulse"></div>
              <img
                src={chatLogo}
                alt="Chat Logo"
                className="relative w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(0,200,255,0.5)]"
              />
            </div>

            {/* Title */}
            <h1
              className="text-2xl font-bold tracking-wide bg-gradient-to-r 
                         from-cyan-400 via-blue-400 to-indigo-500 
                         bg-clip-text text-transparent font-[Outfit]
                         drop-shadow-[0_0_8px_rgba(0,200,255,0.4)]"
            >
              ChatLoom
            </h1>
          </div>

          {/* Theme Toggle */}
          <button
          onClick={toggleTheme}
            className={`p-2 rounded-md ${
              darkMode
                ? "bg-white/5 hover:bg-white/10 transition-all shadow-[0_0_10px_rgba(255,200,0,0.4)] hover:shadow-[0_0_15px_rgba(255,200,0,0.5)]"
                : "bg-white"
            }`}
          >
            {darkMode ? (
              <Sun className="text-white w-5 h-5 transition-transform duration-500 rotate-180" />
            ) : (
              <Moon className="text-yellow-400 w-5 h-5 transition-transform duration-500 rotate-0" />
            )}
          </button>
        </div>

        {/* Chat Background Layers */}
        <div className={`absolute inset-0 ${
            darkMode
              ? "bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.1),transparent_60%)]"
              : "bg-white"
          }  pointer-events-none`} />

        {/* Main Chat Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Message />
        </div>
      </div>
    </div>
  );
}

export default Chat;
