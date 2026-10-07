import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Check } from 'lucide-react';

interface MysteryBoxProps {
  id?: string;
  isRevealed?: boolean;
  revealedValue?: number;
  size?: 'sm' | 'md' | 'lg';
  animating?: boolean;
}

export const MysteryBox: React.FC<MysteryBoxProps> = ({
  isRevealed = false,
  revealedValue,
  size = 'md',
  animating = false
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-13 h-13 text-sm',
    lg: 'w-16 h-16 text-base'
  }[size];

  return (
    <motion.div
      layout
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: animating ? [0, -6, 0] : 0 
      }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`relative select-none flex flex-col items-center justify-center rounded-lg font-bold text-white shadow-md transition-shadow group ${sizeClasses}`}
      style={{
        background: isRevealed 
          ? 'linear-gradient(135deg, #059669 0%, #10B981 100%)' 
          : 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
        boxShadow: isRevealed 
          ? '0 6px 12px -2px rgba(16, 185, 129, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)' 
          : '0 6px 14px -2px rgba(37, 99, 235, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.25)'
      }}
      title={isRevealed ? `x = ${revealedValue}` : "Mystery Box (unknown value x)"}
    >
      {/* 3D top bevel highlight */}
      <div className="absolute inset-x-1 top-1 h-2 rounded bg-white/20 pointer-events-none" />

      {/* Box content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {isRevealed ? (
          <div className="flex flex-col items-center leading-none">
            <span className="text-[10px] uppercase font-mono tracking-wider opacity-85">x =</span>
            <span className="text-base font-extrabold tracking-tight">{revealedValue}</span>
          </div>
        ) : (
          <div className="flex items-center gap-0.5">
            <span className="font-serif italic text-lg tracking-normal">x</span>
            <HelpCircle className="w-3 h-3 opacity-60 text-blue-100" />
          </div>
        )}
      </div>

      {/* Subtle corner badge for mystery box */}
      <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-white/40" />
    </motion.div>
  );
};
