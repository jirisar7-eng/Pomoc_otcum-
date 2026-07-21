import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Search, 
  Tag, 
  X, 
  ExternalLink, 
  Building2, 
  Save, 
  RefreshCw, 
  Globe, 
  User, 
  ListPlus,
  Eye,
  Heart
} from 'lucide-react';
import { VideoItem, VideoStatus, Partner } from '../types';
import { 
  getStoredVideos, 
  saveStoredVideos, 
  getStoredVideoCategories, 
  saveStoredVideoCategories,
  DEFAULT_VIDEO_TAGS,
  DEFAULT_VIDEO_SOURCES
} from '../data/videoLibraryData';
import { parseVideoUrl } from '../lib/videoEmbed';
import SmartVideoEmbed from './SmartVideoEmbed';

interface AdminVideotekaProps {
  partners?: Partner[];
}

export default function AdminVideoteka({ partners = [] }: AdminVideotekaProps) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Admin Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    shareUrl: string;
    author: string;
    source: string;
    partnerId: string;
    category: string;
    tagsInput: string;
    status: VideoStatus;
    isFeatured: boolean;
    language: 'CS' | 'SK' | 'EN';
  }>({
    title: '',
    description: '',
    shareUrl: '',
    author: '',
    source: DEFAULT_VIDEO_SOURCES[0],
    partnerId: '',
    category: '',
    tagsInput: '',
    status: 'Approved',
    isFeatured: false,
    language: 'CS'
  });

  const [urlPreview, setUrlPreview] = useState<string>('');

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = () => {
    const loaded = getStoredVideos();
    setVideos(loaded);
    const cats = getStoredVideoCategories();
    setCategories(cats);
    if (cats.length > 0 && !formData.category) {
      setFormData(prev => ({ ...prev, category: cats[0] }));
    }
  };

  const openAddModal = () => {
    setEditingVideo(null);
    setFormData({
      title: '',
      description: '',
      shareUrl: '',
      author: '',
      source: DEFAULT_VIDEO_SOURCES[0],
      partnerId: '',
      category: categories[0] || 'Střídavá péče',
      tagsInput: 'Střídavá péče, OSPOD',
      status: 'Approved',
      isFeatured: false,
      language: 'CS'
    });
    setUrlPreview('');
    setIsModalOpen(true);
  };

  const openEditModal = (video: VideoItem) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      shareUrl: video.shareUrl,
      author: video.author,
      source: video.source,
      partnerId: video.partnerId || '',
      category: video.category,
      tagsInput: video.tags.join(', '),
      status: video.status,
      isFeatured: video.isFeatured,
      language: video.language
    });
    setUrlPreview(video.shareUrl);
    setIsModalOpen(true);
  };

  // Auto detect platform and metadata on URL paste
  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, shareUrl: url }));
    setUrlPreview(url);
    if (url.trim()) {
      const parsed = parseVideoUrl(url);
      if (parsed.platform !== 'unknown' && !formData.title) {
        // Provide autofill title helper if empty
        setFormData(prev => ({
          ...prev,
          title: prev.title || `Odborné video: ${parsed.platform.toUpperCase()}`
        }));
      }
    }
  };

  // Save / Update video
  const handleSubmitVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.shareUrl.trim()) {
      alert('Vyplňte prosím název videa a sdílecí odkaz.');
      return;
    }

    const parsed = parseVideoUrl(formData.shareUrl, formData.title, formData.author);
    const tags = formData.tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const selectedPartner = partners.find(p => p.id === formData.partnerId);

    if (editingVideo) {
      // Update
      const updated = videos.map(v => {
        if (v.id === editingVideo.id) {
          return {
            ...v,
            title: formData.title.trim(),
            description: formData.description.trim(),
            shareUrl: formData.shareUrl.trim(),
            platform: parsed.platform,
            embedUrl: parsed.embedUrl,
            author: formData.author.trim() || 'Neznámý autor',
            source: formData.source,
            partnerId: formData.partnerId || undefined,
            partnerName: selectedPartner?.name,
            category: formData.category,
            tags,
            status: formData.status,
            isFeatured: formData.isFeatured,
            language: formData.language,
            updatedAt: new Date().toISOString()
          };
        }
        return v;
      });
      setVideos(updated);
      saveStoredVideos(updated);
    } else {
      // Create
      const newVideo: VideoItem = {
        id: 'vid-' + Date.now(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        shareUrl: formData.shareUrl.trim(),
        platform: parsed.platform,
        embedUrl: parsed.embedUrl,
        author: formData.author.trim() || 'Neznámý autor',
        source: formData.source,
        partnerId: formData.partnerId || undefined,
        partnerName: selectedPartner?.name,
        category: formData.category,
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Administrátor',
        status: formData.status,
        isFeatured: formData.isFeatured,
        views: 1,
        likes: 0,
        language: formData.language
      };
      const updated = [newVideo, ...videos];
      setVideos(updated);
      saveStoredVideos(updated);
    }

    setIsModalOpen(false);
  };

  // Quick Status Toggle
  const toggleStatus = (id: string, currentStatus: VideoStatus) => {
    let nextStatus: VideoStatus = 'Approved';
    if (currentStatus === 'Approved') nextStatus = 'Draft';
    else if (currentStatus === 'Draft') nextStatus = 'Archived';
    else nextStatus = 'Approved';

    const updated = videos.map(v => v.id === id ? { ...v, status: nextStatus, updatedAt: new Date().toISOString() } : v);
    setVideos(updated);
    saveStoredVideos(updated);
  };

  // Quick Featured Toggle
  const toggleFeatured = (id: string) => {
    const updated = videos.map(v => v.id === id ? { ...v, isFeatured: !v.isFeatured, updatedAt: new Date().toISOString() } : v);
    setVideos(updated);
    saveStoredVideos(updated);
  };

  // Delete video
  const handleDelete = (id: string) => {
    if (confirm('Opravdu si přejete smazat toto video z databáze videotéky?')) {
      const updated = videos.filter(v => v.id !== id);
      setVideos(updated);
      saveStoredVideos(updated);
    }
  };

  // Category Manager
  const handleAddCategory = () => {
    if (!newCategoryInput.trim()) return;
    if (categories.includes(newCategoryInput.trim())) {
      alert('Tato kategorie již existuje.');
      return;
    }
    const updated = [...categories, newCategoryInput.trim()];
    setCategories(updated);
    saveStoredVideoCategories(updated);
    setNewCategoryInput('');
  };

  const handleRemoveCategory = (catToRemove: string) => {
    if (categories.length <= 1) {
      alert('Musí zůstat alespoň jedna kategorie.');
      return;
    }
    const updated = categories.filter(c => c !== catToRemove);
    setCategories(updated);
    saveStoredVideoCategories(updated);
  };

  // Filtered videos for admin table
  const adminFilteredVideos = videos.filter(v => {
    if (filterStatus !== 'all' && v.status !== filterStatus) return false;
    if (filterCategory !== 'all' && v.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return v.title.toLowerCase().includes(q) || v.author.toLowerCase().includes(q) || v.source.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Admin Strip */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200/60 text-xs font-mono font-bold">
            <Tv className="w-3.5 h-3.5 text-teal-600" />
            Správa Videotéky v4.0
          </div>
          <h2 className="text-xl font-bold font-display text-slate-900 mt-1">
            Administrace a správa video-obsahu
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Přidávejte nová videa z YouTube, Vimeo, Facebooku, TikTok, Instagramu nebo X sdílecím odkazem.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowCategoryManager(!showCategoryManager)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ListPlus className="w-4 h-4 text-slate-500" />
            {showCategoryManager ? 'Skrýt kategorie' : 'Správa kategorií'}
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Přidat video odkazem
          </button>
        </div>
      </div>

      {/* Category Manager Drawer / Panel */}
      {showCategoryManager && (
        <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 border border-slate-800 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold font-display text-teal-400 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Správce tematik a kategorií videí
            </h3>
            <button onClick={() => setShowCategoryManager(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              placeholder="Název nové kategorie..."
              className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
            />
            <button
              onClick={handleAddCategory}
              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Přidat kategorii
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-3 py-1 rounded-xl text-xs font-medium text-slate-200"
              >
                <span>{cat}</span>
                <button
                  onClick={() => handleRemoveCategory(cat)}
                  className="text-slate-400 hover:text-rose-400 transition-colors ml-1"
                  title="Odstranit kategorii"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Admin Filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrovat administraci videí..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
          >
            <option value="all">Všechny stavy (Schváleno/Koncept/Archiv)</option>
            <option value="Approved">Schváleno</option>
            <option value="Draft">Koncept</option>
            <option value="Archived">Archiv</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
          >
            <option value="all">Všechny kategorie</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Videos Admin Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Video & Název</th>
                <th className="py-3 px-4">Platforma</th>
                <th className="py-3 px-4">Kategorie</th>
                <th className="py-3 px-4">Autor & Partner</th>
                <th className="py-3 px-4 text-center">Stav</th>
                <th className="py-3 px-4 text-center">Doporučené</th>
                <th className="py-3 px-4 text-center">Statistiky</th>
                <th className="py-3 px-4 text-right">Akce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-sans">
              {adminFilteredVideos.length > 0 ? (
                adminFilteredVideos.map((video) => (
                  <tr key={video.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Video Title */}
                    <td className="py-3 px-4">
                      <div className="space-y-1 max-w-xs">
                        <strong className="text-slate-900 font-display line-clamp-1 block">
                          {video.title}
                        </strong>
                        <span className="text-[10px] text-slate-400 font-mono block truncate">
                          {video.shareUrl}
                        </span>
                      </div>
                    </td>

                    {/* Platform */}
                    <td className="py-3 px-4 font-mono font-bold text-[10px]">
                      <span className="uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200/60">
                        {video.platform}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded text-[11px] border border-teal-100">
                        {video.category}
                      </span>
                    </td>

                    {/* Author & Partner */}
                    <td className="py-3 px-4">
                      <div className="text-[11px] text-slate-700 font-medium">
                        <div>{video.author}</div>
                        {video.partnerName && (
                          <div className="text-[10px] text-indigo-600 font-mono flex items-center gap-1">
                            <Building2 className="w-2.5 h-2.5" />
                            {video.partnerName}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status Toggle Button */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleStatus(video.id, video.status)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold cursor-pointer transition-all ${
                          video.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : video.status === 'Draft'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                        title="Kliknutím přepnete stav videa"
                      >
                        {video.status === 'Approved' ? 'Schváleno' : video.status === 'Draft' ? 'Koncept' : 'Archiv'}
                      </button>
                    </td>

                    {/* Is Featured */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleFeatured(video.id)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          video.isFeatured
                            ? 'bg-amber-100 text-amber-700 border-amber-300'
                            : 'bg-slate-50 text-slate-300 border-slate-200 hover:text-slate-500'
                        }`}
                        title="Přepnout doporučení na hlavní straně videotéky"
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </td>

                    {/* Stats */}
                    <td className="py-3 px-4 text-center font-mono text-[10px] text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <span className="flex items-center gap-0.5">
                          <Eye className="w-3 h-3 text-slate-400" />
                          {video.views}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Heart className="w-3 h-3 text-rose-500" />
                          {video.likes}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(video)}
                        className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                        title="Upravit metadata videa"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Smazat video"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-sans">
                    Žádná videa neodpovídají zadaným kritériím.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT VIDEO MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <h3 className="text-base font-bold font-display flex items-center gap-2 text-teal-400">
                <Tv className="w-4 h-4" />
                {editingVideo ? 'Upravit video metadatá' : 'Přidat nové video pomocí sdílecího odkazu'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmitVideo} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Share URL Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 font-sans block">
                  Sdílecí odkaz videa (YouTube, FB, Vimeo, TikTok, Instagram, X) *
                </label>
                <input
                  type="url"
                  required
                  value={formData.shareUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <p className="text-[10px] text-slate-400 font-sans">
                  Vložte standardní sdílecí link. Platforma se automaticky detekuje a vytvoří přehrávač.
                </p>
              </div>

              {/* Title Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 font-sans block">
                  Název videa *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Př. Střídavá péče a nálezy Ústavního soudu v praxi"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 font-sans block">
                  Krátký popis & Právní kontext
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Popište, jaké poznatky video přináší a pro koho je určeno..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Grid 2 col: Author & Source */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 font-sans block">
                    Autor videa
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Př. JUDr. Martin Dvořák"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 font-sans block">
                    Zdroj videa
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                  >
                    {DEFAULT_VIDEO_SOURCES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid 2 col: Category & Partner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 font-sans block">
                    Kategorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 font-sans block">
                    Propojený partner z databáze
                  </label>
                  <select
                    value={formData.partnerId}
                    onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                  >
                    <option value="">-- Bez partnera (pouze textový zdroj) --</option>
                    {partners.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 font-sans block">
                  Tematické štítky (oddělené čárkou)
                </label>
                <input
                  type="text"
                  value={formData.tagsInput}
                  onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                  placeholder="OSPOD, Soud, Ústavní soud, Psycholog, Mediace..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              {/* Status, Language & Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Stav schválení
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  >
                    <option value="Approved">Schváleno (Veřejné)</option>
                    <option value="Draft">Koncept</option>
                    <option value="Archived">Archivováno</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Jazyk videa
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e: any) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  >
                    <option value="CS">Čeština (CS)</option>
                    <option value="SK">Slovenština (SK)</option>
                    <option value="EN">Angličtina (EN)</option>
                  </select>
                </div>

                <div className="flex items-center pt-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span>Označit jako Doporučené video</span>
                  </label>
                </div>
              </div>

              {/* Embedded Player Live Preview */}
              {urlPreview && (
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Živý náhled přehrávače:
                  </span>
                  <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden max-w-sm mx-auto shadow-md">
                    <SmartVideoEmbed
                      url={urlPreview}
                      title={formData.title || 'Náhled videa'}
                      showDetails={false}
                    />
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Zrušit
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 text-white font-bold text-xs rounded-xl hover:bg-teal-800 transition-colors shadow-xs cursor-pointer"
                >
                  {editingVideo ? 'Uložit změny' : 'Uložit video do databáze'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
