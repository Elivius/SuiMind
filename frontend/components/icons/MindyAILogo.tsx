"use client"

import React from 'react';
import { motion as Motion } from 'motion/react';

export const MindyAILogo = ({ className = "w-6 h-6" }: { className?: string }) => {
    return (
        <div className={`relative ${className} filter drop-shadow-[0_0_8px_rgba(111,190,229,0.3)]`}>
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <defs>
                    <linearGradient id="hub-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6FBEE5" />
                        <stop offset="0.5" stopColor="#8B5CF6" />
                        <stop offset="1" stopColor="#A855F7" />
                    </linearGradient>
                    <filter id="hub-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Orbiting Paths - More visible */}
                <circle cx="50" cy="50" r="38" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="4 6" />
                <circle cx="50" cy="50" r="22" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />

                {/* Connecting Lines - More visible */}
                <g stroke="white" strokeOpacity="0.3" strokeWidth="0.75">
                    <line x1="50" y1="50" x2="85" y2="50" />
                    <line x1="50" y1="50" x2="15" y2="50" />
                    <line x1="50" y1="50" x2="50" y2="15" />
                    <line x1="50" y1="50" x2="50" y2="85" />
                    <line x1="50" y1="50" x2="74.7" y2="25.3" />
                    <line x1="50" y1="50" x2="25.3" y2="74.7" />
                </g>

                {/* Outer Nodes - Enhanced scaling and glow */}
                <Motion.circle
                    cx="85" cy="50" r="5" fill="url(#hub-grad)"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <Motion.circle
                    cx="15" cy="50" r="5" fill="url(#hub-grad)"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
                <Motion.circle
                    cx="50" cy="15" r="5" fill="url(#hub-grad)"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                <Motion.circle
                    cx="50" cy="85" r="5" fill="url(#hub-grad)"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                />

                {/* Central Core - Stronger Glow */}
                <circle cx="50" cy="50" r="14" fill="url(#hub-grad)" filter="url(#hub-glow)" />

                {/* Gemini Spark in Core - Brighter */}
                <path
                    d="M50 40L52 48L60 50L52 52L50 60L48 52L40 50L48 48L50 40Z"
                    fill="white"
                    className="drop-shadow-[0_0_3px_white]"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 50 50"
                        to="360 50 50"
                        dur="8s"
                        repeatCount="indefinite"
                    />
                </path>
            </svg>
        </div>
    );
};
