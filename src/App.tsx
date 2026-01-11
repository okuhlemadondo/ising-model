import { useState, useMemo, useEffect } from 'react'
import { IsingModel } from './engine/IsingModel'
import SimulationCanvas from './components/SimulationCanvas'
import ControlPanel from './components/ControlPanel'
import StatsDisplay from './components/StatsDisplay'
import { Sun, Moon } from 'lucide-react'

function App() {
    const [size, setSize] = useState<number>(256);
    const [temp, setTemp] = useState<number>(2.27);
    const [field, setField] = useState<number>(0);
    const [running, setRunning] = useState<boolean>(false);
    const [stepsPerFrame, setStepsPerFrame] = useState<number>(10000);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

    const model = useMemo(() => {
        setRunning(false);
        return new IsingModel(size);
    }, [size]);

    const [stats, setStats] = useState({ energy: 0, magnetization: 0 });

    useEffect(() => {
        let interval: number;
        if (running) {
            interval = setInterval(() => {
                setStats({
                    energy: model.energy,
                    magnetization: model.magnetization
                });
            }, 100);
        } else {
            setStats({
                energy: model.energy,
                magnetization: model.magnetization
            });
        }
        return () => clearInterval(interval);
    }, [running, model]);

    const handleReset = () => {
        model.randomize();
        setStats({
            energy: model.energy,
            magnetization: model.magnetization
        });
    };

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    // Apply theme class to a specific wrapper for easy scoping
    const themeClass = isDarkMode ? 'bg-black text-white selection:bg-white selection:text-black' : 'bg-gray-100 text-gray-900 selection:bg-black selection:text-white';
    const headerClass = isDarkMode ? 'mix-blend-difference' : '';

    return (
        <div className={`min-h-screen transition-colors duration-300 ${themeClass} flex flex-col font-sans overflow-x-hidden`}>

            {/* Header Navigation */}
            <header className={`fixed top-0 left-0 w-full p-4 lg:p-6 flex justify-between items-center z-50 ${headerClass}`}>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? 'bg-white' : 'bg-black'}`}></div>
                    <span className={`text-[10px] tracking-[0.25em] uppercase font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Ising.Sim</span>
                </div>

                <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-full transition-all ${isDarkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-black/10 text-gray-600 hover:text-black'}`}
                    title="Toggle Theme"
                >
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col lg:flex-row items-center justify-between p-4 pt-20 lg:p-8 lg:pt-0 gap-8 w-full max-w-[1800px] mx-auto lg:h-screen lg:max-h-screen">

                {/* LEFT COLUMN: Title & Specs (Desktop Only) */}
                <div className="hidden lg:flex flex-col justify-center h-full w-full max-w-xs space-y-8 order-1">
                    <div>
                        <div className={`text-[10px] tracking-[0.25em] mb-2 uppercase ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>System.Specification</div>
                        <h1 className={`text-5xl font-light uppercase tracking-tight leading-tight ${isDarkMode ? 'text-white/90' : 'text-black/80'}`}>
                            Ising<br />Model
                        </h1>
                    </div>

                    <div className={`text-xs font-mono leading-relaxed ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        <p>A mathematical model of ferromagnetism in statistical mechanics. The model consists of discrete variables that represent magnetic dipole moments of atomic spins that can be in one of two states (+1 or -1).</p>
                    </div>

                    <div className="text-[10px] tracking-widest font-mono text-gray-600">
                        EPOCH: 2026.XII // BUILD.8992
                    </div>
                </div>

                {/* CENTER COLUMN: Visualizer */}
                <div className="relative order-1 lg:order-2 flex-1 flex flex-col items-center justify-center w-full h-full p-4 lg:p-0">
                    {/* Mobile Title */}
                    <div className="lg:hidden text-center mb-8">
                        <h1 className="text-3xl uppercase font-light tracking-tight">Ising Model</h1>
                    </div>

                    <div className="relative w-full aspect-square max-w-[500px] lg:max-w-[650px] lg:max-h-[70vh]">
                        {/* Decorative lines around canvas */}
                        <div className={`absolute -top-4 -left-4 w-4 h-[1px] ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}></div>
                        <div className={`absolute -top-4 -left-4 w-[1px] h-4 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}></div>

                        <SimulationCanvas
                            model={model}
                            running={running}
                            temp={temp}
                            field={field}
                            stepsPerFrame={stepsPerFrame}
                            isDarkMode={isDarkMode}
                        />
                    </div>
                </div>

                {/* RIGHT COLUMN: Controls */}
                <div className="flex flex-col justify-center h-full w-full max-w-sm order-2 lg:order-3 gap-6 lg:gap-8 lg:pr-8">
                    {/* Section Headers for visual grouping */}
                    <div className={`hidden lg:block text-[10px] tracking-[0.2em] uppercase pl-1 border-l ${isDarkMode ? 'text-gray-600 border-gray-800' : 'text-gray-400 border-gray-300'}`}>
                        Control_Interface
                    </div>

                    <ControlPanel
                        temp={temp} setTemp={setTemp}
                        field={field} setField={setField}
                        running={running} setRunning={setRunning}
                        stepsPerFrame={stepsPerFrame} setStepsPerFrame={setStepsPerFrame}
                        size={size} setSize={setSize}
                        reset={handleReset}
                        isDarkMode={isDarkMode}
                    />

                    <StatsDisplay
                        energy={stats.energy}
                        magnetization={stats.magnetization}
                        size={size}
                        isDarkMode={isDarkMode}
                    />
                </div>

                {/* Nav Circle */}
                <div className={`fixed bottom-6 right-6 w-8 h-8 rounded-full border flex items-center justify-center text-[10px] transition-all cursor-pointer z-50 bg-transparent backdrop-blur-sm
                ${isDarkMode
                        ? 'border-gray-800 text-gray-600 hover:bg-white hover:text-black'
                        : 'border-gray-300 text-gray-400 hover:bg-black hover:text-white'
                    }`}>
                    N
                </div>
            </main>
        </div>
    )
}

export default App
