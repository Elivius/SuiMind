"use client"

export function FloatingOrbs() {
    return (
        <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#9945FF]/20 rounded-full blur-[128px] animate-float-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#14F195]/15 rounded-full blur-[100px] animate-float-slower" />
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#9945FF]/10 rounded-full blur-[80px] animate-float" />
        </div>
    )
}