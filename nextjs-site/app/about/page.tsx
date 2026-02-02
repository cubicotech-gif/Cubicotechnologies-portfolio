'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection />
      <StorySection />
      <MissionVisionSection />
      <ValuesSection />
      <StatsSection />
      <TeamSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <FinalCTA />
    </div>
  );
}

// HERO SECTION
function HeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/20 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      </div>

      {/* Floating Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-600/30 rounded-full blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-sm uppercase tracking-widest text-gray-400 mb-4">
            ABOUT US
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            We Are Cubico
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
            A creative agency dedicated to delivering exceptional visual experiences that transform brands and captivate audiences worldwide.
          </p>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}

// OUR STORY SECTION
function StorySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative Line */}
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-cyan-600 mb-8" />

          <h2 className="text-5xl md:text-6xl font-bold mb-12">Our Story</h2>

          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <p>
              Founded in 2020, Cubico Technologies began with a simple yet powerful vision: to create world-class creative work that helps businesses stand out in an increasingly digital world. What started as a small team of passionate designers has grown into a full-service creative agency serving clients across multiple continents.
            </p>

            <p>
              Our name &quot;Cubico&quot; represents the multidimensional nature of creativity—every project has different sides, perspectives, and possibilities. We approach each brief as a unique opportunity to explore, innovate, and deliver solutions that exceed expectations.
            </p>

            <p>
              Based in Karachi, Pakistan, we bring international quality standards to every project. Our team combines local expertise with global perspectives, creating work that resonates with audiences worldwide. From startups finding their visual identity to established brands refreshing their image, we bring the same level of dedication, creativity, and technical excellence to every project.
            </p>

            <p>
              Today, we&apos;re proud to have completed over 100 projects for 50+ clients worldwide. As we continue to grow, our commitment remains unchanged: delivering exceptional creative work that makes a real impact for our clients.
            </p>
          </div>

          {/* Timeline */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { year: "2020", label: "Founded" },
              { year: "2021", label: "First International Client" },
              { year: "2022", label: "50 Projects Milestone" },
              { year: "2024", label: "100+ Projects" },
            ].map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {milestone.year}
                </div>
                <div className="text-sm text-gray-400">{milestone.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// MISSION & VISION SECTION
function MissionVisionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-8 bg-gradient-to-b from-black via-purple-950/10 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-10 -left-10 text-[200px] font-bold text-purple-600/5">
              01
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-4xl font-bold mb-6">Our Mission</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                To empower businesses with exceptional creative solutions that drive growth, build brand recognition, and create lasting impressions. We believe great design isn&apos;t just about aesthetics—it&apos;s about solving problems and achieving measurable results.
              </p>
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -top-10 -left-10 text-[200px] font-bold text-cyan-600/5">
              02
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-4xl font-bold mb-6">Our Vision</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                To be the go-to creative partner for businesses worldwide, known for our innovative approach, exceptional quality, and commitment to client success. We envision a future where every brand, regardless of size, has access to world-class creative services.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// VALUES SECTION
function ValuesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const values = [
    {
      icon: "💎",
      title: "Quality First",
      description: "We never compromise on quality. Every project receives the same level of attention, care, and excellence, regardless of size or budget.",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      icon: "❤️",
      title: "Client Satisfaction",
      description: "Your success is our success. We go above and beyond to ensure every client is thrilled with the final result.",
      gradient: "from-pink-600 to-red-600"
    },
    {
      icon: "⚡",
      title: "Innovation",
      description: "We stay ahead of design trends and continuously explore new techniques to deliver fresh, innovative solutions.",
      gradient: "from-yellow-600 to-orange-600"
    },
    {
      icon: "🛡️",
      title: "Integrity",
      description: "Honesty, transparency, and ethical practices guide everything we do. We build lasting relationships based on trust.",
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      icon: "🤝",
      title: "Collaboration",
      description: "We believe the best results come from close collaboration. Your input and feedback are essential to our process.",
      gradient: "from-green-600 to-teal-600"
    },
    {
      icon: "🏆",
      title: "Excellence",
      description: "We set high standards and consistently exceed them. Excellence isn&apos;t just a goal—it&apos;s our standard.",
      gradient: "from-indigo-600 to-purple-600"
    }
  ];

  return (
    <section ref={ref} className="py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Our Values</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            The principles that guide our work and define who we are
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Gradient Glow on Hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`} />

              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center text-2xl mb-6`}>
                  {value.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>

                {/* Description */}
                <p className="text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// STATS SECTION
function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: 5, suffix: "+", label: "Years of Excellence", icon: "📅" },
    { value: 100, suffix: "+", label: "Projects Completed", icon: "✅" },
    { value: 50, suffix: "+", label: "Happy Clients", icon: "😊" },
    { value: 98, suffix: "%", label: "Client Satisfaction", icon: "⭐" }
  ];

  return (
    <section ref={ref} className="py-32 px-8 bg-gradient-to-b from-black via-purple-950/20 to-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="text-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{stat.icon}</div>
              <CountUpNumber value={stat.value} suffix={stat.suffix} isInView={isInView} />
              <div className="text-gray-400 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Counter Component
function CountUpNumber({ value, suffix, isInView }: { value: number, suffix: string, isInView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
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
  }, [value, isInView]);

  return (
    <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
      {count}{suffix}
    </div>
  );
}

