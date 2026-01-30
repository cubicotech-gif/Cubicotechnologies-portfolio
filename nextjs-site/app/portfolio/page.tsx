'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface PortfolioItem {
  id: string | number;
  title: string;
  category: string;
  client: string;
  description: string;
  imageUrl?: string;
  image_url?: string;
  year: string;
  services: string[];
}

const portfolioData: PortfolioItem[] = [
  {
    id: 1,
    title: 'Brand Identity Redesign',
    category: 'Branding & Graphics',
    client: 'TechCorp Solutions',
    description: 'Complete brand identity overhaul including logo design, color palette, typography, and brand guidelines for a leading technology company.',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
    year: '2024',
    services: ['Logo Design', 'Brand Guidelines', 'Stationery Design']
  },
  {
    id: 2,
    title: 'Social Media Campaign',
    category: 'Social Media',
    client: 'FitLife Wellness',
    description: 'Engaging social media graphics and content strategy for a wellness brand, increasing engagement by 200%.',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
    year: '2024',
    services: ['Social Media Graphics', 'Content Strategy', 'Campaign Design']
  },
  {
    id: 3,
    title: 'Product Launch Video',
    category: 'Videography',
    client: 'InnovateTech',
    description: 'Professional product launch video with motion graphics, showcasing cutting-edge technology in a visually stunning way.',
    imageUrl: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&h=600&fit=crop',
    year: '2024',
    services: ['Video Production', 'Motion Graphics', 'Color Grading']
  },
  {
    id: 4,
    title: 'Editorial Illustration Series',
    category: 'Artwork Designing',
    client: 'Modern Magazine',
    description: 'A series of custom illustrations for editorial content, blending digital art with traditional techniques.',
    imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&h=600&fit=crop',
    year: '2023',
    services: ['Digital Illustration', 'Art Direction', 'Editorial Design']
  },
  {
    id: 5,
    title: 'E-commerce Package Design',
    category: 'Branding & Graphics',
    client: 'OrganicGoods Co.',
    description: 'Sustainable packaging design for organic products, featuring minimalist aesthetics and eco-friendly materials.',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop',
    year: '2024',
    services: ['Packaging Design', 'Brand Identity', '3D Mockups']
  },
  {
    id: 6,
    title: 'Instagram Reels Content',
    category: 'Social Media',
    client: 'StyleHub Fashion',
    description: 'Dynamic Instagram Reels content with trending audio, transitions, and effects that boosted brand visibility.',
    imageUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=600&fit=crop',
    year: '2024',
    services: ['Video Editing', 'Content Creation', 'Trend Analysis']
  },
  {
    id: 7,
    title: 'Corporate Documentary',
    category: 'Videography',
    client: 'GlobalEnergy Inc.',
    description: 'Professional corporate documentary showcasing company culture, values, and impact on the renewable energy sector.',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=600&fit=crop',
    year: '2023',
    services: ['Documentary Production', 'Interviews', 'Drone Footage']
  },
  {
    id: 8,
    title: 'Character Design Project',
    category: 'Artwork Designing',
    client: 'GameStudio Pro',
    description: 'Original character designs for mobile gaming app, including concept art, variations, and final renderings.',
    imageUrl: 'https://images.unsplash.com/photo-1596548438137-d51ea5c83ca5?w=800&h=600&fit=crop',
    year: '2024',
    services: ['Character Design', 'Concept Art', 'Digital Painting']
  },
  {
    id: 9,
    title: 'Restaurant Menu Design',
    category: 'Branding & Graphics',
    client: 'Gourmet Bistro',
    description: 'Elegant menu design with custom typography, food photography styling, and luxurious print finishes.',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&h=600&fit=crop',
    year: '2023',
    services: ['Menu Design', 'Food Photography', 'Print Design']
  },
  {
    id: 10,
    title: 'LinkedIn Carousel Series',
    category: 'Social Media',
    client: 'B2B Solutions',
    description: 'Professional LinkedIn carousel posts explaining complex business concepts with clean infographics.',
    imageUrl: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&h=600&fit=crop',
    year: '2024',
    services: ['Infographic Design', 'Data Visualization', 'B2B Content']
  },
  {
    id: 11,
    title: 'Event Highlight Reel',
    category: 'Videography',
    client: 'Annual Tech Summit',
    description: 'High-energy event highlight video capturing keynotes, networking, and memorable moments from a 3-day conference.',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop',
    year: '2024',
    services: ['Event Coverage', 'Multi-Camera Production', 'Same-Day Edit']
  },
  {
    id: 12,
    title: 'Mural Artwork Installation',
    category: 'Artwork Designing',
    client: 'Urban Development Corp',
    description: 'Large-scale mural design for public space, celebrating community culture with vibrant colors and symbolic imagery.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop',
    year: '2023',
    services: ['Mural Design', 'Public Art', 'Community Collaboration']
  },
  {
    id: 13,
    title: 'App UI/UX Design',
    category: 'Branding & Graphics',
    client: 'FinTech Startup',
    description: 'Modern mobile app interface design with intuitive UX, smooth animations, and consistent visual language.',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    year: '2024',
    services: ['UI Design', 'UX Research', 'Prototyping']
  },
  {
    id: 14,
    title: 'Animated Explainer Video',
    category: 'Videography',
    client: 'EduLearn Platform',
    description: '2D animated explainer video breaking down complex educational concepts into digestible visual narratives.',
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
    year: '2024',
    services: ['2D Animation', 'Storyboarding', 'Voice Over']
  },
  {
    id: 15,
    title: 'Poster Art Collection',
    category: 'Artwork Designing',
    client: 'Music Festival 2024',
    description: 'Bold and eye-catching poster designs for music festival, blending psychedelic art with modern graphic design.',
    imageUrl: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800&h=600&fit=crop',
    year: '2024',
    services: ['Poster Design', 'Typography', 'Print Production']
  }
];

