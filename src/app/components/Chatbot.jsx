"use client";
import {useState} from "react";
import {Send} from "lucide-react";

export default function Chatbot() {
    const [messages, setMessages] = useState([
        {
            type: "bot",
            text: `👋 হ্যালো! আমি ঢাকার জন্য আপনার তাপ নিরাপত্তা সহকারী। আমি আপনাকে সাহায্য করতে পারি:
      
• বর্তমান আবহাওয়ার অবস্থা  
• তাপ নিরাপত্তা টিপস এবং নির্দেশিকা  
• তাপ-সম্পর্কিত অসুস্থতা সম্পর্কে তথ্য  
• ঐতিহাসিক তাপমাত্রা ডেটা  
• জরুরি যোগাযোগ এবং নিকটস্থ সুবিধা  

আমি আজ আপনাকে কিভাবে সাহায্য করতে পারি?`
        }
    ]);

    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages([...messages, {type: "user", text: input}]);
        setInput("");
        // Here you can call your backend or API to get bot response
    };

    return (
        <div className="fixed bottom-4 right-4 w-96 bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-orange-400 text-white p-3">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold">🌡 Heat Safety Assistant</h2>
                    <div className="space-x-2 text-sm">
                        <button className="hover:underline">EN</button>
                        <button className="hover:underline">BN</button>
                    </div>
                </div>
                <p className="text-xs mt-1">
                    Current Weather in Dhaka: 26.8°C, Wind: 6.4 km/h, Partly cloudy
                </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`p-2 rounded-xl text-sm max-w-[85%] ${
                            msg.type === "bot"
                                ? "bg-white text-gray-800 self-start shadow"
                                : "bg-purple-500 text-white self-end ml-auto"
                        }`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            {/* Quick Replies */}
            <div className="p-2 flex flex-wrap gap-2 border-t">
                <button className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    🌤 বর্তমান আবহাওয়া
                </button>
                <button className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    🧊 তাপ টিপস
                </button>
                <button className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    🏥 জরুরি
                </button>
            </div>

            {/* Input */}
            <div className="flex items-center p-2 border-t bg-white">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="তাপ নিরাপত্তা সম্পর্কে জিজ্ঞাসা করুন..."
                    className="flex-1 outline-none p-2 text-sm"
                />
                <button
                    onClick={sendMessage}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-full"
                >
                    <Send size={18}/>
                </button>
            </div>
        </div>
    );
}
