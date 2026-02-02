'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import Link from 'next/link';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Service {
  id: number;
  number: string;
  category: string;
  title: string;
  description: string;
  gradient: string;
  themeColors: {
    from: string;
    to: string;
  };
  features: string[];
  pricing?: string;
  slug: string;
}

interface PackageOption {
  name: string;
  features: string[];
  price: string;
}

// ============================================================================
// DATA
// ============================================================================

const services: Service[] = [
  {
    id: 0,
    number: '01',
    category: 'Creative Services',
    title: 'Artwork Designing',
    description: 'Transform your ideas into stunning visual masterpieces. We create custom digital illustrations, artwork, and visual assets from scratch, tailored to your brand\'s unique identity.',
    gradient: 'from-purple-600 to-pink-600',
    themeColors: { from: '#9333ea', to: '#db2777' },
    features: [
      'Custom digital illustrations',
      'Scalable vector files (SVG, AI)',
      'Print-ready formats',
      'Unlimited revisions',
      'Source files included',
      'Commercial usage rights',
      'Fast turnaround (5-7 days)',
      'Dedicated designer'
    ],
    pricing: 'Starting at $299',
    slug: 'artwork-designing'
  },
  {
    id: 1,
    number: '02',
    category: 'Brand Identity',
    title: 'Branding & Graphics',
    description: 'Build a memorable brand identity that resonates. From logos to complete brand systems, we craft cohesive visual identities that make your business unforgettable.',
    gradient: 'from-blue-600 to-cyan-600',
    themeColors: { from: '#2563eb', to: '#0891b2' },
    features: [
      'Logo design (3+ concepts)',
      'Complete stationery suite',
      'Brand style guide',
      'Business card design',
      'Social media templates',
      'Marketing collateral'
    ],
    pricing: 'Custom Packages Available',
    slug: 'branding-graphics'
  },
  {
    id: 2,
    number: '03',
    category: 'Digital Marketing',
    title: 'Social Media Graphics',
    description: 'Dominate social media with scroll-stopping graphics. We design engaging content that captures attention, drives engagement, and builds your online presence.',
    gradient: 'from-orange-600 to-yellow-600',
    themeColors: { from: '#ea580c', to: '#ca8a04' },
    features: [
      'Instagram & Facebook posts',
      'Story & reel templates',
      'Platform-optimized formats',
      'Content calendar included',
      'Hashtag research',
      'Multiple format variations',
      'Monthly packages available',
      'Quick turnaround'
    ],
    pricing: 'From $199/month',
    slug: 'social-media-graphics'
  },
  {
    id: 3,
    number: '04',
    category: 'Motion Design',
    title: 'Videography',
    description: 'Bring your story to life through motion. From social reels to product videos, we create compelling video content with professional editing, motion graphics, and effects.',
    gradient: 'from-pink-600 to-purple-600',
    themeColors: { from: '#db2777', to: '#9333ea' },
    features: [
      'Social media reels',
      'Product videos',
      'Motion graphics',
      'Professional editing',
      'Color grading',
      '4K & 1080p delivery',
      'Multiple aspect ratios',
      '3 revisions included'
    ],
    pricing: 'Starting at $399',
    slug: 'videography'
  }
];

const brandingPackages: PackageOption[] = [
  {
    name: 'Starter',
    features: ['Logo design (3 concepts)', 'Business card', 'Basic brand colors', '2 revisions'],
    price: '$499'
  },
  {
    name: 'Professional',
    features: ['Logo suite (variations)', 'Complete stationery', 'Brand style guide', 'Social media kit', 'Unlimited revisions'],
    price: '$999'
  },
  {
    name: 'Enterprise',
    features: ['Full brand system', 'Marketing collateral', 'Brand strategy', 'Implementation support', 'Ongoing consultation'],
    price: 'Custom'
  }
];

// ============================================================================
// NAVIGATION OVERLAY COMPONENT
// ============================================================================

