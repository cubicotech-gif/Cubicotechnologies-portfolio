'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function Home() {
  const statsRef = useRef<HTMLDivElement>(null);

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

    // Intersection Observer for counter animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach((counter) => {
              if (counter.textContent === '0') {
                animateCounter(counter as HTMLElement);
              }
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full glass border border-white/10 mb-8 animate-float">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              <span className="text-sm font-medium text-zinc-300">Trusted by 100+ Educational Institutions Worldwide</span>
            </div>

            {/* Heading */}
            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl mb-6 leading-tight tracking-tight">
              Transform Islamic Education with <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-400 bg-clip-text text-transparent">Award-Winning</span> Digital Solutions
            </h1>

            {/* Description */}
            <p className="text-xl sm:text-2xl text-zinc-300 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
              From Emmy-quality animations to enterprise-grade learning platforms, we're the technology partner behind the world's most innovative Islamic educational institutions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/services" className="group px-8 py-4 rounded-xl bg-gradient-to-r from-white to-zinc-400 text-black font-semibold hover:shadow-2xl hover:shadow-primary/50 transition-all flex items-center space-x-2">
                <span>Explore Services</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/contact" className="px-8 py-4 rounded-xl glass border border-white/10 text-white font-semibold hover:bg-white/5 transition-all">
                Start Your Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="relative py-16 overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-zinc-500 mb-8 uppercase tracking-wider">Trusted by Leading Organizations</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {[
              { icon: '🕌', label: 'Islamic Schools' },
              { icon: '🎓', label: 'Universities' },
              { icon: '📚', label: 'Publishers' },
              { icon: '🏢', label: 'NGOs' },
              { icon: '🌍', label: 'Global Orgs' },
              { icon: '📺', label: 'Media Houses' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="glass rounded-xl p-6 h-20 flex items-center justify-center group hover:bg-white/10 transition-all">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="ml-2 font-display font-semibold text-zinc-400 text-sm">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section ref={statsRef} className="relative py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-12 lg:p-16">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl lg:text-5xl mb-4">Industry-Leading Excellence</h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Delivering transformative results for Islamic education globally</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {[
                { target: 150, label: 'Projects Completed', subtitle: 'Across 25+ Countries' },
                { target: 100, label: 'Happy Clients', subtitle: '98% Satisfaction Rate' },
                { target: 50, label: 'Students Reached', subtitle: 'Through Our Content', suffix: 'M+' },
                { target: 8, label: 'Years Experience', subtitle: 'Industry Expertise' },
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                  <div className="font-display font-bold text-5xl lg:text-6xl bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                    <span className="counter" data-target={stat.target}>0</span>{stat.suffix || '+'}
                  </div>
                  <p className="text-zinc-400 font-medium">{stat.label}</p>
                  <p className="text-zinc-600 text-sm mt-1">{stat.subtitle}</p>
                </div>
              ))}
            </div>

            <div className="max-w-3xl mx-auto text-center">
              <p className="text-zinc-300 leading-relaxed text-lg mb-6">
                At Cubico Technologies, we're not just service providers—we're your strategic partners in educational transformation. Our award-winning team brings together Islamic scholars, master animators, and enterprise software engineers to create solutions that set new industry standards.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Every project is crafted with meticulous attention to cultural authenticity, pedagogical effectiveness, and technological excellence. We're proud to be the technology backbone for institutions shaping the next generation of Muslim learners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="relative py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl lg:text-5xl mb-4">What Our Clients Say</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Don't just take our word for it—hear from educational leaders who've transformed their institutions with our solutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                quote: "Cubico's animation series transformed how our students engage with Islamic history. The quality rivals Netflix productions, and the cultural authenticity is impeccable. Our enrollment increased by 40% after launching.",
                author: 'Dr. Maryam Al-Hassan',
                role: 'Principal, Al-Furqan Academy, Dubai',
                initials: 'DM'
              },
              {
                quote: "The LMS platform Cubico built handles 10,000+ concurrent students seamlessly. Their support team is phenomenal, and the ROI was evident within 6 months. Best investment we've made in a decade.",
                author: 'Ahmed Rahman',
                role: 'CTO, Islamic Online University',
                initials: 'AR'
              },
              {
                quote: "Working with Cubico felt like having an in-house team. They understood our vision for accessible Quranic education and delivered beyond expectations. Our app has 500K+ downloads and 4.8★ rating.",
                author: 'Fatima Sheikh',
                role: 'Founder, QuranPath Learning',
                initials: 'FS'
              },
              {
                quote: "Cubico's content development team created our entire K-12 Islamic Studies curriculum. The interactive materials are pedagogically sound, engaging, and culturally sensitive. Teachers and parents love it.",
                author: 'Yusuf Khan',
                role: 'Director, Global Islamic Schools Network',
                initials: 'YK'
              },
              {
                quote: "We needed enterprise-grade security for our student portal handling sensitive donor data. Cubico delivered a bulletproof system that's both secure and user-friendly. Exceptional technical expertise.",
                author: 'Hassan Ibrahim',
                role: 'IT Director, Orphan Sponsorship Foundation',
                initials: 'HI'
              },
              {
                quote: "The 3D animations Cubico produced for our Hajj education series are breathtaking. Students can virtually experience the rituals before their journey. It's revolutionized our pre-Hajj training program.",
                author: 'Laila Abdullah',
                role: 'Education Director, Pilgrimage Learning Center',
                initials: 'LA'
              },
            ].map((testimonial, i) => (
              <div key={i} className="glass rounded-2xl p-8 spotlight-card gradient-border hover:bg-white/5 transition-all">
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400 text-xl">★★★★★</div>
                  </div>
                  <p className="text-zinc-300 leading-relaxed mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-zinc-400 flex items-center justify-center text-black font-bold mr-4">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.author}</p>
                      <p className="text-sm text-zinc-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Metrics */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-8 glass rounded-full px-8 py-4">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400 text-2xl">★★★★★</span>
                <span className="text-zinc-400">4.9/5.0 Average Rating</span>
              </div>
              <div className="w-px h-6 bg-white/10"></div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400 text-2xl">✓</span>
                <span className="text-zinc-400">98% Client Retention Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-3xl p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
            <div className="relative z-10">
              <h2 className="font-display font-bold text-4xl lg:text-5xl mb-6">Ready to Start Your Project?</h2>
              <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                Let's collaborate to bring your vision to life. Whether it's an animation series, educational platform, or custom web solution – we're here to help.
              </p>
              <Link href="/contact" className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-white to-zinc-400 text-black font-semibold hover:shadow-2xl hover:shadow-primary/50 transition-all space-x-2">
                <span>Get In Touch</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
