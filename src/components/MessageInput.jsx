

import { Send } from "lucide-react";
import React from "react";

const MessageInput = () => {
  return (
    <div className="border-t border-white/10 bg-gradient-to-t from-black/40 via-gray-900/40 to-gray-800/20 backdrop-blur-xl p-4">
      <div className="max-w-3xl mx-auto">
        <div
          className={`relative flex items-center gap-3 border border-white/10 rounded-2xl px-4 py-3 shadow-[0_0_20px_rgba(255,255,255,0.05)] bg-white/5 backdrop-blur-xl transition-all focus-within:shadow-[0_0_25px_rgba(59,130,246,0.3)]`}
        >
          {/* Input Field */}
          <textarea
            className={`flex-1 resize-none bg-transparent text-white placeholder-gray-400 border-0 outline-none max-h-32 text-sm md:text-base tracking-wide leading-relaxed`}
            placeholder="Message NovaChat..."
            rows={1}
            style={{ height: "auto", minHeight: "24px" }}
          />

          {/* Send Button */}
          <button
            className={`p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 transition-all shadow-[0_0_10px_rgba(59,130,246,0.4)] hover:shadow-[0_0_18px_rgba(59,130,246,0.5)] active:scale-95`}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
