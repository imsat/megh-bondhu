export const translations = {
    en: {
        title: "MeghBondhu",
        subtitle: "Community Engagement",
        mobileHeader: "MeghBondhu",
        weatherTitle: "Weather Information",
        weatherDesc: "Get current weather updates",
        healthTitle: "Health Tips",
        healthDesc: "Stay healthy with our tips",
        clinicTitle: "Locate a clinic",
        clinicDesc: "Find nearby clinics",
        sanitationTitle: "Sanitation Information",
        sanitationDesc: "Clean water access points",
        disasterTitle: "Disaster Preparedness",
        disasterDesc: "Emergency preparedness guide",
        languageSwitch: "বাংলা",
        healthTipsDetail: {
            title: "Health Tips",
            heatWave: {
                title: "☀️ What to do during heat waves",
                content:
                    "Avoid working or going outside from 12 PM to 4 PM.\nWhen going outside, cover your head with an umbrella, hat, or wet cloth.\nIf you feel too hot, rest in a shaded place.",
            },
            waterFood: {
                title: "💧 Water and Food",
                content:
                    "Drink water frequently throughout the day—even if you don't feel thirsty.\nDrink ORS or salt-sugar mixed water.\nAvoid cold soft drinks, instead drink lemon juice or fruit juice.\nEat less spicy and fried food.",
            },
            childrenElderly: {
                title: "👶 Protection for Children and Elderly",
                content:
                    "Don't let children and elderly go outside in the sun.\nDress them in light, loose, and thin clothes.\nIf they get sick or have fever, go to the nearest hospital immediately.",
            },
        },
    },
    bn: {
        title: "মেঘবন্ধু",
        subtitle: "কমিউনিটি এনগেজমেন্ট",
        mobileHeader: "মেঘবন্ধু",
        weatherTitle: "আবহাওয়ার তথ্য",
        weatherDesc: "বর্তমান আবহাওয়ার আপডেট পান",
        healthTitle: "স্বাস্থ্য টিপস",
        healthDesc: "আমাদের টিপস দিয়ে সুস্থ থাকুন",
        clinicTitle: "ক্লিনিক খুঁজুন",
        clinicDesc: "কাছাকাছি ক্লিনিক খুঁজুন",
        sanitationTitle: "স্যানিটেশন তথ্য",
        sanitationDesc: "পরিষ্কার পানির অ্যাক্সেস পয়েন্ট",
        disasterTitle: "দুর্যোগ প্রস্তুতি",
        disasterDesc: "জরুরি প্রস্তুতির গাইড",
        languageSwitch: "English",
        healthTipsDetail: {
            title: "স্বাস্থ্য টিপস",
            heatWave: {
                title: "☀️ তাপপ্রবাহের সময় করণীয়",
                content:
                    "দুপুর ১২টা থেকে বিকেল ৪টা পর্যন্ত রোদে কাজ বা বাইরে যাওয়া এড়িয়ে চলুন।\nবাইরে গেলে ছাতা, টুপি বা ভেজা কাপড় দিয়ে মাথা ঢেকে রাখুন।\nবেশি গরম লাগলে ছায়াযুক্ত জায়গায় বিশ্রাম নিন।",
            },
            waterFood: {
                title: "💧 পানি ও খাবার",
                content:
                    "দিনে বারবার পানি পান করুন—even যদি তৃষ্ণা না লাগে।\nওরস্যালাইন (ORS) বা লবণ-চিনি মিশ্রিত পানি পান করুন।\nঠান্ডা কোমল পানীয় এড়িয়ে চলুন, পরিবর্তে লেবুর শরবত বা ফলের রস খান।\nঅতিরিক্ত ঝাল ও ভাজা খাবার কম খান।",
            },
            childrenElderly: {
                title: "👶 শিশু ও বৃদ্ধদের সুরক্ষা",
                content:
                    "শিশু ও বৃদ্ধদের বাইরে রোদে যেতে দেবেন না।\nতাদের হালকা, ঢিলা ও পাতলা কাপড় পরান।\nঅসুস্থ বা জ্বর হলে দ্রুত নিকটস্থ হাসপাতালে যান।",
            },
        },
    },
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.en
