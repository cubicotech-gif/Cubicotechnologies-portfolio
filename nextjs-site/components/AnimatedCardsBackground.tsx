'use client';

import { motion } from 'framer-motion';

interface CardColumn {
  position: string;
  direction: 'up' | 'down';
  duration: number;
  cards: Array<{
    gradient: string;
    delay: number;
    opacity: number;
  }>;
}

export default function AnimatedCardsBackground() {
  const columns: CardColumn[] = [
    // Column 1 - Far Left (Moves UP)
    {
      position: '5%',
      direction: 'up',
      duration: 40,
      cards: [
        { gradient: 'from-purple-600/40 to-pink-600/40', delay: 0, opacity: 0.5 },
        { gradient: 'from-blue-600/40 to-purple-600/40', delay: 5, opacity: 0.4 },
        { gradient: 'from-cyan-600/40 to-blue-600/40', delay: 10, opacity: 0.5 },
        { gradient: 'from-purple-600/40 to-pink-600/40', delay: 15, opacity: 0.4 },
        { gradient: 'from-pink-600/40 to-purple-600/40', delay: 20, opacity: 0.5 },
      ],
    },
    // Column 2 - Left Center (Moves DOWN)
    {
      position: '25%',
      direction: 'down',
      duration: 35,
      cards: [
        { gradient: 'from-cyan-600/40 to-purple-600/40', delay: 0, opacity: 0.5 },
        { gradient: 'from-blue-600/40 to-cyan-600/40', delay: 6, opacity: 0.6 },
        { gradient: 'from-purple-600/40 to-blue-600/40', delay: 12, opacity: 0.4 },
        { gradient: 'from-pink-600/40 to-cyan-600/40', delay: 18, opacity: 0.5 },
        { gradient: 'from-cyan-600/40 to-pink-600/40', delay: 24, opacity: 0.4 },
      ],
    },
    // Column 3 - Center (Moves UP - Sparse/Fewer cards)
    {
      position: '50%',
      direction: 'up',
      duration: 45,
      cards: [
        { gradient: 'from-purple-500/30 to-cyan-500/30', delay: 0, opacity: 0.3 },
        { gradient: 'from-cyan-500/30 to-purple-500/30', delay: 15, opacity: 0.3 },
        { gradient: 'from-blue-500/30 to-pink-500/30', delay: 30, opacity: 0.3 },
      ],
    },
    // Column 4 - Right Center (Moves DOWN)
    {
      position: '75%',
      direction: 'down',
      duration: 38,
      cards: [
        { gradient: 'from-pink-600/40 to-purple-600/40', delay: 0, opacity: 0.5 },
        { gradient: 'from-cyan-600/40 to-pink-600/40', delay: 7, opacity: 0.4 },
        { gradient: 'from-purple-600/40 to-cyan-600/40', delay: 14, opacity: 0.6 },
        { gradient: 'from-blue-600/40 to-purple-600/40', delay: 21, opacity: 0.4 },
        { gradient: 'from-pink-600/40 to-blue-600/40', delay: 28, opacity: 0.5 },
      ],
    },
    // Column 5 - Far Right (Moves UP)
    {
      position: '95%',
      direction: 'up',
      duration: 42,
      cards: [
        { gradient: 'from-blue-600/40 to-cyan-600/40', delay: 0, opacity: 0.5 },
        { gradient: 'from-purple-600/40 to-blue-600/40', delay: 8, opacity: 0.4 },
        { gradient: 'from-cyan-600/40 to-purple-600/40', delay: 16, opacity: 0.5 },
        { gradient: 'from-pink-600/40 to-cyan-600/40', delay: 24, opacity: 0.4 },
        { gradient: 'from-purple-600/40 to-pink-600/40', delay: 32, opacity: 0.5 },
      ],
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.6)_100%)] z-10" />

      {/* Desktop & Tablet - All Columns */}
      <div className="hidden md:block absolute inset-0">
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className="absolute top-0 bottom-0"
            style={{
              left: column.position,
              transform: 'translateX(-50%)',
              width: '200px',
            }}
          >
            <motion.div
              animate={{
                y: column.direction === 'up' ? [0, -2000] : [0, 2000],
              }}
              transition={{
                duration: column.duration,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="flex flex-col gap-5"
            >
              {/* Duplicate cards for seamless loop */}
              {[...column.cards, ...column.cards, ...column.cards].map((card, cardIndex) => (
                <motion.div
                  key={cardIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: card.opacity, scale: 1 }}
                  transition={{ delay: card.delay * 0.1, duration: 0.8 }}
                  className={`w-[200px] h-[280px] rounded-2xl bg-gradient-to-br ${card.gradient} backdrop-blur-sm`}
                  style={{
                    backdropFilter: 'blur(4px)',
                    boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.2)',
                  }}
                />
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Mobile - Only 2 Columns */}
      <div className="md:hidden absolute inset-0">
        {[columns[1], columns[3]].map((column, columnIndex) => (
          <div
            key={columnIndex}
            className="absolute top-0 bottom-0"
            style={{
              left: columnIndex === 0 ? '25%' : '75%',
              transform: 'translateX(-50%)',
              width: '140px',
            }}
          >
            <motion.div
              animate={{
                y: column.direction === 'up' ? [0, -2000] : [0, 2000],
              }}
              transition={{
                duration: column.duration,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="flex flex-col gap-4"
            >
              {[...column.cards, ...column.cards, ...column.cards].map((card, cardIndex) => (
                <motion.div
                  key={cardIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: card.opacity * 0.7, scale: 1 }}
                  transition={{ delay: card.delay * 0.1, duration: 0.8 }}
                  className={`w-[140px] h-[200px] rounded-xl bg-gradient-to-br ${card.gradient} backdrop-blur-sm`}
                  style={{
                    backdropFilter: 'blur(3px)',
                    boxShadow: '0 4px 24px 0 rgba(139, 92, 246, 0.15)',
                  }}
                />
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