// TEAM SECTION
function TeamSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const team = [
    {
      name: "Rooh Ul",
      role: "Founder & Creative Director",
      bio: "Visionary leader with 5+ years of experience creating impactful brand identities and digital experiences.",
      image: "👨‍💼"
    },
    {
      name: "Lead Designer",
      role: "Senior Designer",
      bio: "Specialist in illustration and digital art with a passion for unique visual storytelling.",
      image: "👩‍🎨"
    },
    {
      name: "Brand Strategist",
      role: "Brand Strategy Lead",
      bio: "Helps brands find their voice and stand out in competitive markets.",
      image: "👨‍💼"
    },
    {
      name: "Motion Designer",
      role: "Video & Animation",
      bio: "Brings stories to life through animation and video editing excellence.",
      image: "👨‍💻"
    }
  ];

  return (
    <section ref={ref} className="py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Meet Our Team</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            The creative minds behind Cubico
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              {/* Photo */}
              <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 mb-6 overflow-hidden border border-white/10 flex items-center justify-center text-8xl hover:scale-105 transition-transform duration-300">
                {member.image}
              </div>

              {/* Info */}
              <h3 className="text-xl font-bold mb-2">{member.name}</h3>
              <div className="text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text font-semibold mb-3">
                {member.role}
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// WHY CHOOSE US SECTION
function WhyChooseUsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const reasons = [
    {
      title: "International Quality Standards",
      description: "We deliver work that meets international standards, suitable for global markets and audiences.",
      number: "01"
    },
    {
      title: "Unlimited Revisions",
      description: "We work with you until you&apos;re 100% satisfied. Your happiness is our priority and success metric.",
      number: "02"
    },
    {
      title: "Fast Turnaround",
      description: "We understand deadlines. Most projects are delivered within 5-7 business days without compromising quality.",
      number: "03"
    },
    {
      title: "Dedicated Support",
      description: "Direct communication with your designer. No middlemen, no delays, just efficient collaboration.",
      number: "04"
    },
    {
      title: "Competitive Pricing",
      description: "World-class quality at fair, transparent prices. No hidden fees, no surprises.",
      number: "05"
    },
    {
      title: "Source Files Included",
      description: "You own everything. All source files and assets are included with every project.",
      number: "06"
    }
  ];

  return (
    <section ref={ref} className="py-32 px-8 bg-gradient-to-b from-black via-cyan-950/10 to-black">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Why Choose Cubico</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            What sets us apart from other creative agencies
          </p>
        </motion.div>

        <div className="space-y-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center font-bold text-lg">
                  {reason.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all">
                    {reason.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// TESTIMONIALS SECTION
function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      quote: "Cubico transformed our brand completely. Their attention to detail and creative vision exceeded all our expectations. Best investment we've made!",
      author: "Sarah Johnson",
      role: "CEO, TechFlow Inc",
      rating: 5
    },
    {
      quote: "Working with Cubico was a breeze. They understood our vision immediately and delivered exceptional work on time. Highly recommended!",
      author: "Ahmed Khan",
      role: "Marketing Director, Digital Solutions",
      rating: 5
    },
    {
      quote: "The quality of work is outstanding. Cubico helped us establish a strong visual identity that resonates with our target audience.",
      author: "Maria Garcia",
      role: "Founder, Creative Studio",
      rating: 5
    }
  ];

  return (
    <section ref={ref} className="py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">What Clients Say</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Don&apos;t just take our word for it
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-300 leading-relaxed mb-6 italic">
                &quot;{testimonial.quote}&quot;
              </p>

              {/* Author */}
              <div>
                <div className="font-bold text-white">{testimonial.author}</div>
                <div className="text-sm text-gray-400">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// FINAL CTA
function FinalCTA() {
  return (
    <section className="py-32 px-8 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-cyan-600/20 to-purple-600/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to Work With Us?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Let&apos;s create something amazing together
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold text-lg hover:scale-105 transition-transform"
            >
              Start a Project
            </Link>
            <Link
              href="/portfolio"
              className="px-10 py-4 rounded-xl border-2 border-white/20 text-white font-semibold text-lg hover:bg-white/5 transition-colors"
            >
              View Our Work
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
