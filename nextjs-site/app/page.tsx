'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedCardsBackground from '@/components/AnimatedCardsBackground';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Counter Component
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return (
    <span ref={ref} className="text-5xl font-bold gradient-text">
      {count}
      {suffix}
    </span>
  );
}

interface FeaturedProject {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  order: number;
  active: boolean;
}

interface ClientLogo {
  id: string;
  client_name: string;
  logo_url: string;
  order: number;
  active: boolean;
  website_url?: string;
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([]);
  const [clientLogos, setClientLogos] = useState<ClientLogo[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingLogos, setLoadingLogos] = useState(true);

  // Fetch featured projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/featured-projects');
        const data = await response.json();
        if (data.success && data.projects.length > 0) {
          // Filter only active projects and sort by order
          const activeProjects = data.projects
            .filter((p: FeaturedProject) => p.active)
            .sort((a: FeaturedProject, b: FeaturedProject) => a.order - b.order);
          setFeaturedProjects(activeProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  // Fetch client logos from API
  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch('/api/client-logos');
        const data = await response.json();
        if (data.success && data.logos.length > 0) {
          // Filter only active logos and sort by order
          const activeLogos = data.logos
            .filter((l: ClientLogo) => l.active)
            .sort((a: ClientLogo, b: ClientLogo) => a.order - b.order);
          setClientLogos(activeLogos);
        }
      } catch (error) {
        console.error('Error fetching logos:', error);
      } finally {
        setLoadingLogos(false);
      }
    };

