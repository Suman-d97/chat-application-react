


import { MessageSquare, Plus, Trash2, User, LogOut } from "lucide-react";
import { useTheme } from "../context/Theme";
import { useApp } from "../context/AppContext";
import { useEffect, useState } from "react";
import { supabase } from "../config/SupabaseClient";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const { chat, setActiveChat, newChat, delChat, clearChat, sidebar } = useApp();

  // Fetch user on mount and listen for login/logout
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    clearChat(); // Clear chat history
    navigate("/auth");
    window.reload()
  };

  return (
    <div
      className={` ${sidebar ? "w-64" : "w-0"} ${
        darkMode
          ? "bg-[#0b1120]/80 backdrop-blur-2xl border-r border-white/10 text-white flex flex-col justify-between shadow-[inset_0_0_30px_rgba(59,130,246,0.1)]"
          : "bg-white text-black border-r border-gray-200 flex flex-col justify-between"
      } transition-all duration-500`}
    >
      {/* Top Section: New Chat */}
      <div className={`p-4 border-b ${darkMode ? "border-white/10" : "border-gray-200"}`}>
        <button
          onClick={newChat}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer ${
            darkMode
              ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white animate-gradient-x"
              : "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 text-black"
          } font-semibold transition-all duration-300`}
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 custom-scrollbar">
        {chat.length === 0 ? (
          <div className={`text-center text-sm italic py-6 ${darkMode ? "text-white/40" : "text-gray-500"}`}>
            Let’s start a conversation
          </div>
        ) : (
          chat.map((conv) => (
            <div
              key={conv.id}
              className={`group flex items-center justify-between gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 border border-transparent ${
                darkMode
                  ? "bg-white/5 hover:bg-white/10 hover:border-cyan-400/30"
                  : "bg-gray-100 hover:bg-gray-200 hover:border-blue-400/30"
              }`}
              onClick={() => setActiveChat(conv.id)}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className={`${darkMode ? "text-cyan-400" : "text-blue-500"} w-5 h-5`} />
                <span
                  className={`text-sm font-medium transition-colors ${
                    darkMode ? "text-white/90 group-hover:text-cyan-300" : "text-black group-hover:text-blue-600"
                  }`}
                >
                  {conv.title}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  delChat(conv.id);
                }}
                className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                  darkMode ? "text-cyan-400 hover:text-red-400" : "text-blue-500 hover:text-red-500"
                }`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer: User / Logout / Clear All */}
      <div
        className={`p-4 border-t space-y-4 backdrop-blur-md ${
          darkMode ? "bg-white/5 border-white/10" : "bg-gray-100 border-gray-200"
        }`}
      >
        {/* Clear All Chats */}
        {chat.length > 0 && (
          <button
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-300 font-medium cursor-pointer ${
              darkMode
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
            onClick={clearChat}
          >
            <Trash2 size={16} />
            <span>Clear All Chats</span>
          </button>
        )}

        {/* User Info / Login */}
        {user ? (
          <div
            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
              darkMode ? "bg-white/10 hover:bg-white/20 border-white/10" : "bg-gray-200 hover:bg-gray-300 border-gray-300"
            }`}
          >
            <img
              src={user.user_metadata?.avatar_url || "https://ui-avatars.com/api/?name=" + user.email}
              alt="User"
              className="w-12 h-12 rounded-full border border-white/20 shadow-md"
            />
            <div className="text-center">
              <p className={`text-sm font-medium ${darkMode ? "text-white/90" : "text-black"}`}>
                {user.user_metadata?.full_name || user.user_metadata?.username || "My Profile"}
              </p>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 text-sm font-medium mt-2 px-3 py-1 rounded-lg ${
                darkMode ? "bg-red-500/20 hover:bg-red-500/30 text-red-400" : "bg-red-100 hover:bg-red-200 text-red-600"
              } transition-all`}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        ) : (
          <div
            onClick={() => navigate("/auth")}
            className={`flex items-center gap-3 p-3 rounded-xl border shadow-inner cursor-pointer group transition-all duration-300 ${
              darkMode ? "bg-white/10 hover:bg-white/20 border-white/10" : "bg-gray-200 hover:bg-gray-300 border-gray-300"
            }`}
          >
            <User className={`w-6 h-6 ${darkMode ? "text-cyan-400" : "text-blue-500"}`} />
            <span
              className={`text-sm font-medium ${
                darkMode ? "text-white/80 group-hover:text-cyan-300" : "text-black group-hover:text-blue-600"
              }`}
            >
              Login / Signup
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
