"use client"

import { useState } from "react"
import {
    ArrowUpRight,
    Sparkles,
    ArrowRight,
    AtSign,
    Image as ImageIcon,
    Plus,
    Scan,
    FileText,
    Camera,
    Banknote
} from "lucide-react"

const QUICK_ACTIONS = [
    {
        icon: <Sparkles className="w-4 h-4 text-amber-300" />,
        title: "What can SuiMind do?",
        prompt: "What are your main features and how can you help me?",
        className: "w-full lg:max-w-[400px] xl:max-w-[450px] xl:rotate-[-2deg] xl:-translate-x-4",
        hideOnMobile: false,
        hideOnTablet: false
    },
    {
        icon: <Scan className="w-4 h-4 text-blue-400" />,
        title: "Pay via screenshot",
        prompt: "I want to upload a screenshot to make a payment.",
        className: "w-full lg:max-w-[340px] xl:max-w-[360px] xl:rotate-[1.5deg] xl:translate-y-4",
        hideOnMobile: true,
        hideOnTablet: true
    },
    {
        icon: <AtSign className="w-4 h-4 text-[#6FBEE5]" />,
        title: "Pay @someone",
        prompt: "I want to send some SUI to a contact.",
        className: "w-full lg:max-w-[320px] xl:max-w-[340px] xl:rotate-[-1.2deg] xl:-translate-y-6 xl:translate-x-8",
        hideOnMobile: false,
        hideOnTablet: false
    },
    {
        icon: <FileText className="w-4 h-4 text-purple-400" />,
        title: "Upload file and pay",
        prompt: "I want to upload a document or file for payment.",
        className: "w-full lg:max-w-[420px] xl:max-w-[480px] xl:rotate-[2deg] xl:translate-x-[-10px] xl:translate-y-2",
        hideOnMobile: true,
        hideOnTablet: true
    },
    {
        icon: <Camera className="w-4 h-4 text-orange-400" />,
        title: "Snap and pay",
        prompt: "I want to use my camera to snap a QR and pay.",
        className: "w-full lg:max-w-[340px] xl:max-w-[380px] xl:rotate-[-1.5deg] xl:translate-y-[-4px] xl:translate-x-4",
        hideOnMobile: true,
        hideOnTablet: true
    },
    {
        icon: <Banknote className="w-4 h-4 text-emerald-300" />,
        title: "Show latest transfers",
        prompt: "Show me my latest transaction history.",
        className: "w-full lg:max-w-[380px] xl:max-w-[420px] xl:rotate-[1deg] xl:translate-x-20 xl:translate-y-8",
        hideOnMobile: true,
        hideOnTablet: false
    }
]