    fetchLogos();
  }, []);

  const services = [
    {
      title: 'Artwork Designing',
      description: 'Digital products and custom illustrations crafted from scratch with meticulous attention to detail',
    },
    {
      title: 'Branding & Graphics',
      description: 'Complete brand identities, logos, banners, and visual systems that tell your story',
    },
    {
      title: 'Social Media Graphics',
      description: 'Engaging posts, advertisements, and marketing content that captures attention',
    },
    {
      title: 'Videography',
      description: 'Reels, animations, and product videos that bring your vision to life',
    },
  ];

  const stats = [
    { label: 'Projects Completed', value: 100, suffix: '+' },
    { label: 'Happy Clients', value: 50, suffix: '+' },
    { label: 'Years of Excellence', value: 5, suffix: '+' },
    { label: 'Creative Assets', value: 1000, suffix: '+' },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProjects.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length);
  };

  return (
    <div className="relative">
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Cards Background Layer */}
        <AnimatedCardsBackground />

        {/* Content Layer (Foreground) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-20 max-w-3xl mx-auto px-8 lg:px-12 text-center"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold text-white mb-6 font-[family-name:var(--font-space-grotesk)]"
            style={{
              textShadow: '0 4px 24px rgba(0, 0, 0, 0.8), 0 2px 8px rgba(0, 0, 0, 0.9)',
            }}
          >
            WE ARE <span className="gradient-text drop-shadow-2xl">CUBICO</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl sm:text-2xl lg:text-3xl text-white mb-8 font-medium"
            style={{
              textShadow: '0 2px 16px rgba(0, 0, 0, 0.8), 0 1px 4px rgba(0, 0, 0, 0.9)',
            }}
          >
            Creating exceptional visual experiences for global brands
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mb-10"
            style={{
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.8)',
            }}
          >
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 font-medium">
              Digital Artwork | Brand Identity | Social Media Content | Videography
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 mb-12 text-sm sm:text-base lg:text-lg"
            style={{
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.9)',
            }}
          >
            <div className="text-white font-semibold">
              <span className="font-bold text-2xl gradient-text drop-shadow-lg">100+</span> Projects
            </div>
            <div className="text-gray-300 text-2xl">•</div>
            <div className="text-white font-semibold">
              <span className="font-bold text-2xl gradient-text drop-shadow-lg">50+</span> Clients
            </div>
            <div className="text-gray-300 text-2xl">•</div>
            <div className="text-white font-semibold">
              <span className="font-bold text-2xl gradient-text drop-shadow-lg">5+</span> Years Excellence
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Link
              href="/portfolio"
              className="inline-block px-10 py-5 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70"
              style={{
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
              }}
            >
              View Our Work
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center backdrop-blur-sm bg-black/20">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full mt-2 shadow-lg"
            />
          </div>
        </motion.div>
      </section>

      {/* FEATURED WORK SECTION */}
      <section className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 font-[family-name:var(--font-space-grotesk)]">
              Featured Projects
            </h2>
            <p className="text-gray-400 text-lg">
              Showcasing our best creative work
            </p>
          </motion.div>

          {/* Carousel */}
          <div className="relative">
            {loadingProjects ? (
              <div className="aspect-video bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-gray-400">Loading projects...</p>
                </div>
              </div>
            ) : featuredProjects.length === 0 ? (
              <div className="aspect-video bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center">
                <p className="text-gray-400">No featured projects available yet</p>
              </div>
            ) : (
              <>
                <div className="overflow-hidden rounded-2xl">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="relative aspect-video bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group"
                  >
                    <div className="relative w-full h-full flex items-center justify-center p-8 sm:p-12">
                      <div className="relative w-full h-full max-w-4xl">
                        <Image
                          src={featuredProjects[currentSlide].image_url}
                          alt={featuredProjects[currentSlide].title}
                          fill
                          className="object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                      <span className="inline-block px-4 py-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm font-semibold rounded-full mb-3">
                        {featuredProjects[currentSlide].category}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        {featuredProjects[currentSlide].title}
                      </h3>
                      <p className="text-gray-300">
                        {featuredProjects[currentSlide].description}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300"
                  aria-label="Previous slide"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300"
                  aria-label="Next slide"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Slide Indicators */}
                <div className="flex justify-center gap-2 mt-8">
                  {featuredProjects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'w-8 bg-gradient-to-r from-purple-500 to-cyan-500'
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* SERVICES DIAGONAL SPLIT REVEAL SECTION */}
      <section className="relative bg-black">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-8 pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
              OUR SERVICES
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent font-[family-name:var(--font-space-grotesk)]">
              What We Create
            </h2>
            <p className="text-xl text-gray-400 mt-4">
              Comprehensive creative solutions for global brands
            </p>
          </motion.div>
        </div>

        {/* Service 1 - Image LEFT, Content RIGHT */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-screen lg:h-screen overflow-hidden flex flex-col lg:flex-row"
        >
          {/* Image Side */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full lg:w-1/2 h-64 lg:h-full overflow-hidden"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            }}
          >
            {/* Gradient Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500" />
            <div className="absolute inset-0 bg-black/30" />

            {/* Placeholder Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6">
                <p className="text-white/70 text-sm font-medium">Service Image Placeholder</p>
                <p className="text-white/50 text-xs mt-1">Replace with artwork image</p>
              </div>
            </div>

            {/* Number Badge */}
            <div className="absolute top-8 left-8 w-16 h-16 rounded-full backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-2xl">01</span>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="relative w-full lg:w-1/2 h-auto lg:h-full bg-zinc-950 flex items-center px-8 lg:px-20 py-20 lg:py-0"
          >
            <div className="max-w-lg">
              <h3 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-[family-name:var(--font-space-grotesk)]">
                Artwork Designing
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-10">
                Digital products and custom illustrations crafted from scratch with meticulous attention to detail
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-10">
                {['Custom digital illustrations', 'Print-ready artwork files', 'Unique visual concepts', 'Scalable vector graphics'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent group">
                <span>Explore Service</span>
                <svg className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Service 2 - Content LEFT, Image RIGHT */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-screen lg:h-screen overflow-hidden flex flex-col-reverse lg:flex-row"
        >
          {/* Content Side */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="relative w-full lg:w-1/2 h-auto lg:h-full bg-zinc-950 flex items-center px-8 lg:px-20 py-20 lg:py-0"
          >
            <div className="max-w-lg lg:ml-auto">
              <h3 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-[family-name:var(--font-space-grotesk)]">
                Branding & Graphics
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-10">
                Complete brand identities, logos, banners, and visual systems that tell your story
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-10">
                {['Logo design & brand identity', 'Marketing collateral', 'Brand guidelines', 'Print & digital assets'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group">
                <span>Explore Service</span>
                <svg className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full lg:w-1/2 h-64 lg:h-full overflow-hidden"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            }}
          >
            {/* Gradient Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500" />
            <div className="absolute inset-0 bg-black/30" />

            {/* Placeholder Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6">
                <p className="text-white/70 text-sm font-medium">Service Image Placeholder</p>
                <p className="text-white/50 text-xs mt-1">Replace with branding image</p>
              </div>
            </div>

            {/* Number Badge */}
            <div className="absolute top-8 left-8 w-16 h-16 rounded-full backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-2xl">02</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Service 3 - Image LEFT, Content RIGHT */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-screen lg:h-screen overflow-hidden flex flex-col lg:flex-row"
        >
          {/* Image Side */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full lg:w-1/2 h-64 lg:h-full overflow-hidden"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            }}
          >
            {/* Gradient Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500" />
            <div className="absolute inset-0 bg-black/30" />

            {/* Placeholder Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6">
                <p className="text-white/70 text-sm font-medium">Service Image Placeholder</p>
                <p className="text-white/50 text-xs mt-1">Replace with social media image</p>
              </div>
            </div>

            {/* Number Badge */}
            <div className="absolute top-8 left-8 w-16 h-16 rounded-full backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-2xl">03</span>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="relative w-full lg:w-1/2 h-auto lg:h-full bg-zinc-950 flex items-center px-8 lg:px-20 py-20 lg:py-0"
          >
            <div className="max-w-lg">
              <h3 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-[family-name:var(--font-space-grotesk)]">
                Social Media Graphics
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-10">
                Engaging posts, advertisements, and marketing content that captures attention
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-10">
                {['Instagram & Facebook posts', 'Story templates', 'Ad creatives', 'Content calendars'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent group">
                <span>Explore Service</span>
                <svg className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Service 4 - Content LEFT, Image RIGHT */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-screen lg:h-screen overflow-hidden flex flex-col-reverse lg:flex-row"
        >
          {/* Content Side */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="relative w-full lg:w-1/2 h-auto lg:h-full bg-zinc-950 flex items-center px-8 lg:px-20 py-20 lg:py-0"
          >
            <div className="max-w-lg lg:ml-auto">
              <h3 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-[family-name:var(--font-space-grotesk)]">
                Videography
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-10">
                Reels, animations, and product videos that bring your vision to life
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-10">
                {['Social media reels', 'Product videos', 'Motion graphics', 'Video editing'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent group">
                <span>Explore Service</span>
                <svg className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full lg:w-1/2 h-64 lg:h-full overflow-hidden"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            }}
          >
            {/* Gradient Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-pink-500 to-purple-500" />
            <div className="absolute inset-0 bg-black/30" />

            {/* Placeholder Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6">
                <p className="text-white/70 text-sm font-medium">Service Image Placeholder</p>
                <p className="text-white/50 text-xs mt-1">Replace with videography image</p>
              </div>
            </div>

            {/* Number Badge */}
            <div className="absolute top-8 left-8 w-16 h-16 rounded-full backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-2xl">04</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full py-32 bg-gradient-to-b from-black to-zinc-950"
        >
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-[family-name:var(--font-space-grotesk)]">
              Ready to Start Your Project?
            </h3>
            <p className="text-xl text-gray-400 mb-10">
              Let's create something exceptional together
            </p>
            <Link
              href="/contact"
              className="inline-block px-10 py-5 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      </section>

      {/* CLIENT LOGOS MARQUEE */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
            Trusted by Leading Brands
          </h2>
        </div>

        {loadingLogos ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-400">Loading client logos...</p>
            </div>
          </div>
        ) : clientLogos.length === 0 ? (
          <div className="flex justify-center py-12">
            <p className="text-gray-400">No client logos available yet</p>
          </div>
        ) : (
          <div className="relative">
            <div className="flex overflow-hidden">
              <div className="flex animate-marquee whitespace-nowrap">
                {[...clientLogos, ...clientLogos].map((logo, index) => (
                  <div
                    key={index}
                    className="mx-8 flex items-center justify-center w-40 h-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
                  >
                    <Image
                      src={logo.logo_url}
                      alt={logo.client_name}
                      width={160}
                      height={80}
                      className="object-contain max-w-full max-h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* STATS SECTION */}
      <section className="py-24 lg:py-32 relative bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
              >
                <Counter end={stat.value} suffix={stat.suffix} />
                <p className="text-gray-400 mt-2 text-sm sm:text-base">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-cyan-900/30 to-purple-900/30 animate-gradient" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-[family-name:var(--font-space-grotesk)]">
            Ready to Elevate Your Brand?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's create something extraordinary together
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/50"
          >
            Start Your Project
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
