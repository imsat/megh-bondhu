"use client"

import { useState } from "react"
import { Sun, Leaf, MapPin, Droplets, Home, ArrowLeft } from "lucide-react"
import { translations, type Language } from "@/lib/translations"

export default function MeghBondhuApp() {
  const [language, setLanguage] = useState<Language>("bn")
  const [currentView, setCurrentView] = useState<"home" | "healthTips">("home")
  const t = translations[language]

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en")
  }

  const handleServiceClick = (serviceType: string) => {
    if (serviceType === "health") {
      setCurrentView("healthTips")
    }
  }

  const goBack = () => {
    setCurrentView("home")
  }

  const services = [
    { id: "weather", icon: Sun, title: t.weatherTitle, desc: t.weatherDesc, color: "text-orange-500" },
    { id: "health", icon: Leaf, title: t.healthTitle, desc: t.healthDesc, color: "text-green-500" },
    { id: "clinic", icon: MapPin, title: t.clinicTitle, desc: t.clinicDesc, color: "text-blue-500" },
    { id: "sanitation", icon: Droplets, title: t.sanitationTitle, desc: t.sanitationDesc, color: "text-cyan-500" },
    { id: "disaster", icon: Home, title: t.disasterTitle, desc: t.disasterDesc, color: "text-red-500" },
  ]

  if (currentView === "healthTips") {
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
              <span className="font-semibold text-slate-800 text-lg">{t.healthTipsDetail.title}</span>
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
              <h2 className="text-xl font-bold text-slate-800 mb-4">{t.healthTipsDetail.heatWave.title}</h2>
              <div className="text-slate-700 leading-relaxed">
                {t.healthTipsDetail.heatWave.content.split("\n").map((line, index) => (
                    <p key={index} className="mb-2">
                      {line}
                    </p>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">{t.healthTipsDetail.waterFood.title}</h2>
              <div className="text-slate-700 leading-relaxed">
                {t.healthTipsDetail.waterFood.content.split("\n").map((line, index) => (
                    <p key={index} className="mb-2">
                      {line}
                    </p>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">{t.healthTipsDetail.childrenElderly.title}</h2>
              <div className="text-slate-700 leading-relaxed">
                {t.healthTipsDetail.childrenElderly.content.split("\n").map((line, index) => (
                    <p key={index} className="mb-2">
                      {line}
                    </p>
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
