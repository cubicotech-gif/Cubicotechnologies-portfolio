'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroImage {
  id: string;
  filename: string;
  url?: string; // URL for cloud-hosted images
  category: string;
  order: number;
  active: boolean;
}

interface Card {
  type: 'image' | 'gradient';
  imageUrl?: string;
  gradient?: string;
  delay: number;
  opacity: number;
}

interface CardColumn {
  position: string;
  direction: 'up' | 'down';
  duration: number;
  cards: Card[];
}

export default function AnimatedCardsBackground() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [columns, setColumns] = useState<CardColumn[]>([]);

  // Fallback gradient cards
  const fallbackGradients = [
    'from-purple-600/40 to-pink-600/40',
    'from-blue-600/40 to-purple-600/40',
    'from-cyan-600/40 to-blue-600/40',
    'from-pink-600/40 to-cyan-600/40',
    'from-purple-500/30 to-cyan-500/30',
  ];

  // Fetch hero images
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await fetch('/api/hero-images');
        const data = await response.json();
        if (data.success && data.images) {
          const activeImages = data.images
            .filter((img: HeroImage) => img.active)
            .sort((a: HeroImage, b: HeroImage) => a.order - b.order);
          setHeroImages(activeImages);
        }
      } catch (error) {
        console.error('Error fetching hero images:', error);
      }
    };

    fetchHeroImages();
  }, []);

  // Generate columns based on available images
  useEffect(() => {
    const generateColumns = () => {
      const hasImages = heroImages.length > 0;

      // Shuffle array helper
      const shuffleArray = (array: any[], seed: number) => {
        const shuffled = [...array];
        let currentIndex = shuffled.length;
        let randomIndex;

        // Use seed for deterministic but varied shuffling per column
        const random = (max: number) => {
          seed = (seed * 9301 + 49297) % 233280;
          return (seed / 233280) * max;
        };

        while (currentIndex !== 0) {
          randomIndex = Math.floor(random(currentIndex));
          currentIndex--;
          [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
        }

        return shuffled;
      };

      // Distribute images across columns with better variety
      const getCardsForColumn = (columnIndex: number, count: number): Card[] => {
        const cards: Card[] = [];

        if (hasImages) {
          // Create a shuffled array of images for this column
          // Each column gets a different shuffle using columnIndex as seed
          const shuffledImages = shuffleArray(heroImages, columnIndex * 1000);

          // Create enough cards by repeating the shuffled array
          const repeatsNeeded = Math.ceil(count / shuffledImages.length);
          const extendedImages = [];
          for (let r = 0; r < repeatsNeeded; r++) {
            // Re-shuffle for each repeat with different seed
            const reshuffled = shuffleArray(shuffledImages, (columnIndex + r) * 1000);
            extendedImages.push(...reshuffled);
          }

          for (let i = 0; i < count; i++) {
            const image = extendedImages[i];
            const imageUrl = image.url || `/images/hero/${image.filename}`;
            cards.push({
              type: 'image',
              imageUrl,
              delay: i * 5,
              opacity: columnIndex === 2 ? 0.4 : 0.5, // Center column more transparent
            });
          }
        } else {
          // Use gradient fallbacks
          for (let i = 0; i < count; i++) {
            const gradientIndex = (columnIndex * count + i) % fallbackGradients.length;
            cards.push({
              type: 'gradient',
              gradient: fallbackGradients[gradientIndex],
              delay: i * 5,
              opacity: columnIndex === 2 ? 0.3 : 0.5,
            });
          }
        }

        return cards;
      };

      const newColumns: CardColumn[] = [
        // Column 1 - Far Left (Moves UP) - More cards
        {
          position: '5%',
          direction: 'up',
          duration: 50,
          cards: getCardsForColumn(0, 8),
        },
        // Column 2 - Left Center (Moves DOWN) - More cards
        {
          position: '25%',
          direction: 'down',
          duration: 45,
          cards: getCardsForColumn(1, 8),
        },
        // Column 3 - Center (Moves UP - Still sparse)
        {
          position: '50%',
          direction: 'up',
          duration: 55,
          cards: getCardsForColumn(2, 5),
        },
        // Column 4 - Right Center (Moves DOWN) - More cards
        {
          position: '75%',
          direction: 'down',
          duration: 48,
          cards: getCardsForColumn(3, 8),
        },
        // Column 5 - Far Right (Moves UP) - More cards
        {
          position: '95%',
          direction: 'up',
          duration: 52,
          cards: getCardsForColumn(4, 8),
        },
      ];

      setColumns(newColumns);
    };

    generateColumns();
  }, [heroImages]);

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
                y: column.direction === 'up' ? ['0%', '-50%'] : ['0%', '50%'],
              }}
              transition={{
                duration: column.duration,
                repeat: Infinity,
                ease: 'linear',
                repeatType: 'loop',
              }}
              className="flex flex-col gap-5"
            >
              {/* Duplicate cards 4 times for seamless infinite scroll */}
              {[...column.cards, ...column.cards, ...column.cards, ...column.cards].map((card, cardIndex) => (
                <motion.div
                  key={cardIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: card.opacity, scale: 1 }}
                  transition={{ delay: card.delay * 0.1, duration: 0.8 }}
                  className="w-[200px] h-[280px] rounded-2xl backdrop-blur-sm overflow-hidden relative flex-shrink-0"
                  style={{
                    backdropFilter: 'blur(4px)',
                    boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.2)',
                  }}
                >
                  {card.type === 'image' && card.imageUrl ? (
                    <Image
                      src={card.imageUrl}
                      alt="Portfolio work"
                      fill
                      className="object-cover"
                      sizes="200px"
                      quality={100}
                      priority={cardIndex < column.cards.length}
                      onError={(e) => {
                        // Hide broken images
                        const target = e.target as HTMLElement;
                        if (target.parentElement) {
                          target.parentElement.style.display = 'none';
                        }
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${card.gradient}`} />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Mobile - Only 2 Columns */}
      <div className="md:hidden absolute inset-0">
        {columns.length > 0 &&
          [columns[1], columns[3]].map((column, columnIndex) => (
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
                  y: column.direction === 'up' ? ['0%', '-50%'] : ['0%', '50%'],
                }}
                transition={{
                  duration: column.duration,
                  repeat: Infinity,
                  ease: 'linear',
                  repeatType: 'loop',
                }}
                className="flex flex-col gap-4"
              >
                {/* Duplicate cards 4 times for seamless infinite scroll */}
                {[...column.cards, ...column.cards, ...column.cards, ...column.cards].map((card, cardIndex) => (
                  <motion.div
                    key={cardIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: card.opacity * 0.7, scale: 1 }}
                    transition={{ delay: card.delay * 0.1, duration: 0.8 }}
                    className="w-[140px] h-[200px] rounded-xl backdrop-blur-sm overflow-hidden relative flex-shrink-0"
                    style={{
                      backdropFilter: 'blur(3px)',
                      boxShadow: '0 4px 24px 0 rgba(139, 92, 246, 0.15)',
                    }}
                  >
                    {card.type === 'image' && card.imageUrl ? (
                      <Image
                        src={card.imageUrl}
                        alt="Portfolio work"
                        fill
                        className="object-cover"
                        sizes="140px"
                        quality={100}
                        onError={(e) => {
                          // Hide broken images
                          const target = e.target as HTMLElement;
                          if (target.parentElement) {
                            target.parentElement.style.display = 'none';
                          }
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${card.gradient}`} />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
      </div>
    </div>
  );
}
