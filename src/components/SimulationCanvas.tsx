import React, { useEffect, useRef } from 'react';
import { IsingModel } from '../engine/IsingModel';

interface Props {
    model: IsingModel;
    running: boolean;
    temp: number;
    field: number;
    stepsPerFrame: number;
    isDarkMode: boolean;
}

const SimulationCanvas: React.FC<Props> = ({ model, running, temp, field, stepsPerFrame, isDarkMode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        // Resize canvas to match model size (1 pixel per spin)
        canvas.width = model.size;
        canvas.height = model.size;

        // Image data for direct pixel manipulation
        const imageData = ctx.createImageData(model.size, model.size);
        const buf = new Uint32Array(imageData.data.buffer);

        const render = () => {
            // Run simulation steps
            if (running) {
                model.step(temp, field, stepsPerFrame);
            }

            // Draw
            // Axiomatic Aesthetic:
            // Dark Mode: +1 (Up) = White/Grey, -1 (Down) = Black
            // Light Mode: +1 (Up) = Black/DarkGrey, -1 (Down) = White
            // ABGR Format (Little Endian): 0xAABBGGRR

            const WHITEish = 0xFFE5E5E5;
            const BLACKish = 0xFF050505;

            let UP, DOWN;
            if (isDarkMode) {
                UP = WHITEish;
                DOWN = BLACKish;
            } else {
                UP = BLACKish;
                DOWN = WHITEish;
            }

            for (let i = 0; i < model.grid.length; i++) {
                buf[i] = model.grid[i] === 1 ? UP : DOWN;
            }

            ctx.putImageData(imageData, 0, 0);

            // Request next frame
            animationRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [model, running, temp, field, stepsPerFrame, isDarkMode]);

    return (
        <div className={`relative w-full h-full flex items-center justify-center p-1 border ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
            {/* Crosshairs */}
            <div className={`absolute top-0 left-0 w-4 h-[1px] ${isDarkMode ? 'bg-white/20' : 'bg-black/20'}`}></div>
            <div className={`absolute top-0 left-0 w-[1px] h-4 ${isDarkMode ? 'bg-white/20' : 'bg-black/20'}`}></div>
            <div className={`absolute bottom-0 right-0 w-4 h-[1px] ${isDarkMode ? 'bg-white/20' : 'bg-black/20'}`}></div>
            <div className={`absolute bottom-0 right-0 w-[1px] h-4 ${isDarkMode ? 'bg-white/20' : 'bg-black/20'}`}></div>

            <canvas
                ref={canvasRef}
                className="block w-full h-full max-w-[600px] max-h-[600px] rendering-pixelated"
                style={{ imageRendering: 'pixelated' }}
            />

            <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                SUBJECT_01.SCAN
            </div>
        </div>
    );
};

export default SimulationCanvas;
