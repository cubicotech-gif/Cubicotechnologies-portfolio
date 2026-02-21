'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

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

function ArtworkSlide({ service, images }: { service: Service; images: string[] }) {
  return (
    <div className="h-[calc(100vh-4rem)] w-full flex flex-col lg:flex-row">
      {/* LEFT SIDE - Image Gallery */}
      <div className="lg:w-[60%] h-1/2 lg:h-full relative overflow-hidden bg-gradient-to-br from-black via-purple-950/20 to-black">
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

        <div className="absolute inset-0 p-6 lg:p-10 grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer"
            >
              {images[i] ? (
                <Image
                  src={images[i]}
                  alt={`Artwork example ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 30vw"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${service.gradient} opacity-40 flex items-center justify-center`}>
                  <svg className="w-12 h-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
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

function BrandingSlide({ service, images }: { service: Service; images: string[] }) {
  const [selectedPackage, setSelectedPackage] = useState(1);

  return (
    <div className="h-[calc(100vh-4rem)] w-full flex flex-col lg:flex-row">
      {/* LEFT SIDE - Image Gallery */}
      <div className="lg:w-[60%] h-1/2 lg:h-full relative overflow-hidden bg-gradient-to-br from-black via-blue-950/20 to-black">
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

        <div className="absolute inset-0 p-6 lg:p-10 grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer"
            >
              {images[i] ? (
                <Image
                  src={images[i]}
                  alt={`Branding example ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 30vw"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${service.gradient} opacity-40 flex items-center justify-center`}>
                  <svg className="w-12 h-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
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

function SocialMediaSlide({ service, images }: { service: Service; images: string[] }) {
  return (
    <div className="h-[calc(100vh-4rem)] w-full flex flex-col lg:flex-row">
      {/* LEFT SIDE - Image Gallery */}
      <div className="lg:w-[60%] h-1/2 lg:h-full relative overflow-hidden bg-gradient-to-br from-black via-orange-950/20 to-black">
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

        <div className="absolute inset-0 p-6 lg:p-10 grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer"
            >
              {images[i] ? (
                <Image
                  src={images[i]}
                  alt={`Social media example ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 30vw"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${service.gradient} opacity-40 flex items-center justify-center`}>
                  <svg className="w-12 h-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
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

function VideographySlide({ service, images }: { service: Service; images: string[] }) {
  const [activeTab, setActiveTab] = useState(0);

  const videoTypes = [
    { name: 'Social Reels', duration: '15-60s', price: '$299' },
    { name: 'Product Videos', duration: '30-90s', price: '$499' },
    { name: 'Explainer Videos', duration: '60-120s', price: '$699' },
    { name: 'Motion Graphics', duration: '30-60s', price: '$799' }
  ];

  return (
    <div className="h-[calc(100vh-4rem)] w-full flex flex-col lg:flex-row">
      {/* LEFT SIDE - Image Gallery */}
      <div className="lg:w-[60%] h-1/2 lg:h-full relative overflow-hidden bg-gradient-to-br from-black via-pink-950/20 to-black">
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

        <div className="absolute inset-0 p-6 lg:p-10 grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer"
            >
              {images[i] ? (
                <Image
                  src={images[i]}
                  alt={`Videography example ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 30vw"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${service.gradient} opacity-40 flex items-center justify-center`}>
                  <svg className="w-12 h-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
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
  const [serviceImages, setServiceImages] = useState<Record<string, string[]>>({});

  // Fetch service images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/service-images?active=true');
        const data = await response.json();
        if (data.success && data.images.length > 0) {
          const imagesByService: Record<string, string[]> = {};
          data.images.forEach((img: { service_type: string; image_slot: number; image_url: string }) => {
            if (!imagesByService[img.service_type]) {
              imagesByService[img.service_type] = [];
            }
            imagesByService[img.service_type][img.image_slot - 1] = img.image_url;
          });
          setServiceImages(imagesByService);
        }
      } catch (error) {
        console.error('Error fetching service images:', error);
      }
    };
    fetchImages();
  }, []);

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
            {currentSlide === 0 && <ArtworkSlide service={services[0]} images={serviceImages[services[0].title] || []} />}
            {currentSlide === 1 && <BrandingSlide service={services[1]} images={serviceImages[services[1].title] || []} />}
            {currentSlide === 2 && <SocialMediaSlide service={services[2]} images={serviceImages[services[2].title] || []} />}
            {currentSlide === 3 && <VideographySlide service={services[3]} images={serviceImages[services[3].title] || []} />}
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