export default function MindyAIPage() {
    const [inputValue, setInputValue] = useState("")

    const handleActionClick = (prompt: string) => {
        setInputValue(prompt)
    }

    const handleSendMessage = () => {
        if (!inputValue.trim()) return
        console.log("Sending to SuiMind:", inputValue)
        setInputValue("")
    }

    return (
        <div className="w-full mx-auto px-4 sm:px-6 py-6 min-h-[calc(100vh-120px)] flex flex-col relative overflow-hidden">
            <div className="flex-1 flex flex-col relative z-10 max-w-6xl mx-auto w-full">
                {/* Main Interaction Area */}
                <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                    <div className="w-full mb-4 sm:mb-12 relative">
                        <h1 className="text-4xl font-bold md:text-6xl lg:text-7xl text-white tracking-tight leading-tight relative z-10 px-4">
                            How can I <span className="text-transparent font-bold bg-clip-text bg-gradient-to-r from-[#6FBEE5] to-[#A890FE]">help</span> you?
                        </h1>

                        {/* HIGHLY ORGANIC / MESSY ARRANGE - PROJECT STYLE */}
                        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 xl:gap-x-20 xl:gap-y-12 w-full max-w-6xl mx-auto px-4 py-8 sm:py-10 relative">
                            {QUICK_ACTIONS.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleActionClick(action.prompt)}
                                    className={`flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-4 sm:py-5 rounded-3xl sm:rounded-[2.5rem] bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] hover:border-[#6FBEE5]/40 transition-all duration-500 hover:scale-[1.05] hover:rotate-0 hover:translate-x-0 hover:translate-y-0 text-white font-semibold text-left shadow-2xl backdrop-blur-3xl group ${action.className} ${action.hideOnMobile ? 'hidden' : 'flex'} ${action.hideOnTablet ? 'md:hidden xl:flex' : 'md:flex'}`}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#6FBEE5]/10 group-hover:border-[#6FBEE5]/30 transition-all">
                                        <div className="group-hover:scale-110 transition-transform">
                                            {action.icon}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-bold text-lg tracking-tight group-hover:text-[#6FBEE5] transition-colors">{action.title}</h4>
                                        <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-1 group-hover:translate-y-0">Execute Prompt</p>
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 text-white/5 group-hover:text-[#6FBEE5] transition-all" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Input Section */}
                <div className="w-full px-4 pb-4 sm:pb-12 mt-auto">
                    <div className="max-w-4xl mx-auto w-full relative group">
                        {/* The Glowing Animated Border Wrap */}
                        <div className="absolute -inset-[1.5px] bg-gradient-to-r from-[#6FBEE5] via-[#A890FE] via-[#FF3DBC] via-[#00FFD1] via-[#6FBEE5] via-[#A890FE] to-[#6FBEE5] rounded-[2.1rem] sm:rounded-[3.6rem] opacity-70 blur-md group-focus-within:opacity-100 group-focus-within:blur-xl transition-all duration-700 animate-border-flow" />
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-[#6FBEE5] via-[#A890FE] via-[#FF3DBC] via-[#00FFD1] via-[#6FBEE5] via-[#A890FE] to-[#6FBEE5] rounded-[2.1rem] sm:rounded-[3.6rem] opacity-100 animate-border-flow" />

                        <div className="relative bg-[#050B15] backdrop-blur-3xl rounded-[2rem] sm:rounded-[3.5rem] py-3 px-4 sm:p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] transition-all">
                            <div className="flex flex-col gap-2 sm:gap-6">
                                <textarea
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault()
                                            handleSendMessage()
                                        }
                                    }}
                                    placeholder="Ask Mindy AI anything..."
                                    rows={1}
                                    className="w-full bg-transparent text-white placeholder:text-white/20 focus:outline-none resize-none text-base sm:text-lg py-1 px-2 sm:px-4 font-normal leading-relaxed scrollbar-none"
                                />

                                <div className="flex items-center justify-between px-1 sm:px-3">
                                    <div className="flex items-center gap-4 sm:gap-8 text-white/20">
                                        <button className="cursor-pointer hover:text-[#6FBEE5] hover:scale-110 transition-all duration-300"><Plus className="w-5 h-5 sm:w-6 sm:h-6" /></button>
                                        <button className="cursor-pointer hover:text-[#6FBEE5] hover:scale-110 transition-all duration-300"><ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" /></button>
                                        <button className="cursor-pointer hover:text-[#6FBEE5] hover:scale-110 transition-all duration-300"><AtSign className="w-5 h-5 sm:w-6 sm:h-6" /></button>
                                        <button className="cursor-pointer hover:text-[#6FBEE5] hover:scale-110 transition-all duration-300"><Sparkles className="w-5 h-5 sm:w-6 sm:h-6" /></button>
                                    </div>

                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!inputValue.trim()}
                                        className={`cursor-pointer w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-500 ${inputValue.trim()
                                            ? "bg-[#6FBEE5] text-white scale-100 opacity-100 shadow-[0_0_30px_rgba(111,190,229,0.5)] rotate-0"
                                            : "bg-white/5 text-white/10 scale-90 opacity-0 rotate-[-45deg] pointer-events-none"
                                            }`}
                                    >
                                        <ArrowUpRight className="w-6 h-6 sm:w-7 sm:h-7" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