const categories = [
  'All',
  'Artwork Designing',
  'Branding & Graphics',
  'Social Media',
  'Videography'
];

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(portfolioData);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>(portfolioData);
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch portfolio items from database
  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        const response = await fetch('/api/portfolio?active=true');
        const data = await response.json();
        if (data.success && data.items && data.items.length > 0) {
          // Use database items
          setPortfolioItems(data.items);
        } else {
          // Fallback to sample data if no items in database
          setPortfolioItems(portfolioData);
        }
      } catch (error) {
        console.error('Error fetching portfolio items:', error);
        // Fallback to sample data on error
        setPortfolioItems(portfolioData);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItems();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsFilterSticky(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredItems(portfolioItems);
    } else {
      setFilteredItems(portfolioItems.filter(item => item.category === activeFilter));
    }
    setVisibleCount(12);
  }, [activeFilter, portfolioItems]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HERO SECTION */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-cyan-900/30" />
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_100%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent">
              Our Portfolio
            </h1>
            <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto">
              Explore our collection of creative work across branding, design, social media, and videography.
            </p>
          </motion.div>
        </div>

        {/* Decorative gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </section>

      {/* STICKY FILTER NAVIGATION */}
      <motion.div
        className={`sticky top-20 z-40 transition-all duration-300 ${
          isFilterSticky
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === category
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* Results count */}
          <motion.p
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-gray-500 mt-4"
          >
            {filteredItems.length} {filteredItems.length === 1 ? 'project' : 'projects'} found
          </motion.p>
        </div>
      </motion.div>

      {/* PORTFOLIO GRID */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {visibleItems.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {visibleItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`group relative overflow-hidden rounded-2xl bg-zinc-900 cursor-pointer ${
                    index % 7 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                  onClick={() => setSelectedProject(item)}
                >
                  {/* Image Container */}
                  <div className={`relative overflow-hidden ${
                    index % 7 === 0 ? 'aspect-[16/10]' : 'aspect-[4/5]'
                  }`}>
                    <Image
                      src={item.image_url || item.imageUrl || ''}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                    {/* Hover Content Overlay */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <div className="space-y-2">
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full">
                          {item.category}
                        </span>
                        <h3 className="text-xl lg:text-2xl font-bold text-white">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-300 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm text-gray-400">{item.client}</span>
                          <span className="text-sm text-gray-500">{item.year}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Bottom Info (Always Visible) */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400">{item.client}</p>
                  </div>

                  {/* Decorative Corner Accent */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* EMPTY STATE */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
              <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No projects found</h3>
            <p className="text-gray-400 mb-6">
              Try selecting a different category or view all projects
            </p>
            <button
              onClick={() => setActiveFilter('All')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              View All Projects
            </button>
          </motion.div>
        )}

        {/* LOAD MORE BUTTON */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="group relative px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-medium overflow-hidden hover:border-purple-500/50 transition-all duration-300"
            >
              <span className="relative z-10">Load More Projects</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </motion.div>
        )}
      </section>

      {/* PROJECT DETAIL MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 z-20 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full text-white transition-all duration-300 group"
              >
                <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="grid lg:grid-cols-2 gap-0">
                {/* Left: Image */}
                <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[600px]">
                  <Image
                    src={selectedProject.image_url || selectedProject.imageUrl || ''}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-zinc-900" />
                </div>

                {/* Right: Details */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <span className="inline-block px-4 py-1.5 text-xs font-medium bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full mb-4 self-start">
                    {selectedProject.category}
                  </span>

                  <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                    {selectedProject.title}
                  </h2>

                  <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {selectedProject.client}
                    </span>
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {selectedProject.year}
                    </span>
                  </div>

                  <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    {selectedProject.description}
                  </p>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Services Provided
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.services.map((service, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Decorative Gradient Line */}
                  <div className="mt-12 h-px bg-gradient-to-r from-purple-500/50 via-cyan-500/50 to-transparent" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
