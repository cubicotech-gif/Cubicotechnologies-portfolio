'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ====== Type Definitions ======

interface HeroImage {
  id: string;
  filename: string;
  url?: string;
  category: string;
  order: number;
  active: boolean;
}

interface FeaturedProject {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  order: number;
  active: boolean;
  client_name?: string;
  project_url?: string;
}

interface ClientLogo {
  id: string;
  client_name: string;
  logo_url: string;
  order: number;
  active: boolean;
  website_url?: string;
}

interface ServiceImage {
  id: string;
  service_type: string;
  image_slot: number;
  image_url: string;
  alt_text?: string;
  order: number;
  active: boolean;
}

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  client: string;
  description: string;
  image_url: string;
  year: string;
  services: string[];
  order: number;
  active: boolean;
}

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type?: string;
}

interface LibraryImage {
  filename: string;
  url: string;
  path: string;
  media_type?: string;
}

// ====== Section Tabs ======

type SectionTab = 'hero' | 'projects' | 'logos' | 'services' | 'portfolio' | 'site-settings';

const SECTION_TABS: { id: SectionTab; label: string; icon: string }[] = [
  { id: 'hero', label: 'Hero Images', icon: '🎨' },
  { id: 'projects', label: 'Featured Projects', icon: '🚀' },
  { id: 'logos', label: 'Client Logos', icon: '🏢' },
  { id: 'services', label: 'Service Images', icon: '💼' },
  { id: 'portfolio', label: 'Portfolio', icon: '📁' },
  { id: 'site-settings', label: 'Site Logo', icon: '🏷️' },
];

