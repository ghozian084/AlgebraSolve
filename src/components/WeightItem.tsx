import React from 'react';
import { motion } from 'motion/react';

interface WeightItemProps {
  value: number; // typically +1 or -1, or bundled
  isZeroPairCandidate?: boolean;
  size?: 'sm' | 'md';
}

export const WeightItem: React.FC<WeightItemProps> = ({
  value,
  isZeroPairCandidate = false,
  size = 'md'
}) => {
  const isPositive = value > 0;
  
  const sizeClasses = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-7.5 h-7.5 text-xs';

  return (
    <motion.div
      layout
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`relative select-none rounded-full flex items-center justify-center font-bold shadow-sm transition-transform ${sizeClasses} ${
        isZeroPairCandidate ? 'ring-2 ring-amber-400 ring-offset-1 animate-pulse' : ''
      }`}
      style={{
        background: isPositive
          ? 'linear-gradient(145deg, #F59E0B 0%, #D97706 100%)' // Gold/Brass weight
          : 'linear-gradient(145deg, #EF4444 0%, #B91C1C 100%)', // Crimson negative weight
        color: '#FFFFFF',
        boxShadow: isPositive
          ? '0 3px 6px -1px rgba(217, 119, 6, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.5)'
          : '0 3px 6px -1px rgba(185, 28, 28, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}
      title={isPositive ? `Unit Weight (+1)` : `Negative Unit Weight (-1)`}
    >
      {/* Top rim highlight */}
      <div className="absolute inset-x-1 top-0.5 h-1.5 rounded-full bg-white/35 pointer-events-none" />

      {/* Label */}
      <span className="relative z-10 font-mono tracking-tighter">
        {isPositive ? '+1' : '-1'}
      </span>
    </motion.div>
  );
};

interface WeightClusterProps {
  count: number; // can be positive, negative, or 0
  maxIndividualRender?: number;
}

export const WeightCluster: React.FC<WeightClusterProps> = ({ count, maxIndividualRender = 18 }) => {
  if (count === 0) return null;

  const isPositive = count > 0;
  const absCount = Math.abs(count);
  const showCompactBadge = absCount > maxIndividualRender;
  const renderCount = showCompactBadge ? Math.min(absCount, 12) : absCount;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex flex-wrap items-center justify-center gap-1 max-w-[190px]">
        {Array.from({ length: renderCount }).map((_, i) => (
          <WeightItem key={`weight-${isPositive ? 'pos' : 'neg'}-${i}`} value={isPositive ? 1 : -1} />
        ))}
      </div>

      {showCompactBadge ? (
        <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md ${
          isPositive ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
        }`}>
          Total: {count > 0 ? `+${count}` : count}
        </span>
      ) : (
        <span className="text-[10px] text-slate-500 font-mono">
          {count > 0 ? `+${count}` : count}
        </span>
      )}
    </div>
  );
};
