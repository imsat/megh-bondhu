import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Sans_Bengali } from "next/font/google"
import "./globals.css"

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
})

const notoSansBengali = Noto_Sans_Bengali({
    subsets: ["bengali"],
    display: "swap",
    variable: "--font-bengali",
})

export const metadata: Metadata = {
    title: "MeghBondhu - Community Engagement Platform",
    description: "Climate resilience through community engagement and empowerment",
    generator: "v0.app",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${notoSansBengali.variable} antialiased`}>
        <body className="font-sans">{children}</body>
        </html>
    )
}