export default function AssignedMediaPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('hero');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  // Data for each section
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [serviceImages, setServiceImages] = useState<ServiceImage[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);

  // Library images for replacement
  const [libraryImages, setLibraryImages] = useState<LibraryImage[]>([]);

  // Loading states
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editModal, setEditModal] = useState<{
    section: SectionTab;
    item: any;
  } | null>(null);
  const [editFields, setEditFields] = useState<Record<string, any>>({});
  const [showReplaceBrowser, setShowReplaceBrowser] = useState(false);
  const [replaceImageUrl, setReplaceImageUrl] = useState('');

  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(text);
    setMessageType(type);
    if (type !== 'error') setTimeout(() => setMessage(''), 4000);
  };

  // ====== Fetch Functions ======

  const fetchLibrary = async () => {
    try {
      const res = await fetch('/api/upload-image');
      const data = await res.json();
      if (data.success) setLibraryImages(data.images.filter((img: LibraryImage) => img.media_type !== 'video'));
    } catch (e) { console.error(e); }
  };

  const fetchHero = async () => {
    try {
      const res = await fetch('/api/hero-images');
      const data = await res.json();
      if (data.success) setHeroImages(data.images.sort((a: HeroImage, b: HeroImage) => a.order - b.order));
    } catch (e) { console.error(e); }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/featured-projects');
      const data = await res.json();
      if (data.success) setProjects(data.projects.sort((a: FeaturedProject, b: FeaturedProject) => a.order - b.order));
    } catch (e) { console.error(e); }
  };

  const fetchLogos = async () => {
    try {
      const res = await fetch('/api/client-logos');
      const data = await res.json();
      if (data.success) setLogos(data.logos.sort((a: ClientLogo, b: ClientLogo) => a.order - b.order));
    } catch (e) { console.error(e); }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/service-images');
      const data = await res.json();
      if (data.success) setServiceImages(data.images.sort((a: ServiceImage, b: ServiceImage) => a.order - b.order));
    } catch (e) { console.error(e); }
  };

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      if (data.success) setPortfolioItems(data.items.sort((a: PortfolioItem, b: PortfolioItem) => a.order - b.order));
    } catch (e) { console.error(e); }
  };

  const fetchSiteSettings = async () => {
    try {
      const res = await fetch('/api/site-settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSiteSettings(Array.isArray(data.settings) ? data.settings : [data.settings]);
      }
    } catch (e) { console.error(e); }
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchHero(), fetchProjects(), fetchLogos(), fetchServices(), fetchPortfolio(), fetchSiteSettings(), fetchLibrary()]);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // ====== Action Functions ======

  const handleToggleActive = async (section: SectionTab, id: string, currentActive: boolean) => {
    const endpoints: Record<string, string> = {
      hero: '/api/hero-images',
      projects: '/api/featured-projects',
      logos: '/api/client-logos',
      services: '/api/service-images',
      portfolio: '/api/portfolio',
    };
    const endpoint = endpoints[section];
    if (!endpoint) return;

    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentActive }),
      });
      const data = await res.json();
      if (data.success) {
        showMessage('✅ Status updated', 'success');
        refreshSection(section);
      } else {
        showMessage('❌ Update failed', 'error');
      }
    } catch (e) {
      showMessage('❌ Update failed', 'error');
    }
  };

  const handleDelete = async (section: SectionTab, id: string, label: string) => {
    if (!confirm(`Delete "${label}" from ${SECTION_TABS.find(t => t.id === section)?.label}?\n\nThis cannot be undone.`)) return;

    const endpoints: Record<string, string> = {
      hero: '/api/hero-images',
      projects: '/api/featured-projects',
      logos: '/api/client-logos',
      services: '/api/service-images',
      portfolio: '/api/portfolio',
      'site-settings': '/api/site-settings',
    };
    const endpoint = endpoints[section];
    if (!endpoint) return;

    try {
      const res = await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showMessage('✅ Deleted successfully', 'success');
        refreshSection(section);
      } else {
        showMessage('❌ Delete failed: ' + (data.error || ''), 'error');
      }
    } catch (e) {
      showMessage('❌ Delete failed', 'error');
    }
  };

  const refreshSection = (section: SectionTab) => {
    const fetchers: Record<string, () => Promise<void>> = {
      hero: fetchHero,
      projects: fetchProjects,
      logos: fetchLogos,
      services: fetchServices,
      portfolio: fetchPortfolio,
      'site-settings': fetchSiteSettings,
    };
    fetchers[section]?.();
  };

  // ====== Edit Modal ======

  const openEditModal = (section: SectionTab, item: any) => {
    setEditModal({ section, item });
    setReplaceImageUrl('');
    setShowReplaceBrowser(false);

    // Pre-populate fields based on section
    const fields: Record<string, any> = {};
    if (section === 'hero') {
      fields.category = item.category;
    } else if (section === 'projects') {
      fields.title = item.title;
      fields.category = item.category;
      fields.description = item.description;
      fields.client_name = item.client_name || '';
      fields.project_url = item.project_url || '';
    } else if (section === 'logos') {
      fields.client_name = item.client_name;
      fields.website_url = item.website_url || '';
    } else if (section === 'services') {
      fields.alt_text = item.alt_text || '';
    } else if (section === 'portfolio') {
      fields.title = item.title;
      fields.category = item.category;
      fields.client = item.client;
      fields.description = item.description;
      fields.year = item.year;
    }
    setEditFields(fields);
  };

  const handleSaveEdit = async () => {
    if (!editModal) return;
    const { section, item } = editModal;

    const endpoints: Record<string, string> = {
      hero: '/api/hero-images',
      projects: '/api/featured-projects',
      logos: '/api/client-logos',
      services: '/api/service-images',
      portfolio: '/api/portfolio',
    };
    const endpoint = endpoints[section];
    if (!endpoint) return;

    const body: any = { id: item.id, ...editFields };

    // Add replacement image URL
    if (replaceImageUrl) {
      if (section === 'hero') {
        body.url = replaceImageUrl;
      } else if (section === 'projects' || section === 'services' || section === 'portfolio') {
        body.image_url = replaceImageUrl;
      } else if (section === 'logos') {
        body.logo_url = replaceImageUrl;
      }
    }

    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        showMessage('✅ Updated successfully', 'success');
        setEditModal(null);
        refreshSection(section);
      } else {
        showMessage('❌ Update failed: ' + (data.error || ''), 'error');
      }
    } catch (e) {
      showMessage('❌ Update failed', 'error');
    }
  };

  // ====== Get image URL for any section item ======
  const getItemImageUrl = (section: SectionTab, item: any): string => {
    if (section === 'hero') return item.url || '';
    if (section === 'logos') return item.logo_url || '';
    if (section === 'site-settings') return item.value || '';
    return item.image_url || '';
  };

  // ====== Get item label ======
  const getItemLabel = (section: SectionTab, item: any): string => {
    if (section === 'hero') return `${item.category} #${item.order}`;
    if (section === 'projects') return item.title;
    if (section === 'logos') return item.client_name;
    if (section === 'services') return `${item.service_type} - Slot ${item.image_slot}`;
    if (section === 'portfolio') return item.title;
    if (section === 'site-settings') return item.type || item.key;
    return '';
  };

  // ====== Get section counts ======
  const getCounts = (): Record<SectionTab, number> => ({
    hero: heroImages.length,
    projects: projects.length,
    logos: logos.length,
    services: serviceImages.length,
    portfolio: portfolioItems.length,
    'site-settings': siteSettings.length,
  });
  const counts = getCounts();

  // ====== Get items for current tab ======
  const getCurrentItems = (): any[] => {
    switch (activeTab) {
      case 'hero': return heroImages;
      case 'projects': return projects;
      case 'logos': return logos;
      case 'services': return serviceImages;
      case 'portfolio': return portfolioItems;
      case 'site-settings': return siteSettings;
      default: return [];
    }
  };

  // ====== Category options ======
  const getCategoryOptions = (section: SectionTab): string[] => {
    if (section === 'hero') return ['Logo Design', 'Social Media', 'Artwork', 'Video', 'Branding'];
    if (section === 'projects') return ['Artwork', 'Logo Design', 'Social Media', 'Video', 'Branding', 'UI/UX Design', 'Web Development'];
    if (section === 'portfolio') return ['Artwork Designing', 'Branding & Graphics', 'Social Media', 'Videography'];
    return [];
  };

  // ====== Render ======

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">📋 Assigned Media</h1>
            <p className="text-gray-400">View, edit, replace, and delete all assigned images across every section</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/library" className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors">
              📚 Library
            </Link>
            <Link href="/admin" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            messageType === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
            messageType === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
            'bg-blue-500/20 border-blue-500/50 text-blue-400'
          }`}>
            {message}
            {messageType === 'error' && (
              <button onClick={() => setMessage('')} className="ml-4 underline text-sm">Dismiss</button>
            )}
          </div>
        )}

        {/* Section Tabs */}
        <div className="glass rounded-2xl p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            {SECTION_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  {counts[tab.id]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="glass rounded-2xl p-6">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 mt-4">Loading all assigned media...</p>
            </div>
          ) : getCurrentItems().length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg mb-4">
                No images assigned to {SECTION_TABS.find(t => t.id === activeTab)?.label} yet.
              </p>
              <Link href="/admin/assign" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg inline-block hover:scale-105 transition-transform">
                🎯 Assign Images
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">
                  {SECTION_TABS.find(t => t.id === activeTab)?.icon} {SECTION_TABS.find(t => t.id === activeTab)?.label} ({getCurrentItems().length})
                </h2>
                <div className="flex gap-3">
                  <button onClick={() => refreshSection(activeTab)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">
                    🔄 Refresh
                  </button>
                  <Link href="/admin/assign" className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-sm rounded-lg transition-colors">
                    ➕ Add New
                  </Link>
                </div>
              </div>

              {/* Items Grid */}
              <div className={`grid gap-4 ${
                activeTab === 'logos' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' :
                activeTab === 'hero' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' :
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {getCurrentItems().map((item) => {
                  const imageUrl = getItemImageUrl(activeTab, item);
                  const label = getItemLabel(activeTab, item);

                  return (
                    <div key={item.id} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors">
                      {/* Image Preview */}
                      <div className={`relative bg-black ${
                        activeTab === 'hero' ? 'aspect-[2/3]' :
                        activeTab === 'logos' ? 'aspect-square bg-white' :
                        activeTab === 'services' ? 'aspect-square' :
                        'aspect-video'
                      }`}>
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={label}
                            fill
                            className={`${activeTab === 'logos' ? 'object-contain p-3' : 'object-cover'}`}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500 text-sm">No Image</div>
                        )}

                        {/* Active/Inactive Badge */}
                        {item.active !== undefined && (
                          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold ${
                            item.active ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'
                          }`}>
                            {item.active ? 'ACTIVE' : 'HIDDEN'}
                          </div>
                        )}

                        {/* Order Badge */}
                        {item.order !== undefined && (
                          <div className="absolute top-2 right-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white">
                            #{item.order}
                          </div>
                        )}
                      </div>

                      {/* Item Info */}
                      <div className="p-3 space-y-2">
                        <p className="text-sm font-medium text-white truncate" title={label}>{label}</p>

                        {/* Section-specific info */}
                        {activeTab === 'hero' && (
                          <span className="inline-block px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">{item.category}</span>
                        )}
                        {activeTab === 'projects' && (
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">{item.category}</span>
                            <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                            {item.client_name && <p className="text-xs text-gray-500">Client: {item.client_name}</p>}
                          </div>
                        )}
                        {activeTab === 'logos' && item.website_url && (
                          <p className="text-xs text-cyan-400 truncate">🔗 {item.website_url}</p>
                        )}
                        {activeTab === 'services' && (
                          <div>
                            <span className="inline-block px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">{item.service_type}</span>
                            <p className="text-xs text-gray-500 mt-1">Slot {item.image_slot}</p>
                          </div>
                        )}
                        {activeTab === 'portfolio' && (
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">{item.category}</span>
                            <p className="text-xs text-gray-500">Client: {item.client} | Year: {item.year}</p>
                          </div>
                        )}
                        {activeTab === 'site-settings' && (
                          <span className="inline-block px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">{item.type || item.key}</span>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-1">
                          {/* Toggle Active */}
                          {item.active !== undefined && activeTab !== 'site-settings' && (
                            <button
                              onClick={() => handleToggleActive(activeTab, item.id, item.active)}
                              className={`flex-1 px-2 py-1.5 text-xs rounded transition-colors ${
                                item.active
                                  ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
                                  : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                              }`}
                            >
                              {item.active ? '👁️ Hide' : '👁️ Show'}
                            </button>
                          )}

                          {/* Edit/Replace */}
                          {activeTab !== 'site-settings' && (
                            <button
                              onClick={() => openEditModal(activeTab, item)}
                              className="flex-1 px-2 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs rounded transition-colors"
                            >
                              ✏️ Edit
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(activeTab, item.id, label)}
                            className="flex-1 px-2 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs rounded transition-colors"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Summary Bar */}
        <div className="mt-8 glass rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">📊 Assignment Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SECTION_TABS.map((tab) => (
              <div key={tab.id} className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-2xl mb-1">{tab.icon}</div>
                <div className="text-2xl font-bold text-white">{counts[tab.id]}</div>
                <p className="text-gray-400 text-xs">{tab.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Edit/Replace Modal */}
        {editModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setEditModal(null)}>
            <div className="bg-[#1a1a1a] rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Edit {SECTION_TABS.find(t => t.id === editModal.section)?.label?.replace(/s$/, '')}
                </h2>
                <button onClick={() => setEditModal(null)} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg">
                  ✕ Close
                </button>
              </div>

              {/* Current Image Preview */}
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-2">Current Image:</p>
                <div className="flex gap-4 items-start">
                  <div className={`relative bg-black rounded-lg overflow-hidden flex-shrink-0 ${
                    editModal.section === 'hero' ? 'w-24 aspect-[2/3]' :
                    editModal.section === 'logos' ? 'w-24 h-24 bg-white' :
                    'w-40 aspect-video'
                  }`}>
                    <Image
                      src={replaceImageUrl || getItemImageUrl(editModal.section, editModal.item)}
                      alt="Preview"
                      fill
                      className={editModal.section === 'logos' ? 'object-contain p-2' : 'object-cover'}
                    />
                  </div>
                  {replaceImageUrl && (
                    <p className="text-green-400 text-xs mt-2">✅ New image selected (will replace current)</p>
                  )}
                </div>
              </div>

              {/* Replace Image Button */}
              <div className="mb-6">
                <button
                  onClick={() => { setShowReplaceBrowser(!showReplaceBrowser); if (!showReplaceBrowser) fetchLibrary(); }}
                  className="w-full px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg transition-colors font-medium"
                >
                  🔄 {showReplaceBrowser ? 'Hide Library' : 'Replace Image'} - Select from Library
                </button>

                {showReplaceBrowser && (
                  <div className="mt-4 grid grid-cols-4 md:grid-cols-6 gap-3 max-h-64 overflow-y-auto p-3 bg-black/30 rounded-lg">
                    {libraryImages.map((img) => (
                      <div key={img.filename}
                        onClick={() => { setReplaceImageUrl(img.url); setShowReplaceBrowser(false); }}
                        className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all hover:scale-105 ${
                          replaceImageUrl === img.url ? 'border-orange-500 shadow-lg shadow-orange-500/50' : 'border-white/10 hover:border-white/30'
                        }`}>
                        <div className="aspect-square relative bg-black">
                          <Image src={img.url} alt={img.filename} fill className="object-cover" />
                        </div>
                        <p className="text-xs text-gray-400 p-1 truncate bg-black/50">{img.filename}</p>
                      </div>
                    ))}
                  </div>
                )}

                {replaceImageUrl && (
                  <button onClick={() => setReplaceImageUrl('')}
                    className="mt-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-400 text-xs rounded transition-colors">
                    ✕ Cancel replacement
                  </button>
                )}
              </div>

              {/* Edit Fields - Section Specific */}
              <div className="space-y-4 mb-6">
                {editModal.section === 'hero' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                    <select value={editFields.category || ''} onChange={(e) => setEditFields({ ...editFields, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ colorScheme: 'dark' }}>
                      {getCategoryOptions('hero').map(opt => <option key={opt} value={opt} className="bg-gray-900">{opt}</option>)}
                    </select>
                  </div>
                )}

                {editModal.section === 'projects' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                      <input type="text" value={editFields.title || ''} onChange={(e) => setEditFields({ ...editFields, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                      <select value={editFields.category || ''} onChange={(e) => setEditFields({ ...editFields, category: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ colorScheme: 'dark' }}>
                        {getCategoryOptions('projects').map(opt => <option key={opt} value={opt} className="bg-gray-900">{opt}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                      <textarea value={editFields.description || ''} onChange={(e) => setEditFields({ ...editFields, description: e.target.value })} rows={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Client Name</label>
                        <input type="text" value={editFields.client_name || ''} onChange={(e) => setEditFields({ ...editFields, client_name: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Project URL</label>
                        <input type="url" value={editFields.project_url || ''} onChange={(e) => setEditFields({ ...editFields, project_url: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                      </div>
                    </div>
                  </>
                )}

                {editModal.section === 'logos' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Client Name</label>
                      <input type="text" value={editFields.client_name || ''} onChange={(e) => setEditFields({ ...editFields, client_name: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
                      <input type="url" value={editFields.website_url || ''} onChange={(e) => setEditFields({ ...editFields, website_url: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                  </>
                )}

                {editModal.section === 'services' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Alt Text</label>
                    <input type="text" value={editFields.alt_text || ''} onChange={(e) => setEditFields({ ...editFields, alt_text: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                )}

                {editModal.section === 'portfolio' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                      <input type="text" value={editFields.title || ''} onChange={(e) => setEditFields({ ...editFields, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                      <select value={editFields.category || ''} onChange={(e) => setEditFields({ ...editFields, category: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ colorScheme: 'dark' }}>
                        {getCategoryOptions('portfolio').map(opt => <option key={opt} value={opt} className="bg-gray-900">{opt}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                      <textarea value={editFields.description || ''} onChange={(e) => setEditFields({ ...editFields, description: e.target.value })} rows={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Client</label>
                        <input type="text" value={editFields.client || ''} onChange={(e) => setEditFields({ ...editFields, client: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                        <input type="text" value={editFields.year || ''} onChange={(e) => setEditFields({ ...editFields, year: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Save */}
              <div className="flex gap-3">
                <button onClick={handleSaveEdit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:scale-105 transition-all">
                  💾 Save Changes
                </button>
                <button onClick={() => setEditModal(null)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