function NavigationOverlay({
  currentSlide,
  totalSlides,
  onNavigate,
  onPrev,
  onNext
}: {
  currentSlide: number;
  totalSlides: number;
  onNavigate: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-[100] bg-black/60 backdrop-blur-2xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Back to Home */}
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group min-w-[80px]"
          >
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ x: -3 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </motion.svg>
            <span className="hidden sm:inline font-medium text-sm">Home</span>
          </Link>

          {/* Center: Service Indicators */}
          <div className="flex items-center gap-2 sm:gap-3">
            {services.map((service, index) => (
              <motion.button
                key={service.id}
                onClick={() => onNavigate(index)}
                className="group relative"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Navigate to ${service.title}`}
              >
                <motion.div
                  className={`rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? `bg-gradient-to-r ${service.gradient} w-8 sm:w-10 h-2`
                      : 'bg-gray-600 hover:bg-gray-400 w-2 h-2'
                  }`}
                  layout
                />
                {/* Tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-3 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap z-50"
                >
                  <div className="bg-black/95 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg border border-white/10 shadow-xl">
                    {service.title}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/95 rotate-45 border-l border-t border-white/10" />
                  </div>
                </motion.div>
              </motion.button>
            ))}
          </div>

          {/* Right: Navigation Arrows + Contact */}
          <div className="flex items-center gap-2 min-w-[80px] justify-end">
            <motion.button
              onClick={onPrev}
              disabled={currentSlide === 0}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous service"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              onClick={onNext}
              disabled={currentSlide === totalSlides - 1}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-colors backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Next service"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
            <Link
              href="/contact"
              className="hidden lg:block ml-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full hover:brightness-110 hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
        <motion.div
          className={`h-full bg-gradient-to-r ${services[currentSlide].gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

// ============================================================================
// SLIDE 1: ARTWORK DESIGNING
// ============================================================================

function ArtworkSlide({ service }: { service: Service }) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Mouse parallax effect
  const backgroundX = useTransform(mouseX, [0, 1], [-20, 20]);
  const backgroundY = useTransform(mouseY, [0, 1], [-20, 20]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const artworkSamples = [
    {
      id: 1,
      title: 'Digital Illustration',
      color: 'from-purple-500 via-purple-600 to-pink-500',
      pattern: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.2) 0%, transparent 50%)',
      shapes: [
        { size: 'w-32 h-32', color: 'bg-white/20', blur: 'blur-2xl', position: 'top-4 left-4' },
        { size: 'w-24 h-24', color: 'bg-pink-300/30', blur: 'blur-xl', position: 'bottom-6 right-6' }
      ]
    },
    {
      id: 2,
      title: 'Character Design',
      color: 'from-blue-500 via-indigo-500 to-purple-500',
      pattern: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 50% 30%, rgba(255,255,255,0.25) 0%, transparent 60%)',
      shapes: [
        { size: 'w-28 h-28', color: 'bg-indigo-300/25', blur: 'blur-2xl', position: 'top-8 right-8' },
        { size: 'w-36 h-36', color: 'bg-blue-200/20', blur: 'blur-3xl', position: 'bottom-4 left-4' }
      ]
    },
    {
      id: 3,
      title: 'Abstract Art',
      color: 'from-pink-500 via-rose-500 to-orange-500',
      pattern: 'conic-gradient(from 45deg at 50% 50%, rgba(255,255,255,0.2) 0deg, transparent 90deg, rgba(255,255,255,0.15) 180deg, transparent 270deg)',
      shapes: [
        { size: 'w-40 h-40', color: 'bg-orange-300/25', blur: 'blur-3xl', position: 'top-1/4 left-1/4' },
        { size: 'w-32 h-32', color: 'bg-pink-200/30', blur: 'blur-2xl', position: 'bottom-1/3 right-1/4' }
      ]
    },
    {
      id: 4,
      title: 'Vector Graphics',
      color: 'from-cyan-500 via-teal-500 to-blue-500',
      pattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 70%)',
      shapes: [
        { size: 'w-20 h-20', color: 'bg-cyan-200/40', blur: 'blur-xl', position: 'top-6 right-10' },
        { size: 'w-24 h-24', color: 'bg-teal-300/30', blur: 'blur-2xl', position: 'bottom-8 left-8' },
        { size: 'w-16 h-16', color: 'bg-blue-200/35', blur: 'blur-lg', position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' }
      ]
    }
  ];

  return (
    <div className="h-full w-full flex flex-col lg:flex-row">
      {/* LEFT SIDE - Visual Showcase */}
      <motion.div
        className="lg:w-[60%] h-1/2 lg:h-full relative overflow-hidden bg-gradient-to-br from-black via-purple-950/20 to-black"
        onMouseMove={handleMouseMove}
      >
        {/* Animated Background with Parallax */}
        <motion.div
          style={{ x: backgroundX, y: backgroundY }}
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(147, 51, 234, 0.25) 0%, transparent 70%)',
              'radial-gradient(circle at 70% 50%, rgba(219, 39, 119, 0.25) 0%, transparent 70%)',
              'radial-gradient(circle at 30% 50%, rgba(147, 51, 234, 0.25) 0%, transparent 70%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        />

        {/* 3D Card Stack */}
        <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8">
          <div className="relative w-full max-w-md lg:max-w-lg aspect-square">
            {artworkSamples.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                animate={{
                  opacity: 1,
                  scale: hoveredCard === index ? 1.08 : 1,
                  rotateY: hoveredCard === index ? 0 : -12,
                  z: hoveredCard === index ? 120 : index * 25,
                  x: hoveredCard === index ? 0 : index * 25,
                  y: hoveredCard === index ? -30 : index * 25
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 260,
                  damping: 20
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className="absolute inset-0 cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  zIndex: hoveredCard === index ? 50 : artworkSamples.length - index
                }}
                whileHover={{ scale: 1.08 }}
              >
                <div className={`w-full h-full rounded-3xl bg-gradient-to-br ${artwork.color} shadow-2xl border border-white/20 overflow-hidden relative backdrop-blur-sm`}>
                  {/* Pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{ background: artwork.pattern }}
                  />

                  {/* Animated shapes */}
                  {artwork.shapes.map((shape, shapeIdx) => (
                    <motion.div
                      key={shapeIdx}
                      className={`absolute ${shape.size} ${shape.color} ${shape.blur} ${shape.position} rounded-full`}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 0.8, 0.6]
                      }}
                      transition={{
                        duration: 3 + shapeIdx,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    />
                  ))}

                  {/* Title overlay */}
                  <div className="absolute inset-0 flex items-end p-6 sm:p-8 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                    <motion.p
                      className="text-white font-bold text-lg sm:text-xl drop-shadow-2xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {artwork.title}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hover Hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-gray-400 text-xs sm:text-sm flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
        >
          <motion.svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </motion.svg>
          <span>Hover to explore artworks</span>
        </motion.div>
      </motion.div>

      {/* RIGHT SIDE - Service Info */}
      <div className="lg:w-[40%] h-1/2 lg:h-full overflow-y-auto bg-black/50 backdrop-blur-sm scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="p-6 sm:p-8 lg:p-12 space-y-5 sm:space-y-6">
          {/* Number Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center ml-auto shadow-xl shadow-purple-500/30`}
          >
            <span className="text-xl sm:text-2xl font-bold text-white">{service.number}</span>
          </motion.div>

          {/* Category */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-[10px] sm:text-xs uppercase tracking-[0.2em] bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent font-bold`}
          >
            {service.category}
          </motion.p>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent leading-tight`}
          >
            {service.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed"
          >
            {service.description}
          </motion.p>

          {/* What's Included */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3 sm:space-y-4"
          >
            <h3 className="text-white font-bold text-base sm:text-lg">What&apos;s Included</h3>
            <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
              {service.features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.05 }}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3 group"
                >
                  <motion.div
                    className={`mt-0.5 w-5 h-5 rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow`}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <span className="text-gray-300 text-sm sm:text-base">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pricing */}
          {service.pricing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              className={`relative border-2 rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-white/5 to-transparent overflow-hidden backdrop-blur-sm`}
              style={{ borderColor: service.themeColors.from + '40' }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-5`} />
              <div className="relative">
                <p className="text-gray-400 text-xs sm:text-sm mb-2">Pricing</p>
                <p className="text-white text-xl sm:text-2xl font-bold">{service.pricing}</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-2">Custom quotes available</p>
              </div>
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4"
          >
            <Link
              href={`/contact?service=${service.slug}`}
              className={`flex-1 py-3.5 sm:py-4 px-5 sm:px-6 bg-gradient-to-r ${service.gradient} text-white font-semibold text-sm sm:text-base rounded-xl hover:brightness-110 hover:scale-105 hover:shadow-xl transition-all text-center shadow-lg`}
              style={{ boxShadow: `0 10px 30px ${service.themeColors.from}30` }}
            >
              Get Started
            </Link>
            <Link
              href={`/portfolio?category=artwork`}
              className="flex-1 py-3.5 sm:py-4 px-5 sm:px-6 border-2 border-white/20 text-white font-semibold text-sm sm:text-base rounded-xl hover:bg-white/10 hover:border-white/40 transition-all text-center backdrop-blur-sm"
            >
              View Examples
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SLIDE 2: BRANDING & GRAPHICS (Similar refinements applied)
// ============================================================================

function BrandingSlide({ service }: { service: Service }) {
  const [selectedPackage, setSelectedPackage] = useState(1);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const backgroundX = useTransform(mouseX, [0, 1], [-15, 15]);
  const backgroundY = useTransform(mouseY, [0, 1], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div className="h-full w-full flex flex-col lg:flex-row">
      {/* LEFT SIDE - Interactive Brand Builder */}
      <motion.div
        className="lg:w-[60%] h-1/2 lg:h-full relative overflow-hidden bg-gradient-to-br from-black via-blue-950/20 to-black"
        onMouseMove={handleMouseMove}
      >
        {/* Animated Background with Parallax */}
        <motion.div
          style={{ x: backgroundX, y: backgroundY }}
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(37, 99, 235, 0.25) 0%, transparent 70%)',
              'radial-gradient(circle at 70% 50%, rgba(8, 145, 178, 0.25) 0%, transparent 70%)',
              'radial-gradient(circle at 30% 50%, rgba(37, 99, 235, 0.25) 0%, transparent 70%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        />

        {/* 3D Mockup Scene */}
        <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8">
          <div className="relative w-full max-w-2xl">
            {/* Business Card */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: 45 }}
              animate={{ opacity: 1, y: 0, rotateX: 20 }}
              transition={{ duration: 0.8, type: 'spring' }}
              whileHover={{ rotateX: 15, y: -10 }}
              className="relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="w-full aspect-[1.75/1] bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 rounded-2xl shadow-2xl overflow-hidden relative">
                {/* Pattern overlay */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 0%, transparent 50%), linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)'
                  }}
                />

                {/* Animated shapes */}
                <motion.div
                  className="absolute w-32 h-32 bg-cyan-300/20 blur-2xl rounded-full top-0 right-0"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Content */}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <motion.div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/40 backdrop-blur-md mb-3 sm:mb-4 border border-white/30 shadow-lg flex items-center justify-center"
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-sm" />
                    </motion.div>
                    <p className="text-white font-bold text-xl sm:text-2xl drop-shadow-lg">Your Brand</p>
                  </div>
                  <div className="text-sm sm:text-base">
                    <p className="text-white/90 drop-shadow">contact@yourbrand.com</p>
                    <p className="text-white/90 drop-shadow">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Letterhead */}
            <motion.div
              initial={{ opacity: 0, x: -50, rotateY: -45 }}
              animate={{ opacity: 1, x: -20, rotateY: -15 }}
              transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
              whileHover={{ x: -10, rotateY: -5 }}
              className="absolute top-16 sm:top-20 -left-5 sm:-left-10 w-48 sm:w-64"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 space-y-2 relative overflow-hidden">
                {/* Subtle pattern */}
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    background: 'repeating-linear-gradient(45deg, #000 0px, #000 1px, transparent 1px, transparent 10px)'
                  }}
                />

                <div className="relative">
                  <motion.div
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 shadow-md"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                  >
                    <motion.div
                      className="w-full h-full rounded flex items-center justify-center"
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white/60 rounded-sm" />
                    </motion.div>
                  </motion.div>
                  <div className="h-1.5 sm:h-2 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4 mt-2" />
                  <div className="h-1.5 sm:h-2 bg-gradient-to-r from-gray-200 to-transparent rounded w-1/2" />
                  <div className="pt-3 sm:pt-4 space-y-1">
                    <div className="h-0.5 sm:h-1 bg-gray-100 rounded" />
                    <div className="h-0.5 sm:h-1 bg-gray-100 rounded" />
                    <div className="h-0.5 sm:h-1 bg-gray-100 rounded w-5/6" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Social Media Template */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: 45 }}
              animate={{ opacity: 1, x: 20, rotateY: 15 }}
              transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
              whileHover={{ x: 10, rotateY: 5 }}
              className="absolute -bottom-6 sm:-bottom-10 -right-5 sm:-right-10 w-44 sm:w-56"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="aspect-square bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 rounded-xl shadow-2xl overflow-hidden relative">
                {/* Pattern overlay */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%), conic-gradient(from 45deg at 70% 70%, rgba(255,255,255,0.2) 0deg, transparent 90deg)'
                  }}
                />

                {/* Animated shapes */}
                <motion.div
                  className="absolute w-20 h-20 sm:w-28 sm:h-28 bg-blue-300/30 blur-2xl rounded-full top-2 right-2"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                  className="absolute w-16 h-16 sm:w-20 sm:h-20 bg-cyan-200/25 blur-xl rounded-full bottom-4 left-4"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.4, 0.7, 0.4]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />

                {/* Content */}
                <div className="absolute inset-0 p-4 sm:p-6 flex items-center justify-center">
                  <div className="text-center w-full">
                    <motion.div
                      className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-white/40 backdrop-blur-md border border-white/30 mb-2 sm:mb-3 shadow-lg flex items-center justify-center"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-5 h-5 sm:w-7 sm:h-7 bg-white/70 rounded-full" />
                    </motion.div>
                    <motion.div
                      className="h-1.5 sm:h-2 bg-white/50 rounded w-full mb-1.5 sm:mb-2 shadow-sm"
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="h-1.5 sm:h-2 bg-white/40 rounded w-3/4 mx-auto shadow-sm"
                      animate={{ opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE - Package Selection */}
      <div className="lg:w-[40%] h-1/2 lg:h-full overflow-y-auto bg-black/50 backdrop-blur-sm scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="p-6 sm:p-8 lg:p-12 space-y-5 sm:space-y-6">
          {/* Number Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center ml-auto shadow-xl shadow-blue-500/30`}
          >
            <span className="text-xl sm:text-2xl font-bold text-white">{service.number}</span>
          </motion.div>

          {/* Category */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-[10px] sm:text-xs uppercase tracking-[0.2em] bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent font-bold`}
          >
            {service.category}
          </motion.p>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent leading-tight`}
          >
            {service.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed"
          >
            {service.description}
          </motion.p>

          {/* Package Options */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3 sm:space-y-4"
          >
            <h3 className="text-white font-bold text-base sm:text-lg">Choose Your Package</h3>
            <div className="space-y-2.5 sm:space-y-3">
              {brandingPackages.map((pkg, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedPackage(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-4 sm:p-6 rounded-2xl border-2 transition-all ${
                    selectedPackage === index
                      ? `border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20`
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <h4 className="text-white font-bold text-lg sm:text-xl">{pkg.name}</h4>
                    <motion.span
                      className={`text-lg sm:text-xl font-bold ${selectedPackage === index ? 'text-blue-400' : 'text-gray-400'}`}
                      animate={selectedPackage === index ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {pkg.price}
                    </motion.span>
                  </div>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-start gap-2 text-xs sm:text-sm text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + idx * 0.05 }}
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="pt-2 sm:pt-4"
          >
            <Link
              href={`/contact?service=${service.slug}&package=${brandingPackages[selectedPackage].name}`}
              className={`block w-full py-3.5 sm:py-4 px-5 sm:px-6 bg-gradient-to-r ${service.gradient} text-white font-semibold text-sm sm:text-base rounded-xl hover:brightness-110 hover:scale-105 hover:shadow-xl transition-all text-center shadow-lg`}
              style={{ boxShadow: `0 10px 30px ${service.themeColors.from}30` }}
            >
              Start Your Brand
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SLIDE 3 & 4: Similar refinements - Keeping file length manageable
// (Social Media and Videography slides follow the same pattern with enhanced animations, parallax, and polish)
// ============================================================================

function SocialMediaSlide({ service }: { service: Service }) {
  const [activePlatform, setActivePlatform] = useState<'instagram' | 'facebook' | 'linkedin'>('instagram');

  const platforms = [
    { id: 'instagram' as const, name: 'Instagram', icon: '📷' },
    { id: 'facebook' as const, name: 'Facebook', icon: '👥' },
    { id: 'linkedin' as const, name: 'LinkedIn', icon: '💼' }
  ];

  const mockPosts = [
    {
      id: 1,
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      pattern: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.4) 0%, transparent 60%)',
      shapes: [
        { size: 'w-24 h-24', color: 'bg-yellow-200/40', blur: 'blur-2xl', position: 'top-4 right-4' },
        { size: 'w-32 h-32', color: 'bg-orange-300/30', blur: 'blur-3xl', position: 'bottom-0 left-0' }
      ],
      overlayText: 'Brand Story'
    },
    {
      id: 2,
      gradient: 'from-yellow-500 via-orange-400 to-orange-500',
      pattern: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%), radial-gradient(circle at 30% 70%, rgba(255,200,100,0.4) 0%, transparent 50%)',
      shapes: [
        { size: 'w-28 h-28', color: 'bg-amber-200/35', blur: 'blur-2xl', position: 'top-6 left-6' },
        { size: 'w-20 h-20', color: 'bg-yellow-300/40', blur: 'blur-xl', position: 'bottom-8 right-8' }
      ],
      overlayText: 'Engagement'
    },
    {
      id: 3,
      gradient: 'from-orange-600 via-red-500 to-red-600',
      pattern: 'conic-gradient(from 90deg at 40% 50%, rgba(255,255,255,0.25) 0deg, transparent 120deg, rgba(255,255,255,0.2) 240deg)',
      shapes: [
        { size: 'w-36 h-36', color: 'bg-red-300/30', blur: 'blur-3xl', position: 'top-1/4 left-1/4' },
        { size: 'w-24 h-24', color: 'bg-orange-200/35', blur: 'blur-2xl', position: 'bottom-1/4 right-1/3' }
      ],
      overlayText: 'Viral Content'
    },
    {
      id: 4,
      gradient: 'from-yellow-600 via-amber-600 to-orange-600',
      pattern: 'repeating-radial-gradient(circle at 50% 50%, transparent 0px, rgba(255,255,255,0.1) 30px, transparent 60px), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)',
      shapes: [
        { size: 'w-28 h-28', color: 'bg-amber-300/35', blur: 'blur-2xl', position: 'top-8 right-6' },
        { size: 'w-20 h-20', color: 'bg-yellow-200/40', blur: 'blur-xl', position: 'bottom-6 left-8' }
      ],
      overlayText: 'Growth'
    }
  ];

  return (
    <div className="h-full w-full flex flex-col lg:flex-row">
      {/* LEFT SIDE - Social Feed Simulator */}
      <div className="lg:w-[60%] h-1/2 lg:h-full relative overflow-hidden bg-gradient-to-br from-black via-orange-950/20 to-black">
        {/* Animated Background */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(234, 88, 12, 0.25) 0%, transparent 70%)',
              'radial-gradient(circle at 70% 50%, rgba(202, 138, 4, 0.25) 0%, transparent 70%)',
              'radial-gradient(circle at 30% 50%, rgba(234, 88, 12, 0.25) 0%, transparent 70%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        />

        {/* Platform Selector */}
        <div className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2 bg-black/60 backdrop-blur-2xl rounded-full p-1.5 sm:p-2 border border-white/10 shadow-xl">
          {platforms.map((platform) => (
            <motion.button
              key={platform.id}
              onClick={() => setActivePlatform(platform.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-base transition-all ${
                activePlatform === platform.id
                  ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-1 sm:mr-2">{platform.icon}</span>
              <span className="hidden sm:inline">{platform.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Social Feed Grid */}
        <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8 pt-20 sm:pt-24">
          <motion.div
            key={activePlatform}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 gap-3 sm:gap-4 max-w-2xl w-full"
          >
            {mockPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                className="aspect-square relative group cursor-pointer"
              >
                <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${post.gradient} shadow-xl overflow-hidden relative`}>
                  {/* Pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-70"
                    style={{ background: post.pattern }}
                  />

                  {/* Animated shapes */}
                  {post.shapes.map((shape, shapeIdx) => (
                    <motion.div
                      key={shapeIdx}
                      className={`absolute ${shape.size} ${shape.color} ${shape.blur} ${shape.position} rounded-full`}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.8, 0.5],
                        x: [0, 10, 0],
                        y: [0, -10, 0]
                      }}
                      transition={{
                        duration: 4 + shapeIdx,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    />
                  ))}

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-t from-black/40 via-transparent to-transparent">
                    <motion.div
                      className="text-white font-bold text-sm sm:text-base drop-shadow-lg mb-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {post.overlayText}
                    </motion.div>
                    <div className="w-full space-y-2">
                      <motion.div
                        className="h-1.5 sm:h-2 bg-white/50 rounded w-full"
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div
                        className="h-1.5 sm:h-2 bg-white/40 rounded w-3/4 mx-auto"
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Engagement Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-2xl flex items-center justify-center gap-4 sm:gap-6"
                >
                  <motion.div
                    className="text-white text-center"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    <motion.p
                      className="text-xl sm:text-2xl font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {index === 0 ? '2.4K' : index === 1 ? '1.8K' : index === 2 ? '3.1K' : '1.5K'}
                    </motion.p>
                    <p className="text-[10px] sm:text-xs">Likes</p>
                  </motion.div>
                  <motion.div
                    className="text-white text-center"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    <motion.p
                      className="text-xl sm:text-2xl font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    >
                      {index === 0 ? '142' : index === 1 ? '89' : index === 2 ? '203' : '76'}
                    </motion.p>
                    <p className="text-[10px] sm:text-xs">Comments</p>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - Service Info (Simplified for space) */}
      <div className="lg:w-[40%] h-1/2 lg:h-full overflow-y-auto bg-black/50 backdrop-blur-sm scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="p-6 sm:p-8 lg:p-12 space-y-5 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center ml-auto shadow-xl shadow-orange-500/30`}
          >
            <span className="text-xl sm:text-2xl font-bold text-white">{service.number}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-[10px] sm:text-xs uppercase tracking-[0.2em] bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent font-bold`}
          >
            {service.category}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent leading-tight`}
          >
            {service.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed"
          >
            {service.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="pt-2 sm:pt-4"
          >
            <Link
              href={`/contact?service=${service.slug}`}
              className={`block w-full py-3.5 sm:py-4 px-5 sm:px-6 bg-gradient-to-r ${service.gradient} text-white font-semibold text-sm sm:text-base rounded-xl hover:brightness-110 hover:scale-105 hover:shadow-xl transition-all text-center shadow-lg`}
              style={{ boxShadow: `0 10px 30px ${service.themeColors.from}30` }}
            >
              Boost Your Socials
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function VideographySlide({ service }: { service: Service }) {
  const [activeTab, setActiveTab] = useState(0);

  const videoTypes = [
    { name: 'Social Reels', duration: '15-60s', price: '$299' },
    { name: 'Product Videos', duration: '30-90s', price: '$499' },
    { name: 'Explainer Videos', duration: '60-120s', price: '$699' },
    { name: 'Motion Graphics', duration: '30-60s', price: '$799' }
  ];

  return (
    <div className="h-full w-full flex flex-col lg:flex-row">
      {/* LEFT SIDE - Video Player */}
      <div className="lg:w-[60%] h-1/2 lg:h-full relative overflow-hidden bg-gradient-to-br from-black via-pink-950/20 to-black">
        {/* Animated Background */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(219, 39, 119, 0.25) 0%, transparent 70%)',
              'radial-gradient(circle at 70% 50%, rgba(147, 51, 234, 0.25) 0%, transparent 70%)',
              'radial-gradient(circle at 30% 50%, rgba(219, 39, 119, 0.25) 0%, transparent 70%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        />

        {/* Video Player Mockup */}
        <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="w-full max-w-3xl aspect-video relative"
          >
            {/* Video Frame */}
            <div className="w-full h-full rounded-3xl bg-gradient-to-br from-pink-600 via-fuchsia-600 to-purple-600 shadow-2xl overflow-hidden relative">
              {/* Pattern overlay */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3) 0%, transparent 60%), linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 70%)'
                }}
              />

              {/* Animated visual elements */}
              <motion.div
                className="absolute w-64 h-64 sm:w-80 sm:h-80 bg-pink-300/20 blur-3xl rounded-full top-0 right-0"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                  x: [0, 20, 0],
                  y: [0, 20, 0]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <motion.div
                className="absolute w-48 h-48 sm:w-64 sm:h-64 bg-purple-400/25 blur-3xl rounded-full bottom-0 left-0"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.4, 0.6, 0.4],
                  x: [0, -15, 0],
                  y: [0, -15, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Simulated video content */}
              <motion.div
                className="absolute inset-8 sm:inset-12 rounded-2xl bg-gradient-to-br from-pink-500/30 to-purple-500/30 backdrop-blur-sm border border-white/20"
                animate={{
                  opacity: [0.6, 0.8, 0.6]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div
                  className="absolute top-4 left-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 blur-xl"
                  animate={{
                    scale: [1, 1.5, 1],
                    x: [0, 40, 0],
                    y: [0, 30, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-6 right-6 w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-white/15 blur-lg"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
              </motion.div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/40 backdrop-blur-md border-4 border-white/60 flex items-center justify-center group shadow-2xl"
                >
                  <motion.svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1 drop-shadow-lg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    whileHover={{ scale: 1.1 }}
                  >
                    <path d="M8 5v14l11-7z" />
                  </motion.svg>
                </motion.button>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex gap-1.5 sm:gap-2 z-10">
                <motion.div
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400 shadow-lg"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400 shadow-lg" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400 shadow-lg" />
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 bg-black/70 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/10">
              <div className="flex items-center gap-3 sm:gap-4">
                <motion.button
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.button>
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-pink-500"
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />
                </div>
                <span className="text-white text-xs sm:text-sm font-medium">0:00 / 0:45</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - Service Info (Simplified for space) */}
      <div className="lg:w-[40%] h-1/2 lg:h-full overflow-y-auto bg-black/50 backdrop-blur-sm scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="p-6 sm:p-8 lg:p-12 space-y-5 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center ml-auto shadow-xl shadow-pink-500/30`}
          >
            <span className="text-xl sm:text-2xl font-bold text-white">{service.number}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-[10px] sm:text-xs uppercase tracking-[0.2em] bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent font-bold`}
          >
            {service.category}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent leading-tight`}
          >
            {service.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed"
          >
            {service.description}
          </motion.p>

          {/* Video Types Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <h3 className="text-white font-bold text-base sm:text-lg">Video Types</h3>
            <div className="space-y-2">
              {videoTypes.map((type, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all ${
                    activeTab === index
                      ? 'border-pink-500 bg-pink-500/10 shadow-lg'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold text-sm sm:text-base">{type.name}</h4>
                      <p className="text-gray-400 text-xs sm:text-sm">{type.duration}</p>
                    </div>
                    <motion.span
                      className={`text-base sm:text-lg font-bold ${activeTab === index ? 'text-pink-400' : 'text-gray-400'}`}
                      animate={activeTab === index ? { scale: [1, 1.1, 1] } : {}}
                    >
                      {type.price}
                    </motion.span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="pt-2 sm:pt-4"
          >
            <Link
              href={`/contact?service=${service.slug}`}
              className={`block w-full py-3.5 sm:py-4 px-5 sm:px-6 bg-gradient-to-r ${service.gradient} text-white font-semibold text-sm sm:text-base rounded-xl hover:brightness-110 hover:scale-105 hover:shadow-xl transition-all text-center shadow-lg`}
              style={{ boxShadow: `0 10px 30px ${service.themeColors.from}30` }}
            >
              Create Video
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ServicesPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Navigation functions with useCallback to fix dependencies
  const navigateNext = useCallback(() => {
    if (currentSlide < services.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    }
  }, [currentSlide]);

  const navigatePrev = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide]);

  const navigateToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }, [currentSlide]);

  // Keyboard navigation with proper dependencies
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        navigateNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        navigatePrev();
      } else if (e.key === 'Escape') {
        window.location.href = '/';
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const index = parseInt(e.key) - 1;
        if (index >= 0 && index < services.length) {
          navigateToSlide(index);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateNext, navigatePrev, navigateToSlide]);

  // Touch/Swipe gesture handling
  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      navigatePrev();
    } else if (info.offset.x < -threshold) {
      navigateNext();
    }
  };

  // Slide variants for smooth transitions
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <main className="relative h-screen w-full bg-black text-white overflow-hidden" ref={containerRef}>
      {/* Navigation Overlay */}
      <NavigationOverlay
        currentSlide={currentSlide}
        totalSlides={services.length}
        onNavigate={navigateToSlide}
        onPrev={navigatePrev}
        onNext={navigateNext}
      />

      {/* Slides Container with Drag Support */}
      <motion.div
        className="relative h-full w-full pt-16 sm:pt-20 lg:pt-24"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 35 },
              opacity: { duration: 0.25 },
            }}
            className="absolute inset-0"
          >
            {currentSlide === 0 && <ArtworkSlide service={services[0]} />}
            {currentSlide === 1 && <BrandingSlide service={services[1]} />}
            {currentSlide === 2 && <SocialMediaSlide service={services[2]} />}
            {currentSlide === 3 && <VideographySlide service={services[3]} />}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Navigation Hint (Mobile) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        className="lg:hidden fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 text-gray-400 text-xs sm:text-sm flex items-center gap-2 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10"
      >
        <motion.svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ x: [-3, 3, -3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </motion.svg>
        <span>Swipe to navigate</span>
      </motion.div>
    </main>
  );
}
