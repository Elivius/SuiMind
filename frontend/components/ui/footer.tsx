"use client"

import { Wallet, Github, Twitter, ExternalLink } from "lucide-react"
import Link from "next/link"

const footerLinks = {
    product: [
        { label: "Features", href: "#" },
        { label: "How it Works", href: "#" },
        { label: "Pricing", href: "#" },
    ],
    resources: [
        { label: "Documentation", href: "#" },
        { label: "API Reference", href: "#" },
        { label: "Blog", href: "#" },
    ],
    company: [
        { label: "About", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
    ],
}

const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
]

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="w-full px-6 py-6">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-4">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6FBEE5] to-[#4A9FCC] flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">SuiMind</span>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-4">
                            AI-powered financial intelligence on the Sui blockchain.
                            Empowering users with smart insights and seamless DeFi experiences.
                        </p>
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-[#6FBEE5]/30 transition-all"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 hover:text-[#6FBEE5] transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Resources</h4>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 hover:text-[#6FBEE5] transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 hover:text-[#6FBEE5] transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Hackathon Badge & Bottom Bar */}
                <div className="pt-4 border-t border-white/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Hackathon Badge */}
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#6FBEE5]/10 to-[#4A9FCC]/10 border border-[#6FBEE5]/20">
                            <span className="text-[#6FBEE5] text-sm font-medium">🏆 Built for Sui Overflow Hackathon 2025</span>
                            <ExternalLink className="w-4 h-4 text-[#6FBEE5]/60" />
                        </div>

                        {/* Copyright */}
                        <div className="flex items-center gap-6 text-white/40 text-sm">
                            <span>© 2025 SuiMind. All rights reserved.</span>
                            <div className="hidden md:flex items-center gap-4">
                                <Link href="#" className="hover:text-white/60 transition-colors">Privacy</Link>
                                <Link href="#" className="hover:text-white/60 transition-colors">Terms</Link>
                            </div>
                        </div>
                    </div>

                    {/* Powered by Sui */}
                    <div className="mt-3 text-center">
                        <p className="text-white/30 text-xs uppercase tracking-widest">
                            Powered by Sui Network & Advanced AI
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
