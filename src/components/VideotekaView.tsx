import React, { useState, useEffect, useMemo } from 'react';
import { 
  Tv, 
  Search, 
  Filter, 
  Tag, 
  Sparkles, 
  Eye, 
  Heart, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  ExternalLink, 
  Play, 
  Plus, 
  Clock, 
  Globe, 
  Layers, 
  User, 
  Building2, 
  X, 
  CheckCircle2, 
  ArrowRight,
  ThumbsUp,
  Video,
  ListFilter
} from 'lucide-react';
import { VideoItem, Partner } from '../types';
import { 
  getStoredVideos, 
  saveStoredVideos, 
  getStoredVideoCategories,
  DEFAULT_VIDEO_TAGS 
} from '../data/videoLibraryData';
import SmartVideoEmbed from './SmartVideoEmbed';
import { parseVideoUrl } from '../lib/videoEmbed';

interface VideotekaViewProps {
  setActiveTab: (tab: string) => void;
  currentUserRole?: string;
  partners?: Partner[];
}

export default function VideotekaView({ setActiveTab, currentUserRole, partners = [] }: VideotekaViewProps) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'featured'>('newest');
  
  // Active detail modal video
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  
  // Bookmarked video IDs locally cached
  const [savedUrls, setSavedUrls] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load videos on mount & listen to storage events
  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('videoteka_updated', handleUpdate);
    window.addEventListener('videoteka_categories_updated', handleUpdate);
    
    return () => {
      window.removeEventListener('videoteka_updated', handleUpdate);
      window.removeEventListener('videoteka_categories_updated', handleUpdate);
    };
  }, []);

  const loadData = () => {
    const loadedVideos = getStoredVideos().filter(v => v.status === 'Approved');
    setVideos(loadedVideos);
    setCategories(getStoredVideoCategories());

    // Load saved videos
    try {
      const saved = JSON.parse(localStorage.getItem('synthesis_saved_videos') || '[]');
      setSavedUrls(saved.map((item: any) => item.url));
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Save video to user bookmarks
  const toggleSaveVideo = (video: VideoItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const savedList = JSON.parse(localStorage.getItem('synthesis_saved_videos') || '[]');
      const exists = savedList.some((v: any) => v.url === video.shareUrl);
      
      let updated;
      if (exists) {
        updated = savedList.filter((v: any) => v.url !== video.shareUrl);
      } else {
        const newSave = {
          id: video.id,
          url: video.shareUrl,
          title: video.title,
          author: video.author,
          platform: video.platform,
          embedUrl: video.embedUrl || video.shareUrl,
          tags: video.tags,
          savedAt: new Date().toISOString()
        };
        updated = [...savedList, newSave];
      }
      
      localStorage.setItem('synthesis_saved_videos', JSON.stringify(updated));
      setSavedUrls(updated.map((item: any) => item.url));
      window.dispatchEvent(new Event('saved_videos_updated'));
    } catch (err) {
      console.error('Error saving video bookmark:', err);
    }
  };

  // Like video
  const handleLike = (videoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = videos.map(v => {
      if (v.id === videoId) {
        return { ...v, likes: v.likes + 1 };
      }
      return v;
    });
    setVideos(updated);
    saveStoredVideos(updated);
    if (activeVideo && activeVideo.id === videoId) {
      setActiveVideo({ ...activeVideo, likes: activeVideo.likes + 1 });
    }
  };

  // Increment view count on video open
  const openVideoDetail = (video: VideoItem) => {
    const updated = videos.map(v => {
      if (v.id === video.id) {
        return { ...v, views: v.views + 1 };
      }
      return v;
    });
    setVideos(updated);
    saveStoredVideos(updated);
    setActiveVideo({ ...video, views: video.views + 1 });
  };

  // Share video link
  const handleShareLink = (url: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Compute filtered & sorted videos
  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = video.title.toLowerCase().includes(q);
        const matchesDesc = video.description.toLowerCase().includes(q);
        const matchesAuthor = video.author.toLowerCase().includes(q);
        const matchesSource = video.source.toLowerCase().includes(q);
        const matchesTags = video.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesAuthor && !matchesSource && !matchesTags) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'all' && video.category !== selectedCategory) {
        return false;
      }

      // Tag
      if (selectedTag !== 'all' && !video.tags.includes(selectedTag)) {
        return false;
      }

      // Platform
      if (selectedPlatform !== 'all' && video.platform !== selectedPlatform) {
        return false;
      }

      // Partner
      if (selectedPartnerId !== 'all' && video.partnerId !== selectedPartnerId) {
        return false;
      }

      // Language
      if (selectedLanguage !== 'all' && video.language !== selectedLanguage) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.views + b.likes * 2) - (a.views + a.likes * 2);
      }
      if (sortBy === 'featured') {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
      }
      // default newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [videos, searchQuery, selectedCategory, selectedTag, selectedPlatform, selectedPartnerId, selectedLanguage, sortBy]);

  // Compute related videos for active modal video
  const relatedVideos = useMemo(() => {
    if (!activeVideo) return [];
    return videos
      .filter(v => v.id !== activeVideo.id)
      .map(v => {
        let score = 0;
        if (v.category === activeVideo.category) score += 3;
        if (v.partnerId && v.partnerId === activeVideo.partnerId) score += 3;
        const sharedTags = v.tags.filter(t => activeVideo.tags.includes(t));
        score += sharedTags.length * 2;
        return { video: v, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.video);
  }, [activeVideo, videos]);

  const featuredCount = useMemo(() => videos.filter(v => v.isFeatured).length, [videos]);
  const totalViews = useMemo(() => videos.reduce((acc, v) => acc + v.views, 0), [videos]);

  return (
    <div className="space-y-8 animate-fadeIn" id="videoteka-root">
      {/* Hero / Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 text-white p-6 sm:p-10 overflow-hidden shadow-xl border border-slate-800">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-mono font-bold tracking-wide">
            <Tv className="w-3.5 h-3.5 text-teal-400" />
            <span>Univerzální Videotéka v4.0</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight text-white">
            Vzdělávací a poradenská videotéka rodinného práva
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
            Prohlížejte odborná videa, přednášky psychologů, rozbory judikátů Ústavního soudu, návody k OSPOD a rozhovory s advokáty. Všechna videa jsou konsolidována z ověřených zdrojů a partnerů.
          </p>

          {/* Key metrics bar */}
          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-mono text-slate-300 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-teal-400" />
              <span>Celkem videí: <strong className="text-white">{videos.length}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Doporučená: <strong className="text-white">{featuredCount}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Zhlédnutí: <strong className="text-white">{totalViews.toLocaleString()}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Search Control Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Search & Main controls row */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Hledat podle názvu, autora, tematiky nebo štítku..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <ListFilter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-600 font-sans hidden sm:inline">Řazení:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
            >
              <option value="newest">Nejnovější videa</option>
              <option value="popular">Nejoblíbenější (Zhlédnutí)</option>
              <option value="featured">Doporučené redakcí</option>
            </select>
          </div>
        </div>

        {/* Secondary filters row: Platform, Partner, Language */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          {/* Platform Filter */}
          <div>
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Platforma videa
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:border-teal-500"
            >
              <option value="all">Všechny platformy (YouTube, FB, Vimeo...)</option>
              <option value="youtube">YouTube</option>
              <option value="facebook">Facebook Video</option>
              <option value="vimeo">Vimeo</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram Reels</option>
              <option value="x">X (Twitter)</option>
            </select>
          </div>

          {/* Partner Filter */}
          <div>
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Partner / Odborník
            </label>
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:border-teal-500"
            >
              <option value="all">Všichni partneři a zdroje</option>
              {partners.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Jazyk
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:border-teal-500"
            >
              <option value="all">Všechny jazyky (CZ / SK / EN)</option>
              <option value="CS">Čeština (CS)</option>
              <option value="SK">Slovenština (SK)</option>
              <option value="EN">Angličtina (EN)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Kategorie videí:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              Všechny kategorie
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tags Filter Pills */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Štítky (Tags):
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                selectedTag === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              Všechny štítky
            </button>
            {DEFAULT_VIDEO_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? 'all' : tag)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  selectedTag === tag
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                <Tag className="w-2.5 h-2.5 opacity-60" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-500">
        <span>Nalezeno videí: <strong className="text-slate-900">{filteredVideos.length}</strong></span>
        {(selectedCategory !== 'all' || selectedTag !== 'all' || selectedPlatform !== 'all' || selectedPartnerId !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTag('all');
              setSelectedPlatform('all');
              setSelectedPartnerId('all');
              setSelectedLanguage('all');
              setSearchQuery('');
            }}
            className="text-teal-700 hover:underline font-semibold cursor-pointer"
          >
            Vynulovat filtry
          </button>
        )}
      </div>

      {/* Videos Grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const isBookmarked = savedUrls.includes(video.shareUrl);
            return (
              <div
                key={video.id}
                onClick={() => openVideoDetail(video)}
                className="group bg-white rounded-2xl border border-slate-200/80 hover:border-teal-400 hover:shadow-lg transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                {/* Embed Video Preview Header */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <SmartVideoEmbed
                    url={video.shareUrl}
                    title={video.title}
                    author={video.author}
                    tags={video.tags}
                    showDetails={false}
                  />
                  
                  {/* Featured Badge Overlay */}
                  {video.isFeatured && (
                    <div className="absolute top-3 left-3 z-10 bg-amber-500 text-slate-950 font-mono font-extrabold text-[9px] px-2 py-0.5 rounded-md shadow-md uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-current" />
                      Doporučené
                    </div>
                  )}

                  {/* Language Badge */}
                  <div className="absolute top-3 right-3 z-10 bg-slate-900/80 backdrop-blur-xs text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-md border border-slate-700">
                    {video.language}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Category & Partner Link */}
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono">
                      <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                        {video.category}
                      </span>
                      {video.partnerName && (
                        <span className="text-slate-500 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60 truncate max-w-[150px]">
                          <Building2 className="w-3 h-3 text-indigo-500 shrink-0" />
                          <span className="truncate">{video.partnerName}</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-slate-900 font-display group-hover:text-teal-700 transition-colors line-clamp-2">
                      {video.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 font-sans line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  {/* Metadata & Tags */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-sans">
                      <span className="flex items-center gap-1 text-slate-600 font-medium truncate">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{video.author}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {video.source}
                      </span>
                    </div>

                    {/* Tags List */}
                    <div className="flex flex-wrap gap-1">
                      {video.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[9px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                      {video.tags.length > 3 && (
                        <span className="text-[9px] font-medium text-slate-400">
                          +{video.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Bar with Interactive Stats */}
                <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      {video.views}
                    </span>
                    <button
                      onClick={(e) => handleLike(video.id, e)}
                      className="flex items-center gap-1 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Líbí se mi video"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-50" />
                      {video.likes}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => toggleSaveVideo(video, e)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isBookmarked 
                          ? 'bg-teal-100 text-teal-700 border-teal-300' 
                          : 'bg-white text-slate-400 border-slate-200 hover:text-slate-600'
                      }`}
                      title={isBookmarked ? "Uloženo v mých videích" : "Uložit video do mých záložek"}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={(e) => handleShareLink(video.shareUrl, video.id, e)}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                      title="Kopírovat odkaz"
                    >
                      {copiedId === video.id ? (
                        <span className="text-[9px] font-bold text-emerald-600">OK</span>
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
          <Tv className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 font-display">
            Nenalezena žádná odpovídající videa
          </h3>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            Zkus zkrátit vyhledávací dotaz nebo vybrat jinou kombinaci kategorií a štítků.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedTag('all');
              setSelectedPlatform('all');
              setSelectedPartnerId('all');
              setSelectedLanguage('all');
            }}
            className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-teal-700 transition-colors cursor-pointer"
          >
            Zobrazit všechna videa
          </button>
        </div>
      )}

      {/* FULL VIDEO DETAIL MODAL & RELATED VIDEOS */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-teal-400 uppercase bg-teal-950/80 px-2.5 py-1 rounded-md border border-teal-800">
                  {activeVideo.category}
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  {activeVideo.platform.toUpperCase()} &bull; {activeVideo.language}
                </span>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">
              {/* Responsive Embedded Player */}
              <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                <SmartVideoEmbed
                  url={activeVideo.shareUrl}
                  title={activeVideo.title}
                  author={activeVideo.author}
                  tags={activeVideo.tags}
                  showDetails={false}
                />
              </div>

              {/* Title & Actions Bar */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 leading-snug">
                    {activeVideo.title}
                  </h2>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleLike(activeVideo.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      <span>{activeVideo.likes} Líbí se</span>
                    </button>
                    <button
                      onClick={() => toggleSaveVideo(activeVideo)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      {savedUrls.includes(activeVideo.shareUrl) ? (
                        <>
                          <BookmarkCheck className="w-4 h-4 text-teal-600" />
                          <span>Uloženo v Moje Pracovna</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4 text-teal-600" />
                          <span>Uložit video</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Metadata details strip */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-sans pt-1 border-b border-slate-100 pb-3">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <User className="w-4 h-4 text-slate-400" />
                    Autor: {activeVideo.author}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Globe className="w-4 h-4 text-slate-400" />
                    Zdroj: {activeVideo.source}
                  </span>
                  {activeVideo.partnerName && (
                    <span className="flex items-center gap-1.5 text-indigo-700 font-medium bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      Partner: {activeVideo.partnerName}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-slate-400 ml-auto font-mono text-[11px]">
                    <Eye className="w-3.5 h-3.5" />
                    {activeVideo.views} zhlédnutí
                  </span>
                </div>

                {/* Description */}
                <div className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed space-y-2">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Popis videa a právní kontext:
                  </h4>
                  <p className="whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                    {activeVideo.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-xs font-mono font-bold text-slate-400 mr-1">Štítky:</span>
                  {activeVideo.tags.map((t, idx) => (
                    <span key={idx} className="text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200/60 px-2.5 py-1 rounded-lg">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* BONUS: Related Videos Recommendation System */}
              {relatedVideos.length > 0 && (
                <div className="pt-6 border-t border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      Související doporučená videa podle témat a štítků
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">Automatické doporučení</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {relatedVideos.map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => openVideoDetail(rel)}
                        className="group bg-slate-50 p-3 rounded-xl border border-slate-200/80 hover:border-teal-400 hover:bg-white transition-all cursor-pointer flex gap-3 items-center"
                      >
                        <div className="w-20 h-14 bg-slate-900 rounded-lg shrink-0 overflow-hidden relative flex items-center justify-center text-teal-400">
                          <Play className="w-5 h-5 fill-current" />
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <span className="text-[9px] font-mono font-bold text-teal-700 uppercase">
                            {rel.category}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 font-display group-hover:text-teal-700 transition-colors line-clamp-1">
                            {rel.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 truncate">
                            {rel.author}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 font-sans">
              <a
                href={activeVideo.shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-teal-700 font-bold hover:underline cursor-pointer"
              >
                Otevřít zdrojový odkaz <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setActiveVideo(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Zavřít
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
