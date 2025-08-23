"use client"

import { useState, useEffect } from "react"
import {Sun, Leaf, MapPin, FileText, ArrowLeft, Calendar, Thermometer, CloudRain, Wind, Gauge, Eye} from "lucide-react"
import { translations, type Language } from "@/lib/translations"
import rainfallData from "@/data/rainfall.json"
import minTempData from "@/data/minimum-temp.json"
import maxTempData from "@/data/maximum-temp.json"

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
        | "home"
        | "todaysWeather"
        | "futureWeather"
        | "dateSelection"
        | "weatherOptions"
        | "temperatureDetail"
        | "rainfallDetail"
        | "awareness"
    >("home")
    const [selectedYear, setSelectedYear] = useState<string>("")
    const [selectedMonth, setSelectedMonth] = useState<string>("")
    const [selectedDate, setSelectedDate] = useState<string>("")
    const [todaysWeather, setTodaysWeather] = useState<WeatherData | null>(null)
    const [forecastData, setForecastData] = useState<ForecastData | null>(null)
    const [weatherLoading, setWeatherLoading] = useState(false)
    const [weatherError, setWeatherError] = useState<string | null>(null)
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
        const rainfall = rainfallEntry ? (rainfallEntry as Record<string, number | string | boolean>)[dateNum.toString()] || 0 : 0

        const minTempEntry = minTempData.find((entry) => entry.Year === yearNum && entry.Month === getMonthName(monthNum))
        const minTemperature = minTempEntry ? (minTempEntry as Record<string, number | string | boolean>)[dateNum.toString()] || 20 : 20

        const maxTempEntry = maxTempData.find((entry) => entry.Year === yearNum && entry.Month === getMonthName(monthNum))
        const maxTemperature = maxTempEntry ? (maxTempEntry as Record<string, number | string | boolean>)[dateNum.toString()] || 30 : 30

        return {
            maxTemperature: typeof maxTemperature === "number" && maxTemperature !== null ? maxTemperature : 30,
            minTemperature: typeof minTemperature === "number" && minTemperature !== null ? minTemperature : 20,
            rainfall: typeof rainfall === "number" && rainfall !== null ? rainfall : 0,
        }
    }

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "bn" : "en")
    }

    const handleServiceClick = (serviceType: string) => {
        if (serviceType === "futureWeather") {
            setCurrentView("dateSelection")
        } else if (serviceType === "weather") {
            setCurrentView("todaysWeather")
        } else if (serviceType === "awareness") {
            setCurrentView("awareness")
        }
    }

    const goBack = () => {
        if (currentView === "dateSelection" || currentView === "todaysWeather" || currentView === "awareness") {
            setCurrentView("home")
        } else if (currentView === "weatherOptions") {
            setCurrentView("dateSelection")
        } else if (currentView === "temperatureDetail" || currentView === "rainfallDetail") {
            setCurrentView("weatherOptions")
        }
    }

    const handleDateSubmit = () => {
        if (selectedYear && selectedMonth && selectedDate) {
            setCurrentView("weatherOptions")
        }
    }

    const handleTemperatureClick = () => {
        setCurrentView("temperatureDetail")
    }

    const handleRainfallClick = () => {
        setCurrentView("rainfallDetail")
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
        return weatherData.rainfall > 15 ? "heavy" : "normal"
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
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                        <option key={month} value={month}>
                                            {month}
                                        </option>
                                    ))}
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
        )
    }

    if (currentView === "temperatureDetail") {
        const tempCondition = getTemperatureCondition()
        const weatherData = getWeatherDataForDate(selectedYear, selectedMonth, selectedDate)
        const tempData =
            tempCondition === "heatwave"
                ? t.futureWeatherDetail.temperatureDetail.heatwave
                : tempCondition === "coldwave"
                    ? t.futureWeatherDetail.temperatureDetail.coldwave
                    : null

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

                <div className="p-4 space-y-4">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h3 className="font-medium text-slate-800 mb-2">
                            {t.weatherDataFor} {selectedDate}/{selectedMonth}/{selectedYear}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-600">{t.maxTemp}:</span>
                                <span className="font-semibold text-red-600 ml-2">{weatherData.maxTemperature}°C</span>
                            </div>
                            <div>
                                <span className="text-slate-600">{t.minTemp}:</span>
                                <span className="font-semibold text-blue-600 ml-2">{weatherData.minTemperature}°C</span>
                            </div>
                        </div>
                    </div>

                    {tempData && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">{tempData.title}</h2>

                            <div className="space-y-4">
                                {Object.entries(tempData.sections).map(([key, content]) => (
                                    <div key={key} className="border-b border-gray-100 pb-4 last:border-b-0">
                                        <div className="whitespace-pre-line text-slate-700 leading-relaxed">{content}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    if (currentView === "rainfallDetail") {
        const rainfallCondition = getRainfallCondition()
        const weatherData = getWeatherDataForDate(selectedYear, selectedMonth, selectedDate)
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
                            <CloudRain className="w-6 h-6 text-amber-200" />
                        </div>
                        <span className="font-semibold text-slate-800 text-lg">{t.futureWeatherDetail.rainfallDetail.title}</span>
                    </div>
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-1 text-slate-700 hover:bg-amber-300 rounded transition-colors"
                    >
                        {t.languageSwitch}
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h3 className="font-medium text-slate-800 mb-2">
                            {t.weatherDataFor} {selectedDate}/{selectedMonth}/{selectedYear}
                        </h3>
                        <div className="text-sm">
                            <span className="text-slate-600">{t.dailyRainfall}:</span>
                            <span className="font-semibold text-blue-600 ml-2">{weatherData.rainfall}mm</span>
                        </div>
                    </div>

                    {rainfallData && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">{rainfallData.title}</h2>

                            <div className="whitespace-pre-line text-slate-700 leading-relaxed">{rainfallData.content}</div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    if (currentView === "weatherOptions") {
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
                            <div className="w-8 h-8 bg-amber-200 rounded-full"></div>
                        </div>
                        <span className="font-semibold text-slate-800 text-lg">{t.futureWeatherDetail.title}</span>
                    </div>
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-1 text-slate-700 hover:bg-amber-300 rounded transition-colors"
                    >
                        {t.languageSwitch}
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <p className="text-sm text-slate-600 mb-4">
                            {t.selectedDate} {selectedDate}/{selectedMonth}/{selectedYear}
                        </p>
                    </div>

                    <button
                        onClick={handleTemperatureClick}
                        className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-red-100">
                                    <Thermometer className="w-6 h-6 text-red-500" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="font-semibold text-slate-800 text-base">{t.futureWeatherDetail.temperature}</h3>
                                    <p className="text-sm text-slate-600 mt-1">{t.futureWeatherDetail.viewTemperature}</p>
                                </div>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={handleRainfallClick}
                        className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-blue-100">
                                    <CloudRain className="w-6 h-6 text-blue-500" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="font-semibold text-slate-800 text-base">{t.futureWeatherDetail.rainfall}</h3>
                                    <p className="text-sm text-slate-600 mt-1">{t.futureWeatherDetail.viewRainfall}</p>
                                </div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        )
    }

    if (currentView === "awareness") {
        const documentList = t.awarenessDetail.documents

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

                <div className="p-4 space-y-4">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h3 className="font-medium text-slate-800 mb-4">{t.awarenessDetail.title}</h3>
                        <div className="space-y-3">
                            {documentList.map((document, index) => (
                                <a
                                    href={document.file}
                                    key={index}
                                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <FileText className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-slate-800">{document.title}</h4>
                                            <p className="text-sm text-slate-600">{document.description}</p>
                                        </div>
                                    </div>
                                    <a href={document.file} className="px-3 py-1 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 transition-colors">
                                        {t.awarenessDetail.viewButton}
                                    </a>
                                </a>
                            ))}
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
    )
}
