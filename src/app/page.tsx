"use client"

import { useState } from "react"
import { Sun, Leaf, MapPin, Droplets, Home, ArrowLeft, Calendar, Thermometer, CloudRain } from "lucide-react"
import { translations, type Language } from "@/lib/translations"
import rainfallData from "@/data/rainfall.json"
import minTempData from "@/data/minimum-temp.json"
import maxTempData from "@/data/maximum-temp.json"

export default function MeghBondhuApp() {
  const [language, setLanguage] = useState<Language>("en")
  const [currentView, setCurrentView] = useState<
      "home" | "futureWeather" | "dateSelection" | "weatherOptions" | "temperatureDetail" | "rainfallDetail"
  >("home")
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const t = translations[language]

  const getWeatherDataForDate = (year: string, month: string, date: string) => {
    const yearNum = Number.parseInt(year)
    const monthNum = Number.parseInt(month)
    const dateNum = Number.parseInt(date)

    // Helper function to get month name from number
    const getMonthName = (monthNum: number) => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      return months[monthNum - 1]
    }

    // Find rainfall data
    const rainfallEntry = rainfallData.find((entry) => entry.Year === yearNum && entry.Month === getMonthName(monthNum))
    const rainfall = rainfallEntry ? rainfallEntry[dateNum.toString()] || 0 : 0

    // Find minimum temperature data
    const minTempEntry = minTempData.find((entry) => entry.Year === yearNum && entry.Month === getMonthName(monthNum))
    const minTemperature = minTempEntry ? minTempEntry[dateNum.toString()] || 10 : 10

    // Find maximum temperature data
    const maxTempEntry = maxTempData.find((entry) => entry.Year === yearNum && entry.Month === getMonthName(monthNum))
    const maxTemperature = maxTempEntry ? maxTempEntry[dateNum.toString()] || 30 : 30

    return {
      maxTemperature: typeof maxTemperature === "number" && maxTemperature !== null ? maxTemperature : 30,
      minTemperature: typeof minTemperature === "number" && minTemperature !== null ? minTemperature : 10,
      rainfall: typeof rainfall === "number" && rainfall !== null ? rainfall : 0,
    }
  }

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en")
  }

  const handleServiceClick = (serviceType: string) => {
    if (serviceType === "futureWeather") {
      setCurrentView("dateSelection")
    }
  }

  const goBack = () => {
    if (currentView === "dateSelection") {
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
    { id: "clinic", icon: MapPin, title: t.clinicTitle, desc: t.clinicDesc, color: "text-blue-500" },
    { id: "sanitation", icon: Droplets, title: t.sanitationTitle, desc: t.sanitationDesc, color: "text-cyan-500" },
    { id: "disaster", icon: Home, title: t.disasterTitle, desc: t.disasterDesc, color: "text-red-500" },
  ]

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
                Weather Data for {selectedDate}/{selectedMonth}/{selectedYear}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Max Temperature:</span>
                  <span className="font-semibold text-red-600 ml-2">{weatherData.maxTemperature}°C</span>
                </div>
                <div>
                  <span className="text-slate-600">Min Temperature:</span>
                  <span className="font-semibold text-blue-600 ml-2">{weatherData.minTemperature}°C</span>
                </div>
              </div>
            </div>

            {tempData && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm font-medium text-yellow-800">{tempData.condition}</p>
                  </div>

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

            {!tempData && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-slate-600">Temperature conditions are normal. No special precautions needed.</p>
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
                Rainfall Data for {selectedDate}/{selectedMonth}/{selectedYear}
              </h3>
              <div className="text-sm">
                <span className="text-slate-600">Daily Rainfall:</span>
                <span className="font-semibold text-blue-600 ml-2">{weatherData.rainfall}mm</span>
              </div>
            </div>

            {rainfallData && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <p className="text-sm font-medium text-blue-800">{rainfallData.condition}</p>
                  </div>

                  <h2 className="text-lg font-semibold text-slate-800 mb-4">{rainfallData.title}</h2>

                  <div className="whitespace-pre-line text-slate-700 leading-relaxed">{rainfallData.content}</div>
                </div>
            )}

            {!rainfallData && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <p className="text-slate-600">Rainfall levels are normal. No special precautions needed.</p>
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
                Selected Date: {selectedDate}/{selectedMonth}/{selectedYear}
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
