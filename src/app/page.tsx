"use client"

import { useState, useEffect } from "react"
import {Sun, Leaf, MapPin, FileText, ArrowLeft, Calendar, Thermometer, CloudRain, Wind, Gauge, Eye, X, Download, ExternalLink,} from "lucide-react"
import { translations, type Language } from "@/lib/translations"
import rainfallData from "@/data/rainfall.json"
import temperatureData from "@/data/temperature.json"
interface WeatherData {
    temperature: number
    feelsLike: number
    humidity: number
    windSpeed: number
    pressure: number
    visibility: number
    uvIndex: number
    description: string
    icon: string
}

interface HourlyForecast {
    time: string
    temperature: number
    condition: string
    icon: string
    chanceOfRain: number
}

interface ForecastData {
    current: WeatherData
    hourly: HourlyForecast[]
}

export default function MeghBondhuApp() {
    const [language, setLanguage] = useState<Language>("bn")
    const [currentView, setCurrentView] = useState<
        "home" | "todaysWeather" | "futureWeather" | "dateSelection" | "temperatureDetail" | "awareness" | "clinic"
    >("home")
    const [selectedYear, setSelectedYear] = useState<string>("")
    const [selectedMonth, setSelectedMonth] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<string>("")
    const [todaysWeather, setTodaysWeather] = useState<WeatherData | null>(null)
    const [forecastData, setForecastData] = useState<ForecastData | null>(null)
    const [weatherLoading, setWeatherLoading] = useState(false)
    const [weatherError, setWeatherError] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState<{ src: string; title: string } | null>(null)
    const t = translations[language]

    const fetchTodaysWeather = async () => {
        setWeatherLoading(true)
        setWeatherError(null)

        try {
            const API_KEY = process.env.NEXT_PUBLIC_WEATHERAPI_KEY || "demo_key"
            const city = process.env.NEXT_PUBLIC_WEATHER_LOCATION || "Dhaka" // Default to Dhaka, Bangladesh

            const response = await fetch(
                `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=1&aqi=no&alerts=no`,
            )

            if (!response.ok) {
                throw new Error("Weather data unavailable")
            }

            const data = await response.json()

            const currentWeather: WeatherData = {
                temperature: Math.round(data.current.temp_c),
                feelsLike: Math.round(data.current.feelslike_c),
                humidity: data.current.humidity,
                windSpeed: Math.round(data.current.wind_kph),
                pressure: Math.round(data.current.pressure_mb),
                visibility: Math.round(data.current.vis_km),
                uvIndex: Math.round(data.current.uv),
                description: data.current.condition.text.toLowerCase(),
                icon: data.current.condition.icon,
            }

            const hourly: HourlyForecast[] = data.forecast.forecastday[0].hour.map((hour: any) => ({
                time: hour.time,
                temperature: Math.round(hour.temp_c),
                condition: hour.condition.text,
                icon: hour.condition.icon,
                chanceOfRain: hour.chance_of_rain,
            }))

            setTodaysWeather(currentWeather)
            setForecastData({
                current: currentWeather,
                hourly: hourly,
            })
        } catch (error) {
            console.error("Weather fetch error:", error)
            setWeatherError("Unable to load weather data")
            const demoWeather: WeatherData = {
                temperature: 28,
                feelsLike: 32,
                humidity: 75,
                windSpeed: 12,
                pressure: 1013,
                visibility: 8,
                uvIndex: 6,
                description: "partly cloudy",
                icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
            }

            const demoHourly: HourlyForecast[] = [
                {
                    time: "2025-01-21 09:00",
                    temperature: 26,
                    condition: "Partly cloudy",
                    icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
                    chanceOfRain: 10,
                },
                {
                    time: "2025-01-21 12:00",
                    temperature: 30,
                    condition: "Sunny",
                    icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
                    chanceOfRain: 5,
                },
                {
                    time: "2025-01-21 15:00",
                    temperature: 32,
                    condition: "Partly cloudy",
                    icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
                    chanceOfRain: 15,
                },
                {
                    time: "2025-01-21 18:00",
                    temperature: 28,
                    condition: "Clear",
                    icon: "//cdn.weatherapi.com/weather/64x64/night/113.png",
                    chanceOfRain: 0,
                },
                {
                    time: "2025-01-21 21:00",
                    temperature: 25,
                    condition: "Clear",
                    icon: "//cdn.weatherapi.com/weather/64x64/night/113.png",
                    chanceOfRain: 0,
                },
            ]

            setTodaysWeather(demoWeather)
            setForecastData({
                current: demoWeather,
                hourly: demoHourly,
            })
        } finally {
            setWeatherLoading(false)
        }
    }

    useEffect(() => {
        if (currentView === "todaysWeather" && !todaysWeather) {
            fetchTodaysWeather()
        }
    }, [currentView, todaysWeather])

    const getWeatherDataForDate = (year: string, month: string, date: string) => {
        const yearNum = Number.parseInt(year)
        const monthNum = Number.parseInt(month)
        const dateNum = Number.parseInt(date)

        const getMonthName = (monthNum: number) => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            return months[monthNum - 1]
        }

        const rainfallEntry = rainfallData.find((entry) => entry.Year === yearNum && entry.Month === getMonthName(monthNum))
        const rainfallMin = rainfallEntry ? rainfallEntry.Minimum || 0 : 0
        const rainfallMax = rainfallEntry ? rainfallEntry.Maximum || 0 : 0

        const tempEntry = temperatureData.find(
            (entry) => entry.Year === yearNum && entry.Month === getMonthName(monthNum) && entry.Day === dateNum,
        )

        const minTemperature = tempEntry && tempEntry.Minimum !== null ? tempEntry.Minimum : 20
        const maxTemperature = tempEntry && tempEntry.Maximum !== null ? tempEntry.Maximum : 30

        return {
            maxTemperature: typeof maxTemperature === "number" && maxTemperature !== null ? maxTemperature : 30,
            minTemperature: typeof minTemperature === "number" && minTemperature !== null ? minTemperature : 20,
            rainfallMin: typeof rainfallMin === "number" && rainfallMin !== null ? rainfallMin : 0,
            rainfallMax: typeof rainfallMax === "number" && rainfallMax !== null ? rainfallMax : 0,
        }
    }

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "bn" : "en")
    }

    const handleServiceClick = (serviceType: string) => {
        if (serviceType === "weather") {
            setCurrentView("todaysWeather")
        } else if (serviceType === "futureWeather") {
            setCurrentView("dateSelection")
        } else if (serviceType === "awareness") {
            setCurrentView("awareness")
        } else if (serviceType === "clinic") {
            setCurrentView("clinic")
        }
    }

    const goBack = () => {
        if (
            currentView === "dateSelection" ||
            currentView === "todaysWeather" ||
            currentView === "awareness" ||
            currentView === "clinic"
        ) {
            setCurrentView("home")
        } else if (currentView === "temperatureDetail") {
            setCurrentView("dateSelection")
        }
    }

    const handleDateSubmit = () => {
        if (selectedYear && selectedMonth && selectedDate) {
            setCurrentView("temperatureDetail")
        }
    }

    const getTemperatureCondition = () => {
        if (!selectedYear || !selectedMonth || !selectedDate) {
            return "normal"
        }

        const weatherData = getWeatherDataForDate(selectedYear, selectedMonth, selectedDate)

        if (weatherData.maxTemperature >= 36) return "heatwave"
        if (weatherData.minTemperature <= 10) return "coldwave"
        return "normal"
    }

    const getRainfallCondition = () => {
        if (!selectedYear || !selectedMonth || !selectedDate) {
            return "normal"
        }

        const weatherData = getWeatherDataForDate(selectedYear, selectedMonth, selectedDate)
        return weatherData.rainfallMax > 100 ? "heavy" : "normal"
    }

    const services = [
        { id: "weather", icon: Sun, title: t.weatherTitle, desc: t.weatherDesc, color: "text-orange-500" },
        {
            id: "futureWeather",
            icon: Leaf,
            title: t.futureWeatherTitle,
            desc: t.futureWeatherDesc,
            color: "text-green-500",
        },
        { id: "awareness", icon: FileText, title: t.awarenessTitle, desc: t.awarenessDesc, color: "text-purple-500" },
        { id: "clinic", icon: MapPin, title: t.clinicTitle, desc: t.clinicDesc, color: "text-blue-500" },
    ]

    if (currentView === "todaysWeather") {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-amber-400 px-4 py-6 flex items-center justify-between">
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 text-slate-700 hover:bg-amber-300 rounded p-1 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                            <Sun className="w-6 h-6 text-amber-200" />
                        </div>
                        <span className="font-semibold text-slate-800 text-lg">{t.todaysWeatherDetail.title}</span>
                    </div>
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-1 text-slate-700 hover:bg-amber-300 rounded transition-colors"
                    >
                        {t.languageSwitch}
                    </button>
                </div>

                <div className="flex justify-center">
                    <div className="w-full max-w-md">
                        <div className="p-4 space-y-4">
                    {weatherLoading && (
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
                            <p className="text-slate-600">{t.todaysWeatherDetail.loading}</p>
                        </div>
                    )}

                    {weatherError && !todaysWeather && (
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                            <p className="text-red-600 mb-4">{t.todaysWeatherDetail.error}</p>
                            <button
                                onClick={fetchTodaysWeather}
                                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {todaysWeather && (
                        <>
                            {/* Main Temperature Card */}
                            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-sm p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-3xl font-bold">{todaysWeather.temperature}°C</h2>
                                        <p className="text-blue-100 capitalize">{todaysWeather.description}</p>
                                        <p className="text-blue-100 text-sm">
                                            {t.todaysWeatherDetail.feelsLike}: {todaysWeather.feelsLike}°C
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <img src={`https:${todaysWeather.icon}`} alt="Weather icon" className="w-16 h-16" />
                                    </div>
                                </div>
                            </div>

                            {/* Weather Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-blue-500" />
                                        <div>
                                            <p className="text-sm text-slate-600">{t.todaysWeatherDetail.humidity}</p>
                                            <p className="font-semibold text-slate-800">{todaysWeather.humidity}%</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <div className="flex items-center gap-3">
                                        <Wind className="w-5 h-5 text-green-500" />
                                        <div>
                                            <p className="text-sm text-slate-600">{t.todaysWeatherDetail.windSpeed}</p>
                                            <p className="font-semibold text-slate-800">{todaysWeather.windSpeed} km/h</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <div className="flex items-center gap-3">
                                        <Gauge className="w-5 h-5 text-purple-500" />
                                        <div>
                                            <p className="text-sm text-slate-600">{t.todaysWeatherDetail.pressure}</p>
                                            <p className="font-semibold text-slate-800">{todaysWeather.pressure} hPa</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <div className="flex items-center gap-3">
                                        <Eye className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-slate-600">{t.todaysWeatherDetail.visibility}</p>
                                            <p className="font-semibold text-slate-800">{todaysWeather.visibility} km</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* UV Index */}
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">{t.todaysWeatherDetail.uvIndex}</span>
                                    <span className="font-semibold text-slate-800">{todaysWeather.uvIndex}</span>
                                </div>
                            </div>

                            {/* Hourly Forecast */}
                            {forecastData && forecastData.hourly.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <h3 className="font-semibold text-slate-800 mb-4">{t.hourlyForecast}</h3>
                                    <div className="space-y-3">
                                        {forecastData.hourly.map((hour, index) => {
                                            const time = new Date(hour.time)
                                            const timeStr = time.toLocaleTimeString("en-US", {
                                                hour: "numeric",
                                                minute: "2-digit",
                                                hour12: true,
                                            })

                                            return (
                                                <div
                                                    key={hour.time}
                                                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-16 text-sm font-medium text-slate-700">{timeStr}</div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <img src={`https:${hour.icon}`} alt={hour.condition} className="w-8 h-8" />
                                                        <div className="text-right">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-slate-800">{hour.temperature}°C</span>
                                                            </div>
                                                            <div className="text-xs text-blue-600">{hour.chanceOfRain}% rain</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
                    </div>
                </div>
            </div>
        )
    }

    if (currentView === "dateSelection") {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-amber-400 px-4 py-6 flex items-center justify-between">
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 text-slate-700 hover:bg-amber-300 rounded p-1 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-amber-200" />
                        </div>
                        <span className="font-semibold text-slate-800 text-lg">{t.futureWeatherDetail.selectDate}</span>
                    </div>
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-1 text-slate-700 hover:bg-amber-300 rounded transition-colors"
                    >
                        {t.languageSwitch}
                    </button>
                </div>
                <div className="flex justify-center">
                    <div className="w-full max-w-md">
                        <div className="p-4 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">{t.futureWeatherDetail.year}</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                >
                                    <option value="">{t.futureWeatherDetail.selectYear}</option>
                                    {Array.from({ length: 2 }, (_, i) => 2026 + i).map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">{t.futureWeatherDetail.month}</label>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                >
                                    <option value="">{t.futureWeatherDetail.selectMonth}</option>
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const monthNumber = i + 1;
                                        const monthName = new Date(0, i).toLocaleString("en-US", { month: "long" });
                                        return (
                                            <option key={monthNumber} value={monthNumber}>
                                                {monthName}
                                            </option>
                                        );
                                    })}

                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">{t.futureWeatherDetail.date}</label>
                                <select
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                >
                                    <option value="">{t.futureWeatherDetail.selectDate}</option>
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                                        <option key={date} value={date}>
                                            {date}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={handleDateSubmit}
                                disabled={!selectedYear || !selectedMonth || !selectedDate}
                                className="w-full bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                {t.futureWeatherDetail.selectDate}
                            </button>
                        </div>
                    </div>
                </div>
                    </div>
                </div>
            </div>
        )
    }

    if (currentView === "temperatureDetail") {
        const tempCondition = getTemperatureCondition()
        const rainfallCondition = getRainfallCondition()
        const weatherData = getWeatherDataForDate(selectedYear, selectedMonth, selectedDate)
        const tempData =
            tempCondition === "heatwave"
                ? t.futureWeatherDetail.temperatureDetail.heatwave
                : tempCondition === "coldwave"
                    ? t.futureWeatherDetail.temperatureDetail.coldwave
                    : null

        const rainfallData = rainfallCondition === "heavy" ? t.futureWeatherDetail.rainfallDetail.heavyRain : null

        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-amber-400 px-4 py-6 flex items-center justify-between">
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 text-slate-700 hover:bg-amber-300 rounded p-1 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                            <Thermometer className="w-6 h-6 text-amber-200" />
                        </div>
                        <span className="font-semibold text-slate-800 text-lg">
              {t.futureWeatherDetail.temperatureDetail.title}
            </span>
                    </div>
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-1 text-slate-700 hover:bg-amber-300 rounded transition-colors"
                    >
                        {t.languageSwitch}
                    </button>
                </div>

                <div className="flex justify-center">
                    <div className="w-full max-w-md">
                        <div className="p-4 space-y-4">
                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <h3 className="font-medium text-slate-800 mb-2">
                                    {t.weatherDataFor} {selectedDate}, {new Date(0, Number(selectedMonth) - 1).toLocaleString("en-US", { month: "long" })}, {selectedYear}
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-slate-600">{t.minTemp}:</span>
                                        <span
                                            className="font-semibold text-blue-600 ml-2">{weatherData.minTemperature}°C</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-600">{t.maxTemp}:</span>
                                        <span
                                            className="font-semibold text-red-600 ml-2">{weatherData.maxTemperature}°C</span>
                                    </div>
                                </div>
                            </div>

                            {tempData && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-slate-800 mb-4">{tempData.title}</h2>

                                    <div className="space-y-4">
                                    {Object.entries(tempData.sections).map(([key, content]) => (
                                            <div key={key} className="border-b border-gray-100 pb-4 last:border-b-0">
                                                <div
                                                    className="whitespace-pre-line text-slate-700 leading-relaxed">{content}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-lg shadow-sm p-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <CloudRain className="w-4 h-4 text-blue-500"/>
                                        <span
                                            className="text-sm font-medium text-slate-700">{t.futureWeatherDetail.rainfall}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-slate-600">{t.monthlyMin}:</span>
                                            <span
                                                className="font-semibold text-blue-600 ml-2">{weatherData.rainfallMin.toFixed(1)}mm</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-600">{t.monthlyMax}:</span>
                                            <span
                                                className="font-semibold text-red-600 ml-2">{weatherData.rainfallMax.toFixed(1)}mm</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {rainfallData && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CloudRain className="w-5 h-5 text-blue-500"/>
                                        <h2 className="text-lg font-semibold text-slate-800">{rainfallData.title}</h2>
                                    </div>

                                    <div
                                        className="whitespace-pre-line text-slate-700 leading-relaxed">{rainfallData.content}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // const documentList = t.awarenessDetail.documents
    if (currentView === "awareness") {
        const awarenessImages = [
            {
                src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Thunderstorm1.jpg-OUybWc4Kv4qwSroGyGeJRhQrgqagqo.jpeg",
                title: language === "bn" ? "বজ্রপাত থেকে নিরাপদ থাকতে যা করণীয়" : "Thunderstorm Safety Guidelines",
                description:
                    language === "bn" ? "বজ্রপাতের সময় নিরাপত্তার জন্য করণীয় ও বর্জনীয়" : "Do's and don'ts during thunderstorms",
            },
            {
                src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Thunderstorm2.jpg-rQgYSlyJaDT9En4CsVnqqs20QR6ivw.jpeg",
                title: language === "bn" ? "বজ্রপাত কি ও বজ্রঝড়ের লক্ষণ" : "Understanding Thunderstorms",
                description:
                    language === "bn"
                        ? "বজ্রপাত সম্পর্কে বিস্তারিত তথ্য ও সতর্কতা"
                        : "Detailed information about thunderstorms and precautions",
            },
            {
                src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Heatwave.jpg-mn6RPDy0fFeA0ggZnym3NovTJj5yfp.jpeg",
                title: language === "bn" ? "তীব্র গরম ও হিটওয়েভে করণীয়" : "Heatwave Safety Measures",
                description: language === "bn" ? "গরমের দিনে স্বাস্থ্য সুরক্ষার উপায়" : "Health protection during extreme heat",
            },
            {
                src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/waterlogging.jpg-UoUAsOj2STR7YYwUbF2ZzW87UXDZpO.jpeg",
                title: language === "bn" ? "জলাবদ্ধতা ঝুঁকি ও সুরক্ষার বার্তা" : "Waterlogging Safety Information",
                description: language === "bn" ? "জলাবদ্ধতার সময় নিরাপত্তা ব্যবস্থা" : "Safety measures during waterlogging",
            },
        ]

        return (
            <>
                <div className="min-h-screen bg-gray-50">
                    <div className="bg-amber-400 px-4 py-6 flex items-center justify-between">
                        <button
                            onClick={goBack}
                            className="flex items-center gap-2 text-slate-700 hover:bg-amber-300 rounded p-1 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                                <FileText className="w-6 h-6 text-amber-200" />
                            </div>
                            <span className="font-semibold text-slate-800 text-lg">{t.awarenessTitle}</span>
                        </div>
                        <button
                            onClick={toggleLanguage}
                            className="px-3 py-1 text-slate-700 hover:bg-amber-300 rounded transition-colors"
                        >
                            {t.languageSwitch}
                        </button>
                    </div>

                    <div className="flex justify-center">
                        <div className="w-full max-w-md">
                            <div className="p-4 space-y-4">
                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <h3 className="font-medium text-slate-800 mb-4">
                                        {language === "bn" ? "আবহাওয়া সচেতনতা তথ্য" : "Weather Awareness Information"}
                                    </h3>
                                    <div className="space-y-3">
                                        {awarenessImages.map((image, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <FileText className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">{image.title}</h4>
                                                        <p className="text-sm text-slate-600">{image.description}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedImage({ src: image.src, title: image.title })}
                                                    className="px-3 py-1 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 transition-colors"
                                                >
                                                    {language === "bn" ? "দেখুন" : "View"}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {selectedImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-slate-800 truncate pr-4">{selectedImage.title}</h2>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={selectedImage.src}
                                        download
                                        className="p-2 text-slate-600 hover:text-slate-800 hover:bg-gray-100 rounded-lg transition-colors"
                                        title={language === "bn" ? "ডাউনলোড করুন" : "Download"}
                                    >
                                        <Download className="w-5 h-5" />
                                    </a>
                                    <a
                                        href={selectedImage.src}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-slate-600 hover:text-slate-800 hover:bg-gray-100 rounded-lg transition-colors"
                                        title={language === "bn" ? "নতুন ট্যাবে খুলুন" : "Open in new tab"}
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="p-2 text-slate-600 hover:text-slate-800 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto p-4">
                                <div className="flex justify-center">
                                    <img
                                        src={selectedImage.src || "/placeholder.svg"}
                                        alt={selectedImage.title}
                                        className="max-w-full h-auto rounded-lg shadow-sm"
                                        style={{ maxHeight: "calc(90vh - 120px)" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        )
    }

    if (currentView === "clinic") {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-amber-400 px-4 py-6 flex items-center justify-between">
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 text-slate-700 hover:bg-amber-300 rounded p-1 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-amber-200" />
                        </div>
                        <span className="font-semibold text-slate-800 text-lg">{t.clinicTitle}</span>
                    </div>
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-1 text-slate-700 hover:bg-amber-300 rounded transition-colors"
                    >
                        {t.languageSwitch}
                    </button>
                </div>

                <div className="p-4">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <iframe
                            width="100%"
                            height="600px"
                            frameBorder="0"
                            allowFullScreen
                            allow="geolocation"
                            src="https://umap.openstreetmap.fr/en/map/megh-bondhu_1270719#17/23.82599/90.36386"
                            className="w-full"
                        />
                        <div className="p-4 bg-gray-50 border-t">
                            <p className="text-sm text-slate-600">
                                <a
                                    href="https://umap.openstreetmap.fr/en/map/megh-bondhu_1270719#17/23.82599/90.36386"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline"
                                >
                                    See full screen
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-amber-400 px-4 py-6 flex items-center justify-between">
                <div className="w-6 h-6"></div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-amber-200 rounded-full"></div>
                    </div>
                    <span className="font-semibold text-slate-800 text-lg">{t.mobileHeader}</span>
                </div>
                <button
                    onClick={toggleLanguage}
                    className="px-3 py-1 text-slate-700 hover:bg-amber-300 rounded transition-colors"
                >
                    {t.languageSwitch}
                </button>
            </div>

            <div className="flex justify-center">
                <div className="w-full max-w-md">
            <div className="p-4 space-y-4">
                {services.map((service, index) => (
                    <button
                        key={index}
                        onClick={() => handleServiceClick(service.id)}
                        className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="p-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg bg-gray-100`}>
                                    <service.icon className={`w-6 h-6 ${service.color}`} />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="font-semibold text-slate-800 text-base">{service.title}</h3>
                                    <p className="text-sm text-slate-600 mt-1">{service.desc}</p>
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
                </div>
            </div>
        </div>
    )
}
