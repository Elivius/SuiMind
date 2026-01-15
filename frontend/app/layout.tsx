import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL("https://suimind.com"),
  title: {
    default: "SuiMind",
    template: "%s | SuiMind",
  },
  description: "The World's First Proactive DeFAI Financial Agent on Sui Network",
  keywords: [
    "SuiMind",
    "Sui Network",
    "DeFAI",
    "DeFi",
    "AI Agent",
    "Crypto AI",
    "Yield Optimization",
    "Sui Blockchain",
    "Smart Wallet",
    "Intent-based Finance"
  ],
  authors: [{ name: "SuiMind Team" }],
  creator: "SuiMind",
  publisher: "SuiMind",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://suimind.com",
    title: "SuiMind - AI-Powered DeFi Wallet",
    description: "The World's First Proactive DeFAI Financial Agent on Sui Network",
    siteName: "SuiMind",
    images: [
      {
        url: "/og-image.png", // Recommended size: 1200x630
        width: 1200,
        height: 630,
        alt: "SuiMind - AI-Powered DeFi Wallet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SuiMind - AI-Powered DeFi Wallet",
    description: "The World's First Proactive DeFAI Financial Agent on Sui Network",
    images: ["/twitter-image.png"], // Recommended size: 1200x600
    creator: "@SuiMind",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}