import type React from "react"
import type { Metadata } from "next"
import { Providers } from "@/app/providers"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { DarkVeil, FloatingOrbs } from "@/components/ui"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SuiMind - AI-Powered DeFi Wallet",
  description: "The World's First Proactive DeFAI Financial Agent on Sui Network",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased bg-black text-white`}>
        <DarkVeil
          className="fixed inset-0 z-0 pointer-events-none"
          speed={0.25}
          hueShift={0}
          noiseIntensity={0.02}
          warpAmount={0.15}
        />
        <FloatingOrbs />
        <div className="relative z-10">
          <Providers>
            {children}
          </Providers>
        </div>
        <Analytics />
      </body>
    </html>
  )
}