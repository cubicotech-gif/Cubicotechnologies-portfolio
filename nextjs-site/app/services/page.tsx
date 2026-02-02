'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
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
  const progress = (currentSlide / (totalSlides - 1)) * 100;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-[100] bg-black/40 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 lg:py-6">
        <div className="flex items-center justify-between">
          {/* Left: Back to Home */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline font-medium">Home</span>
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">Services</span>
          </div>

          {/* Center: Service Indicators */}
          <div className="flex items-center gap-3">
            {services.map((service, index) => (
              <button
                key={service.id}
                onClick={() => onNavigate(index)}
                className="group relative"
                aria-label={`Navigate to ${service.title}`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? `bg-gradient-to-r ${service.gradient} w-8`
                      : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                />
                {/* Tooltip */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  <div className="bg-black/90 text-white text-xs px-3 py-1 rounded-lg">
                    {service.title}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Navigation Arrows + Contact */}
          <div className="flex items-center gap-2 lg:gap-4">
            <button
              onClick={onPrev}
              disabled={currentSlide === 0}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              aria-label="Previous service"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={onNext}
              disabled={currentSlide === totalSlides - 1}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              aria-label="Next service"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <Link
              href="/contact"
              className="hidden lg:block ml-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:brightness-110 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
        <motion.div
          className={`h-full bg-gradient-to-r ${services[currentSlide].gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
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

  // Sample artwork images (placeholder)
  const artworkSamples = [
    { id: 1, title: 'Digital Illustration', color: 'from-purple-500 to-pink-500' },
    { id: 2, title: 'Character Design', color: 'from-blue-500 to-purple-500' },
    { id: 3, title: 'Abstract Art', color: 'from-pink-500 to-orange-500' },
    { id: 4, title: 'Vector Graphics', color: 'from-cyan-500 to-blue-500' }
  ];

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row">
      {/* LEFT SIDE - Visual Showcase */}
      <div className="lg:w-[60%] h-1/2 lg:h-full relative overflow-hidden bg-gradient-to-br from-black via-purple-950/20 to-black">
        {/* Animated Background */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(147, 51, 234, 0.2) 0%, transparent 70%)',
              'radial-gradient(circle at 70% 50%, rgba(219, 39, 119, 0.2) 0%, transparent 70%)',
              'radial-gradient(circle at 30% 50%, rgba(147, 51, 234, 0.2) 0%, transparent 70%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        />

        {/* 3D Card Stack */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full max-w-lg aspect-square">
            {artworkSamples.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                animate={{
                  opacity: 1,
                  scale: hoveredCard === index ? 1.05 : 1,
                  rotateY: hoveredCard === index ? 0 : -10,
                  z: hoveredCard === index ? 100 : index * 20,
                  x: hoveredCard === index ? 0 : index * 30,
                  y: hoveredCard === index ? -20 : index * 20
                }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className="absolute inset-0 cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  zIndex: hoveredCard === index ? 50 : artworkSamples.length - index
                }}
              >
                <div className={`w-full h-full rounded-3xl bg-gradient-to-br ${artwork.color} shadow-2xl border border-white/10 p-8 flex items-center justify-center`}>
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold text-lg">{artwork.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Drag Hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 text-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
          <span>Hover to explore artworks</span>
        </motion.div>
      </div>

      {/* RIGHT SIDE - Service Info */}
      <div className="lg:w-[40%] h-1/2 lg:h-full overflow-y-auto bg-black/50 backdrop-blur-sm">
        <div className="p-8 lg:p-12 space-y-6">
          {/* Number Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center ml-auto`}
          >
            <span className="text-2xl font-bold text-white">{service.number}</span>
          </motion.div>

          {/* Category */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-xs uppercase tracking-widest bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent font-semibold`}
          >
            {service.category}
          </motion.p>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}
          >
            {service.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 text-lg leading-relaxed"
          >
            {service.description}
          </motion.p>

          {/* What's Included */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-white font-semibold text-lg">What&apos;s Included</h3>
            <div className="grid grid-cols-1 gap-3">
              {service.features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className={`mt-1 w-5 h-5 rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center flex-shrink-0`}>
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300">{feature}</span>
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
              className={`border-2 border-gradient rounded-2xl p-6 bg-gradient-to-br ${service.gradient} bg-opacity-5`}
            >
              <p className="text-gray-400 text-sm mb-2">Pricing</p>
              <p className="text-white text-2xl font-bold">{service.pricing}</p>
              <p className="text-gray-400 text-sm mt-2">Custom quotes available</p>
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link
              href={`/contact?service=${service.slug}`}
              className={`flex-1 py-4 px-6 bg-gradient-to-r ${service.gradient} text-white font-semibold rounded-xl hover:brightness-110 hover:scale-105 transition-all text-center`}
            >
              Get Started
            </Link>
            <Link
              href={`/portfolio?category=artwork`}
              className="flex-1 py-4 px-6 border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-all text-center"
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
// SLIDE 2: BRANDING & GRAPHICS
// ============================================================================

function BrandingSlide({ service }: { service: Service }) {
  const [selectedPackage, setSelectedPackage] = useState(1);

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row">
      {/* LEFT SIDE - Interactive Brand Builder */}
      <div className="lg:w-[60%] h-1/2 lg:h-full relative overflow-hidden bg-gradient-to-br from-black via-blue-950/20 to-black">
        {/* Animated Background */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(37, 99, 235, 0.2) 0%, transparent 70%)',
              'radial-gradient(circle at 70% 50%, rgba(8, 145, 178, 0.2) 0%, transparent 70%)',
              'radial-gradient(circle at 30% 50%, rgba(37, 99, 235, 0.2) 0%, transparent 70%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        />

        {/* 3D Mockup Scene */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full max-w-2xl">
            {/* Business Card */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: 45 }}
              animate={{ opacity: 1, y: 0, rotateX: 20 }}
              transition={{ duration: 0.8 }}
              className="relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="w-full aspect-[1.75/1] bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-2xl p-8 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm mb-4" />
                  <p className="text-white font-bold text-2xl">Your Brand</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">contact@yourbrand.com</p>
                  <p className="text-white/80 text-sm">+1 (555) 123-4567</p>
                </div>
              </div>
            </motion.div>

            {/* Letterhead */}
            <motion.div
              initial={{ opacity: 0, x: -50, rotateY: -45 }}
              animate={{ opacity: 1, x: -30, rotateY: -20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute top-20 -left-10 w-64"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="bg-white rounded-lg shadow-xl p-6 space-y-2">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-cyan-600" />
                <div className="h-2 bg-gray-200 rounded w-3/4" />
                <div className="h-2 bg-gray-200 rounded w-1/2" />
                <div className="pt-4 space-y-1">
                  <div className="h-1 bg-gray-100 rounded" />
                  <div className="h-1 bg-gray-100 rounded" />
                  <div className="h-1 bg-gray-100 rounded w-5/6" />
                </div>
              </div>
            </motion.div>

            {/* Social Media Template */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: 45 }}
              animate={{ opacity: 1, x: 30, rotateY: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -bottom-10 -right-10 w-56"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="aspect-square bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-xl p-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/20 backdrop-blur-sm mb-3" />
                  <div className="h-2 bg-white/40 rounded w-full mb-2" />
                  <div className="h-2 bg-white/40 rounded w-3/4 mx-auto" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Package Selection */}
      <div className="lg:w-[40%] h-1/2 lg:h-full overflow-y-auto bg-black/50 backdrop-blur-sm">
        <div className="p-8 lg:p-12 space-y-6">
          {/* Number Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center ml-auto`}
          >
            <span className="text-2xl font-bold text-white">{service.number}</span>
          </motion.div>

          {/* Category */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-xs uppercase tracking-widest bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent font-semibold`}
          >
            {service.category}
          </motion.p>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}
          >
            {service.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 text-lg leading-relaxed"
          >
            {service.description}
          </motion.p>

          {/* Package Options */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-white font-semibold text-lg">Choose Your Package</h3>
            <div className="space-y-3">
              {brandingPackages.map((pkg, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedPackage(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                    selectedPackage === index
                      ? `border-blue-500 bg-blue-500/10`
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-white font-bold text-xl">{pkg.name}</h4>
                    <span className={`text-xl font-bold ${selectedPackage === index ? 'text-blue-400' : 'text-gray-400'}`}>
                      {pkg.price}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
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
            className="pt-4"
          >
            <Link
              href={`/contact?service=${service.slug}&package=${brandingPackages[selectedPackage].name}`}
              className={`block w-full py-4 px-6 bg-gradient-to-r ${service.gradient} text-white font-semibold rounded-xl hover:brightness-110 hover:scale-105 transition-all text-center`}
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
// SLIDE 3: SOCIAL MEDIA GRAPHICS
// ============================================================================

function SocialMediaSlide({ service }: { service: Service }) {
  const [activePlatform, setActivePlatform] = useState<'instagram' | 'facebook' | 'linkedin'>('instagram');

  const platforms = [
    { id: 'instagram' as const, name: 'Instagram', icon: '📷' },
    { id: 'facebook' as const, name: 'Facebook', icon: '👥' },
    { id: 'linkedin' as const, name: 'LinkedIn', icon: '💼' }
  ];

  const mockPosts = [
    { id: 1, gradient: 'from-orange-500 to-yellow-500' },
    { id: 2, gradient: 'from-yellow-500 to-orange-500' },
    { id: 3, gradient: 'from-orange-600 to-red-500' },
    { id: 4, gradient: 'from-yellow-600 to-orange-600' }
  ];

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row">
      {/* LEFT SIDE - Social Feed Simulator */}
      <div className="lg:w-[60%] h-1/2 lg:h-full relative overflow-hidden bg-gradient-to-br from-black via-orange-950/20 to-black">
        {/* Animated Background */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(234, 88, 12, 0.2) 0%, transparent 70%)',
              'radial-gradient(circle at 70% 50%, rgba(202, 138, 4, 0.2) 0%, transparent 70%)',
              'radial-gradient(circle at 30% 50%, rgba(234, 88, 12, 0.2) 0%, transparent 70%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        />

        {/* Platform Selector */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-black/40 backdrop-blur-xl rounded-full p-2 border border-white/10">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => setActivePlatform(platform.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activePlatform === platform.id
                  ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-2">{platform.icon}</span>
              {platform.name}
            </button>
          ))}
        </div>

        {/* Social Feed Grid */}
        <div className="absolute inset-0 flex items-center justify-center p-8 pt-24">
          <motion.div
            key={activePlatform}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-4 max-w-2xl w-full"
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
                <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${post.gradient} shadow-xl p-6 flex items-center justify-center`}>
                  <div className="text-center">
                    <div className="text-5xl mb-3">✨</div>
                    <div className="h-2 bg-white/40 rounded w-full mb-2" />
                    <div className="h-2 bg-white/40 rounded w-3/4 mx-auto" />
                  </div>
                </div>
                {/* Engagement Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center gap-6"
                >
                  <div className="text-white text-center">
                    <p className="text-2xl font-bold">1.2K</p>
                    <p className="text-xs">Likes</p>
                  </div>
                  <div className="text-white text-center">
                    <p className="text-2xl font-bold">89</p>
                    <p className="text-xs">Comments</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - Service Info */}
      <div className="lg:w-[40%] h-1/2 lg:h-full overflow-y-auto bg-black/50 backdrop-blur-sm">
        <div className="p-8 lg:p-12 space-y-6">
          {/* Number Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center ml-auto`}
          >
            <span className="text-2xl font-bold text-white">{service.number}</span>
          </motion.div>

          {/* Category */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-xs uppercase tracking-widest bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent font-semibold`}
          >
            {service.category}
          </motion.p>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}
          >
            {service.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 text-lg leading-relaxed"
          >
            {service.description}
          </motion.p>

          {/* Platform Coverage */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-white font-semibold text-lg">Platform Coverage</h3>
            <div className="flex flex-wrap gap-3">
              {['Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'TikTok', 'Pinterest'].map((platform) => (
                <div key={platform} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm">
                  {platform}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Monthly Packages */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            <h3 className="text-white font-semibold text-lg">Monthly Packages</h3>
            <div className="space-y-2">
              {[
                { posts: 8, price: '$199' },
                { posts: 16, price: '$349' },
                { posts: 'Unlimited', price: '$599' }
              ].map((pkg, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/50 transition-colors cursor-pointer">
                  <span className="text-gray-300">{pkg.posts} Posts/Month</span>
                  <span className="text-white font-bold">{pkg.price}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* What's Included */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <h3 className="text-white font-semibold text-lg">What&apos;s Included</h3>
            <div className="space-y-2">
              {service.features.slice(0, 5).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                  <svg className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="pt-4"
          >
            <Link
              href={`/contact?service=${service.slug}`}
              className={`block w-full py-4 px-6 bg-gradient-to-r ${service.gradient} text-white font-semibold rounded-xl hover:brightness-110 hover:scale-105 transition-all text-center`}
            >
              Boost Your Socials
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SLIDE 4: VIDEOGRAPHY
// ============================================================================

function VideographySlide({ service }: { service: Service }) {
  const [activeTab, setActiveTab] = useState(0);

  const videoTypes = [
    { name: 'Social Reels', duration: '15-60s', price: '$299' },
    { name: 'Product Videos', duration: '30-90s', price: '$499' },
    { name: 'Explainer Videos', duration: '60-120s', price: '$699' },
    { name: 'Motion Graphics', duration: '30-60s', price: '$799' }
  ];

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row">
      {/* LEFT SIDE - Video Player */}
      <div className="lg:w-[60%] h-1/2 lg:h-full relative overflow-hidden bg-gradient-to-br from-black via-pink-950/20 to-black">
        {/* Animated Background */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(219, 39, 119, 0.2) 0%, transparent 70%)',
              'radial-gradient(circle at 70% 50%, rgba(147, 51, 234, 0.2) 0%, transparent 70%)',
              'radial-gradient(circle at 30% 50%, rgba(219, 39, 119, 0.2) 0%, transparent 70%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        />

        {/* Video Player Mockup */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl aspect-video relative"
          >
            {/* Video Frame */}
            <div className="w-full h-full rounded-3xl bg-gradient-to-br from-pink-600 to-purple-600 shadow-2xl overflow-hidden relative">
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/40 flex items-center justify-center group"
                >
                  <svg className="w-10 h-10 text-white ml-1 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.button>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-6 left-6 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>

              {/* Motion Graphics Animation */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-64 h-64 rounded-full bg-white/10 blur-3xl" />
              </motion.div>
            </div>

            {/* Video Controls Bar */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-pink-500"
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />
                </div>
                <span className="text-white text-sm">0:00 / 0:45</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - Service Info */}
      <div className="lg:w-[40%] h-1/2 lg:h-full overflow-y-auto bg-black/50 backdrop-blur-sm">
        <div className="p-8 lg:p-12 space-y-6">
          {/* Number Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center ml-auto`}
          >
            <span className="text-2xl font-bold text-white">{service.number}</span>
          </motion.div>

          {/* Category */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-xs uppercase tracking-widest bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent font-semibold`}
          >
            {service.category}
          </motion.p>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}
          >
            {service.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 text-lg leading-relaxed"
          >
            {service.description}
          </motion.p>

          {/* Video Types Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-white font-semibold text-lg">Video Types</h3>
            <div className="space-y-2">
              {videoTypes.map((type, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    activeTab === index
                      ? 'border-pink-500 bg-pink-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold">{type.name}</h4>
                      <p className="text-gray-400 text-sm">{type.duration}</p>
                    </div>
                    <span className={`text-lg font-bold ${activeTab === index ? 'text-pink-400' : 'text-gray-400'}`}>
                      {type.price}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Video Specifications */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            <h3 className="text-white font-semibold text-lg">Specifications</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Resolution', value: '4K, 1080p' },
                { label: 'Formats', value: 'MP4, MOV' },
                { label: 'Ratios', value: '1:1, 9:16, 16:9' },
                { label: 'Revisions', value: '3 included' }
              ].map((spec, index) => (
                <div key={index} className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-gray-400 text-xs mb-1">{spec.label}</p>
                  <p className="text-white text-sm font-semibold">{spec.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Add-ons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <h3 className="text-white font-semibold text-lg">Add-Ons</h3>
            <div className="space-y-2">
              {['Background music', 'Voiceover', 'Subtitles/captions', 'Stock footage'].map((addon) => (
                <label key={addon} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/30 cursor-pointer transition-colors">
                  <input type="checkbox" className="w-4 h-4 rounded accent-pink-500" />
                  <span className="text-gray-300 text-sm">{addon}</span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="pt-4"
          >
            <Link
              href={`/contact?service=${service.slug}`}
              className={`block w-full py-4 px-6 bg-gradient-to-r ${service.gradient} text-white font-semibold rounded-xl hover:brightness-110 hover:scale-105 transition-all text-center`}
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

  // Keyboard navigation
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
  }, [currentSlide]);

  const navigateNext = () => {
    if (currentSlide < services.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    }
  };

  const navigatePrev = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  const navigateToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
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
    <main className="relative h-screen w-full bg-black text-white overflow-hidden">
      {/* Navigation Overlay */}
      <NavigationOverlay
        currentSlide={currentSlide}
        totalSlides={services.length}
        onNavigate={navigateToSlide}
        onPrev={navigatePrev}
        onNext={navigateNext}
      />

      {/* Slides Container */}
      <div className="relative h-full w-full pt-20 lg:pt-24">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
            }}
            className="absolute inset-0"
          >
            {currentSlide === 0 && <ArtworkSlide service={services[0]} />}
            {currentSlide === 1 && <BrandingSlide service={services[1]} />}
            {currentSlide === 2 && <SocialMediaSlide service={services[2]} />}
            {currentSlide === 3 && <VideographySlide service={services[3]} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Hint (Mobile) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 text-gray-400 text-sm flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
        <span>Swipe to navigate</span>
      </motion.div>
    </main>
  );
}
