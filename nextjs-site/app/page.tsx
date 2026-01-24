'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState('');
  const fullText = 'Transform Education with Award-Winning Digital Solutions';
  const [currentFeature, setCurrentFeature] = useState(0);

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
    { icon: '🎬', text: 'Emmy-Quality Animations', color: 'from-purple-500 to-pink-500' },
    { icon: '🚀', text: 'Enterprise LMS Platforms', color: 'from-blue-500 to-cyan-500' },
    { icon: '📱', text: 'Mobile Learning Apps', color: 'from-green-500 to-emerald-500' },
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
                Trusted by 100+ Educational Institutions Worldwide
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
              We craft <span className="font-semibold text-white">immersive learning experiences</span> that engage, educate, and inspire.
              From interactive animations to scalable platforms, we're your partner in educational transformation.
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
                { title: 'LMS Dashboard', desc: 'Track student progress in real-time', image: '/images/hero/dashboard-preview.svg', delay: '0' },
                { title: 'Interactive Lessons', desc: 'Engaging content that captivates', image: '/images/hero/interactive-lessons.svg', delay: '200' },
                { title: 'Analytics & Insights', desc: 'Data-driven decision making', image: '/images/hero/analytics-preview.svg', delay: '400' },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="glass rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:-translate-y-2 backdrop-blur-xl group"
                  style={{ animationDelay: `${card.delay}ms` }}
                >
                  <div className="w-full h-32 rounded-xl mb-4 overflow-hidden relative bg-gradient-to-br from-zinc-800 to-zinc-900">
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

      {/* Portfolio / Case Studies - Bento Grid */}
      <section className="relative py-32 overflow-hidden fade-in-section opacity-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Discover how we've helped leading institutions transform their educational offerings
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Large Featured Project */}
            <div className="md:col-span-2 md:row-span-2 glass rounded-3xl p-8 group hover:bg-white/5 transition-all duration-300 relative overflow-hidden border border-white/10">
              <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-xl z-10">
                <span className="text-green-400 font-semibold text-sm">Featured</span>
              </div>
              <div className="h-64 lg:h-96 rounded-2xl mb-6 overflow-hidden relative bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <Image
                  src="/images/projects/islamic-history-series.svg"
                  alt="Islamic History Animated Series"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">Animation</span>
                  <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold">Emmy Winner</span>
                </div>
                <h3 className="font-bold text-2xl text-white">Islamic History Animated Series</h3>
                <p className="text-zinc-400">A 24-episode animated series covering 1,400 years of Islamic civilization. Emmy-nominated for Outstanding Achievement in Animation.</p>
                <div className="flex items-center space-x-4 text-sm text-zinc-500">
                  <span>🎬 24 Episodes</span>
                  <span>👥 50M+ Views</span>
                  <span>⭐ 4.9/5.0</span>
                </div>
              </div>
            </div>

            {/* Smaller Projects */}
            <div className="glass rounded-3xl p-6 group hover:bg-white/5 transition-all duration-300 border border-white/10">
              <div className="h-40 rounded-xl mb-4 overflow-hidden relative bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                <Image
                  src="/images/projects/quranpath-lms.svg"
                  alt="QuranPath Academy LMS"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">LMS Platform</span>
              <h3 className="font-bold text-lg mt-3 text-white">QuranPath Academy LMS</h3>
              <p className="text-sm text-zinc-400 mt-2">Enterprise learning platform serving 10,000+ students</p>
            </div>

            <div className="glass rounded-3xl p-6 group hover:bg-white/5 transition-all duration-300 border border-white/10">
              <div className="h-40 rounded-xl mb-4 overflow-hidden relative bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                <Image
                  src="/images/projects/adhkar-app.svg"
                  alt="Daily Adhkar App"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold">Mobile App</span>
              <h3 className="font-bold text-lg mt-3 text-white">Daily Adhkar App</h3>
              <p className="text-sm text-zinc-400 mt-2">500K+ downloads, 4.8★ rating on app stores</p>
            </div>

            <div className="glass rounded-3xl p-6 group hover:bg-white/5 transition-all duration-300 border border-white/10">
              <div className="h-40 rounded-xl mb-4 overflow-hidden relative bg-gradient-to-br from-orange-500/20 to-red-500/20">
                <Image
                  src="/images/projects/hadith-search.svg"
                  alt="Hadith Search Engine"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold">Web Platform</span>
              <h3 className="font-bold text-lg mt-3 text-white">Hadith Search Engine</h3>
              <p className="text-sm text-zinc-400 mt-2">AI-powered search across 300K+ authentic hadith</p>
            </div>

            <div className="glass rounded-3xl p-6 group hover:bg-white/5 transition-all duration-300 border border-white/10">
              <div className="h-40 rounded-xl mb-4 overflow-hidden relative bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                <Image
                  src="/images/projects/virtual-hajj.svg"
                  alt="Virtual Hajj Experience"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-semibold">3D Animation</span>
              <h3 className="font-bold text-lg mt-3 text-white">Virtual Hajj Experience</h3>
              <p className="text-sm text-zinc-400 mt-2">Immersive 3D tour of Makkah and Madinah</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Showcase */}
      <section className="relative py-32 overflow-hidden fade-in-section opacity-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Why Choose Cubico?
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              We don't just build products. We craft experiences that transform education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🎨',
                title: 'World-Class Design',
                description: 'Emmy-winning creative team delivering broadcast-quality content',
                gradient: 'from-purple-500 to-pink-500',
                stats: ['15+ Awards', '50M+ Views', 'Netflix Quality']
              },
              {
                icon: '⚡',
                title: 'Enterprise-Grade Tech',
                description: 'Scalable platforms handling 10,000+ concurrent users',
                gradient: 'from-blue-500 to-cyan-500',
                stats: ['99.9% Uptime', '10K+ Users', 'Cloud Native']
              },
              {
                icon: '🕌',
                title: 'Cultural Authenticity',
                description: 'Islamic scholars ensuring theological accuracy and cultural sensitivity',
                gradient: 'from-green-500 to-emerald-500',
                stats: ['Scholar-Verified', '25+ Countries', 'Multilingual']
              },
              {
                icon: '📱',
                title: 'Mobile-First',
                description: 'Responsive designs optimized for all devices and screen sizes',
                gradient: 'from-orange-500 to-red-500',
                stats: ['iOS & Android', 'PWA Ready', '60fps Smooth']
              },
              {
                icon: '🔒',
                title: 'Secure & Compliant',
                description: 'Enterprise security with GDPR, COPPA, and FERPA compliance',
                gradient: 'from-indigo-500 to-purple-500',
                stats: ['SOC 2', 'GDPR', 'Encrypted']
              },
              {
                icon: '🚀',
                title: 'Rapid Delivery',
                description: 'Agile methodology delivering MVPs in weeks, not months',
                gradient: 'from-pink-500 to-rose-500',
                stats: ['2-Week Sprints', 'CI/CD', 'Fast Iteration']
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
                Numbers that tell our story of transforming Islamic education globally
              </p>
            </div>

            {/* Circular Progress Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
              {[
                { target: 150, label: 'Projects Delivered', color: 'blue', suffix: '+' },
                { target: 100, label: 'Happy Clients', color: 'green', suffix: '+' },
                { target: 50, label: 'Million Students Reached', color: 'purple', suffix: 'M+' },
                { target: 98, label: 'Client Satisfaction', color: 'pink', suffix: '%' },
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
                { metric: 'Average Project Rating', value: '4.9/5.0', icon: '⭐', trend: '+0.2 vs industry' },
                { metric: 'Client Retention Rate', value: '98%', icon: '🔄', trend: '+18% vs average' },
                { metric: 'On-Time Delivery', value: '95%', icon: '⚡', trend: 'Industry leading' },
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
              { icon: '🏆', title: 'Emmy Award', subtitle: 'Outstanding Animation' },
              { icon: '⭐', title: 'Best EdTech', subtitle: 'Education Innovation Awards' },
              { icon: '🎯', title: 'Top Rated', subtitle: 'Clutch.co 5.0/5.0' },
              { icon: '🌟', title: 'Excellence', subtitle: 'Islamic Education Summit' },
              { icon: '💎', title: 'Premium Partner', subtitle: 'Google Cloud' },
              { icon: '🚀', title: 'Fast Growth', subtitle: 'Inc. 5000' },
              { icon: '🎓', title: 'EdTech Leader', subtitle: 'Forbes Recognition' },
              { icon: '🔒', title: 'SOC 2 Certified', subtitle: 'Enterprise Security' },
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
                { name: 'Islamic Universities', icon: '🎓' },
                { name: 'Global NGOs', icon: '🌍' },
                { name: 'Media Networks', icon: '📺' },
                { name: 'Tech Companies', icon: '💻' },
                { name: 'Publishers', icon: '📚' },
                { name: 'Foundations', icon: '🏢' },
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
                quote: "Cubico's animation series transformed how our students engage with Islamic history. Enrollment increased 40% after launch. The quality rivals Netflix productions.",
                author: 'Dr. Maryam Al-Hassan',
                role: 'Principal, Al-Furqan Academy',
                rating: 5,
                impact: '+40% Enrollment'
              },
              {
                quote: "The LMS platform handles 10,000+ concurrent students seamlessly. ROI was evident within 6 months. Best investment we've made in a decade.",
                author: 'Ahmed Rahman',
                role: 'CTO, Islamic Online University',
                rating: 5,
                impact: '6-Month ROI'
              },
              {
                quote: "Our app has 500K+ downloads and 4.8★ rating. Cubico understood our vision for accessible Quranic education and delivered beyond expectations.",
                author: 'Fatima Sheikh',
                role: 'Founder, QuranPath Learning',
                rating: 5,
                impact: '500K+ Downloads'
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
                Ready to Transform Your Institution?
              </h2>
              <p className="text-xl text-zinc-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                Join 100+ leading educational institutions worldwide who trust Cubico Technologies to bring their vision to life.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <Link
                  href="/contact"
                  className="group px-12 py-6 rounded-2xl bg-gradient-to-r from-white to-zinc-300 text-black font-bold text-xl hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:scale-105"
                >
                  <span className="flex items-center space-x-3">
                    <span>Start Your Project</span>
                    <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/services"
                  className="px-12 py-6 rounded-2xl glass border-2 border-white/20 text-white font-bold text-xl hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  Browse Services
                </Link>
              </div>

              <p className="text-sm text-zinc-500">
                💬 Free consultation • 🚀 2-week sprint start • ⚡ No long-term commitment required
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
