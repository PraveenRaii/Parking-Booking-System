import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import { askAI } from "../services/ai";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";

function HelpCenter() {

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "👋 Welcome to ParkEase AI.\nHow can I help you today?"
        }
    ]);

    const [input, setInput] = useState("");

    const bottomRef = useRef(null);

    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);

    const sendMessage = async () => {

        if (!input.trim()) return;

        const userMessage = input;

        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: userMessage
            },
            {
                sender: "bot",
                text: "Typing..."
            }
        ]);

        setInput("");

        try {

            const reply = await askAI(userMessage);

            setMessages((prev) => {

                const updated = [...prev];

                updated.pop();

                updated.push({
                    sender: "bot",
                    text: reply
                });

                return updated;

            });

        }

        catch (err) {

            console.log(err);

            setMessages((prev) => {

                const updated = [...prev];

                updated.pop();

                updated.push({

                    sender: "bot",

                    text: "❌ AI is currently unavailable."

                });

                return updated;

            });

        }

    };

    return (

        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">

                <div className="max-w-3xl mx-auto">

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">

                        {/* Header */}

                        <div className="bg-blue-600 text-white p-5 flex justify-between items-center">

                            <div>

                                <h1 className="text-2xl font-bold">

                                    🤖 ParkEase AI Assistant

                                </h1>

                                <p className="text-sm">

                                    Ask anything about parking.

                                </p>

                            </div>

                            <button

                                onClick={() =>
                                    setMessages([
                                        {
                                            sender: "bot",
                                            text: "👋 Welcome to ParkEase AI.\nHow can I help you today?"
                                        }
                                    ])
                                }

                                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"

                            >

                                Clear

                            </button>

                        </div>

                        {/* Messages */}

                        <div className="h-[500px] overflow-y-auto p-5 space-y-4">

                            {

                                messages.map((msg, index) => (

                                    <div

                                        key={index}

                                        className={`flex ${

                                            msg.sender === "user"

                                                ?

                                                "justify-end"

                                                :

                                                "justify-start"

                                            }`}

                                    >

                                        {

                                            msg.sender === "bot" && (

                                                <img

                                                    src="https://api.dicebear.com/7.x/bottts/svg?seed=ParkEase"

                                                    alt="AI"

                                                    className="w-10 h-10 mr-2 rounded-full"

                                                />

                                            )

                                        }

                                        <div

                                            className={`max-w-sm px-4 py-3 rounded-2xl whitespace-pre-wrap

                                            ${

                                                msg.sender === "user"

                                                    ?

                                                    "bg-blue-600 text-white"

                                                    :

                                                    "bg-gray-200 dark:bg-gray-700 dark:text-white"

                                            }`}

                                        >

                                            {msg.text}

                                        </div>

                                        {

                                            msg.sender === "user" && (

                                                <img

                                                    src="https://api.dicebear.com/7.x/initials/svg?seed=User"

                                                    alt="User"

                                                    className="w-10 h-10 ml-2 rounded-full"

                                                />

                                            )

                                        }

                                    </div>

                                ))

                            }

                            <div ref={bottomRef}></div>

                        </div>

                        {/* Suggested Questions */}

                        <div className="border-t p-4 flex flex-wrap gap-2">

                            <button

                                onClick={() => setInput("How can I book parking?")}

                                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-full"

                            >

                                Book Parking

                            </button>

                            <button

                                onClick={() => setInput("How can I cancel booking?")}

                                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-full"

                            >

                                Cancel Booking

                            </button>

                            <button

                                onClick={() => setInput("Payment failed")}

                                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-full"

                            >

                                Payment Issue

                            </button>

                            <button

                                onClick={() => setInput("Refund policy")}

                                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-full"

                            >

                                Refund

                            </button>

                        </div>

                        {/* Input */}

                        <div className="flex border-t">

                            <input

                                type="text"

                                value={input}

                                onChange={(e) =>
                                    setInput(e.target.value)
                                }

                                onKeyDown={(e) => {

                                    if (e.key === "Enter") {

                                        sendMessage();

                                    }

                                }}

                                placeholder="Type your message..."

                                className="flex-1 p-4 outline-none dark:bg-gray-800 dark:text-white"

                            />

                            <button

                                onClick={sendMessage}

                                className="bg-blue-600 hover:bg-blue-700 text-white px-8"

                            >

                                Send

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </>

    );

}

export default HelpCenter;