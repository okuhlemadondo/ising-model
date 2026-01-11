import React from 'react';
import TechnicalFrame from './TechnicalFrame';

interface Props {
    energy: number;
    magnetization: number;
    size: number;
    isDarkMode: boolean;
}

const StatsDisplay: React.FC<Props> = ({ energy, magnetization, size, isDarkMode }) => {
    // Normalize values
    const n = size * size;
    const ePerSpin = energy / n;
    const mPerSpin = magnetization / n;

    const subTextColor = isDarkMode ? 'text-gray-400' : 'text-gray-500';
    const trackColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-200';
    const indicatorColor = isDarkMode ? 'bg-white' : 'bg-black';

    return (
        <TechnicalFrame title="SYSTEM_METRICS" className="w-full" isDarkMode={isDarkMode}>
            <div className="flex flex-col gap-4 font-mono text-xs">

                {/* Energy */}
                <div className="space-y-1">
                    <div className={`flex justify-between ${subTextColor} uppercase tracking-wider`}>
                        <span>Energy Potential [E]</span>
                        <span>{ePerSpin.toFixed(5)}</span>
                    </div>
                    <div className={`h-[1px] w-full ${trackColor} relative`}>
                        {/* Indicator */}
                        <div
                            className={`absolute top-1/2 -translate-y-1/2 w-1 h-2 ${indicatorColor} transition-all duration-75`}
                            style={{ left: `${((ePerSpin + 2) / 2) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Magnetization */}
                <div className="space-y-1">
                    <div className={`flex justify-between ${subTextColor} uppercase tracking-wider`}>
                        <span>Net Magnetization [M]</span>
                        <span>{mPerSpin.toFixed(5)}</span>
                    </div>
                    <div className={`h-[1px] w-full ${trackColor} relative`}>
                        {/* Center marker */}
                        <div className="absolute left-1/2 top-[-2px] w-[1px] h-[5px] bg-gray-500"></div>
                        {/* Indicator */}
                        <div
                            className={`absolute top-1/2 -translate-y-1/2 w-1 h-2 ${indicatorColor} transition-all duration-75`}
                            style={{ left: `${((mPerSpin + 1) / 2) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Meta */}
                <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-white/10 text-gray-500' : 'border-black/10 text-gray-400'} flex justify-between text-[10px] uppercase tracking-widest`}>
                    <span>Grid_Dim: {size}x{size}</span>
                    <span>Total_Spins: {n}</span>
                </div>
            </div>
        </TechnicalFrame>
    );
};

export default StatsDisplay;
