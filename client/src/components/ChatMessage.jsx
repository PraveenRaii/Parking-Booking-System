function ChatMessage({ sender, text }) {
    return (
        <div
            className={`flex items-end gap-2.5 ${
                sender === "user" ? "justify-end" : "justify-start"
            }`}
        >
            {sender === "bot" && (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0">
                    🤖
                </div>
            )}

            <div
                className={`max-w-[78%] md:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                    sender === "user"
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-xs shadow-orange-500/20"
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-orange-100 dark:border-slate-700"
                }`}
            >
                {text}
            </div>

            {sender === "user" && (
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 text-sm font-bold shrink-0">
                    👤
                </div>
            )}
        </div>
    );
}

export default ChatMessage;
