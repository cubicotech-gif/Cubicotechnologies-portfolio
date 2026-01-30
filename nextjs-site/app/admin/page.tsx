'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SystemStats {
  heroImages: number;
  featuredProjects: number;
  clientLogos: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats>({
    heroImages: 0,
    featuredProjects: 0,
    clientLogos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [heroRes, projectsRes, logosRes] = await Promise.all([
          fetch('/api/hero-images'),
          fetch('/api/featured-projects'),
          fetch('/api/client-logos'),
        ]);

        const [heroData, projectsData, logosData] = await Promise.all([
          heroRes.json(),
          projectsRes.json(),
          logosRes.json(),
        ]);

        setStats({
          heroImages: heroData.success ? heroData.images.length : 0,
          featuredProjects: projectsData.success ? projectsData.projects.length : 0,
          clientLogos: logosData.success ? logosData.logos.length : 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const adminSections = [
    {
      title: 'Image Library',
      description: 'Upload and manage all your images in one place',
      href: '/admin/library',
      icon: '📚',
      count: 0,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      title: 'Hero Images',
      description: 'Manage animated background cards for the hero section',
      href: '/admin/hero',
      icon: '🎨',
      count: stats.heroImages,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Featured Projects',
      description: 'Manage projects displayed in the homepage carousel',
      href: '/admin/projects',
      icon: '🚀',
      count: stats.featuredProjects,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'Client Logos',
      description: 'Manage client logos in the homepage marquee',
      href: '/admin/logos',
      icon: '🏢',
      count: stats.clientLogos,
      color: 'from-green-500 to-teal-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-4 font-[family-name:var(--font-space-grotesk)]">
            <span className="gradient-text">CUBICO</span> Admin Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Manage all content for your portfolio website
          </p>
        </div>

        {/* Quick Stats */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {adminSections.map((section, index) => (
                <div
                  key={index}
                  className="glass rounded-2xl p-6 text-center border border-white/10"
                >
                  <div className="text-5xl mb-4">{section.icon}</div>
                  <div className={`text-4xl font-bold bg-gradient-to-r ${section.color} bg-clip-text text-transparent mb-2`}>
                    {section.count}
                  </div>
                  <p className="text-gray-400 text-sm">{section.title}</p>
                </div>
              ))}
            </div>

            {/* Admin Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {adminSections.map((section, index) => (
                <Link
                  key={index}
                  href={section.href}
                  className="group relative block"
                >
                  <div className="glass rounded-2xl p-8 border border-white/10 transition-all duration-300 hover:border-white/30 hover:scale-105">
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${section.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />

                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="text-6xl mb-6">{section.icon}</div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
                        {section.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 mb-6 leading-relaxed">
                        {section.description}
                      </p>

                      {/* Button */}
                      <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${section.color} text-white font-semibold rounded-lg transition-all duration-300 group-hover:shadow-lg`}>
                        <span>Manage</span>
                        <svg
                          className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* System Information */}
            <div className="glass rounded-2xl p-8 mt-12 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-space-grotesk)]">
                System Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Upload System</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>✅ Supabase Storage integrated</li>
                    <li>✅ Multi-folder organization (hero, projects, logos, etc.)</li>
                    <li>✅ Automatic image optimization</li>
                    <li>✅ Storage cleanup on delete</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Database</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>✅ PostgreSQL with Row Level Security</li>
                    <li>✅ Real-time updates</li>
                    <li>✅ Automatic backups</li>
                    <li>✅ Public read, service role write</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>✅ Drag & drop uploads</li>
                    <li>✅ Image browser & selector</li>
                    <li>✅ Order management</li>
                    <li>✅ Active/inactive toggle</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Homepage Integration</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>✅ Hero animated background</li>
                    <li>✅ Featured projects carousel</li>
                    <li>✅ Client logos marquee</li>
                    <li>✅ Dynamic content loading</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="glass rounded-2xl p-8 mt-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-space-grotesk)]">
                Quick Links
              </h2>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  🏠 View Homepage
                </Link>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  🗄️ Supabase Dashboard
                </a>
                <Link
                  href="/api/hero-images"
                  target="_blank"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  🔌 API: Hero Images
                </Link>
                <Link
                  href="/api/featured-projects"
                  target="_blank"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  🔌 API: Projects
                </Link>
                <Link
                  href="/api/client-logos"
                  target="_blank"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  🔌 API: Logos
                </Link>
              </div>
            </div>

            {/* Documentation Note */}
            <div className="mt-8 p-6 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📚</div>
                <div>
                  <h3 className="text-blue-400 font-semibold mb-2">Documentation Available</h3>
                  <p className="text-blue-300 text-sm">
                    Complete system documentation is available in <code className="px-2 py-1 bg-blue-500/30 rounded">SYSTEM_DOCUMENTATION.md</code> and database setup SQL in <code className="px-2 py-1 bg-blue-500/30 rounded">DATABASE_SETUP.sql</code>
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
