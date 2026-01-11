import React from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import TechnicalFrame from './TechnicalFrame';

interface Props {
    temp: number;
    setTemp: (t: number) => void;
    field: number;
    setField: (h: number) => void;
    running: boolean;
    setRunning: (r: boolean) => void;
    stepsPerFrame: number;
    setStepsPerFrame: (s: number) => void;
    reset: () => void;
    size: number;
    setSize: (s: number) => void;
    isDarkMode: boolean;
}

const ControlPanel: React.FC<Props> = ({
    temp, setTemp,
    field, setField,
    running, setRunning,
    stepsPerFrame, setStepsPerFrame,
    reset,
    size, setSize,
    isDarkMode
}) => {
    // Dynamic styles
    const textColor = isDarkMode ? 'text-white' : 'text-black';
    const subTextColor = isDarkMode ? 'text-gray-400' : 'text-gray-500';
    const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
    const activeBorder = isDarkMode ? 'border-white' : 'border-black';
    const inputThumbBg = isDarkMode ? '[&::-webkit-slider-thumb]:bg-white' : '[&::-webkit-slider-thumb]:bg-black';

    return (
        <TechnicalFrame title="CORE_CONTROLS" className="w-full lg:w-80" isDarkMode={isDarkMode}>
            <div className="flex flex-col gap-8 font-mono text-xs">

                {/* Status Indicator */}
                <div className={`flex justify-between items-center border-b pb-4 ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
                    <span className={`${subTextColor} uppercase tracking-widest`}>Status</span>
                    <span className={`tracking-widest uppercase ${running ? `${textColor} animate-pulse` : 'text-gray-600'}`}>
                        {running ? 'Simulating' : 'Standby'}
                    </span>
                </div>

                {/* Primary Controls */}
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => setRunning(!running)}
                        className={`flex items-center justify-center gap-2 py-3 border transition-all uppercase tracking-wider hover:opacity-80 ${running
                                ? `${activeBorder} ${textColor}`
                                : `${borderColor} text-gray-400`
                            }`}
                    >
                        {running ? <Pause size={12} /> : <Play size={12} />}
                        {running ? 'Halt' : 'Execute'}
                    </button>
                    <button
                        onClick={reset}
                        className={`flex items-center justify-center py-3 border ${borderColor} text-gray-400 hover:${activeBorder} hover:${textColor} transition-all`}
                        title="Reset Random"
                    >
                        <RefreshCw size={12} />
                    </button>
                </div>

                {/* Sliders Area */}
                <div className="space-y-6">
                    {/* Temp */}
                    <div className="space-y-2 group">
                        <div className="flex justify-between">
                            <span className={`${subTextColor} uppercase`}>Temperature [T]</span>
                            <span className={textColor}>{temp.toFixed(2)}</span>
                        </div>
                        <input
                            type="range"
                            min="0.1"
                            max="5.0"
                            step="0.01"
                            value={temp}
                            onChange={(e) => setTemp(parseFloat(e.target.value))}
                            className={`w-full h-[1px] bg-gray-700 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 ${inputThumbBg} [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black`}
                        />
                        <div className="flex justify-between text-[10px] text-gray-500 font-sans">
                            <span>0.0</span>
                            <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>CRITICAL_POINT ≈ 2.27</span>
                            <span>5.0</span>
                        </div>
                    </div>

                    {/* Field */}
                    <div className="space-y-2 group">
                        <div className="flex justify-between">
                            <span className={`${subTextColor} uppercase`}>External Field [H]</span>
                            <span className={textColor}>{field.toFixed(2)}</span>
                        </div>
                        <input
                            type="range"
                            min="-2.0"
                            max="2.0"
                            step="0.05"
                            value={field}
                            onChange={(e) => setField(parseFloat(e.target.value))}
                            className={`w-full h-[1px] bg-gray-700 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 ${inputThumbBg} [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black`}
                        />
                    </div>

                    {/* Speed */}
                    <div className="space-y-2 group">
                        <div className="flex justify-between">
                            <span className={`${subTextColor} uppercase`}>Compute Velocity</span>
                            <span className={textColor}>{stepsPerFrame / 1000}k OPS</span>
                        </div>
                        <input
                            type="range"
                            min="1000"
                            max="50000"
                            step="1000"
                            value={stepsPerFrame}
                            onChange={(e) => setStepsPerFrame(parseInt(e.target.value))}
                            className={`w-full h-[1px] bg-gray-700 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 ${inputThumbBg} [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black`}
                        />
                    </div>
                </div>

                {/* Grid Size Control */}
                <div className={`space-y-2 pt-4 border-t ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
                    <div className="flex justify-between items-center">
                        <span className={`${subTextColor} uppercase`}>Lattice Resolution</span>
                        <select
                            value={size}
                            onChange={(e) => setSize(parseInt(e.target.value))}
                            className={`bg-transparent border ${borderColor} ${textColor} text-xs p-1 outline-none focus:${activeBorder} uppercase`}
                            disabled={running}
                        >
                            <option value="64">64 x 64</option>
                            <option value="128">128 x 128</option>
                            <option value="256">256 x 256</option>
                            <option value="512">512 x 512</option>
                        </select>
                    </div>
                </div>
            </div>
        </TechnicalFrame>
    );
};

export default ControlPanel;
