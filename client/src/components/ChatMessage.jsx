function ChatMessage({ sender, text }) {
    return (
        <div
            className={`flex ${
                sender === "user"
                    ? "justify-end"
                    : "justify-start"
            }`}
        >
            {sender === "bot" && (
                <img
                    src="https://api.dicebear.com/7.x/bottts/svg?seed=ParkEase"
                    alt="Bot"
                    className="w-10 h-10 mr-2 rounded-full"
                />
            )}

            <div
                className={`max-w-sm px-4 py-3 rounded-2xl whitespace-pre-wrap ${
                    sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                }`}
            >
                {text}
            </div>

            {sender === "user" && (
                <img
                    src="https://api.dicebear.com/7.x/initials/svg?seed=User"
                    alt="User"
                    className="w-10 h-10 ml-2 rounded-full"
                />
            )}
        </div>
    );
}

export default ChatMessage;