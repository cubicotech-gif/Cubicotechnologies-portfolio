'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Service {
  number: string;
  title: string;
  description: string;
  features: string[];
  gradient: string;
  slug: string;
}

const services: Service[] = [
  {
    number: '01',
    title: 'Artwork Designing',
    description: 'Transform your ideas into stunning visual masterpieces. We create custom digital illustrations, artwork, and visual assets from scratch, tailored to your brand\'s unique identity and vision.',
    features: [
      'Custom digital illustrations and artwork',
      'Print-ready files in multiple formats',
      'Unique concepts and visual styles',
      'Scalable vector graphics (SVG, AI)',
      'Source files included',
      'Unlimited revisions until perfect'
    ],
    gradient: 'from-purple-600 to-pink-600',
    slug: 'artwork-designing'
  },
  {
    number: '02',
    title: 'Branding & Graphics',
    description: 'Build a memorable brand identity that resonates with your audience. From logos to complete brand guidelines, we craft cohesive visual systems that make your business stand out in the marketplace.',
    features: [
      'Logo design with multiple concepts',
      'Complete brand style guides',
      'Business cards & stationery',
      'Marketing collateral design',
      'Brand strategy consultation',
      'Print and digital asset packages'
    ],
    gradient: 'from-blue-600 to-cyan-600',
    slug: 'branding-graphics'
  },
  {
    number: '03',
    title: 'Social Media Graphics',
    description: 'Dominate social media with eye-catching graphics that stop the scroll. We design engaging posts, stories, ads, and content that drive engagement and build your online presence across all platforms.',
    features: [
      'Instagram, Facebook, LinkedIn posts',
      'Story and reel templates',
      'Ad creative design and optimization',
      'Carousel and multi-slide posts',
      'Content calendar templates',
      'Platform-specific sizing & formats'
    ],
    gradient: 'from-orange-600 to-yellow-600',
    slug: 'social-media-graphics'
  },
  {
    number: '04',
    title: 'Videography',
    description: 'Bring your story to life through motion. From social media reels to product videos, we create compelling video content with professional editing, motion graphics, and effects that captivate your audience.',
    features: [
      'Social media reels & short-form content',
      'Product demonstration videos',
      'Motion graphics and animation',
      'Professional video editing',
      'Color grading and effects',
      'Multi-format delivery (1:1, 9:16, 16:9)'
    ],
    gradient: 'from-pink-600 to-purple-600',
    slug: 'videography'
  }
];

const processSteps = [
  {
    number: '1',
    title: 'Discovery & Consultation',
    description: 'We start by understanding your vision, goals, and target audience'
  },
  {
    number: '2',
    title: 'Concept Development',
    description: 'Our team brainstorms and develops initial concepts for your project'
  },
  {
    number: '3',
    title: 'Design & Creation',
    description: 'We bring the approved concepts to life with professional execution'
  },
  {
    number: '4',
    title: 'Review & Revisions',
    description: 'You review the work and we refine based on your feedback'
  },
  {
    number: '5',
    title: 'Finalization',
    description: 'Final touches and polish to ensure everything is perfect'
  },
  {
    number: '6',
    title: 'Delivery & Support',
    description: 'We deliver all files and provide ongoing support as needed'
  }
];

const reasons = [
  {
    icon: '🏆',
    title: 'International Quality Standards',
    description: 'Our work meets global standards with attention to detail and professional execution'
  },
  {
    icon: '⚡',
    title: 'Fast Turnaround Times',
    description: 'Quick delivery without compromising quality, with rush options available'
  },
  {
    icon: '♾️',
    title: 'Unlimited Revisions',
    description: 'We work until you\'re 100% satisfied with the final result'
  },
  {
    icon: '💬',
    title: 'Dedicated Support',
    description: '24/7 communication and support throughout your project journey'
  },
  {
    icon: '💰',
    title: 'Competitive Pricing',
    description: 'Premium quality at fair prices with flexible payment options'
  }
];

