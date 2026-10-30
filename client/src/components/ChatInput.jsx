import { useState } from "react";

function ChatInput({ onSend, disabled = false }) {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (!message.trim() || disabled) return;
        onSend(message);
        setMessage("");
    };

    return (
        <div className="flex border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 gap-2">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSend();
                    }
                }}
                disabled={disabled}
                placeholder="Ask ParkEase AI about parking, slots, routes, refunds..."
                className="flex-1 px-4 py-3 outline-none bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-orange-500"
            />

            <button
                onClick={handleSend}
                disabled={disabled || !message.trim()}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-orange-500/20 transition flex items-center gap-1.5"
            >
                <span>Send</span>
            </button>
        </div>
    );
}

export default ChatInput;
