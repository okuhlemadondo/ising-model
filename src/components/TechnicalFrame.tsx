import React from 'react';

interface Props {
    title?: string;
    children: React.ReactNode;
    className?: string;
    isDarkMode?: boolean;
}

// A technical container with corner accents and a label
const TechnicalFrame: React.FC<Props> = ({ title, children, className = "", isDarkMode = true }) => {
    const borderColor = isDarkMode ? 'border-white/10' : 'border-black/10';
    const accentColor = isDarkMode ? 'border-white/40' : 'border-black/40';
    const labelBg = isDarkMode ? 'bg-black text-gray-400' : 'bg-gray-100 text-gray-500';

    return (
        <div className={`relative p-6 border ${borderColor} ${className}`}>
            {/* Corner Accents */}
            {/* Top Left */}
            <div className={`absolute top-0 left-0 w-2 h-2 border-l border-t ${accentColor}`}></div>
            {/* Top Right */}
            <div className={`absolute top-0 right-0 w-2 h-2 border-r border-t ${accentColor}`}></div>
            {/* Bottom Left */}
            <div className={`absolute bottom-0 left-0 w-2 h-2 border-l border-b ${accentColor}`}></div>
            {/* Bottom Right */}
            <div className={`absolute bottom-0 right-0 w-2 h-2 border-r border-b ${accentColor}`}></div>

            {title && (
                <div className={`absolute -top-3 left-4 px-2 text-[10px] uppercase tracking-[0.2em] ${labelBg}`}>
                    {title}
                </div>
            )}

            {children}
        </div>
    );
};

export default TechnicalFrame;
