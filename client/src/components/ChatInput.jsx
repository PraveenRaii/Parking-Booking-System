import { useState } from "react";

function ChatInput({ onSend }) {

    const [message, setMessage] = useState("");

    const handleSend = () => {

        if (!message.trim()) return;

        onSend(message);

        setMessage("");

    };

    return (

        <div className="flex border-t">

            <input

                type="text"

                value={message}

                onChange={(e) => setMessage(e.target.value)}

                onKeyDown={(e) => {

                    if (e.key === "Enter") {

                        handleSend();

                    }

                }}

                placeholder="Type your message..."

                className="flex-1 p-4 outline-none dark:bg-gray-800 dark:text-white"

            />

            <button

                onClick={handleSend}

                className="bg-blue-600 hover:bg-blue-700 text-white px-8"

            >

                Send

            </button>

        </div>

    );

}

export default ChatInput;