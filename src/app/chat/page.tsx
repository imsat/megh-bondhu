"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Cloud } from "lucide-react"

interface Message {
    id: string
    type: "bot" | "user"
    content: string
    options?: Array<{ label: string; action: string }>
}

const MENU_OPTIONS = [
    { label: "🌡️ আজকের আবহাওয়া", action: "current_weather" },
    { label: "📅 ভবিষ্যতের আবহাওয়া", action: "forecast" },
    { label: "📚 সচেতনতা", action: "awareness" },
    { label: "🏥 ক্লিনিক খুঁজুন", action: "clinics" },
    // { label: "❓ FAQs", action: "faqs" },
]

const AWARENESS_OPTIONS = [
    { label: "🌊 বন্যা সচেতনতা", action: "flood" },
    { label: "🌪️ ঘূর্ণিঝড় সচেতনতা", action: "cyclone" },
    { label: "🔥 তাপপ্রবাহ সচেতনতা", action: "heatwave" },
]

const FAQ_OPTIONS = [
    { label: "মেঘবন্ধু কি?", action: "faq_about" },
    { label: "ডেটা কোথা থেকে আসে?", action: "faq_data" },
    { label: "কিভাবে যোগাযোগ করব?", action: "faq_contact" },
]

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            type: "bot",
            content: "স্বাগতম! 👋 আমি মেঘবন্ধু বট। আপনি কী জানতে চান?",
            options: MENU_OPTIONS,
        },
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleOptionClick = async (action: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            type: "user",
            content: action,
        }

        setMessages((prev) => [...prev, userMessage])
        setLoading(true)

        // Simulate bot response delay
        setTimeout(() => {
            let botResponse: Message

            switch (action) {
                case "current_weather":
                    botResponse = {
                        id: (Date.now() + 1).toString(),
                        type: "bot",
                        content: `🏙️ ঢাকার আবহাওয়া\n\n🌡️ তাপমাত্রা: 28°C\n☁️ অবস্থা: আংশিক মেঘলা\n💧 আর্দ্রতা: 72%\n💨 বায়ু গতি: 12 km/h`,
                    }
                    break

                case "forecast":
                    botResponse = {
                        id: (Date.now() + 1).toString(),
                        type: "bot",
                        content: `📅 আগামী দিনের পূর্বাভাস (ঢাকা)\n\n📆 আগামীকাল: 26-30°C, বৃষ্টির সম্ভাবনা 40%\n📆 পরের দিন: 25-29°C, মেঘলা\n📆 তিন দিন পর: 27-31°C, রৌদ্রোজ্জ্বল`,
                    }
                    break

                case "awareness":
                    botResponse = {
                        id: (Date.now() + 1).toString(),
                        type: "bot",
                        content: "সচেতনতা বিষয় বেছে নিন:",
                        options: AWARENESS_OPTIONS,
                    }
                    break

                case "flood":
                    botResponse = {
                        id: (Date.now() + 1).toString(),
                        type: "bot",
                        content: `📘 বন্যা সচেতনতা গাইড\n\n✓ নিরাপদ স্থানে যান\n✓ জরুরি সামগ্রী প্রস্তুত রাখুন\n✓ স্থানীয় কর্তৃপক্ষের নির্দেশনা অনুসরণ করুন\n✓ পরিবারের সাথে যোগাযোগ রাখুন`,
                    }
                    break

                case "cyclone":
                    botResponse = {
                        id: (Date.now() + 1).toString(),
                        type: "bot",
                        content: `📘 ঘূর্ণিঝড় সচেতনতা গাইড\n\n✓ ঘরের ভিতরে থাকুন\n✓ জানালা এবং দরজা বন্ধ করুন\n✓ শক্তিশালী বাতাস থেকে দূরে থাকুন\n✓ জরুরি সেবা নম্বর সংরক্ষণ করুন`,
                    }
                    break

                case "heatwave":
                    botResponse = {
                        id: (Date.now() + 1).toString(),
                        type: "bot",
                        content: `📘 তাপপ্রবাহ সচেতনতা গাইড\n\n✓ প্রচুর পানি পান\n✓ হালকা রঙের পোশাক পরুন\n✓ দুপুরে বাইরে যাওয়া এড়িয়ে চলুন\n✓ বয়স্ক এবং শিশুদের যত্ন নিন`,
                    }
                    break

                case "clinics":
                    botResponse = {
                        id: (Date.now() + 1).toString(),
                        type: "bot",
                        content: `🏥 ঢাকা শহরের ক্লিনিক\n\n1. ঢাকা মেডিকেল কলেজ হাসপাতাল\n   📍 শাহবাগ, ঢাকা\n   ☎️ +880-2-9661051\n\n2. বারডেম জেনারেল হাসপাতাল\n   📍 পান্থপথ, ঢাকা\n   ☎️ +880-2-8611881\n\n3. ইউনাইটেড হাসপাতাল\n   📍 গুলশান, ঢাকা\n   ☎️ +880-2-9884400`,
                    }
                    break

                case "faqs":
                    botResponse = {
                        id: (Date.now() + 1).toString(),
                        type: "bot",
                        content: "FAQs নির্বাচন করুন:",
                        options: FAQ_OPTIONS,
                    }
                    break

                case "faq_about":
                    botResponse = {
                        id: (Date.now() + 1).toString(),
                        type: "bot",
                        content: `🌐 মেঘবন্ধু সম্পর্কে\n\nমেঘবন্ধু হলো একটি আবহাওয়া তথ্য ও সচেতনতা প্ল্যাটফর্ম যা আপনাকে রিয়েল-টাইম আবহাওয়া আপডেট এবং প্রাকৃতিক দুর্যোগ সম্পর্কে সচেতনতা প্রদান করে।`,
                    }
                    break

                case "faq_data":
                    botResponse = {
                        id: (Date.now() + 1).toString(),
                        type: "bot",
                        content: `📊 ডেটা উৎস\n\nআমাদের আবহাওয়া তথ্য আসে:\n✓ OpenWeather API\n✓ আন্তর্জাতিক আবহাওয়া সংস্থা\n✓ স্থানীয় আবহাওয়া কেন্দ্র`,
                    }
                    break

                case "faq_contact":
                    botResponse = {
                        id: (Date.now() + 1).toString(),
                        type: "bot",
                        content: `☎️ যোগাযোগ করুন\n\nইমেইল: support@meghbondhu.com\nফোন: +880-2-XXXXXXXX\nওয়েবসাইট: www.meghbondhu.com`,
                    }
                    break

                default:
                    botResponse = {
                        id: (Date.now() + 1).toString(),
                        type: "bot",
                        content: "আমি বুঝতে পারিনি। অনুগ্রহ করে মেনু থেকে একটি বিকল্প বেছে নিন।",
                        options: MENU_OPTIONS,
                    }
            }

            setMessages((prev) => [...prev, botResponse])
            setLoading(false)
        }, 500)
    }

    const handleSendMessage = () => {
        if (input.trim()) {
            const userMessage: Message = {
                id: Date.now().toString(),
                type: "user",
                content: input,
            }

            setMessages((prev) => [...prev, userMessage])
            setInput("")
            setLoading(true)

            setTimeout(() => {
                const botResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    type: "bot",
                    content: "আমি বুঝতে পারিনি। অনুগ্রহ করে মেনু থেকে একটি বিকল্প বেছে নিন।",
                    options: MENU_OPTIONS,
                }

                setMessages((prev) => [...prev, botResponse])
                setLoading(false)
            }, 500)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
            <div className="w-full max-w-2xl h-screen max-h-screen md:max-h-[600px] flex flex-col shadow-2xl rounded-lg overflow-hidden bg-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4">
                    <div className="flex items-center gap-3">
                        <Cloud className="w-6 h-6" />
                        <div>
                            <h1 className="text-xl font-bold">মেঘবন্ধু বট</h1>
                            <p className="text-sm text-blue-100">আবহাওয়া ও সচেতনতা সহায়ক</p>
                        </div>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                                    message.type === "user"
                                        ? "bg-blue-600 text-white rounded-br-none"
                                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                                }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                                {message.options && (
                                    <div className="mt-3 space-y-2">
                                        {message.options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleOptionClick(option.action)}
                                                disabled={loading}
                                                className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                                                    message.type === "user"
                                                        ? "bg-blue-500 border border-blue-400 text-white hover:bg-blue-600 disabled:opacity-50"
                                                        : "bg-gray-100 border border-gray-300 text-gray-800 hover:bg-gray-200 disabled:opacity-50"
                                                }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-lg rounded-bl-none">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.1s" }}
                                    ></div>
                                    <div
                                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.2s" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 p-4 bg-white">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="বার্তা লিখুন..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            disabled={loading}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={loading || !input.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
