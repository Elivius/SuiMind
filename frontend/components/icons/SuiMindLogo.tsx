export const SuiMindLogo: React.FC<{ className?: string }> = ({ className = "w-15 h-15" }) => {
    return (
        <img
            src="/SuiMindLogo.png"
            alt="SuiMind Logo"
            className={`w-full h-full object-cover ${className}`}
        />
    )
}

