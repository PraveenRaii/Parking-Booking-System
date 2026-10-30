import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import { askAI } from "../services/ai";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { FaTrash, FaRobot } from "react-icons/fa";

function HelpCenter() {
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "👋 Welcome to ParkEase AI Assistant!\nHow can I help you today? Ask me about parking spots, booking, payment, cancellations, or directions."
        }
    ]);
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleSendMessage = async (text) => {
        if (!text || !text.trim() || loading) return;

        const userMessage = text.trim();

        setMessages((prev) => [
            ...prev,
            { sender: "user", text: userMessage }
        ]);

        try {
            setLoading(true);
            const reply = await askAI(userMessage);

            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: reply || "I am here to assist with all your parking needs." }
            ]);
        } catch (err) {
            console.log("handleSendMessage error:", err);
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "ParkEase AI is here to help! You can check available slots directly on the home page or book with instant confirmation."
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const suggested = [
        "How can I book parking?",
        "How can I cancel booking?",
        "What payment methods are supported?",
        "How do I navigate to my booked spot?",
        "How do refunds work?"
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-orange-100 dark:border-slate-700 overflow-hidden flex flex-col h-[700px]">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-5 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl text-xl">
                                    <FaRobot />
                                </div>
                                <div>
                                    <h1 className="text-xl font-black tracking-tight">ParkEase AI Assistant</h1>
                                    <p className="text-xs text-orange-100">Instant answers 24/7 for all parking queries</p>
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    setMessages([
                                        {
                                            sender: "bot",
                                            text: "👋 Welcome to ParkEase AI Assistant!\nHow can I help you today?"
                                        }
                                    ])
                                }
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-bold transition"
                                title="Clear conversation"
                            >
                                <FaTrash size={12} />
                                <span>Clear</span>
                            </button>
                        </div>

                        {/* Messages Box */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
                            {messages.map((msg, index) => (
                                <ChatMessage key={index} sender={msg.sender} text={msg.text} />
                            ))}

                            {loading && (
                                <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 dark:text-orange-400 pl-11">
                                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" />
                                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.4s]" />
                                    <span>ParkEase AI is thinking...</span>
                                </div>
                            )}

                            <div ref={bottomRef} />
                        </div>

                        {/* Suggested Chips */}
                        <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap gap-2 shrink-0">
                            {suggested.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSendMessage(item)}
                                    disabled={loading}
                                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-50 dark:bg-slate-700 text-orange-700 dark:text-orange-300 hover:bg-orange-500 hover:text-white transition border border-orange-200 dark:border-slate-600 disabled:opacity-50"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <ChatInput onSend={handleSendMessage} disabled={loading} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default HelpCenter;
