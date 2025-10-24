"use client"

import {useState, useRef, useEffect} from "react"
import {Send, Cloud, X, MessageCircle} from "lucide-react"
import clinicData from "@/data/clinics.json"

interface Message {
    id: string
    type: "bot" | "user"
    content: string
    options?: Array<{ label: string; action: string }>
}

const MENU_OPTIONS = [
    {label: "🌡️ আজকের আবহাওয়া", action: "আজকের আবহাওয়া"},
    {label: "📅 ভবিষ্যতের আবহাওয়া", action: "ভবিষ্যতের আবহাওয়া"},
    {label: "📚 সচেতনতা", action: "সচেতনতা"},
    {label: "🏥 ক্লিনিক খুঁজুন", action: "ক্লিনিক খুঁজুন"},
]

const AWARENESS_OPTIONS = [
    {label: "⚡ বজ্রপাত সচেতনতা", action: "বজ্রপাত সচেতনতা"},
    {label: "⛈️ বজ্রঝড়ের লক্ষণ", action: "বজ্রঝড়ের লক্ষণ"},
    {label: "🔥 তাপপ্রবাহ সচেতনতা", action: "তাপপ্রবাহ সচেতনতা"},
    {label: "🌊 জলাবদ্ধতা সচেতনতা", action: "জলাবদ্ধতা সচেতনতা"},
]

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
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
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const fetchWeatherData = async () => {
        try {
            const API_KEY = process.env.NEXT_PUBLIC_WEATHERAPI_KEY || "demo_key"
            const city = process.env.NEXT_PUBLIC_WEATHER_LOCATION || "Dhaka" // Default to Dhaka, Bangladesh
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=1&aqi=no&alerts=no`)
            if (!response.ok) {
                throw new Error("Failed to fetch weather data")
            }
            const data = await response.json()
            return data.current
        } catch (error) {
            console.error("Weather fetch error:", error)
            return null
        }
    }

    const handleOptionClick = async (action: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            type: "user",
            content: action,
        }

        setMessages((prev) => [...prev, userMessage])
        setLoading(true)
        if (action === "আজকের আবহাওয়া") {
            const weatherData = await fetchWeatherData()
            // const icon = weatherData?.condition?.icon
            //     ? <img src={`https:${weatherData.condition.icon}`} alt="Weather icon" className="w-16 h-16 inline-block" />
            //     : '🏙️'
            let botResponse: Message
            if (weatherData) {
                botResponse = {
                    id: (Date.now() + 1).toString(),
                    type: "bot",
                    content: `🏙️ আজকের আবহাওয়া\n\n🌡️ তাপমাত্রা: ${weatherData?.temp_c}°C\n🤔 অনুভূত তাপমাত্রা: ${weatherData?.feelslike_c}°C\n☁️ অবস্থা: ${weatherData?.condition?.text?.toLowerCase()}\n💧 আর্দ্রতা: ${weatherData?.humidity}%\n💨 বায়ু গতি: ${weatherData?.wind_kph} km/h\n👁️ দৃশ্যমানতা: ${weatherData?.vis_km} km\n🔆 UV সূচক: ${weatherData?.uv}`,
                }
            } else {
                botResponse = {
                    id: (Date.now() + 1).toString(),
                    type: "bot",
                    content: "❌ আবহাওয়ার তথ্য পেতে ব্যর্থ। অনুগ্রহ করে পরে চেষ্টা করুন।",
                    options: MENU_OPTIONS,
                }
            }
            setMessages((prev) => [...prev, botResponse])
            setLoading(false)
            return
        }

        setTimeout(() => {
            let botResponse: Message

            switch (action) {
                case "ভবিষ্যতের আবহাওয়া":
                    botResponse = {
                        id: (Date.now() + 1).toString(),
                        type: "bot",
                        content: `📅 আগামী দিনের পূর্বাভাস (ঢাকা)\n\n📆 আগামীকাল: 26-30°C, বৃষ্টির সম্ভাবনা 40%\n📆 পরের দিন: 25-29°C, মেঘলা\n📆 তিন দিন পর: 27-31°C, রৌদ্রোজ্জ্বল`,
                    }
                    break

                case "সচেতনতা":
                    botResponse = {
                        id: (Date.now() + 1).toString(),
                        type: "bot",
                        content: "সচেতনতা বিষয় বেছে নিন:",
                        options: AWARENESS_OPTIONS,
                    }
                    break

                case "বজ্রপাত সচেতনতা":
                    botResponse = {
                        id: (Date.now() + 1).toString(),
                        type: "bot",
                        content: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Thunderstorm1.jpg-OUybWc4Kv4qwSroGyGeJRhQrgqagqo.jpeg',
                    }
                    break
                case "বজ্রঝড়ের লক্ষণ":
                    botResponse = {
                        id: (Date.now() + 1).toString(),
                        type: "bot",
                        content: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Thunderstorm2.jpg-rQgYSlyJaDT9En4CsVnqqs20QR6ivw.jpeg',
                    }
                    break
                case "তাপপ্রবাহ সচেতনতা":
                    botResponse = {
                        id: (Date.now() + 1).toString(),
                        type: "bot",
                        content: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Heatwave.jpg-mn6RPDy0fFeA0ggZnym3NovTJj5yfp.jpeg',
                    }
                    break
                case "জলাবদ্ধতা সচেতনতা":
                    botResponse = {
                        id: (Date.now() + 1).toString(),
                        type: "bot",
                        content: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/waterlogging.jpg-UoUAsOj2STR7YYwUbF2ZzW87UXDZpO.jpeg',
                    }
                    break
                case "ক্লিনিক খুঁজুন":

                    // Pick random 4–5
                    const sample = clinicData.sort(() => 0.5 - Math.random()).slice(0, 5)

                    // Format message
                    const formatted = [
                        "🏥 ঢাকা শহরের ক্লিনিক\n",
                        ...sample.map((c, i) => {
                            const name = c?.name
                            const houseNumber = c?.housenumber
                            const street = c?.street
                            const parts = [];
                            if (street) parts.push(`Road: ${street}`);
                            if (houseNumber) parts.push(`House: ${houseNumber}`);

                            return `${i + 1}. ${name}${parts.length ? `\n   📍 ${parts.join(', ')}` : ''}`;
                        }),
                    ].join("\n\n")
                    botResponse = {
                        id: (Date.now() + 1).toString(),
                        type: "bot",
                        content: formatted,
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
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-40 hover:scale-110"
                aria-label="Open chat"
            >
                {isOpen ? <X className="w-6 h-6"/> : <MessageCircle className="w-6 h-6"/>}
            </button>

            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 w-96 h-96 bg-white rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4">
                        <div className="flex items-center gap-3">
                            <Cloud className="w-5 h-5"/>
                            <div>
                                <h1 className="text-lg font-bold">মেঘবন্ধু বট</h1>
                                <p className="text-xs text-blue-100">আবহাওয়া ও সচেতনতা সহায়ক</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
                        {messages.map((message) => (
                            <div key={message.id}
                                 className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                        message.type === "user"
                                            ? "bg-blue-600 text-white rounded-br-none"
                                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                                    }`}
                                >
                                    {message.content.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ? (
                                        <img
                                            src={message.content}
                                            alt="Bot message"
                                            className="rounded-xl max-w-xs border border-gray-200 shadow-sm"
                                        />
                                    ) : (
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                    )}

                                    {message.options && (
                                        <div className="mt-2 space-y-1">
                                            {message.options.map((option, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleOptionClick(option.action)}
                                                    disabled={loading}
                                                    className={`w-full text-left px-2 py-1 rounded text-xs font-medium transition-colors ${
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
                                <div
                                    className="bg-white text-gray-800 border border-gray-200 px-3 py-2 rounded-lg rounded-bl-none">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{animationDelay: "0.1s"}}
                                        ></div>
                                        <div
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{animationDelay: "0.2s"}}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef}/>
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-200 p-3 bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="বার্তা লিখুন..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                disabled={loading}
                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={loading || !input.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                            >
                                <Send className="w-4 h-4"/>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