const faqs = [
  {
    question: 'What\'s your typical turnaround time?',
    answer: 'Turnaround time varies by service and project complexity. Simple designs typically take 2-3 days, while comprehensive branding projects may take 1-2 weeks. We also offer rush delivery for urgent projects.'
  },
  {
    question: 'Do you offer rush delivery?',
    answer: 'Yes! We offer expedited delivery options for most services. Rush delivery usually incurs an additional fee but ensures your project is prioritized and delivered within 24-48 hours.'
  },
  {
    question: 'How many revisions are included?',
    answer: 'All our packages include unlimited revisions. We work closely with you until you\'re completely satisfied with the final result. Your satisfaction is our priority.'
  },
  {
    question: 'Do you work with international clients?',
    answer: 'Absolutely! We work with clients worldwide and are experienced in remote collaboration. We accommodate different time zones and communicate via email, video calls, and project management tools.'
  },
  {
    question: 'What file formats do you deliver?',
    answer: 'We deliver files in all commonly used formats based on your needs: PNG, JPG, PDF for general use; AI, EPS, SVG for vector graphics; PSD for editable designs; and MP4, MOV for videos. Source files are included with all packages.'
  },
  {
    question: 'Can you work with my existing brand?',
    answer: 'Yes! We can work within your existing brand guidelines or help refresh and evolve your current branding. We\'re flexible and adapt our designs to match your established visual identity.'
  },
  {
    question: 'Do you provide ongoing support after project completion?',
    answer: 'Yes, we provide post-delivery support to ensure you\'re satisfied with the final deliverables. We\'re available to answer questions, provide minor adjustments, and offer guidance on using your new assets.'
  },
  {
    question: 'What information do you need to get started?',
    answer: 'To begin, we need a clear brief including your goals, target audience, preferred style/references, any existing brand materials, and timeline. The more details you provide, the better we can serve you.'
  }
];

export default function ServicesPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/20 to-black" />
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_100%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-6">WHAT WE DO</p>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent">
              Our Services
            </h1>
            <p className="text-base lg:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              From concept to creation, we deliver exceptional creative solutions tailored to your unique needs. Our comprehensive services span across digital art, branding, social media, and videography.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SERVICES GRID SECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/5 rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-500 cursor-pointer hover:border-white/20 hover:shadow-2xl"
            >
              {/* Image Section */}
              <div className="relative h-[300px] lg:h-[400px] overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900">
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />

                {/* Number Badge */}
                <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{service.number}</span>
                </div>

                {/* Service Icon/Pattern */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                  <div className={`w-64 h-64 rounded-full bg-gradient-to-br ${service.gradient} blur-3xl`} />
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 lg:p-12">
                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-base lg:text-lg text-gray-300 leading-relaxed mb-8">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">WHAT&apos;S INCLUDED</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 bg-gradient-to-r ${service.gradient} rounded-full p-1`} fill="none" viewBox="0 0 24 24" stroke="white">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 text-sm lg:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Link
                  href={`/contact?service=${service.slug}`}
                  className={`group/btn flex items-center justify-center gap-2 w-full bg-gradient-to-r ${service.gradient} text-white font-semibold py-4 px-8 rounded-xl hover:brightness-110 hover:scale-105 transition-all duration-300`}
                >
                  Get Started
                  <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROCESS OVERVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">Our Process</h2>

          {/* Desktop Timeline */}
          <div className="hidden lg:grid lg:grid-cols-6 gap-4 relative">
            {/* Connecting Line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600" style={{ top: '2rem' }} />

            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center"
              >
                {/* Number Badge */}
                <div className="relative z-10 w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {step.number}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden space-y-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-xl font-bold text-white">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">Why Choose Cubico</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/3 border border-white/5 rounded-2xl p-8 hover:border-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{reason.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{reason.title}</h3>
                <p className="text-gray-400 leading-relaxed">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/3 border border-white/5 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors duration-200"
                >
                  <span className="text-lg font-semibold text-white pr-8">{faq.question}</span>
                  <svg
                    className={`w-6 h-6 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                      expandedFaq === index ? 'rotate-45' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600" />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-20 lg:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Let&apos;s bring your vision to life
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-10 py-5 bg-white text-purple-600 font-bold text-lg rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl"
              >
                Get Started
              </Link>
              <Link
                href="/portfolio"
                className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white/20 transition-all duration-300"
              >
                View Portfolio
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
