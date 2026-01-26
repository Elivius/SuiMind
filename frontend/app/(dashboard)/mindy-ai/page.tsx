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
        className: "sm:w-[450px] sm:rotate-[-2deg] sm:-translate-x-4"
    },
    {
        icon: <Scan className="w-4 h-4 text-blue-400" />,
        title: "Pay via screenshot",
        prompt: "I want to upload a screenshot to make a payment.",
        className: "sm:w-[360px] sm:rotate-[1.5deg] sm:translate-y-4"
    },
    {
        icon: <AtSign className="w-4 h-4 text-[#6FBEE5]" />,
        title: "Pay @someone",
        prompt: "I want to send some SUI to a contact.",
        className: "sm:w-[340px] sm:rotate-[-1.2deg] sm:-translate-y-6 sm:translate-x-8"
    },
    {
        icon: <FileText className="w-4 h-4 text-purple-400" />,
        title: "Upload file and pay",
        prompt: "I want to upload a document or file for payment.",
        className: "sm:w-[480px] sm:rotate-[2deg] sm:translate-x-[-10px] sm:translate-y-2"
    },
    {
        icon: <Camera className="w-4 h-4 text-orange-400" />,
        title: "Snap and pay",
        prompt: "I want to use my camera to snap a QR and pay.",
        className: "sm:w-[380px] sm:rotate-[-1.5deg] sm:translate-y-[-4px] sm:translate-x-4"
    },
    {
        icon: <Banknote className="w-4 h-4 text-emerald-300" />,
        title: "Show latest transfers",
        prompt: "Show me my latest transaction history.",
        className: "sm:w-[420px] sm:rotate-[1deg] sm:translate-x-[-20px] sm:translate-y-8"
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
        <div className="w-full mx-auto px-4 sm:px-6 py-6 min-h-[calc(100vh-120px)] flex flex-col relative overflow-hidden font-sans">
            <div className="flex-1 flex flex-col relative z-10 max-w-6xl mx-auto w-full">
                {/* Main Interaction Area */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-full mb-12 relative">
                        <h1 className="text-5xl md:text-7xl lg:text-7xl font-serif text-white italic tracking-tight leading-tight relative z-10">
                            How can I <span className="text-transparent font-bold bg-clip-text bg-gradient-to-r from-[#6FBEE5] to-[#A890FE]">help</span> you?
                        </h1>

                        {/* HIGHLY ORGANIC / MESSY ARRANGE - PROJECT STYLE */}
                        <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-12 w-full max-w-5xl mx-auto px-4 py-10 relative">
                            {QUICK_ACTIONS.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleActionClick(action.prompt)}
                                    className={`flex items-center gap-4 px-8 py-5 rounded-[2.5rem] bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] hover:border-[#6FBEE5]/40 transition-all duration-500 hover:scale-[1.05] hover:rotate-0 hover:translate-x-0 hover:translate-y-0 text-white font-semibold text-left shadow-2xl backdrop-blur-3xl group ${action.className}`}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#6FBEE5]/10 group-hover:border-[#6FBEE5]/30 transition-all">
                                        <div className="group-hover:scale-110 transition-transform">
                                            {action.icon}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-extrabold text-lg tracking-tight group-hover:text-[#6FBEE5] transition-colors">{action.title}</h4>
                                        <p className="text-white/20 text-[10px] uppercase font-black tracking-widest mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-1 group-hover:translate-y-0">Execute Prompt</p>
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 text-white/5 group-hover:text-[#6FBEE5] transition-all" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Input Section */}
                <div className="w-full px-4 pb-12 mt-auto">
                    <div className="bg-[#111827]/60 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] relative group transition-all hover:bg-[#111827]/80 focus-within:ring-2 focus-within:ring-[#6FBEE5]/30">
                        <div className="flex flex-col gap-6">
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
                                className="w-full bg-transparent text-white placeholder:text-white/20 focus:outline-none resize-none text-lg py-1 px-4 font-light leading-relaxed scrollbar-none"
                            />

                            <div className="flex items-center justify-between px-3">
                                <div className="flex items-center gap-8 text-white/20">
                                    <button className="hover:text-[#6FBEE5] hover:scale-110 transition-all duration-300"><Plus className="w-6 h-6" /></button>
                                    <button className="hover:text-[#6FBEE5] hover:scale-110 transition-all duration-300"><ImageIcon className="w-6 h-6" /></button>
                                    <button className="hover:text-[#6FBEE5] hover:scale-110 transition-all duration-300"><AtSign className="w-6 h-6" /></button>
                                    <button className="hover:text-[#6FBEE5] hover:scale-110 transition-all duration-300"><Sparkles className="w-6 h-6" /></button>
                                </div>

                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim()}
                                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${inputValue.trim()
                                        ? "bg-[#6FBEE5] text-white scale-100 opacity-100 shadow-[0_0_30px_rgba(111,190,229,0.5)] rotate-0"
                                        : "bg-white/5 text-white/10 scale-90 opacity-0 rotate-[-45deg] pointer-events-none"
                                        }`}
                                >
                                    <ArrowUpRight className="w-7 h-7" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:italic&family=Inter:wght@300;400;600;900&display=swap');
                .font-serif {
                    font-family: 'Instrument Serif', serif;
                }
                body {
                    font-family: 'Inter', sans-serif;
                }
                .scrollbar-none::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-none {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    )
}
