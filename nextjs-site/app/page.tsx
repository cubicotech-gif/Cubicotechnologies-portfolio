'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState('');
  const fullText = 'Where Creativity Meets Digital Excellence';
  const [currentFeature, setCurrentFeature] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');

  // Typing animation effect
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  // Rotating features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Animated counter for statistics
    const animateCounter = (element: HTMLElement) => {
      const target = parseInt(element.getAttribute('data-target') || '0');
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          element.textContent = Math.floor(current).toString();
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target.toString();
        }
      };

      updateCounter();
    };

    // Intersection Observer for scroll-triggered animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');

            // Trigger counters
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach((counter) => {
              if (counter.textContent === '0') {
                animateCounter(counter as HTMLElement);
              }
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections for fade-in animations
    document.querySelectorAll('.fade-in-section').forEach((section) => {
      observer.observe(section);
    });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: '🎨', text: 'Stunning Visual Artwork', color: 'from-purple-500 to-pink-500' },
    { icon: '✨', text: 'Premium Logo Design', color: 'from-blue-500 to-cyan-500' },
    { icon: '🎬', text: 'Engaging Social Media Content', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <>
      {/* Hero Section - Immersive Experience */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Floating Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full glass border border-white/20 mb-8 animate-float backdrop-blur-xl">
              <span className="relative flex h-3 w-3 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-semibold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                Trusted by 500+ Brands Worldwide • Award-Winning Creative Studio
              </span>
            </div>

            {/* Typing Animation Heading */}
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-8xl mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                {typedText}
              </span>
              <span className="animate-pulse">|</span>
            </h1>

            {/* Rotating Feature Highlights */}
            <div className="h-16 mb-10">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className={`transition-all duration-500 ${
                    currentFeature === idx
                      ? 'opacity-100 transform translate-y-0'
                      : 'opacity-0 transform -translate-y-4 absolute'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-4">
                    <span className="text-5xl">{feature.icon}</span>
                    <span className={`text-2xl font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                      {feature.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-xl sm:text-2xl text-zinc-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              We craft <span className="font-semibold text-white">breathtaking visual experiences</span> that captivate, engage, and convert.
              From stunning artworks to viral social media content, we transform your brand vision into digital masterpieces.
            </p>

            {/* CTA Buttons with Hover Effects */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                href="/contact"
                className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-white to-zinc-300 text-black font-bold text-lg overflow-hidden hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Start Your Project</span>
                  <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/services"
                className="group px-10 py-5 rounded-2xl glass border-2 border-white/20 text-white font-bold text-lg hover:bg-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center space-x-2">
                  <span>View Our Work</span>
                  <svg className="w-6 h-6 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Floating 3D Cards Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              {[
                { title: 'Visual Artwork', desc: 'Illustrations, digital art & creative designs', image: '/images/categories/artwork.svg', gradient: 'from-purple-500/20 to-pink-500/20', delay: '0' },
                { title: 'Logo Design', desc: 'Memorable brand identities that stand out', image: '/images/categories/logos.svg', gradient: 'from-blue-500/20 to-cyan-500/20', delay: '200' },
                { title: 'Social Media', desc: 'Reels, videos & content for all platforms', image: '/images/categories/reels.svg', gradient: 'from-green-500/20 to-emerald-500/20', delay: '400' },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="glass rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:-translate-y-2 backdrop-blur-xl group"
                  style={{ animationDelay: `${card.delay}ms` }}
                >
                  <div className={`w-full h-32 rounded-xl mb-4 overflow-hidden relative bg-gradient-to-br ${card.gradient}`}>
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-white">{card.title}</h3>
                  <p className="text-sm text-zinc-400">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Logo Breakdown - Showcase Our Process */}
      <section className="relative py-32 overflow-hidden fade-in-section opacity-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Our Creative Process
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Every design tells a story. See how we blend strategy, creativity, and precision in every detail.
            </p>
          </div>

          {/* Interactive Logo Breakdown */}
          <div className="glass rounded-3xl p-12 lg:p-16 border border-white/10 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Logo Display with Annotations */}
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto relative group">
                  {/* Central Logo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-white/10 flex items-center justify-center backdrop-blur-xl group-hover:scale-105 transition-transform duration-500">
                      <Image
                        src="/images/logo-breakdown/main-logo.png"
                        alt="Logo Breakdown Example"
                        width={200}
                        height={200}
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Annotation 1 - Top Left */}
                  <div className="absolute -top-4 -left-4 animate-float">
                    <div className="glass rounded-2xl p-4 border border-purple-500/30 max-w-xs backdrop-blur-xl">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                          1
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">Color Psychology</h4>
                          <p className="text-xs text-zinc-400 mt-1">Strategic palette for brand emotion</p>
                        </div>
                      </div>
                      {/* Arrow */}
                      <svg className="absolute -bottom-8 left-20 text-purple-500" width="40" height="40" viewBox="0 0 40 40">
                        <path d="M20 0 L20 30 M20 30 L15 25 M20 30 L25 25" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    </div>
                  </div>

                  {/* Annotation 2 - Top Right */}
                  <div className="absolute -top-4 -right-4 animate-float animation-delay-2000">
                    <div className="glass rounded-2xl p-4 border border-blue-500/30 max-w-xs backdrop-blur-xl">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                          2
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">Typography</h4>
                          <p className="text-xs text-zinc-400 mt-1">Custom font for uniqueness</p>
                        </div>
                      </div>
                      <svg className="absolute -bottom-8 right-20 text-blue-500" width="40" height="40" viewBox="0 0 40 40">
                        <path d="M20 0 L20 30 M20 30 L15 25 M20 30 L25 25" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    </div>
                  </div>

                  {/* Annotation 3 - Bottom Left */}
                  <div className="absolute -bottom-4 -left-4 animate-float animation-delay-4000">
                    <div className="glass rounded-2xl p-4 border border-green-500/30 max-w-xs backdrop-blur-xl">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                          3
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">Symbolism</h4>
                          <p className="text-xs text-zinc-400 mt-1">Hidden meaning in shapes</p>
                        </div>
                      </div>
                      <svg className="absolute -top-8 left-20 text-green-500 rotate-180" width="40" height="40" viewBox="0 0 40 40">
                        <path d="M20 0 L20 30 M20 30 L15 25 M20 30 L25 25" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    </div>
                  </div>

                  {/* Annotation 4 - Bottom Right */}
                  <div className="absolute -bottom-4 -right-4 animate-float">
                    <div className="glass rounded-2xl p-4 border border-orange-500/30 max-w-xs backdrop-blur-xl">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                          4
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">Scalability</h4>
                          <p className="text-xs text-zinc-400 mt-1">Perfect at any size</p>
                        </div>
                      </div>
                      <svg className="absolute -top-8 right-20 text-orange-500 rotate-180" width="40" height="40" viewBox="0 0 40 40">
                        <path d="M20 0 L20 30 M20 30 L15 25 M20 30 L25 25" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Process Description */}
              <div className="space-y-8">
                <div>
                  <span className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-sm font-semibold">
                    Our Approach
                  </span>
                  <h3 className="font-bold text-3xl lg:text-4xl text-white mt-6 mb-4">
                    Thoughtful Design, Every Time
                  </h3>
                  <p className="text-zinc-400 text-lg leading-relaxed">
                    We don't just create pretty visuals. Every element is carefully crafted with strategic thinking,
                    brand psychology, and attention to detail that sets your brand apart.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { number: '50+', label: 'Design Revisions', icon: '🎨' },
                    { number: '100%', label: 'Client Satisfaction', icon: '⭐' },
                    { number: '24h', label: 'First Draft', icon: '⚡' },
                    { number: '∞', label: 'Creative Ideas', icon: '💡' },
                  ].map((stat, idx) => (
                    <div key={idx} className="glass rounded-xl p-4 border border-white/10 text-center group hover:border-purple-500/30 transition-all">
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <div className="font-bold text-2xl bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                        {stat.number}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Gallery with Categories */}
      <section className="relative py-32 overflow-hidden fade-in-section opacity-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-black text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Our Creative Portfolio
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-12">
              Explore our diverse range of work across artwork, branding, and social media content
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {[
                { id: 'all', label: 'All Work', icon: '✨' },
                { id: 'artwork', label: 'Artwork', icon: '🎨' },
                { id: 'logos', label: 'Logos', icon: '🏷️' },
                { id: 'reels', label: 'Reels & Videos', icon: '🎬' },
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl shadow-purple-500/50 scale-105'
                      : 'glass border border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 1, category: 'artwork', title: 'Digital Illustration', image: '/images/portfolio/artwork-1.svg', desc: 'Abstract modern art' },
              { id: 2, category: 'artwork', title: 'Character Design', image: '/images/portfolio/artwork-2.svg', desc: 'Fantasy character' },
              { id: 3, category: 'artwork', title: 'Concept Art', image: '/images/portfolio/artwork-3.svg', desc: 'Environment design' },
              { id: 4, category: 'logos', title: 'Tech Startup Logo', image: '/images/portfolio/logo-1.svg', desc: 'Modern minimal' },
              { id: 5, category: 'logos', title: 'Restaurant Branding', image: '/images/portfolio/logo-2.svg', desc: 'Elegant design' },
              { id: 6, category: 'logos', title: 'Fitness Brand', image: '/images/portfolio/logo-3.svg', desc: 'Bold & energetic' },
              { id: 7, category: 'reels', title: 'Instagram Reel', image: '/images/portfolio/reel-1.svg', desc: 'Product showcase' },
              { id: 8, category: 'reels', title: 'TikTok Video', image: '/images/portfolio/reel-2.svg', desc: 'Viral content' },
              { id: 9, category: 'reels', title: 'YouTube Short', image: '/images/portfolio/reel-3.svg', desc: 'Brand story' },
            ]
              .filter(item => activeCategory === 'all' || item.category === activeCategory)
              .map((item, idx) => (
                <div
                  key={item.id}
                  className="group glass rounded-3xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div>
                        <h4 className="font-bold text-xl text-white mb-2">{item.title}</h4>
                        <p className="text-zinc-300 text-sm">{item.desc}</p>
                        <button className="mt-4 px-6 py-2 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-12 py-5 rounded-2xl glass border-2 border-white/20 text-white font-bold text-lg hover:bg-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-105">
              Load More Work
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Updated for Creative Agency */}
      <section className="relative py-32 overflow-hidden fade-in-section opacity-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Why Choose Cubico?
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              We don't just create visuals. We craft brand experiences that captivate and convert.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🎨',
                title: 'Award-Winning Artistry',
                description: 'Creative team with international design awards and recognition',
                gradient: 'from-purple-500 to-pink-500',
                stats: ['20+ Awards', 'Featured Work', 'Top 1% Designers']
              },
              {
                icon: '⚡',
                title: 'Lightning-Fast Turnaround',
                description: 'First drafts in 24 hours, final delivery within a week',
                gradient: 'from-blue-500 to-cyan-500',
                stats: ['24h Draft', '7-Day Delivery', 'Rush Available']
              },
              {
                icon: '✨',
                title: 'Unlimited Revisions',
                description: 'We work until you love it. Your satisfaction is our priority',
                gradient: 'from-green-500 to-emerald-500',
                stats: ['∞ Revisions', '100% Satisfaction', 'Money Back']
              },
              {
                icon: '📱',
                title: 'Multi-Platform Mastery',
                description: 'Optimized content for Instagram, TikTok, YouTube, and all platforms',
                gradient: 'from-orange-500 to-red-500',
                stats: ['All Platforms', 'Any Format', 'Viral Ready']
              },
              {
                icon: '💎',
                title: 'Premium Quality',
                description: '4K resolution, vector formats, and print-ready files included',
                gradient: 'from-indigo-500 to-purple-500',
                stats: ['4K Quality', 'Source Files', 'Print Ready']
              },
              {
                icon: '🚀',
                title: 'Trend-Driven Design',
                description: 'Always ahead of trends with fresh, modern, and viral-worthy content',
                gradient: 'from-pink-500 to-rose-500',
                stats: ['Trend Alerts', 'Modern Style', 'Viral Potential']
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative glass rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden hover:scale-105"
              >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                <div className="relative z-10">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="font-bold text-2xl mb-4 text-white">{feature.title}</h3>
                  <p className="text-zinc-400 mb-6 leading-relaxed">{feature.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {feature.stats.map((stat, i) => (
                      <span key={i} className={`px-3 py-1 rounded-full bg-gradient-to-r ${feature.gradient} bg-opacity-20 text-xs font-semibold text-white`}>
                        {stat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Stats & Impact Metrics */}
      <section ref={statsRef} className="relative py-32 overflow-hidden fade-in-section opacity-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-12 lg:p-16 border border-white/10">
            <div className="text-center mb-16">
              <h2 className="font-display font-black text-5xl lg:text-6xl mb-6">Our Impact</h2>
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                Numbers that showcase our creative excellence and client success stories
              </p>
            </div>

            {/* Circular Progress Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
              {[
                { target: 500, label: 'Projects Completed', color: 'blue', suffix: '+' },
                { target: 200, label: 'Happy Brands', color: 'green', suffix: '+' },
                { target: 10, label: 'Million Social Reach', color: 'purple', suffix: 'M+' },
                { target: 99, label: 'Client Satisfaction', color: 'pink', suffix: '%' },
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                  {/* Circular Progress */}
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-white/10"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.75)}`}
                        className={`text-${stat.color}-500 transition-all duration-1000 group-hover:text-${stat.color}-400`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display font-bold text-3xl">
                        <span className="counter" data-target={stat.target}>0</span>{stat.suffix}
                      </span>
                    </div>
                  </div>
                  <p className="font-semibold text-white mb-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Performance Benchmarks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                { metric: 'Average Design Rating', value: '5.0/5.0', icon: '⭐', trend: 'Perfect score' },
                { metric: 'Client Retention Rate', value: '99%', icon: '🔄', trend: 'Industry leading' },
                { metric: 'First Draft Delivery', value: '24h', icon: '⚡', trend: 'Lightning fast' },
              ].map((benchmark, idx) => (
                <div key={idx} className="glass rounded-2xl p-6 border border-white/10 hover:bg-white/5 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{benchmark.icon}</span>
                    <span className="text-sm text-green-400 font-semibold">{benchmark.trend}</span>
                  </div>
                  <div className="text-4xl font-black mb-2 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    {benchmark.value}
                  </div>
                  <p className="text-zinc-400 text-sm">{benchmark.metric}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Authority Section */}
      <section className="relative py-32 overflow-hidden fade-in-section opacity-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Awards & Recognition
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Our work has been recognized by industry leaders and institutions worldwide
            </p>
          </div>

          {/* Awards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { icon: '🏆', title: 'Design Award', subtitle: 'Best Creative Studio 2024' },
              { icon: '⭐', title: 'Top Rated', subtitle: 'Behance Featured Artist' },
              { icon: '🎯', title: '5.0 Stars', subtitle: 'Dribbble Pro Top 1%' },
              { icon: '🌟', title: 'Excellence', subtitle: 'Awwwards Winner' },
              { icon: '💎', title: 'Premium Creator', subtitle: 'Adobe Creative Cloud' },
              { icon: '🚀', title: 'Trending', subtitle: 'TikTok Creator Fund' },
              { icon: '🎨', title: 'Art Direction', subtitle: 'Cannes Lions Finalist' },
              { icon: '✨', title: 'Verified', subtitle: 'Instagram Blue Checkmark' },
            ].map((award, idx) => (
              <div
                key={idx}
                className="glass rounded-2xl p-6 text-center group hover:bg-white/5 transition-all duration-300 hover:scale-105 border border-white/10"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{award.icon}</div>
                <h4 className="font-bold text-white mb-1">{award.title}</h4>
                <p className="text-xs text-zinc-500">{award.subtitle}</p>
              </div>
            ))}
          </div>

          {/* Client Logos */}
          <div className="glass rounded-3xl p-12 border border-white/10">
            <p className="text-center text-sm font-semibold text-zinc-500 mb-8 uppercase tracking-wider">
              Trusted by Leading Organizations
            </p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center opacity-60">
              {[
                { name: 'Tech Startups', icon: '🚀' },
                { name: 'Fashion Brands', icon: '👗' },
                { name: 'Food & Beverage', icon: '🍔' },
                { name: 'E-Commerce', icon: '🛒' },
                { name: 'Influencers', icon: '⭐' },
                { name: 'Agencies', icon: '💼' },
              ].map((client, idx) => (
                <div
                  key={idx}
                  className="text-center group hover:opacity-100 transition-opacity"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{client.icon}</div>
                  <p className="text-xs text-zinc-500">{client.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="relative py-32 overflow-hidden fade-in-section opacity-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-5xl lg:text-6xl mb-6">Client Success Stories</h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Don't just take our word for it—hear from education leaders who've transformed their institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Cubico's logo design transformed our brand identity completely. Sales increased 150% in the first quarter. The attention to detail is unmatched!",
                author: 'Sarah Chen',
                role: 'CEO, TechFlow Startup',
                rating: 5,
                impact: '+150% Sales'
              },
              {
                quote: "Their social media content went viral! We gained 50K followers in one week. The creativity and execution are absolutely phenomenal.",
                author: 'Marcus Johnson',
                role: 'Marketing Director, FreshBites',
                rating: 5,
                impact: '50K+ Followers'
              },
              {
                quote: "Best creative agency we've worked with. Fast turnaround, unlimited revisions, and the final artwork exceeded all expectations. 10/10!",
                author: 'Olivia Martinez',
                role: 'Brand Manager, LuxeFashion',
                rating: 5,
                impact: '10/10 Quality'
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="glass rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 group"
              >
                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 text-xl">
                    {'★'.repeat(testimonial.rating)}
                  </div>
                  <span className="ml-auto px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                    {testimonial.impact}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-zinc-300 leading-relaxed mb-6 text-lg">"{testimonial.quote}"</p>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white to-zinc-400 flex items-center justify-center text-black font-bold text-lg mr-4">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-white">{testimonial.author}</p>
                    <p className="text-sm text-zinc-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social Proof Banner */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-8 glass rounded-full px-12 py-6 border border-white/10">
              <div className="flex items-center space-x-3">
                <span className="text-yellow-400 text-3xl">★★★★★</span>
                <div className="text-left">
                  <span className="block font-bold text-white">4.9/5.0</span>
                  <span className="text-sm text-zinc-400">Average Rating</span>
                </div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="flex items-center space-x-3">
                <span className="text-green-400 text-3xl">✓</span>
                <div className="text-left">
                  <span className="block font-bold text-white">98%</span>
                  <span className="text-sm text-zinc-400">Client Retention</span>
                </div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="flex items-center space-x-3">
                <span className="text-blue-400 text-3xl">🚀</span>
                <div className="text-left">
                  <span className="block font-bold text-white">100+</span>
                  <span className="text-sm text-zinc-400">Success Stories</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 overflow-hidden fade-in-section opacity-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-3xl p-16 relative overflow-hidden border border-white/10">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10"></div>

            <div className="relative z-10">
              <h2 className="font-display font-black text-5xl lg:text-6xl mb-6">
                Ready to Elevate Your Brand?
              </h2>
              <p className="text-xl text-zinc-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                Join 500+ brands worldwide who trust Cubico to transform their vision into stunning visual masterpieces.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <Link
                  href="/contact"
                  className="group px-12 py-6 rounded-2xl bg-gradient-to-r from-white to-zinc-300 text-black font-bold text-xl hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:scale-105"
                >
                  <span className="flex items-center space-x-3">
                    <span>Get Your Free Quote</span>
                    <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/services"
                  className="px-12 py-6 rounded-2xl glass border-2 border-white/20 text-white font-bold text-xl hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  View Our Work
                </Link>
              </div>

              <p className="text-sm text-zinc-500">
                💬 Free consultation • ⚡ 24h first draft • ∞ Unlimited revisions • 💰 Money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .fade-in-section {
          transform: translateY(50px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .fade-in-section.animate-in {
          opacity: 1 !important;
          transform: translateY(0);
        }
      `}</style>
    </>
  );
}
