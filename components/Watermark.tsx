import React from 'react';

interface WatermarkProps {
  text: string;
}

export const Watermark: React.FC<WatermarkProps> = ({ text }) => {
  // Create a repeating pattern of the watermark text
  const repeats = Array(20).fill(0);

  return (
    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden select-none flex flex-wrap content-center justify-center opacity-30">
        <div className="absolute inset-0 flex flex-col justify-between">
           {repeats.map((_, rowIdx) => (
             <div key={rowIdx} className="flex justify-around opacity-40">
               {repeats.map((_, colIdx) => (
                 <div 
                  key={`${rowIdx}-${colIdx}`} 
                  className="transform -rotate-45 text-gray-500 font-bold text-xl whitespace-nowrap p-12"
                 >
                   {text}
                 </div>
               ))}
             </div>
           ))}
        </div>
    </div>
  );
};