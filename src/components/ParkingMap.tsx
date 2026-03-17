import React from 'react';
import { motion } from 'motion/react';
import { AGVPosition } from '../types';

interface ParkingMapProps {
  agvPos?: AGVPosition;
  highlightSpot?: { x: number; y: number };
  className?: string;
}

const ROWS = 4;
const COLS = 6;
const CELL_SIZE = 40;
const GAP = 8;

export default function ParkingMap({ agvPos, highlightSpot, className = "" }: ParkingMapProps) {
  const width = COLS * (CELL_SIZE + GAP) + GAP;
  const height = ROWS * (CELL_SIZE + GAP) + GAP;

  return (
    <div className={`relative bg-zinc-100 rounded-2xl p-4 overflow-hidden border border-zinc-200 ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        style={{ maxWidth: '100%' }}
      >
        {/* Grid of spots */}
        {Array.from({ length: ROWS }).map((_, r) =>
          Array.from({ length: COLS }).map((_, c) => {
            const x = c * (CELL_SIZE + GAP) + GAP;
            const y = r * (CELL_SIZE + GAP) + GAP;
            const isHighlighted = highlightSpot?.x === c && highlightSpot?.y === r;

            return (
              <rect
                key={`${r}-${c}`}
                x={x}
                y={y}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx={4}
                className={`${
                  isHighlighted 
                    ? 'fill-emerald-500 stroke-emerald-600' 
                    : 'fill-white stroke-zinc-200'
                } stroke-1`}
              />
            );
          })
        )}

        {/* AGV Indicator */}
        {agvPos && (
          <motion.g
            animate={{ x: agvPos.x * (CELL_SIZE + GAP) + GAP, y: agvPos.y * (CELL_SIZE + GAP) + GAP }}
            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
          >
            <rect
              width={CELL_SIZE}
              height={CELL_SIZE}
              rx={6}
              className="fill-blue-600 shadow-lg"
            />
            <circle cx={CELL_SIZE / 2} cy={CELL_SIZE / 2} r={4} className="fill-white animate-pulse" />
            {agvPos.label && (
              <text
                x={CELL_SIZE / 2}
                y={-5}
                textAnchor="middle"
                className="text-[8px] font-bold fill-blue-700 uppercase"
              >
                {agvPos.label}
              </text>
            )}
          </motion.g>
        )}
      </svg>
      
      <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white border border-zinc-200 rounded-sm" />
          <span>Empty</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-sm" />
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-sm" />
          <span>Robot</span>
        </div>
      </div>
    </div>
  );
}
